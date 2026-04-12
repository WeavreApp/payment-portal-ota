-- Debug SS3 fee calculation issue
-- Run this in Supabase SQL Editor

-- Check current SS3 student data
SELECT 
  'CURRENT SS3 DATA' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as current_base_tuition
FROM students 
WHERE class LIKE 'SS3%'
AND student_type = 'boarding'
ORDER BY full_name
LIMIT 5;

-- Check class_fee_rates for SS3
SELECT 
  'CLASS FEE RATES' as status,
  class_name,
  day_student_fee,
  boarder_student_fee,
  allows_boarding
FROM class_fee_rates 
WHERE class_name LIKE 'SS3%'
ORDER BY class_name;

-- Expected calculation for SS3 boarding students
SELECT 
  'EXPECTED CALCULATION' as status,
  class_name,
  day_student_fee as expected_base_tuition,
  750000 as expected_hostel_fee,
  (day_student_fee + 750000) as expected_total_without_neco,
  (day_student_fee + 750000 + 40000) as expected_total_with_neco
FROM class_fee_rates 
WHERE class_name LIKE 'SS3%'
ORDER BY class_name;
