require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  try {
    const { data, error } = await supabase
      .from('class_fee_rates')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('\n=== class_fee_rates table schema ===');
    if (data && data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        console.log(`- ${key}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema();
