'use client';

import { useState } from 'react';
import { Plus, ArrowRight, Settings, GripVertical, Trash2, Copy, Type, Table, List as ListIcon, Image as ImageIcon, Ruler, Eye } from 'lucide-react';
import StylePanel from './StylePanel';
import TableBuilder from './TableBuilder';
import PageSettingsPanel from './PageSettingsPanel';

interface BlockEditorProps {
  blocks: any[];
  fields: any[];
  pageSettings: any;
  styles: any;
  onChange: (blocks: any[]) => void;
  onPageSettingsChange: (settings: any) => void;
  onStylesChange: (styles: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BlockEditor({
  blocks,
  fields,
  pageSettings,
  styles,
  onChange,
  onPageSettingsChange,
  onStylesChange,
  onNext,
  onBack
}: BlockEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);

  const blockTypes = [
    { type: 'heading1', label: 'כותרת ראשית', icon: Type, example: 'כותרת גדולה' },
    { type: 'heading2', label: 'כותרת משנית', icon: Type, example: 'כותרת בינונית' },
    { type: 'heading3', label: 'כותרת קטנה', icon: Type, example: 'כותרת קטנה' },
    { type: 'paragraph', label: 'פסקה', icon: Type, example: 'פסקת טקסט רגילה' },
    { type: 'table', label: 'טבלה', icon: Table, example: 'טבלה 2x2' },
    { type: 'numbered-list', label: 'רשימה ממוספרת', icon: ListIcon, example: '1. פריט ראשון' },
    { type: 'bullet-list', label: 'רשימה מנוקדת', icon: ListIcon, example: '• פריט' },
    { type: 'horizontal-rule', label: 'קו הפרדה', icon: Ruler, example: '────────' },
    { type: 'page-break', label: 'מעבר עמוד', icon: Ruler, example: '--- עמוד חדש ---' },
    { type: 'signature', label: 'בלוק חתימה', icon: Type, example: 'בכבוד רב, ____' },
  ];

  const addBlock = (type: string) => {
    const newBlock: any = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      style: {},
      metadata: {},
    };

    // תוכן ברירת מחדל לפי סוג
    switch (type) {
      case 'heading1':
        newBlock.content = 'כותרת ראשית';
        newBlock.style = { fontSize: 18, bold: true, textAlign: 'center' };
        break;
      case 'heading2':
        newBlock.content = 'כותרת משנה';
        newBlock.style = { fontSize: 16, bold: true, textAlign: 'right' };
        break;
      case 'heading3':
        newBlock.content = 'כותרת קטנה';
        newBlock.style = { fontSize: 14, bold: true, textAlign: 'right' };
        break;
      case 'paragraph':
        newBlock.content = 'כתוב כאן את הטקסט...';
        newBlock.style = { fontSize: 12, textAlign: 'justify' };
        break;
      case 'table':
        newBlock.content = {
          rows: [
            { id: 'row-1', cells: [
              { id: 'cell-1-1', content: 'עמודה 1' },
              { id: 'cell-1-2', content: 'עמודה 2' }
            ]},
            { id: 'row-2', cells: [
              { id: 'cell-2-1', content: '' },
              { id: 'cell-2-2', content: '' }
            ]},
          ],
          borderStyle: 'solid',
          borderWidth: 1,
        };
        break;
      case 'numbered-list':
      case 'bullet-list':
        newBlock.content = ['פריט ראשון', 'פריט שני'];
        newBlock.metadata = { listStyle: type === 'numbered-list' ? 'decimal' : 'disc' };
        break;
      case 'signature':
        newBlock.content = '{{תאריך}}\n\nבכבוד רב,\n{{שם-חותם}}';
        newBlock.style = { textAlign: 'right' };
        break;
    }

    onChange([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setShowAddMenu(false);
  };

  const updateBlock = (id: string, updates: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    if (confirm('האם למחוק את הבלוק?')) {
      onChange(blocks.filter(b => b.id !== id));
      if (selectedBlockId === id) setSelectedBlockId(null);
    }
  };

  const duplicateBlock = (block: any) => {
    const duplicate = {
      ...block,
      id: `block-${Date.now()}`,
    };
    const index = blocks.findIndex(b => b.id === block.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicate);
    onChange(newBlocks);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex h-[calc(100vh-300px)]">
      {/* עמודה שמאלית - תצוגת בלוקים */}
      <div className="flex-1 p-6 overflow-y-auto border-l">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">בניית המסמך</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPageSettings(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <Settings className="w-4 h-4" />
              <span>הגדרות עמוד</span>
            </button>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>הוסף בלוק</span>
            </button>
          </div>
        </div>

        {/* תפריט הוספת בלוקים */}
        {showAddMenu && (
          <div className="mb-6 bg-white border-2 border-green-500 rounded-lg p-4 shadow-lg">
            <h4 className="font-bold text-gray-900 mb-3">בחר סוג בלוק להוספה:</h4>
            <div className="grid grid-cols-2 gap-2">
              {blockTypes.map(bt => {
                const Icon = bt.icon;
                return (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="flex items-center gap-3 p-3 text-right border rounded-lg hover:bg-blue-50 hover:border-primary transition"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{bt.label}</div>
                      <div className="text-xs text-gray-500">{bt.example}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* רשימת בלוקים */}
        {blocks.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <Type className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-600 mb-2">המסמך ריק</p>
            <p className="text-sm text-gray-500 mb-4">התחל להוסיף בלוקים לבניית המסמך</p>
            <button
              onClick={() => setShowAddMenu(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
            >
              הוסף בלוק ראשון
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`group flex items-start gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${
                  selectedBlockId === block.id
                    ? 'border-primary bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <button className="cursor-move p-1 text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-1">{getBlockTypeLabel(block.type)}</div>
                  <BlockPreview block={block} />
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                    disabled={index === 0}
                    className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-20"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateBlock(block); }}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-20"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* עמודה ימנית - עריכת בלוק נבחר */}
      <div className="w-96 bg-gray-50 p-6 overflow-y-auto border-r">
        {selectedBlock ? (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">עריכת בלוק</h3>
            
            <BlockContentEditor
              block={selectedBlock}
              fields={fields}
              onUpdate={(updates: any) => updateBlock(selectedBlock.id, updates)}
            />
            
            <StylePanel
              block={selectedBlock}
              onUpdate={(style: any) => updateBlock(selectedBlock.id, { style })}
            />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>בחר בלוק לעריכה</p>
            <p className="text-sm mt-2">לחץ על בלוק מהרשימה</p>
          </div>
        )}
      </div>

      {/* הגדרות עמוד */}
      {showPageSettings && (
        <PageSettingsPanel
          settings={pageSettings}
          styles={styles}
          onChange={onPageSettingsChange}
          onStylesChange={onStylesChange}
          onClose={() => setShowPageSettings(false)}
        />
      )}

      {/* כפתורי ניווט */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-6 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← חזור
        </button>
        <button
          onClick={onNext}
          disabled={blocks.length === 0}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-lg shadow-lg"
        >
          <span>תצוגה מקדימה ושמירה</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// עורך תוכן בלוק
function BlockContentEditor({ block, fields, onUpdate }: any) {
  if (block.type === 'table') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          עריכת טבלה
        </label>
        <TableBuilder
          table={block.content}
          fields={fields}
          onChange={(content) => onUpdate({ content })}
        />
      </div>
    );
  }

  if (block.type === 'numbered-list' || block.type === 'bullet-list') {
    const items = Array.isArray(block.content) ? block.content : [];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          פריטי הרשימה
        </label>
        <div className="space-y-2">
          {items.map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = e.target.value;
                  onUpdate({ content: newItems });
                }}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder={`פריט ${index + 1}`}
              />
              <button
                onClick={() => {
                  const newItems = items.filter((_: any, i: number) => i !== index);
                  onUpdate({ content: newItems });
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate({ content: [...items, 'פריט חדש'] })}
            className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition text-sm text-gray-600"
          >
            + הוסף פריט
          </button>
        </div>
      </div>
    );
  }

  // עבור טקסט רגיל
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        תוכן הבלוק
      </label>
      <textarea
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="כתוב את התוכן כאן...
        
השתמש ב-{{שם-שדה}} להכנסת שדות דינמיים"
        rows={6}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        style={{ direction: 'rtl', textAlign: 'right' }}
      />
      
      {/* כפתורי שדות */}
      {fields.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 mb-2">הוסף שדה:</p>
          <div className="flex flex-wrap gap-1">
            {fields.map((field: any) => {
              const fieldName = field.label.replace(/\s+/g, '-');
              return (
                <button
                  key={field.id}
                  onClick={() => {
                    const newContent = (block.content || '') + `{{${fieldName}}}`;
                    onUpdate({ content: newContent });
                  }}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  title={field.label}
                >
                  {field.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// תצוגה מקדימה של בלוק
function BlockPreview({ block }: any) {
  const style: any = {
    fontSize: block.style?.fontSize ? `${block.style.fontSize}px` : undefined,
    fontWeight: block.style?.bold ? 'bold' : undefined,
    textDecoration: block.style?.underline ? 'underline' : undefined,
    textAlign: block.style?.textAlign || 'right',
    fontStyle: block.style?.italic ? 'italic' : undefined,
    color: block.style?.color,
  };

  if (block.type === 'horizontal-rule') {
    return <hr className="my-2 border-gray-300" />;
  }

  if (block.type === 'page-break') {
    return (
      <div className="text-center text-xs text-gray-400 py-2 border-y border-dashed">
        --- מעבר עמוד ---
      </div>
    );
  }

  if (block.type === 'table') {
    return <div className="text-xs text-gray-500">📊 טבלה ({block.content?.rows?.length || 0} שורות)</div>;
  }

  if (Array.isArray(block.content)) {
    return (
      <ul className={block.metadata?.listStyle === 'decimal' ? 'list-decimal' : 'list-disc'} style={{ marginRight: '20px' }}>
        {block.content.slice(0, 2).map((item: string, i: number) => (
          <li key={i} className="text-sm text-gray-700">{item}</li>
        ))}
        {block.content.length > 2 && <li className="text-xs text-gray-400">...עוד {block.content.length - 2}</li>}
      </ul>
    );
  }

  return (
    <div style={style} className="text-sm text-gray-700 truncate">
      {block.content || <span className="text-gray-400">ריק</span>}
    </div>
  );
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

