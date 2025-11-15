'use client';

import { useState } from 'react';
import { detectGenderFromName, replaceTextWithGender } from '@/lib/hebrew-gender';

interface ProfessionalFeeAgreementExporterProps {
  agreementData: {
    lawyer: {
      name: string;
      license: string;
      address: string;
      phone: string;
      email: string;
      gender: 'male' | 'female';
    };
    clients: Array<{
      id: string;
      name: string;
      idNumber: string;
      address: string;
      phone: string;
      email: string;
      gender: 'male' | 'female';
    }>;
    case: {
      subject: string;
    };
    fees: {
      type: 'סכום_כולל' | 'מקדמה_והצלחה' | 'סכום_ואחוזים';
      totalAmount?: string;
      paymentStructure?: string;
      advancePayment?: string;
      successPercentage?: string;
      fixedAmount?: string;
      stages?: string;
    };
    terms: {
      paymentTerms: string;
      expensesCoverage: string;
      terminationClause: string;
      specialConditions: string;
    };
    customSections?: Array<{
      title: string;
      content: string;
    }>;
    serviceCategories?: {
      [key: string]: {
        serviceName: string;
        clauses: Array<{
          id: string;
          title: string;
          text: string;
          subSections?: Array<{
            title: string;
            text: string;
            subSubSections?: Array<{
              title: string;
              text: string;
            }>;
          }>;
        }>;
      };
    };
    generalClauses?: {
      [key: string]: Array<{
        id: string;
        title: string;
        text: string;
        subSections?: Array<{
          title: string;
          text: string;
        }>;
      }>;
    };
    selectedServiceType?: string;
  };
  agreementDate: {
    day: string;
    month: string;
    year: string;
  };
  className?: string;
}

export default function ProfessionalFeeAgreementExporter({
  agreementData,
  agreementDate,
  className = ''
}: ProfessionalFeeAgreementExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // פונקציה לזיהוי המגדר הכולל של הלקוחות
  const getClientsGender = () => {
    if (agreementData.clients.length === 0) return 'male';
    if (agreementData.clients.length === 1) {
      return agreementData.clients[0].gender;
    }
    
    // אם יש יותר מלקוח אחד - בדוק אם כולם מאותו מגדר
    const genders = agreementData.clients.map(c => c.gender);
    const uniqueGenders = [...new Set(genders)];
    
    if (uniqueGenders.length === 1) {
      // כולם מאותו מגדר - החזר אותו מגדר
      return uniqueGenders[0];
    } else {
      // יש גברים ונשים - החזר 'plural' (רבים)
      return 'plural';
    }
  };

  // פונקציה לקבלת הטקסט הנכון לפי מגדר
  const getGenderText = (maleText: string, femaleText: string, pluralText: string) => {
    // אם יש יותר מלקוח אחד - תמיד רבים
    if (agreementData.clients.length > 1) {
      return pluralText;
    }
    
    const gender = getClientsGender();
    switch (gender) {
      case 'male': return maleText;
      case 'female': return femaleText;
      case 'plural': return pluralText;
      default: return maleText;
    }
  };

  // פונקציה להחלפת משתני מגדר
  const applyGenderToText = (text: string) => {
    const clientsGender = getClientsGender();
    
    // טיפול בפורמט: {{gender:זכר|נקבה|רבים}}
    let result = text.replace(/\{\{gender:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (match, male, female, plural) => {
      if (male.includes('מצווה') || female.includes('מצווה') || plural.includes('מצווים')) {
        switch (clientsGender) {
          case 'male': return 'הלקוח';
          case 'female': return 'הלקוחה';
          case 'plural': return 'הלקוחות';
          default: return 'הלקוח';
        }
      }
      switch (clientsGender) {
        case 'male': return male;
        case 'female': return female;
        case 'plural': return plural;
        default: return male;
      }
    });
    
    // טיפול במשתנה {{לקוח}}
    result = result.replace(/ה?\{\{לקוח\}\}/g, (match) => {
      const hasHey = match.startsWith('ה');
      const replacement = hasHey ? 
        (clientsGender === 'plural' ? 'הלקוחות' : (clientsGender === 'female' ? 'הלקוחה' : 'הלקוח')) : 
        (clientsGender === 'plural' ? 'לקוחות' : (clientsGender === 'female' ? 'לקוחה' : 'לקוח'));
      return replacement;
    });
    
    // טיפול במשתנה {{צד}}
    result = result.replace(/ה?\{\{צד\}\}/g, (match) => {
      const hasHey = match.startsWith('ה');
      const replacement = hasHey ? 
        (clientsGender === 'plural' ? 'הצדדים' : 'הצד') : 
        (clientsGender === 'plural' ? 'צדדים' : 'צד');
      return replacement;
    });
    
    return result;
  };

  // פונקציה לבניית מבנה היררכי מסעיפים שטוחים
  const buildHierarchicalSections = (flatSections: any[]) => {
    if (!flatSections || flatSections.length === 0) return [];
    
    // פונקציה עזר לקבלת order (תומך גם ב-order_index מ-Supabase וגם ב-order מקומי)
    const getOrder = (section: any) => section.order_index !== undefined ? section.order_index : (section.order || 0);
    
    // מיין את כל הסעיפים לפי order
    const sortedSections = [...flatSections].sort((a, b) => getOrder(a) - getOrder(b));
    
    // מצא את כל הסעיפים הראשיים ומיין אותם
    const mainSections = sortedSections
      .filter(s => s.level === 'main')
      .sort((a, b) => getOrder(a) - getOrder(b));
    
    // בנה מבנה היררכי
    return mainSections.map(mainSection => {
      const result: any = {
        id: mainSection.id,
        title: mainSection.title,
        text: mainSection.content || mainSection.title,
        content: mainSection.content || mainSection.title,
        subSections: []
      };
      
      // מצא את כל התתי סעיפים של הסעיף הראשי הזה ומיין לפי order
      const subSections = sortedSections
        .filter(s => s.level === 'sub' && (s.parentId === mainSection.id || s.parent_id === mainSection.id))
        .sort((a, b) => getOrder(a) - getOrder(b));
      
      // בנה את התתי סעיפים עם תתי תתי סעיפים
      result.subSections = subSections.map(subSection => {
        const subResult: any = {
          id: subSection.id,
          title: subSection.title,
          text: subSection.content || subSection.title,
          content: subSection.content || subSection.title,
          subSubSections: []
        };
        
        // מצא את כל התתי תתי סעיפים של התת-סעיף הזה ומיין לפי order
        const subSubSections = sortedSections
          .filter(s => s.level === 'sub-sub' && (s.parentId === subSection.id || s.parent_id === subSection.id))
          .sort((a, b) => getOrder(a) - getOrder(b));
        
        subResult.subSubSections = subSubSections.map(subSubSection => ({
          id: subSubSection.id,
          title: subSubSection.title,
          text: subSubSection.content || subSubSection.title,
          content: subSubSection.content || subSubSection.title
        }));
        
        return subResult;
      });
      
      return result;
    });
  };

  // פונקציה ליצירת טקסט שכר טרחה דינמי
  const generateFeeText = () => {
    const { fees } = agreementData;
    if (!fees || !fees.type) return '';
    
    const formatAmount = (amount: string) => {
      if (!amount) return '_______';
      const num = parseInt(amount.replace(/[^\d]/g, ''));
      return num ? num.toLocaleString('he-IL') : '_______';
    };
    
    switch (fees.type) {
      case 'סכום_כולל':
        return `בעד השירות המשפטי יעמוד על סך של ${formatAmount(fees.totalAmount || '')} ש"ח בתוספת מע"מ כחוק, ${fees.paymentStructure || 'ישולם במלואו במעמד החתימה על הסכם שכר טרחה זה'}.`;
      
      case 'מקדמה_והצלחה':
        return `בעד השירות המשפטי יעמוד על מקדמה בסך ${formatAmount(fees.advancePayment || '')} ש"ח בתוספת מע"מ כחוק, ו-${fees.successPercentage || '___'}% מהסכום שיתקבל בפועל. המקדמה ישולמה במעמד החתימה על הסכם זה, והאחוז ישולם עם קבלת התשלום מהצד שכנגד.`;
      
      case 'סכום_ואחוזים':
        return `בעד השירות המשפטי יעמוד על סכום קבוע של ${formatAmount(fees.fixedAmount || '')} ש"ח בתוספת מע"מ כחוק, ו-${fees.successPercentage || '___'}% מכל סכום שיתקבל בפועל מהזכייה.`;
      
      default:
        return 'ייקבע בהתאם לסוג השירות ויובא לידיעת הלקוח.';
    }
  };

  const exportToWord = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
              AlignmentType, WidthType, BorderStyle, LevelFormat, Header, Footer } = await import('docx');

      // קבועים
      const SIZES = {
        title: 32,
        normal: 24,
        small: 20
      };

      const SPACING = {
        line: 300,
        beforeTitle: 400,
        afterTitle: 200,
        beforeHeading: 300,
        afterHeading: 200,
        beforeParagraph: 120,
        afterParagraph: 120
      };

      const COLORS = {
        black: '000000',
        gray: '666666'
      };

      // קביעת המגדר הכולל של הלקוחות
      const clientsGender = getClientsGender();
      
      // פונקציה ליצירת פסקאות מסעיף עם המספור הנכון
      const createSectionParagraphs = (section: any, level: number = 0) => {
        const paragraphs = [];
        
        // פונקציה להסרת הכותרת מהטקסט אם היא מופיעה בהתחלה
        const removeTitle = (text: string, title: string) => {
          if (!text || !title) return text;
          // הסרת רווחים מיותרים ובדיקה אם הטקסט מתחיל עם הכותרת
          const cleanText = text.trim();
          const cleanTitle = title.trim();
          if (cleanText.startsWith(cleanTitle)) {
            // הסר את הכותרת והחזר את השאר (ללא רווח בהתחלה)
            return cleanText.substring(cleanTitle.length).trim();
          }
          return text;
        };
        
        // תוכן הסעיף בלבד (ללא כותרת)
        if (section.text || section.content) {
          const content = section.text || section.content || '';
          // שלב 1: החלפת משתני מגדר מיוחדים {{gender:זכר|נקבה|רבים}} ו-{{לקוח}}
          const withGenderVars = applyGenderToText(content);
          // שלב 2: החלפת כל הטקסט לפי מגדר (פעלים, תארים וכו')
          let withFullGender = replaceTextWithGender(withGenderVars, clientsGender);
          // שלב 3: הסרת "-ל" שהוספנו כדי למנוע החלפת "עד" למגדר
          withFullGender = withFullGender.replace(/עד-ל\s+/g, 'עד ');
          
          paragraphs.push(
            new Paragraph({
              numbering: { reference: "main-numbering", level: level },
              alignment: AlignmentType.BOTH,
              bidirectional: true,
              spacing: { 
                before: level === 0 ? SPACING.beforeHeading : SPACING.beforeParagraph,
                after: SPACING.afterParagraph,
                line: SPACING.line
              },
              children: [
                new TextRun({
                  text: withFullGender,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            })
          );
        }
        
        // תתי-סעיפים (subSections) - עובר על כל תת-סעיף ומטפל גם ב-subSubSections שלו
        if (section.subSections && Array.isArray(section.subSections)) {
          section.subSections.forEach((subSection: any) => {
            // תוכן תת-הסעיף
            if (subSection.text || subSection.content) {
              const subContent = subSection.text || subSection.content || '';
              // שלב 1: החלפת משתני מגדר מיוחדים
              const withGenderVars = applyGenderToText(subContent);
              // שלב 2: החלפת כל הטקסט לפי מגדר
              let withFullGender = replaceTextWithGender(withGenderVars, clientsGender);
              // שלב 3: הסרת "-ל" שהוספנו כדי למנוע החלפת "עד" למגדר
              withFullGender = withFullGender.replace(/עד-ל\s+/g, 'עד ');
              
              paragraphs.push(
                new Paragraph({
                  numbering: { reference: "main-numbering", level: level + 1 },
                  alignment: AlignmentType.BOTH,
                  bidirectional: true,
                  spacing: { 
                    before: SPACING.beforeParagraph,
                    after: SPACING.afterParagraph,
                    line: SPACING.line
                  },
                  children: [
                    new TextRun({
                      text: withFullGender,
                      font: 'David',
                      rightToLeft: true,
                      size: SIZES.normal
                    })
                  ]
                })
              );
            }
            
            // תתי-תתי-סעיפים (subSubSections) של תת-הסעיף הזה
            if (subSection.subSubSections && Array.isArray(subSection.subSubSections)) {
              subSection.subSubSections.forEach((subSubSection: any) => {
                if (subSubSection.text || subSubSection.content) {
                  const subSubContent = subSubSection.text || subSubSection.content || '';
                  // הסרת הכותרת אם היא מופיעה בתחילת הטקסט
                  const contentWithoutTitle = removeTitle(subSubContent, subSubSection.title);
                  // שלב 1: החלפת משתני מגדר מיוחדים
                  const withGenderVars = applyGenderToText(contentWithoutTitle);
                  // שלב 2: החלפת כל הטקסט לפי מגדר
                  let withFullGender = replaceTextWithGender(withGenderVars, clientsGender);
                  // שלב 3: הסרת "-ל" שהוספנו כדי למנוע החלפת "עד" למגדר
                  withFullGender = withFullGender.replace(/עד-ל\s+/g, 'עד ');
                  
                  paragraphs.push(
                    new Paragraph({
                      numbering: { reference: "main-numbering", level: level + 2 },
                      alignment: AlignmentType.BOTH,
                      bidirectional: true,
                      spacing: { 
                        before: SPACING.beforeParagraph,
                        after: SPACING.afterParagraph,
                        line: SPACING.line
                      },
                      children: [
                        new TextRun({
                          text: withFullGender,
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })
                      ]
                    })
                  );
                }
              });
            }
          });
        }
        
        return paragraphs;
      };

      // יצירת הואילים
      const clientGenderText = getGenderText('הלקוח', 'הלקוחה', 'הלקוחות');
      const whereas = [
        `ו${agreementData.lawyer.name} הינו עורך דין בעל רישיון לעריכת דין בישראל;`,
        `${clientGenderText} ${getGenderText('פנה', 'פנתה', 'פנו')} אל עורך הדין בבקשה לקבל ייצוג משפטי;`,
        `עורך הדין הסכים לייצג את ${clientGenderText} בתנאים המפורטים להלן;`
      ];

      // יצירת המסמך
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "main-numbering",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.DECIMAL,
                  text: "%1.",
                  alignment: AlignmentType.RIGHT,
                  style: {
                    paragraph: {
                      indent: { left: 720, hanging: 360 }
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
                  text: "%1.%2.",
                  alignment: AlignmentType.RIGHT,
                  style: {
                    paragraph: {
                      indent: { left: 1080, hanging: 360 }
                    },
                    run: {
                      font: 'David',
                      size: SIZES.normal,
                      rightToLeft: true
                    }
                  }
                },
                {
                  level: 2,
                  format: LevelFormat.DECIMAL,
                  text: "%1.%2.%3.",
                  alignment: AlignmentType.RIGHT,
                  style: {
                    paragraph: {
                      indent: { left: 1440, hanging: 360 }
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
          children: [
            // כותרת מרכזית
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: SPACING.afterTitle },
              children: [
                new TextRun({
                  text: "הסכם שכר טרחה",
                  bold: true,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.title
                })
              ]
            }),
            
            // תאריך
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: SPACING.afterHeading },
              children: [
                new TextRun({
                  text: `נערך ביום ${agreementDate.day} לחודש ${agreementDate.month} שנת ${agreementDate.year}`,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ טבלה 1: בין עורך הדין לבין הלקוחות (2 עמודות)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: [
                // שורה ראשונה: עורך הדין
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
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
                              text: agreementData.lawyer.name,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: agreementData.lawyer.address,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `טלפון: ${agreementData.lawyer.phone}`,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `דוא"ל: ${agreementData.lawyer.email}`,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: '(להלן: "עורך הדין")',
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: "בין",
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
                
                // שורה ריקה
                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 2,
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
                }),
                
                // שורה שנייה: הלקוחות
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        ...agreementData.clients.flatMap((client, clientIndex) => [
                          ...(clientIndex > 0 ? [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              bidirectional: true,
                              children: [new TextRun("")]
                            })
                          ] : []),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: client.name,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: client.address,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: `טלפון: ${client.phone}`,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: `דוא"ל: ${client.email}`,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          ...(agreementData.clients.length === 1 && clientIndex === agreementData.clients.length - 1 ? [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              bidirectional: true,
                              children: [
                                new TextRun({
                                  text: `(להלן: "${clientGenderText}")`,
                                  font: 'David',
                                  rightToLeft: true,
                                  size: SIZES.normal
                                })
                              ]
                            })
                          ] : [])
                        ]),
                        ...(agreementData.clients.length > 1 ? [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: `(להלן: "${clientGenderText}")`,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          })
                        ] : [])
                      ]
                    }),
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: "לבין",
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
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ טבלה 2: הואילים (2 עמודות)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: whereas.map((whereasText, index) => 
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 85, type: WidthType.PERCENTAGE },
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
                              text: whereasText,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 15, type: WidthType.PERCENTAGE },
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
                              text: index === 0 ? "הואיל" : "והואיל",
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
              )
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ "לפיכך הוסכם"
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
              spacing: { after: SPACING.afterHeading },
              children: [
                new TextRun({
                  text: "לפיכך הוסכם, הותנה והוצהר בין הצדדים כדלקמן:",
                  bold: true,
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            }),
            
            // רווח
            new Paragraph({
              spacing: { before: SPACING.beforeHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ הסעיפים עם מספור נכון
            // סעיפים מותאמים אישית - בניית מבנה היררכי
            ...buildHierarchicalSections(agreementData.customSections || []).flatMap((section: any) => 
              createSectionParagraphs(section, 0)
            ),
            
            // סעיפים מקטגוריות השירותים
            ...(agreementData.serviceCategories && agreementData.selectedServiceType && (!agreementData.customSections || agreementData.customSections.length === 0) ? 
              (agreementData.serviceCategories[agreementData.selectedServiceType]?.clauses || [])
                .filter(clause => !clause.id.includes('_002') && !clause.id.includes('_003'))
                .flatMap(clause => createSectionParagraphs(clause, 0))
              : []),
            
            // סעיפים כלליים
            ...(agreementData.generalClauses && (!agreementData.customSections || agreementData.customSections.length === 0) ? 
              Object.values(agreementData.generalClauses).flatMap(categoryClauses => 
                categoryClauses.flatMap(clause => createSectionParagraphs(clause, 0))
              ) : []),
            
            // רווח לפני חתימות
            new Paragraph({
              spacing: { before: SPACING.beforeTitle, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // ✅ טבלה 3: חתימות (3 עמודות)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: [
                new TableRow({
                  children: [
                    // עמודת הלקוחות (שמאל)
                    ...agreementData.clients.map((client) => 
                      new TableCell({
                        width: { 
                          size: agreementData.clients.length === 1 ? 40 : 30, 
                          type: WidthType.PERCENTAGE 
                        },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.black },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE }
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: client.name,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          })
                        ]
                      })
                    ),
                    
                    // עמודת רווח
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
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
                    
                    // עמודת עורך הדין (ימין)
                    new TableCell({
                      width: { size: 40, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.black },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: `${agreementData.lawyer.name}, עורך הדין`,
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
          ]
        }]
      });

      // 💾 שמירה והורדה
      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      const a = document.createElement('a');
      a.href = url;
      a.download = `הסכם_שכר_טרחה_${agreementData.lawyer.name.replace(/\s+/g, '_')}_${new Date().getTime()}.docx`;
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

  const isFormValid = () => {
    return agreementData.lawyer.name && 
           agreementData.lawyer.license &&
           agreementData.clients.length > 0 &&
           agreementData.clients.every(c => c.name && c.idNumber) &&
           agreementData.case.subject;
  };

  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">מצב ההסכם</h3>
        <div className={`text-sm px-4 py-2 rounded-lg ${
          isFormValid() 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isFormValid() 
            ? '✅ כל הפרטים מולאו - מוכן לייצוא מקצועי!' 
            : '⚠️ יש למלא את כל השדות הנדרשים'}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={exportToWord}
          disabled={!isFormValid() || isExporting}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isFormValid() && !isExporting
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isExporting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              מייצא ל-Word...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              📄 ייצוא מקצועי ל-Word
            </div>
          )}
        </button>

        {exportStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            exportStatus.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {exportStatus}
          </div>
        )}
      </div>
    </div>
  );
}