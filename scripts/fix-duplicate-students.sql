-- Fix duplicate students - keep the most recent entry for each name
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

-- Remove duplicates - keep the most recent entry for each name
WITH ranked_students AS (
  SELECT 
    id,
    full_name,
    class,
    student_type,
    total_fees,
    hostel_fee,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY full_name ORDER BY created_at DESC, id DESC) as rn
  FROM students
)
DELETE FROM students 
WHERE id IN (
  SELECT id FROM ranked_students WHERE rn > 1
);

-- Show results after fixing
SELECT 
  'AFTER FIXING' as status,
  'Duplicates removed' as action,
  (
    SELECT COUNT(*) FROM students 
    WHERE full_name IN (
      SELECT full_name 
      FROM students 
      GROUP BY full_name 
      HAVING COUNT(*) > 1
    )
  ) as remaining_duplicates,
  COUNT(*) as total_students_remaining,
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
  END as duplicate_status;

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

-- Summary of what was removed
SELECT 
  'REMOVAL SUMMARY' as status,
  'Original total students' as metric,
  (SELECT COUNT(*) FROM students) + (
    SELECT COUNT(*) FROM ranked_students WHERE rn > 1
  ) as original_count,
  'Duplicates removed' as metric,
  (SELECT COUNT(*) FROM ranked_students WHERE rn > 1) as removed_count,
  'Final student count' as metric,
  (SELECT COUNT(*) FROM students) as final_count;

RESET session_replication_role;
