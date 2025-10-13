'use client';

import { useState } from 'react';
import { CheckSquare, Square, Info, BookOpen } from 'lucide-react';
import { standardWillSections } from '@/lib/legal-templates-text';

interface StandardSectionsSelectorProps {
  selectedSections: string[];
  onSelectionChange: (sections: string[]) => void;
  documentType?: 'will' | 'contract' | 'court';
}

export default function StandardSectionsSelector({
  selectedSections,
  onSelectionChange,
  documentType = 'will'
}: StandardSectionsSelectorProps) {
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const toggleSection = (sectionId: string, required: boolean) => {
    if (required) return; // לא ניתן לבטל סעיפים חובה
    
    if (selectedSections.includes(sectionId)) {
      onSelectionChange(selectedSections.filter(id => id !== sectionId));
    } else {
      onSelectionChange([...selectedSections, sectionId]);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      opening: 'bg-green-100 text-green-800',
      cancellation: 'bg-red-100 text-red-800',
      debts: 'bg-yellow-100 text-yellow-800',
      inheritance: 'bg-blue-100 text-blue-800',
      executor: 'bg-purple-100 text-purple-800',
      burial: 'bg-orange-100 text-orange-800',
      special: 'bg-pink-100 text-pink-800',
      closing: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      opening: '🔰',
      cancellation: '❌',
      debts: '💰',
      inheritance: '👨‍👩‍👧‍👦',
      executor: '⚖️',
      burial: '🪦',
      special: '⭐',
      closing: '✅'
    };
    return icons[category as keyof typeof icons] || '📄';
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">📋 סעיפים סטנדרטיים לצוואה</h2>
        <div className="text-sm text-blue-700">
          נבחרו {selectedSections.length} מתוך {standardWillSections.length}
        </div>
      </div>
      
      <p className="text-sm text-blue-800 mb-6">
        בחר איזה סעיפים סטנדרטיים לכלול בצוואה. סעיפים מסומנים ב"חובה" נדרשים על פי חוק הישראלי.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        {standardWillSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <label
              className={`flex items-start gap-3 p-4 cursor-pointer transition ${
                selectedSections.includes(section.id)
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleSection(section.id, section.required)}
            >
              <div className="mt-1">
                {selectedSections.includes(section.id) ? (
                  <CheckSquare className={`w-5 h-5 ${section.required ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <Square className={`w-5 h-5 ${section.required ? 'text-blue-400 cursor-not-allowed' : 'text-gray-400'}`} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getCategoryIcon(section.category)}</span>
                  <span className="font-semibold text-gray-900">{section.title}</span>
                  {section.required && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">חובה</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-2">{section.description}</div>
                
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${getCategoryColor(section.category)}`}>
                  {section.category === 'opening' ? 'פתיחה' :
                   section.category === 'cancellation' ? 'ביטול' :
                   section.category === 'debts' ? 'חובות' :
                   section.category === 'inheritance' ? 'ירושה' :
                   section.category === 'executor' ? 'מנהל עיזבון' :
                   section.category === 'burial' ? 'קבורה' :
                   section.category === 'special' ? 'מיוחד' : 'סיום'}
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPreview(showPreview === section.id ? null : section.id);
                  }}
                  className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Info className="w-3 h-3" />
                  {showPreview === section.id ? 'הסתר תצוגה' : 'הצג תוכן'}
                </button>
              </div>
            </label>
            
            {showPreview === section.id && (
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="text-xs text-gray-700 whitespace-pre-line font-mono bg-white p-3 rounded border">
                  {section.content.substring(0, 300)}
                  {section.content.length > 300 && '...'}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
        <div className="bg-green-100 border border-green-300 p-3 rounded-lg">
          <div className="font-bold text-green-800 flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            סעיפי חובה: {standardWillSections.filter(s => s.required).length}
          </div>
          <div className="text-green-700 mt-1">נדרשים על פי חוק</div>
        </div>
        
        <div className="bg-blue-100 border border-blue-300 p-3 rounded-lg">
          <div className="font-bold text-blue-800 flex items-center gap-2">
            <Square className="w-4 h-4" />
            סעיפים אופציונליים: {standardWillSections.filter(s => !s.required).length}
          </div>
          <div className="text-blue-700 mt-1">ניתן להוסיף או להסיר</div>
        </div>
        
        <div className="bg-purple-100 border border-purple-300 p-3 rounded-lg">
          <div className="font-bold text-purple-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            סך הכל נבחרו: {selectedSections.length}
          </div>
          <div className="text-purple-700 mt-1">סעיפים שיכללו בצוואה</div>
        </div>
      </div>
    </div>
  );
}
