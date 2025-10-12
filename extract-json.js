const fs = require('fs');
const path = require('path');

// הגדרת הנתיב הבסיסי - התיקייה של הסקריפט עצמו
const baseDir = __dirname;
console.log('Working directory:', baseDir);

// קריאת הקובץ המקורי
const inputPath = path.join(baseDir, 'components', 'lib', 'sections-warehouses', 'warehouse-full.ts');
console.log('Reading from:', inputPath);
const content = fs.readFileSync(inputPath, 'utf8');

// מציאת ההתחלה של המערך
const arrayStart = content.indexOf('export const singleWillsSectionsWarehouse: SingleWillSectionTemplate[] = [');
const dataStart = content.indexOf('[', arrayStart);
const dataEnd = content.indexOf('];', dataStart) + 1;

// חילוץ המערך
const arrayString = content.substring(dataStart, dataEnd);

// המרה ל-JSON באמצעות eval (בטוח כאן כי אנחנו יודעים מה התוכן)
let sections;
try {
  sections = eval(arrayString);
  console.log(`Extracted ${sections.length} sections successfully`);
} catch (error) {
  console.error('Error parsing array:', error.message);
  process.exit(1);
}

// שמירה כ-JSON
const outputPath = path.join(baseDir, 'public', 'warehouse-full.json');
console.log('Saving to:', outputPath);
fs.writeFileSync(outputPath, JSON.stringify(sections, null, 2), 'utf8');

console.log(`\n✅ Success! JSON file created with ${sections.length} sections`);
console.log(`📁 File location: ${outputPath}`);

