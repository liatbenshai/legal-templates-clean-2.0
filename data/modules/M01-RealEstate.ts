import { Module } from '../../types/advanceDirectives.types';

export const M01_RealEstate: Module = {
  id: 'M01',
  name: 'Real Estate',
  nameHe: 'נדל"ן',
  category: 'property',
  isMandatory: true,
  displayOrder: 1,
  description: 'ניהול נכסי מקרקעין',
  sections: [
    {
      id: 'M01-S01',
      moduleId: 'M01',
      name: 'Primary Residence',
      nameHe: 'דירת מגורים ראשית',
      displayOrder: 1,
      isRequired: true,
      variants: [],
      subsections: [
        {
          id: 'M01-S01-A',
          name: 'Ownership Declaration',
          nameHe: 'הצהרת בעלות',
          variants: [
            {
              id: 'M01-S01-A-V1',
              sectionId: 'M01-S01-A',
              name: 'Full Ownership - Single',
              nameHe: 'בעלות מלאה - יחיד',
              textTemplate: `בבעלותי דירת מגורים בבעלות מלאה הממוקמת ב{{address}}, עיר {{city}}, גוש {{gush}}, חלקה {{helka}}, תת-חלקה {{tatHelka}}.`,
              fields: [
                {
                  id: 'address',
                  type: 'text',
                  label: 'Street Address',
                  labelHe: 'כתובת רחוב',
                  required: true,
                  placeholder: 'רחוב הרצל 10'
                },
                {
                  id: 'city',
                  type: 'text',
                  label: 'City',
                  labelHe: 'עיר',
                  required: true,
                  placeholder: 'תל אביב'
                },
                {
                  id: 'gush',
                  type: 'text',
                  label: 'Gush',
                  labelHe: 'גוש',
                  required: true,
                  placeholder: '12345'
                },
                {
                  id: 'helka',
                  type: 'text',
                  label: 'Helka',
                  labelHe: 'חלקה',
                  required: true,
                  placeholder: '67'
                },
                {
                  id: 'tatHelka',
                  type: 'text',
                  label: 'Tat-Helka',
                  labelHe: 'תת-חלקה',
                  required: false,
                  placeholder: '8'
                }
              ]
            },
            {
              id: 'M01-S01-A-V2',
              sectionId: 'M01-S01-A',
              name: 'Full Ownership - Married',
              nameHe: 'בעלות מלאה - נשוי/אה',
              textTemplate: `בבעלותי ובבעלות בן/בת זוגי {{spouseName}} דירת מגורים בבעלות מלאה משותפת הממוקמת ב{{address}}, עיר {{city}}, גוש {{gush}}, חלקה {{helka}}, תת-חלקה {{tatHelka}}.`,
              conditions: [
                { field: 'maritalStatus', operator: 'equals', value: 'married' }
              ],
              fields: [
                {
                  id: 'spouseName',
                  type: 'text',
                  label: 'Spouse Name',
                  labelHe: 'שם בן/בת הזוג',
                  required: true,
                  placeholder: 'שרה כהן'
                },
                {
                  id: 'address',
                  type: 'text',
                  label: 'Street Address',
                  labelHe: 'כתובת רחוב',
                  required: true,
                  placeholder: 'רחוב הרצל 10'
                },
                {
                  id: 'city',
                  type: 'text',
                  label: 'City',
                  labelHe: 'עיר',
                  required: true,
                  placeholder: 'תל אביב'
                },
                {
                  id: 'gush',
                  type: 'text',
                  label: 'Gush',
                  labelHe: 'גוש',
                  required: true
                },
                {
                  id: 'helka',
                  type: 'text',
                  label: 'Helka',
                  labelHe: 'חלקה',
                  required: true
                },
                {
                  id: 'tatHelka',
                  type: 'text',
                  label: 'Tat-Helka',
                  labelHe: 'תת-חלקה',
                  required: false
                }
              ]
            },
            {
              id: 'M01-S01-A-V3',
              sectionId: 'M01-S01-A',
              name: 'Partial Ownership - 50%',
              nameHe: 'בעלות חלקית - 50%',
              textTemplate: `בבעלותי מחצית (50%) מדירת מגורים הממוקמת ב{{address}}, עיר {{city}}, גוש {{gush}}, חלקה {{helka}}, תת-חלקה {{tatHelka}}. המחצית השנייה בבעלות {{coOwner}}.`,
              fields: [
                {
                  id: 'address',
                  type: 'text',
                  label: 'Street Address',
                  labelHe: 'כתובת רחוב',
                  required: true
                },
                {
                  id: 'city',
                  type: 'text',
                  label: 'City',
                  labelHe: 'עיר',
                  required: true
                },
                {
                  id: 'gush',
                  type: 'text',
                  label: 'Gush',
                  labelHe: 'גוש',
                  required: true
                },
                {
                  id: 'helka',
                  type: 'text',
                  label: 'Helka',
                  labelHe: 'חלקה',
                  required: true
                },
                {
                  id: 'tatHelka',
                  type: 'text',
                  label: 'Tat-Helka',
                  labelHe: 'תת-חלקה',
                  required: false
                },
                {
                  id: 'coOwner',
                  type: 'text',
                  label: 'Co-Owner',
                  labelHe: 'שותף בבעלות',
                  required: true,
                  placeholder: 'שרה כהן'
                }
              ]
            }
          ]
        },
        {
          id: 'M01-S01-B',
          name: 'Sale Restrictions',
          nameHe: 'מגבלות על מכירה',
          variants: [
            {
              id: 'M01-S01-B-V1',
              sectionId: 'M01-S01-B',
              name: 'Absolute Prohibition',
              nameHe: 'איסור מוחלט',
              textTemplate: `חל איסור מוחלט על מכירת דירת המגורים הראשית. מכירה אפשרית רק במקרים חריגים ביותר כמפורט להלן.`,
              fields: []
            },
            {
              id: 'M01-S01-B-V2',
              sectionId: 'M01-S01-B',
              name: 'Prohibition with Medical Exceptions',
              nameHe: 'איסור עם חריגים רפואיים',
              textTemplate: `חל איסור על מכירת דירת המגורים הראשית, אלא במקרים חריגים הבאים בלבד:\n1. צורך בדירה נגישה בשל מצב רפואי מגביל\n2. צורך רפואי דחוף ומציל חיים שלא ניתן לממנו ממקורות אחרים\n3. מימון שהייה בבית אבות פרטי במקרה של צורך סיעודי מוכח`,
              fields: []
            }
          ]
        },
        {
          id: 'M01-S01-C',
          name: 'Court Approval',
          nameHe: 'אישור בית משפט',
          variants: [
            {
              id: 'M01-S01-C-V1',
              sectionId: 'M01-S01-C',
              name: 'Mandatory Court Approval',
              nameHe: 'אישור בית משפט חובה',
              textTemplate: `כל פעולה של מכירת דירת המגורים מחייבת קבלת אישור מקדים מבית המשפט לענייני משפחה. מיופה הכוח יפנה לבית המשפט בבקשה למתן הוראות, תוך הצגת:\n- מצב רפואי מפורט\n- חוות דעת רפואית מקצועית\n- אישורים לגבי העדר מקורות כספיים אחרים\n- פירוט השימוש המיועד בתמורת המכירה`,
              fields: []
            }
          ]
        },
        {
          id: 'M01-S01-D',
          name: 'Alternative Residence Requirements',
          nameHe: 'דרישות לדירה חלופית',
          variants: [
            {
              id: 'M01-S01-D-V1',
              sectionId: 'M01-S01-D',
              name: 'Standard Requirements',
              nameHe: 'דרישות סטנדרטיות',
              textTemplate: `במקרה של מכירת דירת המגורים, הדירה החלופית חייבת לעמוד בתנאים הבאים:\n1. מותאמת באופן מלא לצרכים רפואיים ופיזיים\n2. ממוקמת באזור עם גישה נוחה לשירותים רפואיים חיוניים\n3. זהה ככל הניתן לתנאי המחיה ורמת החיים הקודמים\n4. נגישה (רמפות, מעלית, חדרי רחצה מותאמים)\n5. בגודל מינימלי של {{minSize}} מ"ר`,
              fields: [
                {
                  id: 'minSize',
                  type: 'number',
                  label: 'Minimum Size (sqm)',
                  labelHe: 'גודל מינימלי (מ"ר)',
                  required: false,
                  placeholder: '80',
                  validation: {
                    min: 30,
                    max: 200
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M01-S02',
      moduleId: 'M01',
      name: 'Investment Properties',
      nameHe: 'נכסים נוספים להשקעה',
      displayOrder: 2,
      isRequired: false,
      variants: [],
      subsections: [
        {
          id: 'M01-S02-A',
          name: 'Property Listing',
          nameHe: 'רישום נכסים',
          variants: [
            {
              id: 'M01-S02-A-V1',
              sectionId: 'M01-S02-A',
              name: 'Multiple Properties',
              nameHe: 'נכסים מרובים',
              textTemplate: `בבעלותי הנכסים הבאים:\n{{#each properties}}\n{{index}}. {{type}} ברחוב {{address}}, {{city}}, גוש {{gush}}, חלקה {{helka}}{{#if ownership}}, בעלות {{ownership}}%{{/if}}{{#if coOwner}}, במשותף עם {{coOwner}}{{/if}}{{#if monthlyIncome}}, הכנסה חודשית: {{monthlyIncome}} ₪{{/if}}\n{{/each}}`,
              fields: [
                {
                  id: 'properties',
                  type: 'array',
                  label: 'Properties',
                  labelHe: 'נכסים',
                  required: true,
                  arrayItemSchema: [
                    {
                      id: 'type',
                      type: 'select',
                      label: 'Property Type',
                      labelHe: 'סוג נכס',
                      required: true,
                      options: [
                        { value: 'apartment', label: 'Apartment', labelHe: 'דירה' },
                        { value: 'land', label: 'Land', labelHe: 'מגרש' },
                        { value: 'office', label: 'Office', labelHe: 'משרד' },
                        { value: 'shop', label: 'Shop', labelHe: 'חנות' },
                        { value: 'warehouse', label: 'Warehouse', labelHe: 'מחסן' }
                      ]
                    },
                    {
                      id: 'address',
                      type: 'text',
                      label: 'Address',
                      labelHe: 'כתובת',
                      required: true
                    },
                    {
                      id: 'city',
                      type: 'text',
                      label: 'City',
                      labelHe: 'עיר',
                      required: true
                    },
                    {
                      id: 'gush',
                      type: 'text',
                      label: 'Gush',
                      labelHe: 'גוש',
                      required: true
                    },
                    {
                      id: 'helka',
                      type: 'text',
                      label: 'Helka',
                      labelHe: 'חלקה',
                      required: true
                    },
                    {
                      id: 'ownership',
                      type: 'number',
                      label: 'Ownership %',
                      labelHe: 'אחוז בעלות',
                      required: false,
                      placeholder: '100',
                      validation: { min: 1, max: 100 }
                    },
                    {
                      id: 'coOwner',
                      type: 'text',
                      label: 'Co-Owner',
                      labelHe: 'שותף',
                      required: false
                    },
                    {
                      id: 'monthlyIncome',
                      type: 'number',
                      label: 'Monthly Income',
                      labelHe: 'הכנסה חודשית',
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'M01-S02-B',
          name: 'Tabu Warning Note',
          nameHe: 'הערת אזהרה בטאבו',
          variants: [
            {
              id: 'M01-S02-B-V1',
              sectionId: 'M01-S02-B',
              name: 'Warning on All Properties',
              nameHe: 'הערה על כל הנכסים',
              textTemplate: `אני מבקש לרשום הערת אזהרה בטאבו על כל הנכסים המפורטים לעיל, בדבר הפעלת ייפוי כוח מתמשך.`,
              fields: []
            }
          ]
        }
      ]
    }
  ]
};

