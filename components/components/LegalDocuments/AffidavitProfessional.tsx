'use client';

import { useState } from 'react';
import { FileText, User, CheckCircle, Calendar, Plus, X } from 'lucide-react';
import GenderSelector from '../GenderSelector';
import SimpleExportButtons from '../SimpleExportButtons';
import SimpleAIImprover from '../SimpleAIImprover';
import type { Gender } from '@/lib/hebrew-gender';

export default function AffidavitProfessional() {
  // פרטי המצהיר
  const [declarant, setDeclarant] = useState({
    name: '',
    id: '',
    address: '',
    phone: '',
    age: '',
    gender: 'male' as Gender
  });

  // תוכן התצהיר
  const [affidavitSubject, setAffidavitSubject] = useState('');
  const [declarations, setDeclarations] = useState<string[]>(['']);
  const [consequences, setConsequences] = useState('');
  const [truthDeclaration, setTruthDeclaration] = useState(true);
  const [perjuryWarning, setPerjuryWarning] = useState(true);
  
  // פרטי אישור
  const [signingDate, setSigningDate] = useState(new Date().toISOString().split('T')[0]);
  const [signingLocation, setSigningLocation] = useState('');
  const [lawyerName, setLawyerName] = useState('');
  const [lawyerLicense, setLawyerLicense] = useState('');
  
  const [showAI, setShowAI] = useState(false);

  const addDeclaration = () => {
    setDeclarations(prev => [...prev, '']);
  };

  const removeDeclaration = (index: number) => {
    if (declarations.length > 1) {
      setDeclarations(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateDeclaration = (index: number, value: string) => {
    const newDeclarations = [...declarations];
    newDeclarations[index] = value;
    setDeclarations(newDeclarations);
  };

  const generateAffidavit = (): string => {
    return `תצהיר

אני הח"מ ${declarant.name || '[שם המצהיר]'}, ת.ז. ${declarant.id || '[תעודת זהות]'}, גיל ${declarant.age || '[גיל]'}, מכתובת: ${declarant.address || '[כתובת מלאה]'}, טלפון: ${declarant.phone || '[מספר טלפון]'}

(להלן: "המצהיר")

לאחר שהוזהרתי כי עליי להצהיר את האמת וכי אהיה צפוי/ה לעונשים הקבועים בחוק באם לא אעשה כן, מצהיר/ה בזאת כדלקמן:

נושא התצהיר

התצהיר ניתן בעניין: ${affidavitSubject || '[נושא התצהיר - למה הוא נדרש]'}

הצהרותיי

${declarations.map((declaration, index) => `
${index + 1}. ${declaration || `[הצהרה מספר ${index + 1} - פרט מה שאתה מצהיר שזה נכון ומדויק]`}
`).join('')}

${consequences ? `
משמעות ההצהרות

${consequences}
` : ''}

הצהרת אמיתות

${truthDeclaration ? `
אני מצהיר/ה בזה כי:

1. כל האמור לעיל הוא אמת
2. אני מכיר/ה באופן אישי את העובדות המתוארות בתצהיר זה
3. העובדות המתוארות מבוססות על ידיעה אישית ישירה
4. לא השמטתי כל עובדה חשובה הרלוונטית לנושא התצהיר
5. אני ${declarant.gender === 'female' ? 'מודעת' : 'מודע'} לחומרת המצהיר ש${declarant.gender === 'female' ? 'קר' : 'קר'}
` : ''}

${perjuryWarning ? `
אזהרה

אני ${declarant.gender === 'female' ? 'מודעת' : 'מודע'} לכך שמתן עדות שקר בתצהיר זה ${declarant.gender === 'female' ? 'תהווה' : 'יהווה'} עבירה פלילית של עדות שקר והעלמת אמת, העלול${declarant.gender === 'female' ? 'ה' : ''} לגרור ${declarant.gender === 'female' ? 'עליי' : 'עלי'} תביעה פלילית והליכים משפטיים.

אני ${declarant.gender === 'female' ? 'מתחייבת' : 'מתחייב'} כי כל האמור בתצהיר זה הוא אמת לאמיתה.
` : ''}

חתימה

תאריך: ${new Date(signingDate).toLocaleDateString('he-IL')}
מקום: ${signingLocation || '[מקום החתימה]'}

________________________
     חתימת המצהיר
   ${declarant.name || '[שם]'}

אישור עורך דין

אני הח"מ ${lawyerName || '[שם עורך הדין]'}, עו"ד מס' רישיון ${lawyerLicense || '[מספר]'}, מאשר בזה כי:

1. המצהיר ${declarant.name || '[שם]'} הופיע בפני היום ${new Date(signingDate).toLocaleDateString('he-IL')}
2. זיהיתיו על פי תעודת זהות שהציג לפני
3. הסברתי לו את חומרת התצהיר ואת העונשים על עדות שקר
4. הוא הצהיר בפני כי כל האמור בתצהיר הוא אמת
5. חתם על התצהיר בנוכחותי לאחר שקרא והבין את תוכנו

________________________
חתימה וחותמת עו״ד
${lawyerName || '[שם עורך הדין]'}

תאריך: ${new Date(signingDate).toLocaleDateString('he-IL')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          תצהיר מקצועי
        </h1>

        {/* פרטי המצהיר */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            פרטי המצהיר
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={declarant.name}
              onChange={(e) => setDeclarant(prev => ({ ...prev, name: e.target.value }))}
              placeholder="שם מלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={declarant.id}
              onChange={(e) => setDeclarant(prev => ({ ...prev, id: e.target.value }))}
              placeholder="תעודת זהות"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
              maxLength={9}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={declarant.address}
              onChange={(e) => setDeclarant(prev => ({ ...prev, address: e.target.value }))}
              placeholder="כתובת מלאה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={declarant.phone}
              onChange={(e) => setDeclarant(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
            />
            
            <input
              type="text"
              value={declarant.age}
              onChange={(e) => setDeclarant(prev => ({ ...prev, age: e.target.value }))}
              placeholder="גיל"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
            />
          </div>

          <GenderSelector
            value={declarant.gender}
            onChange={(gender) => setDeclarant(prev => ({ ...prev, gender }))}
            label="מגדר המצהיר"
            size="medium"
          />
        </section>

        {/* נושא התצהיר */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">נושא התצהיר</h2>
          
          <input
            type="text"
            value={affidavitSubject}
            onChange={(e) => setAffidavitSubject(e.target.value)}
            placeholder="למה נדרש התצהיר? (לדוגמה: להוכחת מגורים, זהות, יחסי משפחה...)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            dir="rtl"
          />
        </section>

        {/* הצהרות */}
        <section className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-900">הצהרות</h2>
            <button
              onClick={addDeclaration}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              הוסף הצהרה
            </button>
          </div>

          <div className="space-y-4">
            {declarations.map((declaration, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-purple-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">הצהרה {index + 1}</h3>
                  {declarations.length > 1 && (
                    <button
                      onClick={() => removeDeclaration(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <textarea
                  value={declaration}
                  onChange={(e) => updateDeclaration(index, e.target.value)}
                  placeholder={`הזן כאן את הצהרה מספר ${index + 1} - מה אתה מצהיר שזה נכון ומדויק`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={4}
                  dir="rtl"
                  style={{ fontFamily: 'David', fontSize: '13pt' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* משמעות */}
        <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">משמעות ההצהרות</h2>
          
          <textarea
            value={consequences}
            onChange={(e) => setConsequences(e.target.value)}
            placeholder="פרט את המשמעות המשפטית של ההצהרות (אופציונלי)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 resize-none"
            rows={3}
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </section>

        {/* הגדרות תצהיר */}
        <section className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
          <h2 className="text-xl font-bold text-red-900 mb-4">הגדרות תצהיר</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={truthDeclaration}
                onChange={(e) => setTruthDeclaration(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">הצהרת אמיתות מלאה</div>
                <div className="text-sm text-gray-600">כולל הצהרה שכל האמור הוא אמת</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={perjuryWarning}
                onChange={(e) => setPerjuryWarning(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">אזהרת עדות שקר</div>
                <div className="text-sm text-gray-600">כולל אזהרה על עונשים במקרה של עדות שקר</div>
              </div>
            </label>
          </div>
        </section>

        {/* פרטי אישור */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            פרטי חתימה ואישור
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="date"
              value={signingDate}
              onChange={(e) => setSigningDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
            />
            
            <input
              type="text"
              value={signingLocation}
              onChange={(e) => setSigningLocation(e.target.value)}
              placeholder="מקום החתימה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
          </div>

          <div className="bg-white p-4 rounded border border-gray-300">
            <h3 className="font-bold text-gray-900 mb-3">עורך דין מאשר</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={lawyerName}
                onChange={(e) => setLawyerName(e.target.value)}
                placeholder="שם עורך הדין"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                dir="rtl"
              />
              
              <input
                type="text"
                value={lawyerLicense}
                onChange={(e) => setLawyerLicense(e.target.value)}
                placeholder="מספר רישיון עו״ד"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                dir="ltr"
              />
            </div>
          </div>
        </section>

        {/* עוזר AI */}
        <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-900">🤖 עוזר AI לשיפור הצהרות</h2>
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              {showAI ? 'הסתר AI' : 'הצג AI'}
            </button>
          </div>
          
          {showAI && (
            <SimpleAIImprover
              initialText={declarations[0] || 'כתוב כאן הצהרה בסיסית והAI ירחיב לניסוח משפטי מקצועי'}
              onAccept={(improvedText) => updateDeclaration(0, improvedText)}
              placeholder="לדוגמה: אני גר בכתובת הזו 5 שנים, אני מכיר את האדם הזה..."
            />
          )}
        </section>

        {/* ייצוא */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <SimpleExportButtons
            documentContent={generateAffidavit()}
            documentTitle={`תצהיר - ${declarant.name || 'מצהיר'}`}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
