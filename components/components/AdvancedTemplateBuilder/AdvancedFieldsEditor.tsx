'use client';

import { useState } from 'react';
import { Plus, ArrowRight, GripVertical, Trash2, Edit2, Copy, List } from 'lucide-react';

interface AdvancedFieldsEditorProps {
  fields: any[];
  onChange: (fields: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AdvancedFieldsEditor({ fields, onChange, onNext, onBack }: AdvancedFieldsEditorProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);

  const addField = (field: any) => {
    const newField = {
      ...field,
      id: `field-${Date.now()}`,
      order: fields.length + 1,
    };
    onChange([...fields, newField]);
    setShowAddDialog(false);
  };

  const updateField = (id: string, updates: any) => {
    onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    if (confirm('האם למחוק את השדה?')) {
      onChange(fields.filter(f => f.id !== id));
    }
  };

  const duplicateField = (field: any) => {
    const duplicate = {
      ...field,
      id: `field-${Date.now()}`,
      label: `${field.label} (עותק)`,
      order: fields.length + 1,
    };
    onChange([...fields, duplicate]);
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) return;
    
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    newFields.forEach((f, i) => f.order = i + 1);
    
    onChange(newFields);
  };

  // קיבוץ שדות לפי קבוצות
  const groupedFields = fields.reduce((acc, field) => {
    const group = field.group || 'ללא קבוצה';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">הגדרת שדות מתקדמת</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>הוסף שדה חדש</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
        <h4 className="font-bold text-blue-900 mb-2">📚 מדריך שדות</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">💡 שדות רגילים:</p>
            <ul className="space-y-1 mr-4">
              <li>• טקסט קצר - שמות, כתובות</li>
              <li>• טקסט ארוך - תיאורים, סעיפים</li>
              <li>• מספר - סכומים, כמויות</li>
              <li>• תאריך - תאריכי חתימה, אירועים</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">⚡ שדות מתקדמים:</p>
            <ul className="space-y-1 mr-4">
              <li>• רשימה חוזרת - מספר פריטים (עדים, נכסים)</li>
              <li>• חישוב אוטומטי - נוסחאות</li>
              <li>• תנאי - הצג רק אם...</li>
              <li>• טבלה דינמית - שורות משתנות</li>
            </ul>
          </div>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <List className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-600 mb-2">עדיין לא הוספת שדות</p>
          <p className="text-sm text-gray-500 mb-6">שדות הם המידע שהמשתמש ימלא בטופס</p>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            הוסף את השדה הראשון
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.entries(groupedFields) as [string, any[]][]).map(([group, groupFields]) => (
            <div key={group} className="space-y-3">
              <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 pb-2 border-b">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {groupFields.length}
                </span>
                {group}
              </h3>
              
              {groupFields.map((field: any, groupIndex: number) => (
                <div
                  key={field.id}
                  className="group flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition"
                >
                  <button className="cursor-move p-1 text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {field.label}
                          {field.required && <span className="text-red-500 mr-2">*</span>}
                        </div>
                        {field.helpText && (
                          <p className="text-sm text-gray-600 mt-1">{field.helpText}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {field.type}
                      </span>
                      {field.placeholder && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          דוגמה: {field.placeholder}
                        </span>
                      )}
                      {field.validation && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          בדיקת תקינות
                        </span>
                      )}
                      {field.dependsOn && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          תלוי ב: {field.dependsOn}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => moveField(field.id, 'up')}
                      disabled={field.order === 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-20"
                      title="הזז למעלה"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => duplicateField(field)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="שכפל"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingField(field)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="ערוך"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveField(field.id, 'down')}
                      disabled={field.order === fields.length}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-20"
                      title="הזז למטה"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="מחק"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* דיאלוג הוספה/עריכה */}
      {(showAddDialog || editingField) && (
        <FieldDialog
          field={editingField}
          onSave={(fieldData: any) => {
            if (editingField) {
              updateField(editingField.id, fieldData);
              setEditingField(null);
            } else {
              addField(fieldData);
            }
          }}
          onCancel={() => {
            setShowAddDialog(false);
            setEditingField(null);
          }}
        />
      )}

      {/* כפתורי ניווט */}
      <div className="flex justify-between pt-8 border-t">
        <button
          onClick={onBack}
          className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← חזור
        </button>
        <button
          onClick={onNext}
          disabled={fields.length === 0}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg"
        >
          <span>המשך לבניית תוכן</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// דיאלוג שדה מתקדם
function FieldDialog({ field, onSave, onCancel }: any) {
  const [fieldData, setFieldData] = useState(field || {
    label: '',
    type: 'text',
    required: true,
    placeholder: '',
    helpText: '',
    group: '',
    validation: {},
    dependsOn: '',
    conditional: false,
    repeatable: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'טקסט קצר', icon: '📝' },
    { value: 'textarea', label: 'טקסט ארוך', icon: '📄' },
    { value: 'number', label: 'מספר', icon: '🔢' },
    { value: 'date', label: 'תאריך', icon: '📅' },
    { value: 'select', label: 'רשימה נפתחת', icon: '📋' },
    { value: 'checkbox', label: 'תיבת סימון', icon: '☑️' },
    { value: 'email', label: 'אימייל', icon: '📧' },
    { value: 'phone', label: 'טלפון', icon: '📞' },
    { value: 'id-number', label: 'תעודת זהות', icon: '🆔' },
    { value: 'address', label: 'כתובת', icon: '🏠' },
    { value: 'currency', label: 'סכום כסף', icon: '💰' },
    { value: 'repeating-group', label: 'קבוצה חוזרת', icon: '🔁' },
    { value: 'calculated', label: 'שדה מחושב', icon: '🧮' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <h3 className="text-2xl font-bold text-gray-900">
            {field ? 'עריכת שדה' : 'הוספת שדה חדש'}
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* בסיסי */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">פרטים בסיסיים</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם השדה <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fieldData.label}
                onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
                placeholder="לדוגמה: שם השוכר"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-lg"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                סוג השדה <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fieldTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFieldData({ ...fieldData, type: type.value })}
                    className={`p-3 rounded-lg border-2 transition text-right ${
                      fieldData.type === type.value
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קבוצה
                </label>
                <input
                  type="text"
                  value={fieldData.group || ''}
                  onChange={(e) => setFieldData({ ...fieldData, group: e.target.value })}
                  placeholder="לדוגמה: פרטי שוכר"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fieldData.required}
                    onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
                    className="w-5 h-5 text-primary rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">שדה חובה</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                טקסט עזר (placeholder)
              </label>
              <input
                type="text"
                value={fieldData.placeholder || ''}
                onChange={(e) => setFieldData({ ...fieldData, placeholder: e.target.value })}
                placeholder="טקסט שיופיע בתוך השדה"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הסבר מפורט
              </label>
              <textarea
                value={fieldData.helpText || ''}
                onChange={(e) => setFieldData({ ...fieldData, helpText: e.target.value })}
                placeholder="הסבר שיעזור למשתמש למלא את השדה נכון"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* אפשרויות מתקדמות */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium mb-4"
            >
              <span>{showAdvanced ? '▼' : '►'}</span>
              <span>אפשרויות מתקדמות</span>
            </button>

            {showAdvanced && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                {fieldData.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      אפשרויות לבחירה (שורה לכל אפשרות)
                    </label>
                    <textarea
                      value={(fieldData.options || []).join('\n')}
                      onChange={(e) => setFieldData({
                        ...fieldData,
                        options: e.target.value.split('\n').filter(Boolean)
                      })}
                      placeholder="אפשרות 1&#10;אפשרות 2&#10;אפשרות 3"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-white">
                    <input
                      type="checkbox"
                      checked={fieldData.repeatable}
                      onChange={(e) => setFieldData({ ...fieldData, repeatable: e.target.checked })}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <div className="text-sm font-medium">שדה חוזר</div>
                      <div className="text-xs text-gray-500">אפשר להוסיף מספר פעמים</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-white">
                    <input
                      type="checkbox"
                      checked={fieldData.conditional}
                      onChange={(e) => setFieldData({ ...fieldData, conditional: e.target.checked })}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <div className="text-sm font-medium">שדה מותנה</div>
                      <div className="text-xs text-gray-500">מוצג רק בתנאי</div>
                    </div>
                  </label>
                </div>

                {fieldData.type === 'calculated' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      נוסחת חישוב
                    </label>
                    <input
                      type="text"
                      value={fieldData.formula || ''}
                      onChange={(e) => setFieldData({ ...fieldData, formula: e.target.value })}
                      placeholder="לדוגמה: {{מחיר}} * {{כמות}}"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* כפתורים */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            ביטול
          </button>
          <button
            onClick={() => {
              if (!fieldData.label) {
                alert('נא להזין שם לשדה');
                return;
              }
              onSave(fieldData);
            }}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {field ? 'שמור שינויים' : 'הוסף שדה'}
          </button>
        </div>
      </div>
    </div>
  );
}

