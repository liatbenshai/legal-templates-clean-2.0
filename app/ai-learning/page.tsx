'use client';

import { useState, useEffect } from 'react';
import { loadFeedback, exportFeedbackData, getAIStatistics, FeedbackEntry } from '@/lib/enhanced-ai-improver';
import { Trash2, Download, Star, TrendingUp, Database, RefreshCw } from 'lucide-react';

export default function AILearningPage() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedEntry, setSelectedEntry] = useState<FeedbackEntry | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const entries = loadFeedback();
    setFeedbackEntries(entries);
    setStats(getAIStatistics());
  };

  const handleExport = () => {
    const data = exportFeedbackData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleClearAll = () => {
    if (confirm('האם למחוק את כל נתוני הלמידה? (לא ניתן לשחזר)')) {
      localStorage.removeItem('legal_ai_feedback');
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* כותרת */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            🧠 מערכת הלמידה של ה-AI
          </h1>
          <p className="text-xl text-gray-700">
            כל התיקונים שלך עוזרים למערכת ללמוד ולהשתפר
          </p>
        </div>

        {/* סטטיסטיקות */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Database className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-purple-600 mb-1">
              {feedbackEntries.length}
            </div>
            <div className="text-gray-600">דוגמאות נשמרו</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3 fill-current" />
            <div className="text-4xl font-bold text-yellow-600 mb-1">
              {stats?.averageRating || '0'}
            </div>
            <div className="text-gray-600">דירוג ממוצע</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-green-600 mb-1">
              {feedbackEntries.filter(e => e.userCorrection).length}
            </div>
            <div className="text-gray-600">תיקונים ידניים</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {feedbackEntries.filter(e => e.userRating >= 4).length}
            </div>
            <div className="text-gray-600">דוגמאות איכותיות</div>
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
          >
            <RefreshCw className="w-5 h-5" />
            רענן נתונים
          </button>
          
          <button
            onClick={handleExport}
            disabled={feedbackEntries.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold"
          >
            <Download className="w-5 h-5" />
            ייצא נתונים
          </button>
          
          <button
            onClick={handleClearAll}
            disabled={feedbackEntries.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold"
          >
            <Trash2 className="w-5 h-5" />
            מחק הכל
          </button>
        </div>

        {/* רשימת דוגמאות */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📚 דוגמאות שנלמדו ({feedbackEntries.length})
          </h2>
          
          {feedbackEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">אין עדיין דוגמאות שנלמדו</p>
              <p className="text-sm mt-2">התחילי לתקן טקסטים והמערכת תלמד!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackEntries.slice().reverse().map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`border-2 rounded-lg p-5 cursor-pointer transition ${
                    selectedEntry?.id === entry.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < entry.userRating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    {entry.userCorrection && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        ✅ תוקן ידנית
                      </span>
                    )}
                  </div>
                  
                  {selectedEntry?.id === entry.id && (
                    <div className="space-y-4 mt-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm font-bold text-red-900 mb-2">🔴 טקסט מקורי:</p>
                        <p className="text-sm text-red-800 whitespace-pre-line" dir="rtl" style={{ fontFamily: 'David' }}>
                          {entry.originalText}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-bold text-blue-900 mb-2">🤖 AI שיפר ל:</p>
                        <p className="text-sm text-blue-800 whitespace-pre-line" dir="rtl" style={{ fontFamily: 'David' }}>
                          {entry.improvedText}
                        </p>
                      </div>
                      
                      {entry.userCorrection && (
                        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
                          <p className="text-sm font-bold text-green-900 mb-2">✅ המשתמש תיקן ל:</p>
                          <p className="text-sm text-green-800 whitespace-pre-line" dir="rtl" style={{ fontFamily: 'David' }}>
                            {entry.userCorrection}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

