// סקריפט לתיקון נתוני hierarchical_sections
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 מתקן נתוני hierarchical_sections...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ משתני סביבה חסרים!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixHierarchicalSections() {
  try {
    // טען את כל הנתונים
    console.log('📦 טוען נתונים קיימים...');
    const { data: sections, error: fetchError } = await supabase
      .from('hierarchical_sections')
      .select('*')
      .order('created_at');

    if (fetchError) {
      console.error('❌ שגיאה בטעינת נתונים:', fetchError.message);
      return false;
    }

    if (!sections || sections.length === 0) {
      console.log('⚠️ אין נתונים לתיקון');
      return true;
    }

    console.log(`📊 נמצאו ${sections.length} סעיפים לתיקון`);

    // נתח את הנתונים ותקן אותם
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      console.log(`\n🔍 בודק סעיף ${i + 1}: "${section.title}"`);
      
      // בדוק אם level תקין
      if (section.level !== 'main' && section.level !== 'sub' && section.level !== 'sub-sub') {
        console.log(`⚠️ level לא תקין: "${section.level}"`);
        
        // נסה לזהות אם זה סעיף ראשי או תת-סעיף
        let newLevel = 'main';
        if (section.parent_id && section.parent_id !== 'none') {
          newLevel = 'sub';
        }
        
        console.log(`🔧 מתקן ל-level: ${newLevel}`);
        
        // עדכן את הנתון
        const { error: updateError } = await supabase
          .from('hierarchical_sections')
          .update({ level: newLevel })
          .eq('id', section.id);

        if (updateError) {
          console.error(`❌ שגיאה בעדכון סעיף ${i + 1}:`, updateError.message);
        } else {
          console.log(`✅ סעיף ${i + 1} תוקן בהצלחה`);
        }
      } else {
        console.log(`✅ level תקין: ${section.level}`);
      }
    }

    // בדוק את התוצאה
    console.log('\n🔍 בודק תוצאות...');
    const { data: fixedSections, error: checkError } = await supabase
      .from('hierarchical_sections')
      .select('*')
      .order('created_at');

    if (checkError) {
      console.error('❌ שגיאה בבדיקת תוצאות:', checkError.message);
      return false;
    }

    console.log('\n📊 תוצאות סופיות:');
    fixedSections.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.title} (level: ${section.level}, parent: ${section.parent_id || 'none'})`);
    });

    return true;
  } catch (err) {
    console.error('❌ שגיאה כללית:', err.message);
    return false;
  }
}

fixHierarchicalSections().then(success => {
  if (success) {
    console.log('\n✅ תיקון הושלם בהצלחה');
  } else {
    console.log('\n❌ תיקון נכשל');
  }
  process.exit(success ? 0 : 1);
});
