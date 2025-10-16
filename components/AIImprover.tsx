'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Check, X, History } from 'lucide-react';

interface AIImproverProps {
  originalText: string;
  onAccept: (improvedText: string) => void;
  onReject: () => void;
  context?: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings';
  style?: 'formal' | 'simple' | 'detailed';
}

export default function AIImprover({
  originalText,
  onAccept,
  onReject,
  context = 'will-single',
  style = 'formal'
}: AIImproverProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [changes, setChanges] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(style);
  const [selectedContext, setSelectedContext] = useState(context);

  const contextOptions = [
    { value: 'will-single', label: 'צוואת יחיד', icon: '📜' },
    { value: 'will-couple', label: 'צוואה זוגית', icon: '👥' },
    { value: 'advance-directives', label: 'הנחיות מקדימות', icon: '🏥' },
    { value: 'fee-agreement', label: 'הסכם שכר טרחה', icon: '💼' },
    { value: 'demand-letter', label: 'מכתב התראה', icon: '⚠️' },
    { value: 'court-pleadings', label: 'כתבי בית דין', icon: '⚖️' },
  ];

  const styleOptions = [
    { value: 'formal', label: 'פורמלי', desc: 'שפה משפטית גבוהה' },
    { value: 'simple', label: 'פשוט', desc: 'ברור ונגיש' },
    { value: 'detailed', label: 'מפורט', desc: 'עם פירוט רב' },
  ];

  const handleImprove = async () => {
    if (!originalText.trim()) {
      alert('אנא הזן טקסט לשיפור');
      return;
    }

    if (originalText.length > 5000) {
      alert('הטקסט ארוך מדי. מקסימום 5000 תווים.');
      return;
    }

    setIsImproving(true);
    
    try {
      const response = await fetch('/api/will/improve-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText })
      });

      if (!response.ok) {
        throw new Error('Failed to improve');
      }

      const data = await response.json();
      const improvedTextContent = data.content?.[0]?.text;

      if (!improvedTextContent) {
        throw new Error('No content returned');
      }

      setImprovedText(improvedTextContent);
      setChanges(['✨ הטקסט שופר בעברית משפטית תקינה']);
      
    } catch (error) {
      console.error('שגיאה בשיפור:', error);
      
      let errorMessage = 'שגיאה בשיפור הטקסט.';
      if (error instanceof Error) {
        if (error.message.includes('API')) {
          errorMessage = 'שגיאת תקשורת עם שרת ה-AI. בדוק את החיבור לאינטרנט.';
        } else {
          errorMessage = error.message;
        }
      }
      alert(errorMessage);
    } finally {
      setIsImproving(false);
    }
  };

  const handleAcceptImprovement = () => {
    if (improvedText) {
      onAccept(improvedText);
      setImprovedText(null);
      setChanges([]);
    }
  };

  const handleRejectImprovement = () => {
    setImprovedText(null);
    setChanges([]);
    onReject();
  };

  if (improvedText) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">טקסט משופר בעברית משפטית</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-bold text-gray-700 mb-2">טקסט מקורי:</div>
              <div
                className="p-4 bg-white border border-gray-300 rounded-lg min-h-[200px] whitespace-pre-wrap"
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              >
                {originalText}
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-green-700 mb-2">טקסט משופר:</div>
              <div
                className="p-4 bg-white border-2 border-green-500 rounded-lg min-h-[200px] whitespace-pre-wrap"
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              >
                {improvedText}
              </div>
            </div>
          </div>

          {changes.length > 0 && (
            <div className="bg-white border border-green-300 rounded-lg p-4">
              <div className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <History className="w-4 h-4" />
                מה שונה:
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                {changes.map((change, i) => (
                  <li key={i} className="mr-4">• {change}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAcceptImprovement}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
            >
              <Check className="w-5 h-5" />
              <span>אשר ושמור</span>
            </button>
            <button
              onClick={handleRejectImprovement}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              <X className="w-5 h-5" />
              <span>דחה ושמור מקורי</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">שפר בעברית משפטית</h3>
      </div>

      <p className="text-gray-700 mb-4">
        המערכת תשפר את הטקסט מ"עברית מתורגמת" לעברית משפטית תקנית ומקצועית
      </p>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סגנון שיפור
          </label>
          <div className="grid grid-cols-3 gap-2">
            {styleOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedStyle(opt.value as any)}
                className={`p-3 rounded-lg border-2 transition text-center ${
                  selectedStyle === opt.value
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="font-bold text-sm">{opt.label}</div>
                <div className="text-xs text-gray-600">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סוג מסמך
          </label>
          <div className="grid grid-cols-4 gap-2">
            {contextOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedContext(opt.value as any)}
                className={`p-3 rounded-lg border-2 transition text-center ${
                  selectedContext === opt.value
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{opt.icon}</div>
                <div className="text-xs font-medium">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleImprove}
        disabled={isImproving || !originalText.trim()}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg shadow-lg"
      >
        {isImproving ? (
          <>
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>משפר טקסט...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            <span>שפר עכשיו!</span>
          </>
        )}
      </button>

      <div className="mt-4 text-xs text-purple-800">
        <p className="font-medium mb-1">✨ מה המערכת תעשה:</p>
        <ul className="space-y-1 mr-4">
          <li>• תתקן ביטויים שהם תרגום ישיר מאנגלית</li>
          <li>• תשפר מבנה משפטים לעברית תקינה</li>
          <li>• תחליף מונחים לא מדויקים במונחים משפטיים נכונים</li>
          <li>• תתקן שגיאות דקדוקיות ונטיות</li>
          <li>• תשפר קוהרנטיות והבנה</li>
        </ul>
      </div>
    </div>
  );
}
