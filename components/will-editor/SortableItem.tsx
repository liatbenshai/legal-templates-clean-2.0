'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { InheritanceTableEditor } from './InheritanceTableEditor';
import type { WillItem } from '@/lib/types/will-document';

interface Props {
  item: WillItem;
  onRemove?: () => void;
  onUpdate?: (heirs: any[]) => void;
}

export function SortableItem({ item, onRemove, onUpdate }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
    id: item.id 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white border rounded-lg p-4 mb-3 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* ידית גרירה */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>

        {/* תוכן הפריט */}
        <div className="flex-1">
          {item.type === 'table' ? (
            <InheritanceTableEditor
              table={item}
              onUpdate={onUpdate!}
            />
          ) : (
            <div>
              <div className="font-semibold text-gray-900 mb-2">
                {item.isDefault ? '🔷 ' : ''}
                סעיף {item.id}
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {item.content.substring(0, 150)}...
              </div>
            </div>
          )}
        </div>

        {/* כפתור מחיקה (רק לטבלאות) */}
        {item.type === 'table' && onRemove && (
          <button
            onClick={onRemove}
            className="p-2 hover:bg-red-50 rounded text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
