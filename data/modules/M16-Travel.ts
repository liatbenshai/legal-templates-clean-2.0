import { Module } from '../../types/advanceDirectives.types';

export const M16_Travel: Module = {
  id: 'M16',
  name: 'Travel and Vacations',
  nameHe: 'נסיעות וחופשות',
  category: 'personal',
  isMandatory: false,
  displayOrder: 16,
  description: 'חופשות ונסיעות',
  sections: [
    {
      id: 'M16-S01',
      moduleId: 'M16',
      name: 'Vacation Type',
      nameHe: 'סוג חופשה',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M16-S01-V1',
          sectionId: 'M16-S01',
          name: 'Annual Vacation in Israel',
          nameHe: 'חופשה שנתית בארץ',
          textTemplate: `חופשה בארץ: {{frequency}} ל-{{duration}} לילות לפחות.\n\nארגון במקום מתאים ונגיש בהתאם למצב בריאותי והעדפות אישיות.`,
          fields: [
            {
              id: 'frequency',
              type: 'select',
              label: 'Frequency',
              labelHe: 'תדירות',
              required: true,
              options: [
                { value: 'once_year', label: 'Once a year', labelHe: 'פעם בשנה' },
                { value: 'twice_year', label: 'Twice a year', labelHe: 'פעמיים בשנה' },
                { value: 'seasonal', label: 'Each season', labelHe: 'כל עונה' }
              ]
            },
            {
              id: 'duration',
              type: 'number',
              label: 'Duration (nights)',
              labelHe: 'משך (לילות)',
              required: true,
              placeholder: '3',
              validation: { min: 1, max: 30 }
            }
          ]
        },
        {
          id: 'M16-S01-V4',
          sectionId: 'M16-S01',
          name: 'No Requirement',
          nameHe: 'ללא דרישה',
          textTemplate: `נסיעות וחופשות לפי רצון והזדמנות, ללא חובה.\n\nמיופה הכוח יציע והממנה יחליט.`,
          fields: []
        }
      ]
    }
  ]
};
