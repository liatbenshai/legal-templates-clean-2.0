export default function AdvanceDirectivesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          הנחיות מקדימות בייפוי כוח מתמשך
        </h1>
        <p className="text-center text-gray-600 mb-8">
          ✅ העמוד עובד! המודול המלא בפיתוח...
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">💡 סטטוס נוכחי</h2>
          <p className="mb-2">✅ העמוד נטען בהצלחה</p>
          <p className="mb-2">✅ Routing עובד</p>
          <p className="mb-2">⏳ הקומפוננט המלא יתווסף בקרוב</p>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/documents/advance-directives-simple" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            👉 נסי את הגרסה הפשוטה
          </a>
        </div>
      </div>
    </div>
  );
}
