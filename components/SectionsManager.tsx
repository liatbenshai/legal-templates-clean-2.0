'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, Search, Filter, Download, Upload, 
  BookOpen, Save, X, FileText, Sparkles, Copy, Eye, EyeOff,
  Grid, List, LayoutGrid, Package
} from 'lucide-react';
import { SectionTemplate } from '@/lib/professional-will-texts';
import { 
  WAREHOUSES, 
  WarehouseType, 
  getSectionsByWarehouse,
  getWarehouseInfo 
} from '@/lib/sections-warehouses/all-warehouses';
import SimpleAIImprover from './SimpleAIImprover';

type Category = 'property' | 'inheritance' | 'restrictions' | 'special' | 'family' | 'business';

interface ExtendedSectionTemplate extends SectionTemplate {
  isCustom?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  warehouse?: WarehouseType;
}

export default function SectionsManager() {
  const [sections, setSections] = useState<ExtendedSectionTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType>('wills');
  const [editingSection, setEditingSection] = useState<ExtendedSectionTemplate | null>(null);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [showPreview, setShowPreview] = useState<ExtendedSectionTemplate | null>(null);
  const [showAIImprover, setShowAIImprover] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // טעינת סעיפים בטעינה ראשונית וכשמחליפים מחסן
  useEffect(() => {
    loadSections();
  }, [selectedWarehouse]);

  const loadSections = () => {
    // טען סעיפים מוגדרים מראש מהמחסן הנבחר
    const warehouseSections = getSectionsByWarehouse(selectedWarehouse);
    const builtInSections: ExtendedSectionTemplate[] = warehouseSections.map(s => ({
      ...s,
      isCustom: false,
      warehouse: selectedWarehouse
    }));

    // טען סעיפים מותאמים מ-localStorage (ספציפיים למחסן זה)
    const storageKey = `customSections_${selectedWarehouse}`;
    const customSectionsJson = localStorage.getItem(storageKey);
    const customSections: ExtendedSectionTemplate[] = customSectionsJson 
      ? JSON.parse(customSectionsJson).map((s: any) => ({ ...s, isCustom: true, warehouse: selectedWarehouse }))
      : [];

    setSections([...builtInSections, ...customSections]);
  };

  const categories = [
    { id: 'all', name: 'כל הקטגוריות', icon: '📋' },
    { id: 'property', name: 'נכסים', icon: '🏠' },
    { id: 'inheritance', name: 'ירושה', icon: '👨‍👩‍👧‍👦' },
    { id: 'restrictions', name: 'הגבלות', icon: '🚫' },
    { id: 'special', name: 'מיוחד', icon: '⭐' },
    { id: 'family', name: 'משפחה', icon: '👪' },
    { id: 'business', name: 'עסקים', icon: '🏢' }
  ];

  const filteredSections = sections.filter(section => {
    const matchesSearch = searchTerm === '' || 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      section.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      section.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateSection = (newSection: Omit<ExtendedSectionTemplate, 'id' | 'isCustom' | 'createdAt'>) => {
    const section: ExtendedSectionTemplate = {
      ...newSection,
      id: `custom_${Date.now()}`,
      isCustom: true,
      warehouse: selectedWarehouse,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    // עדכן state
    setSections(prev => {
      const updated = [...prev, section];
      
      // שמור ב-localStorage
      const storageKey = `customSections_${selectedWarehouse}`;
      const customSections = updated.filter(s => s.isCustom);
      localStorage.setItem(storageKey, JSON.stringify(customSections));
      
      return updated;
    });

    setShowCreateNew(false);
  };

  const handleUpdateSection = (updatedSection: ExtendedSectionTemplate) => {
    const updated = {
      ...updatedSection,
      modifiedAt: new Date().toISOString()
    };

    // עדכן state
    setSections(prev => {
      const updatedList = prev.map(s => s.id === updated.id ? updated : s);
      
      // אם זה סעיף מותאם - עדכן גם ב-localStorage
      if (updated.isCustom) {
        const storageKey = `customSections_${selectedWarehouse}`;
        const customSections = updatedList.filter(s => s.isCustom);
        localStorage.setItem(storageKey, JSON.stringify(customSections));
      }
      
      return updatedList;
    });

    setEditingSection(null);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm('האם את בטוחה שברצונך למחוק סעיף זה?')) return;

    const section = sections.find(s => s.id === sectionId);
    if (section && !section.isCustom) {
      alert('לא ניתן למחוק סעיפים מוגדרים מראש');
      return;
    }

    // עדכן state
    setSections(prev => {
      const updated = prev.filter(s => s.id !== sectionId);
      
      // עדכן localStorage
      const storageKey = `customSections_${selectedWarehouse}`;
      const customSections = updated.filter(s => s.isCustom);
      localStorage.setItem(storageKey, JSON.stringify(customSections));
      
      return updated;
    });
  };

  const handleExportSections = () => {
    const customSections = sections.filter(s => s.isCustom);
    const dataStr = JSON.stringify(customSections, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sections-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportSections = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(imported)) {
          alert('קובץ לא תקין');
          return;
        }

        // הוסף את הסעיפים המיובאים עם warehouse נכון
        const newSections = imported.map(s => ({
          ...s,
          id: `custom_${Date.now()}_${Math.random()}`,
          isCustom: true,
          warehouse: selectedWarehouse, // הוסף את המחסן הנוכחי
          createdAt: s.createdAt || new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        }));

        // עדכן state
        setSections(prev => {
          const updated = [...prev, ...newSections];
          
          // שמור ב-localStorage במפתח הנכון לפי המחסן הנבחר
          const storageKey = `customSections_${selectedWarehouse}`;
          const customSections = updated.filter(s => s.isCustom && s.warehouse === selectedWarehouse);
          localStorage.setItem(storageKey, JSON.stringify(customSections));
          
          return updated;
        });

        alert(`יובאו בהצלחה ${newSections.length} סעיפים למחסן "${getWarehouseInfo(selectedWarehouse)?.name}"`);
        
        // אפס את ה-input כדי לאפשר ייבוא של אותו קובץ שוב
        event.target.value = '';
      } catch (error) {
        console.error('Import error:', error);
        alert('שגיאה בייבוא הקובץ. ודא שהקובץ הוא JSON תקין');
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('הטקסט הועתק ללוח');
  };

  // סטטיסטיקות
  const stats = {
    total: sections.length,
    custom: sections.filter(s => s.isCustom).length,
    builtin: sections.filter(s => !s.isCustom).length,
    byCategory: categories.slice(1).map(cat => ({
      name: cat.name,
      count: sections.filter(s => s.category === cat.id).length
    }))
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* כותרת */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ניהול מחסני סעיפים</h1>
              <p className="text-gray-600">נהלי, ערכי והוסיפי סעיפים למסמכים משפטיים</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateNew(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              סעיף חדש
            </button>
          </div>
        </div>

        {/* בורר מחסנים */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            בחר מחסן סעיפים:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {WAREHOUSES.map((warehouse) => (
              <button
                key={warehouse.id}
                onClick={() => setSelectedWarehouse(warehouse.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedWarehouse === warehouse.id
                    ? `border-${warehouse.color}-500 bg-${warehouse.color}-50 shadow-md scale-105`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                title={warehouse.description}
              >
                <div className="text-3xl mb-2">{warehouse.icon}</div>
                <div className={`text-sm font-medium ${
                  selectedWarehouse === warehouse.id
                    ? `text-${warehouse.color}-700`
                    : 'text-gray-700'
                }`}>
                  {warehouse.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* סטטיסטיקות */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-700">סה"כ סעיפים</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.custom}</div>
            <div className="text-sm text-green-700">סעיפים מותאמים</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{stats.builtin}</div>
            <div className="text-sm text-purple-700">סעיפים מובנים</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">
              {filteredSections.length}
            </div>
            <div className="text-sm text-orange-700">מוצגים כעת</div>
          </div>
        </div>
      </div>

      {/* חיפוש וסינון */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* חיפוש */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חפש לפי כותרת או תוכן..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              />
            </div>
          </div>

          {/* סינון לפי קטגוריה */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* כפתורי ייבוא/ייצוא ותצוגה */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleExportSections}
              disabled={stats.custom === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              ייצא סעיפים ({stats.custom})
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
              <Upload className="w-4 h-4" />
              ייבא סעיפים
              <input
                type="file"
                accept=".json"
                onChange={handleImportSections}
                className="hidden"
              />
            </label>
          </div>

          {/* בחירת תצוגה */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                viewMode === 'cards' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">כרטיסים</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">רשימה</span>
            </button>
          </div>
        </div>
      </div>

      {/* תצוגת סעיפים */}
      {filteredSections.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">לא נמצאו סעיפים</h3>
          <p className="text-gray-500">נסי לשנות את החיפוש או הסינון</p>
        </div>
      ) : viewMode === 'cards' ? (
        /* תצוגת כרטיסים */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              {/* כותרת הכרטיס */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                    {section.title}
                  </h3>
                  {section.isCustom ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500 text-white whitespace-nowrap">
                      ✨ מותאם
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500 text-white whitespace-nowrap">
                      🏛️ מובנה
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-white text-blue-700 border border-blue-200">
                  {categories.find(c => c.id === section.category)?.icon}{' '}
                  {categories.find(c => c.id === section.category)?.name}
                </span>
              </div>

              {/* תוכן הכרטיס */}
              <div className="p-4">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4" dir="rtl">
                  {section.content}
                </p>

                {/* מידע נוסף */}
                {section.variables.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {section.variables.slice(0, 3).map((variable, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-mono"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                    {section.variables.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        +{section.variables.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* פעולות */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => setShowPreview(section)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                  title="צפייה מלאה"
                >
                  <Eye className="w-4 h-4" />
                  <span>צפה</span>
                </button>
                <button
                  onClick={() => copyToClipboard(section.content)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition text-sm font-medium"
                  title="העתק לוח"
                >
                  <Copy className="w-4 h-4" />
                  <span>העתק</span>
                </button>
                <button
                  onClick={() => setEditingSection(section)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition text-sm font-medium"
                  title="ערוך"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>ערוך</span>
                </button>
                {section.isCustom && (
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="מחק"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* תצוגת רשימה */
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* אייקון */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  {categories.find(c => c.id === section.category)?.icon}
                </div>

                {/* תוכן */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{section.title}</h3>
                    <div className="flex gap-2 flex-shrink-0">
                      {section.isCustom ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          מותאם אישית
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          מובנה
                        </span>
                      )}
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {categories.find(c => c.id === section.category)?.name}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2" dir="rtl">
                    {section.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {section.variables.length > 0 && (
                        <>
                          {section.variables.slice(0, 5).map((variable, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-mono"
                            >
                              {`{{${variable}}}`}
                            </span>
                          ))}
                          {section.variables.length > 5 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{section.variables.length - 5} עוד
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* פעולות */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPreview(section)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="צפייה"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(section.content)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="העתק"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingSection(section)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="ערוך"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      {section.isCustom && (
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="מחק"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* מודל יצירת סעיף חדש */}
      {showCreateNew && (
        <SectionFormModal
          onSave={handleCreateSection}
          onCancel={() => setShowCreateNew(false)}
        />
      )}

      {/* מודל עריכת סעיף */}
      {editingSection && (
        <SectionFormModal
          section={editingSection}
          onSave={handleUpdateSection}
          onCancel={() => setEditingSection(null)}
        />
      )}

      {/* מודל תצוגה מקדימה */}
      {showPreview && (
        <PreviewModal
          section={showPreview}
          onClose={() => setShowPreview(null)}
        />
      )}
    </div>
  );
}

// רכיב טופס ליצירה/עריכה
function SectionFormModal({ 
  section, 
  onSave, 
  onCancel 
}: { 
  section?: ExtendedSectionTemplate;
  onSave: (section: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: section?.title || '',
    category: section?.category || 'special' as Category,
    content: section?.content || '',
    variables: section?.variables || [],
    aiPrompt: section?.aiPrompt || '',
    usageInstructions: section?.usageInstructions || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('נא להזין כותרת');
      return;
    }
    if (!formData.content.trim()) {
      alert('נא להזין תוכן');
      return;
    }

    // חלץ משתנים מהטקסט
    const variables = extractVariables(formData.content);

    onSave({
      ...section,
      ...formData,
      variables
    });
  };

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/{{([^}]+)}}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {section ? 'עריכת סעיף' : 'יצירת סעיף חדש'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* כותרת */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              כותרת הסעיף *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="לדוגמה: ירושת נכסים דיגיטליים"
              dir="rtl"
              required
            />
          </div>

          {/* קטגוריה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              קטגוריה *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="property">🏠 נכסים</option>
              <option value="inheritance">👨‍👩‍👧‍👦 ירושה</option>
              <option value="restrictions">🚫 הגבלות</option>
              <option value="special">⭐ מיוחד</option>
              <option value="family">👪 משפחה</option>
              <option value="business">🏢 עסקים</option>
            </select>
          </div>

          {/* תוכן */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תוכן הסעיף *
            </label>
            <div className="text-xs text-gray-500 mb-2">
              💡 השתמש ב-{`{{משתנה}}`} להגדרת משתנים (לדוגמה: {`{{testator_name}}`})
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={10}
              placeholder="כתוב את תוכן הסעיף המשפטי..."
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
              required
            />
            {extractVariables(formData.content).length > 0 && (
              <div className="mt-2 text-sm text-blue-600">
                <strong>משתנים שזוהו:</strong> {extractVariables(formData.content).join(', ')}
              </div>
            )}
          </div>

          {/* הנחיה ל-AI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הנחיה ל-AI (אופציונלי)
            </label>
            <textarea
              value={formData.aiPrompt}
              onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              placeholder="איך AI צריך לשפר או להתאים את הסעיף?"
              dir="rtl"
            />
          </div>

          {/* הוראות שימוש */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הוראות שימוש (אופציונלי)
            </label>
            <textarea
              value={formData.usageInstructions}
              onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              placeholder="מתי ואיך להשתמש בסעיף זה?"
              dir="rtl"
            />
          </div>

          {/* כפתורים */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Save className="w-5 h-5" />
              {section ? 'שמור שינויים' : 'צור סעיף'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// רכיב תצוגה מקדימה
function PreviewModal({ 
  section, 
  onClose 
}: { 
  section: ExtendedSectionTemplate;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* מטה-דאטה */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 font-medium mb-1">קטגוריה</div>
              <div className="text-blue-900">{section.category}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 font-medium mb-1">סוג</div>
              <div className="text-green-900">
                {section.isCustom ? 'מותאם אישית' : 'מובנה'}
              </div>
            </div>
          </div>

          {/* תוכן */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">תוכן הסעיף</h3>
            <div 
              className="whitespace-pre-wrap text-gray-800 leading-relaxed"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
              dir="rtl"
            >
              {section.content}
            </div>
          </div>

          {/* משתנים */}
          {section.variables.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">משתנים</h4>
              <div className="flex flex-wrap gap-2">
                {section.variables.map((variable, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono"
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* הנחיות AI */}
          {section.aiPrompt && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-bold text-indigo-900 mb-2">הנחיה ל-AI</h4>
              <p className="text-indigo-800">{section.aiPrompt}</p>
            </div>
          )}

          {/* הוראות שימוש */}
          {section.usageInstructions && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-yellow-900 mb-2">הוראות שימוש</h4>
              <p className="text-yellow-800">{section.usageInstructions}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

