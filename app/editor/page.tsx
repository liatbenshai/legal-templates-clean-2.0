'use client';

import { useState } from 'react';
import { useAI } from '@/lib/useAI';
import { Sparkles, Copy, Download, Loader } from 'lucide-react';

export default function EditorPage() {
  const { improveText, getSuggestions, loading, error } = useAI();
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'suggestions'>('editor');

  const handleImprove = async () => {
    const improved = await improveText(text);
    setText(improved);
  };

  const handleGetSuggestions = async () => {
    const sug = await getSuggestions(text);
    setSuggestions(sug);
    setActiveTab('suggestions');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('הטקסט הועתק!');
  };

  const handleApplySuggestion = (suggestion: string) => {
    setText(suggestion);
    setSuggestions([]);
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* כותרת */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">עורך משפטי חכם</h1>
          <p className="text-gray-600">כתוב, שפר ובדוק עם עוזר AI</p>
        </div>

        {/* שגיאה אם יש */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* עורך */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 px-6 py-3 font-semibold transition ${
                    activeTab === 'editor'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  עורך
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`flex-1 px-6 py-3 font-semibold transition ${
                    activeTab === 'suggestions'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  הצעות ({suggestions.length})
                </button>
              </div>

              {/* תוכן */}
              <div className="p-6">
                {activeTab === 'editor' ? (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="כתוב או הדבק טקסט משפטי כאן..."
                    className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none resize-none font-hebrew"
                  />
                ) : (
                  <div className="space-y-3">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition cursor-pointer"
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          <p className="text-gray-800 mb-2">{suggestion}</p>
                          <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                            ✓ החל הצעה זו
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        לא יש הצעות עדיין. לחץ על "קבל הצעות" כדי להתחיל
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* פאנל כפתורים */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">פעולות</h3>

              <button
                onClick={handleImprove}
                disabled={loading || !text}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    משפר...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    שפר עם AI
                  </>
                )}
              </button>

              <button
                onClick={handleGetSuggestions}
                disabled={loading || !text}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                קבל הצעות
              </button>

              <button
                onClick={handleCopy}
                disabled={!text}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                העתק
              </button>

              <button
                disabled={!text}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                הורדה
              </button>

              {/* מידע */}
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 space-y-2">
                  <div>מילים: <span className="font-bold">{text.split(/\s+/).filter(Boolean).length}</span></div>
                  <div>תווים: <span className="font-bold">{text.length}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
