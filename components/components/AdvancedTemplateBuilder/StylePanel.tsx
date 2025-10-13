'use client';

import { Palette, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface StylePanelProps {
  block: any;
  onUpdate: (style: any) => void;
}

export default function StylePanel({ block, onUpdate }: StylePanelProps) {
  const style = block.style || {};

  const fontSizes = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36];
  const fontFamilies = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Calibri', label: 'Calibri' },
    { value: 'David', label: 'David (עברית)' },
    { value: 'Frank Ruehl', label: 'Frank Ruehl' },
  ];

  const alignments = [
    { value: 'right', icon: AlignRight, label: 'ימין' },
    { value: 'center', icon: AlignCenter, label: 'מרכז' },
    { value: 'left', icon: AlignLeft, label: 'שמאל' },
    { value: 'justify', icon: AlignJustify, label: 'יישור' },
  ];

  return (
    <div className="space-y-6">
      <h4 className="font-bold text-gray-900 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        עיצוב
      </h4>

      {/* גופן */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          גופן
        </label>
        <select
          value={style.fontFamily || 'Arial'}
          onChange={(e) => onUpdate({ ...style, fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {fontFamilies.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
      </div>

      {/* גודל גופן */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          גודל גופן: {style.fontSize || 12}pt
        </label>
        <input
          type="range"
          min="8"
          max="36"
          value={style.fontSize || 12}
          onChange={(e) => onUpdate({ ...style, fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>8</span>
          <span>36</span>
        </div>
      </div>

      {/* סגנון טקסט */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          סגנון
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdate({ ...style, bold: !style.bold })}
            className={`px-3 py-2 border rounded-lg font-bold transition ${
              style.bold ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            B
          </button>
          <button
            onClick={() => onUpdate({ ...style, italic: !style.italic })}
            className={`px-3 py-2 border rounded-lg italic transition ${
              style.italic ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            I
          </button>
          <button
            onClick={() => onUpdate({ ...style, underline: !style.underline })}
            className={`px-3 py-2 border rounded-lg underline transition ${
              style.underline ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            U
          </button>
        </div>
      </div>

      {/* יישור */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          יישור
        </label>
        <div className="grid grid-cols-4 gap-2">
          {alignments.map(align => {
            const Icon = align.icon;
            return (
              <button
                key={align.value}
                onClick={() => onUpdate({ ...style, textAlign: align.value })}
                className={`p-2 border rounded-lg transition ${
                  style.textAlign === align.value ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
                }`}
                title={align.label}
              >
                <Icon className="w-5 h-5 mx-auto" />
              </button>
            );
          })}
        </div>
      </div>

      {/* צבע טקסט */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          צבע טקסט
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={style.color || '#000000'}
            onChange={(e) => onUpdate({ ...style, color: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={style.color || '#000000'}
            onChange={(e) => onUpdate({ ...style, color: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
          />
        </div>
        <div className="flex gap-2 mt-2">
          {['#000000', '#1e40af', '#dc2626', '#16a34a', '#ca8a04'].map(color => (
            <button
              key={color}
              onClick={() => onUpdate({ ...style, color })}
              className="w-8 h-8 rounded border-2 hover:scale-110 transition"
              style={{ backgroundColor: color, borderColor: style.color === color ? '#000' : '#ccc' }}
            />
          ))}
        </div>
      </div>

      {/* צבע רקע */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          צבע רקע
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={style.backgroundColor || '#ffffff'}
            onChange={(e) => onUpdate({ ...style, backgroundColor: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={style.backgroundColor || '#ffffff'}
            onChange={(e) => onUpdate({ ...style, backgroundColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      {/* מרווחים */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          מרווחים (px)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">מעל</label>
            <input
              type="number"
              value={block.metadata?.marginTop || 0}
              onChange={(e) => onUpdate({ metadata: { ...block.metadata, marginTop: parseInt(e.target.value) || 0 } })}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">מתחת</label>
            <input
              type="number"
              value={block.metadata?.marginBottom || 0}
              onChange={(e) => onUpdate({ metadata: { ...block.metadata, marginBottom: parseInt(e.target.value) || 0 } })}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* גובה שורה */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          גובה שורה: {style.lineHeight || 1.5}
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={style.lineHeight || 1.5}
          onChange={(e) => onUpdate({ ...style, lineHeight: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>צפוף (1.0)</span>
          <span>רחב (3.0)</span>
        </div>
      </div>

      {/* כפתור איפוס */}
      <button
        onClick={() => onUpdate({})}
        className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        איפוס עיצוב
      </button>
    </div>
  );
}

