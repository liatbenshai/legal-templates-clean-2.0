'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { User as UserIcon, Mail, Phone, Building, Lock, Save, LogOut, Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    licenseNumber: '',
    officeAddress: '',
  });

  useEffect(() => {
    setMounted(true);
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        company: currentUser.company || '',
        licenseNumber: currentUser.licenseNumber || '',
        officeAddress: currentUser.officeAddress || '',
      });
    }
  }, []);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      licenseNumber: formData.licenseNumber,
      officeAddress: formData.officeAddress,
    };

    AuthService.updateUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
    setMessage({ type: 'success', text: 'הפרופיל עודכן בהצלחה!' });
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = () => {
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'הסיסמאות אינן תואמות' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'הסיסמה חייבת להכיל לפחות 6 תווים' });
      return;
    }

    const success = AuthService.changePassword(
      user.id,
      passwordData.oldPassword,
      passwordData.newPassword
    );

    if (success) {
      setMessage({ type: 'success', text: 'הסיסמה שונתה בהצלחה!' });
      setShowPasswordForm(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setMessage({ type: 'error', text: 'הסיסמה הישנה שגויה' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogout = () => {
    if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
      AuthService.logout();
      router.push('/');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">הפרופיל שלי</h1>
              <p className="text-gray-600">נרשמת ב-{new Date(user.createdAt).toLocaleDateString('he-IL')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>התנתק</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* הודעה */}
          {message && (
            <div
              className={`px-4 py-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* פרטים אישיים */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">פרטים אישיים ✨</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                >
                  ערוך
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>שמור</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        phone: user.phone || '',
                        company: user.company || '',
                        licenseNumber: user.licenseNumber || '',
                        officeAddress: user.officeAddress || '',
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    ביטול
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* שם */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם מלא
                </label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* אימייל */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כתובת מייל
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
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
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* מספר רישיון עו"ד */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מספר רישיון עו"ד
                </label>
                <div className="relative">
                  <Scale className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    disabled={!isEditing}
                    placeholder="אופציונלי - רק לעורכי דין"
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* כתובת משרד */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כתובת משרד עו"ד
                </label>
                <div className="relative">
                  <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.officeAddress}
                    onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                    disabled={!isEditing}
                    placeholder="אופציונלי - כתובת מלאה של המשרד"
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* שינוי סיסמה */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">אבטחה</h2>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Lock className="w-4 h-4" />
                  <span>שנה סיסמה</span>
                </button>
              )}
            </div>

            {showPasswordForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סיסמה נוכחית
                  </label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    אימות סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="ltr"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    שמור סיסמה
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            )}

            {!showPasswordForm && (
              <p className="text-sm text-gray-600">
                שינוי סיסמה דורש אימות של הסיסמה הנוכחית
              </p>
            )}
          </div>

          {/* סטטיסטיקות */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">הסטטיסטיקות שלי</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {JSON.parse(localStorage.getItem('savedDocuments') || '[]').length}
                </div>
                <div className="text-sm text-gray-600">מסמכים שנוצרו</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">ימים במערכת</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

