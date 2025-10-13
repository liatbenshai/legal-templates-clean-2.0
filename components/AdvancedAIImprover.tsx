'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Check, X, History, Zap, FileText } from 'lucide-react';

interface AdvancedAIImproverProps {
  originalText: string;
  onAccept: (improvedText: string) => void;
  onReject: () => void;
  context?: 'court' | 'will' | 'contract' | 'general';
  style?: 'formal' | 'simple' | 'detailed';
}

interface ImprovementSuggestion {
  type: 'expand' | 'correct' | 'enhance' | 'structure';
  title: string;
  description: string;
  preview: string;
}

export default function AdvancedAIImprover({
  originalText,
  onAccept,
  onReject,
  context = 'general',
  style = 'formal'
}: AdvancedAIImproverProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(style);
  const [selectedContext, setSelectedContext] = useState(context);

  const improveText = async () => {
    if (!originalText.trim()) {
      alert('אנא הזן טקסט לשיפור');
      return;
    }
    
    setIsImproving(true);
    
    try {
      // סימולציה של AI מתקדם
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = await performAdvancedImprovement(originalText, selectedContext, selectedStyle);
      setImprovedText(result.improvedText);
      setSuggestions(result.suggestions);
      
    } catch (error) {
      console.error('שגיאה בשיפור:', error);
      alert('שגיאה בשיפור הטקסט. נסה שוב.');
    } finally {
      setIsImproving(false);
    }
  };

  const performAdvancedImprovement = async (
    text: string, 
    context: string, 
    style: string
  ): Promise<{ improvedText: string; suggestions: ImprovementSuggestion[] }> => {
    
    let improvedText = text;
    const suggestions: ImprovementSuggestion[] = [];

    // 1. הרחבת תוכן בסיסית
    if (text.length < 200) {
      const expandedText = expandBasicContent(text, context);
      improvedText = expandedText;
      suggestions.push({
        type: 'expand',
        title: 'הרחבת תוכן',
        description: 'הורחב הטקסט עם פרטים משפטיים נוספים',
        preview: `${text.substring(0, 50)}... → ${expandedText.substring(0, 50)}...`
      });
    }

    // 2. תיקון עברית משפטית
    const correctedText = correctHebrewLegal(improvedText);
    if (correctedText !== improvedText) {
      improvedText = correctedText;
      suggestions.push({
        type: 'correct',
        title: 'תיקון עברית משפטית',
        description: 'תוקן הניסוח לעברית משפטית תקינה',
        preview: 'החלפת ביטויים לא תקינים בביטויים משפטיים מקובלים'
      });
    }

    // 3. שיפור מבנה
    const structuredText = improveStructure(improvedText, context);
    if (structuredText !== improvedText) {
      improvedText = structuredText;
      suggestions.push({
        type: 'structure',
        title: 'שיפור מבנה',
        description: 'שופר המבנה עם מספור וארגון ברור',
        preview: 'נוסף מספור, כותרות וחלוקה לסעיפים'
      });
    }

    // 4. שיפור תוכן לפי הקשר
    const contextEnhanced = enhanceByContext(improvedText, context, style);
    if (contextEnhanced !== improvedText) {
      improvedText = contextEnhanced;
      suggestions.push({
        type: 'enhance',
        title: `שיפור ספציפי ל${context}`,
        description: 'נוסף תוכן מתאים להקשר המשפטי הספציפי',
        preview: 'הוספת סעיפים ומונחים המתאימים לסוג המסמך'
      });
    }

    return { improvedText, suggestions };
  };

  const expandBasicContent = (text: string, context: string): string => {
    const contextExpansions = {
      will: `${text}

למען הסר ספק ולצורך הבהרה מלאה, הנני מוסיף כי:

הוראות אלו מיועדות להבטיח כי רצוני יבוצע במדויק לאחר פטירתי, לאחר אריכות ימים ושנים.

אני מורה בזה ליורשיי כי עליהם לפעול בשיתוף פעולה מלא ובתום לב לביצוע הוראות אלו.

במקרה של אי בהירות או מחלוקת, יש לפנות לבית המשפט המוסמך לקבלת הוראות נוספות.`,

      court: `${text}

הרחבת הטיעונים:
נוכח הנטען לעיל ובהתבסס על העובדות והראיות המפורטות בכתב התביעה, ברי כי הטענות מבוססות ומוצדקות.

יש לציין כי המבקש פועל מתוך זכות מוכרת וברורה, והנתבע מתחמק מביצוע התחייבויותיו החוקיות והחוזיות.

לאור האמור לעיל ונוכח חומרת המצב, מתבקש בית המשפט הנכבד להתערב ולתת מענה מהיר ויעיל לבקשה.`,

      contract: `${text}

פירוט תנאי ההסכם:
הצדדים מסכימים בזה כי כל התחייבות על פי הסכם זה תבוצע במלואה ובמועדה.

כל צד מתחייב לשתף פעולה באופן מלא עם הצד השני ולהימנע מכל פעולה העלולה להפר את ההסכם.

ההסכם כולל את כל התנאים המוסכמים בין הצדדים, ואין מחוצה לו התחייבויות נוספות.`,

      general: `${text}

הוספת פרטים:
לצורך שלמות התמונה ולמען הסר ספק, יש להוסיף כי הוראות אלו מבוססות על הדין החל ועל העקרונות המשפטיים המקובלים.

יש לפעול על פי הוראות אלו תוך הקפדה על זכויות כל הצדדים הנוגעים בדבר.`
    };

    return contextExpansions[context as keyof typeof contextExpansions] || text;
  };

  const correctHebrewLegal = (text: string): string => {
    return text
      // תיקונים בסיסיים
      .replace(/ביחס ל/g, 'לעניין')
      .replace(/בהתייחס ל/g, 'בדבר')
      .replace(/באופן/g, 'באורח')
      .replace(/לאור העובדה ש/g, 'הואיל ו')
      .replace(/לנוכח/g, 'נוכח')
      .replace(/בהתאם עם/g, 'בהתאם ל')
      // הוספת ביטויים משפטיים
      .replace(/לכן/g, 'לפיכך')
      .replace(/בגלל זה/g, 'מכאן ש')
      .replace(/אז/g, 'על כן')
      // שיפור מבנה
      .replace(/\. /g, '.\n\n')  // רווח בין משפטים
      .replace(/:/g, ':\n');    // רווח אחרי נקודותיים
  };

  const improveStructure = (text: string, context: string): string => {
    const sentences = text.split('\n\n').filter(s => s.trim());
    
    if (sentences.length > 3) {
      // הוספת מספור לסעיפים
      const structuredText = sentences.map((sentence, index) => {
        if (sentence.trim().length > 50) {
          return `${index + 1}. ${sentence.trim()}`;
        }
        return sentence;
      }).join('\n\n');
      
      return structuredText;
    }
    
    return text;
  };

  const enhanceByContext = (text: string, context: string, style: string): string => {
    const contextEnhancements = {
      will: {
        formal: `${text}

ביטול צוואות קודמות:
למען הסר ספק, אני מבטל בזה ביטול מוחלט וגמור את כל צוואה או הוראה שנתתי בעבר, בין בכתב ובין בעל פה.

תשלום חובות:
אני מורה ליורשיי לשלם מתוך עיזבוני את כל חובותיי הקיימים בעת פטירתי, לרבות מיסים, הוצאות קבורה והוצאות נלוות.

הוראות לביצוע:
יורשיי יפעלו בשיתוף פעולה מלא לביצוע הוראות אלו ויעשו כל הדרוש למימוש רצוני כמפורט לעיל.`,

        detailed: `${text}

פירוט מלא להוראות הצוואה:

1. ביטול צוואות קודמות:
אני מבטל בזה ביטול גמור, מוחלט ובלתי חוזר, כל צוואה, הוראה לדורות, או כל מסמך אחר מכל סוג שהוא, שנתתי או שייתכן ונתתי בעבר בקשר לרכושי ולעזבוני, בין בכתב ובין בעל פה, בין לפני עדים ובין שלא לפני עדים.

2. חובות העיזבון:
אני מורה ליורשיי לשלם מתוך עיזבוני, בטרם יתחלק העיזבון ביניהם, את כל החובות הבאים:
א. כל חובותיי הכספיים לצדדים שלישיים שיעמדו לפירעון בעת פטירתי;
ב. כל המיסים החלים על העיזבון על פי דין;
ג. הוצאות קבורתי, לרבות רכישת מקום קבורה והקמת מצבה מתאימה;
ד. הוצאות משפטיות הכרוכות בביצוע צוואתי וקבלת צו קיום צוואה;
ה. כל הוצאה אחרת הכרוכה בניהול העיזבון.

3. הוראות לביצוע:
אני מורה ליורשיי כי עליהם לפעול בתום לב ובשיתוף פעולה מלא לביצוע הוראות צוואתי.
במקרה של מחלוקת, יש לפנות לגישור או לבית המשפט לקבלת הכוונה.`
      },

      court: {
        formal: `${text}

המשך הטיעון המשפטי:
לפיכך, נוכח הנטען לעיל ובהתבסס על העובדות והחומר הראייתי המובא בפני בית המשפט הנכבד, ברי כי הטענות מבוססות היטב.

יש להדגיש כי המבקש פועל מתוך זכות ברורה ומוכחת, והנתבע מתחמק מביצוע התחייבויותיו החוקיות.

על כן, מתבקש בית המשפט הנכבד לקבל את הבקשה ולחייב את הנתבע לפעול בהתאם להוראות הדין.`
      }
    };

    const enhancement = contextEnhancements[context as keyof typeof contextEnhancements]?.[style as keyof typeof contextEnhancements[keyof typeof contextEnhancements]];
    return enhancement || text;
  };

  const handleAcceptImprovement = () => {
    if (improvedText) {
      onAccept(improvedText);
      setImprovedText(null);
      setSuggestions([]);
    }
  };

  const handleRejectImprovement = () => {
    setImprovedText(null);
    setSuggestions([]);
    onReject();
  };

  if (improvedText) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">טקסט משופר ומורחב</h3>
          </div>

          {/* השוואה */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm font-bold text-gray-700 mb-2">
                טקסט מקורי ({originalText.length} תווים):
              </div>
              <div className="p-4 bg-white border border-gray-300 rounded-lg min-h-[200px] whitespace-pre-wrap text-right"
                   style={{ fontFamily: 'David', fontSize: '13pt', direction: 'rtl' }}>
                {originalText}
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-green-700 mb-2">
                טקסט משופר ({improvedText.length} תווים - הרחבה של {Math.round((improvedText.length / originalText.length) * 100 - 100)}%):
              </div>
              <div className="p-4 bg-white border-2 border-green-500 rounded-lg min-h-[200px] whitespace-pre-wrap text-right"
                   style={{ fontFamily: 'David', fontSize: '13pt', direction: 'rtl' }}>
                {improvedText}
              </div>
            </div>
          </div>

          {/* הצעות שיפור */}
          {suggestions.length > 0 && (
            <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
              <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                שיפורים שבוצעו:
              </div>
              <div className="space-y-3">
                {suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      suggestion.type === 'expand' ? 'bg-blue-500' :
                      suggestion.type === 'correct' ? 'bg-green-500' :
                      suggestion.type === 'structure' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <div className="font-semibold text-gray-900">{suggestion.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{suggestion.description}</div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">{suggestion.preview}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAcceptImprovement}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
            >
              <Check className="w-5 h-5" />
              קבל שיפורים ({Math.round((improvedText.length / originalText.length))}x יותר תוכן)
            </button>
            <button
              onClick={handleRejectImprovement}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-bold"
            >
              <X className="w-5 h-5" />
              דחה
            </button>
            <button
              onClick={improveText}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <RefreshCw className="w-4 h-4" />
              שפר שוב
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">AI מתקדם להרחבה ושיפור</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">הקשר משפטי:</label>
            <select
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="will">צוואה</option>
              <option value="court">בית משפט</option>
              <option value="contract">הסכם</option>
              <option value="general">כללי</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">סגנון שיפור:</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="detailed">מפורט ומורחב (מומלץ)</option>
              <option value="formal">פורמלי מאוד</option>
              <option value="simple">פשוט וברור</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">🚀 מה ה-AI החדש יעשה:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ <strong>הרחבה פי 2-3</strong> - יוסיף תוכן משפטי רלוונטי</li>
            <li>✅ <strong>תיקון עברית</strong> - החלפת ביטויים לא תקינים</li>
            <li>✅ <strong>מבנה מקצועי</strong> - מספור וארגון ברור</li>
            <li>✅ <strong>סעיפים נוספים</strong> - הוראות משפטיות חסרות</li>
            <li>✅ <strong>ביטויים משפטיים</strong> - "הואיל ו", "לפיכך", "נוכח"</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={improveText}
            disabled={isImproving || !originalText.trim()}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 font-bold text-lg shadow-xl"
          >
            {isImproving ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>AI עובד על השיפור...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>הרחב ושפר עם AI מתקדם</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
