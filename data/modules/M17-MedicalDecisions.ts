import { Module } from '../../types/advanceDirectives.types';

export const M17_MedicalDecisions: Module = {
  id: 'M17',
  name: 'Medical Decisions',
  nameHe: 'החלטות רפואיות',
  category: 'medical',
  isMandatory: true,
  displayOrder: 17,
  description: 'עקרונות קבלת החלטות רפואיות',
  sections: [
    {
      id: 'M17-S01',
      moduleId: 'M17',
      name: 'Decision Making Authority',
      nameHe: 'סמכות קבלת החלטות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M17-S01-V1',
          sectionId: 'M17-S01',
          name: 'Full Authority',
          nameHe: 'סמכות מלאה',
          textTemplate: `מיופה הכוח רשאי לקבל כל החלטה רפואית בשמי, לרבות:\n\n- **הסכמה לטיפולים רפואיים** - כל סוג של טיפול, ניתוח, פרוצדורה\n- **סירוב לטיפולים** - בהתאם לשיקול דעתו ולהמלצות רפואיות\n- **החלטה על תרופות** - תחילת טיפול תרופתי, שינוי, הפסקה\n- **בחירת רופאים ומוסדות** - בחירת רופאים מומחים, בתי חולים, מרפאות\n- **גישה למידע רפואי** - גישה מלאה לכל המידע הרפואי שלי\n- **הזמנת בדיקות** - אישור לביצוע בדיקות, סריקות, טסטים\n\n**עקרונות:**\n- ההחלטות יתקבלו לטובתי בלבד\n- בהתייעצות עם הצוות הרפואי\n- תוך כיבוד רצונותיי ככל שניתן`,
          fields: []
        }
      ]
    },
    {
      id: 'M17-S02',
      moduleId: 'M17',
      name: 'Treatment Principles',
      nameHe: 'עקרונות טיפול',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M17-S02-V1',
          sectionId: 'M17-S02',
          name: 'Maximum Treatment',
          nameHe: 'מקסימום טיפול',
          textTemplate: `עקרון טיפול: מקסימום מאמץ רפואי\n\nיש לנקוט בכל אמצעי רפואי זמין ומקובל לשמירה על חיי, בריאותי ואיכות חיי.`,
          fields: []
        },
        {
          id: 'M17-S02-V2',
          sectionId: 'M17-S02',
          name: 'Balanced Approach',
          nameHe: 'גישה מאוזנת',
          textTemplate: `עקרון טיפול: גישה מאוזנת\n\nנקיטת טיפולים רפואיים סבירים תוך איזון בין סיכויי הצלחה, איכות חיים, תופעות לוואי וסבל.`,
          fields: []
        },
        {
          id: 'M17-S02-V3',
          sectionId: 'M17-S02',
          name: 'Quality of Life Focus',
          nameHe: 'דגש איכות חיים',
          textTemplate: `עקרון טיפול: דגש על איכות חיים\n\nאיכות החיים חשובה יותר מאורך החיים.`,
          fields: []
        }
      ]
    },
    {
      id: 'M17-S05',
      moduleId: 'M17',
      name: 'Emergency Situations',
      nameHe: 'מצבי חירום',
      displayOrder: 5,
      isRequired: true,
      variants: [
        {
          id: 'M17-S05-V1',
          sectionId: 'M17-S05',
          name: 'Full Resuscitation',
          nameHe: 'החייאה מלאה',
          textTemplate: `במצב חירום רפואי: יש לבצע כל פעולה רפואית להצלת חיים.`,
          fields: []
        },
        {
          id: 'M17-S05-V3',
          sectionId: 'M17-S05',
          name: 'DNR - Do Not Resuscitate',
          nameHe: 'DNR - ללא החייאה',
          textTemplate: `במצב של דום לב או דום נשימה: אין לבצע החייאה (DNR).`,
          fields: []
        }
      ]
    }
  ]
};

