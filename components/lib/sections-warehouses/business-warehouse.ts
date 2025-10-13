/**
 * מחסן סעיפים להסכמים עסקיים - שותפות, סודיות, שירותים
 */

export interface BusinessSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'partnership' | 'equity' | 'management' | 'financial' | 'confidentiality' | 'ip' | 'termination' | 'dispute-resolution' | 'special' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  agreementTypes: ('partnership' | 'nda' | 'service' | 'consulting')[];
}

export const businessSectionsWarehouse: BusinessSectionTemplate[] = [
  // הסכמי שותפות
  {
    id: 'partnership-structure',
    title: 'מבנה השותפות וחלוקת אחזקות',
    category: 'equity',
    content: `מבנה השותפות:

השותפים מסכימים להקים {{partnership_type}} (שותפות רשומה / חברה בע"מ / עמותה) בשם {{business_name}}.

חלוקת האחזקות:
- {{partner1_name}}: {{partner1_equity}}%
- {{partner2_name}}: {{partner2_equity}}%
- {{partner3_name}}: {{partner3_equity}}%

תרומה ראשונית:
- {{partner1_name}}: {{partner1_contribution}}
- {{partner2_name}}: {{partner2_contribution}}
- {{partner3_name}}: {{partner3_contribution}}

{{additional_equity_terms}}`,
    variables: ['partnership_type', 'business_name', 'partner1_name', 'partner1_equity', 'partner2_name', 'partner2_equity', 'partner3_name', 'partner3_equity', 'partner1_contribution', 'partner2_contribution', 'partner3_contribution', 'additional_equity_terms'],
    aiPrompt: 'פרט את מבנה השותפות בבהירות, וודא שהאחוזים מסתכמים ל-100%',
    usageInstructions: 'השתמש בתחילת כל הסכם שותפות',
    agreementTypes: ['partnership']
  },

  {
    id: 'roles-and-responsibilities',
    title: 'תפקידים ואחריות השותפים',
    category: 'management',
    content: `תפקידים ואחריות:

{{partner1_name}} יהיה אחראי על {{partner1_role}}.

תחומי אחריות של {{partner1_name}}:
- {{partner1_responsibility1}}
- {{partner1_responsibility2}}
- {{partner1_responsibility3}}

{{partner2_name}} יהיה אחראי על {{partner2_role}}.

תחומי אחריות של {{partner2_name}}:
- {{partner2_responsibility1}}
- {{partner2_responsibility2}}

החלטות משותפות: {{joint_decisions}}.

{{additional_management_terms}}`,
    variables: ['partner1_name', 'partner1_role', 'partner1_responsibility1', 'partner1_responsibility2', 'partner1_responsibility3', 'partner2_name', 'partner2_role', 'partner2_responsibility1', 'partner2_responsibility2', 'joint_decisions', 'additional_management_terms'],
    aiPrompt: 'חלק באופן ברור את התפקידים, מנע חפיפות או חוסרים',
    usageInstructions: 'השתמש להגדרת תפקידים בשותפות',
    agreementTypes: ['partnership']
  },

  {
    id: 'profit-distribution',
    title: 'חלוקת רווחים והפסדים',
    category: 'financial',
    content: `חלוקת רווחים והפסדים:

הרווחים וההפסדים יחולקו בין השותפים {{distribution_method}}.

תדירות חלוקה: {{distribution_frequency}}.

תנאים לחלוקה:
- {{distribution_condition1}}
- {{distribution_condition2}}

יתרת רווחים שלא תחולק {{retained_earnings}}.

הפסדים יטופלו כך: {{loss_handling}}.

{{additional_distribution_terms}}`,
    variables: ['distribution_method', 'distribution_frequency', 'distribution_condition1', 'distribution_condition2', 'retained_earnings', 'loss_handling', 'additional_distribution_terms'],
    aiPrompt: 'הגדר מנגנון חלוקה ברור והוגן, כלול טיפול בהפסדים',
    usageInstructions: 'השתמש להגדרת חלוקת רווחים בשותפות',
    agreementTypes: ['partnership']
  },

  {
    id: 'capital-contributions',
    title: 'השקעות נוספות והלוואות',
    category: 'financial',
    content: `השקעות נוספות:

במידה ויידרשו כספים נוספים, השותפים {{additional_funding}}.

כל שותף ישקיע {{investment_ratio}}.

במקרה שאחד השותפים לא יכול להשקיע, {{non_investment_consequence}}.

הלוואות לשותפות: {{shareholder_loans}}.

ריבית על הלוואות: {{interest_rate}}.

{{additional_funding_terms}}`,
    variables: ['additional_funding', 'investment_ratio', 'non_investment_consequence', 'shareholder_loans', 'interest_rate', 'additional_funding_terms'],
    aiPrompt: 'הגדר מנגנון גיוס הון עתידי, טפל במקרי אי-השקעה',
    usageInstructions: 'השתמש להסדרת השקעות עתידיות',
    agreementTypes: ['partnership']
  },

  {
    id: 'decision-making-process',
    title: 'מנגנון קבלת החלטות',
    category: 'management',
    content: `קבלת החלטות:

החלטות שוטפות יתקבלו {{routine_decisions}}.

החלטות אסטרטגיות דורשות {{strategic_decisions}}.

החלטות הדורשות אישור כל השותפים:
- {{unanimous_decision1}}
- {{unanimous_decision2}}
- {{unanimous_decision3}}

במקרה של אי-הסכמה: {{deadlock_resolution}}.

{{additional_decision_terms}}`,
    variables: ['routine_decisions', 'strategic_decisions', 'unanimous_decision1', 'unanimous_decision2', 'unanimous_decision3', 'deadlock_resolution', 'additional_decision_terms'],
    aiPrompt: 'הגדר מנגנון החלטות ברור, כלול פתרון למצבי אי-הסכמה',
    usageInstructions: 'השתמש להגדרת מנגנון קבלת החלטות',
    agreementTypes: ['partnership']
  },

  {
    id: 'exit-and-buyout',
    title: 'יציאת שותף ומנגנון קנייה',
    category: 'termination',
    content: `יציאת שותף:

שותף המעוניין לעזוב את השותפות {{exit_notice}}.

שווי החלק: {{valuation_method}}.

זכות סירוב ראשונה: {{right_of_first_refusal}}.

תנאי תשלום: {{payment_terms}}.

במקרה של מוות או אי-כושר: {{death_disability}}.

איסור המחאת זכויות: {{transfer_restrictions}}.`,
    variables: ['exit_notice', 'valuation_method', 'right_of_first_refusal', 'payment_terms', 'death_disability', 'transfer_restrictions'],
    aiPrompt: 'הגדר מנגנון יציאה הוגן, כלול שומת שווי ותנאי תשלום',
    usageInstructions: 'השתמש להגדרת מנגנון יציאה ורכישה',
    agreementTypes: ['partnership']
  },

  // הסכמי סודיות (NDA)
  {
    id: 'nda-mutual',
    title: 'התחייבות סודיות הדדית',
    category: 'confidentiality',
    content: `סודיות הדדית:

הצדדים מתחייבים לשמור בסודיות מוחלטת על כל מידע {{confidential_definition}}.

מידע סודי כולל:
- {{confidential_type1}}
- {{confidential_type2}}
- {{confidential_type3}}

המידע יועבר למטרת {{purpose}}.

הצדדים מתחייבים:
- לא לחשוף את המידע לצדדים שלישיים {{disclosure_restrictions}}
- לא להשתמש במידע {{use_restrictions}}
- להגן על המידע {{protection_measures}}

{{additional_confidentiality_terms}}`,
    variables: ['confidential_definition', 'confidential_type1', 'confidential_type2', 'confidential_type3', 'purpose', 'disclosure_restrictions', 'use_restrictions', 'protection_measures', 'additional_confidentiality_terms'],
    aiPrompt: 'הגדר מידע סודי בבהירות, פרט התחייבויות מעשיות',
    usageInstructions: 'השתמש בהסכמי סודיות הדדיים',
    agreementTypes: ['nda']
  },

  {
    id: 'nda-exceptions',
    title: 'חריגים להתחייבות הסודיות',
    category: 'confidentiality',
    content: `חריגים:

ההתחייבות לסודיות לא תחול על מידע אשר:

1. {{exception1}}

2. {{exception2}}

3. {{exception3}}

4. נדרש לגילוי על פי דין {{legal_disclosure}}.

{{additional_exceptions}}`,
    variables: ['exception1', 'exception2', 'exception3', 'legal_disclosure', 'additional_exceptions'],
    aiPrompt: 'הגדר חריגים סטנדרטיים, כלול גילוי על פי דין',
    usageInstructions: 'השתמש להגדרת חריגים להסכם סודיות',
    agreementTypes: ['nda']
  },

  {
    id: 'nda-duration',
    title: 'משך ההתחייבות לסודיות',
    category: 'confidentiality',
    content: `משך הסודיות:

ההתחייבות לסודיות תהיה בתוקף החל מ{{start_date}}.

משך התוקף: {{duration}}.

בתום התקופה, {{end_of_period}}.

במקרה של {{early_termination}}, ההתחייבות {{termination_effect}}.`,
    variables: ['start_date', 'duration', 'end_of_period', 'early_termination', 'termination_effect'],
    aiPrompt: 'הגדר משך זמן סביר, כלול המשכיות אחרי תום התקופה',
    usageInstructions: 'השתמש להגדרת משך הסודיות',
    agreementTypes: ['nda']
  },

  {
    id: 'nda-return-of-materials',
    title: 'החזרת חומרים והשמדת מידע',
    category: 'confidentiality',
    content: `החזרת חומרים:

עם סיום {{termination_event}}, הצד המקבל מתחייב:

1. להחזיר מיד את כל {{materials_to_return}}.

2. להשמיד את כל {{materials_to_destroy}}.

3. לאשר בכתב {{confirmation_requirement}}.

הצד המקבל {{retention_rights}}.

אי-החזרה או השמדה {{non_compliance_consequence}}.`,
    variables: ['termination_event', 'materials_to_return', 'materials_to_destroy', 'confirmation_requirement', 'retention_rights', 'non_compliance_consequence'],
    aiPrompt: 'פרט חובות החזרה והשמדה, כלול אישור בכתב',
    usageInstructions: 'השתמש להגדרת החזרת חומרים',
    agreementTypes: ['nda']
  },

  // הסכמי שירותים
  {
    id: 'service-scope',
    title: 'היקף השירותים',
    category: 'opening',
    content: `היקף השירותים:

הספק מתחייב לספק ל{{client_name}} את השירותים הבאים:

1. {{service1}}

2. {{service2}}

3. {{service3}}

השירותים יסופקו {{service_standards}}.

{{deliverables}}

{{additional_scope_terms}}`,
    variables: ['client_name', 'service1', 'service2', 'service3', 'service_standards', 'deliverables', 'additional_scope_terms'],
    aiPrompt: 'פרט את השירותים בבהירות, כלול סטנדרטים ותוצרים',
    usageInstructions: 'השתמש להגדרת היקף שירותים',
    agreementTypes: ['service', 'consulting']
  },

  {
    id: 'service-fees',
    title: 'תמחור ותשלום עבור שירותים',
    category: 'financial',
    content: `תמחור ותשלום:

התמורה עבור השירותים תהיה {{fee_structure}}.

תעריף: {{rate}}.

תשלום: {{payment_schedule}}.

הוצאות נלוות: {{expenses}}.

חשבונית תוגש {{invoicing}}.

תנאי תשלום: {{payment_terms}}.

איחור בתשלום: {{late_payment}}.`,
    variables: ['fee_structure', 'rate', 'payment_schedule', 'expenses', 'invoicing', 'payment_terms', 'late_payment'],
    aiPrompt: 'פרט את מבנה התשלום בבהירות, כלול תנאים ואיחורים',
    usageInstructions: 'השתמש להגדרת תמחור שירותים',
    agreementTypes: ['service', 'consulting']
  },

  {
    id: 'service-warranties',
    title: 'אחריות ושיפוי בהסכם שירותים',
    category: 'special',
    content: `אחריות ושיפוי:

הספק מתחייב כי השירותים יסופקו {{quality_commitment}}.

הספק אחראי ל{{liability_scope}}.

הגבלת אחריות: {{liability_limitation}}.

שיפוי: הספק ישפה את הלקוח בגין {{indemnification}}.

החרגות מאחריות: {{exclusions}}.

{{additional_warranty_terms}}`,
    variables: ['quality_commitment', 'liability_scope', 'liability_limitation', 'indemnification', 'exclusions', 'additional_warranty_terms'],
    aiPrompt: 'איזן בין התחייבות לאיכות להגבלת אחריות סבירה',
    usageInstructions: 'השתמש להגדרת אחריות בהסכם שירותים',
    agreementTypes: ['service', 'consulting']
  },

  {
    id: 'service-termination',
    title: 'סיום הסכם שירותים',
    category: 'termination',
    content: `סיום ההסכם:

כל צד רשאי לסיים את ההסכם {{termination_notice}}.

סיום מיידי במקרה של: {{immediate_termination}}.

בעת סיום ההסכם:
- {{termination_obligation1}}
- {{termination_obligation2}}
- {{final_payment}}

{{post_termination_obligations}}`,
    variables: ['termination_notice', 'immediate_termination', 'termination_obligation1', 'termination_obligation2', 'final_payment', 'post_termination_obligations'],
    aiPrompt: 'פרט תהליך סיום מסודר, כלול התחשבנות סופית',
    usageInstructions: 'השתמש להגדרת סיום הסכם שירותים',
    agreementTypes: ['service', 'consulting']
  },

  // קניין רוחני
  {
    id: 'ip-ownership-work-for-hire',
    title: 'בעלות על קניין רוחני - עבודה לשכר',
    category: 'ip',
    content: `בעלות על קניין רוחני:

כל קניין רוחני שייווצר במסגרת {{project_scope}} יהיה בבעלות {{client_name}} הבלעדית.

זכויות המועברות כוללות: {{ip_rights}}.

הספק מסב בזאת ללקוח {{assignment_terms}}.

הספק מתחייב לחתום על {{cooperation}}.

רישוי: {{licensing_terms}}.

{{additional_ip_terms}}`,
    variables: ['project_scope', 'client_name', 'ip_rights', 'assignment_terms', 'cooperation', 'licensing_terms', 'additional_ip_terms'],
    aiPrompt: 'הבהר בעלות ברורה על קניין רוחני, כלול הסבה והעברה',
    usageInstructions: 'השתמש בהסכמי שירותים עם יצירת קניין רוחני',
    agreementTypes: ['service', 'consulting']
  },

  // יישוב סכסוכים
  {
    id: 'mediation-clause',
    title: 'הליך גישור לפתרון סכסוכים',
    category: 'dispute-resolution',
    content: `יישוב סכסוכים:

במקרה של מחלוקת, הצדדים מתחייבים {{mediation_commitment}}.

הגישור יתקיים {{mediation_location}}.

המגשר יהיה {{mediator_selection}}.

תקופת הגישור: {{mediation_period}}.

עלות הגישור: {{mediation_costs}}.

רק לאחר כישלון הגישור, {{post_mediation}}.`,
    variables: ['mediation_commitment', 'mediation_location', 'mediator_selection', 'mediation_period', 'mediation_costs', 'post_mediation'],
    aiPrompt: 'הגדר תהליך גישור מעשי, עודד פתרון מחוץ לבית משפט',
    usageInstructions: 'השתמש להוספת מנגנון גישור',
    agreementTypes: ['partnership', 'service', 'consulting']
  },

  {
    id: 'arbitration-clause',
    title: 'סעיף בוררות',
    category: 'dispute-resolution',
    content: `בוררות:

כל מחלוקת בין הצדדים תובא להכרעת בורר/ים {{arbitration_commitment}}.

מספר בוררים: {{number_of_arbitrators}}.

מינוי הבוררים: {{arbitrator_selection}}.

מקום הבוררות: {{arbitration_location}}.

הליך הבוררות יתנהל לפי {{arbitration_rules}}.

פסק הבורר יהיה {{arbitration_finality}}.

עלויות: {{arbitration_costs}}.`,
    variables: ['arbitration_commitment', 'number_of_arbitrators', 'arbitrator_selection', 'arbitration_location', 'arbitration_rules', 'arbitration_finality', 'arbitration_costs'],
    aiPrompt: 'הגדר הליך בוררות מלא, כלול מינוי בוררים וסופיות',
    usageInstructions: 'השתמש כחלופה להתדיינות משפטית',
    agreementTypes: ['partnership', 'service', 'consulting', 'nda']
  },

  // תנאים כלליים
  {
    id: 'force-majeure',
    title: 'כוח עליון',
    category: 'special',
    content: `כוח עליון:

אף אחד מהצדדים לא יחשב כמפר את ההסכם אם אי-הקיום נבע מ{{force_majeure_definition}}.

אירועי כוח עליון כוללים:
- {{force_majeure_event1}}
- {{force_majeure_event2}}
- {{force_majeure_event3}}

הצד המושפע מתחייב {{notice_obligation}}.

השפעה על ההסכם: {{effect_on_agreement}}.

{{additional_force_majeure_terms}}`,
    variables: ['force_majeure_definition', 'force_majeure_event1', 'force_majeure_event2', 'force_majeure_event3', 'notice_obligation', 'effect_on_agreement', 'additional_force_majeure_terms'],
    aiPrompt: 'הגדר כוח עליון בצורה מאוזנת, כלול חובת הודעה',
    usageInstructions: 'השתמש בכל הסכם עסקי',
    agreementTypes: ['partnership', 'service', 'consulting', 'nda']
  },

  {
    id: 'amendment-clause',
    title: 'שינוי ההסכם',
    category: 'closing',
    content: `שינוי ההסכם:

הסכם זה ניתן לשינוי רק {{amendment_requirements}}.

כל שינוי יהיה תקף רק אם {{validity_conditions}}.

שינויים בעל פה {{oral_amendments}}.

{{additional_amendment_terms}}`,
    variables: ['amendment_requirements', 'validity_conditions', 'oral_amendments', 'additional_amendment_terms'],
    aiPrompt: 'הגדר דרישות לשינוי ההסכם, מנע שינויים לא מבוקרים',
    usageInstructions: 'השתמש בכל הסכם עסקי',
    agreementTypes: ['partnership', 'service', 'consulting', 'nda']
  }
];

/**
 * פונקציה לקבלת סעיפים לפי סוג הסכם
 */
export function getBusinessSectionsForType(agreementType: string): BusinessSectionTemplate[] {
  return businessSectionsWarehouse.filter(section => 
    section.agreementTypes.includes(agreementType as any)
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getBusinessSectionsByCategory(category: string): BusinessSectionTemplate[] {
  return businessSectionsWarehouse.filter(section => section.category === category);
}

