-- Quick check of SS2 actual fees to determine correct day fee
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Check SS2 day students to see their actual tuition fees
SELECT 
  class,
  student_type,
  total_fees,
  hostel_fee,
  total_fees - hostel_fee as actual_tuition_fee
FROM students 
WHERE class LIKE 'SS2%' AND student_type = 'day'
LIMIT 10;

-- Check SS2 boarding students to see their fee structure
SELECT 
  class,
  student_type,
  total_fees,
  hostel_fee,
  total_fees - hostel_fee as actual_tuition_fee
FROM students 
WHERE class LIKE 'SS2%' AND student_type = 'boarding'
LIMIT 10;

-- Get average tuition fees for SS2
SELECT 
  'SS2_DAY_TUITION' as fee_type,
  AVG(total_fees) as avg_day_fee
FROM students 
WHERE class LIKE 'SS2%' AND student_type = 'day';

SELECT 
  'SS2_BOARDING_TUITION' as fee_type,
  AVG(total_fees - hostel_fee) as avg_tuition_fee
FROM students 
WHERE class LIKE 'SS2%' AND student_type = 'boarding';

RESET session_replication_role;
