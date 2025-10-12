import { Module } from '../../types/advanceDirectives.types';

export const M10_Nutrition: Module = {
  id: 'M10',
  name: 'Nutrition',
  nameHe: 'תזונה',
  category: 'personal',
  isMandatory: true,
  displayOrder: 10,
  description: 'הנחיות תזונה וארוחות',
  sections: [
    {
      id: 'M10-S01',
      moduleId: 'M10',
      name: 'General Principles',
      nameHe: 'עקרונות כלליים',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M10-S01-V1',
          sectionId: 'M10-S01',
          name: 'General Healthy Diet',
          nameHe: 'תזונה בריאה כללית',
          textTemplate: `תזונה בריאה, מאוזנת ומגוונת בהתאם להעדפותיי:\n\n**עקרונות:**\n- כל רכיבי התזונה הנחוצים (חלבונים, פחמימות, שומנים בריאים, ויטמינים, מינרלים)\n- מוצרים טריים ואיכותיים\n- ירקות ופירות מגוונים בכל ארוחה\n- חלבונים איכותיים (בשר, עוף, דגים, ביצים, קטניות)\n- פחמימות מורכבות (לחם מלא, אורז מלא, קינואה)\n- הימנעות ממזון מעובד ומהיר\n- שמירה על לוח זמנים סדיר של ארוחות\n\n**התאמה אישית:**\n- התחשבות בהעדפות אישיות\n- התאמה לתרבות ורקע\n- גיוון במתכונים`,
          fields: []
        }
      ]
    },
    {
      id: 'M10-S02',
      moduleId: 'M10',
      name: 'Meal Schedule',
      nameHe: 'הנחיות מפורטות לארוחות',
      displayOrder: 2,
      isRequired: false,
      variants: [
        {
          id: 'M10-S02-V1',
          sectionId: 'M10-S02',
          name: 'Mediterranean Diet',
          nameHe: 'דיאטת ים תיכון',
          textTemplate: `תפריט יומי בהתאם לדיאטת ים תיכון:\n\n**ארוחת בוקר ({{breakfastTime}}):**\n- דיאטת ים תיכונית מבוססת ירקות וסלטים\n- ללא קמח לבן\n- ביצים וגבינות לבנות (קוטג', לבנה, בולגרית)\n- ירקות טריים (עגבניה, מלפפון, פלפל)\n- זיתים\n- שמן זית\n\n**ארוחת צהריים ({{lunchTime}}) - ארוחה עיקרית:**\n- מוצרי עוף או דג ({{protein}})\n- ירק מבושל (תפוח אדמה, גזר, דלעת, קישוא)\n- מרק עוף או ירקות (בעונת החורף)\n- סלט טרי\n\n**ארוחת ערב (עד {{dinnerTime}}):**\n- פרי או יוגורט בלבד\n- ארוחה קלה\n\n**איסורים:**\n- מרגרינה\n- מיונז\n- רטבים (למעט שמן זית ומיץ לימון)\n- קמח לבן`,
          fields: [
            {
              id: 'breakfastTime',
              type: 'text',
              label: 'Breakfast Time',
              labelHe: 'שעת ארוחת בוקר',
              required: false,
              placeholder: '08:00'
            },
            {
              id: 'lunchTime',
              type: 'text',
              label: 'Lunch Time',
              labelHe: 'שעת ארוחת צהריים',
              required: false,
              placeholder: '13:00'
            },
            {
              id: 'dinnerTime',
              type: 'text',
              label: 'Dinner Time',
              labelHe: 'שעת ארוחת ערב',
              required: false,
              placeholder: '18:00'
            },
            {
              id: 'protein',
              type: 'text',
              label: 'Preferred Protein',
              labelHe: 'חלבון מועדף',
              required: false,
              placeholder: 'עוף, דג, הודו'
            }
          ]
        }
      ]
    }
  ]
};

