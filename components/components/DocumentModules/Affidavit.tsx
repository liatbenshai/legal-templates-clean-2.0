'use client';

import { useState } from 'react';
import { FileCheck } from 'lucide-react';
import RepeatableFieldGroup from '../RepeatableFieldGroup';
import SignatureList from '../SignatureList';
import { SignatureData } from '../SignatureBlock';
import GenderSelector from '../GenderSelector';
import type { Gender } from '@/lib/hebrew-gender';

/**
 * מודול תצהיר
 */

export default function Affidavit({ onGenerate }: { onGenerate: (doc: any) => void }) {
  const [declarant, setDeclarant] = useState({
    name: '',
    idNumber: '',
    address: '',
    gender: 'male' as Gender,
  });

  const [statements, setStatements] = useState<any[]>([]);
  const [purpose, setPurpose] = useState('');
  
  const [signatures, setSignatures] = useState<SignatureData[]>([
    {
      id: 'declarant',
      signerName: '',
      signerRole: 'מצהיר',
      date: new Date().toISOString().split('T')[0],
      signatureType: 'text',
    },
  ]);

  return (
    <div className="space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileCheck className="w-8 h-8 text-primary" />
          תצהיר
        </h1>
      </div>

      {/* פרטי מצהיר */}
      <section className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
        <h2 className="text-xl font-bold mb-4">פרטי המצהיר/ה</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={declarant.name}
            onChange={(e) => setDeclarant({ ...declarant, name: e.target.value })}
            placeholder="שם מלא *"
            className="px-4 py-3 border rounded-lg"
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
          <input
            type="text"
            value={declarant.idNumber}
            onChange={(e) => setDeclarant({ ...declarant, idNumber: e.target.value })}
            placeholder="ת.ז *"
            maxLength={9}
            className="px-4 py-3 border rounded-lg"
            dir="ltr"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </div>

        <GenderSelector
          value={declarant.gender}
          onChange={(gender) => setDeclarant({ ...declarant, gender })}
          showOrganization={false}
          size="small"
        />
      </section>

      {/* מטרת התצהיר */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">מטרת התצהיר</h2>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="למה מוגש תצהיר זה..."
          rows={3}
          className="w-full px-4 py-2 border rounded-lg"
          dir="rtl"
          style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
        />
      </section>

      {/* הצהרות */}
      <section className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
        <RepeatableFieldGroup
          groupName="הצהרות ועובדות"
          fields={[
            { id: '1', name: 'הצהרה', type: 'text', placeholder: 'אני מצהיר בזאת כי...' },
          ]}
          minRows={1}
          maxRows={50}
          onChange={setStatements}
        />
      </section>

      {/* חתימה */}
      <section>
        <SignatureList
          signatures={signatures}
          onChange={setSignatures}
          minSignatures={1}
          maxSignatures={2}
          title="חתימת המצהיר"
        />
      </section>

      <button
        onClick={() => onGenerate({
          type: 'affidavit',
          declarant,
          purpose,
          statements,
          signatures,
        })}
        disabled={!declarant.name || statements.length === 0}
        className="w-full px-10 py-4 bg-primary text-white rounded-xl font-bold text-lg"
      >
        צור תצהיר
      </button>
    </div>
  );
}
