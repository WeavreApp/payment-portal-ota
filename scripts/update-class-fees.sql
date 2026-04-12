-- Update all students in a specific class to new fee rates
-- Change the class and new_day_fee values as needed

-- Example: Update SS2A1 students to new day fee of 190,000
WITH new_fee AS (
  SELECT 190000 as new_day_fee  -- Change this to your new fee
)
UPDATE students 
SET total_fees = 
  CASE 
    WHEN student_type = 'boarding' THEN (SELECT new_day_fee FROM new_fee) + 250000 + COALESCE(neco_fee, 0)
    ELSE (SELECT new_day_fee FROM new_fee) + COALESCE(neco_fee, 0)
  END
WHERE class = 'SS2A1';  -- Change this to your class name

-- Verify
SELECT class, student_type, COUNT(*), AVG(total_fees - hostel_fee - COALESCE(neco_fee, 0)) as avg_tuition
FROM students 
WHERE class = 'SS2A1'
GROUP BY class, student_type;
