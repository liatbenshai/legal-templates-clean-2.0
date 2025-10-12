'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import RepeatableFieldGroup from '../RepeatableFieldGroup';
import SignatureList from '../SignatureList';
import { SignatureData } from '../SignatureBlock';

/**
 * מודול ערעור
 */

export default function Appeal({ onGenerate }: { onGenerate: (doc: any) => void }) {
  const [appellant, setAppellant] = useState({ name: '', idNumber: '' });
  const [respondent, setRespondent] = useState({ name: '', idNumber: '' });
  const [originalDecision, setOriginalDecision] = useState({
    court: '',
    caseNumber: '',
    date: '',
    judge: '',
  });
  const [grounds, setGrounds] = useState<any[]>([]);
  const [relief, setRelief] = useState('');
  const [signatures, setSignatures] = useState<SignatureData[]>([]);

  return (
    <div className="space-y-6 p-8 bg-white rounded-xl">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-orange-600" />
        ערעור
      </h1>

      <section className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
        <h2 className="text-xl font-bold mb-4">החלטה מקורית</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input placeholder="בית משפט/בית דין" className="w-full px-4 py-2 border rounded" dir="rtl" style={{ fontFamily: 'David', fontSize: '13pt' }} value={originalDecision.court} onChange={(e) => setOriginalDecision({ ...originalDecision, court: e.target.value })} />
          <input placeholder="מספר תיק" className="w-full px-4 py-2 border rounded" dir="ltr" style={{ fontFamily: 'David', fontSize: '13pt' }} value={originalDecision.caseNumber} onChange={(e) => setOriginalDecision({ ...originalDecision, caseNumber: e.target.value })} />
          <input type="date" className="w-full px-4 py-2 border rounded" style={{ fontFamily: 'David', fontSize: '13pt' }} value={originalDecision.date} onChange={(e) => setOriginalDecision({ ...originalDecision, date: e.target.value })} />
          <input placeholder="שם השופט" className="w-full px-4 py-2 border rounded" dir="rtl" style={{ fontFamily: 'David', fontSize: '13pt' }} value={originalDecision.judge} onChange={(e) => setOriginalDecision({ ...originalDecision, judge: e.target.value })} />
        </div>
      </section>

      <section className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
        <RepeatableFieldGroup
          groupName="עילות ערעור"
          fields={[
            { id: '1', name: 'עילה', type: 'text', placeholder: 'תאר את עילת הערעור' },
          ]}
          minRows={1}
          maxRows={20}
          onChange={setGrounds}
        />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">הסעד המבוקש</h2>
        <textarea
          value={relief}
          onChange={(e) => setRelief(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border rounded-lg"
          dir="rtl"
          style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
        />
      </section>

      <SignatureList signatures={signatures} onChange={setSignatures} minSignatures={1} />

      <button
        onClick={() => onGenerate({ type: 'appeal', appellant, respondent, originalDecision, grounds, relief, signatures })}
        className="w-full px-10 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg"
      >
        צור ערעור
      </button>
    </div>
  );
}
