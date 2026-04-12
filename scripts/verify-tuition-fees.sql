-- Verify all students have correct tuition fees for their class
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for verification
SET session_replication_role = 'origin';

-- Define expected fees by class
WITH expected_fees AS (
  SELECT 
    'JSS1' as class_prefix, 165000 as expected_day_fee, 415000 as expected_total_fee
  UNION ALL SELECT 'JSS2', 165000, 415000
  UNION ALL SELECT 'JSS3', 165000, 415000
  UNION ALL SELECT 'SS1', 185000, 435000
  UNION ALL SELECT 'SS2', 1800000, 2050000
  UNION ALL SELECT 'SS3', 180000, 430000
),
fee_analysis AS (
  SELECT 
    s.id,
    s.full_name,
    s.class,
    s.student_type,
    s.total_fees,
    s.hostel_fee,
    ef.expected_day_fee,
    ef.expected_total_fee,
    CASE 
      WHEN s.student_type = 'boarding' THEN s.total_fees - s.hostel_fee
      ELSE s.total_fees
    END as actual_tuition_fee,
    CASE 
      WHEN s.student_type = 'boarding' THEN s.total_fees - s.hostel_fee
      ELSE s.total_fees
    END - ef.expected_day_fee as tuition_fee_difference,
    s.total_fees - ef.expected_total_fee as total_fee_difference
  FROM students s
  JOIN expected_fees ef ON SUBSTRING(s.class, 1, 3) = ef.class_prefix
)
-- Show students with incorrect tuition fees
SELECT 
  'INCORRECT_TUITION_FEES' as issue_type,
  full_name,
  class,
  student_type,
  actual_tuition_fee,
  expected_day_fee as correct_tuition_fee,
  tuition_fee_difference as difference,
  total_fees,
  expected_total_fee as correct_total_fee,
  total_fee_difference as total_difference
FROM fee_analysis 
WHERE tuition_fee_difference != 0
ORDER BY ABS(tuition_fee_difference) DESC;

-- Show students with incorrect total fees
SELECT 
  'INCORRECT_TOTAL_FEES' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  expected_total_fee as correct_total_fee,
  total_fee_difference as difference
FROM fee_analysis 
WHERE total_fee_difference != 0
ORDER BY ABS(total_fee_difference) DESC;

-- Summary by class
SELECT 
  'CLASS_SUMMARY' as issue_type,
  class,
  student_type,
  COUNT(*) as total_students,
  COUNT(CASE WHEN tuition_fee_difference != 0 THEN 1 END) as incorrect_tuition_count,
  COUNT(CASE WHEN total_fee_difference != 0 THEN 1 END) as incorrect_total_count,
  SUM(expected_day_fee) as total_expected_tuition,
  SUM(CASE WHEN tuition_fee_difference = 0 THEN actual_tuition_fee ELSE 0 END) as correct_tuition_total,
  SUM(ABS(tuition_fee_difference)) as total_tuition_error
FROM fee_analysis 
GROUP BY class, student_type
ORDER BY class, student_type;

-- Reset session role
RESET session_replication_role;
