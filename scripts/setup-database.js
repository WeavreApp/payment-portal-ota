const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationsDir = path.join(__dirname, '../supabase/migrations');

// Get all migration files sorted by name (they include timestamps)
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

console.log(`📋 Found ${migrationFiles.length} migration files to run...\n`);

async function runMigrations() {
  let successCount = 0;
  let failCount = 0;

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`⚡ Running: ${file}`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        // Try direct SQL execution if RPC not available
        const { error: directError } = await supabase.from('_migrations').select('*').limit(1);
        
        // If RPC fails, we'll note it but continue
        console.log(`  ⚠️  Note: Run this migration manually in Supabase SQL Editor: ${file}`);
        console.log(`  📄 File: ${filePath}`);
        failCount++;
      } else {
        console.log(`  ✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.log(`  ⚠️  Note: Run this migration manually in Supabase SQL Editor: ${file}`);
      console.log(`  📄 File: ${filePath}`);
      failCount++;
    }
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Migration Summary:`);
  console.log(`✅ Successfully executed: ${successCount}`);
  console.log(`⚠️  Manual execution required: ${failCount}`);
  console.log(`📋 Total migrations: ${migrationFiles.length}`);
  console.log(`${'='.repeat(50)}\n`);

  if (failCount > 0) {
    console.log('⚠️  Some migrations need to be run manually in Supabase SQL Editor.');
    console.log('📁 Migration files location: supabase/migrations/\n');
    console.log('Instructions:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Open each migration file from supabase/migrations/');
    console.log('3. Run the SQL in the editor');
    console.log('4. Run them in the order shown above\n');
  } else {
    console.log('✅ All migrations executed successfully!\n');
  }

  console.log('Next steps:');
  console.log('1. Create initial admin user (see README.md)');
  console.log('2. Run: npm run dev\n');
}

runMigrations().catch(err => {
  console.error('❌ Error running migrations:', err);
  process.exit(1);
});
