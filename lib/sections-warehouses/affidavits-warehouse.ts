/**
 * מחסן סעיפים לתצהירים
 * כולל: תצהירים אישיים, עסקיים, לבית משפט, לרשויות
 */

export interface AffidavitSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'personal-details' | 'facts' | 'declarations' | 'attachments' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
  affidavitTypes: ('personal' | 'business' | 'court' | 'government' | 'insurance')[];
}

export const affidavitSectionsWarehouse: AffidavitSectionTemplate[] = [
  // פתיחות תצהיר
  {
    id: 'affidavit-opening-standard',
    title: 'פתיחת תצהיר סטנדרטית',
    category: 'opening',
    content: `תצהיר

אני הח"מ {{declarant_name}}, ת.ז. {{declarant_id}}, מכתובת {{declarant_address}}, לאחר שהוזהרתי כי עלי לומר את האמת וכי אהיה צפוי/ה לעונשים הקבועים בחוק אם לא אעשה כן, מצהיר/ה בזאת כדלקמן:`,
    variables: ['declarant_name', 'declarant_id', 'declarant_address'],
    aiPrompt: 'התאם את פתיחת התצהיר לזהות המצהיר ולמטרת התצהיר',
    usageInstructions: 'השתמש לפתיחת כל סוגי התצהירים',
    affidavitTypes: ['personal', 'business', 'court', 'government', 'insurance']
  },

  {
    id: 'affidavit-opening-business',
    title: 'פתיחת תצהיר עסקי',
    category: 'opening',
    content: `תצהיר מנהל

אני הח"מ {{manager_name}}, ת.ז. {{manager_id}}, מכתובת {{manager_address}}, המשמש כ{{manager_title}} ב{{company_name}} ח.פ. {{company_id}} (להלן: "החברה"), מוסמך לחתום ולהתחייב בשם החברה, לאחר שהוזהרתי כי עלי לומר את האמת וכי אהיה צפוי לעונשים הקבועים בחוק אם לא אעשה כן, מצהיר בזאת כדלקמן:`,
    variables: ['manager_name', 'manager_id', 'manager_address', 'manager_title', 'company_name', 'company_id'],
    aiPrompt: 'התאם את פתיחת התצהיר העסקי לתפקיד המצהיר ולסוג החברה',
    usageInstructions: 'השתמש בתצהירים מטעם חברות ועסקים',
    affidavitTypes: ['business']
  },

  // פרטים אישיים
  {
    id: 'personal-background',
    title: 'רקע אישי של המצהיר',
    category: 'personal-details',
    content: `פרטים אישיים:

1. אני בן/בת {{age}} שנים, {{marital_status}}, {{profession}}.

2. אני מכיר/ה את {{subject_person}} במשך {{relationship_duration}} בתור {{relationship_type}}.

3. הכרותי עם {{subject_person}} נובעת מ{{relationship_context}}.

4. אני בעל/ת ידע אישי ישיר בנושאים המתוארים בתצהיר זה.

5. {{additional_personal_info}}`,
    variables: ['age', 'marital_status', 'profession', 'subject_person', 'relationship_duration', 'relationship_type', 'relationship_context', 'additional_personal_info'],
    aiPrompt: 'הוסף פרטים רלוונטיים על המצהיר שמחזקים את אמינותו ויכולתו להעיד',
    usageInstructions: 'השתמש כאשר נדרש לבסס את מהימנות המצהיר',
    affidavitTypes: ['personal', 'court']
  },

  // הצהרות עובדתיות
  {
    id: 'factual-declaration',
    title: 'הצהרה עובדתית',
    category: 'facts',
    content: `הצהרה עובדתית:

1. ביום {{event_date}}, בשעה {{event_time}} בערך, הייתי נוכח/ת ב{{event_location}}.

2. במקום ובזמן הנ"ל ראיתי/שמעתי את הדברים הבאים: {{witnessed_events}}

3. הדברים שראיתי/שמעתי היו ברורים ולא השארו מקום לספק.

4. {{additional_observations}}

5. לא היו נוכחים במקום אנשים נוספים / היו נוכחים גם: {{other_witnesses}} (יש למחוק את הלא רלוונטי).

6. אני מצהיר/ה כי הדברים המתוארים לעיל אמת ויציב.`,
    variables: ['event_date', 'event_time', 'event_location', 'witnessed_events', 'additional_observations', 'other_witnesses'],
    aiPrompt: 'ארגן את העובדות בצורה כרונולוגית וברורה, הדגש פרטים חשובים',
    usageInstructions: 'השתמש לתיאור אירועים שהמצהיר היה עד להם',
    affidavitTypes: ['personal', 'court']
  },

  {
    id: 'financial-declaration',
    title: 'הצהרה כספית',
    category: 'declarations',
    content: `הצהרה כספית:

1. הכנסתי החודשית הממוצעת היא {{monthly_income}} ש"ח ממקורות הבאים:
   - משכורת: {{salary_amount}} ש"ח
   - הכנסות נוספות: {{additional_income}} ש"ח מ{{income_source}}

2. הוצאותיי החודשיות הן {{monthly_expenses}} ש"ח, הכוללות:
   - דיור: {{housing_cost}} ש"ח
   - מזון וצרכים בסיסיים: {{basic_needs}} ש"ח
   - הוצאות נוספות: {{other_expenses}} ש"ח

3. נכסיי כוללים: {{assets_description}}

4. חובותיי כוללים: {{debts_description}}

5. מצבי הכספי הנוכחי: {{financial_status}}`,
    variables: ['monthly_income', 'salary_amount', 'additional_income', 'income_source', 'monthly_expenses', 'housing_cost', 'basic_needs', 'other_expenses', 'assets_description', 'debts_description', 'financial_status'],
    aiPrompt: 'ארגן את המידע הכספי בצורה ברורה ומקצועית, וודא עקביות בין הכנסות והוצאות',
    usageInstructions: 'השתמש בתצהירים הדורשים חשיפת מצב כספי',
    affidavitTypes: ['court', 'government']
  },

  // תצהירים עסקיים
  {
    id: 'business-activity-declaration',
    title: 'תצהיר על פעילות עסקית',
    category: 'declarations',
    content: `תצהיר פעילות עסקית:

1. החברה עוסקת ב{{business_activity}} מאז {{business_start_date}}.

2. מחזור העסקים השנתי של החברה הוא {{annual_revenue}} ש"ח.

3. החברה מעסיקה {{employee_count}} עובדים.

4. הלקוחות העיקריים של החברה הם: {{main_clients}}.

5. החברה פועלת בהתאם לכל הרישיונות והאישורים הנדרשים: {{licenses_list}}.

6. לא קיימות כנגד החברה תביעות משפטיות תלויות ועומדות / קיימות התביעות הבאות: {{pending_lawsuits}} (יש למחוק את הלא רלוונטי).`,
    variables: ['business_activity', 'business_start_date', 'annual_revenue', 'employee_count', 'main_clients', 'licenses_list', 'pending_lawsuits'],
    aiPrompt: 'הוסף פרטים על הפעילות העסקית שמחזקים את מהימנות החברה',
    usageInstructions: 'השתמש בתצהירים עסקיים למכרזים, הלוואות ובקשות רישוי',
    affidavitTypes: ['business', 'government']
  },

  // סיום תצהיר
  {
    id: 'affidavit-closing-standard',
    title: 'סיום תצהיר סטנדרטי',
    category: 'closing',
    content: `סיום:

זהו שמי, זו חתימתי ותוכן תצהירי אמת.

{{declarant_name}}
ת.ז. {{declarant_id}}

תאריך: {{declaration_date}}

חתימה: _______________


אישור עורך דין:

אני הח"מ {{lawyer_name}}, עו"ד (מס' רישיון {{lawyer_license}}), מאשר בזאת כי ביום {{declaration_date}} הופיע/ה בפני במשרדי שברח' {{lawyer_address}} מר/גב' {{declarant_name}} אשר זיהה/תה עצמו/ה על ידי ת.ז. מס' {{declarant_id}}, ולאחר שהזהרתיו/ה כי עליו/ה לומר את האמת וכי יהיה/תהיה צפוי/ה לעונשים הקבועים בחוק אם לא יעשה/תעשה כן, אישר/ה את נכונות הצהרתו/ה הנ"ל וחתם/ה עליה בפני.

{{lawyer_name}}, עו"ד
חתימה וחותמת: _______________`,
    variables: ['declarant_name', 'declarant_id', 'declaration_date', 'lawyer_name', 'lawyer_license', 'lawyer_address'],
    aiPrompt: 'וודא שכל הפרטים המשפטיים נכונים ושהאישור תקין לפי חוק',
    usageInstructions: 'השתמש לסיום כל התצהירים עם אישור עורך דין',
    affidavitTypes: ['personal', 'business', 'court', 'government', 'insurance']
  }
];

/**
 * פונקציה לקבלת סעיפים לפי סוג תצהיר
 */
export function getAffidavitSectionsForType(affidavitType: string): AffidavitSectionTemplate[] {
  return affidavitSectionsWarehouse.filter(section => 
    section.affidavitTypes.includes(affidavitType as any)
  );
}

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getAffidavitSectionsByCategory(category: string): AffidavitSectionTemplate[] {
  return affidavitSectionsWarehouse.filter(section => section.category === category);
}
