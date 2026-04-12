const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample data
const feeSettings = [
  { setting_key: 'global_hostel_fee', setting_value: '250000' },
  { setting_key: 'ss3_hostel_fee', setting_value: '750000' },
  { setting_key: 'neco_fee', setting_value: '40000' },
];

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

const bankAccounts = [
  {
    bank_name: 'First Bank of Nigeria',
    account_name: 'School Account',
    account_number: '1234567890',
    account_type: 'savings',
    is_active: true,
  },
  {
    bank_name: 'Access Bank',
    account_name: 'School Fees Account',
    account_number: '0987654321',
    account_type: 'current',
    is_active: true,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  // Seed fee settings
  console.log('📊 Seeding fee settings...');
  for (const setting of feeSettings) {
    const { error } = await supabase
      .from('fee_settings')
      .upsert(setting, { onConflict: 'setting_key' });
    
    if (error) {
      console.log(`  ⚠️  Error inserting ${setting.setting_key}:`, error.message);
    } else {
      console.log(`  ✅ Inserted: ${setting.setting_key}`);
    }
  }

  // Seed class fee rates
  console.log('\n📚 Seeding class fee rates...');
  for (const rate of classFeeRates) {
    const { error } = await supabase
      .from('class_fee_rates')
      .upsert(rate, { onConflict: 'class_name' });
    
    if (error) {
      console.log(`  ⚠️  Error inserting ${rate.class_name}:`, error.message);
    } else {
      console.log(`  ✅ Inserted: ${rate.class_name} - ₦${rate.day_student_fee.toLocaleString()}`);
    }
  }

  // Seed bank accounts
  console.log('\n🏦 Seeding bank accounts...');
  for (const account of bankAccounts) {
    const { error } = await supabase
      .from('bank_accounts')
      .insert(account);
    
    if (error) {
      console.log(`  ⚠️  Error inserting ${account.bank_name}:`, error.message);
    } else {
      console.log(`  ✅ Inserted: ${account.bank_name}`);
    }
  }

  console.log('\n✅ Database seeding completed!\n');
  console.log('Next steps:');
  console.log('1. Create admin user in Supabase Dashboard');
  console.log('2. Run: npm run dev\n');
}

seedDatabase().catch(err => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
