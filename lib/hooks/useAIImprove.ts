'use client';

import { useState } from 'react';

export interface AIImproveOptions {
  context?: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings';
  style?: 'formal' | 'simple' | 'detailed';
  maxLength?: number;
}

export interface AIImproveResult {
  improved: string;
  original: string;
  changed: boolean;
}

/**
 * Hook מרכזי לשיפור טקסט עם AI
 * משתמש באותה לוגיקה מעולה כמו בעמוד ai-learning
 */
export function useAIImprove() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * שיפור טקסט בסיסי - הפונקציה העיקרית!
   */
  const improveText = async (
    text: string, 
    options?: AIImproveOptions
  ): Promise<string> => {
    if (!text || !text.trim()) {
      setError('הטקסט ריק');
      return text;
    }

    if (text.length > 5000) {
      setError('הטקסט ארוך מדי (מקסימום 5000 תווים)');
      return text;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/will/improve-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          context: options?.context,
          style: options?.style,
          maxLength: options?.maxLength
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve text');
      }

      const data = await response.json();
      const improvedText = data.improved || data.content?.[0]?.text || text;
      
      return improvedText;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Improve error:', message);
      return text; // במקרה של שגיאה, מחזיר את הטקסט המקורי
    } finally {
      setLoading(false);
    }
  };

  /**
   * קבלת הצעות שיפור (מספר אופציות)
   */
  const getSuggestions = async (
    text: string, 
    options?: AIImproveOptions
  ): Promise<string[]> => {
    if (!text || !text.trim()) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // כרגע משתמש באותו API - אפשר להרחיב בעתיד
      const improved = await improveText(text, options);
      
      // מחזיר את הגרסה המשופרת כהצעה אחת
      // אפשר להוסיף כאן קריאה ל-API נפרד להצעות מרובות
      return improved !== text ? [improved] : [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Suggestions error:', message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * שיפור עם השוואה (מחזיר גם מקור וגם שיפור)
   */
  const improveWithComparison = async (
    text: string, 
    options?: AIImproveOptions
  ): Promise<AIImproveResult> => {
    const improved = await improveText(text, options);
    return {
      original: text,
      improved: improved,
      changed: improved !== text
    };
  };

  /**
   * אפס שגיאות
   */
  const clearError = () => setError(null);

  return {
    // פונקציות עיקריות
    improveText,
    getSuggestions,
    improveWithComparison,

    // סטטוס
    loading,
    error,
    clearError,
  };
}

