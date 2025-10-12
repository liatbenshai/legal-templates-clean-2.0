import { Module } from '../../types/advanceDirectives.types';

export const M20_ChronicDiseases: Module = {
  id: 'M20',
  name: 'Chronic Diseases',
  nameHe: 'מחלות כרוניות',
  category: 'medical',
  isMandatory: false,
  displayOrder: 20,
  description: 'ניהול מחלות כרוניות קיימות',
  sections: [
    {
      id: 'M20-S01',
      moduleId: 'M20',
      name: 'Disease List',
      nameHe: 'רשימת מחלות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M20-S01-V1',
          sectionId: 'M20-S01',
          name: 'Chronic Disease Registration',
          nameHe: 'רישום מחלות כרוניות',
          textTemplate: `מחלות כרוניות קיימות:\n\n{{#each diseases}}\n**{{index}}. {{name}}**\n   - רופא מטפל: {{doctor}}{{#if medications}}\n   - תרופות: {{medications}}{{/if}}\n{{/each}}`,
          fields: [
            {
              id: 'diseases',
              type: 'array',
              label: 'Chronic Diseases',
              labelHe: 'מחלות כרוניות',
              required: true,
              arrayItemSchema: [
                {
                  id: 'name',
                  type: 'text',
                  label: 'Disease Name',
                  labelHe: 'שם המחלה',
                  required: true,
                  placeholder: 'סכרת סוג 2'
                },
                {
                  id: 'doctor',
                  type: 'text',
                  label: 'Treating Doctor',
                  labelHe: 'רופא מטפל',
                  required: false,
                  placeholder: 'ד"ר כהן'
                },
                {
                  id: 'medications',
                  type: 'textarea',
                  label: 'Medications',
                  labelHe: 'תרופות',
                  required: false,
                  placeholder: 'מטפורמין 1000 פעמיים ביום'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M20-S02',
      moduleId: 'M20',
      name: 'Medication Management',
      nameHe: 'ניהול תרופות',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M20-S02-V1',
          sectionId: 'M20-S02',
          name: 'Strict Adherence',
          nameHe: 'קפדנות מלאה',
          textTemplate: `ניהול תרופות למחלות כרוניות:\n\n**חובה לקחת את כל התרופות במדויק:**\n- לפי לוח הזמנים\n- במינונים מדויקים\n- ללא דילוגים`,
          fields: []
        }
      ]
    }
  ]
};

