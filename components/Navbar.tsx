'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X, FileText, User, Settings, LogOut } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // עדכון משתמש נוכחי אחרי הטעינה
    setMounted(true);
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    if (confirm('האם להתנתק?')) {
      AuthService.logout();
      setCurrentUser(null);
      router.push('/');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* לוגו */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <FileText className="w-6 h-6" />
            <span>מערכת תבניות משפטיות</span>
          </Link>

          {/* תפריט דסקטופ */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/documents" className="text-gray-700 hover:text-primary transition font-bold">
              📄 יצירת מסמכים
            </Link>
            <Link href="/ai-test" className="text-purple-600 hover:text-purple-700 transition font-bold flex items-center gap-1">
              🧪 בדיקת AI
            </Link>
            <Link href="/ai-learning" className="text-orange-600 hover:text-orange-700 transition text-sm flex items-center gap-1">
              🧠 למידת AI
            </Link>
            <Link href="/documents/court-petition" className="text-gray-700 hover:text-primary transition text-sm">
              ⚖️ כתבי בית דין
            </Link>
            <Link href="/documents/fee-agreement" className="text-gray-700 hover:text-primary transition text-sm">
              💰 הסכמי שכ״ט
            </Link>
            <Link href="/documents/power-of-attorney-pro" className="text-gray-700 hover:text-primary transition text-sm">
              ✍️ ייפוי כוח
            </Link>
            <Link href="/documents/affidavit-pro" className="text-gray-700 hover:text-primary transition text-sm">
              ✅ תצהיר
            </Link>
            <Link href="/import" className="text-gray-700 hover:text-primary transition font-bold">
              📥 ייבוא תבניות
            </Link>
            <Link href="/templates" className="text-gray-700 hover:text-primary transition">
              תבניות
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary transition">
              קטגוריות
            </Link>
            {mounted && currentUser && (
              <>
                <Link href="/editor" className="text-gray-700 hover:text-primary transition">
                  עורך חדש
                </Link>
                <Link href="/my-documents" className="text-gray-700 hover:text-primary transition">
                  המסמכים שלי
                </Link>
              </>
            )}
            <Link href="/about" className="text-gray-700 hover:text-primary transition">
              אודות
            </Link>
          </div>

          {/* כפתורי פעולה */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {mounted && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{currentUser.name}</span>
                </button>

                {/* תפריט משתמש */}
                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{currentUser.name}</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span>הפרופיל שלי</span>
                    </Link>

                    <Link
                      href="/my-documents"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>המסמכים שלי</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span>הגדרות</span>
                    </Link>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-red-600 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>התנתק</span>
                    </button>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  התחברות
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  הרשמה
                </Link>
              </>
            ) : null}
          </div>

          {/* כפתור תפריט מובייל */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* תפריט מובייל */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              {mounted && currentUser && (
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>
              )}

              <Link
                href="/documents"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                📄 יצירת מסמכים
              </Link>
              <Link
                href="/import"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                📥 ייבוא תבניות
              </Link>
              <Link
                href="/templates"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                תבניות
              </Link>
              <Link
                href="/categories"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                קטגוריות
              </Link>

              {mounted && currentUser ? (
                <>
                  <Link
                    href="/editor"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    עורך חדש
                  </Link>
                  <Link
                    href="/my-documents"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    המסמכים שלי
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    הפרופיל שלי
                  </Link>
                  <div className="border-t pt-3 mt-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-right"
                    >
                      התנתק
                    </button>
                  </div>
                </>
              ) : mounted ? (
                <>
                  <Link
                    href="/about"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    אודות
                  </Link>
                  <div className="border-t pt-3 mt-2">
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      התחברות
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 bg-primary text-white text-center rounded-lg hover:bg-blue-700 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      הרשמה
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
