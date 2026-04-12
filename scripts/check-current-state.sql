-- Check current state of SS3 students and fee settings
-- Run this in Supabase SQL Editor

-- Check SS3 students
SELECT 
  'SS3 STUDENTS' as section,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 5;

-- Check fee settings
SELECT 
  'FEE SETTINGS' as section,
  setting_key,
  setting_value,
  description
FROM fee_settings
ORDER BY setting_key;
