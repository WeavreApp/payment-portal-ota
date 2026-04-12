-- Force refresh SS3 student fees to match new structure
-- Run this in Supabase SQL Editor

-- Update all SS3 students to use correct fee structure
UPDATE students 
SET 
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      645000 + 750000 + COALESCE(neco_fee, 0)
    ELSE 
      645000 + COALESCE(neco_fee, 0)
  END
WHERE class LIKE 'SS3%';

-- Verify the update
SELECT 
  'VERIFICATION' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fees,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  AVG(total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as avg_base_tuition
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class, student_type
ORDER BY class, student_type;

-- Show sample updated students
SELECT 
  'SAMPLE UPDATED STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as base_tuition,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) = 645000 THEN 'CORRECT TUITION'
    ELSE 'TUITION NEEDS FIX'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 10;
