-- Fix SS3 students to use ₦750,000 hostel fee instead of global ₦250,000
-- Run this in Supabase SQL Editor

-- The issue: SS3 boarding students are using global hostel fee (250k) instead of SS3-specific (750k)
-- Current: ₦1,145,000 total = ₦355,000 base + ₦250,000 hostel + ₦40,000 NECO
-- Should be: ₦1,435,000 total = ₦645,000 base + ₦750,000 hostel + ₦40,000 NECO

-- Fix SS3 boarding students' hostel fee to 750,000
UPDATE students 
SET 
  hostel_fee = 750000,
  total_fees = 645000 + 750000 + COALESCE(neco_fee, 0)
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding';

-- Verify the fix
SELECT 
  'BEFORE FIX' as status,
  full_name,
  class,
  student_type,
  total_fees as current_total,
  neco_fee,
  hostel_fee as current_hostel,
  (total_fees - COALESCE(neco_fee, 0) - hostel_fee) as current_base_tuition,
  CASE 
    WHEN hostel_fee = 750000 THEN 'CORRECT HOSTEL'
    ELSE 'WRONG HOSTEL'
  END as hostel_status
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
  total_fees as updated_total,
  neco_fee,
  hostel_fee as updated_hostel,
  (total_fees - COALESCE(neco_fee, 0) - hostel_fee) as updated_base_tuition,
  CASE 
    WHEN hostel_fee = 750000 THEN 'CORRECT HOSTEL'
    ELSE 'WRONG HOSTEL'
  END as hostel_status,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - hostel_fee) = 645000 THEN 'CORRECT TUITION'
    ELSE 'TUITION ISSUE'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding'
ORDER BY full_name
LIMIT 5;

-- Summary of SS3 fees after fix
SELECT 
  'SS3 FINAL SUMMARY' as status,
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
