'use client';

import { useId } from 'react';
import { Gender } from '@/lib/hebrew-gender';

interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
  label?: string;
  className?: string;
  name?: string; // הוספת name ייחודי
}

export default function GenderSelector({ 
  value, 
  onChange, 
  label = 'מגדר',
  className = '',
  name
}: GenderSelectorProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Gender)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="male">זכר</option>
        <option value="female">נקבה</option>
      </select>
    </div>
  );
}