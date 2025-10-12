'use client';

import { useState, useEffect } from 'react';
import { FileText, Users, User, Plus, Trash2, Download } from 'lucide-react';

// Types
interface WillTemplate {
  id: string;
  type: string;
  gender?: string;
  title: string;
  description: string;
  structure: any;
  defaultWitnesses: any[];
  form: any;
  formatting: any;
  metadata: any;
}

interface ClauseItem {
  id: string;
  title: string;
  content: string;
  category: string;
  variables?: string[];
  isRequired?: boolean;
  sourceDoc?: string;
  tags?: string[];
}

interface Warehouse {
  id: string;
  title: string;
  items?: ClauseItem[];
  categories?: Array<{
    id: string;
    name: string;
    description: string;
    items: ClauseItem[];
  }>;
}

export default function WillTemplateBuilder() {
  const [willType, setWillType] = useState<'individual-male' | 'individual-female' | 'mutual'>('individual-male');
  const [template, setTemplate] = useState<WillTemplate | null>(null);
  const [sectionsWarehouse, setSectionsWarehouse] = useState<Warehouse | null>(null);
  const [openingsWarehouse, setOpeningsWarehouse] = useState<Warehouse | null>(null);
  const [closingsWarehouse, setClosingsWarehouse] = useState<Warehouse | null>(null);
  const [witnessesWarehouse, setWitnessesWarehouse] = useState<Warehouse | null>(null);
  
  const [formData, setFormData] = useState<any>({});
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);

  // Load template and warehouses
  useEffect(() => {
    loadTemplate(willType);
    loadWarehouses();
  }, [willType]);

  const loadTemplate = async (type: string) => {
    try {
      const response = await fetch(`/lib/templates/will-${type}.json`);
      const data = await response.json();
      setTemplate(data);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const loadWarehouses = async () => {
    try {
      const [sections, openings, closings, witnesses] = await Promise.all([
        fetch('/lib/templates/clauses/sections-warehouse.json').then(r => r.json()),
        fetch('/lib/templates/clauses/openings-warehouse.json').then(r => r.json()),
        fetch('/lib/templates/clauses/closings-warehouse.json').then(r => r.json()),
        fetch('/lib/templates/clauses/witnesses-warehouse.json').then(r => r.json())
      ]);
      
      setSectionsWarehouse(sections);
      setOpeningsWarehouse(openings);
      setClosingsWarehouse(closings);
      setWitnessesWarehouse(witnesses);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    }
  };

  const handleWillTypeChange = (type: 'individual-male' | 'individual-female' | 'mutual') => {
    setWillType(type);
    setFormData({});
    setSelectedClauses([]);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleClause = (clauseId: string) => {
    setSelectedClauses(prev => 
      prev.includes(clauseId) 
        ? prev.filter(id => id !== clauseId)
        : [...prev, clauseId]
    );
  };

  const generateDocument = () => {
    if (!template) return;

    // Build document from template + selected clauses
    const document = {
      template: template,
      formData: formData,
      selectedClauses: selectedClauses,
      generatedAt: new Date().toISOString()
    };

    console.log('Generated Document:', document);
    // TODO: Generate actual Word/PDF document
  };

  if (!template || !sectionsWarehouse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען תבניות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          בונה צוואות מקצועי
        </h1>
        <p className="text-gray-600">
          מערכת מתקדמת לבניית צוואות מבוססות על 9 צוואות אמיתיות
        </p>
      </div>

      {/* Will Type Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">בחר סוג צוואה</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleWillTypeChange('individual-male')}
            className={`p-6 rounded-lg border-2 transition-all ${
              willType === 'individual-male'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <User className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-bold text-lg mb-2">צוואת יחיד - זכר</h3>
            <p className="text-sm text-gray-600">
              צוואה אישית לזכר עם מבנה משפטי מלא
            </p>
          </button>

          <button
            onClick={() => handleWillTypeChange('individual-female')}
            className={`p-6 rounded-lg border-2 transition-all ${
              willType === 'individual-female'
                ? 'border-pink-600 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <User className="w-8 h-8 mx-auto mb-3 text-pink-600" />
            <h3 className="font-bold text-lg mb-2">צוואת יחיד - נקבה</h3>
            <p className="text-sm text-gray-600">
              צוואה אישית לנקבה עם מבנה משפטי מלא
            </p>
          </button>

          <button
            onClick={() => handleWillTypeChange('mutual')}
            className={`p-6 rounded-lg border-2 transition-all ${
              willType === 'mutual'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-bold text-lg mb-2">צוואה הדדית</h3>
            <p className="text-sm text-gray-600">
              צוואה משותפת לבני זוג עם הגנות מלאות
            </p>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">פרטי המצווה</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {template.form.testator && Object.entries(template.form.testator).map(([key, field]: [string, any]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={formData[key] || ''}
                onChange={(e) => handleFormChange(key, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Clauses Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">בחירת סעיפים</h2>
        
        {sectionsWarehouse.categories && sectionsWarehouse.categories.map((category: any) => (
          <div key={category.id} className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{category.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            
            <div className="space-y-2">
              {category.items.map((item: ClauseItem) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedClauses.includes(item.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleClause(item.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">{item.title}</span>
                        {item.isRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            חובה
                          </span>
                        )}
                        <span className="text-xs text-gray-500">({item.id})</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{item.content}</p>
                      {item.tags && (
                        <div className="flex gap-2 mt-2">
                          {item.tags.map((tag: string) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mr-4">
                      <input
                        type="checkbox"
                        checked={selectedClauses.includes(item.id)}
                        onChange={() => toggleClause(item.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={generateDocument}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-bold"
        >
          <Download className="w-6 h-6" />
          יצירת צוואה
        </button>
      </div>
    </div>
  );
}

