'use client';

import { useState, useEffect } from 'react';
import { TemplateField } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

interface FieldsFormProps {
  fields: TemplateField[];
  initialData?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onValidation?: (isValid: boolean) => void;
}

export default function FieldsForm({ 
  fields, 
  initialData = {}, 
  onChange,
  onValidation 
}: FieldsFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // מיון שדות לפי קבוצות
  const groupedFields = fields.reduce((acc, field) => {
    const group = field.group || 'כללי';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, TemplateField[]>);

  // מיון שדות בתוך כל קבוצה
  Object.keys(groupedFields).forEach(group => {
    groupedFields[group].sort((a, b) => a.order - b.order);
  });

  useEffect(() => {
    onChange(formData);
    
    // בדיקת תקינות
    const isValid = validateForm();
    if (onValidation) {
      onValidation(isValid);
    }
  }, [formData]);

  const validateField = (field: TemplateField, value: any): string | null => {
    // בדיקת שדה חובה
    if (field.required && (!value || value.toString().trim() === '')) {
      return 'שדה חובה';
    }

    // בדיקות תקינות
    if (value && field.validation) {
      const val = field.validation;
      
      if (val.minLength && value.length < val.minLength) {
        return `מינימום ${val.minLength} תווים`;
      }
      
      if (val.maxLength && value.length > val.maxLength) {
        return `מקסימום ${val.maxLength} תווים`;
      }
      
      if (val.pattern) {
        const regex = new RegExp(val.pattern);
        if (!regex.test(value)) {
          return val.customMessage || 'פורמט לא תקין';
        }
      }
      
      if (field.type === 'number') {
        const numValue = Number(value);
        if (val.min !== undefined && numValue < val.min) {
          return `מינימום ${val.min}`;
        }
        if (val.max !== undefined && numValue > val.max) {
          return `מקסימום ${val.max}`;
        }
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));

    // בדיקת תקינות לשדה זה
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => {
        if (error) {
          return { ...prev, [fieldId]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        }
      });
    }
  };

  const renderField = (field: TemplateField) => {
    const value = formData[field.id] || field.defaultValue || '';
    const error = errors[field.id];
    const hasError = !!error;

    const baseInputClass = `w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-primary focus:border-primary'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'id-number':
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            dir="rtl"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            min={field.validation?.min}
            max={field.validation?.max}
            dir="ltr"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value === 'today' ? new Date().toISOString().split('T')[0] : value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={baseInputClass}
            dir="ltr"
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${baseInputClass} min-h-[120px] resize-y`}
            dir="rtl"
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={baseInputClass}
            dir="rtl"
          >
            <option value="">בחר...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={field.id}
              checked={value === true || value === 'true'}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor={field.id} className="text-gray-700 cursor-pointer">
              {field.label}
            </label>
          </div>
        );

      case 'address':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'רחוב, מספר בית, עיר, מיקוד'}
            className={`${baseInputClass} min-h-[80px] resize-y`}
            dir="rtl"
          />
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            dir="rtl"
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedFields).map(([groupName, groupFields]) => (
        <div key={groupName} className="bg-white rounded-lg border border-gray-200 p-6">
          {/* כותרת קבוצה */}
          <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            {groupName}
          </h3>

          {/* שדות */}
          <div className="space-y-5">
            {groupFields.map((field) => (
              <div key={field.id}>
                {field.type !== 'checkbox' && (
                  <label 
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 mr-1">*</span>}
                  </label>
                )}

                {renderField(field)}

                {/* טקסט עזרה */}
                {field.helpText && !errors[field.id] && (
                  <p className="mt-2 text-sm text-gray-500">
                    {field.helpText}
                  </p>
                )}

                {/* שגיאה */}
                {errors[field.id] && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors[field.id]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

