'use client';

import { useState, useEffect } from 'react';
import AdvanceDirectivesWarehouse from './AdvanceDirectivesWarehouse';

interface Attorney {
  fullName: string;
  idNumber: string;
  relationship: string;
  address: string;
  phone: string;
  gender: 'male' | 'female';
}

interface CustomSection {
  title: string;
  content: string;
}

export default function AdvanceDirectivesDocumentClean() {
  const [principal, setPrincipal] = useState({
    fullName: '',
    idNumber: '',
    birthDate: '',
    address: '',
    phone: '',
    maritalStatus: 'single' as const
  });

  const [attorneys, setAttorneys] = useState<Attorney[]>([{
    fullName: '',
    idNumber: '',
    relationship: '',
    address: '',
    phone: '',
    gender: 'male'
  }]);

  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [showWarehouse, setShowWarehouse] = useState(true);

  // שמירה אוטומטית
  useEffect(() => {
    const saved = localStorage.getItem('advanceDirectivesDraft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.principal) setPrincipal(data.principal);
        if (data.attorneys) setAttorneys(data.attorneys);
        if (data.sections) setCustomSections(data.sections);
      } catch (e) {
        console.error('Error loading:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('advanceDirectivesDraft', JSON.stringify({
      principal,
      attorneys,
      sections: customSections,
      lastSaved: new Date().toISOString()
    }));
  }, [principal, attorneys, customSections]);

  return (
    <div className="max-w-7xl mx-auto p-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            הנחיות מקדימות בייפוי כוח מתמשך
          </h1>
          <p className="text-gray-600">צור מסמך עם סעיפים מוכנים</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            <span>💾 שמירה אוטומטית פעילה</span>
          </div>
        </div>

        {/* פרטי ממנה */}
        <section className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">👤 פרטי הממנה</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={principal.fullName}
              onChange={(e) => setPrincipal({...principal, fullName: e.target.value})}
              className="px-4 py-2 border rounded"
              placeholder="שם מלא"
            />
            <input
              type="text"
              value={principal.idNumber}
              onChange={(e) => setPrincipal({...principal, idNumber: e.target.value})}
              className="px-4 py-2 border rounded"
              placeholder="תעודת זהות"
            />
          </div>
        </section>

        {/* מחסן */}
        <section className="bg-indigo-50 p-6 rounded-lg">
          <button
            onClick={() => setShowWarehouse(!showWarehouse)}
            className="w-full mb-4 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold"
          >
            📚 {showWarehouse ? 'הסתר' : 'הצג'} מחסן סעיפים
          </button>
          
          {showWarehouse && (
            <AdvanceDirectivesWarehouse
              onAddSection={(content: string, title: string) => {
                setCustomSections([...customSections, { title, content }]);
              }}
              attorneyGender={attorneys[0]?.gender || 'male'}
            />
          )}
        </section>

        {/* סעיפים שנוספו */}
        {customSections.length > 0 && (
          <section className="bg-yellow-50 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-bold mb-4">
              ✅ סעיפים במסמך ({customSections.length})
            </h2>
            {customSections.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border mb-3">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">{section.title}</h4>
                    <div className="text-sm whitespace-pre-wrap text-gray-700">
                      {section.content}
                    </div>
                  </div>
                  <div className="mr-4 flex gap-2">
                    <button
                      onClick={() => alert('✨ AI - תכונה זו תהיה זמינה בקרוב!\n\nכרגע תוכלי לערוך את הטקסט ידנית.')}
                      className="px-3 py-1 border border-purple-300 rounded text-purple-600 hover:bg-purple-50 text-sm"
                    >
                      ✨ AI
                    </button>
                    <button
                      onClick={() => setCustomSections(customSections.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

