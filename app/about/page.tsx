export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">אודות המערכת</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">מי אנחנו?</h2>
              <p className="text-gray-600 leading-relaxed">
                אנחנו מספקים פלטפורמה מתקדמת לעורכי דין עם מאות תבניות משפטיות מעוצבות.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">המטרה שלנו</h2>
              <p className="text-gray-600 leading-relaxed">
                לחסוך זמן ויעילות בעבודת עורכי דין על ידי כלים חכמים ועוזר AI לניסוח משפטי בעברית תקינה.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">התכונות שלנו</h2>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>200+ תבניות משפטיות מקצועיות</li>
                <li>עוזר AI לניסוח אוטומטי</li>
                <li>עורך מתקדם עם עיצוב מלא</li>
                <li>ייצוא ל-PDF וWord</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
