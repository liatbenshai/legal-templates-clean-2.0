import Link from 'next/link';
import { FileText, Zap, Shield, Clock, Search, Sparkles } from 'lucide-react';
import { categories, updateCategoryCounts } from '@/lib/templates';
import CategoryCard from '@/components/CategoryCard';

export default function HomePage() {
  const updatedCategories = updateCategoryCounts();
  const featuredCategories = updatedCategories.slice(0, 6);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>מערכת מתקדמת עם עוזר AI לניסוח משפטי</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            כל התבניות המשפטיות
            <br />
            <span className="text-primary">במקום אחד</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            פלטפורמה מתקדמת לעורכי דין עם מאות תבניות משפטיות מעוצבות,
            עורך חכם ועוזר AI לניסוח בעברית משפטית תקינה
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/documents"
              className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              <span>יצירת מסמכים 🚀</span>
            </Link>
            <Link
              href="/templates"
              className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              גלה תבניות
            </Link>
            <Link
              href="/editor"
              className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-xl hover:bg-gray-50 transition border-2 border-primary"
            >
              עורך חדש
            </Link>
          </div>
        </div>

        {/* סטטיסטיקות */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-primary mb-2">200+</div>
            <div className="text-gray-600">תבניות משפטיות</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-primary mb-2">9</div>
            <div className="text-gray-600">קטגוריות ראשיות</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-gray-600">בעברית תקינה</div>
          </div>
        </div>
      </section>

      {/* תכונות עיקריות */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">למה לבחור בנו?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              הכלים המתקדמים ביותר לניסוח מסמכים משפטיים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* תכונה 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                תבניות מקצועיות
              </h3>
              <p className="text-gray-600">
                מאות תבניות משפטיות מעוצבות ומוכנות לשימוש מיידי
              </p>
            </div>

            {/* תכונה 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                עוזר AI לניסוח
              </h3>
              <p className="text-gray-600">
                ניסוח אוטומטי בעברית משפטית תקינה עם בינה מלאכותית
              </p>
            </div>

            {/* תכונה 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                עורך מתקדם
              </h3>
              <p className="text-gray-600">
                עיצוב מלא עם טבלאות, כותרות וסעיפים מסודרים
              </p>
            </div>

            {/* תכונה 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                חוסך זמן
              </h3>
              <p className="text-gray-600">
                צור מסמכים מקצועיים תוך דקות במקום שעות
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* קטגוריות מובילות */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">קטגוריות פופולריות</h2>
            <p className="text-xl text-gray-600">
              גלה את התבניות הנפוצות ביותר
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <span>כל הקטגוריות</span>
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            הצטרף לאלפי עורכי דין שכבר משתמשים במערכת שלנו
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/templates"
              className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-xl hover:bg-gray-100 transition"
            >
              התחל עכשיו
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-primary transition"
            >
              למד עוד
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
