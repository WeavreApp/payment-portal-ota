-- Check for duplicate students across different classes (FIXED)
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Find students with the same name in different classes
SELECT 
  'DUPLICATE NAMES IN DIFFERENT CLASSES' as status,
  full_name,
  COUNT(*) as duplicate_count,
  STRING_AGG(DISTINCT class, ', ' ORDER BY class) as classes_found,
  STRING_AGG(DISTINCT student_type, ', ' ORDER BY student_type) as student_types,
  STRING_AGG(DISTINCT total_fees::text, ', ') as fees_found
FROM students 
GROUP BY full_name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, full_name;

-- Find exact duplicates (same name, same class, same type)
SELECT 
  'EXACT DUPLICATES (SAME EVERYTHING)' as status,
  full_name,
  class,
  student_type,
  COUNT(*) as exact_duplicate_count,
  STRING_AGG(id::text, ', ') as duplicate_ids
FROM students 
GROUP BY full_name, class, student_type
HAVING COUNT(*) > 1
ORDER BY exact_duplicate_count DESC, full_name;

-- Show specific students that appear in multiple classes
SELECT 
  'MULTI-CLASS STUDENTS' as status,
  s1.full_name,
  s1.class as class1,
  s1.student_type as type1,
  s1.total_fees as fee1,
  s1.created_at as created1,
  s2.class as class2,
  s2.student_type as type2,
  s2.total_fees as fee2,
  s2.created_at as created2
FROM students s1
JOIN students s2 ON s1.full_name = s2.full_name AND s1.id < s2.id
WHERE s1.class != s2.class
ORDER BY s1.full_name, s1.class;

-- Check for students with similar names (might be typos)
SELECT 
  'SIMILAR NAMES (POSSIBLE TYPOS)' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at
FROM students 
WHERE full_name IN (
  SELECT full_name 
  FROM students 
  GROUP BY full_name 
  HAVING COUNT(*) > 1
)
ORDER BY full_name, class;

-- Summary of duplicate issues
SELECT 
  'DUPLICATE SUMMARY' as status,
  'Students with duplicates' as metric,
  COUNT(*) as count
FROM (
  SELECT full_name
  FROM students 
  GROUP BY full_name 
  HAVING COUNT(*) > 1
) duplicates;

-- Show students with (F), (M), - Day suffixes that might be duplicates
SELECT 
  'NAME SUFFIX ISSUES' as status,
  full_name,
  class,
  student_type,
  total_fees,
  CASE 
    WHEN full_name LIKE '% (F)%' THEN 'HAS (F) SUFFIX'
    WHEN full_name LIKE '% (M)%' THEN 'HAS (M) SUFFIX'
    WHEN full_name LIKE '% - Day%' THEN 'HAS - Day SUFFIX'
    WHEN full_name LIKE '% - Boarding%' THEN 'HAS - Boarding SUFFIX'
    ELSE 'NORMAL NAME'
  END as suffix_type
FROM students 
WHERE full_name LIKE '% (F)%' 
   OR full_name LIKE '% (M)%' 
   OR full_name LIKE '% - Day%' 
   OR full_name LIKE '% - Boarding%'
ORDER BY full_name;

RESET session_replication_role;
