import { Module } from '../../types/advanceDirectives.types';

export const M21_MedicalProviders: Module = {
  id: 'M21',
  name: 'Medical Providers',
  nameHe: 'נותני שירותים רפואיים',
  category: 'medical',
  isMandatory: true,
  displayOrder: 21,
  description: 'רופאים, קופת חולים ובתי חולים',
  sections: [
    {
      id: 'M21-S01',
      moduleId: 'M21',
      name: 'Health Fund',
      nameHe: 'קופת חולים',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M21-S01-V1',
          sectionId: 'M21-S01',
          name: 'Current Health Fund',
          nameHe: 'קופת חולים נוכחית',
          textTemplate: `קופת חולים: {{healthFund}}\nמספר חבר: {{memberNumber}}`,
          fields: [
            {
              id: 'healthFund',
              type: 'select',
              label: 'Health Fund',
              labelHe: 'קופת חולים',
              required: true,
              options: [
                { value: 'clalit', label: 'Clalit', labelHe: 'כללית' },
                { value: 'maccabi', label: 'Maccabi', labelHe: 'מכבי' },
                { value: 'meuhedet', label: 'Meuhedet', labelHe: 'מאוחדת' },
                { value: 'leumit', label: 'Leumit', labelHe: 'לאומית' }
              ]
            },
            {
              id: 'memberNumber',
              type: 'text',
              label: 'Member Number',
              labelHe: 'מספר חבר',
              required: false,
              placeholder: '123456789'
            }
          ]
        }
      ]
    },
    {
      id: 'M21-S02',
      moduleId: 'M21',
      name: 'Family Doctor',
      nameHe: 'רופא משפחה',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M21-S02-V1',
          sectionId: 'M21-S02',
          name: 'Current Family Doctor',
          nameHe: 'רופא משפחה נוכחי',
          textTemplate: `רופא/ה משפחה: {{doctorName}}{{#if phone}}\nטלפון: {{phone}}{{/if}}`,
          fields: [
            {
              id: 'doctorName',
              type: 'text',
              label: 'Doctor Name',
              labelHe: 'שם הרופא/ה',
              required: false,
              placeholder: 'ד"ר שרה כהן'
            },
            {
              id: 'phone',
              type: 'text',
              label: 'Phone',
              labelHe: 'טלפון',
              required: false,
              placeholder: '03-1234567'
            }
          ]
        }
      ]
    }
  ]
};

