'use client';

import { useState } from 'react';
import { Plus, X, Save, Eye, Edit, ArrowUp, ArrowDown, Trash2, FileText } from 'lucide-react';
import { Template, TemplateField } from '@/lib/types';

interface AdvancedTemplateBuilderProps {
  onSave: (template: Template) => void;
  isSaving: boolean;
  initialTemplate?: Template;
}

export default function AdvancedTemplateBuilder({ 
  onSave, 
  isSaving,
  initialTemplate 
}: AdvancedTemplateBuilderProps) {
  // מצבי הטופס
  const [title, setTitle] = useState(initialTemplate?.title || '');
  const [description, setDescription] = useState(initialTemplate?.description || '');
  const [category, setCategory] = useState(initialTemplate?.category || 'contracts');
  const [tags, setTags] = useState<string[]>(initialTemplate?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [fields, setFields] = useState<TemplateField[]>(initialTemplate?.fields || []);
  const [content, setContent] = useState(initialTemplate?.content || '');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // קטגוריות זמינות
  const categories = [
    { id: 'beit-din', name: 'כתבי בית דין' },
    { id: 'wills', name: 'צוואות' },
    { id: 'contracts', name: 'הסכמים' },
    { id: 'power-of-attorney', name: 'ייפויי כוח' },
    { id: 'requests', name: 'בקשות לבית משפט' },
    { id: 'family-law', name: 'דיני משפחה' },
  ];

  // סוגי שדות זמינים
  const fieldTypes = [
    { value: 'text', label: 'טקסט קצר' },
    { value: 'textarea', label: 'טקסט ארוך' },
    { value: 'number', label: 'מספר' },
    { value: 'date', label: 'תאריך' },
    { value: 'select', label: 'בחירה מרשימה' },
    { value: 'id-number', label: 'תעודת זהות' },
    { value: 'address', label: 'כתובת' },
  ];

  // הוספת תגית
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // הסרת תגית
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // הוספת שדה חדש
  const handleAddField = () => {
    const newField: TemplateField = {
      id: `field-${Date.now()}`,
      label: 'שדה חדש',
      type: 'text',
      required: false,
      order: fields.length,
      placeholder: '',
      helpText: '',
      group: 'כללי',
    };
    setFields([...fields, newField]);
  };

  // עדכון שדה
  const handleUpdateField = (index: number, updates: Partial<TemplateField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  // הסרת שדה
  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // העברת שדה למעלה
  const handleMoveFieldUp = (index: number) => {
    if (index === 0) return;
    const newFields = [...fields];
    [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    // עדכון order
    newFields.forEach((field, i) => {
      field.order = i;
    });
    setFields(newFields);
  };

  // העברת שדה למטה
  const handleMoveFieldDown = (index: number) => {
    if (index === fields.length - 1) return;
    const newFields = [...fields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    // עדכון order
    newFields.forEach((field, i) => {
      field.order = i;
    });
    setFields(newFields);
  };

  // הוספת placeholder לתוכן
  const handleInsertPlaceholder = (fieldId: string) => {
    const placeholder = `{{${fieldId}}}`;
    setContent(content + placeholder);
  };

  // שמירת התבנית
  const handleSave = () => {
    if (!title.trim()) {
      alert('נא להזין כותרת לתבנית');
      return;
    }

    if (!content.trim()) {
      alert('נא להזין תוכן לתבנית');
      return;
    }

    if (fields.length === 0) {
      alert('נא להוסיף לפחות שדה אחד');
      return;
    }

    const template: Template = {
      id: initialTemplate?.id || `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      content: content.trim(),
      fields,
      tags,
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      isPublic: false,
      author: 'משתמש',
    };

    onSave(template);
  };

  // תצוגה מקדימה של התוכן
  const renderPreview = () => {
    let previewContent = content;
    fields.forEach(field => {
      const placeholder = `{{${field.id}}}`;
      const value = `[${field.label}]`;
      previewContent = previewContent.replace(new RegExp(placeholder, 'g'), value);
    });
    return previewContent;
  };

  return (
    <div className="space-y-6">
      {/* כותרת וכפתורי פעולה */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">פרטי התבנית</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {mode === 'edit' ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {mode === 'edit' ? 'תצוגה מקדימה' : 'חזרה לעריכה'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'שומר...' : 'שמור תבנית'}
            </button>
          </div>
        </div>

        {mode === 'edit' ? (
          <div className="space-y-4">
            {/* כותרת */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כותרת התבנית *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="לדוגמה: הסכם שכירות מתקדם"
              />
            </div>

            {/* תיאור */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="תיאור קצר של התבנית"
              />
            </div>

            {/* קטגוריה */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קטגוריה *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* תגיות */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תגיות
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="הוסף תגית..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{title || 'ללא כותרת'}</h3>
            <p className="text-gray-600 mb-4">{description || 'ללא תיאור'}</p>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {categories.find(c => c.id === category)?.name}
              </span>
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {mode === 'edit' && (
        <>
          {/* שדות */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">שדות דינמיים</h2>
              <button
                onClick={handleAddField}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                הוסף שדה
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>טרם נוספו שדות. לחץ על "הוסף שדה" כדי להתחיל</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* כפתורי סידור */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveFieldUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveFieldDown(index)}
                          disabled={index === fields.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* תוכן השדה */}
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          {/* תווית */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              תווית השדה
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          {/* מזהה */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              מזהה (לתוכן)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={field.id}
                                onChange={(e) => handleUpdateField(index, { id: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                              />
                              <button
                                onClick={() => handleInsertPlaceholder(field.id)}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                                title="הוסף לתוכן"
                              >
                                הוסף
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {/* סוג שדה */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              סוג שדה
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) => handleUpdateField(index, { type: e.target.value as any })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            >
                              {fieldTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>

                          {/* קבוצה */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              קבוצה
                            </label>
                            <input
                              type="text"
                              value={field.group || ''}
                              onChange={(e) => handleUpdateField(index, { group: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              placeholder="כללי"
                            />
                          </div>

                          {/* חובה */}
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-gray-700">שדה חובה</span>
                            </label>
                          </div>
                        </div>

                        {/* placeholder */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            טקסט עזרה (placeholder)
                          </label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>

                        {/* אפשרויות לבחירה */}
                        {field.type === 'select' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              אפשרויות (מופרדות בפסיק)
                            </label>
                            <input
                              type="text"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => handleUpdateField(index, { 
                                options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              placeholder="אפשרות 1, אפשרות 2, אפשרות 3"
                            />
                          </div>
                        )}
                      </div>

                      {/* כפתור מחיקה */}
                      <button
                        onClick={() => handleRemoveField(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                        title="מחק שדה"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* תוכן התבנית */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">תוכן התבנית</h2>
            <p className="text-sm text-gray-600 mb-3">
              השתמש ב-<code className="bg-gray-100 px-2 py-1 rounded">{"{{field-id}}"}</code> כדי להוסיף שדות דינמיים לתוכן.
              לחץ על "הוסף" ליד השדה כדי להוסיף אותו אוטומטית.
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="כתוב כאן את תוכן התבנית..."
            />
          </div>
        </>
      )}

      {mode === 'preview' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">תצוגה מקדימה</h2>
          <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap font-serif">
            {renderPreview() || 'אין תוכן להצגה'}
          </div>
        </div>
      )}
    </div>
  );
}
