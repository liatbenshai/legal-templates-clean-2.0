'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Search, Filter } from 'lucide-react';

export default function MyDocumentsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* כותרת */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">המסמכים שלי</h1>
          <p className="text-gray-600">שלום {user?.name}, כאן תוכל לראות את כל המסמכים שיצרת</p>
        </div>

        {/* פעולות */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => router.push('/editor')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>מסמך חדש</span>
          </button>

          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="חפש מסמך..."
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-5 h-5" />
            <span>סינון</span>
          </button>
        </div>

        {/* רשימת מסמכים */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">אין מסמכים עדיין</h3>
            <p className="text-gray-600 mb-6">התחל ליצור את המסמך הראשון שלך</p>
            <button
              onClick={() => router.push('/documents')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              עבור לתבניות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
