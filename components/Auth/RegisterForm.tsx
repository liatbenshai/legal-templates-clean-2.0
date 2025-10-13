'use client';

import { useState } from 'react';
import { AuthService } from '@/lib/auth';
import { Mail, Lock, User, Phone, Building, Eye, EyeOff, UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export default function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    company: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // וולידציה
    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    if (formData.password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
      });

      if (result.success) {
        onSuccess?.();
        window.location.href = '/my-documents';
      } else {
        setError(result.error || 'שגיאה בהרשמה');
      }
    } catch (err) {
      setError('שגיאה בהרשמה, אנא נסה שוב');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">הרשמה</h2>
          <p className="text-gray-600">צור חשבון חדש</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* שגיאה */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* שם מלא */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="שם מלא"
                dir="rtl"
              />
            </div>
          </div>

          {/* אימייל */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כתובת מייל <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          {/* טלפון */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              טלפון
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="050-1234567"
                dir="ltr"
              />
            </div>
          </div>

          {/* חברה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              משרד/חברה
            </label>
            <div className="relative">
              <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="שם משרד עורכי דין"
                dir="rtl"
              />
            </div>
          </div>

          {/* סיסמה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                minLength={6}
                className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="לפחות 6 תווים"
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

          {/* אימות סיסמה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              אימות סיסמה <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="הזן סיסמה שוב"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* כפתור הרשמה */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'נרשם...' : 'הירשם'}
          </button>
        </form>

        {/* התחברות */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            כבר יש לך חשבון?{' '}
            <button
              onClick={onLoginClick}
              className="text-primary hover:text-blue-700 font-medium"
            >
              התחבר
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

