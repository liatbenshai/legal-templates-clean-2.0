'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, User, Building, Calendar } from 'lucide-react';
import { DraggableItems } from './will-editor/DraggableItems';
import type { WillItem, InheritanceTable, WillSection, WillDocument } from '@/lib/types/will-document';
import { getDefaultSectionsForWillType } from '@/lib/professional-will-texts';
import { exportWillToWord } from '@/lib/export-will-to-word';

export default function NewWillEditor() {
  const [willType, setWillType] = useState<'individual' | 'mutual'>('individual');
  const [items, setItems] = useState<WillItem[]>([]);
  
  // פרטי מצווה/מצווים
  const [testator, setTestator] = useState({
    fullName: '',
    shortName: '',
    id: '',
    address: '',
    city: '',
    gender: 'male' as 'male' | 'female'
  });
  
  // בן/בת זוג (לצוואה הדדית)
  const [spouse, setSpouse] = useState({
    fullName: '',
    shortName: '',
    id: '',
    address: '',
    city: '',
    gender: 'female' as 'male' | 'female'
  });
  
  // פרטי חתימה
  const [willDate, setWillDate] = useState({
    day: new Date().getDate().toString(),
    month: new Date().toLocaleDateString('he-IL', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    city: ''
  });
  
  const [lawyerName, setLawyerName] = useState('');
  const [copyNumber, setCopyNumber] = useState('1');
  const [totalCopies, setTotalCopies] = useState('3');

  // פונקציות לניהול טבלאות
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

  const removeInheritanceTable = (tableId: string) => {
    setItems(items.filter(item => item.id !== tableId));
  };

  const updateTableHeirs = (tableId: string, heirs: any[]) => {
    setItems(items.map(item => 
      item.id === tableId && item.type === 'table' 
        ? { ...item, heirs } 
        : item
    ));
  };

  const reorderItems = (newOrder: WillItem[]) => {
    setItems(newOrder.map((item, index) => ({ ...item, order: index })));
  };

  // פונקציה לייצוא ל-Word
  const handleExportToWord = () => {
    const willDocument: WillDocument = {
      willType,
      items
    };
    
    const filename = `צוואה_${willType === 'individual' ? 'יחיד' : 'הדדית'}_${new Date().toISOString().split('T')[0]}.docx`;
    exportWillToWord(willDocument, filename);
  };

  // טעינת סעיפים דיפולטיביים בהתחלה
  useEffect(() => {
    const defaultSections = getDefaultSectionsForWillType(willType);
    
    const initialItems: WillItem[] = [
      // סעיפים דיפולטיביים
      ...defaultSections.map((section, index) => ({
        id: section.id,
        type: 'section' as const,
        content: section.content,
        order: index,
        isDefault: true,
        variables: {}
      })),
      // טבלת חלוקה ראשונית
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          עורך צוואות מתקדם
        </h1>
        
        {/* בחירת סוג צוואה */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סוג צוואה
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setWillType('individual')}
              className={`px-4 py-2 rounded-lg ${
                willType === 'individual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              צוואת יחיד
            </button>
            <button
              onClick={() => setWillType('mutual')}
              className={`px-4 py-2 rounded-lg ${
                willType === 'mutual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              צוואה הדדית
            </button>
          </div>
        </div>
        
        {/* פרטי מצווה/מצווים */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            פרטי מצווה{willType === 'mutual' ? '/מצווה' : ''}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                type="text"
                value={testator.fullName}
                onChange={(e) => setTestator({...testator, fullName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="שם מלא"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ת.ז.
              </label>
              <input
                type="text"
                value={testator.id}
                onChange={(e) => setTestator({...testator, id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תעודת זהות"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                כתובת
              </label>
              <input
                type="text"
                value={testator.address}
                onChange={(e) => setTestator({...testator, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="רחוב ומספר בית"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                עיר
              </label>
              <input
                type="text"
                value={testator.city}
                onChange={(e) => setTestator({...testator, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="עיר"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מגדר
              </label>
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
        
        {/* פרטי בן/בת זוג (לצוואה הדדית) */}
        {willType === 'mutual' && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              פרטי בן/בת זוג
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שם מלא
                </label>
                <input
                  type="text"
                  value={spouse.fullName}
                  onChange={(e) => setSpouse({...spouse, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="שם מלא"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ת.ז.
                </label>
                <input
                  type="text"
                  value={spouse.id}
                  onChange={(e) => setSpouse({...spouse, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="תעודת זהות"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* פרטי חתימה */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            פרטי חתימה
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תאריך
              </label>
              <input
                type="text"
                value={willDate.day}
                onChange={(e) => setWillDate({...willDate, day: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="יום"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                חודש
              </label>
              <input
                type="text"
                value={willDate.month}
                onChange={(e) => setWillDate({...willDate, month: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="חודש"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שנה
              </label>
              <input
                type="text"
                value={willDate.year}
                onChange={(e) => setWillDate({...willDate, year: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="שנה"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם עורך דין
              </label>
              <input
                type="text"
                value={lawyerName}
                onChange={(e) => setLawyerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="שם עורך הדין"
              />
            </div>
          </div>
        </div>

        {/* כפתורים */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={addInheritanceTable}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            הוסף טבלת חלוקה
          </button>
          
          <button
            onClick={handleExportToWord}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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

        {/* תצוגת מידע על המסמך */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">מידע על המסמך</h3>
          <div className="text-sm text-gray-600">
            <p>סוג צוואה: {willType === 'individual' ? 'צוואת יחיד' : 'צוואה הדדית'}</p>
            <p>סך הכל פריטים: {items.length}</p>
            <p>סעיפים: {items.filter(i => i.type === 'section').length}</p>
            <p>טבלאות חלוקה: {items.filter(i => i.type === 'table').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
