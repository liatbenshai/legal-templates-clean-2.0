/**
 * מחסן סעיפים לייפויי כוח - רגיל ומתמשך
 */

export interface POASectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'general-powers' | 'financial-powers' | 'medical-powers' | 'property-powers' | 'limitations' | 'duration' | 'special' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  poaTypes: ('regular' | 'enduring' | 'medical')[];
}

export const poaSectionsWarehouse: POASectionTemplate[] = [
  // סמכויות כלליות
  {
    id: 'general-representation',
    title: 'ייצוג כללי בפני גופים',
    category: 'general-powers',
    content: `סמכויות ייצוג כלליות:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לייצג אותי בפני {{authorities_list}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- לחתום בשמי על מסמכים
- לקבל מסמכים ומכתבים בשמי  
- להגיש בקשות וטפסים בשמי
- {{additional_representation_powers}}

סמכות זו {{scope_limitation}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'authorities_list', 'additional_representation_powers', 'scope_limitation'],
    aiPrompt: 'התאם את סמכויות הייצוג לצרכים הספציפיים, וודא בהירות',
    usageInstructions: 'השתמש לייצוג כללי בפני גופים שונים',
    poaTypes: ['regular', 'enduring']
  },

  // סמכויות פיננסיות
  {
    id: 'bank-account-management',
    title: 'ניהול חשבונות בנק',
    category: 'financial-powers',
    content: `ניהול חשבונות בנק:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לנהל את חשבון/ות הבנק שלי {{bank_details}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- להפקיד ולמשוך כספים
- להעביר כספים בין חשבונות
- לבצע העברות בנקאיות
- {{banking_powers}}

המיופה{{attorney_gender_suffix}} כוח {{withdrawal_limit}}.

המיופה{{attorney_gender_suffix}} כוח {{loan_authority}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'bank_details', 'banking_powers', 'withdrawal_limit', 'loan_authority'],
    aiPrompt: 'פרט את הסמכויות הבנקאיות, כלול מגבלות סכומים אם רלוונטי',
    usageInstructions: 'השתמש להענקת סמכויות ניהול חשבונות בנק',
    poaTypes: ['regular', 'enduring']
  },

  {
    id: 'investment-management',
    title: 'ניהול תיקי השקעות',
    category: 'financial-powers',
    content: `ניהול השקעות:

אני ממנה את {{attorney_name}} לנהל את תיקי ההשקעות שלי ב{{investment_accounts}}.

המיופה כוח רשאי:
- לקנות ולמכור ניירות ערך
- לנהל תיקי מניות, אג"ח וקרנות נאמנות
- {{investment_powers}}

מגבלות: המיופה כוח {{investment_limitations}}.

המיופה כוח מתחייב {{investment_commitments}}.`,
    variables: ['attorney_name', 'investment_accounts', 'investment_powers', 'investment_limitations', 'investment_commitments'],
    aiPrompt: 'התאם לרמת הסיכון הרצויה, כלול מגבלות והגנות',
    usageInstructions: 'השתמש להענקת סמכויות ניהול השקעות',
    poaTypes: ['regular', 'enduring']
  },

  {
    id: 'tax-matters',
    title: 'ניהול עניינים במס הכנסה',
    category: 'financial-powers',
    content: `ניהול עניינים במס הכנסה:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לייצג אותי בכל עניין הקשור למס הכנסה.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- להגיש דוחות שנתיים בשמי
- לקבל החזרי מס
- לייצג אותי בהליכים מול רשויות המס
- {{tax_powers}}

המיופה{{attorney_gender_suffix}} כוח {{tax_appeal_authority}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'tax_powers', 'tax_appeal_authority'],
    aiPrompt: 'פרט סמכויות מס, הדגש חשיבות דיווח תקין',
    usageInstructions: 'השתמש להענקת סמכויות מול רשויות המס',
    poaTypes: ['regular', 'enduring']
  },

  // סמכויות רכוש
  {
    id: 'real-estate-sale',
    title: 'מכירת נכסי מקרקעין',
    category: 'property-powers',
    content: `מכירת נכסי מקרקעין:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} למכור את הנכס/ים שלי {{property_details}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- לנהל משא ומתן עם קונים פוטנציאליים
- לקבוע מחיר מכירה של לפחות {{minimum_price}}
- לחתום על הסכם מכר
- להתייצב בלשכת רישום המקרקעין
- {{sale_powers}}

תמורת המכירה תועבר ל{{proceeds_destination}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'property_details', 'minimum_price', 'sale_powers', 'proceeds_destination'],
    aiPrompt: 'פרט את סמכויות המכירה, כלול מחיר מינימום להגנה',
    usageInstructions: 'השתמש להענקת סמכות למכירת נכסים',
    poaTypes: ['regular', 'enduring']
  },

  {
    id: 'real-estate-purchase',
    title: 'רכישת נכסי מקרקעין',
    category: 'property-powers',
    content: `רכישת נכסי מקרקעין:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לרכוש בשמי נכס מקרקעין {{purchase_criteria}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- לחפש נכסים מתאימים
- לנהל משא ומתן עם מוכרים
- לחתום על הסכם רכישה בסכום שלא יעלה על {{max_price}}
- {{purchase_powers}}

המיופה{{attorney_gender_suffix}} כוח {{purchase_conditions}}.

התשלום יבוצע מ{{payment_source}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'purchase_criteria', 'max_price', 'purchase_powers', 'purchase_conditions', 'payment_source'],
    aiPrompt: 'פרט קריטריונים ברורים לרכישה, כלול מחיר מקסימלי',
    usageInstructions: 'השתמש להענקת סמכות לרכישת נכסים',
    poaTypes: ['regular', 'enduring']
  },

  {
    id: 'property-management',
    title: 'ניהול נכסי מקרקעין',
    category: 'property-powers',
    content: `ניהול נכסי מקרקעין:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לנהל את הנכס/ים {{property_address}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- להשכיר את הנכס לדיירים
- לחתום על הסכמי שכירות
- לגבות דמי שכירות
- לבצע תיקונים ושיפוצים עד סכום של {{repair_limit}} ש"ח
- לשלם חשבונות ארנונה וועד בית
- {{management_powers}}

דמי השכירות שייגבו {{rent_destination}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'property_address', 'repair_limit', 'management_powers', 'rent_destination'],
    aiPrompt: 'התאם לצרכי ניהול השוטפים, כלול מגבלות סכומים',
    usageInstructions: 'השתמש להענקת סמכות לניהול נכסים',
    poaTypes: ['regular', 'enduring']
  },

  // סמכויות רפואיות
  {
    id: 'medical-decisions',
    title: 'קבלת החלטות רפואיות',
    category: 'medical-powers',
    content: `החלטות רפואיות:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לקבל החלטות רפואיות בשמי במידה ולא אוכל לעשות זאת בעצמי.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- לקבל מידע רפואי מלא על מצבי
- להחליט על טיפולים רפואיים
- לאשר ניתוחים והליכים רפואיים
- {{medical_powers}}

העדפותיי{{principal_gender_suffix}} הרפואיות: {{medical_preferences}}.

במצב סופני: {{end_of_life_wishes}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'medical_powers', 'medical_preferences', 'end_of_life_wishes'],
    aiPrompt: 'נסח בצורה רגישה, כלול העדפות ברורות לגבי טיפולים',
    usageInstructions: 'השתמש בייפוי כוח מתמשך להחלטות רפואיות',
    poaTypes: ['enduring', 'medical']
  },

  {
    id: 'hospitalization-decisions',
    title: 'החלטות אשפוז וטיפול',
    category: 'medical-powers',
    content: `אשפוז וטיפול:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} להחליט על אשפוז וטיפול רפואי בשמי.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- להחליט על אשפוז בבית חולים או מוסד סיעודי
- לבחור מוסד רפואי {{facility_preferences}}
- להחליט על רמת הטיפול הרפואי
- {{hospitalization_powers}}

העדפותיי{{principal_gender_suffix}}: {{care_preferences}}.

תקציב: {{care_budget}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'facility_preferences', 'hospitalization_powers', 'care_preferences', 'care_budget'],
    aiPrompt: 'התאם להעדפות אישיות, כלול שיקולים כלכליים',
    usageInstructions: 'השתמש להחלטות על אשפוז וטיפול',
    poaTypes: ['enduring', 'medical']
  },

  // מגבלות
  {
    id: 'specific-limitations',
    title: 'מגבלות ספציפיות על הסמכויות',
    category: 'limitations',
    content: `מגבלות:

על אף הסמכויות שהענקתי{{principal_gender_suffix}} למיופה{{attorney_gender_suffix}} הכוח, {{attorney_pronoun}} אינו{{attorney_gender_suffix}} רשאי{{attorney_gender_suffix}}:

1. {{limitation1}}

2. {{limitation2}}

3. {{limitation3}}

כל פעולה שנעשתה בניגוד למגבלות אלו תהיה בטלה מעיקרה.

{{additional_limitations}}`,
    variables: ['principal_gender_suffix', 'attorney_gender_suffix', 'attorney_pronoun', 'limitation1', 'limitation2', 'limitation3', 'additional_limitations'],
    aiPrompt: 'פרט מגבלות ברורות, הגן על האינטרסים החשובים של הממנה',
    usageInstructions: 'השתמש להגדרת מגבלות על הסמכויות',
    poaTypes: ['regular', 'enduring', 'medical']
  },

  {
    id: 'approval-requirements',
    title: 'פעולות הדורשות אישור נוסף',
    category: 'limitations',
    content: `דרישת אישור:

המיופה{{attorney_gender_suffix}} הכוח יהיה{{attorney_gender_suffix}} חייב{{attorney_gender_suffix}} לקבל אישור מ{{approver_name}} לפני ביצוע הפעולות הבאות:

1. {{action_requiring_approval1}}

2. {{action_requiring_approval2}}

3. {{action_requiring_approval3}}

האישור יינתן בכתב {{approval_method}}.

ללא אישור כאמור, הפעולה לא תהיה תקפה.`,
    variables: ['attorney_gender_suffix', 'approver_name', 'action_requiring_approval1', 'action_requiring_approval2', 'action_requiring_approval3', 'approval_method'],
    aiPrompt: 'הגדר בהירות מי מאשר ומה דורש אישור, כלול מנגנון אישור',
    usageInstructions: 'השתמש כאשר רוצים בקרה נוספת על פעולות מסוימות',
    poaTypes: ['regular', 'enduring']
  },

  // משך תוקף
  {
    id: 'fixed-duration',
    title: 'ייפוי כוח לתקופה מוגדרת',
    category: 'duration',
    content: `תוקף מוגבל בזמן:

ייפוי כוח זה יהיה בתוקף מיום {{start_date}} ועד יום {{end_date}}.

לאחר תאריך זה, ייפוי הכוח יפקע אוטומטית ללא צורך בהודעה נוספת.

{{extension_option}}`,
    variables: ['start_date', 'end_date', 'extension_option'],
    aiPrompt: 'הגדר תקופה ברורה, כלול אפשרות להארכה אם רלוונטי',
    usageInstructions: 'השתמש כאשר רוצים ייפוי כוח זמני',
    poaTypes: ['regular']
  },

  {
    id: 'enduring-poa-activation',
    title: 'תנאי הפעלה של ייפוי כוח מתמשך',
    category: 'duration',
    content: `תנאי הפעלה:

ייפוי כוח מתמשך זה ייכנס לתוקף {{activation_condition}}.

הקביעה האם התקיים תנאי ההפעלה תיעשה על ידי {{determination_authority}}.

עד להפעלת ייפוי הכוח, {{prior_to_activation}}.

ייפוי כוח זה יישאר בתוקף {{duration_after_activation}}.`,
    variables: ['activation_condition', 'determination_authority', 'prior_to_activation', 'duration_after_activation'],
    aiPrompt: 'הגדר בבהירות מתי מופעל ייפוי הכוח המתמשך, כלול מנגנון קביעה',
    usageInstructions: 'השתמש בייפוי כוח מתמשך עם תנאי הפעלה',
    poaTypes: ['enduring', 'medical']
  },

  {
    id: 'revocation-terms',
    title: 'תנאי ביטול ייפוי הכוח',
    category: 'duration',
    content: `ביטול ייפוי הכוח:

אני שומר{{principal_gender_suffix}} לעצמי את הזכות לבטל ייפוי כוח זה בכל עת {{revocation_conditions}}.

הביטול ייעשה על ידי {{revocation_method}}.

במקרה של ביטול, {{notice_to_attorney}}.

ייפוי הכוח יתבטל אוטומטית ב{{automatic_revocation_events}}.`,
    variables: ['principal_gender_suffix', 'revocation_conditions', 'revocation_method', 'notice_to_attorney', 'automatic_revocation_events'],
    aiPrompt: 'הסבר את תנאי הביטול בבהירות, שמור על זכות הממנה לבטל',
    usageInstructions: 'השתמש להגדרת תנאי ביטול',
    poaTypes: ['regular', 'enduring', 'medical']
  },

  // סעיפים מיוחדים
  {
    id: 'digital-assets-management',
    title: 'ניהול נכסים דיגיטליים',
    category: 'special',
    content: `ניהול נכסים דיגיטליים:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לנהל את הנכסים הדיגיטליים שלי.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}} לגשת ל:
- חשבונות דואר אלקטרוני: {{email_accounts}}
- רשתות חברתיות: {{social_media}}
- אחסון בענן: {{cloud_storage}}
- ארנקים דיגיטליים: {{crypto_wallets}}

פרטי גישה נמצאים ב{{credentials_location}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}} {{digital_powers}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'email_accounts', 'social_media', 'cloud_storage', 'crypto_wallets', 'credentials_location', 'digital_powers'],
    aiPrompt: 'התאם לעידן הדיגיטלי, כלול הגנה על פרטיות',
    usageInstructions: 'השתמש להענקת סמכויות על נכסים דיגיטליים',
    poaTypes: ['regular', 'enduring']
  },

  {
    id: 'business-management',
    title: 'ניהול עסק',
    category: 'special',
    content: `ניהול עסק:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לנהל את העסק שלי {{business_name}}, ח.פ. {{business_id}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- לחתום על חוזים מסחריים
- לנהל עובדים (גיוס, פיטורין, משכורות)
- לקבוע מדיניות עסקית
- {{business_powers}}

מגבלות: המיופה{{attorney_gender_suffix}} הכוח {{business_limitations}}.

המיופה{{attorney_gender_suffix}} כוח מתחייב{{attorney_gender_suffix}} {{business_commitments}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'business_name', 'business_id', 'business_powers', 'business_limitations', 'business_commitments'],
    aiPrompt: 'התאם לסוג העסק, כלול מגבלות והגנות',
    usageInstructions: 'השתמש להענקת סמכויות לניהול עסק',
    poaTypes: ['regular', 'enduring']
  },

  {
    id: 'legal-proceedings',
    title: 'ייצוג בהליכים משפטיים',
    category: 'special',
    content: `ייצוג משפטי:

אני ממנה{{principal_gender_suffix}} את {{attorney_name}} לייצג אותי בהליכים משפטיים {{proceedings_scope}}.

המיופה{{attorney_gender_suffix}} כוח רשאי{{attorney_gender_suffix}}:
- להגיש תביעות וכתבי הגנה בשמי
- להתייצב לדיונים
- לנהל משא ומתן לפשרה
- {{legal_powers}}

המיופה{{attorney_gender_suffix}} כוח {{settlement_authority}}.

המיופה{{attorney_gender_suffix}} כוח מתחייב{{attorney_gender_suffix}} {{legal_commitments}}.`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_gender_suffix', 'proceedings_scope', 'legal_powers', 'settlement_authority', 'legal_commitments'],
    aiPrompt: 'פרט את היקף הייצוג המשפטי, כלול סמכות לפשרה',
    usageInstructions: 'השתמש להענקת סמכות ייצוג בהליכים משפטיים',
    poaTypes: ['regular', 'enduring']
  },

  // סעיפי סגירה
  {
    id: 'indemnification',
    title: 'שיפוי המיופה כוח',
    category: 'closing',
    content: `שיפוי:

אני מתחייב{{principal_gender_suffix}} לשפות את {{attorney_name}} בגין כל נזק, הוצאה או תביעה שייגרמו ל{{attorney_pronoun}} {{indemnification_scope}}.

השיפוי לא יחול ב{{indemnification_exceptions}}.

{{additional_indemnification_terms}}`,
    variables: ['principal_gender_suffix', 'attorney_name', 'attorney_pronoun', 'indemnification_scope', 'indemnification_exceptions', 'additional_indemnification_terms'],
    aiPrompt: 'הגדר שיפוי הוגן, כלול חריגים למקרי רשלנות',
    usageInstructions: 'השתמש להגנה על המיופה כוח מתביעות',
    poaTypes: ['regular', 'enduring', 'medical']
  },

  {
    id: 'substitute-attorney',
    title: 'מינוי מיופה כוח חלופי',
    category: 'closing',
    content: `מיופה כוח חלופי:

במקרה ש{{attorney_name}} לא יוכל או לא יסכים לשמש כמיופה כוח, אני ממנה{{principal_gender_suffix}} במקומו את {{substitute_attorney_name}}, ת.ז. {{substitute_attorney_id}}.

המיופה{{substitute_attorney_gender_suffix}} החלופי{{substitute_attorney_gender_suffix}} יקבל{{substitute_attorney_gender_suffix}} את אותן סמכויות ומגבלות כמיופה הכוח הראשי.

{{substitution_conditions}}`,
    variables: ['principal_gender_suffix', 'attorney_name', 'substitute_attorney_name', 'substitute_attorney_gender_suffix', 'substitute_attorney_id', 'substitution_conditions'],
    aiPrompt: 'הגדר מיופה כוח חלופי, וודא רצף סמכויות',
    usageInstructions: 'השתמש למינוי מיופה כוח חלופי',
    poaTypes: ['regular', 'enduring', 'medical']
  }
];

/**
 * פונקציה לקבלת סעיפים לפי סוג ייפוי כוח
 */
export function getPOASectionsForType(poaType: string): POASectionTemplate[] {
  return poaSectionsWarehouse.filter(section => 
    section.poaTypes.includes(poaType as any)
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getPOASectionsByCategory(category: string): POASectionTemplate[] {
  return poaSectionsWarehouse.filter(section => section.category === category);
}

