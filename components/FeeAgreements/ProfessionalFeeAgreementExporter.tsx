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

  // פונקציה להחלפת משתני מגדר - תומכת בפורמט החדש של קלאוד
  const applyGenderToText = (text: string) => {
    const clientsGender = getClientsGender();
    
    // טיפול בפורמט החדש: {{gender:זכר|נקבה|רבים}}
    let result = text.replace(/\{\{gender:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (match, male, female, plural) => {
      // בהסכמי שכר טרחה, תמיד החזר "לקוח/לקוחה/לקוחות"
      if (male.includes('מצווה') || female.includes('מצווה') || plural.includes('מצווים')) {
        switch (clientsGender) {
          case 'male': return 'הלקוח';
          case 'female': return 'הלקוחה';
          case 'plural': return 'הלקוחות';
          default: return 'הלקוח';
        }
      }
      // אחרת, החזר לפי מגדר רגיל
      switch (clientsGender) {
        case 'male': return male;
        case 'female': return female;
        case 'plural': return plural;
        default: return male;
      }
    });
    
    // טיפול במשתנה {{לקוח}} - בלי או עם ה' הידיעה
    result = result.replace(/ה?\{\{לקוח\}\}/g, (match) => {
      const hasHey = match.startsWith('ה');
      const replacement = hasHey ? 
        (clientsGender === 'plural' ? 'הלקוחות' : (clientsGender === 'female' ? 'הלקוחה' : 'הלקוח')) : 
        (clientsGender === 'plural' ? 'לקוחות' : (clientsGender === 'female' ? 'לקוחה' : 'לקוח'));
      return replacement;
    });
    
    // טיפול במשתנה {{צד}} - בלי או עם ה' הידיעה
    result = result.replace(/ה?\{\{צד\}\}/g, (match) => {
      const hasHey = match.startsWith('ה');
      const replacement = hasHey ? 
        (clientsGender === 'plural' ? 'הצדדים' : 'הצד') : 
        (clientsGender === 'plural' ? 'צדדים' : 'צד');
      return replacement;
    });
    
    return result;
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
        return `שכר הטרחה בעד השירות המשפטי יעמוד על סך של ${formatAmount(fees.totalAmount || '')} ש"ח בתוספת מע"מ כחוק, ${fees.paymentStructure || 'ישולם במלואו במעמד החתימה על הסכם שכר טרחה זה'}.`;
      
      case 'מקדמה_והצלחה':
        return `שכר הטרחה בעד השירות המשפטי יעמוד על מקדמה בסך ${formatAmount(fees.advancePayment || '')} ש"ח בתוספת מע"מ כחוק, ו-${fees.successPercentage || '___'}% מהסכום שיתקבל בפועל. המקדמה ישולמה במעמד החתימה על הסכם זה, והאחוז ישולם עם קבלת התשלום מהצד שכנגד.`;
      
      case 'סכום_ואחוזים':
        return `שכר הטרחה בעד השירות המשפטי יעמוד על סכום קבוע של ${formatAmount(fees.fixedAmount || '')} ש"ח בתוספת מע"מ כחוק, ו-${fees.successPercentage || '___'}% מכל סכום שיתקבל בפועל מהזכייה.`;
      
      default:
        return 'שכר הטרחה ייקבע בהתאם לסוג השירות ויובא לידיעת הלקוח.';
    }
  };


  const exportToWord = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
              AlignmentType, WidthType, BorderStyle, LevelFormat, TextDirection, VerticalAlign, Header, Footer } = await import('docx');

      // פונקציה ליצירת פסקאות מסעיף
      const createSectionParagraphs = (section: any, level: number = 0) => {
        const paragraphs = [];
        
        // כותרת הסעיף (אם יש)
        if (section.title) {
          paragraphs.push(
            new Paragraph({
              numbering: { reference: "main-numbering", level: level },
              alignment: AlignmentType.BOTH,
              bidirectional: true,
              children: [
                new TextRun({
                  text: applyGenderToText(section.title),
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            })
          );
        }
        
        // תוכן הסעיף (אם יש)
        if (section.text) {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.BOTH,
              bidirectional: true,
              children: [
                new TextRun({
                  text: applyGenderToText(section.text),
                  font: 'David',
                  rightToLeft: true,
                  size: SIZES.normal
                })
              ]
            })
          );
        }
        
        // תת-סעיפים
        if (section.subSections && Array.isArray(section.subSections)) {
          section.subSections.forEach((subSection: any) => {
            // כותרת תת-סעיף (אם יש)
            if (subSection.title) {
              paragraphs.push(
                new Paragraph({
                  numbering: { reference: "main-numbering", level: level + 1 },
                  alignment: AlignmentType.BOTH,
                  bidirectional: true,
                  children: [
                    new TextRun({
                      text: applyGenderToText(subSection.title),
                      font: 'David',
                      rightToLeft: true,
                      size: SIZES.normal
                    })
                  ]
                })
              );
            }
            
            // תוכן תת-סעיף (אם יש)
            if (subSection.text) {
              paragraphs.push(
                new Paragraph({
                  alignment: AlignmentType.BOTH,
                  bidirectional: true,
                  children: [
                    new TextRun({
                      text: applyGenderToText(subSection.text),
                      font: 'David',
                      rightToLeft: true,
                      size: SIZES.normal
                    })
                  ]
                })
              );
            }
            
            // תת-תת-סעיפים
            if (subSection.subSubSections && Array.isArray(subSection.subSubSections)) {
              subSection.subSubSections.forEach((subSubSection: any) => {
                // כותרת תת-תת-סעיף (אם יש)
                if (subSubSection.title) {
                  paragraphs.push(
                    new Paragraph({
                      numbering: { reference: "main-numbering", level: level + 2 },
                      alignment: AlignmentType.BOTH,
                      bidirectional: true,
                      children: [
                        new TextRun({
                          text: applyGenderToText(subSubSection.title),
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })
                      ]
                    })
                  );
                }
                
                // תוכן תת-תת-סעיף (אם יש)
                if (subSubSection.text) {
                  paragraphs.push(
                    new Paragraph({
                      alignment: AlignmentType.BOTH,
                      bidirectional: true,
                      children: [
                        new TextRun({
                          text: applyGenderToText(subSubSection.text),
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

      // 🎯 הגדרת צבעים ומידות
      const COLORS = {
        black: '000000',
        gray: '666666',
        lightGray: 'F2F2F2',
        blue: '1F4E78'
      };

      const SIZES = {
        title: 32,      // 16pt
        subtitle: 26,   // 13pt
        normal: 24,     // 12pt
        small: 20       // 10pt
      };

      const SPACING = {
        beforeTitle: 480,
        afterTitle: 360,
        beforeHeading: 360,
        afterHeading: 240,
        betweenParagraphs: 240,
        line: 276  // 1.0 spacing
      };

      // 🔢 הגדרת מספור מקצועי
      const numberingConfig = [
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
                run: { bold: true }
              }
            },
            {
              level: 1,
              format: LevelFormat.DECIMAL,
              text: "%1.%2.",
              alignment: AlignmentType.RIGHT,
              style: {
                paragraph: {
                  indent: { left: 1440, hanging: 360 }
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
                  indent: { left: 2160, hanging: 360 }
                }
              }
            }
          ]
        }
      ];

      // 📋 יצירת רשימת הואילים עם מגדר נכון
      const clientsNames = agreementData.clients.map(c => c.name).join(' ו');
      const clientsGender = getClientsGender();
      
      const whereas = [
        `${agreementData.lawyer.name} הינו עורך דין בעל רישיון לעריכת דין בישראל;`,
        `${clientsNames} ${getGenderText('פנה', 'פנתה', 'פנו')} אל עורך הדין בבקשה לקבל ייצוג משפטי;`,
        `עורך הדין הסכים לייצג את ${clientsNames} בתנאים המפורטים להלן;`
      ];

      // 🏗️ בניית המסמך
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: { 
                font: "David", 
                size: SIZES.normal,
                rightToLeft: true
              }
            }
          }
        },
        creator: "מערכת תבניות משפטיות",
        title: "הסכם שכר טרחה",
        description: "הסכם שכר טרחה מקצועי",
        numbering: {
          config: numberingConfig
        },
        sections: [{
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
            }
          },
          children: [
            // כותרת ראשית
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 0 },
              bidirectional: true,
              children: [
                new TextRun({
                  text: "הסכם שכר טרחה",
                  bold: true,
                  size: SIZES.title,
                  font: "David",
                  rightToLeft: true
                })
              ]
            }),
            
            // כותרת משנה
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: SPACING.afterTitle },
              bidirectional: true,
              children: [
                new TextRun({
                  text: `נערך ביום ${agreementDate.day} לחודש ${agreementDate.month} שנת ${agreementDate.year}`,
                  size: SIZES.subtitle,
                  font: "David"
                })
              ]
            }),
            
            // טבלת הצדדים
            new Table({
              columnWidths: [7800, 2560],
              width: { size: 70, type: WidthType.PERCENTAGE },
              alignment: AlignmentType.CENTER,
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: [
                // שורה ראשונה - עורך הדין
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
                          spacing: { line: SPACING.line },
                          children: [
                            new TextRun({
                              text: agreementData.lawyer.name,
                              bold: true,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })
                          ]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          spacing: { line: SPACING.line },
                          children: [new TextRun({ 
                            text: agreementData.lawyer.address,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          spacing: { line: SPACING.line },
                          children: [new TextRun({
                            text: agreementData.lawyer.phone,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          spacing: { line: SPACING.line },
                          children: [new TextRun({
                            text: agreementData.lawyer.email,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })]
                        }),
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          bidirectional: true,
                          spacing: { line: SPACING.line },
                          children: [new TextRun({
                            text: `(להלן: "עורך הדין")`,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })]
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
                
                // שורת רווח
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
                          children: [new TextRun("")]
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
                          children: [new TextRun("")]
                        })
                      ]
                    })
                  ]
                }),
                
                // שורות הלקוחות - כל לקוח בנפרד וממוספר
                ...agreementData.clients.map((client, index) => 
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
                            spacing: { line: SPACING.line },
                            children: [
                              new TextRun({
                                text: `${index + 1}. ${client.name}`,
                                bold: true,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            spacing: { line: SPACING.line },
                            children: [new TextRun({
                              text: client.address,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            spacing: { line: SPACING.line },
                            children: [new TextRun({
                              text: client.phone,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                            spacing: { line: SPACING.line },
                            children: [new TextRun({
                              text: client.email,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })]
                          }),
                          // הוספת "להלן" רק אחרי הלקוח האחרון
                          ...(index === agreementData.clients.length - 1 ? [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              bidirectional: true,
                              spacing: { line: SPACING.line },
                              children: [new TextRun({
                                text: `(להלן: "${getGenderText('הלקוח', 'הלקוחה', 'הלקוחות')}")`,
                                font: 'David',
                                rightToLeft: true,
                                size: SIZES.normal
                              })]
                            })
                          ] : [])
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
                            alignment: AlignmentType.CENTER,
                            bidirectional: true,
                            children: [
                              new TextRun({
                                text: index === 0 ? "לבין" : "",
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
              ]
            }),
            
            // רווח לפני טבלת ההואילים
            new Paragraph({
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // טבלת הואילים
            new Table({
              columnWidths: [7800, 1560],
              width: { size: 100, type: WidthType.PERCENTAGE },
              alignment: AlignmentType.RIGHT,
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE }
              },
              rows: whereas.map((whereasText, index) => {
                return new TableRow({
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
                          spacing: { line: SPACING.line },
                          children: [new TextRun({
                            text: whereasText,
                            font: 'David',
                            rightToLeft: true,
                            size: SIZES.normal
                          })]
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
                          spacing: { line: SPACING.line },
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
                });
              })
            }),
            
            // רווח לפני תוכן המסמך
            new Paragraph({
              spacing: { before: SPACING.beforeHeading, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // פסקה מבוא
            new Paragraph({
              alignment: AlignmentType.CENTER,
              bidirectional: true,
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
            
            new Paragraph({
              spacing: { before: SPACING.beforeHeading },
              children: [new TextRun("")]
            }),
            
            // תוכן המסמך - סעיפים מה-JSON עם היררכיה מלאה
            // סעיפים מה-JSON עם תמיכה בהיררכיה
            
            
            // סעיפים מותאמים אישית (תאימות לאחור) - קודם
            ...(agreementData.customSections || []).flatMap((section: any) => 
              createSectionParagraphs(section, 0)
            ),
            
            // סעיפים מקטגוריות השירותים החדשות - רק הקטגוריה שנבחרה (אם אין סעיפים מותאמים)
            // מסנן סעיפי שכר טרחה שכבר מכוסים בסעיף הדינמי
            ...(agreementData.serviceCategories && agreementData.selectedServiceType && (!agreementData.customSections || agreementData.customSections.length === 0) ? 
              (agreementData.serviceCategories[agreementData.selectedServiceType]?.clauses || [])
                .filter(clause => !clause.id.includes('_002') && !clause.id.includes('_003')) // מסנן סעיפי שכר טרחה
                .flatMap(clause => createSectionParagraphs(clause, 0))
              : []),
            
            // סעיף שכר טרחה דינמי (אם יש נתונים)
            ...(agreementData.fees && agreementData.fees.type ? [
                new Paragraph({
                  numbering: { reference: "main-numbering", level: 0 },
                alignment: AlignmentType.BOTH,
                  bidirectional: true,
                  children: [
                    new TextRun({
                    text: "שכר טרחה",
                      font: 'David',
                      rightToLeft: true,
                      size: SIZES.normal
                    })
                  ]
              }),
                    new Paragraph({
                alignment: AlignmentType.BOTH,
                      bidirectional: true,
                      children: [
                        new TextRun({
                    text: generateFeeText(),
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })
                      ]
                    })
            ] : []),
            
            // סעיפים כללים (אם אין סעיפים מותאמים אישית שכוללים אותם)
            ...(agreementData.generalClauses && (!agreementData.customSections || agreementData.customSections.length === 0) ? 
              Object.values(agreementData.generalClauses).flatMap(categoryClauses => 
                categoryClauses.flatMap(clause => createSectionParagraphs(clause, 0))
              ) : []),
            
            // רווח לפני טבלת החתימות
            new Paragraph({
              spacing: { before: SPACING.beforeTitle, after: SPACING.afterHeading },
              children: [new TextRun("")]
            }),
            
            // טבלת חתימות דינמית
            new Table({
              columnWidths: agreementData.clients.length === 1 
                ? [3744, 1872, 3744] 
                : [...Array(agreementData.clients.length).fill(2500), 1250, 2500],
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
                    // עמודות הלקוחות (מצד שמאל)
                    ...agreementData.clients.map((client, index) => 
                    new TableCell({
                      width: { size: 2500, type: WidthType.DXA },
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
                            children: [new TextRun({
                              text: client.name,
                              font: 'David',
                              rightToLeft: true,
                              size: SIZES.normal
                            })]
                          })
                        ]
                      })
                    ),
                    // עמודת רווח
                    new TableCell({
                      width: { size: 1250, type: WidthType.DXA },
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
                    // עמודת עורך הדין (מצד ימין)
                      new TableCell({
                        width: { size: 2500, type: WidthType.DXA },
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
                          children: [new TextRun({
                            text: `${agreementData.lawyer.name}, עו"ד`,
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
