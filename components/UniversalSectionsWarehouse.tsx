'use client';

import { useState } from 'react';
import { Plus, Edit3, Copy, Trash2, Sparkles, Search, Filter, BookOpen, Scale, FileText, Handshake } from 'lucide-react';
import { courtSectionsWarehouse, getCourtSectionsForDocument } from '@/lib/sections-warehouses/court-warehouse';
import { contractSectionsWarehouse, getContractSectionsForType } from '@/lib/sections-warehouses/contracts-warehouse';
import { affidavitSectionsWarehouse, getAffidavitSectionsForType } from '@/lib/sections-warehouses/affidavits-warehouse';
import SectionEditor from './SectionEditor';

interface UniversalSectionsWarehouseProps {
  onAddSection: (content: string, title: string) => void;
  documentType: 'court-petition' | 'appeal' | 'court' | 'inheritance' | 'will-contest' | 'guardianship' | 'monetary-agreement' | 'rental' | 'sale' | 'employment' | 'partnership' | 'fee-agreement' | 'service' | 'personal' | 'business' | 'government' | 'insurance';
}

export default function UniversalSectionsWarehouse({ onAddSection, documentType }: UniversalSectionsWarehouseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAI, setShowAI] = useState(false);
  const [sectionEditor, setSectionEditor] = useState<any>(null);

  // קבלת הסעיפים הרלוונטיים לפי סוג המסמך
  const getRelevantSections = () => {
    let sections: any[] = [];
    
    // כתבי בית משפט
    if (['court-petition', 'appeal', 'court', 'inheritance', 'will-contest', 'guardianship', 'monetary-agreement'].includes(documentType)) {
      sections = getCourtSectionsForDocument(documentType);
    }
    // הסכמים
    else if (['rental', 'sale', 'employment', 'partnership', 'fee-agreement', 'service'].includes(documentType)) {
      sections = getContractSectionsForType(documentType);
    }
    // תצהירים
    else if (['personal', 'business', 'government', 'insurance'].includes(documentType)) {
      sections = getAffidavitSectionsForType(documentType);
    }

    return sections;
  };

  const relevantSections = getRelevantSections();

  // קטגוריות דינמיות לפי סוג המסמך
  const getCategories = () => {
    const allCategories = [...new Set(relevantSections.map(s => s.category))];
    const categoryNames: Record<string, string> = {
      'opening': 'פתיחות',
      'facts': 'עובדות',
      'legal-claims': 'טיעונים משפטיים',
      'evidence': 'ראיות',
      'remedies': 'סעדים',
      'procedural': 'פרוצדורה',
      'closing': 'סיום',
      'parties': 'צדדים',
      'subject': 'נושא ההסכם',
      'payment': 'תשלומים',
      'obligations': 'התחייבויות',
      'termination': 'סיום הסכם',
      'general': 'כללי',
      'personal-details': 'פרטים אישיים',
      'declarations': 'הצהרות',
      'attachments': 'נספחים'
    };

    return [
      { id: 'all', name: 'כל הקטגוריות', icon: '📋', count: relevantSections.length },
      ...allCategories.map(cat => ({
        id: cat,
        name: categoryNames[cat] || cat,
        icon: getIconForCategory(cat),
        count: relevantSections.filter(s => s.category === cat).length
      }))
    ];
  };

  const getIconForCategory = (category: string): string => {
    const icons: Record<string, string> = {
      'opening': '🚀',
      'facts': '📋',
      'legal-claims': '⚖️',
      'evidence': '📄',
      'remedies': '🎯',
      'procedural': '📝',
      'closing': '✅',
      'parties': '👥',
      'subject': '📋',
      'payment': '💰',
      'obligations': '📜',
      'termination': '🔚',
      'general': '⚙️',
      'personal-details': '👤',
      'declarations': '📢',
      'attachments': '📎'
    };
    return icons[category] || '📄';
  };

  const categories = getCategories();

  const filteredSections = relevantSections.filter(section => {
    const matchesSearch = searchTerm === '' || 
      section.title.includes(searchTerm) || 
      section.content.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || 
      section.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSectionClick = (section: any) => {
    setSectionEditor(section);
  };

  const handleSaveSectionEdit = (editedContent: string, title: string) => {
    if (sectionEditor) {
      onAddSection(editedContent, title);
      setSectionEditor(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('הטקסט הועתק ללוח!');
    });
  };

  const getDocumentTypeTitle = () => {
    const titles: Record<string, string> = {
      'court-petition': 'כתבי תביעה',
      'appeal': 'ערעורים',
      'court': 'כתבי בית דין',
      'inheritance': 'צווי ירושה',
      'will-contest': 'התנגדויות לצוואה',
      'guardianship': 'בקשות אפוטרופוסות',
      'monetary-agreement': 'הסכמי ממון וחיים משותפים',
      'rental': 'הסכמי שכירות',
      'sale': 'הסכמי מכר',
      'employment': 'הסכמי עבודה',
      'partnership': 'הסכמי שותפות',
      'fee-agreement': 'הסכמי שכר טרחה',
      'service': 'הסכמי שירותים',
      'personal': 'תצהירים אישיים',
      'business': 'תצהירים עסקיים',
      'government': 'תצהירים לרשויות',
      'insurance': 'תצהירים לביטוח'
    };
    return titles[documentType] || 'מסמכים משפטיים';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          מחסן סעיפים - {getDocumentTypeTitle()}
        </h2>
        
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {relevantSections.length} סעיפים זמינים
        </div>
      </div>

      {/* חיפוש ופילטרים */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חפש סעיף לפי כותרת או תוכן..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            dir="rtl"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>

      {/* רשימת הסעיפים */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSections.map((section) => (
          <div
            key={section.id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    section.category === 'opening' ? 'bg-green-100 text-green-800' :
                    section.category === 'facts' ? 'bg-blue-100 text-blue-800' :
                    section.category === 'legal-claims' ? 'bg-purple-100 text-purple-800' :
                    section.category === 'evidence' ? 'bg-yellow-100 text-yellow-800' :
                    section.category === 'remedies' ? 'bg-red-100 text-red-800' :
                    section.category === 'payment' ? 'bg-green-100 text-green-800' :
                    section.category === 'obligations' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {categories.find(c => c.id === section.category)?.name || section.category}
                  </span>
                  
                  {section.variables && section.variables.length > 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {section.variables.length} משתנים
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => copyToClipboard(section.content)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition"
                  title="העתק טקסט"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleSectionClick(section)}
                  className="p-1 text-gray-400 hover:text-green-600 transition"
                  title="הוסף למסמך"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 mb-3 max-h-24 overflow-hidden">
              {section.content.substring(0, 150)}
              {section.content.length > 150 && '...'}
            </div>
            
            <div className="text-xs text-gray-500 border-t pt-2">
              <div className="mb-1"><strong>שימוש:</strong> {section.usageInstructions}</div>
              {section.variables && section.variables.length > 0 && (
                <div><strong>משתנים:</strong> {section.variables.slice(0, 3).join(', ')}{section.variables.length > 3 && '...'}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">לא נמצאו סעיפים</h3>
          <p className="text-gray-500 mb-4">נסה לשנות את מילת החיפוש או הקטגוריה</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            הצג הכל
          </button>
        </div>
      )}

      {/* עורך סעיף מתקדם */}
      {sectionEditor && (
        <SectionEditor
          section={sectionEditor}
          onSave={handleSaveSectionEdit}
          onCancel={() => setSectionEditor(null)}
        />
      )}

      {/* סטטיסטיקות */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{relevantSections.length}</div>
          <div className="text-sm text-blue-800">סעיפים זמינים</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
          <div className="text-sm text-green-800">קטגוריות</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredSections.length}</div>
          <div className="text-sm text-purple-800">מוצגים כעת</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">∞</div>
          <div className="text-sm text-orange-800">אפשרויות עם AI</div>
        </div>
      </div>
    </div>
  );
}
