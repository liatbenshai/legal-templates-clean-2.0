'use client';

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import type { WillItem } from '@/lib/types/will-document';

interface Props {
  items: WillItem[];
  onReorder: (items: WillItem[]) => void;
  onRemoveTable: (tableId: string) => void;
  onUpdateTable: (tableId: string, heirs: any[]) => void;
}

export function DraggableItems({ items, onReorder, onRemoveTable, onUpdateTable }: Props) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableItem
            key={item.id}
            item={item}
            onRemove={item.type === 'table' ? () => onRemoveTable(item.id) : undefined}
            onUpdate={item.type === 'table' ? (heirs) => onUpdateTable(item.id, heirs) : undefined}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
