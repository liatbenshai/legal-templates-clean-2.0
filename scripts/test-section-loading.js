// סקריפט לבדיקת טעינת סעיפים היררכיים
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 בודק טעינת סעיפים היררכיים...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ משתני סביבה חסרים!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSectionLoading() {
  try {
    console.log('\n📋 שלב 1: טעינת סעיפים ראשיים...');
    
    // טען סעיפים ראשיים
    const { data: mainSections, error: mainError } = await supabase
      .from('hierarchical_sections')
      .select('*')
      .eq('level', 'main')
      .order('order_index');

    if (mainError) {
      console.error('❌ שגיאה בטעינת סעיפים ראשיים:', mainError.message);
      return false;
    }

    if (!mainSections || mainSections.length === 0) {
      console.log('⚠️ אין סעיפים ראשיים');
      return false;
    }

    console.log(`✅ נמצאו ${mainSections.length} סעיפים ראשיים:`);
    mainSections.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.title} (ID: ${section.id})`);
    });

    // בחר את הסעיף הראשון
    const selectedMainSection = mainSections[0];
    console.log(`\n🎯 בוחר סעיף: "${selectedMainSection.title}"`);

    console.log('\n📋 שלב 2: טעינת תתי סעיפים...');
    
    // טען תתי סעיפים
    const { data: subSections, error: subError } = await supabase
      .from('hierarchical_sections')
      .select('*')
      .eq('parent_id', selectedMainSection.id)
      .order('order_index');

    if (subError) {
      console.error('❌ שגיאה בטעינת תתי סעיפים:', subError.message);
      return false;
    }

    if (!subSections || subSections.length === 0) {
      console.log('⚠️ אין תתי סעיפים לסעיף זה');
    } else {
      console.log(`✅ נמצאו ${subSections.length} תתי סעיפים:`);
      subSections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title} (level: ${section.level})`);
      });
    }

    console.log('\n📋 שלב 3: סימולציה של יצירת סעיפים במבנה הנכון...');
    
    // צור סעיפים במבנה הנכון (כמו בקוד)
    const mainSectionId = `test_${Date.now()}`;
    const mainSection = {
      id: mainSectionId,
      title: selectedMainSection.title,
      content: selectedMainSection.content,
      level: 'main',
      order: 1,
      type: 'text'
    };

    console.log('📝 סעיף ראשי שנוצר:');
    console.log(`  ID: ${mainSection.id}`);
    console.log(`  כותרת: ${mainSection.title}`);
    console.log(`  רמה: ${mainSection.level}`);

    if (subSections && subSections.length > 0) {
      console.log('\n📝 תתי סעיפים שנוצרו:');
      subSections.forEach((subSection, index) => {
        const subSectionId = `test_sub_${Date.now()}_${index}`;
        const createdSubSection = {
          id: subSectionId,
          title: subSection.title,
          content: subSection.content,
          level: 'sub',
          order: index + 1,
          type: 'text',
          parentId: mainSectionId
        };
        
        console.log(`  ${index + 1}. ${createdSubSection.title} (ID: ${createdSubSection.id}, parent: ${createdSubSection.parentId})`);
      });
    }

    console.log('\n✅ בדיקת טעינת סעיפים הושלמה בהצלחה!');
    console.log('💡 הנתונים מוכנים לשימוש באפליקציה');
    
    return true;
  } catch (err) {
    console.error('❌ שגיאה כללית:', err.message);
    return false;
  }
}

testSectionLoading().then(success => {
  if (success) {
    console.log('\n🎉 הבדיקה הושלמה בהצלחה - הסעיפים אמורים לעבוד עכשיו!');
  } else {
    console.log('\n❌ הבדיקה נכשלה');
  }
  process.exit(success ? 0 : 1);
});
