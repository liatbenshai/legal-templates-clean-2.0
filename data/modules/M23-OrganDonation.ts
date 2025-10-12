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
          textTemplate: `תרומת איברים:\n\n**אני מסכים לתרומת כל האיברים והרקמות שניתן לתרום** לאחר מותי, לצורך השתלה במטופלים אחרים.\n\n**כולל:**\n- לב, ריאות, כבד, כליות, לבלב, מעיים, קרניות, עור, עצמות, מסתמי לב`,
          fields: []
        },
        {
          id: 'M23-S01-V3',
          sectionId: 'M23-S01',
          name: 'Opposition to Donation',
          nameHe: 'התנגדות לתרומה',
          textTemplate: `תרומת איברים:\n\n**אני מתנגד לתרומת איברים.**\n\nלא לתרום שום איבר או רקמה לאחר מותי.\n\n**הנחיה:**\nמשפחתי ומיופי כוחי מתבקשים לכבד את רצוני ולא לאשר תרומה בשום מקרה.`,
          fields: []
        },
        {
          id: 'M23-S01-V4',
          sectionId: 'M23-S01',
          name: 'Family Decision',
          nameHe: 'החלטת משפחה',
          textTemplate: `תרומת איברים:\n\n**אני משאיר את ההחלטה בידי משפחתי** לאחר מותי.\n\nהם יחליטו בהתאם למצב, לנסיבות ולרצונותיהם.`,
          fields: []
        }
      ]
    }
  ]
};

