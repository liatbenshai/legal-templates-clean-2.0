/**
 * מחסן סעיפים לצוואות הדדיות
 * סעיפים ייחודיים לצוואות הדדיות של בני זוג
 */

export interface MutualWillSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'survivor-rights' | 'heirs' | 'property' | 'guardianship' | 'executors' | 'special-bequests' | 'conditions' | 'funeral' | 'digital' | 'business' | 'debts' | 'family' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
}

export const mutualWillsSectionsWarehouse: MutualWillSectionTemplate[] = [
  // פתיחה לצוואה הדדית
  {
    id: 'mutual-will-opening',
    title: 'פתיחת צוואה הדדית',
    category: 'opening',
    content: `צוואה הדדית

אנו החתומים מטה:

{{spouse1_name}}, ת.ז. {{spouse1_id}}, מרחוב {{spouse1_address}}

וּ

{{spouse2_name}}, ת.ז. {{spouse2_id}}, מרחוב {{spouse2_address}}

בני זוג הנשואים זה לזו מיום {{marriage_date}}, מצווים בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת, את צוואתנו ההדדית האחרונה.

הואיל ובנינו את חיינו המשותפים יחדיו, ואנו חפצים להבטיח את עתידם של בן הזוג השורד וילדינו;

והואיל ואנו מסכימים על חלוקת רכושנו המשותף והנפרד לאחר פטירתנו;

לפיכך אנו מצווים בזאת כדלקמן:`,
    variables: ['spouse1_name', 'spouse1_id', 'spouse1_address', 'spouse2_name', 'spouse2_id', 'spouse2_address', 'marriage_date'],
    aiPrompt: 'כתוב בצורה רשמית ומכבדת, הדגש את האיחוד והשותפות',
    usageInstructions: 'השתמש לפתיחת כל צוואה הדדית',
  },

  // זכויות בן הזוג השורד
  {
    id: 'survivor-full-inheritance',
    title: 'ירושה מלאה לבן הזוג השורד',
    category: 'survivor-rights',
    content: `זכויות בן הזוג השורד:

אנו מצווים כי במקרה של פטירת אחד מאיתנו, בן הזוג השורד יירש את {{inheritance_scope}}.

בן הזוג השורד יהיה רשאי:
• {{right_1}}
• {{right_2}}
• {{right_3}}
• {{right_4}}

בן הזוג השורד לא יהיה זקוק לאישור היורשים או כל גורם אחר לביצוע {{autonomous_actions}}.

{{residence_rights}}

רק לאחר פטירת שנינו, {{after_both_deceased}}.`,
    variables: ['inheritance_scope', 'right_1', 'right_2', 'right_3', 'right_4', 'autonomous_actions', 'residence_rights', 'after_both_deceased'],
    aiPrompt: 'הדגש הגנה מלאה על בן הזוג השורד, וודא עצמאות מלאה',
    usageInstructions: 'השתמש כאשר רוצים לתת ירושה מלאה ללא תנאים לבן הזוג',
  },

  {
    id: 'survivor-usufruct-rights',
    title: 'זכויות שימוש לבן הזוג והבעלות לילדים',
    category: 'survivor-rights',
    content: `זכויות שימוש ובעלות:

אנו מצווים כי במקרה של פטירת אחד מאיתנו:

**בן הזוג השורד:**
יקבל {{usufruct_rights}} (זכויות שימוש, מגורים ופירות) ב{{assets_description}}.

זכויות אלו יהיו:
• {{usufruct_term_1}}
• {{usufruct_term_2}}
• {{usufruct_term_3}}

**הבעלות:**
הבעלות ב{{assets_description}} תעבור לילדינו: {{children_names}}.

**מגבלות:**
{{limitations_on_survivor}}

**מכירה:**
{{sale_provisions}}

לאחר פטירת בן הזוג השני, הבעלות המלאה תעבור לילדינו כמפורט בסעיף חלוקת הירושה.`,
    variables: ['usufruct_rights', 'assets_description', 'usufruct_term_1', 'usufruct_term_2', 'usufruct_term_3', 'children_names', 'limitations_on_survivor', 'sale_provisions'],
    aiPrompt: 'הסבר בבירור את ההבדל בין זכויות שימוש לבעלות, איזן בין צרכי בן הזוג לזכויות הילדים',
    usageInstructions: 'השתמש כאשר רוצים לאזן בין זכויות בן הזוג השורד לבין העברת בעלות לילדים',
  },

  {
    id: 'survivor-residence-rights',
    title: 'זכות מגורים לבן הזוג בדירה',
    category: 'survivor-rights',
    content: `זכות מגורים בדירת המשפחה:

אנו מצווים כי במקרה של פטירת אחד מאיתנו, בן הזוג השורד יהיה זכאי למגורים בדירתנו ברחוב {{residence_address}} {{residence_terms}}.

**תנאי זכות המגורים:**
• הזכות תעמוד בתוקפה {{duration}}
• בן הזוג השורד יישא ב{{expenses_responsibility}}
• בן הזוג השורד {{maintenance_obligations}}
• {{additional_residence_terms}}

**מגבלות:**
• בן הזוג השורד {{subletting_rights}} להשכיר את הדירה
• בן הזוג השורד {{sale_rights}} למכור את הדירה

**במקרה של נישואים חוזרים:**
{{remarriage_provision}}

**במקרה של מעבר דירה:**
{{relocation_provision}}

הבעלות בדירה תהיה ל{{ownership_allocation}}.`,
    variables: [
      'residence_address', 'residence_terms', 'duration', 'expenses_responsibility',
      'maintenance_obligations', 'additional_residence_terms', 'subletting_rights',
      'sale_rights', 'remarriage_provision', 'relocation_provision', 'ownership_allocation'
    ],
    aiPrompt: 'התאם למציאות הישראלית (דירת המשפחה), כלול תרחישים שונים כולל נישואים חוזרים',
    usageInstructions: 'השתמש כאשר רוצים להבטיח מגורים לבן הזוג אך לשמור על הבעלות לטובת הילדים',
  },

  {
    id: 'survivor-financial-support',
    title: 'תמיכה כלכלית לבן הזוג השורד',
    category: 'survivor-rights',
    content: `תמיכה כלכלית לבן הזוג:

אנו מצווים כי במקרה של פטירת אחד מאיתנו, בן הזוג השורד יקבל:

**תמיכה חודשית:**
• סכום של {{monthly_amount}} ש"ח לחודש
• התמיכה תשולם מ{{payment_source}}
• התשלום יבוצע {{payment_schedule}}
• התמיכה תעודכן {{indexation}}

**משך התמיכה:**
{{support_duration}}

**תנאים להפסקת התמיכה:**
{{termination_conditions}}

**במקרה של נישואים חוזרים:**
{{remarriage_financial_provision}}

מקור התמיכה יהיה {{funding_source}} ותנוהל על ידי {{trustee_name}}.`,
    variables: [
      'monthly_amount', 'payment_source', 'payment_schedule', 'indexation',
      'support_duration', 'termination_conditions', 'remarriage_financial_provision',
      'funding_source', 'trustee_name'
    ],
    aiPrompt: 'התאם לצרכים הכלכליים, כלול הצמדה למדד, טפל בתרחישים שונים',
    usageInstructions: 'השתמש כאשר רוצים להבטיח תמיכה כלכלית קבועה לבן הזוג השורד',
  },

  // חלוקה בין הילדים
  {
    id: 'children-equal-distribution',
    title: 'חלוקה שווה בין הילדים',
    category: 'heirs',
    content: `חלוקת הירושה בין ילדינו:

לאחר פטירת שנינו, כל רכושנו - המשותף והנפרד - יחולק בחלקים שווים בין ילדינו:

{{#each children}}
• {{this.name}}, ת.ז. {{this.id}} - {{this.share}}%
{{/each}}

**סה"כ:** 100%

כל ילד יקבל חלק שווה מכל נכס ונכס, אלא אם צוין אחרת במפורש בצוואה זו.

**במקרה של פטירת ילד לפני שנינו:**
{{predeceased_child_provision}}

**במקרה של ילד שנולד לאחר חתימת צוואה זו:**
{{after_born_child_provision}}`,
    variables: ['children', 'predeceased_child_provision', 'after_born_child_provision'],
    aiPrompt: 'וודא הגינות מוחלטת, טפל בתרחישים של מוות מוקדם או לידה',
    usageInstructions: 'השתמש כאשר רוצים חלוקה שווה בין כל הילדים',
  },

  {
    id: 'children-unequal-distribution',
    title: 'חלוקה לא שווה בין הילדים',
    category: 'heirs',
    content: `חלוקת הירושה בין ילדינו באופן לא שווה:

לאחר פטירת שנינו, רכושנו יחולק בין ילדינו כדלקמן:

{{#each children}}
• {{this.name}}, ת.ז. {{this.id}} - {{this.share}}%
  נימוק: {{this.reason}}
{{/each}}

**סה"כ:** 100%

**הנימוקים לחלוקה זו:**
{{general_rationale}}

אנו מבקשים מילדינו להבין ולכבד את החלטתנו זו, שנעשתה {{decision_context}}.

**במקרה של פטירת ילד לפני שנינו:**
{{predeceased_child_provision}}

{{#if dispute_prevention}}
**מניעת סכסוכים:**
{{dispute_prevention}}
{{/if}}`,
    variables: ['children', 'general_rationale', 'decision_context', 'predeceased_child_provision', 'dispute_prevention'],
    aiPrompt: 'הסבר בצורה רגישה את הנימוקים, נסה למנוע פגיעה רגשית וסכסוכים',
    usageInstructions: 'השתמש כאשר יש סיבות מוצדקות לחלוקה לא שווה (צרכים מיוחדים, תרומה למשפחה וכו\')',
  },

  {
    id: 'children-conditional-inheritance',
    title: 'ירושה מותנית לילדים',
    category: 'heirs',
    content: `ירושה מותנית לילדים:

לאחר פטירת שנינו, ילדינו יקבלו את חלקם בירושה בכפוף לתנאים הבאים:

**{{child1_name}}:**
• חלק: {{child1_share}}%
• תנאי: {{child1_condition}}
• עד להשלמת התנאי: {{child1_holding_terms}}

**{{child2_name}}:**
• חלק: {{child2_share}}%
• תנאי: {{child2_condition}}
• עד להשלמת התנאי: {{child2_holding_terms}}

{{#if child3_name}}
**{{child3_name}}:**
• חלק: {{child3_share}}%
• תנאי: {{child3_condition}}
• עד להשלמת התנאי: {{child3_holding_terms}}
{{/if}}

**נאמן:**
{{trustee_name}} ישמש כנאמן ויחזיק את הכספים עד להשלמת התנאים.

**שיקול דעת הנאמן:**
{{trustee_discretion}}

**אי עמידה בתנאים:**
{{failure_to_meet_conditions}}`,
    variables: [
      'child1_name', 'child1_share', 'child1_condition', 'child1_holding_terms',
      'child2_name', 'child2_share', 'child2_condition', 'child2_holding_terms',
      'child3_name', 'child3_share', 'child3_condition', 'child3_holding_terms',
      'trustee_name', 'trustee_discretion', 'failure_to_meet_conditions'
    ],
    aiPrompt: 'וודא שהתנאים ריאליים והוגנים, כלול מנגנוני ביטחון',
    usageInstructions: 'השתמש כאשר רוצים להתנות את הירושה בהשגת יעדים (השכלה, גיל, וכו\')',
  },

  // רכוש משותף ונפרד
  {
    id: 'joint-property-declaration',
    title: 'הצהרה על רכוש משותף ונפרד',
    category: 'property',
    content: `הצהרה על הרכוש:

אנו מצהירים כי הרכוש המשותף שלנו כולל:

**רכוש משותף:**
{{#each joint_properties}}
• {{this.description}} - {{this.details}}
{{/each}}

**רכוש נפרד של {{spouse1_name}}:**
{{#each spouse1_separate_properties}}
• {{this.description}} - {{this.details}}
{{/each}}

**רכוש נפרד של {{spouse2_name}}:**
{{#each spouse2_separate_properties}}
• {{this.description}} - {{this.details}}
{{/each}}

{{#if property_regime}}
**משטר הרכוש בינינו:**
{{property_regime}}
{{/if}}

לאחר פטירת האחד, הרכוש המשותף יחולק {{joint_division}}, והרכוש הנפרד {{separate_division}}.`,
    variables: ['joint_properties', 'spouse1_name', 'spouse1_separate_properties', 'spouse2_name', 'spouse2_separate_properties', 'property_regime', 'joint_division', 'separate_division'],
    aiPrompt: 'הבהר את ההבדל בין רכוש משותף לנפרד, התאם לדיני הרכוש הזוגי בישראל',
    usageInstructions: 'השתמש כאשר יש רכוש משותף ורכוש נפרד שצריך להבהיר',
  },

  // הורשות מיוחדות בצוואה הדדית
  {
    id: 'mutual-special-bequest',
    title: 'הורשה מיוחדת בצוואה הדדית',
    category: 'special-bequests',
    content: `הורשה מיוחדת:

אנו מצווים כי {{recipient_name}}, ת.ז. {{recipient_id}}, {{relationship}}, יקבל {{bequest_description}}.

הורשה זו תתקיים {{timing}}:
{{timing_details}}

{{#if conditions}}
**תנאים להורשה:**
{{conditions}}
{{/if}}

הורשה זו {{priority}} (תינתן לפני/אחרי/יחד עם) חלוקת היתרה בין הילדים.

{{additional_terms}}`,
    variables: ['recipient_name', 'recipient_id', 'relationship', 'bequest_description', 'timing', 'timing_details', 'conditions', 'priority', 'additional_terms'],
    aiPrompt: 'התאם לזמני הפטירה (האחד או השני), וודא בהירות מלאה',
    usageInstructions: 'השתמש כאשר רוצים להוריש משהו ספציפי לאדם מסוים בנוסף לירושה הרגילה',
  },

  // אפוטרופסות בצוואה הדדית
  {
    id: 'mutual-guardianship',
    title: 'אפוטרופסות על ילדים קטינים בצוואה הדדית',
    category: 'guardianship',
    content: `אפוטרופסות על ילדים קטינים:

אנו ממנים את {{guardian_name}}, ת.ז. {{guardian_id}}, {{relationship}}, כאפוטרופוס על ילדינו הקטינים במקרה של פטירת שנינו.

**הילדים הקטינים:**
{{children_list}}

**תפקיד האפוטרופוס:**
{{guardianship_scope}}

**סיבות למינוי:**
בחרנו באפוטרופוס זה מהטעמים הבאים: {{reasons}}.

**תמיכה כלכלית:**
האפוטרופוס יקבל {{financial_support}} לצורך גידול הילדים.

**הדרכה להורות:**
אנו מבקשים מהאפוטרופוס {{parenting_guidance}}.

**אפוטרופוס חלופי:**
אם האפוטרופוס שמינינו לא יוכל לשמש בתפקיד, נמנה במקומו את {{backup_guardian_name}}, ת.ז. {{backup_guardian_id}}.`,
    variables: ['guardian_name', 'guardian_id', 'relationship', 'children_list', 'guardianship_scope', 'reasons', 'financial_support', 'parenting_guidance', 'backup_guardian_name', 'backup_guardian_id'],
    aiPrompt: 'התאם למצב של פטירת שני ההורים, הדגש את חשיבות הנושא',
    usageInstructions: 'השתמש כאשר יש ילדים קטינים וצריך למנות אפוטרופוס במקרה של פטירת שני ההורים',
  },

  // עסקים משותפים
  {
    id: 'mutual-business-succession',
    title: 'ירושת עסק משותף',
    category: 'business',
    content: `ירושת העסק המשותף:

אנו מצווים בדבר ירושת העסק המשותף שלנו {{business_name}}, ח.פ. {{business_id}}.

**במקרה של פטירת אחד מאיתנו:**
{{first_death_provision}}

**במקרה של פטירת שנינו:**
העסק יחולק בין ילדינו כדלקמן:

{{#each children}}
• {{this.name}} - {{this.share}}% + תפקיד {{this.role}}
{{/each}}

**ניהול העסק:**
{{management_structure}}

**ייעוץ מקצועי:**
אנו ממליצים ליורשים להיוועץ ב{{advisors}} לפני קבלת החלטות.

**מכירת העסק:**
{{sale_provisions}}

**פתרון סכסוכים:**
{{dispute_resolution}}`,
    variables: ['business_name', 'business_id', 'first_death_provision', 'children', 'management_structure', 'advisors', 'sale_provisions', 'dispute_resolution'],
    aiPrompt: 'התאם למצב של עסק משותף, טפל בשני שלבים (פטירת אחד ושניים)',
    usageInstructions: 'השתמש כאשר יש עסק משותף לשני בני הזוג',
  },

  // נכסים דיגיטליים
  {
    id: 'mutual-digital-assets',
    title: 'ירושת נכסים דיגיטליים בצוואה הדדית',
    category: 'digital',
    content: `ירושת נכסים דיגיטליים:

אנו מצווים בדבר הנכסים הדיגיטליים שלנו:

**נכסים דיגיטליים משותפים:**
{{joint_digital_assets}}

**נכסים דיגיטליים של {{spouse1_name}}:**
{{spouse1_digital_assets}}

**נכסים דיגיטליים של {{spouse2_name}}:**
{{spouse2_digital_assets}}

**במקרה של פטירת אחד מאיתנו:**
בן הזוג השורד יקבל {{survivor_digital_rights}}.

**במקרה של פטירת שנינו:**
{{children_digital_inheritance}}

**מיקום פרטי גישה:**
{{credentials_location}}

**הוראות מיוחדות:**
{{special_digital_instructions}}`,
    variables: ['joint_digital_assets', 'spouse1_name', 'spouse1_digital_assets', 'spouse2_name', 'spouse2_digital_assets', 'survivor_digital_rights', 'children_digital_inheritance', 'credentials_location', 'special_digital_instructions'],
    aiPrompt: 'התאם לעידן הדיגיטלי, כלול קריפטו, חשבונות ותכנים',
    usageInstructions: 'השתמש כאשר יש נכסים דיגיטליים משמעותיים',
  },

  // הוראות קבורה משותפות
  {
    id: 'mutual-burial-preferences',
    title: 'העדפות קבורה לבני הזוג',
    category: 'funeral',
    content: `העדפות קבורה:

**{{spouse1_name}} מבקש/ת:**
• מקום קבורה: {{spouse1_burial_location}}
• סוג קבורה: {{spouse1_burial_type}}
• טקס: {{spouse1_ceremony}}
• {{spouse1_additional}}

**{{spouse2_name}} מבקש/ת:**
• מקום קבורה: {{spouse2_burial_location}}
• סוג קבורה: {{spouse2_burial_type}}
• טקס: {{spouse2_ceremony}}
• {{spouse2_additional}}

**העדפה משותפת:**
{{#if joint_burial_preference}}
אנו מבקשים {{joint_burial_preference}}.
{{/if}}

**תקציב:**
{{funeral_budget}}

**הנצחה:**
{{memorial_preferences}}`,
    variables: [
      'spouse1_name', 'spouse1_burial_location', 'spouse1_burial_type', 'spouse1_ceremony', 'spouse1_additional',
      'spouse2_name', 'spouse2_burial_location', 'spouse2_burial_type', 'spouse2_ceremony', 'spouse2_additional',
      'joint_burial_preference', 'funeral_budget', 'memorial_preferences'
    ],
    aiPrompt: 'התאם בצורה רגישה לרצונות של שני בני הזוג, כלול אפשרות לקבורה משותפת',
    usageInstructions: 'השתמש כאשר יש העדפות קבורה ספציפיות לכל אחד מבני הזוג',
  },

  // מנהל עזבון בצוואה הדדית
  {
    id: 'mutual-executor',
    title: 'מינוי מנהל עזבון בצוואה הדדית',
    category: 'executors',
    content: `מינוי מנהל עזבון:

**במקרה של פטירת אחד מאיתנו:**
בן הזוג השורד יהיה מנהל העזבון באופן אוטומטי.

**במקרה של פטירת שנינו (או אי יכולת של בן הזוג לשמש):**
אנו ממנים את {{executor_name}}, ת.ז. {{executor_id}}, כמנהל העזבון שלנו.

**תפקידי המנהל:**
{{executor_duties}}

**שכר טרחה:**
{{executor_compensation}}

**סמכויות:**
{{executor_authorities}}

**מנהל עזבון חלופי:**
אם המנהל שמינינו לא יוכל לכהן, נמנה במקומו את {{backup_executor_name}}, ת.ז. {{backup_executor_id}}.

**שיתוף פעולה עם היורשים:**
{{cooperation_terms}}`,
    variables: ['executor_name', 'executor_id', 'executor_duties', 'executor_compensation', 'executor_authorities', 'backup_executor_name', 'backup_executor_id', 'cooperation_terms'],
    aiPrompt: 'הפרד בין שני המצבים (פטירת אחד ושניים), וודא בהירות',
    usageInstructions: 'השתמש למינוי מנהל עזבון בצוואה הדדית',
  },

  // איסור שינוי צוואה חד צדדי
  {
    id: 'mutual-will-irrevocability',
    title: 'איסור שינוי חד צדדי של הצוואה ההדדית',
    category: 'closing',
    content: `הדדיות הצוואה ואיסור שינוי חד צדדי:

אנו מסכימים כי צוואה זו היא הדדית ומחייבת, ולא ניתן לשנותה או לבטלה אלא {{modification_terms}}.

**לאחר פטירת האחד מאיתנו:**
{{post_first_death_terms}}

**במקרה של גירושין:**
{{divorce_provision}}

**הסכמה הדדית לשינויים:**
כל שינוי בצוואה זו יחייב {{mutual_consent_requirements}}.

**תוקף המחייבות:**
{{binding_effect}}

מטרת סעיף זה היא {{rationale}}.`,
    variables: ['modification_terms', 'post_first_death_terms', 'divorce_provision', 'mutual_consent_requirements', 'binding_effect', 'rationale'],
    aiPrompt: 'הסבר את המשמעות המשפטית של צוואה הדדית, הדגש הגנה הדדית',
    usageInstructions: 'השתמש להבהרת אופי ההדדיות והמחויבות ההדדית',
  },

  // בקשה משפחתית משותפת
  {
    id: 'mutual-family-message',
    title: 'מסר משותף למשפחה',
    category: 'closing',
    content: `מסר משותף לילדינו ולמשפחתנו:

ילדינו האהובים,

אנו כותבים לכם את הצוואה הזו {{shared_sentiment}}.

לאורך שנות נישואינו בנינו יחדיו {{life_achievements}}.

חשוב לנו שתדעו ש{{shared_values}}.

אנו מבקשים מכם:

• {{request_1}}
• {{request_2}}
• {{request_3}}

זכרו תמיד כי {{family_wisdom}}.

אם יתעוררו חילוקי דעות, אנו מבקשים ש{{conflict_guidance}}.

{{final_blessing}}

באהבה אין קץ,
{{spouse1_name}} וּ{{spouse2_name}}`,
    variables: ['shared_sentiment', 'life_achievements', 'shared_values', 'request_1', 'request_2', 'request_3', 'family_wisdom', 'conflict_guidance', 'final_blessing', 'spouse1_name', 'spouse2_name'],
    aiPrompt: 'כתוב בצורה חמה, אישית ומרגשת, שקף את האהבה והשותפות',
    usageInstructions: 'השתמש לסיום הצוואה ההדדית במסר משותף למשפחה',
  },
];

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getMutualWillSectionsByCategory(category: string): MutualWillSectionTemplate[] {
  return mutualWillsSectionsWarehouse.filter(section => section.category === category);
}

/**
 * פונקציה לחיפוש סעיפים
 */
export function searchMutualWillSections(query: string): MutualWillSectionTemplate[] {
  const lowerQuery = query.toLowerCase();
  return mutualWillsSectionsWarehouse.filter(
    section =>
      section.title.toLowerCase().includes(lowerQuery) ||
      section.content.toLowerCase().includes(lowerQuery) ||
      section.usageInstructions.toLowerCase().includes(lowerQuery)
  );
}

