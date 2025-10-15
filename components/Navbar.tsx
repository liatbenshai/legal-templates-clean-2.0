'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, Menu, X, FileText, User, Settings, LogOut, 
  ChevronDown, Home, Scale, DollarSign, HandHeart, 
  CheckCircle, Upload, BookOpen, FolderOpen, 
  Info, Sparkles, Brain
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// רכיב DropdownMenu
function DropdownMenu({ 
  title, 
  icon: Icon, 
  children, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void; 
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // עדכון משתמש נוכחי אחרי הטעינה
    setMounted(true);
    const loadUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    if (confirm('האם להתנתק?')) {
      await AuthService.logout();
      setCurrentUser(null);
      router.push('/');
    }
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
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
          <div className="hidden lg:flex items-center gap-2">
            {/* דף הבית */}
            <Link href="/" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <Home className="w-5 h-5" />
              <span className="font-medium">דף הבית</span>
            </Link>

            {/* מסמכים משפטיים */}
            <DropdownMenu
              title="מסמכים משפטיים"
              icon={FileText}
              isOpen={openDropdown === 'documents'}
              onToggle={() => handleDropdownToggle('documents')}
            >
              <Link href="/documents/will" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>צוואות</span>
              </Link>
              <Link href="/documents/advance-directives" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>הנחיות מקדימות</span>
              </Link>
              <Link href="/documents/fee-agreement" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                <span>הסכמי שכר טרחה</span>
              </Link>
            </DropdownMenu>

            {/* כלים */}
            <DropdownMenu
              title="כלים"
              icon={Settings}
              isOpen={openDropdown === 'tools'}
              onToggle={() => handleDropdownToggle('tools')}
            >
              <Link href="/import" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>ייבוא תבניות</span>
              </Link>
              <Link href="/sections/manage" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                <BookOpen className="w-4 h-4 text-green-600" />
                <span>ניהול סעיפים</span>
              </Link>
              <Link href="/categories" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                <FolderOpen className="w-4 h-4 text-orange-600" />
                <span>קטגוריות</span>
              </Link>
              {mounted && currentUser && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link href="/editor" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>עורך חדש</span>
                  </Link>
                  <Link href="/my-documents" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                    <FileText className="w-4 h-4 text-cyan-600" />
                    <span>המסמכים שלי</span>
                  </Link>
                </>
              )}
            </DropdownMenu>

            {/* AI Learning */}
            <Link href="/ai-learning" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200">
              <Brain className="w-5 h-5" />
              <span className="font-medium">למידת AI</span>
            </Link>

            {/* אודות */}
            <Link href="/about" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <Info className="w-5 h-5" />
              <span className="font-medium">אודות</span>
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
                    {currentUser?.name && currentUser.name.length > 0
                      ? currentUser.name.charAt(0).toUpperCase()
                      : 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">{currentUser?.name || 'משתמש'}</span>
                </button>

                {/* תפריט משתמש */}
                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{currentUser?.name || 'משתמש'}</p>
                      <p className="text-sm text-gray-600">{currentUser?.email || ''}</p>
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
                  className="px-4 py-2 text-gray-700 hover:text-primary font-medium"
                >
                  התחבר
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  הרשם
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
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-1">
              {mounted && currentUser && (
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-semibold text-gray-900">{currentUser?.name || 'משתמש'}</p>
                  <p className="text-sm text-gray-600">{currentUser?.email || ''}</p>
                </div>
              )}

              {/* דף הבית */}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>דף הבית</span>
              </Link>

              {/* מסמכים משפטיים */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  מסמכים משפטיים
                </div>
                <div className="mr-6 space-y-1">
                  <Link href="/documents/will" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    צוואות
                  </Link>
                  <Link href="/documents/advance-directives" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    הנחיות מקדימות
                  </Link>
                  <Link href="/documents/fee-agreement" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    הסכמי שכר טרחה
                  </Link>
                </div>
              </div>

              {/* כלים */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  כלים
                </div>
                <div className="mr-6 space-y-1">
                  <Link href="/import" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    ייבוא תבניות
                  </Link>
                  <Link href="/sections/manage" className="block px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium" onClick={() => setIsMenuOpen(false)}>
                    ניהול סעיפים
                  </Link>
                  <Link href="/categories" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    קטגוריות
                  </Link>
                </div>
              </div>

              {/* AI */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI
                </div>
                <div className="mr-6 space-y-1">
                  <Link href="/ai-learning" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    למידת AI
                  </Link>
                </div>
              </div>

              {/* אודות */}
              <Link
                href="/about"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-5 h-5" />
                <span>אודות</span>
              </Link>

              {/* משתמש */}
              {mounted && currentUser ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/editor"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5" />
                    <span>עורך חדש</span>
                  </Link>
                  <Link
                    href="/my-documents"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5" />
                    <span>המסמכים שלי</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>הפרופיל שלי</span>
                  </Link>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-right"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>התנתק</span>
                    </button>
                  </div>
                </>
              ) : mounted ? (
                <>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>התחבר</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>הרשם</span>
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
