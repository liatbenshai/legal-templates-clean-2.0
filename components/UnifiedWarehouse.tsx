'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Users, 
  Clock,
  Tag,
  BookOpen,
  TrendingUp,
  Save,
  X,
  RefreshCw,
  Sparkles,
  MoveHorizontal,
  EyeOff,
  Upload
} from 'lucide-react';
import EditableSection from './LearningSystem/EditableSection';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { useWarehouse, type WarehouseSection as WarehouseSectionType } from '@/lib/hooks/useWarehouse';
import { useLearning } from '@/lib/hooks/useLearning';
import { migrateLocalStorageToSupabase, isMigrationCompleted } from '@/lib/utils/migrateToSupabase';

// Using WarehouseSection from useWarehouse hook
type WarehouseSection = WarehouseSectionType;

interface UnifiedWarehouseProps {
  onSectionSelect: (section: WarehouseSection) => void;
  userId: string;
  willType?: 'individual' | 'mutual'; // סוג הצוואה - לפילטור סעיפים
}

const CATEGORIES = [
  { id: 'all', name: 'הכל', icon: '📚', color: 'gray' },
  { id: 'financial', name: 'כספים', icon: '💰', color: 'green' },
  { id: 'personal', name: 'אישי', icon: '👤', color: 'blue' },
  { id: 'business', name: 'עסקים', icon: '🏢', color: 'purple' },
  { id: 'health', name: 'בריאות', icon: '🏥', color: 'red' },
  { id: 'couple', name: 'בני זוג', icon: '💕', color: 'pink' },
  { id: 'children', name: 'ילדים', icon: '👶', color: 'yellow' },
  { id: 'property', name: 'נכסים', icon: '🏠', color: 'indigo' },
  { id: 'digital', name: 'דיגיטלי', icon: '💻', color: 'cyan' }
];

export default function UnifiedWarehouse({ onSectionSelect, userId, willType = 'individual' }: UnifiedWarehouseProps) {
  console.log('UnifiedWarehouse rendered, onSectionSelect:', typeof onSectionSelect, onSectionSelect);
  // Supabase hooks
  const {
    sections,
    loading: warehouseLoading,
    error: warehouseError,
    addSection,
    updateSection,
    deleteSection,
    toggleHideSection,
    showAllHidden,
    incrementUsage,
    moveToCategory,
    searchSections,
    reload
  } = useWarehouse(userId, { category: undefined, includeHidden: false });

  const { saveLearningData } = useLearning(userId);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('financial'); // ברירת מחדל: כספים
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingSection, setEditingSection] = useState<WarehouseSection | null>(null);
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    category: 'personal',
    tags: [] as string[]
  });
  const [showAIEditor, setShowAIEditor] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // מיגרציה אוטומטית בטעינה ראשונה
  useEffect(() => {
    const runMigration = async () => {
      if (!isMigrationCompleted(userId)) {
        setMigrating(true);
        try {
          const result = await migrateLocalStorageToSupabase(userId);
          console.log('Migration result:', result);
          setMigrationComplete(true);
          setTimeout(() => setMigrationComplete(false), 5000);
          await reload(); // טען מחדש מ-Supabase
        } catch (err) {
          console.error('Migration error:', err);
        } finally {
          setMigrating(false);
        }
      }
    };

    if (userId) {
      runMigration();
    }
  }, [userId]);

  // סינון מקומי - Supabase מביא רק סעיפים לא מוסתרים

  const filteredSections = sections.filter((section: WarehouseSection) => {
    const matchesSearch = searchTerm === '' || 
                         section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    
    // פילטור לפי סוג צוואה
    const matchesWillType = willType === 'mutual' 
      ? true // בצוואה הדדית - הצג הכל
      : !section.tags.some((tag: string) => tag.includes('הדדית') || tag.includes('הדדי')); // בצוואה יחידה - הסתר סעיפים הדדיים
    
    return matchesSearch && matchesCategory && matchesWillType;
  });

  const sortedSections = [...filteredSections].sort((a: WarehouseSection, b: WarehouseSection) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.last_used).getTime() - new Date(a.last_used).getTime();
      case 'popular':
        return b.usage_count - a.usage_count;
      case 'rating':
        return b.average_rating - a.average_rating;
      default:
        return 0;
    }
  });

  const handleAddSection = async () => {
    if (newSection.title.trim() && newSection.content.trim()) {
      try {
        // user_id לא צריך להישלח - ה-hook מוסיף אותו בפנים
        await addSection({
          title: newSection.title,
          content: newSection.content,
          category: newSection.category,
          tags: newSection.tags,
          usage_count: 0,
          average_rating: 0.0,
          is_public: false,
          is_hidden: false,
          created_by: userId
        });
        
        setNewSection({ title: '', content: '', category: 'personal', tags: [] });
        setIsAddingNew(false);
        
        // הודעת הצלחה
        alert('✅ הסעיף נשמר בהצלחה!');
      } catch (err) {
        console.error('Error adding section:', err);
        alert('❌ שגיאה בשמירת הסעיף');
      }
    }
  };

  // ייבוא סעיפים מקובץ JSON
  const handleImportSections = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('❌ הקובץ חייב להיות בפורמט JSON (.json)');
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // בדיקת פורמט הקובץ
      if (!data.sections || !Array.isArray(data.sections)) {
        alert('❌ פורמט קובץ לא תקין. הקובץ חייב להכיל מערך "sections"');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // הוספת כל הסעיפים
      for (const section of data.sections) {
        try {
          // בדיקות תקינות
          if (!section.title || !section.content) {
            console.warn('סעיף חסר כותרת או תוכן:', section);
            errorCount++;
            continue;
          }

          // user_id לא צריך להישלח - ה-hook מוסיף אותו בפנים
          await addSection({
            title: section.title.trim(),
            content: section.content.trim(),
            category: section.category || 'custom',
            tags: Array.isArray(section.tags) ? section.tags : (section.tags ? [section.tags] : []),
            usage_count: 0,
            average_rating: 0.0,
            is_public: section.is_public || false,
            is_hidden: false,
            created_by: userId
          });

          successCount++;
        } catch (err) {
          console.error('שגיאה בהוספת סעיף:', section.title, err);
          errorCount++;
        }
      }

      // איפוס הקובץ
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await reload(); // רענון הרשימה

      // הודעת סיכום
      if (successCount > 0) {
        alert(`✅ הובאו ${successCount} סעיפים בהצלחה!${errorCount > 0 ? `\n⚠️ ${errorCount} סעיפים לא נוספו.` : ''}`);
      } else {
        alert(`❌ לא הוספו סעיפים. בדוק את הקובץ ונסה שוב.`);
      }
    } catch (err) {
      console.error('שגיאה בייבוא:', err);
      alert('❌ שגיאה בקריאת הקובץ. ודאי שהקובץ בפורמט JSON תקין.');
    } finally {
      setImporting(false);
    }
  };

  const handleEditSection = (section: WarehouseSection) => {
    setEditingSection(section);
  };

  const handleSaveEdit = async () => {
    if (editingSection) {
      try {
        await updateSection(editingSection.id, {
          title: editingSection.title,
          content: editingSection.content,
          category: editingSection.category,
          tags: editingSection.tags
        });
        setEditingSection(null);
        alert('✅ הסעיף עודכן בהצלחה!');
      } catch (err) {
        alert('❌ שגיאה בעדכון הסעיף');
      }
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('האם למחוק את הסעיף לצמיתות?')) {
      try {
        await deleteSection(sectionId);
        alert('✅ הסעיף נמחק בהצלחה');
      } catch (err) {
        alert('❌ שגיאה במחיקת הסעיף');
      }
    }
  };

  const handleMoveCategorySection = async (sectionId: string, newCategory: string) => {
    const section = sections.find(s => s.id === sectionId);
    const newCategoryInfo = getCategoryInfo(newCategory);
    
    try {
      await moveToCategory(sectionId, newCategory);
      
      // הודעת הצלחה
      if (section) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>הועבר ל${newCategoryInfo.icon} ${newCategoryInfo.name}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
      }
    } catch (err) {
      alert('❌ שגיאה בהעברת הסעיף');
    }
  };

  const handleSelectSection = async (section: WarehouseSection) => {
    try {
      console.log('handleSelectSection called with:', section);
      // עדכון מונה שימוש ב-Supabase
      await incrementUsage(section.id);
      
      console.log('Calling onSectionSelect...');
      console.log('onSectionSelect type:', typeof onSectionSelect);
      console.log('onSectionSelect toString:', onSectionSelect?.toString?.()?.substring(0, 200));
      if (typeof onSectionSelect === 'function') {
        try {
          console.log('🔵 About to execute onSectionSelect with section:', section);
          const result: any = onSectionSelect(section);
          console.log('🔵 onSectionSelect executed, result:', result);
          // אם זה Promise, נמתין לו
          if (result && typeof result === 'object' && 'then' in result && typeof result.then === 'function') {
            (result as Promise<any>).then(() => {
              console.log('onSectionSelect Promise resolved');
            }).catch((err: any) => {
              console.error('onSectionSelect Promise rejected:', err);
            });
          }
          console.log('onSectionSelect called successfully, result:', result);
        } catch (err) {
          console.error('Error calling onSectionSelect:', err);
          throw err;
        }
      } else {
        console.error('❌ onSectionSelect is not a function! Value:', onSectionSelect);
        alert('שגיאה: הפונקציה לא זמינה');
      }
    } catch (error) {
      console.error('Error in handleSelectSection:', error);
      alert('שגיאה בהוספת הסעיף: ' + (error as Error).message);
    }
  };

  // המרת WarehouseSection ל-EditableSectionType
  const convertToEditableSection = (section: WarehouseSection): EditableSectionType => {
    return {
      id: section.id,
      title: section.title,
      content: section.content,
      originalContent: section.content,
      category: 'will' as const,
      serviceType: 'will' as const,
      isEditable: true,
      isCustom: true,
      subSections: section.sub_sections?.map((sub: any, index: number) => ({
        id: `${section.id}_sub_${index}`,
        content: sub.content || sub.title,
        order: sub.order || index
      })) || [],
      version: 1,
      lastModified: section.last_used,
      modifiedBy: userId
    };
  };

  const handleUpdateEditableSection = async (updatedSection: EditableSectionType) => {
    try {
      await updateSection(updatedSection.id, {
        title: updatedSection.title,
        content: updatedSection.content
      });
      
      // שמירת נתוני למידה אם היה שינוי
      const originalSection = sections.find(s => s.id === updatedSection.id);
      if (originalSection && originalSection.content !== updatedSection.content) {
        await saveLearningData({
          section_id: updatedSection.id,
          original_text: originalSection.content,
          edited_text: updatedSection.content,
          edit_type: 'manual',
          user_feedback: 'improved',
          context: {
            serviceType: 'will',
            category: updatedSection.category,
            userType: 'lawyer'
          }
        });
      }
      
      setShowAIEditor(null);
    } catch (err) {
      alert('❌ שגיאה בעדכון הסעיף');
    }
  };

  const handleSaveToWarehouse = async (section: EditableSectionType) => {
    // הסעיף כבר במחסן, רק נעדכן אותו
    await handleUpdateEditableSection(section);
  };

  const handleSaveToLearning = async (section: EditableSectionType) => {
    // שמירה למערכת הלמידה
    await handleUpdateEditableSection(section);
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[0];
  };

  // מיפוי צבעים סטטי עבור Tailwind
  const getCategoryColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      'gray': 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
      'green': 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
      'blue': 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200',
      'red': 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
      'pink': 'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200',
      'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
      'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200',
      'cyan': 'bg-cyan-100 text-cyan-800 border-cyan-300 hover:bg-cyan-200'
    };
    return colorMap[color] || colorMap['gray'];
  };

  // חישוב סעיפים מוסתרים
  const hiddenCount = sections.filter(s => s.is_hidden).length;

  return (
    <div className="space-y-6">
      {/* מיגרציה בתהליך */}
      {migrating && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="font-bold text-blue-900">מעביר נתונים ל-Supabase...</p>
              <p className="text-sm text-blue-700">זה עשוי לקחת מספר שניות</p>
            </div>
          </div>
        </div>
      )}

      {/* מיגרציה הושלמה */}
      {migrationComplete && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-bold text-green-900">✅ המעבר ל-Supabase הושלם בהצלחה!</p>
              <p className="text-sm text-green-700">כל הנתונים שלך כעת מאובטחים בענן</p>
            </div>
          </div>
        </div>
      )}

      {/* כותרת וסטטיסטיקות */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            המחסן האישי שלי ☁️
            {willType === 'mutual' && (
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                💕 צוואה הדדית
              </span>
            )}
          </h3>
          <div className="text-sm text-gray-600">
            {warehouseLoading ? (
              <span>טוען...</span>
            ) : (
              <>
                {sections.length} סעיפים • {filteredSections.length} תוצאות
                {willType === 'individual' && (
                  <span className="text-xs text-gray-500 mr-2">(ללא סעיפים הדדיים)</span>
                )}
                {hiddenCount > 0 && (
                  <span className="text-xs text-orange-600 mr-2">
                    🙈 {hiddenCount} מוסתרים
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* הצג כפתור לשחזור סעיפים מוסתרים */}
        {hiddenCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-orange-800">
                <strong>{hiddenCount} סעיפים מוסתרים</strong> - לא יופיעו ברשימה
              </p>
              <button
                onClick={() => showAllHidden()}
                className="text-sm px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                הצג את כולם מחדש
              </button>
            </div>
          </div>
        )}

        {/* שגיאות */}
        {warehouseError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">❌ {warehouseError}</p>
          </div>
        )}

        {/* חיפוש וסינון */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="חיפוש סעיפים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="recent">לפי עדכון אחרון</option>
            <option value="popular">לפי פופולריות</option>
            <option value="rating">לפי דירוג</option>
          </select>

          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            סעיף חדש
          </button>

          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportSections}
              accept=".json"
              className="hidden"
              disabled={importing}
            />
            <Upload className="w-4 h-4" />
            {importing ? 'מייבא...' : 'ייבא מקבץ סעיפים (JSON)'}
          </label>

          <button
            onClick={() => reload()}
            disabled={warehouseLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${warehouseLoading ? 'animate-spin' : ''}`} />
            {warehouseLoading ? 'טוען...' : 'טען מחדש'}
          </button>
        </div>

        {/* קטגוריות */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.filter(c => c.id !== 'all').map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category.id
                  ? `${getCategoryColorClasses(category.color)} border`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-gray-800 text-white border border-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>📚</span>
            הכל
          </button>
        </div>
      </div>

      {/* הוספת סעיף חדש */}
      {isAddingNew && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            הוספת סעיף חדש
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הסעיף:</label>
              <input
                type="text"
                value={newSection.title}
                onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="למשל: הוראת כספי פנסיה"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">קטגוריה:</label>
              <select
                value={newSection.category}
                onChange={(e) => setNewSection(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CATEGORIES.slice(1).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תוכן הסעיף:</label>
              <div className="mb-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 טיפים לכתיבה:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>משתנים:</strong> השתמש ב-{`{{שם_משתנה}}`} למידע שישתנה (למשל: {`{{guardian_name}}`})</li>
                  <li><strong>זכר/נקבה:</strong> השתמש ב-<code>/ת</code> <code>/ה</code> <code>/ים</code> (למשל: ממנה/ים, תושב/ת, יוכל/תוכל)</li>
                  <li><strong>דוגמה:</strong> "אני ממנה/ים את {`{{guardian_name}}`}, תושב/ת {`{{address}}`}"</li>
                </ul>
              </div>
              <textarea
                value={newSection.content}
                onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                placeholder="כתבי את תוכן הסעיף כאן..."
                dir="rtl"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddSection}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                שמור סעיף
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <X className="w-4 h-4" />
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* עריכת סעיף עם AI */}
      {editingSection && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            עריכת סעיף עם AI
          </h4>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              ✨ עכשיו יש לך אפשרות עריכה מלאה עם AI וללא AI!
            </p>
          </div>
          
          <EditableSection
            section={convertToEditableSection(editingSection)}
            onUpdate={handleUpdateEditableSection}
            onSaveToWarehouse={handleSaveToWarehouse}
            onSaveToLearning={handleSaveToLearning}
            userId={userId}
          />
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setEditingSection(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4" />
              סגור עריכה
            </button>
          </div>
        </div>
      )}

      {/* רשימת סעיפים */}
      <div className="grid gap-4">
        {sortedSections.length > 0 ? (
          sortedSections.map(section => {
            const categoryInfo = getCategoryInfo(section.category);
            return (
              <div
                key={section.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{categoryInfo.icon}</span>
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      
                      {/* Dropdown להעברת קטגוריה */}
                      <div className="relative group">
                        <select
                          value={section.category}
                          onChange={(e) => handleMoveCategorySection(section.id, e.target.value)}
                          className={`px-2 py-1 text-xs rounded-full ${getCategoryColorClasses(categoryInfo.color)} cursor-pointer appearance-none pr-6 border-none outline-none`}
                          title="העבר לקטגוריה אחרת"
                        >
                          {CATEGORIES.slice(1).map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                        <MoveHorizontal className="absolute left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-500" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {section.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>שימוש: {section.usage_count}</span>
                      <span>נוצר: {new Date(section.created_at).toLocaleDateString('he-IL')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔵 Button clicked for section:', section?.title);
                        handleSelectSection(section);
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      הוסף לצוואה
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await toggleHideSection(section.id);
                          alert('✅ הסעיף הוסתר בהצלחה');
                        } catch (err) {
                          alert('❌ שגיאה בהסתרת הסעיף');
                        }
                      }}
                      className="p-1 text-orange-500 hover:text-orange-700 transition"
                      title="הסתר סעיף (לא יופיע יותר)"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowAIEditor(section.id)}
                      className="p-1 text-purple-500 hover:text-purple-700 transition"
                      title="עריכה עם AI"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      className="p-1 text-gray-500 hover:text-blue-600 transition"
                      title="עריכה ידנית"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition"
                      title="מחק סעיף לצמיתות"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">אין סעיפים במחסן</p>
            <p className="text-sm">הוסיפי סעיפים חדשים או שנה את הסינון</p>
          </div>
        )}
      </div>

      {/* עריכת AI ישירה */}
      {showAIEditor && (
        <div className="mt-6 bg-white rounded-lg border border-purple-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            עריכה עם AI
          </h4>
          
          {(() => {
            const section = sections.find(s => s.id === showAIEditor);
            if (!section) {
              setShowAIEditor(null);
              return <div>סעיף לא נמצא</div>;
            }
            return (
              <EditableSection
                section={convertToEditableSection(section)}
                onUpdate={handleUpdateEditableSection}
                onSaveToWarehouse={handleSaveToWarehouse}
                onSaveToLearning={handleSaveToLearning}
                userId={userId}
              />
            );
          })()}
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowAIEditor(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4" />
              סגור עריכה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
