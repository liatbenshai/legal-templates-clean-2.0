'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Eye, Edit3, AlertCircle, CheckCircle2, Download } from 'lucide-react';

interface DetectedField {
  id: string;
  text: string;
  suggestion: string;
  type: 'text' | 'number' | 'date' | 'select';
  position: number;
  confidence: number;
}

interface WordTemplate {
  title: string;
  content: string;
  detectedFields: DetectedField[];
  originalDocument: File;
}

interface WordImporterProps {
  onTemplateCreated: (template: WordTemplate) => void;
}

const WordImporter: React.FC<WordImporterProps> = ({ onTemplateCreated }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [templateTitle, setTemplateTitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // דפוסי זיהוי שדות נפוצים במסמכים משפטיים
  const fieldPatterns = [
    { pattern: /____+/g, suggestion: 'שדות ריקים', type: 'text' as const },
    { pattern: /\[.*?\]/g, suggestion: 'שדות בסוגריים מרובעים', type: 'text' as const },
    { pattern: /\{.*?\}/g, suggestion: 'שדות בסוגריים מסולסלים', type: 'text' as const },
    { pattern: /\b\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}\b/g, suggestion: 'תאריך', type: 'date' as const },
    { pattern: /\b\d{9}\b/g, suggestion: 'תעודת זהות', type: 'text' as const },
    { pattern: /שם המצווה|המצווה|המוריש/gi, suggestion: 'שם המצווה', type: 'text' as const },
    { pattern: /שם המוטב|המוטב/gi, suggestion: 'שם המוטב', type: 'text' as const },
    { pattern: /שם העד|העד/gi, suggestion: 'שם העד', type: 'text' as const },
    { pattern: /כתובת|מען|מגורים/gi, suggestion: 'כתובת', type: 'text' as const },
    { pattern: /סכום|מחיר|שווי/gi, suggestion: 'סכום כספי', type: 'number' as const },
  ];

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
      
      if (fileExtension !== 'docx' && fileExtension !== 'doc') {
        throw new Error('רק קבצי Word (.docx, .doc) נתמכים');
      }

      // קריאת קובץ Word
      const content = await extractWordContent(file);
      setDocumentContent(content);
      setTemplateTitle(file.name.replace(/\.[^/.]+$/, ''));

      // זיהוי שדות אוטומטי
      const fields = detectFields(content);
      setDetectedFields(fields);
      setSelectedFields(new Set(fields.map(f => f.id)));

      setSuccess(`המסמך יובא בהצלחה. זוהו ${fields.length} שדות פוטנציאליים`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בייבוא הקובץ');
    } finally {
      setLoading(false);
    }
  };

  const extractWordContent = async (file: File): Promise<string> => {
    // זוהי פונקציה מפושטת - בפועל נצטרך להשתמש בספרייה כמו mammoth.js
    // לעת עתה נחזיר טקסט דמה עד שנוסיף את הספרייה
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // זוהי דמיית החלצת טקסט מ-Word
        // בפועל נשתמש בספרייה מתאימה
        const dummyContent = `
צוואה

אני הח"מ [שם המצווה], ת.ז. ______, מען: [כתובת המצווה], בהיותי בדעה צלולה ובבריאות טובה, מצווה בזה צוואתי האחרונה:

1. אני מוריש את כל רכושי לבני/בתי: [שם היורש]

2. אני ממנה כמנהל עזבון את: [שם המנהל]

3. צוואה זו מבטלת כל צוואה קודמת

תאריך: __/__/____

חתימת המצווה: ________________

עדים:
עד 1: _____________ ת.ז: _________
עד 2: _____________ ת.ז: _________
        `;
        resolve(dummyContent);
      };
      reader.readAsText(file);
    });
  };

  const detectFields = (content: string): DetectedField[] => {
    const fields: DetectedField[] = [];
    let fieldCounter = 0;

    fieldPatterns.forEach((pattern) => {
      let match;
      const regex = new RegExp(pattern.pattern);
      
      while ((match = regex.exec(content)) !== null) {
        fieldCounter++;
        fields.push({
          id: `field_${fieldCounter}`,
          text: match[0],
          suggestion: pattern.suggestion,
          type: pattern.type,
          position: match.index,
          confidence: calculateConfidence(match[0], pattern.suggestion)
        });
      }
    });

    // מיון לפי עמדה במסמך
    return fields.sort((a, b) => a.position - b.position);
  };

  const calculateConfidence = (text: string, suggestion: string): number => {
    // אלגוריתם פשוט לחישוב רמת ביטחון
    if (text.includes('____')) return 0.9;
    if (text.includes('[') || text.includes(']')) return 0.8;
    if (text.includes('{') || text.includes('}')) return 0.8;
    if (suggestion.includes('תאריך')) return 0.7;
    if (suggestion.includes('זהות')) return 0.7;
    return 0.5;
  };

  const toggleFieldSelection = (fieldId: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldId)) {
      newSelected.delete(fieldId);
    } else {
      newSelected.add(fieldId);
    }
    setSelectedFields(newSelected);
  };

  const generateTemplate = () => {
    if (!templateTitle.trim()) {
      setError('אנא הזן כותרת לתבנית');
      return;
    }

    let templateContent = documentContent;
    const selectedFieldsArray = detectedFields.filter(f => selectedFields.has(f.id));

    // החלפת השדות שנבחרו בפלייסהולדרים
    selectedFieldsArray.forEach((field, index) => {
      const placeholder = `{{${field.suggestion.replace(/\s+/g, '_').toLowerCase()}_${index + 1}}}`;
      templateContent = templateContent.replace(field.text, placeholder);
    });

    const template: WordTemplate = {
      title: templateTitle,
      content: templateContent,
      detectedFields: selectedFieldsArray,
      originalDocument: new File([''], 'original.docx') // זה יהיה הקובץ המקורי
    };

    onTemplateCreated(template);
    setSuccess('התבנית נוצרה בהצלחה!');
    
    // איפוס הטופס
    setDocumentContent('');
    setDetectedFields([]);
    setSelectedFields(new Set());
    setTemplateTitle('');
  };

  const renderPreview = () => {
    if (!documentContent) return null;

    let previewContent = documentContent;
    detectedFields.forEach((field) => {
      if (selectedFields.has(field.id)) {
        previewContent = previewContent.replace(
          field.text, 
          `<mark class="bg-yellow-200 px-1 rounded">${field.suggestion}</mark>`
        );
      }
    });

    return (
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-3">תצוגה מקדימה של התבנית:</h4>
        <div 
          className="bg-white p-4 rounded border min-h-40 whitespace-pre-wrap font-david text-right"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ייבוא מסמך Word</h3>
        
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
            accept=".docx,.doc"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            גרור מסמך Word או לחץ לבחירה
          </p>
          <p className="text-sm text-gray-500 mb-4">
            נתמך: .docx, .doc (עד 50MB)
          </p>
          
          {loading && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>מעבד מסמך...</span>
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

        {/* הנחיות */}
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">טיפים להכנת המסמך:</h4>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li>• השתמש בקווים תחתונים (____) לשדות שצריכים מילוי</li>
            <li>• עטוף טקסט בסוגריים מרובעים [שם השדה] לזיהוי טוב יותר</li>
            <li>• השתמש בכותרות ברורות לכל חלק במסמך</li>
            <li>• שמור על פורמט אחיד לתאריכים ומספרים</li>
          </ul>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">📄 רוצה לנסות עם דוגמה?</h5>
            <p className="text-sm text-blue-700 mb-3">
              הורד תבנית צוואה לדוגמה עם שדות לזיהוי אוטומטי
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <a
                href="/examples/will-template-example.txt"
                download
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                <Download className="h-4 w-4" />
                TXT
              </a>
              <a
                href="/examples/will-template-example.rtf"
                download
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
              >
                <Download className="h-4 w-4" />
                RTF
              </a>
              <a
                href="/examples/custom-will-example.html"
                download
                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
              >
                <Download className="h-4 w-4" />
                HTML
              </a>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <h6 className="font-medium text-yellow-800 mb-1">🎯 כיצד המערכת עובדת:</h6>
              <div className="text-xs text-yellow-700 space-y-1">
                <div><strong>פורמט תבניות:</strong> HTML עם placeholders מסגנון <code>{'{{variable}}'}</code></div>
                <div><strong>מנוע:</strong> Handlebars-like עם תנאים ולולאות</div>
                <div><strong>ייצוא:</strong> PDF מלא ב-RTL, Word, או HTML להדפסה</div>
              </div>
            </div>
            
            <div className="text-xs text-blue-600 space-y-1">
              <div>📄 <strong>TXT:</strong> פתח ב-Word ← העתק ← שמור כ-.docx</div>
              <div>📝 <strong>RTF:</strong> יפתח ישירות ב-Word ← שמור כ-.docx</div>
              <div>🌐 <strong>HTML:</strong> תבנית מלאה עם placeholders מתקדמים</div>
            </div>
          </div>
        </div>
      </div>

      {/* שדות שזוהו */}
      {detectedFields.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            שדות שזוהו אוטומטית ({detectedFields.length})
          </h4>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {detectedFields.map((field) => (
              <div
                key={field.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                  selectedFields.has(field.id) 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFields.has(field.id)}
                  onChange={() => toggleFieldSelection(field.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{field.suggestion}</div>
                  <div className="text-sm text-gray-500 font-mono">
                    "{field.text}"
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className={`px-2 py-1 rounded-full text-white text-xs ${
                    field.confidence > 0.8 ? 'bg-green-500' :
                    field.confidence > 0.6 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {Math.round(field.confidence * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* יצירת התבנית */}
          <div className="mt-6 border-t pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כותרת התבנית
              </label>
              <input
                type="text"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="לדוגמה: תבנית צוואת יחיד"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? 'הסתר תצוגה' : 'הצג תצוגה מקדימה'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDocumentContent('');
                    setDetectedFields([]);
                    setSelectedFields(new Set());
                    setTemplateTitle('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition"
                >
                  אפס הכל
                </button>
                <button
                  onClick={generateTemplate}
                  disabled={selectedFields.size === 0 || !templateTitle.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
                >
                  צור תבנית
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* תצוגה מקדימה */}
      {showPreview && documentContent && renderPreview()}
    </div>
  );
};

export default WordImporter;
