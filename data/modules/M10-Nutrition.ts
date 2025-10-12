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
        },
        {
          id: 'M10-S02-V2',
          sectionId: 'M10-S02',
          name: 'Structured Daily Menu',
          nameHe: 'תפריט יומי מסודר',
          textTemplate: `תפריט יומי:\n\n**{{breakfastTime}} - ארוחת בוקר:**\n{{breakfastMenu}}\n\n**{{midMorningTime}} - ארוחת ביניים:**\n{{midMorningSnack}}\n\n**{{lunchTime}} - ארוחת צהריים (עיקרית):**\n{{lunchMenu}}\n\n**{{afternoonTime}} - ארוחת אחר הצהריים:**\n{{afternoonSnack}}\n\n**{{dinnerTime}} - ארוחת ערב:**\n{{dinnerMenu}}`,
          fields: [
            {
              id: 'breakfastTime',
              type: 'text',
              label: 'Breakfast Time',
              labelHe: 'שעת בוקר',
              required: true,
              placeholder: '07:00'
            },
            {
              id: 'breakfastMenu',
              type: 'textarea',
              label: 'Breakfast Menu',
              labelHe: 'תפריט בוקר',
              required: true,
              placeholder: 'לחם מלא עם קוטג\' וירקות, מים חמים עם לימון'
            },
            {
              id: 'midMorningTime',
              type: 'text',
              label: 'Mid-Morning Time',
              labelHe: 'שעת ביניים',
              required: false,
              placeholder: '10:00'
            },
            {
              id: 'midMorningSnack',
              type: 'textarea',
              label: 'Mid-Morning Snack',
              labelHe: 'ארוחת ביניים',
              required: false,
              placeholder: 'קפה עם עוגיות / פרי'
            },
            {
              id: 'lunchTime',
              type: 'text',
              label: 'Lunch Time',
              labelHe: 'שעת צהריים',
              required: true,
              placeholder: '13:00'
            },
            {
              id: 'lunchMenu',
              type: 'textarea',
              label: 'Lunch Menu',
              labelHe: 'תפריט צהריים',
              required: true,
              placeholder: 'עוף או בשר עם תוספת (אורז/פתיתים) וירקות מבושלים'
            },
            {
              id: 'afternoonTime',
              type: 'text',
              label: 'Afternoon Time',
              labelHe: 'שעת אחה"צ',
              required: false,
              placeholder: '16:00'
            },
            {
              id: 'afternoonSnack',
              type: 'textarea',
              label: 'Afternoon Snack',
              labelHe: 'ארוחת אחה"צ',
              required: false,
              placeholder: 'קפה ועוגה קטנה'
            },
            {
              id: 'dinnerTime',
              type: 'text',
              label: 'Dinner Time',
              labelHe: 'שעת ערב',
              required: true,
              placeholder: '19:00'
            },
            {
              id: 'dinnerMenu',
              type: 'textarea',
              label: 'Dinner Menu',
              labelHe: 'תפריט ערב',
              required: true,
              placeholder: 'סלט טרי ומגוון, גבינה, ביצה'
            }
          ]
        },
        {
          id: 'M10-S02-V3',
          sectionId: 'M10-S02',
          name: 'Main Meal at Lunch',
          nameHe: 'ארוחה עיקרית בצהריים',
          textTemplate: `תפריט עם דגש על ארוחת צהריים עיקרית:\n\n**בוקר:**\n{{breakfastOptions}}\n\n**צהריים - ארוחה עיקרית:**\n{{lunchOptions}}\n\n**במהלך היום:**\n{{snackOptions}}`,
          fields: [
            {
              id: 'breakfastOptions',
              type: 'textarea',
              label: 'Breakfast Options',
              labelHe: 'אופציות בוקר',
              required: true,
              placeholder: 'ביצים, נקניקים, טונה, סרדינים, מאפים, פיתות'
            },
            {
              id: 'lunchOptions',
              type: 'textarea',
              label: 'Lunch Options',
              labelHe: 'אופציות צהריים',
              required: true,
              placeholder: 'עוף/בקר + מטבוחה/פסטה/צ\'יפס/אורז/פתיתים'
            },
            {
              id: 'snackOptions',
              type: 'textarea',
              label: 'Snack Options',
              labelHe: 'אופציות חטיפים',
              required: false,
              placeholder: 'פירות טריים (אבטיח, ענבים), גלידות'
            }
          ]
        }
      ]
    },
    {
      id: 'M10-S03',
      moduleId: 'M10',
      name: 'Dietary Restrictions',
      nameHe: 'איסורים תזונתיים',
      displayOrder: 3,
      isRequired: false,
      variants: [
        {
          id: 'M10-S03-V1',
          sectionId: 'M10-S03',
          name: 'Specific Restrictions',
          nameHe: 'איסורים ספציפיים',
          textTemplate: `איסורים תזונתיים מוחלטים:\n\n{{#each restrictions}}- {{this}}\n{{/each}}\n\nיש להקפיד על כך בכל ארוחה ובכל מצב.`,
          fields: [
            {
              id: 'restrictions',
              type: 'multiselect',
              label: 'Dietary Restrictions',
              labelHe: 'איסורים תזונתיים',
              required: true,
              options: [
                { value: 'dairy', label: 'All Dairy Products', labelHe: 'כל מוצרי החלב' },
                { value: 'gluten', label: 'Gluten', labelHe: 'גלוטן' },
                { value: 'onion', label: 'Onion', labelHe: 'בצל' },
                { value: 'garlic', label: 'Garlic', labelHe: 'שום' },
                { value: 'mushrooms', label: 'Mushrooms', labelHe: 'פטריות' },
                { value: 'red_meat_steaks', label: 'Steaks and Red Meat Cuts', labelHe: 'סטייקים ונתחי בשר בקר' },
                { value: 'all_meat', label: 'All Meat (Vegan)', labelHe: 'בשר בכלל - טבעוני' },
                { value: 'pork', label: 'Pork', labelHe: 'חזיר' },
                { value: 'seafood', label: 'Seafood', labelHe: 'פירות ים' },
                { value: 'eggs', label: 'Eggs', labelHe: 'ביצים' },
                { value: 'nuts', label: 'Nuts', labelHe: 'אגוזים' },
                { value: 'processed_sugar', label: 'Processed Sugar', labelHe: 'סוכר מעובד' },
                { value: 'excess_salt', label: 'Excess Salt', labelHe: 'מלח עודף' },
                { value: 'caffeine', label: 'Caffeine', labelHe: 'קפאין' },
                { value: 'alcohol', label: 'Alcohol', labelHe: 'אלכוהול' }
              ]
            }
          ]
        },
        {
          id: 'M10-S03-V2',
          sectionId: 'M10-S03',
          name: 'Custom Restrictions',
          nameHe: 'איסורים מותאמים אישית',
          textTemplate: `איסורים תזונתיים:\n\n{{customRestrictions}}`,
          fields: [
            {
              id: 'customRestrictions',
              type: 'textarea',
              label: 'Custom Restrictions',
              labelHe: 'איסורים מותאמים',
              required: true,
              placeholder: 'פרט את האיסורים התזונתיים...'
            }
          ]
        }
      ]
    },
    {
      id: 'M10-S04',
      moduleId: 'M10',
      name: 'Special Diets',
      nameHe: 'דיאטות מיוחדות',
      displayOrder: 4,
      isRequired: false,
      variants: [
        {
          id: 'M10-S04-V1',
          sectionId: 'M10-S04',
          name: 'Medical Diet',
          nameHe: 'דיאטה רפואית',
          textTemplate: `דיאטה מיוחדת: {{dietType}}\n\n{{dietDescription}}\n\nהנחיות ספציפיות:\n{{dietGuidelines}}`,
          fields: [
            {
              id: 'dietType',
              type: 'select',
              label: 'Diet Type',
              labelHe: 'סוג דיאטה',
              required: true,
              options: [
                { value: 'diabetic', label: 'Diabetic Diet', labelHe: 'דיאטה לסוכרתיים' },
                { value: 'low_sodium', label: 'Low Sodium', labelHe: 'דלת נתרן (לחץ דם)' },
                { value: 'low_fat', label: 'Low Fat', labelHe: 'דלת שומן' },
                { value: 'low_carb', label: 'Low Carb', labelHe: 'דלת פחמימות' },
                { value: 'renal', label: 'Renal Diet', labelHe: 'דיאטה לכליות' },
                { value: 'vegan', label: 'Vegan', labelHe: 'טבעוני' },
                { value: 'vegetarian', label: 'Vegetarian', labelHe: 'צמחוני' },
                { value: 'other', label: 'Other', labelHe: 'אחר' }
              ]
            },
            {
              id: 'dietDescription',
              type: 'textarea',
              label: 'Diet Description',
              labelHe: 'תיאור הדיאטה',
              required: false,
              placeholder: 'תיאור כללי של הדיאטה'
            },
            {
              id: 'dietGuidelines',
              type: 'textarea',
              label: 'Specific Guidelines',
              labelHe: 'הנחיות ספציפיות',
              required: false,
              placeholder: 'הנחיות מפורטות לתזונה'
            }
          ]
        }
      ]
    },
    {
      id: 'M10-S05',
      moduleId: 'M10',
      name: 'Supplements',
      nameHe: 'תוספי מזון',
      displayOrder: 5,
      isRequired: false,
      variants: [
        {
          id: 'M10-S05-V1',
          sectionId: 'M10-S05',
          name: 'Doctor Approval Only',
          nameHe: 'רק בהנחיית רופא',
          textTemplate: `תוספי מזון יינתנו אך ורק בהנחיית רופא המשפחה או דיאטנית מוסמכת.\n\nאין ליטול תוספי מזון באופן עצמאי או בהמלצת גורמים לא מוסמכים.`,
          fields: []
        },
        {
          id: 'M10-S05-V2',
          sectionId: 'M10-S05',
          name: 'Approved Supplements',
          nameHe: 'תוספים מאושרים',
          textTemplate: `רשימת תוספי מזון מאושרים:\n\n{{#each supplements}}\n- {{name}}: {{dosage}} - {{frequency}}\n{{/each}}\n\nכל שינוי או תוספת יבוצעו רק בהנחיית רופא.`,
          fields: [
            {
              id: 'supplements',
              type: 'array',
              label: 'Approved Supplements',
              labelHe: 'תוספי מזון מאושרים',
              required: true,
              arrayItemSchema: [
                {
                  id: 'name',
                  type: 'text',
                  label: 'Supplement Name',
                  labelHe: 'שם התוסף',
                  required: true,
                  placeholder: 'ויטמין D'
                },
                {
                  id: 'dosage',
                  type: 'text',
                  label: 'Dosage',
                  labelHe: 'מינון',
                  required: true,
                  placeholder: '1000 IU'
                },
                {
                  id: 'frequency',
                  type: 'text',
                  label: 'Frequency',
                  labelHe: 'תדירות',
                  required: true,
                  placeholder: 'פעם ביום עם ארוחת בוקר'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M10-S06',
      moduleId: 'M10',
      name: 'Medical Adaptation',
      nameHe: 'התאמה למגבלות רפואיות',
      displayOrder: 6,
      isRequired: true,
      variants: [
        {
          id: 'M10-S06-V1',
          sectionId: 'M10-S06',
          name: 'Standard Adaptation',
          nameHe: 'התאמה סטנדרטית',
          textTemplate: `במקרה של מגבלות רפואיות חדשות, המלצות דיאטטיות או שינויים במצב הבריאותי:\n\nיש להתאים את התפריט בהתאם להנחיות:\n- הרופאים המטפלים\n- הדיאטנית הקלינית\n- הגורמים הרפואיים המוסמכים\n\nההתאמה תיעשה תוך שמירה מקסימלית על ההעדפות האישיות ככל הניתן.`,
          fields: []
        }
      ]
    }
  ]
};

