/**
 * טקסטים משפטיים מוכנים - סעיפי צוואה סטנדרטיים
 * על פי הדין הישראלי והפרקטיקה המקצועית
 */

export interface StandardWillSection {
  id: string;
  title: string;
  content: string;
  required: boolean;
  order: number;
  category: 'opening' | 'cancellation' | 'debts' | 'inheritance' | 'executor' | 'burial' | 'special' | 'closing';
  description: string;
}

export const standardWillSections: StandardWillSection[] = [
  {
    id: 'will-opening',
    title: 'פתיחת הצוואה',
    content: `הואיל כי אין אדם יודע את יום פקודתו;

והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;

והואיל כי הנני למעלה מגיל שמונה עשרה שנים, {{gender:אזרח|אזרחית}} ישראל{{gender:|ית}} ו{{gender:תושב|תושבת}} מדינת ישראל;

לפיכך אני הח"מ {{testator_name}} ת"ז {{testator_id}} מרחוב: {{testator_address}}, לאחר שיקול דעת, ו{{gender:בהיותי|בהיותי}} בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, {{gender:הנני מצווה|הנני מצווה}} בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת {{gender:עלי|עליי}} מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, {{gender:קובע|קובעת}} ו{{gender:מצהיר|מצהירה}} כמפורט להלן:`,
    required: true,
    order: 1,
    category: 'opening',
    description: 'פתיחה רשמית של הצוואה עם הצהרות הכשירות'
  },

  {
    id: 'cancel-previous-wills',
    title: 'ביטול צוואות קודמות',
    content: `למען הסר ספק, אני {{gender:מבטל|מבטלת}} בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה {{gender:שנתתי|שנתתי}} בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי.

צוואה זו היא צוואתי האחרונה והיחידה התקפה, והיא {{gender:מבטלת|מבטלת}} כל מסמך קודם מכל סוג שהוא הנוגע לרכושי.`,
    required: true,
    order: 2,
    category: 'cancellation',
    description: 'ביטול מוחלט של כל צוואה או הוראה קודמת'
  },

  {
    id: 'estate-debts',
    title: 'תשלום חובות העיזבון',
    content: `אני {{gender:מורה|מורה}} {{gender:ליורשיי|ליורשיי}} אשר יבצעו את צוואתי לשלם מתוך עיזבוני האמור את כל חובותיי שיעמדו לפירעון בעת פטירתי, והם:

א. כל חובותיי הכספיים לצדדים שלישיים;
ב. כל המיסים, האגרות והתשלומים החלים על העיזבון על פי כל דין;
ג. הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל;
ד. הוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי;
ה. כל ההוצאות הכרוכות במתן צו לקיום צוואתי ובניהול העיזבון;
ו. שכר טרחת עורך דין, רואה חשבון ומנהל עיזבון.`,
    required: true,
    order: 3,
    category: 'debts',
    description: 'הוראות לתשלום כל חובות העיזבון לפני החלוקה'
  },

  {
    id: 'estate-scope',
    title: 'היקף העיזבון',
    content: `צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים, ואלה הם:

א. כל נכסי המקרקעין, בין רשומים ובין שאינם רשומים;
ב. כל המיטלטלין, לרבות רכב, תכשיטים, ציוד ורהיטים;
ג. כל זכויותיי בחשבונות בנק, בתוכניות חיסכון ובקרנות פנסיה;
ד. כל זכויותיי בחברות, עסקים, מניות, אגרות חוב וכל נייר ערך;
ה. כל זכות או טובת הנאה מכל סוג שהוא, לרבות זכויות יוצרים ופטנטים;
ו. כל רכוש אחר אשר יגיע לידיי מכאן ועד יום פטירתי.`,
    required: true,
    order: 4,
    category: 'inheritance',
    description: 'הגדרה מלאה של כל הרכוש הכלול בעיזבון'
  },

  {
    id: 'inheritance-distribution',
    title: 'חלוקת הירושה',
    content: `הנני {{gender:מצווה|מצווה}} ו{{gender:מוריש|מורישה}} את כל רכושי ונכסיי כמפורט לעיל, {{gender:ליורשיי|ליורשיי}} הבאים בהתאם לחלוקה המפורטת:

{{#if heirs}}
{{#each heirs}}
{{@index}}. {{this.name}} (ת.ז. {{this.idNumber}}), {{this.relationship}} - חלק של {{this.percentage}}% מכלל העיזבון
{{/each}}
{{/if}}

חלוקה זו היא סופית ומוחלטת, והיא משקפת את רצוני המדויק.`,
    required: true,
    order: 5,
    category: 'inheritance',
    description: 'החלוקה המדויקת של העיזבון בין היורשים'
  },

  {
    id: 'executor-appointment',
    title: 'מינוי מנהל עיזבון',
    content: `{{#if executor}}
אני {{gender:ממנה|ממנה}} בזה את {{executor.name}} (ת.ז. {{executor.idNumber}}) כמנהל עיזבוני.

מנהל העיזבון יהיה {{gender:מוסמך|מוסמכת}} לבצע כל פעולה הדרושה לביצוע צוואתי, לרבות:
א. מימוש נכסי העיזבון;
ב. תשלום חובות העיזבון;
ג. ביצוע החלוקה בין היורשים;
ד. ייצוג העיזבון בפני כל רשות או גוף;
ה. חתימה על כל מסמך הדרוש לביצוע תפקידו.

{{gender:המנהל|המנהל}} יהיה {{gender:זכאי|זכאית}} לשכר טרחה סביר עבור עבודתו.
{{else}}
אני {{gender:מורה|מורה}} כי {{gender:יורשיי|יורשיי}} יפעלו יחדיו כמנהלי עיזבון משותפים.
{{/if}}`,
    required: false,
    order: 6,
    category: 'executor',
    description: 'מינוי מנהל עיזבון או הוראות לניהול משותף'
  },

  {
    id: 'burial-instructions',
    title: 'הוראות קבורה',
    content: `{{#if burial_instructions}}
הוראותיי לקבורה:
{{burial_instructions}}
{{else}}
אני {{gender:מורה|מורה}} כי תתבצע קבורתי על פי המנהג והדת, במקום שיבחרו {{gender:יורשיי|יורשיי}} או {{gender:בני|בני}} משפחתי.

יש להקים מצבה מתאימה על קברי תוך שנה ממועד הקבורה.
{{/if}}

הוצאות הקבורה והמצבה יחולו על העיזבון ויולקחו מהרכוש לפני חלוקתו.`,
    required: false,
    order: 7,
    category: 'burial',
    description: 'הוראות לקבורה ולהקמת מצבה'
  },

  {
    id: 'heir-death-scenario',
    title: 'מקרה פטירת יורש',
    content: `במקרה של פטירת אחד מ{{gender:יורשיי|יורשיי}} הנזכרים לעיל לפני פטירתי, חלקו יעבור {{gender:ליורשיו|ליורשיו}} החוקיים על פי דין.

אם {{gender:יורש|יורש}} כלשהו יפטר לאחר פטירתי אך לפני קבלת חלקו בפועל, חלקו יעבור {{gender:ליורשיו|ליורשיו}} החוקיים.

הוראות אלו מיועדות להבטיח כי הרכוש יישאר במשפחה ולא יעבור לזרים.`,
    required: true,
    order: 8,
    category: 'inheritance',
    description: 'הוראות למקרה פטירת יורש לפני או אחרי המצווה'
  },

  {
    id: 'contest-clause',
    title: 'סעיף התנגדות לצוואה',
    content: `כל אדם שיהיה {{gender:זכאי|זכאית}} על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או {{gender:יתדיין|יתדיין}} עם {{gender:יורשיי|יורשיי}} האחרים בדבר תוקף הצוואה או פרשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ו{{gender:יקבל|יקבל}} במקום זאת סכום סימלי של שקל אחד (₪1) בלבד.

סעיף זה מיועד להבטיח ביצוע צוואתי ללא מחלוקות מיותרות ולשמור על שלום המשפחה.`,
    required: true,
    order: 9,
    category: 'special',
    description: 'מניעת ערעורים והתדיינויות על הצוואה'
  },

  {
    id: 'cooperation-clause',
    title: 'סעיף שיתוף פעולה',
    content: `הנני {{gender:מצווה|מצווה}}, כי ביצוע וקיום צוואה זו יהא ברוח טובה בשיתוף פעולה הדדי בין {{gender:יורשיי|יורשיי}}.

במקרה של מחלוקת או אי הבנה, על {{gender:היורשים|היורשים}} להתייעץ עם עורך דין מקצועי ולפעול לפתרון המחלוקת בדרכי שלום.

אני {{gender:מקווה|מקווה}} כי {{gender:יורשיי|יורשיי}} {{gender:יכבדו|יכבדו}} את רצוני ויפעלו תמיד לטובת המשפחה כולה.`,
    required: false,
    order: 10,
    category: 'special',
    description: 'עידוד שיתוף פעולה ושלום משפחה'
  },

  {
    id: 'interpretation-clause',
    title: 'סעיף פרשנות',
    content: `במקרה של ספק או אי בהירות בנוסח צוואתי זו, יש לפרשה בהתאם לכוונתי הברורה כפי שהיא עולה מכלל הוראות הצוואה.

אם תידרש פרשנות משפטית, יש לפנות לבית המשפט המוסמך, אשר יפרש את הוראותיי בהתאם לדין ולכוונתי.

בכל מקרה, יש לשאוף לפרשנות שתבטיח ביצוע מרבי של רצוני ושמירה על טובת {{gender:יורשיי|יורשיי}}.`,
    required: false,
    order: 11,
    category: 'special',
    description: 'הוראות לפרשנות הצוואה במקרה של ספק'
  },

  {
    id: 'will-validity',
    title: 'תוקף הצוואה',
    content: `צוואה זו נכתבה בהיותי בדעה צלולה, ללא כל לחץ או השפעה בלתי הוגנת, ומתוך החלטה חופשית ומושכלת.

אני {{gender:מצהיר|מצהירה}} בזה כי {{gender:הבנתי|הבנתי}} את מלוא המשמעות המשפטית של הוראותיי, והן משקפות את רצוני האמיתי והסופי.

צוואה זו תקפה מיום חתימתי עליה ועד יום פטירתי, והיא עדיפה על כל הוראה או הבטחה אחרת {{gender:שאעשה|שאעשה}} בעתיד, אלא אם כן אכתוב צוואה חדשה במפורש.`,
    required: true,
    order: 12,
    category: 'closing',
    description: 'הצהרה על תוקף הצוואה ועל כשירותה המשפטית'
  },

  {
    id: 'signature-declaration',
    title: 'הצהרת חתימה',
    content: `ולראיה {{gender:באתי|באתי}} על החתום {{gender:מרצוני|מרצוני}} הטוב והחופשי, {{gender:בהיותי|בהיותי}} בדעה צלולה ולאחר שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר {{gender:שהצהרתי|שהצהרתי}} בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתי.

נחתם בעיר: {{signing_city}}, היום {{signing_day}} בחודש {{signing_month}}, {{signing_year}}.`,
    required: true,
    order: 13,
    category: 'closing',
    description: 'הצהרה רשמית על חתימת הצוואה בפני עדים'
  },

  {
    id: 'witnesses-declaration',
    title: 'הצהרת העדים',
    content: `אנו הח"מ:

1. {{witness1_name}}, ת"ז {{witness1_id}}, מרחוב: {{witness1_address}}
2. {{witness2_name}}, ת"ז {{witness2_id}}, מרחוב: {{witness2_address}}

אנו {{gender:מעידים|מעידות}} בזאת שהמצווה: {{testator_name}}, {{gender:נושא|נושאת}} ת"ז מס' {{testator_id}}, {{gender:חתם|חתמה}} בפנינו {{gender:מרצונו|מרצונה}} הטוב והחופשי ו{{gender:הצהיר|הצהירה}} כי זו {{gender:צוואתו|צוואתה}}.

{{gender:המצווה|המצווה}} היה {{gender:בדעה|בדעה}} צלולה בעת החתימה, {{gender:והבין|והבינה}} את מלוא המשמעות של מעשיו.

ולראיה באנו על החתום היום: {{signing_day}} בחודש {{signing_month}}, {{signing_year}}`,
    required: true,
    order: 14,
    category: 'closing',
    description: 'הצהרה רשמית של העדים על חתימת הצוואה'
  }
];

export const willTemplateStructure = `{{standard:will-opening}}

{{standard:cancel-previous-wills}}

{{standard:estate-debts}}

{{standard:estate-scope}}

{{standard:inheritance-distribution}}

{{#if executor}}
{{standard:executor-appointment}}
{{/if}}

{{#if burial_instructions}}
{{standard:burial-instructions}}
{{/if}}

{{#if special_instructions}}
הוראות מיוחדות:
{{special_instructions}}
{{/if}}

{{#each additional_sections}}
{{@index}}. {{this}}
{{/each}}

{{standard:heir-death-scenario}}

{{standard:contest-clause}}

{{standard:cooperation-clause}}

{{standard:interpretation-clause}}

{{standard:will-validity}}

{{standard:signature-declaration}}

חתימת המצווה: ________________

{{standard:witnesses-declaration}}

חתימות העדים:

{{witness1_name}}               {{witness2_name}}
________________               ________________
   עד ראשון                        עד שני

{{#if lawyer_name}}
אישור עורך דין:
אני הח"מ {{lawyer_name}}, עו"ד מס' רישיון {{lawyer_license}}, מאשר בזה כי המצווה {{gender:חתם|חתמה}} על צוואה זו בפני ובפני העדים הנ"ל.

תאריך: {{signing_date}}

חתימה וחותמת עו"ד: ________________
{{/if}}`;

/**
 * פונקציה ליצירת צוואה מלאה עם כל הסעיפים הסטנדרטיים
 */
export function generateFullWill(data: Record<string, any>): string {
  let content = willTemplateStructure;

  // החלפת סעיפים סטנדרטיים
  standardWillSections.forEach(section => {
    const placeholder = `{{standard:${section.id}}}`;
    content = content.replace(new RegExp(placeholder, 'g'), section.content);
  });

  // החלפת משתנים רגילים
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(placeholder, data[key] || '');
  });

  // טיפול בנטיות מגדר
  content = applyGenderToContent(content, data.gender || 'male');

  // טיפול בתנאים
  content = processConditionals(content, data);

  return content.trim();
}

function applyGenderToContent(content: string, gender: string): string {
  // החלפת נטיות מגדר מתקדמות
  const genderPatterns = [
    { pattern: /{{gender:([^|]+)\|([^}]+)}}/g, male: '$1', female: '$2' },
    { pattern: /{{gender:([^}]+)}}/g, male: '', female: '$1' },
  ];

  genderPatterns.forEach(pattern => {
    content = content.replace(pattern.pattern, (match, p1, p2) => {
      if (gender === 'female') {
        return p2 || p1;
      }
      return p1 || '';
    });
  });

  return content;
}

function processConditionals(content: string, data: Record<string, any>): string {
  // טיפול ב-{{#if condition}}...{{/if}}
  const ifPattern = /{{#if ([^}]+)}}(.*?){{\/if}}/gs;
  content = content.replace(ifPattern, (match, condition, innerContent) => {
    const conditionValue = data[condition.trim()];
    return conditionValue ? innerContent : '';
  });

  // טיפול ב-{{#each array}}...{{/each}}
  const eachPattern = /{{#each ([^}]+)}}(.*?){{\/each}}/gs;
  content = content.replace(eachPattern, (match, arrayName, innerContent) => {
    const array = data[arrayName.trim()];
    if (!Array.isArray(array) || array.length === 0) return '';
    
    return array.map((item, index) => {
      let itemContent = innerContent;
      itemContent = itemContent.replace(/{{@index}}/g, (index + 1).toString());
      itemContent = itemContent.replace(/{{this\.([^}]+)}}/g, (match: string, prop: string) => item[prop] || '');
      itemContent = itemContent.replace(/{{this}}/g, item.toString());
      return itemContent;
    }).join('\n');
  });

  return content;
}