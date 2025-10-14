'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, Calendar, User, Scale, BookOpen, X, Download, Brain } from 'lucide-react';
import SimpleExportButtons from '../SimpleExportButtons';
import SimpleAIImprover from '../SimpleAIImprover';
import UniversalSectionsWarehouse from '../UniversalSectionsWarehouse';
import EditableSection from '../LearningSystem/EditableSection';
import WarehouseManager from '../LearningSystem/WarehouseManager';
import { exportFeeAgreementToWord } from './FeeAgreementExporter';
import { AuthService } from '@/lib/auth';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import feeAgreementTemplates from '@/lib/fee-agreement-templates.json';

interface FeeAgreementData {
  // פרטי עורך הדין
  lawyer: {
    name: string;
    license: string;
    address: string;
    phone: string;
    email: string;
  };
  
  // פרטי הלקוח
  client: {
    name: string;
    id: string;
    address: string;
    phone: string;
    email: string;
  };

  // פרטי התיק
  case: {
    subject: string;
    description: string;
  };

  // תמחור
  fees: {
    type: 'סכום_כולל' | 'מקדמה_והצלחה';
    totalAmount?: string;
    paymentStructure?: string; // "מלא מראש" או "50%-50%" או "שלבים"
    advancePayment?: string;
    successPercentage?: string;
    stages?: string; // פירוט שלבים אם נבחר
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

  useEffect(() => {
    setMounted(true);
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, []);
  
  const [agreementData, setAgreementData] = useState<FeeAgreementData>({
    lawyer: {
      name: '',
      license: '',
      address: '',
      phone: '',
      email: ''
    },
    client: {
      name: '',
      id: '',
      address: '',
      phone: '',
      email: ''
    },
    case: {
      subject: '',
      description: ''
    },
    fees: {
      type: 'סכום_כולל' as 'סכום_כולל' | 'מקדמה_והצלחה',
      totalAmount: '',
      paymentStructure: 'מלא מראש',
      advancePayment: '',
      successPercentage: '',
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
  const [showAI, setShowAI] = useState(false);
  const [showSectionsWarehouse, setShowSectionsWarehouse] = useState(false);
  const [customSections, setCustomSections] = useState<Array<{title: string, content: string}>>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  
  // מערכת למידה
  const [showLearningSystem, setShowLearningSystem] = useState(false);
  const [editableSections, setEditableSections] = useState<EditableSectionType[]>([]);
  const [learningMode, setLearningMode] = useState<'edit' | 'warehouse'>('edit');

  // עדכון פרטי עורך הדין אם המשתמש משתנה
  useEffect(() => {
    if (mounted && currentUser) {
      setAgreementData(prev => ({
        ...prev,
        lawyer: {
          name: currentUser.name || '',
          license: currentUser.licenseNumber || '',
          address: currentUser.officeAddress || '',
          phone: currentUser.phone || '',
          email: currentUser.email || ''
        }
      }));
    }
  }, [currentUser, mounted]);

  // פונקציה שמחליפה משתנים בטקסט הסעיפים
  const replaceVariablesInText = (text: string) => {
    let updatedText = text;
    
    // החלפת סכומים
    if (agreementData.fees.totalAmount) {
      updatedText = updatedText.replace(/_______ ש"ח/g, `${agreementData.fees.totalAmount} ש"ח`);
      updatedText = updatedText.replace(/________ ש"ח/g, `${agreementData.fees.totalAmount} ש"ח`);
    }
    
    // החלפת מקדמה
    if (agreementData.fees.advancePayment) {
      updatedText = updatedText.replace(/מקדמה: _____ ש"ח/g, `מקדמה: ${agreementData.fees.advancePayment} ש"ח`);
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
      const autoSections = service.clauses.map(clause => ({
        title: clause.title,
        content: replaceVariablesInText(clause.text)
      }));
      setCustomSections(autoSections);
      
      // עדכון פרטי התיק
      setAgreementData(prev => ({
        ...prev,
        case: {
          ...prev.case,
          subject: service.serviceName
        }
      }));

      // עדכון סכומים ותנאי תשלום אוטומטית בהתאם לסוג השירות
      let defaultFees: {
        type: 'סכום_כולל' | 'מקדמה_והצלחה';
        totalAmount: string;
        paymentStructure: string;
        advancePayment: string;
        successPercentage: string;
        stages: string;
      } = {
        type: 'סכום_כולל',
        totalAmount: '',
        paymentStructure: 'מלא מראש',
        advancePayment: '',
        successPercentage: '',
        stages: ''
      };

      let defaultTerms = {
        paymentTerms: 'חשבונית תישלח מדי חודש ותשולם תוך 30 ימים מקבלתה.',
        expensesCoverage: 'הוצאות משפט (אגרות, עלויות מומחים, נסיעות) יחולו על הלקוח ויחויבו בנפרד.',
        terminationClause: 'כל צד יכול לסיים את ההתקשרות בהודעה של 14 ימים מראש.'
      };

      // הגדרות ספציפיות לפי סוג השירות
      switch (selectedServiceType) {
        case 'הסכמי_ממון':
          defaultFees = {
            type: 'סכום_כולל',
            totalAmount: '5000',
            paymentStructure: '50%-50%',
            advancePayment: '',
            successPercentage: '',
            stages: ''
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% לאחר אישור טיוטת ההסכם על ידי הלקוח ובטרם חתימתו.';
          break;
        
        case 'צוואת_יחיד':
          defaultFees = {
            type: 'סכום_כולל',
            totalAmount: '3000',
            paymentStructure: '50%-50%',
            advancePayment: '',
            successPercentage: '',
            stages: ''
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד חתימת הצוואה בפני העדים.';
          break;

        case 'צוואה_הדדית':
          defaultFees = {
            type: 'סכום_כולל',
            totalAmount: '5500',
            paymentStructure: '50%-50%',
            advancePayment: '',
            successPercentage: '',
            stages: ''
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד חתימת הצוואות בפני העדים.';
          break;

        case 'ייפוי_כוח_מתמשך':
          defaultFees = {
            type: 'סכום_כולל',
            totalAmount: '4000',
            paymentStructure: '50%-50%',
            advancePayment: '',
            successPercentage: '',
            stages: ''
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד החתימה על ייפוי הכוח.';
          break;

        case 'התנגדות_לצוואה':
          defaultFees = {
            type: 'מקדמה_והצלחה',
            totalAmount: '',
            paymentStructure: '',
            advancePayment: '12000',
            successPercentage: '5',
            stages: ''
          };
          defaultTerms.paymentTerms = 'מקדמה חודשית בסך 10,000 ש\"ח על חשבון שכר הטרחה. בתום כל חודש תיערך התחשבנות.';
          break;

        case 'אפוטרופסות':
          defaultFees = {
            type: 'סכום_כולל',
            totalAmount: '8000',
            paymentStructure: 'מלא מראש',
            advancePayment: '',
            successPercentage: '',
            stages: ''
          };
          defaultTerms.paymentTerms = 'תשלום מלא עם החתימה על ההסכם.';
          break;

        case 'פירוק_שיתוף':
          defaultFees = {
            type: 'מקדמה_והצלחה',
            totalAmount: '',
            paymentStructure: '',
            advancePayment: '15000',
            successPercentage: '4',
            stages: ''
          };
          defaultTerms.paymentTerms = 'מקדמה חודשית בסך 8,000 ש\"ח על חשבון שכר הטרחה. בסוף כל חודש תיערך התחשבנות.';
          break;

        case 'תביעה_כספית':
          defaultFees = {
            type: 'מקדמה_והצלחה',
            totalAmount: '',
            paymentStructure: '',
            advancePayment: '5000',
            successPercentage: '12',
            stages: ''
          };
          defaultTerms.paymentTerms = 'מקדמה ראשונית בסך 30% משכר הטרחה המוערך עם החתימה על הסכם זה. יתרת התשלום תשולם בשלבים או בסיום ההליך.';
          break;

        case 'ייעוץ_משפטי':
          defaultFees = {
            type: 'סכום_כולל',
            totalAmount: '7500',
            paymentStructure: 'מלא מראש',
            advancePayment: '',
            successPercentage: '',
            stages: ''
          };
          defaultTerms.paymentTerms = 'תשלום יבוצע על בסיס חודשי לפי דו\"ח שעות מפורט.';
          break;
      }

      // עדכון הנתונים
      setAgreementData(prev => ({
        ...prev,
        fees: defaultFees,
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
        const updatedSections = service.clauses.map(clause => ({
          title: clause.title,
          content: replaceVariablesInText(clause.text)
        }));
        setCustomSections(updatedSections);
      }
    }
  }, [agreementData.fees.totalAmount, agreementData.fees.advancePayment, agreementData.fees.successPercentage]);

  const updateLawyer = (field: keyof typeof agreementData.lawyer, value: string) => {
    setAgreementData(prev => ({
      ...prev,
      lawyer: { ...prev.lawyer, [field]: value }
    }));
  };

  const updateClient = (field: keyof typeof agreementData.client, value: string) => {
    setAgreementData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
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
    setCustomSections(prev => [...prev, { title, content }]);
    setShowSectionsWarehouse(false);
  };

  // פונקציות מערכת למידה
  const convertToEditableSections = () => {
    if (typeof window === 'undefined') return; // הגנה מפני SSR
    
    const editable = customSections.map((section, index) => ({
      id: `section_${index}`,
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
    
    // עדכון גם ב-customSections
    setCustomSections(prev => 
      prev.map((section, index) => 
        `section_${index}` === updatedSection.id ? 
          { title: updatedSection.title, content: updatedSection.content } : 
          section
      )
    );
  };

  const handleSaveToWarehouse = (section: EditableSectionType) => {
    // הלוגיקה כבר מטופלת ב-EditableSection
    console.log('Saved to warehouse:', section);
  };

  const handleSaveToLearning = (section: EditableSectionType) => {
    // הלוגיקה כבר מטופלת ב-EditableSection
    console.log('Saved to learning:', section);
  };

  const handleSelectFromWarehouse = (warehouseSection: any) => {
    const newSection = {
      title: warehouseSection.title,
      content: warehouseSection.content
    };
    setCustomSections(prev => [...prev, newSection]);
  };

  const generateFeeAgreement = (): string => {
    let baseAgreement = `הסכם שכר טרחה

בין:     ${agreementData.lawyer.name || '[שם עורך הדין]'}
         עו"ד, רישיון מספר: ${agreementData.lawyer.license || '[מספר רישיון]'}
         כתובת: ${agreementData.lawyer.address || '[כתובת עורך הדין]'}
         טלפון: ${agreementData.lawyer.phone || '[מספר טלפון]'}
         דוא"ל: ${agreementData.lawyer.email || '[כתובת אימייל]'}
         (להלן: "עורך הדין")

לבין:    ${agreementData.client.name || '[שם הלקוח]'}
         ת.ז: ${agreementData.client.id || '[תעודת זהות]'}
         כתובת: ${agreementData.client.address || '[כתובת הלקוח]'}
         טלפון: ${agreementData.client.phone || '[מספר טלפון]'}
         דוא"ל: ${agreementData.client.email || '[כתובת אימייל]'}
         (להלן: "הלקוח")

הואיל ועורך הדין הוא עורך דין בעל רישיון תקף לעריכת דין בישראל;

והואיל והלקוח מעוניין לקבל שירותים משפטיים מעורך הדין;

והואיל והצדדים מעוניינים לקבוע את תנאי ההתקשרות ביניהם;

לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:

1. מהות השירותים המשפטיים

1.1. עורך הדין יספק ללקוח שירותים משפטיים בעניין: ${agreementData.case.subject || '[נושא התיק]'}

${agreementData.case.description ? `1.2. תיאור התיק: ${agreementData.case.description}\n\n` : ''}`;

    // הוספת סעיפים מותאמים אישית מהמחסן
    if (customSections.length > 0) {
      baseAgreement += '\n2. סעיפים ותנאים\n\n';
      customSections.forEach((section, index) => {
        baseAgreement += `2.${index + 1}. ${section.title}\n\n${section.content}\n\n`;
      });
      baseAgreement += '\n';
    }

    // סיום ההסכם
    baseAgreement += `
${customSections.length > 0 ? customSections.length + 2 : '2'}. תוקף ההסכם

הסכם זה ייכנס לתוקף עם חתימת שני הצדדים ויהיה בתוקף עד לסיום הטיפול בתיק או עד לסיום ההתקשרות.

התאריך: ${new Date(agreementDate).toLocaleDateString('he-IL')}

________________________           ________________________
    חתימת עורך הדין                    חתימת הלקוח
     ${agreementData.lawyer.name || '[שם]'}                        ${agreementData.client.name || '[שם]'}

הסכם זה נחתם בשני עותקים, עותק לכל צד.`;

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

          <div className="grid md:grid-cols-3 gap-4">
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
          </div>
        </section>

        {/* פרטי הלקוח */}
        <section className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            פרטי הלקוח
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={agreementData.client.name}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder="שם הלקוח המלא"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={agreementData.client.id}
              onChange={(e) => updateClient('id', e.target.value)}
              placeholder="תעודת זהות"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
              maxLength={9}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              value={agreementData.client.address}
              onChange={(e) => updateClient('address', e.target.value)}
              placeholder="כתובת מלאה"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={agreementData.client.phone}
              onChange={(e) => updateClient('phone', e.target.value)}
              placeholder="מספר טלפון"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
            />
            
            <input
              type="email"
              value={agreementData.client.email}
              onChange={(e) => updateClient('email', e.target.value)}
              placeholder="כתובת אימייל"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              dir="ltr"
            />
          </div>
        </section>

        {/* פרטי התיק */}
        <section className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
          <h2 className="text-xl font-bold text-purple-900 mb-4">פרטי התיק</h2>
          
          {/* בחירת סוג שירות */}
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
            <input
              type="text"
              value={agreementData.case.subject}
              onChange={(e) => updateCase('subject', e.target.value)}
              placeholder="נושא התיק (תביעה, הסכם, ייעוץ...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              dir="rtl"
            />
          </div>

          <textarea
            value={agreementData.case.description}
            onChange={(e) => updateCase('description', e.target.value)}
            placeholder="תיאור מפורט של התיק, השירותים הנדרשים, ומטרות הטיפול"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows={4}
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </section>

        {/* תמחור */}
        <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            מבנה תמחור
          </h2>
          
          {/* הודעה ברורה */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>טיפ:</strong> הסכומים נטענו אוטומטית בהתאם לסוג השירות שבחרת. 
              כשתשני את הסכומים כאן - הם יתעדכנו אוטומטית גם בסעיפים למטה!
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">סוג תמחור</label>
            <select
              value={agreementData.fees.type}
              onChange={(e) => updateFees('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="סכום_כולל">סכום כולל</option>
              <option value="מקדמה_והצלחה">מקדמה + אחוז הצלחה</option>
            </select>
          </div>

          {/* שדות תמחור דינמיים */}
          <div className="space-y-4">
            {agreementData.fees.type === 'סכום_כולל' && (
              <>
                  <input
                    type="text"
                  value={agreementData.fees.totalAmount || ''}
                  onChange={(e) => updateFees('totalAmount', e.target.value)}
                  placeholder="סכום כולל (₪)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="ltr"
                  />
                  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מבנה התשלום</label>
                  <select
                    value={agreementData.fees.paymentStructure || 'מלא מראש'}
                    onChange={(e) => updateFees('paymentStructure', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="מלא מראש">תשלום מלא מראש</option>
                    <option value="50%-50%">חלוקה 50%-50%</option>
                    <option value="שלבים">חלוקה לשלבים</option>
                  </select>
                </div>
                
                {agreementData.fees.paymentStructure === 'שלבים' && (
                  <textarea
                    value={agreementData.fees.stages || ''}
                    onChange={(e) => updateFees('stages', e.target.value)}
                    placeholder="פרט את השלבים (למשל: 30% עם החתימה, 40% בסיום הטיוטה, 30% עם החתימה על ההסכם)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    rows={3}
                    dir="rtl"
                  />
                )}
              </>
            )}

            {agreementData.fees.type === 'מקדמה_והצלחה' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                    value={agreementData.fees.advancePayment || ''}
                    onChange={(e) => updateFees('advancePayment', e.target.value)}
                    placeholder="מקדמה מראש (₪)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                dir="ltr"
              />

                <input
                  type="text"
                  value={agreementData.fees.successPercentage || ''}
                  onChange={(e) => updateFees('successPercentage', e.target.value)}
                  placeholder="אחוז הצלחה (%)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                        dir="ltr"
                      />
                    </div>
                    
                <div className="bg-white p-3 rounded border border-yellow-300 text-sm">
                  <strong>דוגמה:</strong> מקדמה 5,000 ₪ + 10% מהסכום שיתקבל בפועל
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
                onClick={() => setShowAI(!showAI)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                {showAI ? 'הסתר AI' : 'הצג AI'}
              </button>
            </div>
          </div>
          
          {showAI && (
            <SimpleAIImprover
              initialText={agreementData.terms.specialConditions || 'כתוב כאן תנאים בסיסיים והAI ירחיב לסעיפי הסכם מקצועיים'}
              onAccept={(improvedText) => updateTerms('specialConditions', improvedText)}
              placeholder="לדוגמה: הלקוח משלם רק במקרה הצלחה, עורך הדין מחויב בסודיות..."
            />
          )}

          {/* מערכת למידה */}
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

        {/* סעיפים נוספים מהמחסן */}
        {customSections.length > 0 && (
          <section className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
            <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              סעיפים נוספים מהמחסן ({customSections.length})
            </h2>
            
            <div className="space-y-4">
              {customSections.map((section, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-purple-300">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-900">{section.title}</h3>
                    <button
                      onClick={() => setCustomSections(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* פרטי חתימה */}
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

        {/* ייצוא */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ייצוא המסמך</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={async () => {
                const success = await exportFeeAgreementToWord(
                  generateFeeAgreement(),
                  `הסכם-שכר-טרחה-${agreementData.client.name || 'לקוח'}.docx`
                );
                if (success) {
                  alert('הקובץ הורד בהצלחה!');
                } else {
                  alert('שגיאה בייצוא. נסה שוב.');
                }
              }}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>ייצא ל-Word (RTL תקין)</span>
            </button>
            
            <div className="space-y-3">
              <button
                onClick={() => exportFeeAgreementToWord(generateFeeAgreement(), `הסכם-שכר-טרחה-${agreementData.client.name || 'לקוח'}.docx`)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <FileText className="w-5 h-5" />
                ייצא ל-Word (RTL תקין)
              </button>
              
              <SimpleExportButtons
                documentContent={generateFeeAgreement()}
                documentTitle={`הסכם שכר טרחה - ${agreementData.client.name || 'לקוח'}`}
                className="w-full"
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">
            💡 <strong>מומלץ:</strong> השתמשי בייצוא ל-Word (RTL תקין) לקבלת מסמך מקצועי בעברית נכונה
          </p>
        </div>

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
                  <UniversalSectionsWarehouse 
                    documentType="fee-agreement" 
                    onAddSection={handleAddSection} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
