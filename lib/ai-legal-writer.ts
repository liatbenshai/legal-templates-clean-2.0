export interface AIWritingRequest {
  prompt: string;
  context?: string;
  documentType?: string;
  tone?: 'formal' | 'very-formal' | 'neutral';
  length?: 'short' | 'medium' | 'long';
  existingText?: string; // לניסוח מחדש
}

export interface AIWritingResponse {
  text: string;
  suggestions?: string[];
  confidence: number;
}

/**
 * מערכת AI לניסוח משפטי בעברית
 */
export class AILegalWriter {
  private apiEndpoint = 'https://api.anthropic.com/v1/messages';
  
  /**
   * פרומפט בסיסי לניסוח משפטי בעברית תקינה
   */
  private getSystemPrompt(): string {
    return `אתה עורך דין ישראלי מנוסה ומומחה לניסוח משפטי בעברית תקינה.

עקרונות חשובים לניסוח:
1. השתמש בעברית משפטית תקינה ומקצועית - לא בתרגום מאנגלית
2. השתמש במונחים משפטיים מקובלים בישראל
3. השתמש בביטויים כמו "לפיכך", "הואיל ו", "מכאן ש", "על כן"
4. הימנע מביטויים כמו "בהתייחס ל", "ביחס ל" - השתמש ב"לעניין", "בדבר"
5. הימנע מביטוי "באופן" - השתמש ב"כך ש", "בדרך ש"
6. השתמש ב"ככל ש" ולא "ככל ה"
7. השתמש ב"בהתאם ל" ולא "בהתאם עם"
8. השתמש ב"נוכח" במקום "לנוכח"
9. הימנע מ"לאור העובדה ש" - השתמש ב"הואיל ו", "מאחר ש"
10. השתמש במבנה משפטי מקצועי: פסקה פותחת, גוף, פסקה סוגרת
11. מספר סעיפים וסעיפי משנה בצורה ברורה
12. השתמש בפיסוק נכון ומקצועי

דוגמאות לניסוח תקין:
❌ לא נכון: "בהתייחס לבקשה שהוגשה על ידי התובע"
✅ נכון: "לעניין הבקשה שהגיש התובע"

❌ לא נכון: "באופן משמעותי"
✅ נכון: "באורח משמעותי" או "במידה ניכרת"

❌ לא נכון: "ביחס לנושא זה"
✅ נכון: "בנושא זה" או "לעניין זה"

❌ לא נכון: "לאור העובדה שהנתבע לא התייצב"
✅ נכון: "הואיל והנתבע לא התייצב" או "מאחר שהנתבע לא התייצב"

התאם את רמת הפורמליות לסוג המסמך:
- כתבי טענות: פורמלי מאוד, שפה משפטית גבוהה
- הסכמים: פורמלי, ברור ומדויק
- ייפויי כוח: ברור ופשוט יחסית
- בקשות: פורמלי עם הסברים ברורים`;
  }

  /**
   * ניסוח טקסט חדש
   */
  async generateText(request: AIWritingRequest): Promise<AIWritingResponse> {
    const userPrompt = this.buildGeneratePrompt(request);
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${this.getSystemPrompt()}

${userPrompt}

חשוב: ענה רק בעברית משפטית תקינה. אל תכלול הסברים או הערות - רק את הטקסט המבוקש.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text;

      return {
        text,
        confidence: 0.95,
        suggestions: [],
      };
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('שגיאה ביצירת הטקסט. אנא נסה שוב.');
    }
  }

  /**
   * ניסוח מחדש של טקסט קיים
   */
  async rewriteText(request: AIWritingRequest): Promise<AIWritingResponse> {
    if (!request.existingText) {
      throw new Error('חסר טקסט קיים לניסוח מחדש');
    }

    const userPrompt = this.buildRewritePrompt(request);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${this.getSystemPrompt()}

${userPrompt}

חשוב: 
1. שמור על המשמעות והתוכן המקורי
2. שפר את הניסוח לעברית משפטית תקינה
3. תקן שגיאות דקדוקיות ומשפטיות
4. השתמש במונחים משפטיים מקצועיים
5. ענה רק בגרסה המשופרת - ללא הסברים`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text;

      return {
        text,
        confidence: 0.95,
        suggestions: [],
      };
    } catch (error) {
      console.error('Error rewriting text:', error);
      throw new Error('שגיאה בניסוח מחדש של הטקסט. אנא נסה שוב.');
    }
  }

  /**
   * הצעות לשיפור טקסט
   */
  async getSuggestions(text: string): Promise<string[]> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `${this.getSystemPrompt()}

הנה טקסט משפטי בעברית:

"${text}"

אנא ספק 3-5 הצעות קצרות לשיפור הניסוח המשפטי.
כל הצעה צריכה להיות בשורה נפרדת ולהתחיל עם "-"

התמקד ב:
1. תיקון עברית לא תקינה (תרגום מאנגלית)
2. שיפור מונחים משפטיים
3. שיפור מבנה המשפט
4. הצעות לביטויים משפטיים מקצועיים יותר`,
            },
          ],
        }),
      });

      const data = await response.json();
      const suggestionsText = data.content[0].text;

      // פיצול להצעות בודדות
      const suggestions = suggestionsText
        .split('\n')
        .filter((line: string) => line.trim().startsWith('-'))
        .map((line: string) => line.trim().substring(1).trim());

      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * בניית פרומפט ליצירת טקסט
   */
  private buildGeneratePrompt(request: AIWritingRequest): string {
    let prompt = `צור טקסט משפטי בעברית על פי הדרישות הבאות:\n\n`;
    
    prompt += `נושא: ${request.prompt}\n\n`;

    if (request.context) {
      prompt += `הקשר נוסף: ${request.context}\n\n`;
    }

    if (request.documentType) {
      const docTypeNames: Record<string, string> = {
        'lawsuit': 'כתב תביעה',
        'motion': 'בקשה לבית משפט',
        'contract': 'הסכם',
        'will': 'צוואה',
        'power-of-attorney': 'ייפוי כוח',
        'appeal': 'ערעור',
        'response': 'כתב הגנה',
        'opinion': 'חוות דעת',
      };
      prompt += `סוג המסמך: ${docTypeNames[request.documentType] || request.documentType}\n\n`;
    }

    const toneMap: Record<string, string> = {
      'formal': 'פורמלי',
      'very-formal': 'פורמלי מאוד (לבית משפט)',
      'neutral': 'ניטרלי מקצועי',
    };
    prompt += `טון: ${toneMap[request.tone || 'formal']}\n\n`;

    const lengthMap: Record<string, string> = {
      'short': 'קצר (1-2 פסקאות)',
      'medium': 'בינוני (3-5 פסקאות)',
      'long': 'ארוך (6+ פסקאות)',
    };
    prompt += `אורך: ${lengthMap[request.length || 'medium']}\n\n`;

    return prompt;
  }

  /**
   * בניית פרומפט לניסוח מחדש
   */
  private buildRewritePrompt(request: AIWritingRequest): string {
    let prompt = `נסח מחדש את הטקסט הבא בעברית משפטית תקינה:\n\n`;
    
    prompt += `"${request.existingText}"\n\n`;

    if (request.prompt) {
      prompt += `הנחיות נוספות: ${request.prompt}\n\n`;
    }

    const toneMap: Record<string, string> = {
      'formal': 'פורמלי',
      'very-formal': 'פורמלי מאוד',
      'neutral': 'ניטרלי מקצועי',
    };
    prompt += `טון רצוי: ${toneMap[request.tone || 'formal']}\n\n`;

    return prompt;
  }

  /**
   * תיקון עברית משפטית
   */
  async fixHebrewLegalLanguage(inputText: string): Promise<AIWritingResponse> {
    try {
      const response: Response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${this.getSystemPrompt()}

תקן את הטקסט הבא לעברית משפטית תקינה:

"${inputText}"

תקן במיוחד:
1. ביטויים שהם תרגום מאנגלית
2. שגיאות דקדוקיות
3. שימוש לא נכון במילות יחס
4. מבנה משפטים לא תקין
5. מונחים משפטיים לא מדויקים

ענה רק בגרסה המתוקנת - ללא הסברים.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text;

      return {
        text,
        confidence: 0.95,
      };
    } catch (error) {
      console.error('Error fixing Hebrew:', error);
      throw new Error('שגיאה בתיקון העברית. אנא נסה שוב.');
    }
  }

  /**
   * הרחבת טקסט קיים
   */
  async expandText(text: string, direction: string): Promise<AIWritingResponse> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${this.getSystemPrompt()}

הטקסט הבסיסי:
"${text}"

הנחיה להרחבה: ${direction}

הרחב את הטקסט בעברית משפטית תקינה:
1. שמור על הסגנון והטון
2. הוסף פרטים ונימוקים רלוונטיים
3. שמור על עקביות עם הטקסט המקורי
4. השתמש במונחים משפטיים מקצועיים

ענה רק בטקסט המורחב - ללא הסברים.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const expandedText = data.content[0].text;

      return {
        text: expandedText,
        confidence: 0.90,
      };
    } catch (error) {
      console.error('Error expanding text:', error);
      throw new Error('שגיאה בהרחבת הטקסט. אנא נסה שוב.');
    }
  }

  /**
   * קיצור טקסט
   */
  async summarizeText(text: string, targetLength: 'very-short' | 'short' | 'medium'): Promise<AIWritingResponse> {
    const lengthMap = {
      'very-short': '1-2 משפטים',
      'short': '1 פסקה',
      'medium': '2-3 פסקאות',
    };

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `${this.getSystemPrompt()}

קצר את הטקסט הבא ל-${lengthMap[targetLength]}:

"${text}"

דרישות:
1. שמור על העיקר והמסר המרכזי
2. השתמש בעברית משפטית תקינה
3. שמור על הטון המשפטי
4. הימנע מאובדן מידע קריטי

ענה רק בטקסט המקוצר - ללא הסברים.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const summarizedText = data.content[0].text;

      return {
        text: summarizedText,
        confidence: 0.88,
      };
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw new Error('שגיאה בקיצור הטקסט. אנא נסה שוב.');
    }
  }
}

// ייצוא אינסטנס יחיד
export const aiLegalWriter = new AILegalWriter();

