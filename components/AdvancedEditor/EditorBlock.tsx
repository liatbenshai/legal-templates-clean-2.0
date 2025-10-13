'use client';

import { ContentBlock, BlockType } from '@/lib/editor-types';
import { GripVertical, Trash2, ChevronUp, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';

interface EditorBlockProps {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export default function EditorBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: EditorBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getBlockTypeLabel = (type: BlockType): string => {
    const labels: Record<BlockType, string> = {
      'paragraph': 'פסקה',
      'heading1': 'כותרת 1',
      'heading2': 'כותרת 2',
      'heading3': 'כותרת 3',
      'heading4': 'כותרת 4',
      'bullet-list': 'רשימה עם תבליטים',
      'numbered-list': 'רשימה ממוספרת',
      'table': 'טבלה',
      'signature-block': 'בלוק חתימה',
      'date-block': 'בלוק תאריך',
      'page-break': 'מעבר עמוד',
      'horizontal-rule': 'קו הפרדה',
      'indented-text': 'טקסט מוזח',
      'blockquote': 'ציטוט',
      'legal-section': 'סעיף משפטי',
    };
    return labels[type] || type;
  };

  const renderContent = () => {
    const content = typeof block.content === 'string' ? block.content : '';
    
    const baseStyle = {
      fontSize: block.style?.fontSize ? `${block.style.fontSize}pt` : undefined,
      fontWeight: block.style?.bold ? 'bold' : undefined,
      fontStyle: block.style?.italic ? 'italic' : undefined,
      textDecoration: block.style?.underline ? 'underline' : undefined,
      textAlign: (block.style?.textAlign || 'right') as any,
      lineHeight: block.style?.lineHeight || 1.5,
      color: block.style?.color || undefined,
      backgroundColor: block.style?.backgroundColor || undefined,
      paddingRight: block.metadata?.indent ? `${block.metadata.indent * 20}px` : undefined,
      marginTop: block.metadata?.marginTop ? `${block.metadata.marginTop}px` : undefined,
      marginBottom: block.metadata?.marginBottom ? `${block.metadata.marginBottom}px` : undefined,
    };

    switch (block.type) {
      case 'heading1':
        return (
          <h1
            style={{ ...baseStyle, fontSize: '18pt', fontWeight: 'bold' }}
            className="outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
            dir="rtl"
          >
            {content}
          </h1>
        );

      case 'heading2':
        return (
          <h2
            style={{ ...baseStyle, fontSize: '16pt', fontWeight: 'bold' }}
            className="outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
            dir="rtl"
          >
            {content}
          </h2>
        );

      case 'heading3':
        return (
          <h3
            style={{ ...baseStyle, fontSize: '14pt', fontWeight: 'bold' }}
            className="outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
            dir="rtl"
          >
            {content}
          </h3>
        );

      case 'heading4':
        return (
          <h4
            style={{ ...baseStyle, fontSize: '12pt', fontWeight: 'bold', textDecoration: 'underline' }}
            className="outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
            dir="rtl"
          >
            {content}
          </h4>
        );

      case 'horizontal-rule':
        return (
          <hr className="border-t-2 border-gray-800 my-4" />
        );

      case 'page-break':
        return (
          <div className="border-t-4 border-dashed border-blue-500 my-8 relative">
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-blue-600 font-medium">
              מעבר עמוד
            </span>
          </div>
        );

      case 'legal-section':
        return (
          <div
            style={{ ...baseStyle, fontWeight: 'bold', textDecoration: 'underline' }}
            className="outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
            dir="rtl"
          >
            {content}
          </div>
        );

      case 'blockquote':
        return (
          <blockquote
            style={{ ...baseStyle, borderRight: '4px solid #3b82f6', paddingRight: '16px' }}
            className="outline-none italic text-gray-700 bg-blue-50 p-4 rounded"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
            dir="rtl"
          >
            {content}
          </blockquote>
        );

      case 'bullet-list':
        return (
          <ul className="list-disc pr-8" style={baseStyle} dir="rtl">
            {content.split('\n').filter(line => line.trim()).map((line, idx) => (
              <li key={idx} className="mb-2">
                {line}
              </li>
            ))}
          </ul>
        );

      case 'numbered-list':
        return (
          <ol className="list-decimal pr-8" style={baseStyle} dir="rtl">
            {content.split('\n').filter(line => line.trim()).map((line, idx) => (
              <li key={idx} className="mb-2">
                {line}
              </li>
            ))}
          </ol>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-800" dir="rtl">
              <tbody>
                {typeof block.content === 'object' && 'rows' in block.content
                  ? block.content.rows.map((row, rowIdx) => (
                      <tr key={row.id}>
                        {row.cells.map((cell, cellIdx) => {
                          const CellTag = row.isHeader ? 'th' : 'td';
                          return (
                            <CellTag
                              key={cell.id}
                              className="border border-gray-800 p-3 outline-none"
                              style={{
                                backgroundColor: cell.backgroundColor || (row.isHeader ? '#f3f4f6' : 'white'),
                                fontWeight: cell.style?.bold || row.isHeader ? 'bold' : 'normal',
                                textAlign: cell.style?.textAlign || 'right',
                              }}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                // עדכון תוכן התא
                                if (typeof block.content === 'object' && 'rows' in block.content) {
                                  const newContent = { ...block.content };
                                  newContent.rows[rowIdx].cells[cellIdx].content = e.currentTarget.textContent || '';
                                  onUpdate({ content: newContent });
                                }
                              }}
                              dir="rtl"
                            >
                              {cell.content}
                            </CellTag>
                          );
                        })}
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <p
            style={baseStyle}
            className="outline-none min-h-[1.5em]"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
            dir="rtl"
          >
            {content || 'הקלד כאן...'}
          </p>
        );
    }
  };

  return (
    <div
      className={`group relative transition-all ${
        isSelected ? 'ring-2 ring-primary bg-blue-50' : ''
      } ${isHovered ? 'bg-gray-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* כלים */}
      {(isHovered || isSelected) && (
        <div className="absolute left-0 top-0 flex items-center gap-1 bg-white border border-gray-300 rounded-lg shadow-lg p-1 z-10 -translate-x-full -mr-2">
          {/* גרירה */}
          <button className="p-1 text-gray-500 hover:text-gray-700 cursor-move">
            <GripVertical className="w-4 h-4" />
          </button>

          {/* העלה */}
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            title="העלה"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* הורד */}
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            title="הורד"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* הגדרות */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="הגדרות"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* מחיקה */}
          <button
            onClick={onDelete}
            className="p-1 text-red-500 hover:text-red-700"
            title="מחק"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* תווית סוג */}
      {isSelected && (
        <div className="absolute right-0 top-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg">
          {getBlockTypeLabel(block.type)}
        </div>
      )}

      {/* תוכן הבלוק */}
      <div className="p-4">
        {renderContent()}
      </div>

      {/* פאנל הגדרות */}
      {showSettings && isSelected && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="font-semibold text-sm text-gray-900 mb-3">הגדרות בלוק</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* גודל גופן */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">גודל גופן</label>
              <input
                type="number"
                value={block.style?.fontSize || 12}
                onChange={(e) =>
                  onUpdate({
                    style: { ...block.style, fontSize: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                min="8"
                max="72"
              />
            </div>

            {/* גובה שורה */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">גובה שורה</label>
              <input
                type="number"
                step="0.1"
                value={block.style?.lineHeight || 1.5}
                onChange={(e) =>
                  onUpdate({
                    style: { ...block.style, lineHeight: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                min="0.5"
                max="3"
              />
            </div>

            {/* מרווח עליון */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">מרווח עליון (px)</label>
              <input
                type="number"
                value={block.metadata?.marginTop || 0}
                onChange={(e) =>
                  onUpdate({
                    metadata: { ...block.metadata, marginTop: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                min="0"
                max="100"
              />
            </div>

            {/* מרווח תחתון */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">מרווח תחתון (px)</label>
              <input
                type="number"
                value={block.metadata?.marginBottom || 0}
                onChange={(e) =>
                  onUpdate({
                    metadata: { ...block.metadata, marginBottom: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                min="0"
                max="100"
              />
            </div>

            {/* הזחה */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">רמת הזחה</label>
              <input
                type="number"
                value={block.metadata?.indent || 0}
                onChange={(e) =>
                  onUpdate({
                    metadata: { ...block.metadata, indent: Number(e.target.value) },
                  })
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                min="0"
                max="5"
              />
            </div>

            {/* צבע טקסט */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">צבע טקסט</label>
              <input
                type="color"
                value={block.style?.color || '#000000'}
                onChange={(e) =>
                  onUpdate({
                    style: { ...block.style, color: e.target.value },
                  })
                }
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

