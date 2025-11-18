/**
 * מערכת נטיות עברית - זכר/נקבה/רבים
 * קריטי למסמכים משפטיים בעברית
 * 
 * VERSION: 3.0 - Enhanced
 * שיפורים:
 * 1. הוספת זיהוי אוטומטי של מגדר מהשם
 * 2. הוספת מילות קישור (אני/אנחנו, שלי/שלנו)
 * 3. שיפור טיפול במילים משפטיות
 * 4. הוספת טיפול במילות יחס
 * 5. שיפור regex patterns
 */

export type Gender = 'male' | 'female' | 'plural' | 'organization';

export interface GenderedWord {
  male: string;
  female: string;
  plural: string;
  organization?: string;
}

/**
 * זיהוי מגדר אוטומטי מהשם
 */
export function detectGenderFromName(name: string): Gender | null {
  if (!name || name.trim().length === 0) return null;
  
  const cleanName = name.trim();
  
  // שמות נקבה נפוצים
  const femaleNames = [
    'שרה', 'רחל', 'לאה', 'מרים', 'אסתר', 'רות', 'דבורה', 'חנה', 'רבקה', 'דינה',
    'תמר', 'יעל', 'מיכל', 'עדה', 'ציפורה', 'אלישבע', 'אביגיל', 'דלילה', 'עזיזה',
    'פנינה', 'שולמית', 'זהבה', 'מלכה', 'חיה', 'ברכה', 'חנה', 'גולדה', 'רחל',
    'דודית', 'מיכל', 'ענת', 'לימור', 'אורית', 'מירב', 'נועה', 'שירה', 'מיכל',
    'עדי', 'ליה', 'מיכל', 'נועה', 'שירה', 'מיכל', 'עדי', 'ליה', 'מיכל', 'נועה'
  ];
  
  // שמות זכר נפוצים
  const maleNames = [
    'אברהם', 'יצחק', 'יעקב', 'משה', 'אהרן', 'יוסף', 'בנימין', 'יהודה', 'לוי', 'שמעון',
    'דן', 'נפתלי', 'גד', 'אשר', 'ראובן', 'דוד', 'שלמה', 'יהושע', 'שמואל', 'אליהו',
    'דניאל', 'עזרא', 'נחמיה', 'מלכי', 'ישעיהו', 'ירמיהו', 'יחזקאל', 'הושע', 'יואל',
    'עמוס', 'עובדיה', 'יונה', 'מיכה', 'נחום', 'חבקוק', 'צפניה', 'חגי', 'זכריה', 'מלאכי',
    'דוד', 'שלמה', 'יהושע', 'שמואל', 'אליהו', 'דניאל', 'עזרא', 'נחמיה', 'מלכי',
    'משה', 'אהרן', 'יוסף', 'בנימין', 'יהודה', 'לוי', 'שמעון', 'דן', 'נפתלי', 'גד',
    'ירון', 'אור', 'נועם', 'אלון', 'רונן', 'עמית', 'איתי', 'אליעד', 'יונתן', 'אורן'
  ];
  
  // בדיקה אם השם מכיל שם נקבה
  for (const femaleName of femaleNames) {
    if (cleanName.includes(femaleName)) {
      return 'female';
    }
  }
  
  // בדיקה אם השם מכיל שם זכר
  for (const maleName of maleNames) {
    if (cleanName.includes(maleName)) {
      return 'male';
    }
  }
  
  // בדיקות נוספות לפי סיומות
  if (cleanName.endsWith('ה') || cleanName.endsWith('ת') || cleanName.endsWith('ית')) {
    return 'female';
  }
  
  if (cleanName.endsWith('י') || cleanName.endsWith('א') || cleanName.endsWith('ו')) {
    return 'male';
  }
  
  return null; // לא הצלחנו לזהות
}

/**
 * מילון נטיות - פעלים, תארים, מונחים משפטיים
 */
export const hebrewDictionary: Record<string, GenderedWord> = {
  // מילות קישור חשובות - יחיד/רבים
  'אני': { male: 'אני', female: 'אני', plural: 'אנחנו' },
  'אנכי': { male: 'אנכי', female: 'אנכי', plural: 'אנו' },
  'שלי': { male: 'שלי', female: 'שלי', plural: 'שלנו' },
  'שם': { male: 'שמו', female: 'שמה', plural: 'שמם' },
  'שמי': { male: 'שמי', female: 'שמי', plural: 'שמנו' },
  'ביתי': { male: 'ביתי', female: 'ביתי', plural: 'ביתנו' },
  'רכושי': { male: 'רכושי', female: 'רכושי', plural: 'רכושנו' },
  'נכסי': { male: 'נכסי', female: 'נכסי', plural: 'נכסינו' },
  'כספי': { male: 'כספי', female: 'כספי', plural: 'כספינו' },
  'רצוני': { male: 'רצוני', female: 'רצוני', plural: 'רצוננו' },
  'דעתי': { male: 'דעתי', female: 'דעתי', plural: 'דעתנו' },
  'החלטתי': { male: 'החלטתי', female: 'החלטתי', plural: 'החלטתנו' },
  'ברשותי': { male: 'ברשותי', female: 'ברשותי', plural: 'ברשותנו' },
  'בבעלותי': { male: 'בבעלותי', female: 'בבעלותי', plural: 'בבעלותנו' },
  
  // פעלים נפוצים
  'עשה': { male: 'עשה', female: 'עשתה', plural: 'עשו' },
  'אמר': { male: 'אמר', female: 'אמרה', plural: 'אמרו' },
  'חתם': { male: 'חתם', female: 'חתמה', plural: 'חתמו' },
  'הצהיר': { male: 'הצהיר', female: 'הצהירה', plural: 'הצהירו' },
  'קיבל': { male: 'קיבל', female: 'קיבלה', plural: 'קיבלו' },
  'נתן': { male: 'נתן', female: 'נתנה', plural: 'נתנו' },
  'הסכים': { male: 'הסכים', female: 'הסכימה', plural: 'הסכימו' },
  'שכר': { male: 'שכר', female: 'שכרה', plural: 'שכרו' },
  'שכרו': { male: 'שכר', female: 'שכרה', plural: 'שכרו' },
  'יכלול': { male: 'יכלול', female: 'יכלול', plural: 'יכללו' },
  'יכללו': { male: 'יכלול', female: 'יכלול', plural: 'יכללו' },
  'יחייב': { male: 'יחייב', female: 'יחייב', plural: 'יחייבו' },
  'יחייבו': { male: 'יחייב', female: 'יחייב', plural: 'יחייבו' },
  'נכלל': { male: 'נכלל', female: 'נכללה', plural: 'נכללו' },
  'מוסכם': { male: 'מוסכם', female: 'מוסכמת', plural: 'מוסכמים' },
  'ביקש': { male: 'ביקש', female: 'ביקשה', plural: 'ביקשו' },
  'דרש': { male: 'דרש', female: 'דרשה', plural: 'דרשו' },
  'טען': { male: 'טען', female: 'טענה', plural: 'טענו' },
  'הגיש': { male: 'הגיש', female: 'הגישה', plural: 'הגישו' },
  'השיב': { male: 'השיב', female: 'השיבה', plural: 'השיבו' },
  'הגן': { male: 'הגן', female: 'הגנה', plural: 'הגנו' },
  'תבע': { male: 'תבע', female: 'תבעה', plural: 'תבעו' },
  'זכה': { male: 'זכה', female: 'זכתה', plural: 'זכו' },
  'חויב': { male: 'חויב', female: 'חויבה', plural: 'חויבו' },
  'נפטר': { male: 'נפטר', female: 'נפטרה', plural: 'נפטרו' },
  'ירש': { male: 'ירש', female: 'ירשה', plural: 'ירשו' },
  'צוה': { male: 'צוה', female: 'צוותה', plural: 'צוו' },
  'מינה': { male: 'מינה', female: 'מינתה', plural: 'מינו' },
  'ביטל': { male: 'ביטל', female: 'ביטלה', plural: 'ביטלו' },
  'מוריש': { male: 'מוריש', female: 'מורישה', plural: 'מורישים' },
  'מצווה': { male: 'מצווה', female: 'מצווה', plural: 'מצווים' },
  'רוצה': { male: 'רוצה', female: 'רוצה', plural: 'רוצים' },
  'החליט': { male: 'החליט', female: 'החליטה', plural: 'החליטו' },
  'קבע': { male: 'קבע', female: 'קבעה', plural: 'קבעו' },
  'הורה': { male: 'הורה', female: 'הורתה', plural: 'הורו' },
  'הנחה': { male: 'הנחה', female: 'הנחתה', plural: 'הנחו' },
  'רשם': { male: 'רשם', female: 'רשמה', plural: 'רשמו' },
  'כתב': { male: 'כתב', female: 'כתבה', plural: 'כתבו' },
  'קרא': { male: 'קרא', female: 'קראה', plural: 'קראו' },
  'הבין': { male: 'הבין', female: 'הבינה', plural: 'הבינו' },
  'מעניק': { male: 'מעניק', female: 'מעניקה', plural: 'מעניקים' },
  'יישא': { male: 'יישא', female: 'תישא', plural: 'יישאו' },
  'ידע': { male: 'ידע', female: 'ידעה', plural: 'ידעו' },
  'יכול': { male: 'יכול', female: 'יכולה', plural: 'יכולים' },
  'מסוגל': { male: 'מסוגל', female: 'מסוגלת', plural: 'מסוגלים' },
  'מחויב': { male: 'מחויב', female: 'מחויבת', plural: 'מחויבים' },
  'זכאי': { male: 'זכאי', female: 'זכאית', plural: 'זכאים' },
  'אחראי': { male: 'אחראי', female: 'אחראית', plural: 'אחראים' },
  'בעל': { male: 'בעל', female: 'בעלת', plural: 'בעלי' },
  'מחזיק': { male: 'מחזיק', female: 'מחזיקה', plural: 'מחזיקים' },
  'בןמשפחה': { male: 'בן', female: 'בת', plural: 'בני' },
  'מלא': { male: 'מלא', female: 'מלאה', plural: 'מלאים' },
  'שלם': { male: 'שלם', female: 'שלמה', plural: 'שלמים' },
  'חי': { male: 'חי', female: 'חיה', plural: 'חיים' },
  'נוכח': { male: 'נוכח', female: 'נוכחת', plural: 'נוכחים' },
  'חתום': { male: 'חתום', female: 'חתומה', plural: 'חתומים' },
  
  // תארים
  'טוב': { male: 'טוב', female: 'טובה', plural: 'טובים' },
  'גדול': { male: 'גדול', female: 'גדולה', plural: 'גדולים' },
  'קטן': { male: 'קטן', female: 'קטנה', plural: 'קטנים' },
  'ראשון': { male: 'ראשון', female: 'ראשונה', plural: 'ראשונים' },
  'שני': { male: 'שני', female: 'שנייה', plural: 'שניים' },
  'אחרון': { male: 'אחרון', female: 'אחרונה', plural: 'אחרונים' },
  
  // מונחים משפטיים - ירושה וצוואות
  'המנוח': { male: 'המנוח', female: 'המנוחה', plural: 'המנוחים', organization: 'הארגון שנסגר' },
  'המצווה': { male: 'המצווה', female: 'המצווה', plural: 'המצווים' },
  'היורש': { male: 'היורש', female: 'היורשת', plural: 'היורשים' },
  'הזכאי': { male: 'הזכאי', female: 'הזכאית', plural: 'הזכאים' },
  'המוריש': { male: 'המוריש', female: 'המורישה', plural: 'המורישים' },
  'המת': { male: 'המת', female: 'המתה', plural: 'המתים' },
  
  // מונחים משפטיים - צדדים משפטיים
  'התובע': { male: 'התובע', female: 'התובעת', plural: 'התובעים', organization: 'החברה התובעת' },
  'הנתבע': { male: 'הנתבע', female: 'הנתבעת', plural: 'הנתבעים', organization: 'החברה הנתבעת' },
  'המערער': { male: 'המערער', female: 'המערערת', plural: 'המערערים' },
  'המשיב': { male: 'המשיב', female: 'המשיבה', plural: 'המשיבים' },
  'המבקש': { male: 'המבקש', female: 'המבקשת', plural: 'המבקשים' },
  'המוסכם': { male: 'המוסכם', female: 'המוסכמת', plural: 'המוסכמים' },
  'הנאשם': { male: 'הנאשם', female: 'הנאשמת', plural: 'הנאשמים' },
  'המתלונן': { male: 'המתלונן', female: 'המתלוננת', plural: 'המתלוננים' },
  
  // מונחים משפטיים - יחסים משפחתיים
  'בן_הזוג': { male: 'בן הזוג', female: 'בת הזוג', plural: 'בני הזוג' },
  'הבעל': { male: 'הבעל', female: 'האישה', plural: 'בני הזוג' },
  'האלמן': { male: 'האלמן', female: 'האלמנה', plural: 'האלמנים' },
  'הגרוש': { male: 'הגרוש', female: 'הגרושה', plural: 'הגרושים' },
  
  // מונחים משפטיים - תפקידים
  'השוכר': { male: 'השוכר', female: 'השוכרת', plural: 'השוכרים', organization: 'החברה השוכרת' },
  'המשכיר': { male: 'המשכיר', female: 'המשכירה', plural: 'המשכירים', organization: 'החברה המשכירה' },
  'הקונה': { male: 'הקונה', female: 'הקונה', plural: 'הקונים', organization: 'החברה הקונה' },
  'המוכר': { male: 'המוכר', female: 'המוכרת', plural: 'המוכרים', organization: 'החברה המוכרת' },
  'העובד': { male: 'העובד', female: 'העובדת', plural: 'העובדים' },
  'המעביד': { male: 'המעביד', female: 'המעבידה', plural: 'המעבידים', organization: 'החברה המעבידה' },
  'השותף': { male: 'השותף', female: 'השותפה', plural: 'השותפים', organization: 'החברה השותפה' },
  
  // מונחים משפטיים - ייפוי כוח והנחיות מקדימות
  'מיופה_כוח': { male: 'מיופה כוח', female: 'מיופת כוח', plural: 'מיופי כוח' },
  'מיופה_הכוח': { male: 'מיופה הכוח', female: 'מיופת הכוח', plural: 'מיופי הכוח' },
  'אפוטרופוס': { male: 'אפוטרופוס', female: 'אפוטרופסית', plural: 'אפוטרופסים' },
  'האפוטרופוס': { male: 'האפוטרופוס', female: 'האפוטרופסית', plural: 'האפוטרופסים' },
  'הממנה': { male: 'הממנה', female: 'הממנה', plural: 'הממנים' },
  'ממנה': { male: 'ממנה', female: 'ממנה', plural: 'ממנים' },
  'מטפל': { male: 'מטפל', female: 'מטפלת', plural: 'מטפלים' },
  'המטפל': { male: 'המטפל', female: 'המטפלת', plural: 'המטפלים' },
  'המנהל': { male: 'המנהל', female: 'המנהלת', plural: 'המנהלים' },
  'מנהל': { male: 'מנהל', female: 'מנהלת', plural: 'מנהלים' },
  'מורשה': { male: 'מורשה', female: 'מורשת', plural: 'מורשים' },
  'בעלים': { male: 'בעלים', female: 'בעלת', plural: 'בעלים' },
  'הבעלים': { male: 'הבעלים', female: 'הבעלת', plural: 'הבעלים' },
  'נציג': { male: 'נציג', female: 'נציגה', plural: 'נציגים' },
  'הנציג': { male: 'הנציג', female: 'הנציגה', plural: 'הנציגים' },
  
  // יחסי משפחה
  'בן': { male: 'בן', female: 'בת', plural: 'ילדים' },
  'הבן': { male: 'הבן', female: 'הבת', plural: 'הילדים' },
  'בנו': { male: 'בנו', female: 'בתו', plural: 'ילדיו' },
  'אח': { male: 'אח', female: 'אחות', plural: 'אחים' },
  'האח': { male: 'האח', female: 'האחות', plural: 'האחים' },
  'אחיו': { male: 'אחיו', female: 'אחותו', plural: 'אחיו' },
  'הורהמשפחתי': { male: 'אב', female: 'אם', plural: 'הורים' },
  'ההורה': { male: 'האב', female: 'האם', plural: 'ההורים' },
  'נכד': { male: 'נכד', female: 'נכדה', plural: 'נכדים' },
  'הנכד': { male: 'הנכד', female: 'הנכדה', plural: 'הנכדים' },
  
  // יורשים וזכאים
  'יורש': { male: 'יורש', female: 'יורשת', plural: 'יורשים' },
  'זכאי_לירושה': { male: 'זכאי לירושה', female: 'זכאית לירושה', plural: 'זכאים לירושה' },
  'מקבל': { male: 'מקבל', female: 'מקבלת', plural: 'מקבלים' },
  'המקבל': { male: 'המקבל', female: 'המקבלת', plural: 'המקבלים' },
  
  // עדים
  'עד': { male: 'עד', female: 'עדה', plural: 'עדים' },
  'העד': { male: 'העד', female: 'העדה', plural: 'העדים' },
  
  // מונחים משפטיים - מצבים
  'זכאימשפטי': { male: 'זכאי', female: 'זכאית', plural: 'זכאים' },
  'חייב': { male: 'חייב', female: 'חייבת', plural: 'חייבים' },
  'רשאי': { male: 'רשאי', female: 'רשאית', plural: 'רשאים' },
  'אחראימשפטי': { male: 'אחראי', female: 'אחראית', plural: 'אחראים' },
  'מוסמך': { male: 'מוסמך', female: 'מוסמכת', plural: 'מוסמכים' },
  'מחויבמשפטי': { male: 'מחויב', female: 'מחויבת', plural: 'מחויבים' },
  
  // מונחים משפטיים - נאמנות
  'הנאמן': { male: 'הנאמן', female: 'הנאמנה', plural: 'הנאמנים' },
  'עין': { male: 'עינו', female: 'עינה', plural: 'עיניהם' },
  'עיני': { male: 'עיניו', female: 'עינה', plural: 'עיניהם' },
  
  // מונחים משפטיים - אפוטרופסות (נוספים)
  'אפוטרופסית': { male: 'אפוטרופוס', female: 'אפוטרופסית', plural: 'אפוטרופסים' },
  'האפוטרופסית': { male: 'האפוטרופוס', female: 'האפוטרופסית', plural: 'האפוטרופסים' },
  
  // מונחים משפטיים - רכוש ותכשיטים
  'תכשיטים': { male: 'תכשיטי', female: 'תכשיטי', plural: 'תכשיטינו' },
  'תכשירים': { male: 'תכשירי', female: 'תכשירי', plural: 'תכשירינו' },
  'טבעת': { male: 'טבעתי', female: 'טבעתי', plural: 'טבעתנו' },
  'מורשה_פעולה': { male: 'מורשה לפעול', female: 'מורשת לפעול', plural: 'מורשים לפעול' },
  'מנוע': { male: 'מנוע', female: 'מנועה', plural: 'מנועים' },
  'חתוםמסמך': { male: 'חתום', female: 'חתומה', plural: 'חתומים' },
  'הנ"ל': { male: 'הנ"ל', female: 'הנ"ל', plural: 'הנ"ל' },
};

/**
 * פונקציית עזר: escape תווים מיוחדים ב-regex
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * החלפת מילה לפי מגדר
 */
export function replaceWithGender(word: string, gender: Gender): string {
  const genderedWord = hebrewDictionary[word];
  
  if (!genderedWord) {
    return word; // אם המילה לא במילון, החזר אותה כמו שהיא
  }
  
  switch (gender) {
    case 'male':
      return genderedWord.male;
    case 'female':
      return genderedWord.female;
    case 'plural':
      return genderedWord.plural;
    case 'organization':
      return genderedWord.organization || genderedWord.plural;
    default:
      return word;
  }
}

/**
 * החלפת טקסט מלא לפי מגדר
 * מחפש כל המילים במילון ומחליף אותן
 * כולל תמיכה בדפוסים /ת /ה /ים
 */
export function replaceTextWithGender(text: string, gender: Gender): string {
  let result = text;
  
  // **שלב 0: הגנה על שמות - שמור "בן" כשהיא חלק משם כמו "שם בן שם משפחה"**
  // לדוגמה: "שקד בן שי" צריך להישאר "שקד בן שי" ולא "שקד בת שי"
  const namePattern = /([א-ת]{2,})\s+בן\s+([א-ת]{2,})/g;
  const namePlaceholders: string[] = [];
  let placeholderIndex = 0;
  result = result.replace(namePattern, (match) => {
    const placeholder = `__NAME_PLACEHOLDER_${placeholderIndex}__`;
    namePlaceholders[placeholderIndex] = match;
    placeholderIndex++;
    return placeholder;
  });
  
  // **שלב 1: החלפת דפוסים נפוצים /ת /ה /ים /ות - תוקן!**
  if (gender === 'male') {
    // תיקון קריטי: קודם כל נחליף "בן/בת זוגי" ל"בן זוגי" לפני כל שאר ההחלפות
    result = result.replace(/בן\/בת זוגי/g, 'בן זוגי'); // בן/בת זוגי → בן זוגי
    result = result.replace(/בת\/בן זוגי/g, 'בן זוגי'); // בת/בן זוגי → בן זוגי
    
    result = result.replace(/\/ת\b/g, '');  // אני מבטל/ת → אני מבטל
    result = result.replace(/\/תוכל\b/g, '');  // יוכל/תוכל → יוכל
    result = result.replace(/([^ה])\/ה\b/g, '$1');  // אני מוריש/ה → אני מוריש
    result = result.replace(/מוריש\/ה/g, 'מוריש'); // מוריש/ה → מוריש
    result = result.replace(/מעניק\/ה/g, 'מעניק'); // מעניק/ה → מעניק
    result = result.replace(/יישא\/תישא/g, 'יישא'); // יישא/תישא → יישא
    result = result.replace(/יהיה רשאי\/ת/g, 'יהיה רשאי'); // יהיה רשאי/ת → יהיה רשאי
    result = result.replace(/רשאי\/ת/g, 'רשאי'); // רשאי/ת → רשאי
    
    // תיקון מיוחד לבן/בת זוג - אם כתוב "בן זוגי" זה תמיד זכר
    result = result.replace(/בן זוגי.*יהיה רשאית/g, 'בן זוגי יהיה רשאי'); // בן זוגי יהיה רשאית → בן זוגי יהיה רשאי
    result = result.replace(/בן זוגי.*תישא/g, 'בן זוגי יישא'); // בן זוגי תישא → בן זוגי יישא
    result = result.replace(/בן זוגי.*תהיה/g, 'בן זוגי יהיה'); // בן זוגי תהיה → בן זוגי יהיה
    
    // תיקון מיוחד - אם יש שם + "בן זוגי" זה תמיד זכר
    result = result.replace(/(\w+).*בן זוגי.*יהיה רשאית/g, '$1 בן זוגי יהיה רשאי'); // שם + בן זוגי יהיה רשאית → שם + בן זוגי יהיה רשאי
    result = result.replace(/(\w+).*בן זוגי.*תישא/g, '$1 בן זוגי יישא'); // שם + בן זוגי תישא → שם + בן זוגי יישא
    result = result.replace(/(\w+).*בן זוגי.*תהיה/g, '$1 בן זוגי יהיה'); // שם + בן זוגי תהיה → שם + בן זוגי יהיה
    
    // תיקון ספציפי - אם יש "בן זוגי" אז כל "יהיה רשאית" או "תישא" הופכים לזכר
    result = result.replace(/יהיה רשאית.*בן זוגי/g, 'יהיה רשאי בן זוגי'); // יהיה רשאית + בן זוגי → יהיה רשאי בן זוגי
    result = result.replace(/תישא.*בן זוגי/g, 'יישא בן זוגי'); // תישא + בן זוגי → יישא בן זוגי
    result = result.replace(/תהיה.*בן זוגי/g, 'יהיה בן זוגי'); // תהיה + בן זוגי → יהיה בן זוגי
    
    // תיקון נוסף - אם יש "בן זוגי" אז כל "יהיה רשאית" או "תישא" הופכים לזכר
    if (result.includes('בן זוגי') && !result.includes('בת זוגי')) {
      result = result.replace(/יהיה רשאית/g, 'יהיה רשאי'); // יהיה רשאית → יהיה רשאי (אם יש בן זוגי)
      result = result.replace(/תהיה רשאית/g, 'יהיה רשאי'); // תהיה רשאית → יהיה רשאי (אם יש בן זוגי)
      result = result.replace(/תישא/g, 'יישא'); // תישא → יישא (אם יש בן זוגי)
      result = result.replace(/תהיה/g, 'יהיה'); // תהיה → יהיה (אם יש בן זוגי)
    }
    
    // תיקון נוסף - אם יש "בת זוגי" אז כל "יהיה רשאי" או "יישא" הופכים לנקבה
    if (result.includes('בת זוגי')) {
      result = result.replace(/יהיה רשאי/g, 'תהיה רשאית'); // יהיה רשאי → תהיה רשאית (אם יש בת זוגי)
      result = result.replace(/יישא/g, 'תישא'); // יישא → תישא (אם יש בת זוגי)
      result = result.replace(/יהיה/g, 'תהיה'); // יהיה → תהיה (אם יש בת זוגי)
    }
    result = result.replace(/ה\/ה\b/g, 'ה');  // מצווה/ה → מצווה
    result = result.replace(/\/ים\b/g, ''); // ממנה/ים → ממנה
    result = result.replace(/\/ית\b/g, ''); // חלופי/ת → חלופי
    result = result.replace(/\/ות\b/g, ''); // קטנ/ות → קטנ
    
    // טיפול בדפוסים מורכבים
    result = result.replace(/הוא יליד\/ת/g, 'הוא יליד'); // הוא יליד/ת → הוא יליד
    result = result.replace(/הוא ת\.ז\./g, 'הוא ת.ז.'); // הוא ת.ז. → הוא ת.ז.
    result = result.replace(/הוא מרחוב/g, 'הוא מרחוב'); // הוא מרחוב → הוא מרחוב
    result = result.replace(/הוא מוסמך\/ת/g, 'הוא מוסמך'); // הוא מוסמך/ת → הוא מוסמך
    result = result.replace(/הוא יחיד\/ה/g, 'הוא יחיד'); // הוא יחיד/ה → הוא יחיד
    result = result.replace(/הוא חלופי\/ת/g, 'הוא חלופי'); // הוא חלופי/ת → הוא חלופי
    result = result.replace(/הוא ראשון\/ה/g, 'הוא ראשון'); // הוא ראשון/ה → הוא ראשון
    result = result.replace(/הוא ירצה\/תרצה/g, 'הוא ירצה'); // הוא ירצה/תרצה → הוא ירצה
    result = result.replace(/הוא יוכל\/תוכל/g, 'הוא יוכל'); // הוא יוכל/תוכל → הוא יוכל
    result = result.replace(/\bלא יוכל\/תוכל\b/g, 'לא יוכל'); // לא יוכל/תוכל → לא יוכל
    result = result.replace(/\bלא ירצה\/תרצה\b/g, 'לא ירצה'); // לא ירצה/תרצה → לא ירצה
    result = result.replace(/\bיוכל\/תוכל\b/g, 'יוכל'); // יוכל/תוכל → יוכל (גם בלי "הוא" לפני)
    result = result.replace(/\bירצה\/תרצה\b/g, 'ירצה'); // ירצה/תרצה → ירצה (גם בלי "הוא" לפני)
    
    // דפוסים חדשים - עסקים וירושה
    result = result.replace(/ירש\/תרש/g, 'ירש'); // ירש/תרש → ירש
    result = result.replace(/הוא\/היא/g, 'הוא'); // הוא/היא → הוא
    result = result.replace(/מתחייב\/ת/g, 'מתחייב'); // מתחייב/ת → מתחייב
    result = result.replace(/הוא יהיה\/תהיה/g, 'הוא יהיה'); // הוא יהיה/תהיה → הוא יהיה
    result = result.replace(/הוא ילך\/תלך/g, 'הוא ילך'); // הוא ילך/תלך → הוא ילך
    result = result.replace(/הוא יגיע\/תגיע/g, 'הוא יגיע'); // הוא יגיע/תגיע → הוא יגיע
    result = result.replace(/הוא יקבל\/תקבל/g, 'הוא יקבל'); // הוא יקבל/תקבל → הוא יקבל
    result = result.replace(/הוא יבחר\/תבחר/g, 'הוא יבחר'); // הוא יבחר/תבחר → הוא יבחר
    result = result.replace(/הוא ימנה\/תמנה/g, 'הוא ימנה'); // הוא ימנה/תמנה → הוא ימנה
    
    // דפוסים נוספים מהקובץ המלא
    result = result.replace(/מבקש\/ת/g, 'מבקש'); // מבקש/ת → מבקש
    result = result.replace(/מורה\/ה/g, 'מורה'); // מורה/ה → מורה (command)
    result = result.replace(/תושב\/ת/g, 'תושב'); // תושב/ת → תושב
    result = result.replace(/פטור\/ה/g, 'פטור'); // פטור/ה → פטור
    result = result.replace(/יידרש\/תידרש/g, 'יידרש'); // יידרש/תידרש → יידרש
    result = result.replace(/יבצע\/תבצע/g, 'יבצע'); // יבצע/תבצע → יבצע
    result = result.replace(/שיקול דעתו\/ה/g, 'שיקול דעתו'); // שיקול דעתו/ה → שיקול דעתו
    result = result.replace(/סמכויותיו\/ה/g, 'סמכויותיו'); // סמכויותיו/ה → סמכויותיו
    result = result.replace(/כראות עיניו\/ה/g, 'כראות עיניו'); // כראות עיניו/ה → כראות עיניו
    result = result.replace(/יישא\/תישא/g, 'יישא'); // יישא/תישא → יישא
    result = result.replace(/יעריך\/תעריך/g, 'יעריך'); // יעריך/תעריך → יעריך
    result = result.replace(/יחלק\/תחלק/g, 'יחלק'); // יחלק/תחלק → יחלק
    result = result.replace(/ישמור\/תשמור/g, 'ישמור'); // ישמור/תשמור → ישמור
    result = result.replace(/יראה\/תראה/g, 'יראה'); // יראה/תראה → יראה
    result = result.replace(/ישלים\/תשלים/g, 'ישלים'); // ישלים/תשלים → ישלים
    result = result.replace(/ימליץ\/ה/g, 'ימליץ'); // ימליץ/ה → ימליץ
    result = result.replace(/ישאר\/תישאר/g, 'ישאר'); // יישאר/תישאר → יישאר
    result = result.replace(/יתמכר\/תתמכר/g, 'יתמכר'); // יתמכר/תתמכר → יתמכר
    result = result.replace(/מצהיר\/ה/g, 'מצהיר'); // מצהיר/ה → מצהיר
    result = result.replace(/מעוניין\/ת/g, 'מעוניין'); // מעוניין/ת → מעוניין
    result = result.replace(/ממלא\/ת/g, 'ממלא'); // ממלא/ת → ממלא (עבור "אני ממליץ/ה")
    result = result.replace(/רשאי\/ת/g, 'רשאי'); // רשאי/ת → רשאי
    result = result.replace(/יחליט\/תחליט/g, 'יחליט'); // יחליט/תחליט → יחליט
    result = result.replace(/מרצונו\/ה/g, 'מרצונו'); // מרצונו/ה → מרצונו
    result = result.replace(/מגוריו\/ה/g, 'מגוריו'); // מגוריו/ה → מגוריו
    result = result.replace(/חייו\/ה/g, 'חייו'); // חייו/ה → חייו
    result = result.replace(/הוא\/היא/g, 'הוא'); // הוא/היא → הוא
    
    // מונחים משפטיים - נאמנות
    result = result.replace(/הנאמן\/ת/g, 'הנאמן'); // הנאמן/ת → הנאמן
    result = result.replace(/עינו\/ה/g, 'עינו'); // עינו/ה → עינו
    result = result.replace(/עיניו\/ה/g, 'עיניו'); // עיניו/ה → עיניו
    result = result.replace(/כראות עינו\/ה/g, 'כראות עינו'); // כראות עינו/ה → כראות עינו
    
    // מונחים משפטיים - אפוטרופסות
    result = result.replace(/אפוטרופוס\/ת/g, 'אפוטרופוס'); // אפוטרופוס/ת → אפוטרופוס
    result = result.replace(/האפוטרופוס\/ת/g, 'האפוטרופוס'); // האפוטרופוס/ת → האפוטרופוס
    result = result.replace(/אפוטרופסית\/ת/g, 'אפוטרופוס'); // אפוטרופסית/ת → אפוטרופוס
    result = result.replace(/האפוטרופסית\/ת/g, 'האפוטרופוס'); // האפוטרופסית/ת → האפוטרופוס
    
    // מונחים משפטיים - רכוש ותכשיטים
    result = result.replace(/תכשיטים\/י/g, 'תכשיטי'); // תכשיטים/י → תכשיטי
    result = result.replace(/תכשירים\/י/g, 'תכשירי'); // תכשירים/י → תכשירי
    result = result.replace(/טבעת\/י/g, 'טבעתי'); // טבעת/י → טבעתי
  } else if (gender === 'female') {
    // תיקון קריטי: קודם כל נחליף "בן/בת זוגי" ל"בת זוגי" לפני כל שאר ההחלפות
    result = result.replace(/בן\/בת זוגי/g, 'בת זוגי'); // בן/בת זוגי → בת זוגי
    result = result.replace(/בת\/בן זוגי/g, 'בת זוגי'); // בת/בן זוגי → בת זוגי
    
    result = result.replace(/\/ת\b/g, 'ת');  // אני מבטל/ת → אני מבטלת
    result = result.replace(/\/תוכל\b/g, 'תוכל');  // יוכל/תוכל → תוכל
    result = result.replace(/([^ה])\/ה\b/g, '$1ה');  // אני מוריש/ה → אני מורישה
    result = result.replace(/מוריש\/ה/g, 'מורישה'); // מוריש/ה → מורישה
    result = result.replace(/מעניק\/ה/g, 'מעניקה'); // מעניק/ה → מעניקה
    result = result.replace(/יישא\/תישא/g, 'תישא'); // יישא/תישא → תישא
    result = result.replace(/יהיה רשאי\/ת/g, 'תהיה רשאית'); // יהיה רשאי/ת → תהיה רשאית
    result = result.replace(/רשאי\/ת/g, 'רשאית'); // רשאי/ת → רשאית
    
    // תיקון מיוחד לבן/בת זוג - אם כתוב "בת זוגי" זה תמיד נקבה
    result = result.replace(/בת זוגי.*יהיה רשאי/g, 'בת זוגי תהיה רשאית'); // בת זוגי יהיה רשאי → בת זוגי תהיה רשאית
    result = result.replace(/בת זוגי.*יישא/g, 'בת זוגי תישא'); // בת זוגי יישא → בת זוגי תישא
    result = result.replace(/בת זוגי.*יהיה/g, 'בת זוגי תהיה'); // בת זוגי יהיה → בת זוגי תהיה
    
    // תיקון מיוחד - אם יש שם + "בת זוגי" זה תמיד נקבה
    result = result.replace(/(\w+).*בת זוגי.*יהיה רשאי/g, '$1 בת זוגי תהיה רשאית'); // שם + בת זוגי יהיה רשאי → שם + בת זוגי תהיה רשאית
    result = result.replace(/(\w+).*בת זוגי.*יישא/g, '$1 בת זוגי תישא'); // שם + בת זוגי יישא → שם + בת זוגי תישא
    result = result.replace(/(\w+).*בת זוגי.*יהיה/g, '$1 בת זוגי תהיה'); // שם + בת זוגי יהיה → שם + בת זוגי תהיה
    
    // תיקון ספציפי - אם יש "בת זוגי" אז כל "יהיה רשאי" או "יישא" הופכים לנקבה
    result = result.replace(/יהיה רשאי.*בת זוגי/g, 'תהיה רשאית בת זוגי'); // יהיה רשאי + בת זוגי → תהיה רשאית בת זוגי
    result = result.replace(/יישא.*בת זוגי/g, 'תישא בת זוגי'); // יישא + בת זוגי → תישא בת זוגי
    result = result.replace(/יהיה.*בת זוגי/g, 'תהיה בת זוגי'); // יהיה + בת זוגי → תהיה בת זוגי
    
    // תיקון נוסף - אם יש "בת זוגי" אז כל "יהיה רשאי" או "יישא" הופכים לנקבה
    if (result.includes('בת זוגי')) {
      result = result.replace(/יהיה רשאי/g, 'תהיה רשאית'); // יהיה רשאי → תהיה רשאית (אם יש בת זוגי)
      result = result.replace(/יישא/g, 'תישא'); // יישא → תישא (אם יש בת זוגי)
      result = result.replace(/יהיה/g, 'תהיה'); // יהיה → תהיה (אם יש בת זוגי)
    }
    result = result.replace(/ה\/ה\b/g, 'ה');  // מצווה/ה → מצווה
    result = result.replace(/\/ים\b/g, ''); // תוקן! ממנה/ים → ממנה (לא ממנהים)
    result = result.replace(/\/ית\b/g, 'ית'); // חלופי/ת → חלופית
    result = result.replace(/\/ות\b/g, ''); // תוקן! קטנ/ות → קטנ (לא קטנות)
    
    // טיפול בדפוסים מורכבים
    result = result.replace(/הוא יליד\/ת/g, 'היא ילידת'); // הוא יליד/ת → היא ילידת
    result = result.replace(/הוא ת\.ז\./g, 'היא ת.ז.'); // הוא ת.ז. → היא ת.ז.
    result = result.replace(/הוא מרחוב/g, 'היא מרחוב'); // הוא מרחוב → היא מרחוב
    result = result.replace(/הוא מוסמך\/ת/g, 'היא מוסמכת'); // הוא מוסמך/ת → היא מוסמכת
    result = result.replace(/הוא יחיד\/ה/g, 'היא יחידה'); // הוא יחיד/ה → היא יחידה
    result = result.replace(/הוא חלופי\/ת/g, 'היא חלופית'); // הוא חלופי/ת → היא חלופית
    result = result.replace(/הוא ראשון\/ה/g, 'היא ראשונה'); // הוא ראשון/ה → היא ראשונה
    result = result.replace(/הוא ירצה\/תרצה/g, 'היא תרצה'); // הוא ירצה/תרצה → היא תרצה
    result = result.replace(/הוא יוכל\/תוכל/g, 'היא תוכל'); // הוא יוכל/תוכל → היא תוכל
    result = result.replace(/הוא יהיה\/תהיה/g, 'היא תהיה'); // הוא יהיה/תהיה → היא תהיה
    
    // דפוסים חדשים - עסקים וירושה
    result = result.replace(/ירש\/תרש/g, 'תרש'); // ירש/תרש → תרש
    result = result.replace(/הוא\/היא/g, 'היא'); // הוא/היא → היא
    result = result.replace(/מתחייב\/ת/g, 'מתחייבת'); // מתחייב/ת → מתחייבת
    result = result.replace(/הוא ילך\/תלך/g, 'היא תלך'); // הוא ילך/תלך → היא תלך
    result = result.replace(/הוא יגיע\/תגיע/g, 'היא תגיע'); // הוא יגיע/תגיע → היא תגיע
    result = result.replace(/הוא יקבל\/תקבל/g, 'היא תקבל'); // הוא יקבל/תקבל → היא תקבל
    result = result.replace(/הוא יבחר\/תבחר/g, 'היא תבחר'); // הוא יבחר/תבחר → היא תבחר
    result = result.replace(/הוא ימנה\/תמנה/g, 'היא תמנה'); // הוא ימנה/תמנה → היא תמנה
    
    // דפוסים נוספים מהקובץ המלא
    result = result.replace(/מבקש\/ת/g, 'מבקשת'); // מבקש/ת → מבקשת
    result = result.replace(/מורה\/ה/g, 'מורה'); // מורה/ה → מורה (command - זהה בזכר ונקבה)
    result = result.replace(/תושב\/ת/g, 'תושבת'); // תושב/ת → תושבת
    result = result.replace(/פטור\/ה/g, 'פטורה'); // פטור/ה → פטורה
    result = result.replace(/יידרש\/תידרש/g, 'תידרש'); // יידרש/תידרש → תידרש
    result = result.replace(/יבצע\/תבצע/g, 'תבצע'); // יבצע/תבצע → תבצע
    result = result.replace(/שיקול דעתו\/ה/g, 'שיקול דעתה'); // שיקול דעתו/ה → שיקול דעתה
    result = result.replace(/סמכויותיו\/ה/g, 'סמכויותיה'); // סמכויותיו/ה → סמכויותיה
    result = result.replace(/כראות עיניו\/ה/g, 'כראות עינה'); // כראות עיניו/ה → כראות עינה
    result = result.replace(/יישא\/תישא/g, 'תישא'); // יישא/תישא → תישא
    result = result.replace(/יעריך\/תעריך/g, 'תעריך'); // יעריך/תעריך → תעריך
    result = result.replace(/יחלק\/תחלק/g, 'תחלק'); // יחלק/תחלק → תחלק
    result = result.replace(/ישמור\/תשמור/g, 'תשמור'); // ישמור/תשמור → תשמור
    result = result.replace(/יראה\/תראה/g, 'תראה'); // יראה/תראה → תראה
    result = result.replace(/ישלים\/תשלים/g, 'תשלים'); // ישלים/תשלים → תשלים
    result = result.replace(/ימליץ\/ה/g, 'תמליץ'); // ימליץ/ה → תמליץ
    result = result.replace(/ישאר\/תישאר/g, 'תישאר'); // יישאר/תישאר → תישאר
    result = result.replace(/יתמכר\/תתמכר/g, 'תתמכר'); // יתמכר/תתמכר → תתמכר
    result = result.replace(/מצהיר\/ה/g, 'מצהירה'); // מצהיר/ה → מצהירה
    result = result.replace(/מעוניין\/ת/g, 'מעוניינת'); // מעוניין/ת → מעוניינת
    result = result.replace(/ממלא\/ת/g, 'ממלאת'); // ממלא/ת → ממלאת
    result = result.replace(/רשאי\/ת/g, 'רשאית'); // רשאי/ת → רשאית
    result = result.replace(/יחליט\/תחליט/g, 'תחליט'); // יחליט/תחליט → תחליט
    result = result.replace(/מרצונו\/ה/g, 'מרצונה'); // מרצונו/ה → מרצונה
    result = result.replace(/מגוריו\/ה/g, 'מגוריה'); // מגוריו/ה → מגוריה
    result = result.replace(/חייו\/ה/g, 'חייה'); // חייו/ה → חייה
    result = result.replace(/הוא\/היא/g, 'היא'); // הוא/היא → היא
    
    // מונחים משפטיים - נאמנות
    result = result.replace(/הנאמן\/ת/g, 'הנאמנה'); // הנאמן/ת → הנאמנה
    result = result.replace(/עינו\/ה/g, 'עינה'); // עינו/ה → עינה
    result = result.replace(/עיניו\/ה/g, 'עינה'); // עיניו/ה → עינה
    result = result.replace(/כראות עינו\/ה/g, 'כראות עינה'); // כראות עינו/ה → כראות עינה
    
    // מונחים משפטיים - אפוטרופסות
    result = result.replace(/אפוטרופוס\/ת/g, 'אפוטרופסית'); // אפוטרופוס/ת → אפוטרופסית
    result = result.replace(/האפוטרופוס\/ת/g, 'האפוטרופסית'); // האפוטרופוס/ת → האפוטרופסית
    result = result.replace(/אפוטרופסית\/ת/g, 'אפוטרופסית'); // אפוטרופסית/ת → אפוטרופסית
    result = result.replace(/האפוטרופסית\/ת/g, 'האפוטרופסית'); // האפוטרופסית/ת → האפוטרופסית
    
    // מונחים משפטיים - רכוש ותכשיטים
    result = result.replace(/תכשיטים\/י/g, 'תכשיטי'); // תכשיטים/י → תכשיטי
    result = result.replace(/תכשירים\/י/g, 'תכשירי'); // תכשירים/י → תכשירי
    result = result.replace(/טבעת\/י/g, 'טבעתי'); // טבעת/י → טבעתי
  } else if (gender === 'plural') {
    // תיקון קריטי: קודם כל נחליף "בן/בת זוגי" ל"בני זוגי" לפני כל שאר ההחלפות
    result = result.replace(/בן\/בת זוגי/g, 'בני זוגי'); // בן/בת זוגי → בני זוגי
    result = result.replace(/בת\/בן זוגי/g, 'בני זוגי'); // בת/בן זוגי → בני זוגי
    
    result = result.replace(/\/ת\b/g, '');   // אנו מבטל/ת → אנו מבטל
    result = result.replace(/\/תוכל\b/g, '');  // יוכל/תוכל → יוכל
    result = result.replace(/([^ה])\/ה\b/g, '$1');   // אנו מוריש/ה → אנו מוריש
    result = result.replace(/מוריש\/ה/g, 'מורישים'); // מוריש/ה → מורישים
    result = result.replace(/מעניק\/ה/g, 'מעניקים'); // מעניק/ה → מעניקים
    result = result.replace(/יישא\/תישא/g, 'יישאו'); // יישא/תישא → יישאו
    result = result.replace(/יהיה רשאי\/ת/g, 'יהיו רשאים'); // יהיה רשאי/ת → יהיו רשאים
    result = result.replace(/רשאי\/ת/g, 'רשאים'); // רשאי/ת → רשאים
    
    // תיקון מיוחד לבן/בת זוג - ברבים זה תמיד "בני זוגי"
    result = result.replace(/בן זוגי.*יהיה רשאי/g, 'בן זוגי יהיו רשאים'); // בן זוגי יהיה רשאי → בן זוגי יהיו רשאים
    result = result.replace(/בן זוגי.*יהיה רשאית/g, 'בן זוגי יהיו רשאים'); // בן זוגי יהיה רשאית → בן זוגי יהיו רשאים
    result = result.replace(/בן זוגי.*תישא/g, 'בן זוגי יישאו'); // בן זוגי תישא → בן זוגי יישאו
    result = result.replace(/בן זוגי.*יישא/g, 'בן זוגי יישאו'); // בן זוגי יישא → בן זוגי יישאו
    result = result.replace(/בת זוגי.*יהיה רשאי/g, 'בת זוגי יהיו רשאים'); // בת זוגי יהיה רשאי → בת זוגי יהיו רשאים
    result = result.replace(/בת זוגי.*יהיה רשאית/g, 'בת זוגי יהיו רשאים'); // בת זוגי יהיה רשאית → בת זוגי יהיו רשאים
    result = result.replace(/בת זוגי.*תישא/g, 'בת זוגי יישאו'); // בת זוגי תישא → בת זוגי יישאו
    result = result.replace(/בת זוגי.*יישא/g, 'בת זוגי יישאו'); // בת זוגי יישא → בת זוגי יישאו
    result = result.replace(/ה\/ה\b/g, 'ה');  // מצווה/ה → מצווה
    result = result.replace(/\/ים\b/g, 'ים'); // ממנה/ים → ממנהים
    result = result.replace(/\/ית\b/g, 'ים'); // חלופי/ת → חלופיים
    result = result.replace(/\/ות\b/g, 'ות'); // קטנ/ות → קטנות
    
    // טיפול בדפוסים מורכבים
    result = result.replace(/הוא יליד\/ת/g, 'הם ילידים'); // הוא יליד/ת → הם ילידים
    result = result.replace(/הוא ת\.ז\./g, 'הם ת.ז.'); // הוא ת.ז. → הם ת.ז.
    result = result.replace(/הוא מרחוב/g, 'הם מרחוב'); // הוא מרחוב → הם מרחוב
    result = result.replace(/הוא מוסמך\/ת/g, 'הם מוסמכים'); // הוא מוסמך/ת → הם מוסמכים
    result = result.replace(/הוא יחיד\/ה/g, 'הם יחידים'); // הוא יחיד/ה → הם יחידים
    result = result.replace(/הוא חלופי\/ת/g, 'הם חלופיים'); // הוא חלופי/ת → הם חלופיים
    result = result.replace(/הוא ראשון\/ה/g, 'הם ראשונים'); // הוא ראשון/ה → הם ראשונים
    result = result.replace(/הוא ירצה\/תרצה/g, 'הם ירצו'); // הוא ירצה/תרצה → הם ירצו
    result = result.replace(/הוא יוכל\/תוכל/g, 'הם יוכלו'); // הוא יוכל/תוכל → הם יוכלו
    result = result.replace(/הוא יהיה\/תהיה/g, 'הם יהיו'); // הוא יהיה/תהיה → הם יהיו
    
    // דפוסים חדשים - עסקים וירושה
    result = result.replace(/ירש\/תרש/g, 'ירשו'); // ירש/תרש → ירשו
    result = result.replace(/הוא\/היא/g, 'הם'); // הוא/היא → הם
    result = result.replace(/מתחייב\/ת/g, 'מתחייבים'); // מתחייב/ת → מתחייבים
    result = result.replace(/הוא ילך\/תלך/g, 'הם ילכו'); // הוא ילך/תלך → הם ילכו
    
    // דפוסים נוספים מהקובץ המלא
    result = result.replace(/מבקש\/ת/g, 'מבקשים'); // מבקש/ת → מבקשים
    result = result.replace(/מורה\/ה/g, 'מורים'); // מורה/ה → מורים (command)
    result = result.replace(/תושב\/ת/g, 'תושבים'); // תושב/ת → תושבים
    result = result.replace(/פטור\/ה/g, 'פטורים'); // פטור/ה → פטורים
    result = result.replace(/יידרש\/תידרש/g, 'יידרשו'); // יידרש/תידרש → יידרשו
    result = result.replace(/יבצע\/תבצע/g, 'יבצעו'); // יבצע/תבצע → יבצעו
    result = result.replace(/שיקול דעתו\/ה/g, 'שיקול דעתם'); // שיקול דעתו/ה → שיקול דעתם
    result = result.replace(/סמכויותיו\/ה/g, 'סמכויותיהם'); // סמכויותיו/ה → סמכויותיהם
    result = result.replace(/כראות עיניו\/ה/g, 'כראות עיניהם'); // כראות עיניו/ה → כראות עיניהם
    result = result.replace(/יישא\/תישא/g, 'יישאו'); // יישא/תישא → יישאו
    result = result.replace(/יעריך\/תעריך/g, 'יעריכו'); // יעריך/תעריך → יעריכו
    result = result.replace(/יחלק\/תחלק/g, 'יחלקו'); // יחלק/תחלק → יחלקו
    result = result.replace(/ישמור\/תשמור/g, 'ישמרו'); // ישמור/תשמור → ישמרו
    result = result.replace(/יראה\/תראה/g, 'יראו'); // יראה/תראה → יראו
    result = result.replace(/ישלים\/תשלים/g, 'ישלימו'); // ישלים/תשלים → ישלימו
    result = result.replace(/ימליץ\/ה/g, 'ימליצו'); // ימליץ/ה → ימליצו
    result = result.replace(/ישאר\/תישאר/g, 'יישארו'); // יישאר/תישאר → יישארו
    result = result.replace(/יתמכר\/תתמכר/g, 'יתמכרו'); // יתמכר/תתמכר → יתמכרו
    result = result.replace(/מצהיר\/ה/g, 'מצהירים'); // מצהיר/ה → מצהירים
    result = result.replace(/מעוניין\/ת/g, 'מעוניינים'); // מעוניין/ת → מעוניינים
    result = result.replace(/ממלא\/ת/g, 'ממלאים'); // ממלא/ת → ממלאים
    result = result.replace(/רשאי\/ת/g, 'רשאים'); // רשאי/ת → רשאים
    result = result.replace(/יחליט\/תחליט/g, 'יחליטו'); // יחליט/תחליט → יחליטו
    result = result.replace(/מרצונו\/ה/g, 'מרצונם'); // מרצונו/ה → מרצונם
    result = result.replace(/מגוריו\/ה/g, 'מגוריהם'); // מגוריו/ה → מגוריהם
    result = result.replace(/חייו\/ה/g, 'חייהם'); // חייו/ה → חיייהם
    result = result.replace(/הוא\/היא/g, 'הם'); // הוא/היא → הם
    result = result.replace(/הוא יגיע\/תגיע/g, 'הם יגיעו'); // הוא יגיע/תגיע → הם יגיעו
    result = result.replace(/הוא יקבל\/תקבל/g, 'הם יקבלו'); // הוא יקבל/תקבל → הם יקבלו
    result = result.replace(/הוא יבחר\/תבחר/g, 'הם יבחרו'); // הוא יבחר/תבחר → הם יבחרו
    result = result.replace(/הוא ימנה\/תמנה/g, 'הם ימנו'); // הוא ימנה/תמנה → הם ימנו
    
    // מונחים משפטיים - נאמנות
    result = result.replace(/הנאמן\/ת/g, 'הנאמנים'); // הנאמן/ת → הנאמנים
    result = result.replace(/עינו\/ה/g, 'עיניהם'); // עינו/ה → עיניהם
    result = result.replace(/עיניו\/ה/g, 'עיניהם'); // עיניו/ה → עיניהם
    result = result.replace(/כראות עינו\/ה/g, 'כראות עיניהם'); // כראות עינו/ה → כראות עיניהם
    
    // מונחים משפטיים - אפוטרופסות
    result = result.replace(/אפוטרופוס\/ת/g, 'אפוטרופסים'); // אפוטרופוס/ת → אפוטרופסים
    result = result.replace(/האפוטרופוס\/ת/g, 'האפוטרופסים'); // האפוטרופוס/ת → האפוטרופסים
    result = result.replace(/אפוטרופסית\/ת/g, 'אפוטרופסים'); // אפוטרופסית/ת → אפוטרופסים
    result = result.replace(/האפוטרופסית\/ת/g, 'האפוטרופסים'); // האפוטרופסית/ת → האפוטרופסים
    
    // מונחים משפטיים - רכוש ותכשיטים
    result = result.replace(/תכשיטים\/י/g, 'תכשיטינו'); // תכשיטים/י → תכשיטינו
    result = result.replace(/תכשירים\/י/g, 'תכשירינו'); // תכשירים/י → תכשירינו
    result = result.replace(/טבעת\/י/g, 'טבעתנו'); // טבעת/י → טבעתנו
  }
  
  // **שלב 2: עבור על כל המילים במילון - תוקן עם escape ו-word boundaries טובים יותר**
  Object.keys(hebrewDictionary).forEach(word => {
    const replacement = replaceWithGender(word, gender);
    
    // חריגה: "בן" לא יוחלף ל"בת" כשהיא חלק משם
    // אם יש placeholders של שמות, המילה "בן" בתוכם כבר מוגנת (היא עדיין בשורה 276-286)
    // כאן נדלג רק אם זה "בן" שיוחלף ל"בת" - זה כבר מטופל בשלב 0
    if (word === 'בן' && replacement === 'בת') {
      // דלג - ה"בן" בשמות כבר מוגן ב-placeholders
      return; // return במקום continue ב-forEach
    }
    
    // עושה escape למילה כדי למנוע בעיות עם תווים מיוחדים
    const escapedWord = escapeRegex(word);
    
    // החלף בכל המקומות בטקסט
    // משתמש ב-lookahead/lookbehind לתמיכה טובה יותר בעברית
    // מחפש רווחים, התחלת/סוף טקסט, או סימני פיסוק סביב המילה
    const regex = new RegExp(`(^|[\\s,.:;!?()\\[\\]"'])(${escapedWord})(?=[\\s,.:;!?()\\[\\]"']|$)`, 'g');
    result = result.replace(regex, `$1${replacement}`);
  });
  
  // **שלב 3: החזר את השמות המקוריים**
  namePlaceholders.forEach((name, index) => {
    result = result.replace(`__NAME_PLACEHOLDER_${index}__`, name);
  });
  
  return result;
}

/**
 * החלפה עם מגדרים מרובים (לטבלאות)
 * מאפשר להחליף מילים שונות עם מגדרים שונים באותו טקסט
 * 
 * תוקן! הסינטקס החדש: {{מילה_להחלפה}}
 * והמשתמש מספק מילון: { 'מילה_להחלפה': 'male' }
 */
export function replaceTextWithMultipleGenders(
  text: string,
  genderMap: Record<string, Gender>
): string {
  let result = text;
  
  // עבור על כל placeholder עם המגדר שלו
  Object.entries(genderMap).forEach(([wordKey, gender]) => {
    // מצא placeholders מהצורה {{שם_משתנה}}
    const escapedKey = escapeRegex(wordKey);
    const regex = new RegExp(`{{${escapedKey}}}`, 'g');
    
    result = result.replace(regex, () => {
      return replaceWithGender(wordKey, gender);
    });
  });
  
  return result;
}

/**
 * קבלת רשימת מילים שניתן להטות
 */
export function getAvailableWords(): string[] {
  return Object.keys(hebrewDictionary);
}

/**
 * בדיקה אם מילה קיימת במילון
 */
export function isWordInDictionary(word: string): boolean {
  return word in hebrewDictionary;
}

/**
 * הוספת מילה חדשה למילון (runtime)
 */
export function addCustomWord(word: string, genderedWord: GenderedWord): void {
  hebrewDictionary[word] = genderedWord;
}

/**
 * פונקציה מרכזית להחלת נטיות מגדר על טקסט
 * שם נוח יותר לשימוש ברכיבים
 */
export function applyGenderToText(text: string, gender: Gender): string {
  return replaceTextWithGender(text, gender);
}

/**
 * פונקציה חכמה: מזהה מגדר מהשם ומחילה את השינויים על הטקסט
 * @param text - הטקסט שיש להחיל עליו מגדר
 * @param name - השם שממנו לזהות את המגדר
 * @param fallbackGender - מגדר ברירת מחדל אם לא הצליח לזהות
 */
export function applyGenderFromName(text: string, name: string, fallbackGender: Gender = 'male'): string {
  const detectedGender = detectGenderFromName(name);
  const genderToUse = detectedGender || fallbackGender;
  return replaceTextWithGender(text, genderToUse);
}

/**
 * פונקציה להחלת מגדר על טקסט עם מספר גורמים (למשל: מצווה + יורש)
 * @param text - הטקסט
 * @param testatorGender - מגדר המצווה
 * @param heirGender - מגדר היורש (אופציונלי)
 */
export function applyMultipleGenders(
  text: string,
  testatorGender: Gender,
  heirGender?: Gender
): string {
  let result = text;
  
  // החל מגדר על המילים הראשיות (המצווה)
  result = replaceTextWithGender(result, testatorGender);
  
  // אם יש יורש, החל גם את המגדר שלו על מילים ספציפיות
  if (heirGender) {
    // זה ידרוש לוגיקה מתקדמת יותר לזיהוי הקשר
    // לעת עתה, נחזיר את התוצאה הבסיסית
  }
  
  return result;
}

/**
 * פונקציה להחלת מגדור על טקסט שמתייחס ליורש ספציפי
 * שימושי לטקסטים בצוואות שמדברים על יורשים
 */
export function applyGenderToHeirText(text: string, heir: { gender: Gender; firstName?: string; lastName?: string }): string {
  let result = text;
  
  // החלף placeholders של היורש
  if (heir.firstName && heir.lastName) {
    result = result.replace(/\{שם_יורש\}/g, `${heir.firstName} ${heir.lastName}`);
    result = result.replace(/\{שם_היורש\}/g, `${heir.firstName} ${heir.lastName}`);
  } else if (heir.firstName) {
    result = result.replace(/\{שם_יורש\}/g, heir.firstName);
    result = result.replace(/\{שם_היורש\}/g, heir.firstName);
  }
  
  // החלף מגדור
  return replaceTextWithGender(result, heir.gender);
}

/**
 * דוגמאות שימוש:
 * 
 * // שימוש בסיסי
 * const text = "המנוח עשה צוואה";
 * replaceTextWithGender(text, 'female'); // "המנוחה עשתה צוואה"
 * applyGenderToText(text, 'female'); // "המנוחה עשתה צוואה"
 * 
 * // שימוש מתקדם עם placeholders - תוקן!
 * const template = "{{התובע}} תבע את {{הנתבע}}";
 * replaceTextWithMultipleGenders(template, {
 *   'התובע': 'male',
 *   'הנתבע': 'female'
 * }); // "התובע תבע את הנתבעת"
 * 
 * // דוגמה עם דפוסים /ת /ה /ים
 * const text2 = "אני מצווה/ה וממנה/ים את";
 * replaceTextWithGender(text2, 'male'); // "אני מצווה וממנה את"
 * replaceTextWithGender(text2, 'female'); // "אני מצווה וממנה את"
 * replaceTextWithGender(text2, 'plural'); // "אני מצווה וממנהים את"
 */
