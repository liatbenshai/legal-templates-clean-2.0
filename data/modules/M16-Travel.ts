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
          textTemplate: `חופשה בארץ:\n\n**תדירות:** {{frequency}}\n**משך:** {{duration}} לילות לפחות\n\n**ארגון:**\n- ארגון במקום מתאים ({{accommodationType}})\n- נגיש ונעים\n- התאמה למצב בריאותי והעדפות אישיות{{#if preferredLocations}}\n- אזורים מועדפים: {{preferredLocations}}{{/if}}\n\n**פעילויות:**\n- טיולים קלים באזור\n- פעילויות תרבות{{#if activities}}\n- {{activities}}{{/if}}\n\n**תקציב:**{{#if budget}}\n- תקציב שנתי: עד {{budget}} ₪{{else}}\n- בהתאם לאפשרויות כלכליות{{/if}}`,
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
            },
            {
              id: 'accommodationType',
              type: 'select',
              label: 'Accommodation Type',
              labelHe: 'סוג לינה',
              required: true,
              options: [
                { value: 'hotel', label: 'Hotel', labelHe: 'מלון' },
                { value: 'zimmer', label: 'Zimmer', labelHe: 'צימר' },
                { value: 'health_resort', label: 'Health Resort', labelHe: 'בית הבראה' },
                { value: 'vacation_village', label: 'Vacation Village', labelHe: 'כפר נופש' }
              ]
            },
            {
              id: 'preferredLocations',
              type: 'text',
              label: 'Preferred Locations',
              labelHe: 'אזורים מועדפים',
              required: false,
              placeholder: 'טבריה, ים המלח, הצפון'
            },
            {
              id: 'activities',
              type: 'textarea',
              label: 'Preferred Activities',
              labelHe: 'פעילויות מועדפות',
              required: false,
              placeholder: 'ביקורים במוזיאונים, שווקים, אטרקציות'
            },
            {
              id: 'budget',
              type: 'number',
              label: 'Annual Budget',
              labelHe: 'תקציב שנתי',
              required: false,
              placeholder: '15000',
              validation: { min: 0 }
            }
          ]
        },
        {
          id: 'M16-S01-V2',
          sectionId: 'M16-S01',
          name: 'Travel Abroad',
          nameHe: 'נסיעות לחו"ל',
          textTemplate: `נסיעות לחו"ל:\n\n**תדירות:** {{frequency}}{{#if destinations}}\n**יעדים מועדפים:** {{destinations}}{{/if}}\n\n**ארגון:**\n- הזמנת כרטיסי טיסה\n- הזמנת מלונות ויתר פרטים\n- ליווי {{accompaniment}}\n- ביטוח נסיעות מקיף\n\n**התחשבות:**\n- התאמה למצב בריאותי\n- אפשרויות כלכליות\n- רצונות אישיים{{#if healthConsiderations}}\n\n**שיקולים רפואיים:**\n{{healthConsiderations}}{{/if}}`,
          fields: [
            {
              id: 'frequency',
              type: 'select',
              label: 'Frequency',
              labelHe: 'תדירות',
              required: true,
              options: [
                { value: 'quarterly', label: 'Once every 3 months', labelHe: 'אחת לשלושה חודשים' },
                { value: 'biannual', label: 'Twice a year', labelHe: 'פעמיים בשנה' },
                { value: 'annual', label: 'Once a year', labelHe: 'פעם בשנה' },
                { value: 'occasional', label: 'Occasionally', labelHe: 'מדי פעם' }
              ]
            },
            {
              id: 'destinations',
              type: 'textarea',
              label: 'Preferred Destinations',
              labelHe: 'יעדים מועדפים',
              required: false,
              placeholder: 'אירופה, ארה"ב, טורקיה, יוון'
            },
            {
              id: 'accompaniment',
              type: 'select',
              label: 'Accompaniment',
              labelHe: 'ליווי',
              required: false,
              options: [
                { value: 'required', label: 'Required', labelHe: 'נדרש' },
                { value: 'preferred', label: 'Preferred', labelHe: 'מועדף' },
                { value: 'not_needed', label: 'Not Needed', labelHe: 'לא נדרש' }
              ]
            },
            {
              id: 'healthConsiderations',
              type: 'textarea',
              label: 'Health Considerations',
              labelHe: 'שיקולים רפואיים',
              required: false,
              placeholder: 'למשל: נגישות, קרבה למרכז רפואי'
            }
          ]
        },
        {
          id: 'M16-S01-V3',
          sectionId: 'M16-S01',
          name: 'Short Trips',
          nameHe: 'טיולים קצרים',
          textTemplate: `טיולי יום/סופ"ש לאזורים קרובים:\n\n- תדירות: {{frequency}}\n- יעדים: {{destinations}}\n- ארגון פשוט וגמיש\n- בהתאם למצב ולמזג האוויר`,
          fields: [
            {
              id: 'frequency',
              type: 'text',
              label: 'Frequency',
              labelHe: 'תדירות',
              required: false,
              placeholder: 'פעם בחודש'
            },
            {
              id: 'destinations',
              type: 'text',
              label: 'Typical Destinations',
              labelHe: 'יעדים טיפוסיים',
              required: false,
              placeholder: 'פארקים לאומיים, חוף הים, עיירות קרובות'
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
    },
    {
      id: 'M16-S02',
      moduleId: 'M16',
      name: 'Special Considerations',
      nameHe: 'שיקולים מיוחדים',
      displayOrder: 2,
      isRequired: false,
      variants: [
        {
          id: 'M16-S02-V1',
          sectionId: 'M16-S02',
          name: 'Accessibility Requirements',
          nameHe: 'דרישות נגישות',
          textTemplate: `דרישות נגישות לנסיעות:\n\n- {{accessibilityNeeds}}\n- תיאום מראש עם המקום\n- וידוא נגישות מלאה\n- התאמות מיוחדות במידת הצורך`,
          fields: [
            {
              id: 'accessibilityNeeds',
              type: 'textarea',
              label: 'Accessibility Needs',
              labelHe: 'צרכי נגישות',
              required: true,
              placeholder: 'למשל: כיסא גלגלים, רמפות, חדר בקומת קרקע, מקלחת נגישה'
            }
          ]
        },
        {
          id: 'M16-S02-V2',
          sectionId: 'M16-S02',
          name: 'Medical Preparations',
          nameHe: 'הכנות רפואיות',
          textTemplate: `הכנות רפואיות לנסיעה:\n\n- {{medicalPreparations}}\n- תיאום עם רופא לפני נסיעה\n- הכנת מכתב רפואי\n- תרופות למשך הנסיעה + מילואים`,
          fields: [
            {
              id: 'medicalPreparations',
              type: 'textarea',
              label: 'Medical Preparations',
              labelHe: 'הכנות רפואיות',
              required: true,
              placeholder: 'למשל: אישור רופא, רשימת תרופות, ציוד רפואי'
            }
          ]
        }
      ]
    }
  ]
};

