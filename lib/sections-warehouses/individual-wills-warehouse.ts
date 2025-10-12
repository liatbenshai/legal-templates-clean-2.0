/**
 * מחסן סעיפים לצוואות יחיד
 * סעיפים ייחודיים לצוואת יחיד בלבד
 */

export interface IndividualWillSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'property' | 'heirs' | 'guardianship' | 'executors' | 'special-bequests' | 'conditions' | 'funeral' | 'digital' | 'business' | 'debts' | 'closing' | 'property-division';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
}

export const individualWillsSectionsWarehouse: IndividualWillSectionTemplate[] = [
  // ירושת נכסים מיוחדים
  {
    id: 'specific-property-bequest',
    title: 'הורשת נכס מסוים ליורש',
    category: 'special-bequests',
    content: `הורשת נכס מסוים:

אני מצווה בזאת להוריש את {{property_description}} הנמצא ב{{property_location}}, ל{{heir_name}}, ת.ז. {{heir_id}}, {{relationship}}.

נכס זה יועבר ליורש בבעלות מלאה וללא כל תנאי, {{additional_terms}}.

במידה והנכס האמור לא יהיה בבעלותי במועד פטירתי, הוראה זו תתבטל ולא תחול על כל נכס אחר.`,
    variables: ['property_description', 'property_location', 'heir_name', 'heir_id', 'relationship', 'additional_terms'],
    aiPrompt: 'התאם את ההורשה לסוג הנכס, וודא בהירות מלאה לגבי זיהוי הנכס והיורש',
    usageInstructions: 'השתמש כאשר רוצים להוריש נכס ספציפי ליורש מסוים',
  },

  {
    id: 'jewelry-heirloom-bequest',
    title: 'הורשת תכשיטים וחפצי ערך משפחתיים',
    category: 'special-bequests',
    content: `הורשת תכשיטים וחפצי ערך:

אני מצווה להוריש את {{jewelry_description}} ל{{heir_name}}, ת.ז. {{heir_id}}.

חפצים אלו נמסרו לי מ{{origin}} והינם {{sentimental_value}}.

התכשיטים והחפצים יימסרו ליורש {{delivery_timing}}.

{{special_instructions}}`,
    variables: ['jewelry_description', 'heir_name', 'heir_id', 'origin', 'sentimental_value', 'delivery_timing', 'special_instructions'],
    aiPrompt: 'הוסף ערך רגשי ומשפחתי להורשת התכשיטים, שמור על בהירות',
    usageInstructions: 'השתמש להורשת תכשיטים או חפצי ערך רגשי',
  },

  // חלוקת נכס ספציפי בין יורשים
  {
    id: 'property-division-multiple-heirs',
    title: 'חלוקת נכס ספציפי בין מספר יורשים',
    category: 'property-division',
    content: `חלוקת נכס בין יורשים:

אני מצווה בדבר חלוקת {{property_description}}, הנמצא ב{{property_location}}, בין היורשים כדלקמן:

1. {{heir1_name}}, ת.ז. {{heir1_id}} - {{heir1_percentage}}% מהנכס
2. {{heir2_name}}, ת.ז. {{heir2_id}} - {{heir2_percentage}}% מהנכס
{{#if heir3_name}}
3. {{heir3_name}}, ת.ז. {{heir3_id}} - {{heir3_percentage}}% מהנכס
{{/if}}
{{#if heir4_name}}
4. {{heir4_name}}, ת.ז. {{heir4_id}} - {{heir4_percentage}}% מהנכס
{{/if}}

{{division_instructions}}

במקרה של מכירת הנכס, התמורה תחולק בין היורשים באותם שיעורים.

{{usage_rights}}`,
    variables: ['property_description', 'property_location', 'heir1_name', 'heir1_id', 'heir1_percentage', 'heir2_name', 'heir2_id', 'heir2_percentage', 'heir3_name', 'heir3_id', 'heir3_percentage', 'heir4_name', 'heir4_id', 'heir4_percentage', 'division_instructions', 'usage_rights'],
    aiPrompt: 'וודא שסכום האחוזים הוא 100%, הסבר זכויות שימוש ומכירה',
    usageInstructions: 'השתמש כאשר רוצים לחלק נכס אחד בין מספר יורשים באחוזים שונים',
  },

  {
    id: 'business-division-multiple-heirs',
    title: 'חלוקת עסק/חברה בין יורשים',
    category: 'property-division',
    content: `חלוקת עסק בין יורשים:

אני מצווה בדבר חלוקת העסק/החברה {{business_name}}, ח.פ. {{business_id}}, בין היורשים כדלקמן:

**חלוקת בעלות:**

1. {{heir1_name}}, ת.ז. {{heir1_id}}
   - אחוז בעלות: {{heir1_ownership}}%
   - תפקיד: {{heir1_role}}
   - זכויות הצבעה: {{heir1_voting}}%
   - {{heir1_conditions}}

2. {{heir2_name}}, ת.ז. {{heir2_id}}
   - אחוז בעלות: {{heir2_ownership}}%
   - תפקיד: {{heir2_role}}
   - זכויות הצבעה: {{heir2_voting}}%
   - {{heir2_conditions}}

{{#if heir3_name}}
3. {{heir3_name}}, ת.ז. {{heir3_id}}
   - אחוז בעלות: {{heir3_ownership}}%
   - תפקיד: {{heir3_role}}
   - זכויות הצבעה: {{heir3_voting}}%
   - {{heir3_conditions}}
{{/if}}

**ניהול העסק:**
{{management_structure}}

**זכויות מכירה:**
{{sale_restrictions}}

**פתרון סכסוכים:**
במקרה של אי הסכמה בין היורשים בנושאים מהותיים, {{dispute_resolution}}.

**אופציית רכישה:**
{{buyout_option}}

אני ממליץ ליורשים להיוועץ ברואה חשבון ועורך דין מומחה בדיני חברות לפני קבלת החלטות.`,
    variables: [
      'business_name', 'business_id',
      'heir1_name', 'heir1_id', 'heir1_ownership', 'heir1_role', 'heir1_voting', 'heir1_conditions',
      'heir2_name', 'heir2_id', 'heir2_ownership', 'heir2_role', 'heir2_voting', 'heir2_conditions',
      'heir3_name', 'heir3_id', 'heir3_ownership', 'heir3_role', 'heir3_voting', 'heir3_conditions',
      'management_structure', 'sale_restrictions', 'dispute_resolution', 'buyout_option'
    ],
    aiPrompt: 'התאם להקשר עסקי מורכב, הפרד בין בעלות לניהול, כלול מנגנוני הגנה',
    usageInstructions: 'השתמש כאשר רוצים לחלק עסק או חברה בין יורשים עם אחוזים ותפקידים שונים',
  },

  {
    id: 'apartment-division-children',
    title: 'חלוקת דירה בין ילדים',
    category: 'property-division',
    content: `חלוקת דירת מגורים:

אני מצווה בדבר חלוקת הדירה ברחוב {{address}}, {{city}}, בין ילדיי כדלקמן:

**חלוקת זכויות:**

• {{heir1_name}}: {{heir1_percentage}}%
• {{heir2_name}}: {{heir2_percentage}}%
{{#if heir3_name}}
• {{heir3_name}}: {{heir3_percentage}}%
{{/if}}

**זכויות שימוש:**
{{usage_terms}}

**הוראות למגורים:**
{{#if residence_preference}}
במידה ו{{residence_preference}}, הוא/היא רשאים להמשיך לגור בדירה {{residence_conditions}}.
{{/if}}

**הוראות למכירה:**
{{sale_instructions}}

**הערכת שווי:**
במקרה של רצון למכירה או פדיון, השווי ייקבע על ידי {{appraisal_method}}.

**זכות סירוב ראשונה:**
{{right_of_first_refusal}}`,
    variables: [
      'address', 'city',
      'heir1_name', 'heir1_percentage',
      'heir2_name', 'heir2_percentage',
      'heir3_name', 'heir3_percentage',
      'usage_terms', 'residence_preference', 'residence_conditions',
      'sale_instructions', 'appraisal_method', 'right_of_first_refusal'
    ],
    aiPrompt: 'התייחס לנושא רגיש של דירת המשפחה, כלול פתרונות למגורים והוגנות',
    usageInstructions: 'השתמש כאשר רוצים לחלק דירת מגורים בין ילדים באחוזים שונים',
  },

  {
    id: 'investment-portfolio-division',
    title: 'חלוקת תיק השקעות בין יורשים',
    category: 'property-division',
    content: `חלוקת תיק השקעות:

אני מצווה בדבר חלוקת תיק ההשקעות שלי ב{{brokerage_name}}, חשבון מספר {{account_number}}, כדלקמן:

**חלוקה:**

1. {{heir1_name}} יקבל {{heir1_allocation}}
2. {{heir2_name}} יקבל {{heir2_allocation}}
{{#if heir3_name}}
3. {{heir3_name}} יקבל {{heir3_allocation}}
{{/if}}

**אופן החלוקה:**
{{division_method}}

**הוראות מיוחדות:**
{{special_instructions}}

**ניהול עד לחלוקה:**
עד למועד החלוקה בפועל, התיק ינוהל על ידי {{portfolio_manager}} {{management_instructions}}.

**מיסוי:**
כל יורש יהיה אחראי למיסים החלים על חלקו בהתאם לדין.`,
    variables: [
      'brokerage_name', 'account_number',
      'heir1_name', 'heir1_allocation',
      'heir2_name', 'heir2_allocation',
      'heir3_name', 'heir3_allocation',
      'division_method', 'special_instructions',
      'portfolio_manager', 'management_instructions'
    ],
    aiPrompt: 'התאם להקשר פיננסי, הסבר אפשרויות חלוקה שונות (באחוזים/בסכומים/נכסים ספציפיים)',
    usageInstructions: 'השתמש כאשר רוצים לחלק תיק השקעות בין יורשים',
  },

  // ירושה דיגיטלית
  {
    id: 'cryptocurrency-inheritance',
    title: 'ירושת מטבעות קריפטוגרפיים',
    category: 'digital',
    content: `ירושת נכסים דיגיטליים - קריפטו:

אני מצווה כי {{heir_name}}, ת.ז. {{heir_id}}, יירש את מלוא האחזקות שלי במטבעות קריפטוגרפיים.

המפתחות הפרטיים (Private Keys) נמצאים ב{{keys_location}}.

הארנקים הדיגיטליים (Wallets) שלי כוללים: {{wallets_list}}.

הוראות גישה מפורטות נמצאות ב{{instructions_location}}.

על היורש לפעול בזהירות מרבית ולהיוועץ במומחה בתחום לפני ביצוע פעולות.`,
    variables: ['heir_name', 'heir_id', 'keys_location', 'wallets_list', 'instructions_location'],
    aiPrompt: 'התאם להקשר טכנולוגי, הדגש חשיבות אבטחת המידע',
    usageInstructions: 'השתמש כאשר יש נכסים דיגיטליים בקריפטו',
  },

  {
    id: 'cryptocurrency-division',
    title: 'חלוקת קריפטו בין יורשים',
    category: 'property-division',
    content: `חלוקת נכסי קריפטו:

אני מצווה בדבר חלוקת אחזקות המטבעות הקריפטוגרפיים שלי כדלקמן:

**יורש 1: {{heir1_name}}, ת.ז. {{heir1_id}}**
- {{heir1_crypto_allocation}}
- ארנק/ים: {{heir1_wallets}}

**יורש 2: {{heir2_name}}, ת.ז. {{heir2_id}}**
- {{heir2_crypto_allocation}}
- ארנק/ים: {{heir2_wallets}}

{{#if heir3_name}}
**יורש 3: {{heir3_name}}, ת.ז. {{heir3_id}}**
- {{heir3_crypto_allocation}}
- ארנק/ים: {{heir3_wallets}}
{{/if}}

**מיקום מפתחות:**
{{keys_information}}

**הוראות העברה:**
{{transfer_instructions}}

**אבטחה:**
על כל יורש לשמור על המפתחות הפרטיים במקום מאובטח ולא לשתף אותם עם איש.

**ייעוץ מקצועי:**
אני ממליץ ליורשים להיוועץ במומחה קריפטו או בחברת Custodian לפני ביצוע העברות.`,
    variables: [
      'heir1_name', 'heir1_id', 'heir1_crypto_allocation', 'heir1_wallets',
      'heir2_name', 'heir2_id', 'heir2_crypto_allocation', 'heir2_wallets',
      'heir3_name', 'heir3_id', 'heir3_crypto_allocation', 'heir3_wallets',
      'keys_information', 'transfer_instructions'
    ],
    aiPrompt: 'התאם לטכנולוגיית קריפטו, הדגש אבטחה וזהירות, הסבר מושגים בסיסיים',
    usageInstructions: 'השתמש כאשר רוצים לחלק נכסי קריפטו בין מספר יורשים',
  },

  {
    id: 'digital-assets-inheritance',
    title: 'ירושת נכסים דיגיטליים כללית',
    category: 'digital',
    content: `ירושת נכסים דיגיטליים:

אני מצווה כי {{heir_name}}, ת.ז. {{heir_id}}, יקבל גישה לכל הנכסים הדיגיטליים שלי, לרבות:

1. חשבונות רשתות חברתיות: {{social_media_accounts}}
2. חשבונות דואר אלקטרוני: {{email_accounts}}
3. אחסון בענן: {{cloud_storage}}
4. תמונות ווידאו דיגיטליים: {{media_location}}
5. {{other_digital_assets}}

פרטי הגישה (שמות משתמש וסיסמאות) נמצאים ב{{credentials_location}}.

אני מאשר ליורש {{heir_actions}} את התכנים והחשבונות הללו.`,
    variables: ['heir_name', 'heir_id', 'social_media_accounts', 'email_accounts', 'cloud_storage', 'media_location', 'other_digital_assets', 'credentials_location', 'heir_actions'],
    aiPrompt: 'התאם לעידן הדיגיטלי, כלול התייחסות לפרטיות ולרצונות המצווה',
    usageInstructions: 'השתמש כאשר רוצים להסדיר עזבון דיגיטלי',
  },

  // ירושה עסקית
  {
    id: 'business-succession-single-heir',
    title: 'ירושת עסק משפחתי ליורש יחיד',
    category: 'business',
    content: `ירושת עסק:

אני מצווה בדבר ירושת העסק {{business_name}}, ח.פ. {{business_id}}, ל{{heir_name}}, ת.ז. {{heir_id}}, {{relationship}}.

היורש יקבל {{ownership_percentage}} מהעסק ויכהן כ{{heir_role}}.

{{management_instructions}}

{{transition_period}}

אני מייעץ ליורש להיוועץ ברואה חשבון ועורך דין לפני קבלת החלטות מהותיות בעסק.

{{additional_business_terms}}`,
    variables: ['business_name', 'business_id', 'heir_name', 'heir_id', 'relationship', 'ownership_percentage', 'heir_role', 'management_instructions', 'transition_period', 'additional_business_terms'],
    aiPrompt: 'התאם להקשר עסקי, הדגש צורך בייעוץ מקצועי ותקופת מעבר',
    usageInstructions: 'השתמש כאשר יש עסק משפחתי שעובר ליורש יחיד',
  },

  {
    id: 'stock-shares-inheritance',
    title: 'ירושת מניות ותיקי השקעות',
    category: 'property',
    content: `ירושת מניות ותיקי השקעות:

אני מצווה להוריש את תיק ההשקעות שלי ב{{brokerage_name}}, חשבון מספר {{account_number}}, ל{{heir_name}}, ת.ז. {{heir_id}}.

התיק כולל: {{portfolio_description}}.

היורש רשאי {{heir_authority}} את המניות והנכסים הפיננסיים.

במקרה של ירידת ערך משמעותית בתיק, {{value_drop_instructions}}.`,
    variables: ['brokerage_name', 'account_number', 'heir_name', 'heir_id', 'portfolio_description', 'heir_authority', 'value_drop_instructions'],
    aiPrompt: 'התאם להקשר פיננסי, כלול אזהרות וייעוץ מקצועי',
    usageInstructions: 'השתמש כאשר יש תיקי השקעות משמעותיים',
  },

  // אפוטרופסות על ילדים קטינים
  {
    id: 'guardianship-minor-children',
    title: 'אפוטרופסות על ילדים קטינים',
    category: 'guardianship',
    content: `מינוי אפוטרופוס לילדים קטינים:

אני ממנה בזאת את {{guardian_name}}, ת.ז. {{guardian_id}}, {{relationship}}, כאפוטרופוס על ילדיי הקטינים: {{children_names}}.

האפוטרופוס יהיה אחראי על {{guardianship_scope}}.

בחרתי באפוטרופוס זה מהטעמים הבאים: {{reasons}}.

אני מייעץ לאפוטרופוס {{parenting_guidance}}.

במקרה שהאפוטרופוס שמיניתי לא יוכל או לא יסכים לשמש בתפקיד, אני ממנה במקומו את {{backup_guardian_name}}, ת.ז. {{backup_guardian_id}}.`,
    variables: ['guardian_name', 'guardian_id', 'relationship', 'children_names', 'guardianship_scope', 'reasons', 'parenting_guidance', 'backup_guardian_name', 'backup_guardian_id'],
    aiPrompt: 'התאם בצורה רגישה לנושא גידול ילדים, הדגש את חשיבות החלטה זו',
    usageInstructions: 'השתמש כאשר יש ילדים קטינים וצריך למנות אפוטרופוס',
  },

  {
    id: 'special-needs-child',
    title: 'הוראות לילד עם צרכים מיוחדים',
    category: 'guardianship',
    content: `הוראות לילד עם צרכים מיוחדים:

{{child_name}}, ת.ז. {{child_id}}, זקוק לטיפול ותמיכה מיוחדים בשל {{special_needs}}.

אני מצווה כי {{trustee_name}} ישמש כנאמן על הכספים שיועברו ל{{child_name}}.

הכספים ישמשו ל{{funds_purpose}}.

אני ממליץ בחום להמשיך את הטיפולים הבאים: {{recommended_treatments}}.

{{child_name}} זכאי ל{{benefits}} וחשוב לשמור על זכאות זו.

{{additional_special_instructions}}`,
    variables: ['child_name', 'child_id', 'special_needs', 'trustee_name', 'funds_purpose', 'recommended_treatments', 'benefits', 'additional_special_instructions'],
    aiPrompt: 'התאם בצורה רגישה וקשובה, הדגש את חשיבות המשך הטיפול והתמיכה',
    usageInstructions: 'השתמש כאשר יש ילד או יורש עם צרכים מיוחדים',
  },

  // תנאים לירושה
  {
    id: 'conditional-inheritance-education',
    title: 'ירושה מותנית בהשכלה',
    category: 'conditions',
    content: `ירושה מותנית בהשכלה:

אני מצווה כי {{heir_name}}, ת.ז. {{heir_id}}, יקבל את חלקו בירושה רק לאחר {{education_condition}}.

עד להשלמת התנאי, הכספים יוחזקו בנאמנות על ידי {{trustee_name}}.

הנאמן רשאי לשחרר כספים ל{{heir_name}} למטרות {{allowed_uses}} בלבד.

לאחר עמידה בתנאי, הנאמן ישחרר את מלוא הכספים ל{{heir_name}}.

במקרה ש{{heir_name}} לא יעמוד בתנאי עד גיל {{age_limit}}, {{failure_consequence}}.`,
    variables: ['heir_name', 'heir_id', 'education_condition', 'trustee_name', 'allowed_uses', 'age_limit', 'failure_consequence'],
    aiPrompt: 'וודא שהתנאי ברור, אכיף אך הוגן, כלול מנגנון ליציאה מהתנאי',
    usageInstructions: 'השתמש כאשר רוצים להתנות ירושה בהשכלה או הישג אחר',
  },

  {
    id: 'conditional-inheritance-age',
    title: 'ירושה מותנית בהגיע לגיל',
    category: 'conditions',
    content: `ירושה מדורגת לפי גיל:

אני מצווה כי {{heir_name}}, ת.ז. {{heir_id}}, יקבל את חלקו בירושה באופן מדורג כדלקמן:

1. בהגיעו לגיל {{age1}}: {{percentage1}} מהירושה
2. בהגיעו לגיל {{age2}}: {{percentage2}} נוספים מהירושה  
3. בהגיעו לגיל {{age3}}: יתרת הירושה במלואה

עד להגיעו לגיל {{age3}}, הכספים יוחזקו בנאמנות על ידי {{trustee_name}}.

הנאמן רשאי לשחרר כספים נוספים ל{{heir_name}} {{early_release_conditions}}.`,
    variables: ['heir_name', 'heir_id', 'age1', 'percentage1', 'age2', 'percentage2', 'age3', 'trustee_name', 'early_release_conditions'],
    aiPrompt: 'התאם את דירוג הגילאים לנסיבות, הדגש שיקול דעת סביר לנאמן',
    usageInstructions: 'השתמש כאשר רוצים להעביר ירושה בהדרגה לפי גיל',
  },

  // חובות והלוואות
  {
    id: 'debt-forgiveness',
    title: 'מחילת חובות ליורשים',
    category: 'debts',
    content: `מחילת חובות:

אני מצהיר כי {{debtor_name}}, ת.ז. {{debtor_id}}, חייב לי סך של {{debt_amount}} ש"ח בגין {{debt_reason}}.

אני מוחל בזאת מחילה גמורה ומוחלטת על חוב זה, ו{{debtor_name}} לא יהיה חייב דבר לעזבוני או ליורשיי.

{{additional_forgiveness_terms}}`,
    variables: ['debtor_name', 'debtor_id', 'debt_amount', 'debt_reason', 'additional_forgiveness_terms'],
    aiPrompt: 'וודא בהירות המחילה והיקפה, התאם לנסיבות האישיות',
    usageInstructions: 'השתמש כאשר רוצים למחול על חוב של יורש או קרוב משפחה',
  },

  {
    id: 'debt-collection-instructions',
    title: 'הוראות לגביית חובות',
    category: 'debts',
    content: `הוראות לגביית חובות:

אני מצהיר כי {{debtor_name}}, ת.ז. {{debtor_id}}, חייב לי סך של {{debt_amount}} ש"ח בגין {{debt_reason}}.

קיימים המסמכים הבאים המוכיחים את החוב: {{proof_documents}}.

אני מורה למנהל העזבון לפעול לגביית חוב זה {{collection_method}}.

הסכומים שייגבו יתווספו לעזבון ויחולקו בין היורשים על פי הצוואה.`,
    variables: ['debtor_name', 'debtor_id', 'debt_amount', 'debt_reason', 'proof_documents', 'collection_method'],
    aiPrompt: 'התאם לרמת הדחיפות והחומרה, כלול פרטים מספיקים לזיהוי החוב',
    usageInstructions: 'השתמש כאשר יש חובות שצריך לגבות מהעזבון',
  },

  // הוראות קבורה
  {
    id: 'burial-preferences',
    title: 'העדפות קבורה ולוויה',
    category: 'funeral',
    content: `הוראות קבורה:

אני מבקש כי קבורתי תתקיים {{burial_location}}.

אני מבקש {{burial_type}} (קבורה בקרקע / קבורה בחלקת משפחה / קרמציה / תרומת איברים).

טקס ההלוויה: {{funeral_ceremony}}.

אני מבקש {{attendance_preference}}.

אני מבקש {{memorial_preference}}.

תקציב לקבורה ולאזכרה: {{budget}}.

{{additional_burial_instructions}}`,
    variables: ['burial_location', 'burial_type', 'funeral_ceremony', 'attendance_preference', 'memorial_preference', 'budget', 'additional_burial_instructions'],
    aiPrompt: 'התאם בצורה רגישה למסורת המשפחתית והרצונות האישיים',
    usageInstructions: 'השתמש כאשר יש העדפות ספציפיות לקבורה',
  },

  {
    id: 'organ-donation',
    title: 'תרומת איברים והנצחה',
    category: 'funeral',
    content: `תרומת איברים:

אני מצהיר כי {{organ_donation_decision}} (אני מעוניין / איני מעוניין) בתרומת איברים לאחר מותי.

{{organ_donation_details}}

אני מבקש כי משפחתי {{family_request}} את רצוני זה.

לצורך הנצחה, אני מבקש {{memorial_type}}.

{{additional_memorial_instructions}}`,
    variables: ['organ_donation_decision', 'organ_donation_details', 'family_request', 'memorial_type', 'additional_memorial_instructions'],
    aiPrompt: 'התאם בצורה רגישה, כבד את רצון המצווה והסבר את החשיבות',
    usageInstructions: 'השתמש כאשר רוצים להצהיר על תרומת איברים',
  },

  // סעיפי סגירה
  {
    id: 'executor-compensation',
    title: 'שכר למנהל העזבון',
    category: 'executors',
    content: `שכר מנהל העזבון:

אני מורה כי {{executor_name}}, שמיניתי כמנהל העזבון, יהיה זכאי ל{{compensation_terms}}.

שכר זה ישולם מנכסי העזבון {{payment_timing}}.

במקרה של עבודה מורכבת או ממושכת במיוחד, {{complex_work_compensation}}.`,
    variables: ['executor_name', 'compensation_terms', 'payment_timing', 'complex_work_compensation'],
    aiPrompt: 'התאם לעומס העבודה הצפוי, וודא הגינות',
    usageInstructions: 'השתמש כאשר רוצים לקבוע שכר למנהל עזבון',
  },

  {
    id: 'no-contest-clause',
    title: 'סעיף איסור ערעור על הצוואה',
    category: 'closing',
    content: `סעיף איסור ערעור:

אני מצווה כי כל יורש שיערער על צוואה זו או ינסה לבטלה, {{contest_consequence}}.

סעיף זה לא יחול במקרה של {{contest_exceptions}}.

מטרתי בסעיף זו היא {{contest_rationale}}.`,
    variables: ['contest_consequence', 'contest_exceptions', 'contest_rationale'],
    aiPrompt: 'נסח בצורה משפטית ברורה, הסבר את ההיגיון מאחורי הסעיף',
    usageInstructions: 'השתמש כאשר רוצים למנוע ערעורים על הצוואה',
  },

  {
    id: 'family-unity-request',
    title: 'בקשה לשמירה על אחדות משפחתית',
    category: 'closing',
    content: `בקשה אחרונה למשפחה:

לילדיי ויורשיי האהובים,

אני מבקש מכם מקרב לב {{family_unity_request}}.

זכרו תמיד כי {{family_values}}.

חשוב לי שתדעו ש{{personal_message}}.

אם יתעוררו חילוקי דעות, אני מבקש שת{{conflict_resolution}}.

{{final_wishes}}

באהבה,
{{testator_name}}`,
    variables: ['family_unity_request', 'family_values', 'personal_message', 'conflict_resolution', 'final_wishes', 'testator_name'],
    aiPrompt: 'כתוב בצורה אישית, חמה ומרגשת, שמור על כבוד וערכים משפחתיים',
    usageInstructions: 'השתמש לסיום הצוואה במסר אישי למשפחה',
  }
];

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getIndividualWillSectionsByCategory(category: string): IndividualWillSectionTemplate[] {
  return individualWillsSectionsWarehouse.filter(section => section.category === category);
}

/**
 * פונקציה לחיפוש סעיפים
 */
export function searchIndividualWillSections(query: string): IndividualWillSectionTemplate[] {
  const lowerQuery = query.toLowerCase();
  return individualWillsSectionsWarehouse.filter(
    section =>
      section.title.toLowerCase().includes(lowerQuery) ||
      section.content.toLowerCase().includes(lowerQuery) ||
      section.usageInstructions.toLowerCase().includes(lowerQuery)
  );
}

