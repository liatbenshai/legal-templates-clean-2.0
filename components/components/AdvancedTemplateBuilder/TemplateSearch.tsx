'use client';

import { useState } from 'react';
import { Search, Filter, X, Tag } from 'lucide-react';

interface TemplateSearchProps {
  onSearch: (query: string) => void;
  onFilterCategory: (categoryId: string) => void;
  onFilterTags: (tags: string[]) => void;
  categories: Array<{ id: string; name: string; icon: string }>;
  availableTags: Array<{ id: string; name: string; color: string }>;
}

export default function TemplateSearch({
  onSearch,
  onFilterCategory,
  onFilterTags,
  categories,
  availableTags,
}: TemplateSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onFilterCategory(categoryId);
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(t => t !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newTags);
    onFilterTags(newTags);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
    onSearch('');
    onFilterCategory('');
    onFilterTags([]);
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    (selectedCategory ? 1 : 0) + 
    selectedTags.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* שורת חיפוש ראשית */}
      <div className="flex gap-3 mb-4">
        {/* תיבת חיפוש */}
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חפש תבנית לפי שם, תיאור או תגית..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* כפתור פילטרים */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
            showFilters || activeFiltersCount > 0
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>פילטרים</span>
          {activeFiltersCount > 0 && (
            <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* אזור פילטרים מורחב */}
      {showFilters && (
        <div className="border-t pt-4 space-y-6 animate-fadeIn">
          {/* קטגוריות */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>קטגוריות</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === ''
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                הכל
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* תגיות */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>תגיות</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition border-2 ${
                    selectedTags.includes(tag.id)
                      ? 'border-current text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                    borderColor: tag.color,
                    color: selectedTags.includes(tag.id) ? 'white' : tag.color,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* כפתור ניקוי פילטרים */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>נקה את כל הפילטרים</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
