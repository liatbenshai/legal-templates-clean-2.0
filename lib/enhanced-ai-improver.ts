/**
 * מערכת AI משופרת לשיפור טקסטים משפטיים
 * 
 * מטרה: להפוך עברית מתורגמת (AI-generated) לעברית משפטית תקנית
 * 
 * CRITICAL: The AI must NOT add any content that wasn't in the original text.
 * It should only:
 * - Fix grammar and spelling
 * - Transform to formal legal language
 * - Preserve all original information (amounts, dates, conditions)
 * 
 * For full instructions, see: legal-text-processing-prompt.md
 */

import { legalHebrewRules, beforeAfterExamples, legalPhrases } from './legal-hebrew-guide';

/**
 * בניית פרומפט מקצועי ל-AI עם כללים מפורשים ודוגמאות מהלמידה
 */
export function buildEnhancedPrompt(originalText: string, context?: {
  documentType?: string;
  targetAudience?: string;
  formalityLevel?: 'high' | 'medium';
  specificInstructions?: string;
}): string {
  // טעינת דוגמאות מהלמידה
  const userExamples = loadFeedback()
    .filter(entry => entry.userCorrection && entry.userRating >= 4) // רק דוגמאות טובות
    .slice(-10); // 10 האחרונות
  
  const rulesText = legalHebrewRules
    .map(rule => `❌ אל תכתוב: "${rule.wrongPattern}"\n✅ כתוב במקום: "${rule.correctPattern}"\n📝 הסבר: ${rule.explanation}`)
    .join('\n\n');

  const examplesText = beforeAfterExamples
    .map(ex => `דוגמה - ${ex.type}:\n\n🔴 לפני:\n${ex.before}\n\n🟢 אחרי:\n${ex.after}\n\nשיפורים שנעשו:\n${ex.improvements.map(imp => `• ${imp}`).join('\n')}`)
    .join('\n\n---\n\n');

  // דוגמאות שנלמדו מהמשתמש - אלו הכי חשובות!
  const learnedExamplesText = userExamples.length > 0
    ? `\n\n## 🎓 דוגמאות שנלמדו ממשתמשים מקצועיים (השתמש בהן!)\n\n${
        userExamples.map((entry, idx) => 
          `דוגמה ${idx + 1} (דירוג: ${entry.userRating}/5):\n\n🔴 לפני (AI יצר):\n${entry.improvedText}\n\n🟢 אחרי (מומחה תיקן):\n${entry.userCorrection}\n\n⭐ זו דוגמה איכותית - למד את סגנון הכתיבה!`
        ).join('\n\n---\n\n')
      }`
    : '';

  // ההוראות המפורטות מוטמעות ישירות בקוד
  const systemPrompt = `# הוראות לעיבוד טקסטים משפטיים

## תיאור המשימה
המר טקסט לא פורמלי/טיוטה ללשון משפטית תקנית בעברית, תוך שמירה על התוכן המקורי בדיוק.

---

## חוקים קשיחים - CRITICAL RULES

### ❌ אסורים לחלוטין:
1. אסור להוסיף תוכן שלא היה במקור - אל תמציא הוראות, תנאים, או סעיפים חדשים
2. אסור להוסיף פסקאות גנריות כמו:
   - "הוראות משלימות"
   - "נוכח חשיבות הנושא"
   - "שיתוף פעולה מלא"
   - "כבוד הדדי"
   - "בהתאם לכללי האתיקה"
   - "באמצעים מאובטחים"
3. אסור להוסיף ביטויים משפטיים סטנדרטיים שלא היו בטקסט המקורי
4. אסור למחוק מידע - כל פרט מהמקור חייב להישאר
5. אסור להוסיף תהליכים, מועדים, או דרישות שלא צוינו במקור

### ✅ מה כן לעשות:
1. תקן עברית - דקדוק, כתיב, וניסוח
2. שדרג ללשון משפטית פורמלית - שמור על אותו תוכן, אבל בנוסח משפטי
3. פרק לסעיפים - רק אם הטקסט המקורי מכיל מספר נושאים שונים שדורשים הפרדה
4. שמור על כל העובדות והפרטים הספציפיים - סכומים, תאריכים, שמות, תנאים

---

## דוגמה קריטית:

**מקור:**
"תנאי תשלום: הסכום הראשוני ישולם עם החתימה על ההסכם, האחוזים לאחר קבלת הכספים מהתביעה"

**❌ WRONG - הוסיף תוכן:**
"תנאי תשלום: הסכום הראשוני ישולם עם החתימה על ההסכם, האחוזים לאחר קבלת הכספים מהתביעה. כמו כן, הוראות משלימות: נוכח חשיבות הנושא, יש לוודא ביצוע מדויק של כל ההוראות..."

**✅ CORRECT - רק תיקון לשוני:**
"תנאי תשלום: הסכום הראשוני ישולם במועד חתימת ההסכם, והאחוזים ישולמו לאחר קבלת הכספים מהתביעה"

---

## תזכורת חשובה
THIS IS A STRICT FORMATTING TASK - NOT A CONTENT GENERATION TASK.
Your job is to TRANSLATE the style, NOT to ADD content.`;

  const userMessage = `
הטקסט המקורי:
${originalText}

בצע עיבוד של הטקסט לפי ההוראות.`;

  // החזרת הפרומפט המלא
  const prompt = `${systemPrompt}

---

${userMessage}`;

  return prompt;
}

/**
 * קריאה ל-API של Anthropic Claude עם הפרומפט המשופר
 */
export async function improveWithEnhancedAI(
  text: string,
  apiKey: string,
  context?: {
    documentType?: string;
    targetAudience?: string;
    formalityLevel?: 'high' | 'medium';
    specificInstructions?: string;
  }
): Promise<{
  improvedText: string;
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    // בדיקת API Key
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API Key חסר. אנא הזן מפתח API תקין.');
    }

    if (!apiKey.startsWith('sk-ant-')) {
      throw new Error('API Key לא תקין. המפתח צריך להתחיל ב-sk-ant-');
    }

    const prompt = buildEnhancedPrompt(text, context);
    
    console.log('שולח בקשה ל-API...');
    
    // קריאה דרך ה-API route שלנו כדי לפתור בעיית CORS
    const response = await fetch('/api/improve-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        apiKey,
        prompt
      })
    });

    console.log('סטטוס תגובה:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('שגיאת API:', errorData);
      
      let errorMessage = errorData?.error || `שגיאת API: ${response.status}`;
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('תגובה מוצלחת מ-API');
    
    if (!data.success || !data.improvedText) {
      throw new Error('תגובה לא צפויה מה-API');
    }
    
    const improvedText = data.improvedText;

    // Validation: בדיקה שהתשובה לא ריקה ושהתוכן לא גדול מדי
    if (!improvedText || improvedText.trim().length === 0) {
      throw new Error('התשובה מהמערכת ריקה');
    }

    // בדיקה שהתשובה לא גדולה פי 2 מהמקור (אינדיקציה שהוסיפו תוכן)
    if (improvedText.length > text.length * 2) {
      console.warn('התשובה ארוכה מהמקור - ייתכן שהוספו תוכן מיותר');
    }

    return {
      improvedText,
      success: true
    };
  } catch (error) {
    console.error('שגיאה בשיפור עם AI:', error);
    
    let errorMessage = 'שגיאה לא ידועה';
    let details: any = undefined;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'בעיית תקשורת עם השרת. בדוק את החיבור לאינטרנט.';
    }
    
    return {
      improvedText: text,
      success: false,
      error: errorMessage,
      details: error
    };
  }
}

/**
 * שיפור מקומי בסיסי ללא API (fallback)
 */
export function improveTextLocally(text: string): string {
  let improved = text;
  
  // החלפות בסיסיות לפי הכללים
  const basicReplacements: [RegExp, string][] = [
    [/\bבכפוף ל/g, 'בהתאם ל'],
    [/\bבנוגע ל/g, 'באשר ל'],
    [/\bעם זאת,/g, 'ואולם,'],
    [/\bלכן,/g, 'לפיכך,'],
    [/\bבנוסף,/g, 'כמו כן,'],
    [/\bעל מנת ל/g, 'כדי ל'],
    [/\bבכדי ל/g, 'כדי ל'],
    [/\bהצד הראשון/g, 'הצד הראשון'],
    [/\bהצד השני/g, 'הצד השני'],
    [/\bיהיה נחשב/g, 'ייחשב'],
    [/\bצריך ל/g, 'יש ל'],
    [/\bחייב ל/g, 'על ... ל'],
  ];
  
  basicReplacements.forEach(([pattern, replacement]) => {
    improved = improved.replace(pattern, replacement);
  });
  
  return improved;
}

/**
 * מערכת feedback - שמירת תיקונים למידה עתידית
 */
export interface FeedbackEntry {
  id: string;
  originalText: string;
  improvedText: string;
  userRating: number; // 1-5
  userCorrection?: string; // אם המשתמש תיקן משהו
  timestamp: Date;
  documentType?: string;
}

let feedbackDatabase: FeedbackEntry[] = [];

/**
 * שמירת feedback למערכת הלמידה
 */
export function saveFeedback(entry: Omit<FeedbackEntry, 'id' | 'timestamp'>): string {
  const feedbackEntry: FeedbackEntry = {
    ...entry,
    id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date()
  };
  
  feedbackDatabase.push(feedbackEntry);
  
  // שמירה ל-localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('legal_ai_feedback', JSON.stringify(feedbackDatabase));
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }
  }
  
  return feedbackEntry.id;
}

/**
 * טעינת feedback מה-localStorage
 */
export function loadFeedback(): FeedbackEntry[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('legal_ai_feedback');
      if (stored) {
        feedbackDatabase = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load feedback:', e);
    }
  }
  return feedbackDatabase;
}

/**
 * קבלת סטטיסטיקות על ביצועי ה-AI
 */
export function getAIStatistics() {
  const feedback = loadFeedback();
  
  if (feedback.length === 0) {
    return {
      totalFeedbacks: 0,
      averageRating: 0,
      improvementRate: 0,
      commonIssues: []
    };
  }
  
  const totalRating = feedback.reduce((sum, entry) => sum + entry.userRating, 0);
  const averageRating = totalRating / feedback.length;
  
  const withCorrections = feedback.filter(entry => entry.userCorrection).length;
  const improvementRate = ((feedback.length - withCorrections) / feedback.length) * 100;
  
  return {
    totalFeedbacks: feedback.length,
    averageRating: averageRating.toFixed(2),
    improvementRate: improvementRate.toFixed(1) + '%',
    commonIssues: [] // ניתן להוסיף ניתוח של בעיות נפוצות
  };
}

/**
 * ייצוא הפידבקים לקובץ לניתוח
 */
export function exportFeedbackData(): string {
  const feedback = loadFeedback();
  return JSON.stringify(feedback, null, 2);
}

