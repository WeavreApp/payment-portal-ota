-- Verify class filter is working correctly after cleanup
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Show all primary classes with student counts
SELECT 
  'PRIMARY CLASSES' as status,
  class,
  COUNT(*) as student_count,
  STRING_AGG(DISTINCT full_name, ', ') as sample_students
FROM students 
WHERE class LIKE 'PRY%' OR class IN ('Toddler', 'Pre-Schooler', 'Nursery')
GROUP BY class
ORDER BY class;

-- Check for any remaining name issues
SELECT 
  'NAME ISSUES' as status,
  COUNT(*) as count,
  STRING_AGG(DISTINCT full_name, ', ') as examples
FROM students 
WHERE full_name LIKE '% (F)' 
   OR full_name LIKE '% (M)' 
   OR full_name LIKE '% - Day%'
   OR full_name LIKE '% - Boarder%'
   OR full_name LIKE '% - Boarding%';

-- Verify class names match constants
SELECT 
  'CLASS VERIFICATION' as status,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery', 
                 'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 
                 'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 
                 'Pry 5A', 'Pry 5B') THEN 'VALID'
    ELSE 'INVALID - NOT IN CONSTANTS'
  END as validation,
  class,
  COUNT(*) as student_count
FROM students 
WHERE class LIKE 'PRY%' OR class IN ('Toddler', 'Pre-Schooler', 'Nursery')
GROUP BY class
ORDER BY validation DESC, class;

-- Show PRY 4A students specifically
SELECT 
  'PRY 4A STUDENTS' as status,
  full_name,
  student_type,
  total_fees,
  hostel_fee
FROM students 
WHERE class = 'Pry 4A'
ORDER BY full_name;

RESET session_replication_role;
