import { Module } from '../../types/advanceDirectives.types';

export const M14_Technology: Module = {
  id: 'M14',
  name: 'Technology and Media',
  nameHe: 'טכנולוגיה ומדיה',
  category: 'personal',
  isMandatory: false,
  displayOrder: 14,
  description: 'טלוויזיה, מחשב, טלפון וטכנולוגיה',
  sections: [
    {
      id: 'M14-S01',
      moduleId: 'M14',
      name: 'Television',
      nameHe: 'טלוויזיה',
      displayOrder: 1,
      isRequired: false,
      variants: [
        {
          id: 'M14-S01-V1',
          sectionId: 'M14-S01',
          name: 'Detailed TV Service',
          nameHe: 'שירות טלוויזיה מפורט',
          textTemplate: `שירות טלוויזיה:\n\n**ספק:** {{provider}}{{#if preferredChannels}}\n**ערוצים מועדפים:** {{preferredChannels}}{{/if}}\n\n**אחריות מיופה כוח:**\n- המשך מנויים קיימים\n- תשלום חשבונות במועד\n- תיקון/שדרוג ציוד לפי צורך\n- פתרון תקלות טכניות\n\n**חופש בחירה:**\nאני רשאי לבחור בתוכניות הטלוויזיה לפי העדפותיי האישיות וללא התערבות.`,
          fields: [
            {
              id: 'provider',
              type: 'select',
              label: 'TV Provider',
              labelHe: 'ספק טלוויזיה',
              required: true,
              options: [
                { value: 'hot', label: 'HOT', labelHe: 'HOT' },
                { value: 'yes', label: 'Yes', labelHe: 'Yes' },
                { value: 'sting', label: 'Sting TV', labelHe: 'Sting TV' },
                { value: 'cellcom', label: 'Cellcom TV', labelHe: 'Cellcom TV' },
                { value: 'partner', label: 'Partner TV', labelHe: 'Partner TV' },
                { value: 'other', label: 'Other', labelHe: 'אחר' }
              ]
            },
            {
              id: 'preferredChannels',
              type: 'text',
              label: 'Preferred Channels',
              labelHe: 'ערוצים מועדפים',
              required: false,
              placeholder: 'ערוץ 12, ערוץ החיים הטובים, Viva'
            }
          ]
        },
        {
          id: 'M14-S01-V2',
          sectionId: 'M14-S01',
          name: 'General TV Service',
          nameHe: 'שירות טלוויזיה כללי',
          textTemplate: `המשך שירות טלוויזיה כרגיל.\nחופש בחירה בתוכניות.\nתשלום חשבונות ותחזוקה שוטפת.`,
          fields: []
        }
      ]
    },
    {
      id: 'M14-S02',
      moduleId: 'M14',
      name: 'Computer',
      nameHe: 'מחשב',
      displayOrder: 2,
      isRequired: false,
      variants: [
        {
          id: 'M14-S02-V1',
          sectionId: 'M14-S02',
          name: 'Computer Access',
          nameHe: 'גישה למחשב',
          textTemplate: `מחשב נייד/שולחני:\n\n- התקנת אנטי-וירוס ועדכון שוטף\n- גישה חופשית בכל עת\n- סיוע טכני במקרה צורך\n- תיקון תקלות מיידי\n- ללא ניטור או צנזורה{{#if internetUsage}}\n\n**שימוש באינטרנט:**\n{{internetUsage}}{{/if}}`,
          fields: [
            {
              id: 'internetUsage',
              type: 'textarea',
              label: 'Internet Usage Guidelines',
              labelHe: 'הנחיות שימוש באינטרנט',
              required: false,
              placeholder: 'למשל: לגלישה חופשית, דואר אלקטרוני, רשתות חברתיות'
            }
          ]
        }
      ]
    },
    {
      id: 'M14-S03',
      moduleId: 'M14',
      name: 'Phone',
      nameHe: 'טלפון',
      displayOrder: 3,
      isRequired: false,
      variants: [
        {
          id: 'M14-S03-V1',
          sectionId: 'M14-S03',
          name: 'Phone Access',
          nameHe: 'גישה לטלפון',
          textTemplate: `טלפון {{phoneType}}:\n\n- גישה חופשית בכל עת לטלפון\n- במקרה של אי יכולת לחייג - סיוע מיידי\n- זמינות קבועה\n- תיקון/החלפה במקרה קלקול\n- שמירה על פרטיות שיחות\n- תשלום חשבונות במועד{{#if contacts}}\n\n**אנשי קשר חשובים:**\n{{contacts}}{{/if}}`,
          fields: [
            {
              id: 'phoneType',
              type: 'select',
              label: 'Phone Type',
              labelHe: 'סוג טלפון',
              required: false,
              options: [
                { value: 'mobile', label: 'Mobile', labelHe: 'נייד' },
                { value: 'landline', label: 'Landline', labelHe: 'קווי' },
                { value: 'both', label: 'Both', labelHe: 'שניהם' }
              ]
            },
            {
              id: 'contacts',
              type: 'textarea',
              label: 'Important Contacts',
              labelHe: 'אנשי קשר חשובים',
              required: false,
              placeholder: 'רשימת אנשי קשר שחשוב לשמור'
            }
          ]
        }
      ]
    },
    {
      id: 'M14-S04',
      moduleId: 'M14',
      name: 'Repairs',
      nameHe: 'תיקון ותחזוקה',
      displayOrder: 4,
      isRequired: true,
      variants: [
        {
          id: 'M14-S04-V1',
          sectionId: 'M14-S04',
          name: 'Immediate Repair Policy',
          nameHe: 'מדיניות תיקון מיידי',
          textTemplate: `במקרה של קלקול או תקלה בכל מכשיר (טלוויזיה/מחשב/טלפון/טאבלט):\n\n**תיקון מיידי:**\n- טיפול וסידור תיקון תוך 24-48 שעות\n- או ספק מכשיר חלופה זמנית מיידי\n\n**עקרון:**\nלא יהיה מצב בו אין גישה למכשירים חיוניים.\n\n**במקרה של קלקול מוחלט:**\n- רכישת מכשיר חדש במהירות\n- בהתאם לתקציב סביר\n- בייעוץ עם מומחה טכני`,
          fields: []
        }
      ]
    }
  ]
};

