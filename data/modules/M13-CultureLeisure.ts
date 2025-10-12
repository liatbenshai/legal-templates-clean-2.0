import { Module } from '../../types/advanceDirectives.types';

export const M13_CultureLeisure: Module = {
  id: 'M13',
  name: 'Culture and Leisure',
  nameHe: 'תרבות ופנאי',
  category: 'personal',
  isMandatory: false,
  displayOrder: 13,
  description: 'פעילויות תרבות ופנאי',
  sections: [
    {
      id: 'M13-S01',
      moduleId: 'M13',
      name: 'Activity Selection',
      nameHe: 'בחירת פעילויות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M13-S01-V1',
          sectionId: 'M13-S01',
          name: 'Selected Activities',
          nameHe: 'פעילויות נבחרות',
          textTemplate: `פעילויות תרבות ופנאי שחשובות לי:{{#if cinema}}\n\n**קולנוע:**\n- תדירות: {{cinemaFrequency}}\n- על מיופה הכוח לוודא שאוכל להגיע ולצפות בהקרנות סרטים באופן סדיר\n- ארגון הסעה וכרטיסים{{#if cinemaPreferences}}\n- העדפות: {{cinemaPreferences}}{{/if}}{{/if}}{{#if theater}}\n\n**תיאטרון:**\n- {{theaterType}}\n- על מיופה הכוח {{theaterAction}}{{#if theaterLocation}}\n- מקום: {{theaterLocation}}{{/if}}{{/if}}{{#if concerts}}\n\n**קונצרטים/מופעים:**\n- תדירות: {{concertsFrequency}}{{#if concertsType}}\n- סוג: {{concertsType}}{{/if}}{{/if}}{{#if museums}}\n\n**מוזיאונים:**\n- ביקורים תקופתיים במוזיאונים{{#if museumsType}}\n- סוג: {{museumsType}}{{/if}}{{/if}}{{#if cafes}}\n\n**בתי קפה:**\n- תדירות: {{cafesFrequency}}\n- מיופה הכוח ידאג לאפשר לי לשמר את הרגלי החברתיים ולבלות בבתי קפה\n- תיאום וליווי לפי צורך{{/if}}{{#if beach}}\n\n**חוף הים:**\n- ככל שהדבר אפשרי ובהתאם למצבי הבריאותי\n- מיופה הכוח ישאף לאפשר לי ביקורים בחוף הים\n- {{beachFrequency}}{{/if}}{{#if malls}}\n\n**קניונים:**\n- מיופה הכוח ידאג לאפשר לי ביקורים בקניון\n- {{mallsFrequency}}{{/if}}{{#if parks}}\n\n**פארקים/גנים:**\n- ביקורים בפארקים ציבוריים\n- {{parksFrequency}}{{/if}}{{#if library}}\n\n**ספריות:**\n- ביקורים בספרייה\n- השאלת ספרים{{/if}}{{#if classes}}\n\n**חוגים/קורסים:**\n{{classesDescription}}{{/if}}`,
          fields: [
            {
              id: 'cinema',
              type: 'boolean',
              label: 'Cinema',
              labelHe: 'קולנוע',
              required: false
            },
            {
              id: 'cinemaFrequency',
              type: 'select',
              label: 'Cinema Frequency',
              labelHe: 'תדירות קולנוע',
              required: false,
              options: [
                { value: 'weekly', label: 'Once a week', labelHe: 'פעם בשבוע' },
                { value: 'biweekly', label: 'Every two weeks', labelHe: 'אחת לשבועיים' },
                { value: 'monthly', label: 'Once a month', labelHe: 'פעם בחודש' },
                { value: 'occasional', label: 'Occasionally', labelHe: 'מדי פעם' }
              ]
            },
            {
              id: 'cinemaPreferences',
              type: 'text',
              label: 'Cinema Preferences',
              labelHe: 'העדפות קולנוע',
              required: false,
              placeholder: 'דרמה, קומדיה, סרטים ישראליים'
            },
            {
              id: 'theater',
              type: 'boolean',
              label: 'Theater',
              labelHe: 'תיאטרון',
              required: false
            },
            {
              id: 'theaterType',
              type: 'select',
              label: 'Theater Type',
              labelHe: 'סוג תיאטרון',
              required: false,
              options: [
                { value: 'subscription', label: 'Annual Subscription', labelHe: 'מנוי שנתי' },
                { value: 'occasional', label: 'Occasional Visits', labelHe: 'ביקורים חופשיים' }
              ]
            },
            {
              id: 'theaterAction',
              type: 'select',
              label: 'Theater Action',
              labelHe: 'פעולה נדרשת',
              required: false,
              options: [
                { value: 'renew', label: 'Renew subscription annually', labelHe: 'לחדש מנוי מדי שנה' },
                { value: 'arrange', label: 'Arrange occasional visits', labelHe: 'לארגן ביקורים' }
              ]
            },
            {
              id: 'theaterLocation',
              type: 'text',
              label: 'Theater Name/Location',
              labelHe: 'שם/מיקום תיאטרון',
              required: false,
              placeholder: 'תיאטרון הקאמרי'
            },
            {
              id: 'concerts',
              type: 'boolean',
              label: 'Concerts/Shows',
              labelHe: 'קונצרטים/מופעים',
              required: false
            },
            {
              id: 'concertsFrequency',
              type: 'text',
              label: 'Concerts Frequency',
              labelHe: 'תדירות',
              required: false,
              placeholder: 'מספר פעמים בשנה'
            },
            {
              id: 'concertsType',
              type: 'text',
              label: 'Preferred Music/Shows',
              labelHe: 'סוג מוזיקה/מופעים מועדף',
              required: false,
              placeholder: 'מוזיקה קלאסית, מוזיקה ישראלית'
            },
            {
              id: 'museums',
              type: 'boolean',
              label: 'Museums',
              labelHe: 'מוזיאונים',
              required: false
            },
            {
              id: 'museumsType',
              type: 'text',
              label: 'Museum Preferences',
              labelHe: 'העדפות מוזיאונים',
              required: false,
              placeholder: 'אמנות, היסטוריה, מדע'
            },
            {
              id: 'cafes',
              type: 'boolean',
              label: 'Cafes',
              labelHe: 'בתי קפה',
              required: false
            },
            {
              id: 'cafesFrequency',
              type: 'select',
              label: 'Cafe Frequency',
              labelHe: 'תדירות בתי קפה',
              required: false,
              options: [
                { value: 'daily', label: 'Daily', labelHe: 'יומי' },
                { value: 'several_weekly', label: 'Several times a week', labelHe: 'מספר פעמים בשבוע' },
                { value: 'weekly', label: 'Once a week', labelHe: 'פעם בשבוע' },
                { value: 'occasional', label: 'Occasionally', labelHe: 'מדי פעם' }
              ]
            },
            {
              id: 'beach',
              type: 'boolean',
              label: 'Beach',
              labelHe: 'חוף הים',
              required: false
            },
            {
              id: 'beachFrequency',
              type: 'text',
              label: 'Beach Frequency',
              labelHe: 'תדירות',
              required: false,
              placeholder: 'קיץ - פעם בשבוע, חורף - לפי מזג אוויר'
            },
            {
              id: 'malls',
              type: 'boolean',
              label: 'Shopping Malls',
              labelHe: 'קניונים',
              required: false
            },
            {
              id: 'mallsFrequency',
              type: 'text',
              label: 'Mall Frequency',
              labelHe: 'תדירות',
              required: false,
              placeholder: 'אחת לשבועיים'
            },
            {
              id: 'parks',
              type: 'boolean',
              label: 'Parks/Gardens',
              labelHe: 'פארקים/גנים',
              required: false
            },
            {
              id: 'parksFrequency',
              type: 'text',
              label: 'Parks Frequency',
              labelHe: 'תדירות',
              required: false,
              placeholder: 'שבועי'
            },
            {
              id: 'library',
              type: 'boolean',
              label: 'Library',
              labelHe: 'ספרייה',
              required: false
            },
            {
              id: 'classes',
              type: 'boolean',
              label: 'Classes/Courses',
              labelHe: 'חוגים/קורסים',
              required: false
            },
            {
              id: 'classesDescription',
              type: 'textarea',
              label: 'Classes Description',
              labelHe: 'תיאור חוגים',
              required: false,
              placeholder: 'למשל: קורס אנגלית, חוג ציור'
            }
          ]
        }
      ]
    },
    {
      id: 'M13-S02',
      moduleId: 'M13',
      name: 'Organization Principles',
      nameHe: 'עקרונות ארגון',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M13-S02-V1',
          sectionId: 'M13-S02',
          name: 'Standard Organization',
          nameHe: 'ארגון סטנדרטי',
          textTemplate: `מיופה הכוח ידאג לארגון הפעילויות:\n\n- **תיאום** - תיאום מראש של כל פעילות\n- **ליווי** - ליווי אישי אם נדרש\n- **הסעה** - ארגון הסעה מתאימה (מונית, רכב פרטי)\n- **נגישות** - וידוא נגישות המקום\n- **תשלום** - תשלום עלויות (כרטיסים, מנויים)\n- **עידוד** - עידוד השתתפות תוך כיבוד רצון\n- **גמישות** - אפשרות לביטול אם לא מרגיש טוב`,
          fields: []
        }
      ]
    }
  ]
};

