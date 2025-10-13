'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';

/**
 * שיפור AI בזמן אמת בזמן כתיבה
 * עם debounce כדי לא להציף את השרת
 */

interface RealtimeAIImproverProps {
  text: string;
  onTextChange: (text: string) => void;
  onImprovedTextReady: (improved: string) => void;
  enabled?: boolean;
  debounceMs?: number;
}

export default function RealtimeAIImprover({
  text,
  onTextChange,
  onImprovedTextReady,
  enabled = true,
  debounceMs = 3000, // 3 שניות אחרי שמפסיקים לכתוב
}: RealtimeAIImproverProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [lastImprovedText, setLastImprovedText] = useState('');
  const [improvementReady, setImprovementReady] = useState(false);

  // Debounce - מחכה 3 שניות אחרי שמפסיקים לכתוב
  useEffect(() => {
    if (!enabled || !text || text.length < 10) return;
    
    const timeoutId = setTimeout(async () => {
      await improveText(text);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [text, enabled, debounceMs]);

  const improveText = async (textToImprove: string) => {
    if (textToImprove === lastImprovedText) return; // כבר שיפרנו את זה
    
    setIsImproving(true);
    setImprovementReady(false);

    try {
      // כאן תהיה קריאה אמיתית ל-AI
      // לעת עתה - סימולציה מהירה
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // שיפור בסיסי (לדוגמה)
      const improved = textToImprove
        .replace(/עשה/g, 'ביצע')
        .replace(/אמר/g, 'הצהיר')
        .replace(/נתן/g, 'העניק');
      
      setLastImprovedText(improved);
      setImprovementReady(true);
      onImprovedTextReady(improved);
      
      // הסתר את ההודעה אחרי 5 שניות
      setTimeout(() => setImprovementReady(false), 5000);
    } catch (error) {
      console.error('שגיאה בשיפור:', error);
    } finally {
      setIsImproving(false);
    }
  };

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isImproving && (
        <div className="bg-purple-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">משפר טקסט בעברית משפטית...</span>
        </div>
      )}
      
      {improvementReady && !isImproving && (
        <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="font-medium">הטקסט שופר! ✨</span>
        </div>
      )}

      {enabled && !isImproving && !improvementReady && text.length > 10 && (
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI פעיל - משפר אוטומטית</span>
        </div>
      )}
    </div>
  );
}

/**
 * Hook לשימוש קל
 */
export function useRealtimeAIImprover(initialText: string, enabled: boolean = true) {
  const [text, setText] = useState(initialText);
  const [improvedText, setImprovedText] = useState<string | null>(null);

  return {
    text,
    setText,
    improvedText,
    AIComponent: (
      <RealtimeAIImprover
        text={text}
        onTextChange={setText}
        onImprovedTextReady={setImprovedText}
        enabled={enabled}
      />
    ),
  };
}
