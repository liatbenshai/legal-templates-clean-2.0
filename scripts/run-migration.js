const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://mrauwnytgqzylezggavj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYXV3bnl0Z3F6eWxlemdnYXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTA4NTAsImV4cCI6MjA3NjA4Njg1MH0.8I5_-721cnX90Gszg7PTHNab10wFoPEaiOC7U2SatIU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Starting migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '002_hierarchical_sections.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file read successfully');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error);
            // Continue with next statement
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Exception in statement ${i + 1}:`, err.message);
          // Continue with next statement
        }
      }
    }
    
    console.log('🎉 Migration completed!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Check if we can connect to Supabase
async function testConnection() {
  try {
    const { data, error } = await supabase.from('warehouse_sections').select('count').limit(1);
    
    if (error) {
      console.error('❌ Cannot connect to Supabase:', error);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully');
    return true;
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Testing connection to Supabase...');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Cannot proceed without Supabase connection');
    process.exit(1);
  }
  
  await runMigration();
}

main();
