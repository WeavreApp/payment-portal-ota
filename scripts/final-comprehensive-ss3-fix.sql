-- Comprehensive SS3 fix - addresses all issues
-- Run this in Supabase SQL Editor

-- Step 1: Fix any negative tuition values
UPDATE students 
SET total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      GREATEST(645000 + 750000 + COALESCE(neco_fee, 0), 0)
    ELSE 
      GREATEST(645000 + COALESCE(neco_fee, 0), 0)
  END
WHERE class LIKE 'SS3%' 
AND total_fees < 0;  -- Only fix negative values

-- Step 2: Ensure all SS3 students have correct minimum fees
UPDATE students 
SET total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      GREATEST(645000 + 750000 + COALESCE(neco_fee, 0), 1435000)  -- Min for boarding
    ELSE 
      GREATEST(645000 + COALESCE(neco_fee, 0), 645000)  -- Min for day
  END
WHERE class LIKE 'SS3%' 
AND total_fees < 1435000;  -- Fix any values below minimum

-- Step 3: Verify comprehensive fix
SELECT 
  'COMPREHENSIVE FIX' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  COUNT(CASE WHEN total_fees < 0 THEN 1 END) as negative_fees_fixed,
  COUNT(CASE WHEN total_fees < 1435000 THEN 1 END) as below_minimum_fixed,
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
LIMIT 10;
