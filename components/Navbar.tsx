'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Search, Menu, X, FileText, User, Settings, LogOut,
  ChevronDown, Home, Scale, DollarSign,
  Upload, BookOpen, FolderOpen,
  Info, Sparkles, Brain
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Glass Dropdown Menu Component
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
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
          "text-gray-700 hover:text-primary",
          isOpen ? "glass text-primary" : "hover:bg-white/50"
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 glass-dropdown rounded-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
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
    <nav className="glass-navbar sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="glass-icon p-2 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-gradient">מערכת תבניות משפטיות</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-white/50 rounded-xl transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">דף הבית</span>
            </Link>

            {/* Legal Documents Dropdown */}
            <DropdownMenu
              title="מסמכים משפטיים"
              icon={FileText}
              isOpen={openDropdown === 'documents'}
              onToggle={() => handleDropdownToggle('documents')}
            >
              <Link
                href="/documents/will"
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                onClick={() => setOpenDropdown(null)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">צוואות</span>
              </Link>
              <Link
                href="/documents/advance-directives"
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                onClick={() => setOpenDropdown(null)}
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-teal-600" />
                </div>
                <span className="font-medium">הנחיות מקדימות</span>
              </Link>
              <Link
                href="/documents/fee-agreement"
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                onClick={() => setOpenDropdown(null)}
              >
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="font-medium">הסכמי שכר טרחה</span>
              </Link>
            </DropdownMenu>

            {/* Tools Dropdown */}
            <DropdownMenu
              title="כלים"
              icon={Settings}
              isOpen={openDropdown === 'tools'}
              onToggle={() => handleDropdownToggle('tools')}
            >
              <Link
                href="/import"
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                onClick={() => setOpenDropdown(null)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">ייבוא תבניות</span>
              </Link>
              <Link
                href="/sections/manage"
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                onClick={() => setOpenDropdown(null)}
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">ניהול סעיפים</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                onClick={() => setOpenDropdown(null)}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium">קטגוריות</span>
              </Link>
              {mounted && currentUser && (
                <>
                  <div className="border-t border-gray-200/50 my-2 mx-4"></div>
                  <Link
                    href="/editor"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="font-medium">עורך חדש</span>
                  </Link>
                  <Link
                    href="/tools/will-generator"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Scale className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">עורך צוואות מתקדם</span>
                  </Link>
                  <Link
                    href="/my-documents"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="font-medium">המסמכים שלי</span>
                  </Link>
                </>
              )}
            </DropdownMenu>

            {/* AI Learning */}
            <Link
              href="/ai-learning"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-xl transition-all duration-200"
            >
              <Brain className="w-5 h-5" />
              <span className="font-medium">למידת AI</span>
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-white/50 rounded-xl transition-all duration-200"
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">אודות</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="glass-icon p-2 hover:scale-110 transition-transform">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {mounted && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200",
                    isUserMenuOpen ? "glass" : "hover:bg-white/50"
                  )}
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                    {currentUser?.name && currentUser.name.length > 0
                      ? currentUser.name.charAt(0).toUpperCase()
                      : 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">{currentUser?.name || 'משתמש'}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-500 transition-transform duration-200",
                    isUserMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 glass-dropdown rounded-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-200/50">
                      <p className="font-semibold text-gray-900">{currentUser?.name || 'משתמש'}</p>
                      <p className="text-sm text-gray-500">{currentUser?.email || ''}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2 mt-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium">הפרופיל שלי</span>
                    </Link>

                    <Link
                      href="/my-documents"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-lg mx-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium">המסמכים שלי</span>
                    </Link>

                    <div className="border-t border-gray-200/50 my-2 mx-4"></div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors rounded-lg mx-2 text-red-600 w-[calc(100%-1rem)]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-medium">התנתק</span>
                    </button>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2 text-gray-700 hover:text-primary font-medium rounded-xl hover:bg-white/50 transition-all duration-200"
                >
                  התחבר
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                >
                  הרשם
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden glass-icon p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20 glass-light rounded-b-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {mounted && currentUser && (
                <div className="px-4 py-3 glass rounded-xl mb-3 mx-2">
                  <p className="font-semibold text-gray-900">{currentUser?.name || 'משתמש'}</p>
                  <p className="text-sm text-gray-500">{currentUser?.email || ''}</p>
                </div>
              )}

              {/* Home */}
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">דף הבית</span>
              </Link>

              {/* Legal Documents Section */}
              <div className="px-4 py-2 mx-2">
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  מסמכים משפטיים
                </div>
                <div className="mr-6 space-y-1">
                  <Link href="/documents/will" className="block px-3 py-2 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    צוואות
                  </Link>
                  <Link href="/documents/advance-directives" className="block px-3 py-2 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    הנחיות מקדימות
                  </Link>
                  <Link href="/documents/fee-agreement" className="block px-3 py-2 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    הסכמי שכר טרחה
                  </Link>
                </div>
              </div>

              {/* Tools Section */}
              <div className="px-4 py-2 mx-2">
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  כלים
                </div>
                <div className="mr-6 space-y-1">
                  <Link href="/import" className="block px-3 py-2 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    ייבוא תבניות
                  </Link>
                  <Link href="/sections/manage" className="block px-3 py-2 text-sm text-primary font-medium hover:bg-primary/10 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    ניהול סעיפים
                  </Link>
                  <Link href="/categories" className="block px-3 py-2 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    קטגוריות
                  </Link>
                </div>
              </div>

              {/* AI Section */}
              <div className="px-4 py-2 mx-2">
                <div className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI
                </div>
                <div className="mr-6 space-y-1">
                  <Link href="/ai-learning" className="block px-3 py-2 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                    למידת AI
                  </Link>
                </div>
              </div>

              {/* About */}
              <Link
                href="/about"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-5 h-5" />
                <span className="font-medium">אודות</span>
              </Link>

              {/* User Section */}
              {mounted && currentUser ? (
                <>
                  <div className="border-t border-white/20 my-2 mx-4"></div>
                  <Link
                    href="/editor"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">עורך חדש</span>
                  </Link>
                  <Link
                    href="/my-documents"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">המסמכים שלי</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">הפרופיל שלי</span>
                  </Link>
                  <div className="border-t border-white/20 my-2 mx-4 pt-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition text-right mx-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">התנתק</span>
                    </button>
                  </div>
                </>
              ) : mounted ? (
                <>
                  <div className="border-t border-white/20 my-2 mx-4 pt-2">
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white/50 rounded-xl transition mx-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">התחבר</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transition mx-2 mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">הרשם</span>
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
