-- Analyze fee calculation issues for boarding students
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for analysis
SET session_replication_role = 'origin';

-- Check current fee structure for boarding students
SELECT 
  'CURRENT_BOARDING_FEES' as analysis_type,
  class,
  student_type,
  COUNT(*) as student_count,
  total_fees,
  hostel_fee,
  (total_fees + hostel_fee) as current_total_balance,
  CASE 
    WHEN student_type = 'boarding' THEN total_fees - hostel_fee
    ELSE total_fees
  END as actual_tuition_fee
FROM students 
WHERE student_type = 'boarding'
GROUP BY class, student_type, total_fees, hostel_fee
ORDER BY class;

-- Show expected vs actual fees
WITH expected_fees AS (
  SELECT 
    'JSS1' as class_prefix, 165000 as day_fee, 250000 as hostel_fee, 415000 as total_expected
  UNION ALL SELECT 'JSS2', 165000, 250000, 415000
  UNION ALL SELECT 'JSS3', 165000, 250000, 415000
  UNION ALL SELECT 'SS1', 185000, 250000, 435000
  UNION ALL SELECT 'SS2', 1800000, 250000, 2050000
  UNION ALL SELECT 'SS3', 180000, 250000, 430000
)
SELECT 
  'FEE_COMPARISON' as analysis_type,
  s.class,
  s.student_type,
  s.total_fees as current_total,
  ef.total_expected as expected_total,
  ef.day_fee as expected_tuition,
  ef.hostel_fee as expected_hostel,
  (s.total_fees - ef.total_expected) as difference
FROM students s
JOIN expected_fees ef ON SUBSTRING(s.class, 1, 3) = ef.class_prefix
WHERE s.student_type = 'boarding'
GROUP BY s.class, s.student_type, s.total_fees, ef.total_expected, ef.day_fee, ef.hostel_fee
ORDER BY s.class;

-- Sample boarding students with fee breakdown
SELECT 
  'SAMPLE_BOARDING_STUDENTS' as analysis_type,
  full_name,
  class,
  student_type,
  total_fees as current_total_fee,
  hostel_fee as current_hostel_fee,
  (total_fees - hostel_fee) as current_tuition_fee,
  CASE 
    WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 165000
    WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 185000
    WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 1800000
    WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 180000
  END as expected_tuition_fee,
  250000 as expected_hostel_fee
FROM students 
WHERE student_type = 'boarding'
ORDER BY class, full_name
LIMIT 10;

-- Reset session role
RESET session_replication_role;
