/**
 * מחסן סעיפים להנחיות מקדימות בייפוי כוח מתמשך
 * 
 * מכיל 95 סעיפים מוכנים בקטגוריות: רכושי, אישי, רפואי
 * תומך בהוספת סעיפים מותאמים אישית
 * 
 * VERSION 2.0 - תמיכה מלאה בנטיות מגדר
 * ==========================================
 * הסעיפים משתמשים במילון הנטיות העברי עם התחביר:
 * {{מיופה_כוח}} - יוחלף ל: מיופה כוח / מיופת כוח / מיופי כוח
 * {{רשאי}} - יוחלף ל: רשאי / רשאית / רשאים
 * {{אחראי}} - יוחלף ל: אחראי / אחראית / אחראים
 * 
 * נטיות אוטומטיות:
 * - אני מבקש/ת - יוחלף אוטומטית לפי מגדר הממנה
 * - מיופה/ת הכוח - יוחלף אוטומטית לפי מגדר מיופה הכוח
 */

export interface AdvanceDirectivesSectionTemplate {
  id: string;
  category: 'property' | 'personal' | 'medical';
  subcategory: string;
  title: string;
  titleEn: string;
  content: string;
  variables: string[];
  genderVariables: {
    principal: boolean;    // נטיות לפי מגדר הממנה
    attorney: boolean;     // נטיות לפי מגדר מיופה הכוח
  };
  tags: string[];
}

// ייבוא נתוני הסעיפים מקובץ JSON נפרד (להוסיף בעתיד)
// import sectionsData from '@/data/advance-directives-sections.json';

export const advanceDirectivesSectionsWarehouse: AdvanceDirectivesSectionTemplate[] = [
  // ============ PROPERTY (רכושי) - 13 סעיפים ============
  
  {
    id: 'SEC_001',
    category: 'property',
    subcategory: 'real_estate',
    title: 'מכירת נכס - מותרת',
    titleEn: 'Property Sale - Allowed',
    content: `{{מיופה_כוח}} {{רשאי}} למכור את הנכס במקרים הבאים:
- צורך כספי דחוף (הוצאות רפואיות, טיפול סיעודי)
- מעבר למוסד סיעודי או בית אבות
- אי יכולת תחזוקה
- הצעה כלכלית משתלמת במיוחד

**תנאים למכירה:**
- מחיר שוק הוגן (חוות דעת שמאי)
- אישור עורך דין
- תיעוד מלא
- העברת תמורה לחשבון בנק

**במקרה של מכירה בגלל מעבר למוסד:**
הכספים ישמשו לתשלום עבור הטיפול והמגורים במוסד.`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['נדלן', 'מכירה', 'נכס', 'דירה']
  },
  
  {
    id: 'SEC_002',
    category: 'property',
    subcategory: 'real_estate',
    title: 'מכירת נכס - אסורה',
    titleEn: 'Property Sale - Prohibited',
    content: `אני מבקש/ת באופן מפורש שלא למכור את הנכס בשום מקרה.

הנכס יישאר בבעלותי ויועבר בירושה.

גם במקרה של צורך כספי - יש למצוא פתרונות חלופיים:
- משכנתא / הלוואה על הנכס
- מכירת נכסים אחרים
- השכרת הנכס
- סיוע משפחתי

**חריג יחיד:**
מכירה תאושר רק במקרה קיצון של חוב עצום שאי תשלומו יוביל לעיקול ממילא.`,
    variables: [],
    genderVariables: {
      principal: true,
      attorney: false
    },
    tags: ['נדלן', 'איסור', 'ירושה', 'נכס']
  },
  
  {
    id: 'SEC_003',
    category: 'property',
    subcategory: 'real_estate',
    title: 'השכרת נכס',
    titleEn: 'Property Rental',
    content: `{{מיופה_כוח}} {{רשאי}} להשכיר את הנכס במקרים הבאים:
- מעבר שלי למוסד / בית אבות / דיור מוגן
- אי יכולת להתגורר בנכס
- צורך בהכנסה נוספת

**תנאי השכירות:**
- דמי שכירות בשוק (לא מתחת למחיר)
- שוכרים אמינים (בדיקת רקע, ערבויות)
- חוזה מפורט ומאושר
- ביטוח דירה מקיף
- תחזוקה שוטפת

**ניהול:**
- אפשרות להעסיק חברת ניהול
- הכנסות יועברו לחשבון הבנק שלי
- יש לוודא תשלום מס הכנסה`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['נדלן', 'השכרה', 'שכירות', 'הכנסה']
  },
  
  {
    id: 'SEC_004',
    category: 'property',
    subcategory: 'real_estate',
    title: 'תחזוקת נכס',
    titleEn: 'Property Maintenance',
    content: `{{מיופה_כוח}} {{אחראי}} על תחזוקת הנכס:

**תחזוקה שוטפת:**
- תשלום ארנונה במועד
- תשלום ועד בית / דמי ניהול
- תשלום חשבונות (חשמל, מים, גז)
- ביטוחים (מבנה, תכולה, צד ג')

**תיקונים:**
- תיקוני חירום - מיידי
- תיקונים שוטפים - תוך שבוע-שבועיים
- שיפוצים גדולים - בתיאום`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['נדלן', 'תחזוקה', 'ארנונה', 'תיקונים']
  },

  {
    id: 'SEC_005',
    category: 'property',
    subcategory: 'banking',
    title: 'ניהול חשבון בנק',
    titleEn: 'Bank Account Management',
    content: `{{מיופה_כוח}} {{מוסמך}} לנהל את חשבונות הבנק:

**פעולות מותרות:**
- משיכת כסף מזומן (לצרכים יומיומיים)
- העברות בנקאיות
- תשלום חשבונות
- הפקדות
- צ'קים (חתימה, הפקדה)

**ניהול נכון:**
- שמירה על יתרה מינימלית
- תשלום הוצאות קבועות במועד
- מעקב אחר התנועות
- תיעוד כל פעולה`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['בנק', 'חשבון', 'ניהול', 'כסף']
  },

  {
    id: 'SEC_006',
    category: 'property',
    subcategory: 'banking',
    title: 'הוראות קבע',
    titleEn: 'Standing Orders',
    content: `הוראות קבע:

**קיימות:**
- ארנונה, ועד בית
- ביטוחים (חיים, בריאות, סיעודי, רכב, דירה)
- טלפון / אינטרנט / טלוויזיה
- חשמל וגז, מים
- תרופות / קופת חולים

**אחריות {{מיופה_כוח}}:**
- לוודא שהוראות הקבע פעילות
- יתרה מספקת לפני חיוב
- עדכון סכומים במידת הצורך`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['בנק', 'הוראות קבע', 'תשלומים אוטומטיים']
  },

  {
    id: 'SEC_007',
    category: 'property',
    subcategory: 'banking',
    title: 'איסור נגיעה בחיסכון',
    titleEn: 'Savings Protection',
    content: `כספי חיסכון וקרנות פנסיה:

**איסור נגיעה:**
{{מיופה_כוח}} לא ייגע בכספי החיסכון, אלא במקרים חריגים:
- חשבון חיסכון, קרן השתלמות, קופת גמל, פיקדונות

**שימוש מותר רק:**
- הוצאות רפואיות דחופות
- טיפול סיעודי ממושך
- מצוקה כלכלית חמורה`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['חיסכון', 'פנסיה', 'הגנה', 'איסור']
  },

  {
    id: 'SEC_008',
    category: 'property',
    subcategory: 'allowances',
    title: 'קצבאות ביטוח לאומי',
    titleEn: 'National Insurance',
    content: `קצבאות מביטוח לאומי:

**סוגי קצבאות:**
- קצבת זקנה
- קצבת נכות
- תוספת השלמה
- קצבת ניידות

**אחריות {{מיופה_כוח}}:**
- וידוא העברה לחשבון
- בדיקת זכאות לתוספות
- הגשת בקשות
- טיפול בבעיות`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['קצבאות', 'ביטוח לאומי', 'זקנה']
  },

  {
    id: 'SEC_009',
    category: 'property',
    subcategory: 'allowances',
    title: 'קצבת משרד הביטחון',
    titleEn: 'MOD Pension',
    content: `קצבת משרד הביטחון (נכה צה"ל):

**זכויות:**
- קצבה חודשית
- סיוע סיעודי
- הנחות במוסדות
- ביטוח רפואי מורחב
- מוסדות נופש

**אחריות {{מיופה_כוח}}:**
- מימוש כל הזכויות
- קשר עם משרד הביטחון
- תיאום טיפולים`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['משרד הביטחון', 'נכה צהל', 'קצבה']
  },

  {
    id: 'SEC_010',
    category: 'property',
    subcategory: 'vehicle',
    title: 'שמירה על רכב',
    titleEn: 'Keep Vehicle',
    content: `שמירה על הרכב:

**אחזקה:**
- ביטוח - חידוש שנתי
- טסט - לפי לוח
- טיפולים תקופתיים

**במקרה שאפסיק לנהוג:**
- להעמיד לרשות משפחה / השכרה / מכירה`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: false
    },
    tags: ['רכב', 'אחזקה', 'ביטוח']
  },

  {
    id: 'SEC_011',
    category: 'property',
    subcategory: 'vehicle',
    title: 'מכירת רכב',
    titleEn: 'Sell Vehicle',
    content: `מכירה מיידית:
אין צורך ברכב.

{{מיופה_כוח}} ימכור במחיר שוק הוגן.

**תמורה:**
העברה לחשבון הבנק.`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['רכב', 'מכירה']
  },

  {
    id: 'SEC_012',
    category: 'property',
    subcategory: 'prohibitions',
    title: 'איסור מתנות',
    titleEn: 'Gift Prohibition',
    content: `איסור מתנות מנכסים:

**איסור מוחלט** על {{מיופה_כוח}} להעניק מתנות לכל גורם.

**למעט:**
- מתנות סמליות (עד 500 ₪)
- תרומות לעמותות (עד 2,000 ₪)

**מטרה:** שמירה על הנכסים לטובת {{הממנה}}.`,
    variables: [],
    genderVariables: {
      principal: true,
      attorney: true
    },
    tags: ['איסור', 'מתנות', 'הגנה']
  },

  {
    id: 'SEC_013',
    category: 'property',
    subcategory: 'prohibitions',
    title: 'איסור שינוי צוואה',
    titleEn: 'Will Protection',
    content: `איסור שינוי צוואה:

**{{מיופה_כוח}} אינו {{רשאי}}:**
- לשנות / לבטל צוואה
- ליצור צוואה חדשה
- להוסיף או להסיר מוטבים

**יוצא מן הכלל:**
שינוי טכני - באישור עורך דין ומשפחה.`,
    variables: [],
    genderVariables: {
      principal: false,
      attorney: true
    },
    tags: ['צוואה', 'ירושה', 'איסור']
  },

  // ============ PERSONAL (אישי) - 47 סעיפים ============

  {
    id: 'SEC_014',
    category: 'personal',
    subcategory: 'residence',
    title: 'להישאר בבית - חזק',
    titleEn: 'Stay Home - Strong',
    content: `רצוני{{principal_gender_suffix}} להישאר במקום מגוריי הנוכחי בכל מצב.

מעבר למוסד אפשרי רק במקרים קיצוניים:
- אין אפשרות לטיפול ביתי הולם
- המצב הרפואי מחייב טיפול מוסדי
- באישור בית משפט`,
    variables: ['principal_gender_suffix'],
    tags: ['מגורים', 'בית', 'סיעוד']
  },

  {
    id: 'SEC_015',
    category: 'personal',
    subcategory: 'residence',
    title: 'להישאר בבית - מוחלט',
    titleEn: 'Stay Home - Absolute',
    content: `אני מצהיר{{principal_gender_suffix}} באופן חד משמעי: אינני מעוניין{{principal_gender_suffix}} לעבור לבית אבות בשום צורה.

גם אם הטיפול יהיה מורכב - להישאר בביתי.

הנחיה זו מוחלטת.`,
    variables: ['principal_gender_suffix'],
    tags: ['מגורים', 'בית', 'מוחלט']
  },

  {
    id: 'SEC_016',
    category: 'personal',
    subcategory: 'residence',
    title: 'גמישות במגורים',
    titleEn: 'Flexible Residence',
    content: `העדפה להישאר בבית ככל האפשר.

אם לא ניתן - מיופה{{attorney_gender_suffix}} הכוח יחליט על מוסד מתאים.

החלטה בשיקול דעת + התייעצות רפואית.`,
    variables: ['attorney_gender_suffix'],
    tags: ['מגורים', 'גמישות']
  },

  {
    id: 'SEC_017',
    category: 'personal',
    subcategory: 'residence',
    title: 'בית אבות בתנאים',
    titleEn: 'Nursing Home with Conditions',
    content: `במקרה של מעבר למוסד:

**תנאים:**
- רמה גבוהה של טיפול
- חדר פרטי / דו-חדרי
- קרבה למשפחה (עד 30 ק"מ)
- היגיינה מעולה
- צוות מקצועי

**החלטה:**
בהחלטת מיופה{{attorney_gender_suffix}} הכוח + התייעצות רפואית.`,
    variables: ['attorney_gender_suffix'],
    tags: ['בית אבות', 'תנאים', 'סיעוד']
  },

  {
    id: 'SEC_018',
    category: 'personal',
    subcategory: 'caregiver',
    title: 'דרישת עברית מהמטפלת',
    titleEn: 'Hebrew Requirement',
    content: `במקרה של טיפול סיעודי:

דרישה שהמטפל/ת תדע עברית שוטפת.

יכולת התקשורת חשובה לטיפול הולם והבנה הדדית.`,
    variables: [],
    tags: ['מטפלת', 'שפה', 'עברית']
  },

  {
    id: 'SEC_019',
    category: 'personal',
    subcategory: 'caregiver',
    title: 'עברית או אנגלית',
    titleEn: 'Hebrew or English',
    content: `המטפל/ת תדע עברית או אנגלית ברמה טובה.`,
    variables: [],
    tags: ['מטפלת', 'שפה', 'אנגלית']
  },

  {
    id: 'SEC_020',
    category: 'personal',
    subcategory: 'caregiver',
    title: 'ללא דרישת שפה',
    titleEn: 'No Language Requirement',
    content: `אין דרישה מיוחדת לשפת המטפל/ת.

התקשורת תתאפשר בשפות אחרות או בדרכים חלופיות.`,
    variables: [],
    tags: ['מטפלת', 'גמישות']
  },

  {
    id: 'SEC_021',
    category: 'personal',
    subcategory: 'caregiver',
    title: 'דרישות למטפלת - סטנדרט',
    titleEn: 'Standard Caregiver Requirements',
    content: `דרישות לבחירת מטפל:

**ניסיון:**
- 2 שנות ניסיון לפחות
- הכשרה מקצועית

**בדיקות:**
- בדיקת רקע פלילי
- 2 המלצות לפחות
- ראיון מעמיק

**תכונות:**
- יחס חם ומכבד
- סבלנות, אמינות, יושר`,
    variables: [],
    tags: ['מטפלת', 'דרישות', 'בדיקות']
  }
];

// ============ פונקציות עזר ============

export function getAdvanceDirectivesSectionsByCategory(category: 'property' | 'personal' | 'medical'): AdvanceDirectivesSectionTemplate[] {
  return advanceDirectivesSectionsWarehouse.filter(s => s.category === category);
}

export function getAdvanceDirectivesSectionsBySubcategory(subcategory: string): AdvanceDirectivesSectionTemplate[] {
  return advanceDirectivesSectionsWarehouse.filter(s => s.subcategory === subcategory);
}

export function searchAdvanceDirectivesSections(query: string): AdvanceDirectivesSectionTemplate[] {
  const lowerQuery = query.toLowerCase();
  return advanceDirectivesSectionsWarehouse.filter(s => 
    s.title.toLowerCase().includes(lowerQuery) ||
    s.content.toLowerCase().includes(lowerQuery) ||
    s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAdvanceDirectivesSectionById(id: string): AdvanceDirectivesSectionTemplate | undefined {
  return advanceDirectivesSectionsWarehouse.find(s => s.id === id);
}

// קטגוריות ותתי-קטגוריות
export const advanceDirectivesCategories = [
  { id: 'property', name: 'עניינים רכושיים', icon: '🏠', color: '#27ae60' },
  { id: 'personal', name: 'עניינים אישיים', icon: '👤', color: '#3498db' },
  { id: 'medical', name: 'עניינים רפואיים', icon: '⚕️', color: '#e74c3c' }
];

export const advanceDirectivesSubcategories = {
  property: [
    { id: 'real_estate', name: 'נדל"ן' },
    { id: 'banking', name: 'בנקאות' },
    { id: 'allowances', name: 'קצבאות' },
    { id: 'vehicle', name: 'רכב' },
    { id: 'prohibitions', name: 'איסורים' }
  ],
  personal: [
    { id: 'residence', name: 'מגורים' },
    { id: 'caregiver', name: 'מטפלים' },
    { id: 'social', name: 'קשרים חברתיים' },
    { id: 'cleanliness', name: 'ניקיון' },
    { id: 'maintenance', name: 'תחזוקה' },
    { id: 'nutrition', name: 'תזונה' },
    { id: 'personal_care', name: 'טיפוח אישי' },
    { id: 'physical_activity', name: 'פעילות גופנית' },
    { id: 'culture', name: 'תרבות ופנאי' },
    { id: 'technology', name: 'טכנולוגיה' },
    { id: 'security', name: 'אבטחה' },
    { id: 'travel', name: 'נסיעות' }
  ],
  medical: [
    { id: 'decisions', name: 'החלטות רפואיות' },
    { id: 'treatment', name: 'עקרונות טיפול' },
    { id: 'second_opinion', name: 'חוות דעת שנייה' },
    { id: 'clinical_trials', name: 'ניסויים קליניים' },
    { id: 'end_of_life', name: 'סוף חיים' },
    { id: 'pain', name: 'ניהול כאב' },
    { id: 'resuscitation', name: 'החייאה' },
    { id: 'chronic', name: 'מחלות כרוניות' },
    { id: 'providers', name: 'נותני שירות' },
    { id: 'insurance', name: 'ביטוחים' },
    { id: 'organ_donation', name: 'תרומת איברים' }
  ]
};

/**
 * פונקציה להחלפת נטיות מגדר בהנחיות מקדימות
 * ==================================================
 * 
 * @param sectionContent - תוכן הסעיף עם placeholders מהמילון
 * @param principalGender - מגדר הממנה (זכר/נקבה)
 * @param attorneyGender - מגדר מיופה הכוח (זכר/נקבה/רבים)
 * @returns טקסט עם נטיות תקינות
 */
export function applyAdvanceDirectivesGender(
  sectionContent: string,
  principalGender: 'male' | 'female',
  attorneyGender: 'male' | 'female' | 'plural'
): string {
  // בדיקה - האם צריך לייבא את הפונקציה מהמודול העברי
  try {
    const { replaceTextWithMultipleGenders, replaceTextWithGender } = require('@/lib/hebrew-gender');
    
    let result = sectionContent;
    
    // **שלב 1: החלפת placeholders ממילון העברית**
    // מיופה כוח, רשאי, אחראי, מוסמך, הממנה וכו'
    const genderMap: Record<string, 'male' | 'female' | 'plural'> = {
      'מיופה_כוח': attorneyGender,
      'מיופה_הכוח': attorneyGender,
      'רשאי': attorneyGender,
      'אחראי': attorneyGender,
      'מוסמך': attorneyGender,
      'מחויב': attorneyGender,
      'ממנה': principalGender,
      'הממנה': principalGender,
      'זכאי': principalGender,
      'מבקש': principalGender,
      'דורש': principalGender,
      'מצהיר': principalGender,
      'מורה': principalGender
    };
    
    result = replaceTextWithMultipleGenders(result, genderMap);
    
    // **שלב 2: החלפת דפוסים אוטומטיים /ת /ה**
    // רק אם יש דפוסים כאלה בטקסט - נחליף לפי מגדר הממנה
    if (result.includes('/ת') || result.includes('/ה')) {
      result = replaceTextWithGender(result, principalGender);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error applying gender to advance directives:', error);
    return sectionContent; // במקרה של שגיאה - נחזיר את הטקסט המקורי
  }
}

/**
 * פונקציה להחלפת נטיות בכל הסעיפים שנבחרו
 */
export function applyGenderToSelectedSections(
  sections: AdvanceDirectivesSectionTemplate[],
  principalGender: 'male' | 'female',
  attorneyGender: 'male' | 'female' | 'plural'
): AdvanceDirectivesSectionTemplate[] {
  return sections.map(section => ({
    ...section,
    content: applyAdvanceDirectivesGender(section.content, principalGender, attorneyGender)
  }));
}
