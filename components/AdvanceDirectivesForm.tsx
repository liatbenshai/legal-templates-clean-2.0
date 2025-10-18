'use client';

import { useState, useEffect } from 'react';
import { FileText, User, Users, Download, Plus, Trash2 } from 'lucide-react';
import GenderSelector from './GenderSelector';
import AdvanceDirectivesSectionSelector from './AdvanceDirectivesSectionSelector';
import type { Gender } from '@/lib/hebrew-gender';
import { replaceTextWithGender } from '@/lib/hebrew-gender';
import { 
  applyAdvanceDirectivesGender,
  getAdvanceDirectivesSectionById 
} from '@/lib/sections-warehouses/advance-directives-warehouse';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import EditableSection from './LearningSystem/EditableSection';
import AILearningManager from './AILearningManager';
import WarehouseManager from './LearningSystem/WarehouseManager';
import { useWarehouse } from '@/lib/hooks/useWarehouse';

// סוג מגדר מצומצם (ללא organization)
type PersonGender = 'male' | 'female';

interface Attorney {
  name: string;
  id: string;
  relationship: string;
  address: string;
  phone: string;
  gender: PersonGender;
}

export default function AdvanceDirectivesForm() {
  // פרטי הממנה (נותן ההנחיות)
  const [principalInfo, setPrincipalInfo] = useState({
    fullName: '',
    id: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    gender: 'male' as PersonGender
  });

  // Warehouse hook
  const { addSection, updateSection, sections: warehouseSections } = useWarehouse(principalInfo.fullName || 'anonymous');

  // מיופי כוח (אפשר כמה)
  const [attorneys, setAttorneys] = useState<Attorney[]>([
    {
      name: '',
      id: '',
      relationship: '',
      address: '',
      phone: '',
      gender: 'male'
    }
  ]);

  // הנחיות - סעיפים שנבחרו מהמחסן
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  
  // הנחיות חופשיות (טקסט נוסף)
  const [customInstructions, setCustomInstructions] = useState({
    medical: '',
    property: '',
    personal: '',
    special: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [useWarehouseSections, setUseWarehouseSections] = useState(true); // האם להשתמש במחסן או טקסט חופשי
  
  // מערכת למידה
  const [editableSections, setEditableSections] = useState<EditableSectionType[]>([]);
  const [showAILearning, setShowAILearning] = useState(false);
  
  // בדיקה אם יש טקסט מ-ai-learning
  useEffect(() => {
    const savedText = localStorage.getItem('ai-improved-section-advance-directives');
    if (savedText) {
      try {
        const data = JSON.parse(savedText);
        if (data.content && confirm('📥 נמצא טקסט משופר מעמוד למידת AI. לטעון אותו?')) {
          // הוסף להנחיות החופשיות
          setCustomInstructions(prev => ({
            ...prev,
            special: prev.special ? prev.special + '\n\n' + data.content : data.content
          }));
          localStorage.removeItem('ai-improved-section-advance-directives');
          alert('✅ הטקסט נטען להנחיות מיוחדות בהצלחה!');
        }
      } catch (err) {
        console.error('Error loading AI text:', err);
      }
    }
  }, []);

  // הוספת מיופה כוח נוסף
  const addAttorney = () => {
    setAttorneys([...attorneys, {
      name: '',
      id: '',
      relationship: '',
      address: '',
      phone: '',
      gender: 'male'
    }]);
  };

  // הסרת מיופה כוח
  const removeAttorney = (index: number) => {
    if (attorneys.length > 1) {
      setAttorneys(attorneys.filter((_, i) => i !== index));
    }
  };

  // עדכון פרטי מיופה כוח
  const updateAttorney = (index: number, field: keyof Attorney, value: string | PersonGender) => {
    const updated = [...attorneys];
    updated[index] = { ...updated[index], [field]: value };
    setAttorneys(updated);
  };

  // קביעת מגדר מיופה הכוח (רבים אם יש יותר מאחד)
  const getAttorneyGender = (): 'male' | 'female' | 'plural' => {
    if (attorneys.length === 0) return 'male';
    if (attorneys.length === 1) return attorneys[0].gender;
    return 'plural'; // רבים
  };

  // טיפול בבחירת/ביטול סעיף
  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // קבלת תוכן הסעיפים שנבחרו עם נטיות
  const getSelectedSectionsContent = (category: 'property' | 'personal' | 'medical') => {
    const attorneyGender = getAttorneyGender();
    const sections = selectedSections
      .map(id => getAdvanceDirectivesSectionById(id))
      .filter(section => section && section.category === category);
    
    if (sections.length === 0) return '';
    
    return sections
      .map((section, index) => {
        const content = applyAdvanceDirectivesGender(
          section!.content,
          principalInfo.gender,
          attorneyGender
        );
        return `${index + 1}. ${section!.title}\n\n${content}`;
      })
      .join('\n\n───────────────────\n\n');
  };

  // המרה לסעיפים ניתנים לעריכה עם AI
  const convertToEditableSections = () => {
    const attorneyGender = getAttorneyGender();
    const sections: EditableSectionType[] = [];
    
    // הוספת כל הסעיפים שנבחרו מהמחסן
    selectedSections.forEach((sectionId, index) => {
      const section = getAdvanceDirectivesSectionById(sectionId);
      if (section) {
        const content = applyAdvanceDirectivesGender(
          section.content,
          principalInfo.gender,
          attorneyGender
        );
        
        sections.push({
          id: `section-${sectionId}`,
          title: section.title,
          content: content,
          category: 'advance_directive',
          isEditable: true,
          isCustom: false,
          lastModified: new Date().toISOString(),
          modifiedBy: 'user',
          version: 1,
        });
      }
    });
    
    // הוספת טקסט חופשי אם יש
    if (customInstructions.property) {
      sections.push({
        id: 'custom-property',
        title: 'הנחיות רכושיות מותאמות אישית',
        content: applyAdvanceDirectivesGender(customInstructions.property, principalInfo.gender, attorneyGender),
        category: 'advance_directive',
        isEditable: true,
        isCustom: true,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user',
        version: 1,
      });
    }
    
    if (customInstructions.personal) {
      sections.push({
        id: 'custom-personal',
        title: 'הנחיות אישיות מותאמות אישית',
        content: applyAdvanceDirectivesGender(customInstructions.personal, principalInfo.gender, attorneyGender),
        category: 'advance_directive',
        isEditable: true,
        isCustom: true,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user',
        version: 1,
      });
    }
    
    if (customInstructions.medical) {
      sections.push({
        id: 'custom-medical',
        title: 'הנחיות רפואיות מותאמות אישית',
        content: applyAdvanceDirectivesGender(customInstructions.medical, principalInfo.gender, attorneyGender),
        category: 'advance_directive',
        isEditable: true,
        isCustom: true,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user',
        version: 1,
      });
    }
    
    if (customInstructions.special) {
      sections.push({
        id: 'custom-special',
        title: 'הוראות מיוחדות',
        content: applyAdvanceDirectivesGender(customInstructions.special, principalInfo.gender, attorneyGender),
        category: 'advance_directive',
        isEditable: true,
        isCustom: true,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user',
        version: 1,
      });
    }
    
    setEditableSections(sections);
    setShowAILearning(true);
  };

  // עדכון סעיף לאחר שיפור AI
  const handleUpdateEditableSection = (updatedSection: EditableSectionType) => {
    setEditableSections(prev => 
      prev.map(section => 
        section.id === updatedSection.id 
          ? { ...updatedSection, lastModified: new Date().toISOString() }
          : section
      )
    );
    
    // עדכון גם בטקסט החופשי אם זה סעיף מותאם אישית
    if (updatedSection.id === 'custom-property') {
      setCustomInstructions(prev => ({ ...prev, property: updatedSection.content }));
    } else if (updatedSection.id === 'custom-personal') {
      setCustomInstructions(prev => ({ ...prev, personal: updatedSection.content }));
    } else if (updatedSection.id === 'custom-medical') {
      setCustomInstructions(prev => ({ ...prev, medical: updatedSection.content }));
    } else if (updatedSection.id === 'custom-special') {
      setCustomInstructions(prev => ({ ...prev, special: updatedSection.content }));
    }
  };

  // שמירה למחסן אישי
  const handleSaveToWarehouse = async (section: EditableSectionType) => {
    try {
      await addSection({
        user_id: principalInfo.fullName || 'anonymous',
        title: section.title,
        content: section.content,
        category: section.category || 'custom',
        tags: ['הנחיות מקדימות', 'סעיף מותאם אישית'],
        usage_count: 0,
        average_rating: 5,
        is_public: false,
        is_hidden: false,
        created_by: principalInfo.fullName || 'anonymous'
      });
      alert('✅ סעיף נשמר למחסן האישי!');
    } catch (error) {
      console.error('Error saving to warehouse:', error);
      alert('❌ שגיאה בשמירה למחסן');
    }
  };

  // פונקציה לפתיחת מודל השלמת משתנים
  const openVariablesCompletionModal = () => {
    // אוסף את כל הטקסט מההנחיות המותאמות אישית
    const allText = [
      customInstructions.property,
      customInstructions.personal,
      customInstructions.medical,
      customInstructions.special
    ].join('\n\n');
    
    // מזהה משתנים בטקסט
    const extractedVariables = extractVariablesFromText(allText);
    
    if (extractedVariables.length === 0) {
      alert('לא נמצאו משתנים בטקסט. השתמש ב-{{שם משתנה}} כדי ליצור משתנים.');
      return;
    }
    
    setVariablesCompletionModal({
      isOpen: true,
      variables: extractedVariables,
      values: {},
      genders: {}
    });
  };

  // פונקציה לחילוץ משתנים מטקסט
  const extractVariablesFromText = (text: string): string[] => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = text.match(variableRegex);
    if (!matches) return [];
    
    // מחזיר משתנים ייחודיים
    return [...new Set(matches.map(match => match.slice(2, -2)))];
  };

  const [variablesCompletionModal, setVariablesCompletionModal] = useState<{
    isOpen: boolean;
    variables: string[];
    values: Record<string, string>;
    genders: Record<string, 'male' | 'female' | 'plural'>;
  }>({
    isOpen: false,
    variables: [],
    values: {},
    genders: {}
  });

  // שמירה למערכת למידה
  const handleSaveToLearning = (section: EditableSectionType, userCorrection?: string) => {
    if (userCorrection) {
      learningEngine.saveLearningData({
        sectionId: section.id,
        originalText: section.content,
        editedText: userCorrection,
        editType: 'manual',
        userFeedback: 'improved',
        context: {
          serviceType: 'advance-directives',
          category: 'advance-directives',
          userType: 'lawyer'
        },
        timestamp: new Date().toISOString(),
        userId: principalInfo.fullName || 'anonymous'
      });
      alert('שינוי נשמר למערכת הלמידה!');
    }
  };

  const handleSelectFromWarehouse = async (warehouseSection: any) => {
    const { replaceTextWithGender } = require('@/lib/hebrew-gender');
    
    // קביעת מגדר הממנה
    const genderedContent = replaceTextWithGender(
      warehouseSection.content,
      principalInfo.gender
    );
    
    // הוספה לסעיפים הנבחרים (רק ה-ID)
    setSelectedSections(prev => [...prev, warehouseSection.id]);
    
    // עדכון מונה השימוש במחסן
    try {
      await updateSection(warehouseSection.id, {
        usage_count: (warehouseSection.usage_count || 0) + 1,
        last_used: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating usage count:', error);
    }
    
    alert('✅ סעיף נוסף מהמחסן!');
  };

  const generateDocument = () => {
    const attorneyGender = getAttorneyGender();
    
    // כותרת עם נטיות
    const genderSuffix = principalInfo.gender === 'female' ? 'ה' : '';
    
    // סעיפים לפי קטגוריות
    const propertySections = getSelectedSectionsContent('property');
    const personalSections = getSelectedSectionsContent('personal');
    const medicalSections = getSelectedSectionsContent('medical');
    
    const doc = `
ייפוי כוח מתמשך והנחיות מקדימות

אני הח"מ:
שם מלא: ${principalInfo.fullName}
ת"ז: ${principalInfo.id}
תאריך לידה: ${principalInfo.birthDate}
כתובת: ${principalInfo.address}
טלפון: ${principalInfo.phone}
${principalInfo.email ? `דוא"ל: ${principalInfo.email}` : ''}

מצהיר${genderSuffix} בזאת כדלקמן:

═══════════════════════════════════════
חלק א' - מיופי הכוח
═══════════════════════════════════════

${attorneys.map((attorney, index) => {
  const attorneyNum = index + 1;
  const attorneySuffix = attorney.gender === 'female' ? 'ת' : '';
  return `${attorneyNum}. מיופה${attorneySuffix} כוח ${index === 0 ? 'ראשי' + attorneySuffix : 'חלופי' + attorneySuffix}:
   שם: ${attorney.name}
   ת"ז: ${attorney.id}
   יחסי קרבה: ${attorney.relationship}
   כתובת: ${attorney.address}
   טלפון: ${attorney.phone}`;
}).join('\n\n')}

═══════════════════════════════════════
חלק ב' - הנחיות רכושיות
═══════════════════════════════════════

${propertySections || customInstructions.property || 'לא צוינו הנחיות רכושיות ספציפיות.'}

═══════════════════════════════════════
חלק ג' - הנחיות אישיות
═══════════════════════════════════════

${personalSections || customInstructions.personal || 'לא צוינו הנחיות אישיות ספציפיות.'}

═══════════════════════════════════════
חלק ד' - הנחיות רפואיות
═══════════════════════════════════════

${medicalSections || customInstructions.medical || 'לא צוינו הנחיות רפואיות ספציפיות.'}

═══════════════════════════════════════
חלק ה' - הוראות מיוחדות
═══════════════════════════════════════

${applyAdvanceDirectivesGender(
  customInstructions.special || 'אין הוראות מיוחדות נוספות.',
  principalInfo.gender,
  attorneyGender
)}

═══════════════════════════════════════

תאריך: ${new Date().toLocaleDateString('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})}

חתימת ${principalInfo.gender === 'female' ? 'הממנה' : 'הממנה'}: __________________

חתימת עד 1: __________________  שם: ________________  ת"ז: ________________

חתימת עד 2: __________________  שם: ________________  ת"ז: ________________
`;
    return doc;
  };

  const handleDownload = () => {
    const doc = generateDocument();
    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ייפוי_כוח_מתמשך_${principalInfo.fullName || 'מסמך'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ייפוי כוח מתמשך והנחיות מקדימות
            </h1>
            <p className="text-gray-600">
              מערכת מתקדמת עם תמיכה מלאה בנטיות מגדר
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 ${step !== 4 ? 'border-b-2' : ''} ${
                    currentStep >= step ? 'border-blue-600' : 'border-gray-300'
                  } pb-2`}
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                  <div className="text-center mt-2 text-xs text-gray-600">
                    {step === 1 && 'פרטי הממנה'}
                    {step === 2 && 'מיופי כוח'}
                    {step === 3 && 'הנחיות'}
                    {step === 4 && 'סיכום'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: פרטי הממנה */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6" />
                פרטי הממנה (נותן ההנחיות)
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>חשוב:</strong> בחירת המגדר תשפיע על כל הנטיות בטקסט (אני מצהיר/מצהירה, ממנה/ממנה וכו')
                </p>
              </div>

              {/* בחירת מגדר */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מגדר הממנה *
                </label>
                <GenderSelector
                  value={principalInfo.gender}
                  onChange={(gender) => setPrincipalInfo({ ...principalInfo, gender: gender as PersonGender })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    value={principalInfo.fullName}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="שם פרטי ושם משפחה"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מספר תעודת זהות *
                  </label>
                  <input
                    type="text"
                    value={principalInfo.id}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תאריך לידה *
                  </label>
                  <input
                    type="date"
                    value={principalInfo.birthDate}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת מלאה *
                  </label>
                  <input
                    type="text"
                    value={principalInfo.address}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="רחוב, מספר בית, עיר, מיקוד"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    value={principalInfo.phone}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="050-1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    דוא"ל
                  </label>
                  <input
                    type="email"
                    value={principalInfo.email}
                    onChange={(e) => setPrincipalInfo({ ...principalInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  המשך →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: מיופי כוח */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  מיופי כוח
                </h2>
                <button
                  onClick={addAttorney}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  הוסף מיופה כוח
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  💡 <strong>כמה מיופי כוח?</strong> אם תוסיף יותר ממיופה כוח אחד, הנטיות יהיו ברבים (מיופי הכוח, רשאים וכו')
                </p>
              </div>

              {attorneys.map((attorney, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      מיופה כוח #{index + 1} {index === 0 && '(ראשי)'}
                    </h3>
                    {attorneys.length > 1 && (
                      <button
                        onClick={() => removeAttorney(index)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        הסר
                      </button>
                    )}
                  </div>

                  {/* בחירת מגדר למיופה כוח */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מגדר מיופה הכוח *
                    </label>
                    <GenderSelector
                      value={attorney.gender}
                      onChange={(gender) => updateAttorney(index, 'gender', gender as PersonGender)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        שם מלא *
                      </label>
                      <input
                        type="text"
                        value={attorney.name}
                        onChange={(e) => updateAttorney(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        מספר תעודת זהות *
                      </label>
                      <input
                        type="text"
                        value={attorney.id}
                        onChange={(e) => updateAttorney(index, 'id', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        יחסי קרבה *
                      </label>
                      <input
                        type="text"
                        value={attorney.relationship}
                        onChange={(e) => updateAttorney(index, 'relationship', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="בן/בת, אח/אחות, וכו'"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        כתובת *
                      </label>
                      <input
                        type="text"
                        value={attorney.address}
                        onChange={(e) => updateAttorney(index, 'address', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טלפון *
                      </label>
                      <input
                        type="tel"
                        value={attorney.phone}
                        onChange={(e) => updateAttorney(index, 'phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  ← חזור
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  המשך →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: הנחיות */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                הנחיות והוראות
              </h2>

              {/* בחירה בין מחסן סעיפים לטקסט חופשי */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setUseWarehouseSections(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    useWarehouseSections
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="font-semibold">מחסן סעיפים (מומלץ)</div>
                    <div className="text-sm mt-1">95 סעיפים מוכנים עם נטיות אוטומטיות</div>
                  </div>
                </button>

                <button
                  onClick={() => setUseWarehouseSections(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    !useWarehouseSections
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">✍️</div>
                    <div className="font-semibold">טקסט חופשי</div>
                    <div className="text-sm mt-1">כתוב הנחיות משלך</div>
                  </div>
                </button>
              </div>

              {/* מחסן סעיפים */}
              {useWarehouseSections && (
                <AdvanceDirectivesSectionSelector
                  selectedSections={selectedSections}
                  onSectionToggle={handleSectionToggle}
                  principalGender={principalInfo.gender}
                  attorneyGender={getAttorneyGender()}
                  userId="current-user" // TODO: replace with actual user ID
                />
              )}

              {/* טקסט חופשי */}
              {!useWarehouseSections && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✨ <strong>נטיות אוטומטיות:</strong> השתמש ב-{`{{מיופה_כוח}}`}, {`{{רשאי}}`}, {`{{אחראי}}`} או /ת /ה
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      הנחיות רכושיות
                    </label>
                    <textarea
                      value={customInstructions.property}
                      onChange={(e) => setCustomInstructions({ ...customInstructions, property: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="{{מיופה_כוח}} {{מוסמך}} לנהל את חשבונות הבנק שלי..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      הנחיות אישיות
                    </label>
                    <textarea
                      value={customInstructions.personal}
                      onChange={(e) => setCustomInstructions({ ...customInstructions, personal: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="אני מבקש/ת להישאר בביתי..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      הנחיות רפואיות
                    </label>
                    <textarea
                      value={customInstructions.medical}
                      onChange={(e) => setCustomInstructions({ ...customInstructions, medical: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="{{מיופה_כוח}} {{רשאי}} להחליט על טיפולים רפואיים..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      הוראות מיוחדות
                    </label>
                    <textarea
                      value={customInstructions.special}
                      onChange={(e) => setCustomInstructions({ ...customInstructions, special: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="הוראות נוספות..."
                    />
                  </div>
                </div>
              )}

              {/* הודעת מידע על AI */}
              {(selectedSections.length > 0 || Object.values(customInstructions).some(v => v)) && (
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                  <p className="text-sm text-purple-900 font-semibold">
                    💡 <strong>טיפ:</strong> בשלב הבא תוכל לשפר את הסעיפים עם AI!
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    המערכת תציג לך כפתור גדול "🚀 פתח מצב עריכה + שיפור עם AI" 
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  ← חזור
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  המשך לסיכום + AI →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: סיכום */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                סיכום ותצוגה מקדימה
              </h2>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2">📋 סיכום פרטים:</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">הממנה: </span>
                    <span className="text-sm text-gray-900">{principalInfo.fullName || '(לא הוזן)'} - {principalInfo.gender === 'male' ? 'זכר' : 'נקבה'}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">מיופי כוח: </span>
                    <span className="text-sm text-gray-900">{attorneys.length} מיופי כוח</span>
                    {attorneys.length > 1 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">רבים</span>
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">סעיפים מהמחסן: </span>
                    <span className="text-sm text-gray-900 font-semibold">{selectedSections.length} סעיפים</span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">טקסט חופשי: </span>
                    <span className="text-sm text-gray-900">
                      {Object.values(customInstructions).some(v => v) ? '✅ יש תוכן' : '❌ אין תוכן'}
                    </span>
                  </div>

                  {(selectedSections.length > 0 || Object.values(customInstructions).some(v => v)) && (
                    <div className="bg-green-100 border border-green-300 rounded p-3 mt-4">
                      <p className="text-sm text-green-800 font-semibold">
                        ✅ יש תוכן במסמך - ניתן לשפר עם AI!
                      </p>
                    </div>
                  )}

                  {selectedSections.length === 0 && !Object.values(customInstructions).some(v => v) && (
                    <div className="bg-yellow-100 border border-yellow-300 rounded p-3 mt-4">
                      <p className="text-sm text-yellow-800 font-semibold">
                        ⚠️ אין תוכן במסמך
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        חזור לשלב 3 ובחר סעיפים או כתוב טקסט חופשי
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* כפתור שיפור עם AI - תמיד מוצג! */}
              <div className={`border-2 rounded-lg p-6 ${
                !showAILearning 
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300' 
                  : 'bg-gray-50 border-gray-300'
              }`}>
                {!showAILearning && (
                  <>
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2 text-xl">
                      🤖 שיפור מסמך עם בינה מלאכותית
                    </h3>
                    <p className="text-sm text-purple-700 mb-4">
                      {selectedSections.length > 0 || Object.values(customInstructions).some(v => v) ? (
                        <>
                          <strong>✨ יש לך {selectedSections.length} סעיפים במחסן + טקסט חופשי.</strong><br/>
                          לחץ על הכפתור למטה כדי לפתוח את מצב העריכה המתקדם עם AI!
                        </>
                      ) : (
                        <>
                          ⚠️ <strong>לא נבחרו סעיפים ולא הוזן טקסט.</strong><br/>
                          <span className="text-xs">חזור לשלב 3 ובחר סעיפים מהמחסן (📚) או כתוב טקסט חופשי (✍️)</span>
                        </>
                      )}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={convertToEditableSections}
                        disabled={selectedSections.length === 0 && !Object.values(customInstructions).some(v => v)}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        {selectedSections.length === 0 && !Object.values(customInstructions).some(v => v) ? (
                          <>⚠️ אין תוכן לשיפור - חזור לשלב 3</>
                        ) : (
                          <>🚀 פתח מצב עריכה + שיפור עם AI</>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          const title = prompt('כותרת הסעיף:');
                          const content = prompt('תוכן הסעיף:');
                          if (title && content) {
                            handleSaveToWarehouse({
                              id: Date.now().toString(),
                              title,
                              content,
                              category: 'custom',
                              serviceType: 'advance-directives',
                              isEditable: true,
                              isCustom: true,
                              version: 1,
                              lastModified: new Date().toISOString(),
                              modifiedBy: principalInfo.fullName || 'anonymous'
                            });
                          }
                        }}
                        className="px-4 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                      >
                        ➕ הוסף סעיף למחסן
                      </button>
                      <button
                        onClick={openVariablesCompletionModal}
                        className="px-4 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-semibold"
                      >
                        🔧 השלם משתנים
                      </button>
                    </div>
                  </>
                )}

                {showAILearning && (
                  <div className="text-center">
                    <p className="text-green-700 font-semibold mb-3">✅ מצב עריכה + AI פעיל!</p>
                    <button
                      onClick={() => setShowAILearning(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      ← חזור לתצוגה מקדימה
                    </button>
                  </div>
                )}
              </div>

              {/* סעיפים ניתנים לעריכה */}
              {showAILearning && editableSections.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✅ <strong>מצב עריכה פעיל!</strong> ערוך כל סעיף והשתמש ב-AI לשיפור הטקסט
                    </p>
                  </div>

                  {editableSections.map((section) => (
                    <EditableSection
                      key={section.id}
                      section={section}
                      userId={principalInfo.fullName || 'anonymous'}
                      onUpdate={handleUpdateEditableSection}
                      onSaveToWarehouse={handleSaveToWarehouse}
                      onSaveToLearning={handleSaveToLearning}
                    />
                  ))}

                  {/* כפתור הוספת סעיף חדש */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      ➕ הוסף סעיף חדש
                    </h3>
                    <button
                      onClick={() => {
                        const title = prompt('כותרת הסעיף:');
                        const content = prompt('תוכן הסעיף:');
                        if (title && content) {
                          const newSection = {
                            id: `custom-${Date.now()}`,
                            title,
                            content,
                            originalContent: content,
                            category: 'custom' as const,
                            serviceType: 'advance-directives' as const,
                            isEditable: true,
                            isCustom: true,
                            version: 1,
                            lastModified: new Date().toISOString(),
                            modifiedBy: principalInfo.fullName || 'anonymous'
                          };
                          setEditableSections(prev => [...prev, newSection]);
                          alert('✅ סעיף חדש נוסף!');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      ➕ הוסף סעיף מותאם אישית
                    </button>
                  </div>

                  {/* מנהל למידת AI */}
                  <AILearningManager />
                  
                  {/* מחסן סעיפים */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      📚 מחסן סעיפים אישי
                    </h3>
                    <WarehouseManager
                      userId={principalInfo.fullName || 'anonymous'}
                      onSectionSelect={handleSelectFromWarehouse}
                    />
                  </div>
                </div>
              )}

              {/* תצוגה מקדימה */}
              {!showAILearning && (
                <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-right" style={{ direction: 'rtl' }}>
                    {generateDocument()}
                  </pre>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => {
                    setCurrentStep(3);
                    setShowAILearning(false);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  ← חזור
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  הורד מסמך
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* מודל השלמת משתנים */}
      {variablesCompletionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                🔧 השלם משתנים
              </h3>
              <button
                onClick={() => setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {} })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {variablesCompletionModal.variables.map((variable, index) => (
                <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700">
                    {`{{${variable}}}`}
                  </label>
                  
                  {/* שדה ערך */}
                  <input
                    type="text"
                    value={variablesCompletionModal.values[variable] || ''}
                    onChange={(e) => setVariablesCompletionModal(prev => ({
                      ...prev,
                      values: {
                        ...prev.values,
                        [variable]: e.target.value
                      }
                    }))}
                    placeholder={`הזן ערך עבור ${variable}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* בחירת מגדר */}
                  {isGenderRelevantVariable(variable) && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        מגדר:
                      </label>
                      <select
                        value={variablesCompletionModal.genders[variable] || 'male'}
                        onChange={(e) => setVariablesCompletionModal(prev => ({
                          ...prev,
                          genders: {
                            ...prev.genders,
                            [variable]: e.target.value as 'male' | 'female' | 'plural'
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="male">זכר</option>
                        <option value="female">נקבה</option>
                        <option value="plural">רבים</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {} })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  // החלפת משתנים בטקסט עם התחשבות במגדר
                  const updatedInstructions = { ...customInstructions };
                  
                  variablesCompletionModal.variables.forEach(variable => {
                    const value = variablesCompletionModal.values[variable];
                    const gender = variablesCompletionModal.genders[variable];
                    
                    if (value) {
                      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
                      let finalValue = value;
                      
                      // אם זה משתנה רגיש למגדר, נשתמש בפונקציית החלפת מגדר
                      if (isGenderRelevantVariable(variable) && gender) {
                        finalValue = replaceTextWithGender(value, gender);
                      }
                      
                      updatedInstructions.property = updatedInstructions.property.replace(regex, finalValue);
                      updatedInstructions.personal = updatedInstructions.personal.replace(regex, finalValue);
                      updatedInstructions.medical = updatedInstructions.medical.replace(regex, finalValue);
                      updatedInstructions.special = updatedInstructions.special.replace(regex, finalValue);
                    }
                  });
                  
                  setCustomInstructions(updatedInstructions);
                  setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {} });
                  alert('✅ משתנים הוחלפו בהצלחה!');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                החלף משתנים
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// פונקציות עזר
function isGenderRelevantVariable(variable: string): boolean {
  const genderRelevantVariables = [
    'heir_name', 'guardian_name', 'alternate_guardian', 'child_name', 
    'manager_name', 'trustee_name', 'spouse_name', 'guardian_id', 'guardian_address',
    'מיופה_כוח', 'רשאי', 'אחראי', 'מחויב', 'יכול', 'צריך', 'חייב', 'זכאי', 
    'מתחייב', 'מסכים', 'מבקש', 'מצהיר', 'מאשר', 'הוא', 'היא', 'בן_זוג', 'בעל', 'אישה'
  ];
  return genderRelevantVariables.includes(variable);
}
