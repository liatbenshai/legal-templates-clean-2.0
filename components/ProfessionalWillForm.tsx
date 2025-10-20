'use client';

import { useState, useEffect } from 'react';
import GenderSelector from './GenderSelector';
import ProfessionalWordExporter from './ProfessionalWordExporter';
import type { Gender } from '@/lib/hebrew-gender';
import { replaceTextWithGender } from '@/lib/hebrew-gender';
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
  const [customSections, setCustomSections] = useState<Array<{
    id: string;
    title: string;
    content: string;
    level: 'main' | 'sub' | 'sub-sub';
    parentId?: string;
    order: number;
    type?: 'text' | 'property' | 'heirs' | 'bank-account';
    tableData?: any;
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
      genders: {}
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
    const sortedSections = [...customSections].sort((a, b) => a.order - b.order);
    const mainSections = sortedSections.filter(s => s.level === 'main');
    const subSections = sortedSections.filter(s => s.level === 'sub' && s.parentId === section.parentId);
    const subSubSections = sortedSections.filter(s => s.level === 'sub-sub' && s.parentId === section.parentId);
    
    if (section.level === 'main') {
      const mainIndex = mainSections.findIndex(s => s.id === section.id);
      return (mainIndex + 1).toString();
    } else if (section.level === 'sub') {
      const mainIndex = mainSections.findIndex(s => s.id === section.parentId);
      const subIndex = subSections.findIndex(s => s.id === section.id);
      return `${mainIndex + 1}.${subIndex + 1}`;
    } else if (section.level === 'sub-sub') {
      const mainIndex = mainSections.findIndex(s => s.id === section.parentId);
      const subSubIndex = subSubSections.findIndex(s => s.id === section.id);
      return `${mainIndex + 1}.${subSubIndex + 1}`;
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
  }>({
    isOpen: false,
    variables: [],
    values: {},
    genders: {}
  });

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

  const handleAddSectionWithTable = () => {
    if (!addSectionWithTableModal.title.trim()) return;
    
    const newSection = {
      id: generateSectionId(),
      title: addSectionWithTableModal.title.trim(),
      content: addSectionWithTableModal.content.trim(),
      level: 'main' as const,
      order: getNextOrder(),
      type: addSectionWithTableModal.type,
      tableData: addSectionWithTableModal.tableData
    };
    
    setCustomSections(prev => [...prev, newSection]);
    closeAddSectionWithTableModal();
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
        id: generateSectionId(),
        title: warehouseSection.title,
        content: genderedContent,
        level: 'main' as const,
        order: getNextOrder()
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
                onChange={(gender) => {
                  setTestator(prev => ({ ...prev, gender }));
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
                צוואתי זו תחול על כלל רכושי מכל מין וסוג שהוא, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים. מבלי לגרוע מכלליות האמור לעיל, צוואתי זו תחול גם על כספים, תוכניות חיסכון, קרנות נאמנות, ניירות ערך, תביעות, פנסיות, תגמולים, ביטוחי חיים, קצבאות, בין אם מופקדים בבנק ובין אם בידי כל גורם אחר, וכן על זכויות אחרות מכל סוג שהוא, וכל רכוש אחר בין במיטלטלין ובין במקרקעין (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או יגיעו לידי בעתיד (להלן: "העיזבון"), לרבות:
              </div>
            </div>

            {/* סעיפים מותאמים אישית - כאן! */}
            {customSections.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-300">
                <h3 className="font-semibold text-green-800 mb-3">סעיפים מותאמים אישית</h3>
                <div className="space-y-3">
                  {customSections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                    <div key={section.id} className={`bg-white p-3 rounded-lg border ${
                      section.level === 'main' ? 'border-green-400' : 
                      section.level === 'sub' ? 'border-blue-400' : 'border-purple-400'
                    } ${section.level === 'sub' ? 'ml-4' : section.level === 'sub-sub' ? 'ml-8' : ''}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {getSectionNumber(section)}
                          </span>
                          <h4 className="font-medium text-green-800">
                            {section.title || `סעיף מותאם`}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            section.level === 'main' ? 'bg-green-100 text-green-700' : 
                            section.level === 'sub' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {section.level === 'main' ? 'ראשי' : section.level === 'sub' ? 'תת-סעיף' : 'תת-תת-סעיף'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
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
                          
                          {/* כפתורי הזזה */}
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveSectionUp(section.id)}
                              className="p-1 rounded text-green-600 hover:text-green-800 hover:bg-green-50"
                              title="הזז למעלה"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveSectionDown(section.id)}
                              className="p-1 rounded text-green-600 hover:text-green-800 hover:bg-green-50"
                              title="הזז למטה"
                            >
                              ↓
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
                          </div>
                          
                          {/* כפתור מחיקה */}
                          <button
                            onClick={() => setCustomSections(prev => prev.filter(s => s.id !== section.id))}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* סעיף 4 - מקרה פטירת יורש */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">סעיף 4 - מקרה פטירת יורש</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.
              </div>
            </div>

            {/* סעיף 5 - סעיף שיתוף פעולה */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">סעיף 5 - סעיף שיתוף פעולה</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                הנני מצווה, כי ביצוע וקיום צוואה זו יהא ברוח טובה בשיתוף פעולה הדדי בין היורשים.
              </div>
            </div>

            {/* סעיף 6 - הצהרה חתימה סופית */}
            <div className="bg-white p-4 rounded-lg border border-blue-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">סעיף 6 - הצהרה חתימה סופית</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">קבוע</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                ולראיה באתי על החתום מרצוני הטוב והחופשי, בהיותי בדעה צלולה ולאחר שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר שהצהרתי בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתי.
              </div>
            </div>

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
              <span className="text-lg">📝</span>
              הוספת סעיפים מותאמים אישית
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  const title = prompt('כותרת הסעיף:');
                  const content = prompt('תוכן הסעיף:');
                  if (title && content) {
                    handleAddSection(title, content);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + הוסף סעיף טקסט
              </button>
              <button
                onClick={() => openAddSectionWithTableModal('property')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                + הוסף סעיף נכס
              </button>
              <button
                onClick={() => handleLoadTemplate()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              >
                📋 טען תבנית
              </button>
              <button
                onClick={() => openAddSectionWithTableModal('heirs')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                + הוסף סעיף יורשים
              </button>
              <button
                onClick={() => openAddSectionWithTableModal('bank-account')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                + הוסף סעיף חשבון בנק
              </button>
              <button
                onClick={openAddVariableModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + הוסף משתנה
              </button>
              <button
                onClick={openVariablesCompletionModal}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                🔧 השלם משתנים
              </button>
              <button
                onClick={openAddSectionModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                💾 שמור למחסן
              </button>
            </div>
          </div>
          
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
      {variablesCompletionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                🔧 השלם משתנים
              </h3>
              <button
                onClick={() => setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {} })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
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
                onClick={() => setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {} })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  // החלפת משתנים בטקסט עם התחשבות במגדר
                  let updatedText = customSections.map(section => {
                    let content = section.content;
                    
                    // שלב 1: החלף משתנים
                    variablesCompletionModal.variables.forEach(variable => {
                      const value = variablesCompletionModal.values[variable];
                      const gender = variablesCompletionModal.genders[variable];
                      
                      if (value) {
                        // החלף את המשתנה בערך (ללא התאמת מגדר)
                        content = content.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), value);
                      }
                    });
                    
                    // שלב 2: החלף את כל התוכן לפי מגדר (לטפל בדפוסים כמו "הוא יליד/ת")
                    // אם יש משתנים רגישי מגדר, נחליף את כל הטקסט לפי המגדר הראשון שנבחר
                    const firstGenderVariable = variablesCompletionModal.variables.find(v => isGenderRelevantVariable(v));
                    if (firstGenderVariable && variablesCompletionModal.genders[firstGenderVariable]) {
                      const gender = variablesCompletionModal.genders[firstGenderVariable];
                      content = replaceTextWithGender(content, gender);
                    }
                    
                    return { ...section, content };
                  });
                  
                  setCustomSections(updatedText);
                  setVariablesCompletionModal({ isOpen: false, variables: [], values: {}, genders: {} });
                  alert('✅ משתנים הוחלפו בהצלחה!');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                החלף משתנים
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
    // משתנים בעברית
    'בן/בת זוגי', 'שם מלא', 'שם ילד/ה ראשון/ה', 'שם ילד/ה שני/ה', 'שם ילד/ה שלישי/ת',
    'הוא/היא', 'תאריך', 'תעודת זהות', 'שם מלא האפוטרופוס', 'שם מלא האפוטרופוס החלופי',
    'מיופה_כוח', 'רשאי', 'אחראי', 'מחויב', 'יכול', 'צריך', 'חייב', 'זכאי', 
    'מתחייב', 'מסכים', 'מבקש', 'מצהיר', 'מאשר', 'הוא', 'היא', 'בן_זוג', 'בעל', 'אישה',
    'ילד', 'ילדה', 'ילדים', 'ילדות', 'אפוטרופוס', 'אפוטרופוסית', 'אפוטרופוסים'
  ];
  
  // בדיקה אם המשתנה מכיל מילים רגישות למגדר
  const genderKeywords = ['ילד', 'אפוטרופוס', 'בן', 'בת', 'הוא', 'היא', 'רשאי', 'אחראי', 'מחויב', 'יכול', 'צריך', 'חייב', 'זכאי'];
  const containsGenderKeyword = genderKeywords.some(keyword => variable.includes(keyword));
  
  return genderRelevantVariables.includes(variable) || containsGenderKeyword;
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
