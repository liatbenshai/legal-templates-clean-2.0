import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          העמוד לא נמצא
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          מצטערים, העמוד שחיפשת אינו קיים או הוסר
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Home className="w-5 h-5" />
            <span>חזרה לדף הבית</span>
          </Link>
          <Link
            href="/templates"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            <Search className="w-5 h-5" />
            <span>חפש תבניות</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

