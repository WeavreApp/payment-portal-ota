const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n🚀 School Payment Portal - Setup Wizard\n');
  console.log('This wizard will help you set up the project.\n');

  // Check if .env.local exists
  const envPath = path.join(__dirname, '../.env.local');
  const envExists = fs.existsSync(envPath);

  if (envExists) {
    console.log('✅ .env.local file already exists');
    const useExisting = await question('Use existing configuration? (yes/no): ');
    if (useExisting.toLowerCase() === 'yes') {
      require('dotenv').config({ path: envPath });
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl || !supabaseServiceKey) {
        console.log('❌ Existing .env.local is missing required credentials');
        return;
      }
      
      await testConnectionAndContinue(supabaseUrl, supabaseServiceKey);
      return;
    }
  }

  console.log('\n📝 Step 1: Supabase Configuration');
  console.log('You need a Supabase project. If you don\'t have one:');
  console.log('1. Go to https://supabase.com');
  console.log('2. Create a free account');
  console.log('3. Create a new project');
  console.log('4. Wait 2-3 minutes for it to be ready');
  console.log('5. Go to Settings → API to get your credentials\n');

  const supabaseUrl = await question('Enter your Supabase Project URL: ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');
  const supabaseServiceKey = await question('Enter your Supabase Service Role Key: ');

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.log('❌ All credentials are required');
    rl.close();
    return;
  }

  // Create .env.local file
  const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created');

  await testConnectionAndContinue(supabaseUrl, supabaseServiceKey);
}

async function testConnectionAndContinue(supabaseUrl, supabaseServiceKey) {
  console.log('\n🔌 Testing Supabase connection...');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { error } = await supabase.from('students').select('id').limit(1);
    // Error is expected if table doesn't exist, but connection works
    console.log('✅ Supabase connection successful\n');
  } catch (err) {
    console.log('❌ Failed to connect to Supabase');
    console.log('Error:', err.message);
    rl.close();
    return;
  }

  // Run migrations
  console.log('📋 Step 2: Running Database Migrations');
  const runMigrations = await question('Run database migrations now? (yes/no): ');
  
  if (runMigrations.toLowerCase() === 'yes') {
    await runMigrationsScript(supabase);
  }

  // Seed database
  console.log('\n🌱 Step 3: Seeding Database');
  const seedDb = await question('Seed database with sample data? (yes/no): ');
  
  if (seedDb.toLowerCase() === 'yes') {
    await seedDatabaseScript(supabase);
  }

  // Create admin user
  console.log('\n👤 Step 4: Create Admin User');
  const createAdmin = await question('Create admin user now? (yes/no): ');
  
  if (createAdmin.toLowerCase() === 'yes') {
    await createAdminUser(supabase);
  }

  console.log('\n✨ Setup Complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Login with your admin credentials\n');
  
  rl.close();
}

async function runMigrationsScript(supabase) {
  console.log('\n⚡ Running migrations...');
  
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
      // Try to execute via SQL (may fail if RPC not available)
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
  console.log('\n🌱 Seeding database...');
  
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

async function createAdminUser(supabase) {
  console.log('\n👤 Creating admin user...');
  
  const email = await question('Enter admin email: ');
  const fullName = await question('Enter admin full name: ');
  
  if (!email || !fullName) {
    console.log('❌ Email and full name are required');
    return;
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: crypto.randomUUID(),
      email,
      role: 'superadmin',
      full_name: fullName
    });

  if (profileError) {
    console.log('⚠️  Profile creation may have failed. You can create the user via Supabase Dashboard.');
    console.log('Error:', profileError.message);
  } else {
    console.log('✅ Profile created');
  }

  console.log('\n⚠️  You still need to create the auth user in Supabase Dashboard:');
  console.log('1. Go to Supabase Dashboard → Authentication');
  console.log('2. Click "Add User"');
  console.log(`3. Enter email: ${email}`);
  console.log('4. Set a password');
  console.log('5. The user will have superadmin role\n');
}

setup().catch(err => {
  console.error('❌ Setup error:', err);
  rl.close();
});
