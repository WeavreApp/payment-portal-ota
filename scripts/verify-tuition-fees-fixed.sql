-- Verify all students have correct tuition fees for their class
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for verification
SET session_replication_role = 'origin';

-- Show students with incorrect tuition fees
SELECT 
  'INCORRECT_TUITION_FEES' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  CASE 
    WHEN student_type = 'boarding' THEN total_fees - hostel_fee
    ELSE total_fees
  END as actual_tuition_fee,
  CASE 
    WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 165000
    WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 185000
    WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 180000
    WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 180000
  END as expected_tuition_fee,
  CASE 
    WHEN student_type = 'boarding' THEN total_fees - hostel_fee
    ELSE total_fees
  END - CASE 
    WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 165000
    WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 185000
    WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 180000
    WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 180000
  END as tuition_fee_difference
FROM students 
WHERE CASE 
  WHEN student_type = 'boarding' THEN total_fees - hostel_fee
  ELSE total_fees
END != CASE 
  WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 165000
  WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 185000
  WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 180000
  WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 180000
END
ORDER BY ABS(CASE 
  WHEN student_type = 'boarding' THEN total_fees - hostel_fee
  ELSE total_fees
END - CASE 
  WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 165000
  WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 185000
  WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 180000
  WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 180000
END) DESC;

-- Show students with incorrect total fees
SELECT 
  'INCORRECT_TOTAL_FEES' as issue_type,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  CASE 
    WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 
      CASE WHEN student_type = 'boarding' THEN 415000 ELSE 165000 END
    WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 
      CASE WHEN student_type = 'boarding' THEN 435000 ELSE 185000 END
    WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 
      CASE WHEN student_type = 'boarding' THEN 2050000 ELSE 1800000 END
    WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 
      CASE WHEN student_type = 'boarding' THEN 430000 ELSE 180000 END
  END as expected_total_fee,
  total_fees - CASE 
    WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 
      CASE WHEN student_type = 'boarding' THEN 415000 ELSE 165000 END
    WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 
      CASE WHEN student_type = 'boarding' THEN 435000 ELSE 185000 END
    WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 
      CASE WHEN student_type = 'boarding' THEN 2050000 ELSE 1800000 END
    WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 
      CASE WHEN student_type = 'boarding' THEN 430000 ELSE 180000 END
  END as total_fee_difference
FROM students 
WHERE total_fees != CASE 
  WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 
    CASE WHEN student_type = 'boarding' THEN 415000 ELSE 165000 END
  WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 
    CASE WHEN student_type = 'boarding' THEN 435000 ELSE 185000 END
  WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 
    CASE WHEN student_type = 'boarding' THEN 430000 ELSE 180000 END
  WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 
    CASE WHEN student_type = 'boarding' THEN 430000 ELSE 180000 END
END
ORDER BY ABS(total_fees - CASE 
  WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 
    CASE WHEN student_type = 'boarding' THEN 415000 ELSE 165000 END
  WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 
    CASE WHEN student_type = 'boarding' THEN 435000 ELSE 185000 END
  WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 
    CASE WHEN student_type = 'boarding' THEN 430000 ELSE 180000 END
  WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 
    CASE WHEN student_type = 'boarding' THEN 430000 ELSE 180000 END
END) DESC;

-- Summary by class
SELECT 
  'CLASS_SUMMARY' as issue_type,
  class,
  student_type,
  COUNT(*) as total_students,
  COUNT(CASE 
    WHEN CASE 
      WHEN student_type = 'boarding' THEN total_fees - hostel_fee
      ELSE total_fees
    END != CASE 
      WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 165000
      WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 185000
      WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 180000
      WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 180000
    END THEN 1 END
  ) as incorrect_tuition_count,
  COUNT(CASE 
    WHEN total_fees != CASE 
      WHEN SUBSTRING(class, 1, 3) = 'JSS1' OR SUBSTRING(class, 1, 3) = 'JSS2' OR SUBSTRING(class, 1, 3) = 'JSS3' THEN 
        CASE WHEN student_type = 'boarding' THEN 415000 ELSE 165000 END
      WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 
        CASE WHEN student_type = 'boarding' THEN 435000 ELSE 185000 END
      WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 
        CASE WHEN student_type = 'boarding' THEN 2050000 ELSE 1800000 END
      WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 
        CASE WHEN student_type = 'boarding' THEN 430000 ELSE 180000 END
    END THEN 1 END
  ) as incorrect_total_count
FROM students 
GROUP BY class, student_type
ORDER BY class, student_type;

-- Reset session role
RESET session_replication_role;
