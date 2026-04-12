-- Show names and fees of suspicious students (simple version)
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- All suspicious students with names and fees
SELECT 
  'SUSPICIOUS STUDENTS' as status,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee,
  created_at
FROM students 
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
ORDER BY created_at DESC;

-- Just names and fees (simple view)
SELECT 
  'NAMES AND FEES ONLY' as status,
  full_name,
  class,
  student_type,
  total_fees,
  hostel_fee
FROM students 
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
ORDER BY total_fees DESC, full_name;

RESET session_replication_role;
