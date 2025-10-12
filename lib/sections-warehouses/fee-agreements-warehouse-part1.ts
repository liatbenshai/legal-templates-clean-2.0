/**
 * מחסן הסכמי שכר טרחה - חלק 1: מבנה בסיסי ושעתי
 * הסכמים מקיפים לכל סוגי שכר הטרחה
 */

export interface FeeAgreementTemplate {
  id: string;
  title: string;
  category: 'hourly' | 'fixed' | 'contingency' | 'mixed' | 'retainer' | 'success-fee';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  legalBasis: string[];  // סעיפי חוק רלוונטיים
  warnings: string[];    // אזהרות והערות חשובות
}

export const hourlyFeeAgreements: FeeAgreementTemplate[] = [
  {
    id: 'hourly-fee-basic',
    title: 'הסכם שכר טרחה שעתי - בסיסי',
    category: 'hourly',
    content: `הסכם שכר טרחה

נכרת ונחתם ביום {{agreement_date}}

בין: {{client_name}}, ת.ז. {{client_id}}
      מ{{client_address}}
      (להלן: "הלקוח/ה")

לבין: עו"ד {{lawyer_name}}, מ.ר. {{lawyer_license}}
       מ{{lawyer_address}}
       טלפון: {{lawyer_phone}}
       דוא"ל: {{lawyer_email}}
       (להלן: "עורך/ת הדין")

**הואיל** והלקוח/ה פנה/תה לעורך/ת הדין בבקשה לייצגו/ה בעניין {{case_description}};

**והואיל** ועורך/ת הדין הסכים/ה לייצג את הלקוח/ה בכפוף לתנאים המפורטים להלן;

**לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:**

**1. נושא הייצוג**

1.1 עורך/ת הדין יייצג את הלקוח/ה בעניין הבא:
    {{matter_description}}

1.2 הייצוג כולל:
    {{#each services_included}}
    - {{this}}
    {{/each}}

1.3 הייצוג אינו כולל:
    {{#each services_excluded}}
    - {{this}}
    {{/each}}

**2. שכר הטרחה**

2.1 שכר הטרחה יחושב על בסיס שעתי.

2.2 התעריף השעתי הוא: {{hourly_rate}} ש"ח לשעה + מע"ם.

2.3 שעת עבודה כוללת:
    - עבודה משרדית
    - מחקר משפטי
    - כתיבת מסמכים
    - התכתבות עם הלקוח/ה
    - התכתבות עם הצד שכנגד
    - {{additional_billable_activities}}

2.4 זמן נסיעה {{travel_time_policy}}.

2.5 {{rounding_policy}}

**3. דיווח על שעות**

3.1 עורך/ת הדין ינהל/תנהל תיעוד מפורט של השעות.

3.2 הלקוח/ה יהיה/תהיה זכאי/ת לקבל דוח שעות {{reporting_frequency}}.

3.3 הדוח יכלול:
    - תאריך ושעה
    - תיאור הפעילות
    - משך הזמן
    - {{additional_report_details}}

**4. תשלומים**

4.1 עורך/ת הדין יגיש/תגיש חשבונית {{billing_frequency}}.

4.2 תנאי תשלום: {{payment_terms}} ימים ממועד החשבונית.

4.3 {{#if advance_payment}}
    הלקוח/ה ישלם/תשלם מראש סכום של {{advance_amount}} ש"ח כמקדמה.
    {{advance_terms}}
    {{/if}}

4.4 {{late_payment_policy}}

**5. הוצאות**

5.1 בנוסף לשכר הטרחה, הלקוח/ה ישא בהוצאות הבאות:
    - אגרות בית משפט
    - דמי משלוח
    - צילומים והדפסות
    - תרגומים
    - חוות דעת מומחים
    - {{additional_expenses}}

5.2 {{expense_approval_required}}

5.3 הוצאות יחויבו {{expense_billing_method}}.

**6. מקדמה לכיסוי הוצאות**

{{#if expense_retainer}}
6.1 הלקוח/ה יפקיד/תפקיד מקדמה בסך {{expense_retainer_amount}} ש"ח לכיסוי הוצאות.

6.2 המקדמה תוחזר בגמר הטיפול בניכוי הוצאות בפועל.
{{/if}}

**7. הערכת היקף השעות**

7.1 עורך/ת הדין מעריך/ה כי הטיפול בעניין ידרוש {{estimated_hours}} שעות עבודה.

7.2 הערכה זו אינה מחייבת והיקף בפועל עשוי להיות שונה.

7.3 {{update_estimate_policy}}

**8. תקרת שכר טרחה**

{{#if fee_cap}}
8.1 שכר הטרחה לא יעלה על {{maximum_fee}} ש"ח ללא אישור מראש של הלקוח/ה.
{{else}}
8.1 לא נקבעה תקרה לשכר הטרחה.
{{/if}}

**9. חובות עורך/ת הדין**

9.1 עורך/ת הדין מתחייב/ת:
    - לפעול במקצועיות ובמיומנות
    - לעדכן את הלקוח/ה {{update_frequency}}
    - לשמור על סודיות מוחלטת
    - {{additional_lawyer_obligations}}

**10. חובות הלקוח/ה**

10.1 הלקוח/ה מתחייב/ת:
     - לשלם את שכר הטרחה בזמן
     - למסור מידע מלא ונכון
     - לשתף פעולה עם עורך/ת הדין
     - {{additional_client_obligations}}

**11. סיום ההתקשרות**

11.1 כל צד רשאי להפסיק את ההתקשרות בהודעה של {{termination_notice}} ימים מראש.

11.2 במקרה של הפסקה:
     - ישולם שכר טרחה בעד עבודה שבוצעה
     - {{termination_terms}}

11.3 {{withdrawal_conditions}}

**12. בוררות ושיפוט**

12.1 {{dispute_resolution_method}}

12.2 {{jurisdiction}}

**13. כללי**

13.1 הסכם זה מהווה את מלוא ההסכמה בין הצדדים.

13.2 שינוי הסכם זה יעשה בכתב ובחתימת שני הצדדים.

13.3 {{additional_clauses}}

**ולראיה באו הצדדים על החתום:**

_______________          _______________
הלקוח/ה                עורך/ת הדין
תאריך: _______          תאריך: _______`,
    variables: [
      'agreement_date',
      'client_name', 'client_id', 'client_address',
      'lawyer_name', 'lawyer_license', 'lawyer_address', 'lawyer_phone', 'lawyer_email',
      'case_description', 'matter_description',
      'services_included', 'services_excluded',
      'hourly_rate',
      'additional_billable_activities',
      'travel_time_policy', 'rounding_policy',
      'reporting_frequency', 'additional_report_details',
      'billing_frequency', 'payment_terms',
      'advance_payment', 'advance_amount', 'advance_terms',
      'late_payment_policy',
      'additional_expenses',
      'expense_approval_required', 'expense_billing_method',
      'expense_retainer', 'expense_retainer_amount',
      'estimated_hours', 'update_estimate_policy',
      'fee_cap', 'maximum_fee',
      'update_frequency', 'additional_lawyer_obligations',
      'additional_client_obligations',
      'termination_notice', 'termination_terms', 'withdrawal_conditions',
      'dispute_resolution_method', 'jurisdiction',
      'additional_clauses'
    ],
    aiPrompt: 'נסח הסכם ברור ומקצועי, הדגש שקיפות בחיוב שעות, כלול כל התנאים הנדרשים',
    usageInstructions: 'השתמש בהסכמי שכר טרחה שעתי למקרים מורכבים שקשה להעריך מראש',
    legalBasis: [
      'חוק לשכת עורכי הדין, התשכ"א-1961',
      'תקנות לשכת עורכי הדין (אתיקה מקצועית), התשמ"ו-1986',
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'יש לציין בבירור מה נכלל ומה לא נכלל בשעות',
      'מומלץ לתת הערכת שעות אפילו שאינה מחייבת',
      'חובה לנהל תיעוד מפורט של כל שעה',
      'שקיפות בדיווח מונעת מחלוקות'
    ]
  },

  {
    id: 'hourly-fee-with-budget',
    title: 'הסכם שכר טרחה שעתי עם תקציב',
    category: 'hourly',
    content: `הסכם שכר טרחה - תעריף שעתי עם תקציב

[פרטי הצדדים כמו בהסכם בסיסי]

**2. שכר הטרחה ותקציב**

2.1 שכר הטרחה יחושב על בסיס תעריף שעתי של {{hourly_rate}} ש"ח + מע"ם.

2.2 התקציב המשוער לטיפול בעניין: {{estimated_budget}} ש"ח.

2.3 פירוט התקציב:
    {{#each budget_breakdown}}
    - {{this.item}}: {{this.estimated_hours}} שעות × {{hourly_rate}} = {{this.subtotal}} ש"ח
    {{/each}}

2.4 **אזהרה בעת חריגה מתקציב:**
    - כאשר שכר הטרחה מגיע ל-{{warning_threshold}}% מהתקציב, עורך/ת הדין יודיע/תודיע ללקוח/ה.
    - {{warning_procedure}}

2.5 **חריגה מהתקציב:**
    - חריגה מעל {{budget_overrun_threshold}}% מהתקציב תדרוש אישור מראש בכתב מהלקוח/ה.
    - ללא אישור, עורך/ת הדין לא יחרוג/תחרוג מהתקציב.

2.6 **סיבות אפשריות לחריגה:**
    הצדדים מודעים כי התקציב עשוי להשתנות עקב:
    - {{potential_overrun_reason_1}}
    - {{potential_overrun_reason_2}}
    - {{potential_overrun_reason_3}}

**3. דיווח ובקרה**

3.1 עורך/ת הדין יגיש/תגיש דוח שעות {{detailed_reporting_frequency}}.

3.2 הדוח יכלול:
    - שעות שהושקעו עד כה
    - יתרת תקציב
    - תחזית שעות נוספות
    - {{additional_tracking_details}}

3.3 הלקוח/ה רשאי/ת לבקש דוח ביניים בכל עת.

**4. התאמת תקציב**

4.1 הצדדים רשאים להתאים את התקציב בהסכמה בכתב.

4.2 {{budget_adjustment_procedure}}

**5. סיום טיפול לפני מיצוי תקציב**

5.1 אם הטיפול הסתיים לפני מיצוי התקציב, ישולם שכר טרחה רק בעד שעות בפועל.

5.2 {{early_completion_bonus}}`,
    variables: [
      'hourly_rate', 'estimated_budget', 'budget_breakdown',
      'warning_threshold', 'warning_procedure',
      'budget_overrun_threshold',
      'potential_overrun_reason_1', 'potential_overrun_reason_2', 'potential_overrun_reason_3',
      'detailed_reporting_frequency', 'additional_tracking_details',
      'budget_adjustment_procedure',
      'early_completion_bonus'
    ],
    aiPrompt: 'הדגש את חשיבות התקציב והבקרה, ציין בבירור נהלי חריגה ואישורים',
    usageInstructions: 'השתמש כאשר הלקוח רוצה שליטה ובקרה על עלויות בתעריף שעתי',
    legalBasis: [
      'חוק לשכת עורכי הדין, התשכ"א-1961',
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'יש לעדכן את הלקוח בזמן אמת על מצב התקציב',
      'חריגה ללא אישור עלולה להוביל לאי-תשלום',
      'תיעוד קפדני של סיבות לחריגה חיוני'
    ]
  },

  {
    id: 'hourly-fee-different-rates',
    title: 'הסכם שכר טרחה שעתי - תעריפים מדורגים',
    category: 'hourly',
    content: `הסכם שכר טרחה - תעריפים שעתיים מדורגים

[פרטי הצדדים כמו בהסכם בסיסי]

**2. שכר טרחה - תעריפים מדורגים**

2.1 שכר הטרחה יחושב על פי תעריפים שעתיים מדורגים כדלקמן:

**2.2 תעריפים לפי סוג עבודה:**

{{#each service_rates}}
**{{this.service_name}}:**
- תעריף: {{this.rate}} ש"ח לשעה + מע"ם
- כולל: {{this.description}}
{{/each}}

**2.3 תעריפים לפי בכיר הצוות:**

{{#if team_based_rates}}
- עורך/ת דין בכיר/ה: {{senior_rate}} ש"ח לשעה
- עורך/ת דין: {{associate_rate}} ש"ח לשעה
- מתמחה: {{intern_rate}} ש"ח לשעה
- עוזר/ת משפטי/ת: {{paralegal_rate}} ש"ח לשעה
{{/if}}

**2.4 תעריף מיוחד לפעולות מסוימות:**

{{#each special_rates}}
- {{this.activity}}: {{this.rate}} ש"ח {{this.unit}}
{{/each}}

**2.5 הנחות:**

{{#if volume_discount}}
- בעבודה העולה על {{discount_threshold}} שעות לחודש: הנחה של {{discount_percentage}}%
{{/if}}

{{#if loyalty_discount}}
- ללקוחות קבועים: {{loyalty_discount_terms}}
{{/if}}

**3. הקצאת עבודה**

3.1 עורך/ת הדין יקצה/תקצה עבודות לפי רמת הסיבוכיות:
    - עבודות שגרתיות: {{routine_assignment}}
    - עבודות מורכבות: {{complex_assignment}}

3.2 {{efficiency_commitment}}

**4. דוח שעות מפורט**

4.1 הדוח יפרט:
    - שם מבצע/ת העבודה
    - תעריפו/ה
    - סוג העבודה
    - זמן שהושקע
    - חישוב עלות

**5. אופטימיזציה של עלויות**

5.1 עורך/ת הדין מתחייב/ת להשתמש בצוות בצורה יעילה ולמזער עלויות.

5.2 {{cost_optimization_measures}}`,
    variables: [
      'service_rates',
      'team_based_rates', 'senior_rate', 'associate_rate', 'intern_rate', 'paralegal_rate',
      'special_rates',
      'volume_discount', 'discount_threshold', 'discount_percentage',
      'loyalty_discount', 'loyalty_discount_terms',
      'routine_assignment', 'complex_assignment',
      'efficiency_commitment',
      'cost_optimization_measures'
    ],
    aiPrompt: 'הסבר בבירור את הבדלי התעריפים, הצדק את המדרגיות, הדגש יעילות',
    usageInstructions: 'השתמש במשרדים גדולים או במקרים עם עבודות מגוונות',
    legalBasis: [
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'יש להצדיק הבדלי תעריפים בצורה סבירה',
      'חשוב לתעד מי ביצע כל משימה',
      'הקצאה לא יעילה עלולה להיחשב כחוסר תום לב'
    ]
  }
];

