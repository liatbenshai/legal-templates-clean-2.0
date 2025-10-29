'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { InheritanceTable } from '@/lib/types/will-document';

interface Props {
  table: InheritanceTable;
  onUpdate: (heirs: any[]) => void;
}

export function InheritanceTableEditor({ table, onUpdate }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const addHeir = () => {
    onUpdate([
      ...table.heirs,
      { name: '', id: '', relationship: '', percentage: 0 }
    ]);
  };

  const removeHeir = (index: number) => {
    onUpdate(table.heirs.filter((_, i) => i !== index));
  };

  const updateHeir = (index: number, field: string, value: any) => {
    const updated = [...table.heirs];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  return (
    <div className="w-full">
      {/* כותרת עם לייבל פנימי */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-semibold text-lg">📊 {table.label}</h3>
          <p className="text-sm text-gray-500">
            {table.heirs.length} יורשים
          </p>
        </div>
        <button className="text-blue-600 hover:text-blue-800">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* תוכן הטבלה (מתרחב) */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {table.heirs.map((heir, index) => (
            <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded">
              <input
                type="text"
                placeholder="שם יורש"
                value={heir.name}
                onChange={(e) => updateHeir(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="ת.ז."
                value={heir.id}
                onChange={(e) => updateHeir(index, 'id', e.target.value)}
                className="w-32 px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="קרבה"
                value={heir.relationship}
                onChange={(e) => updateHeir(index, 'relationship', e.target.value)}
                className="w-32 px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="%"
                value={heir.percentage}
                onChange={(e) => updateHeir(index, 'percentage', parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-2 border rounded"
              />
              <button
                onClick={() => removeHeir(index)}
                className="p-2 hover:bg-red-100 rounded text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={addHeir}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            הוסף יורש
          </button>
        </div>
      )}
    </div>
  );
}
