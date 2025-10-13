'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, Calendar, User, Scale, BookOpen, X, Download } from 'lucide-react';
import SimpleExportButtons from '../SimpleExportButtons';
import SimpleAIImprover from '../SimpleAIImprover';
import UniversalSectionsWarehouse from '../UniversalSectionsWarehouse';
import { exportFeeAgreementToWord } from './FeeAgreementExporter';
import { AuthService } from '@/lib/auth';
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
    court: string;
    description: string;
    complexity: 'פשוט' | 'בינוני' | 'מורכב';
  };

  // תמחור
  fees: {
    type: 'שעתי' | 'קבוע' | 'הצלחה' | 'מעורב';
    hourlyRate?: string;
    fixedAmount?: string;
    successPercentage?: string;
    advancePayment?: string;
    estimatedHours?: string;
    // מעורב: מקדמה + אחוזים
    mixedAdvance?: string; // תשלום ראשוני קבוע
    mixedPercentage?: string; // אחוז מהתוצאה
    mixedMinimum?: string; // תשלום מינימלי גם אם אין הצלחה
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
  const currentUser = AuthService.getCurrentUser();
  
  const [agreementData, setAgreementData] = useState<FeeAgreementData>({
    lawyer: {
      name: currentUser?.name || '',
      license: currentUser?.licenseNumber || '',
      address: currentUser?.officeAddress || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || ''
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
      court: '',
      description: '',
      complexity: 'בינוני'
    },
    fees: {
      type: 'שעתי',
      hourlyRate: '',
      fixedAmount: '',
      successPercentage: '',
      advancePayment: '',
      estimatedHours: ''
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

  // עדכון פרטי עורך הדין אם המשתמש משתנה
  useEffect(() => {
    if (currentUser) {
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
  }, [currentUser]);

  // טעינת סעיפים אוטומטית בהתאם לסוג השירות
  useEffect(() => {
    if (selectedServiceType && feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories]) {
      const service = feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories];
      const autoSections = service.clauses.map(clause => ({
        title: clause.title,
        content: clause.text
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
      let defaultFees = {
        type: 'שעתי' as const,
        hourlyRate: '',
        estimatedHours: '',
        fixedAmount: '',
        successFee: '',
        mixedFee: '',
        advancePayment: ''
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
            type: 'קבוע',
            hourlyRate: '',
            estimatedHours: '',
            fixedAmount: '5000',
            successFee: '',
            mixedFee: '',
            advancePayment: '2500'
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% לאחר אישור טיוטת ההסכם על ידי הלקוח ובטרם חתימתו.';
          break;
        
        case 'צוואת_יחיד':
          defaultFees = {
            type: 'קבוע',
            hourlyRate: '',
            estimatedHours: '',
            fixedAmount: '3000',
            successFee: '',
            mixedFee: '',
            advancePayment: '1500'
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד חתימת הצוואה בפני העדים.';
          break;

        case 'צוואה_הדדית':
          defaultFees = {
            type: 'קבוע',
            hourlyRate: '',
            estimatedHours: '',
            fixedAmount: '5500',
            successFee: '',
            mixedFee: '',
            advancePayment: '2750'
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד חתימת הצוואות בפני העדים.';
          break;

        case 'ייפוי_כוח_מתמשך':
          defaultFees = {
            type: 'קבוע',
            hourlyRate: '',
            estimatedHours: '',
            fixedAmount: '4000',
            successFee: '',
            mixedFee: '',
            advancePayment: '2000'
          };
          defaultTerms.paymentTerms = '50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50% במעמד החתימה על ייפוי הכוח.';
          break;

        case 'התנגדות_לצוואה':
          defaultFees = {
            type: 'שעתי',
            hourlyRate: '900',
            estimatedHours: '20',
            fixedAmount: '',
            successFee: '5',
            mixedFee: '',
            advancePayment: '12000'
          };
          defaultTerms.paymentTerms = 'מקדמה חודשית בסך 10,000 ש\"ח על חשבון שכר הטרחה. בתום כל חודש תיערך התחשבנות.';
          break;

        case 'אפוטרופסות':
          defaultFees = {
            type: 'קבוע',
            hourlyRate: '',
            estimatedHours: '',
            fixedAmount: '8000',
            successFee: '',
            mixedFee: '',
            advancePayment: '4000'
          };
          defaultTerms.paymentTerms = 'תשלום מלא עם החתימה על ההסכם.';
          break;

        case 'פירוק_שיתוף':
          defaultFees = {
            type: 'מעורב',
            hourlyRate: '850',
            estimatedHours: '25',
            fixedAmount: '',
            successFee: '4',
            mixedFee: '15000',
            advancePayment: '8000'
          };
          defaultTerms.paymentTerms = 'מקדמה חודשית בסך 8,000 ש\"ח על חשבון שכר הטרחה. בסוף כל חודש תיערך התחשבנות.';
          break;

        case 'תביעה_כספית':
          defaultFees = {
            type: 'הצלחה',
            hourlyRate: '',
            estimatedHours: '',
            fixedAmount: '',
            successFee: '12',
            mixedFee: '',
            advancePayment: '5000'
          };
          defaultTerms.paymentTerms = 'מקדמה ראשונית בסך 30% משכר הטרחה המוערך עם החתימה על הסכם זה. יתרת התשלום תשולם בשלבים או בסיום ההליך.';
          break;

        case 'ייעוץ_משפטי':
          defaultFees = {
            type: 'שעתי',
            hourlyRate: '750',
            estimatedHours: '10',
            fixedAmount: '',
            successFee: '',
            mixedFee: '',
            advancePayment: ''
          };
          defaultTerms.paymentTerms = 'תשלום יבוצע על בסיס חודשי לפי דו\"ח שעות מפורט.';
          break;
      }

      // עדכון הנתונים
      setAgreementData(prev => ({
        ...prev,
        fees: defaultFees,
        terms: defaultTerms
      }));
    }
  }, [selectedServiceType]);

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
    
    // עדכון הסעיפים עם הסכומים החדשים
    updateSectionsWithNewFees(field, value);
  };

  const updateSectionsWithNewFees = (field: keyof typeof agreementData.fees, value: string) => {
    if (!selectedServiceType) return;
    
    const service = feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories];
    if (!service) return;

    const newFees = { ...agreementData.fees, [field]: value };
    
    // עדכון הסעיפים עם הסכומים החדשים
    const updatedSections = service.clauses.map(clause => {
      let updatedText = clause.text;
      
      // החלפת סכומים בתוך הטקסט
      if (clause.id.includes('_002') || clause.id.includes('_003')) { // סעיפי שכר טרחה
        if (newFees.type === 'קבוע' && newFees.fixedAmount) {
          updatedText = updatedText.replace(/_______ ש\"ח/g, `${newFees.fixedAmount} ש\"ח`);
          updatedText = updatedText.replace(/________ ש\"ח/g, `${newFees.fixedAmount} ש\"ח`);
        }
        if (newFees.advancePayment) {
          const advancePercent = newFees.fixedAmount ? 
            Math.round((parseInt(newFees.advancePayment) / parseInt(newFees.fixedAmount)) * 100) : 50;
          updatedText = updatedText.replace(/50%/g, `${advancePercent}%`);
          updatedText = updatedText.replace(/היתרה בשיעור 50%/g, `היתרה בשיעור ${100 - advancePercent}%`);
        }
      }
      
      return {
        title: clause.title,
        content: updatedText
      };
    });
    
    setCustomSections(updatedSections);
  };

  const updateTerms = (field: keyof typeof agreementData.terms, value: string) => {
    setAgreementData(prev => ({
      ...prev,
      terms: { ...prev.terms, [field]: value }
    }));
    
    // עדכון הסעיפים עם תנאי התשלום החדשים
    updateSectionsWithNewTerms(field, value);
  };

  const updateSectionsWithNewTerms = (field: keyof typeof agreementData.terms, value: string) => {
    if (!selectedServiceType) return;
    
    const service = feeAgreementTemplates.serviceCategories[selectedServiceType as keyof typeof feeAgreementTemplates.serviceCategories];
    if (!service) return;

    const newTerms = { ...agreementData.terms, [field]: value };
    
    // עדכון הסעיפים עם תנאי התשלום החדשים
    const updatedSections = service.clauses.map(clause => {
      let updatedText = clause.text;
      
      // עדכון תנאי תשלום
      if (field === 'paymentTerms' && (clause.id.includes('_002') || clause.id.includes('_003'))) {
        // החלפת תנאי התשלום בתוך הטקסט
        if (newTerms.paymentTerms.includes('50%')) {
          // אם המשתמש עדיין משתמש ב-50%, נשאיר את זה
        } else {
          // אם המשתמש שינה את תנאי התשלום, נחליף את הטקסט הסטנדרטי
          updatedText = updatedText.replace(/וישולם כלהלן: 50% במעמד החתימה על הסכם זה, והיתרה בשיעור 50%.*?\./g, 
            newTerms.paymentTerms);
        }
      }
      
      return {
        title: clause.title,
        content: updatedText
      };
    });
    
    setCustomSections(updatedSections);
  };

  const handleAddSection = (content: string, title: string) => {
    setCustomSections(prev => [...prev, { title, content }]);
    setShowSectionsWarehouse(false);
  };

  const generateFeeAgreement = (): string => {
    const baseAgreement = `הסכם שכר טרחה

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

1.2. בית המשפט/בית הדין: ${agreementData.case.court || '[שם בית המשפט/דין]'}

1.3. תיאור התיק: ${agreementData.case.description || '[תיאור מפורט של התיק והשירותים הנדרשים]'}

1.4. רמת מורכבות: ${agreementData.case.complexity}

2. שכר הטרחה

`;

    // חישוב שכר טרחה לפי סוג
    switch (agreementData.fees.type) {
      case 'שעתי':
        return `${baseAgreement}2.1. שכר הטרחה יחושב לפי שעות עבודה בפועל.

2.2. תעריף שעתי: ${agreementData.fees.hourlyRate || '[סכום]'} ₪ לשעה.

2.3. הערכת שעות עבודה: ${agreementData.fees.estimatedHours || '[מספר]'} שעות.

2.4. סכום הערכה כולל: ${agreementData.fees.hourlyRate && agreementData.fees.estimatedHours ? 
          (parseInt(agreementData.fees.hourlyRate || '0') * parseInt(agreementData.fees.estimatedHours || '0')).toLocaleString() : '[סכום]'} ₪.

${agreementData.fees.advancePayment ? `2.5. מקדמה: ${agreementData.fees.advancePayment} ₪ תשולם עם החתימה על ההסכם.` : ''}

3. תנאי תשלום

3.1. ${agreementData.terms.paymentTerms || 'חשבונית תישלח מדי חודש ותשולם תוך 30 ימים מקבלתה.'}

3.2. הוצאות: ${agreementData.terms.expensesCoverage || 'הוצאות משפט (אגרות, עלויות מומחים, נסיעות) יחולו על הלקוח ויחויבו בנפרד.'}

4. סיום ההתקשרות

4.1. ${agreementData.terms.terminationClause || 'כל צד יכול לסיים את ההתקשרות בהודעה של 14 ימים מראש.'}

4.2. במקרה סיום ההתקשרות, הלקוח ישלם עבור העבודה שבוצעה עד למועד הסיום.

4.3. עורך הדין יעביר ללקוח את כל החומרים והמסמכים הנוגעים לתיק.

${customSections.length > 0 ? `
5. סעיפים נוספים

${customSections.map((section, index) => `5.${index + 1}. ${section.title}

${section.content}`).join('\n\n')}

` : ''}

${customSections.length > 0 ? '6' : '5'}. תנאים מיוחדים

${agreementData.terms.specialConditions || 'אין תנאים מיוחדים.'}

${customSections.length > 0 ? '7' : '6'}. תוקף ההסכם

הסכם זה ייכנס לתוקף עם חתימת שני הצדדים ויהיה בתוקף עד לסיום הטיפול בתיק או עד לסיום ההתקשרות על פי סעיף 4.

התאריך: ${new Date(agreementDate).toLocaleDateString('he-IL')}

________________________           ________________________
    חתימת עורך הדין                    חתימת הלקוח
     ${agreementData.lawyer.name || '[שם]'}                        ${agreementData.client.name || '[שם]'}

הסכם זה נחתם בשני עותקים, עותק לכל צד.`;

      case 'קבוע':
        return `${baseAgreement}2.1. שכר הטרחה הוא סכום חד פעמי וקבוע: ${agreementData.fees.fixedAmount || '[סכום]'} ₪.

2.2. הסכום יכלול את כל השירותים המשפטיים הנדרשים לטיפול בתיק.

2.3. ${agreementData.fees.advancePayment ? `מקדמה: ${agreementData.fees.advancePayment} ₪, יתרה בסיום הטיפול.` : 'התשלום יבוצע בסיום הטיפול בתיק.'}

3. תנאי תשלום

3.1. ${agreementData.terms.paymentTerms || 'התשלום יבוצע תוך 7 ימים מסיום הטיפול בתיק.'}

3.2. הוצאות: ${agreementData.terms.expensesCoverage || 'הוצאות משפט יחולו על הלקוח בנפרד.'}

4. סיום ההתקשרות

4.1. ${agreementData.terms.terminationClause || 'אם הלקוח יבחר לסיים את ההתקשרות לפני סיום הטיפול, ישלם יחסית לעבודה שבוצעה.'}

${customSections.length > 0 ? `
5. סעיפים נוספים

${customSections.map((section, index) => `5.${index + 1}. ${section.title}

${section.content}`).join('\n\n')}

` : ''}

${customSections.length > 0 ? '6' : '5'}. תנאים מיוחדים

${agreementData.terms.specialConditions || 'אין תנאים מיוחדים.'}

${customSections.length > 0 ? '7' : '6'}. תוקף ההסכם

הסכם זה תקף מיום החתימה ועד לסיום הטיפול בתיק.

התאריך: ${new Date(agreementDate).toLocaleDateString('he-IL')}

________________________           ________________________
    חתימת עורך הדין                    חתימת הלקוח
     ${agreementData.lawyer.name || '[שם]'}                        ${agreementData.client.name || '[שם]'}`;

      case 'הצלחה':
        return `${baseAgreement}2.1. שכר הטרחה מותנה בהצלחה בתיק.

2.2. במקרה הצלחה: ${agreementData.fees.successPercentage || '[אחוז]'}% מהסכום שיתקבל בפועל.

2.3. במקרה כישלון: אין תשלום שכר טרחה.

2.4. ${agreementData.fees.advancePayment ? `מקדמה להוצאות: ${agreementData.fees.advancePayment} ₪.` : 'ללא מקדמה.'}

2.5. הצלחה מוגדרת כ: קבלת פסק דין חיובי או הסדר חוץ-משפטי לטובת הלקוח.

3. תנאי תשלום

3.1. התשלום יבוצע תוך 7 ימים מקבלת הכסף בפועל.

3.2. הוצאות משפט יחולו על הלקוח גם במקרה כישלון.

4. סיום ההתקשרות

4.1. הלקוח יכול לסיים את ההתקשרות בכל עת, אך ישלם עבור הוצאות שנגרמו.

4.2. עורך הדין לא יכול לסיים את ההתקשרות ללא סיבה מוצדקת.

${customSections.length > 0 ? `
5. סעיפים נוספים

${customSections.map((section, index) => `5.${index + 1}. ${section.title}

${section.content}`).join('\n\n')}

` : ''}

${customSections.length > 0 ? '6' : '5'}. תנאים מיוחדים

${agreementData.terms.specialConditions || 'במקרה הסדר חוץ-משפטי, שכר הטרחה יחושב מסכום ההסדר.'}

${customSections.length > 0 ? '7' : '6'}. תוקף ההסכם

הסכם זה תקף עד לסיום התיק או ביטול על ידי הלקוח.

התאריך: ${new Date(agreementDate).toLocaleDateString('he-IL')}

________________________           ________________________
    חתימת עורך הדין                    חתימת הלקוח
     ${agreementData.lawyer.name || '[שם]'}                        ${agreementData.client.name || '[שם]'}`;

      case 'מעורב':
        return `${baseAgreement}2.1. שכר הטרחה כולל שני מרכיבים:

2.1.1. תשלום ראשוני קבוע: ${agreementData.fees.mixedAdvance || '[סכום]'} ₪, ששולם עם חתימת הסכם זה.

2.1.2. תשלום נוסף מותנה בהצלחה: ${agreementData.fees.mixedPercentage || '[אחוז]'}% מהסכום שיתקבל בפועל.

${agreementData.fees.mixedMinimum ? `2.1.3. תשלום מינימלי: ${agreementData.fees.mixedMinimum} ₪ ישולם גם אם התוצאה פחותה מהצפוי.` : ''}

2.2. הצלחה מוגדרת כ: קבלת פסק דין חיובי, הסדר פשרה, או כל תוצאה חיובית אחרת לטובת הלקוח.

2.3. חישוב דוגמה: אם יתקבל סכום של 100,000 ₪, שכר הטרחה הכולל יהיה:
     - תשלום ראשוני: ${agreementData.fees.mixedAdvance || '0'} ₪
     - אחוז מהתוצאה: ${agreementData.fees.mixedPercentage ? `${(100000 * parseInt(agreementData.fees.mixedPercentage || '0') / 100).toLocaleString()} ₪` : '0 ₪'}
     - סה"כ: ${agreementData.fees.mixedAdvance && agreementData.fees.mixedPercentage ? `${(parseInt(agreementData.fees.mixedAdvance || '0') + (100000 * parseInt(agreementData.fees.mixedPercentage || '0') / 100)).toLocaleString()} ₪` : '[סכום]'}

3. תנאי תשלום

3.1. ${agreementData.terms.paymentTerms || 'התשלום הנוסף (אחוז מההצלחה) יבוצע תוך 7 ימים מקבלת הכסף בפועל.'}

3.2. הוצאות: ${agreementData.terms.expensesCoverage || 'הוצאות משפט יחולו על הלקוח ויקוזזו מהסכום המתקבל לפני חישוב שכר הטרחה.'}

4. סיום ההתקשרות

4.1. ${agreementData.terms.terminationClause || 'במקרה סיום ההתקשרות לפני הצלחה, הלקוח ישלם רק את התשלום הראשוני ואת ההוצאות שנגרמו.'}

4.2. במקרה של הסדר פשרה לאחר סיום ההתקשרות, שכר הטרחה יחושב יחסית לתרומת עורך הדין.

${customSections.length > 0 ? `
5. סעיפים נוספים

${customSections.map((section, index) => `5.${index + 1}. ${section.title}

${section.content}`).join('\n\n')}

` : ''}

${customSections.length > 0 ? '6' : '5'}. תנאים מיוחדים

${agreementData.terms.specialConditions || 'אין תנאים מיוחדים.'}

${customSections.length > 0 ? '7' : '6'}. תוקף ההסכם

הסכם זה ייכנס לתוקף עם חתימת שני הצדדים ויהיה בתוקף עד לסיום הטיפול בתיק.

התאריך: ${new Date(agreementDate).toLocaleDateString('he-IL')}

________________________           ________________________
    חתימת עורך הדין                    חתימת הלקוח
     ${agreementData.lawyer.name || '[שם]'}                        ${agreementData.client.name || '[שם]'}`;

      default:
        return baseAgreement + `2.1. [יש לבחור סוג תמחור]

3. תנאי תשלום

3.1. ${agreementData.terms.paymentTerms || 'התשלום יבוצע בהתאם לתנאים שיקבעו.'}

4. סיום ההתקשרות

4.1. ${agreementData.terms.terminationClause || 'כל צד יכול לסיים את ההתקשרות בהודעה מראש.'}

${customSections.length > 0 ? `
5. סעיפים נוספים

${customSections.map((section, index) => `5.${index + 1}. ${section.title}

${section.content}`).join('\n\n')}

` : ''}

${customSections.length > 0 ? '6' : '5'}. תנאים מיוחדים

${agreementData.terms.specialConditions || 'אין תנאים מיוחדים.'}

${customSections.length > 0 ? '7' : '6'}. תוקף ההסכם

הסכם זה ייכנס לתוקף עם חתימת שני הצדדים.

התאריך: ${new Date(agreementDate).toLocaleDateString('he-IL')}

________________________           ________________________
    חתימת עורך הדין                    חתימת הלקוח
     ${agreementData.lawyer.name || '[שם]'}                        ${agreementData.client.name || '[שם]'}`;
    }
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
            {currentUser && (
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
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={agreementData.case.subject}
              onChange={(e) => updateCase('subject', e.target.value)}
              placeholder="נושא התיק (תביעה, הסכם, ייעוץ...)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              dir="rtl"
            />
            
            <input
              type="text"
              value={agreementData.case.court}
              onChange={(e) => updateCase('court', e.target.value)}
              placeholder="בית משפט/דין רלוונטי"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              dir="rtl"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">רמת מורכבות</label>
            <select
              value={agreementData.case.complexity}
              onChange={(e) => updateCase('complexity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="פשוט">פשוט - טיפול בסיסי</option>
              <option value="בינוני">בינוני - דורש מחקר וכנה</option>
              <option value="מורכב">מורכב - דורש עבודה מקצועית נרחבת</option>
            </select>
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
              <option value="שעתי">תמחור שעתי</option>
              <option value="קבוע">סכום קבוע חד פעמי</option>
              <option value="הצלחה">אחוז הצלחה</option>
              <option value="מעורב">מעורב (מקדמה + הצלחה)</option>
            </select>
          </div>

          {/* שדות תמחור דינמיים */}
          <div className="space-y-4">
            {agreementData.fees.type === 'שעתי' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={agreementData.fees.hourlyRate || ''}
                    onChange={(e) => updateFees('hourlyRate', e.target.value)}
                    placeholder="תעריף שעתי (₪)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="ltr"
                  />
                  
                  <input
                    type="text"
                    value={agreementData.fees.estimatedHours || ''}
                    onChange={(e) => updateFees('estimatedHours', e.target.value)}
                    placeholder="הערכת שעות עבודה"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    dir="ltr"
                  />
                </div>
                
                {agreementData.fees.hourlyRate && agreementData.fees.estimatedHours && (
                  <div className="bg-white p-3 rounded border border-yellow-300 text-sm">
                    <strong>הערכת עלות כוללת: </strong>
                    {(parseInt(agreementData.fees.hourlyRate || '0') * parseInt(agreementData.fees.estimatedHours || '0')).toLocaleString()} ₪
                  </div>
                )}
              </>
            )}

            {agreementData.fees.type === 'קבוע' && (
              <input
                type="text"
                value={agreementData.fees.fixedAmount || ''}
                onChange={(e) => updateFees('fixedAmount', e.target.value)}
                placeholder="סכום קבוע (₪)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                dir="ltr"
              />
            )}

            {agreementData.fees.type === 'הצלחה' && (
              <>
                <input
                  type="text"
                  value={agreementData.fees.successPercentage || ''}
                  onChange={(e) => updateFees('successPercentage', e.target.value)}
                  placeholder="אחוז הצלחה (%)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  dir="ltr"
                />
                <input
                  type="text"
                  value={agreementData.fees.advancePayment || ''}
                  onChange={(e) => updateFees('advancePayment', e.target.value)}
                  placeholder="מקדמה להוצאות (₪) - אופציונלי"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  dir="ltr"
                />
              </>
            )}

            {agreementData.fees.type === 'מעורב' && (
              <>
                <div className="bg-white border-2 border-yellow-400 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-yellow-900 mb-3">💰 מבנה תשלום מעורב</h3>
                  <p className="text-sm text-yellow-800 mb-4">
                    שילוב של תשלום קבוע ראשוני + אחוז מהתוצאה בהצלחה
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">
                        תשלום ראשוני קבוע (מקדמה)
                      </label>
                      <input
                        type="text"
                        value={agreementData.fees.mixedAdvance || ''}
                        onChange={(e) => updateFees('mixedAdvance', e.target.value)}
                        placeholder="סכום קבוע ששולם בחתימה (₪)"
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">
                        אחוז מהתוצאה (במקרה הצלחה)
                      </label>
                      <input
                        type="text"
                        value={agreementData.fees.mixedPercentage || ''}
                        onChange={(e) => updateFees('mixedPercentage', e.target.value)}
                        placeholder="אחוז מהסכום שיתקבל (%)"
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                        dir="ltr"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-900 mb-1">
                        תשלום מינימלי (גם ללא הצלחה) - אופציונלי
                      </label>
                      <input
                        type="text"
                        value={agreementData.fees.mixedMinimum || ''}
                        onChange={(e) => updateFees('mixedMinimum', e.target.value)}
                        placeholder="סכום מינימלי שישולם בכל מקרה (₪)"
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  
                  {agreementData.fees.mixedAdvance && agreementData.fees.mixedPercentage && (
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-sm">
                      <strong>📊 דוגמת חישוב:</strong>
                      <ul className="mt-2 mr-4 space-y-1">
                        <li>• תשלום ראשוני: {parseInt(agreementData.fees.mixedAdvance || '0').toLocaleString()} ₪</li>
                        <li>• אם תתקבל תוצאה של 100,000 ₪: {(100000 * parseInt(agreementData.fees.mixedPercentage || '0') / 100).toLocaleString()} ₪</li>
                        <li>• <strong>סה"כ:</strong> {(parseInt(agreementData.fees.mixedAdvance || '0') + (100000 * parseInt(agreementData.fees.mixedPercentage || '0') / 100)).toLocaleString()} ₪</li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            {(agreementData.fees.type === 'קבוע' || agreementData.fees.type === 'שעתי') && (
              <input
                type="text"
                value={agreementData.fees.advancePayment || ''}
                onChange={(e) => updateFees('advancePayment', e.target.value)}
                placeholder="מקדמה (₪) - אופציונלי"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                dir="ltr"
              />
            )}
          </div>
        </section>

        {/* תנאים מיוחדים */}
        <section className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
          <h2 className="text-xl font-bold text-orange-900 mb-4">תנאי ההסכם</h2>
          
          {/* הודעה ברורה */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              💡 <strong>טיפ:</strong> תנאי התשלום נטענו אוטומטית. 
              כשתשני אותם כאן - הם יתעדכנו אוטומטית גם בסעיפים למטה!
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תנאי תשלום</label>
              <textarea
                value={agreementData.terms.paymentTerms}
                onChange={(e) => updateTerms('paymentTerms', e.target.value)}
                placeholder="מתי ואיך ישולם השכר (תוך 30 ימים, במקדמות...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={2}
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כיסוי הוצאות</label>
              <textarea
                value={agreementData.terms.expensesCoverage}
                onChange={(e) => updateTerms('expensesCoverage', e.target.value)}
                placeholder="מי משלם הוצאות משפט, מומחים, נסיעות וכו'"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={2}
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">סיום ההתקשרות</label>
              <textarea
                value={agreementData.terms.terminationClause}
                onChange={(e) => updateTerms('terminationClause', e.target.value)}
                placeholder="תנאי סיום ההסכם, הודעה מוקדמת, זכויות הצדדים"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={2}
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תנאים מיוחדים</label>
              <textarea
                value={agreementData.terms.specialConditions}
                onChange={(e) => updateTerms('specialConditions', e.target.value)}
                placeholder="תנאים נוספים, הגבלות, זכויות מיוחדות"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={3}
                dir="rtl"
                style={{ fontFamily: 'David', fontSize: '13pt' }}
              />
            </div>
          </div>
        </section>

        {/* עוזר AI */}
        <section className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-900">🤖 עוזר AI לשיפור הסכמים</h2>
            <div className="flex gap-2">
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
