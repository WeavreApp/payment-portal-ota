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

if (!fs.existsSync(studentsListPath)) {
  console.error('❌ students-list.txt not found in scripts directory');
  process.exit(1);
}

const fileContent = fs.readFileSync(studentsListPath, 'utf8');
const lines = fileContent.trim().split('\n');

const providedStudents = lines.map(line => {
  const parts = line.split(',');
  if (parts.length >= 3) {
    return {
      name: parts[0].trim(),
      class: parts[1].trim(),
      type: parts[2].trim()
    };
  }
  return null;
}).filter(s => s !== null);

console.log(`📋 Loaded ${providedStudents.length} students from students-list.txt\n`);

async function checkMissingStudents() {
  console.log('📊 Fetching students from database...\n');

  // Fetch all students in batches
  let allStudents = [];
  let from = 0;
  let to = 999;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('students')
      .select('full_name, class, student_type')
      .range(from, to);

    if (error) {
      console.error('❌ Error fetching students:', error.message);
      process.exit(1);
    }

    if (data && data.length > 0) {
      allStudents = allStudents.concat(data);
      from = to + 1;
      to = to + 1000;
    } else {
      hasMore = false;
    }
  }

  const dbStudents = allStudents;

  console.log(`✅ Found ${dbStudents.length} students in database\n`);
  console.log(`📋 Checking ${providedStudents.length} students from provided list\n`);

  // Create a set of database student name+class combinations for quick lookup (case-insensitive)
  const dbKeys = new Set();
  dbStudents.forEach(student => {
    dbKeys.add(`${student.full_name.toLowerCase().trim()}-${student.class.toLowerCase().trim()}`);
  });

  // Find missing students
  const missingStudents = [];
  const foundStudents = [];

  providedStudents.forEach(student => {
    const key = `${student.name.toLowerCase().trim()}-${student.class.toLowerCase().trim()}`;
    if (dbKeys.has(key)) {
      foundStudents.push(student);
    } else {
      missingStudents.push(student);
    }
  });

  // Also check for students in database but not in provided list
  const dbNotInList = [];
  dbStudents.forEach(student => {
    const key = `${student.full_name.toLowerCase().trim()}-${student.class.toLowerCase().trim()}`;
    const found = providedStudents.some(s => 
      `${s.name.toLowerCase().trim()}-${s.class.toLowerCase().trim()}` === key
    );
    if (!found) {
      dbNotInList.push(student);
    }
  });

  console.log(`\n📊 Results:`);
  console.log(`- Found in database: ${foundStudents.length}`);
  console.log(`- Missing from database: ${missingStudents.length}`);
  console.log(`- Total in database: ${dbStudents.length}`);
  console.log(`- Extra in database: ${dbNotInList.length}\n`);

  if (missingStudents.length > 0) {
    const output = `❌ Students NOT in database (${missingStudents.length}):\n\n${missingStudents.map(s => `- ${s.name} (${s.class}) - ${s.type}`).join('\n')}\n\n`;
    fs.writeFileSync(path.join(__dirname, '../missing-students.txt'), output);
    console.log(output);
  } else {
    console.log('✅ All students from the list are in the database!\n');
  }

  if (dbNotInList.length > 0) {
    const output = `⚠️  Students in database but NOT in provided list (${dbNotInList.length}):\n\n${dbNotInList.map(s => `- ${s.full_name} (${s.class}) - ${s.student_type || 'N/A'}`).join('\n')}\n`;
    fs.writeFileSync(path.join(__dirname, '../missing-students.txt'), output);
    console.log(output);
  } else {
    console.log('✅ No extra students in database\n');
  }
}

checkMissingStudents().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
