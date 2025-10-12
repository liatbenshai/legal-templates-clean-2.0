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
            }
          ]
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

