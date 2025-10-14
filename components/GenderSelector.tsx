'use client';

import { Gender } from '@/lib/hebrew-gender';

interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
  label?: string;
  className?: string;
}

export default function GenderSelector({ 
  value, 
  onChange, 
  label = 'מגדר',
  className = ''
}: GenderSelectorProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={`gender-${label}`}
            value="male"
            checked={value === 'male'}
            onChange={(e) => onChange(e.target.value as Gender)}
            className="ml-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">זכר</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={`gender-${label}`}
            value="female"
            checked={value === 'female'}
            onChange={(e) => onChange(e.target.value as Gender)}
            className="ml-2 w-4 h-4 text-pink-600 focus:ring-pink-500"
          />
          <span className="text-sm text-gray-700">נקבה</span>
        </label>
      </div>
    </div>
  );
}

