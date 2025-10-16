'use client';

import { useState } from 'react';
import { 
  advanceDirectivesSectionsWarehouse, 
  advanceDirectivesCategories, 
  advanceDirectivesSubcategories,
  applyAdvanceDirectivesGender,
  type AdvanceDirectivesSectionTemplate 
} from '@/lib/sections-warehouses/advance-directives-warehouse';
import { Search, Plus, Check, Eye, EyeOff, X } from 'lucide-react';

interface AdvanceDirectivesSectionSelectorProps {
  selectedSections: string[]; // IDs של הסעיפים שנבחרו
  onSectionToggle: (sectionId: string) => void;
  principalGender: 'male' | 'female';
  attorneyGender: 'male' | 'female' | 'plural';
}

export default function AdvanceDirectivesSectionSelector({
  selectedSections,
  onSectionToggle,
  principalGender,
  attorneyGender
}: AdvanceDirectivesSectionSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'property' | 'personal' | 'medical'>('property');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('real-estate'); // ברירת מחדל: נדל"ן
  const [searchQuery, setSearchQuery] = useState('');
  const [previewSection, setPreviewSection] = useState<string | null>(null);
  const [hiddenSections, setHiddenSections] = useState<string[]>(() => {
    // טעינת סעיפים מוסתרים מ-localStorage
    const saved = localStorage.getItem('hiddenAdvanceDirectivesSections');
    return saved ? JSON.parse(saved) : [];
  });

  // שמירת סעיפים מוסתרים
  const saveHiddenSections = (hidden: string[]) => {
    localStorage.setItem('hiddenAdvanceDirectivesSections', JSON.stringify(hidden));
    setHiddenSections(hidden);
  };

  // הסתרת/הצגת סעיף
  const toggleHideSection = (sectionId: string) => {
    const newHidden = hiddenSections.includes(sectionId)
      ? hiddenSections.filter(id => id !== sectionId)
      : [...hiddenSections, sectionId];
    saveHiddenSections(newHidden);
  };

  // סינון סעיפים לפי קטגוריה, תת-קטגוריה, חיפוש והסתרה
  const filteredSections = advanceDirectivesSectionsWarehouse.filter(section => {
    // סינון לפי הסתרה
    if (hiddenSections.includes(section.id)) return false;
    
    // סינון לפי קטגוריה
    if (section.category !== selectedCategory) return false;
    
    // סינון לפי תת-קטגוריה (אם נבחר)
    if (selectedSubcategory && section.subcategory !== selectedSubcategory) return false;
    
    // סינון לפי חיפוש
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query) ||
        section.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // קבלת תת-הקטגוריות של הקטגוריה הנוכחית
  const currentSubcategories = advanceDirectivesSubcategories[selectedCategory] || [];

  // בדיקה אם סעיף נבחר
  const isSectionSelected = (sectionId: string) => selectedSections.includes(sectionId);

  // הצגת תצוגה מקדימה של סעיף עם נטיות
  const getPreviewContent = (section: AdvanceDirectivesSectionTemplate) => {
    return applyAdvanceDirectivesGender(section.content, principalGender, attorneyGender);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">📚 מחסן הסעיפים - 95 סעיפים מוכנים</h3>
        <p className="text-sm text-gray-700">
          בחר סעיפים מהמחסן או כתוב סעיפים משלך. כל הסעיפים יותאמו אוטומטית למגדר שבחרת.
        </p>
      </div>

      {/* חיפוש */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חפש סעיף לפי כותרת, תוכן או תגית..."
          className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* טאבים - קטגוריות ראשיות */}
      <div className="flex gap-2 border-b border-gray-200">
        {advanceDirectivesCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id as 'property' | 'personal' | 'medical');
              setSelectedSubcategory('');
            }}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              selectedCategory === category.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* תת-קטגוריות */}
      {currentSubcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentSubcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedSubcategory === sub.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {sub.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedSubcategory('')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedSubcategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            הכל
          </button>
        </div>
      )}

      {/* רשימת סעיפים */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">לא נמצאו סעיפים</p>
            <p className="text-sm mt-2">נסה לשנות את החיפוש או הקטגוריה</p>
          </div>
        ) : (
          filteredSections.map((section) => {
            const isSelected = isSectionSelected(section.id);
            const isPreview = previewSection === section.id;
            
            return (
              <div
                key={section.id}
                className={`border rounded-lg p-4 transition ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      {section.tags.length > 0 && (
                        <div className="flex gap-1">
                          {section.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {isPreview && (
                      <div className="mt-3 p-3 bg-white border border-gray-200 rounded text-sm text-gray-700 whitespace-pre-wrap">
                        {getPreviewContent(section)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewSection(isPreview ? null : section.id)}
                      className={`p-2 rounded-lg transition ${
                        isPreview
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isPreview ? 'הסתר תצוגה מקדימה' : 'הצג תצוגה מקדימה'}
                    >
                      {isPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => toggleHideSection(section.id)}
                      className="p-2 rounded-lg transition bg-red-100 text-red-600 hover:bg-red-200"
                      title="הסתר סעיף זה (לא יופיע יותר)"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => onSectionToggle(section.id)}
                      className={`p-2 rounded-lg transition ${
                        isSelected
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      title={isSelected ? 'הסר מהמסמך' : 'הוסף למסמך'}
                    >
                      {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* סיכום הבחירה וסעיפים מוסתרים */}
      <div className="grid md:grid-cols-2 gap-4">
        {selectedSections.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-800">
              ✅ נבחרו {selectedSections.length} סעיפים
            </p>
            <p className="text-sm text-green-700 mt-1">
              הסעיפים יתווספו למסמך עם הנטיות המתאימות
            </p>
          </div>
        )}
        
        {hiddenSections.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="font-semibold text-orange-800">
              🙈 {hiddenSections.length} סעיפים מוסתרים
            </p>
            <button
              onClick={() => saveHiddenSections([])}
              className="text-sm text-orange-700 hover:text-orange-900 mt-1 underline"
            >
              הצג את כל הסעיפים מחדש
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

