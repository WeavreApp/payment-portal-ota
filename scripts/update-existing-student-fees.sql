-- Update existing students' fees based on current fee structure
-- Run this in Supabase SQL Editor

-- First, let's see the current fee structure
SELECT 
  'CURRENT FEE STRUCTURE' as status,
  class_name,
  day_student_fee,
  boarder_student_fee,
  allows_boarding
FROM class_fee_rates 
ORDER BY class_name;

-- Update SS3 students to use correct hostel fee (750k) and NECO if applicable
UPDATE students 
SET 
  hostel_fee = 750000,
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      (SELECT day_student_fee FROM class_fee_rates WHERE class_name = students.class) + 750000 + COALESCE(neco_fee, 0)
    ELSE 
      (SELECT day_student_fee FROM class_fee_rates WHERE class_name = students.class) + COALESCE(neco_fee, 0)
  END
WHERE class LIKE 'SS3%';

-- Update all other students to use current fee structure
UPDATE students 
SET 
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 
      (SELECT day_student_fee FROM class_fee_rates WHERE class_name = students.class) + 
      (SELECT COALESCE(setting_value, '250000')::numeric FROM fee_settings WHERE setting_key = 'global_hostel_fee')
    ELSE 
      (SELECT day_student_fee FROM class_fee_rates WHERE class_name = students.class)
  END
WHERE class NOT LIKE 'SS3%';

-- Update hostel fees for non-SS3 boarding students
UPDATE students 
SET 
  hostel_fee = (SELECT COALESCE(setting_value, '250000')::numeric FROM fee_settings WHERE setting_key = 'global_hostel_fee')
WHERE student_type = 'boarding' 
AND class NOT LIKE 'SS3%';

-- Verify the updates
SELECT 
  'VERIFICATION - UPDATED FEES' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fees,
  AVG(hostel_fee) as avg_hostel_fee,
  AVG(neco_fee) as avg_neco_fee
FROM students 
GROUP BY class, student_type
ORDER BY class, student_type;

-- Show sample of updated students
SELECT 
  'SAMPLE - UPDATED STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as base_tuition
FROM students 
ORDER BY class, full_name
LIMIT 10;
