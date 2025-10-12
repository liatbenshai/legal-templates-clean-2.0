'use client';

import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// פונקציה ליצירת פסקה בעברית עם RTL
function createHebrewParagraph(text: string, options?: {
  bold?: boolean;
  fontSize?: number;
  heading?: typeof HeadingLevel[keyof typeof HeadingLevel];
  alignment?: typeof AlignmentType[keyof typeof AlignmentType];
}): Paragraph {
  return new Paragraph({
    text: '',
    alignment: options?.alignment || AlignmentType.RIGHT,
    bidirectional: true,
    heading: options?.heading,
    children: [
      new TextRun({
        text: text,
        font: 'David',
        size: (options?.fontSize || 13) * 2,
        bold: options?.bold || false,
        rightToLeft: true
      })
    ]
  });
}

// ייצוא הסכם שכר טרחה ל-Word
export async function exportFeeAgreementToWord(agreementText: string, fileName: string = 'הסכם-שכר-טרחה.docx') {
  try {
    const lines = agreementText.split('\n');
    const paragraphs: Paragraph[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        paragraphs.push(createHebrewParagraph(''));
        continue;
      }

      // כותרת ראשית
      if (trimmedLine === 'הסכם שכר טרחה') {
        paragraphs.push(createHebrewParagraph(trimmedLine, {
          bold: true,
          fontSize: 16,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }));
        continue;
      }

      // הצדדים להסכם - עיצוב מיוחד
      if (trimmedLine.startsWith('בין:') || trimmedLine.startsWith('לבין:')) {
        paragraphs.push(createHebrewParagraph(trimmedLine, {
          bold: true,
          fontSize: 14,
          alignment: AlignmentType.CENTER
        }));
        continue;
      }

      // פרטי הצדדים - יישור לימין עם רווח
      if (trimmedLine.includes('רישיון מספר:') || trimmedLine.includes('ת.ז.:') || 
          trimmedLine.includes('כתובת:') || trimmedLine.includes('טלפון:') || trimmedLine.includes('דואייל:')) {
        paragraphs.push(createHebrewParagraph(`    ${trimmedLine}`, {
          fontSize: 13,
          alignment: AlignmentType.RIGHT
        }));
        continue;
      }

      // "(להלן: ...)" - יישור לימין
      if (trimmedLine.includes('(להלן:') && trimmedLine.includes(')')) {
        paragraphs.push(createHebrewParagraph(`    ${trimmedLine}`, {
          fontSize: 13,
          alignment: AlignmentType.RIGHT
        }));
        continue;
      }

      // "הואיל ו..." - פסקאות
      if (trimmedLine.startsWith('הואיל ו') || trimmedLine.startsWith('והואיל ו') || 
          trimmedLine.startsWith('לפיכך הוסכם')) {
        paragraphs.push(createHebrewParagraph(trimmedLine, {
          fontSize: 13,
          alignment: AlignmentType.JUSTIFIED
        }));
        continue;
      }

      // כותרות סעיפים ראשיים (1. 2. 3.)
      if (/^\d+\.\s/.test(trimmedLine)) {
        paragraphs.push(createHebrewParagraph('')); // רווח לפני כותרת
        paragraphs.push(createHebrewParagraph(trimmedLine, {
          bold: true,
          fontSize: 14,
          alignment: AlignmentType.RIGHT
        }));
        continue;
      }

      // תתי סעיפים (1.1, 1.2)
      if (/^\d+\.\d+\./.test(trimmedLine)) {
        paragraphs.push(createHebrewParagraph(trimmedLine, {
          bold: false,
          fontSize: 13,
          alignment: AlignmentType.JUSTIFIED
        }));
        continue;
      }

      // חתימות
      if (trimmedLine.includes('חתימת') || trimmedLine.includes('תאריך:')) {
        paragraphs.push(createHebrewParagraph('')); // רווח לפני חתימות
        paragraphs.push(createHebrewParagraph(trimmedLine, {
          fontSize: 13,
          alignment: AlignmentType.RIGHT
        }));
        continue;
      }

      // שורות רגילות
      paragraphs.push(createHebrewParagraph(trimmedLine, {
        fontSize: 13,
        alignment: AlignmentType.JUSTIFIED
      }));
    }

    const doc = new Document({
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
        children: paragraphs
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
    
    return true;
  } catch (error) {
    console.error('שגיאה בייצוא:', error);
    return false;
  }
}

