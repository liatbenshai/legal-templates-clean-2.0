import { getTemplateById } from '@/lib/templates';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Edit, 
  Copy,
  Download 
} from 'lucide-react';

interface PageProps {
  params: { id: string };
}

export default async function TemplatePage({ params }: PageProps) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template) {
    notFound();
  }

  const groupedFields = template.fields.reduce((acc, field) => {
    const group = field.group || 'כללי';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, typeof template.fields>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-700 mb-4"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה לכל התבניות</span>
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {template.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {template.description}
              </p>

              {/* מטא-דאטה */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>עודכן: {new Date(template.updatedAt).toLocaleDateString('he-IL')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{template.fields.length} שדות</span>
                </div>
                {template.version && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    גרסה {template.version}
                  </span>
                )}
              </div>

              {/* תגיות */}
              <div className="flex flex-wrap gap-2 mt-6">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* כפתורי פעולה */}
            <div className="flex flex-col gap-3">
              <Link
                href={`/editor?template=${template.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Edit className="w-5 h-5" />
                <span>השתמש בתבנית</span>
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                <Copy className="w-5 h-5" />
                <span>שכפל תבנית</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                <Download className="w-5 h-5" />
                <span>הורד דוגמה</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* תוכן */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* שדות */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                שדות בתבנית
              </h2>

              <div className="space-y-6">
                {Object.entries(groupedFields).map(([groupName, fields]) => (
                  <div key={groupName}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                      {groupName}
                    </h3>
                    <div className="space-y-4">
                      {fields.sort((a, b) => a.order - b.order).map((field) => (
                        <div key={field.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {field.label}
                              </span>
                              {field.required && (
                                <span className="text-red-500 text-sm">חובה</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              סוג: {field.type}
                              {field.helpText && (
                                <span className="block mt-1 text-gray-500">
                                  {field.helpText}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div className="space-y-6">
            {/* פרטים נוספים */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                פרטים נוספים
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600">קטגוריה</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">
                    {template.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">תאריך יצירה</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(template.createdAt).toLocaleDateString('he-IL')}
                  </dd>
                </div>
                {template.author && (
                  <div>
                    <dt className="text-sm text-gray-600">מחבר</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-1">
                      {template.author}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-600">סטטוס</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">
                    {template.isPublic ? 'ציבורי' : 'פרטי'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* טיפים */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                💡 טיפים לשימוש
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• מלא את כל השדות המסומנים כחובה</li>
                <li>• השתמש בעוזר AI לניסוח משפטי תקין</li>
                <li>• שמור את המסמך לפני ייצוא</li>
                <li>• ניתן לערוך את העיצוב בעורך המתקדם</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
