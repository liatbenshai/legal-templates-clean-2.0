'use client';

import { useState } from 'react';
import { 
  Wand2, 
  RefreshCw, 
  Lightbulb, 
  Check, 
  X, 
  Loader2,
  Sparkles,
  FileEdit,
  Maximize2,
  Minimize2,
  Copy
} from 'lucide-react';
import { aiLegalWriter, AIWritingRequest } from '@/lib/ai-legal-writer';

interface AIWritingAssistantProps {
  onTextGenerated: (text: string) => void;
  initialText?: string;
  documentType?: string;
}

export default function AIWritingAssistant({
  onTextGenerated,
  initialText = '',
  documentType,
}: AIWritingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'generate' | 'rewrite' | 'fix' | 'expand' | 'summarize'>('generate');
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [textToRewrite, setTextToRewrite] = useState(initialText);
  const [generatedText, setGeneratedText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState<'formal' | 'very-formal' | 'neutral'>('formal');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('נא להזין תיאור של הטקסט המבוקש');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const request: AIWritingRequest = {
        prompt,
        context: context || undefined,
        documentType,
        tone,
        length,
      };

      const response = await aiLegalWriter.generateText(request);
      setGeneratedText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בלתי צפויה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!textToRewrite.trim()) {
      setError('נא להזין טקסט לניסוח מחדש');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const request: AIWritingRequest = {
        prompt: prompt || 'נסח מחדש בצורה מקצועית',
        existingText: textToRewrite,
        tone,
      };

      const response = await aiLegalWriter.rewriteText(request);
      setGeneratedText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בלתי צפויה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFix = async () => {
    if (!textToRewrite.trim()) {
      setError('נא להזין טקסט לתיקון');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const response = await aiLegalWriter.fixHebrewLegalLanguage(textToRewrite);
      setGeneratedText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בלתי צפויה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = async () => {
    if (!textToRewrite.trim()) {
      setError('נא להזין טקסט להרחבה');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const response = await aiLegalWriter.expandText(
        textToRewrite,
        prompt || 'הרחב עם פרטים ונימוקים נוספים'
      );
      setGeneratedText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בלתי צפויה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!textToRewrite.trim()) {
      setError('נא להזין טקסט לקיצור');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const response = await aiLegalWriter.summarizeText(textToRewrite, length as any);
      setGeneratedText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בלתי צפויה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!textToRewrite.trim()) {
      setError('נא להזין טקסט לקבלת הצעות');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const sug = await aiLegalWriter.getSuggestions(textToRewrite);
      setSuggestions(sug);
    } catch (err) {
      setError('שגיאה בקבלת הצעות');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (generatedText) {
      onTextGenerated(generatedText);
      setGeneratedText('');
      setPrompt('');
      setContext('');
      setIsOpen(false);
    }
  };

  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
    }
  };

  const executeAction = () => {
    switch (mode) {
      case 'generate':
        handleGenerate();
        break;
      case 'rewrite':
        handleRewrite();
        break;
      case 'fix':
        handleFix();
        break;
      case 'expand':
        handleExpand();
        break;
      case 'summarize':
        handleSummarize();
        break;
    }
  };

  return (
    <div className="relative">
      {/* כפתור פתיחה */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
      >
        <Sparkles className="w-5 h-5" />
        <span>עוזר AI לניסוח משפטי</span>
      </button>

      {/* חלון העוזר */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* כותרת */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">עוזר AI לניסוח משפטי</h2>
                  <p className="text-sm text-purple-100">ניסוח בעברית משפטית תקינה</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* תפריט מצבים */}
            <div className="border-b bg-gray-50 p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setMode('generate')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    mode === 'generate'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>צור טקסט חדש</span>
                </button>
                <button
                  onClick={() => setMode('rewrite')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    mode === 'rewrite'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>נסח מחדש</span>
                </button>
                <button
                  onClick={() => setMode('fix')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    mode === 'fix'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileEdit className="w-4 h-4" />
                  <span>תקן עברית</span>
                </button>
                <button
                  onClick={() => setMode('expand')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    mode === 'expand'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>הרחב</span>
                </button>
                <button
                  onClick={() => setMode('summarize')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    mode === 'summarize'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>קצר</span>
                </button>
              </div>
            </div>

            {/* תוכן */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* מצב יצירה */}
              {mode === 'generate' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מה ברצונך לנסח?
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="לדוגמה: כתוב סעיף על זכות הביטול בהסכם מכר, כתוב פסקה על חובת גילוי במשפט האזרחי"
                      className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      הקשר נוסף (אופציונלי)
                    </label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="פרטים נוספים שיעזרו ל-AI לנסח טוב יותר"
                      className="w-full h-20 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טון
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="formal">פורמלי</option>
                        <option value="very-formal">פורמלי מאוד (לבית משפט)</option>
                        <option value="neutral">ניטרלי מקצועי</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        אורך
                      </label>
                      <select
                        value={length}
                        onChange={(e) => setLength(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="short">קצר (1-2 פסקאות)</option>
                        <option value="medium">בינוני (3-5 פסקאות)</option>
                        <option value="long">ארוך (6+ פסקאות)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* מצבים שדורשים טקסט קיים */}
              {(mode === 'rewrite' || mode === 'fix' || mode === 'expand' || mode === 'summarize') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      הטקסט לעיבוד
                    </label>
                    <textarea
                      value={textToRewrite}
                      onChange={(e) => setTextToRewrite(e.target.value)}
                      placeholder="הדבק כאן את הטקסט שברצונך לעבד"
                      className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                    />
                  </div>

                  {(mode === 'rewrite' || mode === 'expand') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        הנחיות נוספות (אופציונלי)
                      </label>
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={
                          mode === 'rewrite'
                            ? 'לדוגמה: שמור על הטון אבל הפוך לפורמלי יותר'
                            : 'לדוגמה: הוסף דוגמאות ממקרי מבחן'
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}

                  {mode === 'summarize' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        אורך הסיכום
                      </label>
                      <select
                        value={length}
                        onChange={(e) => setLength(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="short">קצר מאוד (1-2 משפטים)</option>
                        <option value="medium">קצר (1 פסקה)</option>
                        <option value="long">בינוני (2-3 פסקאות)</option>
                      </select>
                    </div>
                  )}

                  {/* כפתור הצעות לשיפור */}
                  <button
                    onClick={handleGetSuggestions}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition disabled:opacity-50"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>קבל הצעות לשיפור</span>
                  </button>
                </>
              )}

              {/* שגיאה */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* הצעות לשיפור */}
              {suggestions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    הצעות לשיפור:
                  </h3>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                        <span className="text-yellow-600">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* תוצאה */}
              {generatedText && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-green-900 flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      התוצאה:
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      העתק
                    </button>
                  </div>
                  <div className="bg-white rounded p-4 text-sm leading-relaxed whitespace-pre-wrap border border-green-300">
                    {generatedText}
                  </div>
                </div>
              )}
            </div>

            {/* כפתורי פעולה */}
            <div className="border-t p-6 bg-gray-50 flex gap-3">
              {!generatedText ? (
                <>
                  <button
                    onClick={executeAction}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>מעבד...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>
                          {mode === 'generate' && 'צור טקסט'}
                          {mode === 'rewrite' && 'נסח מחדש'}
                          {mode === 'fix' && 'תקן עברית'}
                          {mode === 'expand' && 'הרחב טקסט'}
                          {mode === 'summarize' && 'קצר טקסט'}
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    ביטול
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAccept}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    <Check className="w-5 h-5" />
                    <span>אשר והוסף למסמך</span>
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedText('');
                      setSuggestions([]);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    נסה שוב
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

