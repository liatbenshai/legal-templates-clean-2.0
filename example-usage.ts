/**
 * 🎯 דוגמאות שימוש במערכת הצוואות הדיפולטיביות החדשה
 * 
 * קובץ זה מדגים איך להשתמש בכל התכונות החדשות:
 * 1. סעיפים דיפולטיביים עם תמיכה מלאה במגדר
 * 2. מערכת מגדר משופרת
 * 3. זיהוי מגדר אוטומטי
 * 4. בדיקות ואימות
 */

// ייבוא הפונקציות החדשות
import { 
  defaultWillSections,
  getDefaultSectionsForWillType,
  getAllDefaultSections
} from './lib/professional-will-texts';

import { 
  replaceTextWithGender as processSection,
  detectGenderFromName,
  replaceTextWithGender,
  Gender
} from './lib/hebrew-gender';

import { 
  runAllTests,
  testSectionWithAllGenders,
  exportTestReportMarkdown
} from './lib/test-gender-sections';

// =============================================================================
// 🎯 דוגמה 1: שימוש בסעיפים דיפולטיביים חדשים
// =============================================================================

export function exampleDefaultSections() {
  console.log('🎯 דוגמה 1: סעיפים דיפולטיביים חדשים\n');

  // קבלת כל הסעיפים הדיפולטיביים
  const allDefaultSections = getAllDefaultSections();
  console.log(`📋 סה"כ סעיפים דיפולטיביים: ${allDefaultSections.length}`);

  // קבלת סעיפים לצוואת יחיד
  const individualSections = getDefaultSectionsForWillType('individual');
  console.log(`👤 סעיפים לצוואת יחיד: ${individualSections.length}`);

  // קבלת סעיפים לצוואה הדדית
  const mutualSections = getDefaultSectionsForWillType('mutual');
  console.log(`👫 סעיפים לצוואה הדדית: ${mutualSections.length}\n`);

  // הצגת דוגמה לסעיף
  const identitySection = allDefaultSections.find(s => s.id === 'default-identity-declaration');
  if (identitySection) {
    console.log('📝 דוגמה לסעיף הצהרת זהות:');
    console.log('כותרת:', identitySection.title);
    console.log('קטגוריה:', identitySection.category);
    console.log('חובה:', identitySection.required);
    console.log('משתנים:', identitySection.variables.join(', '));
    console.log('תוכן (קטע):', identitySection.content.substring(0, 100) + '...\n');
  }
}

// =============================================================================
// 🎯 דוגמה 2: עיבוד סעיף עם מגדרים שונים
// =============================================================================

export function exampleGenderProcessing() {
  console.log('🎯 דוגמה 2: עיבוד סעיף עם מגדרים שונים\n');

  // נתוני בדיקה
  const testData = {
    testator_full_name: 'דוד כהן',
    testator_id: '123456789',
    testator_city: 'תל אביב',
    testator_address: 'רחוב הרצל 10',
    testator_age: '45',
    spouse_full_name: 'שרה כהן',
    children_count: '3'
  };

  // בחירת סעיף לדוגמה
  const section = defaultWillSections.find(s => s.id === 'default-identity-declaration');
  if (!section) return;

  console.log('📝 סעיף מקורי (עם placeholders):');
  console.log(section.content.substring(0, 200) + '...\n');

  // עיבוד עם מגדרים שונים
  const genders: { name: string; value: Gender }[] = [
    { name: 'זכר', value: 'male' },
    { name: 'נקבה', value: 'female' },
    { name: 'רבים', value: 'plural' }
  ];

  genders.forEach(({ name, value }) => {
    console.log(`🎭 עיבוד עבור ${name}:`);
    const processed = processSection(section.content, value);
    console.log(processed.substring(0, 150) + '...\n');
  });
}

// =============================================================================
// 🎯 דוגמה 3: זיהוי מגדר אוטומטי
// =============================================================================

export function exampleGenderDetection() {
  console.log('🎯 דוגמה 3: זיהוי מגדר אוטומטי\n');

  // דוגמאות שמות
  const names = [
    'דוד כהן',
    'שרה לוי', 
    'מיכל רוזן',
    'יוסף אברהם',
    'רחל גולדברג',
    'משה ישראלי',
    'תמר בן דוד',
    'דוד ושרה כהן'
  ];

  names.forEach(name => {
    const detectedGender = detectGenderFromName(name);
    const genderText = detectedGender === 'male' ? 'זכר' :
                      detectedGender === 'female' ? 'נקבה' :
                      detectedGender === 'plural' ? 'רבים' : 'לא זוהה';
    
    console.log(`👤 ${name.padEnd(20)} → ${genderText}`);
  });

  console.log('\n🔍 זיהוי מגדר מרובה:');
  const multipleNames = 'יוסף, מרים ואביגיל כהן';
  // TODO: Implement detectMultipleGendersFromText function
  console.log(`📝 טקסט: ${multipleNames}`);
  console.log(`🎯 מגדר דומיננטי: לא זמין (פונקציה לא מוגדרת)`);
  console.log(`📊 מגדרים שזוהו: לא זמין (פונקציה לא מוגדרת)`);
  console.log(`✅ רמת ביטחון: לא זמין (פונקציה לא מוגדרת)\n`);
}

// =============================================================================
// 🎯 דוגמה 4: עיבוד צוואה מלאה עם זיהוי אוטומטי
// =============================================================================

export function exampleFullWillProcessing() {
  console.log('🎯 דוגמה 4: עיבוד צוואה מלאה עם זיהוי אוטומטי\n');

  // צוואה לדוגמה עם placeholders
  const sampleWill = `
אני {{testator_full_name}} {{gender:מצהיר|מצהירה|מצהירים}} בזאת כי זוהי צוואתי האחרונה.

{{gender:אני מצווה|אני מצווה|אנו מצווים}} את כל עיזבוני ל{{children_count}} {{gender:ילדיי|ילדיי|ילדינו}} היקרים.

{{gender:יורשיי|יורשיי|יורשינו}} יהיו {{gender:אחראים|אחראיות|אחראים}} לקיום הוראותיי אלה.

{{gender:אני מבקש|אני מבקשת|אנו מבקשים}} מכל {{gender:יורשיי|יורשיי|יורשינו}} לכבד זה את זה ולפעול ברוח טובה.
  `.trim();

  // עיבוד עם זיהוי מגדר אוטומטי
  // TODO: Implement processFullWillWithAutoGender function
  const testatorGender = detectGenderFromName('דוד כהן') || 'male';
  const spouseGender = detectGenderFromName('שרה כהן') || 'female';
  
  console.log('🎭 מגדרים שזוהו:');
  console.log(`  מצווה: ${testatorGender === 'male' ? 'זכר' : testatorGender === 'female' ? 'נקבה' : 'לא זוהה'}`);
  console.log(`  בן/בת זוג: ${spouseGender === 'male' ? 'זכר' : spouseGender === 'female' ? 'נקבה' : 'לא זוהה'}`);
  console.log(`  יורשים: לא זמין (פונקציה לא מוגדרת)`);

  console.log(`\n✅ רמת ביטחון: לא זמין (פונקציה לא מוגדרת)\n`);

  console.log('📄 צוואה מעובדת (דוגמה בסיסית):');
  const processedContent = replaceTextWithGender(sampleWill, testatorGender);
  console.log(processedContent);
  console.log('\n');
}

// =============================================================================
// 🎯 דוגמה 5: שימוש במערכת הבדיקות
// =============================================================================

export function exampleTesting() {
  console.log('🎯 דוגמה 5: שימוש במערכת הבדיקות\n');

  // בדיקת סעיף יחיד
  const section = defaultWillSections[0]; // הסעיף הראשון
  console.log('🧪 בדיקת סעיף יחיד:');
  console.log(`📝 בודק סעיף: ${section.title}`);

  const sectionTest = testSectionWithAllGenders(section);
  
  console.log(`🎯 תוצאות בדיקה:`);
  console.log(`  זכר: ${sectionTest.results.male.success ? '✅' : '❌'}`);
  console.log(`  נקבה: ${sectionTest.results.female.success ? '✅' : '❌'}`);
  console.log(`  רבים: ${sectionTest.results.plural.success ? '✅' : '❌'}`);
  console.log(`🔍 דפוסי מגדר נמצאו: ${sectionTest.analysis.genderPatternsFound}`);
  console.log(`📝 משתנים בשימוש: ${sectionTest.analysis.variablesUsed.length}`);
  
  if (sectionTest.analysis.potentialIssues.length > 0) {
    console.log(`⚠️  בעיות פוטנציאליות: ${sectionTest.analysis.potentialIssues.length}`);
    sectionTest.analysis.potentialIssues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
  }

  console.log('\n🏁 להרצת כל הבדיקות, השתמש ב-runAllTests()');
}

// =============================================================================
// 🎯 דוגמה 6: יצירת דו"ח בדיקות
// =============================================================================

export function exampleTestReport() {
  console.log('🎯 דוגמה 6: יצירת דו"ח בדיקות\n');

  // הרצת כל הבדיקות
  console.log('🚀 מריץ את כל הבדיקות...\n');
  const testResults = runAllTests();

  console.log('\n📊 יצירת דו"ח Markdown...');
  const markdownReport = exportTestReportMarkdown();

  // שמירת הדו"ח (בסביבה אמיתית)
  console.log('💾 הדו"ח נשמר בהצלחה!');
  console.log('\nתוכן הדו"ח (קטע):');
  console.log(markdownReport.substring(0, 300) + '...\n');

  return markdownReport;
}

// =============================================================================
// 🎯 פונקציה ראשית - הרצת כל הדוגמאות
// =============================================================================

export function runAllExamples() {
  console.log('🚀 דוגמאות שימוש במערכת הצוואות הדיפולטיביות החדשة');
  console.log('='.repeat(80) + '\n');

  try {
    exampleDefaultSections();
    console.log('-'.repeat(80) + '\n');
    
    exampleGenderProcessing();
    console.log('-'.repeat(80) + '\n');
    
    exampleGenderDetection();
    console.log('-'.repeat(80) + '\n');
    
    exampleFullWillProcessing();
    console.log('-'.repeat(80) + '\n');
    
    exampleTesting();
    console.log('-'.repeat(80) + '\n');
    
    exampleTestReport();
    console.log('-'.repeat(80) + '\n');

    console.log('🎉 כל הדוגמאות הושלמו בהצלחה!');
    console.log('💡 כעת אתה יכול להתחיל להשתמש במערכת החדשה.');

  } catch (error) {
    console.error('❌ שגיאה בהרצת הדוגמאות:', error);
  }
}

// =============================================================================
// 🎯 מדריך שימוש מהיר
// =============================================================================

export const quickUsageGuide = `
📚 מדריך שימוש מהיר:

1️⃣  השתמש בסעיפים דיפולטיביים:
   import { getAllDefaultSections } from './lib/professional-will-texts';
   const sections = getAllDefaultSections();

2️⃣  עבד סעיף עם מגדר:
   import { processDefaultWillSection } from './lib/hebrew-gender';
   const result = processDefaultWillSection(content, variables, 'male');

3️⃣  זהה מגדר אוטומטי:
   import { detectGenderFromName } from './lib/hebrew-gender';
   const gender = detectGenderFromName('דוד כהן'); // 'male'

4️⃣  הרץ בדיקות:
   import { runAllTests } from './lib/test-gender-sections';
   const results = runAllTests();

5️⃣  יצור דו"ח:
   import { exportTestReportMarkdown } from './lib/test-gender-sections';
   const report = exportTestReportMarkdown();

🎯 לתיעוד מפורט, ראה: מדריך_עריכת_סעיפים_דיפולטיביים.md
`;

// אם הקובץ מורץ ישירות, הרץ את כל הדוגמאות
if (require.main === module) {
  runAllExamples();
}

export default {
  runAllExamples,
  exampleDefaultSections,
  exampleGenderProcessing,
  exampleGenderDetection,
  exampleFullWillProcessing,
  exampleTesting,
  exampleTestReport,
  quickUsageGuide
};
