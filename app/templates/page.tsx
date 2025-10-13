'use client';

import { useState, useMemo, useEffect } from 'react';
import { sampleTemplates, categories, updateCategoryCounts, getAllTags, getCustomTemplates } from '@/lib/templates';
import TemplateCard from '@/components/TemplateCard';
import TemplateSearch from '@/components/TemplateSearch';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);

  // טעינת תבניות מותאמות אישית
  useEffect(() => {
    const custom = getCustomTemplates();
    setCustomTemplates(custom);
  }, []);

  const updatedCategories = updateCategoryCounts();
  const availableTags = getAllTags();

  // איחוד תבניות מובנות ומותאמות אישית
  const allTemplates = [...sampleTemplates, ...customTemplates];

  // סינון תבניות
  const filteredTemplates = useMemo(() => {
    let filtered = [...allTemplates];

    // סינון לפי חיפוש
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // סינון לפי קטגוריה
    if (selectedCategory) {
      filtered = filtered.filter((template) => template.category === selectedCategory);
    }

    // סינון לפי תגיות
    if (selectedTags.length > 0) {
      filtered = filtered.filter((template) =>
        selectedTags.every((tag) => template.tags.includes(tag))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedTags, allTemplates]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-10 h-10 text-primary" />
                <h1 className="text-4xl font-bold text-gray-900">כל התבניות</h1>
              </div>
              <p className="text-xl text-gray-600">
                גלה את הספרייה המלאה של תבניות משפטיות מקצועיות
              </p>
            </div>
            
            <Link
              href="/templates/create"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>צור תבנית חדשה</span>
            </Link>
          </div>
        </div>
      </div>

      {/* תוכן */}
      <div className="container mx-auto px-4 py-8">
        {/* חיפוש וסינון */}
        <TemplateSearch
          onSearch={setSearchQuery}
          onFilterCategory={setSelectedCategory}
          onFilterTags={setSelectedTags}
          categories={updatedCategories}
          availableTags={availableTags}
        />

        {/* תוצאות */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            נמצאו <span className="font-bold text-gray-900">{filteredTemplates.length}</span> תבניות
          </p>
          
          {(searchQuery || selectedCategory || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedTags([]);
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              נקה את כל הפילטרים
            </button>
          )}
        </div>

        {/* רשת תבניות */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              לא נמצאו תבניות
            </h3>
            <p className="text-gray-600 mb-6">
              נסה לשנות את קריטריוני החיפוש או הסינון
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedTags([]);
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
            >
              נקה פילטרים
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
