-- EMERGENCY FIX: All Boarding Students
-- Run in Supabase SQL Editor

-- Fix SS3 Boarding: 645000 + 750000 + NECO
UPDATE students 
SET total_fees = 645000 + 750000 + COALESCE(neco_fee, 0),
    hostel_fee = 750000
WHERE class LIKE 'SS3%' AND student_type = 'boarding';

-- Fix Non-SS3 Boarding: day_fee + 250000 + NECO
UPDATE students s
SET total_fees = c.day_student_fee + 250000 + COALESCE(s.neco_fee, 0),
    hostel_fee = 250000
FROM class_fee_rates c
WHERE s.class = c.class_name
AND s.student_type = 'boarding'
AND s.class NOT LIKE 'SS3%';

-- Verify
SELECT 'FIXED' as status, 
       class, 
       student_type, 
       COUNT(*) as count,
       AVG(total_fees) as avg_total
FROM students 
WHERE student_type = 'boarding'
GROUP BY class, student_type;
