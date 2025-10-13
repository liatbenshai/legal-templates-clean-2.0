'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Copy, Trash2, Sparkles, Search, Filter, BookOpen } from 'lucide-react';
import { sectionsWarehouse, SectionTemplate } from '@/lib/professional-will-texts';
import SimpleAIImprover from './SimpleAIImprover';
import EnhancedAIImprover from './EnhancedAIImprover';
import SectionEditor from './SectionEditor';
import GenderSelector from './GenderSelector';
import { Gender } from '@/lib/hebrew-gender';

// import { getGenderSuffix } from '@/lib/hebrew-verbs-learning';

interface SectionsWarehouseProps {
  onAddSection: (content: string, title: string) => void;
  selectedWillType: 'individual' | 'mutual';
}

export default function SectionsWarehouse({ onAddSection, selectedWillType }: SectionsWarehouseProps) {
  // סעיפים מותאמים מ-localStorage
  const [customSections, setCustomSections] = useState<SectionTemplate[]>([]);
  
  // טען סעיפים מותאמים בטעינה ראשונית
  useEffect(() => {
    loadCustomSections();
  }, []);
  
  const loadCustomSections = () => {
    try {
      const storageKey = 'customSections_wills';
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCustomSections(parsed);
      }
    } catch (error) {
      console.error('Error loading custom sections:', error);
    }
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAI, setShowAI] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [variablesModal, setVariablesModal] = useState<{
    section: SectionTemplate;
    values: Record<string, string>;
    genders: Record<string, Gender>;
  } | null>(null);
  const [sectionEditor, setSectionEditor] = useState<SectionTemplate | null>(null);
  const [editingSection, setEditingSection] = useState<SectionTemplate | null>(null);

  // שילוב סעיפים מובנים ומותאמים
  const allSections = [...sectionsWarehouse, ...customSections];
  
  const categories = [
    { id: 'all', name: 'כל הקטגוריות', icon: '📋', count: allSections.length },
    { id: 'property', name: 'נכסים', icon: '🏠', count: allSections.filter(s => s.category === 'property').length },
    { id: 'inheritance', name: 'ירושה', icon: '👨‍👩‍👧‍👦', count: allSections.filter(s => s.category === 'inheritance').length },
    { id: 'restrictions', name: 'הגבלות', icon: '🚫', count: allSections.filter(s => s.category === 'restrictions').length },
    { id: 'special', name: 'מיוחד', icon: '⭐', count: allSections.filter(s => s.category === 'special').length },
    { id: 'family', name: 'משפחה', icon: '👪', count: allSections.filter(s => s.category === 'family').length },
    { id: 'business', name: 'עסקים', icon: '🏢', count: allSections.filter(s => s.category === 'business').length }
  ];

  const filteredSections = allSections.filter(section => {
    const matchesSearch = searchTerm === '' || 
      section.title.includes(searchTerm) || 
      section.content.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || 
      section.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateCustomSection = (improvedText: string) => {
    if (!newSectionTitle.trim()) {
      alert('אנא הזן כותרת לסעיף החדש');
      return;
    }

    const newSection: SectionTemplate = {
      id: `custom_${Date.now()}`,
      title: newSectionTitle,
      category: 'special',
      content: improvedText,
      variables: extractVariables(improvedText),
      aiPrompt: 'סעיף מותאם אישית שנוצר על ידי עורך דין',
      usageInstructions: 'סעיף שנוצר במיוחד עבור מקרה ספציפי'
    };

    setCustomSections(prev => {
      const updated = [...prev, newSection];
      
      // שמירה ב-localStorage במפתח הנכון
      const storageKey = 'customSections_wills';
      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      return updated;
    });
    
    setNewSectionTitle('');
    setShowCreateNew(false);
  };

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/{{([^}]+)}}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
  };

  // פונקציה חדשה - פותחת את העורך המתקדם
  const handleSectionClick = (section: SectionTemplate) => {
    setSectionEditor(section);
  };

  // פונקציה לשמירת סעיף מעובד
  const handleSaveSectionEdit = (editedContent: string, title: string) => {
    if (sectionEditor) {
      onAddSection(editedContent, title);
      setSectionEditor(null);
    }
  };

  const handleAddSection = (section: SectionTemplate) => {
    if (section.variables.length > 0) {
      // אם יש משתנים - פתח חלון למילוי
      const initialValues: Record<string, string> = {};
      const initialGenders: Record<string, Gender> = {};
      section.variables.forEach(v => {
        initialValues[v] = '';
        // אם זה שדה שדורש מגדר - הגדר ברירת מחדל
        if (v.includes('guardian') || v.includes('heir') || v.includes('inheritor') || v.includes('caregiver') || v.includes('business_heir')) {
          initialGenders[v] = 'male';
        }
      });
      setVariablesModal({ section, values: initialValues, genders: initialGenders });
    } else {
      // אם אין משתנים - הוסף ישירות
      onAddSection(section.content, section.title);
    }
  };

  const handleConfirmWithVariables = () => {
    if (!variablesModal) return;
    
    let content = variablesModal.section.content;
    
    // החלף כל משתנה בערך שהוזן
    Object.entries(variablesModal.values).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || `[${key}]`);
    });
    
    // החלף משתני מגדר
    Object.entries(variablesModal.genders).forEach(([key, gender]) => {
      let genderSuffix = '';
      
      // לוגיקה פשוטה למגדר
      if (key.includes('child') || key.includes('heir')) {
        genderSuffix = gender === 'female' ? 'ה' : gender === 'plural' ? 'ו' : '';
      } else {
        genderSuffix = gender === 'female' ? 'ת' : gender === 'plural' ? 'ים' : '';
      }
      
      const genderRegex = new RegExp(`{{${key}_gender_suffix}}`, 'g');
      content = content.replace(genderRegex, genderSuffix);
      
      // החלף גם משתני מגדר ישירים
      const directGenderRegex = new RegExp(`{{${key}_gender}}`, 'g');
      content = content.replace(directGenderRegex, gender);
    });
    
    onAddSection(content, variablesModal.section.title);
    setVariablesModal(null);
  };

  const translateVariable = (variable: string): string => {
    const translations: Record<string, string> = {
      'business_name': 'שם העסק',
      'business_id': 'מספר ח.פ.',
      'business_heir': 'שם היורש',
      'vehicle_owner': 'בעל הרכב',
      'vehicle_type': 'סוג הרכב',
      'vehicle_plate': 'מספר רישוי',
      'vehicle_inheritor': 'יורש הרכב',
      'vehicle_inheritor_id': 'ת.ז. היורש',
      'digital_heir': 'יורש הנכסים הדיגיטליים',
      'pet_caregiver': 'שם המטפל בחיות',
      'pets_list': 'רשימת חיות המחמד',
      'pet_care_amount': 'סכום לטיפול (₪)',
      'monthly_amount': 'סכום חודשי (₪)',
      'donation_amount': 'סכום התרומה (₪)',
      'donation_amount_words': 'סכום התרומה במילים',
      'charity_name': 'שם הארגון',
      'charity_id': 'מספר עמותה (ע.ר.)',
      'charity_field': 'תחום הארגון',
      'charity_cause': 'מטרת הארגון',
      'donation_timeframe': 'מועד להעברת התרומה',
      'replacement_percentage': 'אחוז מתמורת המכירה',
      'replacement_days': 'מספר ימים לרכישה',
      'warning_days': 'ימים לרישום הערת אזהרה',
      'reference_section': 'מספר סעיף',
      'excluded_person': 'שם האדם שלא יורש',
      'parent_names': 'שמות ההורים',
      'testator_full_name': 'שם מלא של המצווה',
      'testator_id': 'מספר תעודת זהות',
      'testator_address': 'כתובת מלאה',
      'property_address': 'כתובת הנכס',
      'property_city': 'עיר',
      'property_block': 'מספר גוש',
      'property_plot': 'מספר חלקה',
      'property_sub_plot': 'מספר תת-חלקה',
      'property_name': 'שם הנכס (לצורך התייחסות)',
      'bank_name': 'שם הבנק',
      'branch_number': 'מספר סניף',
      'account_number': 'מספר חשבון',
      'heirs_description': 'תיאור היורשים',
      'number_of_children': 'מספר ילדים',
      'number_of_heirs': 'מספר יורשים',
      'marriage_year': 'שנת נישואין',
      'guardian_name': 'שם האפוטרופוס',
      'guardian_id': 'ת.ז. האפוטרופוס',
      'relationship': 'קרבה',
      'children_names': 'שמות הילדים',
      'guardianship_scope': 'היקף האפוטרופסות',
      'reasons': 'סיבות למינוי',
      'parenting_guidance': 'הדרכה להורות',
      'backup_guardian_name': 'שם האפוטרופוס החלופי',
      'backup_guardian_id': 'ת.ז. האפוטרופוס החלופי',
      'guardian_gender': 'מגדר האפוטרופוס',
      'business_heir_gender': 'מגדר יורש העסק'
    };
    
    return translations[variable] || variable;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('הטקסט הועתק ללוח!');
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          מחסן הסעיפים המשפטיים
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateNew(!showCreateNew)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
            צור סעיף חדש
          </button>
          
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Sparkles className="w-4 h-4" />
            עוזר AI
          </button>
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

      {/* יצירת סעיף חדש עם AI */}
      {showCreateNew && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">🆕 יצירת סעיף חדש עם AI</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="כותרת לסעיף החדש (למשל: ירושת רכב, טיפול בעסק...)"
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <EnhancedAIImprover
              text="כתוב כאן רעיון בסיסי לסעיף והAI ירחיב לסעיף משפטי מלא"
              onImprove={handleCreateCustomSection}
              documentType="will-section"
              showAnalysis={false}
            />
          </div>
        </div>
      )}

      {/* עוזר AI כללי */}
      {showAI && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4">🤖 עוזר AI לסעיפים משפטיים</h3>
          
          <EnhancedAIImprover
            text=""
            onImprove={(improvedText) => {
              onAddSection(improvedText, 'סעיף משופר מ-AI');
              setShowAI(false);
            }}
            documentType="will-section"
            showAnalysis={true}
            allowTextEdit={true}
            placeholder="כתבי רעיון בסיסי והAI יהפוך אותו לסעיף משפטי מקצועי..."
          />
        </div>
      )}

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
                    section.category === 'property' ? 'bg-green-100 text-green-800' :
                    section.category === 'inheritance' ? 'bg-blue-100 text-blue-800' :
                    section.category === 'restrictions' ? 'bg-red-100 text-red-800' :
                    section.category === 'special' ? 'bg-purple-100 text-purple-800' :
                    section.category === 'family' ? 'bg-pink-100 text-pink-800' :
                    section.category === 'business' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {categories.find(c => c.id === section.category)?.name || section.category}
                  </span>
                  
                  {section.variables.length > 0 && (
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
                  onClick={() => handleAddSection(section)}
                  className="p-1 text-gray-400 hover:text-green-600 transition"
                  title="הוסף לצוואה"
                >
                  <Plus className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setEditingSection(section)}
                  className="p-1 text-gray-400 hover:text-purple-600 transition"
                  title="ערוך עם AI פשוט"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setSectionEditor(section)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition"
                  title="עורך מתקדם עם AI"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 mb-3 max-h-24 overflow-hidden">
              {section.content.substring(0, 150)}
              {section.content.length > 150 && '...'}
            </div>
            
            <div className="text-xs text-gray-500 border-t pt-2">
              <div className="mb-1"><strong>שימוש:</strong> {section.usageInstructions}</div>
              {section.variables.length > 0 && (
                <div><strong>משתנים:</strong> {section.variables.join(', ')}</div>
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

      {/* חלון למילוי משתנים */}
      {variablesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                📝 מילוי פרטים: {variablesModal.section.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                אנא מלא את הפרטים הבאים כדי להשלים את הסעיף המשפטי
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              {variablesModal.section.variables.map((variable) => (
                <div key={variable} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translateVariable(variable)}
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={variablesModal.values[variable] || ''}
                      onChange={(e) => setVariablesModal({
                        ...variablesModal,
                        values: {
                          ...variablesModal.values,
                          [variable]: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`הזן ${translateVariable(variable)}`}
                      dir="rtl"
                    />
                  </div>
                  
                  {/* בחירת מגדר לשדות שדורשים מגדר */}
                  {(variable.includes('guardian') || variable.includes('heir') || variable.includes('inheritor') || variable.includes('caregiver') || variable.includes('business_heir')) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מגדר {translateVariable(variable)}
                      </label>
                      <GenderSelector
                        value={variablesModal.genders[variable] || 'male'}
                        onChange={(gender) => setVariablesModal({
                          ...variablesModal,
                          genders: {
                            ...variablesModal.genders,
                            [variable]: gender
                          }
                        })}
                        label=""
                        size="small"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>טיפ:</strong> ניתן להשאיר שדות ריקים אם לא רלוונטי. המשתנה יוצג בסוגריים [כך] בטקסט.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setVariablesModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition"
              >
                ביטול
              </button>
              <button
                onClick={handleConfirmWithVariables}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                ✓ הוסף לצוואה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* עריכת סעיף עם AI */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                עריכת סעיף: {editingSection.title}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="text-sm text-purple-600 bg-purple-50 p-3 rounded-lg mb-4">
                  <strong>💡 הנחיה ל-AI:</strong> {editingSection.aiPrompt}
                </div>
                
                <EnhancedAIImprover
                  text={editingSection.content}
                  onImprove={(improvedText) => {
                    onAddSection(improvedText, editingSection.title);
                    setEditingSection(null);
                  }}
                  documentType="will-section"
                  showAnalysis={true}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* סטטיסטיקות */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{sectionsWarehouse.length}</div>
          <div className="text-sm text-blue-800">סעיפי מלאי</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{customSections.length}</div>
          <div className="text-sm text-green-800">סעיפים מותאמים</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredSections.length}</div>
          <div className="text-sm text-purple-800">סעיפים זמינים</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">∞</div>
          <div className="text-sm text-orange-800">אפשרויות עם AI</div>
        </div>
      </div>

      {/* עורך סעיף מתקדם */}
      {sectionEditor && (
        <SectionEditor
          section={sectionEditor}
          onSave={handleSaveSectionEdit}
          onCancel={() => setSectionEditor(null)}
        />
      )}
    </div>
  );
}
