'use client';

import { Brain, BookOpen, Sparkles, TrendingUp } from 'lucide-react';

export default function AILearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* כותרת */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Brain className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">למידת AI</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            שפר את היכולות המשפטיות שלך עם עוזר AI חכם שלומד מהניסוח שלך
          </p>
        </div>

        {/* תכונות */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ניסוח אוטומטי</h3>
            <p className="text-gray-600">
              קבל הצעות לניסוח משפטי תקין ומקצועי על בסיס הקשר המסמך
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">למידה מתמשכת</h3>
            <p className="text-gray-600">
              המערכת לומדת מהסגנון והטרמינולוגיה המשפטית שלך
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">שיפור מתמיד</h3>
            <p className="text-gray-600">
              קבל המלצות לשיפור הניסוח והמבנה של המסמכים שלך
            </p>
          </div>
        </div>

        {/* מצב בפיתוח */}
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">בקרוב...</h2>
            <p className="text-gray-600 mb-6">
              אנחנו עובדים על פיצ'ר למידת AI מתקדם שיעזור לך ליצור מסמכים משפטיים
              מקצועיים יותר ומהר יותר.
            </p>
            <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
              הודע לי כשיהיה מוכן
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
