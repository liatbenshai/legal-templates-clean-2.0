'use client';

import { useState } from 'react';
import { Scale, FileText, AlertCircle } from 'lucide-react';
import PartyTable, { PartyRole } from '../PartyTable';
import RepeatableFieldGroup from '../RepeatableFieldGroup';
import SignatureList from '../SignatureList';
import { SignatureData } from '../SignatureBlock';

/**
 * מודול כתב בית דין
 * גמיש מאוד - משתנה לפי מי אני מייצג
 */

interface CourtPetitionProps {
  onGenerate: (document: any) => void;
}

export default function CourtPetition({ onGenerate }: CourtPetitionProps) {
  const [myRole, setMyRole] = useState<PartyRole>('plaintiff');
  const [plaintiffs, setPlaintiffs] = useState<any[]>([]);
  const [defendants, setDefendants] = useState<any[]>([]);

  const [caseInfo, setCaseInfo] = useState({
    court: '',
    caseNumber: '',
    filingDate: new Date().toISOString().split('T')[0],
    judge: '',
    subject: '',
  });

  const [cause, setCause] = useState('');
  const [claims, setClaims] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [relief, setRelief] = useState('');
  
  const [signatures, setSignatures] = useState<SignatureData[]>([
    {
      id: 'lawyer',
      signerName: '',
      signerRole: 'באי כוח',
      date: new Date().toISOString().split('T')[0],
      signatureType: 'text',
    },
  ]);

  const courts = [
    'בית הדין הרבני האזורי',
    'בית הדין הרבני הגדול',
    'בית המשפט המחוזי',
    'בית המשפט לענייני משפחה',
    'בית משפט שלום',
    'אחר',
  ];

  const handleRoleSwitch = () => {
    setMyRole(myRole === 'plaintiff' ? 'defendant' : 'plaintiff');
    // החלף את הצדדים
    const tempPlaintiffs = [...plaintiffs];
    setPlaintiffs(defendants);
    setDefendants(tempPlaintiffs);
  };

  const generateDocument = () => {
    const document = {
      type: 'court-petition',
      title: `כתב ${myRole === 'plaintiff' ? 'תביעה' : 'הגנה'} - ${caseInfo.subject}`,
      myRole,
      plaintiffs,
      defendants,
      caseInfo,
      cause,
      claims,
      evidence,
      relief,
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
          <Scale className="w-8 h-8 text-primary" />
          כתב בית דין
        </h1>
        <p className="text-gray-600">
          כתב {myRole === 'plaintiff' ? 'תביעה' : 'הגנה'} לבית הדין/בית המשפט
        </p>
      </div>

      {/* פרטי תיק */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold text-gray-900 mb-4">פרטי התיק</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              בית הדין/בית המשפט <span className="text-red-500">*</span>
            </label>
            <select
              value={caseInfo.court}
              onChange={(e) => setCaseInfo({ ...caseInfo, court: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            >
              <option value="">בחר...</option>
              {courts.map(court => (
                <option key={court} value={court}>{court}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מספר תיק
            </label>
            <input
              type="text"
              value={caseInfo.caseNumber}
              onChange={(e) => setCaseInfo({ ...caseInfo, caseNumber: e.target.value })}
              placeholder="12345-01-23"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="ltr"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תאריך הגשה
            </label>
            <input
              type="date"
              value={caseInfo.filingDate}
              onChange={(e) => setCaseInfo({ ...caseInfo, filingDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם השופט/דיין (אם ידוע)
            </label>
            <input
              type="text"
              value={caseInfo.judge}
              onChange={(e) => setCaseInfo({ ...caseInfo, judge: e.target.value })}
              placeholder="כבוד השופט/הדיין..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נושא התיק <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={caseInfo.subject}
              onChange={(e) => setCaseInfo({ ...caseInfo, subject: e.target.value })}
              placeholder="לדוגמה: תביעה למזונות / תביעה לפינוי / תביעה לחלוקת רכוש"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
        </div>
      </section>

      {/* צדדים - הרכיב הגמיש! */}
      <PartyTable
        myRole={myRole}
        myParties={myRole === 'plaintiff' ? plaintiffs : defendants}
        opponentParties={myRole === 'plaintiff' ? defendants : plaintiffs}
        onMyPartiesChange={myRole === 'plaintiff' ? setPlaintiffs : setDefendants}
        onOpponentPartiesChange={myRole === 'plaintiff' ? setDefendants : setPlaintiffs}
        onRoleSwitch={handleRoleSwitch}
        showRoleSwitch={true}
      />

      {/* עילת התביעה */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">עילת התביעה</h2>
        <textarea
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          placeholder="תאר את העובדות והנסיבות שמהוות את עילת התביעה..."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          dir="rtl"
          style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
        />
      </section>

      {/* טענות עיקריות */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
        <RepeatableFieldGroup
          groupName="טענות עיקריות"
          fields={[
            { id: '1', name: 'טענה', type: 'text', placeholder: 'תאר את הטענה בפירוט' },
          ]}
          minRows={1}
          maxRows={30}
          onChange={setClaims}
        />
      </section>

      {/* ראיות */}
      <section className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-lg border-2 border-cyan-200">
        <RepeatableFieldGroup
          groupName="ראיות"
          fields={[
            { id: '1', name: 'סוג_ראיה', type: 'text', placeholder: 'מסמך/עדות/חוות דעת' },
            { id: '2', name: 'תיאור', type: 'text', placeholder: 'פירוט הראיה' },
            { id: '3', name: 'מספר_מוצג', type: 'text', placeholder: 'נ/1, נ/2...' },
          ]}
          minRows={0}
          maxRows={50}
          onChange={setEvidence}
        />
      </section>

      {/* סעד מבוקש */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          הסעד המבוקש
        </h2>
        <textarea
          value={relief}
          onChange={(e) => setRelief(e.target.value)}
          placeholder="פרט את הסעד שאתה מבקש מבית הדין להעניק..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          dir="rtl"
          style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
        />
      </section>

      {/* חתימות */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
        <SignatureList
          signatures={signatures}
          onChange={setSignatures}
          minSignatures={1}
          maxSignatures={10}
          title="חתימות (באי כוח + צדדים)"
        />
      </section>

      {/* כפתור יצירה */}
      <div className="flex justify-center pt-6 border-t">
        <button
          onClick={generateDocument}
          disabled={
            !caseInfo.court ||
            !caseInfo.subject ||
            (myRole === 'plaintiff' ? plaintiffs.length === 0 : defendants.length === 0) ||
            (myRole === 'plaintiff' ? defendants.length === 0 : plaintiffs.length === 0)
          }
          className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-primary transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl"
        >
          <FileText className="w-6 h-6" />
          <span>צור כתב בית דין מלא</span>
        </button>
      </div>

      {/* הנחיות */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900">
        <p className="font-bold mb-2">⚠️ שים לב:</p>
        <ul className="space-y-1 mr-4">
          <li>• בחר את התפקיד הנכון (תובע/נתבע) - זה משפיע על כל המסמך</li>
          <li>• לצד שאתה מייצג - מלא פרטים מלאים</li>
          <li>• לצד השני - מספיקים פרטים בסיסיים (שם + ת.ז)</li>
          <li>• בחירת המגדר חשובה - משפיעה על כל הנטיות</li>
          <li>• התביעה תכלול את כל הסעיפים הנדרשים</li>
        </ul>
      </div>
    </div>
  );
}
