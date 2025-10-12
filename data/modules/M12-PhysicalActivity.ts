import { Module } from '../../types/advanceDirectives.types';

export const M12_PhysicalActivity: Module = {
  id: 'M12',
  name: 'Physical Activity',
  nameHe: 'פעילות גופנית',
  category: 'personal',
  isMandatory: false,
  displayOrder: 12,
  description: 'פעילות גופנית וספורט',
  sections: [
    {
      id: 'M12-S01',
      moduleId: 'M12',
      name: 'Activity Type',
      nameHe: 'סוג פעילות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M12-S01-V1',
          sectionId: 'M12-S01',
          name: 'Daily Walking',
          nameHe: 'הליכה יומית',
          textTemplate: `אני מבקש לצאת להליכה לפחות {{duration}} דקות ביום מחוץ לבית, באופן קבוע ככל שמצבי הבריאותי מאפשר.\n\n**פרטים:**\n- תדירות: {{frequency}}\n- משך: {{duration}} דקות{{#if location}}\n- מקום מועדף: {{location}}{{/if}}{{#if companion}}\n- {{companion}}{{/if}}\n\n**במקרה שהבריאות לא מאפשרת:**\n- ליווי מתאים (משפחה / מטפל)\n- שימוש בעזרי ניידות (הליכון, כיסא גלגלים)\n- או חלופה סבירה (פיזיותרפיה, תרגילים בבית)`,
          fields: [
            {
              id: 'duration',
              type: 'number',
              label: 'Duration (minutes)',
              labelHe: 'משך (דקות)',
              required: true,
              placeholder: '60',
              validation: { min: 10, max: 180 }
            },
            {
              id: 'frequency',
              type: 'select',
              label: 'Frequency',
              labelHe: 'תדירות',
              required: true,
              options: [
                { value: 'daily', label: 'Daily', labelHe: 'יומי' },
                { value: 'most_days', label: 'Most Days (5-6/week)', labelHe: 'רוב הימים (5-6 בשבוע)' },
                { value: 'several_times', label: 'Several Times a Week', labelHe: 'מספר פעמים בשבוע' }
              ]
            },
            {
              id: 'location',
              type: 'text',
              label: 'Preferred Location',
              labelHe: 'מקום מועדף',
              required: false,
              placeholder: 'בים, בשכונה, בפארק'
            },
            {
              id: 'companion',
              type: 'select',
              label: 'Companion Preference',
              labelHe: 'העדפת ליווי',
              required: false,
              options: [
                { value: 'alone', label: 'Prefer Alone', labelHe: 'מעדיף לבד' },
                { value: 'with_company', label: 'With Company', labelHe: 'עם ליווי' },
                { value: 'flexible', label: 'Flexible', labelHe: 'גמיש' }
              ]
            }
          ]
        },
        {
          id: 'M12-S01-V2',
          sectionId: 'M12-S01',
          name: 'Pilates/Yoga',
          nameHe: 'פילאטיס/יוגה',
          textTemplate: `המשך פעילות גופנית מותאמת:\n\n**סוג פעילות:** {{activityType}}\n**תדירות:** {{frequency}} בשבוע\n**משך:** {{duration}} דקות לשיעור{{#if location}}\n**מקום:** {{location}}{{/if}}{{#if instructor}}\n**מדריך/ה מועדף/ת:** {{instructor}}{{/if}}\n\n**מטרות:**\n- שמירה על גמישות\n- שיפור יציבה\n- חיזוק שרירים\n- שיפור איזון\n\n**התאמות:**\n- התאמה למצב הבריאותי\n- תיאום עם פיזיותרפיסט אם נדרש`,
          fields: [
            {
              id: 'activityType',
              type: 'select',
              label: 'Activity Type',
              labelHe: 'סוג פעילות',
              required: true,
              options: [
                { value: 'pilates', label: 'Pilates', labelHe: 'פילאטיס' },
                { value: 'yoga', label: 'Yoga', labelHe: 'יוגה' },
                { value: 'both', label: 'Both', labelHe: 'שניהם' }
              ]
            },
            {
              id: 'frequency',
              type: 'number',
              label: 'Times per Week',
              labelHe: 'פעמים בשבוע',
              required: true,
              placeholder: '2',
              validation: { min: 1, max: 7 }
            },
            {
              id: 'duration',
              type: 'number',
              label: 'Duration (minutes)',
              labelHe: 'משך (דקות)',
              required: false,
              placeholder: '60',
              validation: { min: 30, max: 120 }
            },
            {
              id: 'location',
              type: 'text',
              label: 'Location',
              labelHe: 'מקום',
              required: false,
              placeholder: 'סטודיו פילאטיס, רחוב...'
            },
            {
              id: 'instructor',
              type: 'text',
              label: 'Preferred Instructor',
              labelHe: 'מדריך/ה מועדף/ת',
              required: false
            }
          ]
        },
        {
          id: 'M12-S01-V3',
          sectionId: 'M12-S01',
          name: 'Variety of Activities',
          nameHe: 'מגוון פעילויות',
          textTemplate: `מגוון פעילויות גופניות:\n\n{{#each activities}}\n**{{name}}:**\n- תדירות: {{frequency}}\n- משך: {{duration}} דקות{{#if location}}\n- מקום: {{location}}{{/if}}\n\n{{/each}}\n\n**עקרונות:**\n- גיוון בפעילויות\n- התאמה למצב הבריאותי\n- הנאה ולא כפייה`,
          fields: [
            {
              id: 'activities',
              type: 'array',
              label: 'Activities',
              labelHe: 'פעילויות',
              required: true,
              arrayItemSchema: [
                {
                  id: 'name',
                  type: 'text',
                  label: 'Activity Name',
                  labelHe: 'שם הפעילות',
                  required: true,
                  placeholder: 'הליכה, שחייה, חדר כושר...'
                },
                {
                  id: 'frequency',
                  type: 'text',
                  label: 'Frequency',
                  labelHe: 'תדירות',
                  required: true,
                  placeholder: 'פעמיים בשבוע'
                },
                {
                  id: 'duration',
                  type: 'number',
                  label: 'Duration (minutes)',
                  labelHe: 'משך (דקות)',
                  required: false,
                  placeholder: '60'
                },
                {
                  id: 'location',
                  type: 'text',
                  label: 'Location',
                  labelHe: 'מקום',
                  required: false,
                  placeholder: 'חדר כושר X'
                }
              ]
            }
          ]
        },
        {
          id: 'M12-S01-V4',
          sectionId: 'M12-S01',
          name: 'No Specific Requirement',
          nameHe: 'ללא דרישה ספציפית',
          textTemplate: `פעילות גופנית לפי יכולת, רצון והנאה.\nאין דרישה ספציפית, אך עידוד לפעילות ככל שניתן.`,
          fields: []
        }
      ]
    },
    {
      id: 'M12-S02',
      moduleId: 'M12',
      name: 'General Principles',
      nameHe: 'עקרונות כלליים',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M12-S02-V1',
          sectionId: 'M12-S02',
          name: 'Standard Principles',
          nameHe: 'עקרונות סטנדרטיים',
          textTemplate: `עקרונות פעילות גופנית:\n\n- **תיאום עם גורמים רפואיים** - כל פעילות חדשה או שינוי יתואם עם הרופא המטפל\n- **התאמה למצב בריאותי** - התאמה מתמדת בהתאם למצב המשתנה\n- **בטיחות** - וידוא שהפעילות לא מסכנת ומתאימה ליכולות\n- **עידוד והנאה** - הפעילות צריכה להיות מהנה, לא כפייה\n- **גמישות** - יכולת להתאים ולשנות בהתאם לצרכים`,
          fields: []
        }
      ]
    }
  ]
};

