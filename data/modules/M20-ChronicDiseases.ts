import { Module } from '../../types/advanceDirectives.types';

export const M20_ChronicDiseases: Module = {
  id: 'M20',
  name: 'Chronic Diseases',
  nameHe: 'מחלות כרוניות',
  category: 'medical',
  isMandatory: false,
  displayOrder: 20,
  description: 'ניהול מחלות כרוניות קיימות',
  sections: [
    {
      id: 'M20-S01',
      moduleId: 'M20',
      name: 'Disease List',
      nameHe: 'רשימת מחלות',
      displayOrder: 1,
      isRequired: true,
      variants: [
        {
          id: 'M20-S01-V1',
          sectionId: 'M20-S01',
          name: 'Chronic Disease Registration',
          nameHe: 'רישום מחלות כרוניות',
          textTemplate: `מחלות כרוניות קיימות:\n\n{{#each diseases}}\n**{{index}}. {{name}}**\n   - אבחון: {{diagnosisYear}}\n   - רופא מטפל: {{doctor}}{{#if medications}}\n   - תרופות: {{medications}}{{/if}}{{#if monitoring}}\n   - מעקב: {{monitoring}}{{/if}}{{#if specialInstructions}}\n   - הנחיות מיוחדות: {{specialInstructions}}{{/if}}\n\n{{/each}}`,
          fields: [
            {
              id: 'diseases',
              type: 'array',
              label: 'Chronic Diseases',
              labelHe: 'מחלות כרוניות',
              required: true,
              arrayItemSchema: [
                {
                  id: 'name',
                  type: 'select',
                  label: 'Disease Name',
                  labelHe: 'שם המחלה',
                  required: true,
                  options: [
                    { value: 'diabetes_type1', label: 'Diabetes Type 1', labelHe: 'סכרת סוג 1' },
                    { value: 'diabetes_type2', label: 'Diabetes Type 2', labelHe: 'סכרת סוג 2' },
                    { value: 'hypertension', label: 'Hypertension', labelHe: 'יתר לחץ דם' },
                    { value: 'heart_disease', label: 'Heart Disease', labelHe: 'מחלת לב' },
                    { value: 'copd', label: 'COPD', labelHe: 'COPD - מחלת ריאות חסימתית' },
                    { value: 'asthma', label: 'Asthma', labelHe: 'אסטמה' },
                    { value: 'kidney_disease', label: 'Chronic Kidney Disease', labelHe: 'אי ספיקת כליות כרונית' },
                    { value: 'liver_disease', label: 'Liver Disease', labelHe: 'מחלת כבד' },
                    { value: 'alzheimers', label: 'Alzheimer\'s Disease', labelHe: 'אלצהיימר' },
                    { value: 'parkinsons', label: 'Parkinson\'s Disease', labelHe: 'פרקינסון' },
                    { value: 'ms', label: 'Multiple Sclerosis', labelHe: 'טרשת נפוצה - MS' },
                    { value: 'arthritis', label: 'Arthritis', labelHe: 'דלקת פרקים' },
                    { value: 'osteoporosis', label: 'Osteoporosis', labelHe: 'אוסטיאופורוזיס' },
                    { value: 'thyroid', label: 'Thyroid Disease', labelHe: 'מחלת בלוטת התריס' },
                    { value: 'cancer', label: 'Cancer (in remission)', labelHe: 'סרטן (בהפוגה)' },
                    { value: 'epilepsy', label: 'Epilepsy', labelHe: 'אפילפסיה' },
                    { value: 'depression', label: 'Clinical Depression', labelHe: 'דיכאון קליני' },
                    { value: 'anxiety', label: 'Anxiety Disorder', labelHe: 'הפרעת חרדה' },
                    { value: 'other', label: 'Other', labelHe: 'אחר' }
                  ]
                },
                {
                  id: 'diagnosisYear',
                  type: 'text',
                  label: 'Diagnosis Year',
                  labelHe: 'שנת אבחון',
                  required: false,
                  placeholder: '2015'
                },
                {
                  id: 'doctor',
                  type: 'text',
                  label: 'Treating Doctor',
                  labelHe: 'רופא מטפל',
                  required: false,
                  placeholder: 'ד"ר כהן, קרדיולוג'
                },
                {
                  id: 'medications',
                  type: 'textarea',
                  label: 'Medications',
                  labelHe: 'תרופות',
                  required: false,
                  placeholder: 'מטפורמין 1000 פעמיים ביום'
                },
                {
                  id: 'monitoring',
                  type: 'text',
                  label: 'Monitoring Schedule',
                  labelHe: 'לוח מעקב',
                  required: false,
                  placeholder: 'בדיקות דם כל 3 חודשים'
                },
                {
                  id: 'specialInstructions',
                  type: 'textarea',
                  label: 'Special Instructions',
                  labelHe: 'הנחיות מיוחדות',
                  required: false,
                  placeholder: 'דיאטה דלת פחמימות, בדיקת סוכר יומית'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'M20-S02',
      moduleId: 'M20',
      name: 'Medication Management',
      nameHe: 'ניהול תרופות',
      displayOrder: 2,
      isRequired: true,
      variants: [
        {
          id: 'M20-S02-V1',
          sectionId: 'M20-S02',
          name: 'Strict Adherence',
          nameHe: 'קפדנות מלאה',
          textTemplate: `ניהול תרופות למחלות כרוניות:\n\n**חובה לקחת את כל התרופות במדויק:**\n- לפי לוח הזמנים\n- במינונים מדויקים\n- ללא דילוגים\n\n**אחריות מיופה כוח:**\n- וידוא נטילת תרופות יומית\n- מילוי מרשמים במועד\n- מעקב אחר תאריכי תפוגה\n- ארגון תרופות (קופסת תרופות שבועית)\n- תיאום עם בית מרקחת\n\n**במקרה של תופעות לוואי:**\n- פנייה מיידית לרופא\n- אין להפסיק תרופה ללא אישור רפואי\n\n**רישום:**\n- רשימה מעודכנת של כל התרופות\n- שמירה במקום נגיש\n- עדכון לאחר כל שינוי`,
          fields: []
        },
        {
          id: 'M20-S02-V2',
          sectionId: 'M20-S02',
          name: 'Assisted Management',
          nameHe: 'ניהול בסיוע',
          textTemplate: `ניהול תרופות בסיוע:\n\n**מיופה כוח יסייע בניהול התרופות:**\n- הכנת תרופות מראש (קופסה שבועית)\n- תזכורות לנטילה\n- מעקב ובקרה\n- רכישת תרופות\n\n**אך:**\nהממנה אחראי לנטילה בפועל (כל עוד מסוגל).`,
          fields: []
        }
      ]
    },
    {
      id: 'M20-S03',
      moduleId: 'M20',
      name: 'Medical Monitoring',
      nameHe: 'מעקב רפואי',
      displayOrder: 3,
      isRequired: true,
      variants: [
        {
          id: 'M20-S03-V1',
          sectionId: 'M20-S03',
          name: 'Regular Monitoring',
          nameHe: 'מעקב סדיר',
          textTemplate: `מעקב רפואי שוטף:\n\n**ביקורים אצל רופאים:**\n- רופא משפחה: {{familyDoctorFrequency}}\n- מומחים: לפי צורך והמלצה{{#if specialistVisits}}\n  {{specialistVisits}}{{/if}}\n\n**בדיקות מעבדה:**\n- תדירות: {{labFrequency}}{{#if specificTests}}\n- בדיקות ספציפיות: {{specificTests}}{{/if}}\n\n**בדיקות הדמיה:**\n- לפי המלצת רופא\n\n**מדידות ביתיות:**{{#if homeMeasurements}}\n{{homeMeasurements}}{{/if}}\n\n**תיעוד:**\n- שמירת כל תוצאות בדיקות\n- תיעוד ביקורים ושינויים\n- דיווח על כל שינוי במצב`,
          fields: [
            {
              id: 'familyDoctorFrequency',
              type: 'select',
              label: 'Family Doctor Visit Frequency',
              labelHe: 'תדירות ביקור רופא משפחה',
              required: false,
              options: [
                { value: 'monthly', label: 'Monthly', labelHe: 'חודשי' },
                { value: 'bimonthly', label: 'Every 2 months', labelHe: 'אחת לחודשיים' },
                { value: 'quarterly', label: 'Quarterly', labelHe: 'רבעוני' },
                { value: 'biannual', label: 'Twice a year', labelHe: 'פעמיים בשנה' }
              ]
            },
            {
              id: 'specialistVisits',
              type: 'textarea',
              label: 'Specialist Visit Schedule',
              labelHe: 'לוח ביקורי מומחים',
              required: false,
              placeholder: 'קרדיולוג כל 6 חודשים, אנדוקרינולוג שנתי'
            },
            {
              id: 'labFrequency',
              type: 'select',
              label: 'Lab Test Frequency',
              labelHe: 'תדירות בדיקות מעבדה',
              required: false,
              options: [
                { value: 'monthly', label: 'Monthly', labelHe: 'חודשי' },
                { value: 'quarterly', label: 'Quarterly', labelHe: 'רבעוני' },
                { value: 'biannual', label: 'Twice a year', labelHe: 'פעמיים בשנה' },
                { value: 'annual', label: 'Annual', labelHe: 'שנתי' }
              ]
            },
            {
              id: 'specificTests',
              type: 'textarea',
              label: 'Specific Tests',
              labelHe: 'בדיקות ספציפיות',
              required: false,
              placeholder: 'HbA1c, תפקודי כליות, פרופיל שומנים'
            },
            {
              id: 'homeMeasurements',
              type: 'textarea',
              label: 'Home Measurements',
              labelHe: 'מדידות ביתיות',
              required: false,
              placeholder: 'מדידת לחץ דם יומית, בדיקת סוכר פעמיים ביום'
            }
          ]
        }
      ]
    },
    {
      id: 'M20-S04',
      moduleId: 'M20',
      name: 'Lifestyle Management',
      nameHe: 'ניהול אורח חיים',
      displayOrder: 4,
      isRequired: false,
      variants: [
        {
          id: 'M20-S04-V1',
          sectionId: 'M20-S04',
          name: 'Lifestyle Recommendations',
          nameHe: 'המלצות אורח חיים',
          textTemplate: `ניהול אורח חיים למחלות כרוניות:\n\n**תזונה:**\n{{dietRecommendations}}\n\n**פעילות גופנית:**\n{{exerciseRecommendations}}\n\n**הימנעויות:**\n{{avoidances}}\n\n**מעקב:**\nמיופה הכוח יעודד עמידה בהמלצות אלו תוך כיבוד רצון והעדפות.`,
          fields: [
            {
              id: 'dietRecommendations',
              type: 'textarea',
              label: 'Diet Recommendations',
              labelHe: 'המלצות תזונה',
              required: false,
              placeholder: 'דיאטה דלת נתרן, דלת סוכר, עשירה בסיבים'
            },
            {
              id: 'exerciseRecommendations',
              type: 'textarea',
              label: 'Exercise Recommendations',
              labelHe: 'המלצות פעילות',
              required: false,
              placeholder: 'הליכה 30 דקות ביום, שחייה פעמיים בשבוע'
            },
            {
              id: 'avoidances',
              type: 'textarea',
              label: 'Things to Avoid',
              labelHe: 'דברים להימנע מהם',
              required: false,
              placeholder: 'עישון, אלכוהול, מזונות עתירי שומן'
            }
          ]
        }
      ]
    }
  ]
};

