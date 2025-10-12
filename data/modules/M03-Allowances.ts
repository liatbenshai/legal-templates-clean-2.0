import { Module } from '../../types/advanceDirectives.types';

export const M03_Allowances: Module = {
  id: 'M03',
  name: 'Allowances and Benefits',
  nameHe: 'קצבאות וגמלאות',
  category: 'property',
  isMandatory: false,
  displayOrder: 3,
  description: 'ניהול קצבאות, גמלאות ותגמולים',
  sections: [
    {
      id: 'M03-S01',
      moduleId: 'M03',
      name: 'Allowance Registration',
      nameHe: 'רישום קצבאות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M03-S01-V1',
          sectionId: 'M03-S01',
          name: 'Allowance List',
          nameHe: 'רשימת קצבאות',
          textTemplate: `אני מקבל את הקצבאות והגמלאות הבאות:\n{{#each allowances}}\n{{index}}. {{type}} - {{source}}\n   סכום חודשי: {{amount}} ₪\n   תאריך תשלום: {{paymentDate}} בכל חודש\n   מופקד לחשבון: {{accountNumber}}{{#if conditions}}\n   תנאים מיוחדים: {{conditions}}{{/if}}\n{{/each}}`,
          fields: [
            {
              id: 'allowances',
              type: 'array',
              label: 'Allowances',
              labelHe: 'קצבאות',
              required: true,
              arrayItemSchema: [
                {
                  id: 'type',
                  type: 'select',
                  label: 'Allowance Type',
                  labelHe: 'סוג קצבה',
                  required: true,
                  options: [
                    { value: 'disability', label: 'Disability Allowance', labelHe: 'קצבת נכות' },
                    { value: 'old_age', label: 'Old Age Pension', labelHe: 'קצבת זקנה' },
                    { value: 'mobility', label: 'Mobility Allowance', labelHe: 'קצבת ניידות' },
                    { value: 'pension', label: 'Work Pension', labelHe: 'פנסיה מעבודה' },
                    { value: 'benefits', label: 'Benefits', labelHe: 'תגמולים' },
                    { value: 'survivor', label: 'Survivor Pension', labelHe: 'קצבת שאירים' },
                    { value: 'income_support', label: 'Income Support', labelHe: 'הבטחת הכנסה' }
                  ]
                },
                {
                  id: 'source',
                  type: 'select',
                  label: 'Source',
                  labelHe: 'מקור',
                  required: true,
                  options: [
                    { value: 'mod', label: 'Ministry of Defense', labelHe: 'משרד הביטחון' },
                    { value: 'nii', label: 'National Insurance', labelHe: 'ביטוח לאומי' },
                    { value: 'private_pension', label: 'Private Pension Fund', labelHe: 'קופת פנסיה פרטית' },
                    { value: 'employer', label: 'Employer', labelHe: 'מעסיק קודם' },
                    { value: 'other', label: 'Other', labelHe: 'אחר' }
                  ]
                },
                {
                  id: 'amount',
                  type: 'number',
                  label: 'Monthly Amount',
                  labelHe: 'סכום חודשי',
                  required: true,
                  placeholder: '5000',
                  validation: { min: 0 }
                },
                {
                  id: 'paymentDate',
                  type: 'number',
                  label: 'Payment Date (day of month)',
                  labelHe: 'תאריך תשלום (יום בחודש)',
                  required: true,
                  placeholder: '28',
                  validation: { min: 1, max: 31 }
                },
                {
                  id: 'accountNumber',
                  type: 'text',
                  label: 'Account Number',
                  labelHe: 'מספר חשבון',
                  required: true,
                  placeholder: 'בנק הפועלים 123-456789'
                },
                {
                  id: 'conditions',
                  type: 'textarea',
                  label: 'Special Conditions',
                  labelHe: 'תנאים מיוחדים',
                  required: false,
                  placeholder: 'למשל: טעון הערכה שנתית'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M03-S02',
      moduleId: 'M03',
      name: 'Attorney Responsibilities',
      nameHe: 'חובות מיופה כוח',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M03-S02-V1',
          sectionId: 'M03-S02',
          name: 'Standard Responsibilities',
          nameHe: 'חובות סטנדרטיות',
          textTemplate: `חובות מיופה הכוח בנוגע לקצבאות:\n\n1. **וידוא קבלה במועד**\n   - לוודא שכל קצבה מתקבלת במועדה\n   - לבדוק את החשבון באופן שוטף\n\n2. **טיפול בעיכובים**\n   - במקרה של עיכוב או אי-העברה - פנייה מיידית לגורם המשלם\n   - מעקב עד לפתרון מלא\n\n3. **דיווח על שינויים**\n   - דיווח מיידי לגורמים הרלוונטיים על כל שינוי במצב הממנה:\n     * שינוי מצב רפואי\n     * שינוי מצב משפחתי\n     * שינוי כתובת\n     * כל שינוי אחר העשוי להשפיע על הזכאות\n\n4. **בירורים והשגות**\n   - ביצוע בירורים בנוגע לזכויות\n   - הגשת השגות במקרה הצורך\n   - עדכון פרטים אישיים במערכות\n\n5. **בקשות לקצבאות נוספות**\n   - בדיקת זכאות לקצבאות נוספות\n   - הגשת בקשות במידת הצורך\n\n6. **מעקב אחר שינויים**\n   - מעקב אחר שינויים בזכאות או בסכומים\n   - דיווח למשפחה על שינויים משמעותיים\n\n7. **שמירת מסמכים**\n   - שמירת כל ההתכתבויות עם הגורמים המשלמים\n   - ארכיון אישורים ומסמכים רלוונטיים`,
          fields: []
        },
        {
          id: 'M03-S02-V2',
          sectionId: 'M03-S02',
          name: 'Enhanced Responsibilities - MOD',
          nameHe: 'חובות מוגברות - משרד הביטחון',
          textTemplate: `חובות מיופה הכוח בנוגע לקצבאות (כולל משרד הביטחון):\n\nכל החובות הסטנדרטיות +\n\n**בנוגע לזכויות ממשרד הביטחון:**\n8. **קשר שוטף עם מחלקת השיקום**\n   - שמירה על קשר רציף עם מחלקת השיקום במשרד הביטחון\n   - טלפון: {{modPhone}}\n\n9. **בדיקת זכויות נוספות**\n   - בדיקה תקופתית (אחת לשנה) של זכויות נוספות\n   - קורסים, השתלמויות, טיפולים, ציוד מיוחד\n\n10. **דיווח על אירועים רפואיים**\n    - דיווח מיידי על אשפוזים\n    - דיווח על שינויים במצב הרפואי\n    - תיאום טיפולים דרך משרד הביטחון\n\n11. **הערכות תקופתיות**\n    - וידוא ביצוע הערכות רפואיות נדרשות במועד\n    - ליווי להערכות\n    - מעקב אחר תוצאות`,
          fields: [
            {
              id: 'modPhone',
              type: 'text',
              label: 'MOD Rehabilitation Dept Phone',
              labelHe: 'טלפון מחלקת שיקום',
              required: false,
              placeholder: '03-7776777'
            }
          ]
        }
      ]
    },
    {
      id: 'M03-S03',
      moduleId: 'M03',
      name: 'Allowance Purpose',
      nameHe: 'ייעוד כספי קצבאות',
      displayOrder: 3,
      isRequired: true,
      variants: [
        {
          id: 'M03-S03-V1',
          sectionId: 'M03-S03',
          name: 'Strict Purpose',
          nameHe: 'ייעוד קפדני',
          textTemplate: `כספי הקצבאות והגמלאות יועדו אך ורק לצרכים הבאים:\n- הוצאות מחיה (מזון, ביגוד, תחזוקת בית)\n- טיפול רפואי (תרופות, בדיקות, טיפולים)\n- תשלומי חובה (ארנונה, מים, חשמל, ביטוחים)\n- צרכים בסיסיים נוספים\n\nאין להשתמש בכספי הקצבאות למטרות אחרות.`,
          fields: []
        },
        {
          id: 'M03-S03-V2',
          sectionId: 'M03-S03',
          name: 'Flexible Purpose',
          nameHe: 'ייעוד גמיש',
          textTemplate: `כספי הקצבאות והגמלאות ישמשו לכל צורך הקשור לרווחת הממנה ולאיכות חייו, לרבות:\n- הוצאות מחיה שוטפות\n- טיפול רפואי ותרופות\n- פעילויות פנאי ותרבות\n- שיפור איכות חיים\n- כל צורך אחר לטובת הממנה`,
          fields: []
        }
      ]
    }
  ]
};

