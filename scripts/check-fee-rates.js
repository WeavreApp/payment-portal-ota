require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkFeeRates() {
  try {
    const { data, error } = await supabase
      .from('class_fee_rates')
      .select('class_name')
      .order('class_name');

    if (error) {
      console.error('Error fetching fee rates:', error);
      return;
    }

    console.log('\n=== Available Class Names in class_fee_rates table ===');
    data.forEach((row, index) => {
      console.log(`${index + 1}. ${row.class_name}`);
    });

    console.log('\n=== Student Class Names from your list ===');
    const studentClasses = [
      'JSS1A', 'JSS1B', 'JSS1C', 'JSS1D',
      'JSS2A', 'JSS2B', 'JSS2C', 'JSS2D',
      'JSS3A', 'JSS3B', 'JSS3C', 'JSS3D'
    ];
    
    studentClasses.forEach((className, index) => {
      const exists = data.some(row => row.class_name === className);
      const status = exists ? '✅ EXISTS' : '❌ MISSING';
      console.log(`${index + 1}. ${className} - ${status}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkFeeRates();
