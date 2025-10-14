'use client';

import { useState, useEffect } from 'react';
import { Brain, Download, Upload, Trash2, TrendingUp, X, CheckCircle, Edit3, AlertCircle } from 'lucide-react';
import { aiLearningSystem, UserCorrection } from '@/lib/ai-learning-system';

export default function AILearningManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [corrections, setCorrections] = useState<UserCorrection[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'accepted' | 'minor' | 'major'>('all');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    setCorrections(aiLearningSystem.getCorrections());
    setStats(aiLearningSystem.getStats());
  };

  const handleExport = () => {
    const data = aiLearningSystem.exportCorrections();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-corrections-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        aiLearningSystem.importCorrections(event.target?.result as string);
        loadData();
        alert('התיקונים יובאו בהצלחה!');
      } catch (error) {
        alert('שגיאה בייבוא הקובץ');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (id: string) => {
    if (confirm('למחוק את התיקון הזה?')) {
      aiLearningSystem.deleteCorrection(id);
      loadData();
    }
  };

  const handleClearAll = () => {
    if (confirm('למחוק את כל התיקונים? פעולה זו אינה ניתנת לביטול!')) {
      aiLearningSystem.clearAll();
      loadData();
    }
  };

  const filteredCorrections = corrections.filter(c => {
    if (filter === 'all') return true;
    return c.correctionType === filter;
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
      >
        <Brain className="w-5 h-5" />
        <span>למידת AI ({stats?.total || 0})</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* כותרת */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">מערכת למידת AI מתיקוני משתמש</h2>
              <p className="text-sm text-indigo-100">
                AI לומד מכל תיקון שאת עושה
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* סטטיסטיקות */}
        {stats && (
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-indigo-200 shadow-sm">
                <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                <div className="text-sm text-gray-600">סך תיקונים</div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                <div className="text-sm text-gray-600">אושר ללא שינוי</div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-yellow-200 shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">{stats.minorCorrections}</div>
                <div className="text-sm text-gray-600">תיקונים קלים</div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-orange-200 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{stats.majorCorrections}</div>
                <div className="text-sm text-gray-600">תיקונים גדולים</div>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-purple-200 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{stats.acceptanceRate}%</div>
                <div className="text-sm text-gray-600">שיעור הצלחה</div>
              </div>
            </div>
          </div>
        )}

        {/* פילטרים וכפתורי פעולה */}
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded transition ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-100'
              }`}
            >
              הכל ({corrections.length})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-3 py-1 rounded transition flex items-center gap-1 ${
                filter === 'accepted' ? 'bg-green-600 text-white' : 'bg-white border hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              אושר ({stats?.accepted || 0})
            </button>
            <button
              onClick={() => setFilter('minor')}
              className={`px-3 py-1 rounded transition flex items-center gap-1 ${
                filter === 'minor' ? 'bg-yellow-600 text-white' : 'bg-white border hover:bg-gray-100'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              קל ({stats?.minorCorrections || 0})
            </button>
            <button
              onClick={() => setFilter('major')}
              className={`px-3 py-1 rounded transition flex items-center gap-1 ${
                filter === 'major' ? 'bg-orange-600 text-white' : 'bg-white border hover:bg-gray-100'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              גדול ({stats?.majorCorrections || 0})
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <Download className="w-4 h-4" />
              ייצא
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer text-sm">
              <Upload className="w-4 h-4" />
              ייבא
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              <Trash2 className="w-4 h-4" />
              מחק הכל
            </button>
          </div>
        </div>

        {/* רשימת תיקונים */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredCorrections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">אין תיקונים עדיין</p>
              <p className="text-sm">התחילי לעבוד והמערכת תתחיל ללמוד מהתיקונים שלך</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCorrections.map((correction) => (
                <div
                  key={correction.id}
                  className={`border-2 rounded-lg p-4 hover:shadow-lg transition ${
                    correction.correctionType === 'accepted' ? 'border-green-200 bg-green-50' :
                    correction.correctionType === 'minor' ? 'border-yellow-200 bg-yellow-50' :
                    'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {correction.correctionType === 'accepted' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {correction.correctionType === 'minor' && <Edit3 className="w-5 h-5 text-yellow-600" />}
                      {correction.correctionType === 'major' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                      
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border">
                        {getContextLabel(correction.context)}
                      </span>
                      <span className="px-3 py-1 bg-white rounded-full text-sm border">
                        {correction.style}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(correction.timestamp).toLocaleString('he-IL')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(correction.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* טקסט מקורי */}
                    <div>
                      <div className="text-xs font-bold text-gray-600 mb-1">טקסט מקורי:</div>
                      <div className="p-3 bg-gray-100 border border-gray-300 rounded text-sm">
                        {correction.original}
                      </div>
                    </div>

                    {/* מה שה-AI הציע */}
                    <div>
                      <div className="text-xs font-bold text-blue-700 mb-1">💭 מה שה-AI הציע:</div>
                      <div className="p-3 bg-blue-50 border border-blue-300 rounded text-sm">
                        {correction.aiSuggestion}
                      </div>
                    </div>

                    {/* מה שהמשתמש בחר */}
                    <div>
                      <div className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1">
                        ✅ מה שבחרת:
                        {correction.correctionType === 'accepted' && <span className="text-green-600">(זהה להצעת AI)</span>}
                      </div>
                      <div className="p-3 bg-white border-2 border-green-500 rounded text-sm font-medium">
                        {correction.userCorrection}
                      </div>
                    </div>

                    {/* הבדלים */}
                    {correction.correctionType !== 'accepted' && (
                      <div className="bg-purple-50 border border-purple-200 rounded p-3 text-xs">
                        <strong className="text-purple-900">🎓 מה AI למד:</strong>
                        <div className="mt-1 text-purple-800">
                          {correction.correctionType === 'minor' 
                            ? 'שינויים קלים בניסוח - להקפיד על דיוק רב יותר'
                            : 'שינוי משמעותי בגישה או בסגנון - לשנות את אופן החשיבה'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getContextLabel(context: string): string {
  const labels: Record<string, string> = {
    'will-single': 'צוואת יחיד',
    'will-couple': 'צוואה זוגית',
    'advance-directives': 'הנחיות מקדימות',
    'fee-agreement': 'הסכם שכר טרחה',
    'demand-letter': 'מכתב התראה',
    'court-pleadings': 'כתבי בית דין',
  };
  return labels[context] || context;
}
