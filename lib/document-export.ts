/**
 * מערכת ייצוא מסמכים לפורמטים שונים
 * תמיכה ב-RTL ובעברית
 */

export interface ExportOptions {
  watermark?: boolean;
  watermarkText?: string;
  copyNumber?: number;
  totalCopies?: number;
}

/**
 * פונקציה כללית למספור תתי-סעיפים בכל המסמכים
 */
export function formatSubSectionNumbering(content: string, mainSection: number, subSection: number): string {
  return `${mainSection}.${subSection}. ${content}`;
}

/**
 * פונקציה לעיבוד מספור אוטומטי בתוכן המסמך
 */
export function processDocumentNumbering(content: string): string {
  // החלפת מספור ישן במספור חדש
  let processedContent = content;
  let sectionNumber = 1;
  
  // מציאת כל השורות שמתחילות במספר ונקודה
  const lines = processedContent.split('\n');
  const processedLines = lines.map(line => {
    // אם השורה מתחילה במספר ונקודה (כמו "1. ", "2. ")
    if (/^\d+\.\s/.test(line.trim())) {
      const content = line.replace(/^\d+\.\s/, '');
      return `${sectionNumber++}. ${content}`;
    }
    return line;
  });
  
  return processedLines.join('\n');
}

/**
 * פונקציה ליצירת טבלת יורשים אמיתית ב-Word
 */
export function createHeirsTable(docx: any, heirs: any[]): any {
  const { Table, TableRow, TableCell, Paragraph, TextRun, AlignmentType, WidthType, BorderStyle } = docx;
  
  // הכנת נתונים - כותרות מימין לשמאל
  const headers = ['שם מלא', 'תעודת זהות', 'קרבת משפחה', 'חלק בירושה'];
  const tableData = heirs.map(heir => [
    `${heir.firstName || ''} ${heir.lastName || ''}`.trim() || '[שם]',
    heir.id || '[ת.ז]',
    heir.relation || '[קרבה]',
    heir.share || `1/${heirs.length}`
  ]);
  
  // יצירת שורות הטבלה
  const allRows = [headers, ...tableData];
  const tableRows = allRows.map((rowData, rowIndex) => {
    // היפוך סדר התאים (מימין לשמאל)
    const reversedCells = [...rowData].reverse().map((cellText) => {
      return new TableCell({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            children: [
              new TextRun({
                text: cellText,
                font: 'David',
                size: 22,
                bold: rowIndex === 0, // כותרות מודגשות
                rightToLeft: true
              })
            ]
          })
        ],
        width: {
          size: 25, // 25% לכל עמודה
          type: WidthType.PERCENTAGE
        },
        margins: {
          top: 150,
          bottom: 150,
          left: 150,
          right: 150
        }
      });
    });
    
    return new TableRow({
      children: reversedCells,
      tableHeader: rowIndex === 0
    });
  });
  
  return new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: '000000' }
    }
  });
}

// ייצוא ל-PDF באמצעות jsPDF עם תמיכה בעברית
export async function exportToPDF(
  templateData: any, 
  fieldValues: any, 
  options: ExportOptions = {}
) {
  try {
    // ייבוא דינאמי של jsPDF
    const { jsPDF } = await import('jspdf');
    
    // יצירת מסמך PDF עם הגדרות RTL
    const doc = new jsPDF({
      orientation: templateData.pageSettings?.orientation || 'portrait',
      unit: 'cm',
      format: templateData.pageSettings?.size || 'a4',
    });

    // הגדרת פונט שתומך בעברית (צריך להוסיף פונט מותאם)
    doc.setFont(templateData.styles?.fontFamily || 'Arial');
    doc.setFontSize(templateData.styles?.fontSize || 12);
    
    // הגדרת שוליים
    const margins = templateData.pageSettings?.margins || { top: 2.5, right: 2, bottom: 2.5, left: 2 };
    let yPosition = margins.top;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margins.right - margins.left;

    // כותרת מסמך
    if (templateData.title) {
      doc.setFontSize(18);
      doc.text(templateData.title, pageWidth - margins.right, yPosition, { align: 'right' });
      yPosition += 1.5;
    }

    // ציור תוכן הבלוקים
    if (templateData.blocks && templateData.blocks.length > 0) {
      doc.setFontSize(templateData.styles?.fontSize || 12);
      
      for (const block of templateData.blocks) {
        // החלפת placeholders בערכים אמיתיים
        let content = block.content || '';
        
        // החלפת {{fieldName}} בערכים מהטופס
        Object.keys(fieldValues).forEach(fieldName => {
          const placeholder = `{{${fieldName}}}`;
          content = content.replace(new RegExp(placeholder, 'g'), fieldValues[fieldName] || '');
        });

        // פיצול לשורות (RTL)
        const lines = doc.splitTextToSize(content, contentWidth);
        
        // בדיקת עמוד חדש
        if (yPosition + lines.length * 0.5 > pageHeight - margins.bottom) {
          doc.addPage();
          yPosition = margins.top;
        }

        // כתיבת הטקסט מימין לשמאל
        lines.forEach((line: string) => {
          doc.text(line, pageWidth - margins.right, yPosition, { align: 'right' });
          yPosition += 0.7;
        });

        yPosition += 0.5; // רווח בין בלוקים
      }
    }

    // מספור עמודים, סימן מים, מספר העתק
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // מספור עמודים
      if (templateData.pageSettings?.pageNumbers) {
        doc.setFontSize(10);
        doc.text(
          `עמוד ${i} מתוך ${totalPages}`,
          pageWidth / 2,
          pageHeight - margins.bottom / 2,
          { align: 'center' }
        );
      }

      // מספר העתק
      if (options.copyNumber && options.totalCopies) {
        doc.setFontSize(9);
        doc.text(
          `העתק ${options.copyNumber} מתוך ${options.totalCopies}`,
          pageWidth - margins.right,
          margins.top / 2,
          { align: 'right' }
        );
      }

      // סימן מים "טיוטה"
      if (options.watermark) {
        doc.setFontSize(60);
        doc.setTextColor(200, 200, 200);
        doc.text(
          options.watermarkText || 'טיוטה',
          pageWidth / 2,
          pageHeight / 2,
          { 
            align: 'center',
            angle: 45,
          }
        );
        doc.setTextColor(0, 0, 0); // החזר צבע לשחור
      }
    }

    // שמירת הקובץ
    const copyText = options.copyNumber ? `_העתק${options.copyNumber}` : '';
    const fileName = `${templateData.title || 'מסמך'}${copyText}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('שגיאה בייצוא ל-PDF:', error);
    return { success: false, error: 'נכשל ייצוא ל-PDF' };
  }
}

// ייצוא ל-Word (DOCX) באמצעות docx
export async function exportToWord(templateData: any, fieldValues: any) {
  try {
    // ייבוא דינאמי של docx
    const docx = await import('docx');
    const { 
      Document, 
      Paragraph, 
      TextRun, 
      AlignmentType, 
      HeadingLevel, 
      PageOrientation,
      Table,
      TableRow,
      TableCell,
      WidthType,
      BorderStyle,
      Header,
      Footer,
      PageNumber
    } = docx;

    // פונקציית עזר ליצירת פסקה בעברית מקצועית - תיקון RTL מלא + יישור לשני הצדדים
    const createHebrewParagraph = (text: string, options: any = {}) => {
      const paragraph = new Paragraph({
        // יישור לשני הצדדים (Justify) לפסקאות רגילות, ימינה לכותרות
        alignment: options.alignment || 
                  (options.heading ? AlignmentType.RIGHT : AlignmentType.BOTH),
        bidirectional: true,
        spacing: { 
          after: options.spacingAfter || 200,
          before: options.spacingBefore || 0,
          line: options.lineHeight ? Math.round(options.lineHeight * 240) : 360
        },
        indent: options.indent ? { right: options.indent * 360 } : undefined,
        heading: options.heading || undefined,
        children: [
          new TextRun({
            text: text,
            font: options.font || templateData.styles?.fontFamily || 'David',
            size: (options.size || templateData.styles?.fontSize || 12) * 2,
            bold: options.bold || false,
            underline: options.underline ? {} : undefined,
            italics: options.italic || false,
            rightToLeft: true,
          })
        ]
      });

      return paragraph;
    };

    // יצירת פסקאות מהבלוקים
    const paragraphs: any[] = [];

    // כותרת ראשית
    if (templateData.title) {
      paragraphs.push(
        createHebrewParagraph(templateData.title, {
          size: 18,
          bold: true,
          heading: HeadingLevel.HEADING_1,
          spacingAfter: 400,
          alignment: AlignmentType.RIGHT // כותרות ימינה
        })
      );
      paragraphs.push(new Paragraph({ text: '' })); // שורה ריקה
    }

    // תוכן הבלוקים
    if (templateData.blocks && templateData.blocks.length > 0) {
      for (const block of templateData.blocks) {
        let content = block.content || '';
        
        // החלפת placeholders
        Object.keys(fieldValues).forEach(fieldName => {
          const placeholder = `{{${fieldName}}}`;
          content = content.replace(new RegExp(placeholder, 'g'), fieldValues[fieldName] || '');
        });

        // טיפול בסוגי בלוקים שונים
        if (block.type === 'heading1' || block.type === 'heading2' || block.type === 'heading3') {
          const headingLevel = block.type === 'heading1' ? HeadingLevel.HEADING_1 :
                              block.type === 'heading2' ? HeadingLevel.HEADING_2 :
                              HeadingLevel.HEADING_3;
          const size = block.type === 'heading1' ? 18 :
                      block.type === 'heading2' ? 16 : 14;
          
          paragraphs.push(
            createHebrewParagraph(content, {
              size: size,
              bold: true,
              heading: headingLevel,
              spacingAfter: 300,
              spacingBefore: 200,
              alignment: AlignmentType.RIGHT // כותרות תמיד ימינה
            })
          );
        } 
        else if (block.type === 'table' && block.content?.rows) {
          // יצירת טבלה עם תמיכה מלאה ב-RTL עברית
          const rows = block.content.rows;
          const numCols = rows[0]?.cells?.length || 0;
          
          const tableRows = rows.map((row: any, rowIndex: number) => {
            // היפוך סדר התאים עבור RTL (מימין לשמאל)
            const reversedCells = [...row.cells].reverse().map((cell: any) => {
              return new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    bidirectional: true,
                    children: [
                      new TextRun({
                        text: cell.content || '',
                        font: 'David',
                        size: 22,
                        bold: row.isHeader || false,
                        rightToLeft: true
                      })
                    ]
                  })
                ],
                width: {
                  size: cell.width || Math.floor(100 / numCols),
                  type: WidthType.PERCENTAGE
                },
                margins: {
                  top: 150,
                  bottom: 150,
                  left: 150,
                  right: 150
                },
                verticalAlign: 'center'
              });
            });
            
            return new TableRow({
              children: reversedCells,
              tableHeader: row.isHeader || false
            });
          });
          
          paragraphs.push(
            new Table({
              rows: tableRows,
              width: {
                size: 100,
                type: WidthType.PERCENTAGE
              },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                insideVertical: { style: BorderStyle.SINGLE, size: 2, color: '000000' }
              },
              // הגדרות RTL לטבלה
              layout: 'fixed',
              columnWidths: Array(numCols).fill(Math.floor(9000 / numCols))
            })
          );
          paragraphs.push(new Paragraph({ text: '' })); // רווח אחרי טבלה
        }
        else {
          // פסקה רגילה - פיצול לשורות
          const lines = content.split('\n');
          lines.forEach((line: string) => {
            if (line.trim()) {
              paragraphs.push(
                createHebrewParagraph(line, {
                  spacingAfter: 100,
                  lineHeight: templateData.styles?.lineHeight || 1.5
                })
              );
            } else {
              paragraphs.push(new Paragraph({ text: '' })); // שורה ריקה
            }
          });
        }

        // רווח בין בלוקים
        paragraphs.push(new Paragraph({ text: '' }));
      }
    }

    // יצירת המסמך עם כותרות עליונות ותחתונות
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: (templateData.pageSettings?.margins?.top || 2.5) * 567, // convert cm to twips
              right: (templateData.pageSettings?.margins?.right || 2) * 567,
              bottom: (templateData.pageSettings?.margins?.bottom || 2.5) * 567,
              left: (templateData.pageSettings?.margins?.left || 2) * 567,
            },
            size: {
              orientation: templateData.pageSettings?.orientation === 'landscape' 
                ? PageOrientation.LANDSCAPE 
                : PageOrientation.PORTRAIT,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              createHebrewParagraph(templateData.title || 'מסמך משפטי', {
                size: 10,
                spacingAfter: 100,
                alignment: AlignmentType.RIGHT // כותרת עליונה ימינה
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
                    text: "עמוד ", 
                    size: 20, 
                    font: 'David',
                    rightToLeft: true
                  }),
                  new TextRun({ 
                    children: [PageNumber.CURRENT], 
                    size: 20, 
                    font: 'David' 
                  })
                ]
              })
            ]
          })
        },
        children: paragraphs,
      }],
    });

    // המרה ל-Blob ושמירה
    const { Packer } = docx;
    const blob = await Packer.toBlob(doc);
    
    // יצירת קישור להורדה
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateData.title || 'מסמך'}.docx`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    
    return { success: true, fileName: `${templateData.title}.docx` };
  } catch (error) {
    console.error('שגיאה בייצוא ל-Word:', error);
    return { success: false, error: 'נכשל ייצוא ל-Word' };
  }
}

// ייצוא ל-HTML (לתצוגה או להדפסה)
export function exportToHTML(templateData: any, fieldValues: any): string {
  let html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateData.title || 'מסמך'}</title>
  <style>
    @page {
      size: ${templateData.pageSettings?.size || 'A4'} ${templateData.pageSettings?.orientation || 'portrait'};
      margin: ${templateData.pageSettings?.margins?.top || 2.5}cm 
              ${templateData.pageSettings?.margins?.right || 2}cm 
              ${templateData.pageSettings?.margins?.bottom || 2.5}cm 
              ${templateData.pageSettings?.margins?.left || 2}cm;
    }
    body {
      font-family: ${templateData.styles?.fontFamily || 'Arial'}, sans-serif;
      font-size: ${templateData.styles?.fontSize || 12}pt;
      line-height: ${templateData.styles?.lineHeight || 1.5};
      direction: rtl;
      text-align: right;
    }
    h1 {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 1em;
    }
    .block {
      margin-bottom: 1em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    table td, table th {
      border: 1px solid #000;
      padding: 0.5em;
      text-align: right;
    }
    @media print {
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <h1>${templateData.title || ''}</h1>
`;

  // הוספת תוכן הבלוקים
  if (templateData.blocks && templateData.blocks.length > 0) {
    for (const block of templateData.blocks) {
      let content = block.content || '';
      
      // החלפת placeholders
      Object.keys(fieldValues).forEach(fieldName => {
        const placeholder = `{{${fieldName}}}`;
        content = content.replace(new RegExp(placeholder, 'g'), fieldValues[fieldName] || '');
      });

      html += `  <div class="block">${content.replace(/\n/g, '<br>')}</div>\n`;
    }
  }

  html += `
  <button class="no-print" onclick="window.print()" style="margin-top: 2em; padding: 0.5em 1em; cursor: pointer;">
    הדפס / שמור כ-PDF
  </button>
</body>
</html>`;

  return html;
}

// פתיחת תצוגה מקדימה להדפסה
export function printPreview(templateData: any, fieldValues: any) {
  const html = exportToHTML(templateData, fieldValues);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    alert('נא לאפשר חלונות קופצים בדפדפן');
  }
}
