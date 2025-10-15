'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, Calendar, User, Scale, BookOpen, X, Download, Brain, Plus, Trash2 } from 'lucide-react';
import EditableSection from '../LearningSystem/EditableSection';
import WarehouseManager from '../LearningSystem/WarehouseManager';
import { exportFeeAgreementToWord } from './FeeAgreementExporter';
import { AuthService } from '@/lib/auth';
import { EditableSection as EditableSectionType } from '@/lib/learning-system/types';
import { learningEngine } from '@/lib/learning-system/learning-engine';
import feeAgreementTemplates from '@/lib/fee-agreement-templates.json';
import { replaceTextWithGender } from '@/lib/hebrew-gender';

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

  useEffect(() => {
    setMounted(true);
    const loadUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
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
  const [customSections, setCustomSections] = useState<Array<{title: string, content: string}>>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  
  // מערכת למידה
  const [showLearningSystem, setShowLearningSystem] = useState(false);
  const [editableSections, setEditableSections] = useState<EditableSectionType[]>([]);
  const [learningMode, setLearningMode] = useState<'edit' | 'warehouse'>('edit');
  
  // חלון מילוי משתנים
  const [variablesModal, setVariablesModal] = useState<{
    section: { id: string; title: string; content: string; variables: string[] };
    values: Record<string, string>;
    genders: Record<string, 'male' | 'female'>;
  } | null>(null);

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
      const autoSections = service.clauses.map(clause => ({
        title: clause.title,
        content: replaceVariablesInText(clause.text)
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
        const updatedSections = service.clauses.map(clause => ({
          title: clause.title,
          content: replaceVariablesInText(clause.text)
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
    setCustomSections(prev => [...prev, { title, content }]);
    setShowSectionsWarehouse(false);
  };

  // פונקציות מערכת למידה
  const convertToEditableSections = () => {
    if (typeof window === 'undefined') return;
    
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
    
    setCustomSections(prev => 
      prev.map((section, index) => 
        `section_${index}` === updatedSection.id ? 
          { title: updatedSection.title, content: updatedSection.content } : 
          section
      )
    );
  };

  const handleSaveToWarehouse = (section: EditableSectionType) => {
    console.log('Saved to warehouse:', section);
  };

  const handleSaveToLearning = (section: EditableSectionType) => {
    console.log('Saved to learning:', section);
  };

  const extractVariablesFromContent = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))] : [];
  };

  const isGenderRelevantVariable = (variable: string): boolean => {
    const genderRelevantVariables = [
      'lawyer_name', 'client_name', 'attorney_name', 'witness_name',
      'court_name', 'judge_name', 'expert_name'
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
      'email': 'אימייל'
    };
    return labels[variable] || variable;
  };

  const handleSelectFromWarehouse = (warehouseSection: any) => {
    const { replaceTextWithGender } = require('@/lib/hebrew-gender');
    const genderedContent = replaceTextWithGender(warehouseSection.content, 'male');
    
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

        {/* ייצוא */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ייצוא המסמך</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={async () => {
                const success = await exportFeeAgreementToWord(
                  generateFeeAgreement(),
                  `הסכם-שכר-טרחה-${agreementData.clients[0]?.name || 'לקוח'}.docx`
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
                  <p className="text-gray-600">מחסן סעיפים בפיתוח...</p>
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
                <p>למשתנים של אנשים (שמות) יש אפשרות לבחור מגדר. זה יעזור להציג את הטקסט הנכון (זכר/נקבה) במסמך.</p>
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
                    let finalContent = variablesModal.section.content;
                    Object.keys(variablesModal.values).forEach(key => {
                      const value = variablesModal.values[key];
                      let replacedValue = value;
                      
                      if (isGenderRelevantVariable(key) && variablesModal.genders[key]) {
                        const { replaceTextWithGender } = require('@/lib/hebrew-gender');
                        replacedValue = replaceTextWithGender(value, variablesModal.genders[key]);
                      }
                      
                      finalContent = finalContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), replacedValue);
                    });

                    setCustomSections(prev => [...prev, {
                      title: variablesModal.section.title,
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
    </div>
  );
}
