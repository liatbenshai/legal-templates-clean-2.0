/**
 * מחסן כתבי בית משפט - צוואות וירושות - חלק 2: התנגדויות לצוואות
 * סעיפים מקיפים להתנגדות ופסילת צוואות
 */

import { CourtSectionTemplate } from './court-warehouse';

export const willContestSections: CourtSectionTemplate[] = [
  {
    id: 'will-contest-opening-comprehensive',
    title: 'התנגדות לצוואה - פתיחה מקיפה',
    category: 'opening',
    content: `לכבוד בית המשפט לענייני משפחה {{court_location}}

בעניין: התנגדות לבקשה לאישור צוואה

בעניין עיזבון המנוח/ה {{deceased_name}}, ת.ז. {{deceased_id}}

**המתנגד/ת:**
שם: {{objector_name}}
ת.ז.: {{objector_id}}
כתובת: {{objector_address}}
באמצעות ב"כ עו"ד {{lawyer_name}}

**המבקש/ת (המבקש/ת לאשר את הצוואה):**
שם: {{petitioner_name}}
ת.ז.: {{petitioner_id}}

**המנוח/ה:**
1. {{deceased_name}} נפטר/ה ביום {{death_date}}.

**הקשר של המתנגד/ת:**
2. המתנגד/ת הוא/היא {{relationship_to_deceased}} של המנוח/ה.

3. {{interest_in_estate}}

**הצוואה המבוקשת לאישור:**
4. המבקש/ת מבקש/ת לאשר צוואה מיום {{contested_will_date}}.

**עילות ההתנגדות:**
5. המתנגד/ת מתנגד/ת לאישור הצוואה מהעילות הבאות:

{{grounds_summary}}

**הבקשה:**
6. לפיכך, מתבקש בית המשפט הנכבד:
   - לדחות את הבקשה לאישור הצוואה מיום {{contested_will_date}}
   - {{alternative_request}}
   - לחייב את המבקש/ת בהוצאות`,
    variables: [
      'court_location',
      'deceased_name', 'deceased_id', 'death_date',
      'objector_name', 'objector_id', 'objector_address', 'lawyer_name',
      'petitioner_name', 'petitioner_id',
      'relationship_to_deceased', 'interest_in_estate',
      'contested_will_date', 'grounds_summary',
      'alternative_request'
    ],
    aiPrompt: 'נסח התנגדות רשמית וברורה, הדגש את הקשר למנוח ואת האינטרס של המתנגד',
    usageInstructions: 'השתמש לפתיחת כתב התנגדות לצוואה',
    documentTypes: ['court-petition', 'will-contest']
  },

  {
    id: 'will-contest-lack-of-capacity',
    title: 'התנגדות - חוסר כשרות נפשית',
    category: 'legal-claims',
    content: `עילת התנגדות: חוסר כשרות נפשית

**כשרות נפשית:**
1. על פי סעיף 26 לחוק הירושה, כשרות לעשות צוואה דורשת:
   - הבנת מהות הצוואה
   - הכרת רכושו ויורשיו
   - השגת משמעות החלוקה

**מצבו הנפשי של המנוח/ה:**
2. בעת עריכת הצוואה ({{will_date}}), המנוח/ה:
   - היה/הייתה בן/בת {{age_at_will}}
   - {{mental_state_description}}

**מחלות ומצבים רפואיים:**
3. המנוח/ה סבל/ה מ:
   {{#each medical_conditions}}
   - {{this.condition}}
     אבחנה: {{this.diagnosis_date}}
     מטפל/ת: {{this.doctor}}
     השפעה: {{this.impact}}
   {{/each}}

**תרופות:**
4. המנוח/ה נטל/ה תרופות:
   {{#each medications}}
   - {{this.name}} - {{this.purpose}}
     מינון: {{this.dosage}}
     תופעות לוואי: {{this.side_effects}}
   {{/each}}

**אירועים מצביעים:**
5. לפני ואחרי עריכת הצוואה התרחשו אירועים המעידים על חוסר כשרות:
   {{#each incidents}}
   - {{this.date}}: {{this.description}}
     עדים: {{this.witnesses}}
   {{/each}}

**עדויות על חוסר הבנה:**
6. {{lack_of_understanding_evidence}}

**אשפוזים פסיכיאטריים:**
{{#if psychiatric_hospitalizations}}
7. המנוח/ה אושפז/ה:
   {{#each hospitalizations}}
   - ב{{this.hospital}} מ{{this.start_date}} עד {{this.end_date}}
     אבחנה: {{this.diagnosis}}
   {{/each}}
{{/if}}

**חוות דעת מומחים:**
8. {{expert_opinion_summary}}

**רטרואקטיבית:**
9. גם אם המנוח/ה נראה/תה תקין/ה באותו יום, {{retroactive_incapacity}}.

**זמן קצר לפני/אחרי:**
10. {{temporal_proximity_evidence}}

**השוואה לצוואות קודמות:**
{{#if prior_wills}}
11. המנוח/ה עשה/תה צוואה קודמת ב{{prior_will_date}}:
    {{comparison_to_prior_will}}
{{/if}}

**חוסר עקביות:**
12. הצוואה חסרת הגיון ועקביות:
    - {{inconsistency_1}}
    - {{inconsistency_2}}
    - {{inconsistency_3}}`,
    variables: [
      'will_date', 'age_at_will', 'mental_state_description',
      'medical_conditions', 'medications',
      'incidents',
      'lack_of_understanding_evidence',
      'psychiatric_hospitalizations', 'hospitalizations',
      'expert_opinion_summary',
      'retroactive_incapacity', 'temporal_proximity_evidence',
      'prior_wills', 'prior_will_date', 'comparison_to_prior_will',
      'inconsistency_1', 'inconsistency_2', 'inconsistency_3'
    ],
    aiPrompt: 'הוכח חוסר כשרות נפשית בראיות רפואיות וקליניות, הדגש מצב בזמן הצוואה',
    usageInstructions: 'השתמש כאשר יש ראיות לחוסר כשרות נפשית בעת עריכת הצוואה',
    documentTypes: ['will-contest']
  },

  {
    id: 'will-contest-undue-influence',
    title: 'התנגדות - השפעה בלתי הוגנת',
    category: 'legal-claims',
    content: `עילת התנגדות: השפעה בלתי הוגנת

**עקרון השפעה בלתי הוגנת:**
1. השפעה בלתי הוגנת מתקיימת כאשר:
   - קיים יחס תלות או אמון מיוחד
   - הנהנה מהצוואה השפיע על המצווה
   - הצוואה אינה משקפת את רצונו האמיתי של המצווה

**יחסי תלות:**
2. בין המנוח/ה ל{{influencer_name}} (הנהנה/ית מהצוואה) התקיימו יחסי תלות:
   - {{dependency_description}}
   - {{power_imbalance}}

**מצב המנוח/ה:**
3. המנוח/ה היה/הייתה במצב פגיע:
   - גיל: {{age_at_will}}
   - מצב בריאותי: {{health_condition}}
   - מצב נפשי: {{emotional_state}}
   - בידוד חברתי: {{social_isolation}}

**פעולות ההשפעה:**
4. {{influencer_name}} הפעיל/ה השפעה בלתי הוגנת באמצעות:
   
   {{#each influence_tactics}}
   **{{this.date}}:**
   {{this.action}}
   עדים: {{this.witnesses}}
   {{/each}}

**בידוד המנוח/ה:**
5. {{influencer_name}} בידד/ה את המנוח/ה ממשפחתו/ה:
   - {{isolation_method_1}}
   - {{isolation_method_2}}
   - {{isolation_method_3}}

**שליטה בגישה:**
6. {{influencer_name}} שלט/ה על:
   - גישה פיזית למנוח/ה: {{physical_access_control}}
   - תקשורת עם אחרים: {{communication_control}}
   - מידע שהגיע למנוח/ה: {{information_control}}

**לחץ ואיומים:**
{{#if pressure}}
7. {{influencer_name}} הפעיל/ה לחץ:
   {{#each pressure_incidents}}
   - {{this.description}}
   {{/each}}
{{/if}}

**השתתפות בעריכת הצוואה:**
8. {{influencer_name}} היה/הייתה מעורב/ת באופן פעיל בעריכת הצוואה:
   - {{involvement_1}}
   - {{involvement_2}}
   - {{involvement_3}}

**העדר ייעוץ עצמאי:**
9. המנוח/ה לא קיבל/ה ייעוץ משפטי עצמאי:
   {{lack_of_independent_advice}}

**שינוי פתאומי:**
10. הצוואה מהווה שינוי דרמטי מצוואות קודמות:
    {{dramatic_change_description}}

**הנפקה בלתי סבירה:**
11. החלוקה בצוואה אינה הגיונית:
    - {{unreasonable_provision_1}}
    - {{unreasonable_provision_2}}

**עדויות של אחרים:**
12. עדים מספרים על מצב המנוח/ה:
    {{#each witness_testimonies}}
    - {{this.witness_name}}: {{this.testimony_summary}}
    {{/each}}

**הפרת אמונים:**
{{#if fiduciary_breach}}
13. {{influencer_name}} היה/הייתה באמון מיוחד (מטפל/רופא/עו"ד):
    {{fiduciary_relationship_description}}
    והפר/ה אמונים זה.
{{/if}}`,
    variables: [
      'influencer_name',
      'dependency_description', 'power_imbalance',
      'age_at_will', 'health_condition', 'emotional_state', 'social_isolation',
      'influence_tactics',
      'isolation_method_1', 'isolation_method_2', 'isolation_method_3',
      'physical_access_control', 'communication_control', 'information_control',
      'pressure', 'pressure_incidents',
      'involvement_1', 'involvement_2', 'involvement_3',
      'lack_of_independent_advice',
      'dramatic_change_description',
      'unreasonable_provision_1', 'unreasonable_provision_2',
      'witness_testimonies',
      'fiduciary_breach', 'fiduciary_relationship_description'
    ],
    aiPrompt: 'הוכח השפעה בלתי הוגנת דרך דפוס התנהגות, הדגש תלות ופגיעות, הראה שינוי דרמטי',
    usageInstructions: 'השתמש כאשר יש ראיות להשפעה בלתי הוגנת של אדם על המצווה',
    documentTypes: ['will-contest']
  },

  {
    id: 'will-contest-fraud-forgery',
    title: 'התנגדות - זיוף והונאה',
    category: 'legal-claims',
    content: `עילת התנגדות: זיוף והונאה

**טענת הזיוף/הונאה:**
1. הצוואה המבוקשת לאישור היא מזויפת / הושגה בהונאה.

**זיוף חתימה:**
{{#if signature_forgery}}
2. חתימת המנוח/ה על הצוואה מזויפת:
   
   **ראיות לזיוף:**
   - {{forgery_evidence_1}}
   - {{forgery_evidence_2}}
   
   **השוואה לחתימות אמיתיות:**
   - {{signature_comparison}}
   
   **חוות דעת גרפולוג:**
   - {{graphologist_name}}, {{credentials}}
   - מסקנה: {{graphology_conclusion}}
{{/if}}

**זיוף כתב יד:**
{{#if handwriting_forgery}}
3. כתב היד בצוואה אינו של המנוח/ה:
   {{handwriting_evidence}}
{{/if}}

**זיוף מסמך:**
{{#if document_forgery}}
4. המסמך עצמו מזויף:
   - {{document_forgery_evidence}}
   - בדיקה טכנית: {{forensic_examination}}
{{/if}}

**זיוף עדויות עדים:**
{{#if witness_fraud}}
5. עדויות העדים על הצוואה שקריות:
   {{#each false_witnesses}}
   - {{this.witness_name}}:
     טענת המבקש: {{this.claim}}
     האמת: {{this.reality}}
     ראיות: {{this.evidence}}
   {{/each}}
{{/if}}

**הונאה לגבי תוכן:**
6. המנוח/ה הוטעה/תה לגבי תוכן הצוואה:
   {{content_fraud_description}}

**הצגת עובדות כוזבות:**
7. {{influencer}} הציג/ה למנוח/ה עובדות כוזבות:
   {{#each false_representations}}
   - {{this.false_claim}}
     המציאות: {{this.truth}}
     השפעה: {{this.impact}}
   {{/each}}

**הסתרת מידע:**
8. {{influencer}} הסתיר/ה מהמנוח/ה מידע חיוני:
   - {{concealed_info_1}}
   - {{concealed_info_2}}

**תכנון מתוחכם:**
9. ניכר תכנון מתוחכם:
   {{sophisticated_scheme_description}}

**עדויות מצביעות:**
10. הראיות הבאות מצביעות על זיוף/הונאה:
    {{#each circumstantial_evidence}}
    - {{this.evidence_type}}: {{this.description}}
    {{/each}}

**מומחים:**
11. חוות דעת מומחים:
    {{#each expert_opinions}}
    - {{this.expert_name}}, {{this.field}}:
      {{this.conclusion}}
    {{/each}}

**נסיבות חשודות:**
12. נסיבות עריכת הצוואה חשודות:
    - {{suspicious_circumstance_1}}
    - {{suspicious_circumstance_2}}
    - {{suspicious_circumstance_3}}

**מניע:**
13. ל{{suspect}} היה מניע חזק:
    {{motive_description}}`,
    variables: [
      'signature_forgery', 'forgery_evidence_1', 'forgery_evidence_2',
      'signature_comparison',
      'graphologist_name', 'credentials', 'graphology_conclusion',
      'handwriting_forgery', 'handwriting_evidence',
      'document_forgery', 'document_forgery_evidence', 'forensic_examination',
      'witness_fraud', 'false_witnesses',
      'content_fraud_description',
      'influencer', 'false_representations',
      'concealed_info_1', 'concealed_info_2',
      'sophisticated_scheme_description',
      'circumstantial_evidence',
      'expert_opinions',
      'suspicious_circumstance_1', 'suspicious_circumstance_2', 'suspicious_circumstance_3',
      'suspect', 'motive_description'
    ],
    aiPrompt: 'הצג ראיות קונקרטיות לזיוף או הונאה, כלול חוות דעת מומחים, בנה מקרה משכנע',
    usageInstructions: 'השתמש כאשר יש חשד סביר לזיוף או הונאה בצוואה',
    documentTypes: ['will-contest']
  },

  {
    id: 'will-contest-procedural-defects',
    title: 'התנגדות - פגמים פרוצדורליים',
    category: 'legal-claims',
    content: `עילת התנגדות: פגמים פרוצדורליים בעריכת הצוואה

**דרישות החוק:**
1. על פי חוק הירושה, צוואה {{will_type}} דורשת:
   {{legal_requirements_list}}

**הפגמים:**
2. הצוואה נגועה בפגמים פרוצדורליים הבאים:

**פגמים בחתימה:**
{{#if signature_defects}}
3. פגמים בחתימת המנוח/ה:
   - {{signature_defect_1}}
   - {{signature_defect_2}}
{{/if}}

**פגמים בעדים:**
{{#if witness_defects}}
4. פגמים בעדויות:
   
   **לגבי עד {{witness_1_name}}:**
   - {{witness_1_defect}}
   
   **לגבי עד {{witness_2_name}}:**
   - {{witness_2_defect}}
   
   **פגמים נוספים:**
   - העדים לא היו נוכחים יחד: {{simultaneous_presence_issue}}
   - {{additional_witness_issues}}
{{/if}}

**עדים לא כשרים:**
{{#if incompetent_witnesses}}
5. העדים לא היו כשרים:
   {{#each witness_incompetency}}
   - {{this.witness_name}}: {{this.incompetency_reason}}
   {{/each}}
{{/if}}

**עדים נהנים:**
{{#if beneficiary_witnesses}}
6. אחד או יותר מהעדים נהנים מהצוואה:
   - {{beneficiary_witness_details}}
   - לפי סעיף 23 לחוק הירושה, הדבר פוסל את הצוואה.
{{/if}}

**העדר תאריך:**
{{#if no_date}}
7. הצוואה חסרת תאריך / התאריך אינו ברור:
   {{date_issue_description}}
{{/if}}

**פגם בהצהרה:**
{{#if declaration_defect}}
8. המנוח/ה לא הצהיר/ה כדין בפני העדים:
   {{declaration_defect_description}}
{{/if}}

**פגמים בצוואה בכתב יד:**
{{#if holographic_defects}}
9. צוואה בכתב יד נגועה בפגמים:
   - לא כולה בכתב יד: {{not_fully_handwritten}}
   - {{other_holographic_defects}}
{{/if}}

**פגמים בצוואה בפני רשות:**
{{#if notarial_defects}}
10. צוואה בפני רשות נגועה בפגמים:
    - {{notarial_defect_1}}
    - {{notarial_defect_2}}
{{/if}}

**העדר חתימה:**
{{#if unsigned}}
11. הצוואה אינה חתומה כדין:
    {{unsigned_issue}}
{{/if}}

**תוספות ותיקונים:**
{{#if alterations}}
12. בצוואה תוספות/תיקונים לא כדין:
    {{#each alterations_list}}
    - {{this.location}}: {{this.description}}
      לא מחותם: {{this.not_initialed}}
    {{/each}}
{{/if}}

**העדר עמידה בדרישות מיוחדות:**
{{#if special_requirements}}
13. הצוואה לא עומדת בדרישות מיוחדות:
    {{special_requirements_failure}}
{{/if}}

**מסקנה:**
14. בשל הפגמים הללו, הצוואה אינה כשרה ואינה ניתנת לאישור.`,
    variables: [
      'will_type', 'legal_requirements_list',
      'signature_defects', 'signature_defect_1', 'signature_defect_2',
      'witness_defects',
      'witness_1_name', 'witness_1_defect',
      'witness_2_name', 'witness_2_defect',
      'simultaneous_presence_issue', 'additional_witness_issues',
      'incompetent_witnesses', 'witness_incompetency',
      'beneficiary_witnesses', 'beneficiary_witness_details',
      'no_date', 'date_issue_description',
      'declaration_defect', 'declaration_defect_description',
      'holographic_defects', 'not_fully_handwritten', 'other_holographic_defects',
      'notarial_defects', 'notarial_defect_1', 'notarial_defect_2',
      'unsigned', 'unsigned_issue',
      'alterations', 'alterations_list',
      'special_requirements', 'special_requirements_failure'
    ],
    aiPrompt: 'פרט בדייקנות את הפגמים הפרוצדורליים, הפנה לסעיפי חוק ספציפיים',
    usageInstructions: 'השתמש כאשר יש פגמים טכניים בעריכת הצוואה',
    documentTypes: ['will-contest']
  },

  {
    id: 'will-contest-later-will',
    title: 'התנגדות - קיומה של צוואה מאוחרת',
    category: 'legal-claims',
    content: `עילת התנגדות: קיומה של צוואה מאוחרת יותר

**הצוואה המאוחרת:**
1. המתנגד/ת טוען/ת כי קיימת צוואה מאוחרת יותר מהצוואה המבוקשת לאישור.

**פרטי הצוואה המאוחרת:**
2. הצוואה המאוחרת:
   - תאריך: {{later_will_date}}
   - סוג: {{later_will_type}}
   - {{later_will_location}}

**השוואת תאריכים:**
3. הצוואה המבוקשת לאישור: {{contested_will_date}}
   הצוואה המאוחרת: {{later_will_date}}
   
   הצוואה המאוחרת היא ב-{{time_difference}} לאחר הצוואה המבוקשת לאישור.

**כיצד התגלתה:**
4. הצוואה המאוחרת התגלתה:
   {{discovery_circumstances}}

**תוכן הצוואה המאוחרת:**
5. תוכן הצוואה המאוחרת:
   {{later_will_content_summary}}

**שינויים מהצוואה המוקדמת:**
6. הצוואה המאוחרת משנה את הצוואה המוקדמת:
   {{#each changes}}
   - {{this.aspect}}: 
     בצוואה המוקדמת: {{this.in_earlier_will}}
     בצוואה המאוחרת: {{this.in_later_will}}
   {{/each}}

**ביטול מפורש:**
{{#if express_revocation}}
7. הצוואה המאוחרת מבטלת במפורש את הצוואה המוקדמת:
   {{revocation_clause}}
{{/if}}

**ביטול מכללא:**
8. גם אם אין ביטול מפורש, הצוואה המאוחרת מבטלת את המוקדמת מכללא:
   {{implied_revocation_argument}}

**כשרות הצוואה המאוחרת:**
9. הצוואה המאוחרת כשרה:
   - {{validity_factor_1}}
   - {{validity_factor_2}}
   - {{validity_factor_3}}

**עדים לצוואה המאוחרת:**
{{#if later_will_witnesses}}
10. עדים לצוואה המאוחרת:
    - {{witness_1_details}}
    - {{witness_2_details}}
{{/if}}

**נסיבות עריכת הצוואה המאוחרת:**
11. הצוואה המאוחרת נעשתה:
    {{later_will_circumstances}}

**סתירות:**
12. הצוואה המבוקשת לאישור סותרת את הצוואה המאוחרת:
    {{contradictions}}

**המצאת הצוואה:**
13. {{#if will_produced}}
    הצוואה המאוחרת מצורפת כנספח א'.
    {{else}}
    הצוואה המאוחרת תוגש תוך {{filing_deadline}} ימים.
    {{/if}}

**בקשה חלופית:**
14. לחלופין, מתבקש בית המשפט:
    - לאשר את הצוואה המאוחרת מיום {{later_will_date}}
    - {{alternative_relief}}`,
    variables: [
      'later_will_date', 'later_will_type', 'later_will_location',
      'contested_will_date', 'time_difference',
      'discovery_circumstances',
      'later_will_content_summary',
      'changes',
      'express_revocation', 'revocation_clause',
      'implied_revocation_argument',
      'validity_factor_1', 'validity_factor_2', 'validity_factor_3',
      'later_will_witnesses', 'witness_1_details', 'witness_2_details',
      'later_will_circumstances',
      'contradictions',
      'will_produced', 'filing_deadline',
      'alternative_relief'
    ],
    aiPrompt: 'הוכח קיומה של צוואה מאוחרת, הסבר מדוע היא עדיפה, פרט שינויים',
    usageInstructions: 'השתמש כאשר יש צוואה מאוחרת יותר מהצוואה המבוקשת לאישור',
    documentTypes: ['will-contest']
  },

  {
    id: 'will-contest-public-policy',
    title: 'התנגדות - סתירה לתקנת הציבור',
    category: 'legal-claims',
    content: `עילת התנגדות: הצוואה נוגדת את תקנת הציבור

**עקרון תקנת הציבור:**
1. על פי סעיף 35 לחוק הירושה, בית המשפט רשאי לפסול צוואה או חלק ממנה אם היא נוגדת את תקנת הציבור.

**סתירה לתקנת הציבור:**
2. הצוואה נוגדת את תקנת הציבור באופנים הבאים:

**הפליה:**
{{#if discrimination}}
3. הצוואה מפלה באופן בלתי לגיטימי:
   {{discrimination_description}}
   
   לדוגמה:
   - {{discrimination_example_1}}
   - {{discrimination_example_2}}
{{/if}}

**תנאי פסול:**
{{#if illegal_condition}}
4. הצוואה כוללת תנאי פסול:
   {{illegal_condition_description}}
   
   תנאי זה:
   - {{why_illegal_1}}
   - {{why_illegal_2}}
{{/if}}

**ניצול חסר ישע:**
{{#if exploitation}}
5. הצוואה משקפת ניצול של אדם חסר ישע:
   {{exploitation_description}}
{{/if}}

**תנאי בלתי מוסרי:**
{{#if immoral_condition}}
6. הצוואה כוללת תנאי בלתי מוסרי:
   {{immoral_condition_description}}
{{/if}}

**עידוד עבירה:**
{{#if encouragement_of_crime}}
7. הצוואה מעודדת עבירה על החוק:
   {{crime_encouragement_description}}
{{/if}}

**פגיעה בקטינים:**
{{#if harm_to_minors}}
8. הצוואה פוגעת בטובת קטינים:
   {{harm_to_minors_description}}
{{/if}}

**סתירה לחוקי יסוד:**
{{#if constitutional_violation}}
9. הצוואה סותרת ערכים חוקתיים:
   {{constitutional_violation_description}}
{{/if}}

**פסיקה רלוונטית:**
10. פסיקת בתי המשפט בעבר קבעה:
    {{relevant_case_law}}

**איזון:**
11. יש לאזן בין חופש הציווי לבין תקנת הציבור:
    {{balancing_argument}}

**הנזק:**
12. אישור הצוואה יגרום:
    - {{harm_1}}
    - {{harm_2}}

**בקשה:**
13. לפיכך, מתבקש בית המשפט לפסול את הצוואה או לפחות את {{specific_provision}} שבה.`,
    variables: [
      'will_type', 'legal_requirements_list',
      'discrimination', 'discrimination_description',
      'discrimination_example_1', 'discrimination_example_2',
      'illegal_condition', 'illegal_condition_description',
      'why_illegal_1', 'why_illegal_2',
      'exploitation', 'exploitation_description',
      'immoral_condition', 'immoral_condition_description',
      'encouragement_of_crime', 'crime_encouragement_description',
      'harm_to_minors', 'harm_to_minors_description',
      'constitutional_violation', 'constitutional_violation_description',
      'relevant_case_law',
      'balancing_argument',
      'harm_1', 'harm_2',
      'specific_provision'
    ],
    aiPrompt: 'הסבר מדוע הצוואה נוגדת תקנת ציבור, התבסס על ערכים חוקתיים ופסיקה',
    usageInstructions: 'השתמש כאשר הצוואה מכילה הוראות הנוגדות תקנת ציבור',
    documentTypes: ['will-contest']
  }
];

