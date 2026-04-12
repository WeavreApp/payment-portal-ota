-- Check the actual SS2 fee rate in the database
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for check
SET session_replication_role = 'origin';

-- Check SS2 class fee rates
SELECT 
  class_name,
  display_name,
  day_student_fee,
  boarder_student_fee,
  allows_boarding
FROM class_fee_rates 
WHERE class_name LIKE 'SS2%' OR class_name = 'SS2'
ORDER BY class_name;

-- Check all SS2 subclasses
SELECT 
  class_name,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  CASE WHEN AVG(hostel_fee) > 0 THEN AVG(total_fees) - AVG(hostel_fee) ELSE AVG(total_fees) END as avg_tuition_fee
FROM students 
WHERE class LIKE 'SS2%'
GROUP BY class_name
ORDER BY class_name;

-- Reset session role
RESET session_replication_role;
