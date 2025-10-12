import { Module } from '../../types/advanceDirectives.types';

export const M13_CultureLeisure: Module = {
  id: 'M13',
  name: 'Culture and Leisure',
  nameHe: 'תרבות ופנאי',
  category: 'personal',
  isMandatory: false,
  displayOrder: 13,
  description: 'פעילויות תרבות ופנאי',
  sections: [
    {
      id: 'M13-S01',
      moduleId: 'M13',
      name: 'Activity Selection',
      nameHe: 'בחירת פעילויות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M13-S01-V1',
          sectionId: 'M13-S01',
          name: 'Selected Activities',
          nameHe: 'פעילויות נבחרות',
          textTemplate: `פעילויות תרבות ופנאי שחשובות לי (קולנוע, תיאטרון, קונצרטים, מוזיאונים, בתי קפה, חוף הים, קניונים, פארקים, ספרייה, חוגים)`,
          fields: []
        }
      ]
    },
    {
      id: 'M13-S02',
      moduleId: 'M13',
      name: 'Organization Principles',
      nameHe: 'עקרונות ארגון',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M13-S02-V1',
          sectionId: 'M13-S02',
          name: 'Standard Organization',
          nameHe: 'ארגון סטנדרטי',
          textTemplate: `מיופה הכוח ידאג לארגון הפעילויות:\n\n- **תיאום** - תיאום מראש של כל פעילות\n- **ליווי** - ליווי אישי אם נדרש\n- **הסעה** - ארגון הסעה מתאימה (מונית, רכב פרטי)\n- **נגישות** - וידוא נגישות המקום\n- **תשלום** - תשלום עלויות (כרטיסים, מנויים)\n- **עידוד** - עידוד השתתפות תוך כיבוד רצון\n- **גמישות** - אפשרות לביטול אם לא מרגיש טוב`,
          fields: []
        }
      ]
    }
  ]
};

