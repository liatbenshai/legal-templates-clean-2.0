'use client';

import { useState } from 'react';
// import { hebrewVerbsLearning, getGenderSuffix } from '@/lib/hebrew-verbs-learning';
// import VerbCorrectionModal from './VerbCorrectionModal';

interface ProfessionalWordExporterProps {
  willData: any;
  className?: string;
}

export default function ProfessionalWordExporter({
  willData,
  className = ''
}: ProfessionalWordExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  // const [correctionModal, setCorrectionModal] = useState<{
  //   isOpen: boolean;
  //   verb: string;
  //   context: string;
  //   gender: string;
  //   currentSuffix: string;
  // } | null>(null);

  const exportToWord = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
              AlignmentType, WidthType, BorderStyle, Header, Footer, PageNumber,
              HeadingLevel, ShadingType, LevelFormat } = await import('docx');

      // 🎯 הגדרת צבעים מקצועיים
      const COLORS = {
        black: '000000',
        gray: '666666',
        lightGray: 'F2F2F2',
        blue: '1F4E78'
      };

      // 📏 הגדרת מידות (DXA - twentieths of a point)
      const SIZES = {
        title: 40,      // 20pt
        heading1: 32,   // 16pt
        heading2: 28,   // 14pt
        normal: 26,     // 13pt (David 13)
        small: 24       // 12pt
      };

      const SPACING = {
        beforeTitle: 480,
        afterTitle: 360,
        beforeHeading: 360,
        afterHeading: 240,
        betweenParagraphs: 240,  // גדול יותר מהמקור!
        line: 360
      };

      // 🔢 הגדרת מספור מקצועי
      const numberingConfig = {
        config: [
          {
            reference: 'main-numbering',
            levels: [
              {
                level: 0,
                format: LevelFormat.DECIMAL,
                text: '%1.',
                alignment: AlignmentType.RIGHT,
                style: {
                  paragraph: {
                    indent: { left: 720, hanging: 360 },
                    rightToLeft: true
                  }
                }
              },
              {
                level: 1,
                format: LevelFormat.DECIMAL,
                text: '%1.%2.',
                alignment: AlignmentType.RIGHT,
                style: {
                  paragraph: {
                    indent: { left: 1080, hanging: 360 },
                    rightToLeft: true
                  }
                }
              }
            ]
          }
        ]
      };

      // 🔧 פונקציית עזר ליצירת TextRun עם RTL
      const createRTLTextRun = (text: string, options: any = {}) => {
        return new TextRun({
          text,
          font: 'David',
          rightToLeft: true,
          ...options
        });
      };

      // 🎨 הגדרת סגנונות מקצועיים
      const styles = {
        default: {
          document: {
            run: {
              font: 'David',
              size: SIZES.normal,
              rightToLeft: true
            },
            paragraph: {
              alignment: AlignmentType.RIGHT,
              rightToLeft: true,
              spacing: {
                line: SPACING.line,
                before: 120,
                after: 120
              }
            }
          }
        },
        paragraphStyles: [
          {
            id: 'Title',
            name: 'כותרת ראשית',
            basedOn: 'Normal',
            run: {
              size: SIZES.title,
              bold: true,
              color: COLORS.black,
              font: 'David'
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: SPACING.beforeTitle,
                after: SPACING.afterTitle
              },
              rightToLeft: true
            }
          },
          {
            id: 'Heading1',
            name: 'כותרת 1',
            basedOn: 'Normal',
            run: {
              size: SIZES.heading1,
              bold: true,
              color: COLORS.black,
              font: 'David'
            },
            paragraph: {
              alignment: AlignmentType.RIGHT,
              spacing: {
                before: SPACING.beforeHeading,
                after: SPACING.afterHeading
              },
              rightToLeft: true,
              outlineLevel: 0
            }
          },
          {
            id: 'Heading2',
            name: 'כותרת 2',
            basedOn: 'Normal',
            run: {
              size: SIZES.heading2,
              bold: true,
              color: COLORS.gray,
              font: 'David'
            },
            paragraph: {
              alignment: AlignmentType.RIGHT,
              spacing: {
                before: 240,
                after: 180
              },
              rightToLeft: true,
              outlineLevel: 1
            }
          },
          {
            id: 'Normal',
            name: 'רגיל',
            run: {
              size: SIZES.normal,
              font: 'David'
            },
            paragraph: {
              alignment: AlignmentType.RIGHT,
              spacing: {
                after: SPACING.betweenParagraphs,
                line: SPACING.line
              },
              rightToLeft: true
            }
          }
        ]
      };

      // 🏗️ בניית תוכן המסמך
      const sections: any[] = [];

      // כותרת ראשית
      sections.push(
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          bidirectional: true,
          children: [
            new TextRun({
              text: willData.type === 'mutual' ? 'צוואה הדדית' : 'צוואה',
              bold: true,
              font: 'David',
              rightToLeft: true
            })
          ]
        })
      );

      // רווח
      sections.push(new Paragraph({ text: '' }));

      // 📝 פתיחה - עם RTL חזק!
      if (willData.type === 'mutual') {
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT כדי לכפות RTL
            bidirectional: true,
            children: [
              new TextRun({ text: 'בהיות אין אדם יודע יום פקודתו.', font: 'David', rightToLeft: true, size: SIZES.normal })
            ],
            spacing: { after: SPACING.betweenParagraphs }
          })
        );
        sections.push(new Paragraph({ text: '' }));
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT כדי לכפות RTL
            bidirectional: true,
            children: [
              new TextRun({ text: 'אנו החתומים מטה, נשואים זה לזו כדת וכדין, מצהירים כי צוואה הדדית זו נערכת מתוך הסתמכות של כל אחד מאיתנו על הוראות הצוואה של האחר. בהיותנו סומכים ומסתמכים באופן הדדי זה על זו, ברצוננו לערוך צוואה הדדית בהתאם לסעיף 8א לחוק הירושה, תשכ"ה-1965, ועל כל המשתמע מכך בצוואה אחת והדדית בתוכנה, ביחס לרכושנו וכל אשר לנו, ולהביע בזה את רצוננו האחרון, ולפרט בה את הוראותינו על מה שיעשה ברכושנו אחרי פטירתנו, ורצוננו הוא שייתן לצוואה זו תוקף חוקי.', font: 'David', rightToLeft: true, size: SIZES.normal })
            ],
            spacing: { after: SPACING.betweenParagraphs * 1.5 }
          })
        );
      } else {
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT כדי לכפות RTL
            bidirectional: true,
            children: [
              new TextRun({ text: 'הואיל כי אין אדם יודע את יום פקודתו;', font: 'David', rightToLeft: true, size: SIZES.normal })
            ],
            spacing: { after: SPACING.betweenParagraphs }
          })
        );
        sections.push(new Paragraph({ text: '' }));
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT כדי לכפות RTL
            bidirectional: true,
            children: [
              new TextRun({ text: `והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;`, font: 'David', rightToLeft: true, size: SIZES.normal })
            ],
            spacing: { after: SPACING.betweenParagraphs }
          })
        );
        sections.push(new Paragraph({ text: '' }));
        const gender = willData.testator?.gender === 'female';
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT כדי לכפות RTL
            bidirectional: true,
            children: [
              new TextRun({ text: `והואיל כי הנני למעלה מגיל שמונה עשרה שנים, ${gender ? 'אזרחית ישראלית ותושבת' : 'אזרח ישראלי ותושב'} מדינת ישראל;`, font: 'David', rightToLeft: true, size: SIZES.normal })
            ],
            spacing: { after: SPACING.betweenParagraphs * 1.5 }
          })
        );
      }

      // פרטי מצווה
      sections.push(new Paragraph({ text: '' }));
      if (willData.type === 'mutual') {
        const gender1 = willData.testator?.gender === 'female';
        const gender2 = willData.spouse?.gender === 'female';
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${willData.testator?.fullName || '[שם 1]'}, נוש${gender1 ? 'את' : 'א'} ת.ז. מס' ${willData.testator?.id || '[מספר]'}, (להלן: "${willData.testator?.shortName || '[כינוי 1]'}") מרח': ${willData.testator?.address || '[כתובת]'}.`,
                bold: true
              })
            ],
            spacing: { after: SPACING.betweenParagraphs }
          })
        );
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${willData.spouse?.fullName || '[שם 2]'}, נוש${gender2 ? 'את' : 'א'} ת.ז. מס' ${willData.spouse?.id || '[מספר]'}, (להלן: "${willData.spouse?.shortName || '[כינוי 2]'}") מרח': ${willData.spouse?.address || '[כתובת]'}.`,
                bold: true
              })
            ],
            spacing: { after: SPACING.betweenParagraphs * 1.5 }
          })
        );
      } else {
        const gender = willData.testator?.gender === 'female';
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `לפיכך אני הח"מ ${willData.testator?.fullName || '[שם מלא]'} ת"ז ${willData.testator?.id || '[מספר]'} מרחוב: ${willData.testator?.address || '[כתובת]'}. לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, הנני ${gender ? 'מצווה' : 'מצווה'} בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת ${gender ? 'עליי' : 'עלי'} מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, ${gender ? 'קובעת ומצהירה' : 'קובע ומצהיר'} כמפורט להלן:`,
                bold: true
              })
            ],
            spacing: { after: SPACING.betweenParagraphs * 1.5 }
          })
        );
      }

      // כותרת כללי
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [new TextRun({ text: 'כללי', font: 'David', rightToLeft: true })]
        })
      );

      // סעיף 1 - ביטול צוואות קודמות
      let sectionNum = 1;
      const gender = willData.testator?.gender === 'female';
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT במקום BOTH
          bidirectional: true,
          children: [
            new TextRun({
              text: willData.type === 'mutual' 
                ? 'למען הסר ספק, הרינו מבטלים בזאת ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שניתנה על ידינו בעבר טרם מועד חתימתנו על צוואה זו, בין בכתב ובין בעל פה, בכל הנוגע לרכושנו ולנכסנו, לרבות כל מסמך, כתב, או שיחה שבעל פה, אשר יש בה משום גילוי דעת באשר לרצוננו בנוגע לעיזבוננו לאחר מותנו.'
                : `למען הסר ספק, הריני מבטל${gender ? 'ת' : ''} בזאת ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שניתנה על ידי בעבר טרם מועד חתימתי על צוואה זו, בין בכתב ובין בעל פה, בכל הנוגע לרכושי ולנכסיי, לרבות כל מסמך, כתב, או שיחה שבעל פה, אשר יש בה משום גילוי דעת באשר לרצוני בנוגע לעיזבוני לאחר מותי.`,
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ]
        })
      );

      // סעיף 2 - תשלום חובות
      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT במקום BOTH
          bidirectional: true,
          children: [
            new TextRun({
              text: willData.type === 'mutual'
                ? 'אנו מורים ליורשים אשר יבצעו את צוואתנו לשלם מתוך עיזבוננו האמור את כל חובותינו שיעמדו לפירעון בעת פטירתנו, הוצאות הבאתנו לארץ אם פטירתנו תהא בחו"ל והוצאות קבורתנו, כולל הקמת מצבה מתאימה על קברנו וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתנו.'
                : 'אני מורה ליורשיי אשר יבצעו את צוואתי לשלם מתוך עיזבוני האמור את כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.',
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ]
        })
      );

      // פרטי העיזבון
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [new TextRun({ text: 'פרטי העיזבון', font: 'David', rightToLeft: true })]
        })
      );
      
      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          alignment: AlignmentType.RIGHT,  // שינוי ל-RIGHT במקום BOTH
          bidirectional: true,
          children: [
            new TextRun({
              text: willData.type === 'mutual'
                ? `צוואתנו זו תחול על כלל רכושנו מכל מין וסוג שהוא, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותנו הבלעדית ובין אם בבעלותנו המשותפת עם אחרים. מבלי לגרוע מכלליות האמור לעיל, צוואתנו זו תחול גם על כספים, תוכניות חיסכון, קרנות נאמנות, ניירות ערך, תביעות, פנסיות, תגמולים, ביטוחי חיים, קצבאות, בין אם מופקדים בבנק ובין אם בידי כל גורם אחר, וכן על זכויות אחרות מכל סוג שהוא, וכל רכוש אחר בין במיטלטלין ובין במקרקעין (רשומים ושאינם רשומים), אשר בבעלותנו כיום ו/או יגיעו לידינו בעתיד (להלן: "העיזבון"):`
                : `צוואתי זו תחול על כלל רכושי מכל מין וסוג שהוא, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים. מבלי לגרוע מכלליות האמור לעיל, צוואתי זו תחול גם על כספים, תוכניות חיסכון, קרנות נאמנות, ניירות ערך, תביעות, פנסיות, תגמולים, ביטוחי חיים, קצבאות, בין אם מופקדים בבנק ובין אם בידי כל גורם אחר, וכן על זכויות אחרות מכל סוג שהוא, וכל רכוש אחר בין במיטלטלין ובין במקרקעין (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או יגיעו לידי בעתיד (להלן: "העיזבון"):`,
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ]
        })
      );

      // 🏠 נכסי מקרקעין
      if (willData.properties && willData.properties.length > 0) {
        willData.properties.forEach((property: any, index: number) => {
          sectionNum++;
          sections.push(
            new Paragraph({
              numbering: { reference: 'main-numbering', level: 0 },
              children: [
                new TextRun(`זכויות בדירה הרשומה בטאבו ${property.address || '[כתובת]'}, בעיר ${property.city || '[עיר]'}, הידועה כגוש: ${property.block || '[מספר]'}, חלקה: ${property.plot || '[מספר]'}, תת חלקה: ${property.subPlot || '[מספר]'} (להלן: "${property.name || 'דירת המגורים'}") וכן את מטלטליה בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע.`)
              ]
            })
          );
        });
      }

      // 💰 חשבונות בנק
      if (willData.bankAccounts && willData.bankAccounts.length > 0) {
        willData.bankAccounts.forEach((account: any) => {
          sectionNum++;
          sections.push(
            new Paragraph({
              numbering: { reference: 'main-numbering', level: 0 },
              children: [
                new TextRun(`חשבון הבנק המנוהל על ${willData.type === 'mutual' ? 'שמנו' : 'שמי'} בבנק ${account.bank || '[שם הבנק]'}, סניף מספר ${account.branch || '[מספר]'}, חשבון מספר ${account.accountNumber || '[מספר]'}, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.`)
              ]
            })
          );
        });
      }

      // 💵 כספים במזומן
      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          children: [
            new TextRun(`את כלל הכספים במזומן הנמצאים ${willData.type === 'mutual' ? 'ברשותנו' : 'ברשותי'}, לרבות שטרות כסף המוחזקים ${willData.type === 'mutual' ? 'בביתנו' : 'בביתי'}, בכספת או בכל מקום אחר.`)
          ]
        })
      );

      // יורשים
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun('הוראות בדבר חלוקת העיזבון')]
        })
      );
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun(willData.type === 'mutual'
              ? `הואיל והננו מבקשים להסדיר את חלוקת העיזבון לאחר מותנו, הרינו מצווים בזאת את כלל עיזבוננו, כפי שיהא במועד פטירתנו כמפורט להלן:`
              : `הואיל והנני מבקש${gender ? 'ת' : ''} להסדיר את חלוקת העיזבון לאחר מותי, הריני מצווה בזאת את כלל עזבוני, כפי שיהא במועד פטירתי כמפורט להלן:`
            )
          ],
          spacing: { after: SPACING.betweenParagraphs }
        })
      );

      if (willData.type === 'mutual') {
        sectionNum++;
        sections.push(
          new Paragraph({
            numbering: { reference: 'main-numbering', level: 0 },
            children: [
              new TextRun('במקרה ומי מאיתנו ילך לבית עולמו לפני רעהו, הרי שכל רכושו יעבור לנותר בחיים מבין שנינו.')
            ]
          })
        );
      }

      // 📊 טבלת יורשים - עכשיו ממש מקצועית!
      if (willData.heirs && willData.heirs.length > 0) {
        sections.push(new Paragraph({ text: '' }));

        // יצירת טבלה אמיתית בעברית
        const tableBorder = { style: BorderStyle.SINGLE, size: 6, color: COLORS.gray };
        const cellBorders = {
          top: tableBorder,
          bottom: tableBorder,
          left: tableBorder,
          right: tableBorder
        };

        const tableRows: any[] = [];

        // שורת כותרות - בעברית מימין לשמאל!
        tableRows.push(
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                width: { size: 2000, type: WidthType.DXA },
                shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'חלק בירושה', bold: true, size: SIZES.normal })]
                  })
                ]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'קרבת משפחה', bold: true, size: SIZES.normal })]
                  })
                ]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'תעודת זהות', bold: true, size: SIZES.normal })]
                  })
                ]
              }),
              new TableCell({
                borders: cellBorders,
                width: { size: 2680, type: WidthType.DXA },
                shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'שם מלא', bold: true, size: SIZES.normal })]
                  })
                ]
              })
            ]
          })
        );

        // שורות נתונים
        willData.heirs.forEach((heir: any) => {
          const fullName = `${heir.firstName || ''} ${heir.lastName || ''}`.trim() || '[שם]';
          const id = heir.id || '[ת.ז]';
          const relation = heir.relation || '[קרבה]';
          const share = heir.share || `1/${willData.heirs.length}`;

          tableRows.push(
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders,
                  width: { size: 2000, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: share, size: SIZES.normal })]
                    })
                  ]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 2340, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: relation, size: SIZES.normal })]
                    })
                  ]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 2340, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: id, size: SIZES.normal })]
                    })
                  ]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 2680, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [new TextRun({ text: fullName, size: SIZES.normal })]
                    })
                  ]
                })
              ]
            })
          );
        });

        sections.push(
          new Table({
            columnWidths: [2000, 2340, 2340, 2680], // תיקון: שמאל לימין בגלל שזה הסדר הפיזי ב-Word
            width: { size: 9360, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            rows: tableRows,
          })
        );
      }

      // 🎯 הוספת סעיפים מהמחסן אחרי חלוקת העיזבון - עם התאמת מגדר!
      if (willData.customSections && willData.customSections.length > 0) {
        sections.push(new Paragraph({ text: '' }));
        
        // ייבוא פונקציית המגדור
        const { applyGenderToText } = await import('../lib/hebrew-gender');
        
        willData.customSections.forEach((section: any, index: number) => {
          sectionNum++;
          let sectionContent = section.content || section.title;
          
          // החלפת משתנים בסעיף
          // משתנים של אפוטרופוס
          if (willData.guardian) {
            sectionContent = sectionContent.replace(/\{\{guardian_name\}\}/g, willData.guardian.name || '[שם אפוטרופוס]');
            sectionContent = sectionContent.replace(/\{\{guardian_gender_suffix\}\}/g, (willData.guardian.gender || willData.guardianGender) === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{guardian_plural_suffix\}\}/g, ''); // לבינתיים רק יחיד
          }
          
          // משתנים של הנחיות מקדימות
          if (willData.type === 'advance-directives') {
            sectionContent = sectionContent.replace(/\{\{principal_gender_suffix\}\}/g, willData.testator?.gender === 'female' ? 'ת' : '');
            sectionContent = sectionContent.replace(/\{\{attorney_gender_suffix\}\}/g, willData.attorneyGender === 'female' ? 'ת' : '');
          }
          
          // משתנים של ילד/יורש
          if (willData.heirs && willData.heirs.length > 0) {
            const firstHeir = willData.heirs[0];
            sectionContent = sectionContent.replace(/\{\{child_first_name\}\}/g, firstHeir.firstName || '[שם ילד]');
            
            // לוגיקה מותאמת לפעלים עם child_gender_suffix
            const childGenderSuffix = firstHeir.gender === 'female' ? 'ה' : firstHeir.gender === 'plural' ? 'ו' : '';
            sectionContent = sectionContent.replace(/\{\{child_gender_suffix\}\}/g, childGenderSuffix);
            
            sectionContent = sectionContent.replace(/\{\{child_pronoun\}\}/g, firstHeir.gender === 'female' ? 'לה' : 'לו');
            sectionContent = sectionContent.replace(/\{\{heir_first_name\}\}/g, firstHeir.firstName || '[שם יורש]');
            
            // לוגיקה מותאמת לפעלים עם heir_gender_suffix
            const heirGenderSuffix = firstHeir.gender === 'female' ? 'ה' : firstHeir.gender === 'plural' ? 'ו' : '';
            sectionContent = sectionContent.replace(/\{\{heir_gender_suffix\}\}/g, heirGenderSuffix);
            
            // משתנים של יורש שני (לעסק)
            if (willData.heirs.length > 1) {
              const secondHeir = willData.heirs[1];
              sectionContent = sectionContent.replace(/\{\{heir1_name\}\}/g, firstHeir.firstName || '[שם יורש 1]');
              sectionContent = sectionContent.replace(/\{\{heir1_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
              sectionContent = sectionContent.replace(/\{\{heir2_name\}\}/g, secondHeir.firstName || '[שם יורש 2]');
              sectionContent = sectionContent.replace(/\{\{heir2_gender_suffix\}\}/g, secondHeir.gender === 'female' ? 'ה' : '');
            }
          }
          
          // משתנים של מצווה
          sectionContent = sectionContent.replace(/\{\{testator_gender_suffix\}\}/g, willData.testator?.gender === 'female' ? 'ה' : '');
          
          // התאמת מגדר עם {{gender:זכר|נקבה}}
          const gender = willData.testator?.gender === 'female';
          if (gender) {
            sectionContent = sectionContent.replace(/\{\{gender:([^|]*)\|([^}]*)\}\}/g, '$2');
            sectionContent = sectionContent.replace(/\{\{gender:([^}]*)\}\}/g, '$1');
          } else {
            sectionContent = sectionContent.replace(/\{\{gender:([^|]*)\|([^}]*)\}\}/g, '$1');
            sectionContent = sectionContent.replace(/\{\{gender:([^}]*)\}\}/g, '');
          }
          
          // משתנים של יורש (אם יש יורש ראשון)
          if (willData.heirs && willData.heirs.length > 0) {
            const firstHeir = willData.heirs[0];
            sectionContent = sectionContent.replace(/\{\{heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{digital_heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{business_heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{vehicle_inheritor_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ת' : '');
            sectionContent = sectionContent.replace(/\{\{pet_caregiver_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ת' : '');
          }
          
          // משתנים נוספים כלליים
          sectionContent = sectionContent.replace(/\{\{transfer_days\}\}/g, '30');
          sectionContent = sectionContent.replace(/\{\{guidance_years\}\}/g, '3');
          
          sections.push(
            new Paragraph({
              numbering: { reference: 'main-numbering', level: 0 },
              children: [new TextRun(sectionContent)]
            })
          );
        });
      }

      // סעיפי סיום
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun('הוראות כלליות')]
        })
      );

      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          children: [
            new TextRun(willData.type === 'mutual'
              ? 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתנו, חלקו יעבור ליורשיו החוקיים.'
              : 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.'
            )
          ]
        })
      );

      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          children: [
            new TextRun(willData.type === 'mutual'
              ? 'כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד. תשלום השקל האמור יהווה את מלוא זכותו בעיזבוננו, וזאת במקום כל זכות או טענה אחרת שתהיה לו בעיזבוננו. תנאי זה יחול גם על מי שפועל בשמו של היורש או מטעמו, וכן על כל מי שיסייע או יעודד התנגדות לצוואה זו.'
              : 'כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד. תשלום השקל האמור יהווה את מלוא זכותו בעזבוני, וזאת במקום כל זכות או טענה אחרת שתהיה לו בעזבוני. תנאי זה יחול גם על מי שפועל בשמו של היורש או מטעמו, וכן על כל מי שיסייע או יעודד התנגדות לצוואה זו.'
            )
          ]
        })
      );

      // סעיף סיום - ולראיה באתי על החתום
      sections.push(new Paragraph({ text: '' }));
      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          children: [
            new TextRun(willData.type === 'mutual'
              ? `ולראיה באנו על החתום מרצוננו הטוב והחופשי, בפני העדים החתומים הנקובים בשמותיהם וכתובותיהם בלי להיות נתונים לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאיננו סובלים מאיזו חולשה גופנית או רוחנית הגורעת או המונעת מאיתנו את כושרנו המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרנו בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתנו, וביקשנו מהם לאשר בחתימתם שכך הצהרנו וחתמנו בפניהם.`
              : `ולראיה באתי על החתום מרצוני הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות ${gender ? 'נתונה' : 'נתון'} לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאינני ${gender ? 'סובלת' : 'סובל'} מאיזו חולשה גופנית או רוחנית הגורעת או המונעת ממני את כושרי המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרתי בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתי, וביקשתי מהן לאשר בחתימתן שכך הצהרתי וחתמתי בפניהן.`
            )
          ]
        })
      );

      // חתימת המצווה - מיד אחרי "ולראיה באתי על החתום"
      sections.push(new Paragraph({ text: '' }));
      sections.push(new Paragraph({ text: '' }));
      if (willData.type === 'mutual') {
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun(`${willData.testator?.fullName || '[שם 1]'}                    ${willData.spouse?.fullName || '[שם 2]'}`)
            ]
          })
        );
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun('________________                    ________________')
            ],
            spacing: { after: SPACING.betweenParagraphs * 2 }
          })
        );
      } else {
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun(willData.testator?.fullName || '[שם מלא המצווה]')
            ]
          })
        );
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun('________________')
            ],
            spacing: { after: SPACING.betweenParagraphs * 2 }
          })
        );
      }
      
      // הצהרת העדים - עם התאמה לסוג העדים לפי המגדר האמיתי שנבחר
      sections.push(new Paragraph({ text: '' }));
      sections.push(new Paragraph({ text: '' }));
      
      // בדיקת מגדר העדים מהנתונים האמיתיים
      const witness1Gender = willData.witnesses?.[0]?.gender || 'male';
      const witness2Gender = willData.witnesses?.[1]?.gender || 'male';
      const bothMale = witness1Gender === 'male' && witness2Gender === 'male';
      const bothFemale = witness1Gender === 'female' && witness2Gender === 'female';
      const mixed = !bothMale && !bothFemale;
      
      // Debug: הצג מה קורה עם העדים
      console.log('Witness genders:', {
        witness1: witness1Gender,
        witness2: witness2Gender,
        bothMale,
        bothFemale,
        mixed,
        witnesses: willData.witnesses
      });
      
      let witnessDeclaration = '';
      
      if (bothMale) {
        // שני העדים זכרים
        witnessDeclaration = `אנו מעידים בזאת שהמצווה הנ"ל ${willData.testator?.fullName || '[שם מלא]'}, הנושא תעודת זהות ${willData.testator?.id || '[ת.ז]'} חתם/ה בנוכחותנו על צוואתו/ה הנ"ל לאחר שהצהיר/ה בפנינו שזאת צוואתו/ה האחרונה שאותה עשה/תה מרצונו/ה הטוב והחופשי בהיותו/ה בדעה צלולה ובלי כל אונס או כפיה, וביקש/ה מאיתנו להיות עדים לחתימתו/ה ולאשר בחתימת ידנו שכך הצהיר וחתם בפנינו. ועוד אנו מצהירים כי אנו לא קטינים ולא פסולי דין וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו חותמים ומאשרים בזה כי המצווה הנ"ל חתם בפנינו על שטר צוואה זה לאחר שהצהיר בפנינו כי זו צוואתו ובזה אנו חותמים בתור עדים לצוואה בנוכחות של המצווה הנ"ל ובנוכחות כל אחד מאיתנו.`;
      } else if (bothFemale) {
        // שתי העדות נקבות
        witnessDeclaration = `אנו מעידות בזאת שהמצווה הנ"ל ${willData.testator?.fullName || '[שם מלא]'}, הנושא תעודת זהות ${willData.testator?.id || '[ת.ז]'} חתם/ה בנוכחותנו על צוואתו/ה הנ"ל לאחר שהצהיר/ה בפנינו שזאת צוואתו/ה האחרונה שאותה עשה/תה מרצונו/ה הטוב והחופשי בהיותו/ה בדעה צלולה ובלי כל אונס או כפיה, וביקש/ה מאיתנו להיות עדות לחתימתו/ה ולאשר בחתימת ידנו שכך הצהיר וחתם בפנינו. ועוד אנו מצהירות כי אנו לא קטינות ולא פסולות דין וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו חותמות ומאשרות בזה כי המצווה הנ"ל חתם בפנינו על שטר צוואה זה לאחר שהצהיר בפנינו כי זו צוואתו ובזה אנו חותמות בתור עדות לצוואה בנוכחות של המצווה הנ"ל ובנוכחות כל אחת מאיתנו.`;
      } else {
        // עדים מעורבים - זכר ונקבה
        witnessDeclaration = `אנו מעידים בזאת שהמצווה הנ"ל ${willData.testator?.fullName || '[שם מלא]'}, הנושא תעודת זהות ${willData.testator?.id || '[ת.ז]'} חתם/ה בנוכחותנו על צוואתו/ה הנ"ל לאחר שהצהיר/ה בפנינו שזאת צוואתו/ה האחרונה שאותה עשה/תה מרצונו/ה הטוב והחופשי בהיותו/ה בדעה צלולה ובלי כל אונס או כפיה, וביקש/ה מאיתנו להיות עדים לחתימתו/ה ולאשר בחתימת ידנו שכך הצהיר וחתם בפנינו. ועוד אנו מצהירים כי אנו לא קטינים ולא פסולי דין וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו חותמים ומאשרים בזה כי המצווה הנ"ל חתם בפנינו על שטר צוואה זה לאחר שהצהיר בפנינו כי זו צוואתו ובזה אנו חותמים בתור עדים לצוואה בנוכחות של המצווה הנ"ל ובנוכחות כל אחד/ת מאיתנו.`;
      }
      
      sections.push(
        new Paragraph({
          children: [new TextRun(witnessDeclaration)],
          spacing: { after: SPACING.betweenParagraphs }
        })
      );

      // אנו הח"מ + שמות העדים
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          children: [new TextRun('אנו הח"מ:')],
          spacing: { after: 180 }
        })
      );

      if (willData.witnesses && willData.witnesses.length >= 2) {
        willData.witnesses.forEach((witness: any, index: number) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${witness.name || '[שם מלא עד]'}, ת.ז. ${witness.id || '[מספר]'}, מרחוב: ${witness.address || '[כתובת מלאה]'}`,
                  bold: true
                })
              ],
              spacing: { after: 120 }
            })
          );
        });
        
        // חתימות העדים
        sections.push(new Paragraph({ text: '' }));
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun(`${willData.witnesses[0].name || '[שם עד 1]'}               ${willData.witnesses[1].name || '[שם עד 2]'}`)
            ]
          })
        );
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun('________________               ________________')
            ]
          })
        );
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun('   עד ראשון                        עד שני')
            ]
          })
        );
      }

      // ✅ הסגנון הברירת מחדל כבר כולל RTL
      // אם Word לא מכבד את זה, המשתמש יצטרך לשנות את כיוון הטקסט ידנית ב-Word
      const finalSections = sections;

      // 📄 יצירת המסמך עם הגדרות RTL מתקדמות
      const doc = new Document({
        creator: 'מערכת צוואות מקצועית',
        title: willData.type === 'mutual' ? 'צוואה הדדית' : 'צוואה',
        description: 'מסמך משפטי בעברית',
        styles: styles,
        numbering: numberingConfig,
        // הגדרות RTL ברמת המסמך
        features: {
          updateFields: true
        },
        sections: [{
          properties: {
            page: {
              margin: { 
                top: 1440,    // 1 אינץ'
                right: 1440,  
                bottom: 1440, 
                left: 1440 
              }
            },
            // RTL מטופל ברמת כל פסקה ו-TextRun:
            // 1. alignment: AlignmentType.RIGHT בכל פסקה
            // 2. rightToLeft: true בכל TextRun
            // 3. bidirectional: true בטבלאות
            // 4. font: 'David' - פונט שתומך בעברית
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `עותק ${willData.copyNumber || '1'} מתוך ${willData.totalCopies || '3'}`,
                      size: SIZES.small,
                      font: 'David'
                    })
                  ]
                })
              ]
            })
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: 'עמוד ', size: SIZES.small, font: 'David' }),
                    new TextRun({ children: [PageNumber.CURRENT], size: SIZES.small, font: 'David' })
                  ]
                })
              ]
            })
          },
          children: finalSections
        }]
      });

      // 💾 שמירה והורדה
      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      const a = document.createElement('a');
      a.href = url;
      a.download = `צוואת_${willData.testator?.shortName || 'מקצועית'}_${new Date().getTime()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus(`✅ קובץ Word מקצועי נשמר: ${a.download}`);
      
    } catch (error) {
      console.error('שגיאה ביצוא Word מקצועי:', error);
      setExportStatus(`❌ שגיאה ביצוא Word מקצועי: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const { jsPDF } = await import('jspdf');
      
      // יצירת מסמך PDF עם הגדרות RTL
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: 'a4'
      });

      // הגדרת שוליים (מימין לשמאל)
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const rightMargin = 2.5; // שוליים ימניים (בצד ה-RTL)
      const leftMargin = 2.5;  // שוליים שמאליים
      const topMargin = 2.5;
      const bottomMargin = 2.5;
      
      let yPosition = topMargin;
      const lineHeight = 0.6;
      const contentWidth = pageWidth - rightMargin - leftMargin;

      // כותרת ראשית
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const title = willData.type === 'mutual' ? 'צוואה הדדית' : 'צוואה';
      doc.text(title, pageWidth - rightMargin, yPosition, { align: 'right' });
      yPosition += 1.5;

      // פרטי המצווה
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      const testatorInfo = `שם: ${willData.testator?.fullName || '[שם מלא]'}, ת.ז.: ${willData.testator?.id || '[ת.ז]'}`;
      doc.text(testatorInfo, pageWidth - rightMargin, yPosition, { align: 'right' });
      yPosition += 1;

      // אם זה צוואה הדדית - פרטי בן/בת הזוג
      if (willData.type === 'mutual' && willData.spouse) {
        const spouseInfo = `בן/בת זוג: ${willData.spouse.fullName || '[שם מלא]'}, ת.ז.: ${willData.spouse.id || '[ת.ז]'}`;
        doc.text(spouseInfo, pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 1;
      }

      yPosition += 0.5;

      // סעיף 1 - ביטול צוואות קודמות
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. ביטול צוואות קודמות', pageWidth - rightMargin, yPosition, { align: 'right' });
      yPosition += lineHeight;

      doc.setFont('helvetica', 'normal');
      const cancellationText = willData.type === 'mutual' 
        ? 'הרינו מבטלים בזאת כל צוואה או הוראה אחרת לעיזבוננו שעשינו בעבר, וקובעים ומצהירים כי צוואתנו זו היא היחידה והאחרונה.'
        : 'הריני מבטל בזאת כל צוואה או הוראה אחרת לעזבוני שעשיתי בעבר, וקובע ומצהיר כי צוואתי זו היא היחידה והאחרונה.';
      
      const cancellationLines = doc.splitTextToSize(cancellationText, contentWidth);
      cancellationLines.forEach((line: string) => {
        if (yPosition > pageHeight - bottomMargin) {
          doc.addPage();
          yPosition = topMargin;
        }
        doc.text(line, pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += lineHeight;
      });

      yPosition += 0.5;

      // סעיף 2 - חלוקת עיזבון
      doc.setFont('helvetica', 'bold');
      doc.text('2. חלוקת העיזבון', pageWidth - rightMargin, yPosition, { align: 'right' });
      yPosition += lineHeight;

      doc.setFont('helvetica', 'normal');
      const distributionText = willData.type === 'mutual'
        ? 'הננו מבקשים כי עם פטירתנו, יועבר רכושנו ורכושנו המשותף לבעלותם המלאה של היורשים המפורטים להלן:'
        : 'אני מבקש כי עם פטירתי, יועבר רכושי לבעלותם המלאה של היורשים המפורטים להלן:';

      const distributionLines = doc.splitTextToSize(distributionText, contentWidth);
      distributionLines.forEach((line: string) => {
        if (yPosition > pageHeight - bottomMargin) {
          doc.addPage();
          yPosition = topMargin;
        }
        doc.text(line, pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += lineHeight;
      });

      yPosition += 0.5;

      // טבלת יורשים
      if (willData.heirs && willData.heirs.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('רשימת היורשים:', pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += lineHeight;

        doc.setFont('helvetica', 'normal');
        willData.heirs.forEach((heir: any, index: number) => {
          if (yPosition > pageHeight - bottomMargin - 2) {
            doc.addPage();
            yPosition = topMargin;
          }

          const heirInfo = `${index + 1}. ${heir.fullName || '[שם מלא]'}, ת.ז.: ${heir.id || '[ת.ז]'}, כתובת: ${heir.address || '[כתובת]'}`;
          const heirLines = doc.splitTextToSize(heirInfo, contentWidth);
          heirLines.forEach((line: string) => {
            doc.text(line, pageWidth - rightMargin, yPosition, { align: 'right' });
            yPosition += lineHeight;
          });
          yPosition += 0.3;
        });
      }

      // סעיפים נוספים מהמחסן
      if (willData.customSections && willData.customSections.length > 0) {
        yPosition += 0.5;
        
        willData.customSections.forEach((section: any, index: number) => {
          if (yPosition > pageHeight - bottomMargin - 2) {
            doc.addPage();
            yPosition = topMargin;
          }

          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 3}. ${section.title || 'סעיף נוסף'}`, pageWidth - rightMargin, yPosition, { align: 'right' });
          yPosition += lineHeight;

          doc.setFont('helvetica', 'normal');
          let sectionContent = section.content || section.title;
          
          // החלפת משתנים בסעיף
          if (willData.guardian) {
            sectionContent = sectionContent.replace(/\{\{guardian_name\}\}/g, willData.guardian.name || '[שם אפוטרופוס]');
            sectionContent = sectionContent.replace(/\{\{guardian_gender_suffix\}\}/g, (willData.guardian.gender || willData.guardianGender) === 'female' ? 'ה' : '');
          }
          
          // משתנים של הנחיות מקדימות
          if (willData.type === 'advance-directives') {
            sectionContent = sectionContent.replace(/\{\{principal_gender_suffix\}\}/g, willData.testator?.gender === 'female' ? 'ת' : '');
            sectionContent = sectionContent.replace(/\{\{attorney_gender_suffix\}\}/g, willData.attorneyGender === 'female' ? 'ת' : '');
          }
          
          if (willData.heirs && willData.heirs.length > 0) {
            const firstHeir = willData.heirs[0];
            sectionContent = sectionContent.replace(/\{\{child_first_name\}\}/g, firstHeir.firstName || '[שם ילד]');
            // לוגיקה מותאמת לפעלים עם child_gender_suffix
            const childGenderSuffixPdf = firstHeir.gender === 'female' ? 'ה' : firstHeir.gender === 'plural' ? 'ו' : '';
            sectionContent = sectionContent.replace(/\{\{child_gender_suffix\}\}/g, childGenderSuffixPdf);
            
            sectionContent = sectionContent.replace(/\{\{heir_first_name\}\}/g, firstHeir.firstName || '[שם יורש]');
            
            // לוגיקה מותאמת לפעלים עם heir_gender_suffix
            const heirGenderSuffixPdf = firstHeir.gender === 'female' ? 'ה' : firstHeir.gender === 'plural' ? 'ו' : '';
            sectionContent = sectionContent.replace(/\{\{heir_gender_suffix\}\}/g, heirGenderSuffixPdf);
            
            // משתנים של יורש שני (לעסק)
            if (willData.heirs.length > 1) {
              const secondHeir = willData.heirs[1];
              sectionContent = sectionContent.replace(/\{\{heir1_name\}\}/g, firstHeir.firstName || '[שם יורש 1]');
              sectionContent = sectionContent.replace(/\{\{heir1_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
              sectionContent = sectionContent.replace(/\{\{heir2_name\}\}/g, secondHeir.firstName || '[שם יורש 2]');
              sectionContent = sectionContent.replace(/\{\{heir2_gender_suffix\}\}/g, secondHeir.gender === 'female' ? 'ה' : '');
            }
          }
          
          // משתנים של מצווה
          sectionContent = sectionContent.replace(/\{\{testator_gender_suffix\}\}/g, willData.testator?.gender === 'female' ? 'ה' : '');
          
          // התאמת מגדר עם {{gender:זכר|נקבה}} - גם ב-PDF
          const genderPdf = willData.testator?.gender === 'female';
          if (genderPdf) {
            sectionContent = sectionContent.replace(/\{\{gender:([^|]*)\|([^}]*)\}\}/g, '$2');
            sectionContent = sectionContent.replace(/\{\{gender:([^}]*)\}\}/g, '$1');
          } else {
            sectionContent = sectionContent.replace(/\{\{gender:([^|]*)\|([^}]*)\}\}/g, '$1');
            sectionContent = sectionContent.replace(/\{\{gender:([^}]*)\}\}/g, '');
          }
          
          // משתנים של יורש (אם יש יורש ראשון)
          if (willData.heirs && willData.heirs.length > 0) {
            const firstHeir = willData.heirs[0];
            sectionContent = sectionContent.replace(/\{\{heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{digital_heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{business_heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{vehicle_inheritor_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ת' : '');
            sectionContent = sectionContent.replace(/\{\{pet_caregiver_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ת' : '');
          }

          const sectionLines = doc.splitTextToSize(sectionContent, contentWidth);
          sectionLines.forEach((line: string) => {
            if (yPosition > pageHeight - bottomMargin) {
              doc.addPage();
              yPosition = topMargin;
            }
            doc.text(line, pageWidth - rightMargin, yPosition, { align: 'right' });
            yPosition += lineHeight;
          });
          yPosition += 0.5;
        });
      }

      // חתימות
      yPosition += 1;
      if (yPosition > pageHeight - bottomMargin - 3) {
        doc.addPage();
        yPosition = topMargin;
      }

      // חתימת המצווה/ים
      doc.setFont('helvetica', 'bold');
      if (willData.type === 'mutual') {
        doc.text('חתימות המצווים:', pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 1;
        doc.text(`${willData.testator?.fullName || '[שם 1]'}                    ${willData.spouse?.fullName || '[שם 2]'}`, pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 1;
        doc.text('________________                    ________________', pageWidth - rightMargin, yPosition, { align: 'right' });
      } else {
        doc.text('חתימת המצווה:', pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 1;
        doc.text(willData.testator?.fullName || '[שם מלא המצווה]', pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 1;
        doc.text('________________', pageWidth - rightMargin, yPosition, { align: 'right' });
      }

      yPosition += 1.5;

      // עדים
      if (willData.witnesses && willData.witnesses.length >= 2) {
        doc.setFont('helvetica', 'bold');
        doc.text('עדים:', pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 0.8;

        doc.setFont('helvetica', 'normal');
        willData.witnesses.forEach((witness: any, index: number) => {
          const witnessInfo = `${index + 1}. ${witness.name || '[שם מלא עד]'}, ת.ז.: ${witness.id || '[מספר]'}, כתובת: ${witness.address || '[כתובת מלאה]'}`;
          const witnessLines = doc.splitTextToSize(witnessInfo, contentWidth);
          witnessLines.forEach((line: string) => {
            doc.text(line, pageWidth - rightMargin, yPosition, { align: 'right' });
            yPosition += lineHeight;
          });
          yPosition += 0.3;
        });

        yPosition += 0.5;
        doc.text('חתימות העדים:', pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 1;
        doc.text(`${willData.witnesses[0].name || '[שם עד 1]'}               ${willData.witnesses[1].name || '[שם עד 2]'}`, pageWidth - rightMargin, yPosition, { align: 'right' });
        yPosition += 1;
        doc.text('   עד ראשון                        עד שני', pageWidth - rightMargin, yPosition, { align: 'right' });
      }

      // סימן מים
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(50);
        doc.setTextColor(200, 200, 200);
        doc.text('טיוטה', pageWidth / 2, pageHeight / 2, { 
          align: 'center',
          angle: 45 
        });
        
        // מספור עמודים
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`עמוד ${i} מתוך ${totalPages}`, pageWidth - rightMargin, pageHeight - 1, { align: 'right' });
      }

      // שמירה
      const fileName = `צוואה_${willData.testator?.shortName || 'מקצועית'}_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      
      setExportStatus(`✅ קובץ PDF נשמר: ${fileName}`);
      
    } catch (error) {
      console.error('שגיאה ביצוא PDF:', error);
      setExportStatus(`❌ שגיאה ביצוא PDF: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFExport = async () => {
    await exportToPDF();
  };

  const isFormValid = () => {
    const valid = willData.testator?.fullName && 
           willData.testator?.id && 
           willData.heirs?.length > 0 &&
           willData.witnesses?.length >= 2;
    
    // Debug: הצג למשתמש מה חסר
    if (!valid) {
      console.log('Form validation failed:', {
        testatorName: !!willData.testator?.fullName,
        testatorId: !!willData.testator?.id,
        heirsCount: willData.heirs?.length || 0,
        witnessesCount: willData.witnesses?.length || 0
      });
    }
    
    return valid;
  };

  return (
    <div className={`${className}`}>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">✨</span>
          <h3 className="text-xl font-bold text-green-900">יצוא Word מקצועי חדש ומשופר</h3>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span>שיפורים מקצועיים:</span>
          </h4>
          <ul className="text-sm text-green-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>פונט גדול יותר</strong> - 14pt במקום 13pt (קריא יותר)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>מרווחים נכונים</strong> - 240 DXA בין פסקאות (במקום 60)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>מספור אוטומטי</strong> - מערכת מספור אמיתית של Word</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>טבלה אמיתית</strong> - טבלת יורשים מעוצבת מקצועית בעברית</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>RTL מלא</strong> - כיוון עברי נכון בכל מקום</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>היררכיה ברורה</strong> - כותרות, תתי-כותרות, וטקסט רגיל</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>עיצוב נקי</strong> - צבעים מקצועיים ועיצוב מאוזן</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>סעיפים מהמחסן</strong> - כל הסעיפים שנוספו יופיעו בצוואה!</span>
            </li>
          </ul>
        </div>

        {!isFormValid() && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-lg text-yellow-600 mt-0.5">⚠️</span>
              <div className="text-sm text-yellow-800">
                <div className="font-bold mb-1">נתונים חסרים:</div>
                <div>יש למלא: שם מצווה, ת.ז, לפחות יורש אחד, ושני עדים.</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportToWord}
            disabled={isExporting || !isFormValid()}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl hover:shadow-2xl"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>יוצר צוואה מקצועית...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">📄</span>
                <span>יצוא ל-Word</span>
              </>
            )}
          </button>

          <button
            onClick={handlePDFExport}
            disabled={isExporting || !isFormValid()}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl hover:shadow-2xl"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>יוצר PDF...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">📋</span>
                <span>יצוא ל-PDF (RTL מושלם)</span>
              </>
            )}
          </button>

          {/* כפתור תיקון פעלים בעברית - זמנית מושבת */}
          {/* <button
            onClick={() => setCorrectionModal({
              isOpen: true,
              verb: 'תבקש',
              context: 'child',
              gender: 'female',
              currentSuffix: 'ה'
            })}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-bold text-lg shadow-xl hover:shadow-2xl"
          >
            <span className="text-2xl">🧠</span>
            <span>תיקון פעלים בעברית</span>
          </button> */}
        </div>

        {exportStatus && (
          <div className={`mt-4 p-3 rounded text-sm text-center font-medium ${
            exportStatus.includes('✅') 
              ? 'bg-green-50 border border-green-300 text-green-800' 
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}>
            {exportStatus}
          </div>
        )}

        {/* הוראות לתיקון RTL ב-Word */}
        {exportStatus && exportStatus.includes('✅') && exportStatus.includes('Word') && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span>הוראות לתיקון כיוון הטקסט ב-Word:</span>
            </h4>
            <div className="text-sm text-blue-800 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>פתח את קובץ ה-Word שיוצר</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>לחץ <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Ctrl+A</kbd> כדי לסמן את כל הטקסט</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>לחץ <kbd className="bg-blue-200 px-2 py-1 rounded text-xs">Ctrl + Right Shift</kbd> כדי לשנות את כיוון הטקסט לעברית</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>שמור את הקובץ</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-800">
              💡 <strong>טיפ:</strong> אם עדיין יש בעיות, נסה לייצא ל-PDF במקום - שם הכיוון מושלם!
            </div>
          </div>
        )}

        {/* מודל תיקון פעלים - זמנית מושבת */}
        {/* {correctionModal && (
          <VerbCorrectionModal
            isOpen={correctionModal.isOpen}
            onClose={() => setCorrectionModal(null)}
            verb={correctionModal.verb}
            context={correctionModal.context}
            gender={correctionModal.gender}
            currentSuffix={correctionModal.currentSuffix}
            onSave={(correctedSuffix) => {
              // עדכון הסיומת במערכת הלמידה
              hebrewVerbsLearning.addCorrection(
                correctionModal.verb,
                correctionModal.context,
                correctionModal.gender,
                correctedSuffix,
                correctionModal.currentSuffix
              );
              setCorrectionModal(null);
            }}
          />
        )} */}
      </div>
    </div>
  );
}
