import Anthropic from '@anthropic-ai/sdk';

export interface AIWritingRequest {
  prompt: string;
  context?: string;
  documentType?: string;
  tone?: 'formal' | 'very-formal' | 'neutral';
  length?: 'short' | 'medium' | 'long';
  existingText?: string;
}

export interface AIWritingResponse {
  text: string;
  suggestions?: string[];
  confidence: number;
}

/**
 * מערכת AI לניסוח משפטי בעברית - עם Claude API אמיתי
 */
export class AILegalWriter {
  private client: Anthropic;
  
  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('⚠️ חסר ANTHROPIC_API_KEY - המערכת תשתמש במצב סימולציה');
    }
    
    this.client = new Anthropic({
      apiKey: apiKey || 'dummy-key',
      dangerouslyAllowBrowser: true // מאפשר שימוש מהדפדפן
    });
  }

  /**
   * פרומפט מערכת מקצועי לעברית משפטית
   */
  private getSystemPrompt(): string {
    return `אתה עורך דין ישראלי מומחה בניסוח משפטי בעברית תקינה ומקצועית.

## עקרונות ניסוח חובה:

### ביטויים שצריך להימנע מהם (אנגלית מתורגמת):
❌ "ביחס ל" → ✅ "לעניין", "בדבר"
❌ "בהתייחס ל" → ✅ "בדבר", "לעניין"
❌ "באופן" → ✅ "באורח", "בדרך", או תיאור ישיר
❌ "לאור העובדה ש" → ✅ "הואיל ו", "מאחר ש"
❌ "על מנת ל" → ✅ "כדי ל", "לשם"
❌ "בנוגע ל" → ✅ "בעניין", "לעניין"
❌ "ביחס ל" → ✅ "לגבי", "בקשר ל"
❌ "לנוכח" → ✅ "נוכח"
❌ "בהתאם עם" → ✅ "בהתאם ל"

### ביטויים משפטיים נכונים בעברית:
✅ "הואיל ו" - לפתיחת סעיף רקע
✅ "לפיכך" - למסקנה
✅ "מכאן ש" - לקשר סיבתי
✅ "על כן" - לסיכום
✅ "נוכח" - לתיאור נסיבות (לא "לנוכח")
✅ "למען הסר ספק" - להבהרה
✅ "ככל ש" - לתנאי (לא "ככל ה")

### מבנה משפטי תקין:
- משפטים קצרים וברורים (לא משפטים ארוכים מדי)
- סעיפים ממוספרים
- פיסוק נכון (פסיקים, נקודות פסיק)
- שימוש נכון בזכר/נקבה וביחיד/רבים

### התאמה לסוג מסמך:
- **צוואה**: "אני החתום מטה", "הנני מצווה", "למען הסר ספק"
- **הסכם**: "הצדדים מסכימים", "תנאי ההסכם", "בהתאם להוראות"
- **כתב טענות**: "הואיל ו", "לפיכך", "נוכח האמור לעיל"
- **מכתב התראה**: "בזאת אני מתרה", "במידה ולא", "תוך X ימים"

## המשימה שלך:
1. תקן כל ביטוי שהוא תרגום מאנגלית
2. השתמש בעברית משפטית תקינה
3. שמור על המשמעות המקורית
4. שפר את המבנה והבהירות
5. התאם לסוג המסמך והטון הנדרש

תחזיר רקאת הטקסט המשופר, ללא הסברים או הערות.`;
  }

  /**
   * תיקון עברית משפטית - הפונקציה העיקרית!
   */
  async fixHebrewLegalLanguage(inputText: string): Promise<AIWritingResponse> {
    // בדיקות בסיסיות
    if (!inputText || inputText.trim().length === 0) {
      throw new Error('הטקסט ריק');
    }

    if (inputText.length > 10000) {
      throw new Error('הטקסט ארוך מדי (מקסימום 10,000 תווים)');
    }

    try {
      const message = await this.client.messages.create({
        model: 'claude-3-haiku-20240307', // מודל בסיסי וזול
        max_tokens: 4096,
        temperature: 0.3, // יציבות גבוהה לטקסט משפטי
        system: this.getSystemPrompt(),
        messages: [
          {
            role: 'user',
            content: `תקן את הטקסט המשפטי הבא לעברית תקינה:

${inputText}

חשוב: החזר רק את הטקסט המתוקן, ללא הסברים.`
          }
        ]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('תשובה לא תקינה מה-API');
      }

      const improvedText = content.text.trim();

      // אימות תשובה
      if (!improvedText || improvedText.length < 10) {
        throw new Error('התשובה מה-API קצרה מדי');
      }

      return {
        text: improvedText,
        confidence: 0.95,
        suggestions: []
      };

    } catch (error: any) {
      console.error('שגיאה ב-Claude API:', error);
      
      // אם אין API key - חזור למצב סימולציה
      if (error.message?.includes('API key') || error.status === 401) {
        console.warn('🔄 עובר למצב סימולציה (אין API key תקין)');
        return this.fallbackToLocalMode(inputText);
      }
      
      throw new Error(`שגיאה בתקשורת עם AI: ${error.message}`);
    }
  }

  /**
   * שיפור עם הקשר וסגנון
   */
  async improveWithContext(
    text: string,
    context: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings',
    style: 'formal' | 'simple' | 'detailed'
  ): Promise<AIWritingResponse> {
    
    const contextDescriptions = {
      'will-single': 'צוואת יחיד - השתמש בלשון יחיד, ביטויים: "אני החתום מטה", "הנני מצווה", "למען הסר ספק"',
      'will-couple': 'צוואה זוגית - השתמש בלשון רבים, ביטויים: "אנו החתומים מטה", "הננו מצווים", "בהסכמה הדדית"',
      'advance-directives': 'הנחיות מקדימות רפואיות - שפה ברורה ופשוטה, ביטויים: "במצב בו לא אוכל", "אני מורה למטפלים"',
      'fee-agreement': 'הסכם שכר טרחה - ביטויים: "שכר טרחה", "הצדדים מסכימים", "תנאי התשלום"',
      'demand-letter': 'מכתב התראה - טון נחרץ, ביטויים: "בזאת אני מתרה", "במידה ולא", "תוך 7 ימים"',
      'court-pleadings': 'כתבי בית משפט - שפה פורמלית מאוד, ביטויים: "הואיל ו", "לפיכך", "מתבקש בית המשפט"'
    };

    const styleDescriptions = {
      formal: 'סגנון פורמלי רגיל',
      simple: 'סגנון פשוט וברור, הימנע מביטויים מסורבלים',
      detailed: 'סגנון מפורט עם הרחבות והסברים'
    };

    try {
      const message = await this.client.messages.create({
        model: 'claude-3-haiku-20240307', // מודל בסיסי וזול
        max_tokens: 4096,
        temperature: 0.3,
        system: this.getSystemPrompt(),
        messages: [
          {
            role: 'user',
            content: `שפר את הטקסט המשפטי הבא:

סוג מסמך: ${contextDescriptions[context]}
סגנון: ${styleDescriptions[style]}

הטקסט לשיפור:
${text}

הנחיות:
1. תקן עברית מתורגמת לעברית משפטית תקינה
2. התאם את הסגנון לסוג המסמך
3. שמור על המשמעות המקורית
4. החזר רק את הטקסט המשופר ללא הסברים`
          }
        ]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('תשובה לא תקינה');
      }

      const improvedText = content.text.trim();

      return {
        text: improvedText,
        confidence: 0.95
      };

    } catch (error: any) {
      console.error('שגיאה בשיפור עם הקשר:', error);
      
      if (error.message?.includes('API key') || error.status === 401) {
        return this.fallbackToLocalMode(text);
      }
      
      throw new Error(`שגיאה: ${error.message}`);
    }
  }

  /**
   * הצעות לשיפור
   */
  async getSuggestions(text: string): Promise<string[]> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-haiku-20240307', // מודל בסיסי וזול
        max_tokens: 1024,
        temperature: 0.5,
        system: 'אתה עורך דין מומחה. תן 3-5 הצעות קצרות לשיפור טקסט משפטי.',
        messages: [
          {
            role: 'user',
            content: `תן הצעות לשיפור הטקסט הזה (כל הצעה בשורה נפרדת):

${text.substring(0, 500)}...`
          }
        ]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        return [];
      }

      return content.text
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 5);

    } catch (error) {
      console.error('שגיאה בקבלת הצעות:', error);
      return [
        'בדוק את הניסוח המשפטי',
        'התאם את הסגנון לסוג המסמך',
        'תקן ביטויים מתורגמים'
      ];
    }
  }

  /**
   * מצב גיבוי - שיפור מקומי בסיסי
   */
  private fallbackToLocalMode(text: string): AIWritingResponse {
    console.log('🔧 מצב גיבוי: תיקונים בסיסיים בלבד');
    
    let improved = text
      .replace(/ביחס ל/g, 'לעניין')
      .replace(/בהתייחס ל/g, 'בדבר')
      .replace(/באופן/g, 'באורח')
      .replace(/לאור העובדה ש/g, 'הואיל ו')
      .replace(/לנוכח/g, 'נוכח')
      .replace(/בהתאם עם/g, 'בהתאם ל')
      .replace(/על מנת ל/g, 'כדי ל')
      .replace(/בנוגע ל/g, 'בעניין')
      .replace(/לכן/g, 'לפיכך');

    return {
      text: improved,
      confidence: 0.6,
      suggestions: ['[מצב גיבוי] - לשיפור מלא הוסף ANTHROPIC_API_KEY']
    };
  }

  // שאר הפונקציות נשארות כמו שהן (generateText, rewriteText וכו')
  async generateText(request: AIWritingRequest): Promise<AIWritingResponse> {
    // TODO: ניתן להוסיף מימוש מלא בהמשך
    throw new Error('לא מומש עדיין');
  }

  async rewriteText(request: AIWritingRequest): Promise<AIWritingResponse> {
    // TODO: ניתן להוסיף מימוש מלא בהמשך
    throw new Error('לא מומש עדיין');
  }

  async expandText(text: string, direction: string): Promise<AIWritingResponse> {
    // TODO: ניתן להוסיף מימוש מלא בהמשך
    throw new Error('לא מומש עדיין');
  }

  async summarizeText(text: string, targetLength: 'very-short' | 'short' | 'medium'): Promise<AIWritingResponse> {
    // TODO: ניתן להוסיף מימוש מלא בהמשך
    throw new Error('לא מומש עדיין');
  }
}

// ייצוא אינסטנס יחיד
export const aiLegalWriter = new AILegalWriter();
