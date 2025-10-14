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
 * 
 * ⚠️ הערה חשובה: 
 * הקובץ הזה משתמש כרגע בסימולציה מקומית לצורך פיתוח ובדיקה.
 * במערכת הסופית יש להחליף את הפונקציות המקומיות (המסתיימות ב-Locally) 
 * בקריאות ל-API אמיתי של Claude או AI אחר.
 */
export class AILegalWriter {
  private apiEndpoint = 'https://api.anthropic.com/v1/messages'; // ⚠️ יש להחליף ב-API האמיתי
  
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
    try {
      // סימולציה מקומית במקום API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const text = this.generateTextLocally(request);

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
   * יצירת טקסט מקומי ללא API
   */
  private generateTextLocally(request: AIWritingRequest): string {
    const { documentType, tone, length } = request;
    
    // טקסטים בסיסיים לפי סוג מסמך
    const documentTemplates = {
      'will-single': 'אני החתום מטה, בהיותי בהכרה מלאה ובאופן חופשי, מבקש להביע את רצוני האחרון בדבר חלוקת רכושי.',
      'will-couple': 'אנו החתומים מטה, בהיותנו בהכרה מלאה ובאופן חופשי, מבקשים להביע את רצוננו האחרון בדבר חלוקת רכושנו.',
      'advance-directives': 'אני החתום מטה, בהיותי בהכרה מלאה, מורה למטפלים הרפואיים שלי כדלקמן.',
      'fee-agreement': 'הצדדים מסכימים כי שכר הטרחה בעד השירותים המשפטיים יעמוד על הסכום המפורט להלן.',
      'demand-letter': 'בזאת אני מתרה בך כדלקמן ומבקש כי תפעל בהתאם להוראות החוק.',
      'court-pleadings': 'הואיל ו, לפיכך מתבקש בית המשפט הנכבד להורות כדלקמן.'
    };
    
    let text = documentTemplates[documentType as keyof typeof documentTemplates] || 'הטקסט הנדרש לפי בקשה.';
    
    // התאמה לסגנון
    if (tone === 'very-formal') {
      text = text.replace(/אני/g, 'החתום מטה');
      text = text.replace(/אנו/g, 'החתומים מטה');
    }
    
    // התאמה לאורך
    if (length === 'long') {
      text += ' פרטים נוספים יבואו בהמשך בהתאם לצורך והנסיבות.';
    }
    
    return text;
  }

  /**
   * ניסוח מחדש של טקסט קיים
   */
  async rewriteText(request: AIWritingRequest): Promise<AIWritingResponse> {
    if (!request.existingText) {
      throw new Error('חסר טקסט קיים לניסוח מחדש');
    }

    try {
      // סימולציה מקומית במקום API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const text = this.rewriteTextLocally(request);

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
   * ניסוח מחדש מקומי ללא API
   */
  private rewriteTextLocally(request: AIWritingRequest): string {
    const { existingText, documentType, tone } = request;
    
    if (!existingText) return '';
    
    let improved = existingText;
    
    // תיקונים בסיסיים
    improved = improved
      .replace(/ביחס ל/g, 'לעניין')
      .replace(/בהתייחס ל/g, 'בדבר')
      .replace(/באופן/g, 'באורח')
      .replace(/לאור העובדה ש/g, 'הואיל ו')
      .replace(/לנוכח/g, 'נוכח')
      .replace(/בהתאם עם/g, 'בהתאם ל')
      .replace(/לכן/g, 'לפיכך')
      .replace(/בגלל זה/g, 'מכאן ש')
      .replace(/אז/g, 'על כן');
    
    // התאמה לסגנון
    if (tone === 'very-formal') {
      improved = improved
        .replace(/אני/g, 'החתום מטה')
        .replace(/אנו/g, 'החתומים מטה');
    }
    
    return improved;
  }

  /**
   * הצעות לשיפור טקסט
   */
  async getSuggestions(text: string): Promise<string[]> {
    try {
      // סימולציה מקומית במקום API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const suggestions = [
        'בדוק את הניסוח המשפטי',
        'הוסף ביטויים משפטיים מתאימים',
        'שיפור מבנה המשפטים',
        'תיקון עברית משפטית',
        'התאמה לסגנון המסמך'
      ];

      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [
        'בדוק את הניסוח המשפטי',
        'הוסף ביטויים משפטיים מתאימים',
        'שיפור מבנה המשפטים',
      ];
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
        'will-single': 'צוואת יחיד',
        'will-couple': 'צוואה זוגית',
        'advance-directives': 'הנחיות מקדימות',
        'fee-agreement': 'הסכם שכר טרחה',
        'demand-letter': 'מכתב התראה',
        'court-pleadings': 'כתבי בית דין',
        'lawsuit': 'כתב תביעה',
        'motion': 'בקשה לבית משפט',
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
      // סימולציה מקומית במקום API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const text = this.fixHebrewLocally(inputText);

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
   * תיקון עברית מקומי ללא API
   */
  private fixHebrewLocally(inputText: string): string {
    return inputText
      .replace(/ביחס ל/g, 'לעניין')
      .replace(/בהתייחס ל/g, 'בדבר')
      .replace(/באופן/g, 'באורח')
      .replace(/לאור העובדה ש/g, 'הואיל ו')
      .replace(/לנוכח/g, 'נוכח')
      .replace(/בהתאם עם/g, 'בהתאם ל')
      .replace(/לכן/g, 'לפיכך')
      .replace(/בגלל זה/g, 'מכאן ש')
      .replace(/אז/g, 'על כן');
  }

  /**
   * הרחבת טקסט קיים
   */
  async expandText(text: string, direction: string): Promise<AIWritingResponse> {
    try {
      // סימולציה מקומית במקום API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const expandedText = this.expandTextLocally(text, direction);

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
   * הרחבת טקסט מקומית ללא API
   */
  private expandTextLocally(text: string, direction: string): string {
    // הרחבה בסיסית לפי הכיוון
    const expansions = {
      'הוסף פרטים משפטיים': 'בהתאם לדין החלים ובהתאם לכללי האתיקה המקצועית.',
      'הוסף הסברים': 'כפי שיפורט להלן ובהתאם לנסיבות העניין.',
      'הוסף נימוקים': 'לאור האמור לעיל ולצורך השלמת התמונה.',
      'הוסף סעיפי משנה': 'כפי שיפורט בפרטי הדברים הבאים:'
    };
    
    const expansion = expansions[direction as keyof typeof expansions] || 'בהתאם לנסיבות העניין.';
    
    return `${text} ${expansion}`;
  }

  /**
   * קיצור טקסט
   */
  async summarizeText(text: string, targetLength: 'very-short' | 'short' | 'medium'): Promise<AIWritingResponse> {
    try {
      // סימולציה מקומית במקום API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const summarizedText = this.summarizeTextLocally(text, targetLength);

      return {
        text: summarizedText,
        confidence: 0.88,
      };
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw new Error('שגיאה בקיצור הטקסט. אנא נסה שוב.');
    }
  }

  /**
   * קיצור טקסט מקומי ללא API
   */
  private summarizeTextLocally(text: string, targetLength: 'very-short' | 'short' | 'medium'): string {
    // חלוקה למשפטים
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return text;
    
    // בחירת משפטים לפי אורך המטרה
    const targetCount = {
      'very-short': 1,
      'short': Math.min(2, sentences.length),
      'medium': Math.min(3, sentences.length)
    };
    
    const selectedSentences = sentences.slice(0, targetCount[targetLength]);
    
    return selectedSentences.join('. ') + '.';
  }

  /**
   * שיפור חכם לפי הקשר וסגנון
   */
  async improveWithContext(
    text: string,
    context: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings',
    style: 'formal' | 'simple' | 'detailed'
  ): Promise<AIWritingResponse> {
    
    const contextInstructions = {
      'will-single': 'צוואת יחיד - השתמש בלשון גוף ראשון יחיד ("אני", "הנני"), ביטויים: "למען הסר ספק", "הנני מורה", "אני מבטל בזה את כל צוואה קודמת". שפה ברורה וחד-משמעית המבטאת רצון אישי',
      'will-couple': 'צוואה זוגית - השתמש בלשון רבים ("אנו", "הננו"), ביטויים: "אנו מצהירים", "הננו מורים יחדיו", "בהסכמה מלאה בינינו". הדגש על הסכמה הדדית ורצון משותף של בני הזוג',
      'advance-directives': 'הנחיות מקדימות (רפואיות) - השתמש בלשון ברורה ופשוטה יחסית, ביטויים: "במצב בו לא אוכל להביע רצוני", "אני מורה למטפלים הרפואיים", "בהיותי בהכרה מלאה". התמקד בהוראות רפואיות והחלטות סוף חיים',
      'fee-agreement': 'הסכם שכר טרחה - השתמש בלשון עסקית-משפטית, ביטויים: "שכר טרחה", "הצדדים מסכימים", "תנאי התשלום", "היקף השירותים". הדגש על זכויות וחובות הדדיות, תשלומים ושירותים משפטיים',
      'demand-letter': 'מכתב התראה - השתמש בלשון נחרצת ופורמלית, ביטויים: "בזאת אני מתרה בך", "במידה ולא תפעל", "אני שומר על כל זכויותיי", "תוך 7 ימים". טון נחוש המבהיר השלכות אי-פעולה',
      'court-pleadings': 'כתבי בית דין - השתמש בלשון פורמלית מאוד, ביטויים: "הואיל ו", "לפיכך", "נוכח האמור", "מתבקש בית המשפט הנכבד", "לאור האמור לעיל". שפה משפטית גבוהה עם מבנה טיעוני מסודר'
    };

    const styleInstructions = {
      formal: 'סגנון פורמלי סטנדרטי',
      simple: 'סגנון פשוט וברור תוך שמירה על מקצועיות',
      detailed: 'סגנון מפורט עם הסברים והרחבות, הוסף סעיפי משנה וביאורים'
    };

    try {
      // סימולציה מקומית במקום API
      await new Promise(resolve => setTimeout(resolve, 1500)); // סימולציה של עיבוד
      
      const improvedText = this.improveTextLocally(text, context, style);

      if (!improvedText || improvedText.trim() === '') {
        throw new Error('הטקסט המשופר ריק');
      }

      if (!this.validateResponse(text, improvedText)) {
        throw new Error('התשובה מה-AI לא עברה אימות');
      }

      return {
        text: improvedText,
        confidence: 0.92,
      };
    } catch (error) {
      console.error('Error improving with context:', error);
      // במקרה של שגיאה, החזר את הטקסט המקורי עם הודעה
      return {
        text: text + '\n\n[הערה: לא ניתן היה לשפר את הטקסט עם AI כרגע]',
        confidence: 0.1,
      };
    }
  }

  /**
   * שיפור טקסט מקומי ללא API
   */
  private improveTextLocally(
    text: string,
    context: string,
    style: string
  ): string {
    let improved = text;

    // בדוק אם יש תיקונים קודמים למערכת הלמידה
    let relevantCorrections: any[] = [];
    try {
      const learningSystem = require('./ai-learning-system').aiLearningSystem;
      relevantCorrections = learningSystem.getRelevantCorrections(context, style, 3);
    } catch (error) {
      console.warn('לא ניתן לטעון מערכת למידה:', error);
      relevantCorrections = [];
    }
    
    // אם יש תיקונים קודמים, למד מהם
    if (relevantCorrections.length > 0) {
      console.log('🎓 AI לומד מ-' + relevantCorrections.length + ' תיקונים קודמים');
      
      // בדוק אם המשתמש העדיף טקסט קצר או ארוך
      const avgLengthRatio = relevantCorrections.reduce((sum: number, corr: any) => {
        return sum + (corr.userCorrection.length / corr.aiSuggestion.length);
      }, 0) / relevantCorrections.length;
      
      // אם המשתמש מעדיף טקסט קצר יותר, אל תוסיף כלום
      if (avgLengthRatio < 1.1) {
        console.log('📏 משתמש מעדיף טקסט קצר - לא אוסיף הרחבות');
        return improved; // החזר את הטקסט כמו שהוא
      }
    }

    // תיקונים בסיסיים לעברית משפטית
    improved = improved
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

    // הוספת שיפורים לפי הקשר
    if (context === 'will-single') {
      improved = improved
        .replace(/אני מוריש\/ה/g, 'הנני מוריש/ה')
        .replace(/אני מצווה\/ה/g, 'הנני מצווה/ה')
        .replace(/אני מבטל\/ת/g, 'הנני מבטל/ת');
    }
    
    if (context === 'will-couple') {
      improved = improved
        .replace(/אנו מורישים/g, 'הננו מורישים')
        .replace(/אנו מצווים/g, 'הננו מצווים')
        .replace(/אנו מבטלים/g, 'הננו מבטלים');
    }

    // אם הסגנון הוא detailed והוא רוצה הרחבה
    let avgLengthRatio = 1.0; // ברירת מחדל
    if (relevantCorrections.length > 0) {
      avgLengthRatio = relevantCorrections.reduce((sum: number, corr: any) => {
        return sum + (corr.userCorrection.length / corr.aiSuggestion.length);
      }, 0) / relevantCorrections.length;
    }
    
    // הוספת הרחבות לפי הקשר וסגנון
    if (style === 'detailed' && (relevantCorrections.length === 0 || avgLengthRatio > 1.2)) {
      const contextEnhancements = {
        'fee-agreement': 'בהתאם לכללי האתיקה המקצועית ולחוק עורכי הדין.',
        'will-single': 'למען הסר ספק ולצורך הבהרת רצוני המפורש.',
        'will-couple': 'בהסכמה הדדית מלאה ובהתאם לחוק הירושה.',
        'advance-directives': 'בהיותי בהכרה מלאה ובמצב בריאות תקין.',
        'demand-letter': 'בהתאם לחוק ובהתאם לזכויותיי החוקיות.',
        'court-pleadings': 'לאור האמור לעיל ולפי הדין החל על העניין.'
      };
      
      const enhancement = contextEnhancements[context as keyof typeof contextEnhancements];
      if (enhancement && !improved.includes(enhancement)) {
        improved += ` ${enhancement}`;
      }
    }
    
    // הוספת ביטויים משפטיים נוספים
    if (context === 'will-single' && style !== 'simple') {
      if (!improved.includes('למען הסר ספק') && text.length < 150) {
        improved = 'למען הסר ספק, ' + improved;
      }
    }

    // אם הסגנון הוא simple, פשט את הביטויים
    if (style === 'simple') {
      improved = improved
        .replace(/הואיל ו/g, 'כיוון ש')
        .replace(/לפיכך/g, 'לכן')
        .replace(/מכאן ש/g, 'לכן')
        .replace(/על כן/g, 'לכן');
    }

    return improved;
  }

  /**
   * אימות שהתשובה תקינה
   */
  private validateResponse(original: string, improved: string): boolean {
    if (!improved || improved.trim().length < 10) {
      console.warn('❌ התשובה קצרה מדי');
      return false;
    }

    if (improved.length > original.length * 4) {
      console.warn('❌ התשובה ארוכה מדי:', improved.length, 'vs', original.length);
      return false;
    }

    // בדיקה פשוטה יותר - האם יש תוכן עברית
    const hebrewChars = (improved.match(/[\u0590-\u05FF]/g) || []).length;
    const hasHebrewContent = hebrewChars > 5; // לפחות 5 תווי עברית
    
    if (!hasHebrewContent) {
      console.warn('❌ אין תוכן עברית מספיק');
      return false;
    }

    console.log('✅ התשובה עברה אימות:', {
      originalLength: original.length,
      improvedLength: improved.length,
      ratio: (improved.length / original.length).toFixed(2),
      hebrewChars,
      hasHebrewContent
    });

    return true;
  }
}

// ייצוא אינסטנס יחיד
export const aiLegalWriter = new AILegalWriter();

