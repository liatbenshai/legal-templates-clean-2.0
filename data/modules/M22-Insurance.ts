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
          textTemplate: `ביטוח סיעודי:\n\n**חברת ביטוח:** {{company}}\n**מספר פוליסה:** {{policyNumber}}{{#if coverage}}\n**כיסוי:** {{coverage}} ₪ לחודש{{/if}}{{#if waitingPeriod}}\n**תקופת המתנה:** {{waitingPeriod}}{{/if}}\n\n**במקרה של צורך סיעודי:**\n- פנייה מיידית לחברת הביטוח\n- הגשת תביעה\n- מעקב עד לאישור\n- שימוש בכספים לטיפול סיעודי בלבד\n\n**מדיניות תחזוקה:**\n- המשך תשלום דמי ביטוח\n- עדכון פרטים במידת הצורך\n- שמירה על תוקף הפוליסה`,
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
            },
            {
              id: 'waitingPeriod',
              type: 'text',
              label: 'Waiting Period',
              labelHe: 'תקופת המתנה',
              required: false,
              placeholder: 'עברה / 90 ימים'
            }
          ]
        },
        {
          id: 'M22-S01-V2',
          sectionId: 'M22-S01',
          name: 'No Nursing Insurance',
          nameHe: 'אין ביטוח סיעודי',
          textTemplate: `אין ביטוח סיעודי קיים.\n\n**במקרה של צורך סיעודי:**\n{{noInsurancePolicy}}`,
          fields: [
            {
              id: 'noInsurancePolicy',
              type: 'select',
              label: 'Policy without Insurance',
              labelHe: 'מדיניות ללא ביטוח',
              required: true,
              options: [
                { value: 'self_fund', label: 'Self-fund from savings', labelHe: 'מימון עצמי מהחיסכון' },
                { value: 'national_insurance', label: 'Rely on National Insurance allowance', labelHe: 'הסתמכות על קצבת ביטוח לאומי' },
                { value: 'family_support', label: 'Family support', labelHe: 'תמיכה משפחתית' },
                { value: 'consider_purchasing', label: 'Consider purchasing if still possible', labelHe: 'לשקול רכישה אם עדיין אפשרי' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M22-S02',
      moduleId: 'M22',
      name: 'Life Insurance',
      nameHe: 'ביטוח חיים',
      displayOrder: 2,
      isRequired: false,
      variants: [
        {
          id: 'M22-S02-V1',
          sectionId: 'M22-S02',
          name: 'Existing Life Insurance',
          nameHe: 'ביטוח חיים קיים',
          textTemplate: `ביטוח חיים:\n\n{{#each policies}}\n**פוליסה {{index}}:**\n- חברה: {{company}}\n- מספר: {{policyNumber}}\n- סכום: {{amount}} ₪{{#if beneficiaries}}\n- מוטבים: {{beneficiaries}}{{/if}}\n\n{{/each}}\n**מדיניות:**\n- המשך תשלום פרמיות\n- שמירה על תוקף הפוליסות\n- עדכון מוטבים במידת הצורך`,
          fields: [
            {
              id: 'policies',
              type: 'array',
              label: 'Life Insurance Policies',
              labelHe: 'פוליסות ביטוח חיים',
              required: true,
              arrayItemSchema: [
                {
                  id: 'company',
                  type: 'text',
                  label: 'Company',
                  labelHe: 'חברה',
                  required: true,
                  placeholder: 'מנורה מבטחים'
                },
                {
                  id: 'policyNumber',
                  type: 'text',
                  label: 'Policy Number',
                  labelHe: 'מספר פוליסה',
                  required: true,
                  placeholder: '987654321'
                },
                {
                  id: 'amount',
                  type: 'number',
                  label: 'Coverage Amount',
                  labelHe: 'סכום כיסוי',
                  required: false,
                  placeholder: '500000'
                },
                {
                  id: 'beneficiaries',
                  type: 'text',
                  label: 'Beneficiaries',
                  labelHe: 'מוטבים',
                  required: false,
                  placeholder: 'בן/בת הזוג, ילדים'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M22-S03',
      moduleId: 'M22',
      name: 'Other Insurance',
      nameHe: 'ביטוחים נוספים',
      displayOrder: 3,
      isRequired: false,
      variants: [
        {
          id: 'M22-S03-V1',
          sectionId: 'M22-S03',
          name: 'Additional Insurance List',
          nameHe: 'רשימת ביטוחים נוספים',
          textTemplate: `ביטוחים נוספים:\n\n{{#each insurances}}\n**{{type}}:**\n- חברה: {{company}}\n- מספר: {{policyNumber}}{{#if details}}\n- פרטים: {{details}}{{/if}}\n\n{{/each}}`,
          fields: [
            {
              id: 'insurances',
              type: 'array',
              label: 'Additional Insurances',
              labelHe: 'ביטוחים נוספים',
              required: true,
              arrayItemSchema: [
                {
                  id: 'type',
                  type: 'select',
                  label: 'Insurance Type',
                  labelHe: 'סוג ביטוח',
                  required: true,
                  options: [
                    { value: 'critical_illness', label: 'Critical Illness', labelHe: 'מחלות קשות' },
                    { value: 'disability', label: 'Disability', labelHe: 'אובדן כושר עבודה' },
                    { value: 'dental', label: 'Dental', labelHe: 'שיניים' },
                    { value: 'vision', label: 'Vision', labelHe: 'ראייה' },
                    { value: 'travel', label: 'Travel Insurance', labelHe: 'ביטוח נסיעות' },
                    { value: 'home', label: 'Home Insurance', labelHe: 'ביטוח דירה' },
                    { value: 'other', label: 'Other', labelHe: 'אחר' }
                  ]
                },
                {
                  id: 'company',
                  type: 'text',
                  label: 'Company',
                  labelHe: 'חברה',
                  required: true
                },
                {
                  id: 'policyNumber',
                  type: 'text',
                  label: 'Policy Number',
                  labelHe: 'מספר פוליסה',
                  required: true
                },
                {
                  id: 'details',
                  type: 'textarea',
                  label: 'Additional Details',
                  labelHe: 'פרטים נוספים',
                  required: false
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

