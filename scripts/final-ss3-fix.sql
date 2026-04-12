-- Final fix for SS3 students - simple and working
-- Run this in Supabase SQL Editor

-- Update all SS3 students to correct fee structure
UPDATE students 
SET 
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      645000 + 750000 + COALESCE(neco_fee, 0)
    ELSE 
      645000 + COALESCE(neco_fee, 0)
  END
WHERE class LIKE 'SS3%';

-- Verify the update worked
SELECT 
  'SS3 FEES FIXED' as status,
  COUNT(*) as students_updated,
  AVG(total_fees) as avg_total_fees,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee
  AVG(total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as avg_base_tuition
FROM students 
WHERE class LIKE 'SS3%';

-- Show sample of updated students
SELECT 
  'SAMPLE SS3 STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as base_tuition,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) = 645000 THEN 'CORRECT TUITION'
    ELSE 'TUITION ISSUE'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 5;
