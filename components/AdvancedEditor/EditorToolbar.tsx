'use client';

import {
  Bold,
  Italic,
  Underline,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Minus,
  FileText,
  Undo,
  Redo,
  Save,
  Eye,
  Download,
} from 'lucide-react';

interface EditorToolbarProps {
  onFormatText: (format: string) => void;
  onInsertElement: (element: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export default function EditorToolbar({
  onFormatText,
  onInsertElement,
  onUndo,
  onRedo,
  onSave,
  onPreview,
  onExport,
  canUndo = false,
  canRedo = false,
}: EditorToolbarProps) {
  const ToolbarButton = ({
    icon: Icon,
    label,
    onClick,
    disabled = false,
    active = false,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`p-2 rounded-lg transition-all ${
        disabled
          ? 'text-gray-300 cursor-not-allowed'
          : active
          ? 'bg-primary text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-300" />;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-1 p-2 overflow-x-auto">
        {/* היסטוריה */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Undo}
            label="בטל (Ctrl+Z)"
            onClick={() => onUndo?.()}
            disabled={!canUndo}
          />
          <ToolbarButton
            icon={Redo}
            label="בצע שוב (Ctrl+Y)"
            onClick={() => onRedo?.()}
            disabled={!canRedo}
          />
        </div>

        <Divider />

        {/* עיצוב טקסט */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Bold}
            label="מודגש (Ctrl+B)"
            onClick={() => onFormatText('bold')}
          />
          <ToolbarButton
            icon={Italic}
            label="נטוי (Ctrl+I)"
            onClick={() => onFormatText('italic')}
          />
          <ToolbarButton
            icon={Underline}
            label="קו תחתון (Ctrl+U)"
            onClick={() => onFormatText('underline')}
          />
        </div>

        <Divider />

        {/* כותרות */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Heading1}
            label="כותרת 1"
            onClick={() => onInsertElement('heading1')}
          />
          <ToolbarButton
            icon={Heading2}
            label="כותרת 2"
            onClick={() => onInsertElement('heading2')}
          />
          <ToolbarButton
            icon={Heading3}
            label="כותרת 3"
            onClick={() => onInsertElement('heading3')}
          />
          <ToolbarButton
            icon={Heading4}
            label="כותרת 4"
            onClick={() => onInsertElement('heading4')}
          />
        </div>

        <Divider />

        {/* יישור */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={AlignRight}
            label="יישור לימין"
            onClick={() => onFormatText('align-right')}
          />
          <ToolbarButton
            icon={AlignCenter}
            label="יישור למרכז"
            onClick={() => onFormatText('align-center')}
          />
          <ToolbarButton
            icon={AlignLeft}
            label="יישור לשמאל"
            onClick={() => onFormatText('align-left')}
          />
          <ToolbarButton
            icon={AlignJustify}
            label="יישור מוצדק"
            onClick={() => onFormatText('align-justify')}
          />
        </div>

        <Divider />

        {/* רשימות */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={List}
            label="רשימה עם תבליטים"
            onClick={() => onInsertElement('bullet-list')}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="רשימה ממוספרת"
            onClick={() => onInsertElement('numbered-list')}
          />
        </div>

        <Divider />

        {/* אלמנטים */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Table}
            label="הוסף טבלה"
            onClick={() => onInsertElement('table')}
          />
          <ToolbarButton
            icon={Quote}
            label="ציטוט"
            onClick={() => onInsertElement('blockquote')}
          />
          <ToolbarButton
            icon={Minus}
            label="קו הפרדה"
            onClick={() => onInsertElement('horizontal-rule')}
          />
          <ToolbarButton
            icon={FileText}
            label="סעיף משפטי"
            onClick={() => onInsertElement('legal-section')}
          />
        </div>

        {/* ריווח */}
        <div className="flex-1" />

        {/* פעולות */}
        <div className="flex items-center gap-2 border-r border-gray-300 pr-2">
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" />
              <span>שמור</span>
            </button>
          )}
          {onPreview && (
            <button
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Eye className="w-4 h-4" />
              <span>תצוגה מקדימה</span>
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>ייצא</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

