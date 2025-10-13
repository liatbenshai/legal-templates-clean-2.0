'use client';

import { useState, useEffect } from 'react';
import AdvanceDirectivesWarehouse from './AdvanceDirectivesWarehouse';
import ProfessionalWordExporter from './ProfessionalWordExporter';
import SimpleAIImprover from './SimpleAIImprover';
import { applyGenderToText } from '@/lib/hebrew-gender';

interface Attorney {
  fullName: string;
  idNumber: string;
  relationship: string;
  address: string;
  phone: string;
  gender: 'male' | 'female'; // הוספת שדה מגדר
}

interface CustomSection {
  title: string;
  content: string;
}

export default function AdvanceDirectivesDocument() {
  // פרטי ממנה
  const [principal, setPrincipal] = useState({
    fullName: '',
    idNumber: '',
    birthDate: '',
    address: '',
    phone: '',
    maritalStatus: 'single' as 'single' | 'married' | 'divorced' | 'widowed',
    gender: 'male' as 'male' | 'female' // הוספת מגדר לממנה
  });

  // מגדר מיופה כוח (לנטיות)
  const [attorneyGender, setAttorneyGender] = useState<'male' | 'female'>('male');

  // מיופי כוח
  const [attorneys, setAttorneys] = useState<Attorney[]>([
    {
      fullName: '',
      idNumber: '',
      relationship: '',
      address: '',
      phone: '',
      gender: 'male' // ברירת מחדל
    }
  ]);

  // סעיפים שנוספו
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  
  // הצגת מחסן
  const [showWarehouse, setShowWarehouse] = useState(true);

  // AI Improver
  const [showAI, setShowAI] = useState(false);
  const [editingSection, setEditingSection] = useState<number | null>(null);

  // טעינה מ-localStorage
  useEffect(() => {
    const saved = localStorage.getItem('advanceDirectivesDraft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.principal) setPrincipal(data.principal);
        if (data.attorneys) setAttorneys(data.attorneys);
        if (data.sections) setCustomSections(data.sections);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // שמירה אוטומטית ל-localStorage
  useEffect(() => {
    const draftData = {
      principal,
      attorneys,
      sections: customSections,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('advanceDirectivesDraft', JSON.stringify(draftData));
  }, [principal, attorneys, customSections]);

  // הוספת מיופה כוח
  const addAttorney = () => {
    setAttorneys([...attorneys, {
      fullName: '',
      idNumber: '',
      relationship: '',
      address: '',
      phone: '',
      gender: 'male' // ברירת מחדל
    }]);
  };

  // מחיקת מיופה כוח
  const removeAttorney = (index: number) => {
    if (attorneys.length > 1) {
      setAttorneys(attorneys.filter((_, i) => i !== index));
    }
  };

  // מחיקת סעיף
  const removeSection = (index: number) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
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
            צור מסמך מותאם אישית עם סעיפים מוכנים ממחסן
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            <span>💾</span>
            <span className="font-medium">שמירה אוטומטית פעילה</span>
          </div>
        </div>

        {/* פרטי ממנה */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">👤 פרטי הממנה</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">שם מלא</label>
              <input
                type="text"
                value={principal.fullName}
                onChange={(e) => setPrincipal({ ...principal, fullName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="דוד כהן"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">תעודת זהות</label>
              <input
                type="text"
                value={principal.idNumber}
                onChange={(e) => setPrincipal({ ...principal, idNumber: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">תאריך לידה</label>
              <input
                type="date"
                value={principal.birthDate}
                onChange={(e) => setPrincipal({ ...principal, birthDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">מצב משפחתי</label>
              <select
                value={principal.maritalStatus}
                onChange={(e) => setPrincipal({ ...principal, maritalStatus: e.target.value as any })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="single">רווק/ה</option>
                <option value="married">נשוי/אה</option>
                <option value="divorced">גרוש/ה</option>
                <option value="widowed">אלמן/ה</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">כתובת</label>
              <input
                type="text"
                value={principal.address}
                onChange={(e) => setPrincipal({ ...principal, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="רחוב הרצל 10, תל אביב"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">טלפון</label>
              <input
                type="tel"
                value={principal.phone}
                onChange={(e) => setPrincipal({ ...principal, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="050-1234567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">מגדר הממנה</label>
              <select
                value={principal.gender}
                onChange={(e) => setPrincipal({ ...principal, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-4 py-2 border rounded-lg font-bold"
              >
                <option value="male">זכר</option>
                <option value="female">נקבה</option>
              </select>
            </div>
          </div>
        </section>

        {/* מיופי כוח */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">✍️ מיופי כוח</h2>
            
            {/* בחירת מגדר לנטיות */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-medium">מגדר לנטיות:</span>
              <button
                onClick={() => setAttorneyGender('male')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  attorneyGender === 'male'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                זכר
              </button>
              <button
                onClick={() => setAttorneyGender('female')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  attorneyGender === 'female'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                נקבה
              </button>
            </div>
          </div>

          {attorneys.map((attorney, index) => (
            <div key={index} className="bg-white p-4 rounded-lg mb-4 border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">
                  {index === 0 ? 'מיופה כוח ראשי' : `מיופה כוח מחליף ${index}`}
                </h3>
                {index > 0 && (
                  <button
                    onClick={() => removeAttorney(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ הסר
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={attorney.fullName}
                  onChange={(e) => {
                    const newAttorneys = [...attorneys];
                    newAttorneys[index].fullName = e.target.value;
                    setAttorneys(newAttorneys);
                  }}
                  className="px-3 py-2 border rounded"
                  placeholder="שם מלא"
                />
                <input
                  type="text"
                  value={attorney.idNumber}
                  onChange={(e) => {
                    const newAttorneys = [...attorneys];
                    newAttorneys[index].idNumber = e.target.value;
                    setAttorneys(newAttorneys);
                  }}
                  className="px-3 py-2 border rounded"
                  placeholder="ת.ז"
                />
                
                {/* בחירת מגדר */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">מגדר</label>
                  <select
                    value={attorney.gender}
                    onChange={(e) => {
                      const newAttorneys = [...attorneys];
                      newAttorneys[index].gender = e.target.value as 'male' | 'female';
                      setAttorneys(newAttorneys);
                    }}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="male">זכר</option>
                    <option value="female">נקבה</option>
                  </select>
                </div>

                <input
                  type="text"
                  value={attorney.relationship}
                  onChange={(e) => {
                    const newAttorneys = [...attorneys];
                    newAttorneys[index].relationship = e.target.value;
                    setAttorneys(newAttorneys);
                  }}
                  className="px-3 py-2 border rounded"
                  placeholder={attorney.gender === 'male' ? 'יחס קרבה (בן, אח)' : 'יחס קרבה (בת, אחות)'}
                />
                <input
                  type="tel"
                  value={attorney.phone}
                  onChange={(e) => {
                    const newAttorneys = [...attorneys];
                    newAttorneys[index].phone = e.target.value;
                    setAttorneys(newAttorneys);
                  }}
                  className="px-3 py-2 border rounded"
                  placeholder="טלפון"
                />
                <input
                  type="text"
                  value={attorney.address}
                  onChange={(e) => {
                    const newAttorneys = [...attorneys];
                    newAttorneys[index].address = e.target.value;
                    setAttorneys(newAttorneys);
                  }}
                  className="col-span-2 px-3 py-2 border rounded"
                  placeholder="כתובת"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addAttorney}
            className="w-full px-4 py-3 border-2 border-dashed border-green-300 rounded-lg text-green-700 hover:border-green-500 hover:bg-green-50"
          >
            ➕ הוסף מיופה כוח מחליף
          </button>
        </section>

        {/* מחסן הסעיפים */}
        <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📖</span>
              מחסן סעיפים
            </h2>
            <button
              onClick={() => setShowWarehouse(!showWarehouse)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              📚 {showWarehouse ? 'הסתר מחסן' : 'הצג מחסן'}
            </button>
          </div>
          
          {showWarehouse && (
            <AdvanceDirectivesWarehouse
              onAddSection={(content, title) => {
                setCustomSections([...customSections, { title, content }]);
              }}
              attorneyGender={attorneys[0]?.gender || 'male'}
            />
          )}
        </section>

        {/* סעיפים שנוספו */}
        {customSections.length > 0 && (
          <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ✅ סעיפים שנוספו למסמך ({customSections.length})
            </h2>

            <div className="space-y-4">
              {customSections.map((section, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">{section.title}</h4>
                      
                      {editingSection === index && showAI ? (
                        <div className="mb-4">
                          <SimpleAIImprover
                            initialText={section.content}
                            onAccept={(improved) => {
                              const updated = [...customSections];
                              updated[index].content = improved;
                              setCustomSections(updated);
                              setShowAI(false);
                              setEditingSection(null);
                            }}
                            placeholder="ערוך את הטקסט ולחץ על שיפור"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-700 text-sm whitespace-pre-wrap">
                          {(() => {
                            let processedContent = section.content;
                            
                            // החלפת משתני מגדר
                            if (principal.gender === 'female') {
                              processedContent = processedContent.replace(/\{\{principal_gender_suffix\}\}/g, 'ת');
                              processedContent = processedContent.replace(/\{\{attorney_gender_suffix\}\}/g, 'ת');
                            } else {
                              processedContent = processedContent.replace(/\{\{principal_gender_suffix\}\}/g, '');
                              processedContent = processedContent.replace(/\{\{attorney_gender_suffix\}\}/g, '');
                            }
                            
                            // התאמת כל התוכן למגדר
                            processedContent = applyGenderToText(processedContent, attorneys[0]?.gender || principal.gender);
                            
                            return processedContent;
                          })()}
                        </div>
                      )}
                    </div>
                    <div className="mr-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingSection(index);
                          setShowAI(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 px-3 py-1 border border-purple-300 rounded hover:bg-purple-50 transition text-sm"
                        title="שפר עם AI"
                      >
                        ✨ AI
                      </button>
                      <button
                        onClick={() => removeSection(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* כפתורי פעולה */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
            👁️ תצוגה מקדימה
          </button>
          <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">
            💾 שמור טיוטה
          </button>
        </div>
        
        {/* ייצוא מקצועי */}
        <div className="mt-8">
          <ProfessionalWordExporter
            willData={{
              type: 'advance-directives',
              testator: principal,
              attorneys,
              customSections,
              attorneyGender: attorneys[0]?.gender || 'male'
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

