import { Module } from '../../types/advanceDirectives.types';

export const M23_OrganDonation: Module = {
  id: 'M23',
  name: 'Organ Donation',
  nameHe: 'תרומת איברים',
  category: 'medical',
  isMandatory: true,
  displayOrder: 23,
  description: 'הנחיות לגבי תרומת איברים',
  sections: [
    {
      id: 'M23-S01',
      moduleId: 'M23',
      name: 'Donation Decision',
      nameHe: 'החלטה על תרומה',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M23-S01-V1',
          sectionId: 'M23-S01',
          name: 'Full Donation',
          nameHe: 'תרומה מלאה',
          textTemplate: `תרומת איברים:\n\n**אני מסכים לתרומת כל האיברים והרקמות שניתן לתרום** לאחר מותי, לצורך השתלה במטופלים אחרים.\n\n**כולל:**\n- לב\n- ריאות\n- כבד\n- כליות\n- לבלב\n- מעיים\n- קרניות\n- עור\n- עצמות\n- מסתמי לב\n- כל איבר או רקמה נוספים\n\n**תנאים:**\n- קביעת מוות מוחי על ידי ועדה רפואית\n- בהתאם לחוק ולנהלים\n\n**כרטיס תורם:**\n{{donorCardStatus}}`,
          fields: [
            {
              id: 'donorCardStatus',
              type: 'select',
              label: 'Donor Card Status',
              labelHe: 'סטטוס כרטיס תורם',
              required: false,
              options: [
                { value: 'have_card', label: 'I have a donor card', labelHe: 'יש לי כרטיס' },
                { value: 'need_to_get', label: 'Need to get donor card', labelHe: 'צריך להוציא' },
                { value: 'in_registry', label: 'Registered in national registry', labelHe: 'רשום במאגר הלאומי' },
                { value: 'not_sure', label: 'Not sure', labelHe: 'לא בטוח' }
              ]
            }
          ]
        },
        {
          id: 'M23-S01-V2',
          sectionId: 'M23-S01',
          name: 'Selective Donation',
          nameHe: 'תרומה סלקטיבית',
          textTemplate: `תרומת איברים:\n\n**אני מסכים לתרומת האיברים הבאים בלבד:**\n{{#each selectedOrgans}}\n- {{this}}\n{{/each}}\n\n**איברים שאינני מעוניין לתרום:**\n{{#each excludedOrgans}}\n- {{this}}\n{{/each}}`,
          fields: [
            {
              id: 'selectedOrgans',
              type: 'multiselect',
              label: 'Organs to Donate',
              labelHe: 'איברים לתרומה',
              required: true,
              options: [
                { value: 'heart', label: 'Heart', labelHe: 'לב' },
                { value: 'lungs', label: 'Lungs', labelHe: 'ריאות' },
                { value: 'liver', label: 'Liver', labelHe: 'כבד' },
                { value: 'kidneys', label: 'Kidneys', labelHe: 'כליות' },
                { value: 'pancreas', label: 'Pancreas', labelHe: 'לבלב' },
                { value: 'intestines', label: 'Intestines', labelHe: 'מעיים' },
                { value: 'corneas', label: 'Corneas', labelHe: 'קרניות' },
                { value: 'skin', label: 'Skin', labelHe: 'עור' },
                { value: 'bones', label: 'Bones', labelHe: 'עצמות' },
                { value: 'heart_valves', label: 'Heart Valves', labelHe: 'מסתמי לב' }
              ]
            },
            {
              id: 'excludedOrgans',
              type: 'multiselect',
              label: 'Organs NOT to Donate',
              labelHe: 'איברים שלא לתרום',
              required: false,
              options: [
                { value: 'heart', label: 'Heart', labelHe: 'לב' },
                { value: 'lungs', label: 'Lungs', labelHe: 'ריאות' },
                { value: 'liver', label: 'Liver', labelHe: 'כבד' },
                { value: 'kidneys', label: 'Kidneys', labelHe: 'כליות' },
                { value: 'pancreas', label: 'Pancreas', labelHe: 'לבלב' },
                { value: 'intestines', label: 'Intestines', labelHe: 'מעיים' },
                { value: 'corneas', label: 'Corneas', labelHe: 'קרניות' },
                { value: 'skin', label: 'Skin', labelHe: 'עור' },
                { value: 'bones', label: 'Bones', labelHe: 'עצמות' },
                { value: 'heart_valves', label: 'Heart Valves', labelHe: 'מסתמי לב' }
              ]
            }
          ]
        },
        {
          id: 'M23-S01-V3',
          sectionId: 'M23-S01',
          name: 'Opposition to Donation',
          nameHe: 'התנגדות לתרומה',
          textTemplate: `תרומת איברים:\n\n**אני מתנגד לתרומת איברים.**\n\nלא לתרום שום איבר או רקמה לאחר מותי.{{#if reason}}\n\n**סיבה:** {{reason}}{{/if}}\n\n**הנחיה:**\nמשפחתי ומיופי כוחי מתבקשים לכבד את רצוני ולא לאשר תרומה בשום מקרה.`,
          fields: [
            {
              id: 'reason',
              type: 'textarea',
              label: 'Reason for Opposition',
              labelHe: 'סיבת ההתנגדות',
              required: false,
              placeholder: 'סיבות דתיות, אישיות וכו\''
            }
          ]
        },
        {
          id: 'M23-S01-V4',
          sectionId: 'M23-S01',
          name: 'Family Decision',
          nameHe: 'החלטת משפחה',
          textTemplate: `תרומת איברים:\n\n**אני משאיר את ההחלטה בידי משפחתי** לאחר מותי.\n\nהם יחליטו בהתאם למצב, לנסיבות ולרצונותיהם.{{#if guidance}}\n\n**הנחיה כללית:**\n{{guidance}}{{/if}}`,
          fields: [
            {
              id: 'guidance',
              type: 'textarea',
              label: 'General Guidance',
              labelHe: 'הנחיה כללית',
              required: false,
              placeholder: 'למשל: אני בעד מבחינה עקרונית, אבל המשפחה תחליט'
            }
          ]
        }
      ]
    },
    {
      id: 'M23-S02',
      moduleId: 'M23',
      name: 'Body Donation for Research',
      nameHe: 'תרומת גוף למחקר',
      displayOrder: 2,
      isRequired: false,
      variants: [
        {
          id: 'M23-S02-V1',
          sectionId: 'M23-S02',
          name: 'Agree to Body Donation',
          nameHe: 'הסכמה לתרומת גוף',
          textTemplate: `תרומת גוף למחקר:\n\n**אני מסכים לתרומת גופי למחקר רפואי** לאחר מותי.\n\n**יעד:**\n{{destination}}\n\n**תנאים:**\n- המוסד יטפל בגוף בכבוד\n- קבורה/שריפה יבוצעו לאחר תום המחקר\n- תיאום עם המשפחה`,
          fields: [
            {
              id: 'destination',
              type: 'select',
              label: 'Research Destination',
              labelHe: 'יעד המחקר',
              required: true,
              options: [
                { value: 'medical_school', label: 'Medical School (anatomy studies)', labelHe: 'בית ספר לרפואה (אנטומיה)' },
                { value: 'research_institute', label: 'Medical Research Institute', labelHe: 'מכון מחקר רפואי' },
                { value: 'any_approved', label: 'Any approved institution', labelHe: 'כל מוסד מאושר' }
              ]
            }
          ]
        },
        {
          id: 'M23-S02-V2',
          sectionId: 'M23-S02',
          name: 'No Body Donation',
          nameHe: 'ללא תרומת גוף',
          textTemplate: `אני מתנגד לתרומת גופי למחקר.\n\nקבורה או שריפה רגילה בלבד.`,
          fields: []
        }
      ]
    }
  ]
};

