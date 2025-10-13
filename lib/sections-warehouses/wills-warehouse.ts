/**
 * מחסן סעיפים לצוואות - יחיד והדדי
 */

export interface WillSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'property' | 'heirs' | 'guardianship' | 'executors' | 'special-bequests' | 'conditions' | 'funeral' | 'digital' | 'business' | 'debts' | 'family' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  willTypes: ('individual' | 'mutual')[];
}

export const willsSectionsWarehouse: WillSectionTemplate[] = [
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
  },

  // ירושה עסקית
  {
    id: 'business-succession',
    title: 'ירושת עסק משפחתי',
    category: 'business',
    content: `ירושת עסק:

אני מצווה בדבר ירושת העסק {{business_name}}, ח.ת. {{business_id}}, כדלקמן:

1. {{heir1_name}}, ת.ז. {{heir1_id}}, יקבל {{heir1_share}} מהעסק ותפקיד {{heir1_role}}.

2. {{heir2_name}}, ת.ז. {{heir2_id}}, יקבל {{heir2_share}} מהעסק ותפקיד {{heir2_role}}.

3. ניהול העסק יתבצע על ידי {{management_arrangement}}.

4. במקרה של אי-הסכמה בין היורשים, {{dispute_resolution}}.

5. {{additional_business_terms}}

אני מייעץ ליורשים להיוועץ ברואה חשבון ועורך דין לפני קבלת החלטות מהוותיות בעסק.`,
    variables: ['business_name', 'business_id', 'heir1_name', 'heir1_id', 'heir1_share', 'heir1_role', 'heir2_name', 'heir2_id', 'heir2_share', 'heir2_role', 'management_arrangement', 'dispute_resolution', 'additional_business_terms'],
    aiPrompt: 'התאם להקשר עסקי, הדגש צורך בייעוץ מקצועי והסדרת ממשל תקין',
    usageInstructions: 'השתמש כאשר יש עסק משפחתי להורשה',
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
  },

  // סעיפים לצוואות הדדיות
  {
    id: 'mutual-will-survivor-rights',
    title: 'זכויות בן הזוג השורד בצוואה הדדית',
    category: 'family',
    content: `זכויות בן הזוג השורד:

אנו מצווים כי בן הזוג השורד מאיתנו יקבל {{survivor_rights}}.

בן הזוג השורד רשאי {{survivor_authority}} ללא צורך באישור היורשים.

הדירה ב{{residence_address}} תישאר בידי בן הזוג השורד {{residence_terms}}.

בן הזוג השורד רשאי {{living_rights}}.

רק לאחר פטירת שנינו, {{after_both_deceased}}.`,
    variables: ['survivor_rights', 'survivor_authority', 'residence_address', 'residence_terms', 'living_rights', 'after_both_deceased'],
    aiPrompt: 'התאם לצוואות הדדיות, הדגש הגנה על בן הזוג השורד',
    usageInstructions: 'השתמש בצוואות הדדיות להבטחת זכויות בן הזוג',
    willTypes: ['mutual']
  },

  {
    id: 'mutual-will-children-equal',
    title: 'חלוקה שווה בין הילדים לאחר שני ההורים',
    category: 'heirs',
    content: `חלוקה בין הילדים:

לאחר פטירת שנינו, כל רכושנו יחולק בין ילדינו באופן שווה:

{{children_list}}

כל ילד יקבל חלק שווה מהעזבון.

במקרה שמי מהילדים לא יהיה בחיים במועד פטירת האחרון מאיתנו, חלקו יועבר ל{{predeceased_child_heirs}}.

{{additional_division_terms}}`,
    variables: ['children_list', 'predeceased_child_heirs', 'additional_division_terms'],
    aiPrompt: 'התאם לצוואות הדדיות, וודא הגינות וברור בחלוקה',
    usageInstructions: 'השתמש בצוואות הדדיות עם חלוקה שווה בין ילדים',
    willTypes: ['mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
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
    willTypes: ['individual', 'mutual']
  }
];

/**
 * פונקציה לקבלת סעיפים לפי סוג צוואה
 */
export function getWillSectionsForType(willType: 'individual' | 'mutual'): WillSectionTemplate[] {
  return willsSectionsWarehouse.filter(section => 
    section.willTypes.includes(willType)
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getWillSectionsByCategory(category: string): WillSectionTemplate[] {
  return willsSectionsWarehouse.filter(section => section.category === category);
}

