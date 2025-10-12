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
          name: 'General TV Service',
          nameHe: 'שירות טלוויזיה כללי',
          textTemplate: `המשך שירות טלוויזיה כרגיל.\nחופש בחירה בתוכניות.\nתשלום חשבונות ותחזוקה שוטפת.`,
          fields: []
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

