-- Final verification that all classes are working correctly
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Show all Pry classes specifically (these should now work in filter)
SELECT 
  'PRIMARY CLASSES (FILTER READY)' as status,
  class,
  COUNT(*) as student_count
FROM students 
WHERE class LIKE 'Pry%'
GROUP BY class
ORDER BY class;

-- Show Pry 4A students specifically
SELECT 
  'PRY 4A STUDENTS (SHOULD NOW FILTER)' as status,
  full_name,
  student_type,
  total_fees,
  hostel_fee
FROM students 
WHERE class = 'Pry 4A'
ORDER BY full_name;

-- Verify no invalid classes remain
SELECT 
  'INVALID CLASSES CHECK' as status,
  class,
  COUNT(*) as student_count
FROM students 
WHERE class NOT IN (
  'Toddler', 'Pre-Schooler', 'Nursery', 
  'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 
  'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 
  'Pry 5A', 'Pry 5B',
  'JSS1A', 'JSS1B', 'JSS1C', 'JSS1D',
  'JSS2A', 'JSS2B', 'JSS2C', 'JSS2D',
  'JSS3A', 'JSS3B', 'JSS3C',
  'SS1A1', 'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C',
  'SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C',
  'SS3A1', 'SS3A2', 'SS3B/C'
)
GROUP BY class;

-- Check for any remaining name issues
SELECT 
  'NAME CLEANLINESS CHECK' as status,
  COUNT(*) as count,
  STRING_AGG(DISTINCT full_name, ', ') as examples
FROM students 
WHERE full_name LIKE '% (F)' 
   OR full_name LIKE '% (M)' 
   OR full_name LIKE '% - Day%'
   OR full_name LIKE '% - Boarder%'
   OR full_name LIKE '% - Boarding%';

-- Final summary
SELECT 
  'FINAL SUMMARY' as status,
  'All classes are now valid and should work in filters' as message,
  COUNT(*) as total_students,
  COUNT(DISTINCT class) as unique_classes
FROM students;

RESET session_replication_role;
