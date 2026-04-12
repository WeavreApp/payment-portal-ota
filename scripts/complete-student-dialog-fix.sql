-- Complete fix for student dialog - force all SS3 students to use correct values
-- Run this in Supabase SQL Editor

-- Step 1: Update all SS3 students to correct fee structure
UPDATE students 
SET 
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      645000 + 750000 + COALESCE(neco_fee, 0)
    ELSE 
      645000 + COALESCE(neco_fee, 0)
  END
WHERE class LIKE 'SS3%';

-- Step 2: Verify the fix
SELECT 
  'VERIFICATION' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fees,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  AVG(total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as avg_base_tuition
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class, student_type
ORDER BY class, student_type;

-- Step 3: Show sample of corrected students
SELECT 
  'SAMPLE CORRECTED' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as base_tuition,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) = 645000 THEN 'CORRECT TUITION'
    ELSE 'TUITION ISSUE'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 10;

-- Step 4: Summary of expected vs actual
SELECT 
  'FINAL SUMMARY' as status,
  'Expected SS3 Day' as metric,
  645000 as value
UNION ALL
SELECT 
  'FINAL SUMMARY' as status,
  'Expected SS3 Boarding' as metric,
  1435000 as value
UNION ALL
SELECT 
  'FINAL SUMMARY' as status,
  'Expected SS3 Day + NECO' as metric,
  685000 as value
UNION ALL
SELECT 
  'FINAL SUMMARY' as status,
  'Expected SS3 Boarding + NECO' as metric,
  1435000 + 40000 as value
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type;
