-- Fix SS3 boarding students tuition to ₦645,000
-- Run this in Supabase SQL Editor

-- Current issue: SS3 boarding students show ₦1,145,000 instead of ₦1,395,000
-- This means their base tuition is ₦1,145,000 - ₦750,000 - ₦40,000 = ₦355,000
-- Should be ₦645,000 base tuition

-- Fix SS3 boarding students' total fees
UPDATE students 
SET 
  total_fees = 645000 + 750000 + COALESCE(neco_fee, 0)
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding';

-- Verify the fix
SELECT 
  'BEFORE FIX' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - hostel_fee) as base_tuition
FROM students 
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding'
ORDER BY full_name
LIMIT 5;

-- After fix verification
SELECT 
  'AFTER FIX' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - hostel_fee) as base_tuition,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - hostel_fee) = 645000 THEN 'CORRECT TUITION'
    ELSE 'TUITION NEEDS FIX'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding'
ORDER BY full_name
LIMIT 5;

-- Summary of all SS3 students
SELECT 
  'SS3 SUMMARY' as status,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fees,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  AVG(total_fees - COALESCE(neco_fee, 0) - hostel_fee) as avg_base_tuition
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type;
