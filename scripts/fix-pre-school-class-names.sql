-- Fix Pre-School class names to Pre-Schooler
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Update all students with wrong Pre-School class name
UPDATE students 
SET class = 'Pre-Schooler' 
WHERE class = 'Pre-School';

-- Verify the fix
SELECT 
  class,
  COUNT(*) as student_count
FROM students 
WHERE class IN ('Pre-Schooler', 'Pre-School')
GROUP BY class;

-- Show sample of fixed students
SELECT 
  full_name,
  class,
  student_type,
  total_fees
FROM students 
WHERE class = 'Pre-Schooler'
LIMIT 5;

RESET session_replication_role;
