/**
 * מחסן כתבי בית משפט - צוואות וירושות - חלק 3: אפוטרופסות
 * סעיפים מקיפים לבקשות מינוי אפוטרופוס
 */

import { CourtSectionTemplate } from './court-warehouse';

export const guardianshipSections: CourtSectionTemplate[] = [
  {
    id: 'guardianship-petition-comprehensive',
    title: 'בקשה למינוי אפוטרופוס - מקיפה',
    category: 'opening',
    content: `לכבוד בית המשפט לענייני משפחה {{court_location}}

בעניין: בקשה למינוי אפוטרופוס

לפי חוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962

**המבקש/ת:**
שם: {{petitioner_name}}
ת.ז.: {{petitioner_id}}
כתובת: {{petitioner_address}}
טלפון: {{petitioner_phone}}
באמצעות ב"כ עו"ד {{lawyer_name}}

**נושא הבקשה:**
שם: {{subject_name}} (להלן: "{{subject_title}}")
ת.ז.: {{subject_id}}
תאריך לידה: {{subject_dob}} (בן/בת {{subject_age}})
כתובת: {{subject_address}}

**הקשר בין המבקש/ת ל{{subject_title}}:**
1. {{relationship_description}}

**צורך במינוי אפוטרופוס:**
2. נדרש מינוי אפוטרופוס עבור {{subject_name}} מהנימוקים הבאים:
   {{need_for_guardianship_summary}}

**הבקשה:**
3. לפיכך, מתבקש בית המשפט הנכבד:
   - למנות את {{petitioner_name}} כאפוטרופוס ל{{subject_name}}
   - {{#if guardianship_type}}לקבוע שהאפוטרופסות תהיה ל{{guardianship_scope}}{{/if}}
   - {{additional_requests}}

להלן הפירוט:`,
    variables: [
      'court_location',
      'petitioner_name', 'petitioner_id', 'petitioner_address', 'petitioner_phone',
      'lawyer_name',
      'subject_name', 'subject_title', 'subject_id', 'subject_dob', 'subject_age', 'subject_address',
      'relationship_description',
      'need_for_guardianship_summary',
      'guardianship_type', 'guardianship_scope',
      'additional_requests'
    ],
    aiPrompt: 'נסח בקשה רגישה ומכבדת, הדגש את הצורך באפוטרופסות ואת התאמת המבקש',
    usageInstructions: 'השתמש לפתיחת בקשות למינוי אפוטרופוס',
    documentTypes: ['court-petition', 'guardianship']
  },

  {
    id: 'guardianship-for-minor',
    title: 'בקשה למינוי אפוטרופוס לקטין',
    category: 'legal-claims',
    content: `בקשה למינוי אפוטרופוס לקטין:

**הקטין/ה:**
1. {{minor_name}}, ת.ז. {{minor_id}}, נולד/ה ביום {{birth_date}}, בן/בת {{age}}.

**מצב המשפחה:**
2. הורי הקטין/ה:
   
   **האם:**
   - שם: {{mother_name}}, ת.ז. {{mother_id}}
   - מצב: {{mother_status}}
   
   **האב:**
   - שם: {{father_name}}, ת.ז. {{father_id}}
   - מצב: {{father_status}}

**הצורך במינוי:**
3. נדרש מינוי אפוטרופוס מהסיבות הבאות:
   {{#if parents_deceased}}
   - שני ההורים נפטרו
   - האם נפטרה ב{{mother_death_date}}
   - האב נפטר ב{{father_death_date}}
   {{/if}}
   
   {{#if parents_incapacitated}}
   - ההורים אינם מסוגלים למלא תפקידם:
     {{incapacity_details}}
   {{/if}}
   
   {{#if parents_absent}}
   - ההורים נעדרים:
     {{absence_details}}
   {{/if}}
   
   {{#if court_removed_rights}}
   - בית המשפט שלל את זכויות ההורים:
     {{removal_details}}
   {{/if}}

**המבקש/ת:**
4. המבקש/ת {{petitioner_name}} הוא/היא {{relationship_to_minor}}.

5. המבקש/ת מתאים/ה לשמש כאפוטרופוס:
   - גיל: {{petitioner_age}}
   - מצב משפחתי: {{petitioner_marital_status}}
   - מצב תעסוקתי: {{petitioner_employment}}
   - מצב כלכלי: {{petitioner_financial_status}}
   - דיור: {{petitioner_housing}}

**קשר עם הקטין/ה:**
6. למבקש/ת קשר הדוק עם הקטין/ה:
   {{relationship_description}}

**רצון הקטין/ה:**
{{#if minor_preference}}
7. הקטין/ה, בהיותו/ה בן/בת {{age}}, הביע/ה רצון {{minor_wish}}.
{{/if}}

**מצבו של הקטין/ה:**
8. מצבו/ה הנוכחי של הקטין/ה:
   - מקום מגורים: {{current_residence}}
   - בית ספר: {{school}}
   - מצב בריאותי: {{health_status}}
   - {{emotional_state}}

**צרכים מיוחדים:**
{{#if special_needs}}
9. לקטין/ה צרכים מיוחדים:
   {{special_needs_description}}
{{/if}}

**יכולת המבקש/ת:**
10. המבקש/ת מסוגל/ת לספק לקטין/ה:
    - דיור מתאים: {{housing_provision}}
    - מזון וביגוד: {{basic_needs}}
    - חינוך: {{education_provision}}
    - בריאות: {{healthcare_provision}}
    - {{emotional_support}}

**רכוש הקטין/ה:**
{{#if minor_assets}}
11. לקטין/ה רכוש:
    {{#each assets}}
    - {{this.type}}: {{this.description}}
      שווי: {{this.value}} ש"ח
      מקור: {{this.source}}
    {{/each}}
    
    סה"כ: {{total_assets}} ש"ח
{{/if}}

**תמיכה כלכלית:**
12. תמיכה כלכלית בקטין/ה:
    {{#if support_payments}}
    - מזונות: {{alimony_amount}} ש"ח לחודש מ{{alimony_payer}}
    {{/if}}
    {{#if social_security}}
    - ביטוח לאומי: {{social_security_amount}} ש"ח לחודש
    {{/if}}
    {{#if other_income}}
    - אחר: {{other_income_description}}
    {{/if}}

**משפחה מורחבת:**
13. יחסי המבקש/ת עם המשפחה המורחבת:
    {{extended_family_relations}}

**אחרים המעוניינים:**
{{#if other_interested}}
14. אחרים המעוניינים באפוטרופסות:
    {{other_interested_parties}}
{{/if}}

**תכנית טיפול:**
15. המבקש/ת מציג/ה תכנית:
    - חינוך: {{education_plan}}
    - בריאות: {{health_plan}}
    - פעילויות: {{activities_plan}}
    - {{long_term_plan}}

**אישורים:**
16. מצורפים:
    - אישור מינהל עזבון על רכוש הקטין/ה
    - אישור רווחה / עו"ס
    - {{additional_certificates}}`,
    variables: [
      'minor_name', 'minor_id', 'birth_date', 'age',
      'mother_name', 'mother_id', 'mother_status',
      'father_name', 'father_id', 'father_status',
      'parents_deceased', 'mother_death_date', 'father_death_date',
      'parents_incapacitated', 'incapacity_details',
      'parents_absent', 'absence_details',
      'court_removed_rights', 'removal_details',
      'petitioner_name', 'relationship_to_minor',
      'petitioner_age', 'petitioner_marital_status',
      'petitioner_employment', 'petitioner_financial_status', 'petitioner_housing',
      'relationship_description',
      'minor_preference', 'minor_wish',
      'current_residence', 'school', 'health_status', 'emotional_state',
      'special_needs', 'special_needs_description',
      'housing_provision', 'basic_needs', 'education_provision',
      'healthcare_provision', 'emotional_support',
      'minor_assets', 'assets', 'total_assets',
      'support_payments', 'alimony_amount', 'alimony_payer',
      'social_security', 'social_security_amount',
      'other_income', 'other_income_description',
      'extended_family_relations',
      'other_interested', 'other_interested_parties',
      'education_plan', 'health_plan', 'activities_plan', 'long_term_plan',
      'additional_certificates'
    ],
    aiPrompt: 'הדגש את טובת הקטין, פרט יכולת המבקש לדאוג לצרכיו, הצג תכנית מפורטת',
    usageInstructions: 'השתמש בבקשות למינוי אפוטרופוס לקטין שהוריו נפטרו או אינם מסוגלים',
    documentTypes: ['court-petition', 'guardianship']
  },

  {
    id: 'guardianship-for-incapacitated-adult',
    title: 'בקשה למינוי אפוטרופוס לחסוי בגיר',
    category: 'legal-claims',
    content: `בקשה למינוי אפוטרופוס לחסוי בגיר:

**החסוי/ה:**
1. {{subject_name}}, ת.ז. {{subject_id}}, נולד/ה ביום {{birth_date}}, בן/בת {{age}}.

2. כתובת: {{subject_address}}

**המצב הרפואי:**
3. {{subject_name}} סובל/ת מ:
   {{#each medical_conditions}}
   - {{this.diagnosis}}
     אובחן ב: {{this.diagnosis_date}}
     רופא מטפל: {{this.doctor}}
     מוסד רפואי: {{this.institution}}
   {{/each}}

**חוסר הכשרות:**
4. כתוצאה ממצבו/ה הרפואי, {{subject_name}}:
   - {{incapacity_description_1}}
   - {{incapacity_description_2}}
   - {{incapacity_description_3}}

**הערכת יכולות:**
5. יכולות קוגניטיביות:
   - הבנה: {{understanding_level}}
   - זיכרון: {{memory_status}}
   - קבלת החלטות: {{decision_making_ability}}
   - תקשורת: {{communication_ability}}

6. יכולות תפקודיות:
   - טיפול עצמי: {{self_care_ability}}
   - ניהול כספים: {{financial_management_ability}}
   - ניהול משק בית: {{household_management}}
   - התמצאות: {{orientation_status}}

**חוות דעת רפואיות:**
7. חוות דעת מומחים:
   
   {{#each expert_opinions}}
   **חוות דעת {{@index}} - {{this.expert_name}}, {{this.specialty}}:**
   - תאריך: {{this.date}}
   - מסקנות: {{this.conclusions}}
   - המלצה: {{this.recommendation}}
   {{/each}}

**היסטוריה רפואית:**
8. אשפוזים ואירועים רפואיים:
   {{#each hospitalizations}}
   - {{this.date}}: {{this.reason}}
     משך: {{this.duration}}
     בית חולים: {{this.hospital}}
   {{/each}}

**תרופות:**
9. {{subject_name}} נוטל/ת תרופות:
   {{#each medications}}
   - {{this.name}} - {{this.purpose}}
     מינון: {{this.dosage}}
     תדירות: {{this.frequency}}
   {{/each}}

**מצב נוכחי:**
10. כיום {{subject_name}}:
    - מתגורר/ת ב: {{current_living_situation}}
    - מטופל/ת על ידי: {{current_caregiver}}
    - {{daily_routine}}

**הצורך באפוטרופסות:**
11. נדרשת אפוטרופסות עבור:
    {{#if person_guardianship}}
    - ענייני גופו/ה: {{person_needs}}
    {{/if}}
    {{#if property_guardianship}}
    - ענייני רכושו/ה: {{property_needs}}
    {{/if}}

**רכוש החסוי/ה:**
{{#if has_property}}
12. רכוש {{subject_name}}:
    
    **נדל"ן:**
    {{#each real_estate}}
    - {{this.description}}
      שווי: {{this.value}} ש"ח
    {{/each}}
    
    **חשבונות בנק:**
    {{#each bank_accounts}}
    - {{this.bank}}, חשבון {{this.number}}
      יתרה: {{this.balance}} ש"ח
    {{/each}}
    
    **זכויות פנסיה:**
    - {{pension_details}}
    
    **הכנסות חודשיות:**
    {{#each income_sources}}
    - {{this.source}}: {{this.amount}} ש"ח
    {{/each}}
    
    **סה"כ נכסים:** {{total_assets}} ש"ח
    **הכנסה חודשית:** {{monthly_income}} ש"ח
{{/if}}

**המבקש/ת:**
13. המבקש/ת {{petitioner_name}} הוא/היא {{relationship}}.

14. המבקש/ת מתאים/ה לשמש כאפוטרופוס:
    - גיל: {{petitioner_age}}
    - עיסוק: {{petitioner_occupation}}
    - כתובת: {{petitioner_address}}
    - {{petitioner_suitability}}

**קשר עם החסוי/ה:**
15. למבקש/ת קשר הדוק עם {{subject_name}}:
    {{relationship_history}}

16. המבקש/ת דואג/ת ל{{subject_name}}:
    {{current_care_provided}}

**רצון החסוי/ה:**
{{#if subject_can_express}}
17. {{subject_name}} {{preference_expression}}.
{{/if}}

**משפחה:**
18. בני משפחה אחרים:
    {{#each family_members}}
    - {{this.name}}, {{this.relationship}}
      עמדה: {{this.position}}
    {{/each}}

**תכנית טיפול:**
19. המבקש/ת מציג/ה תכנית לטיפול ב{{subject_name}}:
    - רפואי: {{medical_care_plan}}
    - שיקומי: {{rehabilitation_plan}}
    - חברתי: {{social_plan}}
    - מגורים: {{living_arrangement_plan}}

**ניהול הרכוש:**
{{#if property_management_plan}}
20. תכנית לניהול רכוש החסוי/ה:
    {{property_management_details}}
{{/if}}

**הגבלת הכשרות:**
21. ההגבלה המבוקשת:
    - {{#if full_guardianship}}אפוטרופסות מלאה{{/if}}
    - {{#if partial_guardianship}}אפוטרופסות חלקית ל: {{specific_areas}}{{/if}}

**אישורים:**
22. מצורפים:
    - חוות דעת רפואיות
    - אישור מינהל עזבון (אם יש רכוש)
    - תעודות רפואיות
    - {{additional_documents}}`,
    variables: [
      'minor_name', 'minor_id', 'birth_date', 'age',
      'mother_name', 'mother_id', 'mother_status',
      'father_name', 'father_id', 'father_status',
      'parents_deceased', 'mother_death_date', 'father_death_date',
      'parents_incapacitated', 'incapacity_details',
      'parents_absent', 'absence_details',
      'court_removed_rights', 'removal_details',
      'petitioner_name', 'relationship_to_minor',
      'petitioner_age', 'petitioner_marital_status',
      'petitioner_employment', 'petitioner_financial_status', 'petitioner_housing',
      'relationship_description',
      'minor_preference', 'minor_wish',
      'current_residence', 'school', 'health_status', 'emotional_state',
      'special_needs', 'special_needs_description',
      'housing_provision', 'basic_needs', 'education_provision',
      'healthcare_provision', 'emotional_support',
      'minor_assets', 'assets', 'total_assets',
      'support_payments', 'alimony_amount', 'alimony_payer',
      'social_security', 'social_security_amount',
      'other_income', 'other_income_description',
      'extended_family_relations',
      'other_interested', 'other_interested_parties',
      'education_plan', 'health_plan', 'activities_plan', 'long_term_plan',
      'additional_documents'
    ],
    aiPrompt: 'הסבר בבהירות את חוסר הכשרות, התבסס על חוות דעת רפואיות, הצג תכנית טיפול מקיפה',
    usageInstructions: 'השתמש בבקשות למינוי אפוטרופוס לבגיר חסר כשרות',
    documentTypes: ['court-petition', 'guardianship']
  },

  {
    id: 'guardianship-temporary-urgent',
    title: 'בקשה דחופה למינוי אפוטרופוס זמני',
    category: 'procedural',
    content: `בקשה דחופה למינוי אפוטרופוס זמני:

**הדחיפות:**
1. מדובר בבקשה דחופה למינוי אפוטרופוס זמני.

**המצב הדורש טיפול מיידי:**
2. {{subject_name}} נמצא/ת במצב הדורש החלטה מיידית:
   {{urgent_situation_description}}

**הסיכון:**
3. ללא מינוי אפוטרופוס מיידי:
   - {{risk_1}}
   - {{risk_2}}
   - {{risk_3}}

**החלטות נדרשות:**
4. נדרש לקבל החלטות דחופות:
   {{#each urgent_decisions}}
   - {{this.decision}}
     דחיפות: {{this.urgency}}
     תוצאה אם לא יתקבל: {{this.consequence}}
   {{/each}}

**רפואי:**
{{#if medical_urgency}}
5. החלטות רפואיות דחופות:
   - {{medical_decision_needed}}
   - לוח זמנים: {{medical_timeline}}
{{/if}}

**כלכלי:**
{{#if financial_urgency}}
6. החלטות כלכליות דחופות:
   - {{financial_decision_needed}}
   - {{financial_consequences}}
{{/if}}

**משפטי:**
{{#if legal_urgency}}
7. פעולות משפטיות נדרשות:
   - {{legal_action_needed}}
   - מועד אחרון: {{legal_deadline}}
{{/if}}

**מגורים:**
{{#if housing_urgency}}
8. סוגיית מגורים דחופה:
   {{housing_situation}}
{{/if}}

**אפוטרופוס זמני מוצע:**
9. מוצע למנות את {{temporary_guardian}} כאפוטרופוס/ת זמני/ת.

10. {{temporary_guardian}} מתאים/ה:
    - {{suitability_reason_1}}
    - {{suitability_reason_2}}

**היקף האפוטרופסות הזמנית:**
11. האפוטרופסות הזמנית תהיה ל:
    {{temporary_guardianship_scope}}

**תקופה:**
12. האפוטרופסות הזמנית מבוקשת לתקופה של {{duration}} או עד {{end_condition}}.

**ללא פגיעה:**
13. מינוי זה לא יפגע בזכויות הצדדים בדיון המלא.

**בקשה מקבילה:**
14. {{#if parallel_petition}}
    הוגשה במקביל בקשה מלאה למינוי אפוטרופוס קבוע.
    {{else}}
    בקשה למינוי אפוטרופוס קבוע תוגש תוך {{filing_timeline}}.
    {{/if}}

**שימוע:**
15. {{#if waive_hearing}}
    המבקש/ת מבקש/ת לדון בבקשה ללא שימוע בשל הדחיפות.
    {{else}}
    המבקש/ת מבקש/ת שימוע דחוף תוך {{hearing_timeline}}.
    {{/if}}`,
    variables: [
      'subject_name', 'urgent_situation_description',
      'risk_1', 'risk_2', 'risk_3',
      'urgent_decisions',
      'medical_urgency', 'medical_decision_needed', 'medical_timeline',
      'financial_urgency', 'financial_decision_needed', 'financial_consequences',
      'legal_urgency', 'legal_action_needed', 'legal_deadline',
      'housing_urgency', 'housing_situation',
      'temporary_guardian',
      'suitability_reason_1', 'suitability_reason_2',
      'temporary_guardianship_scope',
      'duration', 'end_condition',
      'parallel_petition', 'filing_timeline',
      'waive_hearing', 'hearing_timeline'
    ],
    aiPrompt: 'הדגש את הדחיפות, פרט סיכונים אמיתיים, הצע פתרון מידי וזמני',
    usageInstructions: 'השתמש במצבים דחופים הדורשים מינוי אפוטרופוס זמני מיידי',
    documentTypes: ['court-petition', 'guardianship', 'urgent-application']
  },

  {
    id: 'guardianship-property-only',
    title: 'בקשה למינוי אפוטרופוס לענייני רכוש בלבד',
    category: 'legal-claims',
    content: `בקשה למינוי אפוטרופוס לענייני רכוש בלבד:

**הבקשה המצומצמת:**
1. הבקשה היא למינוי אפוטרופוס לענייני רכוש בלבד.

2. {{subject_name}} כשיר/ה לענייני גופו/ה, אך זקוק/ה לעזרה בניהול רכושו/ה.

**היכולת האישית:**
3. {{subject_name}}:
   - מסוגל/ת לדאוג לצרכיו/ה האישיים
   - {{personal_care_ability}}
   - מתגורר/ת עצמאית ב{{living_situation}}
   - {{social_functioning}}

**הצורך בעזרה כלכלית:**
4. למרות יכולתו/ה האישית, {{subject_name}} זקוק/ה לעזרה בניהול רכוש:
   {{#each financial_difficulties}}
   - {{this.issue}}
   {{/each}}

**הרכוש:**
5. רכושו/ה של {{subject_name}} כולל:
   
   **נדל"ן:**
   {{#each properties}}
   - {{this.address}}
     סוג: {{this.type}}
     שווי: {{this.value}} ש"ח
     {{#if this.rental}}מושכר ב-{{this.rental_income}} ש"ח לחודש{{/if}}
   {{/each}}
   
   **נכסים פיננסיים:**
   {{#each financial_assets}}
   - {{this.type}}: {{this.description}}
     שווי: {{this.value}} ש"ח
   {{/each}}
   
   **הכנסות:**
   {{#each income}}
   - {{this.source}}: {{this.amount}} ש"ח לחודש
   {{/each}}
   
   **סה"כ נכסים:** {{total_assets}} ש"ח
   **הכנסה חודשית:** {{total_monthly_income}} ש"ח

**הקושי בניהול:**
6. הקושי בניהול הרכוש נובע מ:
   {{management_difficulty_reasons}}

**החלטות נדרשות:**
7. נדרשות החלטות בענייני רכוש:
   {{#each property_decisions}}
   - {{this.decision}}
     השלכות: {{this.implications}}
   {{/each}}

**חוסר ניסיון:**
{{#if lack_of_experience}}
8. {{subject_name}} חסר/ת ניסיון ב:
   - {{inexperience_area_1}}
   - {{inexperience_area_2}}
{{/if}}

**ניצול כלכלי:**
{{#if exploitation_risk}}
9. קיים חשש לניצול כלכלי:
   {{exploitation_concern_details}}
{{/if}}

**עסקאות עבר:**
{{#if past_transactions}}
10. בעבר {{subject_name}} ביצע/ה עסקאות בעייתיות:
    {{problematic_transactions_history}}
{{/if}}

**המבקש/ת:**
11. המבקש/ת {{petitioner_name}} הוא/היא {{relationship}}.

12. המבקש/ת בעל/ת ניסיון ומומחיות:
    - {{financial_expertise}}
    - {{professional_background}}

**תכנית ניהול:**
13. המבקש/ת מציג/ה תכנית לניהול הרכוש:
    - {{management_plan_income}}
    - {{management_plan_expenses}}
    - {{management_plan_investments}}
    - {{management_plan_reporting}}

**שיתוף החסוי/ה:**
14. {{subject_name}} {{involvement_level}} בניהול רכושו/ה.

15. המבקש/ת מתחייב/ת להתייעץ עם {{subject_name}} ככל האפשר.

**הגבלות:**
16. מבוקשות המגבלות הבאות על האפוטרופוס:
    - {{limitation_1}}
    - {{limitation_2}}
    - {{limitation_3}}

**ערובה:**
17. המבקש/ת מוכן/ה להפקיד ערובה בהתאם להוראות בית המשפט.

**דיווח:**
18. המבקש/ת מתחייב/ת להגיש דוחות {{reporting_frequency}}.`,
    variables: [
      'subject_name',
      'personal_care_ability', 'living_situation', 'social_functioning',
      'financial_difficulties',
      'properties', 'financial_assets', 'income',
      'total_assets', 'total_monthly_income',
      'management_difficulty_reasons',
      'property_decisions',
      'lack_of_experience', 'inexperience_area_1', 'inexperience_area_2',
      'exploitation_risk', 'exploitation_concern_details',
      'past_transactions', 'problematic_transactions_history',
      'petitioner_name', 'relationship',
      'financial_expertise', 'professional_background',
      'management_plan_income', 'management_plan_expenses',
      'management_plan_investments', 'management_plan_reporting',
      'involvement_level',
      'limitation_1', 'limitation_2', 'limitation_3',
      'reporting_frequency'
    ],
    aiPrompt: 'הסבר את הצורך בניהול רכוש תוך שמירה על עצמאות אישית, פרט תכנית ניהול מקצועית',
    usageInstructions: 'השתמש כאשר האדם כשיר אישית אך זקוק לעזרה בניהול רכוש',
    documentTypes: ['court-petition', 'guardianship']
  },

  {
    id: 'guardianship-accounting-report',
    title: 'דוח חשבונות אפוטרופוס',
    category: 'procedural',
    content: `דוח חשבונות אפוטרופוס:

**פרטים כלליים:**
1. אני החתום מטה, {{guardian_name}}, ת.ז. {{guardian_id}}, אפוטרופוס/ת של {{ward_name}}.

2. מגיש/ה בזאת דוח חשבונות עבור התקופה מ-{{period_start}} עד {{period_end}}.

**נכסים בתחילת התקופה:**
3. ליום {{period_start}}, רכוש החסוי/ה:
   
   **נדל"ן:**
   {{#each real_estate_start}}
   - {{this.property}}: {{this.value}} ש"ח
   {{/each}}
   
   **חשבונות בנק:**
   {{#each bank_accounts_start}}
   - {{this.bank}}, חשבון {{this.number}}: {{this.balance}} ש"ח
   {{/each}}
   
   **אחר:**
   {{other_assets_start}}
   
   **סה"כ בתחילת תקופה:** {{total_start}} ש"ח

**הכנסות בתקופה:**
4. הכנסות בתקופה:
   {{#each income}}
   - {{this.source}}: {{this.amount}} ש"ח
     פירוט: {{this.details}}
   {{/each}}
   
   **סה"כ הכנסות:** {{total_income}} ש"ח

**הוצאות בתקופה:**
5. הוצאות בתקופה:
   
   **מזון וצרכים בסיסיים:**
   {{food_expenses}} ש"ח
   
   **דיור:**
   {{housing_expenses}} ש"ח
   
   **רפואה:**
   {{#each medical_expenses}}
   - {{this.description}}: {{this.amount}} ש"ח
   {{/each}}
   סה"כ רפואה: {{total_medical}} ש"ח
   
   **טיפולים:**
   {{treatment_expenses}} ש"ח
   
   **ביגוד:**
   {{clothing_expenses}} ש"ח
   
   **תחבורה:**
   {{transportation_expenses}} ש"ח
   
   **אחר:**
   {{#each other_expenses}}
   - {{this.description}}: {{this.amount}} ש"ח
   {{/each}}
   
   **סה"כ הוצאות:** {{total_expenses}} ש"ח

**עסקאות מיוחדות:**
{{#if special_transactions}}
6. עסקאות מיוחדות בתקופה:
   {{#each transactions}}
   - {{this.date}}: {{this.description}}
     סכום: {{this.amount}} ש"ח
     {{#if this.court_approval}}אושר על ידי בית המשפט ב{{this.approval_date}}{{/if}}
   {{/each}}
{{/if}}

**נכסים בסוף התקופה:**
7. ליום {{period_end}}, רכוש החסוי/ה:
   
   **נדל"ן:**
   {{#each real_estate_end}}
   - {{this.property}}: {{this.value}} ש"ח
   {{/each}}
   
   **חשבונות בנק:**
   {{#each bank_accounts_end}}
   - {{this.bank}}, חשבון {{this.number}}: {{this.balance}} ש"ח
   {{/each}}
   
   **אחר:**
   {{other_assets_end}}
   
   **סה"כ בסוף תקופה:** {{total_end}} ש"ח

**התאמה:**
8. התאמת החישוב:
   נכסים בתחילה: {{total_start}} ש"ח
   + הכנסות: {{total_income}} ש"ח
   - הוצאות: {{total_expenses}} ש"ח
   = {{calculated_end}} ש"ח
   
   נכסים בפועל: {{total_end}} ש"ח
   הפרש: {{difference}} ש"ח
   {{#if difference_explanation}}הסבר להפרש: {{difference_explanation}}{{/if}}

**מצב החסוי/ה:**
9. מצבו/ה של {{ward_name}} בתקופה:
   - בריאות: {{health_status}}
   - מגורים: {{living_situation}}
   - {{general_wellbeing}}

**שינויים:**
{{#if changes}}
10. שינויים בתקופה:
    {{changes_description}}
{{/if}}

**קשיים:**
{{#if difficulties}}
11. קשיים שעלו:
    {{difficulties_description}}
{{/if}}

**תכניות:**
12. תכניות לתקופה הבאה:
    {{future_plans}}

**אישורים מצורפים:**
13. מצורפים:
    - דפי חשבון בנק
    - קבלות להוצאות מיוחדות
    - {{additional_attachments}}

**הצהרה:**
14. אני מצהיר/ה כי:
    - הדוח מלא ונכון
    - כל המידע נכון למיטב ידיעתי
    - {{additional_declarations}}`,
    variables: [
      'guardian_name', 'guardian_id', 'ward_name',
      'period_start', 'period_end',
      'real_estate_start', 'bank_accounts_start', 'other_assets_start', 'total_start',
      'income', 'total_income',
      'food_expenses', 'housing_expenses',
      'medical_expenses', 'total_medical',
      'treatment_expenses', 'clothing_expenses', 'transportation_expenses',
      'other_expenses', 'total_expenses',
      'special_transactions', 'transactions',
      'real_estate_end', 'bank_accounts_end', 'other_assets_end', 'total_end',
      'calculated_end', 'difference', 'difference_explanation',
      'health_status', 'living_situation', 'general_wellbeing',
      'changes', 'changes_description',
      'difficulties', 'difficulties_description',
      'future_plans',
      'additional_attachments',
      'additional_declarations'
    ],
    aiPrompt: 'צור דוח מדויק ושקוף, פרט כל הכנסה והוצאה, הסבר שינויים והפרשים',
    usageInstructions: 'השתמש להגשת דוחות תקופתיים של אפוטרופוס לבית משפט',
    documentTypes: ['court-petition', 'guardianship']
  }
];

