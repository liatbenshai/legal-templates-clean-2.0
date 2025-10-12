'use client';

import { useState } from 'react';
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react';

/**
 * קבוצת שדות חוזרת - לטבלאות דינמיות
 * 
 * דוגמה: יורשים, נכסים, עדים, חשבונות בנק וכו'
 * כל שדה יכול להיות שורה בטבלה שהמשתמש מוסיף דינמית
 */

interface RepeatableField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'id-number' | 'email' | 'phone';
  placeholder?: string;
}

interface RepeatableFieldGroupProps {
  groupName: string;
  fields: RepeatableField[];
  minRows?: number;
  maxRows?: number;
  onChange: (data: any[]) => void;
}

export default function RepeatableFieldGroup({
  groupName,
  fields,
  minRows = 1,
  maxRows = 50,
  onChange,
}: RepeatableFieldGroupProps) {
  const [rows, setRows] = useState<any[]>([createEmptyRow()]);

  function createEmptyRow() {
    const row: any = { id: `row-${Date.now()}-${Math.random()}` };
    fields.forEach(field => {
      row[field.name] = '';
    });
    return row;
  }

  const addRow = () => {
    if (rows.length < maxRows) {
      const newRows = [...rows, createEmptyRow()];
      setRows(newRows);
      onChange(newRows);
    }
  };

  const removeRow = (index: number) => {
    if (rows.length > minRows) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
      onChange(newRows);
    }
  };

  const duplicateRow = (index: number) => {
    if (rows.length < maxRows) {
      const rowToDuplicate = { ...rows[index], id: `row-${Date.now()}-${Math.random()}` };
      const newRows = [...rows];
      newRows.splice(index + 1, 0, rowToDuplicate);
      setRows(newRows);
      onChange(newRows);
    }
  };

  const updateCell = (rowIndex: number, fieldName: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][fieldName] = value;
    setRows(newRows);
    onChange(newRows);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🔁</span>
          {groupName}
          <span className="text-sm font-normal text-gray-500">({rows.length} שורות)</span>
        </h3>
        <button
          onClick={addRow}
          disabled={rows.length >= maxRows}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף שורה</span>
        </button>
      </div>

      {/* טבלה */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse bg-white" dir="rtl">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="p-3 text-right font-bold text-gray-900 border-l border-gray-300">#</th>
              {fields.map(field => (
                <th key={field.id} className="p-3 text-right font-bold text-gray-900 border-l border-gray-300">
                  {field.name}
                </th>
              ))}
              <th className="p-3 text-center font-bold text-gray-900 w-32">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {/* מספר שורה */}
                <td className="p-3 text-center font-medium text-gray-600 border-l border-gray-200">
                  {rowIndex + 1}
                </td>

                {/* שדות */}
                {fields.map(field => (
                  <td key={field.id} className="p-2 border-l border-gray-200">
                    <input
                      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                      value={row[field.name] || ''}
                      onChange={(e) => updateCell(rowIndex, field.name, e.target.value)}
                      placeholder={field.placeholder || field.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                      dir="rtl"
                    />
                  </td>
                ))}

                {/* כפתורי פעולות */}
                <td className="p-2">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => duplicateRow(rowIndex)}
                      disabled={rows.length >= maxRows}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30"
                      title="שכפל שורה"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeRow(rowIndex)}
                      disabled={rows.length <= minRows}
                      className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                      title="מחק שורה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* הודעות */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div>
          {rows.length < maxRows ? (
            <span>ניתן להוסיף עד {maxRows} שורות</span>
          ) : (
            <span className="text-amber-600">הגעת למקסימום שורות ({maxRows})</span>
          )}
        </div>
        <div>
          {rows.length <= minRows ? (
            <span>מינימום {minRows} שורות נדרש</span>
          ) : (
            <span>{rows.length} שורות מתוך {maxRows}</span>
          )}
        </div>
      </div>

      {/* הסבר */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">💡 איך להשתמש בטבלה דינמית זו:</p>
        <ul className="space-y-1 mr-4">
          <li>• כל שורה מייצגת פריט אחד ({groupName.replace('רשימת ', '')})</li>
          <li>• לחץ "הוסף שורה" להוספת פריט נוסף</li>
          <li>• לחץ על ✕ למחיקת שורה</li>
          <li>• לחץ על 📋 לשכפול שורה (שומר זמן)</li>
          <li>• הנתונים יופיעו אוטומטית בטבלה במסמך הסופי</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * דוגמאות שימוש:
 * 
 * // יורשים
 * <RepeatableFieldGroup
 *   groupName="רשימת יורשים"
 *   fields={[
 *     { id: '1', name: 'שם_יורש', type: 'text', placeholder: 'שם מלא' },
 *     { id: '2', name: 'תעודת_זהות', type: 'id-number', placeholder: '123456789' },
 *     { id: '3', name: 'חלק_בירושה', type: 'number', placeholder: '50%' },
 *   ]}
 *   minRows={1}
 *   maxRows={20}
 *   onChange={(data) => console.log(data)}
 * />
 * 
 * // נכסים
 * <RepeatableFieldGroup
 *   groupName="רשימת נכסים"
 *   fields={[
 *     { id: '1', name: 'סוג_נכס', type: 'text', placeholder: 'דירה/מגרש/חשבון' },
 *     { id: '2', name: 'כתובת', type: 'text', placeholder: 'רחוב עיר' },
 *     { id: '3', name: 'שווי', type: 'number', placeholder: '1000000' },
 *   ]}
 *   minRows={1}
 *   maxRows={50}
 *   onChange={(data) => console.log(data)}
 * />
 * 
 * // חשבונות בנק
 * <RepeatableFieldGroup
 *   groupName="רשימת חשבונות בנק"
 *   fields={[
 *     { id: '1', name: 'שם_בנק', type: 'text', placeholder: 'בנק הפועלים' },
 *     { id: '2', name: 'מספר_חשבון', type: 'number', placeholder: '123456' },
 *     { id: '3', name: 'מספר_סניף', type: 'number', placeholder: '789' },
 *   ]}
 *   minRows={1}
 *   maxRows={10}
 *   onChange={(data) => console.log(data)}
 * />
 */
