/**
 * מערכת נטיות עברית - זכר/נקבה/רבים
 * קריטי למסמכים משפטיים בעברית
 */

export type Gender = 'male' | 'female' | 'plural' | 'organization';

export interface GenderedWord {
  male: string;
  female: string;
  plural: string;
  organization?: string;
}

/**
 * מילון נטיות - פעלים, תארים, מונחים משפטיים
 */
export const hebrewDictionary: Record<string, GenderedWord> = {
  // פעלים נפוצים
  'עשה': { male: 'עשה', female: 'עשתה', plural: 'עשו' },
  'אמר': { male: 'אמר', female: 'אמרה', plural: 'אמרו' },
  'חתם': { male: 'חתם', female: 'חתמה', plural: 'חתמו' },
  'הצהיר': { male: 'הצהיר', female: 'הצהירה', plural: 'הצהירו' },
  'קיבל': { male: 'קיבל', female: 'קיבלה', plural: 'קיבלו' },
  'נתן': { male: 'נתן', female: 'נתנה', plural: 'נתנו' },
  'הסכים': { male: 'הסכים', female: 'הסכימה', plural: 'הסכימו' },
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
  'אפוטרופוס': { male: 'אפוטרופוס', female: 'אפוטרופסת', plural: 'אפוטרופסים' },
  'האפוטרופוס': { male: 'האפוטרופוס', female: 'האפוטרופסת', plural: 'האפוטרופסים' },
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
  'הורה': { male: 'אב', female: 'אם', plural: 'הורים' },
  'ההורה': { male: 'האב', female: 'האם', plural: 'ההורים' },
  'נכד': { male: 'נכד', female: 'נכדה', plural: 'נכדים' },
  'הנכד': { male: 'הנכד', female: 'הנכדה', plural: 'הנכדים' },
  
  // יורשים וזכאים
  'יורש': { male: 'יורש', female: 'יורשת', plural: 'יורשים' },
  'היורש': { male: 'היורש', female: 'היורשת', plural: 'היורשים' },
  'זכאי_לירושה': { male: 'זכאי לירושה', female: 'זכאית לירושה', plural: 'זכאים לירושה' },
  'מקבל': { male: 'מקבל', female: 'מקבלת', plural: 'מקבלים' },
  'המקבל': { male: 'המקבל', female: 'המקבלת', plural: 'המקבלים' },
  
  // מונחים משפטיים - מצבים
  'זכאי': { male: 'זכאי', female: 'זכאית', plural: 'זכאים' },
  'חייב': { male: 'חייב', female: 'חייבת', plural: 'חייבים' },
  'רשאי': { male: 'רשאי', female: 'רשאית', plural: 'רשאים' },
  'אחראי': { male: 'אחראי', female: 'אחראית', plural: 'אחראים' },
  'מוסמך': { male: 'מוסמך', female: 'מוסמכת', plural: 'מוסמכים' },
  'מחויב': { male: 'מחויב', female: 'מחויבת', plural: 'מחויבים' },
  'מורשה_פעולה': { male: 'מורשה לפעול', female: 'מורשת לפעול', plural: 'מורשים לפעול' },
  'מנוע': { male: 'מנוע', female: 'מנועה', plural: 'מנועים' },
  'חתום': { male: 'חתום', female: 'חתומה', plural: 'חתומים' },
  'הנ"ל': { male: 'הנ"ל', female: 'הנ"ל', plural: 'הנ"ל' },
};

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
 */
export function replaceTextWithGender(text: string, gender: Gender): string {
  let result = text;
  
  // עבור על כל המילים במילון
  Object.keys(hebrewDictionary).forEach(word => {
    const genderedWord = hebrewDictionary[word];
    const replacement = replaceWithGender(word, gender);
    
    // החלף בכל המקומות בטקסט
    // משתמש ב-word boundaries כדי לא להחליף חלקים ממילים
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    result = result.replace(regex, replacement);
    
    // החלף גם גרסאות עם ה"א הידיעה
    const withHa = `ה${word}`;
    if (result.includes(withHa)) {
      const regexWithHa = new RegExp(`\\b${withHa}\\b`, 'g');
      result = result.replace(regexWithHa, replacement);
    }
  });
  
  return result;
}

/**
 * החלפה עם מגדרים מרובים (לטבלאות)
 * מאפשר להחליף מילים שונות עם מגדרים שונים באותו טקסט
 */
export function replaceTextWithMultipleGenders(
  text: string,
  genderMap: Record<string, Gender>
): string {
  let result = text;
  
  // עבור על כל placeholder עם המגדר שלו
  Object.entries(genderMap).forEach(([placeholder, gender]) => {
    // מצא placeholders מהצורה {{שם_משתנה|מגדר}}
    const regex = new RegExp(`{{${placeholder}\\|(male|female|plural|organization)}}`, 'g');
    result = result.replace(regex, (match, wordToReplace) => {
      return replaceWithGender(wordToReplace, gender);
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
 * // שימוש מתקדם עם placeholders
 * const template = "{{התובע|male}} תבע את {{הנתבע|female}}";
 * replaceTextWithMultipleGenders(template, {
 *   'התובע': 'male',
 *   'הנתבע': 'female'
 * }); // "התובע תבע את הנתבעת"
 */
