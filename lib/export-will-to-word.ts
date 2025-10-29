import { Document, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, Packer, BorderStyle, HeadingLevel, Header, Footer, WidthType } from 'docx';
import type { WillDocument, WillItem } from '@/lib/types/will-document';
import { replaceTextWithGender } from '@/lib/hebrew-gender';

interface WillFormData {
  testator: {
    fullName: string;
    id: string;
    address: string;
    city: string;
    gender: 'male' | 'female';
  };
  spouse?: {
    fullName: string;
    id: string;
  };
  willDate: {
    day: string;
    month: string;
    year: string;
  };
  lawyerName: string;
  [key: string]: any;
}

export function generateWillDocument(document: WillDocument, formData?: WillFormData): Document {
  // הגדרת צבעים ומצבים
  const SIZES = {
    title: 40,
    heading1: 32,
    heading2: 28,
    normal: 26,
    small: 24
  };

  const SPACING = {
    beforeTitle: 240,
    afterTitle: 180,
    betweenParagraphs: 120,
  };

  // מיין לפי order
  const sortedItems = [...document.items].sort((a, b) => a.order - b.order);

  // צור את כל הילדים של המסמך
  const children: any[] = [];

  // כותרת המסמך
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'צוואה',
          bold: true,
          size: SIZES.title,
          font: 'David'
        })
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { before: SPACING.beforeTitle, after: SPACING.afterTitle }
    })
  );

  // טקסט פתיחה
  if (formData?.testator) {
    const testatorGender = formData.testator.gender || 'male';
    const testatorText = formData.willType === 'mutual' 
      ? `אנו, ${formData.testator.fullName}, ת.ז. ${formData.testator.id}, ${formData.testator.address}`
      : `אני, ${formData.testator.fullName}, ת.ז. ${formData.testator.id}, ${formData.testator.address}`;
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: replaceTextWithGender(testatorText, testatorGender),
            size: SIZES.normal,
            font: 'David'
          })
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { after: SPACING.betweenParagraphs }
      })
    );
  }

  // עיבוד כל הפריטים
  let sectionNumber = 1;
  
  sortedItems.forEach((item, index) => {
    if (item.type === 'section') {
      // הוסף סעיף רגיל
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `סעיף ${sectionNumber}`,
              bold: true,
              size: SIZES.heading2,
              font: 'David'
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 240, after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: item.content,
              size: SIZES.normal,
              font: 'David'
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 240 }
        })
      );
      sectionNumber++;
    } else if (item.type === 'table') {
      // הוסף טבלת יורשים
      const tableNumber = sortedItems.filter(i => i.type === 'table').indexOf(item) + 1;
      
      // כותרת הטבלה
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `טבלת חלוקה ${tableNumber}`,
              bold: true,
              size: SIZES.heading2,
              font: 'David'
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 240, after: 120 }
        })
      );

      // הטבלה עצמה
      if (item.heirs && item.heirs.length > 0) {
        const tableRows = [
          // כותרות
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'שם יורש', bold: true, size: SIZES.normal, font: 'David' })],
                  alignment: AlignmentType.RIGHT
                })],
                margins: { top: 100, bottom: 100, left: 180, right: 180 }
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'ת.ז.', bold: true, size: SIZES.normal, font: 'David' })],
                  alignment: AlignmentType.RIGHT
                })],
                margins: { top: 100, bottom: 100, left: 180, right: 180 }
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'קרבה', bold: true, size: SIZES.normal, font: 'David' })],
                  alignment: AlignmentType.RIGHT
                })],
                margins: { top: 100, bottom: 100, left: 180, right: 180 }
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'אחוז', bold: true, size: SIZES.normal, font: 'David' })],
                  alignment: AlignmentType.RIGHT
                })],
                margins: { top: 100, bottom: 100, left: 180, right: 180 }
              })
            ]
          }),
          // שורות יורשים
          ...item.heirs.map(heir => 
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: heir.name || '', size: SIZES.normal, font: 'David' })],
                    alignment: AlignmentType.RIGHT
                  })],
                  margins: { top: 100, bottom: 100, left: 180, right: 180 }
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: heir.id || '', size: SIZES.normal, font: 'David' })],
                    alignment: AlignmentType.RIGHT
                  })],
                  margins: { top: 100, bottom: 100, left: 180, right: 180 }
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: heir.relationship || '', size: SIZES.normal, font: 'David' })],
                    alignment: AlignmentType.RIGHT
                  })],
                  margins: { top: 100, bottom: 100, left: 180, right: 180 }
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: `${heir.percentage || 0}%`, size: SIZES.normal, font: 'David' })],
                    alignment: AlignmentType.RIGHT
                  })],
                  margins: { top: 100, bottom: 100, left: 180, right: 180 }
                })
              ]
            })
          )
        ];

        children.push(
          new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 0.5, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 0.5, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 0.5, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 0.5, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 0.5, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 0.5, color: '000000' }
            }
          })
        );
      }
      
      children.push(
        new Paragraph({
          spacing: { after: 240 }
        })
      );
    }
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,
            bottom: 1440,
            right: 1800,
            left: 1800
          }
        }
      },
      children: children,
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'צוואה', size: SIZES.small, font: 'David' })
              ],
              alignment: AlignmentType.RIGHT
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `עמוד`, size: SIZES.small, font: 'David' })
              ],
              alignment: AlignmentType.RIGHT
            })
          ]
        })
      }
    }]
  });

  return doc;
}

// פונקציה עזר לייצוא המסמך
export async function exportWillToWord(willDocument: WillDocument, formData?: WillFormData, filename: string = 'צוואה.docx') {
  const doc = generateWillDocument(willDocument, formData);
  
  // יצירת קובץ Word
  const buffer = await Packer.toBlob(doc);
  
  // הורדת הקובץ
  const url = URL.createObjectURL(buffer);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
