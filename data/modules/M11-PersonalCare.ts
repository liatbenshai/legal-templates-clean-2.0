import { Module } from '../../types/advanceDirectives.types';

export const M11_PersonalCare: Module = {
  id: 'M11',
  name: 'Personal Care',
  nameHe: 'טיפוח אישי',
  category: 'personal',
  isMandatory: true,
  displayOrder: 11,
  description: 'לבוש וטיפוח אישי',
  sections: [
    {
      id: 'M11-S01',
      moduleId: 'M11',
      name: 'Clothing and Appearance',
      nameHe: 'לבוש והופעה',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M11-S01-V1',
          sectionId: 'M11-S01',
          name: 'Standard Clothing Care',
          nameHe: 'טיפול לבוש סטנדרטי',
          textTemplate: `אני מבקש שמיופה הכוח ידאג לטיפוח שלי באופן שוטף, תוך הקפדה על לבוש הולם, נקי ומסודר תמיד.\n\n**חשיבות:**\nהופעה חיצונית מטופחת חשובה לי מאוד לשמירה על:\n- כבודי\n- תחושת הערך העצמי שלי\n- מצב רוח חיובי\n- יחס כבוד מהסביבה\n\n**דרישות לבוש:**\n- **בגדים נקיים תמיד**\n- **בגדים מגוהצים**\n- התאמה לעונות השנה (קיץ/חורף)\n- התאמה לאירועים:\n  * יום יום - בגדים נוחים ומסודרים\n  * יציאות מהבית - לבוש הולם ומכובד\n  * אירועים מיוחדים - לבוש חגיגי\n  * כשמגיעים אורחים - לבוש מכובד\n- בחירה לפי הטעם האישי והסגנון הרגיל שלי\n- התחשבות בנוחות ובגיל`,
          fields: []
        }
      ]
    },
    {
      id: 'M11-S02',
      moduleId: 'M11',
      name: 'Additional Care',
      nameHe: 'טיפולים נוספים',
      displayOrder: 2,
      isRequired: false,
      variants: [
        {
          id: 'M11-S02-V1',
          sectionId: 'M11-S02',
          name: 'Standard Care Treatments',
          nameHe: 'טיפולים סטנדרטיים',
          textTemplate: `טיפולים נוספים:{{#if dailyShower}}\n\n**רחצה:**\n- רחצה יומית {{showerTime}}{{/if}}{{#if shaving}}\n\n**גילוח:**\n- {{shavingFrequency}}{{/if}}{{#if haircut}}\n\n**תספורת:**\n- אחת ל-{{haircutWeeks}} שבועות{{#if haircutPlace}}\n- מקום: {{haircutPlace}}{{/if}}{{/if}}{{#if nailCare}}\n\n**פדיקור ומניקור:**\n- {{nailCareFrequency}}{{#if nailCareProfessional}}\n- על ידי מטפל/ת מקצועי/ת{{/if}}{{/if}}{{#if skinCare}}\n\n**טיפול בעור:**\n- קרם לחות יומי\n- הגנה מהשמש (בקיץ)\n- {{skinCareDetails}}{{/if}}`,
          fields: [
            {
              id: 'dailyShower',
              type: 'boolean',
              label: 'Daily Shower',
              labelHe: 'רחצה יומית',
              required: false
            },
            {
              id: 'showerTime',
              type: 'select',
              label: 'Shower Time',
              labelHe: 'זמן רחצה',
              required: false,
              options: [
                { value: 'morning', label: 'Morning', labelHe: 'בבוקר' },
                { value: 'evening', label: 'Evening', labelHe: 'בערב' },
                { value: 'flexible', label: 'Flexible', labelHe: 'גמיש' }
              ]
            },
            {
              id: 'shaving',
              type: 'boolean',
              label: 'Shaving Required',
              labelHe: 'גילוח נדרש',
              required: false
            },
            {
              id: 'shavingFrequency',
              type: 'select',
              label: 'Shaving Frequency',
              labelHe: 'תדירות גילוח',
              required: false,
              options: [
                { value: 'daily', label: 'Daily', labelHe: 'יומי' },
                { value: 'every_other_day', label: 'Every Other Day', labelHe: 'כל יומיים' },
                { value: 'twice_weekly', label: 'Twice a Week', labelHe: 'פעמיים בשבוע' },
                { value: 'weekly', label: 'Weekly', labelHe: 'שבועי' }
              ]
            },
            {
              id: 'haircut',
              type: 'boolean',
              label: 'Regular Haircut',
              labelHe: 'תספורת קבועה',
              required: false
            },
            {
              id: 'haircutWeeks',
              type: 'number',
              label: 'Haircut Frequency (weeks)',
              labelHe: 'תדירות תספורת (שבועות)',
              required: false,
              placeholder: '4',
              validation: { min: 1, max: 12 }
            },
            {
              id: 'haircutPlace',
              type: 'text',
              label: 'Preferred Barber/Salon',
              labelHe: 'ספר/מספרה מועדפת',
              required: false,
              placeholder: 'מספרת דוד, רחוב הרצל 5'
            },
            {
              id: 'nailCare',
              type: 'boolean',
              label: 'Nail Care',
              labelHe: 'טיפול בציפורניים',
              required: false
            },
            {
              id: 'nailCareFrequency',
              type: 'select',
              label: 'Nail Care Frequency',
              labelHe: 'תדירות טיפול בציפורניים',
              required: false,
              options: [
                { value: 'monthly', label: 'Once a Month', labelHe: 'אחת לחודש' },
                { value: 'bimonthly', label: 'Once Every Two Months', labelHe: 'אחת לחודשיים' },
                { value: 'as_needed', label: 'As Needed', labelHe: 'לפי צורך' }
              ]
            },
            {
              id: 'nailCareProfessional',
              type: 'boolean',
              label: 'Professional Nail Care',
              labelHe: 'טיפול מקצועי',
              required: false
            },
            {
              id: 'skinCare',
              type: 'boolean',
              label: 'Skin Care',
              labelHe: 'טיפול בעור',
              required: false
            },
            {
              id: 'skinCareDetails',
              type: 'textarea',
              label: 'Skin Care Details',
              labelHe: 'פרטי טיפול בעור',
              required: false,
              placeholder: 'למשל: קרם מיוחד לעור יבש'
            }
          ]
        }
      ]
    }
  ]
};

