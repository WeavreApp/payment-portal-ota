-- Fix SS3 tuition fees to ₦645,000 (without NECO)
-- Run this in Supabase SQL Editor

-- First, check current SS3 tuition structure
SELECT 
  'CURRENT SS3 FEES' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_current_total,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  AVG(total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as avg_current_tuition
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class, student_type
ORDER BY class, student_type;

-- Update class_fee_rates table to set SS3 tuition to ₦645,000
UPDATE class_fee_rates 
SET day_student_fee = 645000
WHERE class_name LIKE 'SS3%';

-- Update existing SS3 students' tuition fees
UPDATE students 
SET 
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      645000 + 750000 + COALESCE(neco_fee, 0)
    ELSE 
      645000 + COALESCE(neco_fee, 0)
  END
WHERE class LIKE 'SS3%';

-- Verify the updates
SELECT 
  'UPDATED SS3 FEES' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_updated_total,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  AVG(total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as avg_updated_tuition
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class, student_type
ORDER BY class, student_type;

-- Show expected vs actual for SS3
SELECT 
  'EXPECTED VS ACTUAL' as status,
  student_type,
  'Expected' as comparison,
  CASE 
    WHEN student_type = 'boarding' THEN '₦645,000 + ₦750,000 hostel + NECO'
    ELSE '₦645,000 + NECO'
  END as expected_structure,
  'Actual' as comparison,
  CASE 
    WHEN student_type = 'boarding' THEN CONCAT('₦', AVG(total_fees - COALESCE(neco_fee, 0) - hostel_fee), ' tuition + ₦', AVG(hostel_fee), ' hostel + ₦', AVG(COALESCE(neco_fee, 0)), ' NECO = ₦', AVG(total_fees))
    ELSE CONCAT('₦', AVG(total_fees - COALESCE(neco_fee, 0)), ' tuition + ₦', AVG(COALESCE(neco_fee, 0)), ' NECO = ₦', AVG(total_fees))
  END as actual_structure
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type;

-- Show sample updated students
SELECT 
  'SAMPLE UPDATED SS3 STUDENTS' as status,
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
