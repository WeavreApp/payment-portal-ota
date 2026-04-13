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

// Read student list from file
const studentsListPath = path.join(__dirname, 'students-list.txt');
const fileContent = fs.readFileSync(studentsListPath, 'utf8');
const lines = fileContent.trim().split('\n');

const students = lines.map(line => {
  const parts = line.split(',');
  if (parts.length >= 3) {
    const name = parts[0].trim();
    const className = parts[1].trim();
    const type = parts[2].trim();
    
    // Determine fees based on student type
    const isBoarder = type.toLowerCase() === 'boarder' || type.toLowerCase() === 'boarding';
    const totalFees = isBoarder ? 2050000 : 1800000;
    const hostelFee = isBoarder ? 250000 : 0;
    
    return {
      full_name: name,
      class: className,
      student_type: type.toLowerCase() === 'boarder' || type.toLowerCase() === 'boarding' ? 'boarding' : 'day',
      total_fees: totalFees,
      hostel_fee: hostelFee,
      payment_status: 'outstanding',
      balance_paid: 0
    };
  }
  return null;
}).filter(s => s !== null);

console.log(`📋 Loaded ${students.length} students from students-list.txt\n`);

async function insertStudents() {
  console.log('📊 Inserting students into database...\n');
  
  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('students')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
      process.exit(1);
    }
    
    console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} students)`);
  }
  
  console.log(`\n✅ Successfully inserted ${students.length} students into database!`);
}

insertStudents().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
