'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Save, FileText } from 'lucide-react';
import TemplateBuilder from '@/components/TemplateBuilder';

export default function CreateTemplatePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTemplate = async (templateData: any) => {
    setIsSaving(true);
    
    try {
      // שמירה ל-localStorage
      const existingTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      const newTemplate = {
        ...templateData,
        id: `custom-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'משתמש',
        isCustom: true,
      };
      
      existingTemplates.push(newTemplate);
      localStorage.setItem('customTemplates', JSON.stringify(existingTemplates));
      
      alert('התבנית נשמרה בהצלחה! ✅');
      router.push('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('שגיאה בשמירת התבנית');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  בניית תבנית חדשה
                </h1>
                <p className="text-sm text-gray-600">
                  צור תבנית מותאמת אישית עם שדות ועיצוב משלך
                </p>
              </div>
            </div>
            
            <Link
              href="/templates"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span>חזרה לתבניות</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <TemplateBuilder
          onSave={handleSaveTemplate}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}

