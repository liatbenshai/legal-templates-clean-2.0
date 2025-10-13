import Link from 'next/link';
import { FileText, Clock, Tag } from 'lucide-react';
import { Template } from '@/lib/types';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  // מציאת אייקון הקטגוריה
  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, string> = {
      'beit-din': '⚖️',
      'wills': '📜',
      'power-of-attorney': '✍️',
      'contracts': '📄',
      'requests': '🏛️',
      'appeals': '📋',
      'family-law': '👨‍👩‍👧‍👦',
      'real-estate': '🏠',
      'corporate': '🏢',
    };
    return icons[categoryId] || '📄';
  };

  return (
    <Link href={`/templates/${template.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border border-gray-200 hover:border-primary cursor-pointer group">
        {/* כותרת עם אייקון */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{getCategoryIcon(template.category)}</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition line-clamp-2">
              {template.title}
            </h3>
          </div>
        </div>

        {/* תיאור */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {template.description}
        </p>

        {/* תגיות */}
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* מידע נוסף */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>עודכן: {new Date(template.updatedAt).toLocaleDateString('he-IL')}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{template.fields.length} שדות</span>
          </div>
        </div>

        {/* אינדיקטור גרסה */}
        {template.version && (
          <div className="mt-3">
            <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
              גרסה {template.version}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
