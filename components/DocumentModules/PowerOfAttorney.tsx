'use client';

import { useState } from 'react';
import { FileSignature } from 'lucide-react';
import SignatureList from '../SignatureList';
import { SignatureData } from '../SignatureBlock';
import GenderSelector from '../GenderSelector';
import type { Gender } from '@/lib/hebrew-gender';

/**
 * מודול ייפוי כוח
 */

export default function PowerOfAttorney({ onGenerate }: { onGenerate: (doc: any) => void }) {
  const [grantor, setGrantor] = useState({
    name: '',
    idNumber: '',
    address: '',
    gender: 'male' as Gender,
  });

  const [attorney, setAttorney] = useState({
    name: '',
    idNumber: '',
    address: '',
  });

  const [scope, setScope] = useState('');
  const [powers, setPowers] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [revocable, setRevocable] = useState(true);
  
  const [signatures, setSignatures] = useState<SignatureData[]>([]);

  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileSignature className="w-8 h-8 text-primary" />
          ייפוי כוח
        </h1>
      </div>

      {/* הממנה */}
      <section className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h2 className="text-xl font-bold mb-4">פרטי הממנה</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={grantor.name}
            onChange={(e) => setGrantor({ ...grantor, name: e.target.value })}
            placeholder="שם מלא *"
            className="px-4 py-3 border rounded-lg"
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
          <input
            type="text"
            value={grantor.idNumber}
            onChange={(e) => setGrantor({ ...grantor, idNumber: e.target.value })}
            placeholder="ת.ז *"
            maxLength={9}
            className="px-4 py-3 border rounded-lg"
            dir="ltr"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </div>
        <GenderSelector
          value={grantor.gender}
          onChange={(gender) => setGrantor({ ...grantor, gender })}
          showOrganization={true}
          size="small"
        />
      </section>

      {/* מיופה הכוח */}
      <section className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
        <h2 className="text-xl font-bold mb-4">מיופה הכוח</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={attorney.name}
            onChange={(e) => setAttorney({ ...attorney, name: e.target.value })}
            placeholder="שם מלא *"
            className="px-4 py-3 border rounded-lg"
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
          <input
            type="text"
            value={attorney.idNumber}
            onChange={(e) => setAttorney({ ...attorney, idNumber: e.target.value })}
            placeholder="ת.ז *"
            maxLength={9}
            className="px-4 py-3 border rounded-lg"
            dir="ltr"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </div>
      </section>

      {/* תחום */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">תחום ייפוי הכוח</h2>
        <textarea
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder="לדוגמה: ניהול חשבונות בנק, מכירת נכסים, ייצוג משפטי..."
          rows={4}
          className="w-full px-4 py-2 border rounded-lg"
          dir="rtl"
          style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
        />
      </section>

      {/* סמכויות */}
      <section className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
        <h2 className="text-xl font-bold mb-4">סמכויות מיופה הכוח</h2>
        <textarea
          value={powers}
          onChange={(e) => setPowers(e.target.value)}
          placeholder="פרט את הסמכויות המדויקות..."
          rows={6}
          className="w-full px-4 py-2 border rounded-lg"
          dir="rtl"
          style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
        />
      </section>

      {/* תוקף */}
      <section className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h2 className="text-xl font-bold mb-4">תוקף ייפוי הכוח</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">תאריך התחלה</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">תאריך סיום</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={revocable}
            onChange={(e) => setRevocable(e.target.checked)}
            className="w-4 h-4"
          />
          <span>ניתן לביטול</span>
        </label>
      </section>

      <SignatureList
        signatures={signatures}
        onChange={setSignatures}
        minSignatures={1}
        maxSignatures={3}
      />

      <button
        onClick={() => onGenerate({
          type: 'power-of-attorney',
          grantor,
          attorney,
          scope,
          powers,
          startDate,
          endDate,
          revocable,
          signatures,
        })}
        disabled={!grantor.name || !attorney.name}
        className="w-full px-10 py-4 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl font-bold text-lg"
      >
        צור ייפוי כוח
      </button>
    </div>
  );
}
