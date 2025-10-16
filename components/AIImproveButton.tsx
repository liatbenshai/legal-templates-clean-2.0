'use client';

import { useState } from 'react';
import { Sparkles, Loader, Check, X } from 'lucide-react';
import { useAI } from '@/lib/useAI';

interface AIImproveButtonProps {
  text: string;
  onAccept: (improvedText: string) => void;
  onCancel?: () => void;
  context?: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings';
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonText?: string;
  showComparison?: boolean;
}

export default function AIImproveButton({
  text,
  onAccept,
  onCancel,
  context = 'will-single',
  buttonSize = 'sm',
  buttonText = 'שפר עם AI',
  showComparison = true
}: AIImproveButtonProps) {
  const { improveText, loading, error, clearError } = useAI();
  const [improved, setImproved] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleImprove = async () => {
    if (!text || !text.trim()) {
      alert('אנא הזן טקסט לשיפור');
      return;
    }

    clearError();
    const improvedText = await improveText(text, context);
    
    if (improvedText && improvedText !== text) {
      setImproved(improvedText);
      setShowResult(true);
    } else if (!improvedText || improvedText === text) {
      alert('לא היה ניתן לשפר את הטקסט. נסה שוב.');
    }
  };

  const handleAccept = () => {
    if (improved) {
      // קרא ל-onAccept עם הטקסט המשופר
      onAccept(improved);
      
      // אפס את המצב
      setShowResult(false);
      setImproved(null);
      clearError();
    }
  };

  const handleReject = () => {
    setShowResult(false);
    setImproved(null);
    clearError();
    onCancel?.();
  };

  // תצוגה של התוצאה
  if (showResult && improved) {
    return (
      <div className="space-y-3 bg-green-50 border-2 border-green-300 rounded-lg p-4">
        {showComparison ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-bold text-gray-600 mb-1">מקורי:</div>
              <div className="text-sm p-2 bg-white border border-gray-200 rounded max-h-32 overflow-y-auto text-right">
                {text}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-green-600 mb-1">משופר:</div>
              <div className="text-sm p-2 bg-white border-2 border-green-500 rounded max-h-32 overflow-y-auto text-right">
                {improved}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-bold text-green-600 mb-1">טקסט משופר:</div>
            <div className="text-sm p-2 bg-white border-2 border-green-500 rounded max-h-32 overflow-y-auto text-right">
              {improved}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
          >
            <Check className="w-4 h-4" />
            אשר ושמור
          </button>
          <button
            onClick={handleReject}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition text-sm font-semibold"
          >
            <X className="w-4 h-4" />
            דחה
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            ⚠️ {error}
          </div>
        )}
      </div>
    );
  }

  // כפתור הראשון
  return (
    <button
      onClick={handleImprove}
      disabled={loading || !text || !text.trim()}
      className={`flex items-center justify-center gap-2 font-semibold transition ${
        buttonSize === 'sm'
          ? 'px-2 py-1 text-sm'
          : buttonSize === 'md'
          ? 'px-3 py-2 text-base'
          : 'px-4 py-3 text-lg'
      } ${
        loading || !text || !text.trim()
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-md hover:shadow-lg'
      } rounded-lg`}
    >
      {loading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          משפר...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          {buttonText}
        </>
      )}
    </button>
  );
}
