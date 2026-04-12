-- Verify cache reset worked and student dialog is working
-- Run this in Supabase SQL Editor

-- Check if the student was updated
SELECT 
  'CACHE RESET VERIFICATION' as status,
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  updated_at,
  CASE 
    WHEN updated_at > '2026-04-12 18:19:00' THEN 'CACHE RESET SUCCESS'
    ELSE 'CACHE RESET FAILED'
  END as cache_status
FROM students 
WHERE class = 'SS3A1' 
AND student_type = 'boarding'
ORDER BY updated_at DESC
LIMIT 1;

-- Check current SS3 fee structure
SELECT 
  'CURRENT SS3 STRUCTURE' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  AVG(total_fees) as avg_total_fees,
  AVG(neco_fee) as avg_neco_fee,
  AVG(hostel_fee) as avg_hostel_fee,
  AVG(total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as avg_base_tuition
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class, student_type
ORDER BY class, student_type;
