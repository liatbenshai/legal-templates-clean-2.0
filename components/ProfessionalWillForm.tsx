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
import { useDocuments } from '@/lib/useDocuments'; // ← הוסף את זה

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
          setAdditionalSections(prev => [...prev, {
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
      const result = await saveSection(
        'will',
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
