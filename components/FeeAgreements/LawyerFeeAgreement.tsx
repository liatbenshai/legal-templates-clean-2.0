'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, Calendar, User, Scale, BookOpen, X, Download, Brain, Plus, Trash2 } from 'lucide-react';
import EditableSection from '../LearningSystem/EditableSection';
import WarehouseManager from '../LearningSystem/WarehouseManager';
import UnifiedWarehouse from '../UnifiedWarehouse';
import { exportFeeAgreementToWord } from './FeeAgreementExporter';
import ProfessionalFeeAgreementExporter from './ProfessionalFeeAgreementExporter';
import { AuthService } from '@/lib/auth';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import feeAgreementTemplates from '@/lib/fee-agreement-templates.json';
import { replaceTextWithGender } from '@/lib/hebrew-gender';
import { useWarehouse } from '@/lib/hooks/useWarehouse';

// פונקציה לעיצוב מספרים עם פסיקים
const formatNumber = (value: string): string => {
  if (!value) return '';
  // הסרת כל התווים שאינם ספרות
  const numStr = value.replace(/[^\d]/g, '');
  if (!numStr) return '';
  // המרה למספר והוספת פסיקים
  return parseInt(numStr).toLocaleString('en-US');
};

// פונקציה להסרת פסיקים ממספר (לשמירה)
const unformatNumber = (value: string): string => {
  return value.replace(/,/g, '');
};

interface ClientData {
  id: string;
  name: string;
  idNumber: string;
  address: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
}

interface FeeAgreementData {
  // פרטי עורך הדין
  lawyer: {
    name: string;
    license: string;
    address: string;
    phone: string;
    email: string;
    gender: 'male' | 'female';
  };
  
  // פרטי לקוחות (מערך)
  clients: ClientData[];

  // פרטי התיק
  case: {
    subject: string;
  };

  // תמחור
  fees: {
    type: 'סכום_כולל' | 'מקדמה_והצלחה' | 'סכום_ואחוזים';
    totalAmount?: string;
    paymentStructure?: string;
    advancePayment?: string;
    successPercentage?: string;
    fixedAmount?: string; // סכום קבוע בתוספת אחוזים
    stages?: string;
  };

  // תנאים
  terms: {
    paymentTerms: string;
    expensesCoverage: string;
    terminationClause: string;
    specialConditions: string;
  };
}

export default function LawyerFeeAgreement() {
  // טעינת פרטי המשתמש המחובר
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Warehouse hook
  const { addSection, updateSection, sections: warehouseSections } = useWarehouse(currentUser?.id || 'anonymous');

  useEffect(() => {
    setMounted(true);
    const loadUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
    
    // בדיקה אם יש טקסט מ-ai-learning
    const savedText = localStorage.getItem('ai-improved-section-fee-agreement');
    if (savedText) {
      try {
        const data = JSON.parse(savedText);
        if (data.content && confirm('📥 נמצא טקסט משופר מעמוד למידת AI. לטעון אותו?')) {
          // הוסף את הטקסט למערך הסעיפים
          setCustomSections(prev => [...prev, {
            id: generateSectionId(),
            title: 'סעיף משופר מ-AI',
            content: data.content,
            level: 'main' as const,
            order: getNextOrder()
          }]);
          localStorage.removeItem('ai-improved-section-fee-agreement');
          alert('✅ הטקסט נטען בהצלחה!');
        }
      } catch (err) {
        console.error('Error loading AI text:', err);
      }
    }
  }, []);
  
  const [agreementData, setAgreementData] = useState<FeeAgreementData>({
    lawyer: {
      name: '',
      license: '',
      address: '',
      phone: '',
      email: '',
      gender: 'male'
    },
    clients: [{
      id: '1',
      name: '',
      idNumber: '',
      address: '',
      phone: '',
      email: '',
      gender: 'male'
    }],
    case: {
      subject: ''
    },
    fees: {
      type: 'סכום_כולל',
      totalAmount: '',
      paymentStructure: 'מלא מראש',
      advancePayment: '',
      successPercentage: '',
      fixedAmount: '',
      stages: ''
    },
    terms: {
      paymentTerms: '',
      expensesCoverage: '',
      terminationClause: '',
      specialConditions: ''
    }
  });

  const [agreementDate, setAgreementDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSectionsWarehouse, setShowSectionsWarehouse] = useState(false);
  const [customSections, setCustomSections] = useState<Array<{
    id: string;
    title: string;
    content: string;
    level: 'main' | 'sub' | 'sub-sub';
    parentId?: string;
    order: number;
  }>>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  
  // מערכת משתנים
  const [variables, setVariables] = useState<Array<{
    id: string;
    name: string;
    description: string;
    type: 'text' | 'number' | 'date';
    defaultValue?: string;
    usageCount: number;
  }>>([]);
  
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

  
  const getVariableByName = (name: string) => {
    return variables.find(v => v.name === name);
  };
  
  const incrementVariableUsage = (name: string) => {
    setVariables(prev => prev.map(v => 
      v.name === name ? { ...v, usageCount: v.usageCount + 1 } : v
    ));
  };
  
  // פונקציות לניהול מודל הוספת משתנה
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

  // שמירת תבנית סעיף עם היררכיה
  const handleSaveSectionTemplate = async (section: any) => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      
      // מצא את כל התתי סעיפים של הסעיף הזה
      const childSections = customSections.filter(s => s.parentId === section.id);
      
      // צור תבנית עם הסעיף הראשי וכל התתי סעיפים
      const template = {
        title: section.title + ' (תבנית שכר טרחה)',
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

  // טעינת סעיף ישירות למסמך
  const handleLoadSectionToDocument = (section: any, documentType: 'will' | 'advance-directives') => {
    const saveKey = `ai-improved-section-${documentType}`;
    localStorage.setItem(saveKey, JSON.stringify({
      content: section.content,
      timestamp: Date.now(),
      hasVariables: false
    }));

    alert('✅ הסעיף נטען! עכשיו עובר לדף המסמך...');
    
    const routes = {
      'will': '/documents/will',
      'advance-directives': '/documents/advance-directives'
    };
    
    window.location.href = routes[documentType];
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
  
  // מערכת למידה
  const [showLearningSystem, setShowLearningSystem] = useState(false);
  const [editableSections, setEditableSections] = useState<EditableSectionType[]>([]);
  const [learningMode, setLearningMode] = useState<'edit' | 'warehouse'>('edit');
  
  // מאגר מאוחד
  const [showUnifiedWarehouse, setShowUnifiedWarehouse] = useState(false);
  const [showWarehouseEditor, setShowWarehouseEditor] = useState(false);
  
  // טעינת סעיף מהמאגר המאוחד
  const handleLoadFromWarehouse = (section: any) => {
    const newSection = {
      id: generateSectionId(),
      title: section.title,
      content: section.content,
      level: 'main' as const,
      order: getNextOrder(),
      type: 'text' as const
    };
    
    setCustomSections(prev => [...prev, newSection]);
    setShowUnifiedWarehouse(false);
    alert(`✅ הסעיף "${section.title}" נטען מהמאגר!`);
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
  
  // חלון מילוי משתנים
  const [variablesModal, setVariablesModal] = useState<{
    section: { id: string; title: string; content: string; variables: string[] };
    values: Record<string, string>;
    genders: Record<string, 'male' | 'female' | 'plural'>;
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

  // עדכון פרטי עורך הדין אם המשתמש משתנה
  useEffect(() => {
    if (mounted && currentUser) {
      setAgreementData(prev => ({
        ...prev,
        lawyer: {
          ...prev.lawyer,
          name: currentUser.name || '',
          license: currentUser.licenseNumber || '',
          address: currentUser.officeAddress || '',
          phone: currentUser.phone || '',
          email: currentUser.email || ''
        }
      }));
    }
  }, [currentUser, mounted]);

  // פונקציות לניהול לקוחות
  const addClient = () => {
    setAgreementData(prev => ({
      ...prev,
      clients: [...prev.clients, {
        id: Date.now().toString(),
        name: '',
        idNumber: '',
        address: '',
        phone: '',
        email: '',
        gender: 'male'
      }]
    }));
  };

  const removeClient = (clientId: string) => {
    setAgreementData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== clientId)
    }));
  };

  const updateClient = (clientId: string, field: keyof ClientData, value: string | 'male' | 'female') => {
    setAgreementData(prev => ({
      ...prev,
      clients: prev.clients.map(client => 
        client.id === clientId ? { ...client, [field]: value } : client
      )
    }));
  };

  // פונקציה שמחליפה משתנים בטקסט הסעיפים
  const replaceVariablesInText = (text: string) => {
    let updatedText = text;
    
    // החלפת סכומים
    if (agreementData.fees.totalAmount) {
      const formattedAmount = formatNumber(agreementData.fees.totalAmount);
      updatedText = updatedText.replace(/_______ ש"ח/g, `${formattedAmount} ש"ח`);
      updatedText = updatedText.replace(/________ ש"ח/g, `${formattedAmount} ש"ח`);
    }
    
    // החלפת מקדמה
    if (agreementData.fees.advancePayment) {
      const formattedAdvance = formatNumber(agreementData.fees.advancePayment);
      updatedText = updatedText.replace(/מקדמה: _____ ש"ח/g, `מקדמה: ${formattedAdvance} ש"ח`);
    }
    
    // החלפת סכום קבוע
    if (agreementData.fees.fixedAmount) {
      const formattedFixed = formatNumber(agreementData.fees.fixedAmount);
      updatedText = updatedText.replace(/סכום קבוע: _____ ש"ח/g, `סכום קבוע: ${formattedFixed} ש"ח`);
    }
    
    // החלפת אחוז הצלחה
    if (agreementData.fees.successPercentage) {
      updatedText = updatedText.replace(/___%/g, `${agreementData.fees.successPercentage}%`);
    }
    
    // הסרת שורות עם שדות לא רלוונטיים
    updatedText = updatedText.replace(/1\.2\. בית המשפט\/בית הדין:.*?\n/g, '');
    updatedText = updatedText.replace(/1\.4\. רמת מורכבות:.*?\n/g, '');
    
    return updatedText;
  };

  // טעינת סעיפים אוטומטית בהתאם לסוג השירות
  useEffect(() => {
    if (selectedServiceType && feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories]) {
      const service = feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories];
        const autoSections = service.clauses.map((clause, index) => ({
          id: generateSectionId(),
          title: clause.title,
          content: replaceVariablesInText(clause.text),
          level: 'main' as const,
          order: index + 1
        }));
        setCustomSections(autoSections);
      
      // עדכון פרטי התיק
      setAgreementData(prev => ({
        ...prev,
        case: {
          subject: service.serviceName
        }
      }));

      // עדכון תנאי תשלום אוטומטית בהתאם לסוג השירות (ללא סכומים)
      let defaultTerms = {
        paymentTerms: 'חשבונית תישלח מדי חודש ותשולם תוך 30 ימים מקבלתה.',
        expensesCoverage: 'הוצאות משפט (אגרות, עלויות מומחים, נסיעות) יחולו על הלקוח ויחויבו בנפרד.',
        terminationClause: 'כל צד יכול לסיים את ההתקשרות בהודעה של 14 ימים מראש.'
      };

      // הגדרות ספציפיות לפי סוג השירות
      switch (selectedServiceType) {
        case 'הסכמי_ממון':
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% לאחר אישור טיוטת ההסכם על ידי הלקוח ובטרם חתימתו.';
          break;
        
        case 'צוואת_יחיד':
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד חתימת הצוואה בפני העדים.';
          break;

        case 'צוואה_הדדית':
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד חתימת הצוואות בפני העדים.';
          break;

        case 'ייפוי_כוח_מתמשך':
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד החתימה על ייפוי הכוח.';
          break;

        case 'התנגדות_לצוואה':
          defaultTerms.paymentTerms = 'מקדמה חודשית על חשבון שכר הטרחה. בתום כל חודש תיערך התחשבנות.';
          break;

        case 'אפוטרופסות':
          defaultTerms.paymentTerms = 'תשלום מלא עם החתימה על ההסכם.';
          break;

        case 'פירוק_שיתוף':
          defaultTerms.paymentTerms = 'מקדמה חודשית על חשבון שכר הטרחה. בסוף כל חודש תיערך התחשבנות.';
          break;

        case 'תביעה_כספית':
          defaultTerms.paymentTerms = 'מקדמה ראשונית עם החתימה על הסכם זה. יתרת התשלום תשולם בשלבים או בסיום ההליך.';
          break;

        case 'ייעוץ_משפטי':
          defaultTerms.paymentTerms = 'תשלום יבוצע על בסיס חודשי לפי דו"ח שעות מפורט.';
          break;
      }

      // עדכון הנתונים
      setAgreementData(prev => ({
        ...prev,
        terms: {
          ...prev.terms,
          ...defaultTerms
        }
      }));
    }
  }, [selectedServiceType]);

  // עדכון הסעיפים כאשר הסכומים משתנים
  useEffect(() => {
    if (selectedServiceType && customSections.length > 0) {
      const service = feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories];
      if (service) {
        const updatedSections = service.clauses.map((clause, index) => ({
          id: generateSectionId(),
          title: clause.title,
          content: replaceVariablesInText(clause.text),
          level: 'main' as const,
          order: index + 1
        }));
        setCustomSections(updatedSections);
      }
    }
  }, [agreementData.fees.totalAmount, agreementData.fees.advancePayment, agreementData.fees.successPercentage, agreementData.fees.fixedAmount]);

  const updateLawyer = (field: keyof typeof agreementData.lawyer, value: string | 'male' | 'female') => {
    setAgreementData(prev => ({
      ...prev,
      lawyer: { ...prev.lawyer, [field]: value }
    }));
  };

  const updateCase = (field: keyof typeof agreementData.case, value: string) => {
    setAgreementData(prev => ({
      ...prev,
      case: { ...prev.case, [field]: value }
    }));
  };

  const updateFees = (field: keyof typeof agreementData.fees, value: string) => {
    setAgreementData(prev => ({
      ...prev,
      fees: { ...prev.fees, [field]: value }
    }));
  };

  const updateTerms = (field: keyof typeof agreementData.terms, value: string) => {
    setAgreementData(prev => ({
      ...prev,
      terms: { ...prev.terms, [field]: value }
    }));
  };

  const handleAddSection = (content: string, title: string) => {
    // זיהוי משתנים דינמיים
    const variables = extractVariablesFromContent(content);
    
    if (variables.length > 0) {
      // יש משתנים - פתח חלון מילוי
      setVariablesModal({
        section: {
          id: 'custom',
          title,
          content,
          variables: variables
        },
        values: variables.reduce((acc, v) => ({ ...acc, [v]: '' }), {}),
        genders: variables.reduce((acc, v) => ({ ...acc, [v]: 'male' as 'male' | 'female' | 'plural' }), {})
      });
    } else {
      // אין משתנים - הוסף ישירות
      const contentWithVariables = replaceVariablesInText(content);
      const newSection = {
        id: generateSectionId(),
        title,
        content: contentWithVariables,
        level: 'main' as const,
        order: getNextOrder()
      };
      setCustomSections(prev => [...prev, newSection]);
    }
    setShowSectionsWarehouse(false);
  };

  // פונקציות מערכת למידה
  const convertToEditableSections = () => {
    if (typeof window === 'undefined') return;
    
    const editable = customSections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.content,
      category: 'fee_agreement' as const,
      serviceType: selectedServiceType,
      isEditable: true,
      isCustom: true,
      version: 1,
      lastModified: new Date().toISOString(),
      modifiedBy: (mounted && currentUser?.id) || 'anonymous'
    }));
    setEditableSections(editable);
  };

  const handleUpdateEditableSection = (updatedSection: EditableSectionType) => {
    setEditableSections(prev => 
      prev.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    
    setCustomSections(prev => 
      prev.map((section) => 
        section.id === updatedSection.id ? 
          { ...section, title: updatedSection.title, content: updatedSection.content } : 
          section
      )
    );
  };

  const handleSaveToWarehouse = async (section: EditableSectionType) => {
    try {
      await addSection({
        user_id: currentUser?.id || 'anonymous',
        title: section.title,
        content: section.content,
        category: section.category || 'custom',
        tags: ['הסכם שכר טרחה', 'סעיף מותאם אישית'],
        usage_count: 0,
        average_rating: 5,
        is_public: false,
        is_hidden: false,
        created_by: currentUser?.id || 'anonymous'
      });
      alert('✅ סעיף נשמר למחסן האישי!');
    } catch (error) {
      console.error('Error saving to warehouse:', error);
      alert('❌ שגיאה בשמירה למחסן');
    }
  };

  const handleSaveToLearning = async (section: EditableSectionType) => {
    try {
      // שמירה למערכת הלמידה
      const action = {
        type: 'save_to_learning' as const,
        sectionId: section.id,
        newContent: section.content,
        reason: 'שמירה למערכת הלמידה',
        userId: currentUser?.id || 'anonymous',
        timestamp: new Date().toISOString()
      };

      learningEngine.saveToLearning(action, {
        sectionId: section.id,
        originalText: section.originalContent || section.content,
        editedText: section.content,
        editType: 'manual',
        userFeedback: 'approved',
        context: {
          serviceType: 'fee-agreement',
          category: section.category,
          userType: 'lawyer'
        },
        timestamp: new Date().toISOString(),
        userId: currentUser?.id || 'anonymous'
      });
      
      alert('✅ שינוי נשמר למערכת הלמידה!');
    } catch (error) {
      console.error('Error saving to learning:', error);
      alert('❌ שגיאה בשמירה למערכת הלמידה');
    }
  };

  const extractVariablesFromContent = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))] : [];
  };

  const handleSelectFromWarehouse = async (warehouseSection: any) => {
    
    // זיהוי משתנים לפני החלפת מגדר
    const variables = extractVariablesFromContent(warehouseSection.content);
    
    // קביעת מגדר הלקוח/לקוחה
    const clientGender = agreementData.clients.length === 1 ? 
      agreementData.clients[0].gender : 'plural';
    
    const genderedContent = replaceTextWithGender(
      warehouseSection.content,
      clientGender
    );
    
    // החלפת משתנים בטקסט
    const contentWithVariables = replaceVariablesInText(genderedContent);
    
    if (variables.length > 0) {
      setVariablesModal({
        section: {
          id: warehouseSection.id || 'custom',
          title: warehouseSection.title,
          content: contentWithVariables,
          variables: variables
        },
        values: variables.reduce((acc, v) => ({ ...acc, [v]: '' }), {}),
        genders: variables.reduce((acc, v) => ({ ...acc, [v]: 'male' as 'male' | 'female' | 'plural' }), {})
      });
    } else {
      const newSection = {
        id: generateSectionId(),
        title: warehouseSection.title,
        content: contentWithVariables,
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

  const isGenderRelevantVariable = (variable: string): boolean => {
    const genderRelevantVariables = [
      'lawyer_name', 'client_name', 'attorney_name', 'witness_name',
      'court_name', 'judge_name', 'expert_name',
      'מיופה_כוח', 'רשאי', 'אחראי', 'מחויב', 'יכול', 'צריך', 'חייב',
      'זכאי', 'מתחייב', 'מסכים', 'מבקש', 'מצהיר', 'מאשר'
    ];
    return genderRelevantVariables.includes(variable);
  };

  const getVariableLabel = (variable: string): string => {
    const labels: Record<string, string> = {
      'lawyer_name': 'שם עורך הדין',
      'client_name': 'שם הלקוח/ה',
      'attorney_name': 'שם מיופה הכוח',
      'witness_name': 'שם העד/ה',
      'court_name': 'שם בית המשפט',
      'judge_name': 'שם השופט/ת',
      'expert_name': 'שם המומחה/ית',
      'case_number': 'מספר התיק',
      'amount': 'סכום',
      'percentage': 'אחוז',
      'date': 'תאריך',
      'address': 'כתובת',
      'phone': 'טלפון',
      'email': 'אימייל',
      'מיופה_כוח': 'מיופה הכוח',
      'רשאי': 'רשאי/רשאית/רשאים',
      'אחראי': 'אחראי/אחראית/אחראים',
      'מחויב': 'מחויב/מחויבת/מחויבים',
      'יכול': 'יכול/יכולה/יכולים',
      'צריך': 'צריך/צריכה/צריכים',
      'חייב': 'חייב/חייבת/חייבים',
      'זכאי': 'זכאי/זכאית/זכאים',
      'מתחייב': 'מתחייב/מתחייבת/מתחייבים',
      'מסכים': 'מסכים/מסכימה/מסכימים',
      'מבקש': 'מבקש/מבקשת/מבקשים',
      'מצהיר': 'מצהיר/מצהירה/מצהירים',
      'מאשר': 'מאשר/מאשרת/מאשרים'
    };
    return labels[variable] || variable;
  };


  const generateFeeAgreement = (): string => {
    const clientsSection = agreementData.clients.map((client, index) => {
      const clientLabel = agreementData.clients.length > 1 ? `הלקוח ${index + 1}` : 'הלקוח';
      return `לבין:    ${client.name || '[שם הלקוח]'}
         ת.ז: ${client.idNumber || '[תעודת זהות]'}
         כתובת: ${client.address || '[כתובת הלקוח]'}
         טלפון: ${client.phone || '[מספר טלפון]'}
         דוא"ל: ${client.email || '[כתובת אימייל]'}
         (להלן: "${clientLabel}")`;
    }).join('\n\n');

    let baseAgreement = `הסכם שכר טרחה

בין:     ${agreementData.lawyer.name || '[שם עורך הדין]'}
         עו"ד, רישיון מספר: ${agreementData.lawyer.license || '[מספר רישיון]'}
         כתובת: ${agreementData.lawyer.address || '[כתובת עורך הדין]'}
         טלפון: ${agreementData.lawyer.phone || '[מספר טלפון]'}
         דוא"ל: ${agreementData.lawyer.email || '[כתובת אימייל]'}
         (להלן: "עורך הדין")

${clientsSection}

הואיל ועורך הדין הוא עורך דין בעל רישיון תקף לעריכת דין בישראל;

והואיל ${agreementData.clients.length > 1 ? 'והלקוחות מעוניינים' : 'והלקוח מעוניין'} לקבל שירותים משפטיים מעורך הדין;

והואיל והצדדים מעוניינים לקבוע את תנאי ההתקשרות ביניהם;

לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:

1. תיאור השירות

${agreementData.case.subject || '[תיאור השירות המשפטי]'}
`;

    if (customSections.length > 0) {
      baseAgreement += '\n2. סעיפים ותנאים\n\n';
      customSections.forEach((section, index) => {
        baseAgreement += `2.${index + 1}. ${section.title}\n\n${section.content}\n\n`;
      });
      baseAgreement += '\n';
    }

    baseAgreement += `
${customSections.length > 0 ? customSections.length + 2 : '2'}. תוקף ההסכם

הסכם זה ייכנס לתוקף עם חתימת שני הצדדים ויהיה בתוקף עד לסיום הטיפול בתיק או עד לסיום ההתקשרות.

התאריך: ${new Date(agreementDate).toLocaleDateString('he-IL')}

________________________           ${agreementData.clients.map((_, i) => '________________________').join('           ')}
    חתימת עורך הדין                    ${agreementData.clients.map((c, i) => `חתימת ${agreementData.clients.length > 1 ? `לקוח ${i + 1}` : 'הלקוח'}`).join('                    ')}
     ${agreementData.lawyer.name || '[שם]'}                        ${agreementData.clients.map(c => c.name || '[שם]').join('                        ')}

הסכם זה נחתם ב${agreementData.clients.length + 1} עותקים, עותק לכל צד.`;

    return baseAgreement;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          הסכם שכר טרחה עורך דין
        </h1>

        {/* פרטי עורך הדין */}
        <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              פרטי עורך הדין
            </h2>
            {mounted && currentUser && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  ✓ נטען מהפרופיל
                </span>
                <a 
                  href="/profile" 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  עדכן בפרופיל
                </a>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={agreementData.lawyer.name}
              onChange={(e) => updateLawyer('name', e.target.value)}
              placeholder="שם עורך הדין המלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={agreementData.lawyer.license}
              onChange={(e) => updateLawyer('license', e.target.value)}
              placeholder="מספר רישיון עו״ד"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={agreementData.lawyer.address}
              onChange={(e) => updateLawyer('address', e.target.value)}
              placeholder="כתובת משרד"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={agreementData.lawyer.phone}
              onChange={(e) => updateLawyer('phone', e.target.value)}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />
            
            <input
              type="email"
              value={agreementData.lawyer.email}
              onChange={(e) => updateLawyer('email', e.target.value)}
              placeholder="כתובת אימייל"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />

            <select
              value={agreementData.lawyer.gender}
              onChange={(e) => updateLawyer('gender', e.target.value as 'male' | 'female')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              dir="rtl"
            >
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
          </div>
        </section>

        {/* פרטי לקוחות */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              פרטי לקוחות
            </h2>
            <button
              onClick={addClient}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              הוסף לקוח
            </button>
          </div>

          {agreementData.clients.map((client, index) => (
            <div key={client.id} className="bg-white p-4 rounded-lg border border-green-300 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900">
                  לקוח {agreementData.clients.length > 1 ? index + 1 : ''}
                </h3>
                {agreementData.clients.length > 1 && (
                  <button
                    onClick={() => removeClient(client.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={client.name}
                  onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                  placeholder="שם הלקוח המלא"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  dir="rtl"
                />
                
                <input
                  type="text"
                  value={client.idNumber}
                  onChange={(e) => updateClient(client.id, 'idNumber', e.target.value)}
                  placeholder="תעודת זהות"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  dir="ltr"
                  maxLength={9}
                />
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={client.address}
                  onChange={(e) => updateClient(client.id, 'address', e.target.value)}
                  placeholder="כתובת מלאה"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  dir="rtl"
                />
                
                <input
                  type="text"
                  value={client.phone}
                  onChange={(e) => updateClient(client.id, 'phone', e.target.value)}
                  placeholder="מספר טלפון"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  dir="ltr"
                />
                
                <input
                  type="email"
                  value={client.email}
                  onChange={(e) => updateClient(client.id, 'email', e.target.value)}
                  placeholder="כתובת אימייל"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  dir="ltr"
                />

                <select
                  value={client.gender}
                  onChange={(e) => updateClient(client.id, 'gender', e.target.value as 'male' | 'female')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  dir="rtl"
                >
                  <option value="male">זכר</option>
                  <option value="female">נקבה</option>
                </select>
              </div>
            </div>
          ))}
        </section>

        {/* פרטי התיק */}
        <section className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
          <h2 className="text-xl font-bold text-purple-900 mb-4">פרטי התיק</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">בחירת סוג שירות</label>
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              dir="rtl"
            >
              <option value="">בחר סוג שירות...</option>
              {Object.entries(feeAgreementTemplates.serviceCategories).map(([key, service]) => (
                <option key={key} value={key}>
                  {service.serviceName}
                </option>
              ))}
            </select>
            {selectedServiceType && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ נטענו אוטומטית {feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories]?.clauses.length} סעיפים מותאמים אישית
                </p>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">תיאור השירות</label>
            <input
              type="text"
              value={agreementData.case.subject}
              onChange={(e) => updateCase('subject', e.target.value)}
              placeholder="תיאור השירות המשפטי (תביעה, הסכם, ייעוץ...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              dir="rtl"
            />
          </div>
        </section>

        {/* תמחור */}
        <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            מבנה תמחור
          </h2>
          
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>טיפ:</strong> המספרים יוצגו אוטומטית עם פסיקים (למשל: 5,000 ש"ח)
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג תמחור</label>
            <select
              value={agreementData.fees.type}
              onChange={(e) => updateFees('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              dir="rtl"
            >
              <option value="סכום_כולל">סכום כולל</option>
              <option value="מקדמה_והצלחה">מקדמה + אחוז הצלחה</option>
              <option value="סכום_ואחוזים">סכום קבוע + אחוז מהזכייה</option>
            </select>
          </div>

          <div className="space-y-4">
            {agreementData.fees.type === 'סכום_כולל' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סכום כולל (₪)</label>
                  <input
                    type="text"
                    value={agreementData.fees.totalAmount ? formatNumber(agreementData.fees.totalAmount) : ''}
                    onChange={(e) => updateFees('totalAmount', unformatNumber(e.target.value))}
                    placeholder="5,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="ltr"
                  />
                </div>
                  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מבנה התשלום</label>
                  <select
                    value={agreementData.fees.paymentStructure || 'מלא מראש'}
                    onChange={(e) => updateFees('paymentStructure', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="rtl"
                  >
                    <option value="מלא מראש">תשלום מלא מראש</option>
                    <option value="50%-50%">חלוקה 50%-50%</option>
                    <option value="30%-70%">חלוקה 30%-70%</option>
                    <option value="שלבים">חלוקה לשלבים</option>
                  </select>
                </div>
                
                {agreementData.fees.paymentStructure === 'שלבים' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">פירוט השלבים</label>
                    <textarea
                      value={agreementData.fees.stages || ''}
                      onChange={(e) => updateFees('stages', e.target.value)}
                      placeholder="למשל: 30% עם החתימה, 40% בסיום הטיוטה, 30% עם החתימה על ההסכם"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                )}
              </>
            )}

            {agreementData.fees.type === 'מקדמה_והצלחה' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">מקדמה מראש (₪)</label>
                    <input
                      type="text"
                      value={agreementData.fees.advancePayment ? formatNumber(agreementData.fees.advancePayment) : ''}
                      onChange={(e) => updateFees('advancePayment', unformatNumber(e.target.value))}
                      placeholder="10,000"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 w-full"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">אחוז הצלחה (%)</label>
                    <input
                      type="text"
                      value={agreementData.fees.successPercentage || ''}
                      onChange={(e) => updateFees('successPercentage', e.target.value)}
                      placeholder="10"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 w-full"
                      dir="ltr"
                    />
                  </div>
                </div>
                    
                <div className="bg-white p-3 rounded border border-yellow-300 text-sm">
                  <strong>דוגמה:</strong> מקדמה 10,000 ₪ + 10% מהסכום שיתקבל בפועל
                </div>
              </>
            )}

            {agreementData.fees.type === 'סכום_ואחוזים' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">סכום קבוע (₪)</label>
                    <input
                      type="text"
                      value={agreementData.fees.fixedAmount ? formatNumber(agreementData.fees.fixedAmount) : ''}
                      onChange={(e) => updateFees('fixedAmount', unformatNumber(e.target.value))}
                      placeholder="15,000"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 w-full"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">אחוז מהזכייה (%)</label>
                    <input
                      type="text"
                      value={agreementData.fees.successPercentage || ''}
                      onChange={(e) => updateFees('successPercentage', e.target.value)}
                      placeholder="5"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 w-full"
                      dir="ltr"
                    />
                  </div>
                </div>
                    
                <div className="bg-white p-3 rounded border border-yellow-300 text-sm">
                  <strong>דוגמה:</strong> סכום קבוע 15,000 ₪ + 5% מכל סכום שיתקבל בפועל מהזכייה
                </div>
              </>
            )}
          </div>
        </section>

        {/* עוזר AI */}
        <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-900">🤖 עוזר AI לשיפור הסכמים</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowLearningSystem(!showLearningSystem);
                  if (!showLearningSystem) {
                    convertToEditableSections();
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                <Brain className="w-4 h-4" />
                {showLearningSystem ? 'סגור למידה' : 'מערכת למידה'}
              </button>
              <button
                onClick={() => setShowSectionsWarehouse(true)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                <BookOpen className="w-4 h-4" />
                מחסן סעיפים
              </button>
              <button
                onClick={() => {
                  const title = prompt('כותרת הסעיף:');
                  const content = prompt('תוכן הסעיף:');
                  if (title && content) {
                    handleAddSection(content, title);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                הוסף סעיף לטופס
              </button>
              <button
                onClick={openAddVariableModal}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                הוסף משתנה
              </button>
              <button
                onClick={openVariablesCompletionModal}
                className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                🔧 השלם משתנים
              </button>
              <button
                onClick={handleLoadTemplate}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
              >
                <span className="text-lg">📋</span>
                טען תבנית
              </button>
              <button
                onClick={() => setShowUnifiedWarehouse(true)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                <span className="text-lg">🏪</span>
                טען מהמאגר
              </button>
              <button
                onClick={() => setShowWarehouseEditor(true)}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                <span className="text-lg">✏️</span>
                ערוך מאגר
              </button>
              {variables.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
              <button
                onClick={() => {
                  const title = prompt('כותרת הסעיף:');
                  const content = prompt('תוכן הסעיף:');
                  if (title && content) {
                    handleSaveToWarehouse({
                      id: generateSectionId(),
                      title,
                      content,
                      category: 'custom',
                      serviceType: 'fee-agreement',
                      isEditable: true,
                      isCustom: true,
                      version: 1,
                      lastModified: new Date().toISOString(),
                      modifiedBy: currentUser?.id || 'anonymous'
                    });
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                הוסף סעיף למחסן
              </button>
            </div>
          </div>

          {showLearningSystem && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setLearningMode('edit')}
                  className={`px-4 py-2 rounded-lg transition ${
                    learningMode === 'edit' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  עריכת סעיפים
                </button>
                <button
                  onClick={() => setLearningMode('warehouse')}
                  className={`px-4 py-2 rounded-lg transition ${
                    learningMode === 'warehouse' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  מחסן סעיפים
                </button>
              </div>

              {learningMode === 'edit' && editableSections.length > 0 && typeof window !== 'undefined' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-800">
                    סעיפים ניתנים לעריכה עם AI
                  </h3>
                  {editableSections.map((section) => (
                    <EditableSection
                      key={section.id}
                      section={section}
                      onUpdate={handleUpdateEditableSection}
                      onSaveToWarehouse={handleSaveToWarehouse}
                      onSaveToLearning={handleSaveToLearning}
                      userId={(mounted && currentUser?.id) || 'anonymous'}
                      showAIInsights={true}
                    />
                  ))}
                </div>
              )}

              {learningMode === 'warehouse' && mounted && currentUser && typeof window !== 'undefined' && (
                <WarehouseManager
                  userId={currentUser.id}
                  onSectionSelect={handleSelectFromWarehouse}
                />
              )}
            </div>
          )}
        </section>

        {/* סעיפים נוספים */}
        {customSections.length > 0 && (
          <section className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
            <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              סעיפים נוספים ({customSections.length})
            </h2>
            
            <div className="space-y-4">
              {customSections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                <div key={section.id} className={`bg-white p-4 rounded-lg border ${
                  section.level === 'main' ? 'border-purple-300' : 
                  section.level === 'sub' ? 'border-blue-300' : 'border-green-300'
                } ${section.level === 'sub' ? 'ml-4' : section.level === 'sub-sub' ? 'ml-8' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {getSectionNumber(section)}
                      </span>
                      <h3 className="font-semibold text-purple-900">{section.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        section.level === 'main' ? 'bg-purple-100 text-purple-700' : 
                        section.level === 'sub' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
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
                            section.level === 'main' ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
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
                            section.level === 'sub-sub' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-green-100'
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
                          className="p-1 rounded text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                          title="הזז למעלה"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveSectionDown(section.id)}
                          className="p-1 rounded text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                          title="הזז למטה"
                        >
                          ↓
                        </button>
                      </div>
                      
                      {/* כפתורי תבניות */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSaveSectionTemplate(section)}
                          className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                          title="שמור כתבנית קבועה"
                        >
                          תבנית
                        </button>
                        <button
                          onClick={() => handleLoadSectionToDocument(section, 'will')}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                          title="טען לצוואה"
                        >
                          צוואה
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
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* תאריך */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            תאריך הסכם
          </h2>
          
          <input
            type="date"
            value={agreementDate}
            onChange={(e) => setAgreementDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
          />
        </section>

        {/* ייצוא מקצועי */}
        <ProfessionalFeeAgreementExporter
          agreementData={agreementData}
          agreementDate={{
            day: new Date(agreementDate).getDate().toString(),
            month: (new Date(agreementDate).getMonth() + 1).toString(),
            year: new Date(agreementDate).getFullYear().toString()
          }}
          className="w-full"
        />

        {/* מחסן סעיפים */}
        {showSectionsWarehouse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">מחסן סעיפים להסכמי שכר טרחה</h2>
                  <button 
                    onClick={() => setShowSectionsWarehouse(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <WarehouseManager
                    userId={currentUser?.id || 'anonymous'}
                    onSectionSelect={handleSelectFromWarehouse}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* חלון מילוי משתנים */}
        {variablesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                השלמת פרטים לסעיף: {variablesModal.section.title}
              </h3>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 טיפ:</p>
                <p>למשתנים של אנשים (שמות) ופעלים יש אפשרות לבחור מגדר. זה יעזור להציג את הטקסט הנכון (זכר/נקבה/רבים) במסמך.</p>
                <p className="mt-1">דוגמה: "רשאי" יכול להיות "רשאי" (זכר), "רשאית" (נקבה), או "רשאים" (רבים).</p>
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
                                    [variable]: e.target.value as 'male' | 'female' | 'plural'
                                  }
                                }));
                              }}
                              className="text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm">נקבה</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`gender_${variable}`}
                              value="plural"
                              checked={variablesModal.genders[variable] === 'plural'}
                              onChange={(e) => {
                                setVariablesModal(prev => ({
                                  ...prev!,
                                  genders: {
                                    ...prev!.genders,
                                    [variable]: e.target.value as 'male' | 'female' | 'plural'
                                  }
                                }));
                              }}
                              className="text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm">רבים</span>
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
                    let finalContent = variablesModal.section.content;
                    Object.keys(variablesModal.values).forEach(key => {
                      const value = variablesModal.values[key];
                      let replacedValue = value;
                      
                      if (isGenderRelevantVariable(key) && variablesModal.genders[key]) {
                        replacedValue = replaceTextWithGender(value, variablesModal.genders[key]);
                      }
                      
                      finalContent = finalContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), replacedValue);
                    });

                    setCustomSections(prev => [...prev, {
                      id: generateSectionId(),
                      title: variablesModal.section.title,
                      content: finalContent,
                      level: 'main' as const,
                      order: getNextOrder()
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

        {/* עורך מאגר */}
        {showWarehouseEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  ✏️ עורך המאגר
                </h3>
                <button
                  onClick={() => setShowWarehouseEditor(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-sm text-red-700 mb-4">
                  כאן תוכל להוסיף סעיפים ישירות למאגר
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* מאגר מאוחד */}
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
                onSectionSelect={handleLoadFromWarehouse}
                userId={testator.fullName || 'anonymous'}
                willType="individual"
              />
            </div>
          </div>
        )}
      </div>
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
