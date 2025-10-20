// סקריפט לבדיקת טבלת hierarchical_sections
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 בודק טבלת hierarchical_sections...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'קיים' : 'חסר');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ משתני סביבה חסרים!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkHierarchicalSections() {
  try {
    // נסה לטעון ישירות מהטבלה
    console.log('\n📋 בודק אם הטבלה קיימת...');
    const { data: testData, error: testError } = await supabase
      .from('hierarchical_sections')
      .select('*')
      .limit(1);

    if (testError) {
      if (testError.message.includes('relation "hierarchical_sections" does not exist')) {
        console.log('❌ הטבלה hierarchical_sections לא קיימת!');
        console.log('💡 צריך ליצור את הטבלה ב-Supabase Dashboard');
        return false;
      } else {
        console.error('❌ שגיאה בבדיקת הטבלה:', testError.message);
        return false;
      }
    }

    console.log('✅ הטבלה hierarchical_sections קיימת');

    // בדוק את המבנה של הטבלה על ידי טעינת נתון אחד
    console.log('\n🏗️ בודק מבנה הטבלה...');
    if (testData && testData.length > 0) {
      console.log('📊 מבנה הטבלה (מהנתונים):');
      const sample = testData[0];
      Object.keys(sample).forEach(key => {
        const value = sample[key];
        const type = typeof value;
        console.log(`  - ${key}: ${type} ${value === null ? '(null)' : ''}`);
      });
    } else {
      console.log('⚠️ אין נתונים לבדיקת מבנה הטבלה');
    }

    // בדוק אם יש נתונים
    console.log('\n📦 בודק נתונים בטבלה...');
    const { data: sections, error: sectionsError } = await supabase
      .from('hierarchical_sections')
      .select('*')
      .limit(5);

    if (sectionsError) {
      console.error('❌ שגיאה בטעינת נתונים:', sectionsError.message);
      return false;
    }

    if (!sections || sections.length === 0) {
      console.log('⚠️ הטבלה ריקה - אין סעיפים היררכיים');
      console.log('💡 צריך להוסיף סעיפים ב-Supabase Dashboard');
    } else {
      console.log(`✅ נמצאו ${sections.length} סעיפים:`);
      sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title} (level: ${section.level}, parent: ${section.parent_id || 'none'})`);
      });
    }

    return true;
  } catch (err) {
    console.error('❌ שגיאה כללית:', err.message);
    return false;
  }
}

checkHierarchicalSections().then(success => {
  if (success) {
    console.log('\n✅ בדיקה הושלמה בהצלחה');
  } else {
    console.log('\n❌ בדיקה נכשלה');
  }
  process.exit(success ? 0 : 1);
});
