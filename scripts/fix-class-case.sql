-- Fix class case: PRY -> Pry to match constants
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Update all PRY classes to Pry (correct case)
UPDATE students 
SET class = REPLACE(class, 'PRY ', 'Pry ')
WHERE class LIKE 'PRY %';

-- Verify the fix
SELECT 
  'CLASS CASE FIX' as status,
  class,
  COUNT(*) as student_count,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery', 
                 'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 
                 'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 
                 'Pry 5A', 'Pry 5B') THEN 'VALID'
    ELSE 'INVALID - NOT IN CONSTANTS'
  END as validation
FROM students 
WHERE class LIKE 'Pry%' OR class IN ('Toddler', 'Pre-Schooler', 'Nursery')
GROUP BY class
ORDER BY class;

-- Show Pry 4A students specifically
SELECT 
  'PRY 4A (NOW Pry 4A) STUDENTS' as status,
  full_name,
  student_type,
  total_fees,
  hostel_fee
FROM students 
WHERE class = 'Pry 4A'
ORDER BY full_name;

RESET session_replication_role;
