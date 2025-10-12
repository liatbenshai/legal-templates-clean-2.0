'use client';

import { useState } from 'react';
import { FileText, Users, Heart } from 'lucide-react';
import RepeatableFieldGroup from '../RepeatableFieldGroup';
import SignatureList from '../SignatureList';
import { SignatureData } from '../SignatureBlock';
import GenderSelector from '../GenderSelector';
import type { Gender } from '@/lib/hebrew-gender';

/**
 * מודול צוואה הדדית
 * לבני זוג שמצווים זה לזה
 */

interface MutualWillProps {
  onGenerate: (document: any) => void;
}

export default function MutualWill({ onGenerate }: MutualWillProps) {
  const [spouse1, setSpouse1] = useState({
    name: '',
    idNumber: '',
    address: '',
    birthDate: '',
    gender: 'male' as Gender,
  });

  const [spouse2, setSpouse2] = useState({
    name: '',
    idNumber: '',
    address: '',
    birthDate: '',
    gender: 'female' as Gender,
  });

  const [sharedAssets, setSharedAssets] = useState<any[]>([]);
  const [alternateHeirs, setAlternateHeirs] = useState<any[]>([]);
  const [mutualConditions, setMutualConditions] = useState('');
  const [cancelationRules, setCancelationRules] = useState('');
  
  const [signatures, setSignatures] = useState<SignatureData[]>([
    {
      id: 'spouse1',
      signerName: '',
      signerRole: 'בן זוג 1',
      date: new Date().toISOString().split('T')[0],
      signatureType: 'text',
    },
    {
      id: 'spouse2',
      signerName: '',
      signerRole: 'בן זוג 2',
      date: new Date().toISOString().split('T')[0],
      signatureType: 'text',
    },
  ]);

  const generateDocument = () => {
    const document = {
      type: 'will-mutual',
      title: `צוואה הדדית - ${spouse1.name} ו-${spouse2.name}`,
      spouse1,
      spouse2,
      sharedAssets,
      alternateHeirs,
      mutualConditions,
      cancelationRules,
      signatures,
      generatedAt: new Date().toISOString(),
    };

    onGenerate(document);
  };

  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
      {/* כותרת */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500" />
          צוואה הדדית
        </h1>
        <p className="text-gray-600">
          צוואה משותפת של בני זוג שמצווים זה לזה
        </p>
      </div>

      {/* בן זוג 1 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">בן/בת זוג ראשון/ה</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={spouse1.name}
              onChange={(e) => setSpouse1({ ...spouse1, name: e.target.value })}
              placeholder="שם פרטי ומשפחה"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
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
              value={spouse1.idNumber}
              onChange={(e) => setSpouse1({ ...spouse1, idNumber: e.target.value })}
              placeholder="123456789"
              maxLength={9}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>

        <GenderSelector
          value={spouse1.gender}
          onChange={(gender) => setSpouse1({ ...spouse1, gender })}
          label="מגדר"
          showOrganization={false}
          size="small"
        />
      </section>

      {/* בן זוג 2 */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg border-2 border-pink-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">בן/בת זוג שני/ה</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={spouse2.name}
              onChange={(e) => setSpouse2({ ...spouse2, name: e.target.value })}
              placeholder="שם פרטי ומשפחה"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
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
              value={spouse2.idNumber}
              onChange={(e) => setSpouse2({ ...spouse2, idNumber: e.target.value })}
              placeholder="123456789"
              maxLength={9}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>

        <GenderSelector
          value={spouse2.gender}
          onChange={(gender) => setSpouse2({ ...spouse2, gender })}
          label="מגדר"
          showOrganization={false}
          size="small"
        />
      </section>

      {/* נכסים משותפים */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
        <RepeatableFieldGroup
          groupName="נכסים משותפים"
          fields={[
            { id: '1', name: 'סוג_נכס', type: 'text', placeholder: 'דירה/חשבון/אחר' },
            { id: '2', name: 'תיאור', type: 'text', placeholder: 'פרטים מזהים' },
            { id: '3', name: 'שווי', type: 'number', placeholder: '1000000' },
          ]}
          minRows={0}
          maxRows={50}
          onChange={setSharedAssets}
        />
      </section>

      {/* יורשים חלופיים */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">יורשים חלופיים</h2>
          <p className="text-sm text-gray-600">במקרה ששני בני הזוג נפטרו</p>
        </div>
        
        <RepeatableFieldGroup
          groupName="יורשים"
          fields={[
            { id: '1', name: 'שם', type: 'text', placeholder: 'שם מלא' },
            { id: '2', name: 'תעודת_זהות', type: 'id-number', placeholder: '123456789' },
            { id: '3', name: 'קרבה', type: 'text', placeholder: 'בן/בת' },
            { id: '4', name: 'חלק', type: 'text', placeholder: '50%' },
          ]}
          minRows={0}
          maxRows={20}
          onChange={setAlternateHeirs}
        />
      </section>

      {/* תנאים הדדיים */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">תנאים הדדיים</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תנאים ואופן הירושה ההדדית
            </label>
            <textarea
              value={mutualConditions}
              onChange={(e) => setMutualConditions(e.target.value)}
              placeholder="תנאים למקרה שאחד הצדדים נפטר, זכויות בן הזוג החי..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כללי ביטול
            </label>
            <textarea
              value={cancelationRules}
              onChange={(e) => setCancelationRules(e.target.value)}
              placeholder="תנאים לביטול הצוואה ההדדית (גירושין, נישואין מחדש...)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
            />
          </div>
        </div>
      </section>

      {/* חתימות בני הזוג + עדים */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <SignatureList
          signatures={signatures}
          onChange={setSignatures}
          minSignatures={2}
          maxSignatures={6}
          title="חתימות (שני בני הזוג + עדים)"
        />
        <div className="mt-3 text-sm text-gray-600">
          💡 נדרש: שני בני הזוג + מינימום 2 עדים
        </div>
      </section>

      {/* כפתור יצירה */}
      <div className="flex justify-center pt-6 border-t">
        <button
          onClick={generateDocument}
          disabled={
            !spouse1.name || !spouse1.idNumber ||
            !spouse2.name || !spouse2.idNumber
          }
          className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl"
        >
          <Heart className="w-6 h-6" />
          <span>צור צוואה הדדית מלאה</span>
        </button>
      </div>

      {/* הנחיות */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-bold mb-2">ℹ️ מה זה צוואה הדדית:</p>
        <ul className="space-y-1 mr-4">
          <li>• צוואה שבה כל צד מצווה את נכסיו לצד השני</li>
          <li>• תקפה כל עוד שני הצדדים בחיים</li>
          <li>• במקרה של גירושין - הצוואה מתבטלת אוטומטית (בדרך כלל)</li>
          <li>• ניתן להוסיף יורשים חלופיים למקרה ששניהם נפטרים</li>
          <li>• חובה חתימת שני בני הזוג + עדים</li>
        </ul>
      </div>
    </div>
  );
}
