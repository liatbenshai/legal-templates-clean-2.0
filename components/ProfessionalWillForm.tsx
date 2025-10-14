'use client';

import { useState, useEffect } from 'react';
// Icons replaced with emojis for compatibility
import GenderSelector from './GenderSelector';
import ProfessionalWordExporter from './ProfessionalWordExporter';
import SectionsWarehouse from './SectionsWarehouse';
import type { Gender } from '@/lib/hebrew-gender';
import { generateProfessionalWillContent } from '@/lib/professional-will-texts';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import EditableSection from './LearningSystem/EditableSection';
import WarehouseManager from './LearningSystem/WarehouseManager';
import AILearningManager from './AILearningManager';
import UnifiedWarehouse from './UnifiedWarehouse';

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
  gender: 'male' | 'female'; // מגדר היורש/ת
}

interface Witness {
  name: string;
  id: string;
  address: string;
  gender: 'male' | 'female'; // מגדר העד/העדה
}

interface ProfessionalWillFormProps {
  defaultWillType?: 'individual' | 'mutual';
}

export default function ProfessionalWillForm({ defaultWillType = 'individual' }: ProfessionalWillFormProps = {}) {
  const [willType, setWillType] = useState<'individual' | 'mutual'>(defaultWillType);
  
  // פרטי מצווה ראשי
  const [testator, setTestator] = useState({
    fullName: '',
    shortName: '',
    id: '',
    address: '',
    gender: 'male' as Gender
  });

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
      gender: 'male' // ברירת מחדל
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
      gender: 'male' // ברירת מחדל
    },
    {
      name: '',
      id: '',
      address: '',
      gender: 'male' // ברירת מחדל
    }
  ]);

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
  const [customSections, setCustomSections] = useState<Array<{title: string, content: string}>>([]);
  const [heirsDisplayMode, setHeirsDisplayMode] = useState<'table' | 'list'>('list');
  
  // אפוטרופוס לקטינים (רלוונטי לצוואה הדדית)
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

  // מערכת למידה
  const [showLearningSystem, setShowLearningSystem] = useState(false);
  const [editableSections, setEditableSections] = useState<EditableSectionType[]>([]);
  const [learningMode, setLearningMode] = useState<'edit' | 'warehouse'>('edit');
  
  // פונקציה לחילוץ משתנים מתוכן
  const extractVariablesFromContent = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))] : [];
  };

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
      gender: 'male' // ברירת מחדל
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
      gender: 'male' // ברירת מחדל
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
    customSections, // הוספת הסעיפים מהמחסן!
    guardian: guardian.name ? guardian : undefined, // אפוטרופוס אם מולא
    guardianGender: guardian.gender // מגדר האפוטרופוס
  });

  // פונקציות מערכת הלמידה
  const convertToEditableSections = () => {
    const sections: EditableSectionType[] = [];
    
    // הוספת סעיפים מ-customSections
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
    
    // הוספת הוראות מיוחדות
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
    
    // הוספת הוראות רכב
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

  const handleUpdateEditableSection = (updatedSection: EditableSectionType) => {
    setEditableSections(prev => 
      prev.map(section => 
        section.id === updatedSection.id 
          ? { ...updatedSection, lastModified: new Date().toISOString() }
          : section
      )
    );
    
    // עדכון גם ב-customSections או הוראות מיוחדות
    if (updatedSection.id.startsWith('custom-')) {
      const index = parseInt(updatedSection.id.split('-')[1]);
      setCustomSections(prev => 
        prev.map((section, i) => 
          i === index ? { ...section, content: updatedSection.content } : section
        )
      );
    } else if (updatedSection.id === 'special-instructions') {
      setSpecialInstructions(updatedSection.content);
    } else if (updatedSection.id === 'vehicle-instructions') {
      setVehicleInstructions(updatedSection.content);
    }
  };

  const handleSaveToWarehouse = (section: EditableSectionType) => {
    const action = {
      type: 'save_to_warehouse' as const,
      sectionId: section.id,
      newContent: section.content,
      userId: testator.fullName || 'anonymous',
      timestamp: new Date().toISOString()
    };
    
    const warehouseSection = {
      id: section.id,
      title: section.title,
      content: section.content,
      category: section.category,
      tags: ['צוואה', 'סעיף מותאם אישית'],
      usageCount: 0,
      averageRating: 0,
      isPublic: false,
      createdBy: testator.fullName || 'anonymous',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    
    learningEngine.saveToWarehouse(action, warehouseSection);
    alert('סעיף נשמר למחסן האישי!');
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

  const handleSelectFromWarehouse = (warehouseSection: any) => {
    // החלף מגדור בטקסט לפי מגדר המצווה
    const { replaceTextWithGender } = require('@/lib/hebrew-gender');
    const genderedContent = replaceTextWithGender(
      warehouseSection.content,
      willType === 'mutual' ? 'plural' : testator.gender
    );
    
    // חלץ משתנים מהתוכן
    const variables = extractVariablesFromContent(genderedContent);
    
    // אם יש משתנים, פתח חלון למילוי
    if (variables.length > 0) {
      setVariablesModal({
        section: {
          id: warehouseSection.id || 'custom',
          title: warehouseSection.title,
          content: genderedContent,
          variables: variables
        },
        values: variables.reduce((acc, v) => ({ ...acc, [v]: '' }), {}),
        genders: variables.reduce((acc, v) => ({ ...acc, [v]: 'male' as 'male' | 'female' }), {})
      });
    } else {
      // אם אין משתנים, הוסף ישירות
      const newSection = {
        title: warehouseSection.title,
        content: genderedContent
      };
      setCustomSections(prev => [...prev, newSection]);
      alert('סעיף נוסף מהמחסן!');
    }
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

        {/* פרטי המצווה */}
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
                onChange={(gender) => setTestator(prev => ({ ...prev, gender }))}
                label="מגדר"
                size="medium"
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

        {/* פרטי בן/בת זוג */}
        {willType === 'mutual' && (
          <section className="bg-pink-50 p-6 rounded-lg border border-pink-200">
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

            <div className="grid md:grid-cols-2 gap-4">
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
                  onChange={(gender) => setSpouse(prev => ({ ...prev, gender }))}
                  label="מגדר בן/בת זוג"
                  size="medium"
                />
              </div>
            </div>
          </section>
        )}

        {/* נכסי מקרקעין */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">🏢</span>
              נכסי מקרקעין
            </h2>
            <button
              onClick={addProperty}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              <span className="text-lg">➕</span>
              הוסף נכס
            </button>
          </div>

          <div className="space-y-4">
            {properties.map((property, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-green-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">נכס {index + 1}</h3>
                  {properties.length > 1 && (
                    <button
                      onClick={() => removeProperty(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="text-lg">❌</span>
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={property.name}
                    onChange={(e) => {
                      const newProperties = [...properties];
                      newProperties[index].name = e.target.value;
                      setProperties(newProperties);
                    }}
                    placeholder="שם הנכס (דירת מגורים, דירת השקעה...)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    dir="rtl"
                  />
                  
                  <input
                    type="text"
                    value={property.city}
                    onChange={(e) => {
                      const newProperties = [...properties];
                      newProperties[index].city = e.target.value;
                      setProperties(newProperties);
                    }}
                    placeholder="עיר"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    dir="rtl"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={property.address}
                    onChange={(e) => {
                      const newProperties = [...properties];
                      newProperties[index].address = e.target.value;
                      setProperties(newProperties);
                    }}
                    placeholder="כתובת מלאה (רחוב, מספר, דירה)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={property.block}
                    onChange={(e) => {
                      const newProperties = [...properties];
                      newProperties[index].block = e.target.value;
                      setProperties(newProperties);
                    }}
                    placeholder="גוש"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    dir="ltr"
                  />
                  
                  <input
                    type="text"
                    value={property.plot}
                    onChange={(e) => {
                      const newProperties = [...properties];
                      newProperties[index].plot = e.target.value;
                      setProperties(newProperties);
                    }}
                    placeholder="חלקה"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    dir="ltr"
                  />
                  
                  <input
                    type="text"
                    value={property.subPlot}
                    onChange={(e) => {
                      const newProperties = [...properties];
                      newProperties[index].subPlot = e.target.value;
                      setProperties(newProperties);
                    }}
                    placeholder="תת חלקה"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    dir="ltr"
                  />
                </div>

                {willType === 'mutual' && (
                  <input
                    type="text"
                    value={property.ownership || ''}
                    onChange={(e) => {
                      const newProperties = [...properties];
                      newProperties[index].ownership = e.target.value;
                      setProperties(newProperties);
                    }}
                    placeholder="אחוז בעלות (50%, 100%...)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    dir="rtl"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* חשבונות בנק */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">💳</span>
              חשבונות בנק
            </h2>
            <button
              onClick={addBankAccount}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <span className="text-lg">➕</span>
              הוסף חשבון
            </button>
          </div>

          <div className="space-y-4">
            {bankAccounts.map((account, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-blue-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">חשבון {index + 1}</h3>
                  {bankAccounts.length > 1 && (
                    <button
                      onClick={() => removeBankAccount(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="text-lg">❌</span>
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={account.bank}
                    onChange={(e) => {
                      const newAccounts = [...bankAccounts];
                      newAccounts[index].bank = e.target.value;
                      setBankAccounts(newAccounts);
                    }}
                    placeholder="שם הבנק"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                  
                  <input
                    type="text"
                    value={account.location}
                    onChange={(e) => {
                      const newAccounts = [...bankAccounts];
                      newAccounts[index].location = e.target.value;
                      setBankAccounts(newAccounts);
                    }}
                    placeholder="עיר הסניף"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <input
                    type="text"
                    value={account.bankNumber}
                    onChange={(e) => {
                      const newAccounts = [...bankAccounts];
                      newAccounts[index].bankNumber = e.target.value;
                      setBankAccounts(newAccounts);
                    }}
                    placeholder="מספר בנק"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    dir="ltr"
                  />
                  
                  <input
                    type="text"
                    value={account.branch}
                    onChange={(e) => {
                      const newAccounts = [...bankAccounts];
                      newAccounts[index].branch = e.target.value;
                      setBankAccounts(newAccounts);
                    }}
                    placeholder="מספר סניף"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    dir="ltr"
                  />
                  
                  <input
                    type="text"
                    value={account.accountNumber}
                    onChange={(e) => {
                      const newAccounts = [...bankAccounts];
                      newAccounts[index].accountNumber = e.target.value;
                      setBankAccounts(newAccounts);
                    }}
                    placeholder="מספר חשבון"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* יורשים */}
        <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">👥</span>
              יורשים
            </h2>
            <button
              onClick={addHeir}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
            >
              <span className="text-lg">➕</span>
              הוסף יורש
            </button>
          </div>

          {/* בחירת תצוגה */}
          <div className="bg-white border border-yellow-300 rounded-lg p-4 mb-4">
            <div className="text-sm font-medium text-gray-700 mb-3">תצוגת יורשים בצוואה:</div>
            <div className="flex gap-3">
              <button
                onClick={() => setHeirsDisplayMode('list')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                  heirsDisplayMode === 'list'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-900 font-bold'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-yellow-300'
                }`}
              >
                <div className="text-lg mb-1">📝</div>
                <div className="font-semibold">רשימה מפורטת</div>
                <div className="text-xs mt-1">
                  1. שם יורש, ת.ז 123..., בן, 50%
                </div>
              </button>
              
              <button
                onClick={() => setHeirsDisplayMode('table')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                  heirsDisplayMode === 'table'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-900 font-bold'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-yellow-300'
                }`}
              >
                <div className="text-lg mb-1">📊</div>
                <div className="font-semibold">טבלה מסודרת</div>
                <div className="text-xs mt-1">
                  | שם | ת.ז | קרבה | חלק |
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {heirs.map((heir, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-yellow-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">יורש {index + 1}</h3>
                  {heirs.length > 1 && (
                    <button
                      onClick={() => removeHeir(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="text-lg">❌</span>
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={heir.firstName}
                    onChange={(e) => {
                      const newHeirs = [...heirs];
                      newHeirs[index].firstName = e.target.value;
                      setHeirs(newHeirs);
                    }}
                    placeholder="שם פרטי"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="rtl"
                  />
                  
                  <input
                    type="text"
                    value={heir.lastName}
                    onChange={(e) => {
                      const newHeirs = [...heirs];
                      newHeirs[index].lastName = e.target.value;
                      setHeirs(newHeirs);
                    }}
                    placeholder="שם משפחה"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="rtl"
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={heir.id}
                    onChange={(e) => {
                      const newHeirs = [...heirs];
                      newHeirs[index].id = e.target.value;
                      setHeirs(newHeirs);
                    }}
                    placeholder="תעודת זהות"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="ltr"
                    maxLength={9}
                  />
                  
                  {/* בחירת מגדר */}
                  <select
                    value={heir.gender}
                    onChange={(e) => {
                      const newHeirs = [...heirs];
                      newHeirs[index].gender = e.target.value as 'male' | 'female';
                      setHeirs(newHeirs);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="male">זכר</option>
                    <option value="female">נקבה</option>
                  </select>
                  
                  <select
                    value={heir.relation}
                    onChange={(e) => {
                      const newHeirs = [...heirs];
                      newHeirs[index].relation = e.target.value;
                      setHeirs(newHeirs);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">קרבת משפחה</option>
                    <option value="בן">בן</option>
                    <option value="בת">בת</option>
                    <option value="אח">אח</option>
                    <option value="אחות">אחות</option>
                    <option value="נכד">נכד</option>
                    <option value="נכדה">נכדה</option>
                    <option value="בן דוד">בן דוד</option>
                    <option value="אחר">אחר</option>
                  </select>
                  
                  <input
                    type="text"
                    value={heir.share}
                    onChange={(e) => {
                      const newHeirs = [...heirs];
                      newHeirs[index].share = e.target.value;
                      setHeirs(newHeirs);
                    }}
                    placeholder="חלק (1/3, 50%, שליש...)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="rtl"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* עדים */}
        <section className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">📄</span>
              עדים לצוואה
            </h2>
            {witnesses.length < 3 && (
              <button
                onClick={addWitness}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                <span className="text-lg">➕</span>
                הוסף עד
              </button>
            )}
          </div>

          <div className="space-y-4">
            {witnesses.map((witness, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-purple-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">עד {index + 1}</h3>
                  {witnesses.length > 2 && (
                    <button
                      onClick={() => removeWitness(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="text-lg">❌</span>
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={witness.name}
                    onChange={(e) => {
                      const newWitnesses = [...witnesses];
                      newWitnesses[index].name = e.target.value;
                      setWitnesses(newWitnesses);
                    }}
                    placeholder="שם מלא"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    dir="rtl"
                  />
                  
                  {/* בחירת מגדר */}
                  <select
                    value={witness.gender}
                    onChange={(e) => {
                      const newWitnesses = [...witnesses];
                      newWitnesses[index].gender = e.target.value as 'male' | 'female';
                      setWitnesses(newWitnesses);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="male">זכר</option>
                    <option value="female">נקבה</option>
                  </select>
                  
                  <input
                    type="text"
                    value={witness.id}
                    onChange={(e) => {
                      const newWitnesses = [...witnesses];
                      newWitnesses[index].id = e.target.value;
                      setWitnesses(newWitnesses);
                    }}
                    placeholder="תעודת זהות"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    dir="ltr"
                    maxLength={9}
                  />
                </div>

                <input
                  type="text"
                  value={witness.address}
                  onChange={(e) => {
                    const newWitnesses = [...witnesses];
                    newWitnesses[index].address = e.target.value;
                    setWitnesses(newWitnesses);
                  }}
                  placeholder="כתובת מלאה"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  dir="rtl"
                />
              </div>
            ))}
          </div>
        </section>

        {/* פרטי חתימה */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">📅</span>
            פרטי חתימה
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={willDate.day}
              onChange={(e) => setWillDate(prev => ({ ...prev, day: e.target.value }))}
              placeholder="יום"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={willDate.month}
              onChange={(e) => setWillDate(prev => ({ ...prev, month: e.target.value }))}
              placeholder="חודש"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={willDate.year}
              onChange={(e) => setWillDate(prev => ({ ...prev, year: e.target.value }))}
              placeholder="שנה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={willDate.city}
              onChange={(e) => setWillDate(prev => ({ ...prev, city: e.target.value }))}
              placeholder="עיר החתימה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              value={lawyerName}
              onChange={(e) => setLawyerName(e.target.value)}
              placeholder="שם עורך הדין (אופציונלי)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={copyNumber}
              onChange={(e) => setCopyNumber(e.target.value)}
              placeholder="מספר עותק"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="ltr"
            />
            
            <input
              type="text"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              placeholder="סך העותקים"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
              dir="ltr"
            />
          </div>
        </section>

        {/* מחסן סעיפים מאוחד */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">📚</span>
              מחסן הסעיפים שלי
            </h2>
            <button
              onClick={() => {
                convertToEditableSections();
                setShowLearningSystem(!showLearningSystem);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <span className="text-white">🧠</span>
              {showLearningSystem ? 'הסתר מערכת למידה' : 'מערכת למידה'}
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-900 font-medium">
              🎯 מחסן מאוחד עם קטגוריות: כספים, אישי, עסקים, בריאות, בני זוג ועוד
            </p>
          </div>
          
          <UnifiedWarehouse
            onSectionSelect={handleSelectFromWarehouse}
            userId={testator.fullName || 'anonymous'}
            willType={willType}
          />
        </section>

        {/* סעיפים שנוספו */}
        {customSections.length > 0 && (
          <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">סעיפים שנוספו מהמחסן</h2>
            
            <div className="space-y-3">
              {customSections.map((section, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-yellow-300">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <button
                      onClick={() => setCustomSections(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="text-lg">❌</span>
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-700 max-h-24 overflow-y-auto whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


        {/* מערכת למידה */}
        {showLearningSystem && (
          <section className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-purple-600 text-lg">🧠</span>
                מערכת למידה חכמה
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setLearningMode('edit')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    learningMode === 'edit'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-purple-600 border border-purple-300'
                  }`}
                >
                  עריכת סעיפים
                </button>
                <button
                  onClick={() => setLearningMode('warehouse')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    learningMode === 'warehouse'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-purple-600 border border-purple-300'
                  }`}
                >
                  ניהול מחסן
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-900 font-medium">
                🎯 מערכת למידה חכמה שמשפרת את הצוואות שלך עם AI ולומדת מהתיקונים שלך
              </p>
            </div>

            {/* עריכת סעיפים */}
            {learningMode === 'edit' && (
              <div className="space-y-4">
                {editableSections.length > 0 ? (
                  editableSections.map((section) => (
                    <EditableSection
                      key={section.id}
                      section={section}
                      onUpdate={handleUpdateEditableSection}
                      onSaveToWarehouse={handleSaveToWarehouse}
                      onSaveToLearning={handleSaveToLearning}
                      userId={testator.fullName || 'anonymous'}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-2">אין סעיפים לעריכה כרגע</p>
                    <p className="text-sm">הוסף הוראות מיוחדות או סעיפים מהמחסן כדי להתחיל</p>
                  </div>
                )}
              </div>
            )}

            {/* ניהול מחסן מאוחד */}
            {learningMode === 'warehouse' && (
              <UnifiedWarehouse
                onSectionSelect={handleSelectFromWarehouse}
                userId={testator.fullName || 'anonymous'}
                willType={willType}
              />
            )}

            {/* ניהול למידה */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-purple-300">
              <AILearningManager />
            </div>
          </section>
        )}

        {/* אפוטרופוס לקטינים - רק בצוואה הדדית */}
        {willType === 'mutual' && (
          <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">👨‍👩‍👧‍👦</span>
              אפוטרופוס לקטינים (אופציונלי)
            </h2>
            
            <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-3 mb-4">
              <p className="text-sm text-indigo-900">
                💡 אם יש לכם ילדים קטינים (מתחת לגיל 18), מומלץ למנות אפוטרופוס שידאג להם במקרה ששניכם תלכו לעולמכם.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  value={guardian.name}
                  onChange={(e) => setGuardian(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="שם פרטי ושם משפחה"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תעודת זהות</label>
                <input
                  type="text"
                  value={guardian.id}
                  onChange={(e) => setGuardian(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="123456789"
                  maxLength={9}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">כתובת מלאה</label>
                <input
                  type="text"
                  value={guardian.address}
                  onChange={(e) => setGuardian(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="רחוב, מספר, עיר"
                  dir="rtl"
                />
              </div>
              
              <div>
                <GenderSelector
                  value={guardian.gender}
                  onChange={(gender) => setGuardian(prev => ({ ...prev, gender }))}
                  label="מגדר האפוטרופוס"
                  size="medium"
                />
              </div>
            </div>
          </section>
        )}

        {/* הוראות מיוחדות */}
        <section className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">הוראות מיוחדות נוספות</h2>
          
          <div className="space-y-4">
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="הוראות מיוחדות, משאלות אישיות, הנחיות לביצוע..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={4}
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
            
            <textarea
              value={vehicleInstructions}
              onChange={(e) => setVehicleInstructions(e.target.value)}
              placeholder="הוראות לגבי רכב (מכירה, העברה, חלוקה...)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={2}
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
          </div>
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

      {/* חלון מילוי משתנים */}
      {variablesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              השלמת פרטים לסעיף: {variablesModal.section.title}
            </h3>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p className="font-semibold mb-1">💡 טיפ:</p>
              <p>למשתנים של אנשים (שמות) יש אפשרות לבחור מגדר. זה יעזור להציג את הטקסט הנכון (זכר/נקבה) בצוואה.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {variablesModal.section.variables.map((variable) => (
                <div key={variable} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {getVariableLabel(variable)}:
                  </label>
                  <input
                    type="text"
                    value={variablesModal.values[variable] || ''}
                    onChange={(e) => {
                      setVariablesModal(prev => ({
                        ...prev!,
                        values: {
                          ...prev!.values,
                          [variable]: e.target.value
                        }
                      }));
                    }}
                    placeholder={`הזן ${getVariableLabel(variable)}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    dir="rtl"
                  />
                  
                  {/* בחירת מגדר למשתנים רלוונטיים */}
                  {isGenderRelevantVariable(variable) && (
                    <div className="flex gap-4 items-center">
                      <label className="text-sm text-gray-600">מגדר:</label>
                      <div className="flex gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`gender_${variable}`}
                            value="male"
                            checked={variablesModal.genders[variable] === 'male'}
                            onChange={(e) => {
                              setVariablesModal(prev => ({
                                ...prev!,
                                genders: {
                                  ...prev!.genders,
                                  [variable]: e.target.value as 'male' | 'female'
                                }
                              }));
                            }}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm">זכר</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`gender_${variable}`}
                            value="female"
                            checked={variablesModal.genders[variable] === 'female'}
                            onChange={(e) => {
                              setVariablesModal(prev => ({
                                ...prev!,
                                genders: {
                                  ...prev!.genders,
                                  [variable]: e.target.value as 'male' | 'female'
                                }
                              }));
                            }}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm">נקבה</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setVariablesModal(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  // החלפת משתנים בתוכן עם התחשבות במגדר
                  let finalContent = variablesModal.section.content;
                  Object.keys(variablesModal.values).forEach(key => {
                    const value = variablesModal.values[key];
                    let replacedValue = value;
                    
                    // אם זה משתנה שדורש מגדר, החלף את הטקסט בהתאם
                    if (isGenderRelevantVariable(key) && variablesModal.genders[key]) {
                      const { replaceTextWithGender } = require('@/lib/hebrew-gender');
                      replacedValue = replaceTextWithGender(value, variablesModal.genders[key]);
                    }
                    
                    finalContent = finalContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), replacedValue);
                  });

                  // הוספה לסעיפים מותאמים
                  setCustomSections(prev => [...prev, {
                    title: `${variablesModal.section.id}: ${variablesModal.section.title}`,
                    content: finalContent
                  }]);

                  setVariablesModal(null);
                }}
                disabled={!Object.values(variablesModal.values).every(v => v.trim() !== '')}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
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

// פונקציה לקביעת אם משתנה דורש בחירת מגדר
function isGenderRelevantVariable(variable: string): boolean {
  const genderRelevantVariables = [
    'heir_name', 'guardian_name', 'alternate_guardian', 'child_name', 
    'manager_name', 'trustee_name', 'spouse_name'
  ];
  return genderRelevantVariables.includes(variable);
}

// פונקציה לקבלת תווית ידידותית למשתנה
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
