'use client';

/**
 * דף ניהול סעיפי הנחיות מקדימות
 * ================================
 * 
 * מאפשר:
 * - צפייה בכל הסעיפים
 * - עריכת סעיפים קיימים
 * - הוספת סעיפים חדשים
 * - מחיקת סעיפים
 * - חיפוש וסינון
 */

import { useState, useEffect } from 'react';
import { useAdvanceDirectivesSections, AdvanceDirectivesSection } from '@/lib/hooks/useAdvanceDirectivesSections';
import { 
  Plus, Search, Edit2, Trash2, Save, X, 
  ChevronDown, ChevronRight, Tag, RefreshCw,
  AlertCircle, CheckCircle, Home, User, Heart
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  property: <Home className="w-5 h-5" />,
  personal: <User className="w-5 h-5" />,
  medical: <Heart className="w-5 h-5" />
};

const categoryColors: Record<string, string> = {
  property: 'bg-green-100 text-green-800 border-green-300',
  personal: 'bg-blue-100 text-blue-800 border-blue-300',
  medical: 'bg-red-100 text-red-800 border-red-300'
};

const categoryNames: Record<string, string> = {
  property: 'עניינים רכושיים',
  personal: 'עניינים אישיים',
  medical: 'עניינים רפואיים'
};

export default function AdvanceDirectivesAdminPage() {
  const {
    sections,
    categories,
    subcategories,
    isLoading,
    error,
    fetchSections,
    createSection,
    updateSection,
    deleteSection
  } = useAdvanceDirectivesSections();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] = useState<AdvanceDirectivesSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // סינון סעיפים
  const filteredSections = sections.filter(section => {
    const matchesSearch = !searchQuery || 
      section.title.includes(searchQuery) || 
      section.content.includes(searchQuery) ||
      section.tags.some(tag => tag.includes(searchQuery));
    
    const matchesCategory = !selectedCategory || section.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // קיבוץ לפי קטגוריה
  const groupedSections = filteredSections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, AdvanceDirectivesSection[]>);

  // Toggle expand
  const toggleExpand = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // שמירת עריכה
  const handleSave = async () => {
    if (!editingSection) return;
    
    const success = await updateSection(editingSection.id, {
      title: editingSection.title,
      content: editingSection.content,
      tags: editingSection.tags
    });

    if (success) {
      setNotification({ type: 'success', message: 'הסעיף נשמר בהצלחה!' });
      setEditingSection(null);
    } else {
      setNotification({ type: 'error', message: 'שגיאה בשמירת הסעיף' });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  // יצירת סעיף חדש
  const handleCreate = async (newSection: Partial<AdvanceDirectivesSection>) => {
    const created = await createSection(newSection);
    
    if (created) {
      setNotification({ type: 'success', message: 'הסעיף נוצר בהצלחה!' });
      setIsCreating(false);
    } else {
      setNotification({ type: 'error', message: 'שגיאה ביצירת הסעיף' });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  // מחיקת סעיף
  const handleDelete = async (id: string) => {
    if (!confirm('האם למחוק את הסעיף?')) return;
    
    const success = await deleteSection(id);
    
    if (success) {
      setNotification({ type: 'success', message: 'הסעיף נמחק בהצלחה!' });
    } else {
      setNotification({ type: 'error', message: 'שגיאה במחיקת הסעיף' });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ניהול סעיפי הנחיות מקדימות
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                ייפוי כוח מתמשך - {sections.length} סעיפים
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchSections()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="רענון"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-5 h-5" />
                סעיף חדש
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חיפוש סעיפים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  !selectedCategory ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                הכל
              </button>
              {['property', 'personal', 'medical'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                    selectedCategory === cat 
                      ? categoryColors[cat] 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {categoryIcons[cat]}
                  {categoryNames[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">טוען סעיפים...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Sections List */}
        {!isLoading && Object.entries(groupedSections).map(([category, categorySections]) => (
          <div key={category} className="mb-6">
            <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
              category === 'property' ? 'text-green-700' :
              category === 'personal' ? 'text-blue-700' : 'text-red-700'
            }`}>
              {categoryIcons[category]}
              {categoryNames[category]}
              <span className="text-gray-400 text-sm font-normal">
                ({categorySections.length} סעיפים)
              </span>
            </h2>

            <div className="space-y-2">
              {categorySections.map(section => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  {/* Section Header */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {section.section_id} • {section.subcategory}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {section.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSection({ ...section });
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(section.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedSections.has(section.id) && (
                    <div className="px-4 pb-4 border-t pt-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg font-sans">
                        {section.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!isLoading && filteredSections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Search className="w-12 h-12 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">לא נמצאו סעיפים</h3>
            <p className="text-gray-500">נסה לשנות את החיפוש או הסינון</p>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">עריכת סעיף</h2>
              <button
                onClick={() => setEditingSection(null)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  כותרת
                </label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    title: e.target.value
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תוכן
                </label>
                <textarea
                  value={editingSection.content}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    content: e.target.value
                  })}
                  rows={12}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תגיות (מופרדות בפסיקים)
                </label>
                <input
                  type="text"
                  value={editingSection.tags.join(', ')}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                שמירה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <CreateSectionModal
          onClose={() => setIsCreating(false)}
          onCreate={handleCreate}
          categories={categories}
          subcategories={subcategories}
        />
      )}
    </div>
  );
}

// Create Section Modal Component
function CreateSectionModal({
  onClose,
  onCreate,
  categories,
  subcategories
}: {
  onClose: () => void;
  onCreate: (section: Partial<AdvanceDirectivesSection>) => void;
  categories: any[];
  subcategories: any[];
}) {
  const [newSection, setNewSection] = useState({
    category: 'personal' as const,
    subcategory: 'custom',
    title: '',
    content: '',
    tags: [] as string[]
  });

  const filteredSubcategories = subcategories.filter(
    sub => sub.parent_id === newSection.category
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">סעיף חדש</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                קטגוריה
              </label>
              <select
                value={newSection.category}
                onChange={(e) => setNewSection({
                  ...newSection,
                  category: e.target.value as any,
                  subcategory: 'custom'
                })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="property">עניינים רכושיים</option>
                <option value="personal">עניינים אישיים</option>
                <option value="medical">עניינים רפואיים</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תת-קטגוריה
              </label>
              <select
                value={newSection.subcategory}
                onChange={(e) => setNewSection({
                  ...newSection,
                  subcategory: e.target.value
                })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {filteredSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
                <option value="custom">מותאם אישית</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כותרת
            </label>
            <input
              type="text"
              value={newSection.title}
              onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
              placeholder="כותרת הסעיף"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תוכן
            </label>
            <textarea
              value={newSection.content}
              onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
              rows={10}
              placeholder="תוכן הסעיף..."
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תגיות (מופרדות בפסיקים)
            </label>
            <input
              type="text"
              value={newSection.tags.join(', ')}
              onChange={(e) => setNewSection({
                ...newSection,
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              placeholder="תגית1, תגית2, ..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            ביטול
          </button>
          <button
            onClick={() => onCreate(newSection)}
            disabled={!newSection.title || !newSection.content}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            יצירה
          </button>
        </div>
      </div>
    </div>
  );
}

