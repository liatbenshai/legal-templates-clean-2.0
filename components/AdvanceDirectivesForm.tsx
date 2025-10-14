'use client';

import { useState, useEffect } from 'react';
import { 
  UserProfile, 
  AttorneyInfo, 
  UserDocumentData, 
  ModuleId,
  Module 
} from '@/types/advanceDirectives.types';
import { selectRelevantModules } from '@/lib/advanceDirectives/moduleSelector';
import { generateDocument } from '@/lib/advanceDirectives/documentGenerator';
import { ALL_MODULES, getModulesByCategory } from '@/data/modules';
import { advanceDirectivesSectionsWarehouse, AdvanceDirectivesSectionTemplate } from '@/lib/sections-warehouses/advance-directives-warehouse';

type FormStep = 'profile' | 'attorneys' | 'modules' | 'details' | 'preview';

export default function AdvanceDirectivesForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('profile');
  
  // פרופיל משתמש
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
    fullName: '',
    idNumber: '',
    birthDate: '',
    age: 0,
    address: '',
    phone: '',
    email: '',
    maritalStatus: 'single',
    hasRealEstate: false,
    hasBankAccounts: false,
    hasInvestments: false,
    hasVehicle: false,
    hasPension: false,
    hasAllowances: false,
    healthFund: 'clalit',
    hasChronicDiseases: false,
    needsCareAssistance: false,
    isDisabledVeteran: false
  });

  // מיופי כוח
  const [attorneys, setAttorneys] = useState<AttorneyInfo[]>([
    {
      isPrimary: true,
      fullName: '',
      idNumber: '',
      relationship: '',
      address: '',
      phone: '',
      email: ''
    }
  ]);

  // מודולים נבחרים
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([]);
  const [suggestedModules, setSuggestedModules] = useState<ModuleId[]>([]);

  // נתוני מודולים
  const [moduleData, setModuleData] = useState<Record<string, any>>({});

  // מסמך שנוצר
  const [generatedDocument, setGeneratedDocument] = useState<string>('');

  // מחסן סעיפים
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [selectedSections, setSelectedSections] = useState<AdvanceDirectivesSectionTemplate[]>([]);
  const [variablesModal, setVariablesModal] = useState<{
    section: AdvanceDirectivesSectionTemplate;
    values: Record<string, string>;
    genders: Record<string, 'male' | 'female'>;
  } | null>(null);
  
  // עריכת סעיפים
  const [editingSection, setEditingSection] = useState<AdvanceDirectivesSectionTemplate | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSection, setNewSection] = useState<{
    title: string;
    content: string;
    category: 'property' | 'personal' | 'medical';
  }>({
    title: '',
    content: '',
    category: 'property'
  });

  // חישוב גיל אוטומטי
  useEffect(() => {
    if (userProfile.birthDate) {
      const birthDate = new Date(userProfile.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setUserProfile((prev: Partial<UserProfile>) => ({ ...prev, age }));
    }
  }, [userProfile.birthDate]);

  // הצעת מודולים אוטומטית
  useEffect(() => {
    if (userProfile.age && userProfile.age > 0) {
      const suggested = selectRelevantModules(userProfile as UserProfile);
      setSuggestedModules(suggested);
      setSelectedModules(suggested);
    }
  }, [userProfile]);

  // הוספת מיופה כוח
  const addAttorney = () => {
    setAttorneys([...attorneys, {
      isPrimary: false,
      fullName: '',
      idNumber: '',
      relationship: '',
      address: '',
      phone: '',
      email: ''
    }]);
  };

  // מחיקת מיופה כוח
  const removeAttorney = (index: number) => {
    if (attorneys.length > 1) {
      setAttorneys(attorneys.filter((_, i) => i !== index));
    }
  };

  // פונקציות עזר למחסן
  const extractVariablesFromContent = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))] : [];
  };

  const isGenderRelevantVariable = (variable: string): boolean => {
    const genderRelevantVariables = [
      'attorney_gender_suffix', 'attorney_name', 'family_member_name', 
      'doctor_name', 'caregiver_name', 'witness_name'
    ];
    return genderRelevantVariables.includes(variable);
  };

  const getVariableLabel = (variable: string): string => {
    const labels: Record<string, string> = {
      'attorney_gender_suffix': 'סיומת מגדר מיופה הכוח',
      'attorney_name': 'שם מיופה הכוח',
      'family_member_name': 'שם בן משפחה',
      'doctor_name': 'שם הרופא/ה',
      'caregiver_name': 'שם המטפל/ת',
      'witness_name': 'שם העד/ה',
      'property_address': 'כתובת הנכס',
      'bank_name': 'שם הבנק',
      'amount': 'סכום',
      'percentage': 'אחוז',
      'date': 'תאריך',
      'phone': 'טלפון',
      'address': 'כתובת'
    };
    return labels[variable] || variable;
  };

  // פונקציות עריכה ויצירה
  const handleEditSection = (section: AdvanceDirectivesSectionTemplate) => {
    setEditingSection(section);
  };

  const handleUpdateSection = (updatedSection: AdvanceDirectivesSectionTemplate) => {
    // עדכון במחסן (במקום אמיתי זה יהיה שמירה ל-localStorage או API)
    console.log('Updated section:', updatedSection);
    setEditingSection(null);
    alert('סעיף עודכן בהצלחה!');
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק את הסעיף?')) {
      // מחיקה מהמחסן (במקום אמיתי זה יהיה שמירה ל-localStorage או API)
      console.log('Deleted section:', sectionId);
      alert('סעיף נמחק בהצלחה!');
    }
  };

  const handleAddNewSection = () => {
    if (!newSection.title.trim() || !newSection.content.trim()) {
      alert('אנא מלא את כל השדות');
      return;
    }

    const section: AdvanceDirectivesSectionTemplate = {
      id: `custom-${Date.now()}`,
      category: newSection.category,
      subcategory: 'custom',
      title: newSection.title,
      titleEn: newSection.title,
      content: newSection.content,
      variables: extractVariablesFromContent(newSection.content),
      tags: ['מותאם אישית']
    };

    // הוספה למחסן (במקום אמיתי זה יהיה שמירה ל-localStorage או API)
    console.log('Added new section:', section);
    
    // איפוס הטופס
    setNewSection({
      title: '',
      content: '',
      category: 'property'
    });
    setShowAddSection(false);
    alert('סעיף נוסף בהצלחה!');
  };

  const handleMoveSection = (sectionId: string, newCategory: 'property' | 'personal' | 'medical') => {
    // העברת סעיף לקטגוריה אחרת (במקום אמיתי זה יהיה שמירה ל-localStorage או API)
    console.log(`Moved section ${sectionId} to category ${newCategory}`);
    alert('סעיף הועבר לקטגוריה בהצלחה!');
  };

  const handleSelectFromWarehouse = (section: AdvanceDirectivesSectionTemplate) => {
    // החלף מגדור בטקסט לפי מגדר מיופה הכוח הראשי
    const { replaceTextWithGender } = require('@/lib/hebrew-gender');
    const primaryAttorney = attorneys.find(a => a.isPrimary);
    const attorneyGender = primaryAttorney?.fullName ? 'male' : 'male'; // default to male
    
    const genderedContent = replaceTextWithGender(section.content, attorneyGender);
    
    // חלץ משתנים מהתוכן
    const variables = extractVariablesFromContent(genderedContent);
    
    // אם יש משתנים, פתח חלון למילוי
    if (variables.length > 0) {
      setVariablesModal({
        section: {
          ...section,
          content: genderedContent
        },
        values: variables.reduce((acc, v) => ({ ...acc, [v]: '' }), {}),
        genders: variables.reduce((acc, v) => ({ ...acc, [v]: 'male' as 'male' | 'female' }), {})
      });
    } else {
      // אם אין משתנים, הוסף ישירות
      setSelectedSections(prev => [...prev, {
        ...section,
        content: genderedContent
      }]);
      alert('סעיף נוסף מהמחסן!');
    }
  };

  // יצירת המסמך
  const handleGenerateDocument = () => {
    const documentData: UserDocumentData = {
      documentId: `DOC-${Date.now()}`,
      userId: 'current-user',
      userProfile: userProfile as UserProfile,
      attorneys,
      selectedModules,
      moduleData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'complete'
    };

    const doc = generateDocument(documentData);
    setGeneratedDocument(doc.html);
    setCurrentStep('preview');
  };

  // ייצוא HTML
  const exportHTML = () => {
    const blob = new Blob([generatedDocument], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `הנחיות-מקדימות-${userProfile.fullName || 'מסמך'}-${new Date().toLocaleDateString('he-IL')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // הדפסה/PDF
  const printPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <title>הנחיות מקדימות - ${userProfile.fullName || 'מסמך'}</title>
          <style>
            @page { margin: 2cm; size: A4; }
            body { font-family: 'David Libre', 'Times New Roman', serif; font-size: 14pt; line-height: 1.6; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${generatedDocument}
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* כותרת */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            הנחיות מקדימות בייפוי כוח מתמשך
          </h1>
          <p className="text-gray-600">
            מסמך מקיף המכיל 23 מודולים לניהול רכוש, חיים אישיים ובריאות
          </p>
        </div>

        {/* תפריט צעדים */}
        <div className="flex justify-center mb-8 space-x-reverse space-x-4">
          {[
            { key: 'profile', label: '1. פרטים אישיים' },
            { key: 'attorneys', label: '2. מיופי כוח' },
            { key: 'modules', label: '3. בחירת מודולים' },
            { key: 'preview', label: '4. תצוגה מקדימה' }
          ].map(step => (
            <button
              key={step.key}
              onClick={() => setCurrentStep(step.key as FormStep)}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                currentStep === step.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* צעד 1: פרטים אישיים */}
        {currentStep === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">פרטים אישיים</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  value={userProfile.fullName || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="דוד כהן"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">תעודת זהות</label>
                <input
                  type="text"
                  value={userProfile.idNumber || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, idNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">תאריך לידה</label>
                <input
                  type="date"
                  value={userProfile.birthDate || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, birthDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  גיל (מחושב אוטומטית): {userProfile.age || 0}
                </label>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">כתובת</label>
                <input
                  type="text"
                  value={userProfile.address || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="רחוב הרצל 10, תל אביב"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">טלפון</label>
                <input
                  type="tel"
                  value={userProfile.phone || ''}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">מצב משפחתי</label>
                <select
                  value={userProfile.maritalStatus || 'single'}
                  onChange={(e) => setUserProfile({ ...userProfile, maritalStatus: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="single">רווק/ה</option>
                  <option value="married">נשוי/אה</option>
                  <option value="divorced">גרוש/ה</option>
                  <option value="widowed">אלמן/ה</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">קופת חולים</label>
                <select
                  value={userProfile.healthFund || 'clalit'}
                  onChange={(e) => setUserProfile({ ...userProfile, healthFund: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="clalit">כללית</option>
                  <option value="maccabi">מכבי</option>
                  <option value="meuhedet">מאוחדת</option>
                  <option value="leumit">לאומית</option>
                </select>
              </div>
            </div>

            {/* שאלות מצב */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">מצב רכושי ובריאותי</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'hasRealEstate', label: 'יש לי נדל"ן' },
                  { key: 'hasBankAccounts', label: 'יש לי חשבונות בנק' },
                  { key: 'hasInvestments', label: 'יש לי השקעות' },
                  { key: 'hasVehicle', label: 'יש לי רכב' },
                  { key: 'hasPension', label: 'יש לי קופות פנסיה/גמל' },
                  { key: 'hasAllowances', label: 'אני מקבל/ת קצבאות' },
                  { key: 'hasChronicDiseases', label: 'יש לי מחלות כרוניות' },
                  { key: 'isDisabledVeteran', label: 'נכה צה"ל' }
                ].map(item => (
                  <label key={item.key} className="flex items-center space-x-reverse space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(userProfile as any)[item.key] || false}
                      onChange={(e) => setUserProfile({ ...userProfile, [item.key]: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep('attorneys')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                המשך לשלב הבא ←
              </button>
            </div>
          </div>
        )}

        {/* צעד 2: מיופי כוח */}
        {currentStep === 'attorneys' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">מיופי כוח</h2>

            {attorneys.map((attorney, index) => (
              <div key={index} className="border rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {attorney.isPrimary ? 'מיופה כוח ראשי' : `מיופה כוח מחליף ${index}`}
                  </h3>
                  {!attorney.isPrimary && (
                    <button
                      onClick={() => removeAttorney(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ הסר
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'fullName', label: 'שם מלא', placeholder: 'יוסי כהן' },
                    { key: 'idNumber', label: 'תעודת זהות', placeholder: '987654321' },
                    { key: 'relationship', label: 'יחס קרבה', placeholder: 'בן/בת' },
                    { key: 'phone', label: 'טלפון', placeholder: '052-9876543' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                      <input
                        type="text"
                        value={(attorney as any)[field.key]}
                        onChange={(e) => {
                          const newAttorneys = [...attorneys];
                          (newAttorneys[index] as any)[field.key] = e.target.value;
                          setAttorneys(newAttorneys);
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}

                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">כתובת</label>
                    <input
                      type="text"
                      value={attorney.address}
                      onChange={(e) => {
                        const newAttorneys = [...attorneys];
                        newAttorneys[index].address = e.target.value;
                        setAttorneys(newAttorneys);
                      }}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="רחוב דיזנגוף 50, תל אביב"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addAttorney}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600"
            >
              ➕ הוסף מיופה כוח מחליף
            </button>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('profile')}
                className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
              >
                → חזור
              </button>
              <button
                onClick={() => setCurrentStep('modules')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                המשך לבחירת מודולים ←
              </button>
            </div>
          </div>
        )}

        {/* צעד 3: בחירת מודולים */}
        {currentStep === 'modules' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">בחירת מודולים</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                💡 <strong>המערכת הציעה {suggestedModules.length} מודולים רלוונטיים</strong> על סמך הפרופיל שלך.
              </p>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowWarehouse(true)}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                <span>📚</span>
                מחסן סעיפים מתקדם
              </button>
              <button
                onClick={() => setCurrentStep('details')}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <span>✓</span>
                המשך לפרטים נוספים
              </button>
            </div>

            {['property', 'personal', 'medical'].map(category => {
              const categoryModules = getModulesByCategory(category as any);
              const categoryNames = {
                property: 'חלק א\': עניינים רכושיים',
                personal: 'חלק ב\': עניינים אישיים',
                medical: 'חלק ג\': עניינים רפואיים'
              };
              const categoryColors = {
                property: 'bg-green-100 border-green-300',
                personal: 'bg-blue-100 border-blue-300',
                medical: 'bg-red-100 border-red-300'
              };

              return (
                <div key={category} className={`border rounded-lg p-6 ${categoryColors[category as keyof typeof categoryColors]}`}>
                  <h3 className="text-xl font-bold mb-4">
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h3>

                  <div className="space-y-2">
                    {categoryModules.map((module: Module) => (
                      <label key={module.id} className="flex items-center space-x-reverse space-x-3 cursor-pointer bg-white p-3 rounded-lg hover:shadow">
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(module.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedModules([...selectedModules, module.id]);
                            } else {
                              if (module.isMandatory) {
                                alert('מודול זה חובה ולא ניתן להסירו');
                                return;
                              }
                              setSelectedModules(selectedModules.filter(id => id !== module.id));
                            }
                          }}
                          disabled={module.isMandatory}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <span className="font-bold">{module.nameHe}</span>
                          {module.isMandatory && <span className="text-red-600 text-sm mr-2">(חובה)</span>}
                          {module.description && (
                            <p className="text-sm text-gray-600">{module.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('attorneys')}
                className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
              >
                → חזור
              </button>
              <button
                onClick={handleGenerateDocument}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
              >
                🎯 צור מסמך ←
              </button>
            </div>
          </div>
        )}

        {/* צעד 4: תצוגה מקדימה */}
        {currentStep === 'preview' && generatedDocument && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">תצוגה מקדימה</h2>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                📄 <strong>המסמך נוצר בהצלחה!</strong>
                <br />
                המסמך כולל {selectedModules.length} מודולים מותאמים אישית.
              </p>
            </div>

            {/* תצוגה */}
            <div className="border rounded-lg p-8 bg-white shadow-inner max-h-96 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: generatedDocument }} />
            </div>

            {/* כפתורי ייצוא */}
            <div className="flex justify-center space-x-reverse space-x-4 mt-6">
              <button 
                onClick={exportHTML}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                💾 שמור HTML
              </button>
              <button 
                onClick={printPDF}
                className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
              >
                🖨️ הדפס/PDF
              </button>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('modules')}
                className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
              >
                → חזור לעריכה
              </button>
            </div>
          </div>
        )}

        {/* מחסן סעיפים */}
        {showWarehouse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  📚 מחסן סעיפים להנחיות מקדימות
                </h3>
                <button
                  onClick={() => setShowWarehouse(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <button
                  onClick={() => setShowAddSection(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <span>➕</span>
                  הוסף סעיף חדש
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['property', 'personal', 'medical'].map(category => {
                  const categorySections = advanceDirectivesSectionsWarehouse.filter(s => s.category === category);
                  const categoryNames = {
                    property: 'עניינים רכושיים',
                    personal: 'עניינים אישיים', 
                    medical: 'עניינים רפואיים'
                  };
                  const categoryColors = {
                    property: 'bg-green-50 border-green-200',
                    personal: 'bg-blue-50 border-blue-200',
                    medical: 'bg-red-50 border-red-200'
                  };

                  return (
                    <div key={category} className={`border rounded-lg p-4 ${categoryColors[category as keyof typeof categoryColors]}`}>
                      <h4 className="text-lg font-bold mb-4 text-center">
                        {categoryNames[category as keyof typeof categoryNames]}
                      </h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {categorySections.map(section => (
                          <div key={section.id} className="bg-white rounded-lg p-3 border">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-sm">{section.title}</h5>
                              <select
                                value={section.category}
                                onChange={(e) => {
                                  const newCategory = e.target.value as 'property' | 'personal' | 'medical';
                                  handleMoveSection(section.id, newCategory);
                                }}
                                className="text-xs px-2 py-1 rounded border-0 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                title="העבר לקטגוריה אחרת"
                              >
                                <option value="property">רכושי</option>
                                <option value="personal">אישי</option>
                                <option value="medical">רפואי</option>
                              </select>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                              {section.content.substring(0, 100)}...
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSelectFromWarehouse(section)}
                                className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition"
                              >
                                הוסף
                              </button>
                              <button
                                onClick={() => handleEditSection(section)}
                                className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                title="ערוך סעיף"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteSection(section.id)}
                                className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                                title="מחק סעיף"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-bold mb-4">סעיפים שנבחרו ({selectedSections.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedSections.map((section, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{section.title}</span>
                        <span className="text-sm text-gray-500 ml-2">({section.category})</span>
                      </div>
                      <button
                        onClick={() => setSelectedSections(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕ הסר
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* חלון מילוי משתנים */}
        {variablesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                השלמת פרטים לסעיף: {variablesModal.section.title}
              </h3>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 טיפ:</p>
                <p>למשתנים של אנשים (שמות) יש אפשרות לבחור מגדר. זה יעזור להציג את הטקסט הנכון (זכר/נקבה) במסמך.</p>
              </div>
              
              <div className="space-y-4 mb-6">
                {variablesModal.section.variables.map((variable) => (
                  <div key={variable} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {getVariableLabel(variable)}:
                    </label>
                    <input
                      type="text"
                      value={variablesModal.values[variable] || ''}
                      onChange={(e) => {
                        setVariablesModal(prev => ({
                          ...prev!,
                          values: {
                            ...prev!.values,
                            [variable]: e.target.value
                          }
                        }));
                      }}
                      placeholder={`הזן ${getVariableLabel(variable)}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      dir="rtl"
                    />
                    
                    {/* בחירת מגדר למשתנים רלוונטיים */}
                    {isGenderRelevantVariable(variable) && (
                      <div className="flex gap-4 items-center">
                        <label className="text-sm text-gray-600">מגדר:</label>
                        <div className="flex gap-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`gender_${variable}`}
                              value="male"
                              checked={variablesModal.genders[variable] === 'male'}
                              onChange={(e) => {
                                setVariablesModal(prev => ({
                                  ...prev!,
                                  genders: {
                                    ...prev!.genders,
                                    [variable]: e.target.value as 'male' | 'female'
                                  }
                                }));
                              }}
                              className="text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm">זכר</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`gender_${variable}`}
                              value="female"
                              checked={variablesModal.genders[variable] === 'female'}
                              onChange={(e) => {
                                setVariablesModal(prev => ({
                                  ...prev!,
                                  genders: {
                                    ...prev!.genders,
                                    [variable]: e.target.value as 'male' | 'female'
                                  }
                                }));
                              }}
                              className="text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm">נקבה</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setVariablesModal(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  ביטול
                </button>
                <button
                  onClick={() => {
                    // החלפת משתנים בתוכן עם התחשבות במגדר
                    let finalContent = variablesModal.section.content;
                    Object.keys(variablesModal.values).forEach(key => {
                      const value = variablesModal.values[key];
                      let replacedValue = value;
                      
                      // אם זה משתנה שדורש מגדר, החלף את הטקסט בהתאם
                      if (isGenderRelevantVariable(key) && variablesModal.genders[key]) {
                        const { replaceTextWithGender } = require('@/lib/hebrew-gender');
                        replacedValue = replaceTextWithGender(value, variablesModal.genders[key]);
                      }
                      
                      finalContent = finalContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), replacedValue);
                    });

                    // הוספה לסעיפים נבחרים
                    setSelectedSections(prev => [...prev, {
                      ...variablesModal.section,
                      content: finalContent
                    }]);

                    setVariablesModal(null);
                  }}
                  disabled={!Object.values(variablesModal.values).every(v => v.trim() !== '')}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  הוסף סעיף
                </button>
              </div>
            </div>
          </div>
        )}

        {/* חלון יצירת סעיף חדש */}
        {showAddSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">הוספת סעיף חדש</h3>
              
              <div className="space-y-4 mb-6">
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
                    onChange={(e) => setNewSection(prev => ({ ...prev, category: e.target.value as 'property' | 'personal' | 'medical' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="property">עניינים רכושיים</option>
                    <option value="personal">עניינים אישיים</option>
                    <option value="medical">עניינים רפואיים</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תוכן הסעיף:</label>
                  <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold mb-1">💡 טיפים לכתיבה:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>משתנים:</strong> השתמש ב-{`{{שם_משתנה}}`} למידע שישתנה (למשל: {`{{attorney_name}}`})</li>
                      <li><strong>זכר/נקבה:</strong> השתמש ב-<code>/ת</code> <code>/ה</code> <code>/ים</code> (למשל: ממנה/ים, תושב/ת, יוכל/תוכל)</li>
                      <li><strong>דוגמה:</strong> "אני ממנה/ים את {`{{attorney_name}}`}, תושב/ת {`{{address}}`}"</li>
                    </ul>
                  </div>
                  <textarea
                    value={newSection.content}
                    onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    placeholder="כתבי את תוכן הסעיף כאן..."
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddSection(false);
                    setNewSection({ title: '', content: '', category: 'property' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  ביטול
                </button>
                <button
                  onClick={handleAddNewSection}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  הוסף סעיף
                </button>
              </div>
            </div>
          </div>
        )}

        {/* חלון עריכת סעיף */}
        {editingSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">עריכת סעיף: {editingSection.title}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הסעיף:</label>
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) => setEditingSection(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תוכן הסעיף:</label>
                  <textarea
                    value={editingSection.content}
                    onChange={(e) => setEditingSection(prev => prev ? { ...prev, content: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={8}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingSection(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  ביטול
                </button>
                <button
                  onClick={() => editingSection && handleUpdateSection(editingSection)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  שמור שינויים
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

