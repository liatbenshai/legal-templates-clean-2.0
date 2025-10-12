'use client';

import { useState } from 'react';
import { Save, FileText, Settings, List, Eye } from 'lucide-react';

interface TemplateBuilderProps {
  onSave: (templateData: any) => void;
  isSaving?: boolean;
}

type BuilderStep = 'general' | 'fields' | 'content' | 'preview';

export default function TemplateBuilder({ onSave, isSaving = false }: TemplateBuilderProps) {
  const [currentStep, setCurrentStep] = useState<BuilderStep>('general');
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    category: 'contracts',
    tags: [] as string[],
    fields: [] as any[],
    content: '',
    version: '1.0',
    isPublic: true,
  });

  const handleSave = () => {
    // ולידציה בסיסית
    if (!templateData.title) {
      alert('נא להזין שם לתבנית');
      return;
    }
    if (templateData.fields.length === 0) {
      alert('נא להוסיף לפחות שדה אחד');
      return;
    }
    if (!templateData.content) {
      alert('נא להוסיף תוכן לתבנית');
      return;
    }
    
    onSave(templateData);
  };

  const steps = [
    { id: 'general', name: '1. הגדרות כלליות', icon: Settings },
    { id: 'fields', name: '2. הגדרת שדות', icon: List },
    { id: 'content', name: '3. בניית תוכן', icon: FileText },
    { id: 'preview', name: '4. תצוגה מקדימה', icon: Eye },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* תפריט צעדים */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id as BuilderStep)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-primary text-white shadow-lg'
                    : isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:block">{step.name}</span>
                <span className="md:hidden">{index + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* תוכן הצעד הנוכחי */}
      <div className="bg-white rounded-xl shadow-md p-8">
        {currentStep === 'general' && (
          <GeneralSettings
            data={templateData}
            onChange={setTemplateData}
            onNext={() => setCurrentStep('fields')}
          />
        )}
        
        {currentStep === 'fields' && (
          <FieldsEditor
            fields={templateData.fields}
            onChange={(fields: any) => setTemplateData({ ...templateData, fields })}
            onNext={() => setCurrentStep('content')}
            onBack={() => setCurrentStep('general')}
          />
        )}
        
        {currentStep === 'content' && (
          <ContentBuilder
            content={templateData.content}
            fields={templateData.fields}
            onChange={(content: any) => setTemplateData({ ...templateData, content })}
            onNext={() => setCurrentStep('preview')}
            onBack={() => setCurrentStep('fields')}
          />
        )}
        
        {currentStep === 'preview' && (
          <TemplatePreview
            templateData={templateData}
            onBack={() => setCurrentStep('content')}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}

// קומפוננטת הגדרות כלליות
function GeneralSettings({ data, onChange, onNext }: any) {
  const categories = [
    { id: 'beit-din', name: 'כתבי בית דין' },
    { id: 'wills', name: 'צוואות' },
    { id: 'power-of-attorney', name: 'ייפויי כוח' },
    { id: 'contracts', name: 'הסכמים' },
    { id: 'requests', name: 'בקשות לבית משפט' },
    { id: 'appeals', name: 'ערעורים' },
    { id: 'family-law', name: 'דיני משפחה' },
    { id: 'real-estate', name: 'נדל"ן' },
    { id: 'corporate', name: 'דיני חברות' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">הגדרות כלליות</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          שם התבנית <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="לדוגמה: הסכם שכירות דירה"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תיאור התבנית <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="תאר בקצרה למה משמשת התבנית הזו ומתי להשתמש בה"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          קטגוריה <span className="text-red-500">*</span>
        </label>
        <select
          value={data.category}
          onChange={(e) => onChange({ ...data, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תגיות (מופרד בפסיקים)
        </label>
        <input
          type="text"
          value={data.tags.join(', ')}
          onChange={(e) => onChange({ ...data, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
          placeholder="לדוגמה: דחוף, נפוץ, פשוט"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">תגיות עוזרות למצוא את התבנית במהירות</p>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!data.title || !data.description}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <span>המשך להגדרת שדות</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// קומפוננטת עריכת שדות
function FieldsEditor({ fields, onChange, onNext, onBack }: any) {
  const [editingField, setEditingField] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const addField = (field: any) => {
    const newField = {
      ...field,
      id: `field-${Date.now()}`,
      order: fields.length + 1,
    };
    onChange([...fields, newField]);
    setShowAddDialog(false);
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f: any) => f.id !== id));
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex((f: any) => f.id === id);
    if (index === -1) return;
    
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    newFields.forEach((f, i) => f.order = i + 1);
    
    onChange(newFields);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">הגדרת שדות</h2>
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          + הוסף שדה
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>שדות</strong> הם המידע שהמשתמש ימלא בטופס. לדוגמה: שם, תאריך, סכום וכו'.
          אחר כך תוכל להשתמש בהם בתוכן המסמך עם <code className="bg-blue-100 px-1">{'{{שם-השדה}}'}</code>
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <List className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>עדיין לא הוספת שדות</p>
          <p className="text-sm">לחץ על "הוסף שדה" כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary transition"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {field.label}
                  {field.required && <span className="text-red-500 mr-1">*</span>}
                </div>
                <div className="text-sm text-gray-600">
                  סוג: <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">{field.type}</span>
                  {field.group && <span className="mr-3">קבוצה: {field.group}</span>}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveField(field.id, 'up')}
                  disabled={index === 0}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                  title="הזז למעלה"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveField(field.id, 'down')}
                  disabled={index === fields.length - 1}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                  title="הזז למטה"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeField(field.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  title="מחק"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* דיאלוג הוספת שדה */}
      {showAddDialog && (
        <AddFieldDialog
          onAdd={addField}
          onCancel={() => setShowAddDialog(false)}
        />
      )}

      {/* כפתורי ניווט */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← חזור
        </button>
        <button
          onClick={onNext}
          disabled={fields.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <span>המשך לבניית תוכן</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// דיאלוג להוספת שדה
function AddFieldDialog({ onAdd, onCancel }: any) {
  const [fieldData, setFieldData] = useState({
    label: '',
    type: 'text',
    required: true,
    placeholder: '',
    helpText: '',
    group: '',
  });

  const fieldTypes = [
    { value: 'text', label: 'טקסט קצר' },
    { value: 'textarea', label: 'טקסט ארוך' },
    { value: 'number', label: 'מספר' },
    { value: 'date', label: 'תאריך' },
    { value: 'select', label: 'רשימה נפתחת' },
    { value: 'checkbox', label: 'תיבת סימון' },
    { value: 'email', label: 'אימייל' },
    { value: 'phone', label: 'טלפון' },
    { value: 'id-number', label: 'תעודת זהות' },
    { value: 'address', label: 'כתובת' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">הוספת שדה חדש</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם השדה (כפי שיופיע למשתמש) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fieldData.label}
              onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
              placeholder="לדוגמה: שם השוכר"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סוג השדה <span className="text-red-500">*</span>
            </label>
            <select
              value={fieldData.type}
              onChange={(e) => setFieldData({ ...fieldData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={fieldData.required}
                onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm font-medium text-gray-700">שדה חובה</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              טקסט עזר (placeholder)
            </label>
            <input
              type="text"
              value={fieldData.placeholder}
              onChange={(e) => setFieldData({ ...fieldData, placeholder: e.target.value })}
              placeholder="טקסט שיופיע בתוך השדה כדוגמה"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הסבר מפורט
            </label>
            <input
              type="text"
              value={fieldData.helpText}
              onChange={(e) => setFieldData({ ...fieldData, helpText: e.target.value })}
              placeholder="הסבר נוסף שיעזור למשתמש למלא את השדה"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קבוצה (אופציונלי)
            </label>
            <input
              type="text"
              value={fieldData.group}
              onChange={(e) => setFieldData({ ...fieldData, group: e.target.value })}
              placeholder="לדוגמה: פרטי שוכר, פרטי משכיר"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">קיבוץ שדות לפי נושאים</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            ביטול
          </button>
          <button
            onClick={() => {
              if (!fieldData.label) {
                alert('נא להזין שם לשדה');
                return;
              }
              onAdd(fieldData);
              setFieldData({
                label: '',
                type: 'text',
                required: true,
                placeholder: '',
                helpText: '',
                group: '',
              });
            }}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            הוסף שדה
          </button>
        </div>
      </div>
    </div>
  );
}

// ממשיך בהודעה הבאה...
function ContentBuilder({ content, fields, onChange, onNext, onBack }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">בניית תוכן המסמך</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-3">
          💡 <strong>איך להשתמש בשדות?</strong>
        </p>
        <p className="text-sm text-blue-800 mb-2">
          כתוב את טקסט המסמך ובמקומות שצריך למלא מידע, השתמש ב: <code className="bg-blue-100 px-2 py-0.5 rounded">{'{{שם-השדה}}'}</code>
        </p>
        <p className="text-sm text-blue-800">
          <strong>דוגמה:</strong> "הסכם זה נערך ביום {'{{תאריך}}'} בין {'{{שם-משכיר}}'} לבין {'{{שם-שוכר}}'}"
        </p>
      </div>

      {fields.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">השדות שהגדרת:</p>
          <div className="flex flex-wrap gap-2">
            {fields.map((field: any) => (
              <button
                key={field.id}
                onClick={() => {
                  const fieldName = field.label.replace(/\s+/g, '-');
                  onChange(content + `{{${fieldName}}}`);
                }}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-primary hover:text-white hover:border-primary transition"
                title="לחץ להוספה לתוכן"
              >
                {field.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">לחץ על שדה כדי להוסיף אותו לתוכן</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תוכן המסמך <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="כתוב כאן את תוכן התבנית...

לדוגמה:

הסכם שכירות דירה

הסכם זה נערך ביום {{תאריך}} 

בין:
{{שם-משכיר}} - משכיר
ת.ז: {{ת.ז-משכיר}}

לבין:
{{שם-שוכר}} - שוכר
ת.ז: {{ת.ז-שוכר}}

סעיף 1 - הנכס
הנכס המושכר נמצא ב: {{כתובת-הנכס}}

סעיף 2 - דמי השכירות
דמי השכירות החודשיים: {{דמי-שכירות}} ₪"
          rows={20}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
          style={{ direction: 'rtl', textAlign: 'right' }}
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← חזור
        </button>
        <button
          onClick={onNext}
          disabled={!content}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <span>תצוגה מקדימה</span>
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// תצוגה מקדימה
function TemplatePreview({ templateData, onBack, onSave, isSaving }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">תצוגה מקדימה</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* פרטי התבנית */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">📋 פרטי התבנית</h3>
            <div className="space-y-2 text-sm">
              <div><strong>שם:</strong> {templateData.title}</div>
              <div><strong>תיאור:</strong> {templateData.description}</div>
              <div><strong>קטגוריה:</strong> {templateData.category}</div>
              <div><strong>תגיות:</strong> {templateData.tags.join(', ') || 'אין'}</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">📝 שדות ({templateData.fields.length})</h3>
            <ul className="space-y-1 text-sm">
              {templateData.fields.map((field: any) => (
                <li key={field.id} className="flex items-center gap-2">
                  <span className={field.required ? 'text-red-500' : 'text-gray-400'}>●</span>
                  <span>{field.label}</span>
                  <span className="text-gray-500">({field.type})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* תצוגת תוכן */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">📄 תוכן המסמך</h3>
          <div
            className="text-sm whitespace-pre-wrap bg-white p-4 rounded border border-gray-200 max-h-96 overflow-y-auto"
            style={{ direction: 'rtl', textAlign: 'right' }}
          >
            {templateData.content}
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          ✅ התבנית מוכנה לשמירה! לחץ על "שמור תבנית" והיא תהיה זמינה לכולם.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← חזור לעריכה
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium text-lg"
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? 'שומר...' : 'שמור תבנית'}</span>
        </button>
      </div>
    </div>
  );
}

// ייבוא ArrowRight
import { ArrowRight } from 'lucide-react';

