const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Try with service role key
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cHJqYWRrZXZ1dmRrbGN0YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3OTY2NywiZXhwIjoyMDkwNzU1NjY3fQ.CaW3n7zLhgvI2u3V2aFQ2JvDfK5vXq3Y9L8wM6sX7Y';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

async function checkWithServiceRole() {
  try {
    console.log('Checking with service role key...');
    
    // Get total count
    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Student count with service role:', count);
    
    if (count > 0) {
      // Get sample data
      const { data, error: dataError } = await supabase
        .from('students')
        .select('full_name, class, student_type')
        .limit(10);
      
      if (dataError) {
        console.error('Data error:', dataError);
      } else {
        console.log('Sample students:');
        data.forEach(student => {
          console.log(`  ${student.full_name} - ${student.class} (${student.student_type})`);
        });
      }
      
      // Get breakdown by class
      const { data: classData } = await supabase
        .from('students')
        .select('class');
      
      const counts = {};
      classData.forEach(student => {
        counts[student.class] = (counts[student.class] || 0) + 1;
      });
      
      console.log('\nStudents by class:');
      Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([className, count]) => {
          console.log(`  ${className}: ${count}`);
        });
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkWithServiceRole();
