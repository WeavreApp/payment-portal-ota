-- Final verification that all fees are correct
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Check if any students have incorrect fees
SELECT 
  'FEE_VERIFICATION_SUMMARY' as check_type,
  COUNT(*) as total_students,
  COUNT(CASE 
    -- JSS1/2/3: Day 165K, Boarding 415K
    WHEN SUBSTRING(class, 1, 3) IN ('JSS1', 'JSS2', 'JSS3') AND 
         student_type = 'day' AND total_fees != 165000 THEN 1
    WHEN SUBSTRING(class, 1, 3) IN ('JSS1', 'JSS2', 'JSS3') AND 
         student_type = 'boarding' AND total_fees != 415000 THEN 1
    -- SS1: Day 185K, Boarding 435K  
    WHEN SUBSTRING(class, 1, 3) = 'SS1' AND 
         student_type = 'day' AND total_fees != 185000 THEN 1
    WHEN SUBSTRING(class, 1, 3) = 'SS1' AND 
         student_type = 'boarding' AND total_fees != 435000 THEN 1
    -- SS2: Day 180K, Boarding 430K
    WHEN SUBSTRING(class, 1, 3) = 'SS2' AND 
         student_type = 'day' AND total_fees != 180000 THEN 1
    WHEN SUBSTRING(class, 1, 3) = 'SS2' AND 
         student_type = 'boarding' AND total_fees != 430000 THEN 1
    -- SS3: Day 180K, Boarding 430K
    WHEN SUBSTRING(class, 1, 3) = 'SS3' AND 
         student_type = 'day' AND total_fees != 180000 THEN 1
    WHEN SUBSTRING(class, 1, 3) = 'SS3' AND 
         student_type = 'boarding' AND total_fees != 430000 THEN 1
  END) as students_with_incorrect_fees,
  COUNT(CASE WHEN hostel_fee != 250000 AND student_type = 'boarding' THEN 1 END) as incorrect_hostel_fees
FROM students;

-- Show fee structure by class level
SELECT 
  'FEE_STRUCTURE_BY_LEVEL' as check_type,
  CASE 
    WHEN SUBSTRING(class, 1, 3) IN ('JSS1', 'JSS2', 'JSS3') THEN 'Junior Secondary'
    WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 'Senior Secondary 1'
    WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 'Senior Secondary 2'
    WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 'Senior Secondary 3'
    ELSE 'Other'
  END as school_level,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fee,
  AVG(hostel_fee) as avg_hostel_fee
FROM students 
WHERE class NOT LIKE 'Primary%'
GROUP BY 
  CASE 
    WHEN SUBSTRING(class, 1, 3) IN ('JSS1', 'JSS2', 'JSS3') THEN 'Junior Secondary'
    WHEN SUBSTRING(class, 1, 3) = 'SS1' THEN 'Senior Secondary 1'
    WHEN SUBSTRING(class, 1, 3) = 'SS2' THEN 'Senior Secondary 2'
    WHEN SUBSTRING(class, 1, 3) = 'SS3' THEN 'Senior Secondary 3'
    ELSE 'Other'
  END,
  student_type
ORDER BY school_level, student_type;

RESET session_replication_role;
