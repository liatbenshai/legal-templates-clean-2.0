'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, ChevronDown, ChevronUp, User, Building, Calendar, GripVertical } from 'lucide-react';
import { DraggableItems } from './will-editor/DraggableItems';
import type { WillItem, InheritanceTable, WillSection, WillDocument } from '@/lib/types/will-document';
import { getDefaultSectionsForWillType } from '@/lib/professional-will-texts';
import { exportWillToWord } from '@/lib/export-will-to-word';
import { replaceTextWithGender } from '@/lib/hebrew-gender';

export default function NewWillEditor() {
  const [willType, setWillType] = useState<'individual' | 'mutual'>('individual');
  const [items, setItems] = useState<WillItem[]>([]);
  
  // מצב הצגה - איזה פרטים להראות
  const [showTestatorDetails, setShowTestatorDetails] = useState(false);
  const [showSpouseDetails, setShowSpouseDetails] = useState(false);
  const [showSignatureDetails, setShowSignatureDetails] = useState(false);
  const [showSections, setShowSections] = useState(true);
  
  // פרטי מצווה
  const [testator, setTestator] = useState({
    fullName: '',
    id: '',
    address: '',
    city: '',
    gender: 'male' as 'male' | 'female'
  });
  
  // בן/בת זוג
  const [spouse, setSpouse] = useState({
    fullName: '',
    id: '',
    address: '',
    city: '',
    gender: 'female' as 'male' | 'female'
  });
  
  // פרטי חתימה
  const [willDate, setWillDate] = useState({
    day: new Date().getDate().toString(),
    month: new Date().toLocaleDateString('he-IL', { month: 'long' }),
    year: new Date().getFullYear().toString()
  });
  
  const [lawyerName, setLawyerName] = useState('');
  const [copyNumber, setCopyNumber] = useState('1');
  const [totalCopies, setTotalCopies] = useState('3');

  // פונקציה למלא משתנים בטקסט
  const fillVariablesInContent = (content: string): string => {
    let filled = content
      .replace(/\{\{testator_full_name\}\}/g, testator.fullName || '________')
      .replace(/\{\{testator_id\}\}/g, testator.id || '________')
      .replace(/\{\{testator_address\}\}/g, testator.address || '________')
      .replace(/\{\{testator_city\}\}/g, testator.city || '________');
    
    // טיפול במגדר
    if (testator.gender) {
      filled = replaceTextWithGender(filled, testator.gender);
    }
    
    return filled;
  };

  // פונקציה למלא משתנים בכל הפריטים
  const getFilledItems = (): WillItem[] => {
    return items.map(item => {
      if (item.type === 'section') {
        return {
          ...item,
          content: fillVariablesInContent(item.content)
        };
      }
      return item;
    });
  };

  // הוספת טבלת חלוקה
  const addInheritanceTable = () => {
    const newTable: InheritanceTable = {
      id: `table-${Date.now()}`,
      type: 'table',
      label: `טבלת חלוקה ${items.filter(i => i.type === 'table').length + 1}`,
      heirs: [],
      order: items.length
    };
    setItems([...items, newTable]);
  };

  // מחיקת טבלה
  const removeInheritanceTable = (tableId: string) => {
    setItems(items.filter(item => item.id !== tableId));
  };

  // עדכון יורשים בטבלה
  const updateTableHeirs = (tableId: string, heirs: any[]) => {
    setItems(items.map(item => 
      item.id === tableId && item.type === 'table' 
        ? { ...item, heirs } 
        : item
    ));
  };

  // סידור מחדש
  const reorderItems = (newOrder: WillItem[]) => {
    setItems(newOrder.map((item, index) => ({ ...item, order: index })));
  };

  // ייצוא ל-Word
  const handleExportToWord = () => {
    const filledItems = getFilledItems();
    const willDocument: WillDocument = {
      willType,
      items: filledItems
    };
    
    const filename = `צוואה_${willType === 'individual' ? 'יחיד' : 'הדדית'}_${new Date().toISOString().split('T')[0]}.docx`;
    exportWillToWord(willDocument, filename);
  };

  // טעינת סעיפים דיפולטיביים
  useEffect(() => {
    const defaultSections = getDefaultSectionsForWillType(willType);
    
    const initialItems: WillItem[] = [
      ...defaultSections.map((section, index) => ({
        id: section.id,
        type: 'section' as const,
        content: section.content,
        order: index,
        isDefault: true,
        variables: {}
      })),
      {
        id: 'table-1',
        type: 'table' as const,
        label: 'טבלת חלוקה ראשית',
        heirs: [],
        order: defaultSections.length
      }
    ];
    
    setItems(initialItems);
  }, [willType]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          עורך צוואות מתקדם
        </h1>
        <p className="text-gray-600 mb-6">
          הזן את פרטי המצווה והזוג (אם רלוונטי), ולאחר מכן ערוך את הסעיפים והטבלאות
        </p>
        
        {/* בחירת סוג צוואה */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            1️⃣ בחר סוג צוואה
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setWillType('individual')}
              className={`px-6 py-3 rounded-lg font-medium ${
                willType === 'individual' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📄 צוואת יחיד
            </button>
            <button
              onClick={() => setWillType('mutual')}
              className={`px-6 py-3 rounded-lg font-medium ${
                willType === 'mutual' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💑 צוואה הדדית
            </button>
          </div>
        </div>
        
        {/* אזור פרטים - Accordion */}
        <div className="space-y-4 mb-6">
          
          {/* פרטי מצווה */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <button
              onClick={() => setShowTestatorDetails(!showTestatorDetails)}
              className="w-full flex items-center justify-between p-4 text-right"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">2️⃣ פרטי מצווה{willType === 'mutual' ? '/מצווה' : ''}</span>
                {testator.fullName && (
                  <span className="text-sm text-gray-500">({testator.fullName})</span>
                )}
              </div>
              {showTestatorDetails ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {showTestatorDetails && (
              <div className="p-6 pt-0 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
                    <input
                      type="text"
                      value={testator.fullName}
                      onChange={(e) => setTestator({...testator, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="דוד כהן"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ת.ז. *</label>
                    <input
                      type="text"
                      value={testator.id}
                      onChange={(e) => setTestator({...testator, id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
                    <input
                      type="text"
                      value={testator.address}
                      onChange={(e) => setTestator({...testator, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="רחוב משה דיין 15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">עיר</label>
                    <input
                      type="text"
                      value={testator.city}
                      onChange={(e) => setTestator({...testator, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="תל אביב"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">מגדר *</label>
                    <select
                      value={testator.gender}
                      onChange={(e) => setTestator({...testator, gender: e.target.value as 'male' | 'female'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">זכר</option>
                      <option value="female">נקבה</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* פרטי בן/בת זוג (רק לצוואה הדדית) */}
          {willType === 'mutual' && (
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <button
                onClick={() => setShowSpouseDetails(!showSpouseDetails)}
                className="w-full flex items-center justify-between p-4 text-right"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">3️⃣ פרטי בן/בת זוג</span>
                  {spouse.fullName && (
                    <span className="text-sm text-gray-500">({spouse.fullName})</span>
                  )}
                </div>
                {showSpouseDetails ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              {showSpouseDetails && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
                      <input
                        type="text"
                        value={spouse.fullName}
                        onChange={(e) => setSpouse({...spouse, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="שרה כהן"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ת.ז. *</label>
                      <input
                        type="text"
                        value={spouse.id}
                        onChange={(e) => setSpouse({...spouse, id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="987654321"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* פרטי חתימה */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <button
              onClick={() => setShowSignatureDetails(!showSignatureDetails)}
              className="w-full flex items-center justify-between p-4 text-right"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">4️⃣ פרטי חתימה</span>
                {willDate.day && willDate.month && willDate.year && (
                  <span className="text-sm text-gray-500">({willDate.day} {willDate.month} {willDate.year})</span>
                )}
              </div>
              {showSignatureDetails ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {showSignatureDetails && (
              <div className="p-6 pt-0 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">יום</label>
                    <input
                      type="text"
                      value={willDate.day}
                      onChange={(e) => setWillDate({...willDate, day: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">חודש</label>
                    <input
                      type="text"
                      value={willDate.month}
                      onChange={(e) => setWillDate({...willDate, month: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="ינואר"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שנה</label>
                    <input
                      type="text"
                      value={willDate.year}
                      onChange={(e) => setWillDate({...willDate, year: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="2024"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם עורך דין</label>
                    <input
                      type="text"
                      value={lawyerName}
                      onChange={(e) => setLawyerName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="עו״ד ישראל ישראלי"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* אזור הסעיפים והטבלאות */}
        <div className="mb-6">
          <button
            onClick={() => setShowSections(!showSections)}
            className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg shadow mb-4"
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5" />
              <span className="font-semibold">5️⃣ סעיפים וטבלאות (לחץ לעריכה)</span>
              <span className="text-sm opacity-90">({items.length} פריטים)</span>
            </div>
            {showSections ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {showSections && (
          <>
            {/* כפתורים */}
            <div className="mb-6 flex gap-4">
              <button
                onClick={addInheritanceTable}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow"
              >
                <Plus className="w-5 h-5" />
                הוסף טבלת חלוקה
              </button>
              
              <button
                onClick={handleExportToWord}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow"
              >
                <Download className="w-5 h-5" />
                ייצא ל-Word
              </button>
            </div>

            {/* רשימת פריטים ניתנים לגרירה */}
            <DraggableItems
              items={items}
              onReorder={reorderItems}
              onRemoveTable={removeInheritanceTable}
              onUpdateTable={updateTableHeirs}
            />

            {/* תצוגת מידע */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">📊 סיכום המסמך</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-600">סוג צוואה</div>
                  <div className="text-gray-900">{willType === 'individual' ? 'צוואת יחיד' : 'צוואה הדדית'}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">סך הפריטים</div>
                  <div className="text-gray-900">{items.length}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">סעיפים</div>
                  <div className="text-gray-900">{items.filter(i => i.type === 'section').length}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">טבלאות</div>
                  <div className="text-gray-900">{items.filter(i => i.type === 'table').length}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
