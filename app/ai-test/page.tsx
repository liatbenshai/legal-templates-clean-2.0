'use client';

import { useState } from 'react';
import EnhancedAIImprover from '@/components/EnhancedAIImprover';
import { FileText, Copy, Check } from 'lucide-react';

const testTexts = [
  {
    id: 'will-opening',
    title: 'פתיחת צוואה - טקסט גרוע',
    text: `אני, משה כהן, תושב תל אביב, מצהיר בזה בכפוף לחוק הירושה שאני עושה את הצוואה הזו מהרצון החופשי שלי. אני רוצה לתת את כל הרכוש שלי לילדים שלי. בנוסף, אני רוצה שהם ידעו שאני אוהב אותם מאוד ושהם צריכים לשמור על קשר ביניהם.`,
    expectedImprovements: [
      'הח"מ במקום "אני"',
      'על פי במקום "בכפוף ל"',
      'מצווה להוריש במקום "לתת"',
      'שפה גבוהה יותר'
    ]
  },
  {
    id: 'contract-clause',
    title: 'סעיף בהסכם - טקסט גרוע',
    text: `הצד הראשון צריך לשלם לצד השני את הסכום בכפוף לתנאים הבאים. אם הצד הראשון לא ישלם בזמן, הצד השני יכול לעשות פעולות משפטיות נגדו. עם זאת, לפני שהוא עושה את זה, הוא צריך לתת הודעה של 30 יום. בנוסף לזה, יש לציין שהסכום כולל מע"מ.`,
    expectedImprovements: [
      'על... לשלם במקום "צריך לשלם"',
      'בהתאם במקום "בכפוף"',
      'לנקוט בהליכים במקום "לעשות פעולות"',
      'ואולם במקום "עם זאת"'
    ]
  },
  {
    id: 'court-decision',
    title: 'החלטת בית משפט - טקסט גרוע',
    text: `אני חושב שהתובע צודק בנוגע לטענות שלו. לכן, אני נותן לו את הסעד שהוא ביקש. בנוסף לזה, הנתבע צריך לשלם הוצאות משפט. עם זאת, אני לא נותן לו את כל מה שהוא רצה כי הוא לא הוכיח את כל הטענות שלו באופן מספיק.`,
    expectedImprovements: [
      'דעתי היא במקום "אני חושב"',
      'לפיכך במקום "לכן"',
      'מורה במקום "נותן"',
      'כמו כן במקום "בנוסף"',
      'אין אני נעתר במקום "לא נותן"'
    ]
  },
  {
    id: 'inheritance-bequest',
    title: 'הורשת נכס - טקסט גרוע',
    text: `אני רוצה לתת את הבית שלי שנמצא ברחוב הרצל 10 בתל אביב לבן שלי דוד. הוא צריך לקבל את זה בלי שום תנאים. בנוסף, אני רוצה שהוא ידע שזה בגלל שהוא תמיד דאג לי. אם הוא לא יהיה בחיים כשאני אמות, אז זה יעבור לילדים שלו.`,
    expectedImprovements: [
      'אני מצווה במקום "אני רוצה"',
      'להוריש במקום "לתת"',
      'הנכס במקום "הבית שלי"',
      'שפה משפטית פורמלית'
    ]
  },
  {
    id: 'poa-financial',
    title: 'ייפוי כוח פיננסי - טקסט גרוע',
    text: `אני נותן לשרה לוי הרשאה לעשות פעולות בחשבון הבנק שלי. היא יכולה למשוך כסף, להפקיד כסף, ולעשות העברות. עם זאת, היא לא יכולה למשוך יותר מ-50,000 שקל בפעם אחת בלי שתיתן לי הודעה לפני. בנוסף לזה, היא צריכה לשמור רישום של כל מה שהיא עושה.`,
    expectedImprovements: [
      'אני ממנה במקום "אני נותן"',
      'לנהל במקום "לעשות פעולות"',
      'ואולם במקום "עם זאת"',
      'על... ל במקום "צריכה ל"'
    ]
  }
];

export default function AITestPage() {
  const [selectedText, setSelectedText] = useState(testTexts[0]);
  const [currentText, setCurrentText] = useState(testTexts[0].text);
  const [improvedText, setImprovedText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImprove = (improved: string) => {
    setImprovedText(improved);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (example: typeof testTexts[0]) => {
    setSelectedText(example);
    setCurrentText(example.text);
    setImprovedText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* כותרת */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            🧪 מעבדת בדיקות AI
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            בדקי את מערכת השיפור החכמה שממירה "עברית מתורגמת" לעברית משפטית תקנית
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* עמודה שמאלית - דוגמאות */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                דוגמאות לבדיקה
              </h2>
              
              <div className="space-y-3">
                {testTexts.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => loadExample(example)}
                    className={`w-full text-right p-4 rounded-lg border-2 transition ${
                      selectedText.id === example.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {example.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {example.text.substring(0, 60)}...
                    </div>
                  </button>
                ))}
              </div>

              {/* הסבר על השיפורים הצפויים */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-bold text-yellow-900 mb-2">
                  שיפורים צפויים:
                </h3>
                <ul className="space-y-1">
                  {selectedText.expectedImprovements.map((imp, idx) => (
                    <li key={idx} className="text-sm text-yellow-800">
                      • {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* טקסט מותאם אישית */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">
                או הדביקי טקסט משלך:
              </h3>
              <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                className="w-full h-40 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="הדביקי כאן טקסט לבדיקה..."
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>
          </div>

          {/* עמודה ימנית - מערכת AI */}
          <div className="lg:col-span-2 space-y-6">
            {/* הטקסט המקורי */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📝 הטקסט המקורי
              </h2>
              <div 
                className="bg-red-50 border-2 border-red-200 rounded-lg p-5 whitespace-pre-line leading-relaxed"
                style={{ fontFamily: 'David', fontSize: '13pt', direction: 'rtl' }}
              >
                {currentText}
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-red-700">
                <span className="font-bold">⚠️ בעיות:</span>
                <span>עברית מתורגמת, ביטויים לא פורמליים, מבנה לא תקין</span>
              </div>
            </div>

            {/* מערכת ה-AI */}
            <EnhancedAIImprover
              text={currentText}
              onImprove={handleImprove}
              documentType={selectedText.id}
              showAnalysis={true}
            />

            {/* התוצאה */}
            {improvedText && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-green-900">
                    ✅ הטקסט המשופר
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>הועתק!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>העתק</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div 
                  className="bg-green-50 border-2 border-green-300 rounded-lg p-5 whitespace-pre-line leading-relaxed"
                  style={{ fontFamily: 'David', fontSize: '13pt', direction: 'rtl' }}
                >
                  {improvedText}
                </div>
                
                <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                  <span className="font-bold">✨ שיפורים:</span>
                  <span>עברית משפטית תקנית, ביטויים פורמליים, מבנה מקצועי</span>
                </div>
              </div>
            )}

            {/* הוראות שימוש */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                📖 איך משתמשים?
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>בחרי דוגמה</strong> מהרשימה או הדביקי טקסט משלך
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong>לחצי "נתח טקסט"</strong> כדי לראות את הבעיות בטקסט המקורי
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>בחרי אם להשתמש ב-API</strong> (מומלץ מאוד!) או בשיפור מקומי
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong>לחצי "שפר לעברית משפטית תקנית"</strong> והמתיני לתוצאה
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                  <div>
                    <strong>דרגי את התוצאה</strong> כדי שהמערכת תלמד ותשתפר
                  </div>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-900">
                  <strong>💡 טיפ:</strong> עם API של Claude (sonnet-4) תקבלי תוצאות מעולות! 
                  אם אין לך מפתח, ניתן לקבל אחד ב-
                  <a 
                    href="https://console.anthropic.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-bold mx-1"
                  >
                    console.anthropic.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

