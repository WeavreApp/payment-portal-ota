-- Complete Migration Script for SS3 Fee System
-- Run this entire script in Supabase SQL Editor

-- STEP 1: Add SS3 Hostel Fee Setting
INSERT INTO fee_settings (setting_key, setting_value, description)
VALUES 
  ('ss3_hostel_fee', '750000', 'Hostel fee specifically for SS3 students')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = '750000',
  description = 'Hostel fee specifically for SS3 students';

-- STEP 2: Verify SS3 Hostel Fee Setting
SELECT 
  'SS3 HOSTEL FEE ADDED' as status,
  setting_key,
  setting_value,
  description
FROM fee_settings 
WHERE setting_key = 'ss3_hostel_fee';

-- STEP 3: Fix All SS3 Student Fees
UPDATE students 
SET 
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 645000 + 750000 + COALESCE(neco_fee, 0)
    ELSE 645000 + COALESCE(neco_fee, 0)
  END
WHERE class LIKE 'SS3%';

-- STEP 4: Verify SS3 Student Fees Fixed
SELECT 
  'SS3 FEES FIXED' as status,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fees,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type;

-- STEP 5: Show Sample of Fixed Students
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
    WHEN (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) = 645000 THEN 'CORRECT BASE'
    ELSE 'BASE ISSUE'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 5;

-- STEP 6: Final Summary
SELECT 
  'MIGRATION COMPLETE' as status,
  COUNT(*) as total_ss3_students,
  SUM(CASE WHEN student_type = 'boarding' THEN 1 ELSE 0 END) as boarding_count,
  SUM(CASE WHEN student_type = 'day' THEN 1 ELSE 0 END) as day_count,
  AVG(total_fees) as overall_avg_total
FROM students 
WHERE class LIKE 'SS3%';
