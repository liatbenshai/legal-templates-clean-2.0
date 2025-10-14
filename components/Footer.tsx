'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">מערכת תבניות משפטיות</h3>
            <p className="text-gray-300 text-sm">
              המערכת המקיפה ביותר לתבניות משפטיות בעברית
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/documents" className="text-gray-300 hover:text-white transition">
                  מסמכים משפטיים
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-white transition">
                  הפרופיל שלי
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">מידע משפטי</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition">
                  תנאי שימוש
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white transition">
                  מדיניות פרטיות
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} מערכת תבניות משפטיות. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}

