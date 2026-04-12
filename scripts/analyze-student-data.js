const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Try service role to bypass RLS
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cHJqYWRrZXZ1dmRrbGN0YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3OTY2NywiZXhwIjoyMDkwNzU1NjY3fQ.CaW3n7zLhgvI2u3V2aFQ2JvDfK5vXq3Y9L8wM6sX7Y';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey
);

async function analyzeStudentData() {
  try {
    console.log('Analyzing student data for duplicates and fee issues...');
    
    // Get all students
    const { data: students, error } = await supabase
      .from('students')
      .select('*');
    
    if (error) {
      console.error('Error fetching students:', error);
      return;
    }
    
    console.log(`Total students found: ${students.length}`);
    
    if (students.length === 0) {
      console.log('No students found. The web app might be using cached data.');
      return;
    }
    
    // Check for duplicates
    const nameCounts = {};
    const duplicates = [];
    
    students.forEach(student => {
      const name = student.full_name.toLowerCase().trim();
      if (nameCounts[name]) {
        nameCounts[name]++;
        if (nameCounts[name] === 2) {
          duplicates.push(name);
        }
      } else {
        nameCounts[name] = 1;
      }
    });
    
    console.log('\n=== DUPLICATE ANALYSIS ===');
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate names:`);
      duplicates.forEach(name => {
        console.log(`- ${name}`);
        const duplicateStudents = students.filter(s => 
          s.full_name.toLowerCase().trim() === name
        );
        duplicateStudents.forEach((student, index) => {
          console.log(`  ${index + 1}. ID: ${student.id}, Class: ${student.class}, Fees: ${student.total_fees}`);
        });
      });
    } else {
      console.log('No duplicate names found');
    }
    
    // Check fee issues by class
    const expectedFees = {
      'JSS1': { day: 165000, boarding: 415000 },
      'JSS2': { day: 165000, boarding: 415000 },
      'JSS3': { day: 165000, boarding: 415000 },
      'SS1': { day: 185000, boarding: 435000 },
      'SS2': { day: 1800000, boarding: 2050000 },
      'SS3': { day: 180000, boarding: 430000 }
    };
    
    console.log('\n=== FEE ANALYSIS ===');
    const feeIssues = [];
    
    students.forEach(student => {
      const classPrefix = student.class.substring(0, 3);
      const expectedFee = expectedFees[classPrefix];
      
      if (expectedFee) {
        const expectedAmount = expectedFee[student.student_type];
        if (student.total_fees !== expectedAmount) {
          feeIssues.push({
            name: student.full_name,
            class: student.class,
            type: student.student_type,
            expected: expectedAmount,
            actual: student.total_fees,
            difference: student.total_fees - expectedAmount
          });
        }
      }
    });
    
    if (feeIssues.length > 0) {
      console.log(`Found ${feeIssues.length} students with fee issues:`);
      feeIssues.forEach(issue => {
        console.log(`- ${issue.name} (${issue.class} - ${issue.type})`);
        console.log(`  Expected: ₦${issue.expected.toLocaleString()}, Actual: ₦${issue.actual.toLocaleString()}, Difference: ₦${issue.difference.toLocaleString()}`);
      });
    } else {
      console.log('All students have correct fees');
    }
    
    // Show sample of students
    console.log('\n=== SAMPLE STUDENTS ===');
    students.slice(0, 10).forEach(student => {
      console.log(`${student.full_name} - ${student.class} (${student.student_type}) - ₦${student.total_fees.toLocaleString()}`);
    });
    
    // Class breakdown
    const classCounts = {};
    students.forEach(student => {
      classCounts[student.class] = (classCounts[student.class] || 0) + 1;
    });
    
    console.log('\n=== CLASS BREAKDOWN ===');
    Object.entries(classCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([className, count]) => {
        console.log(`${className}: ${count} students`);
      });
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

analyzeStudentData();
