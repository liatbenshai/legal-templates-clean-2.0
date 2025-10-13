'use client';

import { useState } from 'react';
import RepeatableFieldGroup from '../RepeatableFieldGroup';
import { FileText, Users, Building2, Home } from 'lucide-react';

/**
 * מודול ייעודי לצו ירושה
 * מודולרי, עצמאי, קל לשינוי
 */

interface InheritanceOrderProps {
  onGenerate: (document: any) => void;
}

export default function InheritanceOrder({ onGenerate }: InheritanceOrderProps) {
  const [basicInfo, setBasicInfo] = useState({
    deceasedName: '',
    deathDate: '',
    idNumber: '',
    deathPlace: '',
  });

  const [heirs, setHeirs] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  const generateDocument = () => {
    // יצירת המסמך המלא
    const document = {
      type: 'inheritance-order',
      title: `צו ירושה - ${basicInfo.deceasedName}`,
      basicInfo,
      heirs,
      assets,
      bankAccounts,
      generatedAt: new Date().toISOString(),
    };

    onGenerate(document);
  };

  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          צו ירושה
        </h1>
        <p className="text-gray-600">
          מלא את הפרטים הבאים ליצירת צו ירושה מלא ומקצועי
        </p>
      </div>

      {/* פרטים בסיסיים */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">פרטי המנוח/ה</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={basicInfo.deceasedName}
              onChange={(e) => setBasicInfo({ ...basicInfo, deceasedName: e.target.value })}
              placeholder="לדוגמה: ישראל ישראלי"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-base"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תעודת זהות <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={basicInfo.idNumber}
              onChange={(e) => setBasicInfo({ ...basicInfo, idNumber: e.target.value })}
              placeholder="123456789"
              maxLength={9}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-base"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תאריך פטירה <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={basicInfo.deathDate}
              onChange={(e) => setBasicInfo({ ...basicInfo, deathDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-base"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מקום פטירה
            </label>
            <input
              type="text"
              value={basicInfo.deathPlace}
              onChange={(e) => setBasicInfo({ ...basicInfo, deathPlace: e.target.value })}
              placeholder="לדוגמה: ירושלים"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-base"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>
      </section>

      {/* יורשים - טבלה דינמית */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-bold text-gray-900">יורשים</h2>
        </div>
        
        <RepeatableFieldGroup
          groupName="יורשים"
          fields={[
            { id: '1', name: 'שם_יורש', type: 'text', placeholder: 'שם מלא' },
            { id: '2', name: 'תעודת_זהות', type: 'id-number', placeholder: '123456789' },
            { id: '3', name: 'קרבה', type: 'text', placeholder: 'בן/בת/בן זוג' },
            { id: '4', name: 'חלק_בירושה', type: 'text', placeholder: '50%' },
          ]}
          minRows={1}
          maxRows={20}
          onChange={setHeirs}
        />
      </section>

      {/* נכסים - טבלה דינמית */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-6 h-6 text-green-700" />
          <h2 className="text-xl font-bold text-gray-900">נכסים</h2>
        </div>
        
        <RepeatableFieldGroup
          groupName="נכסים"
          fields={[
            { id: '1', name: 'סוג_נכס', type: 'text', placeholder: 'דירה/מגרש/רכב' },
            { id: '2', name: 'תיאור', type: 'text', placeholder: 'כתובת או פרטים' },
            { id: '3', name: 'שווי_משוער', type: 'number', placeholder: '1000000' },
          ]}
          minRows={0}
          maxRows={50}
          onChange={setAssets}
        />
      </section>

      {/* חשבונות בנק - טבלה דינמית */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-6 h-6 text-purple-700" />
          <h2 className="text-xl font-bold text-gray-900">חשבונות בנק</h2>
        </div>
        
        <RepeatableFieldGroup
          groupName="חשבונות בנק"
          fields={[
            { id: '1', name: 'שם_בנק', type: 'text', placeholder: 'בנק הפועלים' },
            { id: '2', name: 'מספר_חשבון', type: 'number', placeholder: '123456' },
            { id: '3', name: 'מספר_סניף', type: 'number', placeholder: '789' },
            { id: '4', name: 'יתרה_משוערת', type: 'number', placeholder: '50000' },
          ]}
          minRows={0}
          maxRows={20}
          onChange={setBankAccounts}
        />
      </section>

      {/* כפתור יצירה */}
      <div className="flex justify-center pt-6 border-t">
        <button
          onClick={generateDocument}
          disabled={!basicInfo.deceasedName || !basicInfo.deathDate || heirs.length === 0}
          className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-primary transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl"
        >
          <FileText className="w-6 h-6" />
          <span>צור צו ירושה מלא</span>
        </button>
      </div>

      {/* הנחיות */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900">
        <p className="font-bold mb-2">⚠️ שים לב:</p>
        <ul className="space-y-1 mr-4">
          <li>• חובה למלא את פרטי המנוח/ה ולפחות יורש אחד</li>
          <li>• הנכסים וחשבונות הבנק הם אופציונליים</li>
          <li>• וודא שסכום אחוזי הירושה מסתכם ל-100%</li>
          <li>• המסמך ייווצר אוטומטית עם כל הטבלאות</li>
        </ul>
      </div>
    </div>
  );
}
