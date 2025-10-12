import { Module } from '../../types/advanceDirectives.types';

export const M22_Insurance: Module = {
  id: 'M22',
  name: 'Insurance Policies',
  nameHe: 'פוליסות ביטוח',
  category: 'medical',
  isMandatory: true,
  displayOrder: 22,
  description: 'ביטוחים רפואיים וסיעודיים',
  sections: [
    {
      id: 'M22-S01',
      moduleId: 'M22',
      name: 'Nursing Care Insurance',
      nameHe: 'ביטוח סיעודי',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M22-S01-V1',
          sectionId: 'M22-S01',
          name: 'Existing Nursing Insurance',
          nameHe: 'ביטוח סיעודי קיים',
          textTemplate: `ביטוח סיעודי:\n\n**חברת ביטוח:** {{company}}\n**מספר פוליסה:** {{policyNumber}}{{#if coverage}}\n**כיסוי:** {{coverage}} ₪ לחודש{{/if}}`,
          fields: [
            {
              id: 'company',
              type: 'text',
              label: 'Insurance Company',
              labelHe: 'חברת ביטוח',
              required: true,
              placeholder: 'כלל ביטוח'
            },
            {
              id: 'policyNumber',
              type: 'text',
              label: 'Policy Number',
              labelHe: 'מספר פוליסה',
              required: true,
              placeholder: '123456789'
            },
            {
              id: 'coverage',
              type: 'number',
              label: 'Monthly Coverage Amount',
              labelHe: 'סכום כיסוי חודשי',
              required: false,
              placeholder: '8000',
              validation: { min: 0 }
            }
          ]
        },
        {
          id: 'M22-S01-V2',
          sectionId: 'M22-S01',
          name: 'No Nursing Insurance',
          nameHe: 'אין ביטוח סיעודי',
          textTemplate: `אין ביטוח סיעודי קיים.\n\nבמקרה של צורך סיעודי: מימון עצמי או קצבת ביטוח לאומי.`,
          fields: []
        }
      ]
    }
  ]
};

