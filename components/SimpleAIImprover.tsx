'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Check, X, Zap } from 'lucide-react';

interface SimpleAIImproverProps {
  initialText: string;
  onAccept: (improvedText: string) => void;
  placeholder?: string;
}

export default function SimpleAIImprover({
  initialText,
  onAccept,
  placeholder = 'הזן טקסט לשיפור'
}: SimpleAIImproverProps) {
  const [inputText, setInputText] = useState(initialText);
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  const improveText = async () => {
    if (!inputText.trim()) {
      alert('אנא הזן טקסט לשיפור');
      return;
    }
    
    setIsImproving(true);
    
    try {
      // סימולציה של עיבוד (3 שניות)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const improved = generateImprovedText(inputText);
      setImprovedText(improved);
      
    } catch (error) {
      console.error('שגיאה בשיפור:', error);
      alert('שגיאה בשיפור הטקסט');
    } finally {
      setIsImproving(false);
    }
  };

  const generateImprovedText = (text: string): string => {
    // הרחבה בסיסית
    let improved = text;

    // אם הטקסט קצר מדי, הרחב אותו
    if (text.length < 100) {
      improved = expandShortText(text);
    } else if (text.length < 300) {
      improved = expandMediumText(text);
    } else {
      improved = improveExistingText(text);
    }

    // הוספת ביטויים משפטיים
    improved = addLegalPhrases(improved);
    
    // תיקון עברית
    improved = correctHebrew(improved);

    return improved;
  };

  const expandShortText = (text: string): string => {
    // הרחבות מוכנות לטקסטים קצרים עם מגוון
    const expansions: Record<string, string[]> = {
      'ירושה': [
        `ירושה

למען הסר ספק, הנני מבהיר כי ירושה זו כוללת את כל רכושי מכל מין וסוג, בין במקרקעין ובין במיטלטלין.

היורשים יקבלו את חלקם לאחר תשלום כל חובות העיזבון, המיסים וההוצאות הנלוות.

הירושה תתבצע בהתאם להוראות הדין הישראלי ובכפוף לכל התקנות הרלוונטיות.`,

        `ירושה

בהתאם לרצוני הברור והמוחלט, ירושה זו מתייחסת לכלל נכסיי ללא יוצא מן הכלל.

על היורשים לפעול בתום לב ובשיתוף פעולה מלא לצורך מימוש הוראות הצוואה.

כל סכסוך או מחלוקת ביחס לירושה יוכרע בבית המשפט המוסמך בישראל.`,

        `ירושה

נוכח רצוני הברור, ירושה זו כוללת את מלוא זכויותיי ברכוש מכל סוג שהוא.

יש לבצע את חלוקת הירושה תוך כבוד הדדי ובאורח שיבטיח את טובת כלל היורשים.

הוראות אלו מחייבות ויש לקיימן במלואן ללא כל סטייה או שינוי.`
      ],

      'יורש': [
        `יורש

הנני מציין בזה כי היורש הנזכר לעיל יקבל את חלקו בירושה לאחר ביצוע כל ההוראות המפורטות בצוואתי זו.

במקרה שהיורש יפטר לפני מועד קבלת הירושה, חלקו יעבור ליורשיו החוקיים על פי דין.

היורש מתחייב לכבד את הוראות הצוואה ולפעול בשיתוף פעולה עם יתר היורשים.`,

        `יורש

בהתאם להוראותיי המפורשות, היורש האמור זכאי לחלק הירושה המיועד לו.

עליו לפעול באחריות ובהגינות כלפי שאר היורשים ולכבד את רוח הצוואה.

זכויותיו וחובותיו יהיו בהתאם לדין הישראלי ולהוראות הצוואה הזאת.`
      ],

      'מנהל עיזבון': [
        `מנהל עיזבון

מנהל העיזבון יהיה אחראי לביצוע כל הוראות הצוואה במלואן ובמועדן.

סמכויותיו יכללו: מימוש נכסים, תשלום חובות, חלוקת הירושה, וייצוג העיזבון בכל הליך משפטי.

מנהל העיזבון יהיה זכאי לשכר טרחה סביר בהתאם למקובל ולהיקף העבודה הנדרשת.`,

        `מנהל עיזבון

על מנהל העיזבון לפעול בנאמנות מלאה ולהבטיח ביצוע הוראות הצוואה ברמה הגבוהה ביותר.

יש לו סמכות מלאה לנהל את ענייני העיזבון ולקבל החלטות הנדרשות לטובת היורשים.

תפקידו יכלול גם דיווח שוטף ליורשים על התקדמות הטיפול בעיזבון.`
      ]
    };

    // חפש מילות מפתח והרחב עם בחירה אקראית
    for (const [keyword, expansionArray] of Object.entries(expansions)) {
      if (text.includes(keyword)) {
        const randomIndex = Math.floor(Math.random() * expansionArray.length);
        return expansionArray[randomIndex];
      }
    }

    // הרחבות כלליות מגוונות
    const generalExpansions = [
      `${text}

פירוט נוסף:
לצורך הבהרה נוספת ולמען הסר ספק, הנני מוסיף כי הוראות אלו מיועדות להבטיח ביצוע מלא ומדויק של רצוני.

יורשיי מתחייבים לפעול בתום לב ובשיתוף פעולה לביצוע הוראות אלו במלואן.

במקרה של צורך בהבהרה או בייעוץ משפטי, יש לפנות לעורך דין מקצועי.`,

      `${text}

הבהרות נוספות:
בהתאם לרצוני המפורש, הוראות אלו מחייבות את כל הנוגעים בדבר.

על המעורבים לפעול באחריות ובהגינות לביצוע ההוראות במלואן.

כל פעולה הנדרשת תעשה בהתאם לדין ובאישור הגורמים המוסמכים.`,

      `${text}

הוראות משלימות:
נוכח חשיבות הנושא, יש לוודא ביצוע מדויק של כל ההוראות.

הנוגעים בדבר יפעלו בשיתוף פעולה מלא ובכבוד הדדי.

במקרה של ספק או בעיה, יש לפנות לייעוץ משפטי מקצועי.`
    ];

    const randomIndex = Math.floor(Math.random() * generalExpansions.length);
    return generalExpansions[randomIndex];
  };

  const expandMediumText = (text: string): string => {
    const expansionTemplates = [
      `${text}

הרחבה והבהרה:
הואיל והנני מעוניין לוודא כי הוראותיי יבוצעו במלואן, הנני מוסיף הבהרות נוספות:

כל פעולה הנדרשת לביצוע הוראות אלו תיעשה בהתאם להוראות הדין הישראלי ובכפוף להוראות הרשויות המוסמכות.

במקרה של מחלוקת או אי בהירות, יש לפנות לבית המשפט המוסמך או לבורר מוסכם לקבלת הכרעה.`,

      `${text}

פירוט משלים:
יתרה מכך, יש לציין כי ההוראות הללו מחייבות את כל הצדדים הנוגעים בדבר.

על כל מי שנדרש לבצע פעולה במסגרת הוראות אלו לפעול ברמה המקצועית הגבוהה ביותר.

הביצוע יעשה תוך הקפדה על כל הוראות הדין הרלוונטיות ובהתאם למקובל במקרים דומים.`,

      `${text}

הוראות נוספות:
בנוסף לאמור, חשוב להדגיש כי כל הפעולות יבוצעו תוך שמירה על הכבוד והאמון הנדרשים.

הזכויות והחובות הנובעות מהוראות אלו יהיו בהתאם לדין ולמקובל בתחום.

יש לוודא ביצוע נאות של כל ההוראות תוך פיקוח והשגחה מתאימים.`
    ];

    const randomIndex = Math.floor(Math.random() * expansionTemplates.length);
    return expansionTemplates[randomIndex];
  };

  const improveExistingText = (text: string): string => {
    // שיפור טקסט קיים בלי להרחיב יותר מדי
    return `${text}

השלמת ההוראות:
נוכח האמור לעיל ולצורך השלמת התמונה, יש להוסיף כי כל הפעולות הנדרשות יעשו בהתאם לדין ובאישור הגורמים המוסמכים.`;
  };

  const addLegalPhrases = (text: string): string => {
    // מערך של פתיחות מגוונות
    const openingPhrases = [
      'בנוסף לאמור לעיל, ',
      'יתרה מכך, ',
      'עוד יש להוסיף כי ',
      'בהקשר זה יש לציין כי ',
      'כמו כן, ',
      'יש לציין בהקשר זה כי ',
      'נוסף על כך, ',
      'בהמשך לאמור, ',
      'בהתאם לכך, ',
      'על יסוד האמור, '
    ];

    let improved = text
      // הוספת ביטויים משפטיים מגוונים
      .replace(/\bכי\b/g, () => {
        const alternatives = ['הואיל וכי', 'משום ש', 'בהיות ש', 'מאחר ש'];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      })
      .replace(/\bלכן\b/g, () => {
        const alternatives = ['לפיכך', 'על כן', 'בהתאם לכך', 'נוכח האמור'];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      })
      .replace(/\bאם\b/g, () => {
        const alternatives = ['במידה ו', 'אילו', 'היה ו', 'בהיות ש'];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      })
      .replace(/\bבגלל\b/g, () => {
        const alternatives = ['נוכח', 'לאור', 'בשל', 'עקב'];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      });

    // החלפת פתיחות חוזרות במגוון
    const paragraphs = improved.split('\n\n');
    const improvedParagraphs = paragraphs.map((paragraph, index) => {
      if (index === 0) return paragraph; // הפסקה הראשונה ללא שינוי
      
      // בחירה אקראית של פתיחה
      const randomOpening = openingPhrases[Math.floor(Math.random() * openingPhrases.length)];
      
      // הוספת הפתיחה רק אם הפסקה לא מתחילה כבר בביטוי משפטי
      if (!paragraph.match(/^(הואיל|לפיכך|בנוסף|יתרה|עוד|בהקשר|כמו כן|יש לציין|נוסף|בהמשך|בהתאם|על יסוד)/)) {
        return randomOpening + paragraph;
      }
      
      return paragraph;
    });

    return improvedParagraphs.join('\n\n')
      // ניקוי כפילויות
      .replace(/הואיל וכי הואיל וכי/g, 'הואיל וכי')
      .replace(/לפיכך לפיכך/g, 'לפיכך')
      .replace(/כמו כן, כמו כן,/g, 'כמו כן,');
  };

  const correctHebrew = (text: string): string => {
    return text
      // תיקונים נפוצים
      .replace(/ביצע/g, 'עשה')
      .replace(/ביטה/g, 'הביט')
      .replace(/אמר/g, 'הצהיר')
      .replace(/נתן/g, 'העניק')
      .replace(/קיבל/g, 'קיבל')
      .replace(/ביחס ל/g, 'לעניין')
      .replace(/בהתייחס ל/g, 'בנוגע ל')
      .replace(/באופן/g, 'באורח')
      .replace(/לאור העובדה/g, 'הואיל ו')
      // ניקוי כפילויות
      .replace(/הואיל וכי הואיל וכי/g, 'הואיל וכי')
      .replace(/לפיכך לפיכך/g, 'לפיכך');
  };

  const handleAccept = () => {
    if (improvedText) {
      onAccept(improvedText);
      setImprovedText(null);
      setInputText('');
    }
  };

  const handleReject = () => {
    setImprovedText(null);
  };

  const handleTryAgain = () => {
    setImprovedText(null);
    improveText();
  };

  if (improvedText) {
    const improvementRatio = Math.round((improvedText.length / inputText.length) * 100);
    
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">טקסט משופר</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              הרחבה של {improvementRatio}%
            </span>
          </div>

          {/* השוואה */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-bold text-gray-700 mb-2">
                מקורי ({inputText.length} תווים):
              </div>
              <div className="p-3 bg-white border border-gray-300 rounded max-h-40 overflow-y-auto text-right whitespace-pre-line"
                   style={{ fontFamily: 'David', fontSize: '12pt' }}>
                {inputText}
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-green-700 mb-2">
                משופר ({improvedText.length} תווים):
              </div>
              <div className="p-3 bg-white border-2 border-green-400 rounded max-h-40 overflow-y-auto text-right whitespace-pre-line"
                   style={{ fontFamily: 'David', fontSize: '12pt' }}>
                {improvedText}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
            >
              <Check className="w-5 h-5" />
              קבל שיפור
            </button>
            
            <button
              onClick={handleTryAgain}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              שפר שוב
            </button>
            
            <button
              onClick={handleReject}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4" />
              בטל
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-purple-900">AI משפר טקסט</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-purple-900 mb-2">
            טקסט לשיפור:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
            dir="rtl"
            rows={4}
          />
        </div>

        <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
          <div className="font-bold mb-2">🚀 מה ה-AI יעשה:</div>
          <ul className="space-y-1">
            <li>✅ יהרחיב את הטקסט פי 2-3</li>
            <li>✅ יוסיף ביטויים משפטיים ("הואיל ו", "לפיכך")</li>
            <li>✅ יתקן עברית משפטית</li>
            <li>✅ יוסיף פרטים והבהרות</li>
          </ul>
        </div>

        <button
          onClick={improveText}
          disabled={isImproving || !inputText.trim()}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 font-bold"
        >
          {isImproving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>AI עובד על השיפור...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>שפר והרחב טקסט</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
