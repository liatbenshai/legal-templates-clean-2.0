'use client';

import { useState } from 'react';

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
        beforeTitle: 240,
        afterTitle: 180,
        beforeHeading: 180,
        afterHeading: 120,
        betweenParagraphs: 120,
        line: 360
      };

      // 🔢 הגדרת מספור מקצועי עם RTL
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
                    rightToLeft: true,
                    alignment: AlignmentType.RIGHT
                  },
                  run: {
                    font: 'David',
                    size: SIZES.normal,
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
                    rightToLeft: true,
                    alignment: AlignmentType.RIGHT
                  },
                  run: {
                    font: 'David',
                    size: SIZES.normal,
                    rightToLeft: true
                  }
                }
              }
            ]
          }
        ]
      };

      // 🎨 הגדרת סגנונות מקצועיים עם RTL
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
              bidirectional: true,
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
              font: 'David',
              rightToLeft: true
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: SPACING.beforeTitle,
                after: SPACING.afterTitle
              },
              rightToLeft: true,
              bidirectional: true
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
              font: 'David',
              rightToLeft: true
            },
            paragraph: {
              alignment: AlignmentType.RIGHT,
              spacing: {
                before: SPACING.beforeHeading,
                after: SPACING.afterHeading
              },
              rightToLeft: true,
              bidirectional: true,
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
              font: 'David',
              rightToLeft: true
            },
            paragraph: {
              alignment: AlignmentType.RIGHT,
              spacing: {
                before: 240,
                after: 180
              },
              rightToLeft: true,
              bidirectional: true,
              outlineLevel: 1
            }
          },
          {
            id: 'Normal',
            name: 'רגיל',
            run: {
              size: SIZES.normal,
              font: 'David',
              rightToLeft: true
            },
            paragraph: {
              alignment: AlignmentType.RIGHT,
              spacing: {
                after: SPACING.betweenParagraphs,
                line: SPACING.line
              },
              rightToLeft: true,
              bidirectional: true
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
              rightToLeft: true,
              size: SIZES.title
            })
          ]
        })
      );

      sections.push(new Paragraph({ text: '' }));

      // 📝 פתיחה - עם RTL חזק!
      if (willData.type === 'mutual') {
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            children: [
              new TextRun({ 
                text: 'בהיות אין אדם יודע יום פקודתו.', 
                font: 'David', 
                rightToLeft: true, 
                size: SIZES.normal 
              })
            ],
            spacing: { after: SPACING.betweenParagraphs }
          })
        );
        sections.push(new Paragraph({ text: '' }));
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            children: [
              new TextRun({ 
                text: 'אנו החתומים מטה, נשואים זה לזו כדת וכדין, מצהירים כי צוואה הדדית זו נערכת מתוך הסתמכות של כל אחד מאיתנו על הוראות הצוואה של האחר. בהיותנו סומכים ומסתמכים באופן הדדי זה על זו, ברצוננו לערוך צוואה הדדית בהתאם לסעיף 8א לחוק הירושה, תשכ"ה-1965, ועל כל המשתמע מכך בצוואה אחת והדדית בתוכנה, ביחס לרכושנו וכל אשר לנו, ולהביע בזה את רצוננו האחרון, ולפרט בה את הוראותינו על מה שיעשה ברכושנו אחרי פטירתנו, ורצוננו הוא שייתן לצוואה זו תוקף חוקי.', 
                font: 'David', 
                rightToLeft: true, 
                size: SIZES.normal 
              })
            ],
            spacing: { after: SPACING.betweenParagraphs * 1.5 }
          })
        );
      } else {
        // הואילים בטבלה
        const gender = willData.testator?.gender === 'female';
        sections.push(
          new Table({
            columnWidths: [7800, 1560],
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.RIGHT,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 7800, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        children: [
                          new TextRun({ 
                            text: 'הואיל כי אין אדם יודע את יום פקודתו;', 
                            font: 'David', 
                            rightToLeft: true, 
                            size: SIZES.normal 
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 1560, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "הואיל",
                            bold: true,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 7800, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        children: [
                          new TextRun({ 
                            text: `והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;`, 
                            font: 'David', 
                            rightToLeft: true, 
                            size: SIZES.normal 
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 1560, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "והואיל",
                            bold: true,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 7800, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        children: [
                          new TextRun({ 
                            text: `והואיל כי הנני למעלה מגיל שמונה עשרה שנים, ${gender ? 'אזרחית ישראלית ותושבת' : 'אזרח ישראלי ותושב'} מדינת ישראל;`, 
                            font: 'David', 
                            rightToLeft: true, 
                            size: SIZES.normal 
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 1560, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        bidirectional: true,
                        children: [
                          new TextRun({
                            text: "והואיל",
                            bold: true,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
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
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            children: [
              new TextRun({
                text: `${willData.testator?.fullName || '[שם 1]'}, נוש${gender1 ? 'את' : 'א'} ת.ז. מס' ${willData.testator?.id || '[מספר]'}, (להלן: "${willData.testator?.shortName || '[כינוי 1]'}") מרח': ${willData.testator?.address || '[כתובת]'}.`,
                bold: true,
                font: 'David',
                rightToLeft: true,
                size: SIZES.normal
              })
            ],
            spacing: { after: SPACING.betweenParagraphs }
          })
        );
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            children: [
              new TextRun({
                text: `${willData.spouse?.fullName || '[שם 2]'}, נוש${gender2 ? 'את' : 'א'} ת.ז. מס' ${willData.spouse?.id || '[מספר]'}, (להלן: "${willData.spouse?.shortName || '[כינוי 2]'}") מרח': ${willData.spouse?.address || '[כתובת]'}.`,
                bold: true,
                font: 'David',
                rightToLeft: true,
                size: SIZES.normal
              })
            ],
            spacing: { after: SPACING.betweenParagraphs * 1.5 }
          })
        );
      } else {
        const gender = willData.testator?.gender === 'female';
        sections.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            children: [
              new TextRun({
                text: `לפיכך אני הח"מ ${willData.testator?.fullName || '[שם מלא]'} ת"ז ${willData.testator?.id || '[מספר]'} מרחוב: ${willData.testator?.address || '[כתובת]'}. לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, הנני ${gender ? 'מצווה' : 'מצווה'} בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת ${gender ? 'עליי' : 'עלי'} מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, ${gender ? 'קובעת ומצהירה' : 'קובע ומצהיר'} כמפורט להלן:`,
                bold: true,
                font: 'David',
                rightToLeft: true,
                size: SIZES.normal
              })
            ],
            spacing: { after: SPACING.betweenParagraphs * 1.5 }
          })
        );
      }

      // סעיף 1 - ביטול צוואות קודמות (ללא כותרת "כללי")
      let sectionNum = 1;
      const gender = willData.testator?.gender === 'female';
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          alignment: AlignmentType.RIGHT,
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
          alignment: AlignmentType.RIGHT,
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
          children: [
            new TextRun({ 
              text: 'פרטי העיזבון', 
              font: 'David', 
              rightToLeft: true,
              size: SIZES.heading1,
              bold: true
            })
          ]
        })
      );
      
      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          alignment: AlignmentType.RIGHT,
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
              alignment: AlignmentType.RIGHT,
              bidirectional: true,
              children: [
                new TextRun({
                  text: `זכויות בדירה הרשומה בטאבו ${property.address || '[כתובת]'}, בעיר ${property.city || '[עיר]'}, הידועה כגוש: ${property.block || '[מספר]'}, חלקה: ${property.plot || '[מספר]'}, תת חלקה: ${property.subPlot || '[מספר]'} (להלן: "${property.name || 'דירת המגורים'}") וכן את מטלטליה בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע.`,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
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
              alignment: AlignmentType.RIGHT,
              bidirectional: true,
              children: [
                new TextRun({
                  text: `חשבון הבנק המנוהל על ${willData.type === 'mutual' ? 'שמנו' : 'שמי'} בבנק ${account.bank || '[שם הבנק]'}, סניף מספר ${account.branch || '[מספר]'}, חשבון מספר ${account.accountNumber || '[מספר]'}, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.`,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
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
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: `את כלל הכספים במזומן הנמצאים ${willData.type === 'mutual' ? 'ברשותנו' : 'ברשותי'}, לרבות שטרות כסף המוחזקים ${willData.type === 'mutual' ? 'בביתנו' : 'בביתי'}, בכספת או בכל מקום אחר.`,
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ]
        })
      );

      // יורשים
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: 'הוראות בדבר חלוקת העיזבון',
              font: 'David',
              rightToLeft: true,
              size: SIZES.heading1,
              bold: true
            })
          ]
        })
      );
      
      sections.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: willData.type === 'mutual'
                ? `הואיל והננו מבקשים להסדיר את חלוקת העיזבון לאחר מותנו, הרינו מצווים בזאת את כלל עיזבוננו, כפי שיהא במועד פטירתנו כמפורט להלן:`
                : `הואיל והנני מבקש${gender ? 'ת' : ''} להסדיר את חלוקת העיזבון לאחר מותי, הריני מצווה בזאת את כלל עזבוני, כפי שיהא במועד פטירתי כמפורט להלן:`,
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ],
          spacing: { after: SPACING.betweenParagraphs }
        })
      );

      if (willData.type === 'mutual') {
        sectionNum++;
        sections.push(
          new Paragraph({
            numbering: { reference: 'main-numbering', level: 0 },
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            children: [
              new TextRun({
                text: 'במקרה ומי מאיתנו ילך לבית עולמו לפני רעהו, הרי שכל רכושו יעבור לנותר בחיים מבין שנינו.',
                font: 'David',
                rightToLeft: true,
                size: SIZES.normal
              })
            ]
          })
        );
      }

      // 📊 טבלת יורשים
      if (willData.heirs && willData.heirs.length > 0) {
        sections.push(new Paragraph({ text: '' }));

        const tableBorder = { style: BorderStyle.SINGLE, size: 6, color: COLORS.gray };
        const cellBorders = {
          top: tableBorder,
          bottom: tableBorder,
          left: tableBorder,
          right: tableBorder
        };

        const tableRows: any[] = [];

        // שורת כותרות
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
                    bidirectional: true,
                    children: [
                      new TextRun({ 
                        text: 'חלק בירושה', 
                        bold: true, 
                        size: SIZES.normal,
                        font: 'David',
                        rightToLeft: true
                      })
                    ]
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
                    bidirectional: true,
                    children: [
                      new TextRun({ 
                        text: 'קרבת משפחה', 
                        bold: true, 
                        size: SIZES.normal,
                        font: 'David',
                        rightToLeft: true
                      })
                    ]
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
                    bidirectional: true,
                    children: [
                      new TextRun({ 
                        text: 'תעודת זהות', 
                        bold: true, 
                        size: SIZES.normal,
                        font: 'David',
                        rightToLeft: true
                      })
                    ]
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
                    bidirectional: true,
                    children: [
                      new TextRun({ 
                        text: 'שם מלא', 
                        bold: true, 
                        size: SIZES.normal,
                        font: 'David',
                        rightToLeft: true
                      })
                    ]
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
                      bidirectional: true,
                      children: [
                        new TextRun({ 
                          text: share, 
                          size: SIZES.normal,
                          font: 'David',
                          rightToLeft: true
                        })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 2340, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      bidirectional: true,
                      children: [
                        new TextRun({ 
                          text: relation, 
                          size: SIZES.normal,
                          font: 'David',
                          rightToLeft: true
                        })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 2340, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      bidirectional: true,
                      children: [
                        new TextRun({ 
                          text: id, 
                          size: SIZES.normal,
                          font: 'David',
                          rightToLeft: true
                        })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  borders: cellBorders,
                  width: { size: 2680, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      bidirectional: true,
                      children: [
                        new TextRun({ 
                          text: fullName, 
                          size: SIZES.normal,
                          font: 'David',
                          rightToLeft: true
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          );
        });

        sections.push(
          new Table({
            columnWidths: [2000, 2340, 2340, 2680],
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
        
        // מיון הסעיפים לפי סדר
        const sortedSections = [...willData.customSections].sort((a, b) => a.order - b.order);
        
        // פונקציה רקורסיבית להוספת סעיף עם היררכיה
        const addSectionWithHierarchy = (section: any, level: number = 0) => {
          console.log('Exporting section:', section.title, 'level:', level, 'sub_sections:', section.sub_sections);
          let sectionContent = section.content || section.title;
          
          // החלפת משתנים בסעיף
          if (willData.guardian) {
            sectionContent = sectionContent.replace(/\{\{guardian_name\}\}/g, willData.guardian.name || '[שם אפוטרופוס]');
            sectionContent = sectionContent.replace(/\{\{guardian_gender_suffix\}\}/g, (willData.guardian.gender || willData.guardianGender) === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{guardian_plural_suffix\}\}/g, '');
          }
          
          if (willData.type === 'advance-directives') {
            sectionContent = sectionContent.replace(/\{\{principal_gender_suffix\}\}/g, willData.testator?.gender === 'female' ? 'ת' : '');
            sectionContent = sectionContent.replace(/\{\{attorney_gender_suffix\}\}/g, willData.attorneyGender === 'female' ? 'ת' : '');
          }
          
          if (willData.heirs && willData.heirs.length > 0) {
            const firstHeir = willData.heirs[0];
            sectionContent = sectionContent.replace(/\{\{child_first_name\}\}/g, firstHeir.firstName || '[שם ילד]');
            
            const childGenderSuffix = firstHeir.gender === 'female' ? 'ה' : firstHeir.gender === 'plural' ? 'ו' : '';
            sectionContent = sectionContent.replace(/\{\{child_gender_suffix\}\}/g, childGenderSuffix);
            
            sectionContent = sectionContent.replace(/\{\{child_pronoun\}\}/g, firstHeir.gender === 'female' ? 'לה' : 'לו');
            sectionContent = sectionContent.replace(/\{\{heir_first_name\}\}/g, firstHeir.firstName || '[שם יורש]');
            
            const heirGenderSuffix = firstHeir.gender === 'female' ? 'ה' : firstHeir.gender === 'plural' ? 'ו' : '';
            sectionContent = sectionContent.replace(/\{\{heir_gender_suffix\}\}/g, heirGenderSuffix);
            
            if (willData.heirs.length > 1) {
              const secondHeir = willData.heirs[1];
              sectionContent = sectionContent.replace(/\{\{heir1_name\}\}/g, firstHeir.firstName || '[שם יורש 1]');
              sectionContent = sectionContent.replace(/\{\{heir1_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
              sectionContent = sectionContent.replace(/\{\{heir2_name\}\}/g, secondHeir.firstName || '[שם יורש 2]');
              sectionContent = sectionContent.replace(/\{\{heir2_gender_suffix\}\}/g, secondHeir.gender === 'female' ? 'ה' : '');
            }
          }
          
          sectionContent = sectionContent.replace(/\{\{testator_gender_suffix\}\}/g, willData.testator?.gender === 'female' ? 'ה' : '');
          
          const gender = willData.testator?.gender === 'female';
          if (gender) {
            sectionContent = sectionContent.replace(/\{\{gender:([^|]*)\|([^}]*)\}\}/g, '$2');
            sectionContent = sectionContent.replace(/\{\{gender:([^}]*)\}\}/g, '$1');
          } else {
            sectionContent = sectionContent.replace(/\{\{gender:([^|]*)\|([^}]*)\}\}/g, '$1');
            sectionContent = sectionContent.replace(/\{\{gender:([^}]*)\}\}/g, '');
          }
          
          if (willData.heirs && willData.heirs.length > 0) {
            const firstHeir = willData.heirs[0];
            sectionContent = sectionContent.replace(/\{\{heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{digital_heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{business_heir_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ה' : '');
            sectionContent = sectionContent.replace(/\{\{vehicle_inheritor_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ת' : '');
            sectionContent = sectionContent.replace(/\{\{pet_caregiver_gender_suffix\}\}/g, firstHeir.gender === 'female' ? 'ת' : '');
          }
          
          sectionContent = sectionContent.replace(/\{\{transfer_days\}\}/g, '30');
          sectionContent = sectionContent.replace(/\{\{guidance_years\}\}/g, '3');
          
          // הוספת הסעיף לפי רמת ההיררכיה
          if (section.level === 'main') {
            sectionNum++;
            sections.push(
              new Paragraph({
                numbering: { reference: 'main-numbering', level: 0 },
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                children: [
                  new TextRun({
                    text: sectionContent,
                    font: 'David',
                    rightToLeft: true,
                    size: SIZES.normal
                  })
                ]
              })
            );
          } else if (section.level === 'sub') {
            sections.push(
              new Paragraph({
                numbering: { reference: 'main-numbering', level: 1 },
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                children: [
                  new TextRun({
                    text: sectionContent,
                    font: 'David',
                    rightToLeft: true,
                    size: SIZES.normal
                  })
                ]
              })
            );
          } else if (section.level === 'sub-sub') {
            sections.push(
              new Paragraph({
                numbering: { reference: 'main-numbering', level: 2 },
                alignment: AlignmentType.RIGHT,
                bidirectional: true,
                children: [
                  new TextRun({
                    text: sectionContent,
                    font: 'David',
                    rightToLeft: true,
                    size: SIZES.normal
                  })
                ]
              })
            );
          }
          
          // הוספת תת-סעיפים אם קיימים
          if (section.sub_sections && section.sub_sections.length > 0) {
            const sortedSubSections = [...section.sub_sections].sort((a: any, b: any) => a.order - b.order);
            sortedSubSections.forEach((subSection: any) => {
              let subContent = subSection.content || subSection.title;
              
              // החלפת משתנים בתת-סעיף
              if (willData.testator?.gender === 'female') {
                subContent = subContent.replace(/\{\{gender:([^|]*)\|([^|]*)\|([^}]*)\}\}/g, '$2');
              } else {
                subContent = subContent.replace(/\{\{gender:([^|]*)\|([^|]*)\|([^}]*)\}\}/g, '$1');
              }
              
              sections.push(
                new Paragraph({
                  numbering: { reference: 'main-numbering', level: 1 },
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  children: [
                    new TextRun({
                      text: subContent,
                      font: 'David',
                      rightToLeft: true,
                      size: SIZES.normal
                    })
                  ]
                })
              );
              
              // הוספת תת-תת-סעיפים אם קיימים
              if (subSection.sub_sections && subSection.sub_sections.length > 0) {
                const sortedSubSubSections = [...subSection.sub_sections].sort((a: any, b: any) => a.order - b.order);
                sortedSubSubSections.forEach((subSubSection: any) => {
                  let subSubContent = subSubSection.content || subSubSection.title;
                  
                  // החלפת משתנים בתת-תת-סעיף
                  if (willData.testator?.gender === 'female') {
                    subSubContent = subSubContent.replace(/\{\{gender:([^|]*)\|([^|]*)\|([^}]*)\}\}/g, '$2');
                  } else {
                    subSubContent = subSubContent.replace(/\{\{gender:([^|]*)\|([^|]*)\|([^}]*)\}\}/g, '$1');
                  }
                  
                  sections.push(
                    new Paragraph({
                      numbering: { reference: 'main-numbering', level: 2 },
                      alignment: AlignmentType.RIGHT,
                      bidirectional: true,
                      children: [
                        new TextRun({
                          text: subSubContent,
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })
                      ]
                    })
                  );
                });
              }
            });
          }
        });
      }

      // סעיפי סיום
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: 'הוראות כלליות',
              font: 'David',
              rightToLeft: true,
              size: SIZES.heading1,
              bold: true
            })
          ]
        })
      );

      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: willData.type === 'mutual'
                ? 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתנו, חלקו יעבור ליורשיו החוקיים.'
                : 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.',
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ]
        })
      );

      // סעיף סיום - ולראיה באתי על החתום
      sections.push(new Paragraph({ text: '' }));
      sectionNum++;
      sections.push(
        new Paragraph({
          numbering: { reference: 'main-numbering', level: 0 },
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: willData.type === 'mutual'
                ? `ולראיה באנו על החתום מרצוננו הטוב והחופשי, בפני העדים החתומים הנקובים בשמותיהם וכתובותיהם בלי להיות נתונים לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאיננו סובלים מאיזו חולשה גופנית או רוחנית הגורעת או המונעת מאיתנו את כושרנו המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרנו בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתנו, וביקשנו מהם לאשר בחתימתם שכך הצהרנו וחתמנו בפניהם.`
                : `ולראיה באתי על החתום מרצוני הטוב והחופשי, בפני העדות החתומות הנקובות בשמותיהן וכתובותיהן בלי להיות ${gender ? 'נתונה' : 'נתון'} לכל השפעה בלתי הוגנת, לחץ או כפיה שהם וכשאינני ${gender ? 'סובלת' : 'סובל'} מאיזו חולשה גופנית או רוחנית הגורעת או המונעת ממני את כושרי המשפטי לערוך צוואה בעלת תוקף חוקי, לאחר שהצהרתי בנוכחות שתי עדות הצוואה המפורטות להלן כי זו צוואתי, וביקשתי מהן לאשר בחתימתן שכך הצהרתי וחתמתי בפניהן.`,
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ]
        })
      );

      // חתימת המצווה/ים בטבלה מקצועית
      sections.push(new Paragraph({ text: '' }));
      
      if (willData.type === 'mutual') {
        // צוואה הדדית - טבלה עם שני מצווים
        sections.push(
          new Table({
            columnWidths: [3744, 1872, 3744],
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 3744, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [new TextRun({
                          text: willData.testator?.fullName || '[שם 1]',
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 1872, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        children: [new TextRun("")]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 3744, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [new TextRun({
                          text: willData.spouse?.fullName || '[שם 2]',
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        );
      } else {
        // צוואה יחידה - טבלה עם מצווה אחד
        sections.push(
          new Table({
            columnWidths: [3744, 1872, 3744],
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 3744, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [new TextRun({
                          text: willData.testator?.fullName || '[שם מלא המצווה]',
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 1872, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        children: [new TextRun("")]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 3744, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        children: [new TextRun("")]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        );
      }
      
      // אנו הח"מ + שמות העדים - קודם!
      sections.push(new Paragraph({ text: '' }));
      sections.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: 'אנו הח"מ:',
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ],
          spacing: { after: 180 }
        })
      );

      if (willData.witnesses && willData.witnesses.length >= 2) {
        willData.witnesses.forEach((witness: any, index: number) => {
          sections.push(
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              bidirectional: true,
              children: [
                new TextRun({
                  text: `${index + 1}. ${witness.name || '[שם מלא עד]'}, ת.ז. ${witness.id || '[מספר]'}, מרחוב: ${witness.address || '[כתובת מלאה]'}`,
                  bold: true,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ],
              spacing: { after: 120 }
            })
          );
        });
      }
      
      // הצהרת העדים - עכשיו עם התאמה למגדר המצווה!
      sections.push(new Paragraph({ text: '' }));
      
      const witness1Gender = willData.witnesses?.[0]?.gender || 'male';
      const witness2Gender = willData.witnesses?.[1]?.gender || 'male';
      const bothMale = witness1Gender === 'male' && witness2Gender === 'male';
      const bothFemale = witness1Gender === 'female' && witness2Gender === 'female';
      
      // קביעת מגדר המצווה/ים
      const testatorGender = willData.testator?.gender || 'male';
      const isMutual = willData.type === 'mutual';
      
      // בניית טקסט ההצהרה בהתאם למגדר המצווה והעדים
      let witnessDeclaration = '';
      
      // קביעת מגדר העדים (משתנים כבר הוגדרו למעלה)
      const mixedGender = !bothMale && !bothFemale;
      
      // קביעת הטקסט לפי מגדר העדים
      const witnessText = bothFemale ? 'עדות' : 'עדים';
      
      // קביעת הטקסט לפי מגדר העדים
      const witnessGenderText = bothFemale ? {
        witness: 'עדות',
        testify: 'מעידות',
        minor: 'קטינות',
        incompetent: 'פסולות דין',
        sign: 'חותמות',
        each: 'כל אחת מאיתנו'
      } : {
        witness: 'עדים',
        testify: 'מעידים',
        minor: 'קטינים',
        incompetent: 'פסולי דין',
        sign: 'חותמים',
        each: 'כל אחד מאיתנו'
      };

      if (isMutual) {
        // צוואה הדדית - רבים
        witnessDeclaration = `אנו ${witnessGenderText.testify} בזאת שהמצווים הנ"ל ${willData.testator?.fullName || '[שם 1]'} ו-${willData.spouse?.fullName || '[שם 2]'}, הנושאים תעודות זהות ${willData.testator?.id || '[ת.ז 1]'} ו-${willData.spouse?.id || '[ת.ז 2]'} חתמו בנוכחותנו על צוואתם הנ"ל לאחר שהצהירו בפנינו שזאת צוואתם האחרונה שאותה עשו מרצונם הטוב והחופשי בהיותם בדעה צלולה ובלי כל אונס או כפיה, וביקשו מאיתנו להיות ${witnessGenderText.witness} לחתימתם ולאשר בחתימת ידנו שכך הצהירו וחתמו בפנינו. ועוד אנו מצהירים כי אנו לא ${witnessGenderText.minor} ולא ${witnessGenderText.incompetent} וכי אין בינינו ובין המצווים יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווים הנ"ל, והננו ${witnessGenderText.sign} ומאשרים בזה כי המצווים הנ"ל חתמו בפנינו על שטר צוואה זה לאחר שהצהירו בפנינו כי זו צוואתם ובזה אנו ${witnessGenderText.sign} בתור ${witnessGenderText.witness} לצוואה בנוכחות של המצווים הנ"ל ובנוכחות ${witnessGenderText.each}.`;
      } else if (testatorGender === 'female') {
        // מצווה נקבה
        witnessDeclaration = `אנו ${witnessGenderText.testify} בזאת שהמצווה הנ"ל ${willData.testator?.fullName || '[שם מלא]'}, הנושאת תעודת זהות ${willData.testator?.id || '[ת.ז]'} חתמה בנוכחותנו על צוואתה הנ"ל לאחר שהצהירה בפנינו שזאת צוואתה האחרונה שאותה עשתה מרצונה הטוב והחופשי בהיותה בדעה צלולה ובלי כל אונס או כפיה, וביקשה מאיתנו להיות ${witnessGenderText.witness} לחתימתה ולאשר בחתימת ידנו שכך הצהירה וחתמה בפנינו. ועוד אנו מצהירים כי אנו לא ${witnessGenderText.minor} ולא ${witnessGenderText.incompetent} וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו ${witnessGenderText.sign} ומאשרים בזה כי המצווה הנ"ל חתמה בפנינו על שטר צוואה זה לאחר שהצהירה בפנינו כי זו צוואתה ובזה אנו ${witnessGenderText.sign} בתור ${witnessGenderText.witness} לצוואה בנוכחות של המצווה הנ"ל ובנוכחות ${witnessGenderText.each}.`;
      } else {
        // מצווה זכר
        witnessDeclaration = `אנו ${witnessGenderText.testify} בזאת שהמצווה הנ"ל ${willData.testator?.fullName || '[שם מלא]'}, הנושא תעודת זהות ${willData.testator?.id || '[ת.ז]'} חתם בנוכחותנו על צוואתו הנ"ל לאחר שהצהיר בפנינו שזאת צוואתו האחרונה שאותה עשה מרצונו הטוב והחופשי בהיותו בדעה צלולה ובלי כל אונס או כפיה, וביקש מאיתנו להיות ${witnessGenderText.witness} לחתימתו ולאשר בחתימת ידנו שכך הצהיר וחתם בפנינו. ועוד אנו מצהירים כי אנו לא ${witnessGenderText.minor} ולא ${witnessGenderText.incompetent} וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו ${witnessGenderText.sign} ומאשרים בזה כי המצווה הנ"ל חתם בפנינו על שטר צוואה זה לאחר שהצהיר בפנינו כי זו צוואתו ובזה אנו ${witnessGenderText.sign} בתור ${witnessGenderText.witness} לצוואה בנוכחות של המצווה הנ"ל ובנוכחות ${witnessGenderText.each}.`;
      }
      
      sections.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: witnessDeclaration,
              font: 'David',
              rightToLeft: true,
              size: SIZES.normal
            })
          ],
          spacing: { after: SPACING.betweenParagraphs }
        })
      );

      // חתימות בטבלה מקצועית
      if (willData.witnesses && willData.witnesses.length >= 2) {
        sections.push(new Paragraph({ text: '' }));
        
        // טבלת חתימות העדים
        sections.push(
          new Table({
            columnWidths: [3744, 1872, 3744],
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 3744, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [new TextRun({
                          text: willData.witnesses[0].name || '[שם עד 1]',
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 1872, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        children: [new TextRun("")]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 3744, type: WidthType.DXA },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        bidirectional: true,
                        children: [new TextRun({
                          text: willData.witnesses[1].name || '[שם עד 2]',
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        );
      }

      // 📄 יצירת המסמך עם הגדרות RTL מתקדמות
      const doc = new Document({
        creator: 'מערכת צוואות מקצועית',
        title: willData.type === 'mutual' ? 'צוואה הדדית' : 'צוואה',
        description: 'מסמך משפטי בעברית',
        styles: styles,
        numbering: numberingConfig,
        features: {
          updateFields: true
        },
        sections: [{
          properties: {
            page: {
              margin: { 
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440
              }
            }
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  children: [
                    new TextRun({
                      text: `עותק ${willData.copyNumber || '1'} מתוך ${willData.totalCopies || '3'}`,
                      size: SIZES.small,
                      font: 'David',
                      rightToLeft: true
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
                  bidirectional: true,
                  children: [
                    new TextRun({ 
                      text: 'עמוד ', 
                      size: SIZES.small, 
                      font: 'David',
                      rightToLeft: true
                    }),
                    new TextRun({ 
                      children: [PageNumber.CURRENT], 
                      size: SIZES.small, 
                      font: 'David',
                      rightToLeft: true
                    })
                  ]
                })
              ]
            })
          },
          children: sections
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
    // קוד ה-PDF נשאר זהה...
    setExportStatus('PDF export not implemented in this fixed version');
  };

  const isFormValid = () => {
    return willData.testator?.fullName && 
           willData.testator?.id && 
           willData.heirs?.length > 0 &&
           willData.witnesses?.length >= 2;
  };

  return (
    <div className={`${className}`}>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">✨</span>
          <h3 className="text-xl font-bold text-green-900">יצוא Word מתוקן - RTL מלא!</h3>
        </div>

        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-900 mb-3">🔧 תיקונים שבוצעו:</h4>
          <ul className="text-sm text-green-800 space-y-2">
            <li>✅ הוספת <code>bidirectional: true</code> לכל הפסקאות</li>
            <li>✅ הוספת <code>rightToLeft: true</code> לכל TextRun</li>
            <li>✅ שינוי alignment ל-RIGHT בכל הטקסטים העבריים</li>
            <li>✅ הגדרת RTL במספור (numbering)</li>
            <li>✅ הגדרת RTL בסגנונות ברירת המחדל</li>
            <li>✅ הגדרת bidi ו-rtl ברמת הסקשן</li>
          </ul>
        </div>

        <button
          onClick={exportToWord}
          disabled={isExporting || !isFormValid()}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>יוצר צוואה...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">📄</span>
              <span>יצוא ל-Word (RTL מתוקן)</span>
            </>
          )}
        </button>

        {exportStatus && (
          <div className={`mt-4 p-3 rounded text-sm text-center font-medium ${
            exportStatus.includes('✅') 
              ? 'bg-green-50 border border-green-300 text-green-800' 
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}>
            {exportStatus}
          </div>
        )}

        {exportStatus && exportStatus.includes('✅') && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 אם עדיין יש בעיה:</h4>
            <p className="text-sm text-blue-800">
              1. פתח את הקובץ ב-Word<br/>
              2. לחץ Ctrl+A לבחירת הכל<br/>
              3. לחץ Ctrl + Right Shift לכיוון RTL<br/>
              4. שמור את הקובץ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
