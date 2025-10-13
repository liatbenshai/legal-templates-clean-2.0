/**
 * מדריך מקיף לעברית משפטית תקנית
 * 
 * המטרה: לתקן טקסטים שנוצרו על ידי AI (Claude, ChatGPT, Gemini)
 * שכותבים "עברית שהיא בעצם אנגלית מתורגמת" 
 * ולהפוך אותם לעברית משפטית אמיתית, תקנית ומקצועית
 */

export interface HebrewRule {
  id: string;
  category: 'prepositions' | 'conjunctions' | 'legal-terms' | 'word-order' | 'passive-voice' | 'formality' | 'structure' | 'common-errors';
  wrongPattern: string;
  correctPattern: string;
  explanation: string;
  examples: {
    wrong: string;
    correct: string;
  }[];
}

/**
 * כללי עברית משפטית תקנית
 */
export const legalHebrewRules: HebrewRule[] = [
  // 1. מילות יחס
  {
    id: 'subject-to',
    category: 'prepositions',
    wrongPattern: 'בכפוף ל',
    correctPattern: 'בהתאם ל / על פי / לפי',
    explanation: '"בכפוף ל" היא תרגום מילולי של "subject to" - בעברית תקנית אומרים "בהתאם ל" או "על פי"',
    examples: [
      {
        wrong: 'בכפוף להוראות החוק',
        correct: 'בהתאם להוראות החוק / על פי הוראות החוק'
      },
      {
        wrong: 'בכפוף לאישור בית המשפט',
        correct: 'באישור בית המשפט / בכפוף לאישור בית המשפט רק אם זה תנאי מקדים'
      }
    ]
  },

  {
    id: 'pursuant-to',
    category: 'prepositions',
    wrongPattern: 'בהתאם עם',
    correctPattern: 'בהתאם ל / על פי',
    explanation: 'אין "בהתאם עם" בעברית - רק "בהתאם ל"',
    examples: [
      {
        wrong: 'בהתאם עם ההסכם',
        correct: 'בהתאם להסכם'
      }
    ]
  },

  {
    id: 'regarding',
    category: 'prepositions',
    wrongPattern: 'בנוגע ל / לגבי / ביחס ל',
    correctPattern: 'באשר ל / בדבר / על / בעניין',
    explanation: 'בעברית משפטית תקנית משתמשים ב"באשר ל" או "בדבר" במקום "בנוגע ל" או "לגבי"',
    examples: [
      {
        wrong: 'בנוגע לנכס',
        correct: 'באשר לנכס / בדבר הנכס'
      },
      {
        wrong: 'לגבי התביעה',
        correct: 'באשר לתביעה / בעניין התביעה'
      }
    ]
  },

  // 2. מילות חיבור
  {
    id: 'however',
    category: 'conjunctions',
    wrongPattern: 'עם זאת, / יחד עם זאת, / למרות זאת,',
    correctPattern: 'אולם, / ואולם, / אף על פי כן, / עם זה,',
    explanation: '"עם זאת" פחות פורמלי - בעברית משפטית משתמשים ב"אולם" או "ואולם"',
    examples: [
      {
        wrong: 'עם זאת, התובע לא הוכיח',
        correct: 'אולם התובע לא הוכיח / ואולם התובע לא הוכיח'
      },
      {
        wrong: 'יחד עם זאת, יש לציין',
        correct: 'ואולם יש לציין / אף על פי כן יש לציין'
      }
    ]
  },

  {
    id: 'therefore',
    category: 'conjunctions',
    wrongPattern: 'לכן, / בגלל זה,',
    correctPattern: 'לפיכך, / משכך, / על כן, / מטעם זה,',
    explanation: 'בעברית משפטית גבוהה משתמשים ב"לפיכך" או "משכך" במקום "לכן"',
    examples: [
      {
        wrong: 'לכן, אני מורה',
        correct: 'לפיכך אני מורה / משכך אני מורה'
      },
      {
        wrong: 'בגלל זה אני דוחה',
        correct: 'מטעם זה אני דוחה / על כן אני דוחה'
      }
    ]
  },

  {
    id: 'additionally',
    category: 'conjunctions',
    wrongPattern: 'בנוסף, / גם,',
    correctPattern: 'כמו כן, / ועוד, / נוסף על כך, / יתרה מזו,',
    explanation: 'בעברית משפטית משתמשים ב"כמו כן" או "נוסף על כך"',
    examples: [
      {
        wrong: 'בנוסף, התובע טען',
        correct: 'כמו כן טען התובע / נוסף על כך טען התובע'
      },
      {
        wrong: 'וגם הנתבע',
        correct: 'ועוד הנתבע / וכן הנתבע'
      }
    ]
  },

  // 3. מונחים משפטיים
  {
    id: 'party',
    category: 'legal-terms',
    wrongPattern: 'צד / הצד',
    correctPattern: 'בעל דין / בעל הדין',
    explanation: 'במסמכים משפטיים בעברית אומרים "בעל דין" ולא "צד"',
    examples: [
      {
        wrong: 'הצד השני',
        correct: 'בעל הדין השני / הצד שכנגד'
      }
    ]
  },

  {
    id: 'claim',
    category: 'legal-terms',
    wrongPattern: 'טענה / טענות',
    correctPattern: 'עילת תביעה / עילה / טענת הגנה',
    explanation: 'בתביעות אומרים "עילת תביעה" או "עילה" ולא "טענה"',
    examples: [
      {
        wrong: 'התובע הציג טענות',
        correct: 'התובע הציג עילות תביעה / התובע ביסס את תביעתו על'
      }
    ]
  },

  {
    id: 'agreement',
    category: 'legal-terms',
    wrongPattern: 'הסכם זה',
    correctPattern: 'הסכם זה / הסכמה זו',
    explanation: 'לפעמים צריך "הסכמה" במקום "הסכם" תלוי בהקשר',
    examples: [
      {
        wrong: 'הסכם בין הצדדים',
        correct: 'הסכם בין הצדדים (נכון) / הסכמה שבין הצדדים (אפשרי)'
      }
    ]
  },

  // 4. סדר מילים
  {
    id: 'word-order-verb',
    category: 'word-order',
    wrongPattern: 'התובע הגיש / הנתבע טען',
    correctPattern: 'הגיש התובע / טען הנתבע',
    explanation: 'בעברית משפטית פורמלית, הפועל לפני הנושא במשפטים רבים',
    examples: [
      {
        wrong: 'התובע הגיש תביעה',
        correct: 'הגיש התובע תביעה'
      },
      {
        wrong: 'בית המשפט קבע',
        correct: 'קבע בית המשפט / בית המשפט קבע (שניהם נכונים, תלוי בהקשר)'
      }
    ]
  },

  {
    id: 'adjective-order',
    category: 'word-order',
    wrongPattern: 'המסמך הנוכחי / הנכס הנ"ל',
    correctPattern: 'מסמך זה / נכס זה / הנכס האמור',
    explanation: 'במקום "הנוכחי" או "הנ"ל" - משתמשים ב"זה" או "האמור"',
    examples: [
      {
        wrong: 'ההסכם הנוכחי',
        correct: 'הסכם זה / ההסכם האמור'
      },
      {
        wrong: 'הסעיף הנ"ל',
        correct: 'סעיף זה / הסעיף האמור'
      }
    ]
  },

  // 5. בניין פעיל ופעול
  {
    id: 'passive-voice',
    category: 'passive-voice',
    wrongPattern: 'נעשה / נכתב / ניתן',
    correctPattern: 'עשה / כתב / נתן (עם פרט מי)',
    explanation: 'מעדיפים בניין פעיל עם סוכן ברור על פני בניין פעול לא מפורש',
    examples: [
      {
        wrong: 'נחתם ההסכם',
        correct: 'חתמו הצדדים על ההסכם'
      },
      {
        wrong: 'ניתנה החלטה',
        correct: 'נתן בית המשפט החלטה / החליט בית המשפט'
      }
    ]
  },

  // 6. רמת פורמליות
  {
    id: 'formality-verbs',
    category: 'formality',
    wrongPattern: 'לתת / לקבל / לעשות',
    correctPattern: 'להעניק / לקבוע / לבצע / להורות',
    explanation: 'משתמשים בפעלים משפטיים פורמליים',
    examples: [
      {
        wrong: 'לתת צו',
        correct: 'ליתן צו / להוציא צו / לתת (גם נכון בהקשר משפטי)'
      },
      {
        wrong: 'לעשות פעולה',
        correct: 'לבצע פעולה / לנקוט בפעולה'
      },
      {
        wrong: 'לקבל החלטה',
        correct: 'לקבוע / להחליט / לפסוק'
      }
    ]
  },

  {
    id: 'formality-nouns',
    category: 'formality',
    wrongPattern: 'דבר / דברים / סיבה',
    correctPattern: 'עניין / עניינים / נימוק / טעם',
    explanation: 'משתמשים במילים משפטיות ספציפיות',
    examples: [
      {
        wrong: 'מדובר בדבר חשוב',
        correct: 'מדובר בעניין חשוב'
      },
      {
        wrong: 'מהסיבות הבאות',
        correct: 'מהנימוקים הבאים / מהטעמים הבאים'
      }
    ]
  },

  // 7. מבנה משפטים
  {
    id: 'sentence-opening',
    category: 'structure',
    wrongPattern: 'אני חושב ש / נראה לי ש',
    correctPattern: 'סבורני כי / דעתי היא כי / לדידי',
    explanation: 'בעברית משפטית אין "אני חושב" - יש ביטויים פורמליים',
    examples: [
      {
        wrong: 'אני חושב שהתובע צודק',
        correct: 'סבורני כי התובע צודק / דעתי היא כי התובע צודק'
      },
      {
        wrong: 'נראה לי שיש לקבל',
        correct: 'לדידי יש לקבל / דעתי היא שיש לקבל'
      }
    ]
  },

  {
    id: 'legal-shall',
    category: 'structure',
    wrongPattern: 'צריך ל / חייב ל / צריכים ל',
    correctPattern: 'יש ל / על ... ל / חלה חובה ל',
    explanation: 'בעברית משפטית אין "צריך" - יש "יש ל" או "חלה חובה"',
    examples: [
      {
        wrong: 'התובע צריך להוכיח',
        correct: 'על התובע להוכיח / יש על התובע להוכיח'
      },
      {
        wrong: 'הצדדים חייבים לשלם',
        correct: 'על הצדדים לשלם / חלה על הצדדים חובה לשלם'
      }
    ]
  },

  // 8. שגיאות נפוצות
  {
    id: 'shall-be',
    category: 'common-errors',
    wrongPattern: 'יהיה נחשב / יהיה תקף',
    correctPattern: 'ייחשב / יחול / יעמוד בתוקפו',
    explanation: 'הימנעות מתרגום מילולי של "shall be considered"',
    examples: [
      {
        wrong: 'הסעיף יהיה נחשב כבטל',
        correct: 'הסעיף ייחשב בטל / הסעיף בטל'
      },
      {
        wrong: 'ההסכם יהיה תקף',
        correct: 'ההסכם יעמוד בתוקפו / ההסכם תקף'
      }
    ]
  },

  {
    id: 'in-order-to',
    category: 'common-errors',
    wrongPattern: 'על מנת ל / בכדי ל',
    correctPattern: 'כדי ל / לשם / למען',
    explanation: '"על מנת" ארוך מדי - בעברית תקנית די ב"כדי" או "לשם"',
    examples: [
      {
        wrong: 'על מנת להוכיח',
        correct: 'כדי להוכיח / לשם הוכחה'
      },
      {
        wrong: 'בכדי לקבל',
        correct: 'כדי לקבל'
      }
    ]
  },

  {
    id: 'by-means-of',
    category: 'common-errors',
    wrongPattern: 'על ידי / באמצעות',
    correctPattern: 'על ידי (רק אם יש סוכן) / ב (אמצעי)',
    explanation: 'לא תמיד צריך "באמצעות" - לפעמים די ב-ב',
    examples: [
      {
        wrong: 'באמצעות מכתב',
        correct: 'במכתב / על ידי מכתב'
      },
      {
        wrong: 'באמצעות העובדה ש',
        correct: 'מן העובדה ש / בשל העובדה ש'
      }
    ]
  }
];

/**
 * דוגמאות מקיפות של טקסט לפני ואחרי תיקון
 */
export const beforeAfterExamples = [
  {
    type: 'פתיחת צוואה',
    before: `אני, [שם], תושב [כתובת], מצהיר בזה בכפוף לחוק הירושה שאני עושה את הצוואה הזו מהרצון החופשי שלי. אני רוצה לתת את כל הרכוש שלי לילדים שלי. בנוסף, אני רוצה שהם ידעו שאני אוהב אותם.`,
    after: `אני הח"מ [שם], תושב [כתובת], מצהיר בזאת כי צוואה זו נעשית על פי חוק הירושה, התשכ"ה-1965, מרצוני החופשי ומדעתי הטובה. אני מצווה בזאת להוריש את מלוא רכושי לילדיי. ברצוני להביע בפניהם את אהבתי ואת תקוותי שישמרו על אחדות המשפחה.`,
    improvements: [
      'הח"מ במקום "אני"',
      'על פי במקום "בכפוף ל"',
      'מצווה להוריש במקום "לתת"',
      'מלוא רכושי במקום "כל הרכוש שלי"',
      'הוספת שנת החוק',
      'שפה גבוהה יותר במסר האישי'
    ]
  },

  {
    type: 'סעיף בהסכם',
    before: `הצד הראשון צריך לשלם לצד השני את הסכום בכפוף לתנאים. אם הצד הראשון לא ישלם, הצד השני יכול לעשות פעולות משפטיות. עם זאת, לפני שהוא עושה את זה, הוא צריך לתת הודעה.`,
    after: `על הצד הראשון לשלם לצד השני את הסכום האמור בהתאם לתנאים שלהלן. במקרה שהצד הראשון לא יעמוד בהתחייבותו, רשאי הצד השני לנקוט בהליכים משפטיים. ואולם לפני כן, עליו למסור הודעה בכתב.`,
    improvements: [
      'על... לשלם במקום "צריך לשלם"',
      'בהתאם במקום "בכפוף"',
      'האמור במקום "הזה"',
      'לנקוט בהליכים במקום "לעשות פעולות"',
      'ואולם במקום "עם זאת"',
      'עליו במקום "הוא צריך"'
    ]
  },

  {
    type: 'פסק דין',
    before: `אני חושב שהתובע צודק בנוגע לטענות שלו. לכן, אני נותן לו את מה שהוא ביקש. בנוסף, הנתבע צריך לשלם הוצאות. עם זאת, אני לא נותן לו את כל מה שהוא רצה כי הוא לא הוכיח הכל.`,
    after: `דעתי היא כי התובע צודק בטענותיו. לפיכך, אני מורה כי תינתן לו הסעד שביקש. כמו כן, על הנתבע לשאת בהוצאות. ואולם אין אני נעתר לכל דרישותיו של התובע, שכן לא הוכיחו במלואן.`,
    improvements: [
      'דעתי היא במקום "אני חושב"',
      'לפיכך במקום "לכן"',
      'מורה במקום "נותן"',
      'כמו כן במקום "בנוסף"',
      'על הנתבע לשאת במקום "צריך לשלם"',
      'אין אני נעתר במקום "לא נותן"',
      'שכן במקום "כי"'
    ]
  }
];

/**
 * ביטויים משפטיים נפוצים בעברית תקנית
 */
export const legalPhrases = {
  openings: [
    'אני הח"מ',
    'אנו החתומים מטה',
    'בהסכם זה שנכרת ביום',
    'נפלו דברים אלה',
    'לאחר ששמענו את הצדדים',
    'שקלנו את הטיעונים',
    'נתנו דעתנו לעניין',
    'לאחר שעיינו במסמכים',
  ],
  
  transitions: [
    'לפיכך',
    'משכך',
    'על כן',
    'מטעם זה',
    'ואולם',
    'אולם',
    'אף על פי כן',
    'כמו כן',
    'נוסף על כך',
    'יתרה מזו',
    'ועוד זאת',
  ],
  
  obligations: [
    'על... ל',
    'חלה חובה על',
    'חב ב',
    'רשאי ל',
    'זכאי ל',
    'מוטלת עליו חובה',
    'עליו למלא',
    'יש עליו ל',
  ],
  
  decisions: [
    'אני מורה',
    'אני קובע',
    'אני פוסק',
    'הנני נעתר',
    'אין אני נעתר',
    'אני דוחה',
    'אני מקבל',
    'דעתי היא',
    'סבורני',
    'מצאתי',
    'הגעתי לכלל מסקנה',
  ],
  
  reasoning: [
    'שכן',
    'משום ש',
    'הואיל ו',
    'היות ו',
    'מאחר ו',
    'נוכח',
    'לאור',
    'בשל',
    'מן הטעם ש',
  ],
  
  conclusions: [
    'לסיכום',
    'סוף דבר',
    'לאור כל האמור',
    'מכל האמור עולה',
    'התוצאה היא',
    'המסקנה המתבקשת',
  ],
};

/**
 * פונקציה להמרת טקסט מעברית מתורגמת לעברית משפטית תקנית
 */
export function convertToLegalHebrew(text: string): string {
  let improvedText = text;
  
  // החלפת ביטויים לפי הכללים
  legalHebrewRules.forEach(rule => {
    const pattern = new RegExp(rule.wrongPattern, 'g');
    // זוהי החלפה בסיסית - במציאות צריך AI חכם יותר שמבין הקשר
    // כאן רק דוגמה למבנה
  });
  
  return improvedText;
}

/**
 * מערכת ציון לטקסט משפטי
 */
export function scoreLegalHebrew(text: string): {
  score: number;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  
  // בדיקת שימוש בביטויים לא תקניים
  legalHebrewRules.forEach(rule => {
    if (text.includes(rule.wrongPattern)) {
      issues.push(`נמצא שימוש ב"${rule.wrongPattern}" - ${rule.explanation}`);
      suggestions.push(`החלף ל"${rule.correctPattern}"`);
      score -= 5;
    }
  });
  
  return { score, issues, suggestions };
}

