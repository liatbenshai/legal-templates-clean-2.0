'use client';

import { useState } from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* צד שמאל - מידע */}
        <div className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-primary mb-8">
            <FileText className="w-8 h-8" />
            <span className="text-2xl font-bold">מערכת תבניות משפטיות</span>
          </Link>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            כל התבניות המשפטיות
            <br />
            <span className="text-primary">במקום אחד</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            הצטרף לאלפי עורכי דין שכבר משתמשים במערכת המתקדמת ביותר
            לתבניות משפטיות בעברית
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">200+ תבניות מקצועיות</h3>
                <p className="text-gray-600 text-sm">כתבי בית דין, צוואות, הסכמים ועוד</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">עוזר AI לניסוח</h3>
                <p className="text-gray-600 text-sm">ניסוח אוטומטי בעברית משפטית תקינה</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">עורך מתקדם</h3>
                <p className="text-gray-600 text-sm">עיצוב מלא עם טבלאות וסעיפים מסודרים</p>
              </div>
            </div>
          </div>
        </div>

        {/* צד ימין - טופס */}
        <div>
          {mode === 'login' ? (
            <LoginForm
              onSuccess={() => {
                // הפניה למסמכים שלי
                window.location.href = '/my-documents';
              }}
              onRegisterClick={() => setMode('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={() => {
                // הפניה למסמכים שלי
                window.location.href = '/my-documents';
              }}
              onLoginClick={() => setMode('login')}
            />
          )}

          {/* חזרה לדף הבית */}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

