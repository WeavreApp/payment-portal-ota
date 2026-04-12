-- Simple SS3 fix - no complex functions
-- Run this in Supabase SQL Editor

-- Update SS3 day students
UPDATE students 
SET total_fees = 645000 + COALESCE(neco_fee, 0)
WHERE class LIKE 'SS3%' 
AND student_type = 'day';

-- Update SS3 boarding students  
UPDATE students 
SET total_fees = 645000 + 750000 + COALESCE(neco_fee, 0)
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding';

-- Verify the fix
SELECT 
  'SS3 FIXED' as status,
  class,
  student_type,
  COUNT(*) as count,
  AVG(total_fees) as avg_total
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY class, student_type
ORDER BY class, student_type;
