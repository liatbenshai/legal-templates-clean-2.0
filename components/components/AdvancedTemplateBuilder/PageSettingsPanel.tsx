'use client';

import { X } from 'lucide-react';

interface PageSettingsPanelProps {
  settings: any;
  styles: any;
  onChange: (settings: any) => void;
  onStylesChange: (styles: any) => void;
  onClose: () => void;
}

export default function PageSettingsPanel({ settings, styles, onChange, onStylesChange, onClose }: PageSettingsPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">הגדרות עמוד ומסמך</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* גודל עמוד */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">📏 גודל עמוד</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'A4', label: 'A4 (210×297mm)' },
                { value: 'Letter', label: 'Letter (216×279mm)' },
                { value: 'Legal', label: 'Legal (216×356mm)' },
              ].map(size => (
                <button
                  key={size.value}
                  onClick={() => onChange({ ...settings, size: size.value })}
                  className={`p-3 border-2 rounded-lg transition ${
                    settings.size === size.value
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* כיוון עמוד */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">📄 כיוון עמוד</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onChange({ ...settings, orientation: 'portrait' })}
                className={`p-4 border-2 rounded-lg transition ${
                  settings.orientation === 'portrait'
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="w-16 h-20 bg-white border-2 border-gray-400 mx-auto mb-2"></div>
                <div className="text-sm font-medium">לאורך</div>
              </button>
              <button
                onClick={() => onChange({ ...settings, orientation: 'landscape' })}
                className={`p-4 border-2 rounded-lg transition ${
                  settings.orientation === 'landscape'
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="w-20 h-16 bg-white border-2 border-gray-400 mx-auto mb-2"></div>
                <div className="text-sm font-medium">לרוחב</div>
              </button>
            </div>
          </div>

          {/* שוליים */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">📐 שוליים (ס"מ)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">למעלה</label>
                <input
                  type="number"
                  value={settings.margins?.top || 2.5}
                  onChange={(e) => onChange({
                    ...settings,
                    margins: { ...settings.margins, top: parseFloat(e.target.value) || 0 }
                  })}
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">למטה</label>
                <input
                  type="number"
                  value={settings.margins?.bottom || 2.5}
                  onChange={(e) => onChange({
                    ...settings,
                    margins: { ...settings.margins, bottom: parseFloat(e.target.value) || 0 }
                  })}
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">מימין</label>
                <input
                  type="number"
                  value={settings.margins?.right || 2}
                  onChange={(e) => onChange({
                    ...settings,
                    margins: { ...settings.margins, right: parseFloat(e.target.value) || 0 }
                  })}
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">משמאל</label>
                <input
                  type="number"
                  value={settings.margins?.left || 2}
                  onChange={(e) => onChange({
                    ...settings,
                    margins: { ...settings.margins, left: parseFloat(e.target.value) || 0 }
                  })}
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* כותרת עליונה ותחתונה */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">📋 כותרת ותחתית</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת עליונה (בכל עמוד)
                </label>
                <input
                  type="text"
                  value={settings.header || ''}
                  onChange={(e) => onChange({ ...settings, header: e.target.value })}
                  placeholder="לדוגמה: שם החברה | מסמך סודי"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תחתית עמוד (בכל עמוד)
                </label>
                <input
                  type="text"
                  value={settings.footer || ''}
                  onChange={(e) => onChange({ ...settings, footer: e.target.value })}
                  placeholder="לדוגמה: כתובת | טלפון | אימייל"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.pageNumbers !== false}
                  onChange={(e) => onChange({ ...settings, pageNumbers: e.target.checked })}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-medium text-gray-700">הצג מספרי עמודים</span>
              </label>
            </div>
          </div>

          {/* סגנונות ברירת מחדל */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">🎨 סגנונות ברירת מחדל</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">גופן ברירת מחדל</label>
                <select
                  value={styles.fontFamily || 'Arial'}
                  onChange={(e) => onStylesChange({ ...styles, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Calibri">Calibri</option>
                  <option value="David">David (עברית)</option>
                  <option value="Frank Ruehl">Frank Ruehl</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-700">גודל גופן</label>
                <input
                  type="number"
                  value={styles.fontSize || 12}
                  onChange={(e) => onStylesChange({ ...styles, fontSize: parseInt(e.target.value) || 12 })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  min="8"
                  max="24"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

