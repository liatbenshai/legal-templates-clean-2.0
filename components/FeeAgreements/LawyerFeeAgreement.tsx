'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, Calendar, User, Scale, BookOpen, X, Download, Brain, Plus, Trash2 } from 'lucide-react';
import EditableSection from '../LearningSystem/EditableSection';
import WarehouseManager from '../LearningSystem/WarehouseManager';
import UnifiedWarehouse from '../UnifiedWarehouse';
import ProfessionalFeeAgreementExporter from './ProfessionalFeeAgreementExporter';
import { AuthService } from '@/lib/auth';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import feeAgreementTemplates from '@/lib/fee-agreement-templates.json';
import { replaceTextWithGender } from '@/lib/hebrew-gender';
import { useWarehouse } from '@/lib/hooks/useWarehouse';
import { replaceFeeAgreementTemplateTextWithGender, type Gender } from '@/lib/fee-agreement-template-utils';

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
    type: 'סכום_כולל';
    totalAmount?: string;
    paymentStructure?: 'מלא מראש' | 'שלבים';
    paymentStages?: Array<{
      id: string;
      type: 'amount' | 'percentage'; // סכום או אחוז
      description: string; // פירוט
      value: string; // כמה
      paymentTiming: string; // זמני תשלום (עם חתימת ההסכם, בתאריך מסוים, וכו')
    }>;
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
      paymentStages: []
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

  // פונקציה לעדכון פרטי שכר הטרחה
  const updateFees = (field: keyof FeeAgreementData['fees'], value: any) => {
    setAgreementData(prev => ({
      ...prev,
      fees: {
        ...prev.fees,
        [field]: value
      }
    }));
  };

  // עדכון/יצירת סעיף שכר הטרחה
  const updateFeeSection = () => {
    setCustomSections(prev => {
      // הסר סעיפים ישנים של שכר טרחה
      const oldTitles = ['שכר טרחה', 'תמחור', 'מבנה תמחור', 'תנאי תשלום'];
      const withoutOldFee = prev.filter(section => {
        // אם זה סעיף שכר טרחה ישן (אבל לא החדש שלנו), הסר אותו
        const isOldFeeSection = oldTitles.some(title => 
          section.title.includes(title) && section.title !== 'שכר טרחה עבור השירות'
        );
        
        // גם הסר תתי סעיפים של סעיפים ישנים
        if (isOldFeeSection || (section.parentId && prev.find(p => oldTitles.some(title => p.title.includes(title) && p.title !== 'שכר טרחה עבור השירות') && p.id === section.parentId))) {
          return false;
        }
        
        return true;
      });
      
      // בדוק אם הסעיף כבר קיים
      const existingSection = withoutOldFee.find(s => s.title === 'שכר טרחה עבור השירות');
      const mainSectionId = existingSection?.id || generateSectionId();
      
      // מצא את סעיף "תיאור השירות" - הסעיף הראשון שטעון מה-JSON
      // נחפש סעיף ראשי (level === 'main') שאינו שכר טרחה ואינו סעיף קבוע (gen_)
      const mainSections = withoutOldFee
        .filter(s => s.level === 'main' && 
                     s.title !== 'שכר טרחה עבור השירות' && 
                     !s.id.startsWith('gen_'))
        .sort((a, b) => a.order - b.order);
      
      // נחפש את סעיף "תיאור השירות" - זה הסעיף הראשון
      let serviceDescriptionSection = mainSections.find(s => 
        s.title === 'תיאור השירות' || s.id === 'first-section-fixed'
      );
      
      // אם לא נמצא, נחפש את הסעיף הראשון ברשימה
      if (!serviceDescriptionSection && mainSections.length > 0) {
        serviceDescriptionSection = mainSections[0];
      }
      
      // קבע את המיקום - שכר טרחה יופיע אחרי כל הסעיפים הרגילים (לא קבועים)
      // מצא את כל הסעיפים הרגילים (לא gen_ ולא שכר טרחה)
      const regularSections = withoutOldFee.filter(s => 
        !s.id.startsWith('gen_') && 
        s.title !== 'שכר טרחה עבור השירות'
      );
      
      let feeOrder = 1;
      if (regularSections.length > 0) {
        // מצא את הסדר הגבוה ביותר של כל הסעיפים הרגילים כולל תתי סעיפים
        const findAllChildren = (sectionId: string, allSections: typeof withoutOldFee): string[] => {
          const children = allSections.filter(s => s.parentId === sectionId);
          let result: string[] = [sectionId];
          children.forEach(child => {
            result = [...result, ...findAllChildren(child.id, allSections)];
          });
          return result;
        };
        
        // מצא את הסדר הגבוה ביותר של כל הסעיפים הרגילים
        let maxOrder = 0;
        regularSections.forEach(section => {
          const sectionIds = findAllChildren(section.id, withoutOldFee);
          const sectionWithChildren = withoutOldFee.filter(s => sectionIds.includes(s.id));
          const sectionMaxOrder = sectionWithChildren.length > 0
            ? Math.max(...sectionWithChildren.map(s => s.order), 0)
            : section.order;
          maxOrder = Math.max(maxOrder, sectionMaxOrder);
        });
        
        feeOrder = maxOrder + 1;
      }
      
      // בניית תוכן הסעיף הראשי
      let mainContent = '';
      
      // הוסף תיאור השירות (אם לא כבר מופיע בסעיף אחר)
      if (agreementData.case.subject && !serviceDescriptionSection) {
        mainContent += `שכר הטרחה נקבע עבור השירות המשפטי הבא:\n${agreementData.case.subject}\n\n`;
      }
      
      // הוסף את הסכום הכולל
      if (agreementData.fees.totalAmount) {
        const formattedAmount = formatNumber(agreementData.fees.totalAmount);
        mainContent += `שכר הטרחה הכולל בעד השירות המפורט לעיל הוא סכום של ${formattedAmount} ש"ח + מע"מ.\n\n`;
      }
      
      // הוסף את מבנה התשלום
      if (agreementData.fees.paymentStructure === 'מלא מראש') {
        mainContent += 'התשלום יבוצע במלואו מראש עם חתימת ההסכם.';
      } else if (agreementData.fees.paymentStructure === 'שלבים') {
        mainContent += 'התשלום יבוצע בחלוקה לשלבים כמפורט להלן:';
      }
      
      const mainSection = {
        id: mainSectionId,
        title: 'שכר טרחה עבור השירות',
        content: mainContent,
        level: 'main' as const,
        order: feeOrder
      };
      
      // הסר את הסעיף הישן (אם קיים) ותתי הסעיפים שלו
      const withoutOldMain = withoutOldFee.filter(s => 
        s.title !== 'שכר טרחה עבור השירות' && s.parentId !== mainSectionId
      );
      
      // אם יש מבנה תשלום עם שלבים, עדכן את התתי סעיפים
      if (agreementData.fees.paymentStructure === 'שלבים' && agreementData.fees.paymentStages && agreementData.fees.paymentStages.length > 0) {
        const newSubsections = agreementData.fees.paymentStages.map((stage, index) => {
          const stageValue = stage.type === 'amount' 
            ? (stage.value ? `${formatNumber(stage.value)} ש"ח + מע"מ` : '')
            : (stage.value ? `${stage.value}%` : '');
          
          let content = '';
          if (stage.description) {
            content += stage.description;
          }
          if (stageValue) {
            content += (content ? '\n' : '') + `${stage.type === 'amount' ? 'סכום' : 'אחוז'}: ${stageValue}`;
          }
          if (stage.paymentTiming) {
            content += (content ? '\n' : '') + `תשלום: ${stage.paymentTiming}`;
          }
          
          return {
            id: stage.id,
            title: `שלב ${index + 1}`,
            content: content || `שלב תשלום ${index + 1}`,
            level: 'sub' as const,
            parentId: mainSectionId,
            order: feeOrder + index + 1
          };
        });
        
        // הפרד בין סעיפים רגילים לסעיפים קבועים (gen_)
        const regularSections = withoutOldMain.filter(s => !s.id.startsWith('gen_'));
        const generalSections = withoutOldMain.filter(s => s.id.startsWith('gen_'));
        
        // מצא את הסדר הגבוה ביותר של הסעיפים הרגילים (לא קבועים)
        const maxRegularOrder = regularSections.length > 0 
          ? Math.max(...regularSections.map(s => s.order), 0)
          : feeOrder - 1;
        
        // שכר טרחה יופיע אחרי כל הסעיפים הרגילים, אבל לפני הסעיפים הקבועים
        const feeOrderNew = maxRegularOrder + 1;
        mainSection.order = feeOrderNew;
        
        // עדכן את הסדר של תתי הסעיפים
        newSubsections.forEach((sub, index) => {
          sub.order = feeOrderNew + index + 1;
        });
        
        // נשמור על הסדר: סעיפים רגילים -> שכר טרחה ותתי סעיפים -> סעיפים קבועים
        const allSections = [
          ...regularSections,
          mainSection,
          ...newSubsections,
          ...generalSections
        ];
        
        // עדכן את הסדר של כל הסעיפים (רק סעיפים רגילים ושכר טרחה, לא קבועים)
        let currentOrder = 1;
        return allSections.map((section) => {
          if (section.id.startsWith('gen_')) {
            // שמור את הסדר המקורי של הסעיפים הקבועים
            return section;
          }
          return {
          ...section,
            order: currentOrder++
          };
        });
      } else {
        // תשלום מלא מראש - רק הסעיף הראשי
        // הפרד בין סעיפים רגילים לסעיפים קבועים (gen_)
        const regularSections = withoutOldMain.filter(s => !s.id.startsWith('gen_'));
        const generalSections = withoutOldMain.filter(s => s.id.startsWith('gen_'));
        
        // מצא את הסדר הגבוה ביותר של הסעיפים הרגילים (לא קבועים)
        const maxRegularOrder = regularSections.length > 0 
          ? Math.max(...regularSections.map(s => s.order), 0)
          : feeOrder - 1;
        
        // שכר טרחה יופיע אחרי כל הסעיפים הרגילים, אבל לפני הסעיפים הקבועים
        mainSection.order = maxRegularOrder + 1;
        
        // נשמור על הסדר: סעיפים רגילים -> שכר טרחה -> סעיפים קבועים
        const allSections = [
          ...regularSections,
          mainSection,
          ...generalSections
        ];
        
        // עדכן את הסדר של כל הסעיפים (רק סעיפים רגילים ושכר טרחה, לא קבועים)
        let currentOrder = 1;
        return allSections.map((section) => {
          if (section.id.startsWith('gen_')) {
            // שמור את הסדר המקורי של הסעיפים הקבועים
            return section;
          }
          return {
          ...section,
            order: currentOrder++
          };
        });
      }
    });
  };



  // הוספת שלב תשלום חדש
  const addPaymentStage = () => {
    const newStage = {
      id: `stage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'amount' as 'amount' | 'percentage',
      description: '',
      value: '',
      paymentTiming: ''
    };
    
    setAgreementData(prev => ({
      ...prev,
      fees: {
        ...prev.fees,
        paymentStages: [...(prev.fees.paymentStages || []), newStage]
      }
    }));
  };

  // הסרת שלב תשלום
  const removePaymentStage = (stageId: string) => {
    setAgreementData(prev => ({
      ...prev,
      fees: {
        ...prev.fees,
        paymentStages: (prev.fees.paymentStages || []).filter(s => s.id !== stageId)
      }
    }));
  };

  // עדכון שלב תשלום
  const updatePaymentStage = (stageId: string, field: string, value: any) => {
    setAgreementData(prev => ({
      ...prev,
      fees: {
        ...prev.fees,
        paymentStages: (prev.fees.paymentStages || []).map(stage =>
          stage.id === stageId ? { ...stage, [field]: value } : stage
        )
      }
    }));
  };

  // עדכון סעיף שכר טרחה כאשר משתנים פרטי התמחור או השירות
  useEffect(() => {
    updateFeeSection();
  }, [agreementData.fees.totalAmount, agreementData.fees.paymentStructure, agreementData.fees.paymentStages, agreementData.case.subject]);
  
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
    // מצא את הסדר הגבוה ביותר של סעיפים רגילים (לא קבועים ולא שכר טרחה)
    const regularSections = customSections.filter(s => 
      !s.id.startsWith('gen_') && 
      s.title !== 'שכר טרחה עבור השירות' &&
      s.id !== 'first-section-fixed'
    );
    
    if (regularSections.length === 0) {
      // אם אין סעיפים רגילים, התחל מ-2 (אחרי הסעיף הראשון)
      return 2;
    }
    
    // מצא את הסדר הגבוה ביותר כולל תתי סעיפים
    let maxOrder = 0;
    regularSections.forEach(section => {
      // מצא את כל התתי סעיפים של הסעיף הזה
      const findAllChildren = (sectionId: string): number => {
        const children = customSections.filter(s => s.parentId === sectionId);
        let maxChildOrder = section.order;
        children.forEach(child => {
          const childMax = findAllChildren(child.id);
          maxChildOrder = Math.max(maxChildOrder, childMax);
        });
        return maxChildOrder;
      };
      
      const sectionMaxOrder = findAllChildren(section.id);
      maxOrder = Math.max(maxOrder, sectionMaxOrder);
    });
    
    return maxOrder + 1;
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
    // מיין את כל הסעיפים לפי order
    const sortedSections = [...customSections].sort((a, b) => a.order - b.order);
    
    // מצא את כל הסעיפים הראשיים (כולל gen_)
    const allMainSections = sortedSections
      .filter(s => s.level === 'main')
      .sort((a, b) => a.order - b.order);
    
    // מצא את כל הסעיפים הראשיים (לא כולל gen_) למספור
    const mainSections = sortedSections
      .filter(s => s.level === 'main' && !s.id.startsWith('gen_'))
      .sort((a, b) => a.order - b.order);
    
    if (section.level === 'main') {
      // אם זה סעיף gen_, מצא את המספר שלו מתוך כל הסעיפים הראשיים
      if (section.id.startsWith('gen_')) {
        const mainIndex = allMainSections.findIndex(s => s.id === section.id);
        if (mainIndex === -1) return '';
        return (mainIndex + 1).toString();
      }
      const mainIndex = mainSections.findIndex(s => s.id === section.id);
      if (mainIndex === -1) return '';
      return (mainIndex + 1).toString();
    } else if (section.level === 'sub') {
      // מצא את הסעיף הראשי שיור (יכול להיות גם gen_)
      const mainParent = allMainSections.find(s => s.id === section.parentId);
      if (!mainParent) return '';
      
      const mainIndex = allMainSections.findIndex(s => s.id === mainParent.id);
      const parentSectionNum = mainIndex + 1;
      
      // מצא את כל התתי-סעיפים של הסעיף הראשי הזה (כולל gen_)
      const subSections = sortedSections
        .filter(s => s.level === 'sub' && s.parentId === section.parentId)
        .sort((a, b) => a.order - b.order);
      
      const subIndex = subSections.findIndex(s => s.id === section.id);
      if (subIndex === -1) return '';
      return `${parentSectionNum}.${subIndex + 1}`;
    } else if (section.level === 'sub-sub') {
      // מצא את הסעיף sub שיור
      const parentSub = sortedSections.find(s => s.id === section.parentId);
      if (!parentSub || parentSub.level !== 'sub') return '';
      
      // מצא את הסעיף הראשי דרך הסעיף sub (יכול להיות גם gen_)
      const mainParent = allMainSections.find(s => s.id === parentSub.parentId);
      if (!mainParent) return '';
      
      const mainIndex = allMainSections.findIndex(s => s.id === mainParent.id);
      const parentSectionNum = mainIndex + 1;
      
      // מצא את כל התתי-סעיפים של הסעיף הראשי
      const allSubSections = sortedSections
        .filter(s => s.level === 'sub' && s.parentId === mainParent.id)
        .sort((a, b) => a.order - b.order);
      const subIndex = allSubSections.findIndex(s => s.id === parentSub.id);
      if (subIndex === -1) return '';
      
      // מצא את כל התתי-תתי-סעיפים של הסעיף sub הזה
      const allSubSubSections = sortedSections
        .filter(s => s.level === 'sub-sub' && s.parentId === parentSub.id)
        .sort((a, b) => a.order - b.order);
      const subSubIndex = allSubSubSections.findIndex(s => s.id === section.id);
      if (subSubIndex === -1) return '';
      
      return `${parentSectionNum}.${subIndex + 1}.${subSubIndex + 1}`;
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
            user_id: agreementData.clients[0]?.name || 'anonymous',
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
    const subSections: any[] = [];
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

  // טעינת סעיפים היררכיים מ-Supabase
  const handleLoadHierarchicalSections = async () => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      
      // טען סעיפים ראשיים
      const { data: mainSections, error: mainError } = await supabase
        .from('hierarchical_sections')
        .select('*')
        .eq('level', 'main')
        .order('order_index');

      if (mainError) {
        console.error('Error loading main sections:', mainError);
        alert('שגיאה בטעינת הסעיפים');
        return;
      }

      if (!mainSections || mainSections.length === 0) {
        alert('אין סעיפים היררכיים שמורים. צור סעיפים ב-Supabase Dashboard תחילה.');
        return;
      }

      // הצג רשימה לבחירה
      const sectionList = mainSections.map((section: any, index: number) => 
        `${index + 1}. ${section.title}`
      ).join('\n');
      
      const choice = prompt(`בחר סעיף לטעינה:\n\n${sectionList}\n\nהזן מספר (1-${mainSections.length}):`);
      if (!choice || isNaN(Number(choice))) return;
      
      const sectionIndex = Number(choice) - 1;
      if (sectionIndex < 0 || sectionIndex >= mainSections.length) {
        alert('מספר לא תקין');
        return;
      }

      const selectedMainSection = mainSections[sectionIndex];

      // טען תתי סעיפים
      const { data: subSections, error: subError } = await supabase
        .from('hierarchical_sections')
        .select('*')
        .eq('parent_id', selectedMainSection.id)
        .order('order_index');

      if (subError) {
        console.error('Error loading sub sections:', subError);
        alert('שגיאה בטעינת תתי הסעיפים');
        return;
      }

      // טען תת-תת-סעיפים לכל תת-סעיף
      const subSubSectionsPromises = (subSections || []).map(async (sub: any) => {
        const { data: subSubSections, error: subSubError } = await supabase
          .from('hierarchical_sections')
          .select('*')
          .eq('parent_id', sub.id)
          .order('order_index');

        if (subSubError) {
          console.error('Error loading sub-sub sections for', sub.title, ':', subSubError);
          return [];
        }

        return subSubSections || [];
      });

      const subSubSectionsResults = await Promise.all(subSubSectionsPromises);

      // צור סעיפים במבנה הנכון
      const clientsGender = getClientsGender();
      const mainSectionId = generateSectionId();
      
      // עיבוד תוכן הסעיף הראשי עם החלפת מגדר
      let mainContent = selectedMainSection.content || '';
      // הגנה על "עד" שלא ישתנה ל"עדה"
      mainContent = mainContent.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
      // הגנה על "עורך הדין" שלא ישתנה ל"עורך הדין תישא"
      mainContent = mainContent.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|אינו|יהיה)/g, '__LAWYER_VERB__');
      // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
      mainContent = mainContent.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
      mainContent = replaceTextWithGender(mainContent, clientsGender);
      mainContent = mainContent.replace(/עד-ל\s+/g, 'עד ');
      mainContent = mainContent.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
      mainContent = mainContent.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
      // תיקונים נוספים
      mainContent = mainContent.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
      mainContent = mainContent.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
      mainContent = mainContent.replace(/בבקשה עדה/g, 'בבקשה עד');
      mainContent = mainContent.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
      mainContent = mainContent.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
      mainContent = mainContent.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
      mainContent = mainContent.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
      mainContent = mainContent.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
      mainContent = mainContent.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
      
      // חשב את הסדר הנכון - אחרי הסעיף הראשון ולפני שכר טרחה
      const nextOrder = getNextOrder();
      
      const mainSection = {
        id: mainSectionId,
        title: selectedMainSection.title,
        content: mainContent,
        level: 'main' as const,
        order: nextOrder,
        type: 'text' as const
      };

      let currentOrder = nextOrder + 1;
      const allSections: Array<{
        id: string;
        title: string;
        content: string;
        level: 'main' | 'sub' | 'sub-sub';
        parentId?: string;
        order: number;
        type: 'text';
      }> = [mainSection];

      // עבד על תתי סעיפים
      (subSections || []).forEach((sub: any, subIndex: number) => {
        const subSectionId = generateSectionId();
        
        // עיבוד תוכן תת-סעיף עם החלפת מגדר
        let subContent = sub.content || '';
        // הגנה על "עד" שלא ישתנה ל"עדה"
        subContent = subContent.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
        // הגנה על "עורך הדין" שלא ישתנה ל"עורך הדין תישא"
        subContent = subContent.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|אינו|יהיה)/g, '__LAWYER_VERB__');
        // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
        subContent = subContent.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
        subContent = replaceTextWithGender(subContent, clientsGender);
        subContent = subContent.replace(/עד-ל\s+/g, 'עד ');
        subContent = subContent.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
        subContent = subContent.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
        // תיקונים נוספים
        subContent = subContent.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
        subContent = subContent.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
        subContent = subContent.replace(/בבקשה עדה/g, 'בבקשה עד');
        subContent = subContent.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
        subContent = subContent.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
        subContent = subContent.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
        subContent = subContent.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
        subContent = subContent.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
        subContent = subContent.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
        
        const subSection = {
          id: subSectionId,
          title: sub.title,
          content: subContent,
          level: 'sub' as const,
          parentId: mainSectionId,
          order: currentOrder++,
          type: 'text' as const
        };
        allSections.push(subSection);

        // עבד על תת-תת-סעיפים
        const subSubSections = subSubSectionsResults[subIndex] || [];
        subSubSections.forEach((subSub: any) => {
          // עיבוד תוכן תת-תת-סעיף עם החלפת מגדר
          let subSubContent = subSub.content || '';
          // הגנה על "עד" שלא ישתנה ל"עדה"
          subSubContent = subSubContent.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
          // הגנה על "עורך הדין" שלא ישתנה ל"עורך הדין תישא"
          subSubContent = subSubContent.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|אינו|יהיה)/g, '__LAWYER_VERB__');
          // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
          subSubContent = subSubContent.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
          subSubContent = replaceTextWithGender(subSubContent, clientsGender);
          subSubContent = subSubContent.replace(/עד-ל\s+/g, 'עד ');
          subSubContent = subSubContent.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
          subSubContent = subSubContent.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
          // תיקונים נוספים
          subSubContent = subSubContent.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
          subSubContent = subSubContent.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
          subSubContent = subSubContent.replace(/בבקשה עדה/g, 'בבקשה עד');
          subSubContent = subSubContent.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
          subSubContent = subSubContent.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
          subSubContent = subSubContent.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
          subSubContent = subSubContent.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
          subSubContent = subSubContent.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
          subSubContent = subSubContent.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
          
          const subSubSection = {
            id: generateSectionId(),
            title: subSub.title,
            content: subSubContent,
            level: 'sub-sub' as const,
            parentId: subSectionId,
            order: currentOrder++,
            type: 'text' as const
          };
          allSections.push(subSubSection);
        });
      });

      // אסוף את כל המשתנים מכל הסעיפים (רק משתנים שלא קשורים למגדר)
      const allVariables = new Set<string>();
      allSections.forEach(section => {
        const sectionVariables = extractVariablesFromContent(section.content);
        sectionVariables.forEach(v => {
          // הוסף רק משתנים שלא קשורים למגדר
          if (!isGenderRelevantVariable(v)) {
            allVariables.add(v);
          }
        });
      });

      // אם יש משתנים, פתח מודל למילוי משתנים
      if (allVariables.size > 0) {
        const variablesArray = Array.from(allVariables);
        setVariablesModal({
          section: {
            id: mainSectionId,
            title: selectedMainSection.title,
            content: '', // לא נשתמש בתוכן כאן, נשתמש בכל הסעיפים
            variables: variablesArray
          },
          values: variablesArray.reduce((acc, v) => ({ ...acc, [v]: '' }), {}),
          genders: variablesArray.reduce((acc, v) => ({ ...acc, [v]: 'male' as 'male' | 'female' | 'plural' }), {})
        });
        // שמור את הסעיפים הממתינים
        setPendingHierarchicalSections(allSections);
        return;
      }

      // אם אין משתנים, הוסף ישירות
      setCustomSections(prev => [...prev, ...allSections]);

      const totalSubSections = (subSections || []).length;
      const totalSubSubSections = subSubSectionsResults.reduce((sum, arr) => sum + arr.length, 0);
      
      alert(`✅ נטען סעיף "${selectedMainSection.title}" עם ${totalSubSections} תתי סעיפים ו-${totalSubSubSections} תת-תת-סעיפים!`);
    } catch (err) {
      console.error('Error loading hierarchical sections:', err);
      alert('שגיאה בטעינת הסעיפים');
    }
  };

  // שמירת סעיפים היררכיים למאגר ב-Supabase
  const handleSaveHierarchicalSectionToWarehouse = async () => {
    try {
      const { supabase } = await import('@/lib/supabase-client');
      
      // בדוק שהמשתמש מחובר וקבל את ה-user ID מה-session
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        alert('❌ יש להתחבר למערכת כדי לשמור סעיפים למאגר');
        return;
      }

      const userId = authUser.id; // זה ה-JWT claim 'sub' שהרלס policy דורש

      // מצא את כל הסעיפים הראשיים שיש להם תתי סעיפים
      const mainSections = customSections.filter(s => s.level === 'main');
      
      if (mainSections.length === 0) {
        alert('❌ אין סעיפים ראשיים לשמירה. צור סעיף ראשי עם תתי סעיפים תחילה.');
        return;
      }

      // בחר סעיף ראשי לשמירה
      const sectionList = mainSections.map((section, index) => 
        `${index + 1}. ${section.title}`
      ).join('\n');
      
      const choice = prompt(`בחר סעיף ראשי לשמירה למאגר:\n\n${sectionList}\n\nהזן מספר (1-${mainSections.length}):`);
      if (!choice || isNaN(Number(choice))) return;
      
      const sectionIndex = Number(choice) - 1;
      if (sectionIndex < 0 || sectionIndex >= mainSections.length) {
        alert('מספר לא תקין');
        return;
      }

      const selectedMainSection = mainSections[sectionIndex];
      
      // מצא את כל התתי סעיפים והתת-תת-סעיפים
      const subSections = customSections.filter(s => 
        s.level === 'sub' && s.parentId === selectedMainSection.id
      ).sort((a, b) => a.order - b.order);

      // שמור את הסעיף הראשי
      const { data: mainSectionData, error: mainError } = await supabase
        .from('hierarchical_sections')
        .insert({
          user_id: userId,
          title: selectedMainSection.title || 'סעיף ללא כותרת',
          content: selectedMainSection.content || '',
          level: 'main',
          parent_id: null,
          order_index: selectedMainSection.order || 0,
          category: 'fee_agreement',
          tags: ['הסכם שכר טרחה', 'סעיף היררכי'],
          is_public: false,
          is_hidden: false,
          created_by: userId
        })
        .select()
        .single();

      if (mainError) {
        console.error('Error saving main section:', mainError);
        alert('❌ שגיאה בשמירת הסעיף הראשי');
        return;
      }

      const mainSectionId = mainSectionData.id;
      let savedCount = 1; // הסעיף הראשי

      // שמור את כל התתי סעיפים
      for (let i = 0; i < subSections.length; i++) {
        const subSection = subSections[i];
        
        // שמור את התת-סעיף
        const { data: subSectionData, error: subError } = await supabase
          .from('hierarchical_sections')
          .insert({
            user_id: userId,
            title: subSection.title || 'תת-סעיף ללא כותרת',
            content: subSection.content || '',
            level: 'sub',
            parent_id: mainSectionId,
            order_index: subSection.order || 0,
            category: 'fee_agreement',
            tags: ['הסכם שכר טרחה', 'תת-סעיף'],
            is_public: false,
            is_hidden: false,
            created_by: userId
          })
          .select()
          .single();

        if (subError) {
          console.error('Error saving sub section:', subError);
          continue;
        }

        savedCount++;
        const subSectionId = subSectionData.id;

        // מצא ושמור את כל התת-תת-סעיפים של התת-סעיף הזה
        const subSubSections = customSections.filter(s => 
          s.level === 'sub-sub' && s.parentId === subSection.id
        ).sort((a, b) => a.order - b.order);

        for (const subSubSection of subSubSections) {
          const { error: subSubError } = await supabase
            .from('hierarchical_sections')
            .insert({
              user_id: userId,
              title: subSubSection.title || 'תת-תת-סעיף ללא כותרת',
              content: subSubSection.content || '',
              level: 'sub-sub',
              parent_id: subSectionId,
              order_index: subSubSection.order || 0,
              category: 'fee_agreement',
              tags: ['הסכם שכר טרחה', 'תת-תת-סעיף'],
              is_public: false,
              is_hidden: false,
              created_by: userId
            });

          if (!subSubError) {
            savedCount++;
          }
        }
      }

      alert(`✅ הסעיף "${selectedMainSection.title}" נשמר למאגר עם ${savedCount - 1} תתי סעיפים!`);
    } catch (err: any) {
      console.error('Error saving hierarchical section:', err);
      const errorMessage = err?.message || 'שגיאה לא ידועה';
      alert(`❌ שגיאה בשמירת הסעיף למאגר: ${errorMessage}`);
    }
  };
  
  // חלון מילוי משתנים
  const [variablesModal, setVariablesModal] = useState<{
    section: { id: string; title: string; content: string; variables: string[] };
    values: Record<string, string>;
    genders: Record<string, 'male' | 'female' | 'plural'>;
  } | null>(null);

  // State לסעיפים היררכיים ממתינים (לפני מילוי משתנים)
  const [pendingHierarchicalSections, setPendingHierarchicalSections] = useState<Array<{
    id: string;
    title: string;
    content: string;
    level: 'main' | 'sub' | 'sub-sub';
    parentId?: string;
    order: number;
    type: 'text';
  }> | null>(null);

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
      updatedText = updatedText.replace(/_______ ש"ח/g, `${formattedAmount} ש"ח + מע"מ`);
      updatedText = updatedText.replace(/________ ש"ח/g, `${formattedAmount} ש"ח + מע"מ`);
    }
    
    // הסרת שורות עם שדות לא רלוונטיים
    updatedText = updatedText.replace(/1\.2\. בית המשפט\/בית הדין:.*?\n/g, '');
    updatedText = updatedText.replace(/1\.4\. רמת מורכבות:.*?\n/g, '');
    
    return updatedText;
  };

  // טעינת הסעיף הראשון והסעיפים הקבועים
  useEffect(() => {
    if (selectedServiceType) {
      // עדכון פרטי התיק
      const serviceScopeMapping = (feeAgreementTemplates.preamble?.serviceScopeMapping || {}) as Record<string, string>;
      const serviceName = Object.keys(serviceScopeMapping).find(key => 
        key === selectedServiceType || 
        serviceScopeMapping[key]?.includes(selectedServiceType)
      ) || selectedServiceType;
      
      setAgreementData(prev => ({
        ...prev,
        case: {
          subject: serviceName
        }
      }));

      // טעינת הסעיף הראשון
      const firstSectionTemplate = feeAgreementTemplates.preamble?.firstSection?.text || '';
      const clientsGender = getClientsGender();
      const multipleClients = agreementData.clients.length > 1;
      
      let firstSectionText = firstSectionTemplate;
      
      // החלפת משתנים - קודם כל המשתנים הספציפיים
      firstSectionText = firstSectionText.replace(/\{\{תיאור העניין\}\}/g, agreementData.case?.subject || serviceName || '[תיאור העניין]');
      firstSectionText = firstSectionText.replace(/\{\{תיאור השירותים\}\}/g, agreementData.case?.subject || serviceName || '[תיאור השירותים]');
      firstSectionText = firstSectionText.replace(/\{\{serviceType\}\}/g, serviceName);
      
      // החלפת דפוסים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
      firstSectionText = replaceFeeAgreementTemplateTextWithGender(firstSectionText, clientsGender);
      
      // הגנה על "עד" שלא ישתנה ל"עדה" - גם כשהוא לא לפני "ל"
      firstSectionText = firstSectionText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
      // הגנה על "עורך הדין" שלא ישתנה ל"עורך הדין תישא"
      firstSectionText = firstSectionText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|אינו|יהיה)/g, '__LAWYER_VERB__');
      // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
      firstSectionText = firstSectionText.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
      
      // הגנה על "עורך הדין" לפני החלפת מגדר
      const lawyerPlaceholders: { [key: string]: string } = {};
      let lawyerPlaceholderIndex = 0;
      firstSectionText = firstSectionText.replace(/עורך הדין/g, (match: string) => {
        const placeholder = `__LAWYER_${lawyerPlaceholderIndex}__`;
        lawyerPlaceholders[placeholder] = match;
        lawyerPlaceholderIndex++;
        return placeholder;
      });
      
      // החלפת מגדר (רק על הטקסט שלא מוגן)
      firstSectionText = replaceTextWithGender(firstSectionText, clientsGender);
      
      // החזרת "עורך הדין"
      Object.keys(lawyerPlaceholders).forEach(placeholder => {
        firstSectionText = firstSectionText.replace(new RegExp(placeholder, 'g'), lawyerPlaceholders[placeholder]);
      });
      firstSectionText = firstSectionText.replace(/עד-ל\s+/g, 'עד ');
      firstSectionText = firstSectionText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
      firstSectionText = firstSectionText.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
      // תיקונים נוספים
      firstSectionText = firstSectionText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד)/g, 'עד $1');
      firstSectionText = firstSectionText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
      firstSectionText = firstSectionText.replace(/בבקשה עדה/g, 'בבקשה עד');
      firstSectionText = firstSectionText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
      firstSectionText = firstSectionText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
      firstSectionText = firstSectionText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
      firstSectionText = firstSectionText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
      firstSectionText = firstSectionText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
      firstSectionText = firstSectionText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
      
      // יצירת הסעיף הראשון
      const firstSection = {
        id: 'first-section-fixed',
        title: 'תיאור השירות',
        content: firstSectionText,
        level: 'main' as const,
        order: 1
      };

      // טעינת הסעיפים הקבועים מ-generalClauses
      const generalSections: Array<{
        id: string;
        title: string;
        content: string;
        level: 'main' | 'sub' | 'sub-sub';
        parentId?: string;
        order: number;
      }> = [];
      
      let orderCounter = 1000; // התחלה גבוהה כדי שיהיו אחרי הסעיפים ההיררכיים
      
      // סדר הקטגוריות - לפי הסדר הנכון של הסעיפים
      // 1. תיאור השירות (firstSection - כבר קיים)
      // 2. שכר טרחה עבור השירות (נוצר דינמית)
      // 3. סעיפים ממחסן הסעיפים (custom sections - כבר קיים)
      // 4-16. הסעיפים הקבועים:
      const categoryOrder = [
        'התחייבויות_עורך_הדין',
        'התחייבויות_הלקוח',
        'סודיות',
        'ניגוד_עניינים',
        'חתימה_אלקטרונית',
        'הוצאות_נוספות',
        'תקופת_ההתקשרות',
        'ביטול_והפסקת_ייצוג',
        'שינויים_והוספות',
        'תקשורת',
        'הודעות',
        'סמכות_שיפוט',
        'שונות'
      ];
      
      categoryOrder.forEach(categoryKey => {
        const category = feeAgreementTemplates.generalClauses?.[categoryKey as keyof typeof feeAgreementTemplates.generalClauses];
        if (category && Array.isArray(category)) {
          category.forEach((clause: any) => {
            // עיבוד תוכן הסעיף הראשי
            let clauseText = clause.text || '';
            if (clauseText) {
              // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
              clauseText = replaceFeeAgreementTemplateTextWithGender(clauseText, clientsGender);
              
              // הגנה על ביטויים שצריכים להישאר ללא שינוי
              const protectedPhrases: { [key: string]: string } = {};
              let protectedIndex = 0;
              
              // הגן על "עורך הדין" וכל מה שקשור אליו - לפני החלפת מגדר
              clauseText = clauseText.replace(/עורך הדין/g, (match: string) => {
                const placeholder = `__LAWYER_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                const placeholder = `__LAWYER_NO_HEY_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              
              // הגן על "שכר טרחה" שלא ישתנה
              clauseText = clauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                const placeholder = `__FEE_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                const placeholder = `__FEE_THE_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                const placeholder = `__FEE_OF_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              
              // הגן על "מלא" שלא ישתנה ל"מלאה"
              clauseText = clauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                const placeholder = `__FULL_INFO_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                const placeholder = `__NOT_FULL_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              
              // הגן על "מלאים" שלא ישתנה (תמיד "מלא")
              clauseText = clauseText.replace(/\bמלאים\b/g, (match: string) => {
                const placeholder = `__FULL_MAS_PLURAL_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              
              // הגן על "עד" שלא ישתנה ל"עדה" - גם כשהוא לא לפני "ל"
              clauseText = clauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
              
              // הגן על "עד" בביטוי "בימים א' עד ה'"
              clauseText = clauseText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
              
              // הגן על "עורך הדין" שלא ישתנה ל"עורך הדין תישא" או "יישאו" - לפני החלפת מגדר
              // (ההגנה הזו תתבצע אחרי החזרת ה-placeholders)
              
              // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
              clauseText = clauseText.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
              
              // החלפת מגדר (רק על הטקסט שלא מוגן)
              clauseText = replaceTextWithGender(clauseText, clientsGender);
              
              // החזרת הביטויים המוגנים
              clauseText = clauseText.replace(/עד-ל\s+/g, 'עד ');
              clauseText = clauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
              clauseText = clauseText.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
              clauseText = clauseText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
              clauseText = clauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
              clauseText = clauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
              clauseText = clauseText.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
              clauseText = clauseText.replace(/בבקשה עדה/g, 'בבקשה עד');
              clauseText = clauseText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
              clauseText = clauseText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
              clauseText = clauseText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
              clauseText = clauseText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
              Object.keys(protectedPhrases).forEach(placeholder => {
                clauseText = clauseText.replace(new RegExp(placeholder, 'g'), protectedPhrases[placeholder]);
              });
              
              // תיקונים נוספים
              clauseText = clauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
              clauseText = clauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
              clauseText = clauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
              clauseText = clauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
              clauseText = clauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
              clauseText = clauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
              clauseText = clauseText.replace(/מידע מלאה/g, 'מידע מלא');
              clauseText = clauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
              clauseText = clauseText.replace(/מלאים\b/g, 'מלא');
              clauseText = clauseText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
              clauseText = clauseText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
              clauseText = clauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
              clauseText = clauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
              clauseText = clauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
              clauseText = clauseText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
              clauseText = clauseText.replace(/תשלום באיחור תישא/g, 'תשלום באיחור יישא');
              clauseText = clauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
              clauseText = clauseText.replace(/בעלת פה/g, 'בעל פה');
              clauseText = clauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
              clauseText = clauseText.replace(/מלאה, שלמה/g, 'מלא, שלם');
              clauseText = clauseText.replace(/מלאה.*שלמה/g, 'מלא, שלם');
              clauseText = clauseText.replace(/באופן מלאה/g, 'באופן מלא');
              clauseText = clauseText.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
              clauseText = clauseText.replace(/עדה שתי/g, 'עד שתי');
              clauseText = clauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי)/g, 'עד $1');
              clauseText = clauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
              
              // עיבוד הכותרת גם כן
              let clauseTitle = clause.title || '';
              if (clauseTitle) {
                clauseTitle = replaceFeeAgreementTemplateTextWithGender(clauseTitle, clientsGender);
              }
              
              const mainSectionId = `gen_${clause.id || orderCounter}`;
              generalSections.push({
                id: mainSectionId,
                title: clauseTitle,
                content: clauseText,
                level: 'main' as const,
                order: orderCounter++
              });
              
              // עיבוד תתי-סעיפים (subSections)
              if (clause.subSections && Array.isArray(clause.subSections)) {
                clause.subSections.forEach((subClause: any, subIndex: number) => {
                  let subClauseText = subClause.text || '';
                  if (subClauseText) {
                    // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
                    subClauseText = replaceFeeAgreementTemplateTextWithGender(subClauseText, clientsGender);
                    
                    // הגנה על ביטויים שצריכים להישאר ללא שינוי (אותו קוד כמו למעלה)
                    const subProtectedPhrases2: { [key: string]: string } = {};
                    let subProtectedIndex2 = 0;
                    
                    subClauseText = subClauseText.replace(/עורך הדין/g, (match: string) => {
                      const placeholder = `__LAWYER_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                      const placeholder = `__LAWYER_NO_HEY_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_THE_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                      const placeholder = `__FEE_OF_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                      const placeholder = `__FULL_INFO_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                      const placeholder = `__NOT_FULL_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bמלאים\b/g, (match: string) => {
                      const placeholder = `__FULL_MAS_PLURAL_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
                    subClauseText = subClauseText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
                    subClauseText = subClauseText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
                    subClauseText = subClauseText.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
                    subClauseText = replaceTextWithGender(subClauseText, clientsGender);
                    subClauseText = subClauseText.replace(/עד-ל\s+/g, 'עד ');
                    subClauseText = subClauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
                    subClauseText = subClauseText.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
                    subClauseText = subClauseText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
                    Object.keys(subProtectedPhrases2).forEach(placeholder => {
                      subClauseText = subClauseText.replace(new RegExp(placeholder, 'g'), subProtectedPhrases2[placeholder]);
                    });
                    subClauseText = subClauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
                    subClauseText = subClauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
                    subClauseText = subClauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
                    subClauseText = subClauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
                    subClauseText = subClauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
                    subClauseText = subClauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
                    subClauseText = subClauseText.replace(/מידע מלאה/g, 'מידע מלא');
                    subClauseText = subClauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
                    subClauseText = subClauseText.replace(/מלאים\b/g, 'מלא');
                    subClauseText = subClauseText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
                    subClauseText = subClauseText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
                    subClauseText = subClauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
                    subClauseText = subClauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
                    subClauseText = subClauseText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
                    subClauseText = subClauseText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
                    subClauseText = subClauseText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
                    subClauseText = subClauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
                    subClauseText = subClauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
                    subClauseText = subClauseText.replace(/בעלת פה/g, 'בעל פה');
                    subClauseText = subClauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
                    subClauseText = subClauseText.replace(/מלאה, שלמה/g, 'מלא, שלם');
                    subClauseText = subClauseText.replace(/מלאה.*שלמה/g, 'מלא, שלם');
                    subClauseText = subClauseText.replace(/באופן מלאה/g, 'באופן מלא');
                    subClauseText = subClauseText.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
                    subClauseText = subClauseText.replace(/עדה שתי/g, 'עד שתי');
                    subClauseText = subClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
                    subClauseText = subClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                    subClauseText = subClauseText.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
                    subClauseText = subClauseText.replace(/בבקשה עדה/g, 'בבקשה עד');
                    subClauseText = subClauseText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
                    
                    const subSectionId = `gen_${subClause.id || `${clause.id}_${subIndex}`}`;
                    generalSections.push({
                      id: subSectionId,
                      title: subClause.title || '',
                      content: subClauseText,
                      level: 'sub' as const,
                      parentId: mainSectionId,
                      order: orderCounter++
                    });
                    
                    // עיבוד תתי-תתי-סעיפים (subSubSections)
                    if (subClause.subSubSections && Array.isArray(subClause.subSubSections)) {
                      subClause.subSubSections.forEach((subSubClause: any, subSubIndex: number) => {
                        let subSubClauseText = subSubClause.text || '';
                        if (subSubClauseText) {
                          // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
                          subSubClauseText = replaceFeeAgreementTemplateTextWithGender(subSubClauseText, clientsGender);
                          
                          // הגנה על ביטויים שצריכים להישאר ללא שינוי
                          const subSubProtectedPhrases: { [key: string]: string } = {};
                          let subSubProtectedIndex = 0;
                          
                          subSubClauseText = subSubClauseText.replace(/עורך הדין/g, (match: string) => {
                            const placeholder = `__LAWYER_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                            const placeholder = `__LAWYER_NO_HEY_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                            const placeholder = `__FEE_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                            const placeholder = `__FEE_THE_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                            const placeholder = `__FEE_OF_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                            const placeholder = `__FULL_INFO_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                            const placeholder = `__NOT_FULL_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bמלאים\b/g, (match: string) => {
                            const placeholder = `__FULL_MAS_PLURAL_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
                          subSubClauseText = subSubClauseText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
                          subSubClauseText = subSubClauseText.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
                          subSubClauseText = replaceTextWithGender(subSubClauseText, clientsGender);
                          subSubClauseText = subSubClauseText.replace(/עד-ל\s+/g, 'עד ');
                          subSubClauseText = subSubClauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
                          subSubClauseText = subSubClauseText.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
                          subSubClauseText = subSubClauseText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
                          Object.keys(subSubProtectedPhrases).forEach(placeholder => {
                            subSubClauseText = subSubClauseText.replace(new RegExp(placeholder, 'g'), subSubProtectedPhrases[placeholder]);
                          });
                          subSubClauseText = subSubClauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
                          subSubClauseText = subSubClauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
                          subSubClauseText = subSubClauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
                          subSubClauseText = subSubClauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
                          subSubClauseText = subSubClauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
                          subSubClauseText = subSubClauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
                          subSubClauseText = subSubClauseText.replace(/מידע מלאה/g, 'מידע מלא');
                          subSubClauseText = subSubClauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
                          subSubClauseText = subSubClauseText.replace(/מלאים\b/g, 'מלא');
                          subSubClauseText = subSubClauseText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
                          subSubClauseText = subSubClauseText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
                          subSubClauseText = subSubClauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
                          subSubClauseText = subSubClauseText.replace(/בעלת פה/g, 'בעל פה');
                          subSubClauseText = subSubClauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
                          subSubClauseText = subSubClauseText.replace(/מלאה, שלמה/g, 'מלא, שלם');
                          subSubClauseText = subSubClauseText.replace(/מלאה.*שלמה/g, 'מלא, שלם');
                          subSubClauseText = subSubClauseText.replace(/באופן מלאה/g, 'באופן מלא');
                          subSubClauseText = subSubClauseText.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
                          subSubClauseText = subSubClauseText.replace(/עדה שתי/g, 'עד שתי');
                          subSubClauseText = subSubClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
                          subSubClauseText = subSubClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                          subSubClauseText = subSubClauseText.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
                          subSubClauseText = subSubClauseText.replace(/בבקשה עדה/g, 'בבקשה עד');
                          subSubClauseText = subSubClauseText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
                          
                          generalSections.push({
                            id: `gen_${subSubClause.id || `${subClause.id}_${subSubIndex}`}`,
                            title: subSubClause.title || '',
                            content: subSubClauseText,
                            level: 'sub-sub' as const,
                            parentId: subSectionId,
                            order: orderCounter++
                          });
                        }
                      });
                    }
                  }
                });
              }
            } else {
              // סעיף ראשי ללא תוכן (רק עם תתי-סעיפים)
              const mainSectionId = `gen_${clause.id || orderCounter}`;
              generalSections.push({
                id: mainSectionId,
                title: clause.title || '',
                content: '',
                level: 'main' as const,
                order: orderCounter++
              });
              
              // עיבוד תתי-סעיפים
              if (clause.subSections && Array.isArray(clause.subSections)) {
                clause.subSections.forEach((subClause: any, subIndex: number) => {
                  let subClauseText = subClause.text || '';
                  if (subClauseText) {
                    // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
                    subClauseText = replaceFeeAgreementTemplateTextWithGender(subClauseText, clientsGender);
                    
                    // הגנה על ביטויים שצריכים להישאר ללא שינוי (אותו קוד כמו למעלה)
                    const subProtectedPhrases3: { [key: string]: string } = {};
                    let subProtectedIndex3 = 0;
                    
                    subClauseText = subClauseText.replace(/עורך הדין/g, (match: string) => {
                      const placeholder = `__LAWYER_${subProtectedIndex3}__`;
                      subProtectedPhrases3[placeholder] = match;
                      subProtectedIndex3++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                      const placeholder = `__LAWYER_NO_HEY_${subProtectedIndex3}__`;
                      subProtectedPhrases3[placeholder] = match;
                      subProtectedIndex3++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_${subProtectedIndex3}__`;
                      subProtectedPhrases3[placeholder] = match;
                      subProtectedIndex3++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_THE_${subProtectedIndex3}__`;
                      subProtectedPhrases3[placeholder] = match;
                      subProtectedIndex3++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                      const placeholder = `__FEE_OF_${subProtectedIndex3}__`;
                      subProtectedPhrases3[placeholder] = match;
                      subProtectedIndex3++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                      const placeholder = `__FULL_INFO_${subProtectedIndex3}__`;
                      subProtectedPhrases3[placeholder] = match;
                      subProtectedIndex3++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                      const placeholder = `__NOT_FULL_${subProtectedIndex3}__`;
                      subProtectedPhrases3[placeholder] = match;
                      subProtectedIndex3++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
                    subClauseText = subClauseText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא)/g, '__LAWYER_VERB__');
                    subClauseText = replaceTextWithGender(subClauseText, clientsGender);
                    subClauseText = subClauseText.replace(/עד-ל\s+/g, 'עד ');
                    subClauseText = subClauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
                    subClauseText = subClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי)/g, 'עד $1');
                    subClauseText = subClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                    Object.keys(subProtectedPhrases3).forEach(placeholder => {
                      subClauseText = subClauseText.replace(new RegExp(placeholder, 'g'), subProtectedPhrases3[placeholder]);
                    });
                    subClauseText = subClauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
                    subClauseText = subClauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
                    subClauseText = subClauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
                    subClauseText = subClauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
                    subClauseText = subClauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
                    subClauseText = subClauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
                    subClauseText = subClauseText.replace(/מידע מלאה/g, 'מידע מלא');
                    subClauseText = subClauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
                    subClauseText = subClauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
                    subClauseText = subClauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
                    subClauseText = subClauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
                    subClauseText = subClauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
                    subClauseText = subClauseText.replace(/בעלת פה/g, 'בעל פה');
                    subClauseText = subClauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
                    subClauseText = subClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי)/g, 'עד $1');
                    subClauseText = subClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                    
                    generalSections.push({
                      id: `gen_${subClause.id || `${clause.id}_${subIndex}`}`,
                      title: subClause.title || '',
                      content: subClauseText,
                      level: 'sub' as const,
                      parentId: mainSectionId,
                      order: orderCounter++
                    });
                  }
                });
              }
            }
          });
        }
      });

      // עדכון הסעיפים - רק הסעיף הראשון
      // הסעיפים ההיררכיים יגיעו מ-Supabase (בחירה ידנית)
      // סעיף שכר הטרחה יגיע אוטומטית (כמו עכשיו)
      // הסעיפים הקבועים יטענו בסוף (בפונקציה נפרדת)
      setCustomSections([firstSection]);
    }
  }, [selectedServiceType, agreementData.clients.length]);

  // טעינת הסעיפים הקבועים בסוף (אחרי שכר הטרחה) - מתעדכן כשמשנים מגדר
  useEffect(() => {
    if (customSections.length > 0) {
      const clientsGender = getClientsGender();
      const generalSections: Array<{
        id: string;
        title: string;
        content: string;
        level: 'main' | 'sub' | 'sub-sub';
        parentId?: string;
        order: number;
      }> = [];
      
      let orderCounter = 10000; // התחלה גבוהה מאוד כדי שיהיו אחרי כל הסעיפים
      
      // סדר הקטגוריות - לפי הסדר הנכון של הסעיפים
      // 1. תיאור השירות (firstSection - כבר קיים)
      // 2. שכר טרחה עבור השירות (נוצר דינמית)
      // 3. סעיפים ממחסן הסעיפים (custom sections - כבר קיים)
      // 4-16. הסעיפים הקבועים:
      const categoryOrder = [
        'התחייבויות_עורך_הדין',
        'התחייבויות_הלקוח',
        'סודיות',
        'ניגוד_עניינים',
        'חתימה_אלקטרונית',
        'הוצאות_נוספות',
        'תקופת_ההתקשרות',
        'ביטול_והפסקת_ייצוג',
        'שינויים_והוספות',
        'תקשורת',
        'הודעות',
        'סמכות_שיפוט',
        'שונות'
      ];
      
      categoryOrder.forEach(categoryKey => {
        const category = feeAgreementTemplates.generalClauses?.[categoryKey as keyof typeof feeAgreementTemplates.generalClauses];
        if (category && Array.isArray(category)) {
          category.forEach((clause: any) => {
            // עיבוד תוכן הסעיף הראשי
            let clauseText = clause.text || '';
            if (clauseText) {
              // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
              clauseText = replaceFeeAgreementTemplateTextWithGender(clauseText, clientsGender);
              
              // הגנה על ביטויים שצריכים להישאר ללא שינוי
              const protectedPhrases: { [key: string]: string } = {};
              let protectedIndex = 0;
              
              clauseText = clauseText.replace(/עורך הדין/g, (match: string) => {
                const placeholder = `__LAWYER_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                const placeholder = `__LAWYER_NO_HEY_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                const placeholder = `__FEE_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                const placeholder = `__FEE_THE_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                const placeholder = `__FEE_OF_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                const placeholder = `__FULL_INFO_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                const placeholder = `__NOT_FULL_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bמלאים\b/g, (match: string) => {
                const placeholder = `__FULL_MAS_PLURAL_${protectedIndex}__`;
                protectedPhrases[placeholder] = match;
                protectedIndex++;
                return placeholder;
              });
              clauseText = clauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
              clauseText = clauseText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
              clauseText = clauseText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
              clauseText = clauseText.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
              clauseText = replaceTextWithGender(clauseText, clientsGender);
              clauseText = clauseText.replace(/עד-ל\s+/g, 'עד ');
              clauseText = clauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
              clauseText = clauseText.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
              clauseText = clauseText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
              clauseText = clauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
              clauseText = clauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
              clauseText = clauseText.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
              clauseText = clauseText.replace(/בבקשה עדה/g, 'בבקשה עד');
              clauseText = clauseText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
              clauseText = clauseText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
              clauseText = clauseText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
              clauseText = clauseText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
              Object.keys(protectedPhrases).forEach(placeholder => {
                clauseText = clauseText.replace(new RegExp(placeholder, 'g'), protectedPhrases[placeholder]);
              });
              clauseText = clauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
              clauseText = clauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
              clauseText = clauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
              clauseText = clauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
              clauseText = clauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
              clauseText = clauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
              clauseText = clauseText.replace(/מידע מלאה/g, 'מידע מלא');
              clauseText = clauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
              clauseText = clauseText.replace(/מלאים\b/g, 'מלא');
              clauseText = clauseText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
              clauseText = clauseText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
              clauseText = clauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
              clauseText = clauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
              clauseText = clauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
              clauseText = clauseText.replace(/תשלום באיחור תישא/g, 'תשלום באיחור יישא');
              clauseText = clauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
              clauseText = clauseText.replace(/בעלת פה/g, 'בעל פה');
              clauseText = clauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
              clauseText = clauseText.replace(/מלאה, שלמה/g, 'מלא, שלם');
              clauseText = clauseText.replace(/מלאה.*שלמה/g, 'מלא, שלם');
              clauseText = clauseText.replace(/באופן מלאה/g, 'באופן מלא');
              clauseText = clauseText.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
              clauseText = clauseText.replace(/עדה שתי/g, 'עד שתי');
              
              const mainSectionId = `gen_${clause.id || orderCounter}`;
              generalSections.push({
                id: mainSectionId,
                title: clause.title || '',
                content: clauseText,
          level: 'main' as const,
                order: orderCounter++
              });
              
              // עיבוד תתי-סעיפים (subSections)
              if (clause.subSections && Array.isArray(clause.subSections)) {
                clause.subSections.forEach((subClause: any, subIndex: number) => {
                  let subClauseText = subClause.text || subClause.content || '';
                  if (subClauseText && subClauseText.trim() !== '') {
                    // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
                    subClauseText = replaceFeeAgreementTemplateTextWithGender(subClauseText, clientsGender);
                    
                    // הגנה על ביטויים שצריכים להישאר ללא שינוי
                    const subProtectedPhrases: { [key: string]: string } = {};
                    let subProtectedIndex = 0;
                    
                    subClauseText = subClauseText.replace(/עורך הדין/g, (match: string) => {
                      const placeholder = `__LAWYER_${subProtectedIndex}__`;
                      subProtectedPhrases[placeholder] = match;
                      subProtectedIndex++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                      const placeholder = `__LAWYER_NO_HEY_${subProtectedIndex}__`;
                      subProtectedPhrases[placeholder] = match;
                      subProtectedIndex++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_${subProtectedIndex}__`;
                      subProtectedPhrases[placeholder] = match;
                      subProtectedIndex++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_THE_${subProtectedIndex}__`;
                      subProtectedPhrases[placeholder] = match;
                      subProtectedIndex++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                      const placeholder = `__FEE_OF_${subProtectedIndex}__`;
                      subProtectedPhrases[placeholder] = match;
                      subProtectedIndex++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                      const placeholder = `__FULL_INFO_${subProtectedIndex}__`;
                      subProtectedPhrases[placeholder] = match;
                      subProtectedIndex++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                      const placeholder = `__NOT_FULL_${subProtectedIndex}__`;
                      subProtectedPhrases[placeholder] = match;
                      subProtectedIndex++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
                    subClauseText = subClauseText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא)/g, '__LAWYER_VERB__');
                    subClauseText = replaceTextWithGender(subClauseText, clientsGender);
                    subClauseText = subClauseText.replace(/עד-ל\s+/g, 'עד ');
                    subClauseText = subClauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
                    subClauseText = subClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי)/g, 'עד $1');
                    subClauseText = subClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                    Object.keys(subProtectedPhrases).forEach(placeholder => {
                      subClauseText = subClauseText.replace(new RegExp(placeholder, 'g'), subProtectedPhrases[placeholder]);
                    });
                    subClauseText = subClauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
                    subClauseText = subClauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
                    subClauseText = subClauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
                    subClauseText = subClauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
                    subClauseText = subClauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
                    subClauseText = subClauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
                    subClauseText = subClauseText.replace(/מידע מלאה/g, 'מידע מלא');
                    subClauseText = subClauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
                    subClauseText = subClauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
                    subClauseText = subClauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
                    subClauseText = subClauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
                    subClauseText = subClauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
                    subClauseText = subClauseText.replace(/בעלת פה/g, 'בעל פה');
                    subClauseText = subClauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
                    subClauseText = subClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי)/g, 'עד $1');
                    subClauseText = subClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                    
                    generalSections.push({
                      id: `gen_${subClause.id || `${clause.id}_${subIndex}`}`,
                      title: subClause.title || '',
                      content: subClauseText,
                      level: 'sub' as const,
                      parentId: mainSectionId,
                      order: orderCounter++
                    });
                  }
                });
              }
            } else {
              // סעיף ראשי ללא תוכן (רק עם תתי-סעיפים)
              const mainSectionId = `gen_${clause.id || orderCounter}`;
              generalSections.push({
                id: mainSectionId,
                title: clause.title || '',
                content: '',
                level: 'main' as const,
                order: orderCounter++
              });
              
              // עיבוד תתי-סעיפים
              if (clause.subSections && Array.isArray(clause.subSections)) {
                clause.subSections.forEach((subClause: any, subIndex: number) => {
                  let subClauseText = subClause.text || subClause.content || '';
                  if (subClauseText && subClauseText.trim() !== '') {
                    // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
                    subClauseText = replaceFeeAgreementTemplateTextWithGender(subClauseText, clientsGender);
                    
                    // הגנה על ביטויים שצריכים להישאר ללא שינוי
                    const subProtectedPhrases2: { [key: string]: string } = {};
                    let subProtectedIndex2 = 0;
                    
                    subClauseText = subClauseText.replace(/עורך הדין/g, (match: string) => {
                      const placeholder = `__LAWYER_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                      const placeholder = `__LAWYER_NO_HEY_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                      const placeholder = `__FEE_THE_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                      const placeholder = `__FEE_OF_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                      const placeholder = `__FULL_INFO_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                      const placeholder = `__NOT_FULL_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bמלאים\b/g, (match: string) => {
                      const placeholder = `__FULL_MAS_PLURAL_${subProtectedIndex2}__`;
                      subProtectedPhrases2[placeholder] = match;
                      subProtectedIndex2++;
                      return placeholder;
                    });
                    subClauseText = subClauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
                    subClauseText = subClauseText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
                    subClauseText = subClauseText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
                    subClauseText = subClauseText.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
                    subClauseText = replaceTextWithGender(subClauseText, clientsGender);
                    subClauseText = subClauseText.replace(/עד-ל\s+/g, 'עד ');
                    subClauseText = subClauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
                    subClauseText = subClauseText.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
                    subClauseText = subClauseText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
                    Object.keys(subProtectedPhrases2).forEach(placeholder => {
                      subClauseText = subClauseText.replace(new RegExp(placeholder, 'g'), subProtectedPhrases2[placeholder]);
                    });
                    subClauseText = subClauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
                    subClauseText = subClauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
                    subClauseText = subClauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
                    subClauseText = subClauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
                    subClauseText = subClauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
                    subClauseText = subClauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
                    subClauseText = subClauseText.replace(/מידע מלאה/g, 'מידע מלא');
                    subClauseText = subClauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
                    subClauseText = subClauseText.replace(/מלאים\b/g, 'מלא');
                    subClauseText = subClauseText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
                    subClauseText = subClauseText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
                    subClauseText = subClauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
                    subClauseText = subClauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
                    subClauseText = subClauseText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
                    subClauseText = subClauseText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
                    subClauseText = subClauseText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
                    subClauseText = subClauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
                    subClauseText = subClauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
                    subClauseText = subClauseText.replace(/בעלת פה/g, 'בעל פה');
                    subClauseText = subClauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
                    subClauseText = subClauseText.replace(/מלאה, שלמה/g, 'מלא, שלם');
                    subClauseText = subClauseText.replace(/מלאה.*שלמה/g, 'מלא, שלם');
                    subClauseText = subClauseText.replace(/באופן מלאה/g, 'באופן מלא');
                    subClauseText = subClauseText.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
                    subClauseText = subClauseText.replace(/עדה שתי/g, 'עד שתי');
                    subClauseText = subClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
                    subClauseText = subClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                    subClauseText = subClauseText.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
                    subClauseText = subClauseText.replace(/בבקשה עדה/g, 'בבקשה עד');
                    subClauseText = subClauseText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
                    
                    const subSectionId = `gen_${subClause.id || `${clause.id}_${subIndex}`}`;
                    generalSections.push({
                      id: subSectionId,
                      title: subClause.title || '',
                      content: subClauseText,
                      level: 'sub' as const,
                      parentId: mainSectionId,
                      order: orderCounter++
                    });
                    
                    // עיבוד תתי-תתי-סעיפים (subSubSections)
                    if (subClause.subSubSections && Array.isArray(subClause.subSubSections)) {
                      subClause.subSubSections.forEach((subSubClause: any, subSubIndex: number) => {
                        let subSubClauseText = subSubClause.text || '';
                        if (subSubClauseText) {
                          // החלפת משתנים באמצעות הפונקציות החדשות (מטפלת בכפילות ה')
                          subSubClauseText = replaceFeeAgreementTemplateTextWithGender(subSubClauseText, clientsGender);
                          
                          // הגנה על ביטויים שצריכים להישאר ללא שינוי
                          const subSubProtectedPhrases: { [key: string]: string } = {};
                          let subSubProtectedIndex = 0;
                          
                          subSubClauseText = subSubClauseText.replace(/עורך הדין/g, (match: string) => {
                            const placeholder = `__LAWYER_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/עורך דין(?! בעל)/g, (match: string) => {
                            const placeholder = `__LAWYER_NO_HEY_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bשכר טרחה\b/g, (match: string) => {
                            const placeholder = `__FEE_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bשכר הטרחה\b/g, (match: string) => {
                            const placeholder = `__FEE_THE_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bשכר טרחת\b/g, (match: string) => {
                            const placeholder = `__FEE_OF_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bמידע מלא\b/g, (match: string) => {
                            const placeholder = `__FULL_INFO_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bבלתי מלא\b/g, (match: string) => {
                            const placeholder = `__NOT_FULL_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bמלאים\b/g, (match: string) => {
                            const placeholder = `__FULL_MAS_PLURAL_${subSubProtectedIndex}__`;
                            subSubProtectedPhrases[placeholder] = match;
                            subSubProtectedIndex++;
                            return placeholder;
                          });
                          subSubClauseText = subSubClauseText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, 'עד-ל ');
                          subSubClauseText = subSubClauseText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
                          subSubClauseText = subSubClauseText.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
                          subSubClauseText = replaceTextWithGender(subSubClauseText, clientsGender);
                          subSubClauseText = subSubClauseText.replace(/עד-ל\s+/g, 'עד ');
                          subSubClauseText = subSubClauseText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
                          subSubClauseText = subSubClauseText.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
                          subSubClauseText = subSubClauseText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
                          Object.keys(subSubProtectedPhrases).forEach(placeholder => {
                            subSubClauseText = subSubClauseText.replace(new RegExp(placeholder, 'g'), subSubProtectedPhrases[placeholder]);
                          });
                          subSubClauseText = subSubClauseText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
                          subSubClauseText = subSubClauseText.replace(/היא עורך דין/g, 'הוא עורך דין');
                          subSubClauseText = subSubClauseText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
                          subSubClauseText = subSubClauseText.replace(/שכרה טרחה/g, 'שכר טרחה');
                          subSubClauseText = subSubClauseText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
                          subSubClauseText = subSubClauseText.replace(/שכרה טרחת/g, 'שכר טרחת');
                          subSubClauseText = subSubClauseText.replace(/מידע מלאה/g, 'מידע מלא');
                          subSubClauseText = subSubClauseText.replace(/בלתי מלאה/g, 'בלתי מלא');
                          subSubClauseText = subSubClauseText.replace(/מלאים\b/g, 'מלא');
                          subSubClauseText = subSubClauseText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
                          subSubClauseText = subSubClauseText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
                          subSubClauseText = subSubClauseText.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
                          subSubClauseText = subSubClauseText.replace(/מלאה ומיידי/g, 'מלא ומיידי');
                          subSubClauseText = subSubClauseText.replace(/בעלת פה/g, 'בעל פה');
                          subSubClauseText = subSubClauseText.replace(/שיפוי מלאה/g, 'שיפוי מלא');
                          subSubClauseText = subSubClauseText.replace(/מלאה, שלמה/g, 'מלא, שלם');
                          subSubClauseText = subSubClauseText.replace(/מלאה.*שלמה/g, 'מלא, שלם');
                          subSubClauseText = subSubClauseText.replace(/באופן מלאה/g, 'באופן מלא');
                          subSubClauseText = subSubClauseText.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
                          subSubClauseText = subSubClauseText.replace(/עדה שתי/g, 'עד שתי');
                          subSubClauseText = subSubClauseText.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
                          subSubClauseText = subSubClauseText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                          subSubClauseText = subSubClauseText.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
                          subSubClauseText = subSubClauseText.replace(/בבקשה עדה/g, 'בבקשה עד');
                          subSubClauseText = subSubClauseText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
                          
                          generalSections.push({
                            id: `gen_${subSubClause.id || `${subClause.id}_${subSubIndex}`}`,
                            title: subSubClause.title || '',
                            content: subSubClauseText,
                            level: 'sub-sub' as const,
                            parentId: subSectionId,
                            order: orderCounter++
                          });
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });

      // עדכן את הסעיפים הקבועים (הסר את הישנים והוסף את החדשים)
      setCustomSections(prev => {
        const withoutGeneral = prev.filter(s => !s.id.startsWith('gen_'));
        return [...withoutGeneral, ...generalSections];
      });
    }
  }, [customSections.length, agreementData.clients[0]?.gender, agreementData.clients.length]);

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
      // user_id לא צריך להישלח - ה-hook מוסיף אותו בפנים
      await addSection({
        title: section.title || 'סעיף ללא כותרת',
        content: section.content || '',
        category: section.category || 'custom',
        service_type: selectedServiceType || 'general',
        tags: ['הסכם שכר טרחה', 'סעיף מותאם אישית'],
        usage_count: 0,
        average_rating: 5.0,
        is_public: false,
        is_hidden: false,
        created_by: currentUser?.id || 'anonymous'
      });
      alert('✅ סעיף נשמר למחסן האישי!');
    } catch (error: any) {
      console.error('Error saving to warehouse:', error);
      const errorMessage = error?.message || error?.details || 'שגיאה לא ידועה';
      alert(`❌ שגיאה בשמירה למחסן: ${errorMessage}`);
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
    if (!matches) return [];
    
    // חלץ משתנים ייחודיים, אבל דלג על משתנים מורכבים (multipleClients, gender)
    const variables = matches
      .map(match => match.replace(/\{\{|\}\}/g, ''))
      .filter(v => {
        // דלג על משתנים מורכבים שכבר מטופלים אוטומטית
        if (v.startsWith('multipleClients:') || v.startsWith('gender:')) {
          return false;
        }
        return true;
      });
    
    return [...new Set(variables)];
  };

  const handleSelectFromWarehouse = async (warehouseSection: any) => {
    
    // זיהוי משתנים (רק משתנים שלא קשורים למגדר)
    const allVariables = extractVariablesFromContent(warehouseSection.content);
    const variables = allVariables.filter(v => !isGenderRelevantVariable(v));
    
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
      'זכאי', 'מתחייב', 'מסכים', 'מבקש', 'מצהיר', 'מאשר',
      'לקוח', 'לקוחה', 'לקוחות' // משתנים הקשורים ללקוח - מטופלים אוטומטית
    ];
    
    // כל משתנה שמכיל | (pipe) נחשב כקשור למגדר - זה הדפוס שהמערכת משתמשת בו למגדר
    const hasGenderPattern = /\|/.test(variable);
    
    // בדיקה אם המשתנה מכיל מילים רגישות למגדר
    const genderKeywords = ['ילד', 'אפוטרופוס', 'בן', 'בת', 'הוא', 'היא', 'רשאי', 'אחראי', 'מחויב', 'יכול', 'צריך', 'חייב', 'זכאי', 'מתחייב', 'מסכים', 'מבקש', 'מצהיר', 'מאשר', 'אליה', 'אליו', 'אליהם', 'אליהן', 'בעניינה', 'בעניינו', 'בעניינם', 'בעניינן', 'לקוח'];
    const containsGenderKeyword = genderKeywords.some(keyword => variable.includes(keyword));
    
    return genderRelevantVariables.includes(variable) || hasGenderPattern || containsGenderKeyword;
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


  // פונקציה לקבלת מגדר הלקוח/ה
  const getClientsGender = (): 'male' | 'female' | 'plural' => {
    if (agreementData.clients.length === 0) return 'male';
    if (agreementData.clients.length === 1) {
      return agreementData.clients[0].gender;
    }
    
    // אם יש יותר מלקוח אחד - בדוק אם כולם מאותו מגדר
    const genders = agreementData.clients.map(c => c.gender);
    const uniqueGenders = [...new Set(genders)];
    
    if (uniqueGenders.length === 1) {
      // כולם מאותו מגדר - החזר אותו מגדר
      return uniqueGenders[0];
    } else {
      // יש גברים ונשים - החזר 'plural' (רבים)
      return 'plural';
    }
  };

  // פונקציה ליצירת טקסט הואיל מה-JSON
  const generatePreambleText = (): string => {
    const preamble = feeAgreementTemplates.preamble;
    const clientsGender = getClientsGender();
    
    if (!preamble || !preamble.whereas) {
      // אם אין במאגר, השתמש בטקסט ברירת מחדל
      const defaultText = `הואיל ועורך הדין הוא עורך דין בעל רישיון תקף לעריכת דין בישראל;

והואיל {{multipleClients:והלקוחות פנו|והלקוח פנה}} אל עורך הדין בבקשה לקבל שירות משפטי;

והואיל ועורך הדין הסכים לייצג את {{multipleClients:הלקוחות|הלקוח}} בתנאים המפורטים להלן;

והואיל והצדדים מעוניינים לקבוע את תנאי ההתקשרות ביניהם;`;
      
      let text = defaultText;
      const multipleClients = agreementData.clients.length > 1;
      text = text.replace(/\{\{multipleClients:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (_match: string, pluralText: string, maleText: string, femaleText: string) => {
        if (multipleClients) return pluralText;
        return clientsGender === 'female' ? femaleText : maleText;
      });
      return replaceTextWithGender(text, clientsGender);
    }

    const multipleClients = agreementData.clients.length > 1;
    return preamble.whereas.map(w => {
      let text = w.text;
      
      // קודם החלף את משתני multipleClients (3 חלקים: plural|male|female)
      text = text.replace(/\{\{multipleClients:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (_match: string, pluralText: string, maleText: string, femaleText: string) => {
        if (multipleClients) return pluralText;
        return clientsGender === 'female' ? femaleText : maleText;
      });
      
      text = text.replace(/\{\{serviceDescription\}\}/g, agreementData.case.subject || '[תיאור השירות המשפטי]');
      
      // הגנה על "עורך הדין" וכל מה שקשור אליו - נשמור אותו כזכר תמיד
      // נשמור את כל הביטויים הקשורים לעורך הדין לפני החלפת מגדר
      const lawyerPhrases: { [key: string]: string } = {};
      let phraseIndex = 0;
      
      // מצא ושמור כל ביטוי שקשור לעורך הדין - כולל "בעל רישיון" ו"הוא"
      const lawyerPatterns = [
        /עורך הדין הוא עורך דין בעל רישיון[^;]*;/g,
        /עורך דין בעל רישיון[^;]*;/g,
        /עורך הדין הסכים/g,
        /עורך הדין הוא/g,
        /שירותיו של עורך הדין/g,
        /עורך הדין.*הסכים/g,
        /עורך הדין.*לייצג/g,
        /הוא עורך דין/g,
        /בעל רישיון תקף/g
      ];
      
      lawyerPatterns.forEach(pattern => {
        text = text.replace(pattern, (match) => {
          const placeholder = `__LAWYER_PHRASE_${phraseIndex}__`;
          lawyerPhrases[placeholder] = match;
          phraseIndex++;
          return placeholder;
        });
      });
      
      // גם נשמור את "עורך הדין" עצמו
      text = text.replace(/עורך הדין/g, '__LAWYER_PLACEHOLDER__');
      // גם נשמור "עורך דין" (בלי ה' הידיעה)
      text = text.replace(/עורך דין(?! בעל)/g, '__LAWYER_NO_HEY__');
      
      // הגנה על מילים שצריכות להישאר ללא שינוי במגדר בהסכמי שכר טרחה
      const protectedPhrases: { [key: string]: string } = {};
      let protectedIndex = 0;
      
      // מילים שתמיד יישארו ללא שינוי
      const protectedPatterns = [
        /\bמידע מלא\b/g,  // מידע מלא (לא מידע מלאה)
        /\bשאינו נכלל\b/g,  // שאינו נכלל (לא שאינו נכללה)
        /\bשכר טרחה\b/g,  // שכר טרחה (לא שכרה טרחה)
        /\bשכר הטרחה\b/g,  // שכר הטרחה (לא שכרה הטרחה)
        /\bמינוי אפוטרופוס\b/g,  // מינוי אפוטרופוס
        /\bבמלואו\b/g,  // במלואו (לא באופן מלאה)
        /\bמלאים\b/g,  // מלאים (תמיד "מלא")
        /\bבלתי מלאים\b/g,  // בלתי מלאים (תמיד "בלתי מלא")
        /\bשיפוי מלאים\b/g,  // שיפוי מלאים (תמיד "שיפוי מלא")
        /\bעד\s+(?:ל|שני|סיום|יום|מיצוי|לקבלת)/g,  // עד למיצוי, עד שני, עד לסיום, עד ליום, עד לקבלת
        /\bעד\s+(?:סבבי|תיקונים|סיום)/g,  // עד שני סבבי תיקונים, עד לסיום
      ];
      
      protectedPatterns.forEach(pattern => {
        text = text.replace(pattern, (match) => {
          const placeholder = `__PROTECTED_${protectedIndex}__`;
          protectedPhrases[placeholder] = match;
          protectedIndex++;
          return placeholder;
        });
      });
      
      // הגנה על "עורך הדין" שלא ישתנה ל"יישאו" - תמיד "יישא"
      text = text.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
      
      // הגנה על "בימים א' עד ה'" שלא ישתנה
      text = text.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
      
      // הגנה מיוחדת על המילה "עד" כשהיא לא חלק מ"עדה" או "עדים" או "עדות"
      // נשמור "עד" כשהיא מופיעה לפני מילות יחס או מספרים או ימים
      text = text.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, '__UNTIL_PLACEHOLDER__');
      
      // החלפת מגדר - תבנית {{gender:זכר|נקבה|רבים}}
      text = text.replace(/\{\{gender:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (match, male, female, plural) => {
        switch (clientsGender) {
          case 'male': return male;
          case 'female': return female;
          case 'plural': return plural;
          default: return male;
        }
      });
      
      // החלפת מגדר כללית (פעלים, תארים וכו') - רק עבור הלקוח
      let result = replaceTextWithGender(text, clientsGender);
      
      // החזרת כל הביטויים הקשורים לעורך הדין כזכר תמיד
      Object.keys(lawyerPhrases).forEach(placeholder => {
        result = result.replace(new RegExp(placeholder, 'g'), lawyerPhrases[placeholder]);
      });
      result = result.replace(/__LAWYER_PLACEHOLDER__/g, 'עורך הדין');
      result = result.replace(/__LAWYER_NO_HEY__/g, 'עורך דין');
      
      // החזרת המילים המוגנות
      Object.keys(protectedPhrases).forEach(placeholder => {
        result = result.replace(new RegExp(placeholder, 'g'), protectedPhrases[placeholder]);
      });
      result = result.replace(/__UNTIL_PLACEHOLDER__/g, 'עד ');
      result = result.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
      result = result.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
      
      // תיקון נוסף - אם משהו השתנה בטעות, נשנה אותו חזרה
      result = result.replace(/עורך הדין הסכימה/g, 'עורך הדין הסכים');
      result = result.replace(/עורך דין בעלת/g, 'עורך דין בעל');
      result = result.replace(/עורך הדין.*בעלת/g, 'עורך הדין בעל');
      result = result.replace(/היא עורך דין/g, 'הוא עורך דין');
      result = result.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
      result = result.replace(/עורך הדין.*הסכימה/g, (match) => match.replace(/הסכימה/g, 'הסכים'));
      
      // תיקון מילים שצריכות להישאר ללא שינוי
      result = result.replace(/מידע מלאה/g, 'מידע מלא');
      result = result.replace(/שאינו נכללה/g, 'שאינו נכלל');
      result = result.replace(/שכרה טרחה/g, 'שכר טרחה');
      result = result.replace(/שכרה הטרחה/g, 'שכר הטרחה');
      result = result.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
      result = result.replace(/באופן מלאה/g, 'באופן מלא');
      result = result.replace(/במלואה/g, 'במלואו');
      result = result.replace(/מלאה, שלמה/g, 'מלא, שלם');
      result = result.replace(/מלאה.*שלמה/g, 'מלא, שלם');
      result = result.replace(/מלאים\b/g, 'מלא');
      result = result.replace(/בלתי מלאים\b/g, 'בלתי מלא');
      result = result.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
      result = result.replace(/עדה למיצוי/g, 'עד למיצוי');
      result = result.replace(/עדה\s+(?:ל|שני|סיום|יום|לקבלת|ה')/g, (match) => match.replace(/עדה/g, 'עד'));
      result = result.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
      result = result.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
      result = result.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
      result = result.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
      
      return result;
    }).join('\n\n');
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

    const preambleText = generatePreambleText();
    const thereforeText = feeAgreementTemplates.preamble?.therefore || 'לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:';

    // מצא את היקף השירותים האוטומטי לפי סוג השירות
    const serviceName = agreementData.case.subject || '';
    const serviceScopeMapping = (feeAgreementTemplates.preamble?.serviceScopeMapping || {}) as Record<string, string>;
    const serviceScope = (serviceScopeMapping[serviceName] || 'שירות משפטי לפי הצורך') as string;
    const clientsGender = getClientsGender();
    
    // צור את הסעיף הראשון החדש
    const firstSectionTemplate = feeAgreementTemplates.preamble?.firstSection?.text || 
      '{{multipleClients:הלקוחות|הלקוח}} שכרו את שירותיו של עורך הדין לצורך ייעוץ משפטי וטיפול משפטי בעניין {{serviceType}}. השירותים המשפטיים יכללו, בין היתר, את הפעולות המפורטות להלן: {{serviceScope}}. מובהר ומוסכם כי כל שירות משפטי אחר, שאינו נכלל במפורש בהגדרה זו, יחייב הסכם נפרד בכתב ותשלום שכר טרחה נוסף.';
    
    let firstSectionText = firstSectionTemplate;
    const multipleClients = agreementData.clients.length > 1;
    
    // קודם החלף את משתני multipleClients (כולל אם יש בתוכם gender)
    firstSectionText = firstSectionText.replace(/\{\{multipleClients:([^|]+)\|([^}]+)\}\}/g, 
      multipleClients ? '$1' : '$2');
    
    firstSectionText = firstSectionText.replace(/\{\{serviceType\}\}/g, serviceName || '[תיאור השירות המשפטי]');
    firstSectionText = firstSectionText.replace(/\{\{serviceScope\}\}/g, serviceScope);
    
    // הגנה על "עורך הדין" וכל מה שקשור אליו - נשמור אותו כזכר תמיד
    // נשמור את כל הביטויים הקשורים לעורך הדין לפני החלפת מגדר
    const lawyerPhrases: { [key: string]: string } = {};
    let phraseIndex = 0;
    
    // מצא ושמור כל ביטוי שקשור לעורך הדין - כולל "בעל רישיון" ו"הוא"
    const lawyerPatterns = [
      /עורך הדין הוא עורך דין בעל רישיון[^;]*;/g,
      /עורך דין בעל רישיון[^;]*;/g,
      /שירותיו של עורך הדין/g,
      /עורך הדין.*לצורך/g,
      /עורך הדין.*ייעוץ/g,
      /הוא עורך דין/g,
      /בעל רישיון תקף/g
    ];
    
    lawyerPatterns.forEach(pattern => {
      firstSectionText = firstSectionText.replace(pattern, (match) => {
        const placeholder = `__LAWYER_PHRASE_${phraseIndex}__`;
        lawyerPhrases[placeholder] = match;
        phraseIndex++;
        return placeholder;
      });
    });
    
    // גם נשמור את "עורך הדין" עצמו
    firstSectionText = firstSectionText.replace(/עורך הדין/g, '__LAWYER_PLACEHOLDER__');
    // גם נשמור "עורך דין" (בלי ה' הידיעה)
    firstSectionText = firstSectionText.replace(/עורך דין(?! בעל)/g, '__LAWYER_NO_HEY__');
    
    // הגנה על מילים שצריכות להישאר ללא שינוי במגדר בהסכמי שכר טרחה
    const protectedPhrases: { [key: string]: string } = {};
    let protectedIndex = 0;
    
    // מילים שתמיד יישארו ללא שינוי
    const protectedPatterns = [
      /\bמידע מלא\b/g,  // מידע מלא (לא מידע מלאה)
      /\bשאינו נכלל\b/g,  // שאינו נכלל (לא שאינו נכללה)
      /\bשכר טרחה\b/g,  // שכר טרחה (לא שכרה טרחה)
      /\bשכר הטרחה\b/g,  // שכר הטרחה (לא שכרה הטרחה)
      /\bמינוי אפוטרופוס\b/g,  // מינוי אפוטרופוס
      /\bבמלואו\b/g,  // במלואו (לא באופן מלאה)
      /\bמלאים\b/g,  // מלאים (תמיד "מלא")
      /\bבלתי מלאים\b/g,  // בלתי מלאים (תמיד "בלתי מלא")
      /\bשיפוי מלאים\b/g,  // שיפוי מלאים (תמיד "שיפוי מלא")
      /\bעד\s+(?:ל|שני|סיום|יום|מיצוי|לקבלת)/g,  // עד למיצוי, עד שני, עד לסיום, עד ליום, עד לקבלת
      /\bעד\s+(?:סבבי|תיקונים|סיום)/g,  // עד שני סבבי תיקונים, עד לסיום
    ];
    
    protectedPatterns.forEach(pattern => {
      firstSectionText = firstSectionText.replace(pattern, (match) => {
        const placeholder = `__PROTECTED_${protectedIndex}__`;
        protectedPhrases[placeholder] = match;
        protectedIndex++;
        return placeholder;
      });
    });
    
    // הגנה על "עורך הדין" שלא ישתנה ל"יישאו" - תמיד "יישא"
    firstSectionText = firstSectionText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
    
    // הגנה על "בימים א' עד ה'" שלא ישתנה
    firstSectionText = firstSectionText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
    
    // הגנה מיוחדת על המילה "עד" כשהיא לא חלק מ"עדה" או "עדים" או "עדות"
    // נשמור "עד" כשהיא מופיעה לפני מילות יחס או מספרים
    firstSectionText = firstSectionText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, '__UNTIL_PLACEHOLDER__');
    
    // החלפת מגדר - תבנית {{gender:זכר|נקבה|רבים}}
    firstSectionText = firstSectionText.replace(/\{\{gender:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (match, male, female, plural) => {
      switch (clientsGender) {
        case 'male': return male;
        case 'female': return female;
        case 'plural': return plural;
        default: return male;
      }
    });
    
    // החלפת מגדר כללית (פעלים, תארים וכו') - רק עבור הלקוח
    firstSectionText = replaceTextWithGender(firstSectionText, clientsGender);
    
    // החזרת כל הביטויים הקשורים לעורך הדין כזכר תמיד
    Object.keys(lawyerPhrases).forEach(placeholder => {
      firstSectionText = firstSectionText.replace(new RegExp(placeholder, 'g'), lawyerPhrases[placeholder]);
    });
    firstSectionText = firstSectionText.replace(/__LAWYER_PLACEHOLDER__/g, 'עורך הדין');
    firstSectionText = firstSectionText.replace(/__LAWYER_NO_HEY__/g, 'עורך דין');
    
    // החזרת המילים המוגנות
    Object.keys(protectedPhrases).forEach(placeholder => {
      firstSectionText = firstSectionText.replace(new RegExp(placeholder, 'g'), protectedPhrases[placeholder]);
    });
    firstSectionText = firstSectionText.replace(/__UNTIL_PLACEHOLDER__/g, 'עד ');
    firstSectionText = firstSectionText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
    firstSectionText = firstSectionText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
    
    // תיקון נוסף - אם משהו השתנה בטעות, נשנה אותו חזרה
    firstSectionText = firstSectionText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
    firstSectionText = firstSectionText.replace(/היא עורך דין/g, 'הוא עורך דין');
    firstSectionText = firstSectionText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
    
    // תיקון מילים שצריכות להישאר ללא שינוי
    firstSectionText = firstSectionText.replace(/מידע מלאה/g, 'מידע מלא');
    firstSectionText = firstSectionText.replace(/שאינו נכללה/g, 'שאינו נכלל');
    firstSectionText = firstSectionText.replace(/שכרה טרחה/g, 'שכר טרחה');
    firstSectionText = firstSectionText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
    firstSectionText = firstSectionText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
    firstSectionText = firstSectionText.replace(/באופן מלאה/g, 'במלואו');
    firstSectionText = firstSectionText.replace(/במלואה/g, 'במלואו');
    firstSectionText = firstSectionText.replace(/מלאים\b/g, 'מלא');
    firstSectionText = firstSectionText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
    firstSectionText = firstSectionText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
    firstSectionText = firstSectionText.replace(/עדה למיצוי/g, 'עד למיצוי');
    firstSectionText = firstSectionText.replace(/עדה\s+(?:ל|שני|סיום|יום|לקבלת|ה'|מועד)/g, (match) => match.replace(/עדה/g, 'עד'));
    firstSectionText = firstSectionText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
    firstSectionText = firstSectionText.replace(/בבקשה עדה/g, 'בבקשה עד');
    firstSectionText = firstSectionText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
    firstSectionText = firstSectionText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
    firstSectionText = firstSectionText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
    firstSectionText = firstSectionText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');

    let baseAgreement = `הסכם שכר טרחה

בין:     ${agreementData.lawyer.name || '[שם עורך הדין]'}
         עו"ד, רישיון מספר: ${agreementData.lawyer.license || '[מספר רישיון]'}
         כתובת: ${agreementData.lawyer.address || '[כתובת עורך הדין]'}
         טלפון: ${agreementData.lawyer.phone || '[מספר טלפון]'}
         דוא"ל: ${agreementData.lawyer.email || '[כתובת אימייל]'}
         (להלן: "עורך הדין")

${clientsSection}

${preambleText}

${thereforeText}

1. תיאור השירות

${firstSectionText}
`;

    if (customSections.length > 0) {
      // הסעיף הראשון הוא תמיד "תיאור השירות" (1), אז הסעיפים מ-customSections מתחילים מ-2
      const sortedCustomSections = [...customSections].sort((a, b) => a.order - b.order);
      const mainSections = sortedCustomSections.filter(s => s.level === 'main');
      
      // אם יש סעיפים ראשיים, השתמש בכותרות שלהם
      if (mainSections.length > 0) {
        mainSections.forEach((section, mainIndex) => {
          const sectionNumber = mainIndex + 2; // מתחיל מ-2 כי 1 הוא תיאור השירות
          baseAgreement += `\n${sectionNumber}. ${section.title}\n\n${section.content}\n\n`;
          
          // הוסף תתי סעיפים
          const subSections = sortedCustomSections
            .filter(s => s.level === 'sub' && s.parentId === section.id)
            .sort((a, b) => a.order - b.order);
          
          subSections.forEach((subSection, subIndex) => {
            baseAgreement += `${sectionNumber}.${subIndex + 1}. ${subSection.title}\n\n${subSection.content}\n\n`;
            
            // הוסף תתי-תתי סעיפים
            const subSubSections = sortedCustomSections
              .filter(s => s.level === 'sub-sub' && s.parentId === subSection.id)
              .sort((a, b) => a.order - b.order);
            
            subSubSections.forEach((subSubSection, subSubIndex) => {
              baseAgreement += `${sectionNumber}.${subIndex + 1}.${subSubIndex + 1}. ${subSubSection.title}\n\n${subSubSection.content}\n\n`;
            });
          });
        });
      } else {
        // אם אין סעיפים ראשיים, הוסף כותרת כללית
        baseAgreement += '\n2. סעיפים ותנאים\n\n';
        sortedCustomSections.forEach((section, index) => {
          baseAgreement += `2.${index + 1}. ${section.title}\n\n${section.content}\n\n`;
        });
      }
      baseAgreement += '\n';
    }

    // חשב את מספר הסעיף הבא (אחרי הסעיף הראשון ותוכן customSections)
    const sortedCustomSections = [...customSections].sort((a, b) => a.order - b.order);
    const mainSections = sortedCustomSections.filter(s => s.level === 'main');
    const nextSectionNumber = mainSections.length > 0 ? mainSections.length + 2 : 2;
    
    baseAgreement += `
${nextSectionNumber}. תוקף ההסכם

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
              {Object.keys(feeAgreementTemplates.preamble?.serviceScopeMapping || {}).map((serviceName) => (
                <option key={serviceName} value={serviceName}>
                  {serviceName}
                </option>
              ))}
            </select>
            {selectedServiceType && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  ℹ️ הסעיף הראשון והסעיפים הקבועים נטענו. ניתן להוסיף סעיפים היררכיים מ-Supabase.
                </p>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">תיאור השירות</label>
            <select
              value={agreementData.case.subject}
              onChange={(e) => {
                updateCase('subject', e.target.value);
                // עדכן גם את היקף השירותים האוטומטי
                const serviceScopeMapping = (feeAgreementTemplates.preamble?.serviceScopeMapping || {}) as Record<string, string>;
                const serviceScope = (serviceScopeMapping[e.target.value] || 'שירות משפטי לפי הצורך') as string;
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 mb-2"
              dir="rtl"
            >
              <option value="">בחר סוג שירות...</option>
              {Object.keys(feeAgreementTemplates.preamble?.serviceScopeMapping || {}).map((serviceName) => (
                <option key={serviceName} value={serviceName}>
                  {serviceName}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={agreementData.case.subject}
              onChange={(e) => updateCase('subject', e.target.value)}
              placeholder="או הקלד תיאור שירות מותאם אישית"
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

          <div className="space-y-4">
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
                onChange={(e) => updateFees('paymentStructure', e.target.value as 'מלא מראש' | 'שלבים')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                dir="rtl"
              >
                <option value="מלא מראש">תשלום מלא מראש</option>
                <option value="שלבים">חלוקה לשלבים</option>
              </select>
            </div>
            
            {agreementData.fees.paymentStructure === 'שלבים' && (
              <div className="bg-white p-4 rounded-lg border border-yellow-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">שלבי תשלום</h3>
                  <button
                    onClick={addPaymentStage}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    הוסף שלב
                  </button>
                </div>
                
                {agreementData.fees.paymentStages && agreementData.fees.paymentStages.length > 0 ? (
                  <div className="space-y-4">
                    {agreementData.fees.paymentStages.map((stage, index) => (
                      <div key={stage.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">שלב {index + 1}</h4>
                          <button
                            onClick={() => removePaymentStage(stage.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">סוג תשלום</label>
                            <select
                              value={stage.type}
                              onChange={(e) => updatePaymentStage(stage.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                              dir="rtl"
                            >
                              <option value="amount">סכום</option>
                              <option value="percentage">אחוז</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">פירוט</label>
                            <input
                              type="text"
                              value={stage.description}
                              onChange={(e) => updatePaymentStage(stage.id, 'description', e.target.value)}
                              placeholder="למשל: תשלום ראשון, תשלום עבור הטיוטה, וכו'"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                              dir="rtl"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {stage.type === 'amount' ? 'סכום (₪)' : 'אחוז (%)'}
                            </label>
                            <input
                              type="text"
                              value={stage.type === 'amount' 
                                ? (stage.value ? formatNumber(stage.value) : '')
                                : stage.value}
                              onChange={(e) => {
                                const value = stage.type === 'amount' 
                                  ? unformatNumber(e.target.value)
                                  : e.target.value;
                                updatePaymentStage(stage.id, 'value', value);
                              }}
                              placeholder={stage.type === 'amount' ? "5,000" : "30"}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                              dir="ltr"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">זמני תשלום</label>
                            <input
                              type="text"
                              value={stage.paymentTiming}
                              onChange={(e) => updatePaymentStage(stage.id, 'paymentTiming', e.target.value)}
                              placeholder="למשל: עם חתימת ההסכם, בתאריך 01/01/2025, לאחר אישור הטיוטה"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                              dir="rtl"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>אין שלבי תשלום. לחץ על "הוסף שלב" כדי להתחיל.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* טעינת סעיפים מ-Supabase */}
        <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-900">📋 טעינת סעיפים מ-Supabase</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleLoadHierarchicalSections()}
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
              >
                <Download className="w-4 h-4" />
                טען סעיפים היררכיים
              </button>
              <button
                onClick={() => handleSaveHierarchicalSectionToWarehouse()}
                className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                שמור למאגר היררכי
              </button>
              <button
                onClick={() => setShowSectionsWarehouse(true)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                <BookOpen className="w-4 h-4" />
                מחסן סעיפים
              </button>
              <button
                onClick={() => setShowUnifiedWarehouse(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <Brain className="w-4 h-4" />
                מאגר מאוחד
              </button>
              <button
                onClick={() => setShowWarehouseEditor(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                הוסף למאגר
              </button>
              <button
                onClick={() => {
                  const title = prompt('כותרת הסעיף:');
                  const content = prompt('תוכן הסעיף:');
                  if (title && content) {
                    handleAddSection(content, title);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                <FileText className="w-4 h-4" />
                הוסף סעיף
              </button>
              <button
                onClick={() => {
                  convertToEditableSections();
                  setShowLearningSystem(true);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm"
              >
                <Brain className="w-4 h-4" />
                מערכת למידה
              </button>
            </div>
          </div>
          <p className="text-indigo-700 mb-3">
            הסעיפים מנוהלים דרך Supabase Dashboard
          </p>
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
          agreementData={{
            ...agreementData,
            customSections: customSections,
            serviceScopeMapping: feeAgreementTemplates.preamble?.serviceScopeMapping,
            generalClauses: feeAgreementTemplates.generalClauses,
            selectedServiceType: selectedServiceType
          }}
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
                {pendingHierarchicalSections && (
                  <span className="block text-sm font-normal text-gray-600 mt-1">
                    (כולל {pendingHierarchicalSections.filter(s => s.level === 'sub').length} תתי סעיפים ו-{pendingHierarchicalSections.filter(s => s.level === 'sub-sub').length} תת-תת-סעיפים)
                  </span>
                )}
              </h3>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 טיפ:</p>
                <p>הזן את הערכים למשתנים (כמו ערכאות, נכסים, כתובות וכו'). המערכת תטפל במגדר אוטומטית.</p>
              </div>
              
              <div className="space-y-4 mb-6">
                {variablesModal.section.variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setVariablesModal(null);
                    setPendingHierarchicalSections(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  ביטול
                </button>
                <button
                  onClick={() => {
                    // אם יש סעיפים היררכיים ממתינים, החלף משתנים בכל הסעיפים
                    if (pendingHierarchicalSections && pendingHierarchicalSections.length > 0) {
                      const processedSections = pendingHierarchicalSections.map(section => {
                        let finalContent = section.content;
                    Object.keys(variablesModal.values).forEach(key => {
                      const value = variablesModal.values[key];
                          if (!value.trim()) return; // דלג על משתנים ריקים
                          
                          // החלף רק את הערך - המערכת תטפל במגדר אוטומטית
                          finalContent = finalContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
                        });
                        
                        return {
                          ...section,
                          content: finalContent
                        };
                      });

                      // הוסף את כל הסעיפים המעובדים
                      setCustomSections(prev => [...prev, ...processedSections]);
                      
                      const totalSubSections = processedSections.filter(s => s.level === 'sub').length;
                      const totalSubSubSections = processedSections.filter(s => s.level === 'sub-sub').length;
                      
                      setPendingHierarchicalSections(null);
                      setVariablesModal(null);
                      
                      alert(`✅ נטען סעיף "${variablesModal.section.title}" עם ${totalSubSections} תתי סעיפים ו-${totalSubSubSections} תת-תת-סעיפים!`);
                    } else {
                      // התנהגות רגילה לסעיף יחיד
                      let finalContent = variablesModal.section.content;
                      Object.keys(variablesModal.values).forEach(key => {
                        const value = variablesModal.values[key];
                        // החלף רק את הערך - המערכת תטפל במגדר אוטומטית
                        finalContent = finalContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
                    });

                    setCustomSections(prev => [...prev, {
                      id: generateSectionId(),
                      title: variablesModal.section.title,
                      content: finalContent,
                      level: 'main' as const,
                      order: getNextOrder()
                    }]);

                    setVariablesModal(null);
                    }
                  }}
                  disabled={!Object.values(variablesModal.values).every(v => v.trim() !== '')}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {pendingHierarchicalSections ? 'הוסף סעיפים היררכיים' : 'הוסף סעיף'}
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
                userId={agreementData.clients[0]?.name || 'anonymous'}
                willType="individual"
              />
            </div>
          </div>
        )}

        {/* מערכת למידה */}
        {showLearningSystem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  🧠 מערכת למידה
                </h3>
                <button
                  onClick={() => setShowLearningSystem(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {editableSections.map((section) => (
                  <EditableSection
                    key={section.id}
                    section={section}
                    userId={currentUser?.id || 'anonymous'}
                    onUpdate={handleUpdateEditableSection}
                    onSaveToWarehouse={handleSaveToWarehouse}
                    onSaveToLearning={handleSaveToLearning}
                  />
                ))}
              </div>
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
