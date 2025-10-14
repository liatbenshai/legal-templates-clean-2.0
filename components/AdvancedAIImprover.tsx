'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Check, X, History, Zap, FileText, Brain, Edit3 } from 'lucide-react';
import { aiLegalWriter } from '@/lib/ai-legal-writer';
import { aiLearningSystem } from '@/lib/ai-learning-system';
import AILearningManager from './AILearningManager';

interface AdvancedAIImproverProps {
  originalText: string;
  onAccept: (improvedText: string) => void;
  onReject: () => void;
  context?: 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings';
  style?: 'formal' | 'simple' | 'detailed';
}

interface ImprovementSuggestion {
  type: 'expand' | 'correct' | 'enhance' | 'structure';
  title: string;
  description: string;
  preview: string;
}

export default function AdvancedAIImprover({
  originalText,
  onAccept,
  onReject,
  context = 'will-single',
  style = 'formal'
}: AdvancedAIImproverProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedText, setImprovedText] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(style);
  const [selectedContext, setSelectedContext] = useState(context);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [showLearningManager, setShowLearningManager] = useState(false);

  const improveText = async () => {
    if (!originalText.trim()) {
      alert('אנא הזן טקסט לשיפור');
      return;
    }
    
    if (originalText.length > 5000) {
      alert('הטקסט ארוך מדי. מקסימום 5000 תווים.');
      return;
    }
    
    setIsImproving(true);
    setImprovedText(null);
    setSuggestions([]);
    
    try {
      const result = await performAdvancedImprovement(originalText, selectedContext, selectedStyle);
      setImprovedText(result.improvedText);
      setSuggestions(result.suggestions);
      
    } catch (error) {
      console.error('שגיאה בשיפור:', error);
      
      let errorMessage = 'שגיאה בשיפור הטקסט.';
      if (error instanceof Error) {
        if (error.message.includes('API')) {
          errorMessage = 'שגיאת תקשורת עם שרת ה-AI.';
        } else if (error.message.includes('אימות')) {
          errorMessage = 'התשובה מה-AI לא תקינה. נסה שוב.';
        } else {
          errorMessage = error.message;
        }
      }
      alert(errorMessage);
    } finally {
      setIsImproving(false);
    }
  };

  const performAdvancedImprovement = async (
    text: string, 
    context: string, 
    style: string
  ): Promise<{ improvedText: string; suggestions: ImprovementSuggestion[] }> => {
    
    try {
      const response = await aiLegalWriter.improveWithContext(
        text,
        context as 'will-single' | 'will-couple' | 'advance-directives' | 'fee-agreement' | 'demand-letter' | 'court-pleadings',
        style as 'formal' | 'simple' | 'detailed'
      );
      
      const improvedText = response.text;
      const suggestions: ImprovementSuggestion[] = [];
      
      const lengthRatio = improvedText.length / text.length;
      
      if (lengthRatio > 1.2) {
        suggestions.push({
          type: 'expand',
          title: 'הרחבת תוכן',
          description: `הטקסט הורחב ב-${Math.round((lengthRatio - 1) * 100)}%`,
          preview: `${text.length} תווים → ${improvedText.length} תווים`
        });
      }
      
      if (improvedText !== text) {
        suggestions.push({
          type: 'enhance',
          title: 'שיפור משפטי',
          description: 'הטקסט שופר לעברית משפטית תקנית ומקצועית',
          preview: `התאמה לסוג מסמך: ${getContextName(context)}`
        });
      }
      
      try {
        const additionalSuggestions = await aiLegalWriter.getSuggestions(improvedText);
        if (additionalSuggestions.length > 0) {
          suggestions.push({
            type: 'enhance',
            title: `${additionalSuggestions.length} הצעות נוספות`,
            description: 'הצעות לשיפור נוסף זמינות',
            preview: additionalSuggestions[0]
          });
        }
      } catch (e) {
        console.warn('לא הצלחנו לקבל הצעות נוספות:', e);
      }
      
      return { improvedText, suggestions };
      
    } catch (error) {
      console.error('שגיאה בשיפור מתקדם:', error);
      throw new Error(error instanceof Error ? error.message : 'שגיאה לא ידועה');
    }
  };

  function getContextName(context: string): string {
    const names = {
      'will-single': 'צוואת יחיד',
      'will-couple': 'צוואה זוגית',
      'advance-directives': 'הנחיות מקדימות',
      'fee-agreement': 'הסכם שכר טרחה',
      'demand-letter': 'מכתב התראה',
      'court-pleadings': 'כתבי בית דין'
    };
    return names[context as keyof typeof names] || 'מסמך משפטי';
  }

  const handleAcceptImprovement = () => {
    if (improvedText) {
      const finalText = isEditing ? editedText : improvedText;
      
      // שמור את התיקון למערכת הלמידה
      if (isEditing && editedText !== improvedText) {
        // המשתמש ערך - למד מהתיקון!
        aiLearningSystem.saveCorrection(
          originalText,
          improvedText,
          editedText,
          selectedContext,
          selectedStyle
        );
        console.log('🎓 AI למד מהתיקון שלך!');
      } else {
        // המשתמש קיבל כמו שזה - גם זה טוב ללמוד
        aiLearningSystem.saveCorrection(
          originalText,
          improvedText,
          improvedText,
          selectedContext,
          selectedStyle
        );
        console.log('✅ AI למד שההצעה הייתה טובה!');
      }
      
      onAccept(finalText);
      setImprovedText(null);
      setSuggestions([]);
      setIsEditing(false);
      setEditedText('');
    }
  };

  const handleRejectImprovement = () => {
    setImprovedText(null);
    setSuggestions([]);
    setIsEditing(false);
    setEditedText('');
    onReject();
  };

  if (improvedText) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              תוצאות שיפור מתקדם
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!isEditing) {
                    setEditedText(improvedText);
                  }
                }}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition font-medium ${
                  isEditing 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'עריכה פעילה - לחץ כדי לסיים' : 'ערוך תוצאה'}
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-green-700 mb-2 flex items-center justify-between">
              <span>טקסט משופר ({improvedText.length} תווים - הרחבה של {Math.round((improvedText.length / originalText.length) * 100 - 100)}%):</span>
            </div>
            
            {isEditing ? (
              <div>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-4 border-2 border-blue-500 rounded-lg min-h-[200px] whitespace-pre-wrap text-right focus:outline-none focus:ring-2 focus:ring-blue-600"
                  dir="rtl"
                  style={{ fontFamily: 'David', fontSize: '13pt' }}
                  placeholder="ערוך את הטקסט כאן..."
                />
                <div className="mt-2 text-sm text-blue-700 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">💡</span>
                    <span className="font-medium">עריכה מלאה זמינה!</span>
                  </div>
                  <p className="text-xs">
                    ערכי את הטקסט כמו שאת רוצה - כולל משתנים, הוספת/הסרת סעיפים, שינוי ניסוחים.
                    כל שינוי שתעשי יילמד על ידי ה-AI לשיפור עתידי.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className="p-4 bg-white border-2 border-green-500 rounded-lg min-h-[200px] whitespace-pre-wrap text-right"
                  style={{ fontFamily: 'David', fontSize: '13pt', direction: 'rtl' }}
                >
                  {improvedText}
                </div>
                <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded border border-green-200">
                  ✏️ רוצה לערוך? לחצי על "ערוך תוצאה" למעלה
                </div>
              </div>
            )}
          </div>

          {/* הצעות לשיפור */}
          {suggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-bold text-green-700 mb-2">הצעות לשיפור:</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        suggestion.type === 'expand' ? 'bg-blue-100 text-blue-800' :
                        suggestion.type === 'correct' ? 'bg-yellow-100 text-yellow-800' :
                        suggestion.type === 'enhance' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {suggestion.type === 'expand' ? 'הרחבה' :
                         suggestion.type === 'correct' ? 'תיקון' :
                         suggestion.type === 'enhance' ? 'שיפור' : 'מבנה'}
                      </span>
                      <span className="font-medium text-green-800">{suggestion.title}</span>
                    </div>
                    <p className="text-sm text-gray-700">{suggestion.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{suggestion.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* כפתורי פעולה */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAcceptImprovement}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
            >
              <Check className="w-5 h-5" />
              {isEditing && editedText !== improvedText 
                ? '✅ אשר את הגרסה המעודכנת שלי' 
                : isEditing 
                  ? '✅ אשר את הגרסה המעודכנת'
                  : '✅ אשר שיפורים'}
            </button>
            <button
              onClick={handleRejectImprovement}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
            >
              <X className="w-5 h-5" />
              דחה שיפורים
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* כותרת */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-800 flex items-center gap-3">
            <Zap className="w-6 h-6" />
            שיפור מתקדם עם AI
          </h2>
          <div className="text-sm text-purple-600 bg-white px-3 py-1 rounded-full border">
            {originalText.length} תווים
          </div>
        </div>
        
        <p className="text-purple-700 mb-4">
          מערכת AI מתקדמת שמשפרת טקסט משפטי לפי הקשר וסגנון, עם למידה מתיקונים קודמים
        </p>

        {/* הגדרות */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">הקשר משפטי:</label>
            <select
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="will-single">צוואת יחיד</option>
              <option value="will-couple">צוואה זוגית</option>
              <option value="advance-directives">הנחיות מקדימות</option>
              <option value="fee-agreement">הסכם שכר טרחה</option>
              <option value="demand-letter">מכתב התראה</option>
              <option value="court-pleadings">כתבי בית דין</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">סגנון שיפור:</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="formal">פורמלי</option>
              <option value="simple">פשוט</option>
              <option value="detailed">מפורט</option>
            </select>
          </div>
        </div>

        {/* כפתור שיפור */}
        <button
          onClick={improveText}
          disabled={isImproving}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImproving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              מעבד עם AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              שפר עם AI מתקדם
            </>
          )}
        </button>
      </div>

      {/* היסטוריה וניהול למידה */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <History className="w-4 h-4" />
          היסטוריית שיפורים
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          המערכת זוכרת את התיקונים שלך ומשתפרת עם הזמן
        </p>
        
        <AILearningManager />
      </div>
    </div>
  );
}
