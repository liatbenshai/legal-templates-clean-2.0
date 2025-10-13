'use client';

import { useState, useCallback } from 'react';
import { DocumentStructure, ContentBlock, BlockType } from '@/lib/editor-types';
import { defaultPageSettings, defaultDocumentStyles } from '@/lib/document-templates';
import EditorToolbar from './EditorToolbar';
import EditorBlock from './EditorBlock';
import { Plus } from 'lucide-react';

interface TemplateEditorProps {
  initialDocument?: DocumentStructure;
  onSave?: (document: DocumentStructure) => void;
  onPreview?: (document: DocumentStructure) => void;
  onExport?: (document: DocumentStructure) => void;
}

export default function TemplateEditor({
  initialDocument,
  onSave,
  onPreview,
  onExport,
}: TemplateEditorProps) {
  const [document, setDocument] = useState<DocumentStructure>(
    initialDocument || {
      id: `doc-${Date.now()}`,
      title: 'מסמך חדש',
      blocks: [
        {
          id: `block-${Date.now()}`,
          type: 'paragraph',
          content: '',
          style: defaultDocumentStyles.paragraph,
        },
      ],
      pageSettings: defaultPageSettings,
      styles: defaultDocumentStyles,
      metadata: {
        author: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0',
        language: 'he',
      },
    }
  );

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [history, setHistory] = useState<DocumentStructure[]>([document]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // שמירה בהיסטוריה
  const saveToHistory = useCallback((newDoc: DocumentStructure) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newDoc);
      return newHistory.slice(-50); // שמור רק 50 צעדים אחרונים
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // ביטול
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setDocument(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // ביצוע מחדש
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setDocument(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // הוספת בלוק
  const addBlock = useCallback((type: BlockType, position?: number) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random()}`,
      type,
      content: type === 'table' 
        ? {
            rows: [
              {
                id: `row-1`,
                isHeader: true,
                cells: [
                  { id: 'cell-1-1', content: 'כותרת 1', style: { bold: true, textAlign: 'center' }, backgroundColor: '#f3f4f6' },
                  { id: 'cell-1-2', content: 'כותרת 2', style: { bold: true, textAlign: 'center' }, backgroundColor: '#f3f4f6' },
                ],
              },
              {
                id: `row-2`,
                cells: [
                  { id: 'cell-2-1', content: '', style: { textAlign: 'right' } },
                  { id: 'cell-2-2', content: '', style: { textAlign: 'right' } },
                ],
              },
            ],
            columnWidths: [50, 50],
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000000',
            cellPadding: 8,
            headerRow: true,
          }
        : '',
      style: document.styles.paragraph,
    };

    setDocument((prev) => {
      const newBlocks = [...prev.blocks];
      const insertPos = position !== undefined ? position : newBlocks.length;
      newBlocks.splice(insertPos, 0, newBlock);
      
      const newDoc = {
        ...prev,
        blocks: newBlocks,
        metadata: {
          ...prev.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
      
      saveToHistory(newDoc);
      return newDoc;
    });

    setSelectedBlockId(newBlock.id);
  }, [document.styles, saveToHistory]);

  // עדכון בלוק
  const updateBlock = useCallback((blockId: string, updates: Partial<ContentBlock>) => {
    setDocument((prev) => {
      const newBlocks = prev.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );
      
      const newDoc = {
        ...prev,
        blocks: newBlocks,
        metadata: {
          ...prev.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
      
      saveToHistory(newDoc);
      return newDoc;
    });
  }, [saveToHistory]);

  // מחיקת בלוק
  const deleteBlock = useCallback((blockId: string) => {
    setDocument((prev) => {
      const newBlocks = prev.blocks.filter((block) => block.id !== blockId);
      
      // אם אין בלוקים, הוסף בלוק ריק
      if (newBlocks.length === 0) {
        newBlocks.push({
          id: `block-${Date.now()}`,
          type: 'paragraph',
          content: '',
          style: prev.styles.paragraph,
        });
      }
      
      const newDoc = {
        ...prev,
        blocks: newBlocks,
        metadata: {
          ...prev.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
      
      saveToHistory(newDoc);
      return newDoc;
    });

    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId, saveToHistory]);

  // העברת בלוק
  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    setDocument((prev) => {
      const blockIndex = prev.blocks.findIndex((b) => b.id === blockId);
      if (blockIndex === -1) return prev;

      const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
      if (newIndex < 0 || newIndex >= prev.blocks.length) return prev;

      const newBlocks = [...prev.blocks];
      [newBlocks[blockIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[blockIndex]];

      const newDoc = {
        ...prev,
        blocks: newBlocks,
        metadata: {
          ...prev.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
      
      saveToHistory(newDoc);
      return newDoc;
    });
  }, [saveToHistory]);

  // עיצוב טקסט
  const formatText = useCallback((format: string) => {
    if (!selectedBlockId) return;

    const updates: Partial<ContentBlock> = {};

    switch (format) {
      case 'bold':
        updates.style = {
          ...document.blocks.find((b) => b.id === selectedBlockId)?.style,
          bold: !document.blocks.find((b) => b.id === selectedBlockId)?.style?.bold,
        };
        break;
      case 'italic':
        updates.style = {
          ...document.blocks.find((b) => b.id === selectedBlockId)?.style,
          italic: !document.blocks.find((b) => b.id === selectedBlockId)?.style?.italic,
        };
        break;
      case 'underline':
        updates.style = {
          ...document.blocks.find((b) => b.id === selectedBlockId)?.style,
          underline: !document.blocks.find((b) => b.id === selectedBlockId)?.style?.underline,
        };
        break;
      case 'align-right':
        updates.style = {
          ...document.blocks.find((b) => b.id === selectedBlockId)?.style,
          textAlign: 'right',
        };
        break;
      case 'align-center':
        updates.style = {
          ...document.blocks.find((b) => b.id === selectedBlockId)?.style,
          textAlign: 'center',
        };
        break;
      case 'align-left':
        updates.style = {
          ...document.blocks.find((b) => b.id === selectedBlockId)?.style,
          textAlign: 'left',
        };
        break;
      case 'align-justify':
        updates.style = {
          ...document.blocks.find((b) => b.id === selectedBlockId)?.style,
          textAlign: 'justify',
        };
        break;
    }

    if (Object.keys(updates).length > 0) {
      updateBlock(selectedBlockId, updates);
    }
  }, [selectedBlockId, document.blocks, updateBlock]);

  return (
    <div className="flex flex-col h-screen bg-gray-100" dir="rtl">
      {/* סרגל כלים */}
      <EditorToolbar
        onFormatText={formatText}
        onInsertElement={(type) => addBlock(type as BlockType)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={() => onSave?.(document)}
        onPreview={() => onPreview?.(document)}
        onExport={() => onExport?.(document)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* אזור העריכה */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm]" style={{ padding: '2.5cm 2cm' }}>
          {/* כותרת מסמך */}
          <div className="mb-8 pb-4 border-b-2 border-gray-200">
            <input
              type="text"
              value={document.title}
              onChange={(e) =>
                setDocument((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-2xl font-bold w-full outline-none border-none focus:ring-0 text-right"
              placeholder="כותרת המסמך"
              dir="rtl"
            />
          </div>

          {/* בלוקים */}
          <div className="space-y-0">
            {document.blocks.map((block, index) => (
              <EditorBlock
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => setSelectedBlockId(block.id)}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onDelete={() => deleteBlock(block.id)}
                onMoveUp={() => moveBlock(block.id, 'up')}
                onMoveDown={() => moveBlock(block.id, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < document.blocks.length - 1}
              />
            ))}
          </div>

          {/* כפתור הוספת בלוק */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => addBlock('paragraph')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              <span>הוסף בלוק</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

