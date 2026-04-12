-- FINAL MIGRATION: Execute in Supabase SQL Editor
-- This will complete all SS3 fee system fixes

-- 1. Add SS3 Hostel Fee Setting
INSERT INTO fee_settings (setting_key, setting_value, description)
VALUES ('ss3_hostel_fee', '750000', 'Hostel fee specifically for SS3 students')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = '750000';

-- 2. Fix All SS3 Student Fees  
UPDATE students SET total_fees = 
  CASE WHEN student_type = 'boarding' THEN 645000 + 750000 + COALESCE(neco_fee, 0)
  ELSE 645000 + COALESCE(neco_fee, 0) END
WHERE class LIKE 'SS3%';

-- 3. Verify Results
SELECT 'COMPLETE' as status, 
  COUNT(*) as total_ss3,
  AVG(total_fees) as avg_total
FROM students WHERE class LIKE 'SS3%';
