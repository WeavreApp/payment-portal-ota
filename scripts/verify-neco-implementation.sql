-- Comprehensive verification of NECO implementation
-- Run this in Supabase SQL Editor

-- Test 1: Verify SS3 students have correct fee structure
SELECT 
  'TEST 1 - SS3 FEE STRUCTURE' as status,
  class,
  COUNT(*) as total_ss3_students,
  COUNT(CASE WHEN neco_fee > 0 THEN 1 END) as students_with_neco,
  SUM(CASE WHEN neco_fee > 0 THEN neco_fee ELSE 0 END) as total_neco_fees,
  AVG(CASE WHEN neco_fee > 0 THEN neco_fee ELSE 0 END) as avg_neco_fee,
  AVG(total_fees) as avg_total_fees
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class
ORDER BY class;

-- Test 2: Verify SS3 hostel fees are correct (750k)
SELECT 
  'TEST 2 - SS3 HOSTEL FEES' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - neco_fee - hostel_fee) as base_tuition_only,
  CASE 
    WHEN student_type = 'boarding' AND hostel_fee = 750000 THEN 'CORRECT'
    WHEN student_type = 'boarding' AND hostel_fee = 430000 THEN 'NEEDS UPDATE'
    ELSE 'CHECK MANUAL'
  END as hostel_fee_status
FROM students 
WHERE class LIKE 'SS3%'
AND student_type = 'boarding'
ORDER BY full_name
LIMIT 10;

-- Test 3: Verify day students don't have NECO fees
SELECT 
  'TEST 3 - DAY STUDENTS NO NECO' as status,
  COUNT(*) as day_ss3_students,
  COUNT(CASE WHEN neco_fee > 0 THEN 1 END) as day_with_neco,
  SUM(CASE WHEN neco_fee > 0 THEN neco_fee ELSE 0 END) as day_neco_total
FROM students 
WHERE class LIKE 'SS3%'
AND student_type = 'day';

-- Test 4: Verify total fees calculation for SS3
SELECT 
  'TEST 4 - SS3 TOTAL FEES BREAKDOWN' as status,
  full_name,
  class,
  student_type,
  total_fees as current_total,
  neco_fee,
  hostel_fee,
  (total_fees - neco_fee - hostel_fee) as base_tuition_only,
  (total_fees - neco_fee) as tuition_plus_hostel,
  CASE 
    WHEN total_fees = (total_fees - neco_fee) THEN 'CORRECT'
    ELSE 'CALCULATION ERROR'
  END as fee_calculation_status
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 5;

-- Test 5: Show fee breakdown by student type
SELECT 
  'TEST 5 - FEE BREAKDOWN BY TYPE' as status,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fees,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  SUM(CASE WHEN neco_fee > 0 THEN neco_fee ELSE 0 END) as total_neco_fees
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type;

-- Test 6: Verify non-SS3 students don't have NECO fees
SELECT 
  'TEST 6 - NON-SS3 NO NECO' as status,
  COUNT(*) as non_ss3_students,
  COUNT(CASE WHEN neco_fee > 0 THEN 1 END) as non_ss3_with_neco,
  SUM(CASE WHEN neco_fee > 0 THEN neco_fee ELSE 0 END) as total_non_ss3_neco
FROM students 
WHERE class NOT LIKE 'SS3%';

-- Test 7: Overall fee summary
SELECT 
  'TEST 7 - OVERALL FEE SUMMARY' as status,
  'All Students' as category,
  COUNT(*) as total_students,
  SUM(total_fees) as total_fees_sum,
  SUM(neco_fee) as total_neco_fees_sum,
  COUNT(CASE WHEN neco_fee > 0 THEN 1 END) as students_with_neco_fees,
  ROUND(AVG(total_fees), 2) as avg_total_fees
FROM students;

-- Test 8: Verify database schema includes neco_fee column
SELECT 
  'TEST 8 - DATABASE SCHEMA' as status,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'students' 
AND column_name IN ('total_fees', 'neco_fee', 'hostel_fee')
ORDER BY ordinal_position;
