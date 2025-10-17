'use client';

import { useState, useEffect } from 'react';
import GenderSelector from './GenderSelector';
import ProfessionalWordExporter from './ProfessionalWordExporter';
import type { Gender } from '@/lib/hebrew-gender';
import { generateProfessionalWillContent } from '@/lib/professional-will-texts';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import EditableSection from './LearningSystem/EditableSection';
import WarehouseManager from './LearningSystem/WarehouseManager';
import AILearningManager from './AILearningManager';
import UnifiedWarehouse from './UnifiedWarehouse';
import { useDocuments } from '@/lib/useDocuments';
import { useWarehouse } from '@/lib/hooks/useWarehouse';

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
            title: 'סעיף משופר מ-AI',
            content: data.content
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
  const [showFullWill, setShowFullWill] = useState(false);
  
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

  // מערכת למידה
  const [showLearningSystem, setShowLearningSystem] = useState(false);
  const [editableSections, setEditableSections] = useState<EditableSectionType[]>([]);
  const [learningMode, setLearningMode] = useState<'edit' | 'warehouse'>('edit');
  
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
  }, []); // טען פעם אחת בלבד
  
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
    // עדכן state locally
    setEditableSections(prev => 
      prev.map(section => 
        section.id === updatedSection.id 
          ? { ...updatedSection, lastModified: new Date().toISOString() }
          : section
      )
    );
    
    // עדכן גם ב-customSections או הוראות מיוחדות
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
    const { replaceTextWithGender } = require('@/lib/hebrew-gender');
    const genderedContent = replaceTextWithGender(
      warehouseSection.content,
      willType === 'mutual' ? 'plural' : testator.gender
    );
    
    const variables = extractVariablesFromContent(genderedContent);
    
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
      const newSection = {
        title: warehouseSection.title,
        content: genderedContent
      };
      setCustomSections(prev => [...prev, newSection]);
      
      // עדכון מונה השימוש במחסן
      try {
        await updateSection(warehouseSection.id, {
          usage_count: (warehouseSection.usage_count || 0) + 1,
          last_used: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating usage count:', error);
      }
      
      alert('✅ סעיף נוסף מהמחסן!');
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
                onChange={(gender) => setTestator(prev => ({ ...prev, gender }))}
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
                  onChange={(gender) => setSpouse(prev => ({ ...prev, gender }))}
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

        {/* סעיפים נוספים */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">📝</span>
              סעיפים נוספים
            </h2>
            <button
              onClick={() => setCustomSections(prev => [...prev, { title: '', content: '' }])}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + הוסף סעיף
            </button>
          </div>
          
          {customSections.map((section, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">סעיף {index + 1}</h3>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        if (index > 0) {
                          setCustomSections(prev => {
                            const newSections = [...prev];
                            [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
                            return newSections;
                          });
                        }
                      }}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
                      title="הזז למעלה"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => {
                        if (index < customSections.length - 1) {
                          setCustomSections(prev => {
                            const newSections = [...prev];
                            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                            return newSections;
                          });
                        }
                      }}
                      disabled={index === customSections.length - 1}
                      className={`p-1 rounded ${index === customSections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
                      title="הזז למטה"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setCustomSections(prev => prev.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️ מחק
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הסעיף</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => setCustomSections(prev => prev.map((s, i) => 
                      i === index ? { ...s, title: e.target.value } : s
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="הוראות מיוחדות לגבי..."
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תוכן הסעיף</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => setCustomSections(prev => prev.map((s, i) => 
                      i === index ? { ...s, content: e.target.value } : s
                    ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="אני מצווה כי..."
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          ))}
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
                onClick={() => {
                  const title = prompt('כותרת הסעיף:');
                  const content = prompt('תוכן הסעיף:');
                  if (title && content) {
                    handleSaveToWarehouse({
                      id: Date.now().toString(),
                      title,
                      content,
                      category: 'custom',
                      serviceType: 'will',
                      isEditable: true,
                      isCustom: true,
                      version: 1,
                      lastModified: new Date().toISOString(),
                      modifiedBy: testator.fullName || 'anonymous'
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ➕ הוסף סעיף למחסן
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
          
          {showWarehouse && (
            <div className="mb-6">
              <UnifiedWarehouse
                onSectionSelect={handleSelectFromWarehouse}
                userId={testator.fullName || 'anonymous'}
                willType={willType}
              />
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

                {/* סעיפים מותאמים אישית */}
                {customSections.map((section, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-green-800">
                        {section.title || `סעיף ${index + 1}`}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            if (index > 0) {
                              setCustomSections(prev => {
                                const newSections = [...prev];
                                [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
                                return newSections;
                              });
                            }
                          }}
                          disabled={index === 0}
                          className={`p-1 rounded text-xs ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:text-green-800 hover:bg-green-50'}`}
                          title="הזז למעלה"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => {
                            if (index < customSections.length - 1) {
                              setCustomSections(prev => {
                                const newSections = [...prev];
                                [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                                return newSections;
                              });
                            }
                          }}
                          disabled={index === customSections.length - 1}
                          className={`p-1 rounded text-xs ${index === customSections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:text-green-800 hover:bg-green-50'}`}
                          title="הזז למטה"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {section.content}
                    </div>
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
    </div>
  );
}

// פונקציות עזר
function isGenderRelevantVariable(variable: string): boolean {
  const genderRelevantVariables = [
    'heir_name', 'guardian_name', 'alternate_guardian', 'child_name', 
    'manager_name', 'trustee_name', 'spouse_name', 'guardian_id', 'guardian_address'
  ];
  return genderRelevantVariables.includes(variable);
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
