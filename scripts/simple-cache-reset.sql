-- Simple cache reset - no complex syntax
-- Run this in Supabase SQL Editor

-- Just update one student to trigger cache refresh
UPDATE students 
SET updated_at = now()
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding'
AND full_name = 'ABANIKANDA FAREED'  -- Update first SS3 student found
LIMIT 1;
