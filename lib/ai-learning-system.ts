/**
 * מערכת למידה מתיקוני משתמש בזמן אמת
 */

export interface UserCorrection {
  id: string;
  context: string;
  style: string;
  aiSuggestion: string;      // מה שה-AI הציע
  userCorrection: string;    // מה שהמשתמש תיקן
  original: string;          // הטקסט המקורי
  timestamp: number;
  correctionType: 'minor' | 'major' | 'accepted'; // סוג התיקון
}

export class AILearningSystem {
  private storageKey = 'ai-learning-corrections';
  private maxCorrections = 100;

  /**
   * שמירת תיקון משתמש
   */
  saveCorrection(
    original: string,
    aiSuggestion: string,
    userCorrection: string,
    context: string,
    style: string
  ): void {
    const corrections = this.getCorrections();
    
    // זהה את סוג התיקון
    const correctionType = this.analyzeCorrectionType(aiSuggestion, userCorrection);
    
    const newCorrection: UserCorrection = {
      id: this.generateId(),
      original,
      aiSuggestion,
      userCorrection,
      context,
      style,
      timestamp: Date.now(),
      correctionType,
    };

    corrections.unshift(newCorrection);
    
    const limited = corrections.slice(0, this.maxCorrections);
    localStorage.setItem(this.storageKey, JSON.stringify(limited));
    
    console.log(`✅ תיקון נשמר (${correctionType}):`, {
      aiLength: aiSuggestion.length,
      userLength: userCorrection.length,
      diff: userCorrection.length - aiSuggestion.length
    });
  }

  /**
   * קבלת כל התיקונים
   */
  getCorrections(): UserCorrection[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('שגיאה בטעינת תיקונים:', error);
      return [];
    }
  }

  /**
   * קבלת תיקונים רלוונטיים
   */
  getRelevantCorrections(context: string, style: string, limit: number = 5): UserCorrection[] {
    const corrections = this.getCorrections();
    
    return corrections
      .filter(c => c.context === context && c.style === style)
      .slice(0, limit);
  }

  /**
   * בניית prompt משופר מתיקוני משתמש
   */
  buildEnhancedPrompt(
    basePrompt: string,
    context: string,
    style: string
  ): string {
    const corrections = this.getRelevantCorrections(context, style, 3);
    
    if (corrections.length === 0) {
      return basePrompt;
    }

    let enhanced = basePrompt + '\n\n';
    enhanced += '🎓 **למידה מתיקונים קודמים:**\n';
    enhanced += 'בעבר, המשתמש תיקן את הצעותיי באופן הבא. אנא למד מהתיקונים האלה:\n\n';
    
    corrections.forEach((correction, i) => {
      enhanced += `תיקון ${i + 1}:\n`;
      enhanced += `• טקסט מקורי: "${correction.original.substring(0, 100)}..."\n`;
      enhanced += `• מה שהצעתי: "${correction.aiSuggestion.substring(0, 100)}..."\n`;
      enhanced += `• מה שהמשתמש העדיף: "${correction.userCorrection.substring(0, 100)}..."\n`;
      enhanced += `• לקח: ${this.extractLesson(correction)}\n\n`;
    });

    enhanced += '**עכשיו שפר את הטקסט החדש תוך התחשבות בלקחים האלה:**\n';
    
    return enhanced;
  }

  /**
   * חילוץ "לקח" מתיקון
   */
  private extractLesson(correction: UserCorrection): string {
    const aiWords = correction.aiSuggestion.split(/\s+/);
    const userWords = correction.userCorrection.split(/\s+/);
    
    const lengthDiff = userWords.length - aiWords.length;
    
    if (lengthDiff > 10) {
      return 'המשתמש מעדיף טקסט מפורט ומורחב יותר';
    } else if (lengthDiff < -10) {
      return 'המשתמש מעדיף טקסט תמציתי וקצר יותר';
    } else if (correction.correctionType === 'minor') {
      return 'התיקון היה קל - בעיקר שינויי ניסוח קטנים';
    } else {
      return 'המשתמש העדיף גישה או סגנון שונים';
    }
  }

  /**
   * ניתוח סוג התיקון
   */
  private analyzeCorrectionType(ai: string, user: string): 'minor' | 'major' | 'accepted' {
    // אם זהה לגמרי - קיבל
    if (ai.trim() === user.trim()) {
      return 'accepted';
    }

    // חשב אחוז שינוי
    const similarity = this.calculateSimilarity(ai, user);
    
    if (similarity > 0.8) {
      return 'minor'; // שינוי קל
    } else {
      return 'major'; // שינוי משמעותי
    }
  }

  /**
   * חישוב דמיון בין שני טקסטים
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * סטטיסטיקות למידה
   */
  getStats() {
    const corrections = this.getCorrections();
    
    const byType = corrections.reduce((acc, c) => {
      acc[c.correctionType] = (acc[c.correctionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byContext = corrections.reduce((acc, c) => {
      acc[c.context] = (acc[c.context] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: corrections.length,
      accepted: byType.accepted || 0,
      minorCorrections: byType.minor || 0,
      majorCorrections: byType.major || 0,
      byContext,
      acceptanceRate: corrections.length > 0 
        ? ((byType.accepted || 0) / corrections.length * 100).toFixed(1) 
        : 0
    };
  }

  /**
   * מחיקות
   */
  deleteCorrection(id: string): void {
    const corrections = this.getCorrections();
    const filtered = corrections.filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * ייצוא/ייבוא
   */
  exportCorrections(): string {
    return JSON.stringify(this.getCorrections(), null, 2);
  }

  importCorrections(jsonString: string): void {
    const corrections = JSON.parse(jsonString);
    localStorage.setItem(this.storageKey, JSON.stringify(corrections));
  }

  private generateId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const aiLearningSystem = new AILearningSystem();
