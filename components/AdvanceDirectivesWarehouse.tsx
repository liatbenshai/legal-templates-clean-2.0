'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import {
  advanceDirectivesSectionsWarehouse,
  getAdvanceDirectivesSectionsByCategory,
  getAdvanceDirectivesSectionsBySubcategory,
  searchAdvanceDirectivesSections,
  advanceDirectivesCategories,
  advanceDirectivesSubcategories,
  type AdvanceDirectivesSectionTemplate
} from '@/lib/sections-warehouses/advance-directives-warehouse';
import { applyGenderToText, type Gender } from '@/lib/hebrew-gender';

interface AdvanceDirectivesWarehouseProps {
  onAddSection: (content: string, title: string) => void;
  attorneyGender?: 'male' | 'female'; // מגדר מיופה הכוח
}

export default function AdvanceDirectivesWarehouse({ onAddSection, attorneyGender = 'male' }: AdvanceDirectivesWarehouseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'property' | 'personal' | 'medical'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    category: 'personal' as 'property' | 'personal' | 'medical',
    tags: ''
  });

  // סינון סעיפים
  const getFilteredSections = (): AdvanceDirectivesSectionTemplate[] => {
    let filtered = advanceDirectivesSectionsWarehouse;

    // סינון לפי קטגוריה
    if (selectedCategory !== 'all') {
      filtered = getAdvanceDirectivesSectionsByCategory(selectedCategory);
    }

    // סינון לפי תת-קטגוריה
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(s => s.subcategory === selectedSubcategory);
    }

    // חיפוש
    if (searchQuery) {
      filtered = searchAdvanceDirectivesSections(searchQuery);
    }

    return filtered;
  };

  const filteredSections = getFilteredSections();

  // קבלת תת-קטגוריות לפי קטגוריה נבחרת
  const getCurrentSubcategories = () => {
    if (selectedCategory === 'all') return [];
    return advanceDirectivesSubcategories[selectedCategory] || [];
  };

  return (
    <div className="space-y-6">
      {/* כותרת */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">
          📚 מחסן סעיפים - הנחיות מקדימות
        </h3>
        <div className="text-sm text-gray-600">
          {filteredSections.length} סעיפים זמינים
        </div>
      </div>

      {/* חיפוש וסינון */}
      <div className="space-y-4">
        {/* שורת חיפוש */}
        <div className="relative">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חפש סעיף..."
            className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* סינון לפי קטגוריה */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            הכל
          </button>

          {advanceDirectivesCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setSelectedSubcategory('all');
              }}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                selectedCategory === cat.id
                  ? `text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? cat.color : undefined
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* תת-קטגוריות */}
        {selectedCategory !== 'all' && getCurrentSubcategories().length > 0 && (
          <div className="flex gap-2 flex-wrap mr-4">
            <span className="text-sm text-gray-600 py-2">תת-קטגוריה:</span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded text-sm ${
                selectedSubcategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              הכל
            </button>
            {getCurrentSubcategories().map((subcat: any) => (
              <button
                key={subcat.id}
                onClick={() => setSelectedSubcategory(subcat.id)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedSubcategory === subcat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {subcat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* רשימת סעיפים */}
      <div className="grid gap-4">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            😞 לא נמצאו סעיפים מתאימים
          </div>
        ) : (
          filteredSections.map((section) => {
            const category = advanceDirectivesCategories.find(c => c.id === section.category);
            
            return (
              <div
                key={section.id}
                className="border rounded-lg p-4 hover:shadow-lg transition bg-white"
                style={{ borderRightWidth: '4px', borderRightColor: category?.color || '#gray' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{category?.icon}</span>
                      <h4 className="font-bold text-lg text-gray-900">{section.title}</h4>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      {section.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                      {applyGenderToText(section.content, attorneyGender)}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddSection(
                      applyGenderToText(section.content, attorneyGender),
                      section.title
                    )}
                    className="mr-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shrink-0"
                  >
                    <Plus size={18} />
                    <span>הוסף</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* יצירת סעיף חדש */}
      <div className="border-t pt-6 mt-6">
        <button
          onClick={() => setShowCreateNew(!showCreateNew)}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span>{showCreateNew ? 'סגור טופס' : 'צור סעיף חדש מותאם אישית'}</span>
        </button>

        {showCreateNew && (
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-bold text-lg mb-4">יצירת סעיף חדש</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">כותרת הסעיף</label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="לדוגמה: טיפול בחיות מחמד"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">קטגוריה</label>
                <select
                  value={newSection.category}
                  onChange={(e) => setNewSection({ ...newSection, category: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="property">רכושי</option>
                  <option value="personal">אישי</option>
                  <option value="medical">רפואי</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">תוכן הסעיף</label>
                <textarea
                  value={newSection.content}
                  onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg h-40"
                  placeholder="כתוב את תוכן הסעיף המלא כאן..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">תגיות (מופרד בפסיקים)</label>
                <input
                  type="text"
                  value={newSection.tags}
                  onChange={(e) => setNewSection({ ...newSection, tags: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="תג1, תג2, תג3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (newSection.title && newSection.content) {
                      onAddSection(newSection.content, newSection.title);
                      setNewSection({ title: '', content: '', category: 'personal', tags: '' });
                      setShowCreateNew(false);
                      alert('✅ הסעיף נוסף בהצלחה!');
                    } else {
                      alert('❌ נא למלא כותרת ותוכן');
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  ✅ הוסף למסמך
                </button>
                <button
                  onClick={() => {
                    setNewSection({ title: '', content: '', category: 'personal', tags: '' });
                    setShowCreateNew(false);
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* מידע נוסף */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          💡 <strong>טיפ:</strong> לחצי על "הוסף" כדי להוסיף את הסעיף למסמך שלך. תוכלי לערוך אותו אחר כך.
          <br />
          ✨ יש לך סעיף מיוחד? לחצי על "צור סעיף חדש" למעלה!
        </p>
      </div>
    </div>
  );
}

