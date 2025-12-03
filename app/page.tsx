import Link from 'next/link';
import { FileText, Zap, Shield, Clock, Search, Sparkles } from 'lucide-react';
import { categories, updateCategoryCounts } from '@/lib/templates';
import CategoryCard from '@/components/CategoryCard';

export default function HomePage() {
  const updatedCategories = updateCategoryCounts();
  const featuredCategories = updatedCategories.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden hero-bg">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Glass Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-medium mb-8 text-primary">
              <Sparkles className="w-4 h-4" />
              <span>מערכת מתקדמת עם עוזר AI לניסוח משפטי</span>
            </div>

            {/* Title with Gradient */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              כל התבניות המשפטיות
              <br />
              <span className="text-gradient">במקום אחד</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              פלטפורמה מתקדמת לעורכי דין עם מאות תבניות משפטיות מעוצבות,
              עורך חכם ועוזר AI לניסוח בעברית משפטית תקינה
            </p>

            {/* Glass CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/documents"
                className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-glass-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                <span>יצירת מסמכים</span>
              </Link>
              <Link
                href="/templates"
                className="glass-button text-primary text-lg font-semibold hover:bg-white/60"
              >
                גלה תבניות
              </Link>
              <Link
                href="/editor"
                className="glass-button border-2 border-primary/20 text-primary text-lg font-semibold hover:border-primary/40"
              >
                עורך חדש
              </Link>
            </div>
          </div>

          {/* Glass Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-20">
            <div className="glass-card text-center group">
              <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">200+</div>
              <div className="text-gray-600">תבניות משפטיות</div>
            </div>
            <div className="glass-card text-center group">
              <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">10</div>
              <div className="text-gray-600">קטגוריות ראשיות</div>
            </div>
            <div className="glass-card text-center group">
              <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-gray-600">בעברית תקינה</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">למה לבחור בנו?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              הכלים המתקדמים ביותר לניסוח מסמכים משפטיים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="glass-card text-center group">
              <div className="glass-icon w-16 h-16 mx-auto mb-4 group-hover:scale-110">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                תבניות מקצועיות
              </h3>
              <p className="text-gray-600">
                מאות תבניות משפטיות מעוצבות ומוכנות לשימוש מיידי
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card text-center group">
              <div className="glass-icon w-16 h-16 mx-auto mb-4 group-hover:scale-110">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                עוזר AI לניסוח
              </h3>
              <p className="text-gray-600">
                ניסוח אוטומטי בעברית משפטית תקינה עם בינה מלאכותית
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card text-center group">
              <div className="glass-icon w-16 h-16 mx-auto mb-4 group-hover:scale-110">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                עורך מתקדם
              </h3>
              <p className="text-gray-600">
                עיצוב מלא עם טבלאות, כותרות וסעיפים מסודרים
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card text-center group">
              <div className="glass-icon w-16 h-16 mx-auto mb-4 group-hover:scale-110">
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

      {/* Popular Categories Section */}
      <section className="py-24 relative hero-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">קטגוריות פופולריות</h2>
            <p className="text-xl text-gray-600">
              גלה את התבניות הנפוצות ביותר
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.name}
                description={category.description || ''}
                href={`/templates?category=${category.id}`}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 glass-button text-primary hover:bg-white/60 font-medium"
            >
              <span>כל הקטגוריות</span>
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-700"></div>
        <div className="absolute inset-0 bg-glass-gradient opacity-50"></div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb" style={{ width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', top: '10%', right: '10%', filter: 'blur(40px)' }}></div>
          <div className="orb" style={{ width: '200px', height: '200px', background: 'rgba(255,255,255,0.15)', bottom: '20%', left: '5%', filter: 'blur(40px)', animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
            הצטרף לאלפי עורכי דין שכבר משתמשים במערכת שלנו
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/templates"
              className="px-8 py-4 bg-white text-primary text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-glass-lg"
            >
              התחל עכשיו
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              למד עוד
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
