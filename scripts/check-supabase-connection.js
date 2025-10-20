// סקריפט לבדיקת חיבור Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// משתני הסביבה
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 בודק חיבור ל-Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'קיים' : 'חסר');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ משתני סביבה חסרים!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  try {
    // בדיקת חיבור בסיסית
    const { data, error } = await supabase
      .from('warehouse_sections')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ שגיאה בחיבור:', error.message);
      return false;
    }

    console.log('✅ חיבור ל-Supabase עובד תקין!');
    return true;
  } catch (err) {
    console.error('❌ שגיאה כללית:', err.message);
    return false;
  }
}

checkConnection().then(success => {
  process.exit(success ? 0 : 1);
});
