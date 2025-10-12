import { Module } from '../../types/advanceDirectives.types';

export const M07_CareAndResidence: Module = {
  id: 'M07',
  name: 'Care and Residence',
  nameHe: 'טיפול סיעודי ומגורים',
  category: 'personal',
  isMandatory: false,
  displayOrder: 7,
  description: 'העדפות לגבי טיפול סיעודי ומקום מגורים',
  sections: [
    {
      id: 'M07-S01',
      moduleId: 'M07',
      name: 'Residence Preference',
      nameHe: 'העדפת מגורים',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M07-S01-V1',
          sectionId: 'M07-S01',
          name: 'Stay at Home - Strong',
          nameHe: 'השארה בבית - חזקה',
          textTemplate: `רצוני להישאר במקום מגוריי הנוכחי ככל הניתן, בכל מצב בריאותי שהוא, לרבות במצב סיעודי מורכב.\n\nמעבר לבית אבות או מוסד סיעודי אפשרי רק במקרים קיצוניים ביותר, כאשר:\n- אין כל אפשרות לטיפול ביתי הולם\n- המצב הרפואי מחייב טיפול מוסדי\n- בהחלטת מיופה הכוח הראשי בלבד\n- לאחר התייעצות עם גורמים רפואיים\n- ובאישור בית משפט`,
          fields: []
        },
        {
          id: 'M07-S01-V2',
          sectionId: 'M07-S01',
          name: 'Stay at Home - Absolute',
          nameHe: 'השארה בבית - מוחלט',
          textTemplate: `אני מבקש להצהיר באופן חד משמעי כי אינני מעוניין בשום צורה ואופן לעבור לבית אבות או למוסד סיעודי אחר.\n\nגם אם הטיפול הביתי יהיה מורכב, יקר או קשה - רצוני להישאר בביתי.\n\nהנחיה זו מוחלטת ואינה ניתנת לשינוי, למעט באישורי המפורש בכתב (במצב שאוכל לתת אישור).`,
          fields: []
        },
        {
          id: 'M07-S01-V3',
          sectionId: 'M07-S01',
          name: 'Flexible',
          nameHe: 'גמישות',
          textTemplate: `העדפה להישאר בבית ככל האפשר.\n\nאם לא תהיה אפשרות להמשך טיפול במסגרת ביתית (מבחינה רפואית, כלכלית או אחרת), מיופה הכוח יחליט על העברתי למוסד מתאים.\n\nההחלטה תתקבל בשיקול דעת, בהתייעצות עם גורמים רפואיים ובני משפחה.`,
          fields: []
        },
        {
          id: 'M07-S01-V4',
          sectionId: 'M07-S01',
          name: 'Nursing Home with Conditions',
          nameHe: 'בית אבות בתנאים',
          textTemplate: `במקרה שאזדקק לטיפול סיעודי מתמשך ולא ניתן יהיה לספק טיפול ביתי הולם, אני מאשר מעבר למוסד סיעודי בתנאים הבאים:\n\n**תנאים למוסד:**{{#if modFacility}}\n- מוסד סיעודי של משרד הביטחון, או\n- מוסד מאושר על ידי משרד הביטחון\n- קבלת מלוא הזכויות כנכה משרד הביטחון{{/if}}\n- רמה גבוהה של טיפול\n- {{roomType}}\n- קרבה למשפחה (עד {{maxDistance}} ק"מ)\n- תנאי היגיינה מעולים\n- צוות מקצועי ומיומן\n\n**החלטה:**\n- בהחלטת מיופה כוח ראשי או במשותף (מחליפים)\n- בהתייעצות עם גורמים רפואיים\n- ביקור מוקדם במוסד לפני ההחלטה`,
          fields: [
            {
              id: 'modFacility',
              type: 'boolean',
              label: 'MOD Facility Required',
              labelHe: 'מוסד משרד הביטחון',
              required: false
            },
            {
              id: 'roomType',
              type: 'select',
              label: 'Room Type',
              labelHe: 'סוג חדר',
              required: false,
              options: [
                { value: 'private', label: 'Private Room', labelHe: 'חדר פרטי' },
                { value: 'double', label: 'Double Room Max', labelHe: 'דו-חדרי לכל היותר' },
                { value: 'any', label: 'Any', labelHe: 'כל סוג' }
              ]
            },
            {
              id: 'maxDistance',
              type: 'number',
              label: 'Max Distance from Family (km)',
              labelHe: 'מרחק מקסימלי ממשפחה (קמ")',
              required: false,
              placeholder: '30',
              validation: { min: 5, max: 200 }
            }
          ]
        }
      ]
    },
    {
      id: 'M07-S02',
      moduleId: 'M07',
      name: 'Caregiver Language',
      nameHe: 'דרישות שפה של מטפל/ת',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M07-S02-V1',
          sectionId: 'M07-S02',
          name: 'Hebrew Only',
          nameHe: 'עברית בלבד',
          textTemplate: `במקרה שאזדקק לטיפול סיעודי, אני מבקש שתטפל בי מטפלת שתדע לתקשר בעברית שוטפת.\n\nיכולת התקשורת חשובה לי מאוד לשם הבטחת טיפול הולם, הבנה הדדית ושמירה על כבודי.`,
          fields: []
        },
        {
          id: 'M07-S02-V2',
          sectionId: 'M07-S02',
          name: 'Hebrew or English',
          nameHe: 'עברית או אנגלית',
          textTemplate: `במקרה שאזדקק לטיפול סיעודי, אני מבקש שתטפל בי מטפלת שתדע לתקשר בעברית או באנגלית ברמה טובה.\n\nיכולת התקשורת חשובה לי לשם הבטחת טיפול הולם והבנה הדדית.`,
          fields: []
        },
        {
          id: 'M07-S02-V3',
          sectionId: 'M07-S02',
          name: 'Hebrew or Other Language',
          nameHe: 'עברית או שפה אחרת',
          textTemplate: `במקרה שאזדקק לטיפול סיעודי, אני מבקש שתטפל בי מטפלת שתדע לתקשר בעברית או ב{{language}}.\n\nיכולת התקשורת חשובה לי לשם הבטחת טיפול הולם והבנה הדדית.`,
          fields: [
            {
              id: 'language',
              type: 'select',
              label: 'Alternative Language',
              labelHe: 'שפה חלופית',
              required: true,
              options: [
                { value: 'french', label: 'French', labelHe: 'צרפתית' },
                { value: 'russian', label: 'Russian', labelHe: 'רוסית' },
                { value: 'spanish', label: 'Spanish', labelHe: 'ספרדית' },
                { value: 'hungarian', label: 'Hungarian', labelHe: 'הונגרית' },
                { value: 'arabic', label: 'Arabic', labelHe: 'ערבית' },
                { value: 'romanian', label: 'Romanian', labelHe: 'רומנית' },
                { value: 'other', label: 'Other', labelHe: 'אחר' }
              ]
            }
          ]
        },
        {
          id: 'M07-S02-V4',
          sectionId: 'M07-S02',
          name: 'No Language Requirement',
          nameHe: 'ללא דרישה',
          textTemplate: `אין דרישה מיוחדת בנוגע לשפת המטפל/ת.\nהתקשורת תתאפשר גם בשפות אחרות או בדרכים חלופיות.`,
          fields: []
        }
      ]
    },
    {
      id: 'M07-S03',
      moduleId: 'M07',
      name: 'Caregiver Requirements',
      nameHe: 'דרישות נוספות למטפל/ת',
      displayOrder: 3,
      isRequired: false,
      variants: [
        {
          id: 'M07-S03-V1',
          sectionId: 'M07-S03',
          name: 'Standard Requirements',
          nameHe: 'דרישות סטנדרטיות',
          textTemplate: `דרישות לבחירת מטפל/ת:{{#if genderRequired}}\n\n**מין המטפל/ת:**\n- {{genderPreference}}{{#if spouseCondition}}\n- כל עוד בן/בת הזוג בחיים - חובה מטפל/ת {{spouseGender}}{{/if}}{{/if}}\n\n**ניסיון ומיומנות:**\n- ניסיון קודם של {{minExperience}} שנים לפחות בטיפול סיעודי\n- הכשרה מקצועית (סיעוד / סיעוד גריאטרי){{#if medicalSkills}}\n- ניסיון בטיפול ב{{medicalSkills}}{{/if}}\n\n**בדיקות רקע:**\n- בדיקת רקע פלילי חובה\n- המלצות מעבודות קודמות (לפחות {{minReferences}})\n- ראיון אישי מעמיק\n\n**תכונות אישיות:**\n- יחס חם, מכבד ואמפתי\n- סבלנות\n- אמינות ואחריות\n- יושר\n\n**פיקוח:**\n- מיופה הכוח יבצע פיקוח שוטף על איכות הטיפול\n- שיחות תקופתיות עם המטפל/ת\n- התאמות לפי צורך`,
          fields: [
            {
              id: 'genderRequired',
              type: 'boolean',
              label: 'Gender Requirement',
              labelHe: 'דרישת מין',
              required: false
            },
            {
              id: 'genderPreference',
              type: 'select',
              label: 'Gender Preference',
              labelHe: 'העדפת מין',
              required: false,
              options: [
                { value: 'female', label: 'Female', labelHe: 'אישה' },
                { value: 'male', label: 'Male', labelHe: 'גבר' },
                { value: 'no_preference', label: 'No Preference', labelHe: 'אין העדפה' }
              ]
            },
            {
              id: 'spouseCondition',
              type: 'boolean',
              label: 'Special Condition While Spouse Alive',
              labelHe: 'תנאי מיוחד בחיי בן/בת זוג',
              required: false
            },
            {
              id: 'spouseGender',
              type: 'select',
              label: 'Required Gender While Spouse Alive',
              labelHe: 'מין נדרש בחיי בן/בת זוג',
              required: false,
              options: [
                { value: 'female', label: 'Female', labelHe: 'אישה' },
                { value: 'male', label: 'Male', labelHe: 'גבר' }
              ]
            },
            {
              id: 'minExperience',
              type: 'number',
              label: 'Minimum Experience (years)',
              labelHe: 'ניסיון מינימלי (שנים)',
              required: false,
              placeholder: '2',
              validation: { min: 0, max: 20 }
            },
            {
              id: 'medicalSkills',
              type: 'text',
              label: 'Required Medical Skills',
              labelHe: 'מיומנויות רפואיות נדרשות',
              required: false,
              placeholder: 'סכרת, אלצהיימר'
            },
            {
              id: 'minReferences',
              type: 'number',
              label: 'Minimum References',
              labelHe: 'מספר המלצות מינימלי',
              required: false,
              placeholder: '2',
              validation: { min: 1, max: 10 }
            }
          ]
        }
      ]
    },
    {
      id: 'M07-S04',
      moduleId: 'M07',
      name: 'Work Schedule',
      nameHe: 'היקף משרה',
      displayOrder: 4,
      isRequired: false,
      variants: [
        {
          id: 'M07-S04-V1',
          sectionId: 'M07-S04',
          name: '24 Hours',
          nameHe: '24 שעות',
          textTemplate: `היקף משרה: 24 שעות (מטפלת חיה).\n\nהמטפלת תתגורר בבית עם הממנה ותהיה זמינה 24 שעות ביממה.\n\nיינתנו ימי מנוחה והחלפה בהתאם לחוק.`,
          fields: []
        },
        {
          id: 'M07-S04-V2',
          sectionId: 'M07-S04',
          name: 'Full Time',
          nameHe: 'משרה מלאה',
          textTemplate: `היקף משרה: משרה מלאה ({{hoursPerDay}} שעות ביום, {{daysPerWeek}} ימים בשבוע).\n\nהמטפלת תגיע מדי יום לשעות קבועות ותעזוב בסוף היום.`,
          fields: [
            {
              id: 'hoursPerDay',
              type: 'number',
              label: 'Hours per Day',
              labelHe: 'שעות ביום',
              required: false,
              placeholder: '8',
              validation: { min: 4, max: 12 }
            },
            {
              id: 'daysPerWeek',
              type: 'number',
              label: 'Days per Week',
              labelHe: 'ימים בשבוע',
              required: false,
              placeholder: '6',
              validation: { min: 1, max: 7 }
            }
          ]
        },
        {
          id: 'M07-S04-V3',
          sectionId: 'M07-S04',
          name: 'Part Time',
          nameHe: 'משרה חלקית',
          textTemplate: `היקף משרה: משרה חלקית ({{hoursPerDay}} שעות ביום, {{daysPerWeek}} ימים בשבוע).\n\nהמטפלת תגיע בשעות קבועות לסיוע בפעולות יומיומיות.`,
          fields: [
            {
              id: 'hoursPerDay',
              type: 'number',
              label: 'Hours per Day',
              labelHe: 'שעות ביום',
              required: false,
              placeholder: '4',
              validation: { min: 2, max: 8 }
            },
            {
              id: 'daysPerWeek',
              type: 'number',
              label: 'Days per Week',
              labelHe: 'ימים בשבוע',
              required: false,
              placeholder: '5',
              validation: { min: 1, max: 7 }
            }
          ]
        },
        {
          id: 'M07-S04-V4',
          sectionId: 'M07-S04',
          name: 'As Needed',
          nameHe: 'לפי צורך',
          textTemplate: `היקף המשרה ישתנה בהתאם לצרכים המשתנים:\n- בתחילה - {{initialHours}} שעות ביום\n- התאמה בהתאם להתפתחות המצב\n- גמישות מלאה`,
          fields: [
            {
              id: 'initialHours',
              type: 'number',
              label: 'Initial Hours per Day',
              labelHe: 'שעות ראשוניות ביום',
              required: false,
              placeholder: '4',
              validation: { min: 2, max: 24 }
            }
          ]
        }
      ]
    },
    {
      id: 'M07-S05',
      moduleId: 'M07',
      name: 'Dignity Preservation',
      nameHe: 'שמירת כבוד',
      displayOrder: 5,
      isRequired: true,
      variants: [
        {
          id: 'M07-S05-V1',
          sectionId: 'M07-S05',
          name: 'Standard Dignity Statement',
          nameHe: 'הצהרת כבוד סטנדרטית',
          textTemplate: `הטיפול הסיעודי יתבצע תוך שמירה מלאה על:\n\n- **כבוד הממנה** - יחס מכבד בכל עת, ללא פגיעה בכבוד או השפלה\n- **פרטיות** - כבוד לפרטיות בפעולות אינטימיות, סגירת דלתות, הקפדה על צניעות\n- **חירות אישית** - שמירה על עצמאות ויכולת בחירה ככל הניתן\n- **הימנעות מפגיעה** - איסור על כל פגיעה פיזית או נפשית, קללות, זלזול\n- **תחושת עצמאות** - עידוד השתתפות בפעולות יומיומיות ככל שניתן`,
          fields: []
        }
      ]
    }
  ]
};

