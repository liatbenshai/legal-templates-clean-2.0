'use client';

import { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Download, Upload, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { hebrewVerbsLearning, VerbCorrection, LearnedVerb } from '@/lib/hebrew-verbs-learning';

interface VerbCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  verb: string;
  context: string;
  gender: string;
  currentSuffix: string;
  onSave: (correctedSuffix: string) => void;
}

export default function VerbCorrectionModal({
  isOpen,
  onClose,
  verb,
  context,
  gender,
  currentSuffix,
  onSave
}: VerbCorrectionModalProps) {
  const [correctedSuffix, setCorrectedSuffix] = useState(currentSuffix);
  const [corrections, setCorrections] = useState<VerbCorrection[]>([]);
  const [learnedVerbs, setLearnedVerbs] = useState<LearnedVerb[]>([]);
  const [similarVerbs, setSimilarVerbs] = useState<LearnedVerb[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCorrectedSuffix(currentSuffix);
      setCorrections(hebrewVerbsLearning.getCorrections());
      setLearnedVerbs(hebrewVerbsLearning.getLearnedVerbs());
      setSimilarVerbs(hebrewVerbsLearning.findSimilarVerbs(verb, context));
    }
  }, [isOpen, verb, context, currentSuffix]);

  const handleSave = () => {
    if (correctedSuffix !== currentSuffix) {
      hebrewVerbsLearning.addCorrection(verb, context, gender, correctedSuffix, currentSuffix);
      onSave(correctedSuffix);
    }
    onClose();
  };

  const handleReset = () => {
    setCorrectedSuffix(currentSuffix);
  };

  const handleExport = () => {
    const data = hebrewVerbsLearning.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hebrew-verbs-learning-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (hebrewVerbsLearning.importData(data)) {
            setCorrections(hebrewVerbsLearning.getCorrections());
            setLearnedVerbs(hebrewVerbsLearning.getLearnedVerbs());
            setSimilarVerbs(hebrewVerbsLearning.findSimilarVerbs(verb, context));
          }
        } catch (error) {
          alert('שגיאה בקריאת הקובץ');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetLearning = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל נתוני הלמידה?')) {
      hebrewVerbsLearning.reset();
      setCorrections([]);
      setLearnedVerbs([]);
      setSimilarVerbs([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              תיקון פועל בעברית
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* מידע על הפועל */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">פועל נוכחי</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">פועל:</span> {verb}
              </div>
              <div>
                <span className="font-medium">הקשר:</span> {context}
              </div>
              <div>
                <span className="font-medium">מגדר:</span> {gender}
              </div>
              <div>
                <span className="font-medium">סיומת נוכחית:</span> {currentSuffix}
              </div>
            </div>
          </div>

          {/* תיקון הסיומת */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיומת מתוקנת
            </label>
            <input
              type="text"
              value={correctedSuffix}
              onChange={(e) => setCorrectedSuffix(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="הזן סיומת מתוקנת"
              dir="rtl"
            />
            <p className="text-xs text-gray-500 mt-1">
              דוגמה: נקבה=ה, זכר=ריק, רבים=ו
            </p>
          </div>

          {/* פעלים דומים */}
          {similarVerbs.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                פעלים דומים שנלמדו
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {similarVerbs.slice(0, 5).map((similar, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded p-3 text-sm cursor-pointer hover:bg-green-100"
                    onClick={() => setCorrectedSuffix(similar[gender as keyof LearnedVerb] || '')}
                  >
                    <div className="font-medium">{similar.verb}</div>
                    <div className="text-gray-600">
                      זכר: {similar.male} | נקבה: {similar.female} | רבים: {similar.plural}
                    </div>
                    <div className="text-xs text-gray-500">
                      ביטחון: {Math.round(similar.confidence * 100)}% | תיקונים: {similar.corrections}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* סטטיסטיקות למידה */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="text-2xl font-bold text-blue-600">{corrections.length}</div>
              <div className="text-sm text-gray-600">תיקונים נשמרו</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="text-2xl font-bold text-green-600">{learnedVerbs.length}</div>
              <div className="text-sm text-gray-600">פעלים נלמדו</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(learnedVerbs.reduce((acc, v) => acc + v.confidence, 0) / learnedVerbs.length * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">ביטחון ממוצע</div>
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Save className="w-4 h-4" />
              שמור תיקון
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              איפוס
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              ייצא נתונים
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer">
              <Upload className="w-4 h-4" />
              יבא נתונים
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleResetLearning}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <AlertCircle className="w-4 h-4" />
              אפס למידה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
