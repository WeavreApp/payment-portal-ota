-- Foolproof SS3 fix - no GROUP BY, no functions, just simple updates
-- Run this in Supabase SQL Editor

-- Step 1: Fix any negative tuition values
UPDATE students 
SET total_fees = CASE 
    WHEN student_type = 'boarding' AND total_fees < 1435000 THEN 1435000
    WHEN student_type = 'boarding' AND total_fees < 1435000 THEN 1435000
    WHEN student_type = 'day' AND total_fees < 645000 THEN 645000
    ELSE total_fees
  END
WHERE class LIKE 'SS3%';

-- Step 2: Verify the fix
SELECT 
  'FOOLPROOF FIX' as status,
  COUNT(*) as total_students,
  COUNT(CASE WHEN total_fees = 1435000 THEN 1 END) as boarding_fixed,
  COUNT(CASE WHEN total_fees = 645000 THEN 1 END) as day_fixed,
  AVG(total_fees) as avg_total_fees,
  MIN(total_fees) as min_total_fees,
  MAX(total_fees) as max_total_fees
FROM students 
WHERE class LIKE 'SS3%';

-- Show sample of fixed students
SELECT 
  'SAMPLE FIXED STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as base_tuition,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) = 645000 THEN 'CORRECT BASE'
    ELSE 'BASE ISSUE'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 5;
