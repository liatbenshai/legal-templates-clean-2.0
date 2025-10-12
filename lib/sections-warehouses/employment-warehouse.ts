/**
 * מחסן סעיפים להסכמי עבודה
 */

export interface EmploymentSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'position' | 'compensation' | 'benefits' | 'work-conditions' | 'confidentiality' | 'intellectual-property' | 'termination' | 'non-compete' | 'special' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
}

export const employmentSectionsWarehouse: EmploymentSectionTemplate[] = [
  // תיאור תפקיד מפורט
  {
    id: 'detailed-job-description',
    title: 'תיאור תפקיד מפורט',
    category: 'position',
    content: `תיאור התפקיד:

העובד ישמש בתפקיד {{job_title}} במחלקת {{department}}.

תחומי אחריות:
1. {{responsibility1}}
2. {{responsibility2}}
3. {{responsibility3}}

דרישות התפקיד:
- השכלה: {{education_requirements}}
- ניסיון: {{experience_requirements}}
- כישורים נדרשים: {{required_skills}}

העובד ידווח ל{{reports_to}}.

העובד אחראי על {{accountability}}.`,
    variables: ['job_title', 'department', 'responsibility1', 'responsibility2', 'responsibility3', 'education_requirements', 'experience_requirements', 'required_skills', 'reports_to', 'accountability'],
    aiPrompt: 'פרט את התפקיד בבהירות, כלול אחריות ודרישות',
    usageInstructions: 'השתמש לתיאור מפורט של תפקיד העבודה'
  },

  // שכר ותגמול
  {
    id: 'salary-structure',
    title: 'מבנה שכר ומשכורת',
    category: 'compensation',
    content: `שכר ומשכורת:

העובד יקבל שכר חודשי ברוטו בסך {{base_salary}} ש"ח.

השכר ישולם {{payment_schedule}} (תחילת החודש / סוף החודש / 15 בחודש).

עדכון שכר: השכר יעודכן {{salary_review}} (אחת לשנה / אחת לרבעון / אין עדכון אוטומטי).

תוספות לשכר:
- {{salary_addition1}}
- {{salary_addition2}}

הפרשות סוציאליות: {{social_benefits_description}}.`,
    variables: ['base_salary', 'payment_schedule', 'salary_review', 'salary_addition1', 'salary_addition2', 'social_benefits_description'],
    aiPrompt: 'פרט את מבנה השכר בבהירות, כלול כל התוספות',
    usageInstructions: 'השתמש להגדרת שכר ותגמול'
  },

  {
    id: 'performance-bonus',
    title: 'בונוס על בסיס ביצועים',
    category: 'compensation',
    content: `בונוס ביצועים:

בנוסף לשכר הבסיס, העובד יהיה זכאי לבונוס שנתי על בסיס ביצועים.

הבונוס יחושב על פי {{bonus_calculation}}.

קריטריונים למתן בונוס:
1. {{criterion1}}
2. {{criterion2}}
3. {{criterion3}}

טווח הבונוס: בין {{min_bonus}}% ל-{{max_bonus}}% מהשכר השנתי.

תשלום הבונוס יתבצע ב{{bonus_payment_time}}.

{{additional_bonus_terms}}`,
    variables: ['bonus_calculation', 'criterion1', 'criterion2', 'criterion3', 'min_bonus', 'max_bonus', 'bonus_payment_time', 'additional_bonus_terms'],
    aiPrompt: 'הגדר קריטריונים ברורים למתן בונוס, הדגש קשר לביצועים',
    usageInstructions: 'השתמש כאשר יש בונוס על בסיס ביצועים'
  },

  {
    id: 'stock-options',
    title: 'אופציות לעובדים',
    category: 'compensation',
    content: `אופציות לעובדים:

המעסיק מעניק לעובד אופציה לרכוש {{options_amount}} מניות של החברה במחיר מימוש של {{exercise_price}} ש"ח למניה.

תנאי הבשלה (Vesting):
- {{vesting_schedule}}
- Cliff period: {{cliff_period}}

תקופת המימוש: {{exercise_period}}.

תנאים מיוחדים:
- {{special_conditions}}

במקרה של הפסקת עבודה: {{termination_effect}}.`,
    variables: ['options_amount', 'exercise_price', 'vesting_schedule', 'cliff_period', 'exercise_period', 'special_conditions', 'termination_effect'],
    aiPrompt: 'הסבר את מנגנון האופציות בבהירות, כלול תנאי בשלה',
    usageInstructions: 'השתמש כאשר מעניקים אופציות לעובדים'
  },

  // הטבות נלוות
  {
    id: 'vacation-days',
    title: 'ימי חופשה ומחלה',
    category: 'benefits',
    content: `ימי חופשה ומחלה:

חופשה שנתית: העובד זכאי ל-{{vacation_days}} ימי חופשה בשנה.

צבירת ימי חופשה: {{vacation_accrual}}.

תיאום חופשות: {{vacation_coordination}}.

ימי מחלה: העובד זכאי ל-{{sick_days}} ימי מחלה בשנה.

אישור רפואי נדרש {{medical_certificate_requirement}}.

{{additional_leave_terms}}`,
    variables: ['vacation_days', 'vacation_accrual', 'vacation_coordination', 'sick_days', 'medical_certificate_requirement', 'additional_leave_terms'],
    aiPrompt: 'פרט את זכויות החופשה והמחלה בבהירות',
    usageInstructions: 'השתמש להגדרת ימי חופשה ומחלה'
  },

  {
    id: 'benefits-package',
    title: 'חבילת הטבות מקיפה',
    category: 'benefits',
    content: `הטבות נלוות:

המעסיק יספק לעובד את ההטבות הבאות:

1. ביטוחים:
   - ביטוח מנהלים: {{managers_insurance}}
   - קרן השתלמות: {{provident_fund}}
   - ביטוח אובדן כושר עבודה: {{disability_insurance}}

2. רכב: {{car_benefit}}

3. טלפון: {{phone_benefit}}

4. ארוחות: {{meals_benefit}}

5. {{additional_benefits}}

{{benefits_conditions}}`,
    variables: ['managers_insurance', 'provident_fund', 'disability_insurance', 'car_benefit', 'phone_benefit', 'meals_benefit', 'additional_benefits', 'benefits_conditions'],
    aiPrompt: 'פרט את חבילת ההטבות בצורה מקיפה, כלול תנאים',
    usageInstructions: 'השתמש לפירוט חבילת הטבות מקיפה'
  },

  {
    id: 'professional-development',
    title: 'השתלמויות והשכלה',
    category: 'benefits',
    content: `השתלמויות והשכלה:

המעסיק מעודד ותומך בהשתלמות מקצועית של העובד.

תקציב שנתי להשתלמויות: {{training_budget}} ש"ח.

סוגי קורסים נתמכים: {{supported_courses}}.

תנאי התמיכה:
- {{training_condition1}}
- {{training_condition2}}

ימי השתלמות: {{training_days}} ימים בשנה.

במקרה של התפטרות תוך {{commitment_period}}, העובד {{reimbursement_terms}}.`,
    variables: ['training_budget', 'supported_courses', 'training_condition1', 'training_condition2', 'training_days', 'commitment_period', 'reimbursement_terms'],
    aiPrompt: 'הדגש את חשיבות ההשתלמות, כלול תנאי החזר אם רלוונטי',
    usageInstructions: 'השתמש כאשר מספקים תמיכה בהשתלמות'
  },

  // תנאי עבודה
  {
    id: 'work-hours',
    title: 'שעות עבודה ונוכחות',
    category: 'work-conditions',
    content: `שעות עבודה:

משרה מלאה: {{full_time_hours}} שעות שבועיות.

ימי עבודה: {{work_days}}.

שעות עבודה: {{work_hours}}.

שעות נוספות: {{overtime_policy}}.

גמישות: {{flexibility}}.

עבודה מהבית: {{remote_work_policy}}.`,
    variables: ['full_time_hours', 'work_days', 'work_hours', 'overtime_policy', 'flexibility', 'remote_work_policy'],
    aiPrompt: 'פרט את שעות העבודה והגמישות בבהירות',
    usageInstructions: 'השתמש להגדרת שעות עבודה ונוכחות'
  },

  {
    id: 'remote-work-policy',
    title: 'מדיניות עבודה מרחוק',
    category: 'work-conditions',
    content: `עבודה מרחוק:

{{remote_work_allowed}} (מותר / אסור) לעובד לעבוד מרחוק.

תדירות עבודה מרחוק: {{remote_frequency}}.

תנאים:
- {{remote_condition1}}
- {{remote_condition2}}

ציוד: המעסיק {{equipment_provision}}.

שעות זמינות: {{availability_hours}}.

פגישות פנים אל פנים: {{in_person_meetings}}.`,
    variables: ['remote_work_allowed', 'remote_frequency', 'remote_condition1', 'remote_condition2', 'equipment_provision', 'availability_hours', 'in_person_meetings'],
    aiPrompt: 'התאם לעידן הקורונה, כלול ציפיות ברורות',
    usageInstructions: 'השתמש להגדרת מדיניות עבודה מרחוק'
  },

  // סודיות וקניין רוחני
  {
    id: 'confidentiality-agreement',
    title: 'התחייבות לסודיות',
    category: 'confidentiality',
    content: `סודיות:

העובד מתחייב לשמור בסודיות מוחלטת על {{confidential_information}}.

מידע סודי כולל: {{confidential_examples}}.

העובד לא יעביר, יפרסם או ישתמש במידע סודי {{confidentiality_restrictions}}.

ההתחייבות לסודיות תישאר בתוקף גם לאחר סיום העבודה {{post_employment_confidentiality}}.

הפרת סודיות תהווה הפרה יסודית של ההסכם ותזכה את המעסיק ב{{breach_consequences}}.`,
    variables: ['confidential_information', 'confidential_examples', 'confidentiality_restrictions', 'post_employment_confidentiality', 'breach_consequences'],
    aiPrompt: 'הדגש את חשיבות הסודיות, כלול הגדרות ברורות ותוצאות הפרה',
    usageInstructions: 'השתמש בכל הסכם עבודה להתחייבות סודיות'
  },

  {
    id: 'intellectual-property-assignment',
    title: 'הסבת זכויות קניין רוחני',
    category: 'intellectual-property',
    content: `קניין רוחני:

כל פיתוח, המצאה, יצירה או רעיון (להלן: "יצירות") ש{{employee_name}} יפתח במהלך עבודתו או בקשר אליה, יהיו בבעלות המעסיק הבלעדית.

העובד מסב בזאת למעסיק את כל זכויות היוצרים, הפטנטים והסודות המסחריים ב{{ip_scope}}.

העובד מתחייב לחתום על כל מסמך נדרש להשלמת הרישום ולסייע למעסיק {{cooperation_terms}}.

יצירות קודמות: העובד מצהיר כי {{prior_ip}}.

{{additional_ip_terms}}`,
    variables: ['employee_name', 'ip_scope', 'cooperation_terms', 'prior_ip', 'additional_ip_terms'],
    aiPrompt: 'הגן על קניין הרוחני של המעסיק, כלול הצהרה על יצירות קודמות',
    usageInstructions: 'השתמש בכל הסכם עבודה עם פיתוח טכנולוגי'
  },

  // איסור תחרות
  {
    id: 'non-compete-clause',
    title: 'התחייבות שלא להתחרות',
    category: 'non-compete',
    content: `איסור תחרות:

העובד מתחייב שלא לעבוד, במישרין או בעקיפין, עבור {{competitors}} במשך {{non_compete_period}} מיום סיום עבודתו.

האיסור חל על {{geographic_scope}}.

האיסור כולל {{activities_prohibited}}.

בתמורה להתחייבות זו, המעסיק {{consideration}}.

הפרת איסור תחרות תזכה את המעסיק ב{{breach_remedies}}.`,
    variables: ['competitors', 'non_compete_period', 'geographic_scope', 'activities_prohibited', 'consideration', 'breach_remedies'],
    aiPrompt: 'נסח התחייבות סבירה שתעמוד בביקורת שיפוטית, כלול תמורה',
    usageInstructions: 'השתמש בעובדים בכירים או בעלי גישה למידע רגיש'
  },

  {
    id: 'non-solicitation',
    title: 'התחייבות שלא לפנות ללקוחות ועובדים',
    category: 'non-compete',
    content: `איסור פנייה:

העובד מתחייב שלא לפנות, במישרין או בעקיפין, ללקוחות החברה במשך {{non_solicit_period}} מיום סיום עבודתו.

לקוחות כוללים: {{client_definition}}.

העובד מתחייב שלא לגייס עובדים של המעסיק {{employee_solicitation}}.

האיסור חל על {{solicitation_scope}}.

{{additional_non_solicit_terms}}`,
    variables: ['non_solicit_period', 'client_definition', 'employee_solicitation', 'solicitation_scope', 'additional_non_solicit_terms'],
    aiPrompt: 'הגן על לקוחות ועובדי המעסיק, נסח באופן סביר',
    usageInstructions: 'השתמש בעובדים עם קשר ללקוחות או עובדים'
  },

  // סיום עבודה
  {
    id: 'termination-notice',
    title: 'תקופת הודעה מוקדמת',
    category: 'termination',
    content: `תקופת הודעה מוקדמת:

כל צד רשאי לסיים את ההסכם בהודעה מוקדמת של {{notice_period}}.

תקופת ההודעה תתחיל {{notice_start}}.

במהלך תקופת ההודעה, העובד {{notice_period_obligations}}.

המעסיק רשאי {{employer_notice_options}}.

במקרה של הפסקה באמצע חודש, {{mid_month_termination}}.`,
    variables: ['notice_period', 'notice_start', 'notice_period_obligations', 'employer_notice_options', 'mid_month_termination'],
    aiPrompt: 'פרט את תקופת ההודעה והחובות בה בבהירות',
    usageInstructions: 'השתמש להגדרת תקופת הודעה מוקדמת'
  },

  {
    id: 'severance-pay',
    title: 'פיצויי פיטורין',
    category: 'termination',
    content: `פיצויי פיטורין:

במקרה של פיטורין או התפטרות העובד, {{severance_entitlement}}.

חישוב הפיצויים: {{severance_calculation}}.

תשלום הפיצויים יתבצע {{severance_payment_time}}.

קיזוז: {{severance_offset}}.

{{additional_severance_terms}}`,
    variables: ['severance_entitlement', 'severance_calculation', 'severance_payment_time', 'severance_offset', 'additional_severance_terms'],
    aiPrompt: 'הסבר את זכאות הפיצויים בבהירות, כלול חישוב ותשלום',
    usageInstructions: 'השתמש להגדרת פיצויי פיטורין'
  },

  {
    id: 'exit-process',
    title: 'הליך סיום העבודה',
    category: 'termination',
    content: `הליך סיום עבודה:

ביום סיום העבודה, העובד יבצע את השלבים הבאים:

1. החזרת ציוד: {{equipment_return}}

2. מסירת מידע ומסמכים: {{information_handover}}

3. מחיקת מידע מכשירים אישיים: {{data_deletion}}

4. סגירת חשבונות: {{account_closure}}

5. ראיון יציאה: {{exit_interview}}

{{final_settlement}}

חוסר שיתוף פעולה בהליך יזכה את המעסיק {{non_cooperation_consequence}}.`,
    variables: ['equipment_return', 'information_handover', 'data_deletion', 'account_closure', 'exit_interview', 'final_settlement', 'non_cooperation_consequence'],
    aiPrompt: 'פרט את הליך היציאה בסדר לוגי, הדגש החזרת ציוד ומחיקת מידע',
    usageInstructions: 'השתמש להגדרת הליך סיום עבודה מסודר'
  },

  // תנאים מיוחדים
  {
    id: 'probation-period',
    title: 'תקופת ניסיון',
    category: 'special',
    content: `תקופת ניסיון:

{{probation_period}} חודשים הראשונים יהוו תקופת ניסיון.

במהלך תקופת הניסיון:
- {{probation_terms1}}
- {{probation_terms2}}
- תקופת הודעה: {{probation_notice}}

הערכת ביצועים תתקיים ב{{evaluation_timing}}.

בסיום תקופת הניסיון בהצלחה, {{successful_probation}}.

{{probation_extension_option}}`,
    variables: ['probation_period', 'probation_terms1', 'probation_terms2', 'probation_notice', 'evaluation_timing', 'successful_probation', 'probation_extension_option'],
    aiPrompt: 'הגדר תקופת ניסיון ברורה, כלול הערכה ותנאים מיוחדים',
    usageInstructions: 'השתמש בתחילת כל הסכם עבודה חדש'
  },

  {
    id: 'relocation-terms',
    title: 'תנאי העברה למשרה אחרת',
    category: 'special',
    content: `העברה והעתקה:

המעסיק רשאי להעביר את העובד למשרה אחרת או למיקום אחר {{relocation_conditions}}.

במקרה של העברה:
- {{relocation_compensation}}
- {{relocation_assistance}}
- תקופת התארגנות: {{adjustment_period}}

העובד רשאי {{employee_relocation_rights}}.

{{additional_relocation_terms}}`,
    variables: ['relocation_conditions', 'relocation_compensation', 'relocation_assistance', 'adjustment_period', 'employee_relocation_rights', 'additional_relocation_terms'],
    aiPrompt: 'הגדר תנאי העברה הוגנים, כלול פיצוי או סיוע אם רלוונטי',
    usageInstructions: 'השתמש כאשר עשויה להיות העברה למיקום אחר'
  },

  {
    id: 'side-business-policy',
    title: 'מדיניות עבודה נוספת',
    category: 'special',
    content: `עבודה נוספת:

{{side_business_allowed}} (מותר / אסור) לעובד לעבוד בעבודה נוספת או לנהל עסק עצמאי.

במידה ומותר, התנאים הם:
- {{side_business_condition1}}
- {{side_business_condition2}}
- העובד יודיע למעסיק {{notification_requirement}}

אסור לעובד {{prohibited_activities}}.

הפרת הוראות אלו {{violation_consequence}}.`,
    variables: ['side_business_allowed', 'side_business_condition1', 'side_business_condition2', 'notification_requirement', 'prohibited_activities', 'violation_consequence'],
    aiPrompt: 'הגדר מדיניות ברורה, איזן בין חופש העובד להגנת המעסיק',
    usageInstructions: 'השתמש להגדרת מדיניות עבודות נוספות'
  }
];

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getEmploymentSectionsByCategory(category: string): EmploymentSectionTemplate[] {
  return employmentSectionsWarehouse.filter(section => section.category === category);
}

