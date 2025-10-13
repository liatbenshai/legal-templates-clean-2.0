'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FilledTemplate } from '@/lib/types';
import SavedDocumentCard from '@/components/SavedDocumentCard';
import { FileText, Search, Filter, Trash2, Download } from 'lucide-react';

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<FilledTemplate[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<FilledTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'completed' | 'exported'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  useEffect(() => {
    // טעינת מסמכים מ-localStorage
    loadDocuments();
  }, []);

  useEffect(() => {
    // סינון וחיפוש
    let filtered = [...documents];

    // סינון לפי סטטוס
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // חיפוש
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query)
      );
    }

    // מיון
    if (sortBy === 'date') {
      filtered.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else {
      filtered.sort((a, b) => a.title.localeCompare(b.title, 'he'));
    }

    setFilteredDocs(filtered);
  }, [documents, searchQuery, statusFilter, sortBy]);

  const loadDocuments = () => {
    try {
      const saved = localStorage.getItem('savedDocuments');
      if (saved) {
        const docs = JSON.parse(saved);
        setDocuments(docs);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updated = documents.filter(doc => doc.id !== id);
      localStorage.setItem('savedDocuments', JSON.stringify(updated));
      setDocuments(updated);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('שגיאה במחיקת המסמך');
    }
  };

  const handleDownload = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    // יצוא כ-JSON
    const dataStr = JSON.stringify(doc, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.json`;
    a.click();
  };

  const handleDeleteAll = () => {
    if (confirm('האם למחוק את כל המסמכים? פעולה זו אינה ניתנת לביטול.')) {
      localStorage.removeItem('savedDocuments');
      setDocuments([]);
    }
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(documents, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-documents-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-10 h-10 text-primary" />
                <h1 className="text-4xl font-bold text-gray-900">המסמכים שלי</h1>
              </div>
              <p className="text-xl text-gray-600">
                כל המסמכים שיצרת ושמרת
              </p>
            </div>

            {documents.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>ייצא הכל</span>
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>מחק הכל</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* תוכן */}
      <div className="container mx-auto px-4 py-8">
        {documents.length > 0 ? (
          <>
            {/* חיפוש וסינון */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* חיפוש */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="חפש מסמך..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* סינון לפי סטטוס */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">כל הסטטוסים</option>
                  <option value="draft">טיוטות</option>
                  <option value="completed">הושלמו</option>
                  <option value="exported">יוצאו</option>
                </select>

                {/* מיון */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="date">מיון לפי תאריך</option>
                  <option value="name">מיון לפי שם</option>
                </select>
              </div>

              {/* מספר תוצאות */}
              <div className="mt-4 text-sm text-gray-600">
                מציג {filteredDocs.length} מתוך {documents.length} מסמכים
              </div>
            </div>

            {/* רשת מסמכים */}
            {filteredDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                  <SavedDocumentCard
                    key={doc.id}
                    document={doc}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  לא נמצאו מסמכים
                </h3>
                <p className="text-gray-600">
                  נסה לשנות את קריטריוני החיפוש
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              עדיין לא יצרת מסמכים
            </h3>
            <p className="text-gray-600 mb-6">
              התחל ליצור מסמכים משפטיים מקצועיים עכשיו
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/templates"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                בחר תבנית
              </Link>
              <Link
                href="/editor"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                התחל מאפס
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

