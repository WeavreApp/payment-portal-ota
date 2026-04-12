-- Minimal cache reset - update first SS3 student found
-- Run this in Supabase SQL Editor

UPDATE students 
SET updated_at = now()
WHERE class = 'SS3A1' 
AND student_type = 'boarding'
LIMIT 1;
