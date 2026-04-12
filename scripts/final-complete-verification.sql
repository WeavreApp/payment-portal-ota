-- Final complete verification after all fixes
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Overall database summary
SELECT 
  'FINAL DATABASE SUMMARY' as status,
  COUNT(*) as total_students,
  COUNT(DISTINCT class) as unique_classes,
  COUNT(DISTINCT student_type) as student_types,
  SUM(total_fees) as total_fees_sum,
  ROUND(AVG(total_fees)) as avg_fee_per_student,
  MIN(created_at) as earliest_student,
  MAX(created_at) as latest_student
FROM students;

-- Verify no duplicates exist
SELECT 
  'DUPLICATE CHECK' as status,
  CASE 
    WHEN (
      SELECT COUNT(*) FROM (
        SELECT full_name
        FROM students 
        GROUP BY full_name 
        HAVING COUNT(*) > 1
      ) duplicates
    ) = 0 THEN 'NO DUPLICATES - PERFECT'
    ELSE 'DUPLICATES STILL EXIST'
  END as duplicate_status;

-- Verify all classes are valid
SELECT 
  'VALID CLASSES CHECK' as status,
  COUNT(*) as total_students,
  COUNT(CASE WHEN class IN (
    'Toddler', 'Pre-Schooler', 'Nursery', 
    'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 
    'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 
    'Pry 5A', 'Pry 5B',
    'JSS1A', 'JSS1B', 'JSS1C', 'JSS1D',
    'JSS2A', 'JSS2B', 'JSS2C', 'JSS2D',
    'JSS3A', 'JSS3B', 'JSS3C',
    'SS1A1', 'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C',
    'SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C',
    'SS3A1', 'SS3A2', 'SS3B/C'
  ) THEN 1 END) as valid_class_students,
  COUNT(*) - COUNT(CASE WHEN class IN (
    'Toddler', 'Pre-Schooler', 'Nursery', 
    'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 
    'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 
    'Pry 5A', 'Pry 5B',
    'JSS1A', 'JSS1B', 'JSS1C', 'JSS1D',
    'JSS2A', 'JSS2B', 'JSS2C', 'JSS2D',
    'JSS3A', 'JSS3B', 'JSS3C',
    'SS1A1', 'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C',
    'SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C',
    'SS3A1', 'SS3A2', 'SS3B/C'
  ) THEN 1 END) as invalid_class_students
FROM students;

-- Verify all fees are correct
SELECT 
  'FEE CORRECTNESS CHECK' as status,
  COUNT(*) as total_students,
  COUNT(CASE WHEN total_fees BETWEEN 50000 AND 500000 THEN 1 END) as valid_fee_students,
  COUNT(*) - COUNT(CASE WHEN total_fees BETWEEN 50000 AND 500000 THEN 1 END) as invalid_fee_students,
  ROUND(COUNT(CASE WHEN total_fees BETWEEN 50000 AND 500000 THEN 1 END) * 100.0 / COUNT(*), 2) as fee_correctness_percentage
FROM students;

-- Class distribution
SELECT 
  'CLASS DISTRIBUTION' as status,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery') THEN 'Early Years'
    WHEN class LIKE 'Pry%' THEN 'Primary School'
    WHEN class LIKE 'JSS%' THEN 'Junior Secondary'
    WHEN class LIKE 'SS%' THEN 'Senior Secondary'
    ELSE 'Other'
  END as level,
  COUNT(*) as student_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage,
  SUM(total_fees) as total_fees_level
FROM students 
GROUP BY level
ORDER BY student_count DESC;

-- Student type distribution
SELECT 
  'STUDENT TYPE DISTRIBUTION' as status,
  student_type,
  COUNT(*) as student_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage,
  SUM(total_fees) as total_fees_by_type
FROM students 
GROUP BY student_type
ORDER BY student_count DESC;

-- Sample of students by level
SELECT 
  'STUDENT SAMPLE BY LEVEL' as status,
  full_name,
  class,
  student_type,
  total_fees,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery') THEN 'Early Years'
    WHEN class LIKE 'Pry%' THEN 'Primary School'
    WHEN class LIKE 'JSS%' THEN 'Junior Secondary'
    WHEN class LIKE 'SS%' THEN 'Senior Secondary'
    ELSE 'Other'
  END as level
FROM students 
ORDER BY 
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery') THEN 1
    WHEN class LIKE 'Pry%' THEN 2
    WHEN class LIKE 'JSS%' THEN 3
    WHEN class LIKE 'SS%' THEN 4
    ELSE 5
  END,
  class,
  full_name
LIMIT 20;

RESET session_replication_role;
