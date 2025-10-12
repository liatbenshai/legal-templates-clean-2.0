'use client';

import { useState } from 'react';
import { Hash, ChevronDown, ChevronUp } from 'lucide-react';

export interface NumberingConfig {
  enabled: boolean;
  style: 'decimal' | 'hebrew' | 'roman' | 'alpha';
  prefix: string;
  suffix: string;
  startFrom: number;
  resetOnSection: boolean;
  indentLevel: number;
}

interface AutoNumberingProps {
  config: NumberingConfig;
  onChange: (config: NumberingConfig) => void;
}

export default function AutoNumbering({ config, onChange }: AutoNumberingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const numberingStyles = [
    { value: 'decimal', label: '1, 2, 3', example: '1. 2. 3.' },
    { value: 'hebrew', label: 'א, ב, ג', example: 'א. ב. ג.' },
    { value: 'roman', label: 'I, II, III', example: 'I. II. III.' },
    { value: 'alpha', label: 'A, B, C', example: 'A. B. C.' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* כפתור פתיחה/סגירה */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">מספור אוטומטי לסעיפים</span>
          {config.enabled && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
              פעיל
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* הגדרות מפורטות */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-white">
          {/* הפעלה/כיבוי */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => onChange({ ...config, enabled: e.target.checked })}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <div>
              <div className="font-medium text-gray-900">הפעל מספור אוטומטי</div>
              <div className="text-sm text-gray-500">
                כל סעיף חדש יקבל מספור אוטומטי לפי הסגנון שנבחר
              </div>
            </div>
          </label>

          {config.enabled && (
            <>
              {/* סגנון מספור */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סגנון מספור
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {numberingStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => onChange({ ...config, style: style.value as any })}
                      className={`p-3 rounded-lg border-2 transition text-center ${
                        config.style === style.value
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">{style.label}</div>
                      <div className="text-xs text-gray-500">{style.example}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* תחילה מ... */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    התחל מספר
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.startFrom}
                    onChange={(e) => onChange({ ...config, startFrom: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    רמת הזחה
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={config.indentLevel}
                    onChange={(e) => onChange({ ...config, indentLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* תחיליות וסיומות */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תחילית (לפני המספר)
                  </label>
                  <input
                    type="text"
                    value={config.prefix}
                    onChange={(e) => onChange({ ...config, prefix: e.target.value })}
                    placeholder='לדוגמה: "סעיף "'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סיומת (אחרי המספר)
                  </label>
                  <input
                    type="text"
                    value={config.suffix}
                    onChange={(e) => onChange({ ...config, suffix: e.target.value })}
                    placeholder='לדוגמה: "."'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* אפשרות איפוס */}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={config.resetOnSection}
                  onChange={(e) => onChange({ ...config, resetOnSection: e.target.checked })}
                  className="w-4 h-4 text-primary rounded"
                />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">אפס מספור בכל פרק חדש</div>
                  <div className="text-gray-500">המספור יתחיל מחדש בכל פרק או קטגוריה</div>
                </div>
              </label>

              {/* תצוגה מקדימה */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">תצוגה מקדימה:</div>
                <div className="space-y-1 text-gray-700" style={{ paddingRight: `${config.indentLevel * 1.5}rem` }}>
                  <div>{config.prefix}{formatNumber(config.startFrom, config.style)}{config.suffix} סעיף ראשון</div>
                  <div>{config.prefix}{formatNumber(config.startFrom + 1, config.style)}{config.suffix} סעיף שני</div>
                  <div>{config.prefix}{formatNumber(config.startFrom + 2, config.style)}{config.suffix} סעיף שלישי</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// פונקציית עזר לפורמט מספרים
function formatNumber(num: number, style: string): string {
  switch (style) {
    case 'hebrew':
      return toHebrewNumber(num);
    case 'roman':
      return toRoman(num);
    case 'alpha':
      return String.fromCharCode(64 + num); // A, B, C...
    default:
      return num.toString();
  }
}

// המרה למספרים עבריים
function toHebrewNumber(num: number): string {
  const letters = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];
  if (num <= 10) return letters[num];
  if (num <= 18) return letters[10] + letters[num - 10];
  if (num === 19) return letters[10] + letters[9];
  if (num === 20) return 'כ';
  return num.toString(); // לפישוט
}

// המרה לרומיים
function toRoman(num: number): string {
  const values = [10, 9, 5, 4, 1];
  const symbols = ['X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  
  for (let i = 0; i < values.length && num > 0; i++) {
    while (num >= values[i]) {
      result += symbols[i];
      num -= values[i];
    }
  }
  
  return result;
}
