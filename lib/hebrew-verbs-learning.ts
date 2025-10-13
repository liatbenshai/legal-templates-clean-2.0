/**
 * מערכת למידה לפעלים בעברית - לומדת מהתיקונים של המשתמש
 */

export interface VerbCorrection {
  id: string;
  verb: string;
  context: 'child' | 'heir' | 'guardian' | 'testator' | 'attorney';
  gender: 'male' | 'female' | 'plural';
  correctedSuffix: string;
  originalSuffix: string;
  timestamp: number;
  user: string;
}

export interface LearnedVerb {
  verb: string;
  context: 'child' | 'heir' | 'guardian' | 'testator' | 'attorney';
  male: string;
  female: string;
  plural: string;
  confidence: number; // 0-1
  corrections: number;
  lastUsed: number;
}

class HebrewVerbsLearning {
  private corrections: VerbCorrection[] = [];
  private learnedVerbs: Map<string, LearnedVerb> = new Map();
  private storageKey = 'hebrew_verbs_learning';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * הוספת תיקון חדש
   */
  addCorrection(verb: string, context: string, gender: string, correctedSuffix: string, originalSuffix: string, user: string = 'user') {
    const correction: VerbCorrection = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      verb,
      context: context as any,
      gender: gender as any,
      correctedSuffix,
      originalSuffix,
      timestamp: Date.now(),
      user
    };

    this.corrections.push(correction);
    this.updateLearnedVerb(verb, context, gender, correctedSuffix);
    this.saveToStorage();
    
    console.log('✅ תיקון נשמר:', correction);
  }

  /**
   * עדכון פועל נלמד
   */
  private updateLearnedVerb(verb: string, context: string, gender: string, correctedSuffix: string) {
    const key = `${verb}_${context}`;
    const existing = this.learnedVerbs.get(key);
    
    if (existing) {
      // עדכון פועל קיים
      existing[gender as keyof LearnedVerb] = correctedSuffix;
      existing.corrections++;
      existing.confidence = Math.min(0.95, existing.confidence + 0.1);
      existing.lastUsed = Date.now();
    } else {
      // יצירת פועל חדש
      const newVerb: LearnedVerb = {
        verb,
        context: context as any,
        male: gender === 'male' ? correctedSuffix : '',
        female: gender === 'female' ? correctedSuffix : '',
        plural: gender === 'plural' ? correctedSuffix : '',
        confidence: 0.5,
        corrections: 1,
        lastUsed: Date.now()
      };
      
      this.learnedVerbs.set(key, newVerb);
    }
  }

  /**
   * קבלת סיומת מומלצת לפועל
   */
  getRecommendedSuffix(verb: string, context: string, gender: string): string | null {
    const key = `${verb}_${context}`;
    const learned = this.learnedVerbs.get(key);
    
    if (learned && learned.confidence > 0.3) {
      return learned[gender as keyof LearnedVerb] || '';
    }
    
    return null;
  }

  /**
   * קבלת כל התיקונים
   */
  getCorrections(): VerbCorrection[] {
    return [...this.corrections].sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * קבלת כל הפעלים הנלמדים
   */
  getLearnedVerbs(): LearnedVerb[] {
    return Array.from(this.learnedVerbs.values()).sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * חיפוש פעלים דומים
   */
  findSimilarVerbs(verb: string, context: string): LearnedVerb[] {
    const results: LearnedVerb[] = [];
    
    for (const [key, learned] of this.learnedVerbs) {
      if (learned.context === context && learned.verb.includes(verb)) {
        results.push(learned);
      }
    }
    
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * שמירה ב-localStorage
   */
  private saveToStorage() {
    try {
      const data = {
        corrections: this.corrections,
        learnedVerbs: Array.from(this.learnedVerbs.entries())
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('שגיאה בשמירת נתוני למידה:', error);
    }
  }

  /**
   * טעינה מ-localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.corrections = data.corrections || [];
        this.learnedVerbs = new Map(data.learnedVerbs || []);
      }
    } catch (error) {
      console.error('שגיאה בטעינת נתוני למידה:', error);
    }
  }

  /**
   * איפוס נתוני למידה
   */
  reset() {
    this.corrections = [];
    this.learnedVerbs.clear();
    localStorage.removeItem(this.storageKey);
    console.log('🔄 נתוני למידה אופסו');
  }

  /**
   * ייצוא נתוני למידה
   */
  exportData() {
    return {
      corrections: this.corrections,
      learnedVerbs: Array.from(this.learnedVerbs.entries()),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * יבוא נתוני למידה
   */
  importData(data: any) {
    try {
      this.corrections = data.corrections || [];
      this.learnedVerbs = new Map(data.learnedVerbs || []);
      this.saveToStorage();
      console.log('✅ נתוני למידה יובאו בהצלחה');
      return true;
    } catch (error) {
      console.error('שגיאה ביבוא נתוני למידה:', error);
      return false;
    }
  }
}

// יצירת instance גלובלי
export const hebrewVerbsLearning = new HebrewVerbsLearning();

/**
 * פונקציה עזר לקבלת סיומת מגדר
 */
export function getGenderSuffix(verb: string, context: string, gender: string): string {
  // קודם נבדוק אם יש למידה
  const learned = hebrewVerbsLearning.getRecommendedSuffix(verb, context, gender);
  if (learned !== null) {
    return learned;
  }

  // ברירת מחדל
  if (context === 'child' || context === 'heir' || context === 'guardian') {
    return gender === 'female' ? 'ה' : gender === 'plural' ? 'ו' : '';
  } else {
    return gender === 'female' ? 'ת' : gender === 'plural' ? 'ים' : '';
  }
}
