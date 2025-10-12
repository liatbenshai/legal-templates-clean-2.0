// סקריפט המרה מ-TS ל-JSON
const fs = require('fs');

// קריאת הקובץ המקורי
const tsContent = fs.readFileSync('components/lib/sections-warehouses/warehouse-full.ts', 'utf8');

// חילוץ המערך בלבד - דרך eval (לא מומלץ בדרך כלל, אבל כאן זה בטוח)
// נסיר את ה-export ואת הממשקים
let cleaned = tsContent;

// הסרת הממשקים והטיפוסים
cleaned = cleaned.replace(/export interface[\s\S]*?}\n\n/g, '');
cleaned = cleaned.replace(/\/\*\*[\s\S]*?\*\/\n\n/g, '');
cleaned = cleaned.replace(/export const singleWillsSectionsWarehouse: SingleWillSectionTemplate\[\] = /, 'module.exports = ');
cleaned = cleaned.replace(/export function getSingleWillSectionsByCategory[\s\S]*$/, '');

// שמירה כקובץ זמני
fs.writeFileSync('temp-warehouse.js', cleaned, 'utf8');

try {
  // טעינת המערך
  const sectionsArray = require('./temp-warehouse.js');
  
  // המרה ל-JSON
  const jsonOutput = JSON.stringify(sectionsArray, null, 2);
  
  // שמירה
  fs.writeFileSync('public/warehouse-full.json', jsonOutput, 'utf8');
  
  console.log(`✅ הצלחה! נוצר קובץ JSON עם ${sectionsArray.length} סעיפים`);
  console.log(`📁 הקובץ נשמר ב: public/warehouse-full.json`);
  
  // מחיקת הקובץ הזמני
  fs.unlinkSync('temp-warehouse.js');
  
} catch (error) {
  console.error('❌ שגיאה:', error.message);
  // מחיקת הקובץ הזמני במקרה של שגיאה
  if (fs.existsSync('temp-warehouse.js')) {
    fs.unlinkSync('temp-warehouse.js');
  }
}

