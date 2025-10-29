import { Document, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, Packer } from 'docx';
import type { WillDocument, WillItem } from '@/lib/types/will-document';
import { replaceTextWithGender } from '@/lib/hebrew-gender';

export function generateWillDocument(document: WillDocument): Document {
  // מיין לפי order
  const sortedItems = [...document.items].sort((a, b) => a.order - b.order);

  // צור את כל הילדים של המסמך
  const children: any[] = [];

  sortedItems.forEach((item, index) => {
    if (item.type === 'section') {
      // הוסף סעיף רגיל
      const sectionNumber = index + 1;
      
      // כותרת הסעיף
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `סעיף ${sectionNumber}`,
              bold: true,
              size: 24,
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: item.content,
              size: 22,
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 }
        })
      );
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
              size: 24,
            })
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 }
        })
      );

      // הטבלה עצמה
      if (item.heirs.length > 0) {
        const tableRows = [
          // כותרות
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'שם יורש', bold: true })],
                  alignment: AlignmentType.RIGHT
                })]
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'ת.ז.', bold: true })],
                  alignment: AlignmentType.RIGHT
                })]
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'קרבה', bold: true })],
                  alignment: AlignmentType.RIGHT
                })]
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'אחוז', bold: true })],
                  alignment: AlignmentType.RIGHT
                })]
              })
            ]
          }),
          // שורות יורשים
          ...item.heirs.map(heir => 
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: heir.name })],
                    alignment: AlignmentType.RIGHT
                  })]
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: heir.id })],
                    alignment: AlignmentType.RIGHT
                  })]
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: heir.relationship })],
                    alignment: AlignmentType.RIGHT
                  })]
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: `${heir.percentage}%` })],
                    alignment: AlignmentType.RIGHT
                  })]
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
              type: 'pct'
            }
          })
        );
      } else {
        // אם אין יורשים בטבלה
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'לא הוגדרו יורשים בטבלה זו',
                italics: true,
                size: 20,
              })
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 }
          })
        );
      }
    }
  });

  const doc = new Document({
    sections: [{
      children: children
    }]
  });

  return doc;
}

// פונקציה עזר לייצוא המסמך
export async function exportWillToWord(willDocument: WillDocument, filename: string = 'צוואה.docx') {
  const doc = generateWillDocument(willDocument);
  
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
