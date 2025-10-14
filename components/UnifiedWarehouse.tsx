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
  TrendingUp,
  Save,
  X,
  RefreshCw,
  Sparkles,
  MoveHorizontal
} from 'lucide-react';
import EditableSection from './LearningSystem/EditableSection';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';

interface WarehouseSection {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  usageCount: number;
  averageRating: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  lastUsed: string;
}

interface UnifiedWarehouseProps {
  onSectionSelect: (section: WarehouseSection) => void;
  userId: string;
  willType?: 'individual' | 'mutual'; // סוג הצוואה - לפילטור סעיפים
}

const CATEGORIES = [
  { id: 'all', name: 'הכל', icon: '📚', color: 'gray' },
  { id: 'financial', name: 'כספים', icon: '💰', color: 'green' },
  { id: 'personal', name: 'אישי', icon: '👤', color: 'blue' },
  { id: 'business', name: 'עסקים', icon: '🏢', color: 'purple' },
  { id: 'health', name: 'בריאות', icon: '🏥', color: 'red' },
  { id: 'couple', name: 'בני זוג', icon: '💕', color: 'pink' },
  { id: 'children', name: 'ילדים', icon: '👶', color: 'yellow' },
  { id: 'property', name: 'נכסים', icon: '🏠', color: 'indigo' },
  { id: 'digital', name: 'דיגיטלי', icon: '💻', color: 'cyan' }
];

export default function UnifiedWarehouse({ onSectionSelect, userId, willType = 'individual' }: UnifiedWarehouseProps) {
  const [sections, setSections] = useState<WarehouseSection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingSection, setEditingSection] = useState<WarehouseSection | null>(null);
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    category: 'personal',
    tags: []
  });
  const [showAIEditor, setShowAIEditor] = useState<string | null>(null);

  // טעינת סעיפים
  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      // בדיקה אם יש כבר סעיפים במחסן המשודרג
      const stored = localStorage.getItem(`warehouse_${userId}`);
      const hasUpgradedWarehouse = localStorage.getItem('upgraded_warehouse_loaded');
      
      // אם יש כבר סעיפים וזה לא המחסן המשודרג, נטען אותו
      if (stored && hasUpgradedWarehouse) {
        const data = JSON.parse(stored);
        setSections(data.sections || []);
        return;
      }
      
        // טעינת סעיפים מכל המחסנים המשודרגים
        try {
          console.log('Loading all upgraded warehouses...');
          
          // רשימת הקבצים לטעינה
          const warehouseFiles = [
            '/templates/clauses/sections-warehouse.json',
            '/templates/clauses/openings-warehouse.json',
            '/templates/clauses/closings-warehouse.json',
            '/templates/clauses/witnesses-warehouse.json'
          ];
          
          const defaultSections: WarehouseSection[] = [];
          
          // המרת הקטגוריות והפריטים מכל המחסנים
          const categoryMap: Record<string, string> = {
            // preliminary - לא נטען (סעיפים אוטומטיים בצוואה)
            'inheritance': 'financial',
            'protection': 'children',
            'special': 'personal',
            'final': 'personal',
            'opening': 'personal',
            'closing': 'personal',
            'witnesses': 'personal',
            'special-instructions': 'personal',
            'final-clauses': 'personal'
          };
          
          // טעינה מכל הקבצים
          for (const file of warehouseFiles) {
            try {
              const response = await fetch(file);
              const warehouse = await response.json();
              
              // טעינת סעיפים מקובץ sections-warehouse
              if (warehouse.categories) {
                warehouse.categories.forEach((category: any) => {
                  // דילוג על קטגוריית preliminary (סעיפים אוטומטיים)
                  if (category.id === 'preliminary') {
                    console.log('דילוג על preliminary - סעיפים אוטומטיים בצוואה');
                    return;
                  }
                  
                  category.items.forEach((item: any) => {
                    defaultSections.push({
                      id: item.id,
                      title: item.title,
                      content: item.content,
                      category: categoryMap[item.category] || 'personal',
                      tags: item.tags || [category.name],
                      usageCount: 0,
                      averageRating: 0,
                      isPublic: false,
                      createdBy: 'system',
                      createdAt: new Date().toISOString(),
                      lastUsed: new Date().toISOString()
                    });
                  });
                });
              }
              
              // טעינת פריטים מקובץ openings-warehouse, closings-warehouse
              if (warehouse.items) {
                warehouse.items.forEach((item: any) => {
                  defaultSections.push({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    category: categoryMap[item.category] || 'personal',
                    tags: item.tags || [item.category],
                    usageCount: 0,
                    averageRating: 0,
                    isPublic: false,
                    createdBy: 'system',
                    createdAt: new Date().toISOString(),
                    lastUsed: new Date().toISOString()
                  });
                });
              }
              
              console.log(`Loaded from ${file}: ${warehouse.categories?.length || warehouse.items?.length || 0} items`);
            } catch (fileError) {
              console.warn(`Failed to load ${file}:`, fileError);
            }
          }
          
          console.log(`Total loaded: ${defaultSections.length} sections from all warehouses`);
          setSections(defaultSections);
          saveSections(defaultSections);
          
          // סימון שהמחסן המשודרג נטען
          localStorage.setItem('upgraded_warehouse_loaded', 'true');
        
      } catch (fetchError) {
        console.error('Error loading warehouse:', fetchError);
        // אם יש בעיה בטעינה, ניצור סעיפי ברירת מחדל בסיסיים
        const basicSections: WarehouseSection[] = [
          {
            id: 'default-1',
            title: 'הוראת כספי פנסיה',
            content: 'כל כספי הפנסיה שלי יועברו ל{{שם היורש}} בהתאם לחוק.',
            category: 'financial',
            tags: ['פנסיה', 'כספים'],
            usageCount: 0,
            averageRating: 0,
            isPublic: false,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
          },
          {
            id: 'default-2',
            title: 'הוראת טיפול רפואי',
            content: 'במצב של חוסר הכרה, אני מורה כי הטיפול הרפואי יעשה בהתאם לרצוני המפורש ולפי חוק החולה הנוטה למות.',
            category: 'health',
            tags: ['רפואה', 'בריאות'],
            usageCount: 0,
            averageRating: 0,
            isPublic: false,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
          },
          {
            id: 'default-3',
            title: 'הוראת נכסים עסקיים',
            content: 'כל הנכסים העסקיים שלי יועברו ל{{שם היורש}} עם הוראות להמשך הפעלת העסק.',
            category: 'business',
            tags: ['עסקים', 'נכסים'],
            usageCount: 0,
            averageRating: 0,
            isPublic: false,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
          }
        ];
        setSections(basicSections);
        saveSections(basicSections);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const saveSections = (sectionsToSave: WarehouseSection[]) => {
    try {
      localStorage.setItem(`warehouse_${userId}`, JSON.stringify({
        sections: sectionsToSave,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving sections:', error);
    }
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    
    // פילטור לפי סוג צוואה
    const matchesWillType = willType === 'mutual' 
      ? true // בצוואה הדדית - הצג הכל
      : !section.tags.some(tag => tag.includes('הדדית') || tag.includes('הדדי')); // בצוואה יחידה - הסתר סעיפים הדדיים
    
    return matchesSearch && matchesCategory && matchesWillType;
  });

  const sortedSections = [...filteredSections].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      case 'popular':
        return b.usageCount - a.usageCount;
      case 'rating':
        return b.averageRating - a.averageRating;
      default:
        return 0;
    }
  });

  const handleAddSection = () => {
    if (newSection.title.trim() && newSection.content.trim()) {
      const section: WarehouseSection = {
        id: `section_${Date.now()}`,
        title: newSection.title,
        content: newSection.content,
        category: newSection.category,
        tags: newSection.tags,
        usageCount: 0,
        averageRating: 0,
        isPublic: false,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };
      
      const updatedSections = [...sections, section];
      setSections(updatedSections);
      saveSections(updatedSections);
      
      setNewSection({ title: '', content: '', category: 'personal', tags: [] });
      setIsAddingNew(false);
    }
  };

  const handleEditSection = (section: WarehouseSection) => {
    setEditingSection(section);
  };

  const handleSaveEdit = () => {
    if (editingSection) {
      const updatedSections = sections.map(s => 
        s.id === editingSection.id ? { ...editingSection, lastUsed: new Date().toISOString() } : s
      );
      setSections(updatedSections);
      saveSections(updatedSections);
      setEditingSection(null);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('האם למחוק את הסעיף?')) {
      const updatedSections = sections.filter(s => s.id !== sectionId);
      setSections(updatedSections);
      saveSections(updatedSections);
    }
  };

  const handleMoveCategorySection = (sectionId: string, newCategory: string) => {
    const section = sections.find(s => s.id === sectionId);
    const newCategoryInfo = getCategoryInfo(newCategory);
    
    const updated = sections.map(s => 
      s.id === sectionId ? { ...s, category: newCategory } : s
    );
    setSections(updated);
    saveSections(updated);
    
    // הודעת הצלחה
    if (section) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>הועבר ל${newCategoryInfo.icon} ${newCategoryInfo.name}</span>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };

  const handleSelectSection = (section: WarehouseSection) => {
    // עדכון מונה שימוש
    const updatedSections = sections.map(s => 
      s.id === section.id 
        ? { ...s, usageCount: s.usageCount + 1, lastUsed: new Date().toISOString() }
        : s
    );
    setSections(updatedSections);
    saveSections(updatedSections);
    
    onSectionSelect(section);
  };

  // המרת WarehouseSection ל-EditableSectionType
  const convertToEditableSection = (section: WarehouseSection): EditableSectionType => {
    return {
      id: section.id,
      title: section.title,
      content: section.content,
      originalContent: section.content,
      category: section.category,
      serviceType: section.category,
      isEditable: true,
      isCustom: true,
      version: 1,
      lastModified: section.lastUsed,
      modifiedBy: userId,
      tags: section.tags
    };
  };

  const handleUpdateEditableSection = (updatedSection: EditableSectionType) => {
    const updatedSections = sections.map(s => 
      s.id === updatedSection.id 
        ? { 
            ...s, 
            title: updatedSection.title,
            content: updatedSection.content,
            lastUsed: new Date().toISOString() 
          }
        : s
    );
    setSections(updatedSections);
    saveSections(updatedSections);
    setShowAIEditor(null);
  };

  const handleSaveToWarehouse = (section: EditableSectionType) => {
    // הסעיף כבר במחסן, רק נעדכן אותו
    handleUpdateEditableSection(section);
  };

  const handleSaveToLearning = (section: EditableSectionType) => {
    // שמירה למערכת הלמידה
    console.log('Saving to learning system:', section);
    handleUpdateEditableSection(section);
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[0];
  };

  return (
    <div className="space-y-6">
      {/* כותרת וסטטיסטיקות */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            המחסן האישי שלי
            {willType === 'mutual' && (
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                💕 צוואה הדדית
              </span>
            )}
          </h3>
          <div className="text-sm text-gray-600">
            {sections.length} סעיפים • {filteredSections.length} תוצאות
            {willType === 'individual' && (
              <span className="text-xs text-gray-500 mr-2">(ללא סעיפים הדדיים)</span>
            )}
          </div>
        </div>

        {/* חיפוש וסינון */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="חיפוש סעיפים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="recent">לפי עדכון אחרון</option>
            <option value="popular">לפי פופולריות</option>
            <option value="rating">לפי דירוג</option>
          </select>

          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            סעיף חדש
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('upgraded_warehouse_loaded');
              localStorage.removeItem(`warehouse_${userId}`);
              loadSections();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
            טען מחדש מחסן
          </button>
        </div>

        {/* קטגוריות */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category.id
                  ? `bg-${category.color}-100 text-${category.color}-800 border border-${category.color}-300`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* הוספת סעיף חדש */}
      {isAddingNew && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            הוספת סעיף חדש
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הסעיף:</label>
              <input
                type="text"
                value={newSection.title}
                onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="למשל: הוראת כספי פנסיה"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">קטגוריה:</label>
              <select
                value={newSection.category}
                onChange={(e) => setNewSection(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CATEGORIES.slice(1).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תוכן הסעיף:</label>
              <textarea
                value={newSection.content}
                onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="כתבי את תוכן הסעיף כאן. ניתן להשתמש במשתנים כמו {{שם המצווה}}"
                dir="rtl"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddSection}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                שמור סעיף
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <X className="w-4 h-4" />
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* עריכת סעיף עם AI */}
      {editingSection && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            עריכת סעיף עם AI
          </h4>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              ✨ עכשיו יש לך אפשרות עריכה מלאה עם AI וללא AI!
            </p>
          </div>
          
          <EditableSection
            section={convertToEditableSection(editingSection)}
            onUpdate={handleUpdateEditableSection}
            onSaveToWarehouse={handleSaveToWarehouse}
            onSaveToLearning={handleSaveToLearning}
            userId={userId}
          />
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setEditingSection(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4" />
              סגור עריכה
            </button>
          </div>
        </div>
      )}

      {/* רשימת סעיפים */}
      <div className="grid gap-4">
        {sortedSections.length > 0 ? (
          sortedSections.map(section => {
            const categoryInfo = getCategoryInfo(section.category);
            return (
              <div
                key={section.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{categoryInfo.icon}</span>
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      
                      {/* Dropdown להעברת קטגוריה */}
                      <div className="relative group">
                        <select
                          value={section.category}
                          onChange={(e) => handleMoveCategorySection(section.id, e.target.value)}
                          className={`px-2 py-1 text-xs rounded-full bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 hover:bg-${categoryInfo.color}-200 cursor-pointer appearance-none pr-6 border-none outline-none`}
                          title="העבר לקטגוריה אחרת"
                        >
                          {CATEGORIES.slice(1).map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                        <MoveHorizontal className="absolute left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-500" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {section.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>שימוש: {section.usageCount}</span>
                      <span>נוצר: {new Date(section.createdAt).toLocaleDateString('he-IL')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectSection(section)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      הוסף לצוואה
                    </button>
                    <button
                      onClick={() => setShowAIEditor(section.id)}
                      className="p-1 text-purple-500 hover:text-purple-700 transition"
                      title="עריכה עם AI"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition"
                      title="עריכה ידנית"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition"
                      title="מחק סעיף"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">אין סעיפים במחסן</p>
            <p className="text-sm">הוסיפי סעיפים חדשים או שנה את הסינון</p>
          </div>
        )}
      </div>

      {/* עריכת AI ישירה */}
      {showAIEditor && (
        <div className="mt-6 bg-white rounded-lg border border-purple-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            עריכה עם AI
          </h4>
          
          {(() => {
            const section = sections.find(s => s.id === showAIEditor);
            if (!section) {
              setShowAIEditor(null);
              return <div>סעיף לא נמצא</div>;
            }
            return (
              <EditableSection
                section={convertToEditableSection(section)}
                onUpdate={handleUpdateEditableSection}
                onSaveToWarehouse={handleSaveToWarehouse}
                onSaveToLearning={handleSaveToLearning}
                userId={userId}
              />
            );
          })()}
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowAIEditor(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4" />
              סגור עריכה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
