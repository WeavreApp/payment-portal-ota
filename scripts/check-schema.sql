-- Check database schema to find correct column names
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for check
SET session_replication_role = 'origin';

-- Check class_fee_rates table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'class_fee_rates' 
ORDER BY ordinal_position;

-- Check if class_fee_rates table exists and show sample data
SELECT * FROM class_fee_rates LIMIT 5;

-- Check students table structure for SS2
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;

-- Check SS2 students data
SELECT 
  class,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  CASE WHEN AVG(hostel_fee) > 0 THEN AVG(total_fees) - AVG(hostel_fee) ELSE AVG(total_fees) END as avg_tuition_fee
FROM students 
WHERE class LIKE 'SS2%'
GROUP BY class
ORDER BY class;

-- Reset session role
RESET session_replication_role;
