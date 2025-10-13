/**
 * מחסן סעיפים להסכמים ולחוזים
 * כולל: הסכמי שכירות, מכר, עבודה, שותפות, שכר טרחה
 */

export interface ContractSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'parties' | 'subject' | 'payment' | 'obligations' | 'termination' | 'general' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  contractTypes: ('rental' | 'sale' | 'employment' | 'partnership' | 'fee-agreement' | 'service')[];
}

export const contractSectionsWarehouse: ContractSectionTemplate[] = [
  // פתיחות הסכמים
  {
    id: 'contract-opening-standard',
    title: 'פתיחת הסכם סטנדרטית',
    category: 'opening',
    content: `הסכם {{contract_type}}

שנערך ונחתם היום, {{contract_date}}, בין:

{{party1_name}}, ת.ז. {{party1_id}}, מכתובת {{party1_address}} (להלן: "{{party1_title}}")

לבין:

{{party2_name}}, ת.ז. {{party2_id}}, מכתובת {{party2_address}} (להלן: "{{party2_title}}")

הואיל והצדדים מעוניינים לקבוע את יחסיהם החוזיים בכתב ובאופן מפורש;

לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:`,
    variables: ['contract_type', 'contract_date', 'party1_name', 'party1_id', 'party1_address', 'party1_title', 'party2_name', 'party2_id', 'party2_address', 'party2_title'],
    aiPrompt: 'התאם את פתיחת ההסכם לסוג החוזה הספציפי ולצדדים המעורבים',
    usageInstructions: 'השתמש לפתיחת כל סוגי ההסכמים',
    contractTypes: ['rental', 'sale', 'employment', 'partnership', 'fee-agreement', 'service']
  },

  // נושא ההסכם
  {
    id: 'rental-subject',
    title: 'נושא הסכם שכירות',
    category: 'subject',
    content: `נושא ההסכם:

1. המשכיר מסכים להשכיר לשוכר את {{property_description}} הממוקם ב{{property_address}} (להלן: "הנכס").

2. השכירות היא לתקופה של {{rental_period}} החל מיום {{start_date}} ועד ליום {{end_date}}.

3. הנכס מושכר למטרת {{rental_purpose}} בלבד.

4. הנכס נמסר לשוכר במצב {{property_condition}} וכולל את הציוד/ריהוט הבא: {{included_items}}.

5. השוכר מצהיר כי בדק את הנכס ומקבל אותו במצבו הנוכחי.`,
    variables: ['property_description', 'property_address', 'rental_period', 'start_date', 'end_date', 'rental_purpose', 'property_condition', 'included_items'],
    aiPrompt: 'התאם את תיאור הנכס והשכירות לפרטים הספציפיים, הוסף פרטים חשובים',
    usageInstructions: 'השתמש בהסכמי שכירות של דירות, משרדים וחנויות',
    contractTypes: ['rental']
  },

  {
    id: 'employment-subject',
    title: 'נושא הסכם עבודה',
    category: 'subject',
    content: `תנאי העסקה:

1. המעסיק מעסיק את העובד בתפקיד {{job_title}} במחלקת {{department}}.

2. העבודה תתבצע ב{{work_location}} בימים {{work_days}} בין השעות {{work_hours}}.

3. תקופת העסקה: {{employment_period}} החל מיום {{employment_start_date}}.

4. תקופת ניסיון: {{probation_period}} (אם רלוונטי).

5. העובד יהיה כפוף ל{{supervisor_name}}, {{supervisor_title}}.

6. תיאור התפקיד: {{job_description}}`,
    variables: ['job_title', 'department', 'work_location', 'work_days', 'work_hours', 'employment_period', 'employment_start_date', 'probation_period', 'supervisor_name', 'supervisor_title', 'job_description'],
    aiPrompt: 'התאם את תנאי העסקה לתפקיד הספציפי, הוסף פרטים חשובים על התפקיד',
    usageInstructions: 'השתמש בהסכמי עבודה לעובדים שכירים',
    contractTypes: ['employment']
  },

  // תשלומים
  {
    id: 'payment-terms-rental',
    title: 'תנאי תשלום - שכירות',
    category: 'payment',
    content: `תנאי התשלום:

1. דמי השכירות החודשיים הם {{monthly_rent}} ש"ח לחודש.

2. התשלום יבוצע מדי {{payment_frequency}} עד ליום ה-{{payment_day}} בכל חודש.

3. בנוסף לדמי השכירות, ישלם השוכר:
   - דמי ניהול: {{management_fee}} ש"ח לחודש
   - ארנונה: {{municipal_tax}} ש"ח לחודש  
   - דמי ועד בית: {{committee_fee}} ש"ח לחודש

4. פיקדון בסך {{deposit_amount}} ש"ח שולם בעת חתימת ההסכם.

5. איחור בתשלום יחויב בריבית של {{late_fee_rate}}% לחודש.`,
    variables: ['monthly_rent', 'payment_frequency', 'payment_day', 'management_fee', 'municipal_tax', 'committee_fee', 'deposit_amount', 'late_fee_rate'],
    aiPrompt: 'התאם את תנאי התשלום לסוג הנכס ולמיקום, וודא שהסכומים הגיוניים',
    usageInstructions: 'השתמש בהסכמי שכירות עם פירוט מלא של עלויות',
    contractTypes: ['rental']
  },

  {
    id: 'payment-terms-service',
    title: 'תנאי תשלום - שירותים',
    category: 'payment',
    content: `תנאי התשלום:

1. התמורה עבור השירותים תהיה {{total_fee}} ש"ח.

2. התשלום יבוצע {{payment_schedule}}.

3. במקרה של תשלום חלקי:
   - מקדמה: {{advance_payment}} ש"ח בחתימת ההסכם
   - יתרה: {{balance_payment}} ש"ח {{balance_due_date}}

4. התשלום יבוצע באמצעות {{payment_method}}.

5. קבלות ופטור ממע"מ יינתנו בהתאם לחוק.

6. איחור בתשלום יחויב בריבית של {{late_interest}}% לחודש.`,
    variables: ['total_fee', 'payment_schedule', 'advance_payment', 'balance_payment', 'balance_due_date', 'payment_method', 'late_interest'],
    aiPrompt: 'התאם את תנאי התשלום לסוג השירות ולהיקפו, הוסף הגנות מתאימות',
    usageInstructions: 'השתמש בהסכמי שירותים ועבודות',
    contractTypes: ['service', 'fee-agreement']
  },

  // התחייבויות
  {
    id: 'landlord-obligations',
    title: 'התחייבויות המשכיר',
    category: 'obligations',
    content: `התחייבויות המשכיר:

1. למסור את הנכס לשוכר במצב תקין וראוי לשימוש למטרה המוסכמת.

2. לדאוג לתיקון תקלות {{maintenance_responsibility}} על חשבונו.

3. לא להפריע לשוכר בשימושו הרגיל והסביר בנכס.

4. לשמור על זכויות השוכר כנגד כל תובע.

5. {{additional_landlord_obligations}}

6. לעמוד בכל התחייבויותיו על פי חוק הגנת הדייר ותקנותיו.`,
    variables: ['maintenance_responsibility', 'additional_landlord_obligations'],
    aiPrompt: 'התאם את התחייבויות המשכיר לסוג הנכס ולחוק הגנת הדייר',
    usageInstructions: 'השתמש בהסכמי שכירות לפירוט חובות המשכיר',
    contractTypes: ['rental']
  },

  {
    id: 'employee-obligations',
    title: 'התחייבויות העובד',
    category: 'obligations',
    content: `התחייבויות העובד:

1. לבצע את עבודתו בנאמנות, במסירות ובמיטב יכולתו.

2. לשמור על סודיות מוחלטת בכל הנוגע ל{{confidentiality_scope}}.

3. לא לעבוד אצל מתחרים או לעסוק בפעילות מתחרה במשך תקופת העסקתו ו{{non_compete_period}} לאחריה.

4. להקדיש את מלוא זמנו ומרצו לביצוע התפקיד.

5. לציית להוראות המעסיק ולמדיניות החברה.

6. להחזיר כל רכוש החברה בסיום העסקה.

7. {{additional_employee_obligations}}`,
    variables: ['confidentiality_scope', 'non_compete_period', 'additional_employee_obligations'],
    aiPrompt: 'התאם את התחייבויות העובד לתפקיד ולרגישות המידע, וודא חוקיות',
    usageInstructions: 'השתמש בהסכמי עבודה עם דרישות סודיות',
    contractTypes: ['employment']
  },

  // סיום הסכמים
  {
    id: 'contract-termination',
    title: 'סיום ההסכם',
    category: 'termination',
    content: `סיום ההסכם:

1. ההסכם יסתיים אוטומטית ביום {{contract_end_date}}.

2. כל צד רשאי לסיים את ההסכם בהודעה מוקדמת של {{notice_period}} ימים.

3. במקרה של הפרה יסודית, רשאי הצד הנפגע לסיים את ההסכם ללא הודעה מוקדמת.

4. בסיום ההסכם:
   - {{end_obligation1}}
   - {{end_obligation2}}
   - {{end_obligation3}}

5. הוראות הסכם זה הנוגעות ל{{surviving_clauses}} יישארו בתוקף גם לאחר סיומו.`,
    variables: ['contract_end_date', 'notice_period', 'end_obligation1', 'end_obligation2', 'end_obligation3', 'surviving_clauses'],
    aiPrompt: 'התאם את תנאי הסיום לסוג ההסכם, הוסף הגנות מתאימות לכל צד',
    usageInstructions: 'השתמש בכל ההסכמים לקביעת תנאי סיום',
    contractTypes: ['rental', 'sale', 'employment', 'partnership', 'service']
  },

  // סעיפים כלליים
  {
    id: 'contract-general-clauses',
    title: 'סעיפים כלליים להסכם',
    category: 'general',
    content: `הוראות כלליות:

1. הסכם זה מבטא את מלוא ההסכמה בין הצדדים ומבטל כל הסכם קודם בנושא.

2. כל שינוי בהסכם יעשה בכתב ובהסכמת שני הצדדים.

3. אי מימוש זכות על ידי אחד הצדדים לא ייחשב כוויתור על אותה זכות.

4. סמכות השיפוט הייחודית תהיה לבתי המשפט ב{{jurisdiction_location}}.

5. הדין החל על הסכם זה הוא הדין הישראלי.

6. הסכם זה ערוך ב-{{contract_copies}} עותקים, כשבידי כל צד עותק אחד.`,
    variables: ['jurisdiction_location', 'contract_copies'],
    aiPrompt: 'התאם את ההוראות הכלליות לסוג ההסכם ולמיקום הצדדים',
    usageInstructions: 'השתמש בסוף כל הסכם לסעיפים כלליים',
    contractTypes: ['rental', 'sale', 'employment', 'partnership', 'fee-agreement', 'service']
  },

  // הסכמי שכר טרחה ספציפיים
  {
    id: 'fee-agreement-scope',
    title: 'היקף השירותים המשפטיים',
    category: 'subject',
    content: `היקף השירותים:

עורך הדין יעניק ללקוח את השירותים המשפטיים הבאים:

1. {{service1_description}}

2. {{service2_description}}

3. {{service3_description}}

4. ייצוג בפני {{representation_venues}}.

5. הכנת מסמכים משפטיים: {{documents_list}}.

6. השירותים לא כוללים: {{excluded_services}}.

השירותים יינתנו ברמה מקצועית גבוהה ובהתאם לכללי האתיקה של לשכת עורכי הדין.`,
    variables: ['service1_description', 'service2_description', 'service3_description', 'representation_venues', 'documents_list', 'excluded_services'],
    aiPrompt: 'פרט את השירותים המשפטיים בצורה ברורה ומקצועית, הוסף הגבלות אם נדרש',
    usageInstructions: 'השתמש בהסכמי שכר טרחה לפירוט השירותים',
    contractTypes: ['fee-agreement']
  },

  {
    id: 'fee-structure-hourly',
    title: 'מבנה תמחור שעתי',
    category: 'payment',
    content: `מבנה התמחור:

1. שכר הטרחה יחושב על בסיס שעתי בתעריף של {{hourly_rate}} ש"ח לשעה.

2. יחידת החיוב המינימלית היא {{minimum_billing_unit}} דקות.

3. השעות הבאות יחויבו בתעריף מוגדל:
   - עבודה בשעות הערב (אחרי {{evening_start}}): תוספת של {{evening_surcharge}}%
   - עבודה בסופי שבוע: תוספת של {{weekend_surcharge}}%
   - עבודה דחופה: תוספת של {{urgent_surcharge}}%

4. הוצאות נלוות (נסיעות, צילומים, אגרות): {{expenses_policy}}.

5. חשבונית תישלח מדי {{billing_frequency}} עם פירוט השעות.`,
    variables: ['hourly_rate', 'minimum_billing_unit', 'evening_start', 'evening_surcharge', 'weekend_surcharge', 'urgent_surcharge', 'expenses_policy', 'billing_frequency'],
    aiPrompt: 'התאם את התמחור השעתי לסוג התיק ולמורכבותו, הוסף הבהרות על הוצאות',
    usageInstructions: 'השתמש בהסכמי שכר טרחה עם תמחור שעתי',
    contractTypes: ['fee-agreement']
  },

  // סעיפי הגנה
  {
    id: 'limitation-of-liability',
    title: 'הגבלת אחריות',
    category: 'general',
    content: `הגבלת אחריות:

1. אחריותו של {{service_provider}} מוגבלת לנזקים הישירים בלבד.

2. בכל מקרה, אחריותו לא תעלה על סך {{liability_cap}} ש"ח.

3. {{service_provider}} לא יהיה אחראי לנזקים עקיפים, אובדן רווחים או נזקים תוצאתיים.

4. תקופת ההתיישנות לכל טענה היא {{limitation_period}} חודשים ממועד גילוי הנזק.

5. הגבלות אלו לא יחולו במקרה של {{exceptions_to_limitation}}.`,
    variables: ['service_provider', 'liability_cap', 'limitation_period', 'exceptions_to_limitation'],
    aiPrompt: 'התאם את הגבלת האחריות לסוג השירות ולסיכונים הכרוכים בו',
    usageInstructions: 'השתמש בהסכמי שירותים להגבלת אחריות',
    contractTypes: ['service', 'fee-agreement']
  },

  // סעיפי סודיות
  {
    id: 'confidentiality-clause',
    title: 'סעיף סודיות',
    category: 'obligations',
    content: `סודיות:

1. כל צד מתחייב לשמור בסודיות מוחלטת על {{confidential_information}}.

2. איסור הגילוי יחול גם על עובדי הצדדים, יועציהם וכל מי שפועל מטעמם.

3. החובה תישאר בתוקף גם לאחר סיום ההסכם למשך {{confidentiality_period}}.

4. הפרת הסודיות תזכה את הצד הנפגע בפיצוי מוסכם בסך {{confidentiality_penalty}} ש"ח.

5. הוראות סעיף זה לא יחולו על מידע {{confidentiality_exceptions}}.`,
    variables: ['confidential_information', 'confidentiality_period', 'confidentiality_penalty', 'confidentiality_exceptions'],
    aiPrompt: 'התאם את סעיף הסודיות לרגישות המידע ולסוג העסק',
    usageInstructions: 'השתמש בהסכמים הכוללים מידע רגיש או קניין רוחני',
    contractTypes: ['employment', 'service', 'partnership']
  }
];

/**
 * פונקציה לקבלת סעיפים לפי סוג חוזה
 */
export function getContractSectionsForType(contractType: string): ContractSectionTemplate[] {
  return contractSectionsWarehouse.filter(section => 
    section.contractTypes.includes(contractType as any)
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getContractSectionsByCategory(category: string): ContractSectionTemplate[] {
  return contractSectionsWarehouse.filter(section => section.category === category);
}
