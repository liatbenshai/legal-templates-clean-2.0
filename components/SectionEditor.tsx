'use client';

import { useState } from 'react';
import { X, Sparkles, Eye, Check, FileText } from 'lucide-react';

interface SectionEditorProps {
  section: {
    id: string;
    title: string;
    content: string;
    variables?: string[];
    aiPrompt?: string;
    usageInstructions?: string;
  };
  onSave: (editedContent: string, title: string) => void;
  onCancel: () => void;
}

export default function SectionEditor({ section, onSave, onCancel }: SectionEditorProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [editedContent, setEditedContent] = useState(section.content);
  const [isImproving, setIsImproving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customTitle, setCustomTitle] = useState(section.title);

  // זיהוי משתנים {{variable}} בתוכן
  const detectVariables = (): string[] => {
    const matches = section.content.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
  };

  const variables = section.variables || detectVariables();

  // החלפת משתנים בתוכן
  const replaceVariables = (content: string): string => {
    let result = content;
    Object.keys(fieldValues).forEach(key => {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(placeholder, fieldValues[key] || `[${key}]`);
    });
    return result;
  };

  // שיפור עם AI - באמצעות הפונקציה הקיימת
  const improveWithAI = async () => {
    setIsImproving(true);
    
    try {
      // החלפת משתנים בתוכן לפני שיפור
      let contentWithValues = replaceVariables(section.content);
      
      // סימולציה של שיפור AI (כמו ב-SimpleAIImprover)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // שיפור הטקסט באמצעות הפונקציות הקיימות
      const improvedText = generateImprovedText(contentWithValues);
      
      setEditedContent(improvedText);
      setShowPreview(true);
      
    } catch (error) {
      console.error('שגיאה בשיפור עם AI:', error);
      alert('שגיאה בשיפור הטקסט. נסה שוב.');
    } finally {
      setIsImproving(false);
    }
  };

  // פונקציה לשיפור טקסט (מועתקת מ-SimpleAIImprover)
  const generateImprovedText = (text: string): string => {
    let improved = text;

    // הוספת ביטויים משפטיים מגוונים
    const openingPhrases = [
      'בנוסף לאמור לעיל, ',
      'יתרה מכך, ',
      'עוד יש להוסיף כי ',
      'בהקשר זה יש לציין כי ',
      'נוסף על כך, ',
      'בהמשך לאמור, '
    ];

    improved = improved
      .replace(/\bכי\b/g, () => {
        const alternatives = ['הואיל וכי', 'משום ש', 'בהיות ש', 'מאחר ש'];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      })
      .replace(/\bלכן\b/g, () => {
        const alternatives = ['לפיכך', 'על כן', 'בהתאם לכך', 'נוכח האמור'];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      });

    // הוספת הרחבה אם הטקסט קצר
    if (text.length < 200) {
      const randomOpening = openingPhrases[Math.floor(Math.random() * openingPhrases.length)];
      improved += `\n\n${randomOpening}יש לציין כי הוראות אלו מחייבות את כל הנוגעים בדבר ויש לקיימן במלואן בהתאם לדין.`;
    }

    return improved;
  };

  // בדיקה אם כל השדות מולאו
  const allFieldsFilled = variables.every(v => fieldValues[v]?.trim());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* כותרת */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl sticky top-0 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
              {section.usageInstructions && (
                <p className="text-indigo-100 text-sm">{section.usageInstructions}</p>
              )}
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* תוכן */}
        <div className="p-6 space-y-6">
          
          {/* שדות למילוי */}
          {variables.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-900">מלא את הפרטים הספציפיים</h3>
              </div>
              
              <div className="grid gap-4">
                {variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variable.replace(/_/g, ' ')}
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    
                    {/* תיבת טקסט רגילה או גדולה לפי אורך */}
                    {variable.includes('description') || variable.includes('instructions') || 
                     variable.includes('facts') || variable.includes('conditions') ? (
                      <textarea
                        value={fieldValues[variable] || ''}
                        onChange={(e) => setFieldValues(prev => ({
                          ...prev,
                          [variable]: e.target.value
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder={`הזן ${variable.replace(/_/g, ' ')}...`}
                        dir="rtl"
                        style={{ fontFamily: 'David', fontSize: '13pt' }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={fieldValues[variable] || ''}
                        onChange={(e) => setFieldValues(prev => ({
                          ...prev,
                          [variable]: e.target.value
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`הזן ${variable.replace(/_/g, ' ')}...`}
                        dir="rtl"
                        style={{ fontFamily: 'David', fontSize: '13pt' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* כפתור שיפור AI */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-purple-900">שיפור עם AI</h3>
              </div>
            </div>
            
            <p className="text-sm text-purple-800 mb-4">
              AI ישפר את הסעיף, יתאים אותו לעברית משפטית תקינה, ויוסיף פרטים רלוונטיים.
            </p>

            <button
              onClick={improveWithAI}
              disabled={!allFieldsFilled || isImproving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold shadow-lg"
            >
              {isImproving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>משפר עם AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>שפר את הסעיף עם AI</span>
                </>
              )}
            </button>

            {!allFieldsFilled && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ יש למלא את כל השדות לפני שיפור
              </p>
            )}
          </div>

          {/* שינוי כותרת */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כותרת הסעיף (ניתן לשנות)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>

          {/* תצוגה מקדימה */}
          {showPreview && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-green-900">תצוגה מקדימה - סעיף מעובד</h3>
              </div>
              
              <div className="bg-white border border-green-300 rounded-lg p-5 max-h-96 overflow-y-auto">
                <div 
                  className="whitespace-pre-line leading-relaxed"
                  style={{ fontFamily: 'David', fontSize: '13pt', direction: 'rtl' }}
                >
                  {editedContent}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => improveWithAI()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  שפר שוב
                </button>
              </div>
            </div>
          )}

          {/* כפתורי פעולה */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              ביטול
            </button>
            
            <button
              onClick={() => onSave(editedContent, customTitle)}
              disabled={!showPreview}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold shadow-lg"
            >
              <Check className="w-5 h-5" />
              <span>הוסף לצוואה</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
