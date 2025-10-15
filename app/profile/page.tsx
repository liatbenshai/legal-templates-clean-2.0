'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Building, Scale, MapPin, Save } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    licenseNumber: '',
    officeAddress: '',
  });
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await AuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        company: currentUser.company || '',
        licenseNumber: currentUser.licenseNumber || '',
        officeAddress: currentUser.officeAddress || '',
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const success = await AuthService.updateUser({
        id: user.id,
        ...formData,
      });

      if (success) {
        setMessage('הפרטים עודכנו בהצלחה!');
        await loadUser();
      } else {
        setMessage('שגיאה בעדכון הפרטים');
      }
    } catch (error) {
      setMessage('שגיאה בעדכון הפרטים');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* כותרת */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'משתמש'}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* טופס עריכה */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">פרטים אישיים</h2>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('הצלחה') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* שם */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם מלא
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="שם מלא"
                  dir="rtl"
                />
              </div>
            </div>

            {/* אימייל (לא ניתן לעריכה) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כתובת מייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">לא ניתן לשנות את כתובת המייל</p>
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
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="שם משרד עורכי דין"
                  dir="rtl"
                />
              </div>
            </div>

            {/* רישיון */}
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
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="מספר רישיון"
                  dir="ltr"
                />
              </div>
            </div>

            {/* כתובת */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כתובת משרד
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="כתובת מלאה"
                  dir="rtl"
                />
              </div>
            </div>

            {/* כפתור שמירה */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'שומר...' : 'שמור שינויים'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
