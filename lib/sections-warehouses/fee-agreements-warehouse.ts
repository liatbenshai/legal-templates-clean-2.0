/**
 * מחסן הסכמי שכר טרחה - קובץ מאחד
 * משלב את כל סוגי הסכמי שכר הטרחה
 */

import { FeeAgreementTemplate, hourlyFeeAgreements } from './fee-agreements-warehouse-part1';
import { fixedAndSuccessFeeAgreements } from './fee-agreements-warehouse-part2';
import { mixedAndSpecialFeeAgreements } from './fee-agreements-warehouse-part3';

/**
 * מחסן מאוחד של כל הסכמי שכר הטרחה
 */
export const feeAgreementsWarehouse: FeeAgreementTemplate[] = [
  ...hourlyFeeAgreements,              // 3 הסכמים שעתיים
  ...fixedAndSuccessFeeAgreements,     // 3 הסכמים קבועים/הצלחה
  ...mixedAndSpecialFeeAgreements      // 4 הסכמים מעורבים ומיוחדים
];

/**
 * סטטיסטיקות
 */
export const feeAgreementsStats = {
  hourly: hourlyFeeAgreements.length,
  fixedAndSuccess: fixedAndSuccessFeeAgreements.length,
  mixedAndSpecial: mixedAndSpecialFeeAgreements.length,
  total: feeAgreementsWarehouse.length
};

/**
 * קבלת הסכמים לפי קטגוריה
 */
export function getAgreementsByCategory(
  category: 'hourly' | 'fixed' | 'contingency' | 'mixed' | 'retainer' | 'success-fee'
): FeeAgreementTemplate[] {
  return feeAgreementsWarehouse.filter(a => a.category === category);
}

/**
 * קבלת הסכם לפי ID
 */
export function getAgreementById(id: string): FeeAgreementTemplate | undefined {
  return feeAgreementsWarehouse.find(a => a.id === id);
}

/**
 * המלצה על הסכם לפי מאפייני המקרה
 */
export function recommendAgreement(caseCharacteristics: {
  predictable?: boolean;        // האם העבודה צפויה?
  riskLevel?: 'low' | 'medium' | 'high';  // רמת סיכון
  clientType?: 'individual' | 'business';  // סוג לקוח
  ongoing?: boolean;            // האם שירות שוטף?
  successMeasurable?: boolean;  // האם הצלחה ניתנת למדידה?
  budget?: 'flexible' | 'fixed'; // תקציב הלקוח
}): FeeAgreementTemplate[] {
  const recommendations: FeeAgreementTemplate[] = [];

  // לקוח עסקי עם צורך שוטף
  if (caseCharacteristics.clientType === 'business' && caseCharacteristics.ongoing) {
    const retainer = getAgreementById('retainer-monthly');
    const subscription = getAgreementById('subscription-legal-services');
    if (retainer) recommendations.push(retainer);
    if (subscription) recommendations.push(subscription);
  }

  // עבודה צפויה ושגרתית
  if (caseCharacteristics.predictable && caseCharacteristics.riskLevel === 'low') {
    const fixed = getAgreementById('fixed-fee-basic');
    if (fixed) recommendations.push(fixed);
  }

  // תביעה עם סיכוי טוב להצלחה
  if (caseCharacteristics.successMeasurable && caseCharacteristics.riskLevel === 'medium') {
    const contingency = getAgreementById('success-fee-contingency');
    const mixed = getAgreementById('mixed-fee-hourly-success');
    if (contingency) recommendations.push(contingency);
    if (mixed) recommendations.push(mixed);
  }

  // עבודה מורכבת עם תקציב גמיש
  if (!caseCharacteristics.predictable && caseCharacteristics.budget === 'flexible') {
    const hourly = getAgreementById('hourly-fee-basic');
    if (hourly) recommendations.push(hourly);
  }

  // עבודה מורכבת עם תקציב מוגבל
  if (!caseCharacteristics.predictable && caseCharacteristics.budget === 'fixed') {
    const hourlyBudget = getAgreementById('hourly-fee-with-budget');
    if (hourlyBudget) recommendations.push(hourlyBudget);
  }

  // ערך מדיד
  if (caseCharacteristics.successMeasurable && caseCharacteristics.clientType === 'business') {
    const valueBilling = getAgreementById('value-billing');
    if (valueBilling) recommendations.push(valueBilling);
  }

  return recommendations;
}

/**
 * השוואת הסכמים
 */
export function compareAgreements(ids: string[]): {
  agreements: FeeAgreementTemplate[];
  comparison: any;
} {
  const agreements = ids.map(id => getAgreementById(id)).filter(Boolean) as FeeAgreementTemplate[];
  
  const comparison = {
    categories: agreements.map(a => a.category),
    predictability: agreements.map(a => 
      a.category === 'fixed' ? 'high' : 
      a.category === 'hourly' ? 'medium' : 
      'low'
    ),
    clientRisk: agreements.map(a =>
      a.category === 'contingency' ? 'low' :
      a.category === 'fixed' ? 'medium' :
      'high'
    ),
    lawyerRisk: agreements.map(a =>
      a.category === 'hourly' ? 'low' :
      a.category === 'fixed' ? 'medium' :
      'high'
    )
  };

  return { agreements, comparison };
}

/**
 * חיפוש הסכמים
 */
export function searchAgreements(query: string): FeeAgreementTemplate[] {
  const lowerQuery = query.toLowerCase();
  return feeAgreementsWarehouse.filter(
    a =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.content.toLowerCase().includes(lowerQuery) ||
      a.usageInstructions.toLowerCase().includes(lowerQuery)
  );
}

/**
 * קבלת כל האזהרות והערות
 */
export function getAllWarnings(): { agreementId: string; warnings: string[] }[] {
  return feeAgreementsWarehouse.map(a => ({
    agreementId: a.id,
    warnings: a.warnings
  }));
}

/**
 * קבלת בסיס משפטי לכל ההסכמים
 */
export function getAllLegalBases(): { agreementId: string; legalBasis: string[] }[] {
  return feeAgreementsWarehouse.map(a => ({
    agreementId: a.id,
    legalBasis: a.legalBasis
  }));
}

/**
 * מטריצת התאמה - איזה הסכם למי
 */
export const suitabilityMatrix = {
  'hourly-fee-basic': {
    bestFor: ['מקרים מורכבים', 'עבודה בלתי צפויה', 'ליטיגציה ארוכה'],
    notFor: ['לקוחות עם תקציב מוגבל', 'עבודה שגרתית'],
    clientType: ['גדולים', 'מתוחכמים'],
    riskLevel: 'נמוך לעו"ד, גבוה ללקוח'
  },
  'hourly-fee-with-budget': {
    bestFor: ['לקוחות הרוצים בקרה', 'עבודה מורכבת עם תקציב'],
    notFor: ['מקרים פשוטים מאוד'],
    clientType: ['בינוניים', 'מודעים לעלויות'],
    riskLevel: 'בינוני לשניהם'
  },
  'fixed-fee-basic': {
    bestFor: ['עבודה שגרתית', 'גירושין בהסכמה', 'חוזים סטנדרטיים'],
    notFor: ['מקרים מורכבים', 'ליטיגציה'],
    clientType: ['כל הלקוחות'],
    riskLevel: 'בינוני לעו"ד, נמוך ללקוח'
  },
  'success-fee-contingency': {
    bestFor: ['תביעות נזיקין', 'חובות', 'תביעות כספיות'],
    notFor: ['דיני משפחה', 'פלילי', 'מקרים חלשים'],
    clientType: ['ללא יכולת תשלום מראש'],
    riskLevel: 'גבוה לעו"ד, נמוך ללקוח'
  },
  'retainer-monthly': {
    bestFor: ['לקוחות עסקיים', 'צרכים שוטפים', 'יחסים ארוכי טווח'],
    notFor: ['פרויקטים חד-פעמיים'],
    clientType: ['עסקים', 'חברות'],
    riskLevel: 'נמוך לשניהם'
  },
  'mixed-fee-hourly-success': {
    bestFor: ['איזון סיכון', 'מקרים בינוניים'],
    notFor: ['קצוות - מאוד פשוט או מורכב'],
    clientType: ['מגוונים'],
    riskLevel: 'בינוני לשניהם'
  },
  'value-billing': {
    bestFor: ['עסקאות גדולות', 'ייעוץ אסטרטגי', 'לקוחות מתוחכמים'],
    notFor: ['עבודה שגרתית', 'ערך לא מדיד'],
    clientType: ['חברות גדולות', 'עסקאות מורכבות'],
    riskLevel: 'תלוי בהגדרת הערך'
  }
};

/**
 * טיפים לבחירת הסכם
 */
export const selectionTips = {
  forLawyers: [
    'העריכו היטב את היקף העבודה לפני הצעת תעריף קבוע',
    'בהסכמי הצלחה - בדקו סיכויים ריאלית',
    'תעדו הכל, תמיד - גם בתעריף קבוע',
    'היו שקופים לגבי עלויות והערכות',
    'התאימו את ההסכם ללקוח ולמקרה'
  ],
  forClients: [
    'הבינו בדיוק מה כלול ומה לא',
    'שאלו על הערכות ותחזיות',
    'דרשו דיווח תקופתי',
    'בררו מדיניות חריגות מתקציב',
    'קראו והבינו לפני חתימה'
  ]
};

/**
 * דוגמאות שימוש
 */
export const usageExamples = {
  // הסכם שעתי בסיסי
  basicHourly: () => getAgreementById('hourly-fee-basic'),
  
  // הסכם קבוע לגירושין
  divorceFlatFee: () => getAgreementById('fixed-fee-basic'),
  
  // הסכם הצלחה לתביעה
  personalInjuryClaim: () => getAgreementById('success-fee-contingency'),
  
  // קבלן חודשי לחברה
  businessRetainer: () => getAgreementById('retainer-monthly'),
  
  // המלצה למקרה מורכב עם תקציב
  complexWithBudget: () => getAgreementById('hourly-fee-with-budget'),
  
  // כל ההסכמים השעתיים
  allHourly: () => getAgreementsByCategory('hourly'),
  
  // כל ההסכמים המעורבים
  allMixed: () => getAgreementsByCategory('mixed'),
  
  // המלצות למקרה ספציפי
  recommendForCase: () => recommendAgreement({
    predictable: false,
    riskLevel: 'medium',
    clientType: 'business',
    budget: 'flexible'
  })
};

/**
 * יצוא הכל
 */
export type { FeeAgreementTemplate };
export {
  hourlyFeeAgreements,
  fixedAndSuccessFeeAgreements,
  mixedAndSpecialFeeAgreements
};

/**
 * סטטיסטיקות מפורטות
 */
export function getDetailedStats() {
  const totalVariables = feeAgreementsWarehouse.reduce(
    (sum, a) => sum + a.variables.length, 0
  );
  
  const avgVariables = Math.round(totalVariables / feeAgreementsWarehouse.length);
  
  return {
    totalAgreements: feeAgreementsWarehouse.length,
    breakdown: feeAgreementsStats,
    averageVariables: avgVariables,
    totalVariables,
    byCategory: {
      hourly: getAgreementsByCategory('hourly').length,
      fixed: getAgreementsByCategory('fixed').length,
      contingency: getAgreementsByCategory('contingency').length,
      mixed: getAgreementsByCategory('mixed').length,
      retainer: getAgreementsByCategory('retainer').length,
      successFee: getAgreementsByCategory('success-fee').length
    }
  };
}

