import { Module } from '../../types/advanceDirectives.types';

export const M09_LivingEnvironment: Module = {
  id: 'M09',
  name: 'Living Environment',
  nameHe: 'סביבת מגורים',
  category: 'personal',
  isMandatory: true,
  displayOrder: 9,
  description: 'ניקיון, אחזקה וסביבת מגורים',
  sections: [
    {
      id: 'M09-S01',
      moduleId: 'M09',
      name: 'Cleanliness',
      nameHe: 'ניקיון',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M09-S01-V1',
          sectionId: 'M09-S01',
          name: 'Standard Cleaning',
          nameHe: 'ניקיון סטנדרטי',
          textTemplate: `אני מבקש שמיופה הכוח ידאג, ככל הניתן, שהדירה תהיה תמיד מסודרת ונקייה.\n\n**ניקיון שבועי יסודי (פעם בשבוע לפחות):**\n- שטיפת רצפות בכל החדרים\n- ניקוי יסודי של חדרי שירותים ואמבטיה\n- ניקוי המטבח (כיור, תנור, מקרר)\n- ניקוי אבק בכל החדרים (רהיטים, מדפים)\n- החלפת מצעי מיטה\n\n**חשיבות:**\nסביבת מגורים נקייה ומסודרת חשובה לי מאוד לשמירה על:\n- איכות חיי\n- בריאותי הפיזית והנפשית\n- תחושת כבוד עצמי\n- נוחות ורווחה`,
          fields: []
        },
        {
          id: 'M09-S01-V2',
          sectionId: 'M09-S01',
          name: 'Enhanced Cleaning',
          nameHe: 'ניקיון מוגבר',
          textTemplate: `הדירה תהיה תמיד מסודרת ונקייה:\n\n**ניקיון יומי קל:**\n- סדר כללי\n- ניקוי משטחים (מטבח, חדרי רחצה)\n- החלפת מגבות\n\n**ניקיון שבועי יסודי:**\n- שטיפת רצפות\n- ניקוי יסודי שירותים ואמבטיה\n- ניקוי מטבח\n- ניקוי אבק\n- החלפת מצעים ({{sheetsChangeFrequency}})\n\n**ניקיון חודשי מעמיק:**\n- שטיפת חלונות\n- ניקוי ארונות מבפנים\n- ניקוי תריסים\n- ניקוי מזגנים / מאווררים`,
          fields: [
            {
              id: 'sheetsChangeFrequency',
              type: 'select',
              label: 'Sheet Change Frequency',
              labelHe: 'תדירות החלפת מצעים',
              required: false,
              options: [
                { value: 'weekly', label: 'Once a week', labelHe: 'פעם בשבוע' },
                { value: 'twice_weekly', label: 'Twice a week', labelHe: 'פעמיים בשבוע' },
                { value: 'as_needed', label: 'As needed', labelHe: 'לפי צורך' }
              ]
            }
          ]
        },
        {
          id: 'M09-S01-V3',
          sectionId: 'M09-S01',
          name: 'Basic Cleaning',
          nameHe: 'ניקיון בסיסי',
          textTemplate: `ניקיון שבועי בסיסי:\n- שטיפת רצפות\n- ניקוי שירותים\n- ניקוי מטבח\n- רמת ניקיון סבירה`,
          fields: []
        }
      ]
    },
    {
      id: 'M09-S02',
      moduleId: 'M09',
      name: 'Maintenance',
      nameHe: 'אחזקה ותיקונים',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M09-S02-V1',
          sectionId: 'M09-S02',
          name: 'Standard Maintenance',
          nameHe: 'אחזקה סטנדרטית',
          textTemplate: `מיופה הכוח יטפל באחזקה ותיקונים:\n\n**תיקונים דחופים** (תוך 24 שעות):\n- נזילות מים / אינסטלציה\n- תקלות חשמל מסוכנות\n- דלת / חלון שבור\n- תקלות במזגן (בקיץ/חורף)\n- כל תקלה המשפיעה על בטיחות או תפקוד בסיסי\n\n**תיקונים רגילים** (תוך שבוע):\n- מכשירי חשמל\n- ריהוט\n- צביעה (אם נדרש)\n- תיקונים קוסמטיים\n\n**תחזוקה שוטפת:**\n- בדיקת גז תקופתית\n- תחזוקת מזגנים (ניקוי פילטרים)\n- בדיקת מערכות (חשמל, מים)\n- החלפת נורות\n\n**החלפת ציוד מקולקל:**\n- במקרה של קלקול מכשיר - תיקון או החלפה\n- רכישת ציוד חדש אם כדאי יותר מתיקון\n\n**מזיקים:**\n- טיפול במזיקים (תיקנים, נמלים וכו') במידת הצורך\n\n**תקציב ודיווח:**{{#if reportingThreshold}}\n- תיקון מעל {{reportingThreshold}} ₪ - דיווח למשפחה או קבלת חוות דעת נוספת{{/if}}\n- שמירת כל חשבוניות התיקונים`,
          fields: [
            {
              id: 'reportingThreshold',
              type: 'number',
              label: 'Reporting Threshold',
              labelHe: 'סף דיווח',
              required: false,
              placeholder: '5000',
              validation: { min: 1000 }
            }
          ]
        }
      ]
    }
  ]
};

