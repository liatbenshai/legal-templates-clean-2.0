import { Module } from '../../types/advanceDirectives.types';

export const M05_Vehicle: Module = {
  id: 'M05',
  name: 'Vehicle',
  nameHe: 'רכב',
  category: 'property',
  isMandatory: false,
  displayOrder: 5,
  description: 'ניהול רכב ונהיגה',
  sections: [
    {
      id: 'M05-S01',
      moduleId: 'M05',
      name: 'Vehicle Details',
      nameHe: 'פרטי רכב',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M05-S01-V1',
          sectionId: 'M05-S01',
          name: 'Vehicle Registration',
          nameHe: 'רישום רכב',
          textTemplate: `פרטי הרכב:\n- מספר רישוי: {{licensePlate}}\n- יצרן ודגם: {{make}} {{model}}\n- שנת ייצור: {{year}}{{#if ownership}}\n- בעלות: {{ownership}}{{/if}}{{#if financing}}\n- מימון: {{financing}}{{/if}}{{#if insurance}}\n- ביטוח: {{insurance}}{{/if}}{{#if adaptations}}\n- התאמות מיוחדות: {{adaptations}}{{/if}}`,
          fields: [
            {
              id: 'licensePlate',
              type: 'text',
              label: 'License Plate',
              labelHe: 'מספר רישוי',
              required: true,
              placeholder: '12-345-67'
            },
            {
              id: 'make',
              type: 'text',
              label: 'Make',
              labelHe: 'יצרן',
              required: true,
              placeholder: 'טויוטה'
            },
            {
              id: 'model',
              type: 'text',
              label: 'Model',
              labelHe: 'דגם',
              required: true,
              placeholder: 'קורולה'
            },
            {
              id: 'year',
              type: 'number',
              label: 'Year',
              labelHe: 'שנת ייצור',
              required: true,
              placeholder: '2020',
              validation: { min: 1980, max: 2030 }
            },
            {
              id: 'ownership',
              type: 'select',
              label: 'Ownership',
              labelHe: 'בעלות',
              required: false,
              options: [
                { value: 'full', label: 'Full Ownership', labelHe: 'בעלות מלאה' },
                { value: 'partial', label: 'Partial Ownership', labelHe: 'בעלות חלקית' },
                { value: 'leased', label: 'Leased', labelHe: 'ליסינג' }
              ]
            },
            {
              id: 'financing',
              type: 'select',
              label: 'Financing',
              labelHe: 'מימון',
              required: false,
              options: [
                { value: 'owned', label: 'Fully Owned', labelHe: 'בבעלות מלאה' },
                { value: 'loan', label: 'Bank Loan', labelHe: 'הלוואת בנק' },
                { value: 'leased', label: 'Leased', labelHe: 'ליסינג' }
              ]
            },
            {
              id: 'insurance',
              type: 'text',
              label: 'Insurance',
              labelHe: 'ביטוח',
              required: false,
              placeholder: 'הראל - פוליסה 123456'
            },
            {
              id: 'adaptations',
              type: 'text',
              label: 'Special Adaptations',
              labelHe: 'התאמות מיוחדות',
              required: false,
              placeholder: 'כיסא גלגלים, שליטה ידנית'
            }
          ]
        }
      ]
    },
    {
      id: 'M05-S02',
      moduleId: 'M05',
      name: 'Vehicle Policy',
      nameHe: 'מדיניות ברכב',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M05-S02-V1',
          sectionId: 'M05-S02',
          name: 'Immediate Sale',
          nameHe: 'מכירה מיידית',
          textTemplate: `עם הפעלת ייפוי הכוח:\n\n**מכירת הרכב:**\n- מכירה תוך {{daysToSell}} ימים\n- למרבה במחיר\n- ניתן להיעזר בשמאי רכב לקביעת מחיר הוגן\n- ניתן להציע ברשתות מכירה, מוסכים, אתרי מכירה\n\n**התמורה:**\n- התמורה תופקד במלואה לחשבון הבנק\n- ללא יוצא מן הכלל\n\n**ביטול:**\n- ביטול ביטוח רכב לאחר המכירה\n- דיווח למשרד הרישוי`,
          fields: [
            {
              id: 'daysToSell',
              type: 'number',
              label: 'Days to Sell',
              labelHe: 'ימים למכירה',
              required: false,
              placeholder: '60',
              validation: { min: 7, max: 180 }
            }
          ]
        },
        {
          id: 'M05-S02-V2',
          sectionId: 'M05-S02',
          name: 'Conditional Sale',
          nameHe: 'מכירה מותנית',
          textTemplate: `מכירת הרכב תתבצע רק בתנאים הבאים:\n\n1. **הממנה אינו נוהג יותר**\n   - אישור רפואי על אי יכולת נהיגה\n   - או החלטה עצמית מתועדת של הממנה\n\n2. **אין צורך ברכב**\n   - הרכב אינו משמש את הממנה\n   - אין תועלת בשמירתו\n\n**במקרה של מכירה:**\n- מכירה למרבה במחיר\n- תמורה לחשבון בנק\n- ביטול ביטוח ודיווח למשרד הרישוי`,
          fields: []
        },
        {
          id: 'M05-S02-V3',
          sectionId: 'M05-S02',
          name: 'Keep Vehicle',
          nameHe: 'שמירת הרכב',
          textTemplate: `הרכב יישאר על שם הממנה:{{#if modBenefits}}\n\n**המשך קבלת זכויות ממשרד הביטחון:**\n- המשך קבלת מלוא הזכויות והתגמולים בגין הרכב\n- שמירה על קשר עם מחלקת השיקום: {{modPhone}}\n- דיווח על כל שינוי במצב הרכב{{/if}}\n\n**שימוש ברכב:**\n- השימוש ברכב יהיה לצרכי הממנה בלבד\n- נהיגה על ידי הממנה (כל עוד מסוגל)\n- או נהיגה על ידי מטפל/בן משפחה עבור הממנה\n\n**אחזקה:**\n- אחזקה ותחזוקה שוטפת\n- ביטוח מלא\n- טסטים ורישיונות במועד\n- תיקונים לפי צורך\n\n**איסורים:**\n- אין להשכיר את הרכב\n- אין למכור את הרכב\n- אין להשתמש ברכב למטרות אחרות`,
          fields: [
            {
              id: 'modBenefits',
              type: 'boolean',
              label: 'MOD Benefits for Vehicle',
              labelHe: 'זכויות ממשרד הביטחון',
              required: false
            },
            {
              id: 'modPhone',
              type: 'text',
              label: 'MOD Phone',
              labelHe: 'טלפון משרד הביטחון',
              required: false,
              placeholder: '03-7776777'
            }
          ]
        },
        {
          id: 'M05-S02-V4',
          sectionId: 'M05-S02',
          name: 'Replace with Adapted Vehicle',
          nameHe: 'החלפה ברכב מותאם',
          textTemplate: `אם נדרש רכב מותאם:\n\n**מכירת הרכב הנוכחי:**\n- מכירה למרבה במחיר\n\n**רכישת רכב חדש מותאם:**\n- רכב מותאם לצרכים (כיסא גלגלים, שליטה ידנית וכו')\n- מימון מתמורת המכירה + תוספת לפי צורך\n- בדיקת זכאות לסיוע ממשרד הביטחון / ביטוח לאומי\n\n**קבלת זכויות:**\n- פנייה למשרד הביטחון לקבלת תמיכה ברכישת רכב מותאם\n- פנייה לביטוח לאומי (אם רלוונטי)\n- מיצוי כל הזכויות האפשריות\n\n**התאמות נדרשות:**\n{{requiredAdaptations}}`,
          fields: [
            {
              id: 'requiredAdaptations',
              type: 'textarea',
              label: 'Required Adaptations',
              labelHe: 'התאמות נדרשות',
              required: false,
              placeholder: 'למשל: רמפה לכיסא גלגלים, שליטה ידנית מלאה...'
            }
          ]
        }
      ]
    }
  ]
};

