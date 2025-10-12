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
          textTemplate: `קופת חולים: {{healthFund}}\nמספר חבר: {{memberNumber}}{{#if clinic}}\nמרפאה: {{clinic}}{{/if}}{{#if branch}}\nסניף: {{branch}}{{/if}}\n\n**מדיניות שינוי קופה:**\n{{changePolicy}}`,
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
            },
            {
              id: 'clinic',
              type: 'text',
              label: 'Clinic Name',
              labelHe: 'שם מרפאה',
              required: false,
              placeholder: 'מרפאת דיזנגוף'
            },
            {
              id: 'branch',
              type: 'text',
              label: 'Branch',
              labelHe: 'סניף',
              required: false,
              placeholder: 'תל אביב מרכז'
            },
            {
              id: 'changePolicy',
              type: 'select',
              label: 'Health Fund Change Policy',
              labelHe: 'מדיניות שינוי קופה',
              required: true,
              options: [
                { value: 'no_change', label: 'Do not change', labelHe: 'לא לשנות' },
                { value: 'if_better', label: 'Change if significantly better', labelHe: 'לשנות אם משמעותית יותר טוב' },
                { value: 'flexible', label: 'Flexible by attorney decision', labelHe: 'גמיש לפי החלטת מיופה כוח' }
              ]
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
          textTemplate: `רופא/ה משפחה: {{doctorName}}{{#if clinic}}\nמרפאה: {{clinic}}{{/if}}{{#if phone}}\nטלפון: {{phone}}{{/if}}\n\n**מדיניות שינוי רופא:**\n{{changePolicy}}{{#if changePolicyDetails}}\n\n{{changePolicyDetails}}{{/if}}`,
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
              id: 'clinic',
              type: 'text',
              label: 'Clinic',
              labelHe: 'מרפאה',
              required: false,
              placeholder: 'מרפאת רמת אביב'
            },
            {
              id: 'phone',
              type: 'text',
              label: 'Phone',
              labelHe: 'טלפון',
              required: false,
              placeholder: '03-1234567'
            },
            {
              id: 'changePolicy',
              type: 'select',
              label: 'Doctor Change Policy',
              labelHe: 'מדיניות שינוי רופא',
              required: true,
              options: [
                { value: 'keep_current', label: 'Keep current doctor', labelHe: 'לשמור על הרופא הנוכחי' },
                { value: 'if_needed', label: 'Change if needed (retirement, relocation)', labelHe: 'לשנות במידת הצורך (פרישה, מעבר)' },
                { value: 'if_better', label: 'Change if significantly better available', labelHe: 'לשנות אם יש משמעותית יותר טוב' },
                { value: 'flexible', label: 'Flexible decision', labelHe: 'החלטה גמישה' }
              ]
            },
            {
              id: 'changePolicyDetails',
              type: 'textarea',
              label: 'Change Policy Details',
              labelHe: 'פירוט מדיניות שינוי',
              required: false,
              placeholder: 'למשל: רק אם הרופא הנוכחי פורש או אם יש רופא מומחה זמין'
            }
          ]
        }
      ]
    },
    {
      id: 'M21-S03',
      moduleId: 'M21',
      name: 'Specialists',
      nameHe: 'רופאים מומחים',
      displayOrder: 3,
      isRequired: false,
      variants: [
        {
          id: 'M21-S03-V1',
          sectionId: 'M21-S03',
          name: 'Specialist List',
          nameHe: 'רשימת מומחים',
          textTemplate: `רופאים מומחים:\n\n{{#each specialists}}\n**{{specialty}}:**\n- שם: {{name}}{{#if clinic}}\n- מרפאה: {{clinic}}{{/if}}{{#if phone}}\n- טלפון: {{phone}}{{/if}}{{#if visitFrequency}}\n- תדירות ביקור: {{visitFrequency}}{{/if}}\n\n{{/each}}\n\n**החלפת מומחים:**\nמיופה הכוח רשאי להחליף רופא מומחה אם:\n- המומחה הנוכחי לא זמין\n- יש המלצה חזקה לרופא אחר\n- תורים ארוכים מדי\n- חוסר שביעות רצון מהטיפול`,
          fields: [
            {
              id: 'specialists',
              type: 'array',
              label: 'Specialists',
              labelHe: 'מומחים',
              required: true,
              arrayItemSchema: [
                {
                  id: 'specialty',
                  type: 'select',
                  label: 'Specialty',
                  labelHe: 'התמחות',
                  required: true,
                  options: [
                    { value: 'cardiology', label: 'Cardiology', labelHe: 'קרדיולוגיה' },
                    { value: 'neurology', label: 'Neurology', labelHe: 'נוירולוגיה' },
                    { value: 'endocrinology', label: 'Endocrinology', labelHe: 'אנדוקרינולוגיה' },
                    { value: 'nephrology', label: 'Nephrology', labelHe: 'נפרולוגיה' },
                    { value: 'pulmonology', label: 'Pulmonology', labelHe: 'ריאות' },
                    { value: 'gastroenterology', label: 'Gastroenterology', labelHe: 'גסטרואנטרולוגיה' },
                    { value: 'orthopedics', label: 'Orthopedics', labelHe: 'אורתופדיה' },
                    { value: 'oncology', label: 'Oncology', labelHe: 'אונקולוגיה' },
                    { value: 'psychiatry', label: 'Psychiatry', labelHe: 'פסיכיאטריה' },
                    { value: 'geriatrics', label: 'Geriatrics', labelHe: 'גריאטריה' },
                    { value: 'other', label: 'Other', labelHe: 'אחר' }
                  ]
                },
                {
                  id: 'name',
                  type: 'text',
                  label: 'Doctor Name',
                  labelHe: 'שם הרופא/ה',
                  required: true,
                  placeholder: 'ד"ר לוי'
                },
                {
                  id: 'clinic',
                  type: 'text',
                  label: 'Clinic/Hospital',
                  labelHe: 'מרפאה/בית חולים',
                  required: false,
                  placeholder: 'איכילוב'
                },
                {
                  id: 'phone',
                  type: 'text',
                  label: 'Phone',
                  labelHe: 'טלפון',
                  required: false,
                  placeholder: '03-1234567'
                },
                {
                  id: 'visitFrequency',
                  type: 'text',
                  label: 'Visit Frequency',
                  labelHe: 'תדירות ביקור',
                  required: false,
                  placeholder: 'כל 6 חודשים'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M21-S04',
      moduleId: 'M21',
      name: 'Hospital Preference',
      nameHe: 'העדפת בית חולים',
      displayOrder: 4,
      isRequired: false,
      variants: [
        {
          id: 'M21-S04-V1',
          sectionId: 'M21-S04',
          name: 'Preferred Hospital',
          nameHe: 'בית חולים מועדף',
          textTemplate: `בית חולים מועדף: {{hospital}}{{#if reason}}\nסיבה: {{reason}}{{/if}}\n\n**במקרה חירום:**\n{{emergencyPolicy}}\n\n**ניתוחים מתוכננים:**\n{{plannedSurgeryPolicy}}`,
          fields: [
            {
              id: 'hospital',
              type: 'select',
              label: 'Preferred Hospital',
              labelHe: 'בית חולים מועדף',
              required: false,
              options: [
                { value: 'ichilov', label: 'Ichilov (Tel Aviv Sourasky)', labelHe: 'איכילוב' },
                { value: 'sheba', label: 'Sheba (Tel Hashomer)', labelHe: 'שיבא - תל השומר' },
                { value: 'hadassah_ein_kerem', label: 'Hadassah Ein Kerem', labelHe: 'הדסה עין כרם' },
                { value: 'hadassah_har_hatzofim', label: 'Hadassah Mount Scopus', labelHe: 'הדסה הר הצופים' },
                { value: 'rambam', label: 'Rambam', labelHe: 'רמב"ם' },
                { value: 'beilinson', label: 'Beilinson (Rabin)', labelHe: 'בילינסון' },
                { value: 'assuta', label: 'Assuta', labelHe: 'אסותא' },
                { value: 'other', label: 'Other', labelHe: 'אחר' },
                { value: 'no_preference', label: 'No preference', labelHe: 'אין העדפה' }
              ]
            },
            {
              id: 'reason',
              type: 'textarea',
              label: 'Reason for Preference',
              labelHe: 'סיבת ההעדפה',
              required: false,
              placeholder: 'למשל: קרוב לבית, רופאים מצוינים, ניסיון קודם טוב'
            },
            {
              id: 'emergencyPolicy',
              type: 'select',
              label: 'Emergency Policy',
              labelHe: 'מדיניות חירום',
              required: false,
              options: [
                { value: 'closest', label: 'Closest hospital (most important)', labelHe: 'הכי קרוב (העיקר)' },
                { value: 'preferred_if_possible', label: 'Preferred if condition allows', labelHe: 'מועדף אם המצב מאפשר' },
                { value: 'always_preferred', label: 'Always preferred hospital', labelHe: 'תמיד המועדף' }
              ]
            },
            {
              id: 'plannedSurgeryPolicy',
              type: 'select',
              label: 'Planned Surgery Policy',
              labelHe: 'מדיניות ניתוחים מתוכננים',
              required: false,
              options: [
                { value: 'only_preferred', label: 'Only in preferred hospital', labelHe: 'רק בבית חולים מועדף' },
                { value: 'best_doctor', label: 'Where the best doctor is', labelHe: 'איפה שהרופא הכי טוב' },
                { value: 'flexible', label: 'Flexible', labelHe: 'גמיש' }
              ]
            }
          ]
        },
        {
          id: 'M21-S04-V2',
          sectionId: 'M21-S04',
          name: 'No Hospital Preference',
          nameHe: 'אין העדפת בית חולים',
          textTemplate: `אין העדפה מיוחדת לבית חולים.\n\nההחלטה תהיה לפי:\n- זמינות\n- איכות הטיפול\n- המלצות רפואיות\n- קרבה (בחירום)`,
          fields: []
        }
      ]
    },
    {
      id: 'M21-S05',
      moduleId: 'M21',
      name: 'Supplementary Insurance',
      nameHe: 'ביטוחים משלימים',
      displayOrder: 5,
      isRequired: false,
      variants: [
        {
          id: 'M21-S05-V1',
          sectionId: 'M21-S05',
          name: 'Current Insurance',
          nameHe: 'ביטוח נוכחי',
          textTemplate: `ביטוח משלים:\n\n**קופת חולים:** {{healthFundInsurance}}{{#if privateInsurance}}\n**ביטוח פרטי:** {{privateInsurance}}{{/if}}\n\n**מדיניות:**\n- להמשיך בביטוחים הקיימים\n- תשלום דמי ביטוח במועד\n- עדכון ביטוחים לפי שינויים במצב בריאותי{{#if upgradePolicy}}\n- {{upgradePolicy}}{{/if}}`,
          fields: [
            {
              id: 'healthFundInsurance',
              type: 'text',
              label: 'Health Fund Supplementary Insurance',
              labelHe: 'ביטוח משלים קופה',
              required: false,
              placeholder: 'כללית מושלם זהב'
            },
            {
              id: 'privateInsurance',
              type: 'text',
              label: 'Private Insurance',
              labelHe: 'ביטוח פרטי',
              required: false,
              placeholder: 'מגדל - ביטוח בריאות'
            },
            {
              id: 'upgradePolicy',
              type: 'textarea',
              label: 'Upgrade Policy',
              labelHe: 'מדיניות שדרוג',
              required: false,
              placeholder: 'לשדרג ביטוח אם יש צורך רפואי משמעותי'
            }
          ]
        }
      ]
    }
  ]
};

