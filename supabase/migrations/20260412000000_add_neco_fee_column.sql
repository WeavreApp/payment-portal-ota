-- Add NECO fee column to students table
-- Run this in Supabase SQL Editor

-- Add neco_fee column to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS neco_fee numeric(12,2) DEFAULT 0;

-- Update existing SS3 students to include NECO fee if they don't have it yet
UPDATE students 
SET neco_fee = 40000 
WHERE class LIKE 'SS3%' 
AND neco_fee IS NULL OR neco_fee = 0;

-- Verify the changes
SELECT 
  'VERIFICATION' as status,
  class,
  COUNT(*) as total_students,
  COUNT(CASE WHEN neco_fee > 0 THEN 1 END) as students_with_neco,
  SUM(CASE WHEN neco_fee > 0 THEN neco_fee ELSE 0 END) as total_neco_fees
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class
ORDER BY class;

-- Show sample SS3 students with NECO fees
SELECT 
  'SAMPLE SS3 STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - neco_fee) as base_tuition_only
FROM students 
WHERE class LIKE 'SS3%' 
AND neco_fee > 0
ORDER BY full_name
LIMIT 10;
