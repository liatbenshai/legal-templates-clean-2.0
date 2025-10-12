import { Module } from '../../types/advanceDirectives.types';

export const M06_GeneralProhibitions: Module = {
  id: 'M06',
  name: 'General Prohibitions',
  nameHe: 'איסורים כלליים',
  category: 'property',
  isMandatory: true,
  displayOrder: 6,
  sections: [
    {
      id: 'M06-S01',
      moduleId: 'M06',
      name: 'Mortgage Prohibition',
      nameHe: 'איסור משכנתא',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M06-S01-V1',
          sectionId: 'M06-S01',
          name: 'Absolute Mortgage Prohibition',
          nameHe: 'איסור מוחלט על משכנתא',
          textTemplate: `חל איסור מוחלט ובלתי חוזר על נטילת משכנתא לכל מטרה שהיא, לרבות לשם השקעה, הרחבה, שיפוץ, או כל צורך אחר.\n\nהאיסור חל על כל סוגי המשכנתאות, ובפרט:\n- משכנתא רגילה\n- משכנתא הפוכה\n- משכון נכס לכל מטרה\n- הלוואה בערבות נכס\n- כל התחייבות המשעבדת נדל"ן`,
          fields: []
        }
      ]
    },
    {
      id: 'M06-S02',
      moduleId: 'M06',
      name: 'Gift Prohibition',
      nameHe: 'איסור מתנות',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M06-S02-V1',
          sectionId: 'M06-S02',
          name: 'Absolute Gift Prohibition',
          nameHe: 'איסור מוחלט על מתנות',
          textTemplate: `חל איסור מוחלט על העברת אחד מהנכסים במתנה לבן משפחה או לצד שלישי.\n\nהאיסור חל על כל צורות ההעברה ללא תמורה, לרבות:\n- העברה במתנה לבני משפחה\n- העברה במתנה לצדדים שלישיים\n- מכירה במחיר סמלי\n- העברת זכויות ללא תמורה שווה\n- הקדשה או תרומה של נדל"ן`,
          fields: []
        },
        {
          id: 'M06-S02-V2',
          sectionId: 'M06-S02',
          name: 'Gift Prohibition with Small Exception',
          nameHe: 'איסור מתנות עם חריג קטן',
          textTemplate: `חל איסור מוחלט על העברת נכסים במתנה.\n\nחריג: מתנה כספית עד {{maxGiftAmount}} ₪ בשנה לבני משפחה קרובים (ילדים/נכדים) למאורעות מיוחדים בלבד (חתונה, לידה, בר/בת מצווה).`,
          fields: [
            {
              id: 'maxGiftAmount',
              type: 'number',
              label: 'Maximum Gift Amount',
              labelHe: 'סכום מתנה מקסימלי',
              required: true,
              placeholder: '10000',
              validation: { min: 1000, max: 50000 }
            }
          ]
        }
      ]
    },
    {
      id: 'M06-S03',
      moduleId: 'M06',
      name: 'Other Prohibitions',
      nameHe: 'איסורים נוספים',
      displayOrder: 3,
      isRequired: true,
      variants: [
        {
          id: 'M06-S03-V1',
          sectionId: 'M06-S03',
          name: 'Standard Additional Prohibitions',
          nameHe: 'איסורים נוספים סטנדרטיים',
          textTemplate: `איסורים נוספים:\n- ערבות לצד שלישי (אישית או בנכס)\n- השקעות ספקולטיביות (מניות בודדות, קריפטו)\n- הימורים\n- הלוואות לאחרים\n- השקעות בעסקים חדשים\n- רכישת נכסים נוספים ללא אישור בית משפט\n- כל פעולה שמסכנת את נכסי הממנה`,
          fields: []
        }
      ]
    }
  ]
};

