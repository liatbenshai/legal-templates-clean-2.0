'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getTemplateById } from '@/lib/templates';
import { structuredTemplates } from '@/lib/document-templates';
import { DocumentStructure } from '@/lib/editor-types';
import TemplateEditor from '@/components/AdvancedEditor/TemplateEditor';
import FieldsForm from '@/components/FieldsForm';
import DocumentPreview from '@/components/DocumentPreview';
import AIWritingAssistant from '@/components/AIWritingAssistant';
import { renderDocumentToHTML } from '@/lib/document-renderer';
import { Save, Eye, Download, FileText } from 'lucide-react';

function EditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const [currentView, setCurrentView] = useState<'form' | 'editor' | 'preview'>('form');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [document, setDocument] = useState<DocumentStructure | null>(null);

  useEffect(() => {
    if (templateId) {
      // חיפוש תבנית רגילה או מובנית
      const regularTemplate = getTemplateById(templateId);
      const structuredTemplate = structuredTemplates.find(t => t.id === templateId);
      
      if (structuredTemplate) {
        setSelectedTemplate(structuredTemplate);
        setDocument(structuredTemplate.document);
        setCurrentView('form');
      } else if (regularTemplate) {
        setSelectedTemplate(regularTemplate);
        setCurrentView('form');
      }
    }
  }, [templateId]);

  const handleFormSubmit = () => {
    if (!isFormValid) {
      alert('נא למלא את כל השדות החובה');
      return;
    }
    setCurrentView('editor');
  };

  const handleSave = async (doc: DocumentStructure) => {
    // שמירה ל-localStorage או שליחה לשרת
    try {
      const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
      const newDoc = {
        id: `saved-${Date.now()}`,
        templateId: selectedTemplate?.id,
        title: doc.title,
        document: doc,
        filledData: formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      };
      
      savedDocs.push(newDoc);
      localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
      
      alert('המסמך נשמר בהצלחה!');
    } catch (error) {
      console.error('Error saving document:', error);
      alert('שגיאה בשמירת המסמך');
    }
  };

  const handlePreview = (doc: DocumentStructure) => {
    setDocument(doc);
    setCurrentView('preview');
  };

  const handleExport = async (doc: DocumentStructure, format: 'pdf' | 'docx' | 'html') => {
    // ייצוא יתווסף בקרוב עם המודולים החדשים
    alert(`ייצוא ל-${format.toUpperCase()} יהיה זמין במערכת החדשה!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedTemplate?.title || 'עורך מסמכים'}
                </h1>
                {selectedTemplate && (
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.description}
                  </p>
                )}
              </div>
            </div>

            {/* תפריט צעדים */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('form')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentView === 'form'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                1. מילוי שדות
              </button>
              <button
                onClick={() => setCurrentView('editor')}
                disabled={!isFormValid && currentView === 'form'}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentView === 'editor'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                2. עריכה ועיצוב
              </button>
              <button
                onClick={() => setCurrentView('preview')}
                disabled={!document}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentView === 'preview'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                3. תצוגה מקדימה
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* טופס מילוי שדות */}
        {currentView === 'form' && selectedTemplate && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  מילוי פרטי המסמך
                </h2>
                <AIWritingAssistant
                  onTextGenerated={(text) => {
                    // הוספת טקסט שנוצר לשדה נוכחי
                    console.log('Generated text:', text);
                  }}
                  documentType={selectedTemplate.category}
                />
              </div>

              <FieldsForm
                fields={selectedTemplate.fields}
                initialData={formData}
                onChange={setFormData}
                onValidation={setIsFormValid}
              />

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleFormSubmit}
                  disabled={!isFormValid}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <span>המשך לעריכה</span>
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* הנחיות */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3">💡 הנחיות למילוי</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• מלא את כל השדות המסומנים בכוכבית אדומה (שדות חובה)</li>
                <li>• השתמש בעוזר AI לניסוח טקסטים משפטיים מקצועיים</li>
                <li>• ניתן לחזור ולערוך את השדות בכל שלב</li>
                <li>• המידע נשמר אוטומטית במכשיר שלך</li>
              </ul>
            </div>
          </div>
        )}

        {/* עורך מתקדם */}
        {currentView === 'editor' && document && (
          <TemplateEditor
            initialDocument={document}
            onSave={handleSave}
            onPreview={handlePreview}
            onExport={(doc) => handleExport(doc, 'html')}
          />
        )}

        {/* תצוגה מקדימה */}
        {currentView === 'preview' && document && (
          <div className="h-screen">
            <DocumentPreview
              document={document}
              data={formData}
              onExport={(format) => handleExport(document, format)}
            />
          </div>
        )}

        {/* אם לא נבחרה תבנית */}
        {!selectedTemplate && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                התחל ליצור מסמך חדש
              </h2>
              <p className="text-gray-600 mb-8">
                בחר תבנית מהרשימה או צור מסמך חדש מאפס
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/templates"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  בחר תבנית
                </Link>
                <button
                  onClick={() => {
                    // יצירת מסמך ריק
                    setCurrentView('editor');
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  התחל מאפס
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען עורך...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
