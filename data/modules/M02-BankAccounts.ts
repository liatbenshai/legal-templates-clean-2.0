import { Module } from '../../types/advanceDirectives.types';

export const M02_BankAccounts: Module = {
  id: 'M02',
  name: 'Bank Accounts',
  nameHe: 'חשבונות בנק',
  category: 'property',
  isMandatory: true,
  displayOrder: 2,
  sections: [
    {
      id: 'M02-S01',
      moduleId: 'M02',
      name: 'Account Details',
      nameHe: 'פירוט חשבונות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M02-S01-V1',
          sectionId: 'M02-S01',
          name: 'Bank Account List',
          nameHe: 'רשימת חשבונות',
          textTemplate: `בבעלותי החשבונות הבאים:\n{{#each accounts}}\n{{index}}. בנק {{bankName}}, סניף {{branchNumber}}, חשבון מספר {{accountNumber}}{{#if accountType}}, סוג: {{accountType}}{{/if}}{{#if isJoint}}, חשבון משותף עם {{jointWith}}{{/if}}\n{{/each}}`,
          fields: [
            {
              id: 'accounts',
              type: 'array',
              label: 'Bank Accounts',
              labelHe: 'חשבונות בנק',
              required: true,
              arrayItemSchema: [
                {
                  id: 'bankName',
                  type: 'select',
                  label: 'Bank',
                  labelHe: 'בנק',
                  required: true,
                  options: [
                    { value: 'hapoalim', label: 'Bank Hapoalim', labelHe: 'בנק הפועלים' },
                    { value: 'leumi', label: 'Bank Leumi', labelHe: 'בנק לאומי' },
                    { value: 'discount', label: 'Discount Bank', labelHe: 'בנק דיסקונט' },
                    { value: 'mizrahi', label: 'Mizrahi Tefahot', labelHe: 'מזרחי טפחות' },
                    { value: 'igud', label: 'Union Bank', labelHe: 'בנק איגוד' },
                    { value: 'yahav', label: 'Bank Yahav', labelHe: 'בנק יהב' },
                    { value: 'other', label: 'Other', labelHe: 'אחר' }
                  ]
                },
                {
                  id: 'branchNumber',
                  type: 'text',
                  label: 'Branch Number',
                  labelHe: 'מספר סניף',
                  required: true,
                  placeholder: '123'
                },
                {
                  id: 'accountNumber',
                  type: 'text',
                  label: 'Account Number',
                  labelHe: 'מספר חשבון',
                  required: true,
                  placeholder: '123456'
                },
                {
                  id: 'accountType',
                  type: 'select',
                  label: 'Account Type',
                  labelHe: 'סוג חשבון',
                  required: false,
                  options: [
                    { value: 'checking', label: 'Checking', labelHe: 'עו"ש' },
                    { value: 'savings', label: 'Savings', labelHe: 'חיסכון' },
                    { value: 'investment', label: 'Investment', labelHe: 'השקעות' }
                  ]
                },
                {
                  id: 'isJoint',
                  type: 'boolean',
                  label: 'Joint Account',
                  labelHe: 'חשבון משותף',
                  required: false
                },
                {
                  id: 'jointWith',
                  type: 'text',
                  label: 'Joint With',
                  labelHe: 'משותף עם',
                  required: false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M02-S02',
      moduleId: 'M02',
      name: 'Attorney Powers',
      nameHe: 'סמכויות מיופה כוח',
      displayOrder: 2,
      isRequired: true,
      variants: [],
      subsections: [
        {
          id: 'M02-S02-A',
          name: 'Basic Operations',
          nameHe: 'פעולות בסיסיות',
          variants: [
            {
              id: 'M02-S02-A-V1',
              sectionId: 'M02-S02-A',
              name: 'Standard Basic Powers',
              nameHe: 'סמכויות בסיסיות סטנדרטיות',
              textTemplate: `מיופה הכוח רשאי לבצע את הפעולות הבסיסיות הבאות בחשבונות הבנק:\n- משיכת כספים\n- הפקדת כספים\n- העברות בנקאיות\n- הנפקת פנקסי שיקים\n- ביצוע תשלומים שוטפים\n- הוראות קבע (יצירה, שינוי, ביטול)\n- ביצוע פעולות באינטרנט ובאפליקציה\n- קבלת מידע על מצב החשבון\n- קבלת דפי חשבון`,
              fields: []
            }
          ]
        },
        {
          id: 'M02-S02-B',
          name: 'Advanced Operations',
          nameHe: 'פעולות מתקדמות',
          variants: [
            {
              id: 'M02-S02-B-V1',
              sectionId: 'M02-S02-B',
              name: 'Conservative Investment Policy',
              nameHe: 'מדיניות השקעות שמרנית',
              textTemplate: `מיופה הכוח רשאי לבצע פעולות השקעה בחשבונות הבנק, בכפוף למדיניות שמרנית בלבד:\n- פיקדונות בנקאיים\n- תוכניות חסכון\n- קרנות נאמנות שמרניות\n- אג"ח ממשלתיות וקונצרניות מדורגות\n- המרת מטבע\n- ביטול חיובים שגויים\n\nמדיניות ההשקעה תהיה שמרנית ומכוונת לשמירת ערך הכסף.`,
              fields: []
            },
            {
              id: 'M02-S02-B-V2',
              sectionId: 'M02-S02-B',
              name: 'Balanced Investment Policy',
              nameHe: 'מדיניות השקעות מאוזנת',
              textTemplate: `מיופה הכוח רשאי לבצע פעולות השקעה בחשבונות הבנק, בכפוף למדיניות מאוזנת:\n- כל הפעולות השמרניות\n- קרנות מעורבות\n- מניות דיבידנד\n- אג"ח קונצרניות\n\nהשקעות יבוצעו בהתייעצות עם יועץ השקעות מורשה.`,
              fields: []
            }
          ]
        },
        {
          id: 'M02-S02-C',
          name: 'Digital Access',
          nameHe: 'גישה דיגיטלית',
          variants: [
            {
              id: 'M02-S02-C-V1',
              sectionId: 'M02-S02-C',
              name: 'Full Digital Access',
              nameHe: 'גישה דיגיטלית מלאה',
              textTemplate: `מיופה הכוח רשאי לקבל גישה מלאה לחשבונות באמצעים דיגיטליים:\n- בנקאות אינטרנט\n- אפליקציות הבנק\n- כל אמצעי דיגיטלי אחר\n\nלצורך כך, רשאי לקבל מהבנק את כל אמצעי הזיהוי והאימות הנדרשים (סיסמאות, אסימונים, SMS וכו').`,
              fields: []
            }
          ]
        }
      ]
    },
    {
      id: 'M02-S03',
      moduleId: 'M02',
      name: 'Usage Principles',
      nameHe: 'עקרונות שימוש',
      displayOrder: 3,
      isRequired: true,
      variants: [
        {
          id: 'M02-S03-V1',
          sectionId: 'M02-S03',
          name: 'Standard Principles',
          nameHe: 'עקרונות סטנדרטיים',
          textTemplate: `עקרונות השימוש בחשבונות הבנק:\n- שימוש לטובת הממנה בלבד\n- ניהול יעיל וחסכוני\n- שמירה על רמת החיים הקודמת\n- התאמה לצרכים המשתנים\n- הפרדה מוחלטת בין כספי הממנה לכספי מיופה הכוח\n- עדיפות לתשלומים קבועים וחיוניים (מים, חשמל, ארנונה, ביטוחים)\n- שמירת מינימום נזילות בחשבון`,
          fields: []
        }
      ]
    },
    {
      id: 'M02-S04',
      moduleId: 'M02',
      name: 'Documentation',
      nameHe: 'תיעוד',
      displayOrder: 4,
      isRequired: true,
      variants: [
        {
          id: 'M02-S04-V1',
          sectionId: 'M02-S04',
          name: 'Minimal Documentation',
          nameHe: 'תיעוד מינימלי',
          textTemplate: `תיעוד הוצאות מעל {{threshold}} ₪.`,
          fields: [
            {
              id: 'threshold',
              type: 'number',
              label: 'Threshold Amount',
              labelHe: 'סכום סף',
              required: true,
              placeholder: '10000',
              validation: { min: 1000, max: 50000 }
            }
          ]
        },
        {
          id: 'M02-S04-V2',
          sectionId: 'M02-S04',
          name: 'Standard Documentation',
          nameHe: 'תיעוד סטנדרטי',
          textTemplate: `תיעוד מסודר של:\n- הוצאות מעל {{threshold}} ₪\n- רישום חודשי של פעולות משמעותיות\n- שמירת קבלות ואישורים`,
          fields: [
            {
              id: 'threshold',
              type: 'number',
              label: 'Threshold Amount',
              labelHe: 'סכום סף',
              required: true,
              placeholder: '5000',
              validation: { min: 1000, max: 20000 }
            }
          ]
        },
        {
          id: 'M02-S04-V3',
          sectionId: 'M02-S04',
          name: 'Detailed Documentation',
          nameHe: 'תיעוד מפורט',
          textTemplate: `תיעוד מקיף:\n- תיעוד כל הוצאה מעל {{threshold}} ₪\n- דוח חודשי מסודר\n- שמירת כל הקבלות והאישורים\n- תיעוד דיגיטלי (סריקה)`,
          fields: [
            {
              id: 'threshold',
              type: 'number',
              label: 'Threshold Amount',
              labelHe: 'סכום סף',
              required: true,
              placeholder: '1000',
              validation: { min: 500, max: 5000 }
            }
          ]
        }
      ]
    },
    {
      id: 'M02-S05',
      moduleId: 'M02',
      name: 'Joint Account Split',
      nameHe: 'פיצול חשבון משותף',
      displayOrder: 5,
      isRequired: false,
      variants: [
        {
          id: 'M02-S05-V1',
          sectionId: 'M02-S05',
          name: 'Immediate Split',
          nameHe: 'פיצול מיידי',
          textTemplate: `בהפעלת ייפוי הכוח, חובה לפצל את החשבון המשותף לשני חשבונות נפרדים.`,
          fields: []
        },
        {
          id: 'M02-S05-V2',
          sectionId: 'M02-S05',
          name: 'Discretionary Split',
          nameHe: 'פיצול לפי שיקול דעת',
          textTemplate: `מיופה הכוח רשאי להחליט על פיצול החשבון המשותף בהתאם לצרכים ולנסיבות.`,
          fields: []
        },
        {
          id: 'M02-S05-V3',
          sectionId: 'M02-S05',
          name: 'Keep Joint',
          nameHe: 'שמירת משותף',
          textTemplate: `החשבון המשותף יישאר ללא שינוי. שני בעלי החשבון ימשיכו כשותפים.`,
          fields: []
        }
      ]
    }
  ]
};

