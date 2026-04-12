const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkStudentCount() {
  try {
    console.log('Checking current student count in database...');
    
    // Get total count
    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log(`Current student count in database: ${count}`);
    
    // Get breakdown by class
    const { data: classData, error: classError } = await supabase
      .from('students')
      .select('class');
    
    if (classError) {
      console.error('Class error:', classError);
      return;
    }
    
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
    
    // Also get breakdown by student type
    const { data: typeData, error: typeError } = await supabase
      .from('students')
      .select('student_type');
    
    if (typeError) {
      console.error('Type error:', typeError);
      return;
    }
    
    const typeCounts = {};
    typeData.forEach(student => {
      typeCounts[student.student_type] = (typeCounts[student.student_type] || 0) + 1;
    });
    
    console.log('\nStudents by type:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
  } catch (err) {
    console.error('Connection error:', err);
  }
}

checkStudentCount();
