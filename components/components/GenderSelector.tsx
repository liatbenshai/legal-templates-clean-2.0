'use client';

import { useState } from 'react';
import { User, Users, Building2 } from 'lucide-react';
import type { Gender } from '@/lib/hebrew-gender';

/**
 * בורר מגדר - קריטי לעברית משפטית
 */

interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
  label?: string;
  showOrganization?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function GenderSelector({
  value,
  onChange,
  label = 'מגדר',
  showOrganization = true,
  size = 'medium'
}: GenderSelectorProps) {
  const sizes = {
    small: {
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-xs',
    },
    medium: {
      button: 'p-3',
      icon: 'w-5 h-5',
      text: 'text-sm',
    },
    large: {
      button: 'p-4',
      icon: 'w-6 h-6',
      text: 'text-base',
    },
  };

  const currentSize = sizes[size];

  const options = [
    {
      value: 'male' as Gender,
      label: 'זכר',
      icon: User,
      color: 'blue',
      example: 'המנוח עשה',
    },
    {
      value: 'female' as Gender,
      label: 'נקבה',
      icon: User,
      color: 'pink',
      example: 'המנוחה עשתה',
    },
    {
      value: 'plural' as Gender,
      label: 'רבים',
      icon: Users,
      color: 'purple',
      example: 'המנוחים עשו',
    },
  ];

  if (showOrganization) {
    options.push({
      value: 'organization' as Gender,
      label: 'ארגון',
      icon: Building2,
      color: 'gray',
      example: 'החברה ביצעה',
    });
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className={`grid ${showOrganization ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`${currentSize.button} rounded-lg border-2 transition flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              title={option.example}
            >
              <Icon className={`${currentSize.icon} ${isSelected ? `text-${option.color}-600` : 'text-gray-600'}`} />
              <span className={`${currentSize.text} font-medium ${isSelected ? `text-${option.color}-700` : 'text-gray-700'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* דוגמה */}
      {value && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
          <span className="text-gray-600">דוגמה: </span>
          <span className="font-medium text-gray-900" style={{ fontFamily: 'David' }}>
            {options.find(o => o.value === value)?.example}
          </span>
        </div>
      )}

      {/* הסבר */}
      <div className="text-xs text-gray-500">
        💡 הבחירה משפיעה על כל הנטיות במסמך (פעלים, תארים, כינויים)
      </div>
    </div>
  );
}

/**
 * גרסה קומפקטית - רק אייקונים
 */
export function GenderSelectorCompact({
  value,
  onChange,
  showOrganization = false
}: Omit<GenderSelectorProps, 'label' | 'size'>) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onChange('male')}
        className={`p-2 rounded ${value === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        title="זכר"
      >
        ♂
      </button>
      <button
        type="button"
        onClick={() => onChange('female')}
        className={`p-2 rounded ${value === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'}`}
        title="נקבה"
      >
        ♀
      </button>
      <button
        type="button"
        onClick={() => onChange('plural')}
        className={`p-2 rounded ${value === 'plural' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
        title="רבים"
      >
        👥
      </button>
      {showOrganization && (
        <button
          type="button"
          onClick={() => onChange('organization')}
          className={`p-2 rounded ${value === 'organization' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'}`}
          title="ארגון"
        >
          🏢
        </button>
      )}
    </div>
  );
}
