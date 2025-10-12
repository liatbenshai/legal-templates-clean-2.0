'use client';

import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/Auth/RegisterForm';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

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
            הצטרף אלינו היום
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            צור חשבון חינם והתחל ליצור מסמכים משפטיים מקצועיים תוך דקות
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary/20">
            <h3 className="font-bold text-gray-900 mb-4">מה כלול בחשבון חינם?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>גישה ל-50 תבניות בסיסיות</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>עורך מסמכים מתקדם</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>שמירת עד 10 מסמכים</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>ייצוא ל-PDF ו-Word</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">⭐</span>
                <span className="font-semibold">שדרוג לפרימיום בכל עת</span>
              </li>
            </ul>
          </div>
        </div>

        {/* צד ימין - טופס */}
        <div>
          <RegisterForm
            onSuccess={() => {
              router.push('/my-documents');
            }}
            onLoginClick={() => {
              router.push('/login');
            }}
          />

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

