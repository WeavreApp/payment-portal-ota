-- Fix duplicate students - keep the most recent entry for each name (FIXED)
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Show duplicates before fixing
SELECT 
  'BEFORE FIXING' as status,
  full_name,
  COUNT(*) as duplicate_count,
  STRING_AGG(DISTINCT class, ', ' ORDER BY class) as classes_found,
  STRING_AGG(DISTINCT student_type, ', ' ORDER BY student_type) as student_types,
  STRING_AGG(DISTINCT total_fees::text, ', ') as fees_found
FROM students 
GROUP BY full_name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, full_name;

-- Get count before deletion
SELECT 
  'COUNT BEFORE DELETION' as status,
  COUNT(*) as students_before_fix
FROM students;

-- Remove duplicates - keep the most recent entry for each name
DELETE FROM students 
WHERE id NOT IN (
  SELECT DISTINCT ON (full_name) id
  FROM students 
  ORDER BY full_name, created_at DESC, id DESC
);

-- Show results after fixing
SELECT 
  'AFTER FIXING' as status,
  COUNT(*) as students_after_fix,
  COUNT(DISTINCT class) as unique_classes_remaining
FROM students;

-- Verify no more duplicates exist
SELECT 
  'VERIFICATION' as status,
  CASE 
    WHEN (
      SELECT COUNT(*) FROM (
        SELECT full_name
        FROM students 
        GROUP BY full_name 
        HAVING COUNT(*) > 1
      ) duplicates
    ) = 0 THEN 'NO DUPLICATES FOUND'
    ELSE 'DUPLICATES STILL EXIST'
  END as duplicate_status,
  (
    SELECT COUNT(*) FROM (
      SELECT full_name
      FROM students 
      GROUP BY full_name 
      HAVING COUNT(*) > 1
    ) duplicates
  ) as remaining_duplicate_count;

-- Show sample of cleaned students
SELECT 
  'CLEANED STUDENTS SAMPLE' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at
FROM students 
ORDER BY created_at DESC
LIMIT 10;

-- Show any remaining duplicates (if any)
SELECT 
  'REMAINING DUPLICATES' as status,
  full_name,
  COUNT(*) as duplicate_count,
  STRING_AGG(DISTINCT class, ', ' ORDER BY class) as classes_found
FROM students 
GROUP BY full_name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, full_name;

RESET session_replication_role;
