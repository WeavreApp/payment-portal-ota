-- Remove test/suspicious students found in analysis
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Remove students with test-like names
DELETE FROM students 
WHERE LOWER(full_name) LIKE '%test%' 
   OR LOWER(full_name) LIKE '%demo%' 
   OR LOWER(full_name) LIKE '%sample%' 
   OR LOWER(full_name) LIKE '%admin%' 
   OR LOWER(full_name) LIKE '%user%' 
   OR LOWER(full_name) LIKE '%example%' 
   OR LOWER(full_name) LIKE '%placeholder%';

-- Remove students with unusual patterns
DELETE FROM students 
WHERE full_name ~ '[A-Z]{3,}' 
   OR full_name ~ '[0-9]{3,}' 
   OR full_name LIKE 'Student %'
   OR full_name LIKE 'Test Student %'
   OR LENGTH(full_name) <= 2
   OR full_name LIKE '%John Doe%'
   OR full_name LIKE '%Jane Doe%';

-- Remove students with very old creation dates (likely test data)
DELETE FROM students 
WHERE created_at < '2024-01-01';

-- Remove students with suspicious fee amounts
DELETE FROM students 
WHERE total_fees IN (1, 100, 1000, 12345, 999999, 111111);

-- Remove students with default/test UUID patterns
DELETE FROM students 
WHERE id::text LIKE '00000000-%' 
   OR id::text LIKE '12345678-%' 
   OR id::text LIKE 'ffffffff-%'
   OR LENGTH(id::text) < 20;

-- Show what was removed
SELECT 
  'REMOVAL SUMMARY' as status,
  'Test/suspicious students removed' as action,
  (
    SELECT COUNT(*) FROM students 
    WHERE LOWER(full_name) LIKE '%test%' 
       OR LOWER(full_name) LIKE '%demo%' 
       OR LOWER(full_name) LIKE '%sample%' 
       OR LOWER(full_name) LIKE '%admin%' 
       OR LOWER(full_name) LIKE '%user%' 
       OR LOWER(full_name) LIKE '%example%' 
       OR LOWER(full_name) LIKE '%placeholder%'
  ) as test_names_removed,
  (
    SELECT COUNT(*) FROM students 
    WHERE full_name ~ '[A-Z]{3,}' 
       OR full_name ~ '[0-9]{3,}' 
       OR full_name LIKE 'Student %'
       OR full_name LIKE 'Test Student %'
       OR LENGTH(full_name) <= 2
       OR full_name LIKE '%John Doe%'
       OR full_name LIKE '%Jane Doe%'
  ) as pattern_removed,
  (
    SELECT COUNT(*) FROM students 
    WHERE created_at < '2024-01-01'
  ) as old_data_removed,
  (
    SELECT COUNT(*) FROM students 
    WHERE total_fees IN (1, 100, 1000, 12345, 999999, 111111)
  ) as suspicious_fees_removed,
  (
    SELECT COUNT(*) FROM students 
    WHERE id::text LIKE '00000000-%' 
       OR id::text LIKE '12345678-%' 
       OR id::text LIKE 'ffffffff-%'
       OR LENGTH(id::text) < 20
  ) as test_ids_removed;

-- Show remaining students count
SELECT 
  'FINAL COUNT' as status,
  COUNT(*) as remaining_students,
  COUNT(DISTINCT class) as remaining_classes,
  ROUND(AVG(total_fees)) as avg_remaining_fee
FROM students;

-- Show sample of remaining students
SELECT 
  'REMAINING STUDENTS SAMPLE' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at
FROM students 
ORDER BY created_at DESC
LIMIT 10;

RESET session_replication_role;
