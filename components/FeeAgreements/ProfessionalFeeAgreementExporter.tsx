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

  const exportToWord = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
              AlignmentType, WidthType, BorderStyle, LevelFormat } = await import('docx');

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
        line: 414  // 1.5 spacing (276 * 1.5)
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
                  indent: { left: 720, hanging: 360 },
                  rightToLeft: true
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
                  indent: { left: 1440, hanging: 360 },
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
                  indent: { left: 2160, hanging: 360 },
                  rightToLeft: true
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
              },
              paragraph: {
                spacing: { line: SPACING.line, lineRule: "auto" }
              }
            }
          }
        },
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
                  font: "David"
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
              bidirectional: true,
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
                          spacing: { line: 276 },
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
                          spacing: { line: 276 },
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
                          spacing: { line: 276 },
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
                          spacing: { line: 276 },
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
                          spacing: { line: 276 },
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
                          children: [
                            new TextRun({
                              text: "בין",
                              bold: true
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
                            spacing: { line: 276 },
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
                            spacing: { line: 276 },
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
                            spacing: { line: 276 },
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
                            spacing: { line: 276 },
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
                              spacing: { line: 276 },
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
                            children: [
                              new TextRun({
                                text: index === 0 ? "לבין" : "",
                                bold: true
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
              bidirectional: true,
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
                          spacing: { line: 317 },
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
                          spacing: { line: 317 },
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
                  bold: true
                })
              ]
            }),
            
            new Paragraph({
              spacing: { before: SPACING.beforeHeading },
              children: [new TextRun("")]
            }),
            
            // תוכן המסמך - סעיפים מה-JSON עם היררכיה מלאה
            // סעיפים מה-JSON עם תמיכה בהיררכיה
            ...(agreementData.customSections || []).flatMap((section: any) => {
              console.log('🔍 Exporting section:', section.title, 'subSections:', section.subSections, 'subSubSections:', section.subSubSections);
              const paragraphs = [];
              
              // פונקציה להחלפת משתני מגדר
              const applyGenderToText = (text: string) => {
                const clientsGender = getClientsGender();
                return text.replace(/\{\{gender:([^|]+)\|([^|]+)\|([^}]+)\}\}/g, (match, male, female, plural) => {
                  switch (clientsGender) {
                    case 'male': return male;
                    case 'female': return female;
                    case 'plural': return plural;
                    default: return male;
                  }
                });
              };
              
              // סעיף ראשי
              paragraphs.push(
                new Paragraph({
                  numbering: { reference: "main-numbering", level: 0 },
                  alignment: AlignmentType.BOTH,
                  bidirectional: true,
                  children: [
                    new TextRun({
                      text: applyGenderToText(section.content || section.title),
                      font: 'David',
                      rightToLeft: true,
                      size: SIZES.normal
                    })
                  ]
                })
              );
              
              // תת-סעיפים
              if (section.subSections && Array.isArray(section.subSections)) {
                section.subSections.forEach((subSection: any) => {
                  paragraphs.push(
                    new Paragraph({
                      numbering: { reference: "main-numbering", level: 1 },
                      alignment: AlignmentType.BOTH,
                      bidirectional: true,
                      children: [
                        new TextRun({
                          text: applyGenderToText(subSection.text || subSection.content || subSection.title),
                          font: 'David',
                          rightToLeft: true,
                          size: SIZES.normal
                        })
                      ]
                    })
                  );
                  
                  // תת-תת-סעיפים
                  if (subSection.subSubSections && Array.isArray(subSection.subSubSections)) {
                    subSection.subSubSections.forEach((subSubSection: any) => {
                      paragraphs.push(
                        new Paragraph({
                          numbering: { reference: "main-numbering", level: 2 },
                          alignment: AlignmentType.BOTH,
                          bidirectional: true,
                          children: [
                            new TextRun({
                              text: applyGenderToText(subSubSection.text || subSubSection.content || subSubSection.title),
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
              
              return paragraphs;
            }),
            
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
              bidirectional: true,
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
