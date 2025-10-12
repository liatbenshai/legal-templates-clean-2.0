/**
 * מחסן הסכמי שכר טרחה - חלק 3: מעורב, קבלנים והסכמים מיוחדים
 */

import { FeeAgreementTemplate } from './fee-agreements-warehouse-part1';

export const mixedAndSpecialFeeAgreements: FeeAgreementTemplate[] = [
  {
    id: 'retainer-monthly',
    title: 'הסכם קבלן - שכר טרחה חודשי קבוע',
    category: 'retainer',
    content: `הסכם קבלן - שירותים משפטיים שוטפים

נכרת ונחתם ביום {{agreement_date}}

בין: {{client_name}} {{#if client_company}}(ח.פ. {{client_company_id}}){{/if}}
      (להלן: "הלקוח/ה")

לבין: עו"ד {{lawyer_name}}, מ.ר. {{lawyer_license}}
       (להלן: "עורך/ת הדין")

**הואיל** והלקוח/ה זקוק/ה לשירותים משפטיים שוטפים;

**והואיל** והצדדים מעוניינים בהסדר קבלנות חודשי;

**לפיכך הוסכם והותנה כדלקמן:**

**1. השירותים הכלולים**

1.1 עורך/ת הדין יספק/תספק ללקוח/ה שירותים משפטיים שוטפים בתחומים הבאים:
    {{#each practice_areas}}
    - {{this}}
    {{/each}}

1.2 השירותים כוללים:
    {{#each services_included}}
    - {{this.service}}: עד {{this.limit}}
    {{/each}}

**1.3 היקף זמינות:**

- ימים: {{available_days}}
- שעות: {{available_hours}}
- {{response_time_commitment}}

**2. התשלום החודשי**

2.1 הלקוח/ה ישלם/תשלם דמי קבלן חודשיים בסך: **{{monthly_retainer}} ש"ח + מע"ם**.

2.2 התשלום יבוצע {{payment_date}} לכל חודש מראש.

2.3 {{#if minimum_commitment}}
    תקופת התחייבות מינימלית: {{minimum_months}} חודשים.
    {{/if}}

**3. מכסת שעות**

{{#if hours_included}}
3.1 דמי הקבלן כוללים עד {{included_hours}} שעות עבודה לחודש.

3.2 **חריגה ממכסה:**
    - שעות נוספות מעבר למכסה: {{overage_rate}} ש"ח לשעה
    - {{overage_notification}}

3.3 **מכסה שלא נוצלה:**
    {{unused_hours_policy}}
{{else}}
3.1 דמי הקבלן כוללים זמינות ושירותים ללא הגבלת שעות בתחומים המוגדרים.
{{/if}}

**4. שירותים שאינם כלולים**

4.1 השירותים הבאים אינם כלולים ויחוייבו בנפרד:
    {{#each excluded_services}}
    - {{this.service}}: {{this.fee_basis}}
    {{/each}}

4.2 {{major_litigation_terms}}

**5. דיווח**

5.1 עורך/ת הדין יגיש/תגיש דוח חודשי הכולל:
    - סיכום פעילויות
    {{#if hours_included}}- שעות שהושקעו{{/if}}
    - עניינים שטופלו
    - עניינים בהמתנה
    - המלצות

**6. יתרונות ההסכם**

6.1 **ללקוח/ה:**
    - עלויות חודשיות צפויות
    - זמינות מובטחת של עורך/ת דין
    - תכנון תקציבי
    - {{client_advantage_4}}

6.2 **לעורך/ת הדין:**
    - הכנסה קבועה וצפויה
    - יחסים ארוכי טווח
    - {{lawyer_advantage_3}}

**7. הפסקת ההסכם**

7.1 לאחר תקופת ההתחייבות, ניתן להפסיק בהודעה של {{notice_period}} ימים.

7.2 {{early_termination_terms}}

7.3 {{#if termination_fee}}
    דמי הפסקה מוקדמת: {{early_termination_fee}}
    {{/if}}

**8. שינוי דמי הקבלן**

8.1 דמי הקבלן יוכלו להשתנות {{rate_adjustment_terms}}.

8.2 שינוי ייכנס לתוקף {{rate_change_notice}}.

**9. ייעוץ טלפוני ואימייל**

9.1 ייעוץ טלפוני ואימייל {{phone_email_terms}}.

**10. ישיבות**

10.1 {{meeting_policy}}

**11. סודיות ונאמנות**

11.1 עורך/ת הדין ישמור/תשמור על סודיות מוחלטת.

11.2 {{conflict_of_interest_terms}}

**12. עדכון רציף**

12.1 עורך/ת הדין יעדכן/תעדכן את הלקוח/ה {{update_frequency}}.

[חתימות]`,
    variables: [
      'agreement_date',
      'client_name', 'client_company', 'client_company_id',
      'lawyer_name', 'lawyer_license',
      'practice_areas', 'services_included',
      'available_days', 'available_hours', 'response_time_commitment',
      'monthly_retainer', 'payment_date',
      'minimum_commitment', 'minimum_months',
      'hours_included', 'included_hours',
      'overage_rate', 'overage_notification',
      'unused_hours_policy',
      'excluded_services', 'major_litigation_terms',
      'client_advantage_4', 'lawyer_advantage_3',
      'notice_period', 'early_termination_terms',
      'termination_fee', 'early_termination_fee',
      'rate_adjustment_terms', 'rate_change_notice',
      'phone_email_terms', 'meeting_policy',
      'conflict_of_interest_terms', 'update_frequency'
    ],
    aiPrompt: 'הדגש יתרונות לשני הצדדים, פרט בדיוק מה כלול ומה לא, כלול מדיניות ברורה לחריגות',
    usageInstructions: 'השתמש ללקוחות עסקיים הזקוקים לשירותים משפטיים שוטפים',
    legalBasis: [
      'חוק לשכת עורכי הדין, התשכ"א-1961',
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'חשוב להגדיר בדיוק מה כלול ומה לא',
      'יש לבחון האם מכסת שעות מתאימה',
      'מומלץ לתעד כל פעילות גם בקבלן',
      'שימו לב למצבים של ניגוד עניינים'
    ]
  },

  {
    id: 'mixed-fee-hourly-success',
    title: 'הסכם שכר טרחה מעורב - שעתי + הצלחה',
    category: 'mixed',
    content: `הסכם שכר טרחה מעורב - שילוב שעתי והצלחה

[פרטי צדדים]

**2. מבנה שכר הטרחה המעורב**

**2.1 רכיב שעתי מופחת:**

- תעריף שעתי מופחת: {{reduced_hourly_rate}} ש"ח לשעה
  (במקום התעריף הרגיל של {{regular_hourly_rate}} ש"ח)

- {{hourly_cap}}

**2.2 רכיב מבוסס הצלחה:**

בנוסף לשכר הטרחה השעתי, במקרה של הצלחה:
- {{success_percentage}}% מהסכום שיושג
  או
- {{success_fixed_amount}} ש"ח

לפי {{success_calculation_method}}.

**2.3 הגדרת "הצלחה":**

{{success_definition}}

**2.4 סכום מינימלי להצלחה:**

{{#if minimum_success}}
רכיב ההצלחה יופעל רק אם יושג סכום של {{minimum_success_amount}} ש"ח או יותר.
{{/if}}

**3. דוגמה לחישוב**

**תרחיש 1: הצלחה מלאה**
- שעות עבודה: {{example_hours}} שעות
- שכר טרחה שעתי: {{example_hours}} × {{reduced_hourly_rate}} = {{example_hourly_total}} ש"ח
- סכום שהושג: {{example_recovery}} ש"ח
- רכיב הצלחה: {{success_percentage}}% × {{example_recovery}} = {{example_success_fee}} ש"ח
- **סה"כ שכר טרחה: {{example_total_success}} ש"ח**

**תרחיש 2: ללא הצלחה**
- שעות עבודה: {{example_hours}} שעות
- **סה"כ שכר טרחה: {{example_hourly_total}} ש"ח** (שעתי בלבד)

**4. יתרונות המודל המעורב**

4.1 **ללקוח/ה:**
    - עורך/ת הדין מקבל/ת תגמול גם ללא הצלחה מלאה
    - שכר הטרחה השעתי נמוך מהרגיל
    - שיתוף סיכון הוגן
    - {{client_mixed_advantage}}

4.2 **לעורך/ת הדין:**
    - כיסוי חלקי של עלויות גם ללא הצלחה
    - פוטנציאל לשכר טרחה משמעותי בהצלחה
    - {{lawyer_mixed_advantage}}

**5. תשלומים**

5.1 שכר הטרחה השעתי ישולם {{hourly_payment_schedule}}.

5.2 רכיב ההצלחה ישולם {{success_payment_timing}}.

**6. תקרה כוללת**

{{#if total_cap}}
6.1 סך שכר הטרחה (שעתי + הצלחה) לא יעלה על {{maximum_total_fee}} ש"ח.
{{/if}}

**7. הסכם פשרה**

7.1 במקרה של פשרה:
    {{settlement_terms}}

[סעיפים נוספים]`,
    variables: [
      'reduced_hourly_rate', 'regular_hourly_rate', 'hourly_cap',
      'success_percentage', 'success_fixed_amount', 'success_calculation_method',
      'success_definition',
      'minimum_success', 'minimum_success_amount',
      'example_hours', 'example_hourly_total',
      'example_recovery', 'example_success_fee', 'example_total_success',
      'client_mixed_advantage', 'lawyer_mixed_advantage',
      'hourly_payment_schedule', 'success_payment_timing',
      'total_cap', 'maximum_total_fee',
      'settlement_terms'
    ],
    aiPrompt: 'הסבר את החלוקה ההוגנת של הסיכון, הדגם בדוגמאות מספריות, הבהר יתרונות לשני הצדדים',
    usageInstructions: 'השתמש במקרים בינוניים - לא ברור אם יצליחו אך יש עבודה משמעותית',
    legalBasis: [
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'יש לאזן נכון בין שעתי להצלחה',
      'תעריף שעתי מופחת חייב להיות סביר',
      'חשוב להגדיר במדויק מתי ההצלחה נחשבת',
      'תיעוד שעות נשאר חיוני'
    ]
  },

  {
    id: 'mixed-fee-fixed-success',
    title: 'הסכם מעורב - קבוע + הצלחה',
    category: 'mixed',
    content: `הסכם שכר טרחה מעורב - תשלום קבוע + בונוס הצלחה

[פרטי צדדים]

**2. מבנה שכר הטרחה**

**2.1 תשלום קבוע בסיסי:**

הלקוח/ה ישלם/תשלם סכום קבוע של: **{{base_fixed_fee}} ש"ח + מע"ם**

סכום זה {{base_fee_description}}.

לוח תשלומים:
{{#each base_payment_schedule}}
- {{this.milestone}}: {{this.amount}} ש"ח
{{/each}}

**2.2 בונוס הצלחה:**

במקרה של {{success_trigger}}, ישולם בונוס נוסף:

{{#if percentage_bonus}}
- {{success_bonus_percentage}}% מ{{success_calculation_base}}
{{/if}}

{{#if fixed_bonus}}
- סכום קבוע של {{success_bonus_fixed}} ש"ח
{{/if}}

{{#if tiered_bonus}}
לפי מדרגות:
{{#each bonus_structure}}
- {{this.condition}}: {{this.bonus}}
{{/each}}
{{/if}}

**2.3 סכום כולל מרבי:**

{{#if maximum_total}}
סך שכר הטרחה (קבוע + בונוס) לא יעלה על {{max_total_fee}} ש"ח.
{{/if}}

**3. הגדרות**

3.1 "הצלחה מלאה": {{full_success_definition}}

3.2 "הצלחה חלקית": {{partial_success_definition}}

3.3 בסיס לחישוב הבונוס: {{bonus_base_definition}}

**4. דוגמאות**

**תרחיש A: {{scenario_a_description}}**
- תשלום קבוע: {{base_fixed_fee}} ש"ח
- בונוס: {{scenario_a_bonus}} ש"ח
- **סה"כ: {{scenario_a_total}} ש"ח**

**תרחיש B: {{scenario_b_description}}**
- תשלום קבוע: {{base_fixed_fee}} ש"ח
- בונוס: {{scenario_b_bonus}} ש"ח
- **סה"כ: {{scenario_b_total}} ש"ח**

**תרחיש C: {{scenario_c_description}}**
- תשלום קבוע: {{base_fixed_fee}} ש"ח
- בונוס: 0 ש"ח
- **סה"כ: {{base_fixed_fee}} ש"ח**

**5. החזר בגין כישלון**

{{#if failure_refund}}
5.1 אם {{failure_condition}}, יוחזר ללקוח/ה {{refund_amount}} ש"ח מהתשלום הקבוע.
{{else}}
5.1 התשלום הקבוע אינו מוחזר גם במקרה של כישלון מוחלט.
{{/if}}

**6. מתי משולם הבונוס**

6.1 הבונוס יקבע ו{{bonus_determination_timing}}.

6.2 התשלום יבוצע {{bonus_payment_timing}}.

[סעיפים נוספים]`,
    variables: [
      'base_fixed_fee', 'base_fee_description', 'base_payment_schedule',
      'success_trigger',
      'percentage_bonus', 'success_bonus_percentage', 'success_calculation_base',
      'fixed_bonus', 'success_bonus_fixed',
      'tiered_bonus', 'bonus_structure',
      'maximum_total', 'max_total_fee',
      'full_success_definition', 'partial_success_definition', 'bonus_base_definition',
      'scenario_a_description', 'scenario_a_bonus', 'scenario_a_total',
      'scenario_b_description', 'scenario_b_bonus', 'scenario_b_total',
      'scenario_c_description',
      'failure_refund', 'failure_condition', 'refund_amount',
      'bonus_determination_timing', 'bonus_payment_timing'
    ],
    aiPrompt: 'הסבר את האיזון בין ודאות לתמריץ, השתמש בדוגמאות ברורות, הדגש הגינות',
    usageInstructions: 'מתאים לעסקאות, משא ומתן, פרויקטים עם תוצאה ניתנת למדידה',
    legalBasis: [
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'התשלום הקבוע חייב להיות סביר בפני עצמו',
      'יש להגדיר במדויק מה נחשב "הצלחה"',
      'הבונוס צריך להיות פרופורציונלי'
    ]
  },

  {
    id: 'value-billing',
    title: 'הסכם שכר טרחה מבוסס ערך',
    category: 'mixed',
    content: `הסכם שכר טרחה מבוסס ערך (Value-Based Billing)

[פרטי צדדים]

**1. גישת חיוב מבוססת ערך**

1.1 שכר הטרחה ייקבע על בסיס הערך שנוצר ללקוח/ה ולא על בסיס שעות או תעריפים קבועים.

1.2 עקרון: {{value_billing_principle}}

**2. הערך הצפוי**

2.1 הצדדים מסכימים כי הערך הצפוי של הטיפול המשפטי הוא:
    {{#each expected_values}}
    - {{this.value_type}}: {{this.estimated_value}}
    {{/each}}

2.2 סך הערך הצפוי: {{total_expected_value}} ש"ח / {{total_expected_value_description}}.

**3. שכר הטרחה**

3.1 שכר הטרחה ייקבע כ**{{value_percentage}}%** מהערך שנוצר בפועל.

3.2 חישוב הערך:
    {{value_calculation_method}}

**3.3 מדדים למדידת ערך:**

{{#each value_metrics}}
- {{this.metric}}: {{this.measurement_method}}
  משקל: {{this.weight}}%
{{/each}}

**4. שכר טרחה מינימלי ומקסימלי**

4.1 שכר טרחה מינימלי: {{minimum_fee}} ש"ח
    (גם אם הערך שנוצר נמוך)

4.2 {{#if maximum_fee}}
    שכר טרחה מקסימלי: {{maximum_fee}} ש"ח
    {{/if}}

**5. תשלום ביניים**

5.1 במהלך הטיפול ישולמו תשלומי ביניים:
    {{#each interim_payments}}
    - {{this.stage}}: {{this.amount}} ש"ח
    {{/each}}

5.2 תשלומי הביניים {{interim_payments_treatment}}.

**6. התאמה סופית**

6.1 בסיום הטיפול ייקבע הערך הסופי שנוצר.

6.2 שכר הטרחה הסופי יחושב לפי {{final_calculation}}.

6.3 {{adjustment_mechanism}}

**7. דוגמה לחישוב**

אם נוצר ערך של {{example_value_created}} ש"ח:
- שכר טרחה: {{value_percentage}}% × {{example_value_created}} = {{example_fee}} ש"ח
- {{#if minimum_applies}}(מינימום {{minimum_fee}} ש"ח){{/if}}

**8. שיתוף מידע**

8.1 הלקוח/ה מתחייב/ת לשתף את עורך/ת הדין במידע הדרוש לקביעת הערך:
    {{information_sharing_commitment}}

**9. יתרונות**

9.1 **ללקוח/ה:**
    - שכר טרחה משקף תועלת אמיתית
    - תמריץ לעורך/ת הדין למקסם ערך
    - {{value_client_benefit}}

9.2 **לעורך/ת הדין:**
    - תגמול הולם לערך שנוצר
    - חופש במתודולוגיית העבודה
    - {{value_lawyer_benefit}}

**10. קביעת מחלוקות**

10.1 במקרה של מחלוקת על הערך שנוצר:
    {{dispute_resolution_value}}

[סעיפים נוספים]`,
    variables: [
      'value_billing_principle',
      'expected_values', 'total_expected_value', 'total_expected_value_description',
      'value_percentage',
      'value_calculation_method',
      'value_metrics',
      'minimum_fee', 'maximum_fee',
      'interim_payments', 'interim_payments_treatment',
      'final_calculation', 'adjustment_mechanism',
      'example_value_created', 'example_fee', 'minimum_applies',
      'information_sharing_commitment',
      'value_client_benefit', 'value_lawyer_benefit',
      'dispute_resolution_value'
    ],
    aiPrompt: 'הסבר את הגישה החדשנית, הדגש קשר בין ערך לתשלום, כלול מדדים מדידים',
    usageInstructions: 'מתאים לעסקאות מורכבות, ייעוץ אסטרטגי, מקרים בהם הערך ניתן למדידה',
    legalBasis: [
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'דורש מערכת יחסים של אמון',
      'חשוב להגדיר מדדים מדידים',
      'מתאים ללקוחות מתוחכמים',
      'יש לתעד היטב את הערך שנוצר'
    ]
  },

  {
    id: 'subscription-legal-services',
    title: 'הסכם מנוי לשירותים משפטיים',
    category: 'retainer',
    content: `הסכם מנוי לשירותים משפטיים

[פרטי צדדים]

**1. מודל המנוי**

1.1 הלקוח/ה מנוי/ה לשירותים משפטיים בחבילה: **{{package_name}}**

**2. חבילות מנוי**

{{#if bronze_package}}
**חבילת ברונזה:** {{bronze_price}} ש"ח לחודש
כוללת:
{{#each bronze_features}}
- {{this}}
{{/each}}
{{/if}}

{{#if silver_package}}
**חבילת כסף:** {{silver_price}} ש"ח לחודש
כוללת:
{{#each silver_features}}
- {{this}}
{{/each}}
{{/if}}

{{#if gold_package}}
**חבילת זהב:** {{gold_price}} ש"ח לחודש
כוללת:
{{#each gold_features}}
- {{this}}
{{/each}}
{{/if}}

**3. החבילה שנבחרה**

3.1 הלקוח/ה בחר/ה בחבילת: {{selected_package}}

3.2 דמי המנוי: {{subscription_fee}} ש"ח לחודש

3.3 {{subscription_billing_details}}

**4. שירותים נוספים**

4.1 שירותים מעבר לחבילה יחוייבו בנפרד:
    {{additional_services_pricing}}

4.2 {{upgrade_downgrade_policy}}

**5. ביטול והקפאה**

5.1 ביטול: {{cancellation_policy}}

5.2 הקפאה: {{pause_policy}}

[סעיפים נוספים]`,
    variables: [
      'package_name',
      'bronze_package', 'bronze_price', 'bronze_features',
      'silver_package', 'silver_price', 'silver_features',
      'gold_package', 'gold_price', 'gold_features',
      'selected_package', 'subscription_fee', 'subscription_billing_details',
      'additional_services_pricing',
      'upgrade_downgrade_policy',
      'cancellation_policy', 'pause_policy'
    ],
    aiPrompt: 'הצג בצורה שיווקית וברורה, הדגש יתרונות כל חבילה, כלול גמישות',
    usageInstructions: 'מודל חדשני ללקוחות פרטיים או עסקים קטנים',
    legalBasis: [
      'חוק לשכת עורכי הדין, התשכ"א-1961'
    ],
    warnings: [
      'יש לוודא שהשירותים המוצעים הולמים את דמי המנוי',
      'חשוב להגדיר גבולות ברורים',
      'מומלץ לכלול תקופת ניסיון'
    ]
  }
];

