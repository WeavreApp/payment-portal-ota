-- Fix class_fee_rates table for SS3 to use ₦645,000 tuition
-- Run this in Supabase SQL Editor

-- Update SS3 classes to use ₦645,000 tuition instead of ₦180,000
UPDATE class_fee_rates 
SET day_student_fee = 645000
WHERE class_name LIKE 'SS3%';

-- Verify the fix
SELECT 
  'BEFORE FIX' as status,
  class_name,
  day_student_fee,
  boarder_student_fee,
  allows_boarding
FROM class_fee_rates 
WHERE class_name LIKE 'SS3%'
ORDER BY class_name;

SELECT 
  'AFTER FIX' as status,
  class_name,
  day_student_fee,
  boarder_student_fee,
  allows_boarding
FROM class_fee_rates 
WHERE class_name LIKE 'SS3%'
ORDER BY class_name;

-- Test the calculation with new values
SELECT 
  'TEST WITH NEW VALUES' as status,
  class_name,
  day_student_fee as expected_base_tuition,
  750000 as expected_hostel_fee,
  (day_student_fee + 750000) as expected_total_without_neco,
  (day_student_fee + 750000 + 40000) as expected_total_with_neco
FROM class_fee_rates 
WHERE class_name LIKE 'SS3%'
ORDER BY class_name;
