-- Simple NECO implementation test
-- Run this in Supabase SQL Editor

-- Test 1: Check if neco_fee column exists
SELECT 
  'TEST 1 - NECO COLUMN EXISTS' as status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'neco_fee'
    ) THEN 'COLUMN EXISTS'
    ELSE 'COLUMN MISSING'
  END as neco_column_status;

-- Test 2: Count SS3 students with NECO fees
SELECT 
  'TEST 2 - SS3 WITH NECO' as status,
  COUNT(*) as ss3_with_neco,
  SUM(neco_fee) as total_neco_charged
FROM students 
WHERE class LIKE 'SS3%' 
AND neco_fee > 0;

-- Test 3: Show SS3 fee breakdown
SELECT 
  'TEST 3 - SS3 FEE BREAKDOWN' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - neco_fee) as tuition_plus_hostel,
  CASE 
    WHEN student_type = 'boarding' THEN 
      CONCAT('Day: ₦', (total_fees - neco_fee), ' + Hostel: ₦', hostel_fee)
    ELSE 
      CONCAT('Day: ₦', total_fees)
  END as fee_breakdown
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 5;

-- Test 4: Verify SS3 hostel fee is 750k
SELECT 
  'TEST 4 - SS3 HOSTEL VERIFICATION' as status,
  COUNT(*) as total_ss3_boarding,
  COUNT(CASE WHEN hostel_fee = 750000 THEN 1 END) as correct_hostel_fee,
  COUNT(CASE WHEN hostel_fee = 430000 THEN 1 END) as old_hostel_fee,
  AVG(hostel_fee) as avg_hostel_fee
FROM students 
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding';
