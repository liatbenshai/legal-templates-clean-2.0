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
  
  // כינויי גוף - מילות יחס
  'עליו': { male: 'עליו', female: 'עליה', plural: 'עליהם' },
  'לו': { male: 'לו', female: 'לה', plural: 'להם' },
  'אותו': { male: 'אותו', female: 'אותה', plural: 'אותם' },
  'ממנו': { male: 'ממנו', female: 'ממנה', plural: 'מהם' },
  'אצלו': { male: 'אצלו', female: 'אצלה', plural: 'אצלם' },
  'בידיו': { male: 'בידיו', female: 'בידיה', plural: 'בידיהם' },
  
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
  
  // פעלים נוספים - ייפוי כוח
  'יעדכן': { male: 'יעדכן', female: 'תעדכן', plural: 'יעדכנו' },
  'ימנע': { male: 'ימנע', female: 'תמנע', plural: 'ימנעו' },
  'ייקח': { male: 'ייקח', female: 'תיקח', plural: 'ייקחו' },
  'יציע': { male: 'יציע', female: 'תציע', plural: 'יציעו' },
  'ינסה': { male: 'ינסה', female: 'תנסה', plural: 'ינסו' },
  'יתעד': { male: 'יתעד', female: 'תתעד', plural: 'יתעדו' },
  'ינהל': { male: 'ינהל', female: 'תנהל', plural: 'ינהלו' },
  'יתייעץ': { male: 'יתייעץ', female: 'תתייעץ', plural: 'יתייעצו' },
  'יעקוב': { male: 'יעקוב', female: 'תעקוב', plural: 'יעקבו' },
  'לטובתו': { male: 'לטובתו', female: 'לטובתה', plural: 'לטובתם' },
  'דעתו': { male: 'דעתו', female: 'דעתה', plural: 'דעתם' },
  'אינו': { male: 'אינו', female: 'אינה', plural: 'אינם' },
  
  // פעלים נוספים - המשך
  'יפנה': { male: 'יפנה', female: 'תפנה', plural: 'יפנו' },
  'יעשה': { male: 'יעשה', female: 'תעשה', plural: 'יעשו' },
  'יפדה': { male: 'יפדה', female: 'תפדה', plural: 'יפדו' },
  'ימשוך': { male: 'ימשוך', female: 'תמשוך', plural: 'ימשכו' },
  'יעביר': { male: 'יעביר', female: 'תעביר', plural: 'יעבירו' },
  
  // כינויי שייכות נוספים
  'עצמו': { male: 'עצמו', female: 'עצמה', plural: 'עצמם' },
  'שלו': { male: 'שלו', female: 'שלה', plural: 'שלהם' },
  'מכיסו': { male: 'מכיסו', female: 'מכיסה', plural: 'מכיסם' },
  'הוציא': { male: 'הוציא', female: 'הוציאה', plural: 'הוציאו' },
  
  // פעלים נוספים - סדרה 3
  'ידווח': { male: 'ידווח', female: 'תדווח', plural: 'ידווחו' },
  'ישתתף': { male: 'ישתתף', female: 'תשתתף', plural: 'ישתתפו' },
  'יכין': { male: 'יכין', female: 'תכין', plural: 'יכינו' },
  'יחדש': { male: 'יחדש', female: 'תחדש', plural: 'יחדשו' },
  
  // פעלים נוספים - סדרה 4
  'יתאם': { male: 'יתאם', female: 'תתאם', plural: 'יתאמו' },
  'יחזור': { male: 'יחזור', female: 'תחזור', plural: 'יחזרו' },
  'יסדיר': { male: 'יסדיר', female: 'תסדיר', plural: 'יסדירו' },
  'ישתדל': { male: 'ישתדל', female: 'תשתדל', plural: 'ישתדלו' },
  
  // כינויי שייכות נוספים - סדרה 2
  'יכולתו': { male: 'יכולתו', female: 'יכולתה', plural: 'יכולתם' },
  'נפשו': { male: 'נפשו', female: 'נפשה', plural: 'נפשם' },
  'ילדיו': { male: 'ילדיו', female: 'ילדיה', plural: 'ילדיהם' },
  
  // פעלים עתיד - סדרה חדשה
  'יוודא': { male: 'יוודא', female: 'תוודא', plural: 'יוודאו' },
  'יטפל': { male: 'יטפל', female: 'תטפל', plural: 'יטפלו' },
  'ידאג': { male: 'ידאג', female: 'תדאג', plural: 'ידאגו' },
  'ישמור': { male: 'ישמור', female: 'תשמור', plural: 'ישמרו' },
  'ירצה': { male: 'ירצה', female: 'תרצה', plural: 'ירצו' },
  'יקבל': { male: 'יקבל', female: 'תקבל', plural: 'יקבלו' },
  'ישלם': { male: 'ישלם', female: 'תשלם', plural: 'ישלמו' },
  'יחתום': { male: 'יחתום', female: 'תחתום', plural: 'יחתמו' },
  'יבקש': { male: 'יבקש', female: 'תבקש', plural: 'יבקשו' },
  'ימסור': { male: 'ימסור', female: 'תמסור', plural: 'ימסרו' },
  'יודיע': { male: 'יודיע', female: 'תודיע', plural: 'יודיעו' },
  'יאשר': { male: 'יאשר', female: 'תאשר', plural: 'יאשרו' },
  'יבדוק': { male: 'יבדוק', female: 'תבדוק', plural: 'יבדקו' },
  'יתחייב': { male: 'יתחייב', female: 'תתחייב', plural: 'יתחייבו' },
  'יסכים': { male: 'יסכים', female: 'תסכים', plural: 'יסכימו' },
  'יפעל': { male: 'יפעל', female: 'תפעל', plural: 'יפעלו' },
  'יקיים': { male: 'יקיים', female: 'תקיים', plural: 'יקיימו' },
  'ישלח': { male: 'ישלח', female: 'תשלח', plural: 'ישלחו' },
  'יגיש': { male: 'יגיש', female: 'תגיש', plural: 'יגישו' },
  'ימלא': { male: 'ימלא', female: 'תמלא', plural: 'ימלאו' },
  'יספק': { male: 'יספק', female: 'תספק', plural: 'יספקו' },
  'יפקיד': { male: 'יפקיד', female: 'תפקיד', plural: 'יפקידו' },
  'ימנה': { male: 'ימנה', female: 'תמנה', plural: 'ימנו' },
  'יפרט': { male: 'יפרט', female: 'תפרט', plural: 'יפרטו' },
  'יציג': { male: 'יציג', female: 'תציג', plural: 'יציגו' },
  'יבחר': { male: 'יבחר', female: 'תבחר', plural: 'יבחרו' },
  'יקרא': { male: 'יקרא', female: 'תקרא', plural: 'יקראו' },
  'יכתוב': { male: 'יכתוב', female: 'תכתוב', plural: 'יכתבו' },
  'יחשב': { male: 'יחשב', female: 'תחשב', plural: 'יחשבו' },
  'יעזור': { male: 'יעזור', female: 'תעזור', plural: 'יעזרו' },
  'ילמד': { male: 'ילמד', female: 'תלמד', plural: 'ילמדו' },
  'יזכור': { male: 'יזכור', female: 'תזכור', plural: 'יזכרו' },
  'ישכח': { male: 'ישכח', female: 'תשכח', plural: 'ישכחו' },
  'יפקח': { male: 'יפקח', female: 'תפקח', plural: 'יפקחו' },
  'יתקשר': { male: 'יתקשר', female: 'תתקשר', plural: 'יתקשרו' },
  'יפגוש': { male: 'יפגוש', female: 'תפגוש', plural: 'יפגשו' },
  'יתייצב': { male: 'יתייצב', female: 'תתייצב', plural: 'יתייצבו' },
  'ייצג': { male: 'ייצג', female: 'תייצג', plural: 'ייצגו' },
  'יטען': { male: 'יטען', female: 'תטען', plural: 'יטענו' },
  'יוכיח': { male: 'יוכיח', female: 'תוכיח', plural: 'יוכיחו' },
  'יחליט': { male: 'יחליט', female: 'תחליט', plural: 'יחליטו' },
  'יכבד': { male: 'יכבד', female: 'תכבד', plural: 'יכבדו' },
  'יסרב': { male: 'יסרב', female: 'תסרב', plural: 'יסרבו' },
  'ידרוש': { male: 'ידרוש', female: 'תדרוש', plural: 'ידרשו' },
  'ישקול': { male: 'ישקול', female: 'תשקול', plural: 'ישקלו' },
  'ישתף': { male: 'ישתף', female: 'תשתף', plural: 'ישתפו' },
  'ימשיך': { male: 'ימשיך', female: 'תמשיך', plural: 'ימשיכו' },
  'יפסיק': { male: 'יפסיק', female: 'תפסיק', plural: 'יפסיקו' },
  'יאפשר': { male: 'יאפשר', female: 'תאפשר', plural: 'יאפשרו' },
  'יגן': { male: 'יגן', female: 'תגן', plural: 'יגנו' },
  'ישמר': { male: 'ישמר', female: 'תשמר', plural: 'ישמרו' },
  'יקפיד': { male: 'יקפיד', female: 'תקפיד', plural: 'יקפידו' },
  'יעדיף': { male: 'יעדיף', female: 'תעדיף', plural: 'יעדיפו' },
  'יתנגד': { male: 'יתנגד', female: 'תתנגד', plural: 'יתנגדו' },
  'יקבע': { male: 'יקבע', female: 'תקבע', plural: 'יקבעו' },
  'יורה': { male: 'יורה', female: 'תורה', plural: 'יורו' },
  'ינחה': { male: 'ינחה', female: 'תנחה', plural: 'ינחו' },
  'יחפוץ': { male: 'יחפוץ', female: 'תחפוץ', plural: 'יחפצו' },
  
  // כינויי שייכות - רכוש ומשפחה
  'רכושו': { male: 'רכושו', female: 'רכושה', plural: 'רכושם' },
  'ביתו': { male: 'ביתו', female: 'ביתה', plural: 'ביתם' },
  'כספו': { male: 'כספו', female: 'כספה', plural: 'כספם' },
  'חייו': { male: 'חייו', female: 'חייה', plural: 'חייהם' },
  'שמו': { male: 'שמו', female: 'שמה', plural: 'שמם' },
  'כתובתו': { male: 'כתובתו', female: 'כתובתה', plural: 'כתובתם' },
  'חתימתו': { male: 'חתימתו', female: 'חתימתה', plural: 'חתימתם' },
  'הסכמתו': { male: 'הסכמתו', female: 'הסכמתה', plural: 'הסכמתם' },
  'זכותו': { male: 'זכותו', female: 'זכותה', plural: 'זכותם' },
  'חובתו': { male: 'חובתו', female: 'חובתה', plural: 'חובתם' },
  'רצונו': { male: 'רצונו', female: 'רצונה', plural: 'רצונם' },
  'טובתו': { male: 'טובתו', female: 'טובתה', plural: 'טובתם' },
  'בריאותו': { male: 'בריאותו', female: 'בריאותה', plural: 'בריאותם' },
  'עסקיו': { male: 'עסקיו', female: 'עסקיה', plural: 'עסקיהם' },
  'נכסיו': { male: 'נכסיו', female: 'נכסיה', plural: 'נכסיהם' },
  'מסמכיו': { male: 'מסמכיו', female: 'מסמכיה', plural: 'מסמכיהם' },
  'חשבונו': { male: 'חשבונו', female: 'חשבונה', plural: 'חשבונם' },
  'אחריותו': { male: 'אחריותו', female: 'אחריותה', plural: 'אחריותם' },
  'התחייבותו': { male: 'התחייבותו', female: 'התחייבותה', plural: 'התחייבותם' },
  'זהותו': { male: 'זהותו', female: 'זהותה', plural: 'זהותם' },
  'מקומו': { male: 'מקומו', female: 'מקומה', plural: 'מקומם' },
  'תפקידו': { male: 'תפקידו', female: 'תפקידה', plural: 'תפקידם' },
  'משפחתו': { male: 'משפחתו', female: 'משפחתה', plural: 'משפחתם' },
  'הוריו': { male: 'הוריו', female: 'הוריה', plural: 'הוריהם' },
  'בתו': { male: 'בתו', female: 'בתה', plural: 'בתם' },
  'גופו': { male: 'גופו', female: 'גופה', plural: 'גופם' },
  'ראשו': { male: 'ראשו', female: 'ראשה', plural: 'ראשם' },
  'ידו': { male: 'ידו', female: 'ידה', plural: 'ידם' },
  'עינו': { male: 'עינו', female: 'עינה', plural: 'עינם' },
  
  // פעלי עבר
  'מסר': { male: 'מסר', female: 'מסרה', plural: 'מסרו' },
  'התחייב': { male: 'התחייב', female: 'התחייבה', plural: 'התחייבו' },
  'שילם': { male: 'שילם', female: 'שילמה', plural: 'שילמו' },
  'אישר': { male: 'אישר', female: 'אישרה', plural: 'אישרו' },
  'ויתר': { male: 'ויתר', female: 'ויתרה', plural: 'ויתרו' },
  'הודה': { male: 'הודה', female: 'הודתה', plural: 'הודו' },
  'הכיר': { male: 'הכיר', female: 'הכירה', plural: 'הכירו' },
  'רצה': { male: 'רצה', female: 'רצתה', plural: 'רצו' },
  'יכל': { male: 'יכל', female: 'יכלה', plural: 'יכלו' },
  'היה': { male: 'היה', female: 'הייתה', plural: 'היו' },
  'לקח': { male: 'לקח', female: 'לקחה', plural: 'לקחו' },
  'בא': { male: 'בא', female: 'באה', plural: 'באו' },
  'הלך': { male: 'הלך', female: 'הלכה', plural: 'הלכו' },
  'ראה': { male: 'ראה', female: 'ראתה', plural: 'ראו' },
  'שמע': { male: 'שמע', female: 'שמעה', plural: 'שמעו' },
  'נולד': { male: 'נולד', female: 'נולדה', plural: 'נולדו' },
  'בחר': { male: 'בחר', female: 'בחרה', plural: 'בחרו' },
  
  // תארי הווה
  'מסכים': { male: 'מסכים', female: 'מסכימה', plural: 'מסכימים' },
  'חותם': { male: 'חותם', female: 'חותמת', plural: 'חותמים' },
  'מוסר': { male: 'מוסר', female: 'מוסרת', plural: 'מוסרים' },
  'מצהיר': { male: 'מצהיר', female: 'מצהירה', plural: 'מצהירים' },
  'מתחייב': { male: 'מתחייב', female: 'מתחייבת', plural: 'מתחייבים' },
  'משלם': { male: 'משלם', female: 'משלמת', plural: 'משלמים' },
  'מאשר': { male: 'מאשר', female: 'מאשרת', plural: 'מאשרים' },
  'מבקש': { male: 'מבקש', female: 'מבקשת', plural: 'מבקשים' },
  'מוותר': { male: 'מוותר', female: 'מוותרת', plural: 'מוותרים' },
  'מודה': { male: 'מודה', female: 'מודה', plural: 'מודים' },
  'מכיר': { male: 'מכיר', female: 'מכירה', plural: 'מכירים' },
  'יודע': { male: 'יודע', female: 'יודעת', plural: 'יודעים' },
  'צריך': { male: 'צריך', female: 'צריכה', plural: 'צריכים' },
  'מוכן': { male: 'מוכן', female: 'מוכנה', plural: 'מוכנים' },
  'מעוניין': { male: 'מעוניין', female: 'מעוניינת', plural: 'מעוניינים' },
  'נמצא': { male: 'נמצא', female: 'נמצאת', plural: 'נמצאים' },
  'עומד': { male: 'עומד', female: 'עומדת', plural: 'עומדים' },
  'פועל': { male: 'פועל', female: 'פועלת', plural: 'פועלים' },
  'גר': { male: 'גר', female: 'גרה', plural: 'גרים' },
  'עובד': { male: 'עובד', female: 'עובדת', plural: 'עובדים' },
  
  // כינויי גוף וזיקה
  'הוא': { male: 'הוא', female: 'היא', plural: 'הם' },
  'אליו': { male: 'אליו', female: 'אליה', plural: 'אליהם' },
  'בו': { male: 'בו', female: 'בה', plural: 'בהם' },
  'לבדו': { male: 'לבדו', female: 'לבדה', plural: 'לבדם' },
  'החתום': { male: 'החתום', female: 'החתומה', plural: 'החתומים' },
  'המוסמך': { male: 'המוסמך', female: 'המוסמכת', plural: 'המוסמכים' },
  'הרשום': { male: 'הרשום', female: 'הרשומה', plural: 'הרשומים' },
  'המפורט': { male: 'המפורט', female: 'המפורטת', plural: 'המפורטים' },
  
  // מונחים רפואיים
  'חולה': { male: 'חולה', female: 'חולה', plural: 'חולים' },
  'סובל': { male: 'סובל', female: 'סובלת', plural: 'סובלים' },
  'מאושפז': { male: 'מאושפז', female: 'מאושפזת', plural: 'מאושפזים' },
  'מטופל': { male: 'מטופל', female: 'מטופלת', plural: 'מטופלים' },
  'מורדם': { male: 'מורדם', female: 'מורדמת', plural: 'מורדמים' },
  'מונשם': { male: 'מונשם', female: 'מונשמת', plural: 'מונשמים' },
  'מחובר': { male: 'מחובר', female: 'מחוברת', plural: 'מחוברים' },
  'מודע': { male: 'מודע', female: 'מודעת', plural: 'מודעים' },
  'צלול': { male: 'צלול', female: 'צלולה', plural: 'צלולים' },
  'מבולבל': { male: 'מבולבל', female: 'מבולבלת', plural: 'מבולבלים' },
  'סיעודי': { male: 'סיעודי', female: 'סיעודית', plural: 'סיעודיים' },
  'תלוי': { male: 'תלוי', female: 'תלויה', plural: 'תלויים' },
  'זקוק': { male: 'זקוק', female: 'זקוקה', plural: 'זקוקים' },
  'גוסס': { male: 'גוסס', female: 'גוססת', plural: 'גוססים' },
  'שוכב': { male: 'שוכב', female: 'שוכבת', plural: 'שוכבים' },
  'יושב': { male: 'יושב', female: 'יושבת', plural: 'יושבים' },
  'מתהלך': { male: 'מתהלך', female: 'מתהלכת', plural: 'מתהלכים' },
  'מרותק': { male: 'מרותק', female: 'מרותקת', plural: 'מרותקים' },
  'משותק': { male: 'משותק', female: 'משותקת', plural: 'משותקים' },
  'נשכח': { male: 'נשכח', female: 'נשכחת', plural: 'נשכחים' },
  'כשיר': { male: 'כשיר', female: 'כשירה', plural: 'כשירים' },
  'מבין': { male: 'מבין', female: 'מבינה', plural: 'מבינים' },
  'שפוי': { male: 'שפוי', female: 'שפויה', plural: 'שפויים' },
  'חסוי': { male: 'חסוי', female: 'חסויה', plural: 'חסויים' },
  'מוגבל': { male: 'מוגבל', female: 'מוגבלת', plural: 'מוגבלים' },
  'עצמאי': { male: 'עצמאי', female: 'עצמאית', plural: 'עצמאיים' },
  'נזקק': { male: 'נזקק', female: 'נזקקת', plural: 'נזקקים' },
  
  // כינויי שייכות רפואיים
  'מצבו': { male: 'מצבו', female: 'מצבה', plural: 'מצבם' },
  'רוחו': { male: 'רוחו', female: 'רוחה', plural: 'רוחם' },
  'מותו': { male: 'מותו', female: 'מותה', plural: 'מותם' },
  'סבלו': { male: 'סבלו', female: 'סבלה', plural: 'סבלם' },
  'כאבו': { male: 'כאבו', female: 'כאבה', plural: 'כאבם' },
  'הכרתו': { male: 'הכרתו', female: 'הכרתה', plural: 'הכרתם' },
  'צלילותו': { male: 'צלילותו', female: 'צלילותה', plural: 'צלילותם' },
  'כשירותו': { male: 'כשירותו', female: 'כשירותה', plural: 'כשירותם' },
  'כבודו': { male: 'כבודו', female: 'כבודה', plural: 'כבודם' },
  'פרטיותו': { male: 'פרטיותו', female: 'פרטיותה', plural: 'פרטיותם' },
  'צנעתו': { male: 'צנעתו', female: 'צנעתה', plural: 'צנעתם' },
  'העדפותיו': { male: 'העדפותיו', female: 'העדפותיה', plural: 'העדפותיהם' },
  'ערכיו': { male: 'ערכיו', female: 'ערכיה', plural: 'ערכיהם' },
  'אמונותיו': { male: 'אמונותיו', female: 'אמונותיה', plural: 'אמונותיהם' },
  'השקפותיו': { male: 'השקפותיו', female: 'השקפותיה', plural: 'השקפותיהם' },
  'דתו': { male: 'דתו', female: 'דתה', plural: 'דתם' },
  'מסורתו': { male: 'מסורתו', female: 'מסורתה', plural: 'מסורתם' },
  'הרגליו': { male: 'הרגליו', female: 'הרגליה', plural: 'הרגליהם' },
  'שגרתו': { male: 'שגרתו', female: 'שגרתה', plural: 'שגרתם' },
  'אחיו': { male: 'אחיו', female: 'אחיה', plural: 'אחיהם' },
  'נכדיו': { male: 'נכדיו', female: 'נכדיה', plural: 'נכדיהם' },
  'קרוביו': { male: 'קרוביו', female: 'קרוביה', plural: 'קרוביהם' },
  'יורשיו': { male: 'יורשיו', female: 'יורשיה', plural: 'יורשיהם' },
  'מקורביו': { male: 'מקורביו', female: 'מקורביה', plural: 'מקורביהם' },
  'חסכונותיו': { male: 'חסכונותיו', female: 'חסכונותיה', plural: 'חסכונותיהם' },
  'הכנסותיו': { male: 'הכנסותיו', female: 'הכנסותיה', plural: 'הכנסותיהם' },
  'הוצאותיו': { male: 'הוצאותיו', female: 'הוצאותיה', plural: 'הוצאותיהם' },
  'חובותיו': { male: 'חובותיו', female: 'חובותיה', plural: 'חובותיהם' },
  'זכויותיו': { male: 'זכויותיו', female: 'זכויותיה', plural: 'זכויותיהם' },
  'דירתו': { male: 'דירתו', female: 'דירתה', plural: 'דירתם' },
  'רכבו': { male: 'רכבו', female: 'רכבה', plural: 'רכבם' },
  'טיפולו': { male: 'טיפולו', female: 'טיפולה', plural: 'טיפולם' },
  'מגוריו': { male: 'מגוריו', female: 'מגוריה', plural: 'מגוריהם' },
  'סביבתו': { male: 'סביבתו', female: 'סביבתה', plural: 'סביבתם' },
  'מטפלו': { male: 'מטפלו', female: 'מטפלה', plural: 'מטפלם' },
  'רופאו': { male: 'רופאו', female: 'רופאה', plural: 'רופאם' },
  'אשפוזו': { male: 'אשפוזו', female: 'אשפוזה', plural: 'אשפוזם' },
  'שיקומו': { male: 'שיקומו', female: 'שיקומה', plural: 'שיקומם' },
  'בעניינו': { male: 'בעניינו', female: 'בעניינה', plural: 'בעניינם' },
  'בשמו': { male: 'בשמו', female: 'בשמה', plural: 'בשמם' },
  'עבורו': { male: 'עבורו', female: 'עבורה', plural: 'עבורם' },
  'במקומו': { male: 'במקומו', female: 'במקומה', plural: 'במקומם' },
  
  // המטופל/החולה/הנזקק
  'המטופל': { male: 'המטופל', female: 'המטופלת', plural: 'המטופלים' },
  'החולה': { male: 'החולה', female: 'החולה', plural: 'החולים' },
  'הנזקק': { male: 'הנזקק', female: 'הנזקקת', plural: 'הנזקקים' },
  'האדם': { male: 'האדם', female: 'האישה', plural: 'האנשים' },
  
  // פעלים רפואיים סביליים
  'יונשם': { male: 'יונשם', female: 'תונשם', plural: 'יונשמו' },
  'יוזן': { male: 'יוזן', female: 'תוזן', plural: 'יוזנו' },
  'יושהה': { male: 'יושהה', female: 'תושהה', plural: 'יושהו' },
  'יחובר': { male: 'יחובר', female: 'תחובר', plural: 'יחוברו' },
  'ינותק': { male: 'ינותק', female: 'תנותק', plural: 'ינותקו' },
  'יטופל': { male: 'יטופל', female: 'תטופל', plural: 'יטופלו' },
  'ישוקם': { male: 'ישוקם', female: 'תשוקם', plural: 'ישוקמו' },
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
    result = result.replace(/ייגע\/תיגע/g, 'ייגע'); // ייגע/תיגע → ייגע
    result = result.replace(/יחרוג\/תחרוג/g, 'יחרוג'); // יחרוג/תחרוג → יחרוג
    result = result.replace(/יפעל\/תפעל/g, 'יפעל'); // יפעל/תפעל → יפעל
    result = result.replace(/יטפל\/תטפל/g, 'יטפל'); // יטפל/תטפל → יטפל
    result = result.replace(/יבדוק\/תבדוק/g, 'יבדוק'); // יבדוק/תבדוק → יבדוק
    result = result.replace(/ידאג\/תדאג/g, 'ידאג'); // ידאג/תדאג → ידאג
    result = result.replace(/יוודא\/תוודא/g, 'יוודא'); // יוודא/תוודא → יוודא
    result = result.replace(/יתקין\/תתקין/g, 'יתקין'); // יתקין/תתקין → יתקין
    result = result.replace(/יפקח\/תפקח/g, 'יפקח'); // יפקח/תפקח → יפקח
    result = result.replace(/יוצא\/ת/g, 'יוצא'); // יוצא/ת → יוצא
    result = result.replace(/עליו\/ה/g, 'עליו'); // עליו/ה → עליו
    result = result.replace(/מרצונו\/ה/g, 'מרצונו'); // מרצונו/ה → מרצונו
    result = result.replace(/מגוריו\/ה/g, 'מגוריו'); // מגוריו/ה → מגוריו
    result = result.replace(/חייו\/ה/g, 'חייו'); // חייו/ה → חייו
    result = result.replace(/הוא\/היא/g, 'הוא'); // הוא/היא → הוא
    
    // פעלים נוספים - ייפוי כוח
    result = result.replace(/יעדכן\/תעדכן/g, 'יעדכן'); // יעדכן/תעדכן → יעדכן
    result = result.replace(/ימנע\/תמנע/g, 'ימנע'); // ימנע/תמנע → ימנע
    result = result.replace(/ייקח\/תיקח/g, 'ייקח'); // ייקח/תיקח → ייקח
    result = result.replace(/יציע\/תציע/g, 'יציע'); // יציע/תציע → יציע
    result = result.replace(/ינסה\/תנסה/g, 'ינסה'); // ינסה/תנסה → ינסה
    result = result.replace(/יתעד\/תתעד/g, 'יתעד'); // יתעד/תתעד → יתעד
    result = result.replace(/ינהל\/תנהל/g, 'ינהל'); // ינהל/תנהל → ינהל
    result = result.replace(/יתייעץ\/תתייעץ/g, 'יתייעץ'); // יתייעץ/תתייעץ → יתייעץ
    result = result.replace(/יעקוב\/תעקוב/g, 'יעקוב'); // יעקוב/תעקוב → יעקוב
    
    // כינויי שייכות נוספים
    result = result.replace(/לטובתו\/ה/g, 'לטובתו'); // לטובתו/ה → לטובתו
    result = result.replace(/דעתו\/ה/g, 'דעתו'); // דעתו/ה → דעתו
    result = result.replace(/אינו\/ה/g, 'אינו'); // אינו/ה → אינו
    
    // פעלים נוספים - המשך
    result = result.replace(/יפנה\/תפנה/g, 'יפנה'); // יפנה/תפנה → יפנה
    result = result.replace(/יעשה\/תעשה/g, 'יעשה'); // יעשה/תעשה → יעשה
    result = result.replace(/יפדה\/תפדה/g, 'יפדה'); // יפדה/תפדה → יפדה
    result = result.replace(/ימשוך\/תמשוך/g, 'ימשוך'); // ימשוך/תמשוך → ימשוך
    result = result.replace(/יעביר\/תעביר/g, 'יעביר'); // יעביר/תעביר → יעביר
    result = result.replace(/עצמו\/ה/g, 'עצמו'); // עצמו/ה → עצמו
    result = result.replace(/שלו\/ה/g, 'שלו'); // שלו/ה → שלו
    result = result.replace(/מכיסו\/ה/g, 'מכיסו'); // מכיסו/ה → מכיסו
    result = result.replace(/הוציא\/ה/g, 'הוציא'); // הוציא/ה → הוציא
    result = result.replace(/ידווח\/תדווח/g, 'ידווח'); // ידווח/תדווח → ידווח
    result = result.replace(/ישתתף\/תשתתף/g, 'ישתתף'); // ישתתף/תשתתף → ישתתף
    result = result.replace(/יכין\/תכין/g, 'יכין'); // יכין/תכין → יכין
    result = result.replace(/יחדש\/תחדש/g, 'יחדש'); // יחדש/תחדש → יחדש
    result = result.replace(/יתאם\/תתאם/g, 'יתאם'); // יתאם/תתאם → יתאם
    result = result.replace(/יחזור\/תחזור/g, 'יחזור'); // יחזור/תחזור → יחזור
    result = result.replace(/יסדיר\/תסדיר/g, 'יסדיר'); // יסדיר/תסדיר → יסדיר
    result = result.replace(/ישתדל\/תשתדל/g, 'ישתדל'); // ישתדל/תשתדל → ישתדל
    result = result.replace(/יכולתו\/ה/g, 'יכולתו'); // יכולתו/ה → יכולתו
    result = result.replace(/נפשו\/ה/g, 'נפשו'); // נפשו/ה → נפשו
    result = result.replace(/ילדיו\/ה/g, 'ילדיו'); // ילדיו/ה → ילדיו
    
    // פעלים נוספים - סדרה מורחבת
    result = result.replace(/יקבל\/תקבל/g, 'יקבל');
    result = result.replace(/ישלם\/תשלם/g, 'ישלם');
    result = result.replace(/יחתום\/תחתום/g, 'יחתום');
    result = result.replace(/יבקש\/תבקש/g, 'יבקש');
    result = result.replace(/ימסור\/תמסור/g, 'ימסור');
    result = result.replace(/יודיע\/תודיע/g, 'יודיע');
    result = result.replace(/יאשר\/תאשר/g, 'יאשר');
    result = result.replace(/יתחייב\/תתחייב/g, 'יתחייב');
    result = result.replace(/יסכים\/תסכים/g, 'יסכים');
    result = result.replace(/יקיים\/תקיים/g, 'יקיים');
    result = result.replace(/ישלח\/תשלח/g, 'ישלח');
    result = result.replace(/יגיש\/תגיש/g, 'יגיש');
    result = result.replace(/ימלא\/תמלא/g, 'ימלא');
    result = result.replace(/יספק\/תספק/g, 'יספק');
    result = result.replace(/יפקיד\/תפקיד/g, 'יפקיד');
    result = result.replace(/ימנה\/תמנה/g, 'ימנה');
    result = result.replace(/יפרט\/תפרט/g, 'יפרט');
    result = result.replace(/יציג\/תציג/g, 'יציג');
    result = result.replace(/יבחר\/תבחר/g, 'יבחר');
    result = result.replace(/יקרא\/תקרא/g, 'יקרא');
    result = result.replace(/יכתוב\/תכתוב/g, 'יכתוב');
    result = result.replace(/יחשב\/תחשב/g, 'יחשב');
    result = result.replace(/יעזור\/תעזור/g, 'יעזור');
    result = result.replace(/ילמד\/תלמד/g, 'ילמד');
    result = result.replace(/יזכור\/תזכור/g, 'יזכור');
    result = result.replace(/ישכח\/תשכח/g, 'ישכח');
    result = result.replace(/יתקשר\/תתקשר/g, 'יתקשר');
    result = result.replace(/יפגוש\/תפגוש/g, 'יפגוש');
    result = result.replace(/יתייצב\/תתייצב/g, 'יתייצב');
    result = result.replace(/ייצג\/תייצג/g, 'ייצג');
    result = result.replace(/יטען\/תטען/g, 'יטען');
    result = result.replace(/יוכיח\/תוכיח/g, 'יוכיח');
    result = result.replace(/יכבד\/תכבד/g, 'יכבד');
    result = result.replace(/יסרב\/תסרב/g, 'יסרב');
    result = result.replace(/ידרוש\/תדרוש/g, 'ידרוש');
    result = result.replace(/ישקול\/תשקול/g, 'ישקול');
    result = result.replace(/ישתף\/תשתף/g, 'ישתף');
    result = result.replace(/ימשיך\/תמשיך/g, 'ימשיך');
    result = result.replace(/יפסיק\/תפסיק/g, 'יפסיק');
    result = result.replace(/יאפשר\/תאפשר/g, 'יאפשר');
    result = result.replace(/יגן\/תגן/g, 'יגן');
    result = result.replace(/ישמר\/תשמר/g, 'ישמר');
    result = result.replace(/יעדיף\/תעדיף/g, 'יעדיף');
    result = result.replace(/יתנגד\/תתנגד/g, 'יתנגד');
    result = result.replace(/יקבע\/תקבע/g, 'יקבע');
    result = result.replace(/יורה\/תורה/g, 'יורה');
    result = result.replace(/ינחה\/תנחה/g, 'ינחה');
    result = result.replace(/יחפוץ\/תחפוץ/g, 'יחפוץ');
    
    // כינויי שייכות נוספים
    result = result.replace(/רכושו\/ה/g, 'רכושו');
    result = result.replace(/ביתו\/ה/g, 'ביתו');
    result = result.replace(/כספו\/ה/g, 'כספו');
    result = result.replace(/שמו\/ה/g, 'שמו');
    result = result.replace(/כתובתו\/ה/g, 'כתובתו');
    result = result.replace(/חתימתו\/ה/g, 'חתימתו');
    result = result.replace(/הסכמתו\/ה/g, 'הסכמתו');
    result = result.replace(/זכותו\/ה/g, 'זכותו');
    result = result.replace(/חובתו\/ה/g, 'חובתו');
    result = result.replace(/רצונו\/ה/g, 'רצונו');
    result = result.replace(/טובתו\/ה/g, 'טובתו');
    result = result.replace(/בריאותו\/ה/g, 'בריאותו');
    result = result.replace(/עסקיו\/ה/g, 'עסקיו');
    result = result.replace(/נכסיו\/ה/g, 'נכסיו');
    result = result.replace(/מסמכיו\/ה/g, 'מסמכיו');
    result = result.replace(/חשבונו\/ה/g, 'חשבונו');
    result = result.replace(/אחריותו\/ה/g, 'אחריותו');
    result = result.replace(/התחייבותו\/ה/g, 'התחייבותו');
    result = result.replace(/זהותו\/ה/g, 'זהותו');
    result = result.replace(/מקומו\/ה/g, 'מקומו');
    result = result.replace(/תפקידו\/ה/g, 'תפקידו');
    result = result.replace(/משפחתו\/ה/g, 'משפחתו');
    result = result.replace(/הוריו\/ה/g, 'הוריו');
    result = result.replace(/בנו\/ה/g, 'בנו');
    result = result.replace(/בתו\/ה/g, 'בתו');
    result = result.replace(/גופו\/ה/g, 'גופו');
    result = result.replace(/ראשו\/ה/g, 'ראשו');
    result = result.replace(/ידו\/ה/g, 'ידו');
    result = result.replace(/מצבו\/ה/g, 'מצבו');
    result = result.replace(/רוחו\/ה/g, 'רוחו');
    result = result.replace(/מותו\/ה/g, 'מותו');
    result = result.replace(/סבלו\/ה/g, 'סבלו');
    result = result.replace(/כאבו\/ה/g, 'כאבו');
    result = result.replace(/הכרתו\/ה/g, 'הכרתו');
    result = result.replace(/צלילותו\/ה/g, 'צלילותו');
    result = result.replace(/כשירותו\/ה/g, 'כשירותו');
    result = result.replace(/כבודו\/ה/g, 'כבודו');
    result = result.replace(/פרטיותו\/ה/g, 'פרטיותו');
    result = result.replace(/צנעתו\/ה/g, 'צנעתו');
    result = result.replace(/דתו\/ה/g, 'דתו');
    result = result.replace(/מסורתו\/ה/g, 'מסורתו');
    result = result.replace(/שגרתו\/ה/g, 'שגרתו');
    result = result.replace(/אחיו\/ה/g, 'אחיו');
    result = result.replace(/נכדיו\/ה/g, 'נכדיו');
    result = result.replace(/דירתו\/ה/g, 'דירתו');
    result = result.replace(/רכבו\/ה/g, 'רכבו');
    result = result.replace(/טיפולו\/ה/g, 'טיפולו');
    result = result.replace(/סביבתו\/ה/g, 'סביבתו');
    result = result.replace(/מטפלו\/ה/g, 'מטפלו');
    result = result.replace(/רופאו\/ה/g, 'רופאו');
    result = result.replace(/אשפוזו\/ה/g, 'אשפוזו');
    result = result.replace(/שיקומו\/ה/g, 'שיקומו');
    result = result.replace(/בעניינו\/ה/g, 'בעניינו');
    result = result.replace(/בשמו\/ה/g, 'בשמו');
    result = result.replace(/עבורו\/ה/g, 'עבורו');
    result = result.replace(/במקומו\/ה/g, 'במקומו');
    
    // פעלים רפואיים
    result = result.replace(/יונשם\/תונשם/g, 'יונשם');
    result = result.replace(/יוזן\/תוזן/g, 'יוזן');
    result = result.replace(/יושהה\/תושהה/g, 'יושהה');
    result = result.replace(/יחובר\/תחובר/g, 'יחובר');
    result = result.replace(/ינותק\/תנותק/g, 'ינותק');
    result = result.replace(/יטופל\/תטופל/g, 'יטופל');
    result = result.replace(/ישוקם\/תשוקם/g, 'ישוקם');
    
    // תארים נוספים
    result = result.replace(/חולה\/ה/g, 'חולה');
    result = result.replace(/סובל\/ת/g, 'סובל');
    result = result.replace(/מאושפז\/ת/g, 'מאושפז');
    result = result.replace(/מטופל\/ת/g, 'מטופל');
    result = result.replace(/מורדם\/ת/g, 'מורדם');
    result = result.replace(/מונשם\/ת/g, 'מונשם');
    result = result.replace(/מחובר\/ת/g, 'מחובר');
    result = result.replace(/מודע\/ת/g, 'מודע');
    result = result.replace(/צלול\/ה/g, 'צלול');
    result = result.replace(/מבולבל\/ת/g, 'מבולבל');
    result = result.replace(/סיעודי\/ת/g, 'סיעודי');
    result = result.replace(/תלוי\/ה/g, 'תלוי');
    result = result.replace(/זקוק\/ה/g, 'זקוק');
    result = result.replace(/גוסס\/ת/g, 'גוסס');
    result = result.replace(/שוכב\/ת/g, 'שוכב');
    result = result.replace(/יושב\/ת/g, 'יושב');
    result = result.replace(/מתהלך\/ת/g, 'מתהלך');
    result = result.replace(/מרותק\/ת/g, 'מרותק');
    result = result.replace(/משותק\/ת/g, 'משותק');
    result = result.replace(/כשיר\/ה/g, 'כשיר');
    result = result.replace(/מבין\/ה/g, 'מבין');
    result = result.replace(/שפוי\/ה/g, 'שפוי');
    result = result.replace(/חסוי\/ה/g, 'חסוי');
    result = result.replace(/מוגבל\/ת/g, 'מוגבל');
    result = result.replace(/עצמאי\/ת/g, 'עצמאי');
    result = result.replace(/נזקק\/ת/g, 'נזקק');
    
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
    result = result.replace(/ייגע\/תיגע/g, 'תיגע'); // ייגע/תיגע → תיגע
    result = result.replace(/יחרוג\/תחרוג/g, 'תחרוג'); // יחרוג/תחרוג → תחרוג
    result = result.replace(/יפעל\/תפעל/g, 'תפעל'); // יפעל/תפעל → תפעל
    result = result.replace(/יטפל\/תטפל/g, 'תטפל'); // יטפל/תטפל → תטפל
    result = result.replace(/יבדוק\/תבדוק/g, 'תבדוק'); // יבדוק/תבדוק → תבדוק
    result = result.replace(/ידאג\/תדאג/g, 'תדאג'); // ידאג/תדאג → תדאג
    result = result.replace(/יוודא\/תוודא/g, 'תוודא'); // יוודא/תוודא → תוודא
    result = result.replace(/יתקין\/תתקין/g, 'תתקין'); // יתקין/תתקין → תתקין
    result = result.replace(/יפקח\/תפקח/g, 'תפקח'); // יפקח/תפקח → תפקח
    result = result.replace(/יוצא\/ת/g, 'יוצאת'); // יוצא/ת → יוצאת
    result = result.replace(/עליו\/ה/g, 'עליה'); // עליו/ה → עליה
    result = result.replace(/מרצונו\/ה/g, 'מרצונה'); // מרצונו/ה → מרצונה
    result = result.replace(/מגוריו\/ה/g, 'מגוריה'); // מגוריו/ה → מגוריה
    result = result.replace(/חייו\/ה/g, 'חייה'); // חייו/ה → חייה
    result = result.replace(/הוא\/היא/g, 'היא'); // הוא/היא → היא
    
    // פעלים נוספים - ייפוי כוח
    result = result.replace(/יעדכן\/תעדכן/g, 'תעדכן'); // יעדכן/תעדכן → תעדכן
    result = result.replace(/ימנע\/תמנע/g, 'תמנע'); // ימנע/תמנע → תמנע
    result = result.replace(/ייקח\/תיקח/g, 'תיקח'); // ייקח/תיקח → תיקח
    result = result.replace(/יציע\/תציע/g, 'תציע'); // יציע/תציע → תציע
    result = result.replace(/ינסה\/תנסה/g, 'תנסה'); // ינסה/תנסה → תנסה
    result = result.replace(/יתעד\/תתעד/g, 'תתעד'); // יתעד/תתעד → תתעד
    result = result.replace(/ינהל\/תנהל/g, 'תנהל'); // ינהל/תנהל → תנהל
    result = result.replace(/יתייעץ\/תתייעץ/g, 'תתייעץ'); // יתייעץ/תתייעץ → תתייעץ
    result = result.replace(/יעקוב\/תעקוב/g, 'תעקוב'); // יעקוב/תעקוב → תעקוב
    
    // כינויי שייכות נוספים
    result = result.replace(/לטובתו\/ה/g, 'לטובתה'); // לטובתו/ה → לטובתה
    result = result.replace(/דעתו\/ה/g, 'דעתה'); // דעתו/ה → דעתה
    result = result.replace(/אינו\/ה/g, 'אינה'); // אינו/ה → אינה
    
    // פעלים נוספים - המשך
    result = result.replace(/יפנה\/תפנה/g, 'תפנה'); // יפנה/תפנה → תפנה
    result = result.replace(/יעשה\/תעשה/g, 'תעשה'); // יעשה/תעשה → תעשה
    result = result.replace(/יפדה\/תפדה/g, 'תפדה'); // יפדה/תפדה → תפדה
    result = result.replace(/ימשוך\/תמשוך/g, 'תמשוך'); // ימשוך/תמשוך → תמשוך
    result = result.replace(/יעביר\/תעביר/g, 'תעביר'); // יעביר/תעביר → תעביר
    result = result.replace(/עצמו\/ה/g, 'עצמה'); // עצמו/ה → עצמה
    result = result.replace(/שלו\/ה/g, 'שלה'); // שלו/ה → שלה
    result = result.replace(/מכיסו\/ה/g, 'מכיסה'); // מכיסו/ה → מכיסה
    result = result.replace(/הוציא\/ה/g, 'הוציאה'); // הוציא/ה → הוציאה
    result = result.replace(/ידווח\/תדווח/g, 'תדווח'); // ידווח/תדווח → תדווח
    result = result.replace(/ישתתף\/תשתתף/g, 'תשתתף'); // ישתתף/תשתתף → תשתתף
    result = result.replace(/יכין\/תכין/g, 'תכין'); // יכין/תכין → תכין
    result = result.replace(/יחדש\/תחדש/g, 'תחדש'); // יחדש/תחדש → תחדש
    result = result.replace(/יתאם\/תתאם/g, 'תתאם'); // יתאם/תתאם → תתאם
    result = result.replace(/יחזור\/תחזור/g, 'תחזור'); // יחזור/תחזור → תחזור
    result = result.replace(/יסדיר\/תסדיר/g, 'תסדיר'); // יסדיר/תסדיר → תסדיר
    result = result.replace(/ישתדל\/תשתדל/g, 'תשתדל'); // ישתדל/תשתדל → תשתדל
    result = result.replace(/יכולתו\/ה/g, 'יכולתה'); // יכולתו/ה → יכולתה
    result = result.replace(/נפשו\/ה/g, 'נפשה'); // נפשו/ה → נפשה
    result = result.replace(/ילדיו\/ה/g, 'ילדיה'); // ילדיו/ה → ילדיה
    
    // פעלים נוספים - סדרה מורחבת
    result = result.replace(/יקבל\/תקבל/g, 'תקבל');
    result = result.replace(/ישלם\/תשלם/g, 'תשלם');
    result = result.replace(/יחתום\/תחתום/g, 'תחתום');
    result = result.replace(/יבקש\/תבקש/g, 'תבקש');
    result = result.replace(/ימסור\/תמסור/g, 'תמסור');
    result = result.replace(/יודיע\/תודיע/g, 'תודיע');
    result = result.replace(/יאשר\/תאשר/g, 'תאשר');
    result = result.replace(/יתחייב\/תתחייב/g, 'תתחייב');
    result = result.replace(/יסכים\/תסכים/g, 'תסכים');
    result = result.replace(/יקיים\/תקיים/g, 'תקיים');
    result = result.replace(/ישלח\/תשלח/g, 'תשלח');
    result = result.replace(/יגיש\/תגיש/g, 'תגיש');
    result = result.replace(/ימלא\/תמלא/g, 'תמלא');
    result = result.replace(/יספק\/תספק/g, 'תספק');
    result = result.replace(/יפקיד\/תפקיד/g, 'תפקיד');
    result = result.replace(/ימנה\/תמנה/g, 'תמנה');
    result = result.replace(/יפרט\/תפרט/g, 'תפרט');
    result = result.replace(/יציג\/תציג/g, 'תציג');
    result = result.replace(/יבחר\/תבחר/g, 'תבחר');
    result = result.replace(/יקרא\/תקרא/g, 'תקרא');
    result = result.replace(/יכתוב\/תכתוב/g, 'תכתוב');
    result = result.replace(/יחשב\/תחשב/g, 'תחשב');
    result = result.replace(/יעזור\/תעזור/g, 'תעזור');
    result = result.replace(/ילמד\/תלמד/g, 'תלמד');
    result = result.replace(/יזכור\/תזכור/g, 'תזכור');
    result = result.replace(/ישכח\/תשכח/g, 'תשכח');
    result = result.replace(/יתקשר\/תתקשר/g, 'תתקשר');
    result = result.replace(/יפגוש\/תפגוש/g, 'תפגוש');
    result = result.replace(/יתייצב\/תתייצב/g, 'תתייצב');
    result = result.replace(/ייצג\/תייצג/g, 'תייצג');
    result = result.replace(/יטען\/תטען/g, 'תטען');
    result = result.replace(/יוכיח\/תוכיח/g, 'תוכיח');
    result = result.replace(/יכבד\/תכבד/g, 'תכבד');
    result = result.replace(/יסרב\/תסרב/g, 'תסרב');
    result = result.replace(/ידרוש\/תדרוש/g, 'תדרוש');
    result = result.replace(/ישקול\/תשקול/g, 'תשקול');
    result = result.replace(/ישתף\/תשתף/g, 'תשתף');
    result = result.replace(/ימשיך\/תמשיך/g, 'תמשיך');
    result = result.replace(/יפסיק\/תפסיק/g, 'תפסיק');
    result = result.replace(/יאפשר\/תאפשר/g, 'תאפשר');
    result = result.replace(/יגן\/תגן/g, 'תגן');
    result = result.replace(/ישמר\/תשמר/g, 'תשמר');
    result = result.replace(/יעדיף\/תעדיף/g, 'תעדיף');
    result = result.replace(/יתנגד\/תתנגד/g, 'תתנגד');
    result = result.replace(/יקבע\/תקבע/g, 'תקבע');
    result = result.replace(/יורה\/תורה/g, 'תורה');
    result = result.replace(/ינחה\/תנחה/g, 'תנחה');
    result = result.replace(/יחפוץ\/תחפוץ/g, 'תחפוץ');
    
    // כינויי שייכות נוספים
    result = result.replace(/רכושו\/ה/g, 'רכושה');
    result = result.replace(/ביתו\/ה/g, 'ביתה');
    result = result.replace(/כספו\/ה/g, 'כספה');
    result = result.replace(/שמו\/ה/g, 'שמה');
    result = result.replace(/כתובתו\/ה/g, 'כתובתה');
    result = result.replace(/חתימתו\/ה/g, 'חתימתה');
    result = result.replace(/הסכמתו\/ה/g, 'הסכמתה');
    result = result.replace(/זכותו\/ה/g, 'זכותה');
    result = result.replace(/חובתו\/ה/g, 'חובתה');
    result = result.replace(/רצונו\/ה/g, 'רצונה');
    result = result.replace(/טובתו\/ה/g, 'טובתה');
    result = result.replace(/בריאותו\/ה/g, 'בריאותה');
    result = result.replace(/עסקיו\/ה/g, 'עסקיה');
    result = result.replace(/נכסיו\/ה/g, 'נכסיה');
    result = result.replace(/מסמכיו\/ה/g, 'מסמכיה');
    result = result.replace(/חשבונו\/ה/g, 'חשבונה');
    result = result.replace(/אחריותו\/ה/g, 'אחריותה');
    result = result.replace(/התחייבותו\/ה/g, 'התחייבותה');
    result = result.replace(/זהותו\/ה/g, 'זהותה');
    result = result.replace(/מקומו\/ה/g, 'מקומה');
    result = result.replace(/תפקידו\/ה/g, 'תפקידה');
    result = result.replace(/משפחתו\/ה/g, 'משפחתה');
    result = result.replace(/הוריו\/ה/g, 'הוריה');
    result = result.replace(/בנו\/ה/g, 'בנה');
    result = result.replace(/בתו\/ה/g, 'בתה');
    result = result.replace(/גופו\/ה/g, 'גופה');
    result = result.replace(/ראשו\/ה/g, 'ראשה');
    result = result.replace(/ידו\/ה/g, 'ידה');
    result = result.replace(/מצבו\/ה/g, 'מצבה');
    result = result.replace(/רוחו\/ה/g, 'רוחה');
    result = result.replace(/מותו\/ה/g, 'מותה');
    result = result.replace(/סבלו\/ה/g, 'סבלה');
    result = result.replace(/כאבו\/ה/g, 'כאבה');
    result = result.replace(/הכרתו\/ה/g, 'הכרתה');
    result = result.replace(/צלילותו\/ה/g, 'צלילותה');
    result = result.replace(/כשירותו\/ה/g, 'כשירותה');
    result = result.replace(/כבודו\/ה/g, 'כבודה');
    result = result.replace(/פרטיותו\/ה/g, 'פרטיותה');
    result = result.replace(/צנעתו\/ה/g, 'צנעתה');
    result = result.replace(/דתו\/ה/g, 'דתה');
    result = result.replace(/מסורתו\/ה/g, 'מסורתה');
    result = result.replace(/שגרתו\/ה/g, 'שגרתה');
    result = result.replace(/אחיו\/ה/g, 'אחיה');
    result = result.replace(/נכדיו\/ה/g, 'נכדיה');
    result = result.replace(/דירתו\/ה/g, 'דירתה');
    result = result.replace(/רכבו\/ה/g, 'רכבה');
    result = result.replace(/טיפולו\/ה/g, 'טיפולה');
    result = result.replace(/סביבתו\/ה/g, 'סביבתה');
    result = result.replace(/מטפלו\/ה/g, 'מטפלה');
    result = result.replace(/רופאו\/ה/g, 'רופאה');
    result = result.replace(/אשפוזו\/ה/g, 'אשפוזה');
    result = result.replace(/שיקומו\/ה/g, 'שיקומה');
    result = result.replace(/בעניינו\/ה/g, 'בעניינה');
    result = result.replace(/בשמו\/ה/g, 'בשמה');
    result = result.replace(/עבורו\/ה/g, 'עבורה');
    result = result.replace(/במקומו\/ה/g, 'במקומה');
    
    // פעלים רפואיים
    result = result.replace(/יונשם\/תונשם/g, 'תונשם');
    result = result.replace(/יוזן\/תוזן/g, 'תוזן');
    result = result.replace(/יושהה\/תושהה/g, 'תושהה');
    result = result.replace(/יחובר\/תחובר/g, 'תחובר');
    result = result.replace(/ינותק\/תנותק/g, 'תנותק');
    result = result.replace(/יטופל\/תטופל/g, 'תטופל');
    result = result.replace(/ישוקם\/תשוקם/g, 'תשוקם');
    
    // תארים נוספים
    result = result.replace(/חולה\/ה/g, 'חולה');
    result = result.replace(/סובל\/ת/g, 'סובלת');
    result = result.replace(/מאושפז\/ת/g, 'מאושפזת');
    result = result.replace(/מטופל\/ת/g, 'מטופלת');
    result = result.replace(/מורדם\/ת/g, 'מורדמת');
    result = result.replace(/מונשם\/ת/g, 'מונשמת');
    result = result.replace(/מחובר\/ת/g, 'מחוברת');
    result = result.replace(/מודע\/ת/g, 'מודעת');
    result = result.replace(/צלול\/ה/g, 'צלולה');
    result = result.replace(/מבולבל\/ת/g, 'מבולבלת');
    result = result.replace(/סיעודי\/ת/g, 'סיעודית');
    result = result.replace(/תלוי\/ה/g, 'תלויה');
    result = result.replace(/זקוק\/ה/g, 'זקוקה');
    result = result.replace(/גוסס\/ת/g, 'גוססת');
    result = result.replace(/שוכב\/ת/g, 'שוכבת');
    result = result.replace(/יושב\/ת/g, 'יושבת');
    result = result.replace(/מתהלך\/ת/g, 'מתהלכת');
    result = result.replace(/מרותק\/ת/g, 'מרותקת');
    result = result.replace(/משותק\/ת/g, 'משותקת');
    result = result.replace(/כשיר\/ה/g, 'כשירה');
    result = result.replace(/מבין\/ה/g, 'מבינה');
    result = result.replace(/שפוי\/ה/g, 'שפויה');
    result = result.replace(/חסוי\/ה/g, 'חסויה');
    result = result.replace(/מוגבל\/ת/g, 'מוגבלת');
    result = result.replace(/עצמאי\/ת/g, 'עצמאית');
    result = result.replace(/נזקק\/ת/g, 'נזקקת');
    
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
    result = result.replace(/ייגע\/תיגע/g, 'ייגעו'); // ייגע/תיגע → ייגעו
    result = result.replace(/יחרוג\/תחרוג/g, 'יחרגו'); // יחרוג/תחרוג → יחרגו
    result = result.replace(/יפעל\/תפעל/g, 'יפעלו'); // יפעל/תפעל → יפעלו
    result = result.replace(/יטפל\/תטפל/g, 'יטפלו'); // יטפל/תטפל → יטפלו
    result = result.replace(/יבדוק\/תבדוק/g, 'יבדקו'); // יבדוק/תבדוק → יבדקו
    result = result.replace(/ידאג\/תדאג/g, 'ידאגו'); // ידאג/תדאג → ידאגו
    result = result.replace(/יוודא\/תוודא/g, 'יוודאו'); // יוודא/תוודא → יוודאו
    result = result.replace(/יתקין\/תתקין/g, 'יתקינו'); // יתקין/תתקין → יתקינו
    result = result.replace(/יפקח\/תפקח/g, 'יפקחו'); // יפקח/תפקח → יפקחו
    result = result.replace(/יוצא\/ת/g, 'יוצאים'); // יוצא/ת → יוצאים
    result = result.replace(/עליו\/ה/g, 'עליהם'); // עליו/ה → עליהם
    result = result.replace(/מרצונו\/ה/g, 'מרצונם'); // מרצונו/ה → מרצונם
    result = result.replace(/מגוריו\/ה/g, 'מגוריהם'); // מגוריו/ה → מגוריהם
    result = result.replace(/חייו\/ה/g, 'חייהם'); // חייו/ה → חיייהם
    result = result.replace(/הוא\/היא/g, 'הם'); // הוא/היא → הם
    result = result.replace(/הוא יגיע\/תגיע/g, 'הם יגיעו'); // הוא יגיע/תגיע → הם יגיעו
    result = result.replace(/הוא יקבל\/תקבל/g, 'הם יקבלו'); // הוא יקבל/תקבל → הם יקבלו
    result = result.replace(/הוא יבחר\/תבחר/g, 'הם יבחרו'); // הוא יבחר/תבחר → הם יבחרו
    result = result.replace(/הוא ימנה\/תמנה/g, 'הם ימנו'); // הוא ימנה/תמנה → הם ימנו
    
    // פעלים נוספים - ייפוי כוח
    result = result.replace(/יעדכן\/תעדכן/g, 'יעדכנו'); // יעדכן/תעדכן → יעדכנו
    result = result.replace(/ימנע\/תמנע/g, 'ימנעו'); // ימנע/תמנע → ימנעו
    result = result.replace(/ייקח\/תיקח/g, 'ייקחו'); // ייקח/תיקח → ייקחו
    result = result.replace(/יציע\/תציע/g, 'יציעו'); // יציע/תציע → יציעו
    result = result.replace(/ינסה\/תנסה/g, 'ינסו'); // ינסה/תנסה → ינסו
    result = result.replace(/יתעד\/תתעד/g, 'יתעדו'); // יתעד/תתעד → יתעדו
    result = result.replace(/ינהל\/תנהל/g, 'ינהלו'); // ינהל/תנהל → ינהלו
    result = result.replace(/יתייעץ\/תתייעץ/g, 'יתייעצו'); // יתייעץ/תתייעץ → יתייעצו
    result = result.replace(/יעקוב\/תעקוב/g, 'יעקבו'); // יעקוב/תעקוב → יעקבו
    
    // כינויי שייכות נוספים
    result = result.replace(/לטובתו\/ה/g, 'לטובתם'); // לטובתו/ה → לטובתם
    result = result.replace(/דעתו\/ה/g, 'דעתם'); // דעתו/ה → דעתם
    result = result.replace(/אינו\/ה/g, 'אינם'); // אינו/ה → אינם
    
    // פעלים נוספים - המשך
    result = result.replace(/יפנה\/תפנה/g, 'יפנו'); // יפנה/תפנה → יפנו
    result = result.replace(/יעשה\/תעשה/g, 'יעשו'); // יעשה/תעשה → יעשו
    result = result.replace(/יפדה\/תפדה/g, 'יפדו'); // יפדה/תפדה → יפדו
    result = result.replace(/ימשוך\/תמשוך/g, 'ימשכו'); // ימשוך/תמשוך → ימשכו
    result = result.replace(/יעביר\/תעביר/g, 'יעבירו'); // יעביר/תעביר → יעבירו
    result = result.replace(/עצמו\/ה/g, 'עצמם'); // עצמו/ה → עצמם
    result = result.replace(/שלו\/ה/g, 'שלהם'); // שלו/ה → שלהם
    result = result.replace(/מכיסו\/ה/g, 'מכיסם'); // מכיסו/ה → מכיסם
    result = result.replace(/הוציא\/ה/g, 'הוציאו'); // הוציא/ה → הוציאו
    result = result.replace(/ידווח\/תדווח/g, 'ידווחו'); // ידווח/תדווח → ידווחו
    result = result.replace(/ישתתף\/תשתתף/g, 'ישתתפו'); // ישתתף/תשתתף → ישתתפו
    result = result.replace(/יכין\/תכין/g, 'יכינו'); // יכין/תכין → יכינו
    result = result.replace(/יחדש\/תחדש/g, 'יחדשו'); // יחדש/תחדש → יחדשו
    result = result.replace(/יתאם\/תתאם/g, 'יתאמו'); // יתאם/תתאם → יתאמו
    result = result.replace(/יחזור\/תחזור/g, 'יחזרו'); // יחזור/תחזור → יחזרו
    result = result.replace(/יסדיר\/תסדיר/g, 'יסדירו'); // יסדיר/תסדיר → יסדירו
    result = result.replace(/ישתדל\/תשתדל/g, 'ישתדלו'); // ישתדל/תשתדל → ישתדלו
    result = result.replace(/יכולתו\/ה/g, 'יכולתם'); // יכולתו/ה → יכולתם
    result = result.replace(/נפשו\/ה/g, 'נפשם'); // נפשו/ה → נפשם
    result = result.replace(/ילדיו\/ה/g, 'ילדיהם'); // ילדיו/ה → ילדיהם
    
    // פעלים נוספים - סדרה מורחבת
    result = result.replace(/יקבל\/תקבל/g, 'יקבלו');
    result = result.replace(/ישלם\/תשלם/g, 'ישלמו');
    result = result.replace(/יחתום\/תחתום/g, 'יחתמו');
    result = result.replace(/יבקש\/תבקש/g, 'יבקשו');
    result = result.replace(/ימסור\/תמסור/g, 'ימסרו');
    result = result.replace(/יודיע\/תודיע/g, 'יודיעו');
    result = result.replace(/יאשר\/תאשר/g, 'יאשרו');
    result = result.replace(/יתחייב\/תתחייב/g, 'יתחייבו');
    result = result.replace(/יסכים\/תסכים/g, 'יסכימו');
    result = result.replace(/יקיים\/תקיים/g, 'יקיימו');
    result = result.replace(/ישלח\/תשלח/g, 'ישלחו');
    result = result.replace(/יגיש\/תגיש/g, 'יגישו');
    result = result.replace(/ימלא\/תמלא/g, 'ימלאו');
    result = result.replace(/יספק\/תספק/g, 'יספקו');
    result = result.replace(/יפקיד\/תפקיד/g, 'יפקידו');
    result = result.replace(/ימנה\/תמנה/g, 'ימנו');
    result = result.replace(/יפרט\/תפרט/g, 'יפרטו');
    result = result.replace(/יציג\/תציג/g, 'יציגו');
    result = result.replace(/יבחר\/תבחר/g, 'יבחרו');
    result = result.replace(/יקרא\/תקרא/g, 'יקראו');
    result = result.replace(/יכתוב\/תכתוב/g, 'יכתבו');
    result = result.replace(/יחשב\/תחשב/g, 'יחשבו');
    result = result.replace(/יעזור\/תעזור/g, 'יעזרו');
    result = result.replace(/ילמד\/תלמד/g, 'ילמדו');
    result = result.replace(/יזכור\/תזכור/g, 'יזכרו');
    result = result.replace(/ישכח\/תשכח/g, 'ישכחו');
    result = result.replace(/יתקשר\/תתקשר/g, 'יתקשרו');
    result = result.replace(/יפגוש\/תפגוש/g, 'יפגשו');
    result = result.replace(/יתייצב\/תתייצב/g, 'יתייצבו');
    result = result.replace(/ייצג\/תייצג/g, 'ייצגו');
    result = result.replace(/יטען\/תטען/g, 'יטענו');
    result = result.replace(/יוכיח\/תוכיח/g, 'יוכיחו');
    result = result.replace(/יכבד\/תכבד/g, 'יכבדו');
    result = result.replace(/יסרב\/תסרב/g, 'יסרבו');
    result = result.replace(/ידרוש\/תדרוש/g, 'ידרשו');
    result = result.replace(/ישקול\/תשקול/g, 'ישקלו');
    result = result.replace(/ישתף\/תשתף/g, 'ישתפו');
    result = result.replace(/ימשיך\/תמשיך/g, 'ימשיכו');
    result = result.replace(/יפסיק\/תפסיק/g, 'יפסיקו');
    result = result.replace(/יאפשר\/תאפשר/g, 'יאפשרו');
    result = result.replace(/יגן\/תגן/g, 'יגנו');
    result = result.replace(/ישמר\/תשמר/g, 'ישמרו');
    result = result.replace(/יעדיף\/תעדיף/g, 'יעדיפו');
    result = result.replace(/יתנגד\/תתנגד/g, 'יתנגדו');
    result = result.replace(/יקבע\/תקבע/g, 'יקבעו');
    result = result.replace(/יורה\/תורה/g, 'יורו');
    result = result.replace(/ינחה\/תנחה/g, 'ינחו');
    result = result.replace(/יחפוץ\/תחפוץ/g, 'יחפצו');
    
    // כינויי שייכות נוספים
    result = result.replace(/רכושו\/ה/g, 'רכושם');
    result = result.replace(/ביתו\/ה/g, 'ביתם');
    result = result.replace(/כספו\/ה/g, 'כספם');
    result = result.replace(/שמו\/ה/g, 'שמם');
    result = result.replace(/כתובתו\/ה/g, 'כתובתם');
    result = result.replace(/חתימתו\/ה/g, 'חתימתם');
    result = result.replace(/הסכמתו\/ה/g, 'הסכמתם');
    result = result.replace(/זכותו\/ה/g, 'זכותם');
    result = result.replace(/חובתו\/ה/g, 'חובתם');
    result = result.replace(/רצונו\/ה/g, 'רצונם');
    result = result.replace(/טובתו\/ה/g, 'טובתם');
    result = result.replace(/בריאותו\/ה/g, 'בריאותם');
    result = result.replace(/עסקיו\/ה/g, 'עסקיהם');
    result = result.replace(/נכסיו\/ה/g, 'נכסיהם');
    result = result.replace(/מסמכיו\/ה/g, 'מסמכיהם');
    result = result.replace(/חשבונו\/ה/g, 'חשבונם');
    result = result.replace(/אחריותו\/ה/g, 'אחריותם');
    result = result.replace(/התחייבותו\/ה/g, 'התחייבותם');
    result = result.replace(/זהותו\/ה/g, 'זהותם');
    result = result.replace(/מקומו\/ה/g, 'מקומם');
    result = result.replace(/תפקידו\/ה/g, 'תפקידם');
    result = result.replace(/משפחתו\/ה/g, 'משפחתם');
    result = result.replace(/הוריו\/ה/g, 'הוריהם');
    result = result.replace(/בנו\/ה/g, 'בנם');
    result = result.replace(/בתו\/ה/g, 'בתם');
    result = result.replace(/גופו\/ה/g, 'גופם');
    result = result.replace(/ראשו\/ה/g, 'ראשם');
    result = result.replace(/ידו\/ה/g, 'ידם');
    result = result.replace(/מצבו\/ה/g, 'מצבם');
    result = result.replace(/רוחו\/ה/g, 'רוחם');
    result = result.replace(/מותו\/ה/g, 'מותם');
    result = result.replace(/סבלו\/ה/g, 'סבלם');
    result = result.replace(/כאבו\/ה/g, 'כאבם');
    result = result.replace(/הכרתו\/ה/g, 'הכרתם');
    result = result.replace(/צלילותו\/ה/g, 'צלילותם');
    result = result.replace(/כשירותו\/ה/g, 'כשירותם');
    result = result.replace(/כבודו\/ה/g, 'כבודם');
    result = result.replace(/פרטיותו\/ה/g, 'פרטיותם');
    result = result.replace(/צנעתו\/ה/g, 'צנעתם');
    result = result.replace(/דתו\/ה/g, 'דתם');
    result = result.replace(/מסורתו\/ה/g, 'מסורתם');
    result = result.replace(/שגרתו\/ה/g, 'שגרתם');
    result = result.replace(/אחיו\/ה/g, 'אחיהם');
    result = result.replace(/נכדיו\/ה/g, 'נכדיהם');
    result = result.replace(/דירתו\/ה/g, 'דירתם');
    result = result.replace(/רכבו\/ה/g, 'רכבם');
    result = result.replace(/טיפולו\/ה/g, 'טיפולם');
    result = result.replace(/סביבתו\/ה/g, 'סביבתם');
    result = result.replace(/מטפלו\/ה/g, 'מטפלם');
    result = result.replace(/רופאו\/ה/g, 'רופאם');
    result = result.replace(/אשפוזו\/ה/g, 'אשפוזם');
    result = result.replace(/שיקומו\/ה/g, 'שיקומם');
    result = result.replace(/בעניינו\/ה/g, 'בעניינם');
    result = result.replace(/בשמו\/ה/g, 'בשמם');
    result = result.replace(/עבורו\/ה/g, 'עבורם');
    result = result.replace(/במקומו\/ה/g, 'במקומם');
    
    // פעלים רפואיים
    result = result.replace(/יונשם\/תונשם/g, 'יונשמו');
    result = result.replace(/יוזן\/תוזן/g, 'יוזנו');
    result = result.replace(/יושהה\/תושהה/g, 'יושהו');
    result = result.replace(/יחובר\/תחובר/g, 'יחוברו');
    result = result.replace(/ינותק\/תנותק/g, 'ינותקו');
    result = result.replace(/יטופל\/תטופל/g, 'יטופלו');
    result = result.replace(/ישוקם\/תשוקם/g, 'ישוקמו');
    
    // תארים נוספים
    result = result.replace(/חולה\/ה/g, 'חולים');
    result = result.replace(/סובל\/ת/g, 'סובלים');
    result = result.replace(/מאושפז\/ת/g, 'מאושפזים');
    result = result.replace(/מטופל\/ת/g, 'מטופלים');
    result = result.replace(/מורדם\/ת/g, 'מורדמים');
    result = result.replace(/מונשם\/ת/g, 'מונשמים');
    result = result.replace(/מחובר\/ת/g, 'מחוברים');
    result = result.replace(/מודע\/ת/g, 'מודעים');
    result = result.replace(/צלול\/ה/g, 'צלולים');
    result = result.replace(/מבולבל\/ת/g, 'מבולבלים');
    result = result.replace(/סיעודי\/ת/g, 'סיעודיים');
    result = result.replace(/תלוי\/ה/g, 'תלויים');
    result = result.replace(/זקוק\/ה/g, 'זקוקים');
    result = result.replace(/גוסס\/ת/g, 'גוססים');
    result = result.replace(/שוכב\/ת/g, 'שוכבים');
    result = result.replace(/יושב\/ת/g, 'יושבים');
    result = result.replace(/מתהלך\/ת/g, 'מתהלכים');
    result = result.replace(/מרותק\/ת/g, 'מרותקים');
    result = result.replace(/משותק\/ת/g, 'משותקים');
    result = result.replace(/כשיר\/ה/g, 'כשירים');
    result = result.replace(/מבין\/ה/g, 'מבינים');
    result = result.replace(/שפוי\/ה/g, 'שפויים');
    result = result.replace(/חסוי\/ה/g, 'חסויים');
    result = result.replace(/מוגבל\/ת/g, 'מוגבלים');
    result = result.replace(/עצמאי\/ת/g, 'עצמאיים');
    result = result.replace(/נזקק\/ת/g, 'נזקקים');
    
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
