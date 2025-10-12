/**
 * מחסן כתבי בית משפט - צוואות וירושות - חלק 1: צוואות
 * סעיפים מקיפים לצוואות מכל הסוגים
 */

import { CourtSectionTemplate } from './court-warehouse';

export const willsSections: CourtSectionTemplate[] = [
  {
    id: 'will-probate-petition-basic',
    title: 'בקשה לאישור צוואה - בסיסי',
    category: 'opening',
    content: `לכבוד בית המשפט לענייני משפחה {{court_location}}

בעניין: בקשה לאישור צוואה ולצו ירושה

בעניין עיזבון המנוח/ה {{deceased_name}}, ת.ז. {{deceased_id}}

**המבקש/ת:**
שם: {{petitioner_name}}
ת.ז.: {{petitioner_id}}
כתובת: {{petitioner_address}}
באמצעות ב"כ עו"ד {{lawyer_name}} {{#if lawyer_license}}(מ.ר. {{lawyer_license}}){{/if}}

אני החתום מטה מבקש/ה בזאת לאשר את הצוואה של המנוח/ה ולהוציא צו ירושה על יסודה.

**המנוח/ה:**
1. {{deceased_name}}, ת.ז. {{deceased_id}}, נפטר/ה ביום {{death_date}} ב{{death_location}}.

2. בעת פטירתו/ה התגורר/ה ב{{last_residence}}.

3. {{deceased_name}} היה/הייתה בן/בת {{age_at_death}} שנה בעת פטירתו/ה.

4. {{marital_status_description}}

**הצוואה:**
5. ביום {{will_date}}, חתם/ה המנוח/ה על צוואה {{will_type}} (בכתב יד/בפני עדים/בפני רשות).

6. {{will_execution_details}}

7. {{#if will_location}}הצוואה נמצאת כעת ב{{will_location}}.{{/if}}

**עדי הצוואה:**
{{#if witnesses}}
8. הצוואה נחתמה בפני העדים:
   - {{witness_1_name}}, ת.ז. {{witness_1_id}}, {{witness_1_address}}
   - {{witness_2_name}}, ת.ז. {{witness_2_id}}, {{witness_2_address}}
{{/if}}

**תוכן הצוואה:**
9. על פי הצוואה:
   {{will_main_provisions}}

**הנהנים:**
10. הנהנים מהצוואה הם:
    {{#each beneficiaries}}
    - {{this.name}}, ת.ז. {{this.id}}, {{this.relationship}}, {{this.address}}
      חלקו/ה: {{this.share}}
    {{/each}}

**היורשים על פי חוק:**
11. היורשים של המנוח/ה על פי חוק (ללא צוואה) היו:
    {{legal_heirs_list}}

**אין התנגדות:**
12. {{no_contest_statement}}

**העיזבון:**
13. העיזבון כולל:
    {{estate_brief_description}}
    שווי משוער: {{estate_estimated_value}} ש"ח

**התחייבות:**
14. אני מתחייב/ת כי:
    - הצוואה המוגשת היא הצוואה האחרונה של המנוח/ה
    - לא ידוע לי על צוואה מאוחרת יותר
    - {{additional_undertakings}}

**הבקשה:**
15. לפיכך, מתבקש בית המשפט הנכבד:
    - לאשר את הצוואה מיום {{will_date}}
    - להוציא צו ירושה על פי הצוואה
    - {{#if executor_appointment}}למנות את {{executor_name}} למנהל/ת העיזבון{{/if}}
    - {{additional_requests}}`,
    variables: [
      'court_location',
      'deceased_name', 'deceased_id', 'death_date', 'death_location',
      'last_residence', 'age_at_death', 'marital_status_description',
      'petitioner_name', 'petitioner_id', 'petitioner_address',
      'lawyer_name', 'lawyer_license',
      'will_date', 'will_type', 'will_execution_details', 'will_location',
      'witnesses', 'witness_1_name', 'witness_1_id', 'witness_1_address',
      'witness_2_name', 'witness_2_id', 'witness_2_address',
      'will_main_provisions', 'beneficiaries',
      'legal_heirs_list', 'no_contest_statement',
      'estate_brief_description', 'estate_estimated_value',
      'additional_undertakings',
      'executor_appointment', 'executor_name', 'additional_requests'
    ],
    aiPrompt: 'נסח בקשה מכבדת ועניינית, פרט את הצוואה ותוכנה, ודא שכל הפרטים הנדרשים כלולים',
    usageInstructions: 'השתמש בבקשות לאישור צוואה כאשר אין התנגדות צפויה',
    documentTypes: ['court-petition', 'will-probate', 'inheritance']
  },

  {
    id: 'holographic-will-probate',
    title: 'אישור צוואה בכתב יד',
    category: 'legal-claims',
    content: `פרטי הצוואה בכתב יד:

**אופי הצוואה:**
1. הצוואה כתובה כולה בכתב ידו של המנוח/ה {{deceased_name}}.

2. הצוואה נושאת תאריך: {{will_date}}.

3. הצוואה חתומה בחתימת המנוח/ה.

**המצאות הצוואה:**
4. הצוואה נמצאה {{discovery_circumstances}}.

5. מיקום המציאה: {{discovery_location}}.

6. מועד המציאה: {{discovery_date}}.

7. הצוואה נמצאת כעת ב{{current_location}}.

**זיהוי כתב היד:**
8. זיהוי כתב היד של המנוח/ה:
   - {{identifier_1_name}}, {{identifier_1_relationship}}, מזהה/ה את כתב היד
   - {{identifier_2_name}}, {{identifier_2_relationship}}, מזהה/ה את כתב היד

9. {{#if handwriting_expert}}
   צורפה חוות דעת מומחה גרפולוג, {{expert_name}}, {{expert_credentials}}, המאשרת שכתב היד הוא של המנוח/ה.
   {{/if}}

**זיהוי החתימה:**
10. החתימה בצוואה זוהתה כחתימת המנוח/ה על ידי:
    - {{signature_identifier_1}}
    - {{signature_identifier_2}}

**מצב המנוח בעת כתיבת הצוואה:**
11. ביום כתיבת הצוואה ({{will_date}}), המנוח/ה:
    - היה/הייתה בגיל {{age_at_will}}
    - {{mental_capacity_description}}
    - {{physical_condition_description}}

**רצון חופשי:**
12. הצוואה נכתבה מרצון חופשי:
    - {{free_will_evidence_1}}
    - {{free_will_evidence_2}}
    - לא הופעל לחץ או כפייה: {{no_pressure_statement}}

**תוכן הצוואה:**
13. תוכן הצוואה בכתב יד:
    {{will_content_summary}}

**העדר צוואות אחרות:**
14. לא ידועה צוואה מאוחרת יותר.

15. {{#if prior_wills}}
    המנוח/ה עשה/תה צוואה קודמת ביום {{prior_will_date}}, אך הצוואה הנוכחית מבטלת אותה במפורש: {{revocation_clause}}.
    {{/if}}

**דרישת האישור:**
16. יש לאשר את הצוואה בכתב יד כצוואה כשרה לפי סעיף 19 לחוק הירושה.`,
    variables: [
      'deceased_name', 'will_date',
      'discovery_circumstances', 'discovery_location', 'discovery_date', 'current_location',
      'identifier_1_name', 'identifier_1_relationship',
      'identifier_2_name', 'identifier_2_relationship',
      'handwriting_expert', 'expert_name', 'expert_credentials',
      'signature_identifier_1', 'signature_identifier_2',
      'age_at_will', 'mental_capacity_description', 'physical_condition_description',
      'free_will_evidence_1', 'free_will_evidence_2', 'no_pressure_statement',
      'will_content_summary',
      'prior_wills', 'prior_will_date', 'revocation_clause'
    ],
    aiPrompt: 'הדגש את כשרות הצוואה בכתב יד, פרט זיהוי כתב היד והחתימה, הוכח כשרות נפשית ורצון חופשי',
    usageInstructions: 'השתמש בבקשות לאישור צוואות בכתב יד (צוואה הולוגרפית)',
    documentTypes: ['court-petition', 'will-probate', 'inheritance']
  },

  {
    id: 'witnessed-will-probate',
    title: 'אישור צוואה בפני עדים',
    category: 'legal-claims',
    content: `פרטי הצוואה בפני עדים:

**אופן עריכת הצוואה:**
1. ביום {{will_date}}, ב{{will_location}}, המנוח/ה {{deceased_name}} עשה/תה צוואה בפני עדים.

2. הצוואה {{will_format}} (נכתבה/הוקלדה).

3. המנוח/ה {{signature_method}} (חתם/ה/הטביע/ה חותמת).

**העדים:**
4. הצוואה נעשתה בפני שני עדים:

   **עד ראשון:**
   - שם: {{witness_1_name}}
   - ת.ז.: {{witness_1_id}}
   - גיל: {{witness_1_age}}
   - כתובת: {{witness_1_address}}
   - עיסוק: {{witness_1_occupation}}

   **עד שני:**
   - שם: {{witness_2_name}}
   - ת.ז.: {{witness_2_id}}
   - גיל: {{witness_2_age}}
   - כתובת: {{witness_2_address}}
   - עיסוק: {{witness_2_occupation}}

**הליך חתימת הצוואה:**
5. המנוח/ה הצהיר/ה בפני העדים כי זוהי צוואתו/ה.

6. {{reading_declaration}}

7. המנוח/ה חתם/ה על הצוואה בפני שני העדים.

8. שני העדים חתמו על הצוואה בפני המנוח/ה ובפני זה את זה.

9. {{simultaneous_presence}}

**כשרות העדים:**
10. שני העדים:
    - היו בני {{witness_1_age}} ו-{{witness_2_age}} בעת חתימת הצוואה (מעל גיל 18)
    - לא היו נהנים מהצוואה
    - {{witness_1_competency}}
    - {{witness_2_competency}}

**תצהירי העדים:**
11. צורפים תצהירי שני העדים המאשרים:
    - את נסיבות חתימת הצוואה
    - כי המנוח/ה היה/הייתה כשיר/ה נפשית
    - כי לא הופעל כל לחץ או כפייה
    - {{additional_witness_confirmation}}

**מצב המנוח בעת עריכת הצוואה:**
12. בעת עריכת הצוואה, המנוח/ה:
    - היה/הייתה בן/בת {{age_at_will_execution}}
    - {{mental_state_description}}
    - {{understanding_will_description}}
    - פעל/ה מתוך רצון חופשי: {{free_will_description}}

**העדר פגמים:**
13. לא נמצא כל פגם בעריכת הצוואה:
    - {{no_defect_1}}
    - {{no_defect_2}}

**תוכן הצוואה:**
14. תוכן הצוואה:
    {{will_provisions_summary}}`,
    variables: [
      'will_date', 'will_location', 'deceased_name',
      'will_format', 'signature_method',
      'witness_1_name', 'witness_1_id', 'witness_1_age', 'witness_1_address', 'witness_1_occupation',
      'witness_2_name', 'witness_2_id', 'witness_2_age', 'witness_2_address', 'witness_2_occupation',
      'reading_declaration', 'simultaneous_presence',
      'witness_1_competency', 'witness_2_competency',
      'additional_witness_confirmation',
      'age_at_will_execution', 'mental_state_description',
      'understanding_will_description', 'free_will_description',
      'no_defect_1', 'no_defect_2',
      'will_provisions_summary'
    ],
    aiPrompt: 'פרט את הליך חתימת הצוואה, הדגש עמידה בדרישות החוק, תאר כשרות העדים',
    usageInstructions: 'השתמש בבקשות לאישור צוואות בפני עדים',
    documentTypes: ['court-petition', 'will-probate', 'inheritance']
  },

  {
    id: 'notarial-will-probate',
    title: 'אישור צוואה בפני רשות',
    category: 'legal-claims',
    content: `פרטי הצוואה בפני רשות:

**עריכת הצוואה:**
1. ביום {{will_date}}, המנוח/ה {{deceased_name}} עשה/תה צוואה בפני {{authority_type}} (שופט/רשם/נוטריון/רשות דתית).

2. מקום עריכת הצוואה: {{will_execution_location}}.

3. {{#if authority_name}}הרשות: {{authority_title}} {{authority_name}}{{/if}}

**הליך עריכת הצוואה:**
4. המנוח/ה התייצב/ה בפני {{authority_type}}.

5. {{mental_examination_description}}

6. המנוח/ה הביע/ה את רצונו/ה האחרון בעל פה / הציג/ה צוואה כתובה.

7. {{documentation_method}}

8. הצוואה נרשמה {{registration_method}}.

**אישור הרשות:**
9. {{authority_type}} אישר/ה:
   - כי המנוח/ה היה/הייתה כשיר/ה נפשית
   - כי המנוח/ה פעל/ה מרצון חופשי
   - כי הבין/ה את תוכן צוואתו/ה
   - {{additional_authority_confirmation}}

10. הצוואה נחתמה על ידי:
    - המנוח/ה
    - {{authority_type}}
    - {{#if witnesses}}העדים: {{witnesses_names}}{{/if}}

**רישום:**
11. הצוואה נרשמה {{registration_details}}.

12. {{#if registration_number}}מספר רישום: {{registration_number}}{{/if}}

**מסמכים רשמיים:**
13. מצורפים:
    - העתק מהצוואה המקורית
    - אישור {{authority_type}}
    - {{#if protocol}}פרוטוקול עריכת הצוואה{{/if}}
    - {{additional_documents}}

**תוכן הצוואה:**
14. תוכן הצוואה שנרשמה בפני הרשות:
    {{will_content_detailed}}

**חזקת הכשרות:**
15. צוואה בפני רשות נהנית מחזקת כשרות מוגברת.

16. לא ידועה כל סיבה לפגם בצוואה.`,
    variables: [
      'will_date', 'deceased_name',
      'authority_type', 'will_execution_location',
      'authority_name', 'authority_title',
      'mental_examination_description',
      'documentation_method', 'registration_method',
      'additional_authority_confirmation',
      'witnesses', 'witnesses_names',
      'registration_details', 'registration_number',
      'protocol', 'additional_documents',
      'will_content_detailed'
    ],
    aiPrompt: 'הדגש את האמינות של צוואה בפני רשות, פרט את תהליך העריכה, ציין רישום',
    usageInstructions: 'השתמש בבקשות לאישור צוואות שנעשו בפני רשות',
    documentTypes: ['court-petition', 'will-probate', 'inheritance']
  },

  {
    id: 'will-provisions-real-estate',
    title: 'הוראות צוואה - נדל"ן',
    category: 'facts',
    content: `הוראות הצוואה בנוגע לנכסי המקרקעין:

**נכסי המקרקעין:**
1. המנוח/ה הותיר/ה נכסי מקרקעין כדלקמן:

{{#each properties}}
**נכס מספר {{@index}}:**
- כתובת: {{this.address}}
- סוג: {{this.type}} (דירה/בית/קרקע/מסחרי)
- גוש: {{this.block}}, חלקה: {{this.parcel}}
- שטח: {{this.area}} מ"ר
- רישום: {{this.registration_status}}
- {{#if this.mortgage}}משכנתא: {{this.mortgage_amount}} ש"ח ל{{this.mortgage_bank}}{{/if}}
- שווי משוער: {{this.estimated_value}} ש"ח
{{/each}}

**הוראות הצוואה:**
2. על פי הצוואה:

{{#each property_distributions}}
**לגבי הנכס ב{{this.property_address}}:**
{{this.disposition}}

{{#if this.conditions}}
תנאים:
- {{this.condition_1}}
- {{this.condition_2}}
{{/if}}

{{#if this.restrictions}}
מגבלות:
- {{this.restriction_1}}
- {{this.restriction_2}}
{{/if}}
{{/each}}

**זכויות מגורים:**
{{#if residence_rights}}
3. המנוח/ה קבע/ה זכות מגורים:
   - ל{{residence_right_holder}}, {{relationship}}
   - בנכס: {{residence_property}}
   - תקופה: {{residence_duration}}
   - תנאים: {{residence_conditions}}
{{/if}}

**זכויות שימוש:**
{{#if usage_rights}}
4. נקבעו זכויות שימוש:
   {{usage_rights_details}}
{{/if}}

**דירת מגורים:**
{{#if primary_residence}}
5. לגבי דירת המגורים הראשית ב{{primary_residence_address}}:
   {{primary_residence_disposition}}
{{/if}}

**חובות על הנכסים:**
6. על נכסי המקרקעין חלות החובות הבאים:
   {{#each property_debts}}
   - {{this.property}}: {{this.debt_type}} בסך {{this.amount}} ש"ח ל{{this.creditor}}
   {{/each}}

**אחריות לחובות:**
7. על פי הצוואה, האחריות לחובות {{debt_responsibility}}.

**הנחיות למכירה:**
{{#if sale_instructions}}
8. המנוח/ה הורה/תה:
   {{sale_instructions_details}}
{{/if}}`,
    variables: [
      'properties',
      'property_distributions',
      'residence_rights', 'residence_right_holder', 'relationship',
      'residence_property', 'residence_duration', 'residence_conditions',
      'usage_rights', 'usage_rights_details',
      'primary_residence', 'primary_residence_address', 'primary_residence_disposition',
      'property_debts', 'debt_responsibility',
      'sale_instructions', 'sale_instructions_details'
    ],
    aiPrompt: 'פרט את הוראות הצוואה לגבי מקרקעין, כלול זכויות מגורים ושימוש, הסבר חלוקה',
    usageInstructions: 'השתמש לפירוט הוראות צוואה בנוגע לנדל"ן',
    documentTypes: ['will-probate', 'inheritance']
  },

  {
    id: 'will-provisions-movable-property',
    title: 'הוראות צוואה - מיטלטלין וחשבונות',
    category: 'facts',
    content: `הוראות הצוואה בנוגע למיטלטלין ונכסים פיננסיים:

**חשבונות בנק:**
1. המנוח/ה הותיר/ה חשבונות בנק:
   {{#each bank_accounts}}
   - {{this.bank_name}}, סניף {{this.branch}}, חשבון {{this.account_number}}
     יתרה ליום הפטירה: {{this.balance}} ש"ח
     הוראה בצוואה: {{this.instruction}}
   {{/each}}

**חשבונות השקעה:**
2. חשבונות השקעה וניירות ערך:
   {{#each investment_accounts}}
   - {{this.institution}}, חשבון {{this.account_number}}
     סוג: {{this.type}}
     שווי: {{this.value}} ש"ח
     הוראה: {{this.instruction}}
   {{/each}}

**קרנות פנסיה וקופות גמל:**
3. זכויות פנסיוניות:
   {{#each pension_funds}}
   - {{this.fund_name}}, מספר חשבון: {{this.account}}
     צבירה: {{this.accumulated}} ש"ח
     מוטב/ים: {{this.beneficiary}}
   {{/each}}

**רכב:**
{{#if vehicles}}
4. כלי רכב:
   {{#each vehicles_list}}
   - {{this.type}}, מספר רישוי: {{this.license}}
     שנת ייצור: {{this.year}}
     שווי: {{this.value}} ש"ח
     יורש: {{this.heir}}
   {{/each}}
{{/if}}

**תכשיטים וחפצי ערך:**
{{#if jewelry}}
5. תכשיטים וחפצי ערך:
   {{jewelry_disposition}}
{{/if}}

**ריהוט וחפצים אישיים:**
6. לגבי ריהוט וחפצים אישיים:
   {{furniture_disposition}}

**אוספים:**
{{#if collections}}
7. אוספים מיוחדים:
   {{#each collections_list}}
   - {{this.type}}: {{this.description}}
     שווי משוער: {{this.value}} ש"ח
     הוראה: {{this.instruction}}
   {{/each}}
{{/if}}

**זכויות יוצרים וקניין רוחני:**
{{#if intellectual_property}}
8. זכויות יוצרים וקניין רוחני:
   {{intellectual_property_disposition}}
{{/if}}

**חובות וזכויות:**
9. חובות שיש לגבות:
   {{#each debts_receivable}}
   - {{this.debtor_name}} חייב/ת {{this.amount}} ש"ח: {{this.instruction}}
   {{/each}}

10. חובות לפירעון:
    {{#each debts_payable}}
    - ל{{this.creditor}}: {{this.amount}} ש"ח - {{this.payment_instruction}}
    {{/each}}

**עסק:**
{{#if business}}
11. המנוח/ה בעל/ת עסק:
    - שם: {{business_name}}
    - ח.פ.: {{business_id}}
    - סוג: {{business_type}}
    - אחוזי בעלות: {{ownership_percentage}}%
    - הוראה: {{business_disposition}}
{{/if}}

**שארית העיזבון:**
12. שארית העיזבון (כל נכס שלא צוין במפורש):
    {{residual_estate_disposition}}`,
    variables: [
      'bank_accounts', 'investment_accounts', 'pension_funds',
      'vehicles', 'vehicles_list',
      'jewelry', 'jewelry_disposition',
      'furniture_disposition',
      'collections', 'collections_list',
      'intellectual_property', 'intellectual_property_disposition',
      'debts_receivable', 'debts_payable',
      'business', 'business_name', 'business_id', 'business_type',
      'ownership_percentage', 'business_disposition',
      'residual_estate_disposition'
    ],
    aiPrompt: 'פרט את כל סוגי הנכסים המיטלטלין והפיננסיים, כלול הוראות ספציפיות לכל סוג',
    usageInstructions: 'השתמש לפירוט הוראות צוואה בנוגע למיטלטלין וחשבונות',
    documentTypes: ['will-probate', 'inheritance']
  },

  {
    id: 'executor-appointment-details',
    title: 'מינוי מנהל עיזבון',
    category: 'legal-claims',
    content: `מינוי מנהל/ת עיזבון:

**המינוי בצוואה:**
1. על פי הצוואה, המנוח/ה מינה/תה את {{executor_name}}, ת.ז. {{executor_id}}, למנהל/ת עיזבונו/ה.

2. {{executor_relationship}}

**פרטי מנהל/ת העיזבון:**
3. שם מלא: {{executor_full_name}}
   ת.ז.: {{executor_id}}
   גיל: {{executor_age}}
   כתובת: {{executor_address}}
   טלפון: {{executor_phone}}
   דוא"ל: {{executor_email}}

**כשירות:**
4. {{executor_name}} כשיר/ה לשמש כמנהל/ת עיזבון:
   - בגיר/ה ובר/ת דעת
   - לא פושט/ת רגל
   - {{competency_details}}

**הסכמה:**
5. {{executor_name}} מסכים/ה לשמש כמנהל/ת העיזבון.

**סמכויות מנהל העיזבון:**
6. על פי הצוואה, למנהל/ת העיזבון הסמכויות הבאות:
   {{#if executor_powers}}
   - {{power_1}}
   - {{power_2}}
   - {{power_3}}
   {{else}}
   - לנהל את העיזבון
   - למכור נכסים
   - לפרוע חובות
   - לחלק את העיזבון
   {{/if}}

**מגבלות:**
{{#if executor_limitations}}
7. הוטלו המגבלות הבאות על מנהל/ת העיזבון:
   - {{limitation_1}}
   - {{limitation_2}}
{{/if}}

**מנהלים משותפים:**
{{#if co_executors}}
8. בצוואה מונו מנהלי עיזבון משותפים:
   {{#each co_executors_list}}
   - {{this.name}}, ת.ז. {{this.id}}, {{this.relationship}}
   {{/each}}
   
   החלטות יתקבלו {{decision_method}}.
{{/if}}

**מנהל/ת חלופי/ת:**
{{#if alternate_executor}}
9. במקרה שמנהל/ת העיזבון לא יוכל/תוכל לכהן, מונה/ת {{alternate_executor_name}} כמנהל/ת חלופי/ת.
{{/if}}

**שכר טרחה:**
10. {{#if executor_fee}}
    מנהל/ת העיזבון יהיה/תהיה זכאי/ת לשכר טרחה: {{executor_fee_terms}}
    {{else}}
    מנהל/ת העיזבון מסכים/ה לשמש ללא תמורה.
    {{/if}}

**התחייבות מנהל העיזבון:**
11. {{executor_name}} מתחייב/ת:
    - לנהל את העיזבון בנאמנות
    - לפעול למען האינטרס של היורשים
    - להגיש דוחות על פי דרישה
    - {{additional_executor_commitments}}

**ערובה:**
{{#if bond_required}}
12. מנהל/ת העיזבון ידרש/תידרש להפקיד ערובה בסך {{bond_amount}} ש"ח.
{{/if}}`,
    variables: [
      'executor_name', 'executor_id', 'executor_relationship',
      'executor_full_name', 'executor_age', 'executor_address',
      'executor_phone', 'executor_email',
      'competency_details',
      'executor_powers', 'power_1', 'power_2', 'power_3',
      'executor_limitations', 'limitation_1', 'limitation_2',
      'co_executors', 'co_executors_list', 'decision_method',
      'alternate_executor', 'alternate_executor_name',
      'executor_fee', 'executor_fee_terms',
      'additional_executor_commitments',
      'bond_required', 'bond_amount'
    ],
    aiPrompt: 'פרט את כשירות מנהל העיזבון, הגדר סמכויות ומגבלות, כלול התחייבויות',
    usageInstructions: 'השתמש למינוי מנהל עיזבון על פי צוואה',
    documentTypes: ['will-probate', 'inheritance']
  },

  {
    id: 'will-special-provisions',
    title: 'הוראות מיוחדות בצוואה',
    category: 'facts',
    content: `הוראות מיוחדות בצוואה:

**הוראות קבורה:**
{{#if burial_instructions}}
1. המנוח/ה השאיר/ה הוראות קבורה:
   - מקום הקבורה: {{burial_place}}
   - סוג הקבורה: {{burial_type}}
   - {{burial_ceremony_wishes}}
   - {{additional_burial_instructions}}
{{/if}}

**הוראות לוויה:**
{{#if funeral_instructions}}
2. הוראות לגבי הלוויה:
   {{funeral_instructions_details}}
{{/if}}

**תנאים למתן ירושה:**
{{#if conditional_bequests}}
3. המנוח/ה קבע/ה תנאים למתן ירושה:
   
   {{#each conditions}}
   **תנאי מספר {{@index}}:**
   - יורש: {{this.heir}}
   - נכס: {{this.asset}}
   - תנאי: {{this.condition}}
   - במידה ולא יתקיים: {{this.alternative}}
   {{/each}}
{{/if}}

**צדקה ותרומות:**
{{#if charitable_bequests}}
4. הוראות לתרומות צדקה:
   {{#each charities}}
   - ל{{this.organization}}: {{this.amount}} ש"ח / {{this.asset_description}}
     מטרה: {{this.purpose}}
   {{/each}}
{{/if}}

**קרן לזכרו:**
{{#if memorial_fund}}
5. המנוח/ה הורה/תה להקים קרן לזכרו/ה:
   - שם הקרן: {{fund_name}}
   - סכום: {{fund_amount}} ש"ח
   - מטרת הקרן: {{fund_purpose}}
   - מנהלי הקרן: {{fund_managers}}
{{/if}}

**הוראות לטיפול בבעלי חיים:**
{{#if pet_provisions}}
6. הוראות לטיפול בבעלי חיים:
   {{#each pets}}
   - {{this.type}}, שם: {{this.name}}
     אחראי: {{this.caretaker}}
     הקצאת כספים: {{this.funds}} ש"ח
   {{/each}}
{{/if}}

**הוראות לטיפול בקטינים:**
{{#if minor_care_instructions}}
7. הוראות לטיפול בילדים קטינים:
   - מי ידאג: {{guardian_name}}
   - הקצאת כספים: {{trust_fund_details}}
   - {{education_instructions}}
{{/if}}

**נאמנות:**
{{#if trust_provisions}}
8. הקמת נאמנות:
   - נכסים בנאמנות: {{trust_assets}}
   - נאמן: {{trustee_name}}
   - נהנים: {{trust_beneficiaries}}
   - תנאי הנאמנות: {{trust_terms}}
   - משך הנאמנות: {{trust_duration}}
{{/if}}

**סודיות:**
{{#if confidentiality}}
9. המנוח/ה ביקש/ה לשמור בסוד:
   {{confidentiality_instructions}}
{{/if}}

**איסור תחרות:**
{{#if no_contest_clause}}
10. המנוח/ה כלל/ה סעיף "no contest":
    {{no_contest_clause_text}}
{{/if}}

**ביטול צוואות קודמות:**
11. המנוח/ה הצהיר/ה במפורש:
    {{revocation_statement}}

**הוראות לשינוי צוואה:**
{{#if amendment_instructions}}
12. הוראות לשינוי הצוואה לאחר המוות:
    {{amendment_instructions_details}}
{{/if}}`,
    variables: [
      'burial_instructions', 'burial_place', 'burial_type',
      'burial_ceremony_wishes', 'additional_burial_instructions',
      'funeral_instructions', 'funeral_instructions_details',
      'conditional_bequests', 'conditions',
      'charitable_bequests', 'charities',
      'memorial_fund', 'fund_name', 'fund_amount', 'fund_purpose', 'fund_managers',
      'pet_provisions', 'pets',
      'minor_care_instructions', 'guardian_name', 'trust_fund_details', 'education_instructions',
      'trust_provisions', 'trust_assets', 'trustee_name',
      'trust_beneficiaries', 'trust_terms', 'trust_duration',
      'confidentiality', 'confidentiality_instructions',
      'no_contest_clause', 'no_contest_clause_text',
      'revocation_statement',
      'amendment_instructions', 'amendment_instructions_details'
    ],
    aiPrompt: 'פרט הוראות מיוחדות, הסבר תנאים ומגבלות, כלול הוראות לנאמנויות וקרנות',
    usageInstructions: 'השתמש לפירוט הוראות מיוחדות שאינן חלוקה רגילה של נכסים',
    documentTypes: ['will-probate', 'inheritance']
  }
];

