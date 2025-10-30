'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GenderSelector from './GenderSelector';
import ProfessionalWordExporter from './ProfessionalWordExporter';
import type { Gender } from '@/lib/hebrew-gender';
import { replaceTextWithGender, detectGenderFromName } from '@/lib/hebrew-gender';
import { generateProfessionalWillContent } from '@/lib/professional-will-texts';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import EditableSection from './LearningSystem/EditableSection';
import WarehouseManager from './LearningSystem/WarehouseManager';
import AILearningManager from './AILearningManager';
import UnifiedWarehouse from './UnifiedWarehouse';
import { useDocuments } from '@/lib/useDocuments';
import { useWarehouse } from '@/lib/hooks/useWarehouse';
import { supabase } from '@/lib/supabase-client';

interface Property {
  name: string;
  address: string;
  city: string;
  block: string;
  plot: string;
  subPlot: string;
  ownership?: string;
}

interface BankAccount {
  bank: string;
  bankNumber: string;
  branch: string;
  accountNumber: string;
  location: string;
}

interface Heir {
  firstName: string;
  lastName: string;
  id: string;
  relation: string;
  share: string;
  gender: 'male' | 'female';
}

interface Witness {
  name: string;
  id: string;
  address: string;
  gender: 'male' | 'female';
}

interface ProfessionalWillFormProps {
  defaultWillType?: 'individual' | 'mutual';
}

// רכיב SortableSectionItem להזזת סעיפים
function SortableSectionItem({ 
  section, 
  getSectionNumber, 
  changeSectionLevel, 
  moveSectionUp, 
  moveSectionDown,
  handleLoadSectionToWarehouse,
  handleSaveSectionTemplate,
  handleLoadSectionToDocument,
  onDelete,
  onEdit,
  onEditTitle,
  inheritanceTables,
  setInheritanceTables,
  customSections,
  setCustomSections
}: {
  section: any;
  getSectionNumber: (section: any) => string;
  changeSectionLevel: (id: string, level: 'main' | 'sub' | 'sub-sub') => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  handleLoadSectionToWarehouse: (section: any) => void;
  handleSaveSectionTemplate: (section: any) => void;
  handleLoadSectionToDocument: (section: any, type: 'fee-agreement' | 'advance-directives') => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onEditTitle: (id: string, title: string) => void;
  inheritanceTables: any[];
  setInheritanceTables: any;
  customSections: any[];
  setCustomSections: any;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content);
  const [editTitle, setEditTitle] = useState(section.title);
  
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
    id: section.id 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onEdit(section.id, editContent);
    // עדכון הכותרת אם השתנה
    if (editTitle !== section.title) {
      onEditTitle(section.id, editTitle);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(section.content);
    setEditTitle(section.title);
    setIsEditing(false);
  };

  // עדכון כאשר הסעיף משתנה
  useEffect(() => {
    setEditContent(section.content);
    setEditTitle(section.title);
  }, [section.content, section.title]);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`bg-white p-3 rounded-lg border ${
        section.isFixed ? 'border-purple-400 bg-purple-50' :
        section.level === 'main' ? 'border-green-400' : 
        section.level === 'sub' ? 'border-blue-400' : 'border-purple-400'
      } ${section.level === 'sub' ? 'ml-4' : section.level === 'sub-sub' ? 'ml-8' : ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {/* ידית גרירה */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            title="גרור להזזה"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </button>
          
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {getSectionNumber(section)}
          </span>
          {section.isFixed && (
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
              📌 קבוע
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded ${
            section.level === 'main' ? 'bg-green-100 text-green-700' : 
            section.level === 'sub' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {section.level === 'main' ? 'ראשי' : section.level === 'sub' ? 'תת-סעיף' : 'תת-תת-סעיף'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* כפתור עריכה */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            title="ערוך סעיף"
          >
            ✏️
          </button>
          
          {/* כפתורי רמה */}
          <div className="flex gap-1">
            <button
              onClick={() => changeSectionLevel(section.id, 'main')}
              className={`px-2 py-1 text-xs rounded ${
                section.level === 'main' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-green-100'
              }`}
              title="הפוך לראשי"
            >
              ראשי
            </button>
            <button
              onClick={() => changeSectionLevel(section.id, 'sub')}
              className={`px-2 py-1 text-xs rounded ${
                section.level === 'sub' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
              }`}
              title="הפוך לתת-סעיף"
            >
              תת
            </button>
            <button
              onClick={() => changeSectionLevel(section.id, 'sub-sub')}
              className={`px-2 py-1 text-xs rounded ${
                section.level === 'sub-sub' ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
              }`}
              title="הפוך לתת-תת-סעיף"
            >
              תת-תת
            </button>
          </div>
          
          {/* כפתורי טעינה למחסן ומסמכים */}
          <div className="flex gap-1">
            <button
              onClick={() => handleLoadSectionToWarehouse(section)}
              className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition"
              title="טען למחסן אישי"
            >
              מחסן
            </button>
            <button
              onClick={() => handleSaveSectionTemplate(section)}
              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
              title="שמור כתבנית קבועה"
            >
              תבנית
            </button>
          </div>
          
          {/* כפתור מחיקה */}
          <button
            onClick={() => onDelete(section.id)}
            className="text-red-500 hover:text-red-700 text-xs"
            title="מחק סעיף"
          >
            🗑️
          </button>
        </div>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">כותרת:</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">תוכן:</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              rows={6}
              dir="rtl"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              שמור
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              ביטול
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* תוכן הסעיף */}
          {section.content && (
            <div className="text-sm text-gray-700 whitespace-pre-line mb-3">
              <span className="font-semibold">{getSectionNumber(section)}: </span>
              {section.content}
            </div>
          )}
          
          {/* טבלה אם יש tableId */}
          {section.tableId && (() => {
            const table = inheritanceTables.find(t => t.id === section.tableId);
            if (!table) return null;
            
            return (
              <div className="mb-3">
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg border text-sm">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-3 py-2 text-right border">שם פרטי</th>
                        <th className="px-3 py-2 text-right border">שם משפחה</th>
                        <th className="px-3 py-2 text-right border">ת.ז.</th>
                        <th className="px-3 py-2 text-right border">קרבה</th>
                        <th className="px-3 py-2 text-right border">חלק</th>
                        <th className="px-3 py-2 text-right border">מגדר</th>
                        <th className="px-3 py-2 text-right border">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.heirs.map((heir: any, heirIndex: number) => (
                        <tr key={heirIndex} className="border-t">
                          <td className="px-3 py-2 border">
                            <input
                              type="text"
                              value={heir.firstName || ''}
                              onChange={(e) => {
                                setInheritanceTables((prev: any[]) => prev.map(t => 
                                  t.id === table.id 
                                    ? { ...t, heirs: t.heirs.map((h: any, i: number) => i === heirIndex ? { ...h, firstName: e.target.value } : h) }
                                    : t
                                ));
                              }}
                              className="w-full px-2 py-1 border rounded text-sm"
                              dir="rtl"
                              placeholder="שם פרטי"
                            />
                          </td>
                          <td className="px-3 py-2 border">
                            <input
                              type="text"
                              value={heir.lastName || ''}
                              onChange={(e) => {
                                setInheritanceTables((prev: any[]) => prev.map(t => 
                                  t.id === table.id 
                                    ? { ...t, heirs: t.heirs.map((h: any, i: number) => i === heirIndex ? { ...h, lastName: e.target.value } : h) }
                                    : t
                                ));
                              }}
                              className="w-full px-2 py-1 border rounded text-sm"
                              dir="rtl"
                              placeholder="שם משפחה"
                            />
                          </td>
                          <td className="px-3 py-2 border">
                            <input
                              type="text"
                              value={heir.id || ''}
                              onChange={(e) => {
                                setInheritanceTables((prev: any[]) => prev.map(t => 
                                  t.id === table.id 
                                    ? { ...t, heirs: t.heirs.map((h: any, i: number) => i === heirIndex ? { ...h, id: e.target.value } : h) }
                                    : t
                                ));
                              }}
                              className="w-full px-2 py-1 border rounded text-sm"
                              dir="ltr"
                              placeholder="ת.ז."
                            />
                          </td>
                          <td className="px-3 py-2 border">
                            <input
                              type="text"
                              value={heir.relation || ''}
                              onChange={(e) => {
                                setInheritanceTables((prev: any[]) => prev.map(t => 
                                  t.id === table.id 
                                    ? { ...t, heirs: t.heirs.map((h: any, i: number) => i === heirIndex ? { ...h, relation: e.target.value } : h) }
                                    : t
                                ));
                              }}
                              className="w-full px-2 py-1 border rounded text-sm"
                              dir="rtl"
                              placeholder="קרבה"
                            />
                          </td>
                          <td className="px-3 py-2 border">
                            <input
                              type="text"
                              value={heir.share || ''}
                              onChange={(e) => {
                                setInheritanceTables((prev: any[]) => prev.map(t => 
                                  t.id === table.id 
                                    ? { ...t, heirs: t.heirs.map((h: any, i: number) => i === heirIndex ? { ...h, share: e.target.value } : h) }
                                    : t
                                ));
                              }}
                              className="w-full px-2 py-1 border rounded text-sm"
                              dir="ltr"
                              placeholder="חלק"
                            />
                          </td>
                          <td className="px-3 py-2 border">
                            <select
                              value={heir.gender || 'male'}
                              onChange={(e) => {
                                setInheritanceTables((prev: any[]) => prev.map(t => 
                                  t.id === table.id 
                                    ? { ...t, heirs: t.heirs.map((h: any, i: number) => i === heirIndex ? { ...h, gender: e.target.value } : h) }
                                    : t
                                ));
                              }}
                              className="w-full px-2 py-1 border rounded text-sm"
                            >
                              <option value="male">זכר</option>
                              <option value="female">נקבה</option>
                            </select>
                          </td>
                          <td className="px-3 py-2 border">
                            <button
                              onClick={() => {
                                setInheritanceTables((prev: any[]) => prev.map(t => 
                                  t.id === table.id 
                                    ? { ...t, heirs: t.heirs.filter((_: any, i: number) => i !== heirIndex) }
                                    : t
                                ));
                              }}
                              className="text-red-500 hover:text-red-700 text-xs"
                              title="מחק יורש"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                      {table.heirs.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-4 text-center text-gray-500 border">
                            אין יורשים בטבלה זו. לחץ על "➕ הוסף יורש" להוסיף יורשים.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => {
                    const newHeir = {
                      firstName: '',
                      lastName: '',
                      id: '',
                      relation: '',
                      share: '',
                      gender: 'male'
                    };
                    setInheritanceTables((prev: any[]) => prev.map(t => 
                      t.id === table.id 
                        ? { ...t, heirs: [...t.heirs, newHeir] }
                        : t
                    ));
                  }}
                  className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 border border-purple-300"
                >
                  ➕ הוסף יורש
                </button>
                
                {/* תתי-סעיפים מתחת לטבלה */}
                <div className="mt-3 space-y-2">
                  {table.subSections && table.subSections.length > 0 && table.subSections.sort((a: any, b: any) => a.order - b.order).map((subSection: any, subIndex: number) => (
                    <InheritanceTableSubSection
                      key={subSection.id}
                      subSection={subSection}
                      subIndex={subIndex}
                      sectionNumber={getSectionNumber(section)}
                      onUpdate={(updated) => {
                        setInheritanceTables((prev: any[]) => prev.map(t => 
                          t.id === table.id 
                            ? { ...t, subSections: t.subSections.map((s: any) => s.id === subSection.id ? updated : s) || [] }
                            : t
                        ));
                      }}
                      onDelete={() => {
                        setInheritanceTables((prev: any[]) => prev.map(t => 
                          t.id === table.id 
                            ? { ...t, subSections: t.subSections.filter((s: any) => s.id !== subSection.id) || [] }
                            : t
                        ));
                      }}
                    />
                  ))}
                  
                  {/* כפתור הוספת תת-סעיף */}
                  <button
                    onClick={() => {
                      const title = prompt('כותרת תת-הסעיף:');
                      if (title) {
                        const newSubSection = {
                          id: `sub-${Date.now()}`,
                          title: title.trim(),
                          content: prompt('תוכן תת-הסעיף:') || '',
                          order: (table.subSections?.length || 0) + 1
                        };
                        setInheritanceTables((prev: any[]) => prev.map(t => 
                          t.id === table.id 
                            ? { ...t, subSections: [...(t.subSections || []), newSubSection] }
                            : t
                        ));
                      }
                    }}
                    className="w-full px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 border border-purple-300"
                  >
                    ➕ הוסף תת-סעיף מתחת לטבלה
                  </button>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

// קומפוננטה לתת-סעיף של סעיף 3
function Section3SubSectionItem({
  subSection,
  subSectionNum,
  onUpdate,
  onDelete
}: {
  subSection: { id: string; title: string; content: string };
  subSectionNum: number;
  onUpdate: (updated: { id: string; title: string; content: string }) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subSection.title);
  const [editContent, setEditContent] = useState(subSection.content);

  useEffect(() => {
    setEditTitle(subSection.title);
    setEditContent(subSection.content);
  }, [subSection.title, subSection.content]);

  const handleSave = () => {
    onUpdate({
      ...subSection,
      title: editTitle,
      content: editContent
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(subSection.title);
    setEditContent(subSection.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-blue-50 p-3 rounded border border-blue-200 mr-4">
      <div className="flex justify-between items-center mb-1">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm"
            dir="rtl"
          />
        ) : (
          <h4 className="font-semibold text-blue-800 mb-1">3.{subSectionNum} - {subSection.title}</h4>
        )}
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
              >
                ✓ שמור
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
              >
                ✕ ביטול
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
              >
                ✏️ ערוך
              </button>
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm mt-2"
          rows={4}
          dir="rtl"
        />
      ) : (
        <div className="text-sm text-gray-700">{subSection.content}</div>
      )}
    </div>
  );
}

// קומפוננטה לתת-סעיף של טבלת ירושה
function InheritanceTableSubSection({
  subSection,
  subIndex,
  onUpdate,
  onDelete,
  sectionNumber
}: {
  subSection: { id: string; title: string; content: string; order: number };
  subIndex: number;
  onUpdate: (updated: { id: string; title: string; content: string; order: number }) => void;
  onDelete: () => void;
  sectionNumber?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subSection.title);
  const [editContent, setEditContent] = useState(subSection.content);

  useEffect(() => {
    setEditTitle(subSection.title);
    setEditContent(subSection.content);
  }, [subSection.title, subSection.content]);

  const handleSave = () => {
    onUpdate({
      ...subSection,
      title: editTitle,
      content: editContent
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(subSection.title);
    setEditContent(subSection.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-purple-50 p-2 rounded border border-purple-200">
      <div className="flex justify-between items-center mb-1">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm"
            dir="rtl"
          />
        ) : (
          <h5 className="font-semibold text-purple-800 text-sm">
            {sectionNumber ? `${sectionNumber}.${subIndex + 1}` : `${subIndex + 1}`} - {subSection.title}
          </h5>
        )}
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
              >
                ✓ שמור
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
              >
                ✕ ביטול
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
              >
                ✏️ ערוך
              </button>
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm mt-2"
          rows={4}
          dir="rtl"
        />
      ) : (
        <div className="text-sm text-gray-700 whitespace-pre-line">{subSection.content}</div>
      )}
    </div>
  );
}

export default function ProfessionalWillForm({ defaultWillType = 'individual' }: ProfessionalWillFormProps = {}) {
  const [willType, setWillType] = useState<'individual' | 'mutual'>(defaultWillType);
  
  // ← הוסף את useDocuments hook
  const { saveSection } = useDocuments();
  
  // בדיקה אם יש טקסט מ-ai-learning
  useEffect(() => {
    const savedText = localStorage.getItem('ai-improved-section-will');
    if (savedText) {
      try {
        const data = JSON.parse(savedText);
        if (data.content && confirm('📥 נמצא טקסט משופר מעמוד למידת AI. לטעון אותו?')) {
          // הוסף את הטקסט למערך הסעיפים הנוספים
          setCustomSections(prev => [...prev, {
            id: generateSectionId(),
            title: 'סעיף משופר מ-AI',
            content: data.content,
            level: 'main' as const,
            order: getNextOrder()
          }]);
          // נקה את הזיכרון
          localStorage.removeItem('ai-improved-section-will');
          alert('✅ הטקסט נטען בהצלחה!');
        }
      } catch (err) {
        console.error('Error loading AI text:', err);
      }
    }
  }, []);
  
  // פרטי מצווה ראשי
  const [testator, setTestator] = useState({
    fullName: '',
    shortName: '',
    id: '',
    address: '',
    gender: 'male' as Gender
  });

  // טעינת מגדר המצווה מ-localStorage
  useEffect(() => {
    const savedGender = localStorage.getItem('testator-gender');
    if (savedGender && (savedGender === 'male' || savedGender === 'female' || savedGender === 'organization')) {
      setTestator(prev => ({ ...prev, gender: savedGender as Gender }));
      console.log('✅ נטען מגדר המצווה מ-localStorage:', savedGender);
    }
  }, []);

  // Warehouse hook
  const { addSection, updateSection, sections: warehouseSections } = useWarehouse(testator.fullName || 'anonymous');

  // בן/בת זוג (לצוואה הדדית)
  const [spouse, setSpouse] = useState({
    fullName: '',
    shortName: '',
    id: '',
    address: '',
    gender: 'female' as Gender
  });

  // נכסים
  const [properties, setProperties] = useState<Property[]>([
    {
      name: 'דירת המגורים',
      address: '',
      city: '',
      block: '',
      plot: '',
      subPlot: '',
      ownership: '100%'
    }
  ]);

  // חשבונות בנק
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      bank: '',
      bankNumber: '',
      branch: '',
      accountNumber: '',
      location: ''
    }
  ]);

  // יורשים
  const [heirs, setHeirs] = useState<Heir[]>([
    {
      firstName: '',
      lastName: '',
      id: '',
      relation: '',
      share: '100%',
      gender: 'male'
    }
  ]);

  // יורשים חלופיים (לצוואה הדדית)
  const [alternativeHeirs, setAlternativeHeirs] = useState<Heir[]>([]);

  // עדים
  const [witnesses, setWitnesses] = useState<Witness[]>([
    {
      name: '',
      id: '',
      address: '',
      gender: 'male'
    },
    {
      name: '',
      id: '',
      address: '',
      gender: 'male'
    }
  ]);

  // נאמן
  const [trustee, setTrustee] = useState({
    name: '',
    id: '',
    address: '',
    gender: 'male' as 'male' | 'female'
  });

  // רואה חשבון
  const [accountant, setAccountant] = useState({
    name: '',
    id: '',
    address: '',
    gender: 'male' as 'male' | 'female'
  });

  // פרטי חתימה
  const [willDate, setWillDate] = useState({
    day: new Date().getDate().toString(),
    month: new Date().toLocaleDateString('he-IL', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    city: ''
  });

  const [lawyerName, setLawyerName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [vehicleInstructions, setVehicleInstructions] = useState('');
  const [copyNumber, setCopyNumber] = useState('1');
  const [totalCopies, setTotalCopies] = useState('3');
  const [customSections, setCustomSections] = useState<Array<{
    id: string;
    title: string;
    content: string;
    level: 'main' | 'sub' | 'sub-sub';
    parentId?: string;
    order: number;
    type?: 'text' | 'property' | 'heirs' | 'bank-account';
    tableId?: string; // ID של טבלה מקושרת
    tableData?: any;
    isFixed?: boolean; // סעיף קבוע
  }>>([
    { 
      id: 'section_1', 
      title: 'הוראות מיוחדות לגבי הרכוש', 
      content: 'אני מצווה כי כל הרכוש שלי יחולק באופן שווה בין ילדיי.',
      level: 'main',
      order: 1,
      type: 'text'
    },
    { 
      id: 'section_2', 
      title: 'הוראות לגבי חיות מחמד', 
      content: 'אני מצווה כי הכלב שלי יעבור לטיפול של בתי הבכורה.',
      level: 'main',
      order: 2,
      type: 'text'
    }
  ]);
  const [heirsDisplayMode, setHeirsDisplayMode] = useState<'table' | 'list'>('list');
  const [showFullWill, setShowFullWill] = useState(false);
  
  // טבלאות ירושה (כולל טבלה ראשית וטבלאות נוספות)
  const [inheritanceTables, setInheritanceTables] = useState<Array<{
    id: string;
    title: string;
    isMain: boolean; // האם זו הטבלה הראשית
    heirs: Heir[]; // רק לטבלאות נוספות - הראשית משתמשת ב-heirs state
    order: number;
    subSections?: Array<{
      id: string;
      title: string;
      content: string;
      order: number;
    }>;
  }>>([
    {
      id: 'main-inheritance-table',
      title: 'חלוקת העיזבון',
      isMain: true,
      heirs: [],
      order: 1,
      subSections: []
    }
  ]);
  
  // עדכון הטבלה הראשית כשה-heirs משתנים - הטבלה הראשית תמיד משתמשת ב-heirs state הנוכחי
  
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
  
  // מודל הוספת סעיף למחסן
  const [addSectionModal, setAddSectionModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    category: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
    category: 'custom'
  });

  // מודל הוספת סעיף קבוע
  const [addFixedSectionModal, setAddFixedSectionModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: ''
  });

  // מודל הוספת סעיף עם טבלה
  const [addSectionWithTableModal, setAddSectionWithTableModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    type: 'text' | 'property' | 'heirs' | 'bank-account';
    tableData: any;
  }>({
    isOpen: false,
    title: '',
    content: '',
    type: 'text',
    tableData: null
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

  // פונקציה לפתיחת מודל השלמת משתנים
  const openVariablesCompletionModal = () => {
    // אוסף את כל הטקסט מהסעיפים המותאמים אישית
    const allText = customSections.map(section => section.content).join('\n\n');
    
    // מזהה משתנים בטקסט
    const extractedVariables = extractVariablesFromText(allText);
    
    if (extractedVariables.length === 0) {
      alert('לא נמצאו משתנים בטקסט. השתמש ב-{{שם משתנה}} כדי ליצור משתנים.');
      return;
    }
    
    setVariablesCompletionModal({
      isOpen: true,
      variables: extractedVariables,
      values: {},
      genders: {},
      pendingSection: null
    });
  };

  // פונקציה לחילוץ משתנים מטקסט
  const extractVariablesFromText = (text: string): string[] => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = text.match(variableRegex);
    if (!matches) return [];
    
    // מחזיר משתנים ייחודיים
    return [...new Set(matches.map(match => match.slice(2, -2)))];
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
    
    // הצגת המשתנה שנוצר
    const variableText = `{{${newVariable.name}}}`;
    alert(`✅ משתנה "${newVariable.name}" נוצר בהצלחה!\nניתן להשתמש בו כ: ${variableText}\n\nהעתק את המשתנה והדבק אותו בסעיף הרצוי.`);
    
    closeAddVariableModal();
    return newVariable;
  };
  
  // פונקציות לניהול מודל הוספת סעיף
  const openAddSectionModal = () => {
    setAddSectionModal({
      isOpen: true,
      title: '',
      content: '',
      category: 'custom'
    });
  };
  
  const closeAddSectionModal = () => {
    setAddSectionModal({
      isOpen: false,
      title: '',
      content: '',
      category: 'custom'
    });
  };
  
  const createNewSection = async () => {
    if (!addSectionModal.title.trim() || !addSectionModal.content.trim()) return;
    
    await handleAddSectionToWarehouse(
      addSectionModal.title.trim(),
      addSectionModal.content.trim(),
      addSectionModal.category
    );
    
    closeAddSectionModal();
  };

  // פונקציות לניהול מודל הוספת סעיף קבוע
  const openAddFixedSectionModal = () => {
    setAddFixedSectionModal({
      isOpen: true,
      title: '',
      content: ''
    });
  };

  const closeAddFixedSectionModal = () => {
    setAddFixedSectionModal({
      isOpen: false,
      title: '',
      content: ''
    });
  };

  const handleAddFixedSection = () => {
    if (!addFixedSectionModal.title.trim() || !addFixedSectionModal.content.trim()) return;
    
    const newSection = {
      id: generateSectionId(),
      title: addFixedSectionModal.title.trim(),
      content: addFixedSectionModal.content.trim(),
      level: 'main' as const,
      order: getNextOrder(),
      type: 'text' as const,
      isFixed: true // סעיף קבוע
    };
    
    setCustomSections(prev => [...prev, newSection]);
    closeAddFixedSectionModal();
  };

  // הוספת סעיף עם טבלה
  const handleAddSectionWithTable = () => {
    const sectionTitle = prompt('כותרת הסעיף:');
    if (!sectionTitle) return;

    const sectionId = generateSectionId();
    const tableId = generateSectionId();
    
    // יצירת טבלה חדשה
    const newTable = {
      id: tableId,
      title: 'טבלת חלוקה',
      isMain: false,
      heirs: [],
      order: inheritanceTables.length + 1,
      subSections: []
    };
    
    setInheritanceTables(prev => [...prev, newTable]);

    // יצירת סעיף חדש שמקושר לטבלה
    const newSection = {
      id: sectionId,
      title: sectionTitle.trim(),
      content: prompt('תוכן הסעיף (אופציונלי):') || '',
      level: 'main' as const,
      order: getNextOrder(),
      type: 'text' as const,
      tableId: tableId, // קישור לטבלה
      isFixed: false
    };

    setCustomSections(prev => [...prev, newSection]);
  };

  // Drag and Drop handler להזזת סעיפים
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCustomSections((prev) => {
        const sortedSections = [...prev].sort((a, b) => a.order - b.order);
        const oldIndex = sortedSections.findIndex(s => s.id === active.id);
        const newIndex = sortedSections.findIndex(s => s.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newSections = arrayMove(sortedSections, oldIndex, newIndex);
          // עדכון סדר
          return newSections.map((section, index) => ({
            ...section,
            order: index + 1
          }));
        }
        return prev;
      });
    }
  };
  
  // פונקציות לניהול היררכיית סעיפים
  const generateSectionId = () => `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const getNextOrder = () => {
    return customSections.length > 0 ? Math.max(...customSections.map(s => s.order)) + 1 : 1;
  };
  
  const changeSectionLevel = (sectionId: string, newLevel: 'main' | 'sub' | 'sub-sub') => {
    setCustomSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          level: newLevel,
          parentId: newLevel === 'main' ? undefined : section.parentId
        };
      }
      return section;
    }));
  };
  
  const moveSectionUp = (sectionId: string) => {
    setCustomSections(prev => {
      const sortedSections = [...prev].sort((a, b) => a.order - b.order);
      const currentIndex = sortedSections.findIndex(s => s.id === sectionId);
      
      if (currentIndex > 0) {
        const newSections = [...sortedSections];
        [newSections[currentIndex - 1], newSections[currentIndex]] = [newSections[currentIndex], newSections[currentIndex - 1]];
        
        // עדכון סדר
        return newSections.map((section, index) => ({
          ...section,
          order: index + 1
        }));
      }
      return prev;
    });
  };
  
  const moveSectionDown = (sectionId: string) => {
    setCustomSections(prev => {
      const sortedSections = [...prev].sort((a, b) => a.order - b.order);
      const currentIndex = sortedSections.findIndex(s => s.id === sectionId);
      
      if (currentIndex < sortedSections.length - 1) {
        const newSections = [...sortedSections];
        [newSections[currentIndex], newSections[currentIndex + 1]] = [newSections[currentIndex + 1], newSections[currentIndex]];
        
        // עדכון סדר
        return newSections.map((section, index) => ({
          ...section,
          order: index + 1
        }));
      }
      return prev;
    });
  };
  
  const getSectionNumber = (section: any) => {
    // סעיפים קבועים: 1, 2, 3, 4
    const fixedSectionsCount = 4;
    
    // סעיפים מותאמים אישית (לא קבועים) ברמה ראשית
    const sortedMainCustomSections = [...customSections]
      .filter(s => s.level === 'main' && !s.isFixed)
      .sort((a, b) => a.order - b.order);
    
    // סעיפים קבועים ברמה ראשית (אחרי סעיף 4)
    const sortedFixedSections = [...customSections]
      .filter(s => s.level === 'main' && s.isFixed)
      .sort((a, b) => a.order - b.order);
    
    // כל הסעיפים הראשיים
    const allMainSections = [...sortedMainCustomSections, ...sortedFixedSections];
    
    if (section.level === 'main') {
      // מצא את הסעיף ברשימה
      const mainIndex = allMainSections.findIndex(s => s.id === section.id);
      // המספור מתחיל מ-5 (אחרי סעיפים 1, 2, 3, 4 הקבועים)
      return `${fixedSectionsCount + mainIndex + 1}`;
    } else if (section.level === 'sub') {
      // מצא את הסעיף הראשי שיור
      const parentMain = allMainSections.find(s => s.id === section.parentId);
      if (!parentMain) return '';
      
      const parentMainIndex = allMainSections.findIndex(s => s.id === section.parentId);
      const parentSectionNum = fixedSectionsCount + parentMainIndex + 1;
      
      // מצא את כל התתי-סעיפים של הסעיף הראשי הזה
      const subSections = [...customSections]
        .filter(s => s.level === 'sub' && s.parentId === section.parentId)
        .sort((a, b) => a.order - b.order);
      
      const subIndex = subSections.findIndex(s => s.id === section.id);
      return `${parentSectionNum}.${subIndex + 1}`;
    } else if (section.level === 'sub-sub') {
      // מצא את הסעיף הראשי שיור
      const parentMain = allMainSections.find(s => s.id === section.parentId);
      if (!parentMain) return '';
      
      const parentMainIndex = allMainSections.findIndex(s => s.id === section.parentId);
      const parentSectionNum = fixedSectionsCount + parentMainIndex + 1;
      
      // מצא את כל התתי-תתי-סעיפים
      const subSubSections = [...customSections]
        .filter(s => s.level === 'sub-sub' && s.parentId === section.parentId)
        .sort((a, b) => a.order - b.order);
      
      const subSubIndex = subSubSections.findIndex(s => s.id === section.id);
      return `${parentSectionNum}.${subSubIndex + 1}`;
    }
    
    return '';
  };
  
  // טעינת סעיף למחסן אישי  
  const handleLoadSectionToWarehouse = async (section: any) => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      
      const { error } = await supabase
        .from('saved_sections')
        .insert([
          {
            title: section.title + ' (עותק מצוואה)',
            content: section.content,
          },
        ]);

      if (error) {
        console.error('Error:', error);
        alert('שגיאה בשמירה למחסן');
        return;
      }

      alert(`✅ הסעיף "${section.title}" נטען למחסן האישי!`);
    } catch (err) {
      console.error('Error:', err);
      alert('שגיאה בטעינת הסעיף למחסן');
    }
  };

  // טעינת סעיף ישירות למסמך
  const handleLoadSectionToDocument = (section: any, documentType: 'fee-agreement' | 'advance-directives') => {
    const saveKey = `ai-improved-section-${documentType}`;
    localStorage.setItem(saveKey, JSON.stringify({
      content: section.content,
      timestamp: Date.now(),
      hasVariables: false
    }));

    alert('✅ הסעיף נטען! עכשיו עובר לדף המסמך...');
    
    const routes = {
      'fee-agreement': '/documents/fee-agreement',
      'advance-directives': '/documents/advance-directives'
    };
    
    window.location.href = routes[documentType];
  };

  // שמירת תבנית סעיף עם היררכיה
  const handleSaveSectionTemplate = async (section: any) => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      
      // מצא את כל התתי סעיפים של הסעיף הזה
      const childSections = customSections.filter(s => s.parentId === section.id);
      
      // צור תבנית עם הסעיף הראשי וכל התתי סעיפים
      const template = {
        title: section.title + ' (תבנית)',
        main_section: {
          title: section.title,
          content: section.content,
          level: section.level
        },
        child_sections: childSections.map(child => ({
          title: child.title,
          content: child.content,
          level: child.level
        }))
      };

      // שמור ב-Supabase
      const { error } = await supabase
        .from('section_templates')
        .insert([template]);

      if (error) {
        console.error('Error saving template:', error);
        alert('שגיאה בשמירת התבנית');
        return;
      }

      alert(`✅ התבנית "${section.title}" נשמרה! ניתן לטעון אותה מחדש בכל עת.`);
    } catch (err) {
      console.error('Error saving template:', err);
      alert('שגיאה בשמירת התבנית');
    }
  };

  // טעינת תבנית סעיף
  const handleLoadTemplate = async () => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      
      // טען תבניות מ-Supabase
      const { data: templates, error } = await supabase
        .from('section_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading templates:', error);
        alert('שגיאה בטעינת התבניות');
        return;
      }

      if (!templates || templates.length === 0) {
        alert('אין תבניות שמורות. שמור תבנית קודם על ידי לחיצה על "תבנית" ליד סעיף.');
        return;
      }

      // הצג רשימה של התבניות
      const templateList = templates.map((template: any, index: number) => 
        `${index + 1}. ${template.title} (${template.child_sections.length} תתי סעיפים)`
      ).join('\n');

      const choice = prompt(`בחר תבנית לטעינה:\n\n${templateList}\n\nהזן מספר (1-${templates.length}):`);
      
      if (!choice || isNaN(Number(choice))) return;
      
      const templateIndex = Number(choice) - 1;
      if (templateIndex < 0 || templateIndex >= templates.length) {
        alert('מספר לא תקין');
        return;
      }

      const selectedTemplate = templates[templateIndex];
      
      // צור את הסעיף הראשי
      const mainSectionId = generateSectionId();
      const mainSection = {
        id: mainSectionId,
        title: selectedTemplate.main_section.title,
        content: selectedTemplate.main_section.content,
        level: 'main' as const,
        order: getNextOrder(),
        type: 'text' as const
      };

      // צור את התתי סעיפים
      const childSections = selectedTemplate.child_sections.map((child: any, index: number) => ({
        id: generateSectionId(),
        title: child.title,
        content: child.content,
        level: 'sub' as const,
        parentId: mainSectionId,
        order: getNextOrder() + index + 1,
        type: 'text' as const
      }));

      // הוסף את כל הסעיפים
      setCustomSections(prev => [...prev, mainSection, ...childSections]);

      alert(`✅ התבנית "${selectedTemplate.title}" נטענה בהצלחה!`);
    } catch (err) {
      console.error('Error loading template:', err);
      alert('שגיאה בטעינת התבנית');
    }
  };
  
  // אפוטרופוס לקטינים
  const [guardian, setGuardian] = useState({
    name: '',
    id: '',
    address: '',
    gender: 'male' as Gender
  });
  
  // תבניות JSON
  const [jsonTemplate, setJsonTemplate] = useState<any>(null);
  const [sectionsWarehouse, setSectionsWarehouse] = useState<any>(null);
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [variablesModal, setVariablesModal] = useState<{
    section: { id: string; title: string; content: string; variables: string[] };
    values: Record<string, string>;
    genders: Record<string, 'male' | 'female'>;
  } | null>(null);

  const [variablesCompletionModal, setVariablesCompletionModal] = useState<{
    isOpen: boolean;
    variables: string[];
    values: Record<string, string>;
    genders: Record<string, 'male' | 'female' | 'plural'>;
    pendingSection: {
      id: string;
      title: string;
      content: string;
      level: 'main' | 'sub' | 'sub-sub';
      order: number;
      type: 'text';
    } | null;
  }>({
    isOpen: false,
    variables: [],
    values: {},
    genders: {},
    pendingSection: null
  });

  // מערכת למידה
  const [showLearningSystem, setShowLearningSystem] = useState(false);
  const [editableSections, setEditableSections] = useState<EditableSectionType[]>([]);
  const [learningMode, setLearningMode] = useState<'edit' | 'warehouse'>('edit');
  
  // מאגר מאוחד
  const [showUnifiedWarehouse, setShowUnifiedWarehouse] = useState(false);
  const [showWarehouseEditor, setShowWarehouseEditor] = useState(false);
  
  // טעינת סעיף מהמאגר המאוחד
  const handleLoadFromWarehouse = async (section: any) => {
    try {
      console.log('🟢🟢🟢 handleLoadFromWarehouse CALLED! Section:', section);
      console.log('Section title:', section?.title);
      console.log('Section content:', section?.content);
      
      if (!section || !section.content) {
        console.error('Invalid section:', section);
        alert('שגיאה: הסעיף לא תקין');
        return;
      }
      
      // בדיקה אם יש משתנים בתוכן (כמו {{שם_משתנה}})
      const variableMatches = section.content.match(/\{\{([^}]+)\}\}/g);
      const hasVariables = variableMatches && variableMatches.length > 0;
      
      // בדיקה אם יש דפוסי מגדר (כמו /ת /ה /ים) - רק דפוסים ברורים
      const hasGenderPatterns = /\/(ת|ה|ים|ות)\b/.test(section.content);
      
      console.log('hasVariables:', hasVariables, 'hasGenderPatterns:', hasGenderPatterns);
      
      // אם יש משתנים או דפוסי מגדר, פתח מודל השלמה
      if (hasVariables || hasGenderPatterns) {
        const variables: string[] = [];
        if (variableMatches) {
          variableMatches.forEach((match: string) => {
            const variableName = match.replace(/\{\{|\}\}/g, '');
            if (!variables.includes(variableName)) {
              variables.push(variableName);
            }
          });
        }
        
        console.log('Opening variables modal with variables:', variables);
        
        setVariablesCompletionModal({
          isOpen: true,
          variables,
          values: {},
          genders: {},
          pendingSection: {
            id: generateSectionId(),
            title: section.title,
            content: section.content,
            level: 'main' as const,
            order: getNextOrder(),
            type: 'text' as const
          }
        });
        setShowUnifiedWarehouse(false);
        return;
      }
      
      // אם אין משתנים, הוסף ישירות עם החלפת מגדר
      console.log('Adding section directly (no variables)');
      
      // החלף מגדר לפי מגדר המצווה
      const testatorGender = willType === 'mutual' ? 'plural' : (testator.gender === 'organization' ? 'male' : (testator.gender || 'male')) as 'male' | 'female' | 'plural';
      console.log(`🔄 מחליף מגדר לסעיף לפי מגדר המצווה: ${testatorGender}`);
      const genderedContent = replaceTextWithGender(section.content, testatorGender);
      console.log(`📝 תוכן לפני: ${section.content.substring(0, 100)}`);
      console.log(`📝 תוכן אחרי: ${genderedContent.substring(0, 100)}`);
      
      const newSection = {
        id: generateSectionId(),
        title: section.title,
        content: genderedContent,
        level: 'main' as const,
        order: getNextOrder(),
        type: 'text' as const
      };
      
      setCustomSections(prev => {
        const updated = [...prev, newSection];
        console.log('Updated customSections:', updated);
        return updated;
      });
      
      // שמור את הסעיף ל-Supabase
      try {
        const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
        const result = await saveSection(
          documentType,
          `section_${newSection.id}`,
          newSection.content,
          section.content,
          newSection.title
        );
        
        if (result.success) {
          console.log('✅ סעיף נשמר ל-Supabase:', newSection.title);
        } else {
          console.error('❌ שגיאה בשמירה ל-Supabase:', result.error);
        }
      } catch (error) {
        console.error('❌ שגיאה בשמירה ל-Supabase:', error);
      }
      
      setShowUnifiedWarehouse(false);
      alert(`✅ הסעיף "${section.title}" נטען מהמאגר ונשמר!`);
    } catch (error) {
      console.error('❌ Error in handleLoadFromWarehouse:', error);
      alert('שגיאה בהוספת הסעיף: ' + (error as Error).message);
    }
  };

  // מחיקת סעיף מ-Supabase
  const handleDeleteSection = async (id: string) => {
    try {
      const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { error } = await supabase
        .from('saved_documents')
        .delete()
        .eq('user_id', user.id)
        .eq('document_type', documentType)
        .eq('section_name', `section_${id}`);
      
      if (error) {
        console.error('Error deleting section from Supabase:', error);
      } else {
        console.log('✅ סעיף נמחק מ-Supabase:', id);
      }
    } catch (error) {
      console.error('Error deleting section from Supabase:', error);
    }
  };

  // הוספת סעיף ישירות למאגר
  const handleAddToWarehouse = async (title: string, content: string, category: string) => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      
      const { error } = await supabase
        .from('warehouse_sections')
        .insert([
          {
            user_id: testator.fullName || 'anonymous',
            title: title,
            content: content,
            category: category,
            tags: ['מאגר', 'סעיף מותאם אישית'],
            usage_count: 0,
            average_rating: 5,
            is_public: false,
            is_hidden: false
          },
        ]);

      if (error) {
        console.error('Error adding to warehouse:', error);
        alert('שגיאה בהוספה למאגר');
        return;
      }

      alert(`✅ הסעיף "${title}" נוסף למאגר!`);
    } catch (err) {
      console.error('Error adding to warehouse:', err);
      alert('שגיאה בהוספה למאגר');
    }
  };

  // יצירת סעיף עם תתי סעיפים
  const handleCreateSectionWithSubsections = () => {
    // קבל את כותרת הסעיף הראשי
    const mainTitle = prompt('כותרת הסעיף הראשי:');
    if (!mainTitle) return;

    // קבל את מספר התתי סעיפים
    const subCount = prompt('כמה תתי סעיפים? (הזן מספר):');
    if (!subCount || isNaN(Number(subCount))) return;

    const subSectionsCount = Number(subCount);
    if (subSectionsCount < 1 || subSectionsCount > 10) {
      alert('מספר התתי סעיפים חייב להיות בין 1 ל-10');
      return;
    }

    // צור את הסעיף הראשי
    const mainSectionId = generateSectionId();
    const mainSection = {
      id: mainSectionId,
      title: mainTitle,
      content: '', // הסעיף הראשי יכול להיות ריק
      level: 'main' as const,
      order: getNextOrder(),
      type: 'text' as const
    };

    // צור את התתי סעיפים
    const subSections: Array<{
      id: string;
      title: string;
      content: string;
      level: 'sub' | 'sub-sub';
      order: number;
      type: 'text';
      parentId: string;
    }> = [];
    for (let i = 0; i < subSectionsCount; i++) {
      const subTitle = prompt(`כותרת תת-סעיף ${i + 1}:`);
      const subContent = prompt(`תוכן תת-סעיף ${i + 1}:`);
      
      if (subTitle && subContent) {
        subSections.push({
          id: generateSectionId(),
          title: subTitle,
          content: subContent,
          level: 'sub' as const,
          parentId: mainSectionId,
          order: getNextOrder() + i + 1,
          type: 'text' as const
        });
      }
    }

    // הוסף את כל הסעיפים
    setCustomSections(prev => [...prev, mainSection, ...subSections]);

    alert(`✅ נוצר סעיף "${mainTitle}" עם ${subSections.length} תתי סעיפים!`);
  };
  
  // פונקציה לחילוץ משתנים מתוכן
  const extractVariablesFromContent = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))] : [];
  };

  // טעינת עדים שמורים
  useEffect(() => {
    const loadSavedWitnesses = () => {
      const saved1 = localStorage.getItem('witness-1');
      const saved2 = localStorage.getItem('witness-2');
      
      if (saved1 || saved2) {
        setWitnesses(prev => {
          const newWitnesses = [...prev];
          if (saved1) {
            try {
              newWitnesses[0] = JSON.parse(saved1);
            } catch (e) {
              console.error('Error loading witness 1:', e);
            }
          }
          if (saved2) {
            try {
              newWitnesses[1] = JSON.parse(saved2);
            } catch (e) {
              console.error('Error loading witness 2:', e);
            }
          }
          return newWitnesses;
        });
      }
    };
    
    loadSavedWitnesses();
  }, []);

  // טעינת סעיפים שמורים מ-Supabase
  useEffect(() => {
    const loadSavedSections = async () => {
      try {
        const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        const { data: savedSections, error } = await supabase
          .from('saved_documents')
          .select('*')
          .eq('user_id', user.id)
          .eq('document_type', documentType)
          .like('section_name', 'section_%')
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Error loading saved sections:', error);
          return;
        }
        
        if (savedSections && savedSections.length > 0) {
          const loadedSections = savedSections.map((section, index) => ({
            id: section.section_name.replace('section_', ''),
            title: section.title || `סעיף ${index + 1}`,
            content: section.content,
            level: 'main' as const,
            order: index + 1,
            type: 'text' as const
          }));
          
          setCustomSections(prev => {
            // הוסף רק סעיפים שלא קיימים כבר
            const existingIds = prev.map(s => s.id);
            const newSections = loadedSections.filter(s => !existingIds.includes(s.id));
            return [...prev, ...newSections];
          });
          
          console.log(`✅ נטענו ${loadedSections.length} סעיפים שמורים`);
        }
      } catch (error) {
        console.error('Error loading saved sections:', error);
      }
    };
    
    loadSavedSections();
  }, [willType]); // טען פעם אחת בלבד
  
  // טעינת תבניות JSON
  useEffect(() => {
    loadTemplates();
  }, [testator.gender, willType]);
  
  const loadTemplates = async () => {
    try {
      // בחירת תבנית לפי סוג וגדר
      let templateFile = '';
      if (willType === 'mutual') {
        templateFile = 'will-mutual';
      } else {
        templateFile = testator.gender === 'male' ? 'will-individual-male' : 'will-individual-female';
      }
      
      const [template, warehouse] = await Promise.all([
        fetch(`/templates/${templateFile}.json`).then(r => r.json()),
        fetch('/templates/clauses/sections-warehouse.json').then(r => r.json())
      ]);
      
      setJsonTemplate(template);
      setSectionsWarehouse(warehouse);
      
      // טען עדים ברירת מחדל מהתבנית
      if (template.defaultWitnesses && witnesses.length === 2 && !witnesses[0].name) {
        setWitnesses(template.defaultWitnesses.map((w: any) => ({
          name: w.full_name,
          id: w.id_number,
          address: w.address
        })));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const addProperty = () => {
    setProperties(prev => [...prev, {
      name: `נכס ${prev.length + 1}`,
      address: '',
      city: '',
      block: '',
      plot: '',
      subPlot: '',
      ownership: '100%'
    }]);
  };

  const removeProperty = (index: number) => {
    setProperties(prev => prev.filter((_, i) => i !== index));
  };

  const addBankAccount = () => {
    setBankAccounts(prev => [...prev, {
      bank: '',
      bankNumber: '',
      branch: '',
      accountNumber: '',
      location: ''
    }]);
  };

  const removeBankAccount = (index: number) => {
    setBankAccounts(prev => prev.filter((_, i) => i !== index));
  };

  const addHeir = () => {
    setHeirs(prev => [...prev, {
      firstName: '',
      lastName: '',
      id: '',
      relation: '',
      share: '',
      gender: 'male'
    }]);
  };

  const removeHeir = (index: number) => {
    setHeirs(prev => prev.filter((_, i) => i !== index));
  };

  const addWitness = () => {
    setWitnesses(prev => [...prev, {
      name: '',
      id: '',
      address: '',
      gender: 'male'
    }]);
  };

  const removeWitness = (index: number) => {
    if (witnesses.length > 2) {
      setWitnesses(prev => prev.filter((_, i) => i !== index));
    }
  };

  const isFormValid = () => {
    return testator.fullName && 
           testator.id && 
           testator.address &&
           properties.every(p => p.address && p.city && p.block && p.plot) &&
           heirs.every(h => h.firstName && h.lastName && h.id && h.relation) &&
           witnesses.every(w => w.name && w.id && w.address) &&
           willDate.city;
  };

  const getWillData = () => ({
    type: willType,
    testator,
    spouse: willType === 'mutual' ? spouse : undefined,
    properties,
    bankAccounts,
    heirs,
    heirsDisplayMode,
    alternativeHeirs: willType === 'mutual' ? alternativeHeirs : undefined,
    witnesses,
    willDate,
    lawyerName,
    copyNumber,
    totalCopies,
    specialInstructions,
    vehicleInstructions,
    digitalAssets: true,
    customSections,
    inheritanceTables, // הוספת הטבלאות לייצוא
    guardian: guardian.name ? guardian : undefined,
    guardianGender: guardian.gender
  });

  // פונקציות מערכת הלמידה
  const convertToEditableSections = () => {
    const sections: EditableSectionType[] = [];
    
    customSections.forEach((section, index) => {
      sections.push({
        id: `custom-${index}`,
        title: section.title,
        content: section.content,
        category: 'will',
        isEditable: true,
        isCustom: true,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user',
        version: 1,
      });
    });
    
    if (specialInstructions) {
      sections.push({
        id: 'special-instructions',
        title: 'הוראות מיוחדות',
        content: specialInstructions,
        category: 'will',
        isEditable: true,
        isCustom: false,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user',
        version: 1,
      });
    }
    
    if (vehicleInstructions) {
      sections.push({
        id: 'vehicle-instructions',
        title: 'הוראות רכב',
        content: vehicleInstructions,
        category: 'will',
        isEditable: true,
        isCustom: false,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user',
        version: 1,
      });
    }
    
    setEditableSections(sections);
  };

  // ← עדכון עם שמירה ל-Supabase
  const handleUpdateEditableSection = async (updatedSection: EditableSectionType) => {
    // החלף מגדר בתוכן המעודכן
    const testatorGender = willType === 'mutual' ? 'plural' : (testator.gender === 'organization' ? 'male' : (testator.gender || 'male')) as 'male' | 'female' | 'plural';
    const genderedContent = replaceTextWithGender(updatedSection.content, testatorGender);
    
    const finalUpdatedSection = {
      ...updatedSection,
      content: genderedContent,
      lastModified: new Date().toISOString()
    };
    
    // עדכן state locally
    setEditableSections(prev => 
      prev.map(section => 
        section.id === finalUpdatedSection.id 
          ? finalUpdatedSection
          : section
      )
    );
    
    // עדכן גם ב-customSections או הוראות מיוחדות
    if (finalUpdatedSection.id.startsWith('custom-')) {
      const index = parseInt(finalUpdatedSection.id.split('-')[1]);
      setCustomSections(prev => 
        prev.map((section, i) => 
          i === index ? { ...section, content: finalUpdatedSection.content } : section
        )
      );
    } else if (finalUpdatedSection.id === 'special-instructions') {
      setSpecialInstructions(finalUpdatedSection.content);
    } else if (finalUpdatedSection.id === 'vehicle-instructions') {
      setVehicleInstructions(finalUpdatedSection.content);
    }

    // ← שמור ל-Supabase
    try {
      const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
      const result = await saveSection(
        documentType,
        updatedSection.title,
        updatedSection.content,
        updatedSection.content,
        updatedSection.title
      );
      
      if (result.success) {
        console.log('סעיף צוואה נשמר בהצלחה:', updatedSection.title);
      } else {
        console.error('שגיאה בשמירת סעיף:', result.error);
      }
    } catch (error) {
      console.error('שגיאה בשמירה ל-Supabase:', error);
    }
  };

  const handleSaveToWarehouse = async (section: EditableSectionType) => {
    try {
      await addSection({
        user_id: testator.fullName || 'anonymous',
        title: section.title,
        content: section.content,
        category: section.category || 'custom',
        tags: ['צוואה', 'סעיף מותאם אישית'],
        usage_count: 0,
        average_rating: 5,
        is_public: false,
        is_hidden: false,
        created_by: testator.fullName || 'anonymous'
      });
      alert('✅ סעיף נשמר למחסן האישי!');
    } catch (error) {
      console.error('Error saving to warehouse:', error);
      alert('❌ שגיאה בשמירה למחסן');
    }
  };
  
  const handleAddSection = (title: string, content: string) => {
    const newSection = {
      id: generateSectionId(),
      title,
      content,
      level: 'main' as const,
      order: getNextOrder(),
      type: 'text' as const
    };
    setCustomSections(prev => [...prev, newSection]);
  };
  
  const handleAddSectionToWarehouse = async (title: string, content: string, category: string = 'custom') => {
    try {
      await addSection({
        user_id: testator.fullName || 'anonymous',
        title,
        content,
        category,
        tags: ['צוואה', 'סעיף מותאם אישית'],
        usage_count: 0,
        average_rating: 5,
        is_public: false,
        is_hidden: false,
        created_by: testator.fullName || 'anonymous'
      });
      alert('✅ סעיף נשמר למחסן האישי!');
    } catch (error) {
      console.error('Error saving to warehouse:', error);
      alert('❌ שגיאה בשמירה למחסן');
    }
  };

  // פונקציות לניהול סעיפים עם טבלאות
  const openAddSectionWithTableModal = (type: 'text' | 'property' | 'heirs' | 'bank-account') => {
    setAddSectionWithTableModal({
      isOpen: true,
      title: '',
      content: '',
      type,
      tableData: type === 'property' ? [{
        name: '',
        address: '',
        city: '',
        block: '',
        plot: '',
        subPlot: '',
        ownership: '100%'
      }] : type === 'heirs' ? [{
        firstName: '',
        lastName: '',
        id: '',
        relation: '',
        share: '100%',
        gender: 'male'
      }] : type === 'bank-account' ? [{
        bank: '',
        bankNumber: '',
        branch: '',
        accountNumber: '',
        location: ''
      }] : null
    });
  };

  const closeAddSectionWithTableModal = () => {
    setAddSectionWithTableModal({
      isOpen: false,
      title: '',
      content: '',
      type: 'text',
      tableData: null
    });
  };

  const handleSaveToLearning = (section: EditableSectionType, userCorrection?: string) => {
    if (userCorrection) {
      learningEngine.saveLearningData({
        sectionId: section.id,
        originalText: section.content,
        editedText: userCorrection,
        editType: 'manual',
        userFeedback: 'improved',
        context: {
          serviceType: willType,
          category: 'will',
          userType: 'lawyer'
        },
        timestamp: new Date().toISOString(),
        userId: testator.fullName || 'anonymous'
      });
      alert('שינוי נשמר למערכת הלמידה!');
    }
  };

  const handleSelectFromWarehouse = async (warehouseSection: any) => {
    console.log('🔵 handleSelectFromWarehouse called with:', warehouseSection);
    // קרא ישירות ל-handleLoadFromWarehouse שמטפלת בכל הלוגיקה
    handleLoadFromWarehouse(warehouseSection);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">יצירת צוואה מקצועית</h1>
          
          {jsonTemplate && (
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg font-medium">
                ✅ תבנית: {jsonTemplate.title}
              </span>
              <span className="text-xs text-gray-500">
                v{jsonTemplate.version}
              </span>
            </div>
          )}
        </div>

        {jsonTemplate && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-lg">📖</span>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-1">תבנית מבוססת מחקר</h3>
                <p className="text-sm text-blue-800">
                  {jsonTemplate.description}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  מבוסס על: {jsonTemplate.metadata?.basedOn || '9 צוואות אמיתיות'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* בחירת סוג צוואה */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setWillType('individual')}
            className={`p-4 border-2 rounded-lg transition ${
              willType === 'individual' 
                ? 'border-blue-500 bg-blue-50 text-blue-900' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <span className="text-2xl mx-auto mb-2 block">👤</span>
            <div className="font-bold">צוואת יחיד</div>
            <div className="text-sm text-gray-600">למצווה בודד</div>
          </button>
          
          <button
            onClick={() => setWillType('mutual')}
            className={`p-4 border-2 rounded-lg transition ${
              willType === 'mutual' 
                ? 'border-blue-500 bg-blue-50 text-blue-900' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <span className="text-2xl mx-auto mb-2 block">👥</span>
            <div className="font-bold">צוואה הדדית</div>
            <div className="text-sm text-gray-600">לבני זוג</div>
          </button>
        </div>

        {/* פרטי המצווה - השאר בדיוק אותו דבר ... */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">👤</span>
            פרטי המצווה{willType === 'mutual' ? ' הראשי' : ''}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
              <input
                type="text"
                value={testator.fullName}
                onChange={(e) => setTestator(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="שם פרטי ושם משפחה מלא"
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם קצר</label>
              <input
                type="text"
                value={testator.shortName}
                onChange={(e) => setTestator(prev => ({ ...prev, shortName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="שם פרטי בלבד"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
              <input
                type="text"
                value={testator.id}
                onChange={(e) => setTestator(prev => ({ ...prev, id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="123456789"
                maxLength={9}
                dir="ltr"
              />
            </div>
            
            <div>
              <GenderSelector
                value={testator.gender}
                onChange={(gender) => {
                  setTestator(prev => ({ ...prev, gender }));
                  // שמור את המגדר ב-localStorage
                  localStorage.setItem('testator-gender', gender);
                  console.log('💾 נשמר מגדר המצווה ב-localStorage:', gender);
                  // החלף את כל הטקסט לפי המגדר החדש
                  setCustomSections(prev => prev.map(section => ({
                    ...section,
                    content: replaceTextWithGender(section.content, gender)
                  })));
                }}
                label="מגדר"
                name="testator-gender"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">כתובת מלאה</label>
            <input
              type="text"
              value={testator.address}
              onChange={(e) => setTestator(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="רחוב, מספר, דירה, עיר"
              dir="rtl"
            />
          </div>
        </section>

        {/* בן/בת זוג (לצוואה הדדית) */}
        {willType === 'mutual' && (
          <section className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">👥</span>
              פרטי בן/בת הזוג
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  value={spouse.fullName}
                  onChange={(e) => setSpouse(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="שם פרטי ושם משפחה מלא"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם קצר</label>
                <input
                  type="text"
                  value={spouse.shortName}
                  onChange={(e) => setSpouse(prev => ({ ...prev, shortName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="שם פרטי בלבד"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
                <input
                  type="text"
                  value={spouse.id}
                  onChange={(e) => setSpouse(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789"
                  maxLength={9}
                  dir="ltr"
                />
              </div>
              
              <div>
                <GenderSelector
                  value={spouse.gender}
                  onChange={(gender) => {
                    setSpouse(prev => ({ ...prev, gender }));
                    // החלף את כל הטקסט לפי המגדר החדש
                    setCustomSections(prev => prev.map(section => ({
                      ...section,
                      content: replaceTextWithGender(section.content, gender)
                    })));
                  }}
                  label="מגדר"
                  name="spouse-gender"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כתובת מלאה</label>
              <input
                type="text"
                value={spouse.address}
                onChange={(e) => setSpouse(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="רחוב, מספר, דירה, עיר"
                dir="rtl"
              />
            </div>
          </section>
        )}

        {/* נכסי מקרקעין */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">🏠</span>
              נכסי מקרקעין
            </h2>
            <button
              onClick={() => setProperties(prev => [...prev, {
                name: '',
                address: '',
                city: '',
                block: '',
                plot: '',
                subPlot: '',
                ownership: '100%'
              }])}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + הוסף נכס
            </button>
          </div>
          
          {properties.map((property, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">נכס {index + 1}</h3>
                {properties.length > 1 && (
                  <button
                    onClick={() => setProperties(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ מחק
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם הנכס</label>
                  <input
                    type="text"
                    value={property.name}
                    onChange={(e) => setProperties(prev => prev.map((p, i) => 
                      i === index ? { ...p, name: e.target.value } : p
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="דירת המגורים / בית קיץ"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
                  <input
                    type="text"
                    value={property.address}
                    onChange={(e) => setProperties(prev => prev.map((p, i) => 
                      i === index ? { ...p, address: e.target.value } : p
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="רחוב, מספר, דירה"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">עיר</label>
                  <input
                    type="text"
                    value={property.city}
                    onChange={(e) => setProperties(prev => prev.map((p, i) => 
                      i === index ? { ...p, city: e.target.value } : p
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="תל אביב"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">אחוז בעלות</label>
                  <input
                    type="text"
                    value={property.ownership || '100%'}
                    onChange={(e) => setProperties(prev => prev.map((p, i) => 
                      i === index ? { ...p, ownership: e.target.value } : p
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="100%"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">גוש</label>
                  <input
                    type="text"
                    value={property.block}
                    onChange={(e) => setProperties(prev => prev.map((p, i) => 
                      i === index ? { ...p, block: e.target.value } : p
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12345"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">חלקה</label>
                  <input
                    type="text"
                    value={property.plot}
                    onChange={(e) => setProperties(prev => prev.map((p, i) => 
                      i === index ? { ...p, plot: e.target.value } : p
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="67"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תת חלקה</label>
                  <input
                    type="text"
                    value={property.subPlot}
                    onChange={(e) => setProperties(prev => prev.map((p, i) => 
                      i === index ? { ...p, subPlot: e.target.value } : p
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* חשבונות בנק */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">🏦</span>
              חשבונות בנק
            </h2>
            <button
              onClick={() => setBankAccounts(prev => [...prev, {
                bank: '',
                bankNumber: '',
                branch: '',
                accountNumber: '',
                location: ''
              }])}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + הוסף חשבון
            </button>
          </div>
          
          {bankAccounts.map((account, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">חשבון {index + 1}</h3>
                {bankAccounts.length > 1 && (
                  <button
                    onClick={() => setBankAccounts(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ מחק
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם הבנק</label>
                  <input
                    type="text"
                    value={account.bank}
                    onChange={(e) => setBankAccounts(prev => prev.map((a, i) => 
                      i === index ? { ...a, bank: e.target.value } : a
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="בנק הפועלים"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מספר בנק</label>
                  <input
                    type="text"
                    value={account.bankNumber}
                    onChange={(e) => setBankAccounts(prev => prev.map((a, i) => 
                      i === index ? { ...a, bankNumber: e.target.value } : a
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מספר סניף</label>
                  <input
                    type="text"
                    value={account.branch}
                    onChange={(e) => setBankAccounts(prev => prev.map((a, i) => 
                      i === index ? { ...a, branch: e.target.value } : a
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מספר חשבון</label>
                  <input
                    type="text"
                    value={account.accountNumber}
                    onChange={(e) => setBankAccounts(prev => prev.map((a, i) => 
                      i === index ? { ...a, accountNumber: e.target.value } : a
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234567"
                    dir="ltr"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">מיקום הסניף</label>
                  <input
                    type="text"
                    value={account.location}
                    onChange={(e) => setBankAccounts(prev => prev.map((a, i) => 
                      i === index ? { ...a, location: e.target.value } : a
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="תל אביב, רחוב דיזנגוף 123"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* יורשים */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">👨‍👩‍👧‍👦</span>
              יורשים
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setHeirsDisplayMode('list')}
                className={`px-3 py-1 rounded ${heirsDisplayMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                רשימה
              </button>
              <button
                onClick={() => setHeirsDisplayMode('table')}
                className={`px-3 py-1 rounded ${heirsDisplayMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                טבלה
              </button>
              <button
                onClick={() => setHeirs(prev => [...prev, {
                  firstName: '',
                  lastName: '',
                  id: '',
                  relation: '',
                  share: '100%',
                  gender: 'male'
                }])}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + הוסף יורש
              </button>
            </div>
          </div>
          
          {heirsDisplayMode === 'list' ? (
            <div className="space-y-4">
              {heirs.map((heir, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">יורש {index + 1}</h3>
                    {heirs.length > 1 && (
                      <button
                        onClick={() => setHeirs(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ מחק
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">שם פרטי</label>
                      <input
                        type="text"
                        value={heir.firstName}
                        onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                          i === index ? { ...h, firstName: e.target.value } : h
                        ))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="דוד"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">שם משפחה</label>
                      <input
                        type="text"
                        value={heir.lastName}
                        onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                          i === index ? { ...h, lastName: e.target.value } : h
                        ))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="כהן"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
                      <input
                        type="text"
                        value={heir.id}
                        onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                          i === index ? { ...h, id: e.target.value } : h
                        ))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123456789"
                        maxLength={9}
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">קרבה</label>
                      <input
                        type="text"
                        value={heir.relation}
                        onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                          i === index ? { ...h, relation: e.target.value } : h
                        ))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="בן / בת / אח / אחות"
                        dir="rtl"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">חלק</label>
                      <input
                        type="text"
                        value={heir.share}
                        onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                          i === index ? { ...h, share: e.target.value } : h
                        ))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="100% / 50%"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <GenderSelector
                        value={heir.gender}
                        onChange={(gender) => {
                          // מוודא שהמגדר הוא רק male או female (לא plural/organization)
                          const validGender = (gender === 'male' || gender === 'female') ? gender : 'male';
                          setHeirs(prev => prev.map((h, i) => 
                            i === index ? { ...h, gender: validGender } : h
                          ));
                        }}
                        label="מגדר"
                        name={`heir-gender-${index}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-right">שם פרטי</th>
                    <th className="px-4 py-2 text-right">שם משפחה</th>
                    <th className="px-4 py-2 text-right">ת.ז.</th>
                    <th className="px-4 py-2 text-right">קרבה</th>
                    <th className="px-4 py-2 text-right">חלק</th>
                    <th className="px-4 py-2 text-right">מגדר</th>
                    <th className="px-4 py-2 text-right">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {heirs.map((heir, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={heir.firstName}
                          onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                            i === index ? { ...h, firstName: e.target.value } : h
                          ))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          dir="rtl"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={heir.lastName}
                          onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                            i === index ? { ...h, lastName: e.target.value } : h
                          ))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          dir="rtl"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={heir.id}
                          onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                            i === index ? { ...h, id: e.target.value } : h
                          ))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          dir="ltr"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={heir.relation}
                          onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                            i === index ? { ...h, relation: e.target.value } : h
                          ))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          dir="rtl"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={heir.share}
                          onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                            i === index ? { ...h, share: e.target.value } : h
                          ))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          dir="ltr"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={heir.gender}
                          onChange={(e) => setHeirs(prev => prev.map((h, i) => 
                            i === index ? { ...h, gender: e.target.value as 'male' | 'female' } : h
                          ))}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="male">זכר</option>
                          <option value="female">נקבה</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {heirs.length > 1 && (
                          <button
                            onClick={() => setHeirs(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* עדים */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">✍️</span>
              עדי הצוואה
            </h2>
            <button
              onClick={() => setWitnesses(prev => [...prev, {
                name: '',
                id: '',
                address: '',
                gender: 'male'
              }])}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + הוסף עד
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>💡 טיפ:</strong> לפי חוק הירושה, צוואה דורשת שני עדים לפחות. העדים צריכים להיות נוכחים בעת החתימה.
            </p>
          </div>
          
          {witnesses.map((witness, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">עד {index + 1}</h3>
                {witnesses.length > 2 && (
                  <button
                    onClick={() => setWitnesses(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ מחק
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                  <input
                    type="text"
                    value={witness.name}
                    onChange={(e) => setWitnesses(prev => prev.map((w, i) => 
                      i === index ? { ...w, name: e.target.value } : w
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="שם פרטי ושם משפחה"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
                  <input
                    type="text"
                    value={witness.id}
                    onChange={(e) => setWitnesses(prev => prev.map((w, i) => 
                      i === index ? { ...w, id: e.target.value } : w
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123456789"
                    maxLength={9}
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <GenderSelector
                    value={witness.gender}
                    onChange={(gender) => {
                      const validGender = (gender === 'male' || gender === 'female') ? gender : 'male';
                      setWitnesses(prev => prev.map((w, i) => 
                        i === index ? { ...w, gender: validGender } : w
                      ));
                    }}
                    label="מגדר"
                    name={`witness-gender-${index}`}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">כתובת מלאה</label>
                  <input
                    type="text"
                    value={witness.address}
                    onChange={(e) => setWitnesses(prev => prev.map((w, i) => 
                      i === index ? { ...w, address: e.target.value } : w
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="רחוב, מספר, דירה, עיר"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* כפתורים לשמירת עד כברירת מחדל */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    localStorage.setItem(`witness-${index + 1}`, JSON.stringify(witness));
                    alert(`✅ עד ${index + 1} נשמר כברירת מחדל`);
                  }}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                  disabled={!witness.name || !witness.id || !witness.address}
                >
                  💾 שמור כעד קבוע
                </button>
                <button
                  onClick={() => {
                    const saved = localStorage.getItem(`witness-${index + 1}`);
                    if (saved) {
                      const savedWitness = JSON.parse(saved);
                      setWitnesses(prev => prev.map((w, i) => 
                        i === index ? savedWitness : w
                      ));
                      alert(`✅ עד ${index + 1} נטען מהשמירה`);
                    } else {
                      alert('❌ אין עד שמור');
                    }
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  📥 טען עד קבוע
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* סעיפים סטנדרטיים */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2 mb-4">
            📋 סעיפים סטנדרטיים
          </h2>
          
          <div className="space-y-4">
            {/* הואיל - פתיחה משפטית */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">הואיל - פתיחה משפטית</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {generateProfessionalWillContent(willType, getWillData(), []).split('\n\n')[0]}
              </div>
            </div>

            {/* הצהרת המצווה */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">הצהרת המצווה</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                אני המצווה/ה {testator.fullName || '[שם המצווה]'}, ת.ז. {testator.id || '[מספר ת.ז.]'}, 
                {willType === 'mutual' && spouse.fullName ? ` נשוי/ה ל-${spouse.fullName}, ת.ז. ${spouse.id || '[מספר ת.ז.]'},` : ''} 
                מצהיר/ה בזאת כי אני בריא/ה בדעתי ובגופי וכי אני עורך/ת צוואה זו מרצוני החופשי וללא כל לחץ או השפעה חיצונית.
              </div>
            </div>

            {/* סעיף 1 - ביטול צוואות קודמות */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">סעיף 1 - ביטול צוואות קודמות</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                למען הסר ספק, אני מבטל בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוני שייעשה בעיזבוני לאחר מותי.
              </div>
            </div>

            {/* סעיף 2 - תשלום חובות העיזבון */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">סעיף 2 - תשלום חובות העיזבון</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                אני מורה ליורשיי אשר יבצעו את צוואתי לשלם מתוך עיזבוני האמור את כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.
              </div>
            </div>

            {/* סעיף 3 - היקף העיזבון */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">סעיף 3 - היקף העיזבון</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                צוואתי זו תחול על כלל רכושי מכל מין וסוג שהוא, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים. מבלי לגרוע מכלליות האמור לעיל, צוואתי זו תחול גם על כספים, תוכניות חיסכון, קרנות נאמנות, ניירות ערך, תביעות, פנסיות, תגמולים, ביטוחי חיים, קצבאות, בין אם מופקדים בבנק ובין אם בידי כל גורם אחר, וכן על זכויות אחרות מכל סוג שהוא, וכל רכוש אחר בין במיטלטלין ובין במקרקעין (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או יגיעו לידי בעתיד (להלן: "העיזבון"):
              </div>
              
              {/* תתי-סעיפים של סעיף 3 - פרטי העיזבון */}
              <div className="mt-4 space-y-2">
                {/* נכסים - 3.1, 3.2 וכו' */}
                {properties.filter(p => p.address || p.city || p.block || p.plot).map((property, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded border border-blue-200 mr-4">
                    <h4 className="font-semibold text-blue-800 mb-1">3.{index + 1} - {property.name || `נכס ${index + 1}`}</h4>
                    <div className="text-sm text-gray-700">
                      {property.address || property.city || property.block || property.plot ? (
                        <>
                          זכויות בדירה הרשומה בטאבו {property.address || '[כתובת]'}, בעיר {property.city || '[עיר]'}, 
                          {property.block && ` הידועה כגוש: ${property.block}`}
                          {property.plot && `, חלקה: ${property.plot}`}
                          {property.subPlot && `, תת חלקה: ${property.subPlot}`}
                          {property.ownership && property.ownership !== '100%' && ` (אחוז בעלות: ${property.ownership})`}
                          {' וכן את מטלטליה בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע.'}
                        </>
                      ) : (
                        `נכס ${index + 1} - פרטים לא הוזנו`
                      )}
                    </div>
                  </div>
                ))}
                
                {/* חשבונות בנק - המשך המספור */}
                {bankAccounts.filter(a => a.bank || a.accountNumber).map((account, index) => {
                  const propertyCount = properties.filter(p => p.address || p.city || p.block || p.plot).length;
                  const subSectionNum = propertyCount + index + 1;
                  return (
                    <div key={`bank-${index}`} className="bg-blue-50 p-3 rounded border border-blue-200 mr-4">
                      <h4 className="font-semibold text-blue-800 mb-1">3.{subSectionNum} - חשבון בנק</h4>
                      <div className="text-sm text-gray-700">
                        חשבון הבנק המנוהל על שמי בבנק {account.bank || '[שם הבנק]'}, סניף מספר {account.branch || '[מספר]'}, 
                        חשבון מספר {account.accountNumber || '[מספר]'}, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.
                      </div>
                    </div>
                  );
                })}
                
                {/* כספים במזומן */}
                {(() => {
                  const propertyCount = properties.filter(p => p.address || p.city || p.block || p.plot).length;
                  const bankCount = bankAccounts.filter(a => a.bank || a.accountNumber).length;
                  const cashSubSectionNum = propertyCount + bankCount + 1;
                  const gender = willType === 'mutual' ? 'plural' : (testator.gender || 'male');
                  let cashText = 'את כלל הכספים במזומן הנמצאים ברשותי, לרבות שטרות כסף המוחזקים בביתי, בכספת או בכל מקום אחר.';
                  if (gender === 'female') {
                    cashText = 'את כלל הכספים במזומן הנמצאים ברשותי, לרבות שטרות כסף המוחזקים בביתי, בכספת או בכל מקום אחר.';
                  } else if (gender === 'plural') {
                    cashText = 'את כלל הכספים במזומן הנמצאים ברשותנו, לרבות שטרות כסף המוחזקים בביתנו, בכספתנו או בכל מקום אחר.';
                  }
                  return (
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 mr-4">
                      <h4 className="font-semibold text-blue-800 mb-1">3.{cashSubSectionNum} - כספים במזומן</h4>
                      <div className="text-sm text-gray-700">
                        {cashText}
                      </div>
                    </div>
                  );
                })()}
                
                {/* תתי-סעיפים קבועים נוספים לסעיף 3 */}
                {(() => {
                  const propertyCount = properties.filter(p => p.address || p.city || p.block || p.plot).length;
                  const bankCount = bankAccounts.filter(a => a.bank || a.accountNumber).length;
                  const fixedSubSections = [
                    {
                      num: propertyCount + bankCount + 2,
                      title: 'מיטלטלין',
                      content: {
                        male: 'כלל המיטלטלין שברשותי, לרבות אך מבלי לגרוע מכלליות האמור: ריהוט, מכשירי חשמל, ציוד אלקטרוני, תכשיטים, יצירות אמנות, ספרים, כלי עבודה, חפצים אישיים, כלי בית, וכל חפץ מיטלטלין אחר המצוי בדירת המגורים או בכל מקום אחר והנמצא בבעלותי או בחזקתי במועד פטירתי.',
                        female: 'כלל המיטלטלין שברשותי, לרבות אך מבלי לגרוע מכלליות האמור: ריהוט, מכשירי חשמל, ציוד אלקטרוני, תכשיטים, יצירות אמנות, ספרים, כלי עבודה, חפצים אישיים, כלי בית, וכל חפץ מיטלטלין אחר המצוי בדירת המגורים או בכל מקום אחר והנמצאת בבעלותי או בחזקתי במועד פטירתי.',
                        plural: 'כלל המיטלטלין שברשותנו, לרבות אך מבלי לגרוע מכלליות האמור: ריהוט, מכשירי חשמל, ציוד אלקטרוני, תכשיטים, יצירות אמנות, ספרים, כלי עבודה, חפצים אישיים, כלי בית, וכל חפץ מיטלטלין אחר המצוי בדירת המגורים או בכל מקום אחר והנמצאים בבעלותנו או בחזקתנו במועד פטירתנו.'
                      }
                    },
                    {
                      num: propertyCount + bankCount + 3,
                      title: 'נכסים דיגיטליים',
                      content: {
                        male: 'כלל הנכסים, הזכויות והחשבונות הדיגיטליים שברשותי, לרבות אך מבלי לגרוע מכלליות האמור: מחשבים, טלפונים ניידים, טאבלטים וכל מכשיר אלקטרוני אחר; חשבונות דואר אלקטרוני; חשבונות ברשתות חברתיות; קבצים דיגיטליים לרבות מסמכים, תמונות, סרטונים ומוזיקה; נכסים וירטואליים; מטבעות קריפטוגרפים ונכסים דיגיטליים אחרים; זכויות בתוכנות ומערכות מחשב; חשבונות אחסון ענן; וכל נכס, זכות או תוכן דיגיטלי אחר שברשותי או בשליטתי.',
                        female: 'כלל הנכסים, הזכויות והחשבונות הדיגיטליים שברשותי, לרבות אך מבלי לגרוע מכלליות האמור: מחשבים, טלפונים ניידים, טאבלטים וכל מכשיר אלקטרוני אחר; חשבונות דואר אלקטרוני; חשבונות ברשתות חברתיות; קבצים דיגיטליים לרבות מסמכים, תמונות, סרטונים ומוזיקה; נכסים וירטואליים; מטבעות קריפטוגרפים ונכסים דיגיטליים אחרים; זכויות בתוכנות ומערכות מחשב; חשבונות אחסון ענן; וכל נכס, זכות או תוכן דיגיטלי אחר שברשותי או בשליטתי.',
                        plural: 'כלל הנכסים, הזכויות והחשבונות הדיגיטליים שברשותנו, לרבות אך מבלי לגרוע מכלליות האמור: מחשבים, טלפונים ניידים, טאבלטים וכל מכשיר אלקטרוני אחר; חשבונות דואר אלקטרוני; חשבונות ברשתות חברתיות; קבצים דיגיטליים לרבות מסמכים, תמונות, סרטונים ומוזיקה; נכסים וירטואליים; מטבעות קריפטוגרפים ונכסים דיגיטליים אחרים; זכויות בתוכנות ומערכות מחשב; חשבונות אחסון ענן; וכל נכס, זכות או תוכן דיגיטלי אחר שברשותנו או בשליטתנו.'
                      }
                    },
                    {
                      num: propertyCount + bankCount + 4,
                      title: 'נכסים עתידיים',
                      content: {
                        male: 'כל כסף, זכות, תשלום או נכס אחר אשר יגיעו לעיזבוני לאחר מועד פטירתי, לרבות אך מבלי לגרוע מכלליות האמור: החזרי מס הכנסה, דיבידנדים, ריביות, תמלוגים, פיצויים, תגמולים, גמלאות, קצבאות, תביעות תלויות ועומדות, זכויות פיצוי מכל מין וסוג שהוא, כספי ביטוח שטרם נתבעו, וכן כל סכום או נכס אחר המגיע או שיגיע מכל מקור שהוא, בין אם הזכות להם התגבשה טרם מועד פטירתי ובין אם תתגבש לאחר מכן.',
                        female: 'כל כסף, זכות, תשלום או נכס אחר אשר יגיעו לעיזבוני לאחר מועד פטירתי, לרבות אך מבלי לגרוע מכלליות האמור: החזרי מס הכנסה, דיבידנדים, ריביות, תמלוגים, פיצויים, תגמולים, גמלאות, קצבאות, תביעות תלויות ועומדות, זכויות פיצוי מכל מין וסוג שהוא, כספי ביטוח שטרם נתבעו, וכן כל סכום או נכס אחר המגיע או שיגיע מכל מקור שהוא, בין אם הזכות להם התגבשה טרם מועד פטירתי ובין אם תתגבש לאחר מכן.',
                        plural: 'כל כסף, זכות, תשלום או נכס אחר אשר יגיעו לעיזבוננו לאחר מועד פטירתנו, לרבות אך מבלי לגרוע מכלליות האמור: החזרי מס הכנסה, דיבידנדים, ריביות, תמלוגים, פיצויים, תגמולים, גמלאות, קצבאות, תביעות תלויות ועומדות, זכויות פיצוי מכל מין וסוג שהוא, כספי ביטוח שטרם נתבעו, וכן כל סכום או נכס אחר המגיע או שיגיע מכל מקור שהוא, בין אם הזכות להם התגבשה טרם מועד פטירתנו ובין אם תתגבש לאחר מכן.'
                      }
                    },
                    {
                      num: propertyCount + bankCount + 5,
                      title: 'תביעות וזכויות משפטיות',
                      content: {
                        male: 'כלל התביעות, הזכויות והסעדים העומדים לי, נגד כל גורם שהוא, בין שהוגשו בעניינם הליכים משפטיים ובין אם לאו, וכן כל פסק דין, החלטה או הסדר שיינתנו לטובתי או עיזבוני לאחר מועד הפטירה.',
                        female: 'כלל התביעות, הזכויות והסעדים העומדים לי, נגד כל גורם שהוא, בין שהוגשו בעניינם הליכים משפטיים ובין אם לאו, וכן כל פסק דין, החלטה או הסדר שיינתנו לטובתי או עיזבוני לאחר מועד הפטירה.',
                        plural: 'כלל התביעות, הזכויות והסעדים העומדים לנו, נגד כל גורם שהוא, בין שהוגשו בעניינם הליכים משפטיים ובין אם לאו, וכן כל פסק דין, החלטה או הסדר שיינתנו לטובתנו או עיזבוננו לאחר מועד הפטירה.'
                      }
                    }
                  ];
                  const gender = willType === 'mutual' ? 'plural' : (testator.gender || 'male');
                  return (
                    <>
                      {fixedSubSections.map((subSection) => (
                        <div key={subSection.num} className="bg-blue-50 p-3 rounded border border-blue-200 mr-4">
                          <h4 className="font-semibold text-blue-800 mb-1">3.{subSection.num} - {subSection.title}</h4>
                          <div className="text-sm text-gray-700">
                            {(gender in subSection.content ? subSection.content[gender as keyof typeof subSection.content] : subSection.content.male) || subSection.content.male}
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}
                
                {/* תתי-סעיפים נוספים לסעיף 3 */}
                {(() => {
                  const section3SubSections = customSections.filter(s => 
                    (s.level === 'sub' && s.parentId === 'section_3') || 
                    s.type === 'property' || 
                    s.type === 'bank-account'
                  );
                  return section3SubSections.length > 0 && (
                    <>
                      {section3SubSections.map((subSection, index) => {
                        const propertyCount = properties.filter(p => p.address || p.city || p.block || p.plot).length;
                        const bankCount = bankAccounts.filter(a => a.bank || a.accountNumber).length;
                        const cashCount = 1; // כספים במזומן
                        const subSectionNum = propertyCount + bankCount + cashCount + index + 1;
                        
                        return (
                          <Section3SubSectionItem
                            key={subSection.id}
                            subSection={subSection}
                            subSectionNum={subSectionNum}
                            onUpdate={(updated) => {
                              setCustomSections(prev => prev.map(s => 
                                s.id === subSection.id ? { ...s, ...updated } : s
                              ));
                            }}
                            onDelete={() => {
                              setCustomSections(prev => prev.filter(s => s.id !== subSection.id));
                            }}
                          />
                        );
                      })}
                    </>
                  );
                })()}
                
                {/* כפתור הוספת תת-סעיף לסעיף 3 */}
                <button
                  onClick={() => {
                    const title = prompt('כותרת תת-הסעיף:');
                    if (title) {
                      const propertyCount = properties.filter(p => p.address || p.city || p.block || p.plot).length;
                      const bankCount = bankAccounts.filter(a => a.bank || a.accountNumber).length;
                      const cashCount = 1;
                      const newSubSection = {
                        id: generateSectionId(),
                        title: title.trim(),
                        content: prompt('תוכן תת-הסעיף:') || '',
                        level: 'sub' as const,
                        parentId: 'section_3',
                        order: propertyCount + bankCount + cashCount + 1,
                        type: 'text' as const
                      };
                      setCustomSections(prev => [...prev, newSubSection]);
                    }
                  }}
                  className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 border border-blue-300 mr-4"
                >
                  ➕ הוסף תת-סעיף לסעיף 3
                </button>
              </div>
            </div>

            {/* סעיפים מותאמים אישית וקבועים - כאן! */}
            {customSections.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-green-800">
                    סעיפים מותאמים אישית {customSections.filter(s => s.isFixed).length > 0 && 
                      <span className="text-purple-700">({customSections.filter(s => s.isFixed).length} סעיפים קבועים)</span>}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddSectionWithTable}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      title="הוסף סעיף עם טבלה"
                    >
                      📊 הוסף סעיף עם טבלה
                    </button>
                    <button
                      onClick={openAddFixedSectionModal}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      📌 הוסף סעיף קבוע
                    </button>
                  </div>
                </div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={customSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {customSections
                        .sort((a, b) => a.order - b.order)
                        .map((section) => (
                        <SortableSectionItem
                          key={section.id}
                          section={section}
                          getSectionNumber={getSectionNumber}
                          changeSectionLevel={changeSectionLevel}
                          moveSectionUp={moveSectionUp}
                          moveSectionDown={moveSectionDown}
                          handleLoadSectionToWarehouse={handleLoadSectionToWarehouse}
                          handleSaveSectionTemplate={handleSaveSectionTemplate}
                          handleLoadSectionToDocument={handleLoadSectionToDocument}
                          onDelete={async (id) => {
                            const sectionToDelete = customSections.find(s => s.id === id);
                            if (sectionToDelete?.tableId) {
                              setInheritanceTables(prev => prev.filter(t => t.id !== sectionToDelete.tableId));
                            }
                            setCustomSections(prev => prev.filter(s => s.id !== id));
                            await handleDeleteSection(id);
                          }}
                          onEdit={async (id, newContent) => {
                            setCustomSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
                            // שמור את העריכה ל-Supabase
                            try {
                              const section = customSections.find(s => s.id === id);
                              if (section) {
                                const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
                                await saveSection(
                                  documentType,
                                  `section_${id}`,
                                  newContent,
                                  section.content,
                                  section.title
                                );
                              }
                            } catch (error) {
                              console.error('Error saving section edit:', error);
                            }
                          }}
                          onEditTitle={async (id, newTitle) => {
                            setCustomSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
                            // שמור את העריכה ל-Supabase
                            try {
                              const section = customSections.find(s => s.id === id);
                              if (section) {
                                const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
                                await saveSection(
                                  documentType,
                                  `section_${id}`,
                                  section.content,
                                  section.content,
                                  newTitle
                                );
                              }
                            } catch (error) {
                              console.error('Error saving title edit:', error);
                            }
                          }}
                          inheritanceTables={inheritanceTables}
                          setInheritanceTables={setInheritanceTables}
                          customSections={customSections}
                          setCustomSections={setCustomSections}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* כותרת לפני סעיף 4 */}
            <div className="bg-white p-4 rounded-lg border border-purple-400">
              <h2 className="font-bold text-lg text-purple-900 mb-2">
                {(() => {
                  const gender = willType === 'mutual' ? 'plural' : (testator.gender || 'male');
                  const text = gender === 'female' 
                    ? 'הוראות בדבר חלוקת עזבוני'
                    : gender === 'plural'
                    ? 'הוראות בדבר חלוקת עזבוננו'
                    : 'הוראות בדבר חלוקת עזבוני';
                  return replaceTextWithGender(text, gender);
                })()}
              </h2>
            </div>

            {/* סעיף 4 - חלוקת העיזבון (טבלת יורשים) */}
            <div className="bg-white p-4 rounded-lg border border-purple-400">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-purple-800">סעיף 4 - חלוקת העיזבון</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const tableId = generateSectionId();
                      const newTable = {
                        id: tableId,
                        title: `טבלת חלוקה ${inheritanceTables.length + 1}`,
                        isMain: false,
                        heirs: [],
                        order: inheritanceTables.length + 1,
                        subSections: []
                      };
                      setInheritanceTables(prev => [...prev, newTable]);
                    }}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                  >
                    ➕ הוסף טבלה
                  </button>
                </div>
              </div>
              
              {/* טקסט לפני הטבלה */}
              <div className="text-sm text-gray-700 whitespace-pre-line mb-4">
                {(() => {
                  const gender = willType === 'mutual' ? 'plural' : (testator.gender || 'male');
                  let text = '';
                  if (gender === 'female') {
                    text = 'הואיל והנני מבקשת להסדיר את חלוקת העיזבון לאחר מותי, הריני מצווה בזאת את כלל עזבוני, כפי שיהא במועד פטירתי כמפורט להלן:';
                  } else if (gender === 'plural') {
                    text = 'הואיל ואנחנו מבקשים להסדיר את חלוקת העיזבון לאחר מותנו, הרינו מצווים בזאת את כלל עזבוננו, כפי שיהא במועד פטירתנו כמפורט להלן:';
                  } else {
                    text = 'הואיל והנני מבקש להסדיר את חלוקת העיזבון לאחר מותי, הריני מצווה בזאת את כלל עזבוני, כפי שיהא במועד פטירתי כמפורט להלן:';
                  }
                  return replaceTextWithGender(text, gender);
                })()}
              </div>
              
              {/* טבלאות ירושה */}
              {inheritanceTables.map((table, tableIndex) => (
                <div key={table.id} className={`mb-4 ${tableIndex > 0 ? 'mt-6 pt-4 border-t border-purple-200' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-purple-700">
                      {table.title || `טבלת חלוקה ${tableIndex + 1}`}
                    </h4>
                    <div className="flex gap-2">
                      {!table.isMain && (
                        <>
                          <button
                            onClick={() => {
                              const newTitle = prompt('שנה את שם הטבלה:', table.title);
                              if (newTitle !== null) {
                                setInheritanceTables(prev => prev.map(t => 
                                  t.id === table.id ? { ...t, title: newTitle || table.title } : t
                                ));
                              }
                            }}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200"
                          >
                            ✏️ שנה שם
                          </button>
                          <button
                            onClick={() => {
                              const newHeir: Heir = {
                                firstName: '',
                                lastName: '',
                                id: '',
                                relation: '',
                                share: '',
                                gender: 'male'
                              };
                              setInheritanceTables(prev => prev.map(t => 
                                t.id === table.id 
                                  ? { ...t, heirs: [...t.heirs, newHeir] }
                                  : t
                              ));
                            }}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                          >
                            ➕ הוסף יורש
                          </button>
                        </>
                      )}
                      {inheritanceTables.length > 1 && (
                        <button
                          onClick={() => setInheritanceTables(prev => prev.filter(t => t.id !== table.id))}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                        >
                          🗑️ מחק טבלה
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* טבלת היורשים */}
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full bg-white rounded-lg border text-sm">
                      <thead className="bg-purple-50">
                        <tr>
                          <th className="px-3 py-2 text-right border">שם פרטי</th>
                          <th className="px-3 py-2 text-right border">שם משפחה</th>
                          <th className="px-3 py-2 text-right border">ת.ז.</th>
                          <th className="px-3 py-2 text-right border">קרבה</th>
                          <th className="px-3 py-2 text-right border">חלק</th>
                          <th className="px-3 py-2 text-right border">מגדר</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(table.isMain ? heirs : table.heirs).map((heir, heirIndex) => (
                          <tr key={heirIndex} className="border-t">
                            <td className="px-3 py-2 border">
                              {table.isMain ? heir.firstName : (
                                <input
                                  type="text"
                                  value={heir.firstName}
                                  onChange={(e) => {
                                    setInheritanceTables(prev => prev.map(t => 
                                      t.id === table.id 
                                        ? { ...t, heirs: t.heirs.map((h, i) => i === heirIndex ? { ...h, firstName: e.target.value } : h) }
                                        : t
                                    ));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  dir="rtl"
                                  placeholder="שם פרטי"
                                />
                              )}
                            </td>
                            <td className="px-3 py-2 border">
                              {table.isMain ? heir.lastName : (
                                <input
                                  type="text"
                                  value={heir.lastName}
                                  onChange={(e) => {
                                    setInheritanceTables(prev => prev.map(t => 
                                      t.id === table.id 
                                        ? { ...t, heirs: t.heirs.map((h, i) => i === heirIndex ? { ...h, lastName: e.target.value } : h) }
                                        : t
                                    ));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  dir="rtl"
                                  placeholder="שם משפחה"
                                />
                              )}
                            </td>
                            <td className="px-3 py-2 border">
                              {table.isMain ? heir.id : (
                                <input
                                  type="text"
                                  value={heir.id}
                                  onChange={(e) => {
                                    setInheritanceTables(prev => prev.map(t => 
                                      t.id === table.id 
                                        ? { ...t, heirs: t.heirs.map((h, i) => i === heirIndex ? { ...h, id: e.target.value } : h) }
                                        : t
                                    ));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  dir="ltr"
                                  placeholder="ת.ז."
                                />
                              )}
                            </td>
                            <td className="px-3 py-2 border">
                              {table.isMain ? heir.relation : (
                                <input
                                  type="text"
                                  value={heir.relation}
                                  onChange={(e) => {
                                    setInheritanceTables(prev => prev.map(t => 
                                      t.id === table.id 
                                        ? { ...t, heirs: t.heirs.map((h, i) => i === heirIndex ? { ...h, relation: e.target.value } : h) }
                                        : t
                                    ));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  dir="rtl"
                                  placeholder="קרבה"
                                />
                              )}
                            </td>
                            <td className="px-3 py-2 border">
                              {table.isMain ? heir.share : (
                                <input
                                  type="text"
                                  value={heir.share}
                                  onChange={(e) => {
                                    setInheritanceTables(prev => prev.map(t => 
                                      t.id === table.id 
                                        ? { ...t, heirs: t.heirs.map((h, i) => i === heirIndex ? { ...h, share: e.target.value } : h) }
                                        : t
                                    ));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  dir="ltr"
                                  placeholder="חלק"
                                />
                              )}
                            </td>
                            <td className="px-3 py-2 border">
                              {table.isMain ? (heir.gender === 'male' ? 'זכר' : 'נקבה') : (
                                <select
                                  value={heir.gender}
                                  onChange={(e) => {
                                    setInheritanceTables(prev => prev.map(t => 
                                      t.id === table.id 
                                        ? { ...t, heirs: t.heirs.map((h, i) => i === heirIndex ? { ...h, gender: e.target.value as 'male' | 'female' } : h) }
                                        : t
                                    ));
                                  }}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                >
                                  <option value="male">זכר</option>
                                  <option value="female">נקבה</option>
                                </select>
                              )}
                              {!table.isMain && (
                                <button
                                  onClick={() => {
                                    setInheritanceTables(prev => prev.map(t => 
                                      t.id === table.id 
                                        ? { ...t, heirs: t.heirs.filter((_, i) => i !== heirIndex) }
                                        : t
                                    ));
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700 text-xs"
                                  title="מחק יורש"
                                >
                                  🗑️
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {(table.isMain ? heirs : table.heirs).length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-3 py-4 text-center text-gray-500 border">
                              {table.isMain 
                                ? 'אין יורשים בטבלה זו. ערוך את הטבלה בחלק "יורשים" למעלה.'
                                : 'אין יורשים בטבלה זו. לחץ על "➕ הוסף יורש" להוסיף יורשים.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* תתי-סעיפים של הטבלה */}
                  <div className="space-y-2 mr-4">
                        {table.subSections && table.subSections.length > 0 && (
                      <>
                        {table.subSections.sort((a, b) => a.order - b.order).map((subSection, subIndex) => (
                          <InheritanceTableSubSection
                            key={subSection.id}
                            subSection={subSection}
                            subIndex={subIndex}
                            onUpdate={(updated) => {
                              setInheritanceTables(prev => prev.map(t => 
                                t.id === table.id 
                                  ? { ...t, subSections: t.subSections?.map(s => 
                                      s.id === subSection.id ? updated : s
                                    ) || [] }
                                  : t
                              ));
                            }}
                            onDelete={() => {
                              setInheritanceTables(prev => prev.map(t => 
                                t.id === table.id 
                                  ? { ...t, subSections: t.subSections?.filter(s => s.id !== subSection.id) || [] }
                                  : t
                              ));
                            }}
                          />
                        ))}
                      </>
                    )}
                    
                    {/* כפתור הוספת תת-סעיף */}
                    <button
                      onClick={() => {
                        const title = prompt('כותרת תת-הסעיף:');
                        if (title) {
                          const newSubSection = {
                            id: generateSectionId(),
                            title: title.trim(),
                            content: prompt('תוכן תת-הסעיף:') || '',
                            order: (table.subSections?.length || 0) + 1
                          };
                          setInheritanceTables(prev => prev.map(t => 
                            t.id === table.id 
                              ? { ...t, subSections: [...(t.subSections || []), newSubSection] }
                              : t
                          ));
                        }
                      }}
                      className="w-full px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 border border-purple-300"
                    >
                      ➕ הוסף תת-סעיף לטבלה זו
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* כפתורים להוספת סעיפים מותאמים אישית */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-blue-800">סעיפים מותאמים אישית</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newSection = {
                          id: `section-${Date.now()}`,
                          title: 'סעיף חדש',
                          content: '',
                          level: 'main' as const,
                          order: customSections.length > 0 ? Math.max(...customSections.map(s => s.order)) + 1 : 1,
                          isFixed: false
                        };
                        setCustomSections(prev => [...prev, newSection]);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      ➕ הוסף סעיף
                    </button>
                    <button
                      onClick={handleAddSectionWithTable}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      📊 הוסף סעיף עם טבלה
                    </button>
                    <button
                      onClick={openAddFixedSectionModal}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      📌 הוסף סעיף קבוע
                    </button>
                  </div>
                </div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={customSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {customSections
                        .sort((a, b) => a.order - b.order)
                        .map((section) => (
                        <SortableSectionItem
                          key={section.id}
                          section={section}
                          getSectionNumber={getSectionNumber}
                          changeSectionLevel={changeSectionLevel}
                          moveSectionUp={moveSectionUp}
                          moveSectionDown={moveSectionDown}
                          handleLoadSectionToWarehouse={handleLoadSectionToWarehouse}
                          handleSaveSectionTemplate={handleSaveSectionTemplate}
                          handleLoadSectionToDocument={handleLoadSectionToDocument}
                          onDelete={async (id) => {
                            const sectionToDelete = customSections.find(s => s.id === id);
                            if (sectionToDelete?.tableId) {
                              setInheritanceTables(prev => prev.filter(t => t.id !== sectionToDelete.tableId));
                            }
                            setCustomSections(prev => prev.filter(s => s.id !== id));
                            await handleDeleteSection(id);
                          }}
                          onEdit={async (id, newContent) => {
                            setCustomSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
                            // שמור את העריכה ל-Supabase
                            try {
                              const section = customSections.find(s => s.id === id);
                              if (section) {
                                const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
                                await saveSection(
                                  documentType,
                                  `section_${id}`,
                                  newContent,
                                  section.content,
                                  section.title
                                );
                              }
                            } catch (error) {
                              console.error('Error saving section edit:', error);
                            }
                          }}
                          onEditTitle={async (id, newTitle) => {
                            setCustomSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
                            // שמור את העריכה ל-Supabase
                            try {
                              const section = customSections.find(s => s.id === id);
                              if (section) {
                                const documentType = willType === 'individual' ? 'will-single' : 'will-couple';
                                await saveSection(
                                  documentType,
                                  `section_${id}`,
                                  section.content,
                                  section.content,
                                  newTitle
                                );
                              }
                            } catch (error) {
                              console.error('Error saving title edit:', error);
                            }
                          }}
                          inheritanceTables={inheritanceTables}
                          setInheritanceTables={setInheritanceTables}
                          customSections={customSections}
                          setCustomSections={setCustomSections}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
            </div>

            {/* סעיפים קבועים אחרונים לפני הצהרת המצווה - ללא כותרות, רק סעיפים */}
            {(() => {
              // חישוב מספור דינמי - הסעיפים המותאמים אישית (customSections) יקבלו מספור לפי הסדר שלהם
              // אחריהם הסעיפים הקבועים האלה
              const mainCustomSectionsCount = customSections.filter(s => s.level === 'main' && !s.isFixed).length;
              const baseSectionNum = 4 + mainCustomSectionsCount + 1;
              const gender = willType === 'mutual' ? 'plural' : (testator.gender || 'male');
              
              const finalFixedSections = [
                {
                  num: baseSectionNum,
                  content: {
                    male: 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.',
                    female: 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.',
                    plural: 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתנו, חלקו יעבור ליורשיו החוקיים.'
                  }
                },
                {
                  num: baseSectionNum + 1,
                  content: {
                    male: 'כל זכויות החיסכון והביטוח המצויות בקופות הגמל, קרנות הפנסיה, קופות התגמולים, קרנות ההשתלמות, תוכניות החיסכון, פוליסות ביטוח החיים וכל מוצר פיננסי אחר (להלן: "הקופות") ישולמו למוטבים הרשומים בקופות במועד הפטירה, וזאת בהתאם לרישום בפועל בקופות במועד הפטירה.',
                    female: 'כל זכויות החיסכון והביטוח המצויות בקופות הגמל, קרנות הפנסיה, קופות התגמולים, קרנות ההשתלמות, תוכניות החיסכון, פוליסות ביטוח החיים וכל מוצר פיננסי אחר (להלן: "הקופות") ישולמו למוטבים הרשומים בקופות במועד הפטירה, וזאת בהתאם לרישום בפועל בקופות במועד הפטירה.',
                    plural: 'כל זכויות החיסכון והביטוח המצויות בקופות הגמל, קרנות הפנסיה, קופות התגמולים, קרנות ההשתלמות, תוכניות החיסכון, פוליסות ביטוח החיים וכל מוצר פיננסי אחר (להלן: "הקופות") ישולמו למוטבים הרשומים בקופות במועד הפטירה, וזאת בהתאם לרישום בפועל בקופות במועד הפטירה.'
                  }
                },
                {
                  num: baseSectionNum + 2,
                  content: {
                    male: 'מובהר בזאת, כי ככל שבאחת או יותר מהקופות לא יהיו רשומים מוטבים במועד הפטירה, יראו את הזכויות באותן קופות כחלק מעיזבון המצווה, והן יחולקו בהתאם להוראות צוואה זו ולפי הוראותיה המפורשות.',
                    female: 'מובהר בזאת, כי ככל שבאחת או יותר מהקופות לא יהיו רשומים מוטבים במועד הפטירה, יראו את הזכויות באותן קופות כחלק מעיזבון המצווה, והן יחולקו בהתאם להוראות צוואה זו ולפי הוראותיה המפורשות.',
                    plural: 'מובהר בזאת, כי ככל שבאחת או יותר מהקופות לא יהיו רשומים מוטבים במועד הפטירה, יראו את הזכויות באותן קופות כחלק מעיזבון המצווים, והן יחולקו בהתאם להוראות צוואה זו ולפי הוראותיה המפורשות.'
                  }
                },
                {
                  num: baseSectionNum + 3,
                  content: {
                    male: 'הנני דורש מכל אדם ומכל רשות לקיים צוואה זו ולא לערער עליה ולא להתנגד לה ולא לתקוף אותה, ואם יתעורר אי פעם ספק כלשהו בקשר לצוואה זו, הרי שיש להתיר את הספק לפי הדין ולתת לה תוקף ולקיים אותה.',
                    female: 'הנני דורשת מכל אדם ומכל רשות לקיים צוואה זו ולא לערער עליה ולא להתנגד לה ולא לתקוף אותה, ואם יתעורר אי פעם ספק כלשהו בקשר לצוואה זו, הרי שיש להתיר את הספק לפי הדין ולתת לה תוקף ולקיים אותה.',
                    plural: 'הננו דורשים מכל אדם ומכל רשות לקיים צוואה זו ולא לערער עליה ולא להתנגד לה ולא לתקוף אותה, ואם יתעורר אי פעם ספק כלשהו בקשר לצוואה זו, הרי שיש להתיר את הספק לפי הדין ולתת לה תוקף ולקיים אותה.'
                  }
                },
                {
                  num: baseSectionNum + 4,
                  content: {
                    male: 'ולראיה באתי על החתום מרצוני הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות נתון לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאינני סובל מאיזו חולשה גופנית או רוחנית הגורעת או המונעת ממני את כושרי המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרתי בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתי, וביקשתי מהן לאשר בחתימתן שכך הצהרתי וחתמתי בפניהן.',
                    female: 'ולראיה באתי על החתום מרצוני הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות נתונה לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאינני סובלת מאיזו חולשה גופנית או רוחנית הגורעת או המונעת ממני את כושרי המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרתי בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתי, וביקשתי מהן לאשר בחתימתן שכך הצהרתי וחתמתי בפניהן.',
                    plural: 'ולראיה באנו על החתום מרצוננו הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות נתונים לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאיננו סובלים מאיזו חולשה גופנית או רוחנית הגורעת או המונעת מאתנו את כושרינו המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרנו בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתנו, וביקשנו מהן לאשר בחתימתן שכך הצהרנו וחתמנו בפניהן.'
                  }
                }
              ];
              
              return (
                <>
                  {finalFixedSections.map((section) => (
                    <div key={section.num} className="bg-white p-4 rounded-lg border border-blue-300">
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        <span className="font-semibold">סעיף {section.num}: </span>
                        {section.content && ((gender in section.content ? section.content[gender as keyof typeof section.content] : section.content.male) || section.content.male)}
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}

            {/* הצהרת המצווה */}
            {(() => {
              const gender = willType === 'mutual' ? 'plural' : (testator.gender || 'male');
              const signatureText = willType === 'mutual'
                ? 'ולראיה באנו על החתום מרצוננו הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות נתונים לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאיננו סובלים מאיזו חולשה גופנית או רוחנית הגורעת או המונעת מאתנו את כושרינו המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרנו בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתנו, וביקשנו מהן לאשר בחתימתן שכך הצהרנו וחתמנו בפניהן.'
                : (gender === 'female'
                  ? 'ולראיה באתי על החתום מרצוני הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות נתונה לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאינני סובלת מאיזו חולשה גופנית או רוחנית הגורעת או המונעת ממני את כושרי המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרתי בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתי, וביקשתי מהן לאשר בחתימתן שכך הצהרתי וחתמתי בפניהן.'
                  : 'ולראיה באתי על החתום מרצוני הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות נתון לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאינני סובל מאיזו חולשה גופנית או רוחנית הגורעת או המונעת ממני את כושרי המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרתי בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתי, וביקשתי מהן לאשר בחתימתן שכך הצהרתי וחתמתי בפניהן.');
              
              return (
                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {signatureText}
                  </div>
                </div>
              );
            })()}

            {/* הצהרת העדים */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">הצהרת העדים</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                אנו העדים החתומים מטה, {witnesses[0]?.name || '[שם עד ראשון]'}, ת.ז. {witnesses[0]?.id || '[מספר ת.ז.]'}, 
                ו-{witnesses[1]?.name || '[שם עד שני]'}, ת.ז. {witnesses[1]?.id || '[מספר ת.ז.]'}, 
                מעידים בזאת כי המצווה/ה חתם/ה על צוואה זו בפנינו, וכי הוא/היא עשה/עשתה זאת מרצונו/ה החופשי ובהכרה מלאה של תוכן הצוואה.
              </div>
            </div>

            {/* חתימות */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">חתימות</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {generateProfessionalWillContent(willType, getWillData(), []).split('\n\n').slice(-2).join('\n\n')}
              </div>
            </div>
          </div>
        </section>

        {/* כפתור הוספת סעיף מותאם אישית */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
              <span className="text-lg">📋</span>
              טעינת סעיפים מ-Supabase
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleLoadTemplate()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              >
                📋 טען תבנית
              </button>
              <button
                onClick={() => setShowUnifiedWarehouse(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                🏪 טען מהמאגר
              </button>
            </div>
          </div>
          <p className="text-green-700 mb-3">
            הסעיפים מנוהלים דרך Supabase Dashboard
          </p>
          
          {variables.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                📋 משתנים קיימים ({variables.length})
              </h4>
              <div className="space-y-1">
                {variables.map((variable) => (
                  <div key={variable.id} className="flex items-center justify-between text-xs">
                    <span className="text-blue-700">
                      <code className="bg-blue-100 px-1 rounded">{`{{${variable.name}}}`}</code>
                      <span className="text-gray-600 ml-2">- {variable.description}</span>
                    </span>
                    <span className="text-gray-500">({variable.usageCount} שימושים)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-green-800 bg-green-100 p-3 rounded-lg">
            💡 <strong>טיפ:</strong> הסעיפים המותאמים אישית יופיעו אוטומטית במקום הנכון בצוואה - בין הצהרות לסעיפים הקבועים.
          </div>
        </section>

        {/* מערכת הלמידה והמחסן */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">🧠</span>
              מערכת למידה ומחסן סעיפים
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLearningSystem(!showLearningSystem)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {showLearningSystem ? 'הסתר' : 'הצג'} מערכת למידה
              </button>
              <button
                onClick={() => setShowWarehouse(!showWarehouse)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {showWarehouse ? 'הסתר' : 'הצג'} מחסן סעיפים
              </button>
              <button
                onClick={openAddSectionModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ➕ הוסף סעיף למחסן
              </button>
              <button
                onClick={openAddFixedSectionModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                📌 הוסף סעיף קבוע
              </button>
            </div>
          </div>
          
          {showLearningSystem && (
            <div className="mb-6">
              <AILearningManager />
              
              {/* סעיפים ניתנים לעריכה */}
              {editableSections.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✅ <strong>מצב עריכה פעיל!</strong> ערוך כל סעיף והשתמש ב-AI לשיפור הטקסט
                    </p>
                  </div>

                  {editableSections.map((section) => (
                    <EditableSection
                      key={section.id}
                      section={section}
                      userId={testator.fullName || 'anonymous'}
                      onUpdate={handleUpdateEditableSection}
                      onSaveToWarehouse={handleSaveToWarehouse}
                      onSaveToLearning={handleSaveToLearning}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {showWarehouseEditor && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4">✏️ עורך המאגר</h3>
                <p className="text-sm text-red-700 mb-4">
                  כאן תוכל לערוך, להוסיף ולמחוק סעיפים ישירות במאגר
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      const title = prompt('כותרת הסעיף:');
                      const content = prompt('תוכן הסעיף:');
                      const category = prompt('קטגוריה (financial/personal/business/health/couple/children/property/digital):');
                      if (title && content && category) {
                        handleAddToWarehouse(title, content, category);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    + הוסף סעיף למאגר
                  </button>
                  <button
                    onClick={() => setShowWarehouseEditor(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    סגור עורך
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {showWarehouse && (
            <div className="mb-6">
              <UnifiedWarehouse
                onSectionSelect={handleSelectFromWarehouse}
                userId={testator.fullName || 'anonymous'}
                willType={willType}
              />
            </div>
          )}

          {/* מאגר מאוחד חדש */}
          {showUnifiedWarehouse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    🏪 מאגר סעיפים
                  </h3>
                  <button
                    onClick={() => setShowUnifiedWarehouse(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <UnifiedWarehouse
                  onSectionSelect={(section) => {
                    console.log('🔴🔴🔴 Direct callback CALLED in render! Section:', section);
                    handleLoadFromWarehouse(section);
                  }}
                  userId={testator.fullName || 'anonymous'}
                  willType={willType}
                />
              </div>
            </div>
          )}
        </section>

        {/* תצוגת כל הסעיפים */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              📄 תצוגת הצוואה המלאה
            </h2>
            <button
              onClick={() => setShowFullWill(!showFullWill)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showFullWill ? 'הסתר' : 'הצג'} צוואה מלאה
            </button>
          </div>
          
          {showFullWill && (
            <div className="bg-white border border-blue-300 rounded-lg p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* סעיפים קבועים - התחלה */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-800 mb-2">פתיחה משפטית</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {generateProfessionalWillContent(willType, getWillData(), []).split('\n\n')[0]}
                  </div>
                </div>

                {/* סעיף 3 - היקף העיזבון עם תתי-סעיפים */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-800 mb-2">סעיף 3 - היקף העיזבון</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-line mb-3">
                    צוואתי זו תחול על כלל רכושי מכל מין וסוג שהוא, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים. מבלי לגרוע מכלליות האמור לעיל, צוואתי זו תחול גם על כספים, תוכניות חיסכון, קרנות נאמנות, ניירות ערך, תביעות, פנסיות, תגמולים, ביטוחי חיים, קצבאות, בין אם מופקדים בבנק ובין אם בידי כל גורם אחר, וכן על זכויות אחרות מכל סוג שהוא, וכל רכוש אחר בין במיטלטלין ובין במקרקעין (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או יגיעו לידי בעתיד (להלן: "העיזבון"):
                  </div>
                  
                  {/* תתי-סעיפים */}
                  <div className="space-y-2 mr-4">
                    {/* נכסים */}
                    {properties.filter(p => p.address || p.city || p.block || p.plot).map((property, index) => (
                      <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                        <span className="font-semibold text-blue-800">3.{index + 1} - {property.name || `נכס ${index + 1}`}:</span>
                        <span className="text-gray-700">
                          {' '}זכויות בדירה הרשומה בטאבו {property.address || '[כתובת]'}, בעיר {property.city || '[עיר]'}
                          {property.block && `, גוש: ${property.block}`}
                          {property.plot && `, חלקה: ${property.plot}`}
                          {property.subPlot && `, תת חלקה: ${property.subPlot}`}
                          {property.ownership && property.ownership !== '100%' && ` (אחוז בעלות: ${property.ownership})`}
                          {' וכן את מטלטליה בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע.'}
                        </span>
                      </div>
                    ))}
                    
                    {/* חשבונות בנק */}
                    {bankAccounts.filter(a => a.bank || a.accountNumber).map((account, index) => {
                      const propertyCount = properties.filter(p => p.address || p.city || p.block || p.plot).length;
                      const subSectionNum = propertyCount + index + 1;
                      return (
                        <div key={`bank-${index}`} className="bg-blue-50 p-2 rounded text-sm">
                          <span className="font-semibold text-blue-800">3.{subSectionNum} - חשבון בנק:</span>
                          <span className="text-gray-700">
                            {' '}חשבון הבנק המנוהל על שמי בבנק {account.bank || '[שם הבנק]'}, סניף מספר {account.branch || '[מספר]'}, 
                            חשבון מספר {account.accountNumber || '[מספר]'}, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* סעיפים מותאמים אישית */}
                {customSections.map((section, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-green-800">
                        {section.title || `סעיף ${index + 1}`}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveSectionUp(section.id)}
                          className="p-1 rounded text-xs text-green-600 hover:text-green-800 hover:bg-green-50"
                          title="הזז למעלה"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveSectionDown(section.id)}
                          className="p-1 rounded text-xs text-green-600 hover:text-green-800 hover:bg-green-50"
                          title="הזז למטה"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleAddSectionToWarehouse(section.title || `סעיף ${index + 1}`, section.content, 'custom')}
                          className="p-1 rounded text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="שמור למחסן"
                        >
                          💾
                        </button>
                      </div>
                    </div>
                    
                    {/* תוכן הסעיף */}
                    {section.content && (
                      <div className="text-sm text-gray-700 whitespace-pre-line mb-3">
                        {section.content}
                      </div>
                    )}
                    
                    {/* טבלה לפי סוג הסעיף */}
                    {section.type === 'property' && section.tableData && (
                      <div className="mb-3">
                        <div className="overflow-x-auto">
                          <table className="w-full bg-white rounded-lg border text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-right">שם הנכס</th>
                                <th className="px-3 py-2 text-right">כתובת</th>
                                <th className="px-3 py-2 text-right">עיר</th>
                                <th className="px-3 py-2 text-right">גוש</th>
                                <th className="px-3 py-2 text-right">חלקה</th>
                                <th className="px-3 py-2 text-right">אחוז בעלות</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.tableData.map((property: any, propIndex: number) => (
                                <tr key={propIndex} className="border-t">
                                  <td className="px-3 py-2">{property.name}</td>
                                  <td className="px-3 py-2">{property.address}</td>
                                  <td className="px-3 py-2">{property.city}</td>
                                  <td className="px-3 py-2">{property.block}</td>
                                  <td className="px-3 py-2">{property.plot}</td>
                                  <td className="px-3 py-2">{property.ownership}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {section.type === 'heirs' && section.tableData && (
                      <div className="mb-3">
                        <div className="overflow-x-auto">
                          <table className="w-full bg-white rounded-lg border text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-right">שם פרטי</th>
                                <th className="px-3 py-2 text-right">שם משפחה</th>
                                <th className="px-3 py-2 text-right">ת.ז.</th>
                                <th className="px-3 py-2 text-right">קרבה</th>
                                <th className="px-3 py-2 text-right">חלק</th>
                                <th className="px-3 py-2 text-right">מגדר</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.tableData.map((heir: any, heirIndex: number) => (
                                <tr key={heirIndex} className="border-t">
                                  <td className="px-3 py-2">{heir.firstName}</td>
                                  <td className="px-3 py-2">{heir.lastName}</td>
                                  <td className="px-3 py-2">{heir.id}</td>
                                  <td className="px-3 py-2">{heir.relation}</td>
                                  <td className="px-3 py-2">{heir.share}</td>
                                  <td className="px-3 py-2">{heir.gender === 'male' ? 'זכר' : 'נקבה'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {section.type === 'bank-account' && section.tableData && (
                      <div className="mb-3">
                        <div className="overflow-x-auto">
                          <table className="w-full bg-white rounded-lg border text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-right">בנק</th>
                                <th className="px-3 py-2 text-right">מספר בנק</th>
                                <th className="px-3 py-2 text-right">סניף</th>
                                <th className="px-3 py-2 text-right">מספר חשבון</th>
                                <th className="px-3 py-2 text-right">מיקום</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.tableData.map((account: any, accIndex: number) => (
                                <tr key={accIndex} className="border-t">
                                  <td className="px-3 py-2">{account.bank}</td>
                                  <td className="px-3 py-2">{account.bankNumber}</td>
                                  <td className="px-3 py-2">{account.branch}</td>
                                  <td className="px-3 py-2">{account.accountNumber}</td>
                                  <td className="px-3 py-2">{account.location}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* סעיפים קבועים - סוף */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-800 mb-2">הצהרות וחתימות</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {generateProfessionalWillContent(willType, getWillData(), []).split('\n\n').slice(-2).join('\n\n')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* סטטוס והכנה לייצוא */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">מצב הטופס</h3>
            <div className={`text-sm px-4 py-2 rounded-lg ${
              isFormValid() 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {isFormValid() 
                ? '✅ כל הפרטים מולאו - מוכן לייצוא מקצועי!' 
                : '⚠️ יש למלא את כל השדות הנדרשים'}
            </div>
          </div>

          {/* כפתור ייצוא מקצועי */}
          <ProfessionalWordExporter
            willData={getWillData() as any}
            className="w-full"
          />
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
                onClick={() => {
                  const newVariable = createNewVariable();
                  if (newVariable) {
                    // הוסף את המשתנה לטקסט הנוכחי
                    const variableText = `{{${newVariable.name}}}`;
                    // כאן נוכל להוסיף את המשתנה לטקסט הנוכחי בעריכה
                    alert(`✅ משתנה "${newVariable.name}" נוצר בהצלחה!\nניתן להשתמש בו כ: ${variableText}`);
                  }
                }}
                disabled={!addVariableModal.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                צור משתנה
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* מודל הוספת סעיף למחסן */}
      {addSectionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ➕ הוסף סעיף למחסן
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת הסעיף
                </label>
                <input
                  type="text"
                  value={addSectionModal.title}
                  onChange={(e) => setAddSectionModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="לדוגמה: הוראות לגבי חיות מחמד"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תוכן הסעיף
                </label>
                <textarea
                  value={addSectionModal.content}
                  onChange={(e) => setAddSectionModal(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="לדוגמה: אני מצווה כי הכלב שלי יעבור לטיפול של בתי הבכורה."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קטגוריה
                </label>
                <select
                  value={addSectionModal.category}
                  onChange={(e) => setAddSectionModal(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="custom">מותאם אישית</option>
                  <option value="financial">כספי</option>
                  <option value="property">נכסים</option>
                  <option value="family">משפחה</option>
                  <option value="legal">משפטי</option>
                  <option value="special">מיוחד</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAddSectionModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ביטול
              </button>
              <button
                onClick={createNewSection}
                disabled={!addSectionModal.title.trim() || !addSectionModal.content.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                שמור למחסן
              </button>
            </div>
          </div>
        </div>
      )}

      {/* מודל הוספת סעיף קבוע */}
      {addFixedSectionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-purple-900 mb-4">
              📌 הוסף סעיף קבוע
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              סעיף קבוע יופיע בכל הצוואות שנוצרות. ניתן לערוך ולהזיז אותו בכל עת.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת הסעיף
                </label>
                <input
                  type="text"
                  value={addFixedSectionModal.title}
                  onChange={(e) => setAddFixedSectionModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="לדוגמה: הוראות לגבי חיות מחמד"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תוכן הסעיף
                </label>
                <textarea
                  value={addFixedSectionModal.content}
                  onChange={(e) => setAddFixedSectionModal(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="לדוגמה: אני מצווה כי הכלב שלי יעבור לטיפול של בתי הבכורה."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 h-32 resize-none"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAddFixedSectionModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ביטול
              </button>
              <button
                onClick={handleAddFixedSection}
                disabled={!addFixedSectionModal.title.trim() || !addFixedSectionModal.content.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                הוסף סעיף קבוע
              </button>
            </div>
          </div>
        </div>
      )}

      {/* מודל הוספת סעיף עם טבלה */}
      {addSectionWithTableModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                הוסף סעיף עם טבלה
              </h3>
              <button
                onClick={closeAddSectionWithTableModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כותרת הסעיף
                </label>
                <input
                  type="text"
                  value={addSectionWithTableModal.title}
                  onChange={(e) => setAddSectionWithTableModal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="לדוגמה: דירת מגורים / יורשים / חשבון בנק"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תוכן הסעיף (אופציונלי)
                </label>
                <textarea
                  value={addSectionWithTableModal.content}
                  onChange={(e) => setAddSectionWithTableModal(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="לדוגמה: אני מצווה כי דירת המגורים שלי תועבר ל..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                  dir="rtl"
                />
              </div>
              
              {/* טבלה דינמית לפי סוג */}
              {addSectionWithTableModal.type === 'property' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    פרטי נכסים
                  </label>
                  <div className="space-y-2">
                    {addSectionWithTableModal.tableData?.map((property: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="שם הנכס"
                            value={property.name}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].name = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder="כתובת"
                            value={property.address}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].address = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder="עיר"
                            value={property.city}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].city = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder="גוש"
                            value={property.block}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].block = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                          <input
                            type="text"
                            placeholder="חלקה"
                            value={property.plot}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].plot = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                          <input
                            type="text"
                            placeholder="אחוז בעלות"
                            value={property.ownership}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].ownership = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                        </div>
                        {addSectionWithTableModal.tableData.length > 1 && (
                          <button
                            onClick={() => {
                              const newData = addSectionWithTableModal.tableData.filter((_: any, i: number) => i !== index);
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ מחק נכס
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newData = [...addSectionWithTableModal.tableData, {
                          name: '',
                          address: '',
                          city: '',
                          block: '',
                          plot: '',
                          subPlot: '',
                          ownership: '100%'
                        }];
                        setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    >
                      + הוסף נכס
                    </button>
                  </div>
                </div>
              )}
              
              {addSectionWithTableModal.type === 'heirs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    פרטי יורשים
                  </label>
                  <div className="space-y-2">
                    {addSectionWithTableModal.tableData?.map((heir: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="שם פרטי"
                            value={heir.firstName}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].firstName = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder="שם משפחה"
                            value={heir.lastName}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].lastName = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder="ת.ז."
                            value={heir.id}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].id = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                          <input
                            type="text"
                            placeholder="קרבה"
                            value={heir.relation}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].relation = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder="חלק"
                            value={heir.share}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].share = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                          <select
                            value={heir.gender}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].gender = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="male">זכר</option>
                            <option value="female">נקבה</option>
                          </select>
                        </div>
                        {addSectionWithTableModal.tableData.length > 1 && (
                          <button
                            onClick={() => {
                              const newData = addSectionWithTableModal.tableData.filter((_: any, i: number) => i !== index);
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ מחק יורש
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newData = [...addSectionWithTableModal.tableData, {
                          firstName: '',
                          lastName: '',
                          id: '',
                          relation: '',
                          share: '100%',
                          gender: 'male'
                        }];
                        setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                      }}
                      className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                    >
                      + הוסף יורש
                    </button>
                  </div>
                </div>
              )}
              
              {addSectionWithTableModal.type === 'bank-account' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    פרטי חשבונות בנק
                  </label>
                  <div className="space-y-2">
                    {addSectionWithTableModal.tableData?.map((account: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="בנק"
                            value={account.bank}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].bank = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder="מספר בנק"
                            value={account.bankNumber}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].bankNumber = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                          <input
                            type="text"
                            placeholder="סניף"
                            value={account.branch}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].branch = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                          <input
                            type="text"
                            placeholder="מספר חשבון"
                            value={account.accountNumber}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].accountNumber = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="ltr"
                          />
                          <input
                            type="text"
                            placeholder="מיקום"
                            value={account.location}
                            onChange={(e) => {
                              const newData = [...addSectionWithTableModal.tableData];
                              newData[index].location = e.target.value;
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                            dir="rtl"
                          />
                        </div>
                        {addSectionWithTableModal.tableData.length > 1 && (
                          <button
                            onClick={() => {
                              const newData = addSectionWithTableModal.tableData.filter((_: any, i: number) => i !== index);
                              setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                            }}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            🗑️ מחק חשבון
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newData = [...addSectionWithTableModal.tableData, {
                          bank: '',
                          bankNumber: '',
                          branch: '',
                          accountNumber: '',
                          location: ''
                        }];
                        setAddSectionWithTableModal(prev => ({ ...prev, tableData: newData }));
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                    >
                      + הוסף חשבון
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeAddSectionWithTableModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={handleAddSectionWithTable}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                הוסף סעיף
              </button>
            </div>
          </div>
        </div>
      )}

      {/* מודל השלמת משתנים */}
      {variablesCompletionModal.isOpen && variablesCompletionModal.pendingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  🔧 השלם משתנים לפני הוספת הסעיף
                </h3>
                {variablesCompletionModal.pendingSection && (
                  <p className="text-sm text-gray-600 mt-1">
                    סעיף: <strong>{variablesCompletionModal.pendingSection.title}</strong>
                  </p>
                )}
              </div>
              <button
                onClick={() => setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {}, pendingSection: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* הצגת תוכן הסעיף */}
            {variablesCompletionModal.pendingSection && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">תוכן הסעיף:</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{variablesCompletionModal.pendingSection.content.substring(0, 200)}{variablesCompletionModal.pendingSection.content.length > 200 ? '...' : ''}</p>
              </div>
            )}
            
            {/* בחירת מגדר כללי אם יש דפוסי מגדר בלי משתנים */}
            {variablesCompletionModal.variables.length === 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מגדר לטקסט:
                </label>
                <select
                  value={testator.gender || 'male'}
                  onChange={(e) => {
                    // עדכן את מגדר המצווה (אבל זה לא ישפיע על הסעיף הנוכחי, רק על החלפת הטקסט)
                    setTestator(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="male">זכר</option>
                  <option value="female">נקבה</option>
                  <option value="plural">רבים (לצוואה הדדית)</option>
                </select>
                <p className="text-xs text-gray-600 mt-2">
                  הטקסט יתאים למגדר שנבחר (ייטפל בדפוסים כמו /ת /ה /ים)
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {variablesCompletionModal.variables.map((variable, index) => (
                <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700">
                    {`{{${variable}}}`}
                  </label>
                  
                  {/* שדה ערך */}
                  <input
                    type="text"
                    value={variablesCompletionModal.values[variable] || ''}
                    onChange={(e) => setVariablesCompletionModal(prev => ({
                      ...prev,
                      values: {
                        ...prev.values,
                        [variable]: e.target.value
                      }
                    }))}
                    placeholder={`הזן ערך עבור ${variable}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* בחירת מגדר */}
                  {isGenderRelevantVariable(variable) && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        מגדר:
                      </label>
                      <select
                        value={variablesCompletionModal.genders[variable] || 'male'}
                        onChange={(e) => setVariablesCompletionModal(prev => ({
                          ...prev,
                          genders: {
                            ...prev.genders,
                            [variable]: e.target.value as 'male' | 'female' | 'plural'
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="male">זכר</option>
                        <option value="female">נקבה</option>
                        <option value="plural">רבים</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {}, pendingSection: null })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  if (!variablesCompletionModal.pendingSection) {
                    alert('שגיאה: אין סעיף להשלמה');
                    return;
                  }
                  
                  let content = variablesCompletionModal.pendingSection.content;
                  
                  // שלב 1: החלף משתנים
                  variablesCompletionModal.variables.forEach(variable => {
                    const value = variablesCompletionModal.values[variable];
                    if (value) {
                      content = content.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), value);
                    }
                  });
                  
                  // שלב 1.5: זיהוי מגדר מההקשר והשם שהוזן
                  // אם הטקסט אומר "חלקו" = זכר, "חלקה" = נקבה
                  // אם השם מכיל "בן" = זכר, "בת" = נקבה
                  let detectedGenderFromContext: 'male' | 'female' | 'plural' | null = null;
                  
                  // בדוק את הטקסט אחרי החלפת משתנים
                  if (content.includes('חלקו') && !content.includes('חלקה')) {
                    detectedGenderFromContext = 'male';
                    console.log('✅ זוהה מגדר זכר מההקשר: "חלקו"');
                  } else if (content.includes('חלקה') && !content.includes('חלקו')) {
                    detectedGenderFromContext = 'female';
                    console.log('✅ זוהה מגדר נקבה מההקשר: "חלקה"');
                  }
                  
                  // בדוק את השם שהוזן - אם יש "בן" = זכר, "בת" = נקבה
                  // גם בדוק את השם הפרטי עצמו (למשל "ירון" = זכר)
                  Object.entries(variablesCompletionModal.values).forEach(([variable, value]) => {
                    if (value && typeof value === 'string') {
                      if (value.includes(' בן ') || value.match(/\s+בן\s+/)) {
                        detectedGenderFromContext = 'male';
                        console.log(`✅ זוהה מגדר זכר מהשם: "${value}" (מכיל "בן")`);
                      } else if (value.includes(' בת ') || value.match(/\s+בת\s+/)) {
                        detectedGenderFromContext = 'female';
                        console.log(`✅ זוהה מגדר נקבה מהשם: "${value}" (מכיל "בת")`);
                      } else {
                        // בדוק את השם הפרטי עצמו
                        const firstName = value.split(' ')[0];
                        if (firstName) {
                          const detectedGender = detectGenderFromName(firstName);
                          if (detectedGender) {
                            detectedGenderFromContext = detectedGender as 'male' | 'female' | 'plural';
                            console.log(`✅ זוהה מגדר ${detectedGender} מהשם הפרטי: "${firstName}"`);
                          }
                        }
                      }
                    }
                  });
                  
                  // שלב 2: החלף את כל התוכן לפי מגדר (לטפל בדפוסים כמו "הוא יליד/ת", "יוכל/תוכל", "ירצה/תרצה")
                  // חפש משתנה רגיש למגדר - עדיפות למשתני אפוטרופוס/שומר
                  const genderRelevantVariables = variablesCompletionModal.variables.filter(v => isGenderRelevantVariable(v));
                  let selectedGender: 'male' | 'female' | 'plural' = detectedGenderFromContext || (testator.gender === 'organization' ? 'male' : (testator.gender || 'male')) as 'male' | 'female' | 'plural';
                  
                  // אם יש משתנים רגישי מגדר, קח את המגדר של הראשון שנבחר
                  if (genderRelevantVariables.length > 0) {
                    // עדיפות למשתני אפוטרופוס
                    const guardianVariable = genderRelevantVariables.find(v => 
                      v.includes('אפוטרופוס') || v.includes('guardian') || v.includes('שומר')
                    );
                    const variableToUse = guardianVariable || genderRelevantVariables[0];
                    
                    if (variablesCompletionModal.genders[variableToUse]) {
                      selectedGender = variablesCompletionModal.genders[variableToUse];
                      console.log(`✅ משתמש במגדר "${selectedGender}" עבור המשתנה "${variableToUse}"`);
                    } else {
                      // אם לא נבחר מגדר, השתמש ברירת מחדל
                      console.log(`⚠️ לא נבחר מגדר למשתנה "${variableToUse}", משתמש ברירת מחדל: ${selectedGender}`);
                    }
                  } else {
                    // אם אין משתנים רגישי מגדר, השתמש במגדר המצווה
                    selectedGender = willType === 'mutual' ? 'plural' : ((testator.gender === 'organization' ? 'male' : (testator.gender || 'male')) as 'male' | 'female' | 'plural');
                    console.log(`ℹ️ אין משתנים רגישי מגדר, משתמש במגדר המצווה: ${selectedGender}`);
                  }
                  
                  console.log(`🔄 מחליף דפוסי מגדר בטקסט לפי מגדר: ${selectedGender}`);
                  console.log(`📝 תוכן לפני החלפת מגדר: ${content.substring(0, 200)}`);
                  // החלף דפוסי מגדר לפי המגדר שנבחר
                  content = replaceTextWithGender(content, selectedGender);
                  console.log(`✅ תוכן לאחר החלפת מגדר: ${content.substring(0, 200)}`);
                  
                  // החלפות ידניות - נסה להחליף ידנית כל הדפוסים שלא הוחלפו
                  if (selectedGender === 'female') {
                    // שלב 1: החלף "האפוטרופוס" ל"האפוטרופסית"
                    content = content.replace(/האפוטרופוס/g, 'האפוטרופסית');
                    // שלב 1.5: החלף "האפוטרופוס החלופי" ל"האפוטרופסית החלופית"
                    content = content.replace(/האפוטרופוס החלופי/g, 'האפוטרופסית החלופית');
                    // שלב 2: החלף "כאפוטרופוס" ל"כאפוטרופסית" (חשוב לפני החלפת "אפוטרופוס" בודד)
                    content = content.replace(/כאפוטרופוס/g, 'כאפוטרופסית');
                    // שלב 2.5: החלף "כאפוטרופוס חלופי" ל"כאפוטרופסית חלופית"
                    content = content.replace(/כאפוטרופוס חלופי/g, 'כאפוטרופסית חלופית');
                    // שלב 3: החלף "אפוטרופוס" בודד (רק אם לא "אפוטרופסית" כבר)
                    // קודם נחליף "אפוטרופוס חלופי" ל"אפוטרופסית חלופית"
                    content = content.replace(/אפוטרופוס חלופי/g, 'אפוטרופסית חלופית');
                    // נשתמש בהחלפה שתדלג על המקרים שכבר הוחלפו
                    content = content.replace(/\s+אפוטרופוס\s+/g, ' אפוטרופסית ');
                    content = content.replace(/\s+אפוטרופוס([^ית])/g, ' אפוטרופסית$1');
                    // החלפה כללית אחרונה לשאר המקרים
                    content = content.replace(/אפוטרופוס(?!ית)/g, 'אפוטרופסית');
                    // שלב 4: החלף "לא יוכל/תוכל" ו"לא ירצה/תרצה"
                    content = content.replace(/לא יוכל\/תוכל/g, 'לא תוכל');
                    content = content.replace(/לא ירצה\/תרצה/g, 'לא תרצה');
                    // שלב 5: החלף "יוכל/תוכל" ו"ירצה/תרצה" בלי "לא"
                    content = content.replace(/יוכל\/תוכל/g, 'תוכל');
                    content = content.replace(/ירצה\/תרצה/g, 'תרצה');
                    // שלב 6: החלף "חלופי/ת" ל"חלופית"
                    content = content.replace(/חלופי\/ת/g, 'חלופית');
                    // שלב 7: החלף "תפקידו/ה" ל"תפקידה"
                    content = content.replace(/תפקידו\/ה/g, 'תפקידה');
                    console.log(`✅ הוחלף ידנית: ${content.substring(0, 300)}`);
                  }
                  
                  // הוסף את הסעיף המעודכן לרשימה
                  const updatedSection = {
                    ...variablesCompletionModal.pendingSection,
                    content
                  };
                  
                  setCustomSections(prev => [...prev, updatedSection]);
                  setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {}, pendingSection: null });
                  alert(`✅ הסעיף "${updatedSection.title}" הוסף לצוואה עם המשתנים שהושלמו!`);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                הוסף סעיף
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// פונקציות עזר
function isGenderRelevantVariable(variable: string): boolean {
  const genderRelevantVariables = [
    // משתנים באנגלית
    'heir_name', 'guardian_name', 'alternate_guardian', 'child_name', 
    'manager_name', 'trustee_name', 'spouse_name', 'guardian_id', 'guardian_address',
    'trustee_gender', 'accountant_name', 'accountant_gender',
    // משתנים בעברית
    'בן/בת זוגי', 'שם בן/בת הזוג', 'שם מלא', 'שם ילד/ה ראשון/ה', 'שם ילד/ה שני/ה', 'שם ילד/ה שלישי/ת',
    'הוא/היא', 'תאריך', 'תעודת זהות', 'שם מלא האפוטרופוס', 'שם מלא האפוטרופוס החלופי',
    'שם האפוטרופוס', 'שם האפוטרופוס החלופי', 'שם אפוטרופוס', 'שם אפוטרופוס החלופי',
    'מיופה_כוח', 'רשאי', 'אחראי', 'מחויב', 'יכול', 'צריך', 'חייב', 'זכאי', 
    'מתחייב', 'מסכים', 'מבקש', 'מצהיר', 'מאשר', 'הוא', 'היא', 'בן_זוג', 'בעל', 'אישה',
    'ילד', 'ילדה', 'ילדים', 'ילדות', 'ילדיי', 'ילדי', 'אפוטרופוס', 'אפוטרופוסית', 'אפוטרופוסים'
  ];
  
  // בדיקה אם המשתנה מכיל מילים רגישות למגדר
  const genderKeywords = ['ילד', 'אפוטרופוס', 'בן', 'בת', 'הוא', 'היא', 'רשאי', 'אחראי', 'מחויב', 'יכול', 'צריך', 'חייב', 'זכאי', 'שם', 'זוג', 'ילדיי', 'ילדי'];
  const containsGenderKeyword = genderKeywords.some(keyword => variable.toLowerCase().includes(keyword.toLowerCase()));
  
  // בדיקה אם המשתנה מכיל דפוסי מגדר (כמו "בן/בת")
  const hasGenderPattern = /בן\/בת|הוא\/היא|יוכל\/תוכל|ירצה\/תרצה|רשאי\/ת|מתחייב\/ת/.test(variable);
  
  // בדיקה אם המשתנה מכיל "ילדיי" או "ילדי" (גם אם לא מופיע כמילה נפרדת)
  const hasChildrenReference = /ילדיי|ילדי/.test(variable);
  
  // בדיקה ספציפית למשתני אפוטרופוס
  if (variable.includes('אפוטרופוס') || variable.includes('אפוטרופסית') || variable.toLowerCase().includes('guardian')) {
    return true;
  }
  
  // בדיקה אם המשתנה מכיל שם של אדם (כמו "ירון בן שי")
  // דפוס: שם פרטי + "בן" + שם משפחה או שם פרטי + "בת" + שם משפחה
  const namePattern = /^[א-ת]+\s+(בן|בת)\s+[א-ת]+$/;
  if (namePattern.test(variable)) {
    return true;
  }
  
  return genderRelevantVariables.includes(variable) || containsGenderKeyword || hasGenderPattern || hasChildrenReference;
}

function getVariableLabel(variable: string): string {
  const labels: Record<string, string> = {
    'heir_name': 'שם היורש/ת',
    'business_name': 'שם העסק',
    'property_address': 'כתובת הנכס',
    'amount': 'סכום',
    'percentage': 'אחוז',
    'guardian_name': 'שם האפוטרופוס/ית',
    'guardian_id': 'ת.ז. האפוטרופוס/ית',
    'guardian_address': 'כתובת האפוטרופוס/ית',
    'alternate_guardian': 'שם האפוטרופוס/ית החלופי/ת',
    'child_name': 'שם הילד/ה',
    'children_in_business': 'ילדים המעורבים בעסק',
    'manager_name': 'שם המנהל/ת',
    'trustee_name': 'שם המנהל/ת הנאמן/ה',
    'trustee_id': 'ת.ז. המנהל/ת הנאמן/ה',
    'trustee_gender': 'זכר', // יוחלף בהמשך לפי המגדר הנבחר
    'accountant_name': 'שם רואה החשבון',
    'accountant_gender': 'זכר', // יוחלף בהמשך לפי המגדר הנבחר
    'age': 'גיל',
    'minor_children': 'ילדים קטינים',
    'spouse_name': 'שם בן/בת הזוג',
    'alternative_heirs': 'יורשים חלופיים',
    'digital_asset': 'נכס דיגיטלי',
    'burial_place': 'מקום קבורה',
    'pension_fund': 'קרן פנסיה',
    'residence_address': 'כתובת מגורים',
    'mortgage_amount': 'סכום משכנתא',
    'distribution_stage': 'שלב חלוקה',
    'business_instructions': 'הוראות עסק',
    'date': 'תאריך',
    'name': 'שם',
    'address': 'כתובת',
    'phone': 'טלפון',
    'email': 'אימייל'
  };
  
  return labels[variable] || variable;
}
