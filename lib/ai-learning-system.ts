/**
 * מערכת למידה מתיקוני משתמש בזמן אמת
 * עודכן לעבודה עם Supabase במקום localStorage
 */

import { supabase } from '@/lib/supabase-client';

export interface UserCorrection {
  id: string;
  user_id?: string;
  context: string;
  style: string;
  aiSuggestion: string;      // מה שה-AI הציע
  userCorrection: string;    // מה שהמשתמש תיקן
  original: string;          // הטקסט המקורי
  timestamp: number;
  correctionType: 'minor' | 'major' | 'accepted'; // סוג התיקון
}

export class AILearningSystem {
  private userId: string;
  private maxCorrections = 100;
  
  constructor(userId: string = 'anonymous') {
    this.userId = userId;
  }

  /**
   * שמירת תיקון משתמש ב-Supabase
   */
  async saveCorrection(
    original: string,
    aiSuggestion: string,
    userCorrection: string,
    context: string,
    style: string
  ): Promise<void> {
    // זהה את סוג התיקון
    const correctionType = this.analyzeCorrectionType(aiSuggestion, userCorrection);
    
    const newCorrection: UserCorrection = {
      id: this.generateId(),
      user_id: this.userId,
      original,
      aiSuggestion,
      userCorrection,
      context,
      style,
      timestamp: Date.now(),
      correctionType,
    };

    try {
      // שמירה ל-Supabase (טבלת learning_data)
      await supabase.from('learning_data').insert({
        user_id: this.userId,
        section_id: 'ai-correction',
        original_text: original,
        edited_text: userCorrection,
        edit_type: correctionType === 'accepted' ? 'ai_approved' : 'manual',
        user_feedback: correctionType === 'accepted' ? 'approved' : 'improved',
        context: {
          aiSuggestion,
          correctionType,
          style,
          contextType: context
        }
      });

      console.log(`✅ תיקון נשמר ל-Supabase (${correctionType}):`, {
        aiLength: aiSuggestion.length,
        userLength: userCorrection.length,
        diff: userCorrection.length - aiSuggestion.length
      });
    } catch (err) {
      console.error('Error saving correction to Supabase:', err);
      // Fallback ל-localStorage
      const corrections = await this.getCorrections();
      corrections.unshift(newCorrection);
      const limited = corrections.slice(0, this.maxCorrections);
      localStorage.setItem(`ai-corrections-${this.userId}`, JSON.stringify(limited));
    }
  }

  /**
   * קבלת כל התיקונים מ-Supabase
   */
  async getCorrections(): Promise<UserCorrection[]> {
    try {
      const { data, error } = await supabase
        .from('learning_data')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(this.maxCorrections);

      if (error) throw error;

      // המרה לפורמט UserCorrection
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        original: item.original_text,
        aiSuggestion: item.context?.aiSuggestion || '',
        userCorrection: item.edited_text,
        context: item.context?.contextType || '',
        style: item.context?.style || 'formal',
        timestamp: new Date(item.created_at).getTime(),
        correctionType: item.context?.correctionType || 'minor'
      }));
    } catch (error) {
      console.error('שגיאה בטעינת תיקונים:', error);
      // Fallback ל-localStorage
      try {
        const stored = localStorage.getItem(`ai-corrections-${this.userId}`);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
  }

  /**
   * קבלת תיקונים רלוונטיים
   */
  async getRelevantCorrections(context: string, style: string, limit: number = 5): Promise<UserCorrection[]> {
    const corrections = await this.getCorrections();
    
    return corrections
      .filter(c => c.context === context && c.style === style)
      .slice(0, limit);
  }

  /**
   * בניית prompt משופר מתיקוני משתמש
   */
  async buildEnhancedPrompt(
    basePrompt: string,
    context: string,
    style: string
  ): Promise<string> {
    const corrections = await this.getRelevantCorrections(context, style, 3);
    
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
  async getStats() {
    const corrections = await this.getCorrections();
    
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
  async deleteCorrection(id: string): Promise<void> {
    try {
      await supabase
        .from('learning_data')
        .delete()
        .eq('id', id)
        .eq('user_id', this.userId);
    } catch (err) {
      console.error('Error deleting correction:', err);
    }
  }

  async clearAll(): Promise<void> {
    try {
      await supabase
        .from('learning_data')
        .delete()
        .eq('user_id', this.userId);
    } catch (err) {
      console.error('Error clearing all:', err);
    }
  }

  /**
   * ייצוא/ייבוא
   */
  async exportCorrections(): Promise<string> {
    const corrections = await this.getCorrections();
    return JSON.stringify(corrections, null, 2);
  }

  async importCorrections(jsonString: string): Promise<void> {
    const corrections = JSON.parse(jsonString);
    
    try {
      // מחיקה קודם
      await this.clearAll();
      
      // הוספה ל-Supabase
      for (const correction of corrections) {
        await this.saveCorrection(
          correction.original,
          correction.aiSuggestion,
          correction.userCorrection,
          correction.context,
          correction.style
        );
      }
    } catch (err) {
      console.error('Error importing corrections:', err);
    }
  }

  private generateId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * שינוי משתמש (למשתמש מחובר אחר)
   */
  setUserId(newUserId: string): void {
    this.userId = newUserId;
  }
}

// ייצוא singleton - יצירה עם userId ברירת מחדל
export const aiLearningSystem = new AILearningSystem('anonymous');

// פונקציה ליצירת instance עם userId ספציפי
export function createAILearningSystem(userId: string): AILearningSystem {
  return new AILearningSystem(userId);
}
