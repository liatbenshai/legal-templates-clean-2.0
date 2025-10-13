'use client';

import { useState } from 'react';
import { FileDown, FileText, Printer } from 'lucide-react';

interface SimpleExportButtonsProps {
  documentContent: string;
  documentTitle: string;
  className?: string;
}

export default function SimpleExportButtons({ 
  documentContent, 
  documentTitle, 
  className = '' 
}: SimpleExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: 'a4'
      });

      // הגדרת פונט וגודל
      doc.setFont('Arial', 'normal');
      doc.setFontSize(12);

      // הגדרת שוליים
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 2.5;
      const lineHeight = 0.6;
      let yPosition = margin;

      // כותרת
      doc.setFontSize(16);
      doc.text(documentTitle, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 2;

      // תוכן המסמך
      doc.setFontSize(12);
      const lines = documentContent.split('\n');
      
      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        if (line.trim()) {
          // חלוקת שורות ארוכות
          const words = line.split(' ');
          let currentLine = '';
          
          for (const word of words) {
            const testLine = currentLine + word + ' ';
            const lineWidth = doc.getTextWidth(testLine);
            
            if (lineWidth > (pageWidth - 2 * margin) && currentLine.length > 0) {
              doc.text(currentLine.trim(), pageWidth - margin, yPosition, { align: 'right' });
              yPosition += lineHeight;
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          }
          
          if (currentLine.trim()) {
            doc.text(currentLine.trim(), pageWidth - margin, yPosition, { align: 'right' });
            yPosition += lineHeight;
          }
        } else {
          yPosition += lineHeight * 0.5; // שורה ריקה
        }
      }

      // סימן מים
      doc.setFontSize(50);
      doc.setTextColor(200, 200, 200);
      doc.text('טיוטה', pageWidth / 2, pageHeight / 2, { 
        align: 'center',
        angle: 45 
      });

      // שמירה
      const fileName = `${documentTitle.replace(/[^א-תa-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
      
      setExportStatus(`✅ קובץ PDF נשמר: ${fileName}`);
      
    } catch (error) {
      console.error('שגיאה בייצוא PDF:', error);
      setExportStatus(`❌ שגיאה בייצוא PDF`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToWord = async () => {
    setIsExporting(true);
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');
      
      // יצירת פסקאות
      const paragraphs = documentContent.split('\n').map(line => 
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          children: [
            new TextRun({
              text: line.trim() || ' ', // שורה ריקה
              font: 'David',
              size: 26, // 13pt * 2
            })
          ]
        })
      );

      // יצירת מסמך
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              }
            }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: documentTitle,
                  font: 'David',
                  size: 32, // 16pt * 2
                  bold: true,
                })
              ]
            }),
            new Paragraph({ text: '' }), // שורה ריקה
            ...paragraphs
          ]
        }]
      });

      // יצירת בלוב והורדה
      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentTitle.replace(/[^א-תa-zA-Z0-9]/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus(`✅ קובץ Word נשמר: ${a.download}`);
      
    } catch (error) {
      console.error('שגיאה בייצוא Word:', error);
      setExportStatus(`❌ שגיאה בייצוא Word`);
    } finally {
      setIsExporting(false);
    }
  };

  const printDocument = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setExportStatus('❌ לא ניתן לפתוח חלון הדפסה');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>${documentTitle}</title>
        <style>
          body { 
            font-family: 'David', 'Times New Roman', serif; 
            font-size: 13pt; 
            line-height: 1.6; 
            direction: rtl; 
            text-align: right;
            margin: 2.5cm;
          }
          h1 { text-align: center; font-size: 18pt; margin-bottom: 2em; }
          .content { white-space: pre-line; }
          @page { margin: 2.5cm; }
        </style>
      </head>
      <body>
        <h1>${documentTitle}</h1>
        <div class="content">${documentContent}</div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    
    setExportStatus('✅ נפתח חלון הדפסה');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FileDown className="w-5 h-5" />
          ייצוא המסמך
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={exportToPDF}
            disabled={isExporting || !documentContent.trim()}
            className="flex flex-col items-center gap-2 p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition disabled:opacity-50"
          >
            <FileText className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-red-700">PDF</span>
          </button>
          
          <button
            onClick={exportToWord}
            disabled={isExporting || !documentContent.trim()}
            className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition disabled:opacity-50"
          >
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Word</span>
          </button>
          
          <button
            onClick={printDocument}
            disabled={!documentContent.trim()}
            className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition disabled:opacity-50"
          >
            <Printer className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-700">הדפסה</span>
          </button>
        </div>
        
        {exportStatus && (
          <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-center">
            {exportStatus}
          </div>
        )}
        
        {isExporting && (
          <div className="mt-3 text-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">מייצא...</p>
          </div>
        )}
      </div>
    </div>
  );
}
