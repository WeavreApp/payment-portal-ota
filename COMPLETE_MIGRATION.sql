-- COMPLETE MIGRATION: SS3 Fee System + NECO + Bank Accounts
-- Run this entire script in Supabase SQL Editor

-- =====================================================
-- PART 1: SS3 HOSTEL FEE SETTING
-- =====================================================
INSERT INTO fee_settings (setting_key, setting_value, description)
VALUES 
  ('ss3_hostel_fee', '750000', 'Hostel fee specifically for SS3 students')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = '750000',
  description = 'Hostel fee specifically for SS3 students';

-- =====================================================
-- PART 2: FIX ALL SS3 STUDENT FEES
-- =====================================================
UPDATE students 
SET 
  total_fees = CASE 
    WHEN student_type = 'boarding' THEN 645000 + 750000 + COALESCE(neco_fee, 0)
    ELSE 645000 + COALESCE(neco_fee, 0)
  END
WHERE class LIKE 'SS3%';

-- =====================================================
-- PART 3: VERIFICATION
-- =====================================================
SELECT 
  'MIGRATION COMPLETE' as status,
  student_type,
  COUNT(*) as count,
  AVG(total_fees) as avg_total
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type;

-- Show sample students
SELECT 
  full_name,
  class,
  student_type,
  total_fees,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - COALESCE(hostel_fee, 0)) as base_tuition
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY full_name
LIMIT 5;
