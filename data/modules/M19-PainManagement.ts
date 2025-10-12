import { Module } from '../../types/advanceDirectives.types';

export const M19_PainManagement: Module = {
  id: 'M19',
  name: 'Pain Management',
  nameHe: 'ניהול כאב',
  category: 'medical',
  isMandatory: true,
  displayOrder: 19,
  description: 'טיפול בכאב וסבל',
  sections: [
    {
      id: 'M19-S01',
      moduleId: 'M19',
      name: 'Pain Treatment Approach',
      nameHe: 'גישה לטיפול בכאב',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M19-S01-V1',
          sectionId: 'M19-S01',
          name: 'Aggressive Pain Management',
          nameHe: 'ניהול כאב אגרסיבי',
          textTemplate: `טיפול בכאב:\n\n**עקרון עליון: אין להשאיר אותי בכאב.**\n\nיש להשתמש בכל אמצעי זמין, כולל מורפיום והרדמה עמוקה אם נדרש.\n\n**מטרה: חיים ללא כאב.**`,
          fields: []
        },
        {
          id: 'M19-S01-V2',
          sectionId: 'M19-S01',
          name: 'Balanced Pain Management',
          nameHe: 'ניהול כאב מאוזן',
          textTemplate: `טיפול בכאב: ניהול כאב אפקטיבי תוך שמירה על ערנות.\n\nמורפיום - רק במצבים קשים.`,
          fields: []
        }
      ]
    },
    {
      id: 'M19-S02',
      moduleId: 'M19',
      name: 'Sedation',
      nameHe: 'הרגעה והרדמה',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M19-S02-V1',
          sectionId: 'M19-S02',
          name: 'Allow Deep Sedation',
          nameHe: 'לאפשר הרדמה עמוקה',
          textTemplate: `במקרה של כאב בלתי נסבל או סבל קשה: אני מאשר הרדמה עמוקה (Palliative Sedation).\n\n**מטרה: סיום סבל, גם במחיר הכרה.**`,
          fields: []
        },
        {
          id: 'M19-S02-V3',
          sectionId: 'M19-S02',
          name: 'No Sedation',
          nameHe: 'ללא הרדמה',
          textTemplate: `אני מתנגד להרדמה ממושכת.\n\nאני מעדיף להישאר בהכרה עד הרגע האחרון, גם במחיר כאב.`,
          fields: []
        }
      ]
    }
  ]
};

