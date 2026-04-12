-- Verify cleanup results
-- Run this in Supabase SQL Editor after cleanup script completes

-- First, disable RLS temporarily for verification
SET session_replication_role = 'origin';

-- Check total count after cleanup
SELECT COUNT(*) as total_students_after_cleanup FROM students;

-- Check for any remaining duplicates
WITH duplicate_check AS (
  SELECT 
    full_name,
    COUNT(*) as count
  FROM students 
  GROUP BY LOWER(TRIM(full_name)), full_name
  HAVING COUNT(*) > 1
)
SELECT 
  'REMAINING_DUPLICATES' as check_type,
  COUNT(*) as duplicate_count
FROM duplicate_check;

-- Check class breakdown
SELECT 
  'CLASS_BREAKDOWN' as check_type,
  class,
  COUNT(*) as student_count
FROM students 
GROUP BY class 
ORDER BY class;

-- Sample of cleaned data
SELECT 
  'SAMPLE_DATA' as check_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  payment_status
FROM students 
ORDER BY class, full_name 
LIMIT 15;

-- Reset session role
RESET session_replication_role;
