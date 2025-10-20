'use client';

import { useState, useEffect } from 'react';
import { useAIImprove } from '@/lib/hooks/useAIImprove';
import { Sparkles, Copy, Download, Loader, BookOpen, TrendingUp, Save, Trash2, FileText, Handshake, Heart, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

interface SavedSection {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function AILearningPage() {
  const router = useRouter();
  const { improveText, getSuggestions, loading, error } = useAIImprove();
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'suggestions'>('editor');
  const [savedSections, setSavedSections] = useState<SavedSection[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [showSaveToDocumentModal, setShowSaveToDocumentModal] = useState(false);
  
  // חלון השלמת משתנים
  const [variablesCompletionModal, setVariablesCompletionModal] = useState<{
    isOpen: boolean;
    variables: string[];
    values: Record<string, string>;
  }>({
    isOpen: false,
    variables: [],
    values: {}
  });

  // מודל השלמת משתנים לשמירה למסמך
  const [variableCompletionModal, setVariableCompletionModal] = useState<{
    isOpen: boolean;
    text: string;
    documentType: 'will' | 'fee-agreement' | 'advance-directives';
  }>({
    isOpen: false,
    text: '',
    documentType: 'will'
  });
  
  // מערכת משתנים
  const [variables, setVariables] = useState<Array<{
    id: string;
    name: string;
    description: string;
    type: 'text' | 'number' | 'date';
    defaultValue?: string;
    usageCount: number;
  }>>([]);
  
  // מודל הוספת משתנה חדש
  const [addVariableModal, setAddVariableModal] = useState<{
    isOpen: boolean;
    name: string;
    description: string;
    type: 'text' | 'number' | 'date';
    defaultValue: string;
  }>({
    isOpen: false,
    name: '',
    description: '',
    type: 'text',
    defaultValue: ''
  });


  // פונקציות לניהול משתנים
  const addVariable = (name: string, description: string, type: 'text' | 'number' | 'date', defaultValue?: string) => {
    const newVariable = {
      id: `var_${Date.now()}`,
      name,
      description,
      type,
      defaultValue,
      usageCount: 0
    };
    setVariables(prev => [...prev, newVariable]);
    return newVariable;
  };

  
  const openAddVariableModal = () => {
    setAddVariableModal({
      isOpen: true,
      name: '',
      description: '',
      type: 'text',
      defaultValue: ''
    });
  };
  
  const closeAddVariableModal = () => {
    setAddVariableModal({
      isOpen: false,
      name: '',
      description: '',
      type: 'text',
      defaultValue: ''
    });
  };
  
  const createNewVariable = () => {
    if (!addVariableModal.name.trim()) return;
    
    const newVariable = addVariable(
      addVariableModal.name.trim(),
      addVariableModal.description.trim(),
      addVariableModal.type,
      addVariableModal.defaultValue.trim() || undefined
    );
    
    // הוספת המשתנה לטקסט הנוכחי
    const variableText = `{{${newVariable.name}}}`;
    setText(prev => prev + (prev ? ' ' : '') + variableText);
    
    closeAddVariableModal();
    return newVariable;
  };

  // פונקציה לזיהוי משתנים בטקסט
  const extractVariablesFromText = (text: string): string[] => {
    const matches = text.match(/\{\{([^}]+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))] : [];
  };

  // פונקציה לפתיחת חלון השלמת משתנים
  const openVariablesCompletionModal = () => {
    const foundVariables = extractVariablesFromText(text);
    if (foundVariables.length === 0) {
      alert('לא נמצאו משתנים בטקסט. השתמש בתחביר {{שם_המשתנה}}');
      return;
    }
    
    setVariablesCompletionModal({
      isOpen: true,
      variables: foundVariables,
      values: {}
    });
  };
  
  // טעינת סעיפים שמורים בעת טעינת הדף
  useEffect(() => {
    loadSavedSections();
  }, []);

  const loadSavedSections = async () => {
    try {
      setIsLoadingSections(true);
      
      console.log('🔍 Attempting to load from Supabase...');
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      // נסה לטעון מ-Supabase
      const { data, error } = await supabase
        .from('saved_sections')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      let sections = [];
      
      if (error) {
        console.error('❌ Supabase error:', error);
        console.log('📱 Loading from localStorage as fallback...');
        // אם יש שגיאה ב-Supabase, טען מ-localStorage
        const warehouseKey = 'ai-warehouse-sections';
        const localSections = JSON.parse(localStorage.getItem(warehouseKey) || '[]');
        sections = localSections;
        console.log('📱 Loaded from localStorage:', sections.length, 'sections');
      } else {
        console.log('✅ Supabase success:', data?.length || 0, 'sections');
        sections = data || [];
        
        // הוסף גם את הסעיפים מ-localStorage
        const warehouseKey = 'ai-warehouse-sections';
        const localSections = JSON.parse(localStorage.getItem(warehouseKey) || '[]');
        sections = [...localSections, ...sections];
        console.log('📱 Combined sections:', sections.length, 'total');
      }

      setSavedSections(sections);
    } catch (err) {
      console.error('💥 Error loading sections:', err);
      // במקרה של שגיאה, טען מ-localStorage
      const warehouseKey = 'ai-warehouse-sections';
      const localSections = JSON.parse(localStorage.getItem(warehouseKey) || '[]');
      setSavedSections(localSections);
    } finally {
      setIsLoadingSections(false);
    }
  };

  const handleImprove = async () => {
    const improved = await improveText(text);
    setText(improved);
  };

  const handleGetSuggestions = async () => {
    const sug = await getSuggestions(text);
    setSuggestions(sug);
    setActiveTab('suggestions');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('הטקסט הועתק!');
  };

  const handleApplySuggestion = (suggestion: string) => {
    setText(suggestion);
    setSuggestions([]);
    setActiveTab('editor');
  };

  // שמירה ל-Supabase
  const handleSaveSection = async () => {
    if (!text || !text.trim()) {
      alert('אנא הזן טקסט לפני השמירה');
      return;
    }

    if (!sectionTitle || !sectionTitle.trim()) {
      alert('אנא הזן שם לסעיף');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_sections')
        .insert([
          {
            title: sectionTitle,
            content: text,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Error saving section:', error);
        alert('שגיאה בשמירת הסעיף: ' + error.message);
        return;
      }

      alert(`סעיף "${sectionTitle}" נשמר בהצלחה!`);
      setSectionTitle('');
      setShowSaveModal(false);
      
      // טען מחדש את הסעיפים
      await loadSavedSections();
    } catch (err) {
      console.error('Error:', err);
      alert('שגיאה בשמירת הסעיף');
    } finally {
      setIsSaving(false);
    }
  };

  // מחיקת סעיף
  const handleDeleteSection = async (id: string) => {
    if (!confirm('למחוק את הסעיף?')) return;

    try {
      const { error } = await supabase
        .from('saved_sections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting section:', error);
        alert('שגיאה במחיקת הסעיף');
        return;
      }

      // טען מחדש את הסעיפים
      await loadSavedSections();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // טעינת סעיף לעורך
  const handleLoadSection = (section: SavedSection) => {
    setText(section.content);
    setActiveTab('editor');
  };

  // טעינת סעיף ישירות למסמך
  const handleLoadSectionToDocument = (section: SavedSection, documentType: 'will' | 'fee-agreement' | 'advance-directives') => {
    // בדיקה אם יש משתנים שצריך להשלים
    const hasVariables = /\{\{[^}]+\}\}/.test(section.content);
    
    if (hasVariables) {
      const shouldComplete = confirm('הסעיף מכיל משתנים (כמו {{שם_משתנה}}). האם תרצה להשלים אותם עכשיו?');
      
      if (shouldComplete) {
        // פתח מודל להשלמת משתנים
        setVariableCompletionModal({
          isOpen: true,
          text: section.content,
          documentType: documentType
        });
        return;
      }
    }

    // שמירה ל-localStorage
    const saveKey = `ai-improved-section-${documentType}`;
    localStorage.setItem(saveKey, JSON.stringify({
      content: section.content,
      timestamp: Date.now(),
      hasVariables: hasVariables
    }));

    alert('✅ הסעיף נטען! עכשיו עובר לדף המסמך...');
    
    // מעבר לדף המסמך
    const routes = {
      'will': '/documents/will',
      'fee-agreement': '/documents/fee-agreement',
      'advance-directives': '/documents/advance-directives'
    };
    
    router.push(routes[documentType]);
  };

  // שמירה למסמך ספציפי
  const handleSaveToDocument = (documentType: 'will' | 'fee-agreement' | 'advance-directives') => {
    if (!text || !text.trim()) {
      alert('אנא הזן טקסט לפני השמירה');
      return;
    }

    // בדיקה אם יש משתנים שצריך להשלים
    const hasVariables = /\{\{[^}]+\}\}/.test(text);
    
    if (hasVariables) {
      const shouldComplete = confirm('הטקסט מכיל משתנים (כמו {{שם_משתנה}}). האם תרצה להשלים אותם עכשיו?');
      
      if (shouldComplete) {
        // פתח מודל להשלמת משתנים
        setVariableCompletionModal({
          isOpen: true,
          text: text,
          documentType: documentType
        });
        return;
      }
    }

    // שמירה ל-localStorage כדי שהמסמך יוכל לטעון
    const saveKey = `ai-improved-section-${documentType}`;
    localStorage.setItem(saveKey, JSON.stringify({
      content: text,
      timestamp: Date.now(),
      hasVariables: hasVariables
    }));

    alert('✅ הטקסט נשמר! עכשיו עובר לדף המסמך...');
    
    // מעבר לדף המסמך
    const routes = {
      'will': '/documents/will',
      'fee-agreement': '/documents/fee-agreement',
      'advance-directives': '/documents/advance-directives'
    };
    
    router.push(routes[documentType]);
  };

  // השלמת משתנים ושמירה למסמך
  const handleCompleteVariablesAndSave = () => {
    const { text, documentType } = variableCompletionModal;
    
    // מצא את כל המשתנים בטקסט
    const variableMatches = text.match(/\{\{([^}]+)\}\}/g);
    if (!variableMatches) return;
    
    // בנה טקסט חדש עם הערכים
    let completedText = text;
    variableMatches.forEach(match => {
      const variableName = match.replace(/\{\{|\}\}/g, '');
      const value = prompt(`הזן ערך עבור "${variableName}":`);
      if (value !== null) {
        completedText = completedText.replace(match, value);
      }
    });
    
    // שמירה ל-localStorage
    const saveKey = `ai-improved-section-${documentType}`;
    localStorage.setItem(saveKey, JSON.stringify({
      content: completedText,
      timestamp: Date.now(),
      hasVariables: false
    }));
    
    // סגור את המודל
    setVariableCompletionModal({
      isOpen: false,
      text: '',
      documentType: 'will'
    });
    
    alert('✅ הטקסט עם המשתנים הושלמו! עכשיו עובר לדף המסמך...');
    
    // מעבר לדף המסמך
    const routes = {
      'will': '/documents/will',
      'fee-agreement': '/documents/fee-agreement',
      'advance-directives': '/documents/advance-directives'
    };
    
    router.push(routes[documentType]);
  };

  // שמירה למחסן אישי
  const handleSaveToWarehouse = async () => {
    if (!text || !text.trim()) {
      alert('אנא הזן טקסט לפני השמירה');
      return;
    }

    const title = prompt('הזן כותרת לסעיף:');
    if (!title) return;

    try {
      console.log('💾 Saving section to warehouse:', title);
      
      // נסה לשמור ב-Supabase קודם
      console.log('🔍 Attempting to save to Supabase...');
      const { data, error } = await supabase
        .from('saved_sections')
        .insert([
          {
            title: title,
            content: text,
          },
        ])
        .select();

      if (error) {
        console.error('❌ Supabase save error:', error);
        console.log('📱 Saving to localStorage as fallback...');
        
        // שמירה זמנית ב-localStorage עד שהטבלה תיווצר ב-Supabase
        const warehouseKey = 'ai-warehouse-sections';
        const existingSections = JSON.parse(localStorage.getItem(warehouseKey) || '[]');
        
        const newSection = {
          id: Date.now().toString(),
          title: title,
          content: text,
          created_at: new Date().toISOString()
        };
        
        existingSections.unshift(newSection);
        localStorage.setItem(warehouseKey, JSON.stringify(existingSections));
        console.log('📱 Saved to localStorage successfully');
      } else {
        console.log('✅ Saved to Supabase successfully:', data);
      }

      alert(`✅ סעיף "${title}" נשמר למחסן האישי!`);
      
      // טען מחדש את הסעיפים
      await loadSavedSections();
    } catch (err) {
      console.error('💥 Error saving to warehouse:', err);
      alert('שגיאה בשמירה למחסן');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* כותרת */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">למידת AI</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            שפר את היכולות המשפטיות שלך עם עוזר AI חכם שלומד מהניסוח שלך
          </p>
        </div>
        
        {/* תצוגת משתנים קיימים */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <span className="text-xl">📋</span>
              משתנים קיימים ({variables.length})
            </h3>
            <button
              onClick={openAddVariableModal}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              הוסף משתנה
            </button>
          </div>
          
          {variables.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {variables.map((variable) => (
                <div key={variable.id} className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-sm font-mono text-blue-800">
                      {`{{${variable.name}}}`}
                    </code>
                    <span className="text-xs text-gray-500">({variable.usageCount} שימושים)</span>
                  </div>
                  <p className="text-sm text-gray-700">{variable.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      variable.type === 'text' ? 'bg-green-100 text-green-700' :
                      variable.type === 'number' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {variable.type === 'text' ? 'טקסט' : variable.type === 'number' ? 'מספר' : 'תאריך'}
                    </span>
                    {variable.defaultValue && (
                      <span className="text-xs text-gray-500">
                        ברירת מחדל: {variable.defaultValue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">אין משתנים עדיין</p>
              <p className="text-sm">לחץ על "הוסף משתנה" כדי ליצור משתנים לשימוש בטקסט</p>
            </div>
          )}
        </div>

        {/* תכונות */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ניסוח אוטומטי</h3>
            <p className="text-gray-600">
              קבל הצעות לניסוח משפטי תקין ומקצועי על בסיס הקשר המסמך
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">למידה מתמשכת</h3>
            <p className="text-gray-600">
              המערכת לומדת מהסגנון והטרמינולוגיה המשפטית שלך
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">שיפור מתמיד</h3>
            <p className="text-gray-600">
              קבל המלצות לשיפור הניסוח והמבנה של המסמכים שלך
            </p>
          </div>
        </div>

        {/* שגיאה אם יש */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* עורך + הצעות */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* עורך */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex-1 px-6 py-3 font-semibold transition ${
                    activeTab === 'editor'
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  עורך
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`flex-1 px-6 py-3 font-semibold transition ${
                    activeTab === 'suggestions'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  הצעות ({suggestions.length})
                </button>
              </div>

              {/* תוכן */}
              <div className="p-6">
                {activeTab === 'editor' ? (
                  <div className="space-y-4">
                    {/* סרגל כלים */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-sm font-medium text-gray-700">כלים:</span>
                      <button
                        onClick={openAddVariableModal}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        הוסף משתנה
                      </button>
                      <button
                        onClick={openVariablesCompletionModal}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        השלם משתנים
                      </button>
                      <div className="text-xs text-gray-500">
                        השתמש במשתנים כמו {`{{שם_המשתנה}}`} ולחץ "השלם משתנים"
                      </div>
                    </div>
                    
                    {/* עורך טקסט */}
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="כתוב או הדבק טקסט משפטי כאן... השתמש במשתנים כמו {{שם_המשתנה}}"
                      className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none resize-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition cursor-pointer"
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          <p className="text-gray-800 mb-2">{suggestion}</p>
                          <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                            ✓ החל הצעה זו
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        לא יש הצעות עדיין. לחץ על "קבל הצעות" כדי להתחיל
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* פאנל כפתורים */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">פעולות</h3>

              <button
                onClick={handleImprove}
                disabled={loading || !text}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    משפר...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    שפר עם AI
                  </>
                )}
              </button>

              <button
                onClick={handleGetSuggestions}
                disabled={loading || !text}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                קבל הצעות
              </button>

              <button
                onClick={handleCopy}
                disabled={!text}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                העתק
              </button>

              <button
                onClick={openAddVariableModal}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <span className="text-lg">📝</span>
                הוסף משתנה
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
                disabled={!text}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                שמור סעיף
              </button>

              <div className="pt-3 border-t">
                <div className="text-xs font-bold text-gray-700 mb-2">💾 שמור ישירות למסמך:</div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSaveToDocument('will')}
                    disabled={!text}
                    className="w-full px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    שמור לצוואה
                  </button>
                  <button
                    onClick={() => handleSaveToDocument('fee-agreement')}
                    disabled={!text}
                    className="w-full px-3 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Handshake className="w-4 h-4" />
                    שמור להסכם שכ"ט
                  </button>
                  <button
                    onClick={() => handleSaveToDocument('advance-directives')}
                    disabled={!text}
                    className="w-full px-3 py-2 bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    שמור להנחיות מקדימות
                  </button>
                  <button
                    onClick={handleSaveToWarehouse}
                    disabled={!text}
                    className="w-full px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    שמור למחסן אישי
                  </button>
                </div>
              </div>

              {/* מידע */}
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 space-y-2">
                  <div>מילים: <span className="font-bold">{text.split(/\s+/).filter(Boolean).length}</span></div>
                  <div>תווים: <span className="font-bold">{text.length}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal לשמירה */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">שמור סעיף חדש</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם הסעיף
                  </label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="לדוגמה: הנחיות רכושיות"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">הסעיף:</p>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveSection}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
                  >
                    {isSaving ? 'שומר...' : 'שמור'}
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveModal(false);
                      setSectionTitle('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* סעיפים שמורים */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            סעיפים שמורים ({isLoadingSections ? 'טוען...' : savedSections.length})
          </h2>
          
          {isLoadingSections ? (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : savedSections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSections.map((section) => (
                <div key={section.id} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-600">
                  <h3 className="font-bold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{section.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(section.created_at).toLocaleDateString('he-IL')}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => handleLoadSection(section)}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                      >
                        טען
                      </button>
                      <button
                        onClick={() => handleLoadSectionToDocument(section, 'will')}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        title="טען לצוואה"
                      >
                        צוואה
                      </button>
                      <button
                        onClick={() => handleLoadSectionToDocument(section, 'fee-agreement')}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        title="טען לשכר טרחה"
                      >
                        שכ"ט
                      </button>
                      <button
                        onClick={() => handleLoadSectionToDocument(section, 'advance-directives')}
                        className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
                        title="טען להנחיות מקדימות"
                      >
                        הנחיות
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        מחק
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">אין סעיפים שמורים עדיין</p>
              <p className="text-sm text-gray-400 mt-2">כתוב משהו ולחץ "שמור סעיף"</p>
            </div>
          )}
        </div>
      </div>
      
      {/* מודל הוספת משתנה חדש */}
      {addVariableModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ➕ הוסף משתנה חדש
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם המשתנה
                </label>
                <input
                  type="text"
                  value={addVariableModal.name}
                  onChange={(e) => setAddVariableModal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="לדוגמה: סכום_התשלום"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור המשתנה
                </label>
                <input
                  type="text"
                  value={addVariableModal.description}
                  onChange={(e) => setAddVariableModal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="לדוגמה: סכום התשלום בעד השירות"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סוג המשתנה
                </label>
                <select
                  value={addVariableModal.type}
                  onChange={(e) => setAddVariableModal(prev => ({ ...prev, type: e.target.value as 'text' | 'number' | 'date' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="text">טקסט</option>
                  <option value="number">מספר</option>
                  <option value="date">תאריך</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ערך ברירת מחדל (אופציונלי)
                </label>
                <input
                  type={addVariableModal.type === 'date' ? 'date' : addVariableModal.type === 'number' ? 'number' : 'text'}
                  value={addVariableModal.defaultValue}
                  onChange={(e) => setAddVariableModal(prev => ({ ...prev, defaultValue: e.target.value }))}
                  placeholder="ערך ברירת מחדל"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAddVariableModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ביטול
              </button>
                 <button
                   onClick={createNewVariable}
                   disabled={!addVariableModal.name.trim()}
                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                 >
                   צור משתנה ולהוסיף לטקסט
                 </button>
            </div>
          </div>
        </div>
      )}

      {/* מודל השלמת משתנים */}
      {variablesCompletionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🔧 השלם משתנים
            </h3>
            
            <div className="space-y-4">
              {variablesCompletionModal.variables.map((variableName) => (
                <div key={variableName} className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {`{{${variableName}}}`}
                  </label>
                  <input
                    type="text"
                    value={variablesCompletionModal.values[variableName] || ''}
                    onChange={(e) => setVariablesCompletionModal(prev => ({
                      ...prev,
                      values: {
                        ...prev.values,
                        [variableName]: e.target.value
                      }
                    }))}
                    placeholder={`הזן ערך עבור ${variableName}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setVariablesCompletionModal({ isOpen: false, variables: [], values: {} })}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  // החלפת המשתנים בטקסט
                  let updatedText = text;
                  variablesCompletionModal.variables.forEach(variableName => {
                    const value = variablesCompletionModal.values[variableName];
                    if (value) {
                      const regex = new RegExp(`\\{\\{${variableName}\\}\\}`, 'g');
                      updatedText = updatedText.replace(regex, value);
                    }
                  });
                  
                  setText(updatedText);
                  setVariablesCompletionModal({ isOpen: false, variables: [], values: {} });
                  alert('✅ המשתנים הוחלפו בהצלחה!');
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                החלף משתנים
              </button>
            </div>
          </div>
        </div>
      )}

      {/* מודל השלמת משתנים לשמירה למסמך */}
      {variableCompletionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🔧 השלם משתנים לפני שמירה
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">הטקסט מכיל משתנים שצריך להשלים:</p>
              <div className="text-sm font-mono bg-white p-2 rounded border">
                {variableCompletionModal.text}
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setVariableCompletionModal({
                  isOpen: false,
                  text: '',
                  documentType: 'will'
                })}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ביטול
              </button>
              <button
                onClick={handleCompleteVariablesAndSave}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                השלם משתנים ושמור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
