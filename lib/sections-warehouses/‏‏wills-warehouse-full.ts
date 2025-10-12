/**
 * מחסן סעיפים לצוואות יחיד
 * סעיפים לצוואה של אדם יחיד (לא צוואה הדדית)
 */

/**
 * הוראות כלליות ל-AI לעריכת סעיפי צוואה:
 * 
 * 1. שפה ולשון:
 *    - השתמש בעברית תקנית וטבעית, לא בתרגום מילולי מאנגלית
 *    - השתמש בלשון משפטית ישראלית מקובלת
 *    - הימנע מביטויים מתורגמים או מלאכותיים (דוגמה לביטוי שגוי: "אני מעריך את...")
 *    - שמור על זרימה טבעית של המשפטים בעברית
 *    - השתמש במבנה משפט עברי (לא אנגלי מתורגם)
 * 
 * 2. אפשרויות ניסוח:
 *    - הצע תמיד 2-3 אפשרויות ניסוח שונות למשתמש
 *    - סמן כל אפשרות בבירור (אפשרות א', אפשרות ב', אפשרות ג')
 *    - הסבר בקצרה את ההבדלים בין האפשרויות (למשל: "פורמלי יותר", "חם יותר", "תמציתי")
 *    - אפשרויות שונות = ניסוחים שונים, לא רק שינוי של מילה אחת
 * 
 * 3. התאמה אישית:
 *    - שאל שאלות הבהרה כשיש משתנים לא ברורים או חסרים
 *    - התאם את הטון למטרת הסעיף (רשמי/אישי/משפטי/רגשי)
 *    - שמור על עקביות עם שאר הצוואה
 *    - קח בחשבון את הקונטקסט המשפחתי אם ניתן
 * 
 * 4. דיוק משפטי:
 *    - וודא שהניסוח תואם לחוק הירושה הישראלי, תשכ"ה-1965
 *    - השתמש במינוחים משפטיים מקובלים בישראל
 *    - הימנע מעמימות - כל סעיף צריך להיות ברור, מדויק וחד משמעי
 *    - במקרה של ספק משפטי, ציין זאת ומלץ להתייעץ עם עורך דין
 * 
 * 5. רגישות תרבותית ואישית:
 *    - התחשב במסורות המשפחתיות והתרבותיות בישראל
 *    - הקפד על כבוד ורגישות מרבית בנושאים אישיים (מוות, ירושה, יחסים משפחתיים)
 *    - התאם את הלשון לרקע התרבותי של המשפחה אם ניתן לזהות אותו
 *    - היה רגיש למצבים מורכבים (משפחות מעורבות, יחסים מסובכים, פרידות, פונדקאות)
 * 
 * 6. עקרונות כתיבה:
 *    - העדף משפטים קצרים ובהירים על משפטים ארוכים ומסובכים
 *    - השתמש בפסיקים כדי לשפר קריאות
 *    - הימנע מחזרה מיותרת על אותן מילים
 *    - השתמש במילות קישור מתאימות בעברית
 */

export interface SingleWillSectionTemplate {
  id: string;
  title: string;
  category: 'opening' | 'testator-info' | 'general' | 'family-declarations' | 'estate-scope' | 'estate-items' | 'distribution' | 'heirs' | 'guardianship' | 'minors-property-management' | 'special-conditions' | 'property-restrictions' | 'substitution' | 'pension-funds' | 'no-contest' | 'personal-message' | 'closing';
  content: string;
  variables: string[];
  aiPrompt: string;
  usageInstructions: string;
}

/**
 * ממשק ליורש בצוואת יחיד
 */
export interface Heir {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  short_name: string;
  id_number: string;
  address: string;
  relationship: string;
  inheritance_fraction: string;
}

/**
 * ממשק לאפוטרופוס
 */
export interface Guardian {
  id: string;
  full_name: string;
  id_number: string;
  address: string;
  relationship: string;
  type: 'property' | 'personal' | 'medical' | 'full';
}

export const singleWillsSectionsWarehouse: SingleWillSectionTemplate[] = [
  // פתיחה
  {
    id: 'single-will-howevers-opening',
    title: 'פתיחת צוואה - הואיל',
    category: 'opening',
    content: `צוואה 

הואיל	כי אין אדם יודע את יום פקודתו;
והואיל	כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל הקשור לאשר {{will_verb}} ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;
והואיל 	כי הנני למעלה מגיל שמונה עשרה שנים, {{citizenship}} ותושב{{gender_suffix}} מדינת ישראל{{additional_status}};`,
    variables: ['will_verb', 'citizenship', 'gender_suffix', 'additional_status'],
    aiPrompt: `זוהי פתיחה סטנדרטית ומכובדת לכל צוואה בישראל. אם המשתמש מבקש שינוי:

הצע 2 אפשרויות:
אפשרות א': שמור על הניסוח הסטנדרטי עם ה"הואיל" (מומלץ - זה מקובל ומוכר)
אפשרות ב': גרסה מעט יותר מודרנית אך עדיין רשמית

משתנים:
- will_verb: "יעשה" או "ייעשה" 
- citizenship: "אזרח ישראלי" או "אזרחית ישראלית"
- gender_suffix: ת" או ריק"
- additional_status: כל סטטוס נוסף רלוונטי (ריק אם אין)

שמור על הטון החגיגי והרשמי - זו פתיחה חשובה.`,
    usageInstructions: 'פתיחה סטנדרטית לכל צוואת יחיד - סעיף חובה',
  },

  // פרטי מצווה
  {
    id: 'testator-basic-details',
    title: 'פרטי המצווה הבסיסיים',
    category: 'testator-info',
    content: `לפיכך אני הח"מ {{full_name}}, {{short_reference}} הנושא{{gender_suffix}} תעודת זהות {{id_number}}, מרחוב: {{address}}, לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, הנני מצווה בזה בדעה מוגמרת וללא כל השפעה בלתי הוגנת עלי מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, קובע{{gender_suffix}} ומצהיר{{gender_suffix}} כמפורט להלן:`,
    variables: ['full_name', 'short_reference', 'gender_suffix', 'id_number', 'address'],
    aiPrompt: `זוהי הצהרת המצווה המרכזית. אם נדרש שינוי:

משתנים:
- full_name: שם מלא (פרטי ומשפחה)
- short_reference: "(להלן: "שם מקוצר")" - אופציונלי
- gender_suffix: "ת" לנקבה, ריק לזכר
- id_number: תעודת זהות
- address: כתובת מלאה

זהו סעיף משפטי חשוב - שמור על הדיוק והבהירות.`,
    usageInstructions: 'הצהרת המצווה הבסיסית - חובה בכל צוואה',
  },

  // כללי
  {
    id: 'revocation-of-previous-wills',
    title: 'ביטול צוואות קודמות',
    category: 'general',
    content: `למען הסר ספק, אני מבטל{{gender_suffix}} בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשר לרכושי ולנכסיי, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוני שייעשה בעיזבוני לאחר מותי.`,
    variables: ['gender_suffix'],
    aiPrompt: `סעיף סטנדרטי וקריטי המבטל כל צוואה קודמת. אם נדרש שינוי:

הצע 2 אפשרויות:
אפשרות א': הניסוח המשפטי המלא (כמו המקור) - מומלץ
אפשרות ב': ניסוח מעט יותר תמציתי אך מקיף

חשוב: הסעיף חייב לכלול ביטול מוחלט של כל צוואה קודמת, בכתב ובעל פה.`,
    usageInstructions: 'סעיף חובה בכל צוואה - מבטל צוואות קודמות',
  },

  {
    id: 'payment-of-debts-and-expenses',
    title: 'תשלום חובות והוצאות',
    category: 'general',
    content: `אני מורה ליורש{{plural_suffix}} אשר {{execute_verb}} את צוואתי לשלם מתוך עיזבוני האמור את כל חובותי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.`,
    variables: ['plural_suffix', 'execute_verb'],
    aiPrompt: `סעיף סטנדרטי לתשלום חובות. אם נדרש שינוי:

משתנים:
- plural_suffix: "י" אם יורש יחיד, "ים" אם יורשים רבים
- execute_verb: "יבצע" ליחיד, "יבצעו" לרבים

הדגש שחובות והוצאות משולמים לפני חלוקת הירושה.`,
    usageInstructions: 'סעיף חובה - מבטיח תשלום חובות והוצאות קבורה',
  },

  {
    id: 'will-scope-declaration',
    title: 'הצהרה על היקף תחולת הצוואה',
    category: 'general',
    content: `צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים.`,
    variables: [],
    aiPrompt: `הצהרה כללית שהצוואה חלה על כל הרכוש. אם נדרש שינוי:

הצע ניסוח אלטרנטיבי אך שמור על המקיפות - הסעיף חייב לכלול כל רכוש בארץ ובחו"ל.`,
    usageInstructions: 'הצהרה כללית על תחולת הצוואה - מומלץ להוסיף',
  },

  // הצהרות משפחתיות
  {
    id: 'siblings-declaration-full',
    title: 'הצהרה מלאה על אחים',
    category: 'family-declarations',
    content: `יש לי {{total_siblings_number}} אחים. {{living_siblings_number}} מהם חיים: {{living_siblings_list}}. {{deceased_siblings_number}} מהם הלכו לעולמם: {{deceased_siblings_list}}.`,
    variables: ['total_siblings_number', 'living_siblings_number', 'living_siblings_list', 'deceased_siblings_number', 'deceased_siblings_list'],
    aiPrompt: `הצהרה חשובה המפרטת את כל האחים, חיים ומתים. זה מראה שההחלטות התקבלו במודעות מלאה.

משתנים:
- total_siblings_number: מספר כולל (מילולי - "שלושה", "חמישה")
- living_siblings_number: מספר חיים (מילולי)
- living_siblings_list: רשימה עם שמות מלאים ות.ז.
- deceased_siblings_number: מספר נפטרים (מילולי)
- deceased_siblings_list: רשימה עם שמות מלאים, ת.ז. ו"ז"ל"

השתמש בלשון מכבדת למתים.`,
    usageInstructions: 'השתמש כשיש אחים שלא יורשים - מראה שזו החלטה מודעת',
  },

  {
    id: 'siblings-awareness-clarification',
    title: 'הבהרת מודעות להחלטות הירושה',
    category: 'family-declarations',
    content: `אני מצהיר{{gender_suffix}} במפורש כי הצהרתי את כלל {{family_members}}, לרבות אלה שנפטרו, על מנת להבהיר שהחלטותיי בצוואה זו התקבלו מתוך מודעות מלאה לזהותם של כלל {{family_members}}.

כל יורש שלא נכלל בירושתי על פי צוואה זו, כולל נכסים ו/או כספים - הדבר נעשה במכוון ולא מחמת טעות או שכחה. החלטותיי נתקבלו לאחר שיקול דעת מושכל ומתוך רצון חופשי וללא כפייה.

אני מבקש{{gender_suffix}} בזאת מכל הנוגעים בדבר, לכבד החלטה זו ולמלא אחר הוראותיי המפורטות בצוואה זו.`,
    variables: ['gender_suffix', 'family_members'],
    aiPrompt: `סעיף חשוב מאוד המונע טענות של טעות או שכחה. אם נדרש שינוי:

הצע 2-3 אפשרויות:
אפשרות א': מפורט וחזק (כמו המקור) - מומלץ במצבים רגישים
אפשרות ב': תמציתי יותר אך ברור
אפשרות ג': עם הוספת נימוק כללי להחלטה (אם המשתמש רוצה)

משתנים:
- gender_suffix: "ת" לנקבה, ריק לזכר
- family_members: "האחים שלי" / "בני המשפחה" / וכו'

הדגש את המודעות המלאה והרצון החופשי.`,
    usageInstructions: 'חשוב מאוד כשלא כל בני המשפחה יורשים - מונע ערעורים',
  },

  {
    id: 'parenthood-surrogacy-declaration',
    title: 'הצהרת הורות ופונדקאות',
    category: 'family-declarations',
    content: `אני מצהיר{{gender_suffix}} כי אני הורה ביולוגי ל{{child_name}}, {{child_short_reference}} תעודת זהות {{child_id}}, שנולד{{child_gender_suffix}} ביום {{birth_date}}. {{child_first_name}} נולד{{child_gender_suffix}} בהליך פונדקאות.

הוגשה בקשה לבית המשפט לענייני משפחה, ובעקבותיה התקבל צו הורות הקובע כי {{parent1_name}} ו{{parent2_name}}, בעל{{parent2_gender_suffix}} תעודת זהות מספר {{parent2_id}}, הם ההורים החוקיים של {{child_determination}}. הורותם של שניהם נקבעה מתוקף צו ההורות שניתן על ידי בית המשפט.`,
    variables: [
      'gender_suffix', 'child_name', 'child_short_reference', 'child_id', 
      'child_gender_suffix', 'birth_date', 'child_first_name',
      'parent1_name', 'parent2_name', 'parent2_gender_suffix', 'parent2_id', 
      'child_determination'
    ],
    aiPrompt: `זהו סעיף רגיש ומשפטי המצהיר על הורות דרך פונדקאות. אם נדרש שינוי:

הצע 2 אפשרויות:
אפשרות א': מפורט עם כל הפרטים המשפטיים (כמו המקור) - מומלץ
אפשרות ב': תמציתי יותר אך כולל את העיקר

משתנים רבים - וודא דיוק בכל הפרטים:
- gender_suffix, child_gender_suffix, parent2_gender_suffix
- כל השמות והמספרים
- child_determination: "הקטין" / "הקטינה" + שם

שמור על לשון מכבדת ומשפטית.`,
    usageInstructions: 'השתמש במקרה של פונדקאות - הצהרה משפטית חשובה',
  },

  {
    id: 'separated-co-parent-exclusion',
    title: 'הצהרה על הורה משותף פרוד ואי-זכאותו',
    category: 'family-declarations',
    content: `בעת חתימה על צוואה זו, {{co_parent_name}} אינו{{co_parent_gender_suffix}} נזכר{{co_parent_gender_suffix}} בצוואה זו כיורש או כמוטב בכל צורה שהיא. אנחנו פרודים ומתגוררים יחד אך ורק לטובת{{child_gender_suffix}} של {{child_first_name}} ולשם גידול{{child_gender_suffix}}, איני ידוע{{testator_gender_suffix}} בציבור שלו ואין אני מוריש{{testator_gender_suffix}} לו דבר. {{co_parent_pronoun}} אינו{{co_parent_gender_suffix}} זכאי{{co_parent_gender_suffix}} לכל חלק בעיזבון המפורט להלן, לא על פי צוואה זו ולא על פי הדין. 

כמו כן, {{co_parent_name}} אינו{{co_parent_gender_suffix}} זכאי{{co_parent_gender_suffix}} להנות, לנהל או לשלוט בכל דרך שהיא ברכוש או בנכסים שתקבל {{child_first_name}} מתוקף צוואה זו, בין אם בתקופת קטנות{{child_gender_suffix}} ובין אם לאחר הגיע{{child_gender_suffix}} לבגרות. למרות המגורים המשותפים, מדובר בהסדר זמני לטובת {{child_first_name}} בלבד, ומעמדנו כהורים ל{{child_first_name}} נותר בתוקף מכוח הצו האמור.`,
    variables: [
      'co_parent_name', 'co_parent_gender_suffix', 'child_gender_suffix', 
      'child_first_name', 'testator_gender_suffix', 'co_parent_pronoun'
    ],
    aiPrompt: `זהו סעיף מאוד רגיש וחשוב הממחיש מצב של הורים פרודים החיים יחד לטובת הילד. אם נדרש שינוי:

הצע 2-3 אפשרויות:
אפשרות א': מפורט וברור מאוד (כמו המקור) - מומלץ במצבים מורכבים
אפשרות ב': תמציתי יותר אך שומר על כל העיקרים
אפשרות ג': עם נימוק נוסף למצב (אם המשתמש רוצה)

משתנים רבים - שים לב לדקדוק:
- כל ה-gender_suffix צריכים להתאים
- co_parent_pronoun: "הוא" / "היא"

חשוב מאוד:
- הדגש שזה הסדר זמני
- הדגש שההורה המשותף לא זכאי לכלום
- הדגש שהוא גם לא יכול לנהל את רכוש הילד

שמור על לשון משפטית ברורה וחד-משמעית.`,
    usageInstructions: 'חשוב מאוד במצבים של הורים פרודים - מונע טענות עתידיות',
  },

  // היקף העיזבון
  {
    id: 'estate-comprehensive-definition',
    title: 'הגדרה מקיפה של העיזבון',
    category: 'estate-scope',
    content: `כל רכוש מכל מין וסוג שהוא בין במקרקעין בין מיטלטלין, לרבות זכויות מכל סוג שהוא ו/או כל רכוש אחר (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או בהווה ו/או יגיעו לידי בעתיד, לרבות:

{{specific_assets_list}}`,
    variables: ['specific_assets_list'],
    aiPrompt: `הגדרה מקיפה של כל העיזבון. אם נדרש שינוי:

הצע ניסוח אלטרנטיבי אך שמור על המקיפות המלאה - הסעיף חייב לכלול:
- מקרקעין ומיטלטלין
- רכוש רשום ולא רשום
- רכוש קיים ועתידי
- כל סוג של זכויות

משתנה specific_assets_list ימולא בפירוט הנכסים הספציפיים.`,
    usageInstructions: 'הגדרה כללית של העיזבון - מומלץ בכל צוואה',
  },

  {
    id: 'estate-detailed-definition',
    title: 'הגדרה מפורטת של העיזבון עם סוגי נכסים',
    category: 'estate-scope',
    content: `צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים. מבלי לפגוע בכלליות האמור לעיל, צוואתי זו חלה ותחול גם על כספים, תוכניות חסכון, קרנות נאמנות, ניירות ערך, תביעות, פנסיות, תגמולים, ביטוח חיים, קצבאות, בין אם מופקדים בבנק ובין אם בידי כל גורם אחר, וכן על זכויות אחרות מכל סוג שהוא, וכל רכוש אחר בין במיטלטלין ובין במקרקעין (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או יגיעו לידי בעתיד (להלן: "עזבוני"), לרבות:

{{specific_assets_list}}`,
    variables: ['specific_assets_list'],
    aiPrompt: `גרסה מפורטת יותר של הגדרת העיזבון, כוללת רשימה של סוגי נכסים. אם נדרש שינוי:

אפשר לקצר או להאריך, אך שמור על העיקרון - כיסוי מקסימלי של כל סוגי הנכסים.`,
    usageInstructions: 'גרסה מפורטת של הגדרת העיזבון - טובה לעיזבונות מורכבים',
  },

  // פריטי עיזבון ספציפיים
  {
    id: 'estate-item-primary-residence',
    title: 'דירת מגורים',
    category: 'estate-items',
    content: `זכויות בדירה הרשומה בטאבו ברחוב {{street_address}}, בעיר {{city}}, הידועה כגוש: {{block}}, חלקה: {{plot}}{{sub_plot_clause}} (להלן: "{{property_nickname}}") וכן את מטלטליה {{movables_attachment}}.`,
    variables: ['street_address', 'city', 'block', 'plot', 'sub_plot_clause', 'property_nickname', 'movables_attachment'],
    aiPrompt: `פירוט דירת מגורים. משתנים:

- street_address: כתובת מלאה
- city: עיר
- block, plot: גוש וחלקה
- sub_plot_clause: ", תת חלקה: X" או ריק
- property_nickname: "דירת המגורים" / "דירת השקעה 1" וכו'
- movables_attachment: 
  * "בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע"
  * "המחוברים חיבור של קבע"
  * בחר לפי מה שרלוונטי

וודא דיוק בכל הפרטים המשפטיים.`,
    usageInstructions: 'השתמש לפירוט כל דירה או נכס מקרקעין',
  },

  {
    id: 'estate-item-land-plot',
    title: 'מגרש',
    category: 'estate-items',
    content: `מגרש {{plot_description}}, הממוקם ב{{location}}, הידוע{{gender_suffix}} כגוש: {{block}}, חלקה: {{plot}} (להלן: "{{property_nickname}}")`,
    variables: ['plot_description', 'location', 'gender_suffix', 'block', 'plot', 'property_nickname'],
    aiPrompt: `פירוט מגרש. משתנים:

- plot_description: תיאור המגרש (למשל: "במתחם האלף")
- location: מיקום מדויק
- gender_suffix: "ה" למגרש, ריק אם זכר
- block, plot: גוש וחלקה
- property_nickname: "מגרש השקעה 1" וכו'`,
    usageInstructions: 'השתמש לפירוט מגרש קרקע',
  },

  {
    id: 'estate-item-bank-account',
    title: 'חשבון בנק',
    category: 'estate-items',
    content: `חשבון הבנק המנוהל על שמי בבנק {{bank_name}} ({{bank_code}}), סניף מספר {{branch_number}}, חשבון מספר {{account_number}}, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.`,
    variables: ['bank_name', 'bank_code', 'branch_number', 'account_number'],
    aiPrompt: `פירוט חשבון בנק. משתנים:

- bank_name: שם הבנק המלא
- bank_code: קוד הבנק (למשל: 11, 20, 31)
- branch_number: מספר סניף
- account_number: מספר חשבון

וודא דיוק מוחלט במספרים.`,
    usageInstructions: 'השתמש לכל חשבון בנק',
  },

  {
    id: 'estate-item-cash',
    title: 'כספים במזומן',
    category: 'estate-items',
    content: `את כלל הכספים במזומן הנמצאים ברשותי, לרבות שטרות כסף המוחזקים בביתי, בכספת או בכל מקום אחר.`,
    variables: [],
    aiPrompt: `סעיף סטנדרטי לכספים במזומן. אם נדרש שינוי, הצע ניסוח אלטרנטיבי אך שמור על המקיפות.`,
    usageInstructions: 'השתמש לכלול כספים במזומן',
  },

  {
    id: 'estate-item-jewelry',
    title: 'תכשיטים',
    category: 'estate-items',
    content: `{{jewelry_scope}} התכשיטים {{ownership_phrase}}, לרבות תכשיטי {{materials_list}}, {{jewelry_types_list}}.`,
    variables: ['jewelry_scope', 'ownership_phrase', 'materials_list', 'jewelry_types_list'],
    aiPrompt: `פירוט תכשיטים. משתנים:

- jewelry_scope: "כלל" / "את כל" / "את כלל"
- ownership_phrase: "השייכים לי למועד פטירתי" / "שברשותי"
- materials_list: "זהב, כסף, פלטינה, יהלומים ואבנים יקרות" או כל שילוב
- jewelry_types_list: "שעונים, צמידים, שרשראות, עגילים, טבעות וסיכות" או כל שילוב

התאם לסוגי התכשיטים הקיימים.`,
    usageInstructions: 'השתמש לכלול תכשיטים בעיזבון',
  },

  {
    id: 'estate-item-vehicle',
    title: 'רכב',
    category: 'estate-items',
    content: `רכב הרשום על שמי במשרד הרישוי למועד פטירתי{{vehicle_details}}.`,
    variables: ['vehicle_details'],
    aiPrompt: `פירוט רכב. משתנה:

- vehicle_details: 
  * ריק (אם רכב כללי)
  * ", מסוג [סוג רכב] מספר רישוי [מספר]" (אם רכב ספציפי)

אם יש רכב ספציפי, הוסף את הפרטים המזהים.`,
    usageInstructions: 'השתמש לכלול רכב בעיזבון',
  },

  // חלוקה ויורשים
  {
    id: 'single-heir-full-inheritance',
    title: 'ירושה מלאה ליורש יחיד',
    category: 'distribution',
    content: `הנני מצווה{{testator_gender_suffix}} ומקנה בזה את כל עזבוני ללא יוצא מן הכלל ל{{heir_relationship}} {{heir_full_name}}, {{heir_short_reference}} הנושא{{heir_gender_suffix}} תעודת זהות {{heir_id}}. את כל רכושי, נכסי, כספי וזכויותיי, ללא כל הגבלה או חריג, מועברים בזאת לבעלות{{heir_gender_suffix}} המלאה והבלעדית של {{heir_first_name}}.`,
    variables: [
      'testator_gender_suffix', 'heir_relationship', 'heir_full_name', 
      'heir_short_reference', 'heir_gender_suffix', 'heir_id', 'heir_first_name'
    ],
    aiPrompt: `ירושה מלאה (100%) ליורש יחיד. משתנים:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר (למצווה)
- heir_relationship: "ילדתי" / "בני" / "אחי" / "אחותי" וכו'
- heir_full_name: שם מלא
- heir_short_reference: "(להלן: "שם")" - אופציונלי
- heir_gender_suffix: "ת" לנקבה, ריק לזכר (ליורש)
- heir_id: תעודת זהות
- heir_first_name: שם פרטי

שמור על בהירות מוחלטת - זה יורש יחיד שמקבל הכל.`,
    usageInstructions: 'השתמש כשיש יורש יחיד שמקבל 100%',
  },

  {
    id: 'multiple-heirs-declaration',
    title: 'הצהרה על יורשים מרובים',
    category: 'heirs',
    content: `הנני מצווה{{testator_gender_suffix}} ומוריש{{testator_gender_suffix}} ל{{heirs_number_text}} היורשים הבאים: {{heirs_list_with_fractions}} (להלן: "{{heirs_collective_name}}") כמפורט להלן:

{{heirs_detailed_breakdown}}`,
    variables: [
      'testator_gender_suffix', 'heirs_number_text', 'heirs_list_with_fractions', 
      'heirs_collective_name', 'heirs_detailed_breakdown'
    ],
    aiPrompt: `הצהרה על יורשים מרובים עם חלוקה בשברים. משתנים:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר
- heirs_number_text: "שלושה" / "ארבעה" / "חמישה" וכו'
- heirs_list_with_fractions: רשימה של היורשים עם פרטים מלאים
  דוגמה: "זכריה טרם, ת.ז. מספר 030529150 (להלן: "זכריה"), נאוה טרם..."
- heirs_collective_name: "שלושת היורשים" / "ארבעת היורשים" וכו'
- heirs_detailed_breakdown: פירוט השברים:
  דוגמה:
  "6.1. שליש אחד (1/3) – זכריה, אחי.
   6.2. שליש אחד (1/3) – נאוה, אלמנתו של אחי.
   6.3. שליש אחד (1/3) – יורשי אורה ז"ל..."

חשוב: וודא שסכום כל השברים הוא 1 (שלם).`,
    usageInstructions: 'השתמש כשיש יורשים מרובים עם חלוקה בשברים',
  },

  {
    id: 'complex-fraction-heir',
    title: 'יורש עם חלוקה פנימית מורכבת',
    category: 'heirs',
    content: `{{fraction_description}} ({{main_fraction}}) – {{heir_description}}:
{{sub_heirs_breakdown}}`,
    variables: ['fraction_description', 'main_fraction', 'heir_description', 'sub_heirs_breakdown'],
    aiPrompt: `חלוקה מורכבת כשיורש אחד הוא בעצם קבוצה של תת-יורשים. משתנים:

- fraction_description: "שליש אחד" / "רבע שני" וכו'
- main_fraction: השבר הכולל (למשל: "1/3", "4/12")
- heir_description: תיאור הקבוצה (למשל: "יורשי אורה ז"ל")
- sub_heirs_breakdown: פירוט התת-יורשים:
  דוגמה:
  "    (1) רבע ראשון מהשליש (היינו 1/12) – לבתה שילה.
       (2) רבע שני מהשליש (היינו 1/12) – לבנה יאיר.
       (3) רבע שלישי מהשליש (היינו 1/12) – לבנה אריאל.
       (4) רבע רביעי מהשליש (היינו 1/12) – יתחלק בין..."

שים לב לחישוב נכון של השברים!`,
    usageInstructions: 'השתמש כשיורש הוא קבוצה שצריכה חלוקה פנימית',
  },

  {
    id: 'asset-distribution-by-heir-group',
    title: 'חלוקת נכסים ספציפיים ליורשים',
    category: 'distribution',
    content: `אני מצווה{{testator_gender_suffix}} ומוריש{{testator_gender_suffix}} ל{{heirs_reference}} בהתאם לחלוקה כמצוין בסעיף {{heirs_section_number}} לעיל, כדלקמן:

{{assets_list}}`,
    variables: ['testator_gender_suffix', 'heirs_reference', 'heirs_section_number', 'assets_list'],
    aiPrompt: `חלוקת נכסים ספציפיים לפי החלוקה שהוגדרה קודם. משתנים:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר
- heirs_reference: "שלושת היורשים" / "היורשים" וכו'
- heirs_section_number: מספר הסעיף שמגדיר את החלוקה
- assets_list: רשימת הנכסים שמתחלקים ביניהם
  (כל נכס עם מספר תת-סעיף)

השתמש כשרוצים לחלק חלק מהנכסים באופן מסוים.`,
    usageInstructions: 'השתמש לחלוקת קבוצת נכסים ליורשים מרובים',
  },

  {
    id: 'specific-asset-to-specific-heir',
    title: 'נכס ספציפי ליורש ספציפי',
    category: 'distribution',
    content: `הנני מצווה{{testator_gender_suffix}} ומוריש{{testator_gender_suffix}} במלואה (100%) ל{{heir_description}} {{heir_full_name}} ת.ז. {{heir_id}} (להלן: "{{heir_short_name}}") את הרכוש כמפורט להלן:

{{specific_assets_list}}`,
    variables: [
      'testator_gender_suffix', 'heir_description', 'heir_full_name', 
      'heir_id', 'heir_short_name', 'specific_assets_list'
    ],
    aiPrompt: `הורשת נכסים ספציפיים ליורש ספציפי במלואם. משתנים:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר
- heir_description: "אחי" / "בתי" / "חברי" וכו'
- heir_full_name, heir_id: פרטים מלאים
- heir_short_name: שם מקוצר (למשל: "היורש רפאל")
- specific_assets_list: רשימת הנכסים הספציפיים
  (כל נכס עם מספר תת-סעיף)

השתמש כשרוצים לתת נכסים מסוימים ליורש מסוים.`,
    usageInstructions: 'השתמש להורשת נכסים ספציפיים ליורש ספציפי',
  },

  {
    id: 'vehicle-sale-instruction',
    title: 'הוראה למכירת רכב',
    category: 'distribution',
    content: `רכב הרשום על שמי במשרד הרישוי למועד פטירתי, אם יהיה כזה - אני מורה{{testator_gender_suffix}} למכור את הרכב, ולהפקיד את תמורת המכירה {{deposit_destination}}.`,
    variables: ['testator_gender_suffix', 'deposit_destination'],
    aiPrompt: `הוראה למכירת רכב ולא להעברתו. משתנים:

- testator_gender_suffix: "ה" לנקבה, ריק לזכר
- deposit_destination: 
  * "בחשבון הבנק שלי" (ואז יתחלק עם שאר העיזבון)
  * "לזכות [שם יורש]"
  * כל יעד אחר

השתמש כשרוצים למכור רכב ולא להעבירו בעין.`,
    usageInstructions: 'השתמש כשרוצים למכור רכב במקום להעבירו',
  },

  // אפוטרופסות
  {
    id: 'guardian-appointment-introduction',
    title: 'פתיחה למינוי אפוטרופוס',
    category: 'guardianship',
    content: `מתוך דאגה לטובת{{child_gender_suffix}} של {{child_relationship}} {{child_first_name}} ומתוך רצוני להבטיח את המשך הטיפול הראוי ב{{child_pronoun}}, אני מבקש{{testator_gender_suffix}} מבית המשפט הנכבד למנות אפוטרופוס על {{child_relationship}} {{child_first_name}} במקרה של פטירתי בחיי{{child_gender_suffix}} הקטינים, כמפורט להלן:`,
    variables: [
      'child_gender_suffix', 'child_relationship', 'child_first_name', 
      'child_pronoun', 'testator_gender_suffix'
    ],
    aiPrompt: `פתיחה למינוי אפוטרופוס לקטין. משתנים:

- child_gender_suffix: "ה" לנקבה, ריק לזכר
- child_relationship: "בתי" / "בני" / "ילדתי" / "ילדי"
- child_first_name: שם פרטי
- child_pronoun: "בה" / "בו"
- testator_gender_suffix: "ת" לנקבה, ריק לזכר (למצווה)

זהו סעיף רגיש - שמור על טון חם ואכפתי.`,
    usageInstructions: 'פתיחה למינוי אפוטרופוס - השתמש לפני פירוט האפוטרופסים',
  },

  {
    id: 'guardian-appointment-property',
    title: 'מינוי אפוטרופוס בתחום הרכושי',
    category: 'guardianship',
    content: `אפוטרופסות בתחום הרכושי: אני מבקש{{testator_gender_suffix}} למנות את {{guardian_full_name}} (להלן: "{{guardian_short_name}}") בעל{{guardian_gender_suffix}} תעודת זהות מספר {{guardian_id}}, לאפוטרופוס יחיד{{guardian_gender_suffix}} ובלעדי{{guardian_gender_suffix}} בתחום הרכושי של {{child_first_name}}.`,
    variables: [
      'testator_gender_suffix', 'guardian_full_name', 'guardian_short_name',
      'guardian_gender_suffix', 'guardian_id', 'child_first_name'
    ],
    aiPrompt: `מינוי אפוטרופוס רכושי. משתנים:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר (למצווה)
- guardian_full_name: שם מלא של האפוטרופוס
- guardian_short_name: שם מקוצר
- guardian_gender_suffix: "ת" לנקבה, ריק לזכר (לאפוטרופוס)
- guardian_id: תעודת זהות
- child_first_name: שם הילד/ה

אפוטרופוס רכושי מנהל את הכספים והנכסים של הקטין.`,
    usageInstructions: 'מינוי אפוטרופוס לניהול רכוש הקטין',
  },

  {
    id: 'guardian-appointment-personal',
    title: 'מינוי אפוטרופוס בתחום האישי',
    category: 'guardianship',
    content: `אפוטרופסות בתחום האישי: אני מבקש{{testator_gender_suffix}} למנות את {{guardian_full_name}} לאפוטרופוס בתחום האישי של {{child_first_name}}.`,
    variables: ['testator_gender_suffix', 'guardian_full_name', 'child_first_name'],
    aiPrompt: `מינוי אפוטרופוס אישי. משתנים:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר (למצווה)
- guardian_full_name: שם מלא
- child_first_name: שם הילד/ה

אפוטרופוס אישי אחראי על החינוך, הבריאות והרווחה היומיומית.`,
    usageInstructions: 'מינוי אפוטרופוס לטיפול אישי בקטין',
  },

  {
    id: 'guardian-appointment-medical-joint',
    title: 'מינוי אפוטרופסים משותפים בתחום הרפואי',
    category: 'guardianship',
    content: `אפוטרופסות בתחום הרפואי: אני מבקש{{testator_gender_suffix}} למנות את {{guardian1_name}} ו{{guardian2_name}} כאפוטרופסים משותפים בתחום הרפואי של {{child_first_name}}, כאשר הם יפעלו ביחד ולחוד בקבלת החלטות רפואיות בעבור{{child_gender_suffix}}.`,
    variables: [
      'testator_gender_suffix', 'guardian1_name', 'guardian2_name',
      'child_first_name', 'child_gender_suffix'
    ],
    aiPrompt: `מינוי שני אפוטרופסים משותפים לנושאים רפואיים. משתנים:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר (למצווה)
- guardian1_name, guardian2_name: שמות מלאים
- child_first_name: שם הילד/ה
- child_gender_suffix: "ה" לנקבה, "ו" לזכר

"ביחד ולחוד" = כל אחד יכול לפעול לבד אך מומלץ ביחד.`,
    usageInstructions: 'מינוי שני אפוטרופסים משותפים להחלטות רפואיות',
  },

  {
    id: 'guardian-appointment-reasons',
    title: 'נימוקים למינוי האפוטרופוס',
    category: 'guardianship',
    content: `מינוי {{guardian_relationship}} {{guardian_first_name}} נעשה בהתבסס על {{reasons_list}}.`,
    variables: ['guardian_relationship', 'guardian_first_name', 'reasons_list'],
    aiPrompt: `הסבר מדוע נבחר האפוטרופוס. משתנים:

- guardian_relationship: "אחי" / "אחותי" / "חברי הטוב" וכו'
- guardian_first_name: שם פרטי
- reasons_list: רשימת נימוקים, למשל:
  "קרבתו אלי כאח יקר, הקשר החם והמיוחד שיש לו עם [ילד] מאז לידת[ה], 
   כישוריו האישיים והמקצועיים המצוינים, יושרתו הרבה, יכולתו הכלכלית הטובה,
   ובעיקר מהתרשמותי העמוקה כי הוא אדם אחראי ונאמן..."

הנימוקים צריכים להיות כנים ומשכנעים.`,
    usageInstructions: 'הסבר למה נבחר האפוטרופוס - מומלץ מאוד להוסיף',
  },

  {
    id: 'guardian-alternate-full-custody',
    title: 'אפוטרופוס חלופי - אפוטרופסות מלאה',
    category: 'guardianship',
    content: `במידה ו{{primary_guardian_name}} ילך לעולמו בחיי הקטינ{{child_gender_suffix}} {{child_first_name}}, {{alternate_guardian_name}} יקבל עליו אפוטרופסות מלאה ויחידה על {{child_first_name}} בכל התחומים - הרכושי, האישי והרפואי.`,
    variables: [
      'primary_guardian_name', 'child_gender_suffix', 'child_first_name', 
      'alternate_guardian_name'
    ],
    aiPrompt: `תוכנית גיבוי למקרה פטירת האפוטרופוס הראשי. משתנים:

- primary_guardian_name: שם האפוטרופוס הראשי
- child_gender_suffix: "ה" לנקבה, ריק לזכר
- child_first_name: שם הילד/ה
- alternate_guardian_name: שם האפוטרופוס החלופי

חשוב מאוד להגדיר גיבוי במקרה של אפוטרופוס יחיד.`,
    usageInstructions: 'גיבוי למקרה פטירת האפוטרופוס הראשי - חשוב מאוד',
  },

  // ניהול רכוש קטינים
  {
    id: 'minors-bank-account-setup',
    title: 'פתיחת חשבון בנק לקטין',
    category: 'minors-property-management',
    content: `{{guardian_name}} יפתח חשבון בנק על שם {{child_first_name}}, ובו יופקדו כל הכספים והסכומים המגיעים ל{{child_pronoun}} מתוקף צוואתי זו. תוקם הערה בסניף הבנק בדבר היותו של {{guardian_name}} אפוטרופוס של {{child_first_name}}.`,
    variables: ['guardian_name', 'child_first_name', 'child_pronoun'],
    aiPrompt: `הוראה לפתיחת חשבון בנק לקטין. משתנים:

- guardian_name: שם האפוטרופוס (מקוצר)
- child_first_name: שם הילד/ה
- child_pronoun: "לה" לנקבה, "לו" לזכר

חשוב: הכספים יופקדו בחשבון על שם הקטין, לא האפוטרופוס.`,
    usageInstructions: 'הוראה לפתיחת חשבון בנק לקטין',
  },

  {
    id: 'minors-investment-guidelines-safe',
    title: 'הנחיות השקעה בטוחות',
    category: 'minors-property-management',
    content: `בנוגע לכספים הנזילים שיצטברו בחשבון הבנק של {{child_first_name}}, על {{guardian_name}} מוטלת החובה להשקיעם בתבונה ובאחריות במסלולי השקעה סולידיים ובטוחים. האפוטרופוס יקפיד להשקיע את הכספים בקרנות נאמנות מוכרות ומבוססות, בפיקדונות בנקאיים, ובכל מסלול השקעה אחר הנחשב לבטוח ויציב.`,
    variables: ['child_first_name', 'guardian_name'],
    aiPrompt: `הנחיות להשקעה בטוחה של כספי הקטין. אם נדרש שינוי:

הצע 2-3 אפשרויות:
אפשרות א': שמרני מאוד - רק בנקים וקרנות סולידיות
אפשרות ב': מאוזן - גם מניות בחברות גדולות
אפשרות ג': עם פירוט נוסף של אחוזים (כמה באחוזים לכל סוג)

משתנים:
- child_first_name: שם הילד/ה
- guardian_name: שם האפוטרופוס

חשוב: ההנחיות צריכות להגן על הכספים ולהגדילם באופן יציב.`,
    usageInstructions: 'הנחיות השקעה בטוחות לכספי קטין - מומלץ מאוד',
  },

  {
    id: 'minors-investment-prohibitions',
    title: 'איסורים על השקעות מסוכנות',
    category: 'minors-property-management',
    content: `האפוטרופוס יימנע{{guardian_plural_suffix}} מהשקעות ספקולטיביות, מסוכנות או קיצוניות, במטבעות דיגיטליים, בחברות סטארט-אפ או בכל נכס אחר הכרוך בסיכון גבוה. המטרה היא לשמור על ערך הכספים ולהגדילם בהדרגה תוך מזעור הסיכונים, על מנת להבטיח ל{{child_first_name}} בסיס כלכלי יציב ובטוח לעתיד{{child_gender_suffix}}.`,
    variables: ['guardian_plural_suffix', 'child_first_name', 'child_gender_suffix'],
    aiPrompt: `איסורים ברורים על השקעות מסוכנות. משתנים:

- guardian_plural_suffix: "ו" אם יש יותר מאפוטרופוס אחד, ריק ליחיד
- child_first_name: שם הילד/ה
- child_gender_suffix: "ה" לנקבה, "ו" לזכר

אם נדרש, אפשר להוסיף/להסיר סוגי השקעות אסורות, אך שמור על העקרון:
איסור מוחלט על השקעות בסיכון גבוה.`,
    usageInstructions: 'איסורים על השקעות מסוכנות - חשוב להוסיף',
  },

  {
    id: 'minors-guardian-child-consultation',
    title: 'התייעצות עם הקטין',
    category: 'minors-property-management',
    content: `האפוטרופוס {{guardian_name}} יהיה קשוב לצרכי{{child_gender_suffix}} הייחודיים של {{child_first_name}} ויפעל לטובת{{child_gender_suffix}} המרבית. {{guardian_name}} יתייעץ עם {{child_first_name}} בהתאם לגיל{{child_gender_suffix}} ולבגרות{{child_gender_suffix}} בנוגע להחלטות, ויתחשב ברצונותי{{child_gender_suffix}} ובעדיפויותי{{child_gender_suffix}} ככל שהדבר סביר ומתאים.`,
    variables: ['guardian_name', 'child_gender_suffix', 'child_first_name'],
    aiPrompt: `הוראה להתייעצות עם הקטין בהתאם לגילו. משתנים:

- guardian_name: שם האפוטרופוס
- child_gender_suffix: "ה" לנקבה, "ו" לזכר
- child_first_name: שם הילד/ה

זהו עקרון חשוב - הקטין צריך להיות שותף להחלטות ככל שהוא מבין.`,
    usageInstructions: 'הוראה להתייעצות עם הקטין - מומלץ להוסיף',
  },

  {
    id: 'minors-education-priority',
    title: 'עדיפות להשכלה',
    category: 'minors-property-management',
    content: `הואיל ואני רואה{{testator_gender_suffix}} חשיבות רבה בהשכלה ובפיתוח אישי, האפוטרופוס {{guardian_name}} יקדיש תשומת לב מיוחדת להוצאות החינוכיות ולפעילויות העשויות לקדם את התפתחות{{child_gender_suffix}} האישית והמקצועית של {{child_first_name}}.`,
    variables: ['testator_gender_suffix', 'guardian_name', 'child_gender_suffix', 'child_first_name'],
    aiPrompt: `הדגשת חשיבות ההשכלה. משתנים:

- testator_gender_suffix: "ה" לנקבה, ריק לזכר (למצווה)
- guardian_name: שם האפוטרופוס
- child_gender_suffix: "ה" לנקבה, "ו" לזכר (לילד)
- child_first_name: שם הילד/ה

אם נדרש, אפשר להוסיף פירוט של סוגי פעילויות (ספורט, אמנות, מוזיקה וכו').`,
    usageInstructions: 'הדגשת חשיבות ההשכלה - מומלץ להוסיף',
  },

  {
    id: 'minors-transfer-at-age-18',
    title: 'העברת רכוש בגיל 18',
    category: 'minors-property-management',
    content: `עם הגיע{{child_gender_suffix}} של {{child_first_name}} לגיל 18 (שמונה עשרה) שנים, יועבר אלי{{child_gender_suffix}} מלוא הרכוש והשליטה בחשבון הבנק תוך {{transfer_days}} יום.`,
    variables: ['child_gender_suffix', 'child_first_name', 'transfer_days'],
    aiPrompt: `העברת הרכוש לקטין כשהופך לבגיר. משתנים:

- child_gender_suffix: "ה" לנקבה, ריק לזכר
- child_first_name: שם הילד/ה
- transfer_days: מספר ימים (בד"כ 30)

ברגע שהקטין מגיע לגיל 18, הוא בגיר והרכוש עובר אליו.`,
    usageInstructions: 'העברת רכוש בגיל 18 - חובה להגדיר',
  },

  {
    id: 'minors-financial-education-at-18',
    title: 'הדרכה פיננסית בגיל 18',
    category: 'minors-property-management',
    content: `{{guardian_name}} יעביר ל{{child_first_name}} הדרכה מקיפה בנוגע לניהול החשבון הבנקאי, לרבות:
- הסבר על מצב החשבון הקיים ופעילותו
- הדרכה בנוגע לעקרונות ניהול כספי אחראי ותקציב אישי
- הכרת השירותים הבנקאיים הזמינים והדרכים לניהול החשבון
- הסבר על החובות והזכויות הכספיות`,
    variables: ['guardian_name', 'child_first_name'],
    aiPrompt: `הדרכה פיננסית בסיסית בגיל 18. משתנים:

- guardian_name: שם האפוטרופוס
- child_first_name: שם הילד/ה

אם נדרש, אפשר להוסיף/להסיר נושאים, אך שמור על העקרון:
הדרכה בסיסית לניהול כספים.`,
    usageInstructions: 'הדרכה פיננסית בגיל 18 - מומלץ מאוד להוסיף',
  },

  {
    id: 'minors-ongoing-guidance-after-18',
    title: 'ליווי מתמשך אחרי גיל 18',
    category: 'minors-property-management',
    content: `{{guardian_name}} יעמוד לרשות{{child_gender_suffix}} של {{child_first_name}} לייעוץ והדרכה נוספים במשך {{guidance_years}} שנים נוספות לאחר מסירת הרכוש, או עד ש{{child_first_name}} תבקש{{child_gender_suffix}} להפסיק את הליווי. הליווי יכלול סיוע בניהול תקציב, ייעוץ בהחלטות כספיות יומיומיות, ותמיכה בפתרון בעיות בנקאיות שעלולות להתעורר.`,
    variables: ['guardian_name', 'child_gender_suffix', 'child_first_name', 'guidance_years'],
    aiPrompt: `ליווי מתמשך גם אחרי גיל 18. משתנים:

- guardian_name: שם האפוטרופוס
- child_gender_suffix: "ה" לנקבה, ריק לזכר
- child_first_name: שם הילד/ה
- guidance_years: מספר שנים (בד"כ 2-3)

זה מאוד חשוב - מעבר לבגרות הוא פתאומי, וטוב שיהיה ליווי.`,
    usageInstructions: 'ליווי אחרי גיל 18 - מומלץ מאוד להוסיף',
  },

  // תנאים והגבלות מיוחדים
  {
    id: 'residence-sale-age-restriction',
    title: 'הגבלת מכירת דירת מגורים לפי גיל',
    category: 'special-conditions',
    content: `במידה ותהיה בבעלותי דירת מגורים בעת פטירתי, הרי שדירה זו תועבר לבעלות{{heir_gender_suffix}} המלאה של {{heir_first_name}}. אולם, {{heir_first_name}} תוכל{{heir_gender_suffix}} למכור את הדירה רק החל מיום הגיע{{heir_gender_suffix}} לגיל {{minimum_sale_age}} ({{minimum_sale_age_words}}) שנים, ובתנאי מוקדם ומוחלט שתרכוש דירת מגורים חלופית בסכום שלא יפחת מ{{minimum_replacement_percentage}}% ({{minimum_replacement_percentage_words}} אחוזים) מהתמורה שתתקבל ממכירת הדירה. 

{{heir_first_name}} תהיה רשאי{{heir_gender_suffix}} לרכוש דירת מגורים חלופית בשווי נמוך מהדירה הנמכרת ולהשתמש ביתרת התמורה לפי שיקול דעת{{heir_gender_suffix}} הבלעדי, בתנאי שמחיר הדירה החלופית לא יפחת מהאחוז האמור, או לחלופין לרכוש דירת מגורים חלופית בשווי גבוה יותר ולהשלים את הפרש המחיר ממקורותי{{heir_gender_suffix}} שלה. 

בהגיע{{heir_gender_suffix}} לגיל {{unrestricted_sale_age}} ({{unrestricted_sale_age_words}}) שנים, {{heir_first_name}} תהיה רשאי{{heir_gender_suffix}} למכור את הדירה באופן חופשי וללא כל הגבלה.`,
    variables: [
      'heir_gender_suffix', 'heir_first_name', 'minimum_sale_age', 'minimum_sale_age_words',
      'minimum_replacement_percentage', 'minimum_replacement_percentage_words',
      'unrestricted_sale_age', 'unrestricted_sale_age_words'
    ],
    aiPrompt: `הגבלה מורכבת על מכירת דירת מגורים לפי גיל. זהו סעיף ייחודי וחשוב מאוד.

הצע 2-3 אפשרויות:
אפשרות א': הגבלה חזקה (כמו המקור) - מגיל 21 עם דירה חלופית, חופשי מגיל 30
אפשרות ב': הגבלה מתונה יותר - מגיל 21 עם 70% לדירה חלופית, חופשי מגיל 25
אפשרות ג': הגבלה קלה - מגיל 18 עם דירה חלופית, חופשי מגיל 25

משתנים:
- heir_gender_suffix: "ה" לנקבה, ריק לזכר
- heir_first_name: שם היורש
- minimum_sale_age: גיל מינימום למכירה (מספר)
- minimum_sale_age_words: אותו גיל במילים
- minimum_replacement_percentage: אחוז מינימום לדירה חלופית
- minimum_replacement_percentage_words: האחוז במילים
- unrestricted_sale_age: גיל למכירה חופשית
- unrestricted_sale_age_words: אותו גיל במילים

זהו סעיף מגן - מונע ממנו למכור דירה ולבזבז הכסף בצעירות.`,
    usageInstructions: 'הגבלה על מכירת דירה - חשוב במיוחד ליורשים צעירים',
  },

  {
    id: 'real-estate-absolute-prohibition',
    title: 'איסור מוחלט על פעולות במקרקעין',
    category: 'property-restrictions',
    content: `אני קובע{{testator_gender_suffix}} בזאת איסור מוחלט ובלתי חוזר על האפוטרופוס לבצע כל אחת מהפעולות הבאות ביחס לכל נכס מקרקעין שיהיה ברשותי בעתיד, בין אם יירכש על ידי, בין אם יתקבל על ידי בירושה, במתנה או בכל דרך אחרת:

- מכירה, העברה או הקצאה של הנכס בכל צורה שהיא
- שעבוד הנכס או יצירת זכויות צד שלישי עליו
- חלוקה או חיסול של הנכס
- נטילת משכנתא או כל הלוואה אחרת הנתחמה לנכס או בערבותו
- הענקת הנכס במתנה או העברתו ללא תמורה כספית מלאה
- מתן ערבות כלשהי הקשורה לנכס או מבוססת עליו
- וכן כל פעולה משפטית אחרת העלולה לפגוע בזכויותי{{heir_gender_suffix}} של {{heir_first_name}} בנכסים האמורים

הגבלות אלו נועדו להבטיח את שמירת כל נכסי המקרקעין שיגיעו לרשותי בכל דרך שהיא לטובת {{heir_first_name}} ולעתיד{{heir_gender_suffix}} הכלכלי.`,
    variables: ['testator_gender_suffix', 'heir_gender_suffix', 'heir_first_name'],
    aiPrompt: `איסור מוחלט ומקיף על כל פעולה במקרקעין. זהו סעיף מגן חזק מאוד.

הצע 2 אפשרויות:
אפשרות א': איסור מוחלט (כמו המקור) - מומלץ במצבים רגישים
אפשרות ב': איסור עם חריגים מוגדרים (למשל: מכירה באישור בית משפט)

משתנים:
- testator_gender_suffix: "ת" לנקבה, ריק לזכר (למצווה)
- heir_gender_suffix: "ה" לנקבה, "ו" לזכר (ליורש)
- heir_first_name: שם היורש

הסעיף מפרט את כל הפעולות האסורות - וודא שהרשימה מקיפה.

זהו סעיף חשוב במיוחד כשיש חשש שהאפוטרופוס יפגע בנכסים.`,
    usageInstructions: 'איסור מוחלט על פעולות במקרקעין - חשוב מאוד במצבים רגישים',
  },

  {
    id: 'education-fund-use-from-age-18',
    title: 'שימוש בכספים להשכלה מגיל 18',
    category: 'special-conditions',
    content: `מהגיע{{heir_gender_suffix}} לגיל 18 (שמונה עשרה) שנים, {{heir_first_name}} תוכל{{heir_gender_suffix}} להשתמש בכספים הללו על מנת לרכוש השכלה גבוהה, לרבות לימודים אקדמיים, קורסים מקצועיים או הכשרות אחרות העשויות לקדם את עתיד{{heir_gender_suffix}} המקצועי.`,
    variables: ['heir_gender_suffix', 'heir_first_name'],
    aiPrompt: `אפשרות לשימוש בכספים להשכלה החל מגיל 18. משתנים:

- heir_gender_suffix: "ה" לנקבה, ריק לזכר
- heir_first_name: שם היורש

זהו עידוד חשוב להשקעה בהשכלה.`,
    usageInstructions: 'עידוד שימוש בכספים להשכלה - מומלץ להוסיף',
  },

  {
    id: 'guardian-duties-and-obligations',
    title: 'חובות ומטרות האפוטרופוס',
    category: 'minors-property-management',
    content: `האפוטרופוס יפעל תמיד לטובת{{child_gender_suffix}} הטובה ביותר של {{child_first_name}}, יקפיד על ניהול נכסי{{child_gender_suffix}} בשקידה ובאחריות, וידווח לאפוטרופוס הכללי על פעולותיו כנדרש בחוק. {{additional_cooperation}}`,
    variables: ['child_gender_suffix', 'child_first_name', 'additional_cooperation'],
    aiPrompt: `הגדרת חובות האפוטרופוס. משתנים:

- child_gender_suffix: "ה" לנקבה, "ו" לזכר
- child_first_name: שם הילד/ה
- additional_cooperation: 
  * ריק (אם אין הורה שני)
  * "הוא יפעל לשמירת קשר תקין ועבודה משותפת עם [שם הורה שני]." (אם יש)

חשוב: האפוטרופוס חייב לדווח לאפוטרופוס הכללי על פעולותיו.`,
    usageInstructions: 'הגדרת חובות האפוטרופוס - מומלץ להוסיף',
  },

  {
    id: 'provisions-if-heir-adult-at-death',
    title: 'הוראות אם היורש כבר בגיר בעת הפטירה',
    category: 'special-conditions',
    content: `למען הסר ספק, במידה ובעת פטירתי תהיה {{heir_first_name}} {{heir_relationship}} מעל גיל 18, הרי שהוראות הצוואה לגבי רכוש{{heir_gender_suffix}} יחולו כפי שנקבעו לגבי אדם בגיר, וכל ההוראות הנוגעות למינוי אפוטרופוס ולניהול רכוש{{heir_gender_suffix}} עד גיל 18 יהיו בטלות ומבוטלות. במקרה זה, יש להתייחס להוראות הצוואה הנוגעות לתקופה שבין גיל 18 לגיל {{restricted_age}}, ו{{heir_first_name}} תירש{{heir_gender_suffix}} את חלק{{heir_gender_suffix}} ברכושי בהתאם להוראות אלו.`,
    variables: [
      'heir_first_name', 'heir_relationship', 'heir_gender_suffix', 'restricted_age'
    ],
    aiPrompt: `הבהרה חשובה - מה קורה אם היורש כבר בגיר בעת הפטירה. משתנים:

- heir_first_name: שם היורש
- heir_relationship: "בתי" / "בני"
- heir_gender_suffix: "ה" לנקבה, "ו" לזכר
- restricted_age: הגיל שעד אליו יש הגבלות (למשל 30)

זה חשוב - אם היורש כבר בגיר, אין צורך באפוטרופוס.`,
    usageInstructions: 'הבהרה למקרה שהיורש כבר בגיר - חשוב להוסיף',
  },

  // יורשים חלופיים
  {
    id: 'heir-predeceased-grandchildren',
    title: 'יורשים חלופיים - נכדים',
    category: 'substitution',
    content: `אם בעת פטירתי לא תהיה {{heir_first_name}} בחיים חו"ח ותשאיר אחרי{{heir_gender_suffix}} ילדים ({{grandchildren_relation}}), תינתן חלק{{heir_gender_suffix}} בצוואה זו לילדי{{heir_gender_suffix}} בחלקים שווים ביניהם.`,
    variables: ['heir_first_name', 'heir_gender_suffix', 'grandchildren_relation'],
    aiPrompt: `יורשים חלופיים במקרה פטירת היורש. משתנים:

- heir_first_name: שם היורש
- heir_gender_suffix: "ה" לנקבה, "ו" לזכר
- grandchildren_relation: "נכדיי" / "נכדותיי" / "נכדי ונכדותיי"

זהו עקרון חשוב - אם היורש נפטר, ילדיו יורשים במקומו.`,
    usageInstructions: 'יורשים חלופיים - נכדים במקרה פטירת היורש',
  },

  {
    id: 'heir-predeceased-no-children-alternate',
    title: 'יורשים חלופיים - במקרה אין ילדים',
    category: 'substitution',
    content: `במקרה שלא יהיו ל{{heir_pronoun}} ילדים, חלק{{heir_gender_suffix}} המגיע ל{{heir_pronoun}} מצוואה זו תינתן ל{{alternate_heirs_list}} בחלוקה {{distribution_method}}.`,
    variables: ['heir_pronoun', 'heir_gender_suffix', 'alternate_heirs_list', 'distribution_method'],
    aiPrompt: `יורשים חלופיים אם אין ילדים. משתנים:

- heir_pronoun: "לה" / "לו"
- heir_gender_suffix: "ה" לנקבה, "ו" לזכר
- alternate_heirs_list: רשימת היורשים החלופיים עם פרטים
  דוגמה: "אחיי מאיר שלום בלס בעל תעודת זהות מספר 039037429 
          ודודי ארוין בלס בעל תעודת זהות מספר 039037411"
- distribution_method: "שווה" / "לפי [פירוט]"

חשוב להגדיר מה קורה אם היורש נפטר ללא ילדים.`,
    usageInstructions: 'יורשים חלופיים במקרה אין ילדים - חשוב להגדיר',
  },

  {
    id: 'heir-predeceased-before-testator',
    title: 'פטירת יורש לפני המצווה',
    category: 'substitution',
    content: `במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.`,
    variables: [],
    aiPrompt: `כלל כללי למקרה פטירת יורש. אם נדרש שינוי:

הצע 2 אפשרויות:
אפשרות א': יעבור ליורשיו החוקיים (כמו המקור)
אפשרות ב': יעבור לילדיו בחלקים שווים (יותר ספציפי)

זהו סעיף גיבוי חשוב.`,
    usageInstructions: 'כלל כללי לפטירת יורש - מומלץ להוסיף',
  },

  // קופות גמל
  {
    id: 'pension-funds-to-registered-beneficiaries',
    title: 'קופות חיסכון למוטבים רשומים',
    category: 'pension-funds',
    content: `כל זכויות החיסכון והביטוח המצויות בקופות הגמל, קרנות הפנסיה, קופות התגמולים, קרנות ההשתלמות, תוכניות החיסכון, פוליסות ביטוח החיים וכל מוצר פיננסי אחר (להלן: "הקופות") ישולמו למוטבים הרשומים בקופות במועד הפטירה, וזאת בהתאם לרישום בפועל בקופות במועד הפטירה.`,
    variables: [],
    aiPrompt: `הבהרה שקופות חיסכון עוברות למוטבים הרשומים, לא דרך הצוואה.

זהו סעיף סטנדרטי וחשוב - מבהיר שקופות לא עוברות דרך הצוואה אלא למוטבים.

אם נדרש שינוי, שמור על העיקרון הזה.`,
    usageInstructions: 'הבהרה על קופות חיסכון - מומלץ להוסיף',
  },

  // סילוקין (No Contest Clause)
  {
    id: 'no-contest-clause-full',
    title: 'סעיף סילוקין מלא',
    category: 'no-contest',
    content: `כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ולא יקבל דבר מעזבוני. יורש שיפר את תנאי הסילוקין הנ"ל יקבל סכום סימלי של שקל אחד (₪1) בלבד, וזאת במקום כל זכות או טענה שתהיה לו בעזבוני. תנאי זה יחול גם על מי שפועל בשמו של היורש או מטעמו, וכן על כל מי שיסייע או יעודד התנגדות לצוואה זו.`,
    variables: [],
    aiPrompt: `סעיף סילוקין (No Contest Clause) - מונע ערעורים על הצוואה.

הצע 2-3 אפשרויות:
אפשרות א': סילוקין חזק (כמו המקור) - אובדן מלא של הזכויות
אפשרות ב': סילוקין מתון - הפחתת חלק בירושה ל-50%
אפשרות ג': סילוקין עם חריגים - לא חל על שאלות תום לב

זהו סעיף חזק מאוד - מרתיע מערעורים.

חשוב: בישראל יש ויכוח משפטי על תוקפם של סעיפי סילוקין, אך הם עדיין מרתיעים.`,
    usageInstructions: 'סעיף סילוקין - מונע ערעורים, השתמש במצבים רגישים',
  },

  // הוראות כלליות
  {
    id: 'execution-in-good-spirit',
    title: 'הוראה לביצוע ברוח טובה',
    category: 'general',
    content: `הנני מצווה{{testator_gender_suffix}}, כי ביצוע וקיום צוואה זו יהא ברוח טובה בשיתוף פעולה הדדי בין היורשים.`,
    variables: ['testator_gender_suffix'],
    aiPrompt: `בקשה שהיורשים יבצעו את הצוואה ברוח טובה. משתנה:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר

זהו סעיף חשוב - מעודד שיתוף פעולה.`,
    usageInstructions: 'בקשה לביצוע ברוח טובה - מומלץ להוסיף',
  },

  {
    id: 'execution-without-delay',
    title: 'הוראה לביצוע ללא עיכוב',
    category: 'general',
    content: `הנני מביע{{testator_gender_suffix}} את רצוני, כי ביצוע צוואתי זו יעשה ללא השעיה ועיכובים.`,
    variables: ['testator_gender_suffix'],
    aiPrompt: `בקשה לביצוע מהיר. משתנה:

- testator_gender_suffix: "ת" לנקבה, ריק לזכר

סעיף קצר המבקש ביצוע מהיר.`,
    usageInstructions: 'בקשה לביצוע מהיר - אופציונלי',
  },

  // מסר אישי
  {
    id: 'personal-message-to-child',
    title: 'מסר אישי לילד/ה',
    category: 'personal-message',
    content: `מסר אישי ל{{child_first_name}}

{{personal_message}}`,
    variables: ['child_first_name', 'personal_message'],
    aiPrompt: `כתוב מסר חם, אישי ומרגש מהמצווה לילדו/ה בעברית טבעית ונוגעת ללב.

הצע 3 אפשרויות שונות:

**אפשרות א' - רגשית ומפורטת (150-200 מילים):**
- התחל בפנייה אישית (אם ניתן שם, השתמש בו)
- הזכר רגעים משמעותיים או תכונות מיוחדות
- הדגש את האהבה, הגאווה והברכה
- סיים בבקשה או מסר משמעותי

**אפשרות ב' - תמציתית וחמה (80-100 מילים):**
- ממוקדת ובלב
- התמקד במסר המרכזי: אהבה, גאווה, המשך הדרך
- פשוט אך עמוק

**אפשרות ג' - משלבת ציטוט או פתגם (120-150 מילים):**
- התחל או סיים עם ציטוט/פתגם יהודי או אישי מתאים
- שלב את הציטוט באופן טבעי במסר
- הוסף את הקול האישי של ההורה

**בכל אפשרות:**
- כתוב בעברית טבעית ואמיתית (לא מתורגמת!)
- הימנע מקלישאות ("אתה האור בחיי" וכו')
- שמור על טון כן, חם, אותנטי ומכבד
- התאם את הטון לגיל הילד (תינוק/ילד/מתבגר/בוגר)
- אל תהיה מלודרמטי - פשוט וכן

דוגמאות לפתיחות טבעיות:
✓ "[שם], ילדי היקר"
✓ "בתי/בני האהוב"
✓ "[שם] שלי"

דוגמאות לסיום:
✓ "באהבה נצחית, אבא/אמא"
✓ "לעד בליבי, [שם]"

משתנים:
- child_first_name: שם הילד/ה
- personal_message: התוכן שה-AI ייצור

התאם את התוכן למצב:
- אם הילד תינוק/קטן - התמקד באהבה ובברכה לעתיד
- אם הילד גדול יותר - אפשר להזכיר זיכרונות משותפים`,
    usageInstructions: 'מסר אישי לילד/ה - מומלץ מאוד להוסיף',
  },

  {
    id: 'personal-message-to-multiple-children',
    title: 'מסר אישי למספר ילדים',
    category: 'personal-message',
    content: `מסר אישי לילדיי

{{personal_message}}`,
    variables: ['personal_message'],
    aiPrompt: `כתוב מסר חם ואישי למספר ילדים בעברית טבעית.

הצע 3 אפשרויות:

**אפשרות א' - מסר משותף עם התייחסות לכל ילד:**
- התחל בפנייה משותפת לכולם
- התייחס לכל ילד בנפרד (2-3 משפטים לכל אחד)
- סיים במסר משותף על אחווה וקשר משפחתי

**אפשרות ב' - מסר משותף כללי:**
- פנייה לכולם ביחד
- מסר על אהבה, גאווה, חשיבות הקשר ביניהם
- תמציתי וחם (100-150 מילים)

**אפשרות ג' - מסר עם ציטוט:**
- התחל עם פתגם על משפחה/אחווה
- מסר אישי חם
- עידוד לשמור על הקשר ביניהם

השתמש בשמות הילדים אם ניתנו.
הדגש את חשיבות הקשר ביניהם.`,
    usageInstructions: 'מסר אישי למספר ילדים - מומלץ מאוד',
  },

  {
    id: 'personal-message-to-heir',
    title: 'מסר אישי ליורש (לא ילד)',
    category: 'personal-message',
    content: `מסר אישי ל{{heir_first_name}}

{{personal_message}}`,
    variables: ['heir_first_name', 'personal_message'],
    aiPrompt: `כתוב מסר אישי ליורש שהוא לא ילד (אח, חבר, קרוב משפחה אחר).

הצע 2-3 אפשרויות:

**אפשרות א' - חם ומלא תודה:**
- הכרת תודה על הקשר
- הזכרת רגעים משמעותיים
- ברכה לעתיד

**אפשרות ב' - תמציתי וכן:**
- פנייה אישית
- תודה והערכה
- ברכה קצרה

**אפשרות ג' - עם הסבר להחלטה:**
- הסבר מדוע בחרת להוריש לו/לה
- הערכה לקשר
- ברכה

התאם את הטון לקשר:
- אח/אחות - משפחתי וחם
- חבר קרוב - אישי ומלא הערכה
- קרוב משפחה - מכבד וחם

משתנה:
- heir_first_name: שם היורש`,
    usageInstructions: 'מסר אישי ליורש שאינו ילד - מומלץ להוסיף',
  },

  // סגירה
  {
    id: 'testator-declaration-full',
    title: 'הצהרת המצווה המלאה',
    category: 'closing',
    content: `ולראיה באתי על החתום מרצוני הטוב והחופשי, בהיותי בדעה צלולה ולאחר שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר שהצהרתי בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתי.

נחתם ב{{signing_location}}, היום: {{signing_day}}, לחודש: {{signing_month}}, שנת: {{signing_year}}.


{{testator_signature_line}}`,
    variables: [
      'signing_location', 'signing_day', 'signing_month', 'signing_year',
      'testator_signature_line'
    ],
    aiPrompt: `הצהרת המצווה הסופית. משתנים:

- signing_location: מקום החתימה (עיר)
- signing_day, signing_month, signing_year: תאריך
- testator_signature_line: שורת חתימה עם שם המצווה

זהו סעיף סטנדרטי וחובה - לא לשנות אלא אם יש סיבה טובה מאוד.`,
    usageInstructions: 'הצהרת המצווה - חובה בכל צוואה',
  },

  {
    id: 'testator-declaration-extended',
    title: 'הצהרת המצווה מורחבת',
    category: 'closing',
    content: `ולראיה באתי על החתום מרצוני הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות נתון לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאינני סובל מאיזו חולשה גופנית או רוחנית הגורעת או המונעת ממני את כושרי המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרתי בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתי, וביקשתי מהן לאשר בחתימתן שכך הצהרתי וחתמתי בפניהן.

נחתם ב{{signing_location}}, היום: {{signing_day}}, לחודש: {{signing_month}}, שנת: {{signing_year}}


{{testator_signature_line}}`,
    variables: [
      'signing_location', 'signing_day', 'signing_month', 'signing_year',
      'testator_signature_line'
    ],
    aiPrompt: `גרסה מורחבת של הצהרת המצווה, עם הדגשות נוספות על כשירות משפטית.

השתמש בגרסה זו במקרים שבהם יש חשש לערעור על כשירות המצווה.

משתנים זהים להצהרה הרגילה.`,
    usageInstructions: 'הצהרת מצווה מורחבת - השתמש במצבים רגישים',
  },

  {
    id: 'witnesses-attestation-standard',
    title: 'אישור עדים סטנדרטי',
    category: 'closing',
    content: `אנו הח"מ:
1. {{witness1_name}}, ת.ז. {{witness1_id}}, מרחוב: {{witness1_address}}
2. {{witness2_name}}, ת.ז. {{witness2_id}}, מרחוב: {{witness2_address}}

אנו מעידות בזאת שהמצווה: {{testator_name}}, נושא{{testator_gender_suffix}} ת.ז. מס' {{testator_id}}, חתם{{testator_gender_suffix}} בפנינו מרצונ{{testator_gender_suffix}} הטוב והחופשי והצהיר{{testator_gender_suffix}} כי זו צוואת{{testator_gender_suffix}}. אנו מצהירות כי אנו לא קטינות ולא פסולות דין וכי אין לאף אחת מאיתנו כל טובת הנאה בעיזבון של המצווה. אנו חותמות בתור עדות לצוואה בנוכחות{{testator_gender_suffix}} של המצווה ובנוכחות כל אחת מאיתנו.

ולראיה באנו על החתום היום: {{day}} לחודש: {{month}} שנת: {{year}}


{{witness1_signature_line}}		{{witness2_signature_line}}`,
    variables: [
      'witness1_name', 'witness1_id', 'witness1_address',
      'witness2_name', 'witness2_id', 'witness2_address',
      'testator_name', 'testator_gender_suffix', 'testator_id',
      'day', 'month', 'year',
      'witness1_signature_line', 'witness2_signature_line'
    ],
    aiPrompt: `אישור עדים סטנדרטי. משתנים רבים - וודא דיוק בכל הפרטים:

- witness1_*, witness2_*: פרטי העדים
- testator_*: פרטי המצווה
- testator_gender_suffix: "ה" לנקבה, ריק לזכר
- day, month, year: תאריך
- signature_line: שורות חתימה

זהו סעיף סטנדרטי וחובה - לא לשנות אלא אם יש צורך.`,
    usageInstructions: 'אישור עדים - חובה בכל צוואה',
  },

  {
    id: 'witnesses-attestation-extended',
    title: 'אישור עדים מורחב',
    category: 'closing',
    content: `אנו הח"מ:
1. {{witness1_name}}, ת.ז. {{witness1_id}}, מרחוב: {{witness1_address}}
2. {{witness2_name}}, ת.ז. {{witness2_id}}, מרחוב: {{witness2_address}}

אנו מעידות בזאת שהמצווה הנ"ל {{testator_title}} {{testator_name}}, הנושא{{testator_gender_suffix}} תעודת זהות {{testator_id}} חתם{{testator_gender_suffix}} בנוכחותנו על צוואת{{testator_gender_suffix}} הנ"ל לאחר שהצהיר{{testator_gender_suffix}} בפנינו שזאת צוואת{{testator_gender_suffix}} האחרונה שאותה עשה מרצונ{{testator_gender_suffix}} הטוב והחופשי בהיות{{testator_gender_suffix}} בדעה צלולה ובלי כל אונס או כפיה, וביקש{{testator_gender_suffix}} מאיתנו להיות עדות לחתימת{{testator_gender_suffix}} ולאשר בחתימת ידנו שכך הצהיר{{testator_gender_suffix}} וחתם{{testator_gender_suffix}} בפנינו. 

ועוד אנו מצהירות כי אנו לא קטינות ולא פסולות דין וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו חותמות ומאשרות בזה כי המצווה הנ"ל חתם{{testator_gender_suffix}} בפנינו על שטר צוואה זה לאחר שהצהיר{{testator_gender_suffix}} בפנינו כי זו צוואת{{testator_gender_suffix}} ובזה אנו חותמות בתור עדות לצוואה בנוכחות{{testator_gender_suffix}} של המצווה הנ"ל ובנוכחות כל אחת מאיתנו.

היום: {{day}}, לחודש: {{month}}, שנת: {{year}}



{{witness1_signature_line}}		{{witness2_signature_line}}`,
    variables: [
      'witness1_name', 'witness1_id', 'witness1_address',
      'witness2_name', 'witness2_id', 'witness2_address',
      'testator_title', 'testator_name', 'testator_gender_suffix', 'testator_id',
      'day', 'month', 'year',
      'witness1_signature_line', 'witness2_signature_line'
    ],
    aiPrompt: `אישור עדים מורחב עם פירוט מלא יותר.

משתנים נוספים:
- testator_title: "מר" / "גב'" / ריק
- שאר המשתנים כמו באישור הסטנדרטי

השתמש בגרסה זו במצבים רגישים או כשרוצים חיזוק משפטי נוסף.`,
    usageInstructions: 'אישור עדים מורחב - השתמש במצבים רגישים',
  },

  {
    id: 'lawyer-office-notation',
    title: 'ציון משרד עורך דין',
    category: 'closing',
    content: `
צוואה זו נערכה ונחתמה ב{{city}}, במשרדו של עו"ד {{lawyer_name}}`,
    variables: ['city', 'lawyer_name'],
    aiPrompt: `ציון משרד עורך הדין. משתנים:

- city: עיר
- lawyer_name: שם עורך הדין

זהו סעיף אופציונלי אך מומלץ - מוסיף אמינות.`,
    usageInstructions: 'ציון משרד עורך דין - אופציונלי אך מומלץ',
  },
];

/**
 * פונקציה לקבלת סעיפים לפי קטגוריה
 */
export function getSingleWillSectionsByCategory(category: string): SingleWillSectionTemplate[] {
  return singleWillsSectionsWarehouse.filter(section => section.category === category);
}

/**
 * פונקציה לחיפוש סעיפים
 */
export function searchSingleWillSections(query: string): SingleWillSectionTemplate[] {
  const lowerQuery = query.toLowerCase();
  return singleWillsSectionsWarehouse.filter(
    section =>
      section.title.toLowerCase().includes(lowerQuery) ||
      section.content.toLowerCase().includes(lowerQuery) ||
      section.usageInstructions.toLowerCase().includes(lowerQuery)
  );
}