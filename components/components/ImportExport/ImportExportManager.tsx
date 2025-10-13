'use client';

import React, { useState } from 'react';
import { Upload, FileText, Plus, Settings, Save, Trash2, Edit, Eye } from 'lucide-react';
import FieldImporter from './FieldImporter';
import GenderedTemplateImporter from './GenderedTemplateImporter';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
  validation?: string;
}

interface Template {
  id: string;
  title: string;
  content: string;
  fields: Field[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GenderedTemplate {
  title: string;
  originalContent: string;
  processedContent: string;
  detectedFields: any[];
  selectedGender: 'male' | 'female' | 'plural' | 'organization';
}

interface ImportExportManagerProps {
  existingTemplates?: Template[];
  onTemplateCreated?: (template: Template) => void;
  onTemplateUpdated?: (template: Template) => void;
  onTemplateDeleted?: (templateId: string) => void;
}

const ImportExportManager: React.FC<ImportExportManagerProps> = ({
  existingTemplates = [],
  onTemplateCreated,
  onTemplateUpdated,
  onTemplateDeleted
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'word' | 'templates'>('fields');
  const [importedFields, setImportedFields] = useState<Field[]>([]);
  const [createdTemplates, setCreatedTemplates] = useState<Template[]>(existingTemplates);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const tabs = [
    {
      id: 'fields' as const,
      label: 'ייבוא שדות',
      icon: Upload,
      description: 'יבא שדות מקבצי CSV, JSON או Excel'
    },
    {
      id: 'word' as const,
      label: 'ייבוא מסמך עם נטיות',
      icon: FileText,
      description: 'יבא מסמך והמר לתבנית עם נטיות מגדר אוטומטיות'
    },
    {
      id: 'templates' as const,
      label: 'ניהול תבניות',
      icon: Settings,
      description: 'נהל תבניות שנוצרו מייבוא'
    }
  ];

  const handleFieldsImported = (fields: Field[]) => {
    setImportedFields(prev => [...prev, ...fields]);
  };

  const handleGenderedTemplateCreated = (genderedTemplate: GenderedTemplate) => {
    // המרת GenderedTemplate ל-Template
    const template: Template = {
      id: `template_${Date.now()}`,
      title: genderedTemplate.title,
      content: genderedTemplate.processedContent,
      fields: genderedTemplate.detectedFields.map((df, index) => ({
        name: `${df.suggestion.replace(/\s+/g, '_').toLowerCase()}_${index + 1}`,
        label: df.suggestion,
        type: df.type,
        required: df.confidence > 0.7,
        placeholder: `הזן ${df.suggestion}`,
        genderSensitive: true
      })),
      category: `מיובא (${genderedTemplate.selectedGender === 'male' ? 'זכר' : genderedTemplate.selectedGender === 'female' ? 'נקבה' : genderedTemplate.selectedGender === 'plural' ? 'רבים' : 'ארגון'})`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCreatedTemplates(prev => [...prev, template]);
    onTemplateCreated?.(template);
  };

  const handleTemplateEdit = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleTemplateSave = (template: Template) => {
    setCreatedTemplates(prev => 
      prev.map(t => t.id === template.id ? { ...template, updatedAt: new Date() } : t)
    );
    setEditingTemplate(null);
    onTemplateUpdated?.(template);
  };

  const handleTemplateDelete = (templateId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תבנית זו?')) {
      setCreatedTemplates(prev => prev.filter(t => t.id !== templateId));
      onTemplateDeleted?.(templateId);
    }
  };

  const renderFieldsTab = () => (
    <div className="space-y-6">
      <FieldImporter
        onFieldsImported={handleFieldsImported}
        existingFields={importedFields}
      />
      
      {importedFields.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            שדות שיובאו ({importedFields.length})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {importedFields.map((field, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
              >
                <div className="font-medium text-gray-900 mb-1">{field.label}</div>
                <div className="text-sm text-gray-500 mb-2">{field.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full text-white ${
                    field.type === 'text' ? 'bg-blue-500' :
                    field.type === 'number' ? 'bg-green-500' :
                    field.type === 'date' ? 'bg-orange-500' :
                    field.type === 'select' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}>
                    {field.type}
                  </span>
                  {field.required && (
                    <span className="px-2 py-1 rounded-full bg-red-500 text-white">
                      נדרש
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderWordTab = () => (
    <GenderedTemplateImporter onTemplateCreated={handleGenderedTemplateCreated} />
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {createdTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין תבניות</h3>
          <p className="text-gray-500 mb-4">
            יבא מסמך Word או שדות כדי ליצור תבניות חדשות
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setActiveTab('fields')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              יבא שדות
            </button>
            <button
              onClick={() => setActiveTab('word')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              יבא מסמך
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {createdTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {template.fields.length} שדות • {template.category}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTemplateEdit(template)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition"
                    title="עריכה"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleTemplateDelete(template.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                    title="מחיקה"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4 max-h-20 overflow-hidden">
                {template.content.substring(0, 200)}
                {template.content.length > 200 && '...'}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  עודכן: {template.updatedAt.toLocaleDateString('he-IL')}
                </div>
                
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm">
                  <Eye className="h-4 w-4" />
                  צפה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ייבוא ויצירת תבניות
        </h1>
        <p className="text-gray-600">
          יבא שדות ומסמכים קיימים כדי ליצור תבניות חדשות במהירות
        </p>
      </div>

      {/* טאבים */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 space-x-reverse" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* תיאור הטאב הפעיל */}
        <div className="mt-4 text-sm text-gray-600">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </div>
      </div>

      {/* תוכן הטאב */}
      <div>
        {activeTab === 'fields' && renderFieldsTab()}
        {activeTab === 'word' && renderWordTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
      </div>

      {/* מודל עריכת תבנית */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                עריכת תבנית: {editingTemplate.title}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת התבנית
                </label>
                <input
                  type="text"
                  value={editingTemplate.title}
                  onChange={(e) => setEditingTemplate(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תוכן התבנית
                </label>
                <textarea
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate(prev => 
                    prev ? { ...prev, content: e.target.value } : null
                  )}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-david text-right"
                  style={{ direction: 'rtl' }}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition"
              >
                ביטול
              </button>
              <button
                onClick={() => handleTemplateSave(editingTemplate)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                שמור שינויים
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExportManager;
