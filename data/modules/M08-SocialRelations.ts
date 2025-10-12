import { Module } from '../../types/advanceDirectives.types';

export const M08_SocialRelations: Module = {
  id: 'M08',
  name: 'Social and Family Relations',
  nameHe: 'קשרים חברתיים ומשפחתיים',
  category: 'personal',
  isMandatory: true,
  displayOrder: 8,
  description: 'שמירה על קשרים חברתיים ומשפחתיים',
  sections: [
    {
      id: 'M08-S01',
      moduleId: 'M08',
      name: 'Importance of Relations',
      nameHe: 'חשיבות הקשרים',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M08-S01-V1',
          sectionId: 'M08-S01',
          name: 'Standard Statement',
          nameHe: 'הצהרה סטנדרטית',
          textTemplate: `אני רואה חשיבות רבה בשמירה על קשרים חברתיים ומשפחתיים, גם במצב של ירידה בתפקוד, מחלה או מצב בריאותי מוגבל.\n\nקשרים אלו תורמים באופן משמעותי לאיכות חיי, למצב רוחי ולבריאותי הנפשית.`,
          fields: []
        }
      ]
    },
    {
      id: 'M08-S02',
      moduleId: 'M08',
      name: 'Attorney Role',
      nameHe: 'תפקיד מיופה כוח',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M08-S02-V1',
          sectionId: 'M08-S02',
          name: 'Standard Responsibilities',
          nameHe: 'אחריות סטנדרטית',
          textTemplate: `מיופה הכוח יפעל באופן פעיל לקידום ושימור הקשרים החברתיים והמשפחתיים:\n\n**תיאום ביקורים:**\n- תיאום ביקורים של בני משפחה וחברים\n- עידוד תקשורת שוטפת ורציפה\n- תיאום זמנים נוחים ומתאימים\n\n**סיוע בתקשורת:**\n- סיוע בשיחות טלפון (אם נדרש)\n- ארגון שיחות ווידאו\n- שליחת עדכונים למשפחה (בהסכמה)\n\n**סביבה נעימה:**\n- הבטחת סביבה נעימה ומסודרת לביקורים\n- הכנות מתאימות (משקאות, עוגיות וכו')\n- יצירת אווירה חמה ומזמינה\n\n**התאמה למצב:**\n- תיאום בין הצרכים שלי לבין רצון המשפחה והחברים לבקר\n- סידור ביקורים באופן שיתאים למצבי ולרצונותיי\n- כיבוד רצון במקרה של עייפות או אי-רצון בביקור`,
          fields: []
        },
        {
          id: 'M08-S02-V2',
          sectionId: 'M08-S02',
          name: 'Enhanced with Logistics',
          nameHe: 'מוגבר עם לוגיסטיקה',
          textTemplate: `מיופה הכוח יפעל באופן פעיל לקידום ושימור הקשרים, כולל:\n\nכל האחריות הסטנדרטית +\n\n**סיוע לוגיסטי:**\n- סיוע בהסעות למשפחה שמתקשה להגיע\n- ארגון מפגשים משפחתיים במקומות ציבוריים (בתי קפה, מסעדות)\n- סיוע כלכלי למשפחה שזקוקה לכך כדי לבקר (נסיעות וכו'){{#if maxTransportBudget}}\n- תקציב שנתי למטרה זו: עד {{maxTransportBudget}} ₪{{/if}}\n\n**תיעוד קשרים:**\n- שמירת לוח ביקורים\n- תזכורות למשפחה על ימי הולדת ואירועים`,
          fields: [
            {
              id: 'maxTransportBudget',
              type: 'number',
              label: 'Max Annual Transport Budget',
              labelHe: 'תקציב הסעות שנתי מקסימלי',
              required: false,
              placeholder: '10000',
              validation: { min: 0 }
            }
          ]
        }
      ]
    },
    {
      id: 'M08-S03',
      moduleId: 'M08',
      name: 'Special Events',
      nameHe: 'אירועים מיוחדים',
      displayOrder: 3,
      isRequired: false,
      variants: [
        {
          id: 'M08-S03-V1',
          sectionId: 'M08-S03',
          name: 'Maximum Participation',
          nameHe: 'השתתפות מקסימלית',
          textTemplate: `ככל שמצבי יאפשר, מיופה הכוח יסייע לי להשתתף באירועים משפחתיים וחברתיים מיוחדים:\n\n**סוגי אירועים:**\n- חגיגות משפחתיות (ימי הולדת, יובלים)\n- חתונות\n- בריתות / בר מצווה / בת מצווה\n- אירועים חגיגיים נוספים\n- ערבי חג משפחתיים\n\n**ארגון ההשתתפות:**\n- ארגון הסעה מתאימה (רכב פרטי / מונית נגישה / אמבולנס)\n- ליווי אישי\n- התאמת תנאים לצרכים:\n  * נגישות (כיסא גלגלים, רמפות)\n  * מקום ישיבה נוח\n  * אפשרות מנוחה\n  * התחשבות בתזונה ותרופות\n\n**כבוד והנאה:**\n- הקפדה על כבוד ומראה מטופח באירועים\n- יצירת תחושת שמחה והנאה\n- כבוד לרצון במידה והאירוע מתיש`,
          fields: []
        },
        {
          id: 'M08-S03-V2',
          sectionId: 'M08-S03',
          name: 'Case by Case',
          nameHe: 'לפי מקרה',
          textTemplate: `השתתפות באירועים משפחתיים תבחן מקרה למקרה בהתאם למצב הבריאותי, הרצון והיכולת.\n\nמיופה הכוח ישקול כל אירוע בנפרד ויחליט בתיאום עם הממנה (אם אפשר) או בהתאם לטובתו.`,
          fields: []
        },
        {
          id: 'M08-S03-V3',
          sectionId: 'M08-S03',
          name: 'Prefer to Avoid',
          nameHe: 'העדפה להימנע',
          textTemplate: `אני מעדיף להימנע ממצבים חברתיים גדולים ורועשים.\n\nעדיפות לביקורים אינטימיים בבית, במעגל קטן ושקט.`,
          fields: []
        }
      ]
    },
    {
      id: 'M08-S04',
      moduleId: 'M08',
      name: 'Grandchildren Contact',
      nameHe: 'קשר עם נכדים',
      displayOrder: 4,
      isRequired: false,
      variants: [
        {
          id: 'M08-S04-V1',
          sectionId: 'M08-S04',
          name: 'Continuous Contact',
          nameHe: 'קשר רציף',
          textTemplate: `מיופה הכוח יפעל לשמירה על קשר רציף וסדיר עם נכדיי:\n\n**ביקורים:**\n- תיאום ועידוד ביקורים בתדירות סבירה (לפחות {{minVisitsPerMonth}} פעמים בחודש)\n- יצירת סביבה מזמינה לנכדים (צעצועים, חטיפים)\n\n**תקשורת:**\n- שיחות טלפון / וידאו תכופות\n- שליחת ברכות לימי הולדת ואירועים\n\n**הסרת חסמים:**\n- סיוע בהסרת חסמים לוגיסטיים (הסעות)\n- סיוע פיננסי לנסיעות (אם נדרש)\n\n**מעורבות:**\n- מעורבות בחיי הנכדים (לימודים, הישגים)\n- עידוד הורים לשתף\n- יצירת זיכרונות משותפים`,
          fields: [
            {
              id: 'minVisitsPerMonth',
              type: 'number',
              label: 'Minimum Visits per Month',
              labelHe: 'מספר ביקורים מינימלי בחודש',
              required: false,
              placeholder: '2',
              validation: { min: 1, max: 30 }
            }
          ]
        },
        {
          id: 'M08-S04-V2',
          sectionId: 'M08-S04',
          name: 'Balanced',
          nameHe: 'מאוזן',
          textTemplate: `שמירה על קשר עם נכדים תוך התחשבות ברצונם, בגילם ובמצב המשפחתי.\n\nמיופה הכוח יעודד קשרים אך לא יכפה.`,
          fields: []
        }
      ]
    }
  ]
};

