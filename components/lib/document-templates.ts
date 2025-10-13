import { DocumentStructure, ContentBlock, TemplateWithStructure, PageSettings, DocumentStyles } from './editor-types';

// הגדרות עמוד ברירת מחדל
export const defaultPageSettings: PageSettings = {
  size: 'A4',
  orientation: 'portrait',
  margins: {
    top: 2.5, // ס"מ
    right: 2,
    bottom: 2.5,
    left: 2,
  },
  pageNumbers: true,
  pageNumberPosition: 'bottom-center',
};

// סגנונות ברירת מחדל
export const defaultDocumentStyles: DocumentStyles = {
  defaultFont: 'Arial, sans-serif',
  defaultFontSize: 12,
  defaultLineHeight: 1.5,
  direction: 'rtl',
  heading1: {
    fontSize: 18,
    bold: true,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  heading2: {
    fontSize: 16,
    bold: true,
    textAlign: 'right',
    lineHeight: 1.3,
  },
  heading3: {
    fontSize: 14,
    bold: true,
    textAlign: 'right',
    lineHeight: 1.3,
  },
  heading4: {
    fontSize: 12,
    bold: true,
    underline: true,
    textAlign: 'right',
    lineHeight: 1.3,
  },
  paragraph: {
    fontSize: 12,
    textAlign: 'justify',
    lineHeight: 1.5,
  },
  legalSection: {
    fontSize: 12,
    bold: false,
    textAlign: 'justify',
    lineHeight: 1.5,
  },
};

// דוגמאות תבניות עם מבנה מסמך מלא

export const structuredTemplates: TemplateWithStructure[] = [
  {
    id: 'structured-beit-din-1',
    title: 'כתב תביעה לבית הדין - גרסה מעוצבת',
    description: 'כתב תביעה מעוצב עם טבלאות, כותרות וסעיפים',
    category: 'beit-din',
    document: {
      id: 'doc-1',
      title: 'כתב תביעה לבית הדין הרבני',
      blocks: [
        // כותרת ראשית
        {
          id: 'block-1',
          type: 'heading1',
          content: '{{court-name}}',
          style: {
            fontSize: 18,
            bold: true,
            textAlign: 'center',
            lineHeight: 1.2,
          },
        },
        // קו הפרדה
        {
          id: 'block-2',
          type: 'horizontal-rule',
          content: '',
          metadata: { marginTop: 10, marginBottom: 10 },
        },
        // כותרת משנה
        {
          id: 'block-3',
          type: 'heading2',
          content: 'כבוד הדיינים,',
          style: {
            fontSize: 14,
            bold: true,
            textAlign: 'right',
          },
          metadata: { marginBottom: 15 },
        },
        // הנדון
        {
          id: 'block-4',
          type: 'paragraph',
          content: 'הנדון: תביעה בעניין {{case-subject}}',
          style: {
            bold: true,
            textAlign: 'right',
            fontSize: 12,
          },
          metadata: { marginBottom: 20 },
        },
        // כותרת פרטי צדדים
        {
          id: 'block-5',
          type: 'heading3',
          content: 'פרטי הצדדים:',
          style: {
            fontSize: 13,
            bold: true,
            underline: true,
            textAlign: 'right',
          },
          metadata: { marginTop: 20, marginBottom: 10 },
        },
        // טבלת פרטי צדדים
        {
          id: 'block-6',
          type: 'table',
          content: {
            rows: [
              {
                id: 'row-1',
                isHeader: true,
                cells: [
                  { id: 'cell-1-1', content: 'תובע/ת', style: { bold: true, textAlign: 'center' }, backgroundColor: '#f3f4f6' },
                  { id: 'cell-1-2', content: 'נתבע/ת', style: { bold: true, textAlign: 'center' }, backgroundColor: '#f3f4f6' },
                ],
              },
              {
                id: 'row-2',
                cells: [
                  { id: 'cell-2-1', content: '{{plaintiff-name}}', style: { textAlign: 'right' } },
                  { id: 'cell-2-2', content: '{{defendant-name}}', style: { textAlign: 'right' } },
                ],
              },
              {
                id: 'row-3',
                cells: [
                  { id: 'cell-3-1', content: 'ת.ז: {{plaintiff-id}}', style: { textAlign: 'right' } },
                  { id: 'cell-3-2', content: 'ת.ז: {{defendant-id}}', style: { textAlign: 'right' } },
                ],
              },
              {
                id: 'row-4',
                cells: [
                  { id: 'cell-4-1', content: '{{plaintiff-address}}', style: { textAlign: 'right' } },
                  { id: 'cell-4-2', content: '{{defendant-address}}', style: { textAlign: 'right' } },
                ],
              },
              {
                id: 'row-5',
                cells: [
                  { id: 'cell-5-1', content: 'טל: {{plaintiff-phone}}', style: { textAlign: 'right' } },
                  { id: 'cell-5-2', content: 'טל: {{defendant-phone}}', style: { textAlign: 'right' } },
                ],
              },
            ],
            columnWidths: [50, 50],
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000000',
            cellPadding: 8,
            headerRow: true,
          },
          metadata: { marginBottom: 20 },
        },
        // סעיף 1 - רקע עובדתי
        {
          id: 'block-7',
          type: 'legal-section',
          content: '1. רקע עובדתי',
          style: {
            fontSize: 12,
            bold: true,
            underline: true,
            textAlign: 'right',
          },
          metadata: { marginTop: 20, marginBottom: 10 },
        },
        {
          id: 'block-8',
          type: 'paragraph',
          content: '{{background}}',
          style: {
            textAlign: 'justify',
            lineHeight: 1.6,
          },
          metadata: { indent: 1, marginBottom: 15 },
        },
        // סעיף 2 - עילת התביעה
        {
          id: 'block-9',
          type: 'legal-section',
          content: '2. עילת התביעה',
          style: {
            fontSize: 12,
            bold: true,
            underline: true,
            textAlign: 'right',
          },
          metadata: { marginTop: 20, marginBottom: 10 },
        },
        {
          id: 'block-10',
          type: 'paragraph',
          content: '{{cause-of-action}}',
          style: {
            textAlign: 'justify',
            lineHeight: 1.6,
          },
          metadata: { indent: 1, marginBottom: 15 },
        },
        // סעיף 3 - טיעון משפטי
        {
          id: 'block-11',
          type: 'legal-section',
          content: '3. הטיעון המשפטי',
          style: {
            fontSize: 12,
            bold: true,
            underline: true,
            textAlign: 'right',
          },
          metadata: { marginTop: 20, marginBottom: 10 },
        },
        {
          id: 'block-12',
          type: 'paragraph',
          content: '{{legal-argument}}',
          style: {
            textAlign: 'justify',
            lineHeight: 1.6,
          },
          metadata: { indent: 1, marginBottom: 15 },
        },
        // סעיף 4 - סעדים
        {
          id: 'block-13',
          type: 'legal-section',
          content: '4. הסעדים המבוקשים',
          style: {
            fontSize: 12,
            bold: true,
            underline: true,
            textAlign: 'right',
          },
          metadata: { marginTop: 20, marginBottom: 10 },
        },
        {
          id: 'block-14',
          type: 'numbered-list',
          content: {
            items: [
              { id: 'item-1', content: '{{relief-1}}', level: 0 },
              { id: 'item-2', content: '{{relief-2}}', level: 0 },
              { id: 'item-3', content: '{{relief-3}}', level: 0 },
            ],
          },
          metadata: { 
            listStyle: 'decimal',
            indent: 1,
            marginBottom: 15,
          },
        },
        // סעיף 5 - שומה
        {
          id: 'block-15',
          type: 'legal-section',
          content: '5. שומת התביעה',
          style: {
            fontSize: 12,
            bold: true,
            underline: true,
            textAlign: 'right',
          },
          metadata: { marginTop: 20, marginBottom: 10 },
        },
        {
          id: 'block-16',
          type: 'paragraph',
          content: 'סכום התביעה: {{claim-amount}} ₪',
          style: {
            bold: true,
            fontSize: 13,
            textAlign: 'right',
          },
          metadata: { indent: 1, marginBottom: 30 },
        },
        // סיכום
        {
          id: 'block-17',
          type: 'paragraph',
          content: 'לפיכך, מתבקש בית הדין הנכבד לקבל את התביעה ולחייב את הנתבע/ת בתשלום הסכומים המפורטים לעיל בצירוף הוצאות משפט ושכר טרחת עורך דין.',
          style: {
            textAlign: 'justify',
            lineHeight: 1.6,
          },
          metadata: { marginTop: 20, marginBottom: 30 },
        },
        // חתימה
        {
          id: 'block-18',
          type: 'signature-block',
          content: '{{signature-date}}\n\nבכבוד רב,\n{{plaintiff-lawyer}}\nעו"ד',
          style: {
            textAlign: 'right',
          },
          metadata: { marginTop: 40 },
        },
      ],
      pageSettings: defaultPageSettings,
      styles: defaultDocumentStyles,
      metadata: {
        author: 'המערכת',
        createdAt: '2024-10-05',
        updatedAt: '2024-10-05',
        version: '1.0',
        language: 'he',
      },
    },
    fields: [
      {
        id: 'court-name',
        label: 'שם בית הדין',
        type: 'select',
        required: true,
        options: [
          'בית הדין הרבני הגדול ירושלים',
          'בית הדין הרבני האזורי ירושלים',
          'בית הדין הרבני האזורי תל אביב',
        ],
        order: 1,
        group: 'כותרת',
      },
      {
        id: 'case-subject',
        label: 'נושא התביעה',
        type: 'text',
        required: true,
        order: 2,
        group: 'כותרת',
      },
      {
        id: 'plaintiff-name',
        label: 'שם התובע',
        type: 'text',
        required: true,
        order: 3,
        group: 'תובע',
      },
      {
        id: 'plaintiff-id',
        label: 'ת.ז תובע',
        type: 'id-number',
        required: true,
        order: 4,
        group: 'תובע',
      },
      {
        id: 'plaintiff-address',
        label: 'כתובת תובע',
        type: 'address',
        required: true,
        order: 5,
        group: 'תובע',
      },
      {
        id: 'plaintiff-phone',
        label: 'טלפון תובע',
        type: 'phone',
        required: true,
        order: 6,
        group: 'תובע',
      },
      {
        id: 'defendant-name',
        label: 'שם הנתבע',
        type: 'text',
        required: true,
        order: 7,
        group: 'נתבע',
      },
      {
        id: 'defendant-id',
        label: 'ת.ז נתבע',
        type: 'id-number',
        required: true,
        order: 8,
        group: 'נתבע',
      },
      {
        id: 'defendant-address',
        label: 'כתובת נתבע',
        type: 'address',
        required: true,
        order: 9,
        group: 'נתבע',
      },
      {
        id: 'defendant-phone',
        label: 'טלפון נתבע',
        type: 'phone',
        required: false,
        order: 10,
        group: 'נתבע',
      },
      {
        id: 'background',
        label: 'רקע עובדתי',
        type: 'textarea',
        required: true,
        order: 11,
        group: 'תוכן',
      },
      {
        id: 'cause-of-action',
        label: 'עילת התביעה',
        type: 'textarea',
        required: true,
        order: 12,
        group: 'תוכן',
      },
      {
        id: 'legal-argument',
        label: 'טיעון משפטי',
        type: 'textarea',
        required: true,
        order: 13,
        group: 'תוכן',
      },
      {
        id: 'relief-1',
        label: 'סעד ראשון',
        type: 'text',
        required: true,
        order: 14,
        group: 'סעדים',
      },
      {
        id: 'relief-2',
        label: 'סעד שני',
        type: 'text',
        required: false,
        order: 15,
        group: 'סעדים',
      },
      {
        id: 'relief-3',
        label: 'סעד שלישי',
        type: 'text',
        required: false,
        order: 16,
        group: 'סעדים',
      },
      {
        id: 'claim-amount',
        label: 'סכום התביעה',
        type: 'number',
        required: true,
        order: 17,
        group: 'סעדים',
      },
      {
        id: 'plaintiff-lawyer',
        label: 'שם עורך הדין',
        type: 'text',
        required: true,
        order: 18,
        group: 'חתימה',
      },
      {
        id: 'signature-date',
        label: 'תאריך',
        type: 'date',
        required: true,
        defaultValue: 'today',
        order: 19,
        group: 'חתימה',
      },
    ],
    tags: ['בית דין', 'תביעה', 'מעוצב', 'טבלאות'],
    version: '1.0',
    isPublic: true,
  },
];

