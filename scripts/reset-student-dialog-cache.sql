-- Reset student dialog cache by forcing refresh of calculated values
-- Run this in Supabase SQL Editor

-- Update a sample SS3 student to trigger cache refresh
UPDATE students 
SET 
  total_fees = 645000 + 750000 + COALESCE(neco_fee, 0),
  updated_at = now()
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding'
AND full_name LIKE 'A%'  -- Update one student to trigger refresh
LIMIT 1;

-- Verify the update
SELECT 
  'CACHE RESET' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as base_tuition,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) = 645000 THEN 'CORRECT BASE'
    ELSE 'BASE ISSUE'
  END as tuition_status
FROM students 
WHERE class LIKE 'SS3%' 
AND full_name LIKE 'A%'
ORDER BY full_name
LIMIT 5;
