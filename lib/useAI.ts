'use client';

import { useState } from 'react';

export interface AIImproveOptions {
  context?: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings';
  style?: 'formal' | 'simple' | 'detailed';
  maxLength?: number;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // שיפור טקסט
  const improveText = async (text: string, context?: string, options?: AIImproveOptions) => {
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
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          context: context || options?.context,
          style: options?.style,
          maxLength: options?.maxLength
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve text');
      }

      const data = await response.json();
      return data.improved || text;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Improve error:', message);
      return text;
    } finally {
      setLoading(false);
    }
  };

  // קבלת הצעות שיפור
  const getSuggestions = async (text: string, options?: AIImproveOptions) => {
    if (!text || !text.trim()) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          context: options?.context,
          style: options?.style
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get suggestions');
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Suggestions error:', message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // שיפור עם השוואה (קודם ואחרי)
  const improveWithComparison = async (text: string, options?: AIImproveOptions) => {
    const improved = await improveText(text, undefined, options);
    return {
      original: text,
      improved: improved,
      changed: improved !== text
    };
  };

  // בדיקה של איכות הטקסט
  const checkQuality = async (text: string, options?: AIImproveOptions) => {
    if (!text || !text.trim()) {
      return { score: 0, issues: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/quality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          context: options?.context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check quality');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Quality check error:', err);
      return { score: 0, issues: [] };
    } finally {
      setLoading(false);
    }
  };

  // ניקוי שגיאות בטקסט
  const fixGrammar = async (text: string) => {
    return improveText(text, undefined, { style: 'formal' });
  };

  // הרחבת טקסט קצר
  const expandText = async (text: string, options?: AIImproveOptions) => {
    if (!text || !text.trim()) return text;
    return improveText(text, undefined, { ...options, style: 'detailed' });
  };

  // קיצור טקסט ארוך
  const summarizeText = async (text: string) => {
    if (!text || !text.trim()) return text;
    return improveText(text, undefined, { style: 'simple', maxLength: Math.floor(text.length / 2) });
  };

  // מחיקת שגיאות כתיב
  const fixSpelling = async (text: string) => {
    if (!text || !text.trim()) return text;
    return improveText(text, undefined, { style: 'formal' });
  };

  return {
    // פונקציות בסיסיות
    improveText,
    getSuggestions,
    
    // פונקציות שימושיות נוספות
    improveWithComparison,
    checkQuality,
    fixGrammar,
    expandText,
    summarizeText,
    fixSpelling,

    // סטטוס
    loading,
    error,

    // פונקציה לאפס שגיאה
    clearError: () => setError(null)
  };
}
