-- Clean up duplicates and fix invalid data
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for cleanup
SET session_replication_role = 'origin';

-- Remove invalid/placeholder students
DELETE FROM students 
WHERE full_name IN ('yummy food', 'Faisal', 'mun', 'Eniola', 'bb', 'vunt', 'Dare', 'Mons');

-- Remove duplicates, keeping only the first occurrence
WITH deduplicated AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(full_name)) 
      ORDER BY id ASC
    ) as rn
  FROM students
)
DELETE FROM students 
WHERE id IN (
  SELECT id FROM deduplicated WHERE rn > 1
);

-- Check remaining count
SELECT COUNT(*) as remaining_students FROM students;

-- Show sample of cleaned data
SELECT 
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  payment_status
FROM students 
ORDER BY class, full_name 
LIMIT 20;

-- Reset session role
RESET session_replication_role;
