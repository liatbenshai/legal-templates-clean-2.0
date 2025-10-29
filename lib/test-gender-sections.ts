/**
 * 🧪 מערכת בדיקה ואימות לסעיפי הצוואות הדיפולטיביים
 * בודקת שכל הסעיפים עובדים נכון עם כל צירופי המגדר
 * 
 * VERSION: 1.0
 * תאריך: אוקטובר 2025
 */

import { 
  defaultWillSections, 
  getAllDefaultSections,
  ProfessionalWillSection 
} from './professional-will-texts';

import { 
  processDefaultWillSection,
  detectGenderFromName,
  processFullWillWithAutoGender,
  Gender
} from './hebrew-gender';

// נתוני בדיקה לדוגמה
export const testData = {
  // נתונים בסיסיים
  testator_full_name: 'דוד כהן',
  testator_id: '123456789',
  testator_city: 'תל אביב',
  testator_address: 'רחוב הרצל 10',
  testator_age: '45',
  spouse_full_name: 'שרה כהן',
  marriage_year: '2000',
  children_count: '3',
  children_list: 'יוסף, מרים ואביגיל',
  inheritance_percentage: '33.33',
  spouse_percentage: '50',
  children_percentage: '50',
  property_address: 'רחוב הרצל 10, תל אביב',
  
  // חשבונות בנק
  main_bank: 'בנק הפועלים',
  main_branch: '123',
  main_account: '456789',
  savings_bank: 'בנק לאומי',
  savings_account: '987654',
  
  // יורשים ספציפיים
  jewelry_heir: 'מרים כהן',
  documents_heir: 'יוסף כהן',
  photos_heir: 'אביגיל כהן',
  digital_heir: 'יוסף כהן',
  password_location: 'כספת הבית',
  password_keeper: 'עו"ד לוי',
  
  // מידע נוסף
  cemetery_name: 'בית הקברות הרצליה',
  plot_section: 'חלק א',
  ceremony_type: 'דתי',
  family_only: 'משפחה קרובה בלבד',
  organ_donation_choice: 'כן, לכל המטרות הרפואיות',
  gravestone_type: 'מצבה פשוטה מאבן שחורה',
  gravestone_inscription: 'דוד בן אברהם ז"ל - איש טוב ואוהב משפחה'
};

// נתוני בדיקה לנקבה
export const testDataFemale = {
  ...testData,
  testator_full_name: 'שרה לוי',
  testator_id: '987654321',
  spouse_full_name: 'דוד לוי',
  gravestone_inscription: 'שרה בת יצחק ז"ל - אם מסורה ואישה חכמה'
};

// נתוני בדיקה לרבים (זוג)
export const testDataPlural = {
  ...testData,
  testator_full_name: 'דוד ושרה כהן',
  testator_id: '123456789 ו-987654321',
  spouse_full_name: '', // לא רלוונטי לרבים
  gravestone_inscription: 'דוד ושרה כהן ז"ל - זוג אוהב ומסור'
};

/**
 * פונקציה לבדיקת סעיף יחיד עם כל המגדרים
 */
export function testSectionWithAllGenders(
  section: ProfessionalWillSection, 
  testVariables: Record<string, any> = testData
): {
  sectionId: string;
  title: string;
  results: {
    male: { success: boolean; content: string; error?: string };
    female: { success: boolean; content: string; error?: string };
    plural: { success: boolean; content: string; error?: string };
  };
  analysis: {
    genderPatternsFound: number;
    variablesUsed: string[];
    potentialIssues: string[];
  };
} {
  const results = {
    male: { success: false, content: '', error: undefined as string | undefined },
    female: { success: false, content: '', error: undefined as string | undefined },
    plural: { success: false, content: '', error: undefined as string | undefined }
  };

  const genders: Gender[] = ['male', 'female', 'plural'];
  
  // בדיקה עבור כל מגדר
  genders.forEach(gender => {
    try {
      const result = processDefaultWillSection(
        section.content,
        testVariables,
        gender
      );
      
      results[gender] = {
        success: true,
        content: result.trim()
      };
    } catch (error) {
      results[gender] = {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'שגיאה לא ידועה'
      };
    }
  });

  // ניתוח הסעיף
  const genderPatternsFound = (section.content.match(/{{gender:/g) || []).length;
  const variablesUsed = section.variables || [];
  const potentialIssues: string[] = [];

  // בדיקת בעיות פוטנציאליות
  if (genderPatternsFound === 0 && section.content.includes('אני')) {
    potentialIssues.push('הסעיף מכיל "אני" אבל אין דפוסי מגדר - ייתכן שצריך {{gender:...}}');
  }

  if (section.content.includes('/ת') || section.content.includes('/ה')) {
    potentialIssues.push('הסעיף מכיל דפוסים ישנים (/ת או /ה) - עדיף להשתמש ב-{{gender:...}}');
  }

  variablesUsed.forEach(variable => {
    if (!section.content.includes(`{{${variable}}}`)) {
      potentialIssues.push(`המשתנה "${variable}" מוגדר אבל לא משומש בתוכן`);
    }
  });

  // בדיקת משתנים חסרים
  const usedVariables = (section.content.match(/{{([^:}]+)}}/g) || [])
    .map(match => match.replace(/[{}]/g, ''))
    .filter(variable => !variable.startsWith('gender:'));
  
  usedVariables.forEach(variable => {
    if (!variablesUsed.includes(variable)) {
      potentialIssues.push(`המשתנה "${variable}" משומש בתוכן אבל לא מוגדר ברשימת המשתנים`);
    }
  });

  return {
    sectionId: section.id,
    title: section.title,
    results,
    analysis: {
      genderPatternsFound,
      variablesUsed,
      potentialIssues
    }
  };
}

/**
 * פונקציה לבדיקת כל הסעיפים הדיפולטיביים
 */
export function testAllDefaultSections(): {
  totalSections: number;
  successfulSections: number;
  failedSections: number;
  results: ReturnType<typeof testSectionWithAllGenders>[];
  summary: {
    sectionsWithIssues: number;
    commonIssues: Record<string, number>;
    genderCoverage: {
      male: number;
      female: number;
      plural: number;
    };
  };
} {
  const sections = getAllDefaultSections();
  const results: ReturnType<typeof testSectionWithAllGenders>[] = [];
  
  let successfulSections = 0;
  let failedSections = 0;
  const commonIssues: Record<string, number> = {};
  const genderCoverage = { male: 0, female: 0, plural: 0 };

  sections.forEach(section => {
    const testResult = testSectionWithAllGenders(section);
    results.push(testResult);

    // ספירת הצלחות וכישלונות
    const genderSuccesses = Object.values(testResult.results).filter(r => r.success).length;
    if (genderSuccesses === 3) {
      successfulSections++;
    } else {
      failedSections++;
    }

    // ספירת כיסוי מגדר
    Object.entries(testResult.results).forEach(([gender, result]) => {
      if (result.success) {
        genderCoverage[gender as keyof typeof genderCoverage]++;
      }
    });

    // ספירת בעיות נפוצות
    testResult.analysis.potentialIssues.forEach(issue => {
      const issueKey = issue.split(' - ')[0]; // קח את החלק הראשון של הבעיה
      commonIssues[issueKey] = (commonIssues[issueKey] || 0) + 1;
    });
  });

  return {
    totalSections: sections.length,
    successfulSections,
    failedSections,
    results,
    summary: {
      sectionsWithIssues: results.filter(r => r.analysis.potentialIssues.length > 0).length,
      commonIssues,
      genderCoverage
    }
  };
}

/**
 * פונקציה לבדיקת זיהוי מגדר אוטומטי
 */
export function testGenderDetection(): {
  testCases: Array<{
    name: string;
    expectedGender: Gender | null;
    detectedGender: Gender | null;
    success: boolean;
  }>;
  accuracy: number;
} {
  const testCases = [
    { name: 'דוד כהן', expectedGender: 'male' as Gender },
    { name: 'שרה לוי', expectedGender: 'female' as Gender },
    { name: 'מיכל רוזן', expectedGender: 'female' as Gender },
    { name: 'יוסף אברהם', expectedGender: 'male' as Gender },
    { name: 'רחל גולדברג', expectedGender: 'female' as Gender },
    { name: 'משה ישראלי', expectedGender: 'male' as Gender },
    { name: 'תמר בן דוד', expectedGender: 'female' as Gender },
    { name: 'אברהם יצחק', expectedGender: 'male' as Gender },
    { name: 'דבורה כהן', expectedGender: 'female' as Gender },
    { name: 'שלמה לוי', expectedGender: 'male' as Gender },
    { name: 'John Smith', expectedGender: null }, // שם לא עברי
    { name: '', expectedGender: null }, // שם ריק
    { name: 'א', expectedGender: null }, // שם קצר מדי
  ];

  const results = testCases.map(testCase => {
    const detectedGender = detectGenderFromName(testCase.name);
    const success = detectedGender === testCase.expectedGender;
    
    return {
      name: testCase.name,
      expectedGender: testCase.expectedGender,
      detectedGender,
      success
    };
  });

  const successfulTests = results.filter(r => r.success).length;
  const accuracy = (successfulTests / results.length) * 100;

  return {
    testCases: results,
    accuracy
  };
}

/**
 * פונקציה לבדיקת עיבוד צוואה שלמה
 */
export function testFullWillProcessing(): {
  maleTest: ReturnType<typeof processFullWillWithAutoGender>;
  femaleTest: ReturnType<typeof processFullWillWithAutoGender>;
  coupleTest: ReturnType<typeof processFullWillWithAutoGender>;
  analysis: {
    averageConfidence: number;
    genderDetectionSuccess: boolean;
    recommendedImprovements: string[];
  };
} {
  const sampleWillContent = `
אני {{testator_full_name}} {{gender:מצהיר|מצהירה|מצהירים}} בזאת כי זוהי צוואתי.
{{gender:אני מצווה|אני מצווה|אנו מצווים}} את עיזבוני ל{{gender:ילדיי|ילדיי|ילדינו}}.
{{gender:יורשיי|יורשיי|יורשינו}} יהיו {{gender:אחראים|אחראיות|אחראים}} לקיום הוראותיי.
  `.trim();

  // בדיקה לזכר
  const maleTest = processFullWillWithAutoGender(
    sampleWillContent,
    'דוד כהן',
    'שרה כהן',
    ['יוסף כהן', 'מרים כהן']
  );

  // בדיקה לנקבה  
  const femaleTest = processFullWillWithAutoGender(
    sampleWillContent,
    'שרה לוי',
    'דוד לוי',
    ['יוסף לוי', 'מרים לוי']
  );

  // בדיקה לזוג
  const coupleTest = processFullWillWithAutoGender(
    sampleWillContent,
    'דוד ושרה כהן',
    undefined,
    ['יוסף כהן', 'מרים כהן', 'אביגיל כהן']
  );

  // ניתוח
  const averageConfidence = (
    maleTest.confidence + femaleTest.confidence + coupleTest.confidence
  ) / 3;

  const genderDetectionSuccess = 
    Object.keys(maleTest.detectedGenders).length > 0 &&
    Object.keys(femaleTest.detectedGenders).length > 0 &&
    Object.keys(coupleTest.detectedGenders).length > 0;

  const recommendedImprovements: string[] = [];
  
  if (averageConfidence < 0.8) {
    recommendedImprovements.push('שיפור דיוק זיהוי המגדר - הוספת שמות נוספים למילון');
  }

  if (!genderDetectionSuccess) {
    recommendedImprovements.push('שיפור אלגוריתם זיהוי המגדר האוטומטי');
  }

  return {
    maleTest,
    femaleTest,
    coupleTest,
    analysis: {
      averageConfidence,
      genderDetectionSuccess,
      recommendedImprovements
    }
  };
}

/**
 * פונקציית בדיקה ראשית - מריצה את כל הבדיקות
 */
export function runAllTests(): {
  sectionsTest: ReturnType<typeof testAllDefaultSections>;
  genderDetectionTest: ReturnType<typeof testGenderDetection>;
  fullWillTest: ReturnType<typeof testFullWillProcessing>;
  overallScore: number;
  recommendations: string[];
} {
  console.log('🧪 מתחיל בדיקות מערכת הצוואות הדיפולטיביות...\n');

  // בדיקת הסעיפים
  console.log('📋 בודק סעיפים דיפולטיביים...');
  const sectionsTest = testAllDefaultSections();
  console.log(`✅ נבדקו ${sectionsTest.totalSections} סעיפים`);
  console.log(`✅ ${sectionsTest.successfulSections} סעיפים עובדים תקין`);
  console.log(`❌ ${sectionsTest.failedSections} סעיפים עם בעיות\n`);

  // בדיקת זיהוי מגדר
  console.log('👤 בודק זיהוי מגדר אוטומטי...');
  const genderDetectionTest = testGenderDetection();
  console.log(`✅ דיוק זיהוי מגדר: ${genderDetectionTest.accuracy.toFixed(1)}%\n`);

  // בדיקת עיבוד צוואה מלאה
  console.log('📄 בודק עיבוד צוואה מלאה...');
  const fullWillTest = testFullWillProcessing();
  console.log(`✅ רמת ביטחון ממוצעת: ${(fullWillTest.analysis.averageConfidence * 100).toFixed(1)}%\n`);

  // חישוב ציון כללי
  const sectionsScore = (sectionsTest.successfulSections / sectionsTest.totalSections) * 100;
  const genderScore = genderDetectionTest.accuracy;
  const willScore = fullWillTest.analysis.averageConfidence * 100;
  const overallScore = (sectionsScore + genderScore + willScore) / 3;

  // המלצות
  const recommendations: string[] = [];
  
  if (sectionsScore < 90) {
    recommendations.push(`שיפור הסעיפים הדיפולטיביים - ${sectionsTest.failedSections} סעיפים זקוקים לתיקון`);
  }
  
  if (genderScore < 80) {
    recommendations.push('הרחבת מילון השמות לזיהוי מגדר טוב יותר');
  }
  
  if (willScore < 70) {
    recommendations.push('שיפור אלגוריתם עיבוד הצוואות המלאות');
  }

  recommendations.push(...fullWillTest.analysis.recommendedImprovements);

  // הצגת תוצאות סופיות
  console.log('📊 תוצאות סופיות:');
  console.log(`🎯 ציון כללי: ${overallScore.toFixed(1)}%`);
  console.log(`📋 ציון סעיפים: ${sectionsScore.toFixed(1)}%`);
  console.log(`👤 ציון זיהוי מגדר: ${genderScore.toFixed(1)}%`);
  console.log(`📄 ציון עיבוד צוואות: ${willScore.toFixed(1)}%\n`);

  if (recommendations.length > 0) {
    console.log('💡 המלצות לשיפור:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  } else {
    console.log('🎉 כל הבדיקות עברו בהצלחה! המערכת פועלת מעולה.');
  }

  return {
    sectionsTest,
    genderDetectionTest,
    fullWillTest,
    overallScore,
    recommendations
  };
}

/**
 * פונקציה לייצוא דו"ח בדיקות ל-JSON
 */
export function exportTestReport(): string {
  const testResults = runAllTests();
  return JSON.stringify(testResults, null, 2);
}

/**
 * פונקציה לייצוא דו"ח בדיקות ל-Markdown
 */
export function exportTestReportMarkdown(): string {
  const results = runAllTests();
  
  let report = `# 🧪 דו"ח בדיקות מערכת הצוואות הדיפולטיביות\n\n`;
  report += `**תאריך:** ${new Date().toLocaleDateString('he-IL')}\n`;
  report += `**ציון כללי:** ${results.overallScore.toFixed(1)}%\n\n`;
  
  report += `## 📋 בדיקת סעיפים דיפולטיביים\n`;
  report += `- **סה"כ סעיפים:** ${results.sectionsTest.totalSections}\n`;
  report += `- **סעיפים תקינים:** ${results.sectionsTest.successfulSections}\n`;
  report += `- **סעיפים עם בעיות:** ${results.sectionsTest.failedSections}\n`;
  report += `- **ציון:** ${((results.sectionsTest.successfulSections / results.sectionsTest.totalSections) * 100).toFixed(1)}%\n\n`;
  
  report += `## 👤 בדיקת זיהוי מגדר\n`;
  report += `- **דיוק זיהוי:** ${results.genderDetectionTest.accuracy.toFixed(1)}%\n`;
  report += `- **מקרי בדיקה:** ${results.genderDetectionTest.testCases.length}\n`;
  report += `- **הצלחות:** ${results.genderDetectionTest.testCases.filter(t => t.success).length}\n\n`;
  
  report += `## 📄 בדיקת עיבוד צוואות\n`;
  report += `- **רמת ביטחון ממוצעת:** ${(results.fullWillTest.analysis.averageConfidence * 100).toFixed(1)}%\n`;
  report += `- **זיהוי מגדר אוטומטי:** ${results.fullWillTest.analysis.genderDetectionSuccess ? '✅' : '❌'}\n\n`;
  
  if (results.recommendations.length > 0) {
    report += `## 💡 המלצות לשיפור\n`;
    results.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
  }
  
  return report;
}

// ייצוא לשימוש חיצוני
export default {
  testSectionWithAllGenders,
  testAllDefaultSections,
  testGenderDetection,
  testFullWillProcessing,
  runAllTests,
  exportTestReport,
  exportTestReportMarkdown
};
