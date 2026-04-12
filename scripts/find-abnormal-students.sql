-- Find the 13 students with abnormal fees
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Students with invalid fees (outside 50K-500K range or wrong class/type)
SELECT 
  'ABNORMAL FEE STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  CASE 
    WHEN total_fees = 0 THEN 'ZERO FEE'
    WHEN total_fees < 0 THEN 'NEGATIVE FEE'
    WHEN total_fees < 50000 THEN 'VERY LOW FEE'
    WHEN total_fees > 500000 THEN 'VERY HIGH FEE'
    WHEN total_fees != CASE 
      WHEN class = 'Toddler' AND student_type = 'day' THEN 50000
      WHEN class = 'Pre-Schooler' AND student_type = 'day' THEN 75000
      WHEN class = 'Nursery' AND student_type = 'day' THEN 100000
      WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'day' THEN 120000
      WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'boarding' THEN 370000
      WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'day' THEN 130000
      WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'boarding' THEN 380000
      WHEN class LIKE 'JSS%' AND student_type = 'day' THEN 165000
      WHEN class LIKE 'JSS%' AND student_type = 'boarding' THEN 415000
      WHEN class LIKE 'SS1%' AND student_type = 'day' THEN 185000
      WHEN class LIKE 'SS1%' AND student_type = 'boarding' THEN 435000
      WHEN class LIKE 'SS2%' AND student_type = 'day' THEN 180000
      WHEN class LIKE 'SS2%' AND student_type = 'boarding' THEN 430000
      WHEN class LIKE 'SS3%' AND student_type = 'day' THEN 180000
      WHEN class LIKE 'SS3%' AND student_type = 'boarding' THEN 430000
      ELSE total_fees
    END THEN 'INCORRECT FEE FOR CLASS/TYPE'
    ELSE 'CORRECT FEE'
  END as issue_type,
  CASE 
    WHEN class = 'Toddler' AND student_type = 'day' THEN 50000
    WHEN class = 'Pre-Schooler' AND student_type = 'day' THEN 75000
    WHEN class = 'Nursery' AND student_type = 'day' THEN 100000
    WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'day' THEN 120000
    WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'boarding' THEN 370000
    WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'day' THEN 130000
    WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'boarding' THEN 380000
    WHEN class LIKE 'JSS%' AND student_type = 'day' THEN 165000
    WHEN class LIKE 'JSS%' AND student_type = 'boarding' THEN 415000
    WHEN class LIKE 'SS1%' AND student_type = 'day' THEN 185000
    WHEN class LIKE 'SS1%' AND student_type = 'boarding' THEN 435000
    WHEN class LIKE 'SS2%' AND student_type = 'day' THEN 180000
    WHEN class LIKE 'SS2%' AND student_type = 'boarding' THEN 430000
    WHEN class LIKE 'SS3%' AND student_type = 'day' THEN 180000
    WHEN class LIKE 'SS3%' AND student_type = 'boarding' THEN 430000
    ELSE total_fees
  END as expected_fee,
  total_fees - CASE 
    WHEN class = 'Toddler' AND student_type = 'day' THEN 50000
    WHEN class = 'Pre-Schooler' AND student_type = 'day' THEN 75000
    WHEN class = 'Nursery' AND student_type = 'day' THEN 100000
    WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'day' THEN 120000
    WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'boarding' THEN 370000
    WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'day' THEN 130000
    WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'boarding' THEN 380000
    WHEN class LIKE 'JSS%' AND student_type = 'day' THEN 165000
    WHEN class LIKE 'JSS%' AND student_type = 'boarding' THEN 415000
    WHEN class LIKE 'SS1%' AND student_type = 'day' THEN 185000
    WHEN class LIKE 'SS1%' AND student_type = 'boarding' THEN 435000
    WHEN class LIKE 'SS2%' AND student_type = 'day' THEN 180000
    WHEN class LIKE 'SS2%' AND student_type = 'boarding' THEN 430000
    WHEN class LIKE 'SS3%' AND student_type = 'day' THEN 180000
    WHEN class LIKE 'SS3%' AND student_type = 'boarding' THEN 430000
    ELSE total_fees
  END as fee_difference
FROM students 
WHERE total_fees = 0 
   OR total_fees < 0 
   OR total_fees < 50000 
   OR total_fees > 500000
   OR total_fees != CASE 
      WHEN class = 'Toddler' AND student_type = 'day' THEN 50000
      WHEN class = 'Pre-Schooler' AND student_type = 'day' THEN 75000
      WHEN class = 'Nursery' AND student_type = 'day' THEN 100000
      WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'day' THEN 120000
      WHEN class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND student_type = 'boarding' THEN 370000
      WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'day' THEN 130000
      WHEN class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND student_type = 'boarding' THEN 380000
      WHEN class LIKE 'JSS%' AND student_type = 'day' THEN 165000
      WHEN class LIKE 'JSS%' AND student_type = 'boarding' THEN 415000
      WHEN class LIKE 'SS1%' AND student_type = 'day' THEN 185000
      WHEN class LIKE 'SS1%' AND student_type = 'boarding' THEN 435000
      WHEN class LIKE 'SS2%' AND student_type = 'day' THEN 180000
      WHEN class LIKE 'SS2%' AND student_type = 'boarding' THEN 430000
      WHEN class LIKE 'SS3%' AND student_type = 'day' THEN 180000
      WHEN class LIKE 'SS3%' AND student_type = 'boarding' THEN 430000
      ELSE total_fees
    END
ORDER BY 
  CASE 
    WHEN total_fees = 0 THEN 1
    WHEN total_fees < 0 THEN 2
    WHEN total_fees < 50000 THEN 3
    WHEN total_fees > 500000 THEN 4
    ELSE 5
  END,
  class,
  full_name;

-- Summary by issue type
SELECT 
  'ISSUE SUMMARY' as status,
  issue_type,
  COUNT(*) as student_count,
  SUM(total_fees) as total_fees_affected,
  ROUND(AVG(total_fees)) as avg_fee_for_issue
FROM (
  SELECT 
    s.full_name,
    s.class,
    s.student_type,
    s.total_fees,
    CASE 
      WHEN s.total_fees = 0 THEN 'ZERO FEE'
      WHEN s.total_fees < 0 THEN 'NEGATIVE FEE'
      WHEN s.total_fees < 50000 THEN 'VERY LOW FEE'
      WHEN s.total_fees > 500000 THEN 'VERY HIGH FEE'
      WHEN s.total_fees != CASE 
        WHEN s.class = 'Toddler' AND s.student_type = 'day' THEN 50000
        WHEN s.class = 'Pre-Schooler' AND s.student_type = 'day' THEN 75000
        WHEN s.class = 'Nursery' AND s.student_type = 'day' THEN 100000
        WHEN s.class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND s.student_type = 'day' THEN 120000
        WHEN s.class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND s.student_type = 'boarding' THEN 370000
        WHEN s.class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND s.student_type = 'day' THEN 130000
        WHEN s.class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND s.student_type = 'boarding' THEN 380000
        WHEN s.class LIKE 'JSS%' AND s.student_type = 'day' THEN 165000
        WHEN s.class LIKE 'JSS%' AND s.student_type = 'boarding' THEN 415000
        WHEN s.class LIKE 'SS1%' AND s.student_type = 'day' THEN 185000
        WHEN s.class LIKE 'SS1%' AND s.student_type = 'boarding' THEN 435000
        WHEN s.class LIKE 'SS2%' AND s.student_type = 'day' THEN 180000
        WHEN s.class LIKE 'SS2%' AND s.student_type = 'boarding' THEN 430000
        WHEN s.class LIKE 'SS3%' AND s.student_type = 'day' THEN 180000
        WHEN s.class LIKE 'SS3%' AND s.student_type = 'boarding' THEN 430000
        ELSE s.total_fees
      END THEN 'INCORRECT FEE FOR CLASS/TYPE'
      ELSE 'CORRECT FEE'
    END as issue_type
  FROM students s
  WHERE s.total_fees = 0 
     OR s.total_fees < 0 
     OR s.total_fees < 50000 
     OR s.total_fees > 500000
     OR s.total_fees != CASE 
        WHEN s.class = 'Toddler' AND s.student_type = 'day' THEN 50000
        WHEN s.class = 'Pre-Schooler' AND s.student_type = 'day' THEN 75000
        WHEN s.class = 'Nursery' AND s.student_type = 'day' THEN 100000
        WHEN s.class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND s.student_type = 'day' THEN 120000
        WHEN s.class IN ('Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B') AND s.student_type = 'boarding' THEN 370000
        WHEN s.class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND s.student_type = 'day' THEN 130000
        WHEN s.class IN ('Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B') AND s.student_type = 'boarding' THEN 380000
        WHEN s.class LIKE 'JSS%' AND s.student_type = 'day' THEN 165000
        WHEN s.class LIKE 'JSS%' AND s.student_type = 'boarding' THEN 415000
        WHEN s.class LIKE 'SS1%' AND s.student_type = 'day' THEN 185000
        WHEN s.class LIKE 'SS1%' AND s.student_type = 'boarding' THEN 435000
        WHEN s.class LIKE 'SS2%' AND s.student_type = 'day' THEN 180000
        WHEN s.class LIKE 'SS2%' AND s.student_type = 'boarding' THEN 430000
        WHEN s.class LIKE 'SS3%' AND s.student_type = 'day' THEN 180000
        WHEN s.class LIKE 'SS3%' AND s.student_type = 'boarding' THEN 430000
        ELSE s.total_fees
      END
) abnormal_students
GROUP BY issue_type
ORDER BY student_count DESC;

RESET session_replication_role;
