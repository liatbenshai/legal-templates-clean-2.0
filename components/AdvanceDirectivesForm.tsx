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
      </div>
    </div>
  );
}

