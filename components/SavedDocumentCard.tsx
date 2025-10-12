import Link from 'next/link';
import { FileText, Calendar, Download, Trash2, Edit, Eye } from 'lucide-react';
import { FilledTemplate } from '@/lib/types';

interface SavedDocumentCardProps {
  document: FilledTemplate;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function SavedDocumentCard({ 
  document, 
  onDelete, 
  onDownload 
}: SavedDocumentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'exported':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'draft':
        return 'טיוטה';
      case 'exported':
        return 'יוצא';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-primary group">
      {/* כותרת וסטטוס */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <FileText className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition line-clamp-2">
              {document.title}
            </h3>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(document.status)}`}>
          {getStatusText(document.status)}
        </span>
      </div>

      {/* תאריכים */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>נוצר: {new Date(document.createdAt).toLocaleDateString('he-IL')}</span>
        </div>
        {document.updatedAt !== document.createdAt && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>עודכן: {new Date(document.updatedAt).toLocaleDateString('he-IL')}</span>
          </div>
        )}
      </div>

      {/* כפתורי פעולה */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Link 
          href={`/editor/${document.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Edit className="w-4 h-4" />
          <span>ערוך</span>
        </Link>
        
        <Link
          href={`/preview/${document.id}`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>תצוגה</span>
        </Link>

        {onDownload && (
          <button
            onClick={() => onDownload(document.id)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => {
              if (confirm('האם למחוק את המסמך?')) {
                onDelete(document.id);
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

