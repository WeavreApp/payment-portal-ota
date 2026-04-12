-- Check for students with abnormal fees
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Define expected fee ranges for each class level
WITH expected_fees AS (
  SELECT 'Toddler' as class_level, 50000 as expected_day_fee, 0 as expected_boarder_fee
  UNION ALL SELECT 'Pre-Schooler', 75000, 0
  UNION ALL SELECT 'Nursery', 100000, 0
  UNION ALL SELECT 'Pry 1A', 120000, 370000
  UNION ALL SELECT 'Pry 1B', 120000, 370000
  UNION ALL SELECT 'Pry 2A', 120000, 370000
  UNION ALL SELECT 'Pry 2B', 120000, 370000
  UNION ALL SELECT 'Pry 3A', 120000, 370000
  UNION ALL SELECT 'Pry 3B', 120000, 370000
  UNION ALL SELECT 'Pry 4A', 130000, 380000
  UNION ALL SELECT 'Pry 4B', 130000, 380000
  UNION ALL SELECT 'Pry 5A', 130000, 380000
  UNION ALL SELECT 'Pry 5B', 130000, 380000
  UNION ALL SELECT 'JSS1A', 165000, 415000
  UNION ALL SELECT 'JSS1B', 165000, 415000
  UNION ALL SELECT 'JSS1C', 165000, 415000
  UNION ALL SELECT 'JSS1D', 165000, 415000
  UNION ALL SELECT 'JSS2A', 165000, 415000
  UNION ALL SELECT 'JSS2B', 165000, 415000
  UNION ALL SELECT 'JSS2C', 165000, 415000
  UNION ALL SELECT 'JSS2D', 165000, 415000
  UNION ALL SELECT 'JSS3A', 165000, 415000
  UNION ALL SELECT 'JSS3B', 165000, 415000
  UNION ALL SELECT 'JSS3C', 165000, 415000
  UNION ALL SELECT 'SS1A1', 185000, 435000
  UNION ALL SELECT 'SS1A2', 185000, 435000
  UNION ALL SELECT 'SS1A3', 185000, 435000
  UNION ALL SELECT 'SS1A4', 185000, 435000
  UNION ALL SELECT 'SS1B/C', 185000, 435000
  UNION ALL SELECT 'SS2A1', 180000, 430000
  UNION ALL SELECT 'SS2A2', 180000, 430000
  UNION ALL SELECT 'SS2A3', 180000, 430000
  UNION ALL SELECT 'SS2A4', 180000, 430000
  UNION ALL SELECT 'SS2B/C', 180000, 430000
  UNION ALL SELECT 'SS3A1', 180000, 430000
  UNION ALL SELECT 'SS3A2', 180000, 430000
  UNION ALL SELECT 'SS3B/C', 180000, 430000
),

student_fee_analysis AS (
  SELECT 
    s.id,
    s.full_name,
    s.class,
    s.student_type,
    s.total_fees,
    s.hostel_fee,
    ef.expected_day_fee,
    ef.expected_boarder_fee,
    CASE 
      WHEN s.student_type = 'day' THEN ef.expected_day_fee
      WHEN s.student_type = 'boarding' THEN ef.expected_boarder_fee
      ELSE ef.expected_day_fee
    END as expected_total_fee,
    CASE 
      WHEN s.student_type = 'day' THEN ef.expected_day_fee
      WHEN s.student_type = 'boarding' THEN ef.expected_boarder_fee
      ELSE ef.expected_day_fee
    END as expected_hostel_fee,
    s.total_fees - CASE 
      WHEN s.student_type = 'day' THEN ef.expected_day_fee
      WHEN s.student_type = 'boarding' THEN ef.expected_boarder_fee
      ELSE ef.expected_day_fee
    END as fee_difference,
    CASE 
      WHEN s.total_fees = 0 THEN 'ZERO FEE'
      WHEN s.total_fees < 0 THEN 'NEGATIVE FEE'
      WHEN s.total_fees < 50000 THEN 'VERY LOW FEE'
      WHEN s.total_fees > 500000 THEN 'VERY HIGH FEE'
      WHEN s.total_fees != CASE 
        WHEN s.student_type = 'day' THEN ef.expected_day_fee
        WHEN s.student_type = 'boarding' THEN ef.expected_boarder_fee
        ELSE ef.expected_day_fee
      END THEN 'INCORRECT FEE'
      ELSE 'CORRECT FEE'
    END as fee_status
  FROM students s
  LEFT JOIN expected_fees ef ON s.class = ef.class_level
)

-- Show students with abnormal fees
SELECT 
  'ABNORMAL FEES DETECTED' as status,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  expected_total_fee,
  fee_difference,
  fee_status
FROM student_fee_analysis
WHERE fee_status != 'CORRECT FEE'
ORDER BY 
  CASE 
    WHEN fee_status = 'ZERO FEE' THEN 1
    WHEN fee_status = 'NEGATIVE FEE' THEN 2
    WHEN fee_status = 'VERY LOW FEE' THEN 3
    WHEN fee_status = 'VERY HIGH FEE' THEN 4
    WHEN fee_status = 'INCORRECT FEE' THEN 5
    ELSE 6
  END,
  class,
  full_name;

-- Summary of abnormal fees by type
SELECT 
  'ABNORMAL FEES SUMMARY' as status,
  fee_status,
  COUNT(*) as student_count,
  SUM(total_fees) as total_fees_sum,
  AVG(total_fees) as average_fee
FROM student_fee_analysis
WHERE fee_status != 'CORRECT FEE'
GROUP BY fee_status
ORDER BY student_count DESC;

-- Show classes with most fee issues
SELECT 
  'CLASSES WITH FEE ISSUES' as status,
  class,
  COUNT(*) as total_students,
  SUM(CASE WHEN fee_status != 'CORRECT FEE' THEN 1 ELSE 0 END) as abnormal_count,
  ROUND(SUM(CASE WHEN fee_status != 'CORRECT FEE' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as issue_percentage
FROM student_fee_analysis
GROUP BY class
HAVING SUM(CASE WHEN fee_status != 'CORRECT FEE' THEN 1 ELSE 0 END) > 0
ORDER BY abnormal_count DESC;

RESET session_replication_role;
