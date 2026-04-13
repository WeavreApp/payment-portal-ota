const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function setup() {
  console.log('\n🚀 School Payment Portal - Auto Setup\n');

  // Load environment variables from .env.local
  const envPath = path.join(__dirname, '../.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('Please ensure .env.local exists in the project root with your Supabase credentials.\n');
    process.exit(1);
  }

  require('dotenv').config({ path: envPath });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  console.log('✅ Configuration loaded from .env.local\n');

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Test connection
  console.log('🔌 Testing Supabase connection...');
  try {
    await supabase.from('students').select('id').limit(1);
    console.log('✅ Supabase connection successful\n');
  } catch (err) {
    console.log('❌ Failed to connect to Supabase');
    console.log('Error:', err.message);
    process.exit(1);
  }

  // Run migrations
  console.log('📋 Running Database Migrations...');
  await runMigrationsScript(supabase);

  // Seed database
  console.log('\n🌱 Seeding Database...');
  await seedDatabaseScript(supabase);

  console.log('\n✨ Setup Complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Login with your admin credentials\n');
}

async function runMigrationsScript(supabase) {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`Found ${migrationFiles.length} migration files\n`);

  let successCount = 0;
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Running: ${file}`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.log(`  ⚠️  Run manually in Supabase SQL Editor: ${file}`);
      } else {
        console.log(`  ✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.log(`  ⚠️  Run manually in Supabase SQL Editor: ${file}`);
    }
  }

  console.log(`\n✅ ${successCount} migrations executed automatically`);
  console.log(`⚠️  ${migrationFiles.length - successCount} need manual execution`);
  
  if (migrationFiles.length - successCount > 0) {
    console.log('\nTo run remaining migrations:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Open files from supabase/migrations/');
    console.log('3. Run them in order\n');
  }
}

async function seedDatabaseScript(supabase) {
  const feeSettings = [
    { setting_key: 'global_hostel_fee', setting_value: '250000' },
    { setting_key: 'ss3_hostel_fee', setting_value: '750000' },
    { setting_key: 'neco_fee', setting_value: '40000' },
  ];

  for (const setting of feeSettings) {
    const { error } = await supabase
      .from('fee_settings')
      .upsert(setting, { onConflict: 'setting_key' });
    
    if (error) {
      console.log(`  ⚠️  Error inserting ${setting.setting_key}`);
    } else {
      console.log(`  ✅ Inserted: ${setting.setting_key}`);
    }
  }

  const classFeeRates = [
    { class_name: 'JSS 1A', day_student_fee: 150000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 1B', day_student_fee: 150000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 1C', day_student_fee: 150000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 1D', day_student_fee: 150000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 2A', day_student_fee: 160000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 2B', day_student_fee: 160000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 2C', day_student_fee: 160000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 2D', day_student_fee: 160000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 3A', day_student_fee: 170000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 3B', day_student_fee: 170000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 3C', day_student_fee: 170000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'JSS 3D', day_student_fee: 170000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 1A', day_student_fee: 200000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 1B', day_student_fee: 200000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 1C', day_student_fee: 200000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 1D', day_student_fee: 200000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 2A', day_student_fee: 220000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 2B', day_student_fee: 220000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 2C', day_student_fee: 220000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 2D', day_student_fee: 220000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 3A', day_student_fee: 250000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 3B', day_student_fee: 250000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'SS 3C', day_student_fee: 250000, boarder_student_fee: null, allows_boarding: true },
    { class_name: 'Pre-School', day_student_fee: 100000, boarder_student_fee: null, allows_boarding: false },
    { class_name: 'Primary 1', day_student_fee: 120000, boarder_student_fee: null, allows_boarding: false },
    { class_name: 'Primary 2', day_student_fee: 120000, boarder_student_fee: null, allows_boarding: false },
    { class_name: 'Primary 3', day_student_fee: 130000, boarder_student_fee: null, allows_boarding: false },
    { class_name: 'Primary 4', day_student_fee: 130000, boarder_student_fee: null, allows_boarding: false },
    { class_name: 'Primary 5', day_student_fee: 140000, boarder_student_fee: null, allows_boarding: false },
    { class_name: 'Primary 6', day_student_fee: 140000, boarder_student_fee: null, allows_boarding: false },
  ];

  for (const rate of classFeeRates) {
    const { error } = await supabase
      .from('class_fee_rates')
      .upsert(rate, { onConflict: 'class_name' });
    
    if (error) {
      console.log(`  ⚠️  Error inserting ${rate.class_name}`);
    } else {
      console.log(`  ✅ Inserted: ${rate.class_name}`);
    }
  }

  console.log('✅ Database seeded');
}

setup().catch(err => {
  console.error('❌ Setup error:', err);
  process.exit(1);
});
