-- Simple check for students with abnormal fees
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Students with zero fees
SELECT 
  'ZERO FEES' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee
FROM students 
WHERE total_fees = 0 OR total_fees IS NULL
ORDER BY class, full_name;

-- Students with negative fees
SELECT 
  'NEGATIVE FEES' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee
FROM students 
WHERE total_fees < 0
ORDER BY class, full_name;

-- Students with very low fees (below 50k)
SELECT 
  'VERY LOW FEES' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee
FROM students 
WHERE total_fees > 0 AND total_fees < 50000
ORDER BY class, full_name;

-- Students with very high fees (above 500k)
SELECT 
  'VERY HIGH FEES' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee
FROM students 
WHERE total_fees > 500000
ORDER BY total_fees DESC, class;

-- Check specific class fee issues
SELECT 
  'CLASS FEE ISSUES' as issue_type,
  class,
  student_type,
  COUNT(*) as student_count,
  MIN(total_fees) as min_fee,
  MAX(total_fees) as max_fee,
  AVG(total_fees) as avg_fee
FROM students 
GROUP BY class, student_type
HAVING 
  MIN(total_fees) != MAX(total_fees) OR 
  COUNT(*) > 50 OR
  AVG(total_fees) < 50000 OR
  AVG(total_fees) > 500000
ORDER BY class, student_type;

-- Summary by class
SELECT 
  'CLASS SUMMARY' as issue_type,
  class,
  COUNT(*) as total_students,
  SUM(total_fees) as total_fees_sum,
  ROUND(AVG(total_fees)) as avg_fee,
  COUNT(CASE WHEN total_fees = 0 THEN 1 END) as zero_fees,
  COUNT(CASE WHEN total_fees < 0 THEN 1 END) as negative_fees
FROM students 
GROUP BY class
ORDER BY class;

RESET session_replication_role;
