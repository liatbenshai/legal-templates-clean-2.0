'use client';

import { useState } from 'react';
import { FileText, User, Scale, Calendar, Plus, X } from 'lucide-react';
import GenderSelector from '../GenderSelector';
import SimpleExportButtons from '../SimpleExportButtons';
import SimpleAIImprover from '../SimpleAIImprover';
import type { Gender } from '@/lib/hebrew-gender';

interface Party {
  name: string;
  id: string;
  address: string;
  phone: string;
  lawyer?: string;
  lawyerLicense?: string;
}

interface Evidence {
  type: string;
  description: string;
  relevance: string;
}

interface Relief {
  description: string;
  amount?: string;
  urgency: 'רגיל' | 'דחוף' | 'זמני';
}

export default function CourtPetitionProfessional() {
  const [courtName, setCourtName] = useState('');
  const [caseSubject, setCaseSubject] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  
  // תובע
  const [plaintiff, setPlaintiff] = useState<Party>({
    name: '',
    id: '',
    address: '',
    phone: '',
    lawyer: '',
    lawyerLicense: ''
  });
  
  // נתבע
  const [defendant, setDefendant] = useState<Party>({
    name: '',
    id: '',
    address: '',
    phone: ''
  });
  
  const [factualBackground, setFactualBackground] = useState('');
  const [causeOfAction, setCauseOfAction] = useState('');
  const [legalArgument, setLegalArgument] = useState('');
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [reliefs, setReliefs] = useState<Relief[]>([]);
  
  const [claimAmount, setClaimAmount] = useState('');
  const [filingDate, setFilingDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAI, setShowAI] = useState(false);

  const addEvidence = () => {
    setEvidences(prev => [...prev, { type: '', description: '', relevance: '' }]);
  };

  const removeEvidence = (index: number) => {
    setEvidences(prev => prev.filter((_, i) => i !== index));
  };

  const addRelief = () => {
    setReliefs(prev => [...prev, { description: '', amount: '', urgency: 'רגיל' }]);
  };

  const removeRelief = (index: number) => {
    setReliefs(prev => prev.filter((_, i) => i !== index));
  };

  const generateCourtPetition = (): string => {
    let content = `${courtName || 'בית הדין הרבני [מקום]'}

כבוד הדיינים,

הנדון: ${caseSubject || 'תביעה בעניין [נושא התביעה]'}
${caseNumber ? `מספר תיק: ${caseNumber}` : ''}

פרטי הצדדים:

התובע: ${plaintiff.name || '[שם התובע]'}
ת.ז: ${plaintiff.id || '[תעודת זהות]'}
כתובת: ${plaintiff.address || '[כתובת מלאה]'}
טלפון: ${plaintiff.phone || '[מספר טלפון]'}
${plaintiff.lawyer ? `באמצעות ב"כ: ${plaintiff.lawyer}, עו"ד, רישיון ${plaintiff.lawyerLicense || '[מספר]'}` : ''}

הנתבע: ${defendant.name || '[שם הנתבع]'}
ת.ז: ${defendant.id || '[תעודת זהות]'}
כתובת: ${defendant.address || '[כתובת מלאה]'}
טלפון: ${defendant.phone || '[מספר טלפון]'}

עובדות התביעה

1. רקע עובדתי
${factualBackground || '[יש לפרט את הרקע העובדתי לתביעה - מתי, איך, מה קרה]'}

2. עילת התביעה
${causeOfAction || '[יש לפרט את עילת התביעה - על מה מבוססת התביעה, איזה זכות הופרה]'}

3. הטיעון המשפטי
${legalArgument || '[יש לפרט את הבסיס המשפטי - חוקים, תקנות, פסיקה רלוונטית]'}

הראיות

`;

    if (evidences.length > 0) {
      evidences.forEach((evidence, index) => {
        content += `${index + 1}. סוג ראיה: ${evidence.type || '[סוג]'}
   תיאור: ${evidence.description || '[תיאור מפורט]'}
   רלוונטיות: ${evidence.relevance || '[מדוע רלוונטי]'}

`;
      });
    } else {
      content += `יש לצרף:
- מסמכים רלוונטיים
- עדויות עדים
- מומחה אם נדרש
- הוכחות נוספות

`;
    }

    content += `הסעדים המבוקשים

`;

    if (reliefs.length > 0) {
      reliefs.forEach((relief, index) => {
        content += `${index + 1}. ${relief.description || '[תיאור הסעד]'}
   ${relief.amount ? `סכום: ${relief.amount} ₪` : ''}
   ${relief.urgency !== 'רגיל' ? `דחיפות: ${relief.urgency}` : ''}

`;
      });
    } else {
      content += `1. [פירוט הסעד הראשון המבוקש]
2. [פירוט הסעד השני המבוקש אם קיים]
3. חיוב הנתבע בהוצאות משפט ושכ"ט עו"ד

`;
    }

    content += `שומת התביעה
${claimAmount ? `סכום התביעה הכולל: ${claimAmount} ₪` : 'סכום התביעה: [סכום] ₪'}

סיכום

לפיכך, נוכח הנטען לעיל ובהתבסס על העובדות והראיות המפורטות, מתבקש בית הדין הנכבד:

1. לקבל את התביעה במלואה
2. לחייב את הנתבע בתשלום הסכומים המפורטים לעיל
3. לחייב את הנתבع בהוצאות משפט ושכ"ט עו"ד
4. לתת כל סעד אחר שייראה לבית הדין לנכון

המבקש סמוך ובטוח כי בית הדין הנכבד יעשה צדק ויקבל את התביעה.

${new Date().toLocaleDateString('he-IL')}

בכבוד רב,
${plaintiff.lawyer || plaintiff.name || '[חתימה]'}
${plaintiff.lawyer ? `עו"ד רישיון ${plaintiff.lawyerLicense || '[מספר]'}` : 'התובע'}`;

    return content;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-600" />
          כתב תביעה לבית דין
        </h1>

        {/* פרטי בית הדין */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">פרטי בית הדין</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              placeholder="שם בית הדין (למשל: בית הדין הרבני הגדול ירושלים)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="מספר תיק (אופציונלי)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />
          </div>

          <input
            type="text"
            value={caseSubject}
            onChange={(e) => setCaseSubject(e.target.value)}
            placeholder="נושא התביעה (למשל: תביעה לתשלום שכר טרחה)"
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            dir="rtl"
          />
        </section>

        {/* תובע */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">פרטי התובע</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={plaintiff.name}
              onChange={(e) => setPlaintiff(prev => ({ ...prev, name: e.target.value }))}
              placeholder="שם התובע המלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={plaintiff.id}
              onChange={(e) => setPlaintiff(prev => ({ ...prev, id: e.target.value }))}
              placeholder="תעודת זהות"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
              maxLength={9}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={plaintiff.address}
              onChange={(e) => setPlaintiff(prev => ({ ...prev, address: e.target.value }))}
              placeholder="כתובת מלאה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={plaintiff.phone}
              onChange={(e) => setPlaintiff(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
            />
          </div>

          <div className="bg-white p-4 rounded border border-green-300">
            <h3 className="font-bold text-gray-900 mb-3">ייצוג משפטי (אופציונלי)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={plaintiff.lawyer}
                onChange={(e) => setPlaintiff(prev => ({ ...prev, lawyer: e.target.value }))}
                placeholder="שם עורך הדין"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                dir="rtl"
              />
              
              <input
                type="text"
                value={plaintiff.lawyerLicense}
                onChange={(e) => setPlaintiff(prev => ({ ...prev, lawyerLicense: e.target.value }))}
                placeholder="מספר רישיון עו״ד"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                dir="ltr"
              />
            </div>
          </div>
        </section>

        {/* נתבע */}
        <section className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
          <h2 className="text-xl font-bold text-red-900 mb-4">פרטי הנתבע</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={defendant.name}
              onChange={(e) => setDefendant(prev => ({ ...prev, name: e.target.value }))}
              placeholder="שם הנתבע המלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={defendant.id}
              onChange={(e) => setDefendant(prev => ({ ...prev, id: e.target.value }))}
              placeholder="תעודת זהות"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              dir="ltr"
              maxLength={9}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={defendant.address}
              onChange={(e) => setDefendant(prev => ({ ...prev, address: e.target.value }))}
              placeholder="כתובת מלאה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={defendant.phone}
              onChange={(e) => setDefendant(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              dir="ltr"
            />
          </div>
        </section>

        {/* טיעונים */}
        <section className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
          <h2 className="text-xl font-bold text-purple-900 mb-4">טיעוני התביעה</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">רקע עובדתי</label>
              <textarea
                value={factualBackground}
                onChange={(e) => setFactualBackground(e.target.value)}
                placeholder="פרט את הרקע העובדתי לתביעה - מה קרה, מתי, איפה, מי מעורב"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={4}
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">עילת התביעה</label>
              <textarea
                value={causeOfAction}
                onChange={(e) => setCauseOfAction(e.target.value)}
                placeholder="פרט את עילת התביעה - על מה היא מבוססת, איזו זכות הופרה"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={3}
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">הטיעון המשפטי</label>
              <textarea
                value={legalArgument}
                onChange={(e) => setLegalArgument(e.target.value)}
                placeholder="פרט את הבסיס המשפטי - חוקים, תקנות, פסיקה רלוונטית"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={4}
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>
          </div>
        </section>

        {/* ראיות */}
        <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-yellow-900">ראיות</h2>
            <button
              onClick={addEvidence}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              הוסף ראיה
            </button>
          </div>

          <div className="space-y-4">
            {evidences.map((evidence, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-yellow-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">ראיה {index + 1}</h3>
                  <button
                    onClick={() => removeEvidence(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-3">
                  <select
                    value={evidence.type}
                    onChange={(e) => {
                      const newEvidences = [...evidences];
                      newEvidences[index].type = e.target.value;
                      setEvidences(newEvidences);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">סוג ראיה</option>
                    <option value="מסמך">מסמך</option>
                    <option value="עדות">עדות</option>
                    <option value="מומחה">חוות דעת מומחה</option>
                    <option value="הוכחה פיזית">הוכחה פיזית</option>
                    <option value="אחר">אחר</option>
                  </select>
                  
                  <input
                    type="text"
                    value={evidence.description}
                    onChange={(e) => {
                      const newEvidences = [...evidences];
                      newEvidences[index].description = e.target.value;
                      setEvidences(newEvidences);
                    }}
                    placeholder="תיאור הראיה"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="rtl"
                  />
                  
                  <input
                    type="text"
                    value={evidence.relevance}
                    onChange={(e) => {
                      const newEvidences = [...evidences];
                      newEvidences[index].relevance = e.target.value;
                      setEvidences(newEvidences);
                    }}
                    placeholder="רלוונטיות לתביעה"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="rtl"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* סעדים */}
        <section className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-orange-900">סעדים מבוקשים</h2>
            <button
              onClick={addRelief}
              className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              הוסף סעד
            </button>
          </div>

          <div className="space-y-4">
            {reliefs.map((relief, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-orange-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">סעד {index + 1}</h3>
                  <button
                    onClick={() => removeRelief(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-3">
                  <textarea
                    value={relief.description}
                    onChange={(e) => {
                      const newReliefs = [...reliefs];
                      newReliefs[index].description = e.target.value;
                      setReliefs(newReliefs);
                    }}
                    placeholder="תיאור הסעד המבוקש"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
                    rows={2}
                    dir="rtl"
                  />
                  
                  <input
                    type="text"
                    value={relief.amount || ''}
                    onChange={(e) => {
                      const newReliefs = [...reliefs];
                      newReliefs[index].amount = e.target.value;
                      setReliefs(newReliefs);
                    }}
                    placeholder="סכום (₪)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    dir="ltr"
                  />
                  
                  <select
                    value={relief.urgency}
                    onChange={(e) => {
                      const newReliefs = [...reliefs];
                      newReliefs[index].urgency = e.target.value as any;
                      setReliefs(newReliefs);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="רגיל">רגיל</option>
                    <option value="דחוף">דחוף</option>
                    <option value="זמני">זמני</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">סכום כולל התביעה</label>
            <input
              type="text"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder="סכום התביעה הכולל (₪)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              dir="ltr"
            />
          </div>
        </section>

        {/* עוזר AI */}
        <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-900">🤖 עוזר AI לשיפור טיעונים</h2>
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              {showAI ? 'הסתר AI' : 'הצג AI'}
            </button>
          </div>
          
          {showAI && (
            <div className="space-y-4">
              <SimpleAIImprover
                initialText={factualBackground || 'כתוב כאן רקע עובדתי בסיסי והAI ירחיב לטיעון משפטי מלא'}
                onAccept={(improvedText) => setFactualBackground(improvedText)}
                placeholder="לדוגמה: הנתבע לא שילם לי 10,000 שח שחב לי..."
              />
            </div>
          )}
        </section>

        {/* ייצוא */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <SimpleExportButtons
            documentContent={generateCourtPetition()}
            documentTitle={`כתב תביעה - ${caseSubject || 'תביעה'}`}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
