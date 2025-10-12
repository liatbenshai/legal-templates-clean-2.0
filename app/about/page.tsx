import { FileText, Sparkles, Users, Target, Heart, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              אודות המערכת
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              אנחנו בונים את הפלטפורמה המתקדמת ביותר לתבניות משפטיות בעברית,
              עם טכנולוגיית AI ועיצוב מקצועי
            </p>
          </div>
        </div>
      </div>

      {/* המשימה שלנו */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Target className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                המשימה שלנו
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                אנחנו מאמינים שעורכי דין צריכים להתמקד במה שהם עושים הכי טוב - 
                ייצוג לקוחות וניתוח משפטי. לכן יצרנו מערכת שחוסכת שעות של עבודה
                על ניסוח ועיצוב מסמכים.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                המטרה שלנו היא לספק לכל עורך דין בישראל גישה לתבניות משפטיות
                מקצועיות, עם עוזר AI חכם ועורך מתקדם - הכל בעברית תקינה ומקצועית.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* הערכים שלנו */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              הערכים שלנו
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                איכות ומקצועיות
              </h3>
              <p className="text-gray-600">
                כל תבנית נבדקת על ידי עורכי דין מנוסים ומותאמת לדיני ישראל
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                חדשנות
              </h3>
              <p className="text-gray-600">
                שימוש בטכנולוגיות מתקדמות כמו AI לשיפור חוויית המשתמש
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                נגישות
              </h3>
              <p className="text-gray-600">
                הפלטפורמה זמינה לכולם, עם ממשק פשוט ואינטואיטיבי
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* הטכנולוגיה */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                הטכנולוגיה שלנו
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  🤖 עוזר AI לניסוח
                </h3>
                <p className="text-gray-600">
                  מערכת AI מתקדמת שמבינה עברית משפטית ומסוגלת לנסח טקסטים
                  מקצועיים בהתאם לדרישות המשפט הישראלי
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  ✏️ עורך חכם
                </h3>
                <p className="text-gray-600">
                  עורך WYSIWYG מתקדם עם תמיכה מלאה ב-RTL, טבלאות, כותרות
                  ועיצוב מקצועי
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  📋 שדות דינמיים
                </h3>
                <p className="text-gray-600">
                  מערכת שדות חכמה עם ולידציה אוטומטית, המאפשרת מילוי מהיר
                  ומדויק של כל המידע הנדרש
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  📄 ייצוא מתקדם
                </h3>
                <p className="text-gray-600">
                  ייצוא למגוון פורמטים כולל PDF, Word ו-HTML עם שמירה על
                  העיצוב המקורי
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            הצטרף למהפכה בניסוח מסמכים משפטיים
          </p>
          <Link
            href="/templates"
            className="inline-block px-8 py-4 bg-white text-primary text-lg font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            גלה את התבניות
          </Link>
        </div>
      </section>
    </div>
  );
}

