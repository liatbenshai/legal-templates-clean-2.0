import { Template, TemplateCategory, Tag, FilledTemplate } from './types';

// קטגוריות תבניות מורחבות
export const categories: TemplateCategory[] = [
  { 
    id: 'beit-din', 
    name: 'כתבי בית דין', 
    icon: '⚖️', 
    count: 0,
    description: 'תבניות לבית הדין הרבני - תביעות, בקשות וערעורים'
  },
  { 
    id: 'wills', 
    name: 'צוואות', 
    icon: '📜', 
    count: 0,
    description: 'צוואות, הוראות לדורות, ניהול עזבון'
  },
  { 
    id: 'power-of-attorney', 
    name: 'ייפויי כוח', 
    icon: '✍️', 
    count: 0,
    description: 'ייפויי כוח כלליים, מיוחדים ובלתי חוזרים'
  },
  {
    id: 'advance-directives',
    name: 'הנחיות מקדימות',
    icon: '📋',
    count: 1,
    description: 'הנחיות מקדימות בייפוי כוח מתמשך - ניהול רכוש, בריאות וחיים אישיים (23 מודולים)'
  },
  { 
    id: 'contracts', 
    name: 'הסכמים', 
    icon: '📄', 
    count: 0,
    description: 'הסכמים מסחריים, שכירות, עבודה ושותפות'
  },
  { 
    id: 'requests', 
    name: 'בקשות לבית משפט', 
    icon: '🏛️', 
    count: 0,
    description: 'בקשות לדחיות, ערבויות, צווים וסעדים זמניים'
  },
  { 
    id: 'appeals', 
    name: 'ערעורים', 
    icon: '📋', 
    count: 0,
    description: 'ערעורים אזרחיים, פליליים וערעורי רשות'
  },
  { 
    id: 'family-law', 
    name: 'דיני משפחה', 
    icon: '👨‍👩‍👧‍👦', 
    count: 0,
    description: 'גירושין, מזונות, משמורת והסכמי ממון'
  },
  { 
    id: 'real-estate', 
    name: 'נדל"ן', 
    icon: '🏠', 
    count: 0,
    description: 'חוזי מכר, שכירות, משכנתאות ורישום'
  },
  { 
    id: 'corporate', 
    name: 'דיני חברות', 
    icon: '🏢', 
    count: 0,
    description: 'תקנונים, החלטות דירקטוריון, איגוד עמותות'
  },
];

// תגיות מוגדרות מראש
export const predefinedTags: Tag[] = [
  { id: 'urgent', name: 'דחוף', color: '#ef4444', count: 0 },
  { id: 'common', name: 'נפוץ', color: '#3b82f6', count: 0 },
  { id: 'complex', name: 'מורכב', color: '#f59e0b', count: 0 },
  { id: 'simple', name: 'פשוט', color: '#10b981', count: 0 },
  { id: 'new', name: 'חדש', color: '#8b5cf6', count: 0 },
  { id: 'updated', name: 'מעודכן', color: '#06b6d4', count: 0 },
];

// תבניות מורחבות עם שדות דינמיים
export const sampleTemplates: Template[] = [
  {
    id: '1',
    title: 'כתב תביעה לבית הדין הרבני',
    description: 'תבנית מקיפה לכתב תביעה סטנדרטי לבית הדין הרבני עם שדות דינמיים',
    category: 'beit-din',
    content: `{{court-name}}

כבוד הדיינים,

הנדון: תביעה בעניין {{case-subject}}

פרטי הצדדים:

התובע/ת: {{plaintiff-name}}
ת.ז: {{plaintiff-id}}
כתובת: {{plaintiff-address}}
טלפון: {{plaintiff-phone}}
{{#if plaintiff-lawyer}}
באמצעות ב"כ: {{plaintiff-lawyer}}, עו"ד, רישיון {{lawyer-license}}
{{/if}}

הנתבע/ת: {{defendant-name}}
ת.ז: {{defendant-id}}
כתובת: {{defendant-address}}
טלפון: {{defendant-phone}}

1. רקע עובדתי
{{background}}

2. עילת התביעה
{{cause-of-action}}

3. הטיעון המשפטי
{{legal-argument}}

4. הסעדים המבוקשים
{{#each reliefs}}
{{@index}}. {{this}}
{{/each}}

5. ראיות
{{#if has-witnesses}}
עדים: {{witnesses}}
{{/if}}
{{#if has-documents}}
מסמכים: {{documents}}
{{/if}}

6. שומת התביעה
סכום התביעה: {{claim-amount}} ₪

לפיכך, מתבקש בית הדין הנכבד לקבל את התביעה ולחייב את הנתבע/ת בתשלום הסכומים המפורטים לעיל בצירוף הוצאות משפט ושכ"ט עו"ד.

{{signature-date}}

בכבוד רב,
{{#if plaintiff-lawyer}}
{{plaintiff-lawyer}}, עו"ד
{{else}}
{{plaintiff-name}}
{{/if}}`,
    fields: [
      {
        id: 'court-name',
        label: 'שם בית הדין',
        type: 'select',
        required: true,
        options: [
          'בית הדין הרבני הגדול ירושלים',
          'בית הדין הרבני האזורי ירושלים',
          'בית הדין הרבני האזורי תל אביב',
          'בית הדין הרבני האזורי חיפה',
          'בית הדין הרבני האזורי באר שבע',
          'בית הדין הרבני האזורי נתניה',
        ],
        order: 1,
        group: 'כותרת',
      },
      {
        id: 'case-subject',
        label: 'נושא התביעה',
        type: 'text',
        required: true,
        placeholder: 'לדוגמה: גירושין, מזונות, חלוקת רכוש',
        helpText: 'תאר בקצרה את נושא התביעה',
        order: 2,
        group: 'כותרת',
      },
      {
        id: 'plaintiff-name',
        label: 'שם התובע/ת המלא',
        type: 'text',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
        },
        order: 3,
        group: 'פרטי תובע',
      },
      {
        id: 'plaintiff-id',
        label: 'תעודת זהות תובע',
        type: 'id-number',
        required: true,
        validation: {
          pattern: '^[0-9]{9}$',
          customMessage: 'נא להזין 9 ספרות',
        },
        order: 4,
        group: 'פרטי תובע',
      },
      {
        id: 'plaintiff-address',
        label: 'כתובת התובע',
        type: 'address',
        required: true,
        placeholder: 'רחוב, מספר, עיר, מיקוד',
        order: 5,
        group: 'פרטי תובע',
      },
      {
        id: 'plaintiff-phone',
        label: 'טלפון תובע',
        type: 'phone',
        required: true,
        placeholder: '05X-XXXXXXX',
        validation: {
          pattern: '^05[0-9]{1}-?[0-9]{7}$',
        },
        order: 6,
        group: 'פרטי תובע',
      },
      {
        id: 'plaintiff-lawyer',
        label: 'שם עורך דין מייצג (אופציונלי)',
        type: 'text',
        required: false,
        order: 7,
        group: 'פרטי תובע',
      },
      {
        id: 'lawyer-license',
        label: 'מספר רישיון עורך דין',
        type: 'text',
        required: false,
        order: 8,
        group: 'פרטי תובע',
      },
      {
        id: 'defendant-name',
        label: 'שם הנתבע/ת המלא',
        type: 'text',
        required: true,
        order: 9,
        group: 'פרטי נתבע',
      },
      {
        id: 'defendant-id',
        label: 'תעודת זהות נתבע',
        type: 'id-number',
        required: true,
        order: 10,
        group: 'פרטי נתבע',
      },
      {
        id: 'defendant-address',
        label: 'כתובת הנתבע',
        type: 'address',
        required: true,
        order: 11,
        group: 'פרטי נתבע',
      },
      {
        id: 'defendant-phone',
        label: 'טלפון נתבע',
        type: 'phone',
        required: false,
        order: 12,
        group: 'פרטי נתבע',
      },
      {
        id: 'background',
        label: 'רקע עובדתי',
        type: 'textarea',
        required: true,
        placeholder: 'תאר את הרקע העובדתי המלא של התביעה',
        helpText: 'פרט את העובדות הרלוונטיות בצורה כרונולוגית',
        validation: {
          minLength: 50,
        },
        order: 13,
        group: 'תוכן התביעה',
      },
      {
        id: 'cause-of-action',
        label: 'עילת התביעה',
        type: 'textarea',
        required: true,
        placeholder: 'פרט את עילת התביעה המשפטית',
        helpText: 'הסבר את הבסיס המשפטי לתביעה',
        validation: {
          minLength: 30,
        },
        order: 14,
        group: 'תוכן התביעה',
      },
      {
        id: 'legal-argument',
        label: 'טיעון משפטי',
        type: 'textarea',
        required: true,
        placeholder: 'הצג את הטיעונים המשפטיים',
        order: 15,
        group: 'תוכן התביעה',
      },
      {
        id: 'reliefs',
        label: 'סעדים מבוקשים (מופרד בפסיקים)',
        type: 'textarea',
        required: true,
        placeholder: 'סעד ראשון, סעד שני, סעד שלישי',
        helpText: 'רשום כל סעד בשורה נפרדת או הפרד בפסיקים',
        order: 16,
        group: 'סעדים',
      },
      {
        id: 'claim-amount',
        label: 'שומת התביעה (בשקלים)',
        type: 'number',
        required: true,
        placeholder: '0',
        validation: {
          min: 0,
        },
        order: 17,
        group: 'סעדים',
      },
      {
        id: 'has-witnesses',
        label: 'האם יש עדים?',
        type: 'checkbox',
        required: false,
        defaultValue: 'false',
        order: 18,
        group: 'ראיות',
      },
      {
        id: 'witnesses',
        label: 'רשימת עדים',
        type: 'textarea',
        required: false,
        placeholder: 'שמות העדים ופרטי קשר',
        order: 19,
        group: 'ראיות',
      },
      {
        id: 'has-documents',
        label: 'האם יש מסמכים?',
        type: 'checkbox',
        required: false,
        defaultValue: 'false',
        order: 20,
        group: 'ראיות',
      },
      {
        id: 'documents',
        label: 'רשימת מסמכים',
        type: 'textarea',
        required: false,
        placeholder: 'תיאור המסמכים המצורפים',
        order: 21,
        group: 'ראיות',
      },
      {
        id: 'signature-date',
        label: 'תאריך',
        type: 'date',
        required: true,
        defaultValue: 'today',
        order: 22,
        group: 'חתימה',
      },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-10-05',
    tags: ['בית דין', 'תביעה', 'רבני', 'נפוץ'],
    version: '2.0',
    isPublic: true,
    author: 'המערכת',
  },
  {
    id: '2',
    title: 'צוואה בסיסית',
    description: 'תבנית לצוואה פשוטה עם חלוקת רכוש',
    category: 'wills',
    content: `צוואה

אני הח"מ {{testator-name}}, ת.ז {{testator-id}}, תושב {{testator-address}}, בהיותי בשכלי הישר ובמלוא כושר שיפוטי, מצווה בזאת צוואתי האחרונה:

1. ביטול צוואות קודמות
אני מבטל בזאת כל צוואה או קודיציל שעשיתי קודם לכן.

2. מינוי מבצע צוואה
אני ממנה את {{executor-name}}, ת.ז {{executor-id}}, למבצע צוואתי.

3. חלוקת הרכוש
{{property-distribution}}

4. הוראות מיוחדות
{{special-instructions}}

נחתם ביום {{date}} במקום {{place}}.

חתימת המצווה: _______________
{{testator-name}}

עדים:
1. שם: _______________ ת.ז: _______________ חתימה: _______________
2. שם: _______________ ת.ז: _______________ חתימה: _______________`,
    fields: [
      {
        id: 'testator-name',
        label: 'שם המצווה המלא',
        type: 'text',
        required: true,
        order: 1,
        group: 'פרטי מצווה',
      },
      {
        id: 'testator-id',
        label: 'תעודת זהות מצווה',
        type: 'id-number',
        required: true,
        order: 2,
        group: 'פרטי מצווה',
      },
      {
        id: 'testator-address',
        label: 'כתובת המצווה',
        type: 'address',
        required: true,
        order: 3,
        group: 'פרטי מצווה',
      },
      {
        id: 'executor-name',
        label: 'שם מבצע הצוואה',
        type: 'text',
        required: true,
        order: 4,
        group: 'מבצע צוואה',
      },
      {
        id: 'executor-id',
        label: 'תעודת זהות מבצע',
        type: 'id-number',
        required: true,
        order: 5,
        group: 'מבצע צוואה',
      },
      {
        id: 'property-distribution',
        label: 'חלוקת הרכוש',
        type: 'textarea',
        required: true,
        placeholder: 'פרט כיצד להחלק את הרכוש',
        order: 6,
        group: 'תוכן הצוואה',
      },
      {
        id: 'special-instructions',
        label: 'הוראות מיוחדות',
        type: 'textarea',
        required: false,
        placeholder: 'הוראות נוספות או בקשות מיוחדות',
        order: 7,
        group: 'תוכן הצוואה',
      },
      {
        id: 'date',
        label: 'תאריך',
        type: 'date',
        required: true,
        defaultValue: 'today',
        order: 8,
        group: 'חתימה',
      },
      {
        id: 'place',
        label: 'מקום החתימה',
        type: 'text',
        required: true,
        placeholder: 'עיר',
        order: 9,
        group: 'חתימה',
      },
    ],
    createdAt: '2024-01-20',
    updatedAt: '2024-10-05',
    tags: ['צוואה', 'ירושה', 'בסיסי', 'נפוץ'],
    version: '1.0',
    isPublic: true,
    author: 'המערכת',
  },
  {
    id: '3',
    title: 'הסכם שכירות דירה',
    description: 'הסכם שכירות סטנדרטי לדירת מגורים',
    category: 'contracts',
    content: `הסכם שכירות דירת מגורים

בין: {{landlord-name}}, ת.ז {{landlord-id}} ("המשכיר")
לבין: {{tenant-name}}, ת.ז {{tenant-id}} ("השוכר")

1. הנכס המושכר
כתובת: {{property-address}}
מספר חדרים: {{rooms}}
שטח: {{area}} מ"ר

2. תקופת השכירות
מתאריך: {{start-date}}
עד תאריך: {{end-date}}

3. דמי השכירות
דמי שכירות חודשיים: {{monthly-rent}} ₪
מועד תשלום: {{payment-date}} בכל חודש

4. פיקדון
סכום הפיקדון: {{deposit}} ₪

5. תנאים מיוחדים
{{special-terms}}

נחתם ביום {{signature-date}}

חתימת המשכיר: _______________     חתימת השוכר: _______________
{{landlord-name}}                    {{tenant-name}}`,
    fields: [
      {
        id: 'landlord-name',
        label: 'שם המשכיר',
        type: 'text',
        required: true,
        order: 1,
        group: 'פרטי משכיר',
      },
      {
        id: 'landlord-id',
        label: 'ת.ז משכיר',
        type: 'id-number',
        required: true,
        order: 2,
        group: 'פרטי משכיר',
      },
      {
        id: 'tenant-name',
        label: 'שם השוכר',
        type: 'text',
        required: true,
        order: 3,
        group: 'פרטי שוכר',
      },
      {
        id: 'tenant-id',
        label: 'ת.ז שוכר',
        type: 'id-number',
        required: true,
        order: 4,
        group: 'פרטי שוכר',
      },
      {
        id: 'property-address',
        label: 'כתובת הנכס',
        type: 'address',
        required: true,
        order: 5,
        group: 'פרטי נכס',
      },
      {
        id: 'rooms',
        label: 'מספר חדרים',
        type: 'number',
        required: true,
        order: 6,
        group: 'פרטי נכס',
      },
      {
        id: 'area',
        label: 'שטח במ"ר',
        type: 'number',
        required: true,
        order: 7,
        group: 'פרטי נכס',
      },
      {
        id: 'start-date',
        label: 'תאריך תחילת שכירות',
        type: 'date',
        required: true,
        order: 8,
        group: 'תנאי שכירות',
      },
      {
        id: 'end-date',
        label: 'תאריך סיום שכירות',
        type: 'date',
        required: true,
        order: 9,
        group: 'תנאי שכירות',
      },
      {
        id: 'monthly-rent',
        label: 'דמי שכירות חודשיים',
        type: 'number',
        required: true,
        order: 10,
        group: 'תנאים כספיים',
      },
      {
        id: 'payment-date',
        label: 'יום תשלום בחודש',
        type: 'number',
        required: true,
        placeholder: '1-31',
        order: 11,
        group: 'תנאים כספיים',
      },
      {
        id: 'deposit',
        label: 'סכום פיקדון',
        type: 'number',
        required: true,
        order: 12,
        group: 'תנאים כספיים',
      },
      {
        id: 'special-terms',
        label: 'תנאים מיוחדים',
        type: 'textarea',
        required: false,
        placeholder: 'תנאים נוספים להסכם',
        order: 13,
        group: 'תנאים מיוחדים',
      },
      {
        id: 'signature-date',
        label: 'תאריך חתימה',
        type: 'date',
        required: true,
        defaultValue: 'today',
        order: 14,
        group: 'חתימה',
      },
    ],
    createdAt: '2024-01-30',
    updatedAt: '2024-10-05',
    tags: ['הסכם', 'שכירות', 'נדלן', 'נפוץ'],
    version: '1.0',
    isPublic: true,
    author: 'המערכת',
  },
  {
    id: 'professional-will-gendered',
    title: 'צוואה מקצועית עם נטיות מגדר',
    description: 'תבנית צוואה מקצועית מלאה עם נטיות מגדר אוטומטיות וטבלת יורשים',
    category: 'wills',
    content: `צוואה

הואיל כי אין אדם יודע את יום פקודתו;

והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;

והואיל כי הנני למעלה מגיל שמונה עשרה שנים, אזרח ישראלי ותושב מדינת ישראל;

לפיכך אני הח"מ {{testator_name}} ת"ז {{testator_id}} מרחוב: {{testator_address}}. לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, הנני מצווה בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת עלי מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, קובע ומצהיר כמפורט להלן:

1. למען הסר ספק, אני מבטל בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי.

2. אני מורה ליורשיי אשר יבצעו את צוואתי לשלם מתוך עיזבוני את כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.

3. צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים.

4. כל רכוש מכל מין וסוג שהוא בין במקרקעין בין מיטלטלין, לרבות זכויות מכל סוג שהוא ו/או כל רכוש אחר (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או בהווה ו/או יגיעו לידיי בעתיד.

חלוקת העיזבון

5. הנני מצווה ומוריש את כל רכושי ונכסיי כמפורט לעיל, ליורשים הבאים בהתאם לחלוקה המפורטת:

יורש ראשון: {{heir1_first_name}} {{heir1_last_name}}, ת.ז: {{heir1_id}}, קשר: {{heir1_relation}}, חלק: {{heir1_share}}%

יורש שני: {{heir2_first_name}} {{heir2_last_name}}, ת.ז: {{heir2_id}}, קשר: {{heir2_relation}}, חלק: {{heir2_share}}%

יורש שלישי: {{heir3_first_name}} {{heir3_last_name}}, ת.ז: {{heir3_id}}, קשר: {{heir3_relation}}, חלק: {{heir3_share}}%

6. במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.

7. כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד.

8. הנני מצווה, כי ביצוע וקיום צוואה זו יהא ברוח טובה בשיתוף פעולה הדדי בין היורשים.

9. ולראיה באתי על החתום מרצוני הטוב והחופשי, בהיותי בדעה צלולה ולאחר שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר שהצהרתי בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתי.

נחתם בעיר: {{signing_city}}, היום {{signing_day}} בחודש {{signing_month}}, {{signing_year}}.

{{testator_name}}
חתימת המצווה: ________________

אנו הח"מ:

1. {{witness1_name}}, ת"ז {{witness1_id}}, מרחוב: {{witness1_address}}

2. {{witness2_name}}, ת"ז {{witness2_id}}, מרחוב: {{witness2_address}}

אנו מעידים/ות בזאת שהמצווה/ה: {{testator_name}}, נושא/ת ת"ז מס' {{testator_id}}, חתם/ה בפנינו מרצונו/ה הטוב והחופשי והצהיר/ה כי זו צוואתו/ה.

ולראיה באנו על החתום היום: {{signing_day}} בחודש {{signing_month}}, {{signing_year}}

{{witness1_name}} - עד ראשון               {{witness2_name}} - עד שני
חתימה: _______________                      חתימה: _______________

{{#if lawyer_name}}
צוואה זו נערכה ונחתמה ב{{signing_city}}, במשרדו של {{lawyer_name}}
{{/if}}`,
    fields: [
      {
        id: 'testator_name',
        label: 'שם המצווה המלא',
        type: 'text',
        required: true,
        placeholder: 'הזן שם פרטי ושם משפחה',
        order: 1,
        group: 'פרטי המצווה',
      },
      {
        id: 'testator_id',
        label: 'תעודת זהות המצווה',
        type: 'text',
        required: true,
        placeholder: '123456789',
        order: 2,
        group: 'פרטי המצווה',
      },
      {
        id: 'testator_address',
        label: 'כתובת המצווה',
        type: 'textarea',
        required: true,
        placeholder: 'רחוב, מספר, עיר, מיקוד',
        order: 3,
        group: 'פרטי המצווה',
      },
      {
        id: 'heir1_first_name',
        label: 'יורש ראשון - שם פרטי',
        type: 'text',
        required: true,
        order: 4,
        group: 'יורשים',
      },
      {
        id: 'heir1_last_name',
        label: 'יורש ראשון - שם משפחה',
        type: 'text',
        required: true,
        order: 5,
        group: 'יורשים',
      },
      {
        id: 'heir1_id',
        label: 'יורש ראשון - תעודת זהות',
        type: 'text',
        required: true,
        order: 6,
        group: 'יורשים',
      },
      {
        id: 'heir1_relation',
        label: 'יורש ראשון - קרבת משפחה',
        type: 'select',
        required: true,
        options: ['בן', 'בת', 'אח', 'אחות', 'נכד', 'נכדה', 'אחר'],
        order: 7,
        group: 'יורשים',
      },
      {
        id: 'heir1_share',
        label: 'יורש ראשון - אחוז ירושה',
        type: 'number',
        required: true,
        placeholder: '50',
        order: 8,
        group: 'יורשים',
      },
      {
        id: 'heir2_first_name',
        label: 'יורש שני - שם פרטי',
        type: 'text',
        required: false,
        order: 9,
        group: 'יורשים',
      },
      {
        id: 'heir2_last_name',
        label: 'יורש שני - שם משפחה',
        type: 'text',
        required: false,
        order: 10,
        group: 'יורשים',
      },
      {
        id: 'heir2_id',
        label: 'יורש שני - תעודת זהות',
        type: 'text',
        required: false,
        order: 11,
        group: 'יורשים',
      },
      {
        id: 'heir2_relation',
        label: 'יורש שני - קרבת משפחה',
        type: 'select',
        required: false,
        options: ['בן', 'בת', 'אח', 'אחות', 'נכד', 'נכדה', 'אחר'],
        order: 12,
        group: 'יורשים',
      },
      {
        id: 'heir2_share',
        label: 'יורש שני - אחוז ירושה',
        type: 'number',
        required: false,
        placeholder: '30',
        order: 13,
        group: 'יורשים',
      },
      {
        id: 'heir3_first_name',
        label: 'יורש שלישי - שם פרטי',
        type: 'text',
        required: false,
        order: 14,
        group: 'יורשים',
      },
      {
        id: 'heir3_last_name',
        label: 'יורש שלישי - שם משפחה',
        type: 'text',
        required: false,
        order: 15,
        group: 'יורשים',
      },
      {
        id: 'heir3_id',
        label: 'יורש שלישי - תעודת זהות',
        type: 'text',
        required: false,
        order: 16,
        group: 'יורשים',
      },
      {
        id: 'heir3_relation',
        label: 'יורש שלישי - קרבת משפחה',
        type: 'select',
        required: false,
        options: ['בן', 'בת', 'אח', 'אחות', 'נכד', 'נכדה', 'אחר'],
        order: 17,
        group: 'יורשים',
      },
      {
        id: 'heir3_share',
        label: 'יורש שלישי - אחוז ירושה',
        type: 'number',
        required: false,
        placeholder: '20',
        order: 18,
        group: 'יורשים',
      },
      {
        id: 'signing_city',
        label: 'עיר חתימה',
        type: 'text',
        required: true,
        placeholder: 'תל אביב',
        order: 19,
        group: 'חתימה',
      },
      {
        id: 'signing_day',
        label: 'יום חתימה',
        type: 'text',
        required: true,
        placeholder: 'רביעי',
        order: 20,
        group: 'חתימה',
      },
      {
        id: 'signing_month',
        label: 'חודש חתימה',
        type: 'text',
        required: true,
        placeholder: 'אוקטובר',
        order: 21,
        group: 'חתימה',
      },
      {
        id: 'signing_year',
        label: 'שנת חתימה',
        type: 'text',
        required: true,
        placeholder: 'תשפ"ה',
        order: 22,
        group: 'חתימה',
      },
      {
        id: 'witness1_name',
        label: 'עד ראשון - שם מלא',
        type: 'text',
        required: true,
        order: 23,
        group: 'עדים',
      },
      {
        id: 'witness1_id',
        label: 'עד ראשון - תעודת זהות',
        type: 'text',
        required: true,
        order: 24,
        group: 'עדים',
      },
      {
        id: 'witness1_address',
        label: 'עד ראשון - כתובת',
        type: 'text',
        required: true,
        order: 25,
        group: 'עדים',
      },
      {
        id: 'witness2_name',
        label: 'עד שני - שם מלא',
        type: 'text',
        required: true,
        order: 26,
        group: 'עדים',
      },
      {
        id: 'witness2_id',
        label: 'עד שני - תעודת זהות',
        type: 'text',
        required: true,
        order: 27,
        group: 'עדים',
      },
      {
        id: 'witness2_address',
        label: 'עד שני - כתובת',
        type: 'text',
        required: true,
        order: 28,
        group: 'עדים',
      },
      {
        id: 'lawyer_name',
        label: 'שם עורך הדין (אופציונלי)',
        type: 'text',
        required: false,
        order: 29,
        group: 'אישורים',
      },
    ],
    createdAt: '2024-10-07',
    updatedAt: '2024-10-07',
    tags: ['צוואה', 'מקצועי', 'נטיות', 'מלא', 'חדש'],
    version: '1.0',
    isPublic: true,
    author: 'המערכת',
    hasGenderSupport: true,
  },
];

// פונקציות עזר מורחבות

/**
 * מחליף placeholders בתוכן עם ערכים ממולאים
 */
export function renderTemplate(template: Template, data: Record<string, any>): string {
  let content = template.content;
  
  // החלפת משתנים פשוטים {{variable}}
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(placeholder, data[key] || '');
  });
  
  // טיפול ב-conditionals {{#if variable}}...{{/if}}
  const ifRegex = /{{#if ([^}]+)}}(.*?){{\/if}}/gs;
  content = content.replace(ifRegex, (match, condition, innerContent) => {
    return data[condition.trim()] ? innerContent : '';
  });
  
  // טיפול ב-loops {{#each array}}...{{/each}}
  const eachRegex = /{{#each ([^}]+)}}(.*?){{\/each}}/gs;
  content = content.replace(eachRegex, (match, arrayName, innerContent) => {
    const array = data[arrayName.trim()];
    if (!Array.isArray(array)) return '';
    
    return array.map((item, index) => {
      let itemContent = innerContent;
      itemContent = itemContent.replace(/{{@index}}/g, (index + 1).toString());
      itemContent = itemContent.replace(/{{this}}/g, item);
      return itemContent;
    }).join('\n');
  });
  
  // ניקוי placeholders שנותרו
  content = content.replace(/{{[^}]+}}/g, '');
  
  return content.trim();
}

export function getTemplateById(id: string): Template | undefined {
  return sampleTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(categoryId: string): Template[] {
  return sampleTemplates.filter(t => t.category === categoryId);
}

export function searchTemplates(query: string): Template[] {
  const lowerQuery = query.toLowerCase();
  return sampleTemplates.filter(
    t =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getTemplatesByTags(tags: string[]): Template[] {
  return sampleTemplates.filter(t =>
    tags.some(tag => t.tags.includes(tag))
  );
}

export function getAllTags(): Tag[] {
  const tagCounts: Record<string, number> = {};
  
  sampleTemplates.forEach(template => {
    template.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts).map(([name, count]): Tag => {
    const predefined = predefinedTags.find(t => t.name === name);
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
      color: predefined?.color || '#6b7280',
    };
  });
}

// עדכון מספר התבניות בכל קטגוריה
export function updateCategoryCounts(): TemplateCategory[] {
  const customTemplates = getCustomTemplates();
  const allTemplates = [...sampleTemplates, ...customTemplates];
  
  return categories.map(cat => ({
    ...cat,
    count: allTemplates.filter(t => t.category === cat.id).length,
  }));
}

/**
 * טוען תבניות מותאמות אישית מ-localStorage
 */
export function getCustomTemplates(): Template[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('customTemplates');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom templates:', error);
    return [];
  }
}

/**
 * שומר תבנית מותאמת אישית ל-localStorage
 */
export function saveCustomTemplate(template: Template): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getCustomTemplates();
    const updated = [...existing, template];
    localStorage.setItem('customTemplates', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving custom template:', error);
    throw error;
  }
}

/**
 * מוחק תבנית מותאמת אישית
 */
export function deleteCustomTemplate(templateId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getCustomTemplates();
    const updated = existing.filter(t => t.id !== templateId);
    localStorage.setItem('customTemplates', JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting custom template:', error);
    throw error;
  }
}
