import { Module } from '../../types/advanceDirectives.types';

export const M11_PersonalCare: Module = {
  id: 'M11',
  name: 'Personal Care',
  nameHe: 'טיפוח אישי',
  category: 'personal',
  isMandatory: true,
  displayOrder: 11,
  description: 'לבוש וטיפוח אישי',
  sections: [
    {
      id: 'M11-S01',
      moduleId: 'M11',
      name: 'Clothing and Appearance',
      nameHe: 'לבוש והופעה',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M11-S01-V1',
          sectionId: 'M11-S01',
          name: 'Standard Clothing Care',
          nameHe: 'טיפול לבוש סטנדרטי',
          textTemplate: `אני מבקש שמיופה הכוח ידאג לטיפוח שלי באופן שוטף, תוך הקפדה על לבוש הולם, נקי ומסודר תמיד.\n\n**חשיבות:**\nהופעה חיצונית מטופחת חשובה לי מאוד לשמירה על:\n- כבודי\n- תחושת הערך העצמי שלי\n- מצב רוח חיובי\n- יחס כבוד מהסביבה\n\n**דרישות לבוש:**\n- **בגדים נקיים תמיד**\n- **בגדים מגוהצים**\n- התאמה לעונות השנה (קיץ/חורף)\n- התאמה לאירועים:\n  * יום יום - בגדים נוחים ומסודרים\n  * יציאות מהבית - לבוש הולם ומכובד\n  * אירועים מיוחדים - לבוש חגיגי\n  * כשמגיעים אורחים - לבוש מכובד\n- בחירה לפי הטעם האישי והסגנון הרגיל שלי\n- התחשבות בנוחות ובגיל`,
          fields: []
        }
      ]
    }
  ]
};

