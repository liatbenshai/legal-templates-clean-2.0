import { Module } from '../../types/advanceDirectives.types';

export const M15_SecurityPrivacy: Module = {
  id: 'M15',
  name: 'Security and Privacy',
  nameHe: 'אבטחה ופרטיות',
  category: 'personal',
  isMandatory: false,
  displayOrder: 15,
  description: 'מצלמות אבטחה ופרטיות',
  sections: [
    {
      id: 'M15-S01',
      moduleId: 'M15',
      name: 'Security Cameras',
      nameHe: 'מצלמות אבטחה',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M15-S01-V1',
          sectionId: 'M15-S01',
          name: 'Public Areas Only',
          nameHe: 'מקומות ציבוריים בלבד',
          textTemplate: `התקנת מצלמות אבטחה:\n\n**מיקומים מותרים:**\n- כניסה לבית\n- סלון\n- מטבח\n- מסדרונות\n- כל מקום ציבורי בבית\n\n**מיקומים אסורים (פרטיות מלאה):**\n- שירותים\n- חדרי שינה\n- חדרי רחצה\n- כל מקום פרטי אחר\n\n**מטרות:**\n- בטיחות ושלום הממנה\n- מעקב אחר מצב בריאותי ותפקודי\n- ניטור איכות הטיפול\n- תיעוד במקרה צורך`,
          fields: []
        },
        {
          id: 'M15-S01-V3',
          sectionId: 'M15-S01',
          name: 'Opposition',
          nameHe: 'התנגדות',
          textTemplate: `אני מתנגד להתקנת מצלמות אבטחה בבית.\n\nשמירה על פרטיות מלאה היא זכות בסיסית שלי.\n\nבמקרה של חשש לבטיחות - יש למצוא פתרונות חלופיים (ביקורים תכופים יותר, מערכת התראה וכו').`,
          fields: []
        }
      ]
    }
  ]
};

