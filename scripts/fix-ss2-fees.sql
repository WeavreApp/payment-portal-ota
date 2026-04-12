-- Fix SS2 fees directly in the database
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Update SS2 day students to have correct fee of 180,000
UPDATE students 
SET total_fees = 180000
WHERE class LIKE 'SS2%' AND student_type = 'day';

-- Update SS2 boarding students to have correct total fee of 430,000 (180,000 tuition + 250,000 hostel)
UPDATE students 
SET total_fees = 430000
WHERE class LIKE 'SS2%' AND student_type = 'boarding';

-- Verify the changes
SELECT 
  class,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  CASE WHEN AVG(hostel_fee) > 0 THEN AVG(total_fees) - AVG(hostel_fee) ELSE AVG(total_fees) END as avg_tuition_fee
FROM students 
WHERE class LIKE 'SS2%'
GROUP BY class, student_type
ORDER BY class, student_type;

-- Show sample of updated SS2 students
SELECT 
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  total_fees - hostel_fee as tuition_fee
FROM students 
WHERE class LIKE 'SS2%'
ORDER BY class, student_type, full_name
LIMIT 10;

RESET session_replication_role;
