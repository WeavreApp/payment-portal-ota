-- Final comprehensive database summary after all fixes
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Overall database summary
SELECT 
  'DATABASE SUMMARY' as status,
  COUNT(*) as total_students,
  COUNT(DISTINCT class) as unique_classes,
  COUNT(DISTINCT student_type) as student_types,
  SUM(total_fees) as total_fees_sum,
  ROUND(AVG(total_fees)) as avg_fee_per_student,
  MIN(created_at) as earliest_student,
  MAX(created_at) as latest_student
FROM students;

-- Class breakdown by level
SELECT 
  'CLASS BREAKDOWN BY LEVEL' as status,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery') THEN 'Early Years'
    WHEN class LIKE 'Pry%' THEN 'Primary School'
    WHEN class LIKE 'JSS%' THEN 'Junior Secondary'
    WHEN class LIKE 'SS%' THEN 'Senior Secondary'
    ELSE 'Other'
  END as level,
  COUNT(*) as student_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage,
  SUM(total_fees) as total_fees_level,
  ROUND(AVG(total_fees)) as avg_fee_level
FROM students 
GROUP BY level
ORDER BY student_count DESC;

-- Student type distribution
SELECT 
  'STUDENT TYPE DISTRIBUTION' as status,
  student_type,
  COUNT(*) as student_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage,
  SUM(total_fees) as total_fees_by_type,
  ROUND(AVG(total_fees)) as avg_fee_by_type
FROM students 
GROUP BY student_type
ORDER BY student_count DESC;

-- Fee range analysis
SELECT 
  'FEE RANGE ANALYSIS' as status,
  fee_range,
  student_count,
  ROUND(student_count * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage,
  total_fees_in_range,
  ROUND(avg_fee_in_range) as avg_fee_in_range
FROM (
  SELECT 
    CASE 
      WHEN total_fees = 0 THEN 'Zero Fees'
      WHEN total_fees < 50000 THEN 'Very Low (< 50K)'
      WHEN total_fees < 100000 THEN 'Low (50K-100K)'
      WHEN total_fees < 200000 THEN 'Medium (100K-200K)'
      WHEN total_fees < 400000 THEN 'High (200K-400K)'
      ELSE 'Very High (> 400K)'
    END as fee_range,
    COUNT(*) as student_count,
    SUM(total_fees) as total_fees_in_range,
    AVG(total_fees) as avg_fee_in_range
  FROM students
  GROUP BY 
    CASE 
      WHEN total_fees = 0 THEN 'Zero Fees'
      WHEN total_fees < 50000 THEN 'Very Low (< 50K)'
      WHEN total_fees < 100000 THEN 'Low (50K-100K)'
      WHEN total_fees < 200000 THEN 'Medium (100K-200K)'
      WHEN total_fees < 400000 THEN 'High (200K-400K)'
      ELSE 'Very High (> 400K)'
    END
) fee_analysis
ORDER BY 
  CASE 
    WHEN fee_range = 'Zero Fees' THEN 1
    WHEN fee_range = 'Very Low (< 50K)' THEN 2
    WHEN fee_range = 'Low (50K-100K)' THEN 3
    WHEN fee_range = 'Medium (100K-200K)' THEN 4
    WHEN fee_range = 'High (200K-400K)' THEN 5
    ELSE 6
  END;

-- Top 10 classes by student count
SELECT 
  'TOP 10 CLASSES BY SIZE' as status,
  class,
  COUNT(*) as student_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage,
  SUM(total_fees) as total_fees_class,
  ROUND(AVG(total_fees)) as avg_fee_class,
  COUNT(CASE WHEN student_type = 'boarding' THEN 1 END) as boarding_count,
  COUNT(CASE WHEN student_type = 'day' THEN 1 END) as day_count
FROM students 
GROUP BY class
ORDER BY student_count DESC
LIMIT 10;

-- Recent activity (last 30 days)
SELECT 
  'RECENT ACTIVITY (30 DAYS)' as status,
  COUNT(*) as students_added,
  SUM(total_fees) as fees_added,
  ROUND(AVG(total_fees)) as avg_fee_new_students,
  COUNT(DISTINCT class) as new_classes
FROM students 
WHERE created_at > NOW() - INTERVAL '30 days';

-- Data quality checks
SELECT 
  'DATA QUALITY CHECKS' as status,
  'Students with valid fees (50K-500K)' as check_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage
FROM students 
WHERE total_fees BETWEEN 50000 AND 500000
  AND class IN (
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
  );

RESET session_replication_role;
