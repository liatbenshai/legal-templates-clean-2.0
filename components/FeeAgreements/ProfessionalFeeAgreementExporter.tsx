'use client';

import { useState } from 'react';
import { detectGenderFromName, replaceTextWithGender } from '@/lib/hebrew-gender';
import { replaceFeeAgreementTemplateTextWithGender } from '@/lib/fee-agreement-template-utils';
import feeAgreementTemplates from '@/lib/fee-agreement-templates.json';

interface ProfessionalFeeAgreementExporterProps {
  agreementData: {
    lawyer: {
      name: string;
      license: string;
      address: string;
      phone: string;
      email: string;
      gender: 'male' | 'female';
    };
    clients: Array<{
      id: string;
      name: string;
      idNumber: string;
      address: string;
      phone: string;
      email: string;
      gender: 'male' | 'female';
    }>;
    case: {
      subject: string;
    };
    fees: {
      type: 'סכום_כולל' | 'מקדמה_והצלחה' | 'סכום_ואחוזים';
      totalAmount?: string;
      paymentStructure?: string;
      advancePayment?: string;
      successPercentage?: string;
      fixedAmount?: string;
      stages?: string;
    };
    terms: {
      paymentTerms: string;
      expensesCoverage: string;
      terminationClause: string;
      specialConditions: string;
    };
    customSections?: Array<{
      title: string;
      content: string;
    }>;
    serviceScopeMapping?: {
      [key: string]: string;
    };
    generalClauses?: {
      [key: string]: Array<{
        id: string;
        title: string;
        text?: string;
        subSections?: Array<{
          id?: string;
          title: string;
          text: string;
        }>;
      }>;
    };
    selectedServiceType?: string;
  };
  agreementDate: {
    day: string;
    month: string;
    year: string;
  };
  className?: string;
}

export default function ProfessionalFeeAgreementExporter({
  agreementData,
  agreementDate,
  className = ''
}: ProfessionalFeeAgreementExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // פונקציה לזיהוי המגדר הכולל של הלקוחות
  const getClientsGender = () => {
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

  // פונקציה לקבלת הטקסט הנכון לפי מגדר
  const getGenderText = (maleText: string, femaleText: string, pluralText: string) => {
    // אם יש יותר מלקוח אחד - תמיד רבים
    if (agreementData.clients.length > 1) {
      return pluralText;
    }
    
    const gender = getClientsGender();
    switch (gender) {
      case 'male': return maleText;
      case 'female': return femaleText;
      case 'plural': return pluralText;
      default: return maleText;
    }
  };

  // פונקציה להחלפת משתני מגדר
  const applyGenderToText = (text: string) => {
    const clientsGender = getClientsGender();
    
    // טיפול בפורמט: {{gender:זכר|נקבה|רבים}}
    let result = text.replace(/\{\{gender:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (match, male, female, plural) => {
      if (male.includes('מצווה') || female.includes('מצווה') || plural.includes('מצווים')) {
        switch (clientsGender) {
          case 'male': return 'לקוח';
          case 'female': return 'לקוחה';
          case 'plural': return 'לקוחות';
          default: return 'לקוח';
        }
      }
      switch (clientsGender) {
        case 'male': return male;
        case 'female': return female;
        case 'plural': return plural;
        default: return male;
      }
    });
    
    // טיפול במשתנה {{לקוח}}
    result = result.replace(/ה?\{\{לקוח\}\}/g, (match) => {
      const hasHey = match.startsWith('ה');
      const replacement = hasHey ? 
        (clientsGender === 'plural' ? 'הלקוחות' : (clientsGender === 'female' ? 'הלקוחה' : 'הלקוח')) : 
        (clientsGender === 'plural' ? 'לקוחות' : (clientsGender === 'female' ? 'לקוחה' : 'לקוח'));
      return replacement;
    });
    
    // טיפול במשתנה {{צד}}
    result = result.replace(/ה?\{\{צד\}\}/g, (match) => {
      const hasHey = match.startsWith('ה');
      const replacement = hasHey ? 
        (clientsGender === 'plural' ? 'הצדדים' : 'הצד') : 
        (clientsGender === 'plural' ? 'צדדים' : 'צד');
      return replacement;
    });
    
    return result;
  };

  // פונקציה לבניית מבנה היררכי מסעיפים שטוחים
  const buildHierarchicalSections = (flatSections: any[]) => {
    if (!flatSections || flatSections.length === 0) return [];
    
    // פונקציה עזר לקבלת order (תומך גם ב-order_index מ-Supabase וגם ב-order מקומי)
    const getOrder = (section: any) => section.order_index !== undefined ? section.order_index : (section.order || 0);
    
    // מיין את כל הסעיפים לפי order
    const sortedSections = [...flatSections].sort((a, b) => getOrder(a) - getOrder(b));
    
    // מצא את כל הסעיפים הראשיים ומיין אותם
    const mainSections = sortedSections
      .filter(s => s.level === 'main')
      .sort((a, b) => getOrder(a) - getOrder(b));
    
    // בנה מבנה היררכי
    return mainSections.map(mainSection => {
      // מצא את כל התתי סעיפים של הסעיף הראשי הזה ומיין לפי order
      const subSections = sortedSections
        .filter(s => s.level === 'sub' && (s.parentId === mainSection.id || s.parent_id === mainSection.id))
        .sort((a, b) => getOrder(a) - getOrder(b));
      
      // אם יש תתי-סעיפים ואין תוכן, אל תשתמש בכותרת כתוכן
      const hasSubSections = subSections.length > 0;
      const sectionContent = mainSection.content || (hasSubSections ? '' : mainSection.title);
      
      const result: any = {
        id: mainSection.id,
        title: mainSection.title,
        text: sectionContent,
        content: sectionContent,
        subSections: []
      };
      
      // בנה את התתי סעיפים עם תתי תתי סעיפים
      result.subSections = subSections.map(subSection => {
        const subResult: any = {
          id: subSection.id,
          title: subSection.title,
          text: subSection.content || subSection.title,
          content: subSection.content || subSection.title,
          subSubSections: []
        };
        
        // מצא את כל התתי תתי סעיפים של התת-סעיף הזה ומיין לפי order
        const subSubSections = sortedSections
          .filter(s => s.level === 'sub-sub' && (s.parentId === subSection.id || s.parent_id === subSection.id))
          .sort((a, b) => getOrder(a) - getOrder(b));
        
        subResult.subSubSections = subSubSections.map(subSubSection => ({
          id: subSubSection.id,
          title: subSubSection.title,
          text: subSubSection.content || subSubSection.title,
          content: subSubSection.content || subSubSection.title
        }));
        
        return subResult;
      });
      
      return result;
    });
  };

  // פונקציה ליצירת טקסט שכר טרחה דינמי
  const generateFeeText = () => {
    const { fees } = agreementData;
    if (!fees || !fees.type) return '';
    
    const formatAmount = (amount: string) => {
      if (!amount) return '_______';
      const num = parseInt(amount.replace(/[^\d]/g, ''));
      return num ? num.toLocaleString('he-IL') : '_______';
    };
    
    switch (fees.type) {
      case 'סכום_כולל':
        return `בעד השירות המשפטי יעמוד על סך של ${formatAmount(fees.totalAmount || '')} ש"ח + מע"מ, ${fees.paymentStructure || 'ישולם במלואו במעמד החתימה על הסכם שכר טרחה זה'}.`;
      
      case 'מקדמה_והצלחה':
        return `בעד השירות המשפטי יעמוד על מקדמה בסך ${formatAmount(fees.advancePayment || '')} ש"ח + מע"מ, ו-${fees.successPercentage || '___'}% מהסכום שיתקבל בפועל. המקדמה ישולמה במעמד החתימה על הסכם זה, והאחוז ישולם עם קבלת התשלום מהצד שכנגד.`;
      
      case 'סכום_ואחוזים':
        return `בעד השירות המשפטי יעמוד על סכום קבוע של ${formatAmount(fees.fixedAmount || '')} ש"ח + מע"מ, ו-${fees.successPercentage || '___'}% מכל סכום שיתקבל בפועל מהזכייה.`;
      
      default:
        return 'ייקבע בהתאם לסוג השירות ויובא לידיעת הלקוח.';
    }
  };

  const exportToWord = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
              AlignmentType, WidthType, BorderStyle, LevelFormat, Header, Footer } = await import('docx');

      // קבועים
      const SIZES = {
        title: 32,
        normal: 24,
        small: 20
      };

      const SPACING = {
        line: 300,
        beforeTitle: 400,
        afterTitle: 200,
        beforeHeading: 300,
        afterHeading: 200,
        beforeParagraph: 120,
        afterParagraph: 120
      };

      const COLORS = {
        black: '000000',
        gray: '666666'
      };

      // קביעת המגדר הכולל של הלקוחות
      const clientsGender = getClientsGender();
      
      // הכנת הסעיף הראשון - תיאור השירות עם היקף השירותים האוטומטי
      const serviceScopeMapping = (feeAgreementTemplates.preamble?.serviceScopeMapping || {}) as Record<string, string>;
      const serviceDescription = agreementData.case?.subject || '';
      const multipleClients = (agreementData.clients?.length || 0) > 1;
      
      // מצא את המפתח ב-serviceScopeMapping שמתאים לערך (serviceDescription)
      // או השתמש ב-selectedServiceType אם קיים
      let serviceName = '';
      if (agreementData.selectedServiceType) {
        serviceName = agreementData.selectedServiceType;
      } else {
        // נסה למצוא את המפתח שמתאים לערך
        serviceName = Object.keys(serviceScopeMapping).find(key => 
          serviceScopeMapping[key] === serviceDescription || key === serviceDescription
        ) || serviceDescription;
      }
      
      // קבל את תיאור השירות המלא - אם serviceName הוא מפתח, קח את הערך, אחרת קח את serviceDescription
      const serviceScope = serviceScopeMapping[serviceName] || serviceDescription || 'שירות משפטי לפי הצורך';
      
      // צור את הסעיף הראשון החדש - נחלק אותו ל-4 תתי-סעיפים
      const firstSectionTemplate = feeAgreementTemplates.preamble?.firstSection?.text || 
        '{{multipleClients:הלקוחות|הלקוח}} שכרו את שירותיו של עורך הדין לצורך ייעוץ משפטי וטיפול משפטי בעניין {{serviceType}}. השירותים המשפטיים יכללו, בין היתר, את הפעולות המפורטות להלן: {{serviceScope}}. מובהר ומוסכם כי כל שירות משפטי אחר, שאינו נכלל במפורש בהגדרה זו, יחייב הסכם נפרד בכתב ותשלום שכר טרחה נוסף.';
      
      // חלק את התבנית ל-4 חלקים לפי \n\n
      // הטקסט ב-JSON מחולק ל-4 חלקים:
      // 1. הלקוחה פנתה... (חלק 1)
      // 2. עורך הדין מתחייב לייצג... (חלק 2 - נחליף ל"עורך הדין מתחייב לבצע את השירות הנ"ל.")
      // 3. הסכם זה מסדיר... (חלק 3)
      // 4. כל שירות משפטי נוסף... (חלק 4)
      const templateParts = firstSectionTemplate.split(/\n\n+/).filter(p => p.trim());
      
      // צור 4 חלקים ברורים:
      // 1. הלקוחה פנתה... (החלק הראשון)
      let part1 = templateParts[0] || '';
      // 2. עורך הדין מתחייב לבצע את השירות הנ"ל. (טקסט חדש - מחליף את החלק השני המקורי)
      let part2 = 'עורך הדין מתחייב לבצע את השירות הנ"ל.';
      // 3. הסכם זה מסדיר... (החלק השלישי - בדרך כלל templateParts[2] אם יש 4 חלקים)
      let part3 = '';
      if (templateParts.length >= 3) {
        // נבדוק אם החלק השלישי הוא "הסכם זה מסדיר"
        const candidate = templateParts[2];
        if (candidate.includes('הסכם זה מסדיר')) {
          part3 = candidate;
        } else {
          // נחפש את החלק שמכיל "הסכם זה מסדיר"
          const found = templateParts.find(p => p.includes('הסכם זה מסדיר'));
          part3 = found || 'הסכם זה מסדיר את מלוא היחסים בין הצדדים בכל הנוגע למתן השירותים המשפטיים המפורטים לעיל.';
        }
      } else {
        // אם אין חלק 3, נשתמש בברירת מחדל
        part3 = 'הסכם זה מסדיר את מלוא היחסים בין הצדדים בכל הנוגע למתן השירותים המשפטיים המפורטים לעיל.';
      }
      // 4. כל שירות משפטי נוסף... (החלק האחרון)
      let part4 = '';
      if (templateParts.length >= 4) {
        part4 = templateParts[3] || templateParts[templateParts.length - 1];
      } else if (templateParts.length >= 3) {
        // אם יש רק 3 חלקים, החלק האחרון יכול להיות "כל שירות משפטי נוסף"
        const lastPart = templateParts[templateParts.length - 1];
        if (lastPart.includes('כל שירות משפטי נוסף')) {
          part4 = lastPart;
        } else {
          part4 = 'כל שירות משפטי נוסף, לרבות טיפול בערכאות נוספות, הליכי ערעור, בקשות לעיכוב ביצוע, הליכי הוצאה לפועל, או כל הליך משפטי אחר שאינו מפורט במפורש בהסכם זה, יחייב התקשרות נפרדת והסכמה בכתב.';
        }
      } else {
        part4 = 'כל שירות משפטי נוסף, לרבות טיפול בערכאות נוספות, הליכי ערעור, בקשות לעיכוב ביצוע, הליכי הוצאה לפועל, או כל הליך משפטי אחר שאינו מפורט במפורש בהסכם זה, יחייב התקשרות נפרדת והסכמה בכתב.';
      }
      
      // עכשיו נעבד כל חלק בנפרד
      const processSectionPart = (text: string): string => {
        let processedText = text;
        
        // החלף את משתני multipleClients
        processedText = processedText.replace(/\{\{multipleClients:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (_match: string, pluralText: string, maleText: string, femaleText: string) => {
          if (multipleClients) return pluralText;
          return clientsGender === 'female' ? femaleText : maleText;
        });
        
        // החלף את {{תיאור העניין}} ו-{{תיאור השירותים}}
        processedText = processedText.replace(/\{\{תיאור העניין\}\}/g, serviceDescription || '[תיאור העניין]');
        processedText = processedText.replace(/\{\{תיאור השירותים\}\}/g, serviceDescription || '[תיאור השירותים]');
        processedText = processedText.replace(/\{\{serviceType\}\}/g, serviceName || serviceDescription || '[תיאור השירות המשפטי]');
        processedText = processedText.replace(/\{\{serviceScope\}\}/g, serviceScope);
        
        // החלף משתני הסכם ({{לקוח}}, {{gender:...}})
        processedText = replaceFeeAgreementTemplateTextWithGender(processedText, clientsGender);
        
        // הגנה על "עורך הדין" וכל מה שקשור אליו
        const lawyerPhrases: { [key: string]: string } = {};
        let phraseIndex = 0;
        
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
          processedText = processedText.replace(pattern, (match: string) => {
            const placeholder = `__LAWYER_PHRASE_${phraseIndex}__`;
            lawyerPhrases[placeholder] = match;
            phraseIndex++;
            return placeholder;
          });
        });
        
        processedText = processedText.replace(/עורך הדין/g, '__LAWYER_PLACEHOLDER__');
        processedText = processedText.replace(/עורך דין(?! בעל)/g, '__LAWYER_NO_HEY__');
        
        // הגנה על מילים שצריכות להישאר ללא שינוי
        const protectedPhrases: { [key: string]: string } = {};
        let protectedIndex = 0;
        
        const protectedPatterns = [
          /\bמידע מלא\b/g,
          /\bשאינו נכלל\b/g,
          /\bשכר טרחה\b/g,
          /\bשכר הטרחה\b/g,
          /\bשכר הטרחה המוסכם\b/g,
          /\bהצד המקבל\b/g,
          /\bהבא\b/g,
          /\bמינוי אפוטרופוס\b/g,
          /\bבמלואו\b/g,
          /\bמלאים\b/g,
          /\bבלתי מלאים\b/g,
          /\bשיפוי מלאים\b/g,
          /\bעד\s+(?:ל|שני|סיום|יום|מיצוי|לקבלת)/g,
          /\bעד\s+(?:סבבי|תיקונים|סיום)/g,
        ];
        
        protectedPatterns.forEach(pattern => {
          processedText = processedText.replace(pattern, (match: string) => {
            const placeholder = `__PROTECTED_${protectedIndex}__`;
            protectedPhrases[placeholder] = match;
            protectedIndex++;
            return placeholder;
          });
        });
        
        processedText = processedText.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
        processedText = processedText.replace(/__LAWYER_PLACEHOLDER__\s+רשאי/g, '__LAWYER_CAN__');
        processedText = processedText.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
        processedText = processedText.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, '__UNTIL_PLACEHOLDER__');
        
        // החלפת מגדר כללית
        processedText = replaceTextWithGender(processedText, clientsGender);
        
        // החזרת הביטויים המוגנים
        Object.keys(lawyerPhrases).forEach(placeholder => {
          processedText = processedText.replace(new RegExp(placeholder, 'g'), lawyerPhrases[placeholder]);
        });
        processedText = processedText.replace(/__LAWYER_CAN__/g, 'עורך הדין רשאי');
        processedText = processedText.replace(/__LAWYER_PLACEHOLDER__/g, 'עורך הדין');
        processedText = processedText.replace(/__LAWYER_NO_HEY__/g, 'עורך דין');
        
        Object.keys(protectedPhrases).forEach(placeholder => {
          processedText = processedText.replace(new RegExp(placeholder, 'g'), protectedPhrases[placeholder]);
        });
        processedText = processedText.replace(/__UNTIL_PLACEHOLDER__/g, 'עד ');
        processedText = processedText.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
        processedText = processedText.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
        
        // תיקונים נוספים
        processedText = processedText.replace(/עורך דין בעלת/g, 'עורך דין בעל');
        processedText = processedText.replace(/היא עורך דין/g, 'הוא עורך דין');
        processedText = processedText.replace(/שירותיה של עורך הדין/g, 'שירותיו של עורך הדין');
        processedText = processedText.replace(/עורך הדין רשאית/g, 'עורך הדין רשאי');
        processedText = processedText.replace(/מידע מלאה/g, 'מידע מלא');
        processedText = processedText.replace(/שאינו נכללה/g, 'שאינו נכלל');
        processedText = processedText.replace(/שכרה טרחה/g, 'שכר טרחה');
        processedText = processedText.replace(/שכרה הטרחה/g, 'שכר הטרחה');
        processedText = processedText.replace(/שכרה הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
        processedText = processedText.replace(/שכרו הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
        processedText = processedText.replace(/שכרה הטרחה המוסכמת/g, 'שכר הטרחה המוסכם');
        processedText = processedText.replace(/הצד המקבלת/g, 'הצד המקבל');
        processedText = processedText.replace(/הבאה/g, 'הבא');
        processedText = processedText.replace(/שלאחר משלוחה/g, 'הבא');
        processedText = processedText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
        processedText = processedText.replace(/באופן מלאה/g, 'באופן מלא');
        processedText = processedText.replace(/במלואה/g, 'במלואו');
        processedText = processedText.replace(/מלאה, שלמה/g, 'מלא, שלם');
        processedText = processedText.replace(/מלאה.*שלמה/g, 'מלא, שלם');
        processedText = processedText.replace(/מלאים\b/g, 'מלא');
        processedText = processedText.replace(/בלתי מלאים\b/g, 'בלתי מלא');
        processedText = processedText.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
        processedText = processedText.replace(/עדה למיצוי/g, 'עד למיצוי');
        processedText = processedText.replace(/עדה\s+(?:ל|שני|סיום|יום|לקבלת|ה'|מועד|בין)/g, (match: string) => match.replace(/עדה/g, 'עד'));
        processedText = processedText.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
        processedText = processedText.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
        processedText = processedText.replace(/בבקשה עדה/g, 'בבקשה עד');
        processedText = processedText.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
        processedText = processedText.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
        processedText = processedText.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
        processedText = processedText.replace(/עורך הדין רשאית/g, 'עורך הדין רשאי');
        processedText = processedText.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
        
        return processedText.trim();
      };
      
      // עבד כל חלק בנפרד (חלק 2 כבר מוכן, הוא טקסט קבוע)
      part1 = processSectionPart(part1);
      // part2 כבר מוכן - "עורך הדין מתחייב לבצע את השירות הנ"ל."
      part3 = processSectionPart(part3);
      part4 = processSectionPart(part4);
      
      // שמור את תתי-הסעיפים המעבדים
      const firstSectionSubSections = [part1, part2, part3, part4].filter(p => p && p.trim());
      
      // פונקציה ליצירת פסקאות מסעיף עם המספור הנכון
      // הסעיף הראשון הוא תמיד "תיאור השירות" (1), אז הסעיפים מ-customSections מתחילים מ-2
      const createSectionParagraphs = (section: any, level: number = 0, sectionIndex: number = 0) => {
        const paragraphs = [];
        
        // פונקציה להסרת הכותרת מהטקסט אם היא מופיעה בהתחלה
        const removeTitle = (text: string, title: string) => {
          if (!text || !title) return text;
          // הסרת רווחים מיותרים ובדיקה אם הטקסט מתחיל עם הכותרת
          const cleanText = text.trim();
          const cleanTitle = title.trim();
          if (cleanText.startsWith(cleanTitle)) {
            // הסר את הכותרת והחזר את השאר (ללא רווח בהתחלה)
            return cleanText.substring(cleanTitle.length).trim();
          }
          return text;
        };
        
        // כותרת הסעיף (אם קיימת) - השתמש ב-numbering של Word
        // גם הכותרת צריכה לעבור דרך החלפת מגדר!
        if (section.title && level === 0) {
          // עיבוד הכותרת עם החלפת מגדר
          let processedTitle = section.title;
          // שלב 1: החלפת משתני מגדר מיוחדים - כולל ה{{לקוח}}
          processedTitle = replaceFeeAgreementTemplateTextWithGender(processedTitle, clientsGender);
          // הגנה על ביטויים שצריכים להישאר ללא שינוי
          processedTitle = processedTitle.replace(/\bשכר טרחה\b/g, '__FEE_TITLE__');
          processedTitle = processedTitle.replace(/\bשכר הטרחה\b/g, '__FEE_THE_TITLE__');
          processedTitle = processedTitle.replace(/\bהצד המקבל\b/g, '__RECEIVING_PARTY_TITLE__');
          // שלב 2: החלפת כל הטקסט לפי מגדר
          processedTitle = replaceTextWithGender(processedTitle, clientsGender);
          // שלב 3: החזרת הביטויים המוגנים
          processedTitle = processedTitle.replace(/__FEE_TITLE__/g, 'שכר טרחה');
          processedTitle = processedTitle.replace(/__FEE_THE_TITLE__/g, 'שכר הטרחה');
          processedTitle = processedTitle.replace(/__RECEIVING_PARTY_TITLE__/g, 'הצד המקבל');
          // תיקונים נוספים
          processedTitle = processedTitle.replace(/שכרה טרחה/g, 'שכר טרחה');
          processedTitle = processedTitle.replace(/שכרה הטרחה/g, 'שכר הטרחה');
          processedTitle = processedTitle.replace(/הצד המקבלת/g, 'הצד המקבל');
          
          paragraphs.push(
            new Paragraph({
              numbering: { 
                reference: "main-numbering", 
                level: 0
              },
              alignment: AlignmentType.RIGHT,
              bidirectional: true,
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [
                new TextRun({
                  text: processedTitle,
                  bold: true,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            })
          );
        }
        
        // תוכן הסעיף בלבד (ללא כותרת) - רק אם יש תוכן אמיתי
        const content = section.text || section.content || '';
        if (content && content.trim() !== '') {
          // שלב 1: החלפת משתני מגדר מיוחדים {{gender:זכר|נקבה|רבים}} ו-{{לקוח}}
          // נשתמש ב-replaceFeeAgreementTemplateTextWithGender כדי להחליף גם את ה{{לקוח}}
          let withGenderVars = replaceFeeAgreementTemplateTextWithGender(content, clientsGender);
          // הגנה על "מלאים" שלא ישתנה
          let protectedContent = withGenderVars.replace(/\bמלאים\b/g, '__FULL_MAS_PLURAL__');
          // הגנה על "שכר טרחה" ו"שכר הטרחה" שלא ישתנו למגדר
          protectedContent = protectedContent.replace(/\bשכר טרחה\b/g, '__FEE__');
          protectedContent = protectedContent.replace(/\bשכר הטרחה\b/g, '__FEE_THE__');
          protectedContent = protectedContent.replace(/\bשכר הטרחה המוסכם\b/g, '__FEE_AGREED__');
          // הגנה על "הצד המקבל" שלא ישתנה
          protectedContent = protectedContent.replace(/\bהצד המקבל\b/g, '__RECEIVING_PARTY__');
          // הגנה על "הבא" שלא ישתנה
          protectedContent = protectedContent.replace(/\bהבא\b/g, '__NEXT__');
          // הגנה על "עד" שלא ישתנה ל"עדה" - גם ב-plural (כדי למנוע החלפה ל"עדים")
          // הגנה על "עד" לפני מילות יחס, מספרים, תאריכים וכו' (גם עם רווח וגם בלי)
          protectedContent = protectedContent.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, '__UNTIL_PLACEHOLDER__ ');
          // הגנה גם על "עד" כשהוא לפני מילות יחס/מספרים ללא רווח (אם יש)
          protectedContent = protectedContent.replace(/\bעד(שני|שלושה|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|שתי|סבבי|סיום|שיוחלט|אשרת|שמתקיים)/g, '__UNTIL_PLACEHOLDER__$1');
          // הגנה על "בימים א' עד ה'" שלא ישתנה
          protectedContent = protectedContent.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
          // הגנה על "עורך הדין" שלא ישתנה ל"עורך הדין תישא" או "יישאו"
          protectedContent = protectedContent.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
          // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
          protectedContent = protectedContent.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
          // שלב 2: החלפת כל הטקסט לפי מגדר (פעלים, תארים וכו')
          let withFullGender = replaceTextWithGender(protectedContent, clientsGender);
          // שלב 3: החזרת הביטויים המוגנים
          withFullGender = withFullGender.replace(/__UNTIL_PLACEHOLDER__\s+/g, 'עד ');
          withFullGender = withFullGender.replace(/__UNTIL_PLACEHOLDER__/g, 'עד');
          withFullGender = withFullGender.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
          withFullGender = withFullGender.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
          withFullGender = withFullGender.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
          withFullGender = withFullGender.replace(/__FULL_MAS_PLURAL__/g, 'מלא');
          withFullGender = withFullGender.replace(/__FEE__/g, 'שכר טרחה');
          withFullGender = withFullGender.replace(/__FEE_THE__/g, 'שכר הטרחה');
          withFullGender = withFullGender.replace(/__FEE_AGREED__/g, 'שכר הטרחה המוסכם');
          withFullGender = withFullGender.replace(/__RECEIVING_PARTY__/g, 'הצד המקבל');
          withFullGender = withFullGender.replace(/__NEXT__/g, 'הבא');
          // תיקונים נוספים - גם למקרים שהמילה "עד" (witness) הוחלפה ל"עדים" במקומות של "עד" (until)
          // במקרים של plural, "עד" (witness) הוחלפה ל"עדים", אבל "עד" (until) לא צריך להשתנות
          // תיקון: החזר "עדים" ל"עד" כשהוא מופיע לפני מילות יחס, מספרים, תאריכים וכו'
          // זה חשוב במיוחד ב-plural כי "עד" (witness) הוחלפה ל"עדים"
          withFullGender = withFullGender.replace(/עדים\s+(?:ל|שני|שלושה|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|שתי|סבבי|סיום|יום|לקבלת|מיצוי|מועד|בין|שבוע|חודש|שנה|תקופה|הפגישה|הפגישות|ביצוע|סוג|דקות|שעות|חודשים|שנים|שיוחלט|אשרת|שמתקיים)/g, 'עד $1');
          withFullGender = withFullGender.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
          withFullGender = withFullGender.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
          withFullGender = withFullGender.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
          withFullGender = withFullGender.replace(/בבקשה עדה/g, 'בבקשה עד');
          withFullGender = withFullGender.replace(/מלאים\b/g, 'מלא');
          withFullGender = withFullGender.replace(/בלתי מלאים\b/g, 'בלתי מלא');
          withFullGender = withFullGender.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
          withFullGender = withFullGender.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
          withFullGender = withFullGender.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
          withFullGender = withFullGender.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
          withFullGender = withFullGender.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
          withFullGender = withFullGender.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
          withFullGender = withFullGender.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
          withFullGender = withFullGender.replace(/עורך הדין רשאית/g, 'עורך הדין רשאי');
          withFullGender = withFullGender.replace(/שכרה טרחה/g, 'שכר טרחה');
          withFullGender = withFullGender.replace(/שכרה הטרחה/g, 'שכר הטרחה');
          withFullGender = withFullGender.replace(/שכרה הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
          withFullGender = withFullGender.replace(/שכרו הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
          withFullGender = withFullGender.replace(/הצד המקבלת/g, 'הצד המקבל');
          withFullGender = withFullGender.replace(/הבאה/g, 'הבא');
          withFullGender = withFullGender.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
          withFullGender = withFullGender.replace(/מלאה, שלמה/g, 'מלא, שלם');
          withFullGender = withFullGender.replace(/מלאה.*שלמה/g, 'מלא, שלם');
          withFullGender = withFullGender.replace(/באופן מלאה/g, 'באופן מלא');
          withFullGender = withFullGender.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
          withFullGender = withFullGender.replace(/עדה שתי/g, 'עד שתי');
          withFullGender = withFullGender.replace(/מלאה, שלמה/g, 'מלא, שלם');
          withFullGender = withFullGender.replace(/מלאה.*שלמה/g, 'מלא, שלם');
          withFullGender = withFullGender.replace(/באופן מלאה/g, 'באופן מלא');
          withFullGender = withFullGender.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
          withFullGender = withFullGender.replace(/עדה שתי/g, 'עד שתי');
          
          paragraphs.push(
            new Paragraph({
              numbering: level === 0 ? undefined : { reference: "main-numbering", level: level },
              alignment: AlignmentType.BOTH,
              bidirectional: true,
              spacing: { 
                before: level === 0 ? SPACING.beforeHeading : SPACING.beforeParagraph,
                after: SPACING.afterParagraph,
                line: SPACING.line
              },
              children: [
                new TextRun({
                  text: withFullGender,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            })
          );
        }
        
        // תתי-סעיפים (subSections) - עובר על כל תת-סעיף ומטפל גם ב-subSubSections שלו
        if (section.subSections && Array.isArray(section.subSections)) {
          section.subSections.forEach((subSection: any, subIndex: number) => {
            // תוכן תת-הסעיף
            if (subSection.text || subSection.content) {
              const subContent = subSection.text || subSection.content || '';
              // שלב 1: החלפת משתני מגדר מיוחדים - כולל ה{{לקוח}}
              let withGenderVars = replaceFeeAgreementTemplateTextWithGender(subContent, clientsGender);
              // הגנה על "שכר טרחה" ו"שכר הטרחה" שלא ישתנו למגדר
              let protectedSubContent = withGenderVars.replace(/\bשכר טרחה\b/g, '__FEE__');
              protectedSubContent = protectedSubContent.replace(/\bשכר הטרחה\b/g, '__FEE_THE__');
              protectedSubContent = protectedSubContent.replace(/\bשכר הטרחה המוסכם\b/g, '__FEE_AGREED__');
              // הגנה על "הצד המקבל" שלא ישתנה
              protectedSubContent = protectedSubContent.replace(/\bהצד המקבל\b/g, '__RECEIVING_PARTY__');
              // הגנה על "הבא" שלא ישתנה
              protectedSubContent = protectedSubContent.replace(/\bהבא\b/g, '__NEXT__');
              // הגנה על "עד" שלא ישתנה ל"עדה" - גם ב-plural
              protectedSubContent = protectedSubContent.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, '__UNTIL_PLACEHOLDER__ ');
              protectedSubContent = protectedSubContent.replace(/\bעד(שני|שלושה|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|שתי|סבבי|סיום|שיוחלט|אשרת|שמתקיים)/g, '__UNTIL_PLACEHOLDER__$1');
              // הגנה על "עורך הדין" שלא ישתנה ל"עורך הדין תישא"
              protectedSubContent = protectedSubContent.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|אינו|יהיה)/g, '__LAWYER_VERB__');
              // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
              protectedSubContent = protectedSubContent.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
              // שלב 2: החלפת כל הטקסט לפי מגדר
              let withFullGender = replaceTextWithGender(protectedSubContent, clientsGender);
              // שלב 3: החזרת הביטויים המוגנים
              withFullGender = withFullGender.replace(/__UNTIL_PLACEHOLDER__\s+/g, 'עד ');
              withFullGender = withFullGender.replace(/__UNTIL_PLACEHOLDER__/g, 'עד');
              withFullGender = withFullGender.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
              withFullGender = withFullGender.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
              withFullGender = withFullGender.replace(/__FEE__/g, 'שכר טרחה');
              withFullGender = withFullGender.replace(/__FEE_THE__/g, 'שכר הטרחה');
              withFullGender = withFullGender.replace(/__FEE_AGREED__/g, 'שכר הטרחה המוסכם');
              withFullGender = withFullGender.replace(/__RECEIVING_PARTY__/g, 'הצד המקבל');
              withFullGender = withFullGender.replace(/__NEXT__/g, 'הבא');
              // תיקונים נוספים - גם למקרים שהמילה "עד" (witness) הוחלפה ל"עדים" במקומות של "עד" (until)
              // במקרים של plural, "עד" (witness) הוחלפה ל"עדים", אבל "עד" (until) לא צריך להשתנות
              withFullGender = withFullGender.replace(/עדים\s+(?:ל|שני|שלושה|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|שתי|סבבי|סיום|יום|לקבלת|מיצוי|מועד|בין|שבוע|חודש|שנה|תקופה|הפגישה|הפגישות|ביצוע|סוג|דקות|שעות|חודשים|שנים|שיוחלט|אשרת|שמתקיים)/g, 'עד $1');
              withFullGender = withFullGender.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
              withFullGender = withFullGender.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
              withFullGender = withFullGender.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
              withFullGender = withFullGender.replace(/בבקשה עדה/g, 'בבקשה עד');
              withFullGender = withFullGender.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
              withFullGender = withFullGender.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
              withFullGender = withFullGender.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
              withFullGender = withFullGender.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
              withFullGender = withFullGender.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
              withFullGender = withFullGender.replace(/עורך הדין רשאית/g, 'עורך הדין רשאי');
              withFullGender = withFullGender.replace(/שכרה טרחה/g, 'שכר טרחה');
              withFullGender = withFullGender.replace(/שכרה הטרחה/g, 'שכר הטרחה');
              withFullGender = withFullGender.replace(/שכרה הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
              withFullGender = withFullGender.replace(/שכרו הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
              withFullGender = withFullGender.replace(/הצד המקבלת/g, 'הצד המקבל');
              withFullGender = withFullGender.replace(/הבאה/g, 'הבא');
              withFullGender = withFullGender.replace(/שלאחר משלוחה/g, 'הבא');
              withFullGender = withFullGender.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
              withFullGender = withFullGender.replace(/מלאה, שלמה/g, 'מלא, שלם');
              withFullGender = withFullGender.replace(/מלאה.*שלמה/g, 'מלא, שלם');
              withFullGender = withFullGender.replace(/באופן מלאה/g, 'באופן מלא');
              withFullGender = withFullGender.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
              withFullGender = withFullGender.replace(/עדה שתי/g, 'עד שתי');
              
              // השתמש ב-numbering של Word לתתי-סעיפים
              paragraphs.push(
                new Paragraph({
                  numbering: { 
                    reference: "main-numbering", 
                    level: level + 1
                  },
                  alignment: AlignmentType.BOTH,
                  bidirectional: true,
                  spacing: { 
                    before: SPACING.beforeParagraph,
                    after: SPACING.afterParagraph,
                    line: SPACING.line
                  },
                  children: [
                    new TextRun({
                      text: withFullGender,
                      font: 'David',
                      rightToLeft: true,
                      size: SIZES.normal
                    })
                  ]
                })
              );
            }
            
            // תתי-תתי-סעיפים (subSubSections) של תת-הסעיף הזה
            if (subSection.subSubSections && Array.isArray(subSection.subSubSections)) {
              subSection.subSubSections.forEach((subSubSection: any, subSubIndex: number) => {
                if (subSubSection.text || subSubSection.content) {
                  const subSubContent = subSubSection.text || subSubSection.content || '';
                  // הסרת הכותרת אם היא מופיעה בתחילת הטקסט
                  const contentWithoutTitle = removeTitle(subSubContent, subSubSection.title);
                  // שלב 1: החלפת משתני מגדר מיוחדים - כולל ה{{לקוח}}
                  let withGenderVars = replaceFeeAgreementTemplateTextWithGender(contentWithoutTitle, clientsGender);
                  // הגנה על "מלאים" שלא ישתנה
                  let protectedSubSubContent = withGenderVars.replace(/\bמלאים\b/g, '__FULL_MAS_PLURAL__');
                  // הגנה על "שכר טרחה" ו"שכר הטרחה" שלא ישתנו למגדר
                  protectedSubSubContent = protectedSubSubContent.replace(/\bשכר טרחה\b/g, '__FEE__');
                  protectedSubSubContent = protectedSubSubContent.replace(/\bשכר הטרחה\b/g, '__FEE_THE__');
                  protectedSubSubContent = protectedSubSubContent.replace(/\bשכר הטרחה המוסכם\b/g, '__FEE_AGREED__');
                  // הגנה על "הצד המקבל" שלא ישתנה
                  protectedSubSubContent = protectedSubSubContent.replace(/\bהצד המקבל\b/g, '__RECEIVING_PARTY__');
                  // הגנה על "הבא" שלא ישתנה
                  protectedSubSubContent = protectedSubSubContent.replace(/\bהבא\b/g, '__NEXT__');
                  // הגנה על "עד" שלא ישתנה ל"עדה" - גם ב-plural
                  protectedSubSubContent = protectedSubSubContent.replace(/\bעד\s+(?!עד[הא]|עדי|עדות|עדים|עדה)/g, '__UNTIL_PLACEHOLDER__ ');
                  protectedSubSubContent = protectedSubSubContent.replace(/\bעד(שני|שלושה|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|שתי|סבבי|סיום|שיוחלט|אשרת|שמתקיים)/g, '__UNTIL_PLACEHOLDER__$1');
                  // הגנה על "בימים א' עד ה'" שלא ישתנה
                  protectedSubSubContent = protectedSubSubContent.replace(/בימים א' עד ה'/g, '__DAYS_UNTIL__');
                  // הגנה על "עורך הדין" שלא ישתנה ל"עורך הדין תישא" או "יישאו"
                  protectedSubSubContent = protectedSubSubContent.replace(/עורך הדין\s+(?=לא|תישא|יישא|ישא|יישאו|אינו|יהיה)/g, '__LAWYER_VERB__');
                  // הגנה על "מינוי אפוטרופוס" שלא ישתנה ל"מינוי אפוטרופסית"
                  protectedSubSubContent = protectedSubSubContent.replace(/מינוי אפוטרופוס/g, '__APOTROPS__');
                  // שלב 2: החלפת כל הטקסט לפי מגדר
                  let withFullGender = replaceTextWithGender(protectedSubSubContent, clientsGender);
                  // שלב 3: החזרת הביטויים המוגנים
                  withFullGender = withFullGender.replace(/__UNTIL_PLACEHOLDER__\s+/g, 'עד ');
                  withFullGender = withFullGender.replace(/__UNTIL_PLACEHOLDER__/g, 'עד');
                  withFullGender = withFullGender.replace(/__LAWYER_VERB__/g, 'עורך הדין ');
                  withFullGender = withFullGender.replace(/__APOTROPS__/g, 'מינוי אפוטרופוס');
                  withFullGender = withFullGender.replace(/__DAYS_UNTIL__/g, "בימים א' עד ה'");
                  withFullGender = withFullGender.replace(/__FULL_MAS_PLURAL__/g, 'מלא');
                  withFullGender = withFullGender.replace(/__FEE__/g, 'שכר טרחה');
                  withFullGender = withFullGender.replace(/__FEE_THE__/g, 'שכר הטרחה');
                  withFullGender = withFullGender.replace(/__FEE_AGREED__/g, 'שכר הטרחה המוסכם');
                  withFullGender = withFullGender.replace(/__RECEIVING_PARTY__/g, 'הצד המקבל');
                  withFullGender = withFullGender.replace(/__NEXT__/g, 'הבא');
                  // תיקונים נוספים - גם למקרים שהמילה "עד" (witness) הוחלפה ל"עדים" במקומות של "עד" (until)
                  // במקרים של plural, "עד" (witness) הוחלפה ל"עדים", אבל "עד" (until) לא צריך להשתנות
                  withFullGender = withFullGender.replace(/עדים\s+(?:ל|שני|שלושה|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|שתי|סבבי|סיום|יום|לקבלת|מיצוי|מועד|בין|שבוע|חודש|שנה|תקופה|הפגישה|הפגישות|ביצוע|סוג|דקות|שעות|חודשים|שנים|שיוחלט|אשרת|שמתקיים)/g, 'עד $1');
                  withFullGender = withFullGender.replace(/עדה\s+(ה'|ל|שני|סיום|יום|לקבלת|מיצוי|מועד|בין)/g, 'עד $1');
                  withFullGender = withFullGender.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
                  withFullGender = withFullGender.replace(/בימים א' עדה ה' בין/g, "בימים א' עד ה' בין");
                  withFullGender = withFullGender.replace(/בבקשה עדה/g, 'בבקשה עד');
                  withFullGender = withFullGender.replace(/מלאים\b/g, 'מלא');
                  withFullGender = withFullGender.replace(/בלתי מלאים\b/g, 'בלתי מלא');
                  withFullGender = withFullGender.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
                  withFullGender = withFullGender.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
                  withFullGender = withFullGender.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
                  withFullGender = withFullGender.replace(/עורך הדין אינו נושא ולא תישא/g, 'עורך הדין אינו נושא ולא יישא');
                  withFullGender = withFullGender.replace(/עורך הדין והמשרד תישא/g, 'עורך הדין והמשרד יישאו');
                  withFullGender = withFullGender.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
                  withFullGender = withFullGender.replace(/עורך הדין יהיה זכאית/g, 'עורך הדין יהיה זכאי');
                  withFullGender = withFullGender.replace(/עורך הדין רשאית/g, 'עורך הדין רשאי');
                  withFullGender = withFullGender.replace(/שכרה טרחה/g, 'שכר טרחה');
                  withFullGender = withFullGender.replace(/שכרה הטרחה/g, 'שכר הטרחה');
                  withFullGender = withFullGender.replace(/שכרה הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
                  withFullGender = withFullGender.replace(/שכרו הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
                  withFullGender = withFullGender.replace(/הצד המקבלת/g, 'הצד המקבל');
                  withFullGender = withFullGender.replace(/הבאה/g, 'הבא');
                  withFullGender = withFullGender.replace(/שלאחר משלוחה/g, 'הבא');
                  withFullGender = withFullGender.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
                  withFullGender = withFullGender.replace(/מלאה, שלמה/g, 'מלא, שלם');
                  withFullGender = withFullGender.replace(/מלאה.*שלמה/g, 'מלא, שלם');
                  withFullGender = withFullGender.replace(/באופן מלאה/g, 'באופן מלא');
                  withFullGender = withFullGender.replace(/הלקוחה.*יספק/g, (match: string) => match.replace(/יספק/g, 'תספק'));
                  withFullGender = withFullGender.replace(/עדה שתי/g, 'עד שתי');
                  
                  // השתמש ב-numbering של Word לתתי-תתי-סעיפים
                  paragraphs.push(
                    new Paragraph({
                      numbering: { 
                        reference: "main-numbering", 
                        level: level + 2
                      },
                      alignment: AlignmentType.BOTH,
                      bidirectional: true,
                      spacing: { 
                        before: SPACING.beforeParagraph,
                        after: SPACING.afterParagraph,
                        line: SPACING.line
                      },
                      children: [
                        new TextRun({
                          text: withFullGender,
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })
                      ]
                    })
                  );
                }
              });
            }
          });
        }
        
        return paragraphs;
      };

      // יצירת הואילים מה-JSON (אם קיים) או טקסט ברירת מחדל
      const clientGenderText = getGenderText('הלקוח', 'הלקוחה', 'הלקוחות');
      
      // נסה לטעון מה-JSON
      const preamble = feeAgreementTemplates.preamble;
      let whereas: string[] = [];
      
      if (preamble && preamble.whereas && Array.isArray(preamble.whereas)) {
        const clientsGender = getClientsGender();
        whereas = preamble.whereas.map((w: any) => {
          let text = w.text;
          
          // קודם החלף את משתני multipleClients (3 חלקים: plural|male|female)
          text = text.replace(/\{\{multipleClients:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (_match: string, pluralText: string, maleText: string, femaleText: string) => {
            if (multipleClients) return pluralText;
            return clientsGender === 'female' ? femaleText : maleText;
          });
          text = text.replace(/\{\{serviceDescription\}\}/g, serviceDescription);
          
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
            text = text.replace(pattern, (match: string) => {
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
          
          // הגנה על "עורך הדין רשאי" שלא ישתנה ל"רשאית"
          text = text.replace(/__LAWYER_PLACEHOLDER__\s+רשאי/g, '__LAWYER_CAN__');
          
          // הגנה על מילים שצריכות להישאר ללא שינוי במגדר בהסכמי שכר טרחה
          const protectedPhrases: { [key: string]: string } = {};
          let protectedIndex = 0;
          
          // מילים שתמיד יישארו ללא שינוי
          const protectedPatterns = [
            /\bמידע מלא\b/g,  // מידע מלא (לא מידע מלאה)
            /\bשאינו נכלל\b/g,  // שאינו נכלל (לא שאינו נכללה)
            /\bשכר טרחה\b/g,  // שכר טרחה (לא שכרה טרחה)
            /\bשכר הטרחה\b/g,  // שכר הטרחה (לא שכרה הטרחה)
            /\bשכר הטרחה המוסכם\b/g,  // שכר הטרחה המוסכם (לא שכרה הטרחה המוסכם או שכרו הטרחה המוסכם)
            /\bהצד המקבל\b/g,  // הצד המקבל (לא הצד המקבלת)
            /\bהבא\b/g,  // הבא (תמיד זכר, לא הבאה)
            /\bמינוי אפוטרופוס\b/g,  // מינוי אפוטרופוס
            /\bבמלואו\b/g,  // במלואו (לא באופן מלאה)
            /\bמלאים\b/g,  // מלאים (תמיד "מלא")
            /\bבלתי מלאים\b/g,  // בלתי מלאים (תמיד "בלתי מלא")
            /\bשיפוי מלאים\b/g,  // שיפוי מלאים (תמיד "שיפוי מלא")
            /\bעד\s+(?:ל|שני|סיום|יום|מיצוי|לקבלת)/g,  // עד למיצוי, עד שני, עד לסיום, עד ליום, עד לקבלת
            /\bעד\s+(?:סבבי|תיקונים|סיום)/g,  // עד שני סבבי תיקונים, עד לסיום
          ];
          
          protectedPatterns.forEach(pattern => {
            text = text.replace(pattern, (match: string) => {
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
          text = text.replace(/\{\{gender:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (_match: string, male: string, female: string, plural: string) => {
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
          result = result.replace(/__LAWYER_CAN__/g, 'עורך הדין רשאי');
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
          result = result.replace(/עורך הדין.*הסכימה/g, (match: string) => match.replace(/הסכימה/g, 'הסכים'));
          result = result.replace(/עורך הדין רשאית/g, 'עורך הדין רשאי');
          
          // תיקון מילים שצריכות להישאר ללא שינוי
          result = result.replace(/מידע מלאה/g, 'מידע מלא');
          result = result.replace(/שאינו נכללה/g, 'שאינו נכלל');
          result = result.replace(/שכרה טרחה/g, 'שכר טרחה');
          result = result.replace(/שכרה הטרחה/g, 'שכר הטרחה');
          result = result.replace(/שכרה הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
          result = result.replace(/שכרו הטרחה המוסכם/g, 'שכר הטרחה המוסכם');
          result = result.replace(/הצד המקבלת/g, 'הצד המקבל');
          result = result.replace(/הבאה/g, 'הבא');
          result = result.replace(/שלאחר משלוחה/g, 'הבא');
          result = result.replace(/מינוי אפוטרופסית/g, 'מינוי אפוטרופוס');
          result = result.replace(/באופן מלאה/g, 'באופן מלא');
          result = result.replace(/במלואה/g, 'במלואו');
          result = result.replace(/מלאה, שלמה/g, 'מלא, שלם');
          result = result.replace(/מלאה.*שלמה/g, 'מלא, שלם');
          result = result.replace(/מלאים\b/g, 'מלא');
          result = result.replace(/בלתי מלאים\b/g, 'בלתי מלא');
          result = result.replace(/שיפוי מלאים\b/g, 'שיפוי מלא');
          result = result.replace(/עדה למיצוי/g, 'עד למיצוי');
          result = result.replace(/עדה\s+(?:ל|שני|סיום|יום|לקבלת|ה')/g, (match: string) => match.replace(/עדה/g, 'עד'));
          result = result.replace(/בימים א' עדה ה'/g, "בימים א' עד ה'");
          result = result.replace(/עורך הדין תישא/g, 'עורך הדין יישא');
          result = result.replace(/עורך הדין לא תישא/g, 'עורך הדין לא יישא');
          result = result.replace(/עורך הדין יישאו/g, 'עורך הדין יישא');
          
          return result;
        });
      } else {
        // טקסט ברירת מחדל אם אין במאגר
        whereas = [
          `ו${agreementData.lawyer.name} הינו עורך דין בעל רישיון לעריכת דין בישראל;`,
          `${clientGenderText} ${getGenderText('פנה', 'פנתה', 'פנו')} אל עורך הדין בבקשה לקבל שירות משפטי בעניין: ${serviceDescription};`,
          `עורך הדין הסכים לייצג את ${clientGenderText} בתנאים המפורטים להלן;`
        ];
      }

      // יצירת המסמך
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "main-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.DECIMAL,
                  text: "%1.",
                  alignment: AlignmentType.RIGHT,
                  style: {
                    paragraph: {
                      indent: { left: 720, hanging: 360 }
                    },
                    run: {
                      font: 'David',
                      size: SIZES.normal,
                      rightToLeft: true
                    }
                  }
                },
                {
                  level: 1,
                  format: LevelFormat.DECIMAL,
                  text: "%1.%2.",
                  alignment: AlignmentType.RIGHT,
                  style: {
                    paragraph: {
                      indent: { left: 1080, hanging: 360 }
                    },
                    run: {
                      font: 'David',
                      size: SIZES.normal,
                      rightToLeft: true
                    }
                  }
                },
                {
                  level: 2,
                  format: LevelFormat.DECIMAL,
                  text: "%1.%2.%3.",
                  alignment: AlignmentType.RIGHT,
                  style: {
                    paragraph: {
                      indent: { left: 1440, hanging: 360 }
                    },
                    run: {
                      font: 'David',
                      size: SIZES.normal,
                      rightToLeft: true
                    }
                  }
                }
              ]
            }
          ]
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440
              }
            }
          },
          children: [
            // כותרת מרכזית
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: SPACING.afterTitle },
              children: [
                new TextRun({
                  text: "הסכם שכר טרחה",
                  bold: true,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.title
                })
              ]
            }),
            
            // תאריך
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: SPACING.afterHeading },
              children: [
                new TextRun({
                  text: `נערך ביום ${agreementDate.day} לחודש ${agreementDate.month} שנת ${agreementDate.year}`,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ טבלה 1: בין עורך הדין לבין הלקוחות (2 עמודות)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: [
                // שורה ראשונה: עורך הדין
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: agreementData.lawyer.name,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: agreementData.lawyer.address,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `טלפון: ${agreementData.lawyer.phone}`,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `דוא"ל: ${agreementData.lawyer.email}`,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: '(להלן: "עורך הדין")',
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: "בין",
                              bold: true,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),
                
                // שורה ריקה
                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 2,
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          children: [new TextRun("")]
                        })
                      ]
                    })
                  ]
                }),
                
                // שורה שנייה: הלקוחות
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        ...agreementData.clients.flatMap((client, clientIndex) => [
                          ...(clientIndex > 0 ? [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              bidirectional: true,
                              children: [new TextRun("")]
                            })
                          ] : []),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: client.name,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: client.address,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: `טלפון: ${client.phone}`,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: `דוא"ל: ${client.email}`,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          ...(agreementData.clients.length === 1 && clientIndex === agreementData.clients.length - 1 ? [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              bidirectional: true,
                              children: [
                                new TextRun({
                                  text: `(להלן: "${clientGenderText}")`,
                                  font: 'David',
                                  rightToLeft: true,
                                  size: SIZES.normal
                                })
                              ]
                            })
                          ] : [])
                        ]),
                        ...(agreementData.clients.length > 1 ? [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: `(להלן: "${clientGenderText}")`,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          })
                        ] : [])
                      ]
                    }),
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: "לבין",
                              bold: true,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ טבלה 2: הואילים (2 עמודות)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: whereas.map((whereasText, index) => 
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 85, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: whereasText,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 15, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: index === 0 ? "הואיל" : "והואיל",
                              bold: true,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              )
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ "לפיכך הוסכם"
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: SPACING.afterHeading },
              children: [
                new TextRun({
                  text: "לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:",
                  bold: true,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ הסעיף הראשון - תיאור השירות עם היקף השירותים האוטומטי
            // סעיף ראשון - תיאור השירות (משתמש ב-numbering כדי שהמספור ימשיך)
            new Paragraph({
              numbering: { 
                reference: "main-numbering", 
                level: 0
              },
              alignment: AlignmentType.RIGHT,
              bidirectional: true,
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [
                new TextRun({
                  text: "תיאור השירות",
                  bold: true,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            }),
            
            // חלוקה ל-4 תתי-סעיפים
            ...firstSectionSubSections.map((subText) => 
              new Paragraph({
                numbering: { 
                  reference: "main-numbering", 
                  level: 1
                },
                alignment: AlignmentType.BOTH,
                bidirectional: true,
                spacing: { 
                  before: SPACING.beforeParagraph,
                  after: SPACING.afterParagraph,
                  line: SPACING.line
                },
                children: [
                  new TextRun({
                    text: subText,
                    font: 'David',
                    rightToLeft: true,
                    size: SIZES.normal
                  })
                ]
              })
            ),
            
            // ✅ הסעיפים עם מספור נכון
            // סעיפים מותאמים אישית - בניית מבנה היררכי
            // הסעיף הראשון הוא תמיד "תיאור השירות" (1), אז הסעיפים מ-customSections מתחילים מ-2
            // צריך לקחת בחשבון רק את הסעיפים הראשיים (level === 'main') כדי לקבל את המספור הנכון
            ...((): any[] => {
              const hierarchicalSections = buildHierarchicalSections(agreementData.customSections || []);
              // מצא את כל הסעיפים הראשיים (כולל gen_) ומיין אותם לפי order
              const allMainSections = (agreementData.customSections || [])
                .filter((s: any) => s.level === 'main')
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
              
              return hierarchicalSections.map((section: any) => {
                // מצא את המספר הנכון של הסעיף הראשי מתוך כל הסעיפים הראשיים
                const mainIndex = allMainSections.findIndex((s: any) => s.id === section.id);
                const sectionIndex = mainIndex >= 0 ? mainIndex : 0;
                return createSectionParagraphs(section, 0, sectionIndex);
              }).flat();
            })(),
            
            // הסעיפים הקבועים כבר כלולים ב-customSections
            
            // רווח לפני חתימות
            new Paragraph({
              spacing: { before: SPACING.beforeTitle, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ טבלה 3: חתימות (3 עמודות)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: [
                new TableRow({
                  children: [
                    // עמודת הלקוחות (שמאל)
                    ...agreementData.clients.map((client) => 
                      new TableCell({
                        width: { 
                          size: agreementData.clients.length === 1 ? 40 : 30, 
                          type: WidthType.PERCENTAGE 
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.black },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE }
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: client.name,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          })
                        ]
                      })
                    ),
                    
                    // עמודת רווח
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          children: [new TextRun("")]
                        })
                      ]
                    }),
                    
                    // עמודת עורך הדין (ימין)
                    new TableCell({
                      width: { size: 40, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.black },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `${agreementData.lawyer.name}, עורך הדין`,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }]
      });

      // 💾 שמירה והורדה
      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      const a = document.createElement('a');
      a.href = url;
      a.download = `הסכם_שכר_טרחה_${agreementData.lawyer.name.replace(/\s+/g, '_')}_${new Date().getTime()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus(`✅ קובץ Word מקצועי נשמר: ${a.download}`);
      
    } catch (error) {
      console.error('שגיאה ביצוא Word מקצועי:', error);
      setExportStatus(`❌ שגיאה ביצוא Word מקצועי: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const isFormValid = () => {
    return agreementData.lawyer.name && 
           agreementData.lawyer.license &&
           agreementData.clients.length > 0 &&
           agreementData.clients.every(c => c.name && c.idNumber) &&
           agreementData.case.subject;
  };

  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">מצב ההסכם</h3>
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

      <div className="space-y-4">
        <button
          onClick={exportToWord}
          disabled={!isFormValid() || isExporting}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isFormValid() && !isExporting
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isExporting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              מייצא ל-Word...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              📄 ייצוא מקצועי ל-Word
            </div>
          )}
        </button>

        {exportStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            exportStatus.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {exportStatus}
          </div>
        )}
      </div>
    </div>
  );
}