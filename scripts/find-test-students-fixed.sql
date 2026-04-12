-- Find test students created during app testing (FIXED)
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Students with test-like names
SELECT 
  'TEST NAMES' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  CASE 
    WHEN LOWER(full_name) LIKE '%test%' THEN 'CONTAINS TEST'
    WHEN LOWER(full_name) LIKE '%demo%' THEN 'CONTAINS DEMO'
    WHEN LOWER(full_name) LIKE '%sample%' THEN 'CONTAINS SAMPLE'
    WHEN LOWER(full_name) LIKE '%admin%' THEN 'CONTAINS ADMIN'
    WHEN LOWER(full_name) LIKE '%user%' THEN 'CONTAINS USER'
    WHEN LOWER(full_name) LIKE '%example%' THEN 'CONTAINS EXAMPLE'
    WHEN LOWER(full_name) LIKE '%placeholder%' THEN 'CONTAINS PLACEHOLDER'
    ELSE 'NORMAL NAME'
  END as name_analysis
FROM students 
WHERE LOWER(full_name) LIKE '%test%' 
   OR LOWER(full_name) LIKE '%demo%' 
   OR LOWER(full_name) LIKE '%sample%' 
   OR LOWER(full_name) LIKE '%admin%' 
   OR LOWER(full_name) LIKE '%user%' 
   OR LOWER(full_name) LIKE '%example%' 
   OR LOWER(full_name) LIKE '%placeholder%'
ORDER BY created_at DESC;

-- Students with unusual patterns (might be test data)
SELECT 
  'UNUSUAL PATTERNS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  CASE 
    WHEN full_name ~ '[A-Z]{3,}' THEN 'REPEATED LETTERS'
    WHEN full_name ~ '[0-9]{3,}' THEN 'REPEATED NUMBERS'
    WHEN full_name LIKE 'Student %' THEN 'GENERIC STUDENT'
    WHEN full_name LIKE 'Test Student %' THEN 'TEST STUDENT PATTERN'
    WHEN LENGTH(full_name) <= 2 THEN 'VERY SHORT NAME'
    WHEN full_name LIKE '%John Doe%' THEN 'JOHN DOE PATTERN'
    WHEN full_name LIKE '%Jane Doe%' THEN 'JANE DOE PATTERN'
    ELSE 'NORMAL PATTERN'
  END as pattern_analysis
FROM students 
WHERE full_name ~ '[A-Z]{3,}' 
   OR full_name ~ '[0-9]{3,}' 
   OR full_name LIKE 'Student %'
   OR full_name LIKE 'Test Student %'
   OR LENGTH(full_name) <= 2
   OR full_name LIKE '%John Doe%'
   OR full_name LIKE '%Jane Doe%'
ORDER BY created_at DESC;

-- Students with very old creation dates (might be test data)
SELECT 
  'OLD TEST DATA' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  CASE 
    WHEN created_at < '2024-01-01' THEN 'VERY OLD (2023 or earlier)'
    WHEN created_at < '2024-06-01' THEN 'OLD (early 2024)'
    WHEN created_at < '2025-01-01' THEN '2024 DATA'
    ELSE 'RECENT (2025+)'
  END as age_analysis
FROM students 
WHERE created_at < '2024-01-01'
ORDER BY created_at ASC;

-- Students with suspicious fee amounts
SELECT 
  'SUSPICIOUS FEES' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  CASE 
    WHEN total_fees = 1 THEN 'EXACTLY 1'
    WHEN total_fees = 100 THEN 'EXACTLY 100'
    WHEN total_fees = 1000 THEN 'EXACTLY 1000'
    WHEN total_fees = 12345 THEN 'SEQUENTIAL NUMBERS'
    WHEN total_fees = 999999 THEN 'MAX TEST VALUE'
    WHEN total_fees = 111111 THEN 'REPEATED DIGITS'
    ELSE 'NORMAL AMOUNT'
  END as fee_analysis
FROM students 
WHERE total_fees IN (1, 100, 1000, 12345, 999999, 111111)
ORDER BY created_at DESC;

-- Students with default/placeholder IDs (FIXED UUID comparison)
SELECT 
  'ID ANALYSIS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  id,
  CASE 
    WHEN id::text LIKE '00000000-%' THEN 'DEFAULT UUID PATTERN'
    WHEN id::text LIKE '12345678-%' THEN 'TEST UUID PATTERN'
    WHEN id::text LIKE 'ffffffff-%' THEN 'HEX UUID PATTERN'
    WHEN LENGTH(id::text) < 20 THEN 'SHORT UUID'
    ELSE 'NORMAL UUID'
  END as id_analysis
FROM students 
WHERE id::text LIKE '00000000-%' 
   OR id::text LIKE '12345678-%' 
   OR id::text LIKE 'ffffffff-%'
   OR LENGTH(id::text) < 20
ORDER BY created_at DESC;

-- Recently created students that might be test data
SELECT 
  'RECENT SUSPICIOUS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  created_at,
  CASE 
    WHEN created_at > NOW() - INTERVAL '1 day' THEN 'LAST 24 HOURS'
    WHEN created_at > NOW() - INTERVAL '7 days' THEN 'LAST WEEK'
    WHEN created_at > NOW() - INTERVAL '30 days' THEN 'LAST MONTH'
    ELSE 'OLDER'
  END as recency
FROM students 
WHERE created_at > NOW() - INTERVAL '30 days'
  AND (
    LOWER(full_name) LIKE '%test%' OR
    LOWER(full_name) LIKE '%demo%' OR
    LOWER(full_name) LIKE '%sample%' OR
    total_fees IN (1, 100, 1000, 12345, 999999, 111111) OR
    id::text LIKE '00000000-%' OR
    id::text LIKE '12345678-%'
  )
ORDER BY created_at DESC;

-- Summary of suspicious students found
SELECT 
  'SUSPICIOUS SUMMARY' as status,
  'Total suspicious students found' as metric,
  (
    SELECT COUNT(*) FROM students 
    WHERE LOWER(full_name) LIKE '%test%' 
       OR LOWER(full_name) LIKE '%demo%' 
       OR LOWER(full_name) LIKE '%sample%' 
       OR LOWER(full_name) LIKE '%admin%' 
       OR LOWER(full_name) LIKE '%user%' 
       OR LOWER(full_name) LIKE '%example%' 
       OR LOWER(full_name) LIKE '%placeholder%'
       OR full_name ~ '[A-Z]{3,}' 
       OR full_name ~ '[0-9]{3,}' 
       OR full_name LIKE 'Student %'
       OR full_name LIKE 'Test Student %'
       OR LENGTH(full_name) <= 2
       OR full_name LIKE '%John Doe%'
       OR full_name LIKE '%Jane Doe%'
       OR created_at < '2024-01-01'
       OR total_fees IN (1, 100, 1000, 12345, 999999, 111111)
       OR id::text LIKE '00000000-%' 
       OR id::text LIKE '12345678-%' 
       OR id::text LIKE 'ffffffff-%'
       OR LENGTH(id::text) < 20
  ) as count;

RESET session_replication_role;
