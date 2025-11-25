/**
 * פונקציות עזר להחלפת דפוסים מיוחדים בטמפלייטים של הסכמי שכר טרחה
 */

export type Gender = 'male' | 'female' | 'plural';

interface ClientInfo {
  gender: 'male' | 'female';
}

/**
 * קובע את המגדר המתאים בהתאם למספר הלקוחות והמגדר שלהם
 */
export function determineGender(clients: ClientInfo[]): Gender {
  if (clients.length === 0) return 'male'; // ברירת מחדל
  if (clients.length > 1) return 'plural'; // יותר מלקוח אחד = רבים
  return clients[0].gender; // לקוח בודד - לפי המגדר שלו
}

/**
 * מחליף דפוס {{multipleClients:רבים|זכר|נקבה}}
 */
export function replaceMultipleClientsPattern(text: string, gender: Gender): string {
  const pattern = /\{\{multipleClients:(.*?)\|(.*?)\|(.*?)\}\}/g;
  
  return text.replace(pattern, (match, pluralOption, maleOption, femaleOption) => {
    switch (gender) {
      case 'plural':
        return pluralOption;
      case 'male':
        return maleOption;
      case 'female':
        return femaleOption;
      default:
        return maleOption;
    }
  });
}

/**
 * מחליף דפוס {{gender:זכר|נקבה|רבים}}
 */
export function replaceGenderPattern(text: string, gender: Gender): string {
  const pattern = /\{\{gender:(.*?)\|(.*?)\|(.*?)\}\}/g;
  
  return text.replace(pattern, (match, maleOption, femaleOption, pluralOption) => {
    switch (gender) {
      case 'male':
        return maleOption;
      case 'female':
        return femaleOption;
      case 'plural':
        return pluralOption;
      default:
        return maleOption;
    }
  });
}

/**
 * מחליף משתנה {{לקוח}} בצורה הנכונה
 */
export function replaceClientVariable(text: string, gender: Gender): string {
  let clientWord = '';
  
  switch (gender) {
    case 'male':
      clientWord = 'לקוח';
      break;
    case 'female':
      clientWord = 'לקוחה';
      break;
    case 'plural':
      clientWord = 'לקוחות';
      break;
  }
  
  // החלפת המשתנה {{לקוח}} בכל הצורות שלו
  return text.replace(/\{\{לקוח\}\}/g, clientWord);
}

/**
 * מחליף את כל השילובים האפשריים של "ה+לקוח" (הלקוח, ללקוח, של הלקוח וכו')
 */
export function replaceClientPrefixes(text: string, gender: Gender): string {
  let clientWord = '';
  
  switch (gender) {
    case 'male':
      clientWord = 'לקוח';
      break;
    case 'female':
      clientWord = 'לקוחה';
      break;
    case 'plural':
      clientWord = 'לקוחות';
      break;
  }
  
  // החלפת כל השילובים עם תחיליות
  const prefixes = ['ה', 'ל', 'של ה', 'את ה', 'עם ה', 'על ה', 'מ', 'ב', 'כ'];
  
  let result = text;
  
  prefixes.forEach(prefix => {
    // יצירת regex שמחפש את התבנית עם התחילית
    const pattern = new RegExp(`${prefix}\\{\\{לקוח\\}\\}`, 'g');
    result = result.replace(pattern, `${prefix}${clientWord}`);
  });
  
  return result;
}

/**
 * מחליף דפוסי פעלים רגישי מגדר כמו "הוא/היא יליד/ת"
 */
export function replaceGenderSensitiveVerbs(text: string, gender: Gender): string {
  let result = text;
  
  // טיפול בדפוס "הוא/היא"
  result = result.replace(/הוא\/היא/g, gender === 'male' ? 'הוא' : (gender === 'female' ? 'היא' : 'הם'));
  
  // טיפול בדפוס "יליד/ת"
  result = result.replace(/יליד\/ת/g, gender === 'male' ? 'יליד' : (gender === 'female' ? 'ילידת' : 'ילידי'));
  
  // טיפול בדפוס "נושא/ת"
  result = result.replace(/נושא\/ת/g, gender === 'male' ? 'נושא' : (gender === 'female' ? 'נושאת' : 'נושאים'));
  
  // טיפול בדפוס "מחזיק/ה"
  result = result.replace(/מחזיק\/ה/g, gender === 'male' ? 'מחזיק' : (gender === 'female' ? 'מחזיקה' : 'מחזיקים'));
  
  // טיפול בדפוס "בעל/ת"
  result = result.replace(/בעל\/ת/g, gender === 'male' ? 'בעל' : (gender === 'female' ? 'בעלת' : 'בעלי'));
  
  return result;
}

/**
 * פונקציה ראשית שמחליפה את כל הדפוסים בבת אחת (עם מערך לקוחות)
 */
export function replaceFeeAgreementTemplateText(text: string, clients: ClientInfo[]): string {
  const gender = determineGender(clients);
  return replaceFeeAgreementTemplateTextWithGender(text, gender);
}

/**
 * פונקציה ראשית שמחליפה את כל הדפוסים בבת אחת (עם Gender ישיר)
 */
export function replaceFeeAgreementTemplateTextWithGender(text: string, gender: Gender): string {
  let result = text;
  
  // שלב 1: החלף דפוסי {{multipleClients:...}}
  result = replaceMultipleClientsPattern(result, gender);
  
  // שלב 2: החלף דפוסי {{gender:...}}
  result = replaceGenderPattern(result, gender);
  
  // שלב 3: החלף משתנה {{לקוח}} עם תחיליות
  result = replaceClientPrefixes(result, gender);
  
  // שלב 4: החלף משתנה {{לקוח}} רגיל
  result = replaceClientVariable(result, gender);
  
  // שלב 5: החלף פעלים רגישי מגדר
  result = replaceGenderSensitiveVerbs(result, gender);
  
  return result;
}

/**
 * פונקציה להחלפת טקסט שלם (כולל סעיפים מרובים)
 */
export function replaceFullAgreementText(
  sections: Array<{ title: string; content: string }>,
  clients: ClientInfo[]
): Array<{ title: string; content: string }> {
  return sections.map(section => ({
    title: replaceFeeAgreementTemplateText(section.title, clients),
    content: replaceFeeAgreementTemplateText(section.content, clients)
  }));
}

/**
 * פונקציה לבדיקה מהירה - האם הטקסט מכיל עדיין דפוסים שלא הוחלפו
 */
export function hasUnreplacedPatterns(text: string): boolean {
  const patterns = [
    /\{\{multipleClients:/,
    /\{\{gender:/,
    /\{\{לקוח\}\}/,
    /הוא\/היא/,
    /יליד\/ת/
  ];
  
  return patterns.some(pattern => pattern.test(text));
}

