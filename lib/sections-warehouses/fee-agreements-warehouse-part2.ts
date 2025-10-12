/**
 * מחסן הסכמי שכר טרחה - חלק 2: תעריף קבוע ושכר הצלחה
 */

import { FeeAgreementTemplate } from './fee-agreements-warehouse-part1';

export const fixedAndSuccessFeeAgreements: FeeAgreementTemplate[] = [
  {
    id: 'fixed-fee-basic',
    title: 'הסכם שכר טרחה קבוע',
    category: 'fixed',
    content: `הסכם שכר טרחה - תעריף קבוע (Flat Fee)

נכרת ונחתם ביום {{agreement_date}}

בין: {{client_name}}, ת.ז. {{client_id}}
      (להלן: "הלקוח/ה")

לבין: עו"ד {{lawyer_name}}, מ.ר. {{lawyer_license}}
       (להלן: "עורך/ת הדין")

**1. נושא הייצוג**

1.1 עורך/ת הדין יייצג את הלקוח/ה בעניין {{matter_description}}.

1.2 הטיפול כולל את השירותים הבאים:
    {{#each services_included}}
    - {{this}}
    {{/each}}

1.3 הטיפול אינו כולל:
    {{#each services_excluded}}
    - {{this}}
    {{/each}}

**2. שכר הטרחה הקבוע**

2.1 שכר הטרחה לטיפול המלא בעניין הוא סכום קבוע של: **{{fixed_fee}} ש"ח + מע"ם**.

2.2 סכום זה סופי ולא ישתנה, בכפוף לסעיף 2.6 להלן.

2.3 שכר הטרחה כולל:
    - כל העבודה הנדרשת להשלמת העניין
    - מספר שעות לא מוגבל
    - {{included_in_fixed_fee}}

2.4 שכר הטרחה אינו כולל הוצאות בפועל (אגרות, מומחים וכו').

**2.5 לוח תשלומים:**

{{#if payment_schedule}}
{{#each payment_milestones}}
- {{this.milestone}}: {{this.amount}} ש"ח - {{this.due_date}}
{{/each}}
{{else}}
התשלום יבוצע {{payment_timing}}.
{{/if}}

**2.6 שינויים בהיקף העבודה:**

אם יחול שינוי מהותי בהיקף העבודה עקב:
- {{scope_change_trigger_1}}
- {{scope_change_trigger_2}}
- {{scope_change_trigger_3}}

הצדדים ידונו בהתאמת שכר הטרחה.

**3. הוצאות נוספות**

3.1 בנוסף לשכר הטרחה, הלקוח/ה ישא בהוצאות בפועל:
    {{#each reimbursable_expenses}}
    - {{this}}
    {{/each}}

3.2 הוצאות אלה יחוייבו {{expense_billing_method}}.

**4. מה קורה בסיום מוקדם?**

4.1 אם הלקוח/ה מפסיק/ה את ההתקשרות:
    {{early_termination_refund_policy}}

4.2 אם העניין מסתיים מוקדם מסיבות שאינן תלויות בעורך/ת הדין:
    {{matter_resolution_policy}}

**5. התחייבויות עורך/ת הדין**

5.1 עורך/ת הדין מתחייב/ת להשקיע את הזמן והמאמץ הנדרשים להשלמת העניין.

5.2 {{performance_commitment}}

**6. יתרונות התעריף הקבוע**

6.1 הלקוח/ה יודע/ת מראש את העלות המדויקת.

6.2 אין צורך בדיווח שעתי.

6.3 {{additional_benefits}}

**7. תוצאה**

7.1 שכר הטרחה אינו מותנה בתוצאה {{#if result_based}}, אלא אם כן {{result_condition}}{{/if}}.

7.2 {{result_disclaimer}}

[סעיפים כלליים כמו בהסכם הבסיסי]`,
    variables: [
      'agreement_date',
      'client_name', 'client_id',
      'lawyer_name', 'lawyer_license',
      'matter_description',
      'services_included', 'services_excluded',
      'fixed_fee',
      'included_in_fixed_fee',
      'payment_schedule', 'payment_milestones', 'payment_timing',
      'scope_change_trigger_1', 'scope_change_trigger_2', 'scope_change_trigger_3',
      'reimbursable_expenses', 'expense_billing_method',
      'early_termination_refund_policy',
      'matter_resolution_policy',
      'performance_commitment',
      'additional_benefits',
      'result_based', 'result_condition', 'result_disclaimer'
    ],
    aiPrompt: 'הדגש את הוודאות והפשטות של תעריף קבוע, הסבר מתי ואיך ישתנה, כלול מדיניות החזרים',
    usageInstructions: 'השתמש בעניינים שגרתיים וצפויים - גירושין בהסכמה, עסקאות פשוטות, צוואות',
    legalBasis: [
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'יש להעריך היטב את היקף העבודה לפני הצעת תעריף קבוע',
      'חשוב להגדיר בדיוק מה כלול ומה לא',
      'מומלץ להוסיף סעיף לשינויים מהותיים בהיקף'
    ]
  },

  {
    id: 'success-fee-contingency',
    title: 'הסכם שכר טרחה מותנה בהצלחה - אחוזים',
    category: 'contingency',
    content: `הסכם שכר טרחה - מותנה בהצלחה (Contingency Fee)

נכרת ונחתם ביום {{agreement_date}}

בין: {{client_name}}, ת.ז. {{client_id}}
      (להלן: "הלקוח/ה")

לבין: עו"ד {{lawyer_name}}, מ.ר. {{lawyer_license}}
       (להלן: "עורך/ת הדין")

**הואיל** והלקוח/ה מעוניין/ת בייצוג בתביעה/עניין {{case_description}};

**והואיל** והצדדים מעוניינים לקשור את שכר הטרחה להצלחה בעניין;

**לפיכך הוסכם והותנה כדלקמן:**

**1. נושא הייצוג**

1.1 עורך/ת הדין יייצג את הלקוח/ה ב{{matter_type}}.

1.2 סכום התביעה/העניין: {{claim_amount}} ש"ח.

**2. שכר טרחה מותנה בהצלחה**

2.1 שכר הטרחה יחושב כ**{{percentage}}% מהסכום שיושג בפועל**.

2.2 "סכום שיושג" משמעו:
    {{#if gross_or_net}}
    - {{recovery_definition}}
    {{else}}
    - כל סכום שיתקבל מהצד שכנגד
    - בין במסגרת פסק דין, הסדר פשרה או בכל דרך אחרת
    {{/if}}

**2.3 מדרגות שכר טרחה:**

{{#if tiered_percentage}}
שכר הטרחה יחושב לפי מדרגות:
{{#each percentage_tiers}}
- עד {{this.threshold}} ש"ח: {{this.percentage}}%
- מעל {{this.threshold}} ש"ח: {{this.percentage}}%
{{/each}}
{{/if}}

**2.4 הצלחה חלקית:**

{{#if partial_success}}
- אם יושג {{partial_threshold}}% או יותר מסכום התביעה, ייחשב כהצלחה מלאה
- אם יושג פחות מ-{{partial_threshold}}%: {{partial_success_terms}}
{{/if}}

**3. ללא הצלחה - ללא תשלום**

3.1 **אם לא יושג כל סכום**, הלקוח/ה לא ישלם/תשלם שכר טרחה.

3.2 {{#if minimum_recovery}}
    **סכום מינימלי להפעלת שכר טרחה:** אם הסכום שיושג נמוך מ-{{minimum_amount}} ש"ח, לא ישולם שכר טרחה.
    {{/if}}

**4. הוצאות**

4.1 **במקרה של הצלחה:**
    {{success_expenses_policy}}

4.2 **במקרה של כישלון:**
    {{failure_expenses_policy}}

4.3 הוצאות מיוחדות (חוות דעת, מומחים):
    {{special_expenses_policy}}

**5. מקדמה**

{{#if advance_required}}
5.1 הלקוח/ה ישלם/תשלם מקדמה של {{advance_amount}} ש"ח.

5.2 {{advance_treatment}}
{{else}}
5.1 לא נדרשת מקדמה.
{{/if}}

**6. הגדרת "הצלחה"**

6.1 "הצלחה" לצורך הסכם זה משמעה:
    {{success_definition}}

6.2 הצלחה תיקבע {{success_determination_method}}.

**7. פשרה והסדרים**

7.1 כל הצעת פשרה או הסדר תידון עם הלקוח/ה.

7.2 {{settlement_approval_requirement}}

7.3 שכר הטרחה בגין פשרה: {{settlement_fee_terms}}

**8. ערעור**

{{#if appeal_terms}}
8.1 במקרה של ערעור:
    - ערעור הלקוח/ה: {{client_appeal_terms}}
    - ערעור הצד שכנגד: {{opponent_appeal_terms}}

8.2 שכר טרחה בערעור: {{appeal_fee_terms}}
{{/if}}

**9. גביית הכספים**

9.1 עורך/ת הדין {{collection_responsibility}}.

9.2 שכר הטרחה ישולם {{payment_timing_from_recovery}}.

9.3 {{direct_payment_arrangement}}

**10. זכות עיכבון**

10.1 לעורך/ת הדין זכות עיכבון על כל סכום שיתקבל עד לתשלום שכר הטרחה.

**11. סיכונים וסיכויים**

11.1 עורך/ת הדין {{risk_disclosure}}.

11.2 הערכת סיכויים: {{success_probability_estimate}}

11.3 הלקוח/ה מודע/ת כי גם במקרה של כישלון {{client_risk_acknowledgment}}.

**12. ייצוג בלעדי**

12.1 הלקוח/ה מתחייב/ת שלא להתקשר עם עורך/ת דין אחר/ת באותו עניין.

12.2 {{exclusivity_terms}}

**13. סיום ההתקשרות**

13.1 במקרה של הפסקה ביוזמת הלקוח/ה:
    {{client_termination_fee}}

13.2 במקרה של הפסקה ביוזמת עורך/ת הדין:
    {{lawyer_withdrawal_terms}}

13.3 {{subsequent_recovery_terms}}

**אזהרה חשובה:**

הלקוח/ה מבין/ה ומסכים/ה כי:
- שכר טרחה מותנה בהצלחה אינו מתאים לכל מקרה
- {{important_warning_1}}
- {{important_warning_2}}
- {{important_warning_3}}

[חתימות]`,
    variables: [
      'agreement_date',
      'client_name', 'client_id',
      'lawyer_name', 'lawyer_license',
      'case_description', 'matter_type', 'claim_amount',
      'percentage',
      'gross_or_net', 'recovery_definition',
      'tiered_percentage', 'percentage_tiers',
      'partial_success', 'partial_threshold', 'partial_success_terms',
      'minimum_recovery', 'minimum_amount',
      'success_expenses_policy', 'failure_expenses_policy', 'special_expenses_policy',
      'advance_required', 'advance_amount', 'advance_treatment',
      'success_definition', 'success_determination_method',
      'settlement_approval_requirement', 'settlement_fee_terms',
      'appeal_terms', 'client_appeal_terms', 'opponent_appeal_terms', 'appeal_fee_terms',
      'collection_responsibility', 'payment_timing_from_recovery', 'direct_payment_arrangement',
      'risk_disclosure', 'success_probability_estimate', 'client_risk_acknowledgment',
      'exclusivity_terms',
      'client_termination_fee', 'lawyer_withdrawal_terms', 'subsequent_recovery_terms',
      'important_warning_1', 'important_warning_2', 'important_warning_3'
    ],
    aiPrompt: 'הסבר בבירור את תנאי ההצלחה, הדגש סיכונים ותמריצים, כלול כל התרחישים האפשריים',
    usageInstructions: 'השתמש בתביעות נזיקין, חובות, תביעות כספיות עם סיכוי סביר להצלחה',
    legalBasis: [
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007',
      'פסיקה בעניין "קוטה פרנק" - תיקון 23 לחוק לשכת עורכי הדין'
    ],
    warnings: [
      'אסור בדיני משפחה (למעט תביעות ממוניות)',
      'אסור בעניינים פליליים',
      'יש להעריך סיכויים בצורה ריאלית',
      'חובה לגלות ללקוח את כל הסיכונים',
      'מומלץ לקבל אישור בכתב של הלקוח על הערכת סיכויים'
    ]
  },

  {
    id: 'success-fee-bonus',
    title: 'הסכם שכר טרחה עם בונוס הצלחה',
    category: 'success-fee',
    content: `הסכם שכר טרחה עם בונוס הצלחה

[פרטי צדדים]

**2. שכר טרחה בסיסי + בונוס הצלחה**

**2.1 שכר טרחה בסיסי:**

שכר הטרחה הבסיסי הוא {{base_fee_type}}:
{{#if hourly_base}}
- תעריף שעתי: {{base_hourly_rate}} ש"ח
- מוגבל ל: {{base_fee_cap}} ש"ח
{{else if fixed_base}}
- תעריף קבוע: {{base_fixed_fee}} ש"ח
{{/if}}

**2.2 בונוס הצלחה:**

בנוסף לשכר הטרחה הבסיסי, במקרה של הצלחה ישולם בונוס כדלקמן:

{{#if result_based_bonus}}
**בונוס מבוסס תוצאה:**
{{#each bonus_tiers}}
- אם יושג {{this.result}}: בונוס של {{this.bonus_amount}} ש"ח / {{this.bonus_percentage}}%
{{/each}}
{{/if}}

{{#if amount_based_bonus}}
**בונוס מבוסס סכום:**
- {{amount_bonus_formula}}
{{/if}}

{{#if time_based_bonus}}
**בונוס מבוסס זמן:**
- אם יושג תוצאה עד {{time_threshold}}: בונוס של {{time_bonus}} ש"ח
{{/if}}

**2.3 הגדרת "הצלחה" לבונוס:**

הצלחה לצורך בונוס תוגדר כ:
{{success_criteria_for_bonus}}

**2.4 חישוב הבונוס:**

{{bonus_calculation_method}}

**3. יתרונות המודל המשולב**

3.1 הלקוח/ה:
    - מבטיח/ה שעורך/ת הדין מתוגמל/ת על מאמץ גם ללא הצלחה מלאה
    - מקבל/ת תמריץ לעורך/ת הדין לשאוף לתוצאה מיטבית
    - {{client_benefit_3}}

3.2 עורך/ת הדין:
    - מכוסה בשכר טרחה בסיסי
    - מתומרץ/ת להשיג תוצאה מצוינת
    - {{lawyer_benefit_3}}

**4. תשלום הבונוס**

4.1 הבונוס ישולם {{bonus_payment_timing}}.

4.2 {{bonus_payment_terms}}

**5. אי השגת בונוס**

5.1 אם לא הושגה תוצאה המזכה בבונוס:
    - ישולם רק שכר הטרחה הבסיסי
    - {{no_bonus_terms}}

[סעיפים נוספים]`,
    variables: [
      'base_fee_type',
      'hourly_base', 'base_hourly_rate', 'base_fee_cap',
      'fixed_base', 'base_fixed_fee',
      'result_based_bonus', 'bonus_tiers',
      'amount_based_bonus', 'amount_bonus_formula',
      'time_based_bonus', 'time_threshold', 'time_bonus',
      'success_criteria_for_bonus',
      'bonus_calculation_method',
      'client_benefit_3', 'lawyer_benefit_3',
      'bonus_payment_timing', 'bonus_payment_terms',
      'no_bonus_terms'
    ],
    aiPrompt: 'הסבר את האיזון בין שכר בסיסי לבונוס, הדגש תמריצים הדדיים, פרט חישוב בונוס',
    usageInstructions: 'השתמש כאשר רוצים לאזן בין הגנה על עורך הדין ותמריץ להצלחה',
    legalBasis: [
      'תקנות לשכת עורכי הדין (שכר טרחה), התשס"ז-2007'
    ],
    warnings: [
      'יש להבהיר היטב מתי מגיע בונוס',
      'הבונוס חייב להיות סביר ביחס לעבודה',
      'תיעוד התוצאה חשוב למניעת מחלוקות'
    ]
  }
];

