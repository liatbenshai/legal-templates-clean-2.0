'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle2, X } from 'lucide-react';

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

interface FieldImporterProps {
  onFieldsImported: (fields: Field[]) => void;
  existingFields?: Field[];
}

const FieldImporter: React.FC<FieldImporterProps> = ({
  onFieldsImported,
  existingFields = []
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [importedFields, setImportedFields] = useState<Field[]>([]);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // טיפול בגרירת קבצים
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let fields: Field[] = [];

      if (fileExtension === 'json') {
        fields = await parseJSONFile(file);
      } else if (fileExtension === 'csv') {
        fields = await parseCSVFile(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        fields = await parseExcelFile(file);
      } else {
        throw new Error('פורמט קובץ לא נתמך. אנא השתמש ב-JSON, CSV או Excel');
      }

      setImportedFields(fields);
      setSelectedFields(new Set(fields.map(f => f.name)));
      setSuccess(`יובאו ${fields.length} שדות בהצלחה`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בייבוא הקובץ');
    } finally {
      setLoading(false);
    }
  };

  const parseJSONFile = async (file: File): Promise<Field[]> => {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      throw new Error('קובץ JSON חייב להכיל מערך של שדות');
    }
    
    return data.map((item: any) => ({
      name: item.name || item.field || item.key,
      label: item.label || item.title || item.name,
      type: item.type || 'text',
      required: item.required || false,
      options: item.options,
      defaultValue: item.defaultValue || item.default,
      placeholder: item.placeholder,
      validation: item.validation
    }));
  };

  const parseCSVFile = async (file: File): Promise<Field[]> => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('קובץ CSV ריק');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name') || h.includes('שם'));
    const labelIndex = headers.findIndex(h => h.toLowerCase().includes('label') || h.includes('תווית'));
    const typeIndex = headers.findIndex(h => h.toLowerCase().includes('type') || h.includes('סוג'));

    if (nameIndex === -1) {
      throw new Error('לא נמצא עמוד "name" או "שם" בקובץ CSV');
    }

    const fields: Field[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length > nameIndex && values[nameIndex]) {
        fields.push({
          name: values[nameIndex],
          label: values[labelIndex] || values[nameIndex],
          type: (values[typeIndex] as Field['type']) || 'text',
          required: false
        });
      }
    }

    return fields;
  };

  const parseExcelFile = async (file: File): Promise<Field[]> => {
    // כאן נצטרך לטעון ספרייה כמו SheetJS
    // לעת עתה נזרוק שגיאה ונאמר שזה יבוא בגרסה הבאה
    throw new Error('תמיכה בקבצי Excel תבוא בעדכון הבא');
  };

  const toggleFieldSelection = (fieldName: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldName)) {
      newSelected.delete(fieldName);
    } else {
      newSelected.add(fieldName);
    }
    setSelectedFields(newSelected);
  };

  const handleImport = () => {
    const fieldsToImport = importedFields.filter(f => selectedFields.has(f.name));
    onFieldsImported(fieldsToImport);
    setImportedFields([]);
    setSelectedFields(new Set());
    setSuccess(`יובאו ${fieldsToImport.length} שדות למערכת`);
  };

  const downloadTemplate = (format: 'json' | 'csv') => {
    const templateFields: Field[] = [
      {
        name: 'client_name',
        label: 'שם הלקוח',
        type: 'text',
        required: true,
        placeholder: 'הזן שם מלא'
      },
      {
        name: 'client_id',
        label: 'תעודת זהות',
        type: 'text',
        required: true,
        validation: '^\\d{9}$'
      },
      {
        name: 'document_type',
        label: 'סוג מסמך',
        type: 'select',
        required: true,
        options: ['צוואה', 'הסכם', 'ייפוי כוח', 'תצהיר']
      }
    ];

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(templateFields, null, 2)], { type: 'application/json' });
      downloadBlob(blob, 'fields-template.json');
    } else {
      const csv = 'name,label,type,required,options,defaultValue,placeholder,validation\n' +
        templateFields.map(f => 
          `${f.name},${f.label},${f.type},${f.required},${f.options?.join('|') || ''},${f.defaultValue || ''},${f.placeholder || ''},${f.validation || ''}`
        ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadBlob(blob, 'fields-template.csv');
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ייבוא שדות</h3>
        
        {/* אזור העלאה */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".json,.csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            גרור קובץ או לחץ לבחירה
          </p>
          <p className="text-sm text-gray-500 mb-4">
            נתמך: JSON, CSV, Excel (עד 10MB)
          </p>
          
          {loading && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>טוען קובץ...</span>
            </div>
          )}
        </div>

        {/* הודעות */}
        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <span>{success}</span>
          </div>
        )}

        {/* תבניות לדוגמה */}
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">הורד תבניות לדוגמה:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => downloadTemplate('json')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
            >
              <Download className="h-4 w-4" />
              JSON פשוט
            </button>
            <button
              onClick={() => downloadTemplate('csv')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
            >
              <Download className="h-4 w-4" />
              CSV פשוט  
            </button>
            <a
              href="/examples/client-fields-example.json"
              download
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium transition text-blue-700"
            >
              <Download className="h-4 w-4" />
              JSON מלא
            </a>
            <a
              href="/examples/legal-fields-example.csv" 
              download
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium transition text-blue-700"
            >
              <Download className="h-4 w-4" />
              CSV משפטי
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 הקבצים הכחולים כוללים שדות משפטיים אמיתיים לדוגמה
          </p>
        </div>
      </div>

      {/* שדות שיובאו */}
      {importedFields.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            שדות שיובאו ({importedFields.length})
          </h4>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {importedFields.map((field, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  selectedFields.has(field.name) 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFields.has(field.name)}
                  onChange={() => toggleFieldSelection(field.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{field.label}</div>
                  <div className="text-sm text-gray-500">
                    {field.name} • {field.type}
                    {field.required && ' • נדרש'}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {existingFields.some(f => f.name === field.name) && (
                    <span className="text-orange-600">קיים במערכת</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600">
              נבחרו {selectedFields.size} מתוך {importedFields.length} שדות
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => setImportedFields([])}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition"
              >
                ביטול
              </button>
              <button
                onClick={handleImport}
                disabled={selectedFields.size === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
              >
                יבא שדות נבחרים
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldImporter;
