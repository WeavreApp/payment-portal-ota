const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixSS2Fees() {
  try {
    console.log('Fixing SS2 day students...');
    const { data: dayUpdate, error: dayError } = await supabase
      .from('students')
      .update({ total_fees: 180000 })
      .like('class', 'SS2%')
      .eq('student_type', 'day');
    
    if (dayError) {
      console.error('Day update error:', dayError);
      return;
    }
    console.log('Updated', dayUpdate?.length || 0, 'day students');
    
    console.log('Fixing SS2 boarding students...');
    const { data: boardingUpdate, error: boardingError } = await supabase
      .from('students')
      .update({ total_fees: 430000 })
      .like('class', 'SS2%')
      .eq('student_type', 'boarding');
    
    if (boardingError) {
      console.error('Boarding update error:', boardingError);
      return;
    }
    console.log('Updated', boardingUpdate?.length || 0, 'boarding students');
    
    console.log('SS2 fees fixed successfully!');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fixSS2Fees();
