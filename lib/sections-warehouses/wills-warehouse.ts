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
  isRequired?: boolean;
  tags?: string[];
}

export const willsSectionsWarehouse: WillSectionTemplate[] = [
  // ירושת נכסים מיוחדים
  {
    id: 'specific-property-bequest',
    title: 'הורשת נכס מסוים ליורש',
    category: 'special-bequests',
    content: `הורשת נכס מסוים:

אני מצווה{{testator_gender_suffix}} בזאת להוריש את {{property_description}} הנמצא ב{{property_location}}, ל{{heir_name}}, ת.ז. {{heir_id}}, {{relationship}}.

נכס זה יועבר ליורש{{heir_gender_suffix}} בבעלות מלאה וללא כל תנאי, {{additional_terms}}.

במידה והנכס האמור לא יהיה בבעלותי במועד פטירתי, הוראה זו תתבטל ולא תחול על כל נכס אחר.`,
    variables: ['property_description', 'property_location', 'heir_name', 'heir_id', 'relationship', 'additional_terms', 'testator_gender_suffix', 'heir_gender_suffix'],
    aiPrompt: 'התאם את ההורשה לסוג הנכס, וודא בהירות מלאה לגבי זיהוי הנכס והיורש',
    usageInstructions: 'השתמש כאשר רוצים להוריש נכס ספציפי ליורש מסוים',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'jewelry-heirloom-bequest',
    title: 'הורשת תכשיטים וחפצי ערך משפחתיים',
    category: 'special-bequests',
    content: `הורשת תכשיטים וחפצי ערך:

אני מצווה{{testator_gender_suffix}} להוריש את {{jewelry_description}} ל{{heir_name}}, ת.ז. {{heir_id}}.

חפצים אלו נמסרו לי מ{{origin}} והינם {{sentimental_value}}.

התכשיטים והחפצים יימסרו ליורש{{heir_gender_suffix}} {{delivery_timing}}.

{{special_instructions}}`,
    variables: ['jewelry_description', 'heir_name', 'heir_id', 'origin', 'sentimental_value', 'delivery_timing', 'special_instructions', 'testator_gender_suffix', 'heir_gender_suffix'],
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

אני מצווה{{testator_gender_suffix}} כי {{heir_name}}, ת.ז. {{heir_id}}, יירש{{heir_gender_suffix}} את מלוא האחזקות שלי במטבעות קריפטוגרפיים.

המפתחות הפרטיים (Private Keys) נמצאים ב{{keys_location}}.

הארנקים הדיגיטליים (Wallets) שלי כוללים: {{wallets_list}}.

הוראות גישה מפורטות נמצאות ב{{instructions_location}}.

על היורש{{heir_gender_suffix}} לפעול בזהירות מרבית ולהיוועץ במומחה בתחום לפני ביצוע פעולות.`,
    variables: ['heir_name', 'heir_id', 'keys_location', 'wallets_list', 'instructions_location', 'testator_gender_suffix', 'heir_gender_suffix'],
    aiPrompt: 'התאם להקשר טכנולוגי, הדגש חשיבות אבטחת המידע',
    usageInstructions: 'השתמש כאשר יש נכסים דיגיטליים בקריפטו',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'digital-assets-inheritance',
    title: 'ירושת נכסים דיגיטליים כללית',
    category: 'digital',
    content: `ירושת נכסים דיגיטליים:

אני מצווה{{testator_gender_suffix}} כי {{heir_name}}, ת.ז. {{heir_id}}, יקבל{{heir_gender_suffix}} גישה לכל הנכסים הדיגיטליים שלי, לרבות:

1. חשבונות רשתות חברתיות: {{social_media_accounts}}
2. חשבונות דואר אלקטרוני: {{email_accounts}}
3. אחסון בענן: {{cloud_storage}}
4. תמונות ווידאו דיגיטליים: {{media_location}}
5. {{other_digital_assets}}

פרטי הגישה (שמות משתמש וסיסמאות) נמצאים ב{{credentials_location}}.

אני מאשר ליורש{{heir_gender_suffix}} {{heir_actions}} את התכנים והחשבונות הללו.`,
    variables: ['heir_name', 'heir_id', 'social_media_accounts', 'email_accounts', 'cloud_storage', 'media_location', 'other_digital_assets', 'credentials_location', 'heir_actions', 'testator_gender_suffix', 'heir_gender_suffix'],
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

1. {{heir1_name}}, ת.ז. {{heir1_id}}, יקבל{{heir1_gender_suffix}} {{heir1_share}} מהעסק ותפקיד {{heir1_role}}.

2. {{heir2_name}}, ת.ז. {{heir2_id}}, יקבל{{heir2_gender_suffix}} {{heir2_share}} מהעסק ותפקיד {{heir2_role}}.

3. ניהול העסק יתבצע על ידי {{management_arrangement}}.

4. במקרה של אי-הסכמה בין היורשים, {{dispute_resolution}}.

5. {{additional_business_terms}}

אני מייעץ ליורשים להיוועץ ברואה חשבון ועורך דין לפני קבלת החלטות מהוותיות בעסק.`,
    variables: ['business_name', 'business_id', 'heir1_name', 'heir1_id', 'heir1_gender_suffix', 'heir1_share', 'heir1_role', 'heir2_name', 'heir2_id', 'heir2_gender_suffix', 'heir2_share', 'heir2_role', 'management_arrangement', 'dispute_resolution', 'additional_business_terms'],
    aiPrompt: 'התאם להקשר עסקי, הדגש צורך בייעוץ מקצועי והסדרת ממשל תקין',
    usageInstructions: 'השתמש כאשר יש עסק משפחתי להורשה',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'stock-shares-inheritance',
    title: 'ירושת מניות ותיקי השקעות',
    category: 'property',
    content: `ירושת מניות ותיקי השקעות:

אני מצווה{{testator_gender_suffix}} להוריש את תיק ההשקעות שלי ב{{brokerage_name}}, חשבון מספר {{account_number}}, ל{{heir_name}}, ת.ז. {{heir_id}}.

התיק כולל: {{portfolio_description}}.

היורש{{heir_gender_suffix}} רשאי{{heir_gender_suffix}} {{heir_authority}} את המניות והנכסים הפיננסיים.

במקרה של ירידת ערך משמעותית בתיק, {{value_drop_instructions}}.`,
    variables: ['brokerage_name', 'account_number', 'heir_name', 'heir_id', 'portfolio_description', 'heir_authority', 'value_drop_instructions', 'testator_gender_suffix', 'heir_gender_suffix'],
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

אני מצווה{{testator_gender_suffix}} כי {{heir_name}}, ת.ז. {{heir_id}}, יקבל{{heir_gender_suffix}} את חלקו בירושה רק לאחר {{education_condition}}.

עד להשלמת התנאי, הכספים יוחזקו בנאמנות על ידי {{trustee_name}}.

הנאמן רשאי לשחרר כספים ל{{heir_name}} למטרות {{allowed_uses}} בלבד.

לאחר עמידה בתנאי, הנאמן ישחרר את מלוא הכספים ל{{heir_name}}.

במקרה ש{{heir_name}} לא יעמוד{{heir_gender_suffix}} בתנאי עד גיל {{age_limit}}, {{failure_consequence}}.`,
    variables: ['heir_name', 'heir_id', 'education_condition', 'trustee_name', 'allowed_uses', 'age_limit', 'failure_consequence', 'testator_gender_suffix', 'heir_gender_suffix'],
    aiPrompt: 'וודא שהתנאי ברור, אכיף אך הוגן, כלול מנגנון ליציאה מהתנאי',
    usageInstructions: 'השתמש כאשר רוצים להתנות ירושה בהשכלה או הישג אחר',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'conditional-inheritance-age',
    title: 'ירושה מותנית בהגיע לגיל',
    category: 'conditions',
    content: `ירושה מדורגת לפי גיל:

אני מצווה{{testator_gender_suffix}} כי {{heir_name}}, ת.ז. {{heir_id}}, יקבל{{heir_gender_suffix}} את חלקו בירושה באופן מדורג כדלקמן:

1. בהגיעו{{heir_gender_suffix}} לגיל {{age1}}: {{percentage1}} מהירושה
2. בהגיעו{{heir_gender_suffix}} לגיל {{age2}}: {{percentage2}} נוספים מהירושה  
3. בהגיעו{{heir_gender_suffix}} לגיל {{age3}}: יתרת הירושה במלואה

עד להגיעו{{heir_gender_suffix}} לגיל {{age3}}, הכספים יוחזקו בנאמנות על ידי {{trustee_name}}.

הנאמן רשאי לשחרר כספים נוספים ל{{heir_name}} {{early_release_conditions}}.`,
    variables: ['heir_name', 'heir_id', 'age1', 'percentage1', 'age2', 'percentage2', 'age3', 'trustee_name', 'early_release_conditions', 'testator_gender_suffix', 'heir_gender_suffix'],
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
  },

  // === סעיפים חדשים מהמחסן המשודרג ===
  
  // ביטול צוואות - גרסאות מהצוואות האמיתיות
  {
    id: 'B2-V5-revocation-full',
    title: 'ביטול צוואות קודמות (מלא ומפורט)',
    category: 'debts',
    content: `אני מבטל/ת בזאת ביטול גמור, מוחלט ושלם כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוני שייעשה בעיזבוני לאחר מותי.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי המדויק',
    usageInstructions: 'שימוש חובה בכל צוואה - ביטול צוואות קודמות',
    willTypes: ['individual', 'mutual']
  },
  
  {
    id: 'E2-V2-gift-prohibition',
    title: 'איסור העברה במתנה (מלא ומפורט)',
    category: 'conditions',
    content: `מוסכם ומוצהר בזאת כי בן/בת הזוג אשר יאריך/תאריך ימים לאחר פטירת הראשון מביננו (להלן: "בן הזוג הנותר"), יהיה מנוע ומושתק מלהעביר ללא תמורה, בין במתנה ובין בכל דרך אחרת, את זכויותיו/זכויותיה, בין במלואן ובין בחלקן, בנכסי המקרקעין הבאים:

א. דירת המגורים הנוכחית המשותפת;
ב. כל דירה אחרת שתירכש בעתיד בנוסף לדירת המגורים המשותפת;
ג. כל דירה שתחליף את דירת המגורים המשותפת;
ד. כל זכות אחרת במקרקעין שתתקבל בעתיד בירושה או במתנה.

איסור ההעברה ללא תמורה כאמור יחול על העברה לכל אדם, לרבות אך לא רק:
א. קרובי משפחה מדרגה ראשונה, שנייה או כל דרגה אחרת;
ב. ידוע/ה בציבור של בן הזוג הנותר;
ג. בן/בת זוג עתידי/ת של בן הזוג הנותר;
ד. תאגיד בשליטת מי מהנ"ל;
ה. כל אדם או תאגיד אחר.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי המדויק - סעיף הגנה קריטי',
    usageInstructions: 'שימוש בצוואה הדדית להגנה על היורשים',
    willTypes: ['mutual']
  },

  {
    id: 'E8-prenup-requirement',
    title: 'דרישת הסכם ממון בקשר חדש',
    category: 'conditions',
    content: `במקרה שבן/בת הזוג הנותר/ת בחיים יקיים/תקיים קשר זוגי חדש, מוצהר ומוסכם בזאת כדלקמן:

א. בן/בת הזוג הנותר/ת מתחייב/ת לערוך הסכם ממון או הסכם לחיים משותפים עם בן/בת הזוג החדש/ה טרם תחילת החיים המשותפים;

ב. ההסכם יכלול הפרדה רכושית מוחלטת בין הצדדים;

ג. ההסכם יאושר כדין בפני נוטריון או בית משפט לענייני משפחה.

הסכם הממון או הסכם החיים המשותפים שייחתם יכלול הפרדה רכושית מלאה ומוחלטת. במסגרת ההסכם ייקבע במפורש כי כל הרכוש הקיים של בן/בת הזוג הנותר/ת, לרבות דירת המגורים, חסכונות, השקעות, זכויות פנסיוניות וכל נכס אחר, יישאר בבעלותו/ה הבלעדית.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי - סעיף הגנה חשוב',
    usageInstructions: 'הגנה על היורשים במקרה של קשר חדש',
    willTypes: ['mutual']
  },

  {
    id: 'E9-auto-cancellation',
    title: 'ביטול צוואה במקרה אי עמידה בהסכם ממון',
    category: 'conditions',
    content: `במידה ובן/בת הזוג הנותר/ת בחיים לא יערוך/תערוך הסכם ממון או הסכם לחיים משותפים כנדרש עם בן/בת הזוג החדש/ה, או שיערוך/תערוך הסכם שאינו כולל הפרדה רכושית מוחלטת כמפורט לעיל, אזי צוואה הדדית זו תתבטל באופן אוטומטי. במקרה כזה, מלוא חלקו/ה של בן/בת הזוג המנוח/ה, המהווה מחצית (50%) מכלל נכסי העיזבון, יועבר במלואו לקופת העיזבון.

חלקו/ה של המנוח/ה בעיזבון יחולק בחלקים שווים בין ילדי המנוח/ה.

בן/בת הזוג הנותר/ת מתחייב/ת בזאת לשתף פעולה באופן מלא עם מנהל העיזבון שימונה.

להסרת ספק, חלקו/ה של בן/בת הזוג הנותר/ת בחיים (50%) בנכסים המשותפים יישאר בבעלותו/ה המלאה.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי - סעיף עונשין חשוב',
    usageInstructions: 'משלים את סעיף E8 - ביטול אוטומטי אם לא עומדים בתנאים',
    willTypes: ['mutual']
  },

  {
    id: 'F5-V3-guardianship',
    title: 'מינוי אפוטרופוס לקטינים (מפורט)',
    category: 'guardianship',
    content: `במקרה ואני ו{{spouse_name}} נלך לעולמנו, וילדינו הקטינים {{minor_children}} עדיין לא יגיעו לגיל 18, אני ממנה/ים את {{guardian_name}}, ת.ז. {{guardian_id}}, תושב/ת {{guardian_address}}, כאפוטרופוס/ת על ילדיי הקטינים.

במקרה ו{{guardian_name}} לא יוכל/תוכל לשמש כאפוטרופוס/ת מכל סיבה שהיא, אני ממנה/ים את {{alternate_guardian}} כאפוטרופוס/ת חלופי/ת.`,
    variables: ['spouse_name', 'minor_children', 'guardian_name', 'guardian_id', 'guardian_address', 'alternate_guardian'],
    aiPrompt: 'מלא את הפרטים בזהירות, וודא שמות ברורים',
    usageInstructions: 'שימוש כאשר יש ילדים קטינים',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'F9-digital-assets',
    title: 'נכסים דיגיטליים',
    category: 'digital',
    content: `בנוגע לנכסים הדיגיטליים שלי, לרבות:

א. חשבונות רשתות חברתיות (פייסבוק, אינסטגרם, לינקדאין);
ב. תיקיות ענן (Google Drive, Dropbox, iCloud);
ג. ארנקים דיגיטליים וקריפטו;
ד. אתרים ודומיינים;
ה. זכויות יוצרים דיגיטליות.

אני מצווה/ה ל{{digital_heir}} את כל הגישה והזכויות לנכסים הדיגיטליים שלי. פרטי הגישה מצויים ב{{password_manager}} או במעטפה חתומה אצל {{password_location}}.`,
    variables: ['digital_heir', 'password_manager', 'password_location'],
    aiPrompt: 'התאם לעידן הדיגיטלי, הדגש חשיבות אבטחת מידע',
    usageInstructions: 'שימוש כאשר יש נכסים דיגיטליים',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'F10-burial-instructions',
    title: 'הוראות קבורה ולוויה',
    category: 'funeral',
    content: `בנוגע לסידורי הקבורה שלי, אני מבקש/ת:

א. להיקבר ב{{cemetery_location}};
ב. טקס הלוויה {{ceremony_type}};
ג. {{donation_organs}} לתרומת איברים;
ד. הקמת מצבה פשוטה עם הכיתוב: {{gravestone_text}}.

אני מבקש/ת כי הלוויתי תהיה צנועה ופשוטה, ללא הוצאות מיותרות.`,
    variables: ['cemetery_location', 'ceremony_type', 'donation_organs', 'gravestone_text'],
    aiPrompt: 'מלא ברגישות, שמור על כבוד המת',
    usageInstructions: 'שימוש כאשר רוצים לפרט הוראות קבורה',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'E12-V1-pension-beneficiaries',
    title: 'קופות פנסיה וביטוח - למוטבים רשומים',
    category: 'property',
    content: `כל זכויות החיסכון והביטוח המצויות בקופות הגמל, קרנות הפנסיה, קופות התגמולים, קרנות ההשתלמות, תוכניות החיסכון, פוליסות ביטוח החיים וכל מוצר פיננסי אחר (להלן: "הקופות") ישולמו למוטבים הרשומים בקופות במועד הפטירה, וזאת בהתאם לרישום בפועל בקופות במועד הפטירה.

עם זאת, ככל שבמועד הפטירה לא יהיו רשומים מוטבים בקופה כלשהי, או שהמוטבים הרשומים נפטרו לפני המוריש ולא עודכנו מוטבים חלופיים, או שמסיבה כלשהי לא ניתן יהיה לשלם את הכספים למוטבים הרשומים, אזי כספי אותה קופה ייחשבו כחלק מהעיזבון ויחולקו בהתאם להוראות צוואה זו.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי המדויק',
    usageInstructions: 'סעיף חשוב לקופות גמל ופנסיה',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'no-contest-clause',
    title: 'סעיף אי התנגדות (No Contest Clause)',
    category: 'conditions',
    content: `כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ולא יקבל דבר מעזבוני. יורש שיפר את תנאי הסילוקין הנ"ל יקבל סכום סימלי של שקל אחד (₪1) בלבד.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי - סעיף עונשין',
    usageInstructions: 'הגנה מפני התנגדות לצוואה',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'E1-V1-residence-rights',
    title: 'זכות מגורים לבן זוג נותר',
    category: 'conditions',
    content: `למען הסר ספק, ומבלי לגרוע מהאמור לעיל:

א. לזה מאיתנו שיאריך ימים יותר משנינו, הזכות המלאה והבלעדית להתגורר בדירת המגורים כל ימי חייו ללא התערבותו של איש.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי',
    usageInstructions: 'הגנה על בן הזוג הנותר',
    willTypes: ['mutual']
  },

  {
    id: 'E10-V1-mortgage-prohibition',
    title: 'איסור שעבוד נכסים',
    category: 'conditions',
    content: `בן/בת הזוג הנותר/ת בחיים לא יוכל/תוכל לשעבד את דירת המגורים המשותפת או כל נכס מקרקעין אחר שהתקבל מהעיזבון, בלי הסכמה בכתב של כל היורשים.`,
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי',
    usageInstructions: 'הגנה מפני שעבוד הנכסים',
    willTypes: ['mutual']
  },

  {
    id: 'F7-V1-staged-distribution',
    title: 'חלוקה מדורגת לפי גיל',
    category: 'heirs',
    content: `חלקו של כל אחד מילדיי יועבר אליו בשלושה שלבים:

א. בגיל 21 - שליש (⅓) מחלקו;
ב. בגיל 25 - שליש נוסף (⅓) מחלקו;
ג. בגיל 30 - היתרה (⅓) מחלקו.

עד להגיעם לגילאים הנ"ל, הכספים ינוהלו על ידי {{trustee_name}} ויושקעו בהשקעות זהירות ומניבות.`,
    variables: ['trustee_name'],
    aiPrompt: 'מלא את שם הנאמן',
    usageInstructions: 'שימוש כאשר רוצים לתת בהדרגה לפי גיל',
    willTypes: ['individual', 'mutual']
  },

  {
    id: 'F8-business-instructions',
    title: 'הוראות לעסק משפחתי',
    category: 'business',
    content: `בנוגע לעסק המשפחתי שלי {{business_name}}, אני מצווה{{testator_gender_suffix}} כדלקמן:

א. העסק יעבור בשליטה משותפת ל{{children_in_business}};
ב. המשך ניהול העסק יהיה על ידי {{manager_name}};
ג. במקרה של מחלוקת או רצון של אחד השותפים למכור את חלקו, תינתן זכות סירוב ראשונה לשותפים האחרים.

נוהל הערכת השווי והמכירה יעשה על ידי מעריך שווי חיצוני מוסכם על כל השותפים.`,
    variables: ['business_name', 'testator_gender_suffix', 'children_in_business', 'manager_name'],
    aiPrompt: 'מלא פרטי העסק והילדים המעורבים',
    usageInstructions: 'שימוש כאשר יש עסק משפחתי',
    willTypes: ['individual', 'mutual']
  },

  // ===== סעיפים חדשים מהמחסן המשודרג =====
  
  // סעיפים מקדמים - ביטול צוואות קודמות
  {
    id: 'B2-V1-revocation-standard',
    title: 'ביטול צוואות קודמות (סטנדרטי)',
    category: 'debts',
    content: 'אני מבטל/ת בזאת ביטול גמור כל צוואה אחרת שאולי עשיתי לפני כן.',
    variables: [],
    aiPrompt: 'שמור על הנוסח הפשוט והבהיר',
    usageInstructions: 'שימוש חובה בכל צוואה - ביטול צוואות קודמות',
    willTypes: ['individual', 'mutual'],
    isRequired: true,
    tags: ['ביטול', 'צוואות קודמות', 'בסיסי']
  },
  {
    id: 'B2-V2-revocation-detailed',
    title: 'ביטול צוואות (מפורט)',
    category: 'debts',
    content: 'אני מבטל/ת בזאת ביטול גמור את כל הצוואות וההוראות והכתבים, בכתב או בעל פה שנתתי לפני כן, וצוואה זו היא צוואתי האחרונה.',
    variables: [],
    aiPrompt: 'שמור על הנוסח המפורט והבהיר',
    usageInstructions: 'שימוש חובה בכל צוואה - ביטול צוואות קודמות',
    willTypes: ['individual', 'mutual'],
    isRequired: true,
    tags: ['ביטול', 'צוואות קודמות', 'מפורט']
  },
  {
    id: 'B2-V5-revocation-full',
    title: 'ביטול צוואות קודמות (מלא ומפורט)',
    category: 'debts',
    content: 'אני מבטל/ת בזאת ביטול גמור, מוחלט ושלם כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוני שייעשה בעיזבוני לאחר מותי.',
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי המדויק',
    usageInstructions: 'שימוש חובה בכל צוואה - ביטול צוואות קודמות',
    willTypes: ['individual', 'mutual'],
    isRequired: true,
    tags: ['ביטול', 'צוואות קודמות', 'מלא', 'משפטי']
  },

  // סעיפים מיוחדים - איסור מתנות
  {
    id: 'F1-V1-gift-prohibition',
    title: 'איסור מתנות ללא תמורה',
    category: 'conditions',
    content: 'אני מודיע/ת בזאת כי לא נתתי ולא אתן כל מתנה או העברה אחרת של נכסיי ללא תמורה מלאה, למעט מתנות עתקיות או מתנות לצרכים רפואיים או הומניטריים דחופים, וכן למעט מתנות לזולת בהתאם למסורת ולמנהג המקובל באירועים משפחתיים וחגיגיים.',
    variables: [],
    aiPrompt: 'התאם למצב המשפחתי והכלכלי של המצווה',
    usageInstructions: 'מומלץ למצווה עם נכסים רבים או משפחה מורכבת',
    willTypes: ['individual'],
    isRequired: false,
    tags: ['מתנות', 'הגנה', 'נכסים']
  },

  // סעיפים משפחתיים - הסכמי קדם נישואין
  {
    id: 'F2-V1-prenup-requirement',
    title: 'דרישת הסכם קדם נישואין',
    category: 'family',
    content: 'אני מצווה כי כל יורש שלי, טרם נישואיו, יערוך הסכם קדם נישואין עם בן/בת זוגו, אשר יקבע כי כל רכוש שיהיה לו/לה טרם הנישואין ורכוש שירש או יקבל במתנה במהלך הנישואין, יישאר בבעלותו הבלעדית ויעבור ליורשיו בלבד, ולא ייחשב כרכוש משותף.',
    variables: [],
    aiPrompt: 'התאם למצב המשפחתי והתרבותי של המשפחה',
    usageInstructions: 'מומלץ למשפחות עם נכסים רבים או בעלי מסורת משפחתית',
    willTypes: ['individual'],
    isRequired: false,
    tags: ['נישואין', 'הגנה', 'משפחה']
  },

  // סעיפי ביטול אוטומטי
  {
    id: 'F3-V1-auto-cancellation',
    title: 'ביטול אוטומטי במקרה של נישואין',
    category: 'conditions',
    content: 'אני מצווה כי צוואה זו תתבטל באופן אוטומטי אם אתחתן/אתחתן בעתיד, וכל הרכוש יעבור לפי חוק הירושה, אלא אם כן אערוך צוואה חדשה לאחר הנישואין.',
    variables: [],
    aiPrompt: 'התאם למצב המשפחתי הנוכחי של המצווה',
    usageInstructions: 'מומלץ למצווה רווק/ה או גרוש/ה',
    willTypes: ['individual'],
    isRequired: false,
    tags: ['נישואין', 'ביטול', 'אוטומטי']
  },

  // סעיפי אפוטרופסות
  {
    id: 'F5-V3-guardianship',
    title: 'מינוי אפוטרופוס לילדים',
    category: 'guardianship',
    content: 'אני ממנה את {{guardian_name}}, ת.ז. {{guardian_id}}, להיות האפוטרופוס של ילדיי הקטינים במקרה של פטירתי. האפוטרופוס יטפל בכל צרכיהם החומריים, החינוכיים והרגשיים, ויקבל את כל ההחלטות הדרושות לטובתם.',
    variables: ['guardian_name', 'guardian_id'],
    aiPrompt: 'התאם למצב המשפחתי ולאפוטרופוס הנבחר',
    usageInstructions: 'חובה למצווה עם ילדים קטינים',
    willTypes: ['individual'],
    isRequired: false,
    tags: ['אפוטרופסות', 'ילדים', 'משפחה']
  },

  // סעיפי נכסים דיגיטליים
  {
    id: 'E9-V1-digital-assets',
    title: 'נכסים דיגיטליים וחשבונות אונליין',
    category: 'digital',
    content: 'אני מצווה{{testator_gender_suffix}} כי כל הנכסים הדיגיטליים שלי, כולל חשבונות בנק אונליין, חשבונות רשתות חברתיות, קבצים דיגיטליים, תמונות וסרטונים, יעברו לידי {{heir_name}}, ת.ז. {{heir_id}}, אשר יקבל{{heir_gender_suffix}} את כל הסיסמאות וההרשאות הדרושות.',
    variables: ['heir_name', 'heir_id', 'testator_gender_suffix', 'heir_gender_suffix'],
    aiPrompt: 'התאם לסוג הנכסים הדיגיטליים ולמיומנות היורש',
    usageInstructions: 'מומלץ לכל מצווה עם נוכחות דיגיטלית',
    willTypes: ['individual', 'mutual'],
    isRequired: false,
    tags: ['דיגיטלי', 'טכנולוגיה', 'חשבונות']
  },

  // סעיפי קבורה
  {
    id: 'F10-burial-instructions',
    title: 'הוראות קבורה וטקס',
    category: 'funeral',
    content: 'אני מצווה כי קבורתי תיערך ב{{burial_place}}, והטקס יתבצע לפי המסורת {{tradition_type}}. אני מבקש כי לא ייערכו טקסים מיותרים ויוצמדו למינימום ההכרחי.',
    variables: ['burial_place', 'tradition_type'],
    aiPrompt: 'התאם לאמונות הדתיות והמשפחתיות של המצווה',
    usageInstructions: 'מומלץ לכל מצווה עם העדפות ספציפיות',
    willTypes: ['individual', 'mutual'],
    isRequired: false,
    tags: ['קבורה', 'טקס', 'מסורת']
  },

  // סעיפי קופות פנסיה
  {
    id: 'E12-V1-pension-beneficiaries',
    title: 'יורשי קופות פנסיה וביטוח חיים',
    category: 'property',
    content: 'אני מצווה{{testator_gender_suffix}} כי כל הכספים בקופות הפנסיה שלי, קרנות השתלמות וביטוחי החיים, יעברו לידי {{pension_heir_name}}, ת.ז. {{pension_heir_id}}, בסכום של {{amount}} ש"ח.',
    variables: ['pension_heir_name', 'pension_heir_id', 'amount', 'testator_gender_suffix'],
    aiPrompt: 'התאם לסוג הקופה ולסכומים המדויקים',
    usageInstructions: 'חובה למצווה עם קופות פנסיה',
    willTypes: ['individual', 'mutual'],
    isRequired: false,
    tags: ['פנסיה', 'ביטוח', 'כספים']
  },

  // סעיף איסור ערעור
  {
    id: 'F11-no-contest',
    title: 'איסור ערעור על הצוואה',
    category: 'conditions',
    content: 'כל אדם שיערער על צוואה זו או ינהל הליכים משפטיים נגדה, יאבד את כל זכויותיו לירושה ויקבל במקום זאת סכום סימלי של שקל אחד בלבד.',
    variables: [],
    aiPrompt: 'שמור על הנוסח המשפטי הקשוח',
    usageInstructions: 'מומלץ למשפחות עם היסטוריה של סכסוכים',
    willTypes: ['individual', 'mutual'],
    isRequired: false,
    tags: ['ערעור', 'הגנה', 'סכסוכים']
  },

  // סעיף זכות מגורים
  {
    id: 'F12-residence-rights',
    title: 'זכות מגורים ברכוש',
    category: 'property',
    content: 'אני מצווה כי {{resident_name}}, ת.ז. {{resident_id}}, יקבל זכות מגורים בבית ב{{residence_address}} למשך כל חייו, ללא תשלום שכר דירה, בתנאי שהוא ישמור על הנכס ויתחזק אותו כראוי.',
    variables: ['resident_name', 'resident_id', 'residence_address'],
    aiPrompt: 'התאם לסוג הנכס ולמגורים הנדרשים',
    usageInstructions: 'מומלץ למצווה שרוצה להבטיח מגורים לבן משפחה',
    willTypes: ['individual'],
    isRequired: false,
    tags: ['מגורים', 'זכות', 'נכס']
  },

  // סעיף איסור משכנתא
  {
    id: 'F13-mortgage-prohibition',
    title: 'איסור משכנתא על נכס',
    category: 'property',
    content: 'אני מצווה כי על הנכס ב{{property_address}} לא תוטל משכנתא ולא ייערך כל עיקול או שעבוד אחר, למעט משכנתא קיימת בסכום של {{existing_mortgage_amount}} ש"ח.',
    variables: ['property_address', 'existing_mortgage_amount'],
    aiPrompt: 'התאם למצב המשכנתא הקיים על הנכס',
    usageInstructions: 'מומלץ למצווה עם נכסים עם משכנתא',
    willTypes: ['individual', 'mutual'],
    isRequired: false,
    tags: ['משכנתא', 'איסור', 'נכס']
  },

  // סעיף חלוקה מדורגת
  {
    id: 'F14-staged-distribution',
    title: 'חלוקה מדורגת לפי גיל',
    category: 'heirs',
    content: 'אני מצווה{{testator_gender_suffix}} כי חלקו של {{heir_name}}, ת.ז. {{heir_id}}, יועבר אליו{{heir_gender_suffix}} בגיל {{distribution_age}}, ולפני כן יעמוד הנכס בחזקת נאמן שיקבל את ההחלטות לטובתו.',
    variables: ['heir_name', 'heir_id', 'distribution_age', 'testator_gender_suffix', 'heir_gender_suffix'],
    aiPrompt: 'התאם לגיל היורש ולסוג הנכס',
    usageInstructions: 'מומלץ ליורשים צעירים או לא אחראיים',
    willTypes: ['individual', 'mutual'],
    isRequired: false,
    tags: ['חלוקה', 'גיל', 'נאמן']
  },

  // סעיף הוראות עסק
  {
    id: 'F8-V1-business-instructions',
    title: 'הוראות לעסק או חברה',
    category: 'business',
    content: 'אני מצווה כי העסק {{business_name}} יעבור לידי {{heir_name}}, ת.ז. {{heir_id}}, שיקבל{{heir_gender_suffix}} את כל הזכויות והחובות הקשורים לעסק. היורש{{heir_gender_suffix}} ימשיך{{heir_gender_suffix}} לנהל את העסק בהתאם ל{{business_instructions}}.',
    variables: ['business_name', 'heir_name', 'heir_id', 'heir_gender_suffix', 'business_instructions'],
    aiPrompt: 'התאם לסוג העסק ולמיומנות היורש',
    usageInstructions: 'חובה למצווה עם עסק או חברה',
    willTypes: ['individual'],
    isRequired: false,
    tags: ['עסק', 'חברה', 'ניהול']
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
 * פונקציה לקבלת סעיפים חובה לפי סוג צוואה
 */
export function getRequiredWillSections(willType: 'individual' | 'mutual'): WillSectionTemplate[] {
  return willsSectionsWarehouse.filter(section => 
    section.willTypes.includes(willType) && section.isRequired === true
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה וסוג צוואה
 */
export function getWillSectionsByCategoryAndType(willType: 'individual' | 'mutual', category: string): WillSectionTemplate[] {
  return willsSectionsWarehouse.filter(section => 
    section.willTypes.includes(willType) && section.category === category
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getWillSectionsByCategory(category: string): WillSectionTemplate[] {
  return willsSectionsWarehouse.filter(section => section.category === category);
}

