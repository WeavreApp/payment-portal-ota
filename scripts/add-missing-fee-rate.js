require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addMissingFeeRate() {
  try {
    // Add JSS3D fee rate (same as other JSS3 classes)
    const { data, error } = await supabase
      .from('class_fee_rates')
      .insert({
        class_name: 'JSS3D',
        day_student_fee: 165000, // Same as other JSS3 classes
        boarder_student_fee: null,
        allows_boarding: true,
        display_name: 'JSS 3D'
      })
      .select();

    if (error) {
      console.error('Error adding JSS3D fee rate:', error);
    } else {
      console.log('✅ Successfully added JSS3D fee rate');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

addMissingFeeRate();
