'use client';

import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

/**
 * עורך כותרות עליונות ותחתיות
 * תמיכה במספרי עמודים ומספרי העתקים
 */

export interface HeaderFooterConfig {
  header: {
    enabled: boolean;
    content: string;
    alignment: 'left' | 'center' | 'right';
    fontSize: number;
  };
  footer: {
    enabled: boolean;
    content: string;
    alignment: 'left' | 'center' | 'right';
    fontSize: number;
  };
  pageNumbers: {
    enabled: boolean;
    style: 'decimal' | 'hebrew' | 'roman';
    format: string; // "עמוד {n} מתוך {total}"
    position: 'header' | 'footer';
  };
  copyNumbers: {
    enabled: boolean;
    totalCopies: number;
    format: string; // "העתק {n} מתוך {total}"
    position: 'header' | 'footer';
  };
}

interface HeaderFooterEditorProps {
  config: HeaderFooterConfig;
  onChange: (config: HeaderFooterConfig) => void;
}

export default function HeaderFooterEditor({ config, onChange }: HeaderFooterEditorProps) {
  const updateHeader = (updates: Partial<HeaderFooterConfig['header']>) => {
    onChange({ ...config, header: { ...config.header, ...updates } });
  };

  const updateFooter = (updates: Partial<HeaderFooterConfig['footer']>) => {
    onChange({ ...config, footer: { ...config.footer, ...updates } });
  };

  const updatePageNumbers = (updates: Partial<HeaderFooterConfig['pageNumbers']>) => {
    onChange({ ...config, pageNumbers: { ...config.pageNumbers, ...updates } });
  };

  const updateCopyNumbers = (updates: Partial<HeaderFooterConfig['copyNumbers']>) => {
    onChange({ ...config, copyNumbers: { ...config.copyNumbers, ...updates } });
  };

  const AlignmentButton = ({ alignment, current, onChange }: any) => {
    const Icon = alignment === 'left' ? AlignLeft : alignment === 'center' ? AlignCenter : AlignRight;
    return (
      <button
        type="button"
        onClick={() => onChange(alignment)}
        className={`p-2 rounded ${current === alignment ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-900">כותרות עליונות ותחתיות</h2>

      {/* כותרת עליונה */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">כותרת עליונה</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.header.enabled}
              onChange={(e) => updateHeader({ enabled: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm">הפעל</span>
          </label>
        </div>

        {config.header.enabled && (
          <div className="space-y-3">
            <textarea
              value={config.header.content}
              onChange={(e) => updateHeader({ content: e.target.value })}
              placeholder="תוכן הכותרת - השתמש ב-{page_number}, {total_pages}, {copy_number}, {total_copies}"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">יישור:</span>
              <div className="flex gap-1">
                <AlignmentButton alignment="right" current={config.header.alignment} onChange={(a: any) => updateHeader({ alignment: a })} />
                <AlignmentButton alignment="center" current={config.header.alignment} onChange={(a: any) => updateHeader({ alignment: a })} />
                <AlignmentButton alignment="left" current={config.header.alignment} onChange={(a: any) => updateHeader({ alignment: a })} />
              </div>
              
              <span className="text-sm font-medium mr-auto">גודל:</span>
              <input
                type="number"
                min="8"
                max="16"
                value={config.header.fontSize}
                onChange={(e) => updateHeader({ fontSize: parseInt(e.target.value) })}
                className="w-16 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* כותרת תחתונה */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">כותרת תחתונה</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.footer.enabled}
              onChange={(e) => updateFooter({ enabled: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm">הפעל</span>
          </label>
        </div>

        {config.footer.enabled && (
          <div className="space-y-3">
            <textarea
              value={config.footer.content}
              onChange={(e) => updateFooter({ content: e.target.value })}
              placeholder="תוכן התחתית"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">יישור:</span>
              <div className="flex gap-1">
                <AlignmentButton alignment="right" current={config.footer.alignment} onChange={(a: any) => updateFooter({ alignment: a })} />
                <AlignmentButton alignment="center" current={config.footer.alignment} onChange={(a: any) => updateFooter({ alignment: a })} />
                <AlignmentButton alignment="left" current={config.footer.alignment} onChange={(a: any) => updateFooter({ alignment: a })} />
              </div>
              
              <span className="text-sm font-medium mr-auto">גודל:</span>
              <input
                type="number"
                min="8"
                max="16"
                value={config.footer.fontSize}
                onChange={(e) => updateFooter({ fontSize: parseInt(e.target.value) })}
                className="w-16 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* מספרי עמודים */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">מספרי עמודים</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.pageNumbers.enabled}
              onChange={(e) => updatePageNumbers({ enabled: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm">הפעל</span>
          </label>
        </div>

        {config.pageNumbers.enabled && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סגנון מספור
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updatePageNumbers({ style: 'decimal' })}
                  className={`p-2 rounded border-2 ${config.pageNumbers.style === 'decimal' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                >
                  1, 2, 3
                </button>
                <button
                  type="button"
                  onClick={() => updatePageNumbers({ style: 'hebrew' })}
                  className={`p-2 rounded border-2 ${config.pageNumbers.style === 'hebrew' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                >
                  א, ב, ג
                </button>
                <button
                  type="button"
                  onClick={() => updatePageNumbers({ style: 'roman' })}
                  className={`p-2 rounded border-2 ${config.pageNumbers.style === 'roman' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                >
                  I, II, III
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                פורמט (השתמש ב-{"{n}"} ו-{"{total}"})
              </label>
              <input
                type="text"
                value={config.pageNumbers.format}
                onChange={(e) => updatePageNumbers({ format: e.target.value })}
                placeholder='לדוגמה: "עמוד {n} מתוך {total}"'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מיקום
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updatePageNumbers({ position: 'header' })}
                  className={`flex-1 p-2 rounded border-2 ${config.pageNumbers.position === 'header' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                >
                  כותרת עליונה
                </button>
                <button
                  type="button"
                  onClick={() => updatePageNumbers({ position: 'footer' })}
                  className={`flex-1 p-2 rounded border-2 ${config.pageNumbers.position === 'footer' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                >
                  כותרת תחתונה
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* מספרי העתקים */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">מספרי העתקים</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.copyNumbers.enabled}
              onChange={(e) => updateCopyNumbers({ enabled: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm">הפעל</span>
          </label>
        </div>

        {config.copyNumbers.enabled && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר העתקים כולל
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.copyNumbers.totalCopies}
                onChange={(e) => updateCopyNumbers({ totalCopies: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                פורמט (השתמש ב-{"{n}"} ו-{"{total}"})
              </label>
              <input
                type="text"
                value={config.copyNumbers.format}
                onChange={(e) => updateCopyNumbers({ format: e.target.value })}
                placeholder='לדוגמה: "העתק {n} מתוך {total}"'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מיקום
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateCopyNumbers({ position: 'header' })}
                  className={`flex-1 p-2 rounded border-2 ${config.copyNumbers.position === 'header' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                >
                  כותרת עליונה
                </button>
                <button
                  type="button"
                  onClick={() => updateCopyNumbers({ position: 'footer' })}
                  className={`flex-1 p-2 rounded border-2 ${config.copyNumbers.position === 'footer' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                >
                  כותרת תחתונה
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* תצוגה מקדימה */}
      <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
        <h3 className="font-bold text-gray-900 mb-4">תצוגה מקדימה:</h3>
        
        <div className="bg-white p-6 rounded border-2 border-gray-400 shadow-lg" style={{ minHeight: '400px' }}>
          {/* כותרת עליונה */}
          {config.header.enabled && (
            <div
              className="border-b pb-2 mb-4"
              style={{
                textAlign: config.header.alignment,
                fontSize: `${config.header.fontSize}pt`,
                fontFamily: 'David',
              }}
              dir="rtl"
            >
              {config.header.content || '[כותרת עליונה]'}
              {config.pageNumbers.enabled && config.pageNumbers.position === 'header' && (
                <span className="mr-4 text-gray-600">
                  {config.pageNumbers.format.replace('{n}', '1').replace('{total}', '5')}
                </span>
              )}
              {config.copyNumbers.enabled && config.copyNumbers.position === 'header' && (
                <span className="mr-4 text-gray-600">
                  {config.copyNumbers.format.replace('{n}', '1').replace('{total}', config.copyNumbers.totalCopies.toString())}
                </span>
              )}
            </div>
          )}

          {/* תוכן המסמך */}
          <div className="flex-1 py-8 text-gray-400 text-center" style={{ fontFamily: 'David', fontSize: '13pt' }}>
            [תוכן המסמך יופיע כאן]
          </div>

          {/* כותרת תחתונה */}
          {config.footer.enabled && (
            <div
              className="border-t pt-2 mt-4"
              style={{
                textAlign: config.footer.alignment,
                fontSize: `${config.footer.fontSize}pt`,
                fontFamily: 'David',
              }}
              dir="rtl"
            >
              {config.footer.content || '[כותרת תחתונה]'}
              {config.pageNumbers.enabled && config.pageNumbers.position === 'footer' && (
                <span className="mr-4 text-gray-600">
                  {config.pageNumbers.format.replace('{n}', '1').replace('{total}', '5')}
                </span>
              )}
              {config.copyNumbers.enabled && config.copyNumbers.position === 'footer' && (
                <span className="mr-4 text-gray-600">
                  {config.copyNumbers.format.replace('{n}', '1').replace('{total}', config.copyNumbers.totalCopies.toString())}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* הסבר */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">💡 משתנים זמינים:</p>
        <ul className="space-y-1 mr-4">
          <li>• <code>{"{page_number}"}</code> - מספר עמוד נוכחי</li>
          <li>• <code>{"{total_pages}"}</code> - סה"כ עמודים</li>
          <li>• <code>{"{copy_number}"}</code> - מספר העתק נוכחי</li>
          <li>• <code>{"{total_copies}"}</code> - סה"כ העתקים</li>
          <li>• <code>{"{date}"}</code> - תאריך יצירת המסמך</li>
          <li>• <code>{"{title}"}</code> - כותרת המסמך</li>
        </ul>
      </div>
    </div>
  );
}
