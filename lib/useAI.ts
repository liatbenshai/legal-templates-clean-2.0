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

  return {
    // פונקציות בסיסיות
    improveText,
    getSuggestions,
    improveWithComparison,

    // סטטוס
    loading,
    error,

    // פונקציה לאפס שגיאה
    clearError: () => setError(null)
  };
}
