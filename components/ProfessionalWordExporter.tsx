'use client';

import { useState } from 'react';
import { FileDown, FileText, AlertCircle } from 'lucide-react';

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
              AlignmentType, WidthType, BorderStyle, Header, Footer, PageNumber } = await import('docx');

      // יצירת תוכן הצוואה המלא
      const content = generateWillContent(willData);
      
      // פונקציה ליצירת פסקה בעברית (כמו בהוראות קלוד)
      const createHebrewParagraph = (text: string, bold = false, size = 13) => {
        return new Paragraph({
          alignment: bold ? AlignmentType.RIGHT : AlignmentType.JUSTIFIED, // כותרות ימינה, טקסט רגיל לשני הצדדים
          bidirectional: true,
          spacing: { after: text.trim() === '' ? 120 : 60 },
          children: [
            new TextRun({
              text: text.trim() || ' ',
              font: 'David',
              size: size * 2, // docx uses half-points (13 * 2 = 26)
              bold: bold, // רק כותרות מודגשות
              rightToLeft: true // קריטי!
            })
          ]
        });
      };

      // יצירת טבלה בעברית (כמו בהוראות קלוד)
      const createHebrewTable = (headers: string[], data: string[][]) => {
        const numCols = headers.length;
        
        // יצירת שורת כותרות - הפוך סדר (מימין לשמאל)
        const headerRow = new TableRow({
          children: [...headers].reverse().map(header => 
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  children: [
                    new TextRun({
                      text: header,
                      font: 'David',
                      size: 26, // 13 * 2 = 26
                      bold: true,
                      rightToLeft: true
                    })
                  ]
                })
              ],
              width: { size: Math.floor(100 / numCols), type: WidthType.PERCENTAGE },
              margins: { top: 150, bottom: 150, left: 150, right: 150 }
            })
          ),
          tableHeader: true
        });

        // יצירת שורות נתונים - הפוך סדר (מימין לשמאל)
        const dataRows = data.map(rowData => 
          new TableRow({
            children: [...rowData].reverse().map(cellText => 
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    bidirectional: true,
                    children: [
                      new TextRun({
                        text: cellText,
                        font: 'David',
                        size: 26, // 13 * 2 = 26
                        rightToLeft: true
                      })
                    ]
                  })
                ],
                width: { size: Math.floor(100 / numCols), type: WidthType.PERCENTAGE },
                margins: { top: 150, bottom: 150, left: 150, right: 150 }
              })
            )
          })
        );

        return new Table({
          rows: [headerRow, ...dataRows],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
            insideVertical: { style: BorderStyle.SINGLE, size: 2, color: '000000' }
          }
        });
      };

      // עיבוד התוכן לפסקאות וטבלאות
      const paragraphs: any[] = [];
      const contentLines = content.split('\n');
      
      let i = 0;
      while (i < contentLines.length) {
        const line = contentLines[i];
        
        // זיהוי טבלת יורשים
        if (line.includes('טבלת היורשים:') && willData.heirsDisplayMode === 'table') {
          // הוסף כותרת הטבלה
          paragraphs.push(createHebrewParagraph('טבלת היורשים:', true, 15)); // כותרת משנה מודגשת
          paragraphs.push(createHebrewParagraph('')); // שורה ריקה
          
          // צור טבלה אמיתית
          const headers = ['שם מלא', 'תעודת זהות', 'קרבת משפחה', 'חלק בירושה'];
          const tableData = willData.heirs.map((heir: any) => [
            `${heir.firstName || ''} ${heir.lastName || ''}`.trim() || '[שם]',
            heir.id || '[ת.ז]',
            heir.relation || '[קרבה]',
            heir.share || `1/${willData.heirs.length}`
          ]);
          
          paragraphs.push(createHebrewTable(headers, tableData));
          paragraphs.push(createHebrewParagraph('')); // שורה ריקה אחרי טבלה
          
          // דלג על השורות של ASCII art
          while (i < contentLines.length && (
            contentLines[i].includes('┌') || 
            contentLines[i].includes('│') || 
            contentLines[i].includes('├') || 
            contentLines[i].includes('└') ||
            contentLines[i].includes('טבלת היורשים')
          )) {
            i++;
          }
          continue;
        }
        
        // פסקה רגילה
        if (line.trim()) {
          const isTitle = line.includes('צוואה') && line.length < 20;
          const isHeading = /^\d+\./.test(line.trim()) || line.includes('כללי') || line.includes('היקף') || line.includes('חתימות');
          
          paragraphs.push(createHebrewParagraph(
            line, 
            isTitle || isHeading, // רק כותרות מודגשות
            isTitle ? 16 : isHeading ? 15 : 13 // כותרת ראשית 16, כותרות משנה 15, טקסט רגיל 13
          ));
        } else {
          paragraphs.push(createHebrewParagraph('')); // שורה ריקה
        }
        
        i++;
      }

      // יצירת מסמך עם הגדרות RTL מלאות
      const doc = new Document({
        creator: 'מערכת צוואות מקצועית',
        title: willData.type === 'mutual' ? 'צוואה הדדית' : 'צוואה',
        description: 'מסמך משפטי בעברית',
        sections: [{
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
            },
            type: 'continuous'
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  bidirectional: true,
                  spacing: { after: 120 },
                  children: [new TextRun({
                    text: `עותק ${willData.copyNumber || '1'} מתוך ${willData.totalCopies || '3'}`,
                    size: 26, // 13 * 2 = 26
                    font: 'David',
                    rightToLeft: true
                  })]
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
                      size: 26, // 13 * 2 = 26
                      font: 'David',
                      rightToLeft: true
                    }),
                    new TextRun({ 
                      children: [PageNumber.CURRENT], 
                      size: 26, // 13 * 2 = 26
                      font: 'David' 
                    })
                  ]
                })
              ]
            })
          },
          children: paragraphs
        }]
      });

      // יצירת בלוב והורדה
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
      console.error('שגיאה בייצוא Word מקצועי:', error);
      setExportStatus(`❌ שגיאה בייצוא Word מקצועי`);
    } finally {
      setIsExporting(false);
    }
  };

  const generateWillContent = (data: any): string => {
    let content = '';
    
    if (data.type === 'mutual') {
      // כותרת צוואה הדדית
      content += 'צוואה הדדית\n\n';
      
      // פתיחה מקצועית
      content += `בהיות אין אדם יודע יום פקודתו.

אנו החתומים מטה, נשואים זה לזו כדת וכדין, מצהירים כי צוואה הדדית זו נערכת מתוך הסתמכות של כל אחד מאיתנו על הוראות הצוואה של האחר. בהיותנו סומכים ומסתמכים באופן הדדי זה על זו, ברצוננו לערוך צוואה הדדית בהתאם לסעיף 8א לחוק הירושה, תשכ"ה-1965, ועל כל המשתמע מכך בצוואה אחת והדדית בתוכנה, ביחס לרכושנו וכל אשר לנו, ולהביע בזה את רצוננו האחרון, ולפרט בה את הוראותינו על מה שיעשה ברכושנו אחרי פטירתנו, ורצוננו הוא שייתן לצוואה זו תוקף חוקי.

`;

      // פרטי בני הזוג
      content += `${data.testator?.fullName || '[שם בעל צוואה 1]'}, נושא${data.testator?.gender === 'female' ? 'ת' : ''} ת.ז. מס' ${data.testator?.id || '[מספר]'}, (להלן: "${data.testator?.shortName || '[כינוי 1]'}") מרח': ${data.testator?.address || '[כתובת מלאה]'}.

${data.spouse?.fullName || '[שם בעל צוואה 2]'}, נושא${data.spouse?.gender === 'female' ? 'ת' : ''} ת.ז. מס' ${data.spouse?.id || '[מספר]'}, (להלן: "${data.spouse?.shortName || '[כינוי 2]'}") מרח': ${data.spouse?.address || '[כתובת מלאה]'}.

בהיותנו בדעה צלולה וכשירים מכל הבחינות הדרושות על פי החוק ובידיעה ברורה את אשר אנו עושים, מצווים בזה מרצוננו הטוב והגמור בלא כל אונס, הכרח ואיום, ובלא השפעה מהזולת, תחבולה, או תרמית כדלקמן:

כללי

1. אנו נשואים משנת ${data.marriageYear || '1999'}, חיים יחד באושר ומקיימים האחד את השנייה.

2. למען הסר ספק, אנו מבטלים בזה ביטול גמור, כל צוואה ו/או הוראה שנתנו בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושנו ולנכסנו, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוננו שייעשה בעיזבוננו לאחר מותנו.

3. אנו מורים ליורשים אשר יבצעו את צוואתנו לשלם מתוך עיזבוננו האמור את כל חובותינו שיעמדו לפירעון בעת פטירתנו, הוצאות הבאתנו לארץ אם פטירתנו תהא בחו"ל והוצאות קבורתנו, כולל הקמת מצבה מתאימה על קברנו וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתנו.

4. כל עוד שנינו בחיים, לכל אחד מאיתנו נשמרת הזכות לבטל צוואה זו, על ידי הודעה בדבר הביטול בכתב לצד האחר. לא יהיה ניתן למסור הודעת ביטול, למי שהוכרז כי אינו מבין בדבר ומכאן, שבמצב זה לא ניתן להודיע על ביטול צוואה הדדית זו באופן חד צדדי.

היקף העיזבון

5. במקרה ומי מאיתנו ילך לבית עולמו לפני רעהו, הרי שכל רכושו מכל מין וסוג שהוא בין במקרקעין, בין במיטלטלין, זכויות, ניירות ערך למיניהם, קופות גמל, קרנות השתלמות, ביטוחי חיים, פיקדונות וכל צורה אחרת, בין שהם קיימים היום ואנו יודעים על קיומם ובין שאינם קיימים היום או שאיננו יודעים על קיומם ויהיו שייכים לנו בעתיד, כספים במזומן ובבנקים, שיש לנו היום ושיהיו לנו בעתיד, המצויים ו/או מוחזקים בידי כל אדם ו/או גוף, בישראל ובכל מקום אחר בעולם ולרבות כל שיתווסף בעתיד- יעבור לנותר בחיים מבין שנינו. בין אם מופקדים בבנק/ים ובין אם בידי כל גורם/גורמים אחר/ים, וכן על זכויות אחרות מכל סוג שהוא, ו/או כל רכוש אחר שיהיו קיימים לנו היום או שייכים לנו בעתיד, לרבות:

`;

    } else {
      // כותרת צוואת יחיד  
      content += 'צוואה\n\n';
      
      // פתיחה מקצועית
      content += `הואיל כי אין אדם יודע את יום פקודתו;

והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;

והואיל כי הנני למעלה מגיל שמונה עשרה שנים, ${data.testator?.gender === 'female' ? 'אזרחית ישראלית ותושבת' : 'אזרח ישראלי ותושב'} מדינת ישראל;

לפיכך אני הח"מ ${data.testator?.fullName || '[שם מלא]'}, (להלן: "${data.testator?.shortName || '[כינוי]'}") ת"ז ${data.testator?.id || '[מספר]'}. מרחוב: ${data.testator?.address || '[כתובת מלאה]'} לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, הנני מצווה בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת ${data.testator?.gender === 'female' ? 'עליי' : 'עלי'} מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, ${data.testator?.gender === 'female' ? 'קובעת ומצהירה' : 'קובע ומצהיר'} כמפורט להלן:

כללי

1. למען הסר ספק, אני ${data.testator?.gender === 'female' ? 'מבטלת' : 'מבטל'} בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה ${data.testator?.gender === 'female' ? 'שנתתי' : 'שנתתי'} בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוני שייעשה בעיזבוני לאחר מותי.

2. אני ${data.testator?.gender === 'female' ? 'מורה' : 'מורה'} ליורש${data.testator?.gender === 'female' ? 'יי' : 'יי'} אשר יבצעו את צוואתי לשלם מתוך עיזבוני האמור את כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.

3. צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים.

היקף העיזבון

4. כל רכוש מכל מין וסוג שהוא בין במקרקעין בין מיטלטלין, לרבות זכויות מכל סוג שהוא ו/או כל רכוש אחר (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או בהווה ו/או יגיעו לידיי בעתיד, לרבות:

`;
    }

    // נכסי מקרקעין - עם מספור 4.1, 4.2... ובהתאמה לסוג הצוואה
    if (data.properties && data.properties.length > 0) {
      data.properties.forEach((property: any, index: number) => {
        const sectionNumber = data.type === 'mutual' ? '5' : '4';
        const propertyText = data.type === 'mutual' 
          ? `זכויות בדירה הרשומה בטאבו ${property.address || '[כתובת]'}, בעיר ${property.city || '[עיר]'}, הידועה כגוש: ${property.block || '[מספר]'}, חלקה: ${property.plot || '[מספר]'}, תת חלקה: ${property.subPlot || '[מספר]'} (להלן: "${property.name || 'דירת המגורים'}") וכן את מטלטליה בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע.`
          : `זכויות בדירה הרשומה בטאבו ${property.address || '[כתובת]'}, בעיר ${property.city || '[עיר]'}, הידועה כגוש: ${property.block || '[מספר]'}, חלקה: ${property.plot || '[מספר]'}, תת חלקה: ${property.subPlot || '[מספר]'} (להלן: "${property.name || 'דירת המגורים'}") וכן את מטלטליה בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע.`;
        
        content += `${sectionNumber}.${index + 1}. ${propertyText}

`;
      });
    }

    // חשבונות בנק - עם מספור רציף אחרי הנכסים
    const mainSectionNum = data.type === 'mutual' ? 5 : 4;
    let subSectionNumber = (data.properties?.length || 0) + 1;
    if (data.bankAccounts && data.bankAccounts.length > 0) {
      data.bankAccounts.forEach((account: any, index: number) => {
        const bankText = data.type === 'mutual'
          ? `חשבון הבנק המנוהל על שמנו בבנק ${account.bank || '[שם הבנק]'}, סניף מספר ${account.branch || '[מספר]'}, חשבון מספר ${account.accountNumber || '[מספר]'}, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.`
          : `חשבון הבנק המנוהל על שמי בבנק ${account.bank || '[שם הבנק]'}, סניף מספר ${account.branch || '[מספר]'}, חשבון מספר ${account.accountNumber || '[מספר]'}, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.`;
        
        content += `${mainSectionNum}.${subSectionNumber}. ${bankText}

`;
        subSectionNumber++;
      });
    }

    // כספים במזומן - עם מספור המשך
    const cashText = data.type === 'mutual'
      ? `את כלל הכספים במזומן הנמצאים ברשותנו, לרבות שטרות כסף המוחזקים בביתנו, בכספת או בכל מקום אחר.`
      : `את כלל הכספים במזומן הנמצאים ברשותי, לרבות שטרות כסף המוחזקים בביתי, בכספת או בכל מקום אחר.`;
    
    content += `${mainSectionNum}.${subSectionNumber}. ${cashText}

`;

    // יורשים
    if (data.type === 'mutual') {
      content += `הוראות חלוקת העיזבון

6. במקרה בו שנינו נלך לבית עולמנו בעת ובעונה אחת או לאחר פטירתו של זה מאיתנו שיאריך חיים מביננו, הננו קובעים ומצווים כי כל רכושנו, המצוין לעיל, יעבור ליורשינו בחלוקה כמפורט להלן:

`;
    } else {
      content += `חלוקת העיזבון

5. הנני ${data.testator?.gender === 'female' ? 'מצווה ומורישה' : 'מצווה ומוריש'} ליורשיי בחלקים שווים כמפורט להלן:

`;
    }

    // רשימת יורשים - בהתאם לבחירה
    if (data.heirs && data.heirs.length > 0) {
      if (data.heirsDisplayMode === 'table') {
        // תצוגת טבלה - נשמור את זה לעכשיו כטקסט פשוט
        content += `טבלת היורשים:

`;
        
        data.heirs.forEach((heir: any, index: number) => {
          const fullName = `${heir.firstName || ''} ${heir.lastName || ''}`.trim() || '[שם]';
          const id = heir.id || '[ת.ז]';
          const relation = heir.relation || '[קרבה]';
          const share = heir.share || `1/${data.heirs.length}`;
          const heirsSectionNum = data.type === 'mutual' ? 6 : 5;
          
          content += `${heirsSectionNum}.${index + 1}. ${fullName} | ת.ז: ${id} | קרבה: ${relation} | חלק: ${share}

`;
        });
      } else {
        // תצוגת רשימה מפורטת (ברירת מחדל)
        const heirsSectionNum = data.type === 'mutual' ? 6 : 5;
        data.heirs.forEach((heir: any, index: number) => {
          const fullName = `${heir.firstName || '[שם פרטי]'} ${heir.lastName || '[שם משפחה]'}`;
          const id = heir.id || '[מספר ת.ז]';
          const relation = heir.relation || '[קרבת משפחה]';
          const share = heir.share || `1/${data.heirs.length}`;
          
          content += `${heirsSectionNum}.${index + 1}. ${fullName}, ת.ז. ${id}, ${relation}, חלק: ${share}

`;
        });
      }
    }

    // סעיפים נוספים מהמחסן
    if (data.customSections && data.customSections.length > 0) {
      const startingSectionNum = data.type === 'mutual' ? 7 : 6;
      data.customSections.forEach((section: any, index: number) => {
        let sectionContent = section.content;
        
        // המרה לרבים אם זו צוואה הדדית
        if (data.type === 'mutual') {
          sectionContent = sectionContent
            .replace(/\bאני\b/g, 'אנחנו')
            .replace(/\bשלי\b/g, 'שלנו')
            .replace(/\bרכושי\b/g, 'רכושנו')
            .replace(/\bנכסיי\b/g, 'נכסינו')
            .replace(/\bיורשיי\b/g, 'יורשינו')
            .replace(/\bהנני\b/g, 'הננו')
            .replace(/\bמצווה\b/g, 'מצווים')
            .replace(/\bמוריש\b/g, 'מורישים')
            .replace(/\bקובע\b/g, 'קובעים')
            .replace(/\bמציין\b/g, 'מציינים')
            .replace(/\bמבהיר\b/g, 'מבהירים')
            .replace(/\bממנה\b/g, 'ממנים')
            .replace(/\bמבקש\b/g, 'מבקשים')
            .replace(/\bברצוני\b/g, 'ברצוננו')
            .replace(/\bפטירתי\b/g, 'פטירתנו')
            .replace(/\bמותי\b/g, 'מותנו')
            .replace(/\bעיזבוני\b/g, 'עיזבוננו')
            .replace(/\bצוואתי\b/g, 'צוואתנו')
            .replace(/\bהוראותיי\b/g, 'הוראותינו');
        }
        
        content += `${startingSectionNum + index}. ${sectionContent}

`;
      });
    }

    // סעיפי סיום סטנדרטיים
    const nextSection = data.type === 'mutual' ? 8 : 7;
    const finalSectionStart = nextSection + (data.customSections?.length || 0);
    
    if (data.type === 'mutual') {
      content += `${finalSectionStart}. במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתנו, חלקו יעבור ליורשיו החוקיים.

${finalSectionStart + 1}. כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד.

${finalSectionStart + 2}. הננו מצווים, כי ביצוע וקיום צוואה זו יהא ברוח טובה בשיתוף פעולה הדדי בין היורשים.

${finalSectionStart + 3}. ולראיה באנו על החתום מרצוננו הטוב והחופשי, בהיותנו בדעה צלולה ולאחר שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר שהצהרנו בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתנו.`;
    } else {
      content += `${finalSectionStart}. במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.

${finalSectionStart + 1}. כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד.

${finalSectionStart + 2}. הנני מצווה, כי ביצוע וקיום צוואה זו יהא ברוח טובה בשיתוף פעולה הדדי בין היורשים.

${finalSectionStart + 3}. ולראיה באתי על החתום מרצוני הטוב והחופשי, בהיותי בדעה צלולה ולאחר שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר שהצהרתי בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתי.`;
    }

    content += `
חתימות

נחתם בעיר: ${data.willDate?.city || '[עיר]'}, היום ${data.willDate?.day || '[תאריך]'} בחודש ${data.willDate?.month || '[חודש]'}, ${data.willDate?.year || '[שנה]'}.

`;

    // חתימות
    if (data.type === 'mutual' && data.spouse) {
      content += `${data.testator?.fullName || '[שם 1]'}                    ${data.spouse?.fullName || '[שם 2]'}
________________                    ________________

`;
    } else {
      content += `${data.testator?.fullName || '[שם מלא המצווה]'}
________________

`;
    }

    // עדים
    content += `עדים

אנו הח"מ:

`;

    if (data.witnesses && data.witnesses.length >= 2) {
      data.witnesses.forEach((witness: any, index: number) => {
        content += `${index + 1}. ${witness.name || '[שם מלא עד]'}, ת.ז. ${witness.id || '[מספר]'}, מרחוב: ${witness.address || '[כתובת מלאה]'}

`;
      });
    } else {
      content += `1. [שם מלא עד 1], ת.ז. [מספר], מרחוב: [כתובת מלאה]

2. [שם מלא עד 2], ת.ז. [מספר], מרחוב: [כתובת מלאה]

`;
    }

    content += `אנו מעיד${data.witnesses && data.witnesses.length > 1 && data.witnesses[0].name?.includes('ה') ? 'ות' : 'ים'} בזאת שהמצווה: ${data.testator?.fullName || '[שם מלא]'}, נושא${data.testator?.gender === 'female' ? 'ת' : ''} ת"ז מס' ${data.testator?.id || '[מספר]'}, ${data.testator?.gender === 'female' ? 'חתמה' : 'חתם'} בפנינו ${data.testator?.gender === 'female' ? 'מרצונה' : 'מרצונו'} הטוב והחופשי והצהיר${data.testator?.gender === 'female' ? 'ה' : ''} כי זו צוואת${data.testator?.gender === 'female' ? 'ה' : 'ו'}.

אנו מצהיר${data.witnesses && data.witnesses.length > 1 && data.witnesses[0].name?.includes('ה') ? 'ות' : 'ים'} כי אנו לא קטינים ולא פסולי דין וכי אין לאף אחד מאיתנו כל טובת הנאה בעיזבון של המצווה. אנו חותמ${data.witnesses && data.witnesses.length > 1 && data.witnesses[0].name?.includes('ה') ? 'ות' : 'ים'} בתור עדים לצוואה בנוכחות${data.testator?.gender === 'female' ? 'ה' : 'ו'} של המצווה ובנוכחות כל אחד מאיתנו.

ולראיה באנו על החתום היום: ${data.willDate?.day || '[תאריך]'} בחודש ${data.willDate?.month || '[חודש]'}, ${data.willDate?.year || '[שנה]'}

`;

    // חתימות עדים
    if (data.witnesses && data.witnesses.length >= 2) {
      content += `${data.witnesses[0].name || '[שם עד 1]'}               ${data.witnesses[1].name || '[שם עד 2]'}
________________               ________________
   עד ראשון                        עד שני

`;
    } else {
      content += `[שם עד 1]               [שם עד 2]
________________               ________________
   עד ראשון                        עד שני

`;
    }

    // הערת עורך דין
    if (data.lawyerName) {
      content += `צוואה זו נערכה ונחתמה ב${data.willDate?.city || '[עיר]'}, במשרדו של ${data.lawyerName}`;
    }

    return content;
  };

  const isFormValid = () => {
    return willData.testator?.fullName && 
           willData.testator?.id && 
           willData.properties?.length > 0 &&
           willData.heirs?.length > 0 &&
           willData.witnesses?.length >= 2;
  };

  return (
    <div className={`${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-900">ייצוא Word מקצועי עם כל הסעיפים</h3>
        </div>

        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">🎯 תכונות מקצועיות - מבוסס על תבניות קלוד:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ <strong>טקסטים מדויקים</strong> - לפי התבניות המקצועיות</li>
            <li>✅ <strong>נטיות מגדר</strong> - זכר/נקבה אוטומטי בכל מקום</li>
            <li>✅ <strong>מבנה מספור</strong> - 1,2,3 עם א,ב,ג</li>
            <li>✅ <strong>כותרות עליונות</strong> - מספר עמודים והעתקים</li>
            <li>✅ <strong>פונט David RTL</strong> - עיצוב מקצועי מלא</li>
            <li>✅ <strong>נתוני נכסים מפורטים</strong> - גוש, חלקה, תת-חלקה</li>
            <li>✅ <strong>אזורי חתימה</strong> - מצווה ועדים מעוצבים</li>
          </ul>
        </div>

        {!isFormValid() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-1" />
              <div className="text-sm text-yellow-800">
                <div className="font-bold">נתונים חסרים:</div>
                <div>יש למלא: שם מצווה, ת.ז, לפחות נכס אחד, יורש אחד, ושני עדים.</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={exportToWord}
          disabled={isExporting || !isFormValid()}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 font-bold text-lg shadow-xl"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>יוצר צוואה מקצועית...</span>
            </>
          ) : (
            <>
              <FileDown className="w-6 h-6" />
              <span>ייצוא צוואה מקצועית ל-Word</span>
            </>
          )}
        </button>

        {exportStatus && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-center">
            {exportStatus}
          </div>
        )}
      </div>
    </div>
  );
}