'use client';

import { useState } from 'react';
import { Save, Download } from 'lucide-react';
import ExportButtons from '../ExportButtons';

interface TemplatePreviewProps {
  templateData: any;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function TemplatePreview({ templateData, onBack, onSave, isSaving }: TemplatePreviewProps) {
  // ערכי דוגמה לשדות (לתצוגה מקדימה)
  const [sampleValues, setSampleValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    templateData.fields.forEach((field: any) => {
      values[field.label] = field.placeholder || `{${field.label}}`;
    });
    return values;
  });

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">תצוגה מקדימה וסיכום</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* סיכום כללי */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">📋 פרטי התבנית</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-600 text-xs">שם התבנית</div>
              <div className="font-bold text-lg text-gray-900">{templateData.title}</div>
            </div>
            <div>
              <div className="text-gray-600 text-xs">תיאור</div>
              <div className="text-gray-700">{templateData.description}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {getCategoryName(templateData.category)}
              </span>
              {templateData.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* סיכום שדות */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">📝 שדות ({templateData.fields.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {templateData.fields.map((field: any) => (
              <div key={field.id} className="flex items-start gap-2 text-sm">
                <span className={`text-xs ${field.required ? 'text-red-500' : 'text-gray-400'}`}>●</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{field.label}</div>
                  <div className="text-xs text-gray-600">{field.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* סיכום בלוקים */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">🧱 בלוקים ({templateData.blocks.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {templateData.blocks.map((block: any, index: number) => (
              <div key={block.id} className="flex items-center gap-2 text-sm">
                <span className="text-xs text-gray-500">{index + 1}.</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{getBlockTypeLabel(block.type)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* תצוגת מסמך */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-8" style={{ direction: 'rtl' }}>
        <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">📄 תצוגת המסמך</h3>
        
        <div className="space-y-4">
          {templateData.blocks.map((block: any) => (
            <div
              key={block.id}
              style={{
                fontSize: block.style?.fontSize ? `${block.style.fontSize}px` : undefined,
                fontWeight: block.style?.bold ? 'bold' : undefined,
                textDecoration: block.style?.underline ? 'underline' : undefined,
                textAlign: block.style?.textAlign || 'right',
                fontStyle: block.style?.italic ? 'italic' : undefined,
                color: block.style?.color,
                backgroundColor: block.style?.backgroundColor,
                lineHeight: block.style?.lineHeight,
                marginTop: block.metadata?.marginTop ? `${block.metadata.marginTop}px` : undefined,
                marginBottom: block.metadata?.marginBottom ? `${block.metadata.marginBottom}px` : undefined,
              }}
            >
              {renderBlockPreview(block)}
            </div>
          ))}
        </div>
      </div>

      {/* כפתורי ייצוא */}
      <ExportButtons
        templateData={templateData}
        fieldValues={sampleValues}
      />

      {/* הודעת הצלחה */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">✨</div>
          <div className="flex-1">
            <h4 className="font-bold text-green-900 text-lg mb-2">התבנית מוכנה לשמירה!</h4>
            <p className="text-green-800 text-sm">
              לאחר השמירה, התבנית תופיע ברשימת התבניות וכל משתמש יוכל להשתמש בה לייצור מסמכים מקצועיים.
              <br />
              <strong>בנוסף:</strong> תוכל לייצא את התבנית ל-PDF, Word או להדפיס אותה ישירות מהתצוגה המקדימה.
            </p>
          </div>
        </div>
      </div>

      {/* כפתורים */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← חזור לעריכה
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 font-bold text-lg shadow-xl"
        >
          <Save className="w-6 h-6" />
          <span>{isSaving ? 'שומר...' : 'שמור תבנית 🎉'}</span>
        </button>
      </div>
    </div>
  );
}

function renderBlockPreview(block: any): React.ReactNode {
  if (block.type === 'horizontal-rule') {
    return <hr className="border-gray-400" />;
  }

  if (block.type === 'page-break') {
    return (
      <div className="text-center text-xs text-gray-400 py-2 border-y border-dashed">
        --- מעבר עמוד ---
      </div>
    );
  }

  if (block.type === 'table' && block.content?.rows) {
    return (
      <table className="w-full border-collapse" style={{ borderWidth: block.content.borderWidth || 1 }}>
        <tbody>
          {block.content.rows.map((row: any) => (
            <tr key={row.id}>
              {row.cells.map((cell: any) => (
                <td
                  key={cell.id}
                  className="border p-2"
                  style={{
                    borderWidth: block.content.borderWidth || 1,
                    borderColor: block.content.borderColor || '#000',
                    padding: `${block.content.cellPadding || 8}px`,
                  }}
                >
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (Array.isArray(block.content)) {
    const ListTag = block.metadata?.listStyle === 'decimal' ? 'ol' : 'ul';
    return (
      <ListTag className={block.metadata?.listStyle === 'decimal' ? 'list-decimal mr-6' : 'list-disc mr-6'}>
        {block.content.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    );
  }

  return <div className="whitespace-pre-wrap">{block.content}</div>;
}

function getBlockTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    heading1: 'כותרת ראשית',
    heading2: 'כותרת משנית',
    heading3: 'כותרת קטנה',
    paragraph: 'פסקה',
    table: 'טבלה',
    'numbered-list': 'רשימה ממוספרת',
    'bullet-list': 'רשימה מנוקדת',
    'horizontal-rule': 'קו הפרדה',
    'page-break': 'מעבר עמוד',
    signature: 'חתימה',
  };
  return labels[type] || type;
}

function getCategoryName(id: string): string {
  const names: Record<string, string> = {
    'beit-din': 'כתבי בית דין',
    'wills': 'צוואות',
    'power-of-attorney': 'ייפויי כוח',
    'contracts': 'הסכמים',
    'requests': 'בקשות',
    'appeals': 'ערעורים',
    'family-law': 'דיני משפחה',
    'real-estate': 'נדל"ן',
    'corporate': 'דיני חברות',
  };
  return names[id] || id;
}

