'use client';

import { ArrowRight } from 'lucide-react';
import TagsInput from '../TagsInput';
import AutoNumbering, { NumberingConfig } from '../AutoNumbering';

interface GeneralSettingsProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export default function GeneralSettings({ data, onChange, onNext }: GeneralSettingsProps) {
  const categories = [
    { id: 'beit-din', name: 'כתבי בית דין', icon: '⚖️' },
    { id: 'wills', name: 'צוואות', icon: '📜' },
    { id: 'power-of-attorney', name: 'ייפויי כוח', icon: '✍️' },
    { id: 'contracts', name: 'הסכמים', icon: '📄' },
    { id: 'requests', name: 'בקשות לבית משפט', icon: '🏛️' },
    { id: 'appeals', name: 'ערעורים', icon: '📋' },
    { id: 'family-law', name: 'דיני משפחה', icon: '👨‍👩‍👧‍👦' },
    { id: 'real-estate', name: 'נדל"ן', icon: '🏠' },
    { id: 'corporate', name: 'דיני חברות', icon: '🏢' },
  ];

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">הגדרות כלליות</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          שם התבנית <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="לדוגמה: הסכם שכירות דירה מפורט"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תיאור התבנית <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="תאר בפירוט למה משמשת התבנית, מתי להשתמש בה, ומה היא כוללת"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          קטגוריה <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...data, category: cat.id })}
              className={`p-4 rounded-lg border-2 transition text-right ${
                data.category === cat.id
                  ? 'border-primary bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-sm font-medium text-gray-900">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* תגיות מתקדמות */}
      <TagsInput
        tags={data.tags || []}
        onChange={(tags) => onChange({ ...data, tags })}
        suggestions={[
          'דחוף', 'נפוץ', 'מומלץ', 'מורכב', 'פשוט',
          'משפחה', 'עסקי', 'נדל"ן', 'ירושה', 'צוואה',
          'חוזה', 'הסכם', 'בקשה', 'ערעור', 'תביעה'
        ]}
      />

      {/* מספור אוטומטי */}
      <AutoNumbering
        config={data.numberingConfig || {
          enabled: false,
          style: 'decimal',
          prefix: '',
          suffix: '.',
          startFrom: 1,
          resetOnSection: false,
          indentLevel: 0,
        }}
        onChange={(numberingConfig) => onChange({ ...data, numberingConfig })}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-2">💡 טיפים</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• בחר שם ברור ומתאר שמסביר מה התבנית עושה</li>
          <li>• כתוב תיאור מפורט - זה עוזר למשתמשים למצוא את התבנית הנכונה</li>
          <li>• הוסף תגיות רלוונטיות לחיפוש מהיר</li>
        </ul>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={onNext}
          disabled={!data.title || !data.description}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg"
        >
          <span>המשך להגדרת שדות</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

