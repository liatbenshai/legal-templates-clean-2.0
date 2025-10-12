import { Module } from '../../types/advanceDirectives.types';

export const M18_EndOfLife: Module = {
  id: 'M18',
  name: 'End of Life Care',
  nameHe: 'טיפול בסוף החיים',
  category: 'medical',
  isMandatory: true,
  displayOrder: 18,
  description: 'הנחיות לטיפול בסוף החיים',
  sections: [
    {
      id: 'M18-S02',
      moduleId: 'M18',
      name: 'Life Extending Treatment',
      nameHe: 'טיפול מאריך חיים',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M18-S02-V1',
          sectionId: 'M18-S02',
          name: 'Maximum Extension',
          nameHe: 'הארכה מקסימלית',
          textTemplate: `במצב של מחלה סופנית: יש להמשיך בכל טיפול מאריך חיים.`,
          fields: []
        },
        {
          id: 'M18-S02-V3',
          sectionId: 'M18-S02',
          name: 'Comfort Care Only',
          nameHe: 'טיפול נוחות בלבד',
          textTemplate: `במצב של מחלה סופנית: להפסיק כל טיפול מאריך חיים ולהתמקד בנוחות.`,
          fields: []
        }
      ]
    },
    {
      id: 'M18-S03',
      moduleId: 'M18',
      name: 'Palliative Care',
      nameHe: 'טיפול פליאטיבי',
      displayOrder: 3,
      isRequired: true,
      variants: [
        {
          id: 'M18-S03-V1',
          sectionId: 'M18-S03',
          name: 'Early Palliative Care',
          nameHe: 'טיפול פליאטיבי מוקדם',
          textTemplate: `עם אבחון מחלה סופנית: להתחיל מיידית בטיפול פליאטיבי, במקביל לטיפולים רפואיים אחרים.`,
          fields: []
        }
      ]
    }
  ]
};

