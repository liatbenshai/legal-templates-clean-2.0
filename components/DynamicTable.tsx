'use client';

import { useState } from 'react';
import { Plus, Trash2, Copy, Settings } from 'lucide-react';

/**
 * טבלה דינמית גמישה לחלוטין
 * המשתמש בוחר את העמודות, הסוגים, והתוכן
 */

export type ColumnType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'id-number';

export interface TableColumn {
  id: string;
  name: string;
  type: ColumnType;
  width?: number;
  required?: boolean;
  options?: string[]; // for select type
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

interface DynamicTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  onChange: (rows: TableRow[]) => void;
  onColumnsChange?: (columns: TableColumn[]) => void;
  minRows?: number;
  maxRows?: number;
  showColumnConfig?: boolean;
  title?: string;
}

export default function DynamicTable({
  columns,
  rows,
  onChange,
  onColumnsChange,
  minRows = 0,
  maxRows = 100,
  showColumnConfig = false,
  title
}: DynamicTableProps) {
  const [showConfig, setShowConfig] = useState(false);

  const addRow = () => {
    if (rows.length < maxRows) {
      const newRow: TableRow = { id: `row-${Date.now()}` };
      columns.forEach(col => {
        newRow[col.id] = col.type === 'checkbox' ? false : '';
      });
      onChange([...rows, newRow]);
    }
  };

  const removeRow = (index: number) => {
    if (rows.length > minRows) {
      onChange(rows.filter((_, i) => i !== index));
    }
  };

  const duplicateRow = (index: number) => {
    if (rows.length < maxRows) {
      const rowToDup = { ...rows[index], id: `row-${Date.now()}` };
      const newRows = [...rows];
      newRows.splice(index + 1, 0, rowToDup);
      onChange(newRows);
    }
  };

  const updateCell = (rowIndex: number, columnId: string, value: any) => {
    const newRows = [...rows];
    newRows[rowIndex][columnId] = value;
    onChange(newRows);
  };

  const renderCell = (row: TableRow, column: TableColumn, rowIndex: number) => {
    const value = row[column.id];

    switch (column.type) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => updateCell(rowIndex, column.id, e.target.checked)}
            className="w-5 h-5 text-primary rounded"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => updateCell(rowIndex, column.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
            dir="rtl"
          >
            <option value="">בחר...</option>
            {column.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => updateCell(rowIndex, column.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
          />
        );

      case 'number':
      case 'id-number':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateCell(rowIndex, column.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
            dir={column.type === 'id-number' ? 'ltr' : 'rtl'}
            maxLength={column.type === 'id-number' ? 9 : undefined}
          />
        );

      default: // text
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateCell(rowIndex, column.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* כותרת וכפתורים */}
      <div className="flex items-center justify-between">
        {title && (
          <h3 className="text-lg font-bold text-gray-900">
            {title}
            <span className="text-sm font-normal text-gray-500 mr-2">
              ({rows.length} שורות)
            </span>
          </h3>
        )}
        <div className="flex gap-2">
          {showColumnConfig && onColumnsChange && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>הגדר עמודות</span>
            </button>
          )}
          <button
            onClick={addRow}
            disabled={rows.length >= maxRows}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>הוסף שורה</span>
          </button>
        </div>
      </div>

      {/* טבלה */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse bg-white" dir="rtl">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="p-3 text-center font-bold text-gray-900 border-l border-gray-300 w-16">
                #
              </th>
              {columns.map(col => (
                <th
                  key={col.id}
                  className="p-3 text-right font-bold text-gray-900 border-l border-gray-300"
                  style={{ width: col.width ? `${col.width}px` : 'auto', fontFamily: 'David' }}
                >
                  {col.name}
                  {col.required && <span className="text-red-500 mr-1">*</span>}
                </th>
              ))}
              <th className="p-3 text-center font-bold text-gray-900 w-24">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="p-8 text-center text-gray-500">
                  <p className="mb-3">לא הוספת שורות עדיין</p>
                  <button
                    onClick={addRow}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    הוסף שורה ראשונה
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  {/* מספר שורה */}
                  <td className="p-3 text-center font-medium text-gray-600 border-l border-gray-200">
                    {rowIndex + 1}
                  </td>

                  {/* תאים */}
                  {columns.map(col => (
                    <td key={col.id} className="p-2 border-l border-gray-200">
                      {renderCell(row, col, rowIndex)}
                    </td>
                  ))}

                  {/* פעולות */}
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => duplicateRow(rowIndex)}
                        disabled={rows.length >= maxRows}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30"
                        title="שכפל"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeRow(rowIndex)}
                        disabled={rows.length <= minRows}
                        className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                        title="מחק"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* סטטוס */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div>
          {rows.length}/{maxRows} שורות
        </div>
        {minRows > 0 && rows.length < minRows && (
          <div className="text-amber-600">
            מינימום {minRows} שורות נדרש
          </div>
        )}
      </div>
    </div>
  );
}
