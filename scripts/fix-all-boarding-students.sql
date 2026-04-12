-- CRITICAL FIX: Update ALL boarding students with correct total fees
-- This fixes the negative tuition display issue for all boarding students

-- Step 1: Fix SS3 Boarding Students (₦645,000 + ₦750,000 + NECO)
UPDATE students 
SET 
  total_fees = 645000 + 750000 + COALESCE(neco_fee, 0),
  hostel_fee = 750000
WHERE class LIKE 'SS3%' 
AND student_type = 'boarding';

-- Step 2: Fix Other Boarding Students (use their class day fee + ₦250,000 global hostel fee)
UPDATE students 
SET 
  total_fees = (
    SELECT day_student_fee + 250000 + COALESCE(s.neco_fee, 0)
    FROM class_fee_rates 
    WHERE class_name = s.class
  ),
  hostel_fee = 250000
FROM students s
WHERE s.student_type = 'boarding'
AND s.class NOT LIKE 'SS3%'
AND EXISTS (SELECT 1 FROM class_fee_rates WHERE class_name = s.class);

-- Step 3: Verify the fix
SELECT 
  'BOARDING STUDENTS FIXED' as status,
  s.class,
  s.student_type,
  COUNT(*) as count,
  AVG(s.total_fees) as avg_total,
  AVG(s.hostel_fee) as avg_hostel,
  AVG(COALESCE(s.neco_fee, 0)) as avg_neco,
  AVG(s.total_fees - s.hostel_fee - COALESCE(s.neco_fee, 0)) as avg_base_tuition
FROM students s
WHERE s.student_type = 'boarding'
GROUP BY s.class, s.student_type
ORDER BY s.class;
