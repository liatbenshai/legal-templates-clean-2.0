import { Module } from '../../types/advanceDirectives.types';

export const M04_Investments: Module = {
  id: 'M04',
  name: 'Investments and Deposits',
  nameHe: 'השקעות ופיקדונות',
  category: 'property',
  isMandatory: false,
  displayOrder: 4,
  description: 'ניהול קופות גמל, פנסיה, פיקדונות והשקעות',
  sections: [
    {
      id: 'M04-S01',
      moduleId: 'M04',
      name: 'Pension and Provident Funds',
      nameHe: 'קופות גמל ופנסיה',
      displayOrder: 1,
      isRequired: true,
      variants: [],
      subsections: [
        {
          id: 'M04-S01-A',
          name: 'Fund Registration',
          nameHe: 'רישום קופות',
          variants: [
            {
              id: 'M04-S01-A-V1',
              sectionId: 'M04-S01-A',
              name: 'Fund List',
              nameHe: 'רשימת קופות',
              textTemplate: `בבעלותי הקופות והחסכונות הבאים:\n{{#each funds}}\n{{index}}. {{fundName}} - {{fundType}}\n   מספר חשבון: {{accountNumber}}\n   שווי משוער: {{estimatedValue}} ₪{{#if monthlyDeposit}}\n   הפקדה חודשית: {{monthlyDeposit}} ₪{{/if}}{{#if withdrawalConditions}}\n   תנאי משיכה: {{withdrawalConditions}}{{/if}}\n{{/each}}`,
              fields: [
                {
                  id: 'funds',
                  type: 'array',
                  label: 'Funds',
                  labelHe: 'קופות',
                  required: true,
                  arrayItemSchema: [
                    {
                      id: 'fundName',
                      type: 'text',
                      label: 'Fund Name',
                      labelHe: 'שם הקופה',
                      required: true,
                      placeholder: 'מבטחים פנסיה'
                    },
                    {
                      id: 'fundType',
                      type: 'select',
                      label: 'Fund Type',
                      labelHe: 'סוג קופה',
                      required: true,
                      options: [
                        { value: 'pension', label: 'Pension Fund', labelHe: 'קופת פנסיה' },
                        { value: 'provident', label: 'Provident Fund', labelHe: 'קופת גמל' },
                        { value: 'study', label: 'Study Fund', labelHe: 'קרן השתלמות' },
                        { value: 'severance', label: 'Severance Pay', labelHe: 'פיצויי פיטורים' },
                        { value: 'compensation', label: 'Compensation Fund', labelHe: 'קופת תגמולים' }
                      ]
                    },
                    {
                      id: 'accountNumber',
                      type: 'text',
                      label: 'Account Number',
                      labelHe: 'מספר חשבון',
                      required: true
                    },
                    {
                      id: 'estimatedValue',
                      type: 'number',
                      label: 'Estimated Value',
                      labelHe: 'שווי משוער',
                      required: false,
                      placeholder: '500000'
                    },
                    {
                      id: 'monthlyDeposit',
                      type: 'number',
                      label: 'Monthly Deposit',
                      labelHe: 'הפקדה חודשית',
                      required: false,
                      placeholder: '2000'
                    },
                    {
                      id: 'withdrawalConditions',
                      type: 'text',
                      label: 'Withdrawal Conditions',
                      labelHe: 'תנאי משיכה',
                      required: false,
                      placeholder: 'גיל 67 או נכות'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'M04-S01-B',
          name: 'Early Withdrawal Policy',
          nameHe: 'מדיניות פדיון מוקדם',
          variants: [
            {
              id: 'M04-S01-B-V1',
              sectionId: 'M04-S01-B',
              name: 'Absolute Prohibition',
              nameHe: 'איסור מוחלט',
              textTemplate: `איסור מוחלט לפדות את כספי קופות הגמל והפנסיה באמצע תקופה או לפני מועד הזכאות.\n\nהכספים נועדו להבטחת עתידי הכלכלי ואין לגעת בהם אלא במועדים שנקבעו בחוק או בתקנון הקופה.`,
              fields: []
            },
            {
              id: 'M04-S01-B-V2',
              sectionId: 'M04-S01-B',
              name: 'Prohibition with Medical Exception',
              nameHe: 'איסור עם חריג רפואי',
              textTemplate: `איסור מוחלט לפדות את כספי קופות הגמל והפנסיה, אלא במקרים חריגים הבאים:\n\n1. **מצב רפואי דחוף ומציל חיים**\n   - כאשר אין כל מקור כספי אחר זמין\n   - בצירוף חוות דעת רפואית מפורטת\n   - בצירוף אישור בית משפט\n\n2. **מצב סיעודי מוכח**\n   - כאשר נדרש מימון טיפול סיעודי\n   - נדרש אישור רפואי על מצב סיעודי\n   - רק לאחר מיצוי כל האפשרויות האחרות (ביטוח סיעודי וכו')\n\nבכל מקרה - רק בהחלטת מיופה הכוח הראשי ובאישור בית משפט.`,
              fields: []
            },
            {
              id: 'M04-S01-B-V3',
              sectionId: 'M04-S01-B',
              name: 'Flexible (Rare)',
              nameHe: 'גמיש (נדיר)',
              textTemplate: `מיופה הכוח רשאי לשקול פדיון מוקדם של כספי קופות הגמל והפנסיה במקרים חריגים, בהתייעצות עם יועץ פנסיוני ובאישור בית משפט.`,
              fields: []
            }
          ]
        },
        {
          id: 'M04-S01-C',
          name: 'Track Changes',
          nameHe: 'שינוי מסלולים',
          variants: [
            {
              id: 'M04-S01-C-V1',
              sectionId: 'M04-S01-C',
              name: 'No Changes',
              nameHe: 'ללא שינויים',
              textTemplate: `יש להמשיך את הקופות במסלולים הקיימים ללא שינוי.\nאין לבצע שינויים במסלול ההשקעה, בגובה ההפקדות או בכל פרמטר אחר.`,
              fields: []
            },
            {
              id: 'M04-S01-C-V2',
              sectionId: 'M04-S01-C',
              name: 'Conservative Change Only',
              nameHe: 'שינוי למסלול שמרני בלבד',
              textTemplate: `מיופה הכוח רשאי לשנות את מסלול ההשקעה בקופות רק למסלול שמרני יותר:\n- מעבר ממניות לאג"ח\n- מעבר למסלול הכנסה קבועה\n- הגברת החלק השמרני בתיק\n\nאין לבצע שינוי למסלול אגרסיבי יותר.`,
              fields: []
            },
            {
              id: 'M04-S01-C-V3',
              sectionId: 'M04-S01-C',
              name: 'Changes with Professional Advice',
              nameHe: 'שינויים עם ייעוץ מקצועי',
              textTemplate: `מיופה הכוח רשאי לבצע שינויים במסלולי ההשקעה בקופות, אך ורק:\n- בהתייעצות עם יועץ פנסיוני מוסמך\n- בהתאם להמלצות מקצועיות\n- בהתחשב בגיל ובפרופיל הסיכון\n- תוך תיעוד ההחלטה והנימוקים`,
              fields: []
            }
          ]
        }
      ]
    },
    {
      id: 'M04-S02',
      moduleId: 'M04',
      name: 'Bank Deposits',
      nameHe: 'פיקדונות בנקאיים',
      displayOrder: 2,
      isRequired: false,
      variants: [],
      subsections: [
        {
          id: 'M04-S02-A',
          name: 'Existing Deposits Management',
          nameHe: 'ניהול פיקדונות קיימים',
          variants: [
            {
              id: 'M04-S02-A-V1',
              sectionId: 'M04-S02-A',
              name: 'Auto-Renewal with Same Terms',
              nameHe: 'חידוש אוטומטי לתנאים דומים',
              textTemplate: `ניהול פיקדונות קיימים:\n- חידוש אוטומטי בתום התקופה לתנאים דומים או טובים יותר\n- אם התנאים פחות טובים - בירור עם הבנק לשיפור\n- אם אין אפשרות לשיפור - בדיקת חלופות בבנקים אחרים\n- שמירה על נזילות מינימלית של {{minLiquidity}}% מהכספים`,
              fields: [
                {
                  id: 'minLiquidity',
                  type: 'number',
                  label: 'Minimum Liquidity %',
                  labelHe: 'אחוז נזילות מינימלי',
                  required: false,
                  placeholder: '20',
                  validation: { min: 0, max: 100 }
                }
              ]
            },
            {
              id: 'M04-S02-A-V2',
              sectionId: 'M04-S02-A',
              name: 'Review Before Renewal',
              nameHe: 'בדיקה לפני חידוש',
              textTemplate: `ניהול פיקדונות קיימים:\n- חודש לפני פקיעת כל פיקדון - בדיקה מקיפה:\n  * השוואת תנאים בבנקים שונים\n  * בדיקה במערכת "הר הכסף" של משרד האוצר\n  * התייעצות עם יועץ השקעות בבנק\n- חידוש רק אם התנאים הטובים ביותר שנמצאו\n- העדפה לפיקדונות לטווח {{preferredTerm}}`,
              fields: [
                {
                  id: 'preferredTerm',
                  type: 'select',
                  label: 'Preferred Term',
                  labelHe: 'טווח מועדף',
                  required: false,
                  options: [
                    { value: 'short', label: 'Short (up to 1 year)', labelHe: 'קצר (עד שנה)' },
                    { value: 'medium', label: 'Medium (1-3 years)', labelHe: 'בינוני (1-3 שנים)' },
                    { value: 'long', label: 'Long (3+ years)', labelHe: 'ארוך (3+ שנים)' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'M04-S02-B',
          name: 'Opening New Deposits',
          nameHe: 'פתיחת פיקדונות חדשים',
          variants: [
            {
              id: 'M04-S02-B-V1',
              sectionId: 'M04-S02-B',
              name: 'Allowed to Open',
              nameHe: 'רשאי לפתוח',
              textTemplate: `מיופה הכוח רשאי לפתוח פיקדונות בנקאיים חדשים מכספי הממנה, בכפוף ל:\n- פיקדונות בנקאיים בלבד (לא בורסה)\n- בבנקים מוכרים ומפוקחים\n- שמירה על נזילות מינימלית\n- פיזור סיכונים בין בנקים שונים`,
              fields: []
            },
            {
              id: 'M04-S02-B-V2',
              sectionId: 'M04-S02-B',
              name: 'With Professional Consultation',
              nameHe: 'רק בהתייעצות מקצועית',
              textTemplate: `מיופה הכוח רשאי לפתוח פיקדונות חדשים רק:\n- בהתייעצות עם יועץ השקעות מורשה\n- לאחר קבלת חוות דעת בכתב\n- בהתאם להמלצות הייעוץ\n- תיעוד ההחלטה והנימוקים`,
              fields: []
            },
            {
              id: 'M04-S02-B-V3',
              sectionId: 'M04-S02-B',
              name: 'Not Allowed',
              nameHe: 'לא מורשה',
              textTemplate: `מיופה הכוח אינו רשאי לפתוח פיקדונות חדשים.\nיש להשאיר את הכספים בחשבונות הקיימים או לחדש פיקדונות קיימים בלבד.`,
              fields: []
            }
          ]
        }
      ]
    },
    {
      id: 'M04-S03',
      moduleId: 'M04',
      name: 'Investment Policy',
      nameHe: 'מדיניות השקעות',
      displayOrder: 3,
      isRequired: true,
      variants: [
        {
          id: 'M04-S03-V1',
          sectionId: 'M04-S03',
          name: 'Very Conservative',
          nameHe: 'שמרנית מאוד',
          textTemplate: `מדיניות השקעות שמרנית מאוד:\n\n**מותר:**\n- פיקדונות בנקאיים ({{depositPercent}}%)\n- אג"ח ממשלתיות ({{govBondsPercent}}%)\n- קרנות כספיות ({{moneyMarketPercent}}%)\n\n**אסור:**\n- מניות\n- אג"ח קונצרניות\n- קרנות נאמנות מעורבות\n- כל השקעה בעלת סיכון\n\n**עקרונות:**\n- שמירת ערך הכסף\n- הגנה מפני אינפלציה\n- אפס סיכון הפסד קרן`,
          fields: [
            {
              id: 'depositPercent',
              type: 'number',
              label: 'Bank Deposits %',
              labelHe: 'פיקדונות %',
              required: false,
              placeholder: '70',
              validation: { min: 0, max: 100 }
            },
            {
              id: 'govBondsPercent',
              type: 'number',
              label: 'Government Bonds %',
              labelHe: 'אג"ח ממשלתיות %',
              required: false,
              placeholder: '20',
              validation: { min: 0, max: 100 }
            },
            {
              id: 'moneyMarketPercent',
              type: 'number',
              label: 'Money Market %',
              labelHe: 'קרנות כספיות %',
              required: false,
              placeholder: '10',
              validation: { min: 0, max: 100 }
            }
          ]
        },
        {
          id: 'M04-S03-V2',
          sectionId: 'M04-S03',
          name: 'Conservative',
          nameHe: 'שמרנית',
          textTemplate: `מדיניות השקעות שמרנית:\n\n**הרכב מומלץ:**\n- פיקדונות בנקאיים ({{depositPercent}}%)\n- אג"ח מדינה וקונצרניות מדורגות ({{bondsPercent}}%)\n- קרנות מעורבות שמרניות ({{mixedPercent}}%)\n- קרנות כספיות ({{moneyMarketPercent}}%)\n\n**כללים:**\n- רק אג"ח בדירוג AA ומעלה\n- רק קרנות עם דירוג גבוה\n- אין מניות בודדות\n- פיזור סיכונים`,
          fields: [
            {
              id: 'depositPercent',
              type: 'number',
              label: 'Deposits %',
              labelHe: 'פיקדונות %',
              required: false,
              placeholder: '40'
            },
            {
              id: 'bondsPercent',
              type: 'number',
              label: 'Bonds %',
              labelHe: 'אג"ח %',
              required: false,
              placeholder: '40'
            },
            {
              id: 'mixedPercent',
              type: 'number',
              label: 'Mixed Funds %',
              labelHe: 'קרנות מעורבות %',
              required: false,
              placeholder: '15'
            },
            {
              id: 'moneyMarketPercent',
              type: 'number',
              label: 'Money Market %',
              labelHe: 'כספיות %',
              required: false,
              placeholder: '5'
            }
          ]
        },
        {
          id: 'M04-S03-V3',
          sectionId: 'M04-S03',
          name: 'Balanced',
          nameHe: 'מאוזנת',
          textTemplate: `מדיניות השקעות מאוזנת:\n\n**הרכב מומלץ:**\n- פיקדונות ({{depositPercent}}%)\n- אג"ח ({{bondsPercent}}%)\n- קרנות מעורבות ({{mixedPercent}}%)\n- מניות דיבידנד / מדד ({{stocksPercent}}%)\n\n**כללים:**\n- פיזור גיאוגרפי\n- פיזור בין מגזרים\n- העדפה למניות דיבידנד יציבות\n- בדיקה תקופתית של התיק (רבעונית)`,
          fields: [
            {
              id: 'depositPercent',
              type: 'number',
              label: 'Deposits %',
              labelHe: 'פיקדונות %',
              required: false,
              placeholder: '30'
            },
            {
              id: 'bondsPercent',
              type: 'number',
              label: 'Bonds %',
              labelHe: 'אג"ח %',
              required: false,
              placeholder: '30'
            },
            {
              id: 'mixedPercent',
              type: 'number',
              label: 'Mixed Funds %',
              labelHe: 'קרנות מעורבות %',
              required: false,
              placeholder: '25'
            },
            {
              id: 'stocksPercent',
              type: 'number',
              label: 'Stocks/Index %',
              labelHe: 'מניות/מדד %',
              required: false,
              placeholder: '15'
            }
          ]
        },
        {
          id: 'M04-S03-V4',
          sectionId: 'M04-S03',
          name: 'Custom',
          nameHe: 'מותאמת אישית',
          textTemplate: `מדיניות השקעות מותאמת אישית:\n\n{{customPolicy}}\n\nכל החלטת השקעה תתבצע בהתייעצות עם יועץ השקעות מוסמך ותתועד.`,
          fields: [
            {
              id: 'customPolicy',
              type: 'textarea',
              label: 'Custom Investment Policy',
              labelHe: 'מדיניות השקעות מותאמת',
              required: true,
              placeholder: 'פרט את מדיניות ההשקעות המותאמת אישית...'
            }
          ]
        }
      ]
    },
    {
      id: 'M04-S04',
      moduleId: 'M04',
      name: 'Professional Consultation',
      nameHe: 'התייעצות מקצועית',
      displayOrder: 4,
      isRequired: true,
      variants: [
        {
          id: 'M04-S04-V1',
          sectionId: 'M04-S04',
          name: 'Mandatory Consultation',
          nameHe: 'ייעוץ חובה',
          textTemplate: `כל החלטת השקעה מעל {{threshold}} ₪ תיעשה רק לאחר:\n\n1. **התייעצות עם יועץ השקעות מורשה**\n   - קבלת המלצה בכתב\n   - הסבר מפורט על הסיכונים והתשואה הצפויה\n\n2. **בדיקה במערכת "הר הכסף"**\n   - השוואת עמלות\n   - בדיקת תשואות עבר\n   - קריאת דוחות\n\n3. **תיעוד ההחלטה**\n   - רישום הנימוקים\n   - שמירת המלצות היועץ\n   - תיעוד תאריך וסכום`,
          fields: [
            {
              id: 'threshold',
              type: 'number',
              label: 'Threshold Amount',
              labelHe: 'סכום סף',
              required: true,
              placeholder: '50000',
              validation: { min: 10000 }
            }
          ]
        },
        {
          id: 'M04-S04-V2',
          sectionId: 'M04-S04',
          name: 'Recommended Consultation',
          nameHe: 'ייעוץ מומלץ',
          textTemplate: `מומלץ מאוד להתייעץ עם יועץ השקעות מורשה לפני כל החלטה משמעותית, אך אין חובה.\n\nמיופה הכוח פועל לפי שיקול דעתו המקצועי.`,
          fields: []
        },
        {
          id: 'M04-S04-V3',
          sectionId: 'M04-S04',
          name: 'No Consultation Required',
          nameHe: 'ללא דרישת ייעוץ',
          textTemplate: `מיופה הכוח פועל לפי שיקול דעתו ללא דרישה להתייעצות.\nאחריות על ההחלטות מוטלת עליו במלואה.`,
          fields: []
        }
      ]
    }
  ]
};

