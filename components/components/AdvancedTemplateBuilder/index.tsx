'use client';

import { useState } from 'react';
import { Save, FileText, Settings, List, Eye, ArrowRight, Layout } from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import AdvancedFieldsEditor from './AdvancedFieldsEditor';
import BlockEditor from './BlockEditor';
import TemplatePreview from './TemplatePreview';

interface AdvancedTemplateBuilderProps {
  onSave: (templateData: any) => void;
  isSaving?: boolean;
}

type BuilderStep = 'general' | 'fields' | 'content' | 'preview';

export default function AdvancedTemplateBuilder({ onSave, isSaving = false }: AdvancedTemplateBuilderProps) {
  const [currentStep, setCurrentStep] = useState<BuilderStep>('general');
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    category: 'contracts',
    tags: [] as string[],
    fields: [] as any[],
    blocks: [] as any[],
    pageSettings: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 2.5, right: 2, bottom: 2.5, left: 2 },
      header: '',
      footer: '',
      pageNumbers: true,
    },
    styles: {
      fontFamily: 'Arial',
      fontSize: 12,
      lineHeight: 1.5,
      direction: 'rtl',
    },
    version: '1.0',
    isPublic: true,
  });

  const handleSave = () => {
    if (!templateData.title) {
      alert('נא להזין שם לתבנית');
      return;
    }
    if (templateData.fields.length === 0) {
      alert('נא להוסיף לפחות שדה אחד');
      return;
    }
    if (templateData.blocks.length === 0) {
      alert('נא להוסיף לפחות בלוק אחד לתוכן');
      return;
    }
    
    onSave(templateData);
  };

  const steps = [
    { id: 'general', name: '1. הגדרות', icon: Settings },
    { id: 'fields', name: '2. שדות', icon: List },
    { id: 'content', name: '3. תוכן ועיצוב', icon: Layout },
    { id: 'preview', name: '4. תצוגה', icon: Eye },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* תפריט צעדים */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id as BuilderStep)}
                className={`flex flex-col items-center gap-2 px-4 py-4 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm text-center">{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* תוכן */}
      <div className="bg-white rounded-xl shadow-md">
        {currentStep === 'general' && (
          <GeneralSettings
            data={templateData}
            onChange={setTemplateData}
            onNext={() => setCurrentStep('fields')}
          />
        )}
        
        {currentStep === 'fields' && (
          <AdvancedFieldsEditor
            fields={templateData.fields}
            onChange={(fields) => setTemplateData({ ...templateData, fields })}
            onNext={() => setCurrentStep('content')}
            onBack={() => setCurrentStep('general')}
          />
        )}
        
        {currentStep === 'content' && (
          <BlockEditor
            blocks={templateData.blocks}
            fields={templateData.fields}
            pageSettings={templateData.pageSettings}
            styles={templateData.styles}
            onChange={(blocks) => setTemplateData({ ...templateData, blocks })}
            onPageSettingsChange={(pageSettings) => setTemplateData({ ...templateData, pageSettings })}
            onStylesChange={(styles) => setTemplateData({ ...templateData, styles })}
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

