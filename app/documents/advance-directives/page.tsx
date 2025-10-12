'use client';

export default function AdvanceDirectivesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📋 הנחיות מקדימות בייפוי כוח מתמשך
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <span>✅</span>
            <span className="font-bold">העמוד עובד!</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h2 className="font-bold mb-2">⚠️ המודול המלא בבנייה</h2>
            <p className="text-sm">הקומפוננט המלא עם מחסן הסעיפים בדרך...</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h2 className="font-bold mb-2">🔧 בינתיים:</h2>
            <p className="text-sm mb-3">נסי את הגרסה הפשוטה שעובדת:</p>
            <a 
              href="/documents/advance-directives-simple" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
            >
              👉 גרסה פשוטה (עובדת)
            </a>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">📊 מה יהיה במודול המלא:</h3>
            <ul className="text-sm space-y-1 mr-4">
              <li>✅ פרטי ממנה ומיופי כוח</li>
              <li>✅ מחסן 95 סעיפים מוכנים</li>
              <li>✅ חיפוש וסינון</li>
              <li>✅ נטיות מגדר אוטומטיות</li>
              <li>✅ שמירה אוטומטית</li>
              <li>✅ שיפור AI לכל סעיף</li>
              <li>✅ ייצוא Word/PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
