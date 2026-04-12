-- Check for students with abnormal classes or created via app
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Show all unique classes in database
SELECT 
  'ALL CLASSES IN DATABASE' as status,
  class,
  COUNT(*) as student_count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM students 
GROUP BY class
ORDER BY class;

-- Check for classes that don't match our standard list
SELECT 
  'INVALID CLASSES' as status,
  class,
  COUNT(*) as student_count,
  STRING_AGG(full_name, ', ') as sample_students
FROM students 
WHERE class NOT IN (
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
)
GROUP BY class
ORDER BY class;

-- Check for students with unusual class patterns
SELECT 
  'UNUSUAL CLASS PATTERNS' as status,
  class,
  COUNT(*) as student_count,
  STRING_AGG(DISTINCT full_name, ', ') as sample_students
FROM students 
WHERE class LIKE '%[^A-Z0-9 ]%' OR  -- Contains special characters
      class LIKE '% %' AND LENGTH(class) > 10 OR  -- Very long class names
      LOWER(class) != class OR  -- Mixed case
      class LIKE '%test%' OR  -- Test classes
      class LIKE '%temp%' OR  -- Temporary classes
      class LIKE '%demo%'     -- Demo classes
GROUP BY class
ORDER BY class;

-- Check for students with missing or empty class
SELECT 
  'MISSING/EMPTY CLASSES' as status,
  COUNT(*) as student_count,
  STRING_AGG(full_name, ', ') as affected_students
FROM students 
WHERE class IS NULL OR class = '' OR TRIM(class) = '';

-- Check for recently added students (last 7 days) that might be from app
SELECT 
  'RECENTLY ADDED STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  CASE 
    WHEN created_at > NOW() - INTERVAL '7 days' THEN 'VERY RECENT'
    WHEN created_at > NOW() - INTERVAL '30 days' THEN 'RECENT'
    ELSE 'OLDER'
  END as age_category
FROM students 
WHERE created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Check for students with suspicious patterns (might be test data)
SELECT 
  'SUSPICIOUS STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  CASE 
    WHEN LOWER(full_name) LIKE '%test%' THEN 'TEST NAME'
    WHEN LOWER(full_name) LIKE '%demo%' THEN 'DEMO NAME'
    WHEN LOWER(full_name) LIKE '%sample%' THEN 'SAMPLE NAME'
    WHEN full_name ~ '[0-9]{3,}' THEN 'NUMBERS IN NAME'
    WHEN LENGTH(full_name) < 3 THEN 'VERY SHORT NAME'
    WHEN LENGTH(full_name) > 50 THEN 'VERY LONG NAME'
    ELSE 'NORMAL'
  END as name_status
FROM students 
WHERE LOWER(full_name) LIKE '%test%' OR
      LOWER(full_name) LIKE '%demo%' OR
      LOWER(full_name) LIKE '%sample%' OR
      full_name ~ '[0-9]{3,}' OR
      LENGTH(full_name) < 3 OR
      LENGTH(full_name) > 50
ORDER BY created_at DESC;

-- Summary of class distribution
SELECT 
  'CLASS DISTRIBUTION SUMMARY' as status,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery') THEN 'Early Years'
    WHEN class LIKE 'Pry%' THEN 'Primary'
    WHEN class LIKE 'JSS%' THEN 'Junior Secondary'
    WHEN class LIKE 'SS%' THEN 'Senior Secondary'
    ELSE 'Other'
  END as category,
  COUNT(*) as student_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM students), 2) as percentage
FROM students 
GROUP BY category
ORDER BY student_count DESC;

RESET session_replication_role;
