'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Tag, Plus } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export default function TagsInput({ 
  tags, 
  onChange, 
  suggestions = [],
  placeholder = 'הוסף תגית והקש Enter' 
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // מחיקת תגית אחרונה בלחיצה על Backspace כשהשדה ריק
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const filteredSuggestions = suggestions.filter(
    s => !tags.includes(s) && s.includes(inputValue)
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Tag className="w-4 h-4 inline ml-1" />
        תגיות
      </label>
      
      <div className="relative">
        {/* אזור התגיות + שדה קלט */}
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-white min-h-[3rem]">
          {/* תגיות קיימות */}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition"
                title="הסר תגית"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {/* שדה קלט */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[150px] outline-none bg-transparent"
          />
        </div>

        {/* הצעות */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addTag(suggestion)}
                className="w-full px-4 py-2 text-right hover:bg-blue-50 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* טקסט עזר */}
      <p className="text-xs text-gray-500">
        הקלד תגית והקש Enter להוספה • לחץ על X להסרה • תגיות עוזרות לארגן ולמצוא תבניות
      </p>

      {/* תגיות מוצעות נפוצות */}
      {tags.length === 0 && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-gray-500">מוצע:</span>
          {suggestions.slice(0, 5).map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addTag(suggestion)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
