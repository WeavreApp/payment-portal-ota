-- Find duplicates and fee issues in students table
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for read
SET session_replication_role = 'origin';

-- Check total count
SELECT COUNT(*) as total_students FROM students;

-- Find duplicate names
WITH duplicate_names AS (
  SELECT 
    full_name,
    COUNT(*) as count,
    STRING_AGG(id::text, ', ') as student_ids
  FROM students 
  GROUP BY LOWER(TRIM(full_name)), full_name
  HAVING COUNT(*) > 1
)
SELECT 
  'DUPLICATE' as issue_type,
  full_name,
  count as duplicate_count,
  student_ids as affected_ids
FROM duplicate_names
ORDER BY count DESC, full_name;

-- Find fee issues by class
WITH expected_fees AS (
  SELECT 
    'JSS1' as class_prefix, 165000 as day_fee, 415000 as boarding_fee
  UNION ALL SELECT 'JSS2', 165000, 415000
  UNION ALL SELECT 'JSS3', 165000, 415000
  UNION ALL SELECT 'SS1', 185000, 435000
  UNION ALL SELECT 'SS2', 1800000, 2050000
  UNION ALL SELECT 'SS3', 180000, 430000
),
fee_issues AS (
  SELECT 
    s.id,
    s.full_name,
    s.class,
    s.student_type,
    s.total_fees,
    ef.day_fee,
    ef.boarding_fee,
    CASE 
      WHEN s.student_type = 'day' THEN ef.day_fee
      WHEN s.student_type = 'boarding' THEN ef.boarding_fee
    END as expected_fee,
    s.total_fees - CASE 
      WHEN s.student_type = 'day' THEN ef.day_fee
      WHEN s.student_type = 'boarding' THEN ef.boarding_fee
    END as fee_difference
  FROM students s
  JOIN expected_fees ef ON SUBSTRING(s.class, 1, 3) = ef.class_prefix
  WHERE s.total_fees != CASE 
    WHEN s.student_type = 'day' THEN ef.day_fee
    WHEN s.student_type = 'boarding' THEN ef.boarding_fee
  END
)
SELECT 
  'FEE_ISSUE' as issue_type,
  full_name,
  class,
  student_type,
  total_fees as actual_fee,
  expected_fee,
  fee_difference
FROM fee_issues
ORDER BY ABS(fee_difference) DESC;

-- Show all students to verify data (no limit)
SELECT 
  'ALL_STUDENTS' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  payment_status
FROM students 
ORDER BY class, full_name;

-- Reset session role
RESET session_replication_role;
