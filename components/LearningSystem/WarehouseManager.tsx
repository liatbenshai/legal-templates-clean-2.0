'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Users, 
  Clock,
  Tag,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { WarehouseSection, UserLearningProfile } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';

interface WarehouseManagerProps {
  userId: string;
  onSectionSelect: (section: WarehouseSection) => void;
}

export default function WarehouseManager({ userId, onSectionSelect }: WarehouseManagerProps) {
  const [sections, setSections] = useState<WarehouseSection[]>([]);
  const [userProfile, setUserProfile] = useState<UserLearningProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('custom'); // ברירת מחדל: מותאם אישית
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  const [showAddForm, setShowAddForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    category: 'custom',
    tags: '',
    isPublic: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadSections();
      loadUserProfile();
    }
  }, [userId, mounted]);

  const loadSections = () => {
    const profile = learningEngine.getUserProfile(userId);
    if (profile) {
      setSections(profile.customSections);
    }
  };

  const loadUserProfile = () => {
    const profile = learningEngine.getUserProfile(userId);
    setUserProfile(profile || null);
  };

  const handleAddSection = () => {
    if (!mounted) return;

    const section: WarehouseSection = {
      id: Date.now().toString(),
      title: newSection.title,
      content: newSection.content,
      category: newSection.category,
      tags: newSection.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      usageCount: 0,
      averageRating: 5,
      isPublic: newSection.isPublic,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    // עדכון פרופיל המשתמש
    const profile = learningEngine.getUserProfile(userId);
    if (profile) {
      profile.customSections.push(section);
      setSections([...profile.customSections]);
    }

    // איפוס הטופס
    setNewSection({
      title: '',
      content: '',
      category: 'custom',
      tags: '',
      isPublic: false
    });
    setShowAddForm(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!mounted) return;
    
    if (confirm('האם למחוק את הסעיף?')) {
      const profile = learningEngine.getUserProfile(userId);
      if (profile) {
        profile.customSections = profile.customSections.filter(s => s.id !== sectionId);
        setSections(profile.customSections);
      }
    }
  };

  const handleUseSection = (section: WarehouseSection) => {
    if (!mounted) return;
    
    // עדכון מועד שימוש אחרון
    const profile = learningEngine.getUserProfile(userId);
    if (profile) {
      const sectionIndex = profile.customSections.findIndex(s => s.id === section.id);
      if (sectionIndex !== -1) {
        profile.customSections[sectionIndex].lastUsed = new Date().toISOString();
        profile.customSections[sectionIndex].usageCount++;
        setSections([...profile.customSections]);
      }
    }
    
    onSectionSelect(section);
  };

  // סינון ומיון
  const filteredSections = sections
    .filter(section => {
      const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           section.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'recent':
        default:
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      }
    });

  const categories = [...new Set(sections.map(s => s.category)), 'all'].filter(Boolean);
  const statistics = mounted ? learningEngine.getStatistics(userId) : {
    totalEdits: 0,
    uniqueUsers: 0,
    averageEditLength: 0,
    mostEditedCategories: [],
    insights: 0
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* כותרת */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            מחסן הסעיפים שלי
          </h2>
          <p className="text-gray-600 mt-1">
            {sections.length} סעיפים • {statistics.totalEdits} עריכות
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          סעיף חדש
        </button>
      </div>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">סעיפים אישיים</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{sections.length}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">עריכות כולל</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{statistics.totalEdits}</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">תובנות AI</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{statistics.insights}</div>
        </div>
      </div>

      {/* סינון וחיפוש */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="חיפוש בסעיפים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? '🌐 הכל' : category}
            </option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="recent">לפי שימוש אחרון</option>
          <option value="popular">לפי פופולריות</option>
          <option value="rating">לפי דירוג</option>
        </select>
      </div>

      {/* טופס הוספת סעיף */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">הוספת סעיף חדש</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסעיף"
              value={newSection.title}
              onChange={(e) => setNewSection({...newSection, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
            
            <textarea
              placeholder="תוכן הסעיף"
              value={newSection.content}
              onChange={(e) => setNewSection({...newSection, content: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              dir="rtl"
            />
            
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="תגיות (מופרדות בפסיקים)"
                value={newSection.tags}
                onChange={(e) => setNewSection({...newSection, tags: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
              
              <select
                value={newSection.category}
                onChange={(e) => setNewSection({...newSection, category: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="custom">מותאם אישית</option>
                <option value="fee_agreement">הסכמי שכר טרחה</option>
                <option value="will">צוואות</option>
                <option value="advance_directive">הנחיות מקדימות</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newSection.isPublic}
                  onChange={(e) => setNewSection({...newSection, isPublic: e.target.checked})}
                  className="rounded"
                />
                <span>זמין לכל המשתמשים</span>
              </label>
              
              <div className="flex gap-2">
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  שמור
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* רשימת סעיפים */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>אין סעיפים במחסן</p>
            <p className="text-sm">הוסף סעיף חדש כדי להתחיל</p>
          </div>
        ) : (
          filteredSections.map(section => (
            <div key={section.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{section.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {section.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {section.usageCount} שימושים
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {section.averageRating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(section.lastUsed).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUseSection(section)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                  >
                    השתמש
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-gray-700 text-sm leading-relaxed" dir="rtl">
                {section.content.length > 200 ? 
                  `${section.content.substring(0, 200)}...` : 
                  section.content
                }
              </div>
              
              {section.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex gap-1 flex-wrap">
                    {section.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
