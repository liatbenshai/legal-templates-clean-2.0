'use client';

import { Plus, Trash2 } from 'lucide-react';

interface TableBuilderProps {
  table: any;
  fields: any[];
  onChange: (table: any) => void;
}

export default function TableBuilder({ table, fields, onChange }: TableBuilderProps) {
  const rows = table?.rows || [];

  const addRow = () => {
    const columnCount = rows[0]?.cells?.length || 2;
    const newRow = {
      id: `row-${Date.now()}`,
      cells: Array(columnCount).fill(null).map((_, i) => ({
        id: `cell-${Date.now()}-${i}`,
        content: '',
      })),
    };
    onChange({ ...table, rows: [...rows, newRow] });
  };

  const addColumn = () => {
    const newRows = rows.map((row: any) => ({
      ...row,
      cells: [...row.cells, { id: `cell-${Date.now()}`, content: '' }],
    }));
    onChange({ ...table, rows: newRows });
  };

  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) {
      alert('חייבת להישאר לפחות שורה אחת');
      return;
    }
    const newRows = rows.filter((_: any, i: number) => i !== rowIndex);
    onChange({ ...table, rows: newRows });
  };

  const removeColumn = (colIndex: number) => {
    if (rows[0]?.cells?.length <= 1) {
      alert('חייבת להישאר לפחות עמודה אחת');
      return;
    }
    const newRows = rows.map((row: any) => ({
      ...row,
      cells: row.cells.filter((_: any, i: number) => i !== colIndex),
    }));
    onChange({ ...table, rows: newRows });
  };

  const updateCell = (rowIndex: number, cellIndex: number, content: string) => {
    const newRows = [...rows];
    newRows[rowIndex].cells[cellIndex].content = content;
    onChange({ ...table, rows: newRows });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            {rows.map((row: any, rowIndex: number) => (
              <tr key={row.id}>
                {row.cells.map((cell: any, cellIndex: number) => (
                  <td key={cell.id} className="border border-gray-300 p-0">
                    <input
                      type="text"
                      value={cell.content}
                      onChange={(e) => updateCell(rowIndex, cellIndex, e.target.value)}
                      placeholder={`תא ${rowIndex + 1},${cellIndex + 1}`}
                      className="w-full px-2 py-2 focus:bg-blue-50"
                      style={{ minWidth: '100px' }}
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="מחק שורה"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              {rows[0]?.cells.map((_: any, colIndex: number) => (
                <td key={colIndex} className="p-1 text-center">
                  <button
                    onClick={() => removeColumn(colIndex)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded text-xs"
                    title="מחק עמודה"
                  >
                    <Trash2 className="w-3 h-3 mx-auto" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          onClick={addRow}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">הוסף שורה</span>
        </button>
        <button
          onClick={addColumn}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">הוסף עמודה</span>
        </button>
      </div>

      {/* עיצוב טבלה */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h5 className="font-medium text-gray-900">עיצוב טבלה</h5>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">עובי מסגרת</label>
            <input
              type="number"
              value={table.borderWidth || 1}
              onChange={(e) => onChange({ ...table, borderWidth: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
              max="5"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">ריפוד תא</label>
            <input
              type="number"
              value={table.cellPadding || 8}
              onChange={(e) => onChange({ ...table, cellPadding: parseInt(e.target.value) || 8 })}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
              max="20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600">צבע מסגרת</label>
          <input
            type="color"
            value={table.borderColor || '#000000'}
            onChange={(e) => onChange({ ...table, borderColor: e.target.value })}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* הוספת שדות לטבלה */}
      {fields.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-800 mb-2">💡 הוסף שדות לתאים:</p>
          <div className="flex flex-wrap gap-1">
            {fields.map((field: any) => {
              const fieldName = field.label.replace(/\s+/g, '-');
              return (
                <span
                  key={field.id}
                  className="px-2 py-1 text-xs bg-white border border-blue-200 rounded cursor-help"
                  title={`העתק: {{${fieldName}}}`}
                >
                  {field.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

