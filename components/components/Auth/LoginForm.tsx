'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/auth';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

export default function LoginForm({ onSuccess, onRegisterClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await AuthService.login({ email, password });

      if (result.success) {
        onSuccess?.();
        window.location.href = '/my-documents';
      } else {
        setError(result.error || 'שגיאה בהתחברות');
      }
    } catch (err) {
      setError('שגיאה בהתחברות, אנא נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">התחברות</h2>
          <p className="text-gray-600">היכנס לחשבון שלך</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* שגיאה */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* אימייל */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת מייל
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          {/* סיסמה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* שכחתי סיסמה */}
          <div className="text-left">
            <Link href="/forgot-password" className="text-sm text-primary hover:text-blue-700">
              שכחתי סיסמה
            </Link>
          </div>

          {/* כפתור התחברות */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        {/* הרשמה */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            עדיין אין לך חשבון?{' '}
            <button
              onClick={onRegisterClick}
              className="text-primary hover:text-blue-700 font-medium"
            >
              הירשם עכשיו
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

