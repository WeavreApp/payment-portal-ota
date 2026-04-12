-- Final verification of SS3 fee structure
-- Run this in Supabase SQL Editor

-- Current status check
SELECT 
  'CURRENT SS3 STATUS' as status,
  student_type,
  COUNT(*) as student_count,
  'Current Total' as metric,
  AVG(total_fees) as amount,
  'Expected Total' as metric,
  CASE 
    WHEN student_type = 'boarding' THEN 645000 + 750000 + AVG(COALESCE(neco_fee, 0))
    ELSE 645000 + AVG(COALESCE(neco_fee, 0))
  END as expected_amount,
  CASE 
    WHEN student_type = 'boarding' THEN 
      CASE 
        WHEN AVG(total_fees) = 645000 + 750000 + AVG(COALESCE(neco_fee, 0)) THEN 'CORRECT'
        ELSE 'NEEDS FIX'
      END
    ELSE 
      CASE 
        WHEN AVG(total_fees) = 645000 + AVG(COALESCE(neco_fee, 0)) THEN 'CORRECT'
        ELSE 'NEEDS FIX'
      END
  END as status
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type;

-- Expected fee breakdown for SS3
SELECT 
  'EXPECTED SS3 FEE STRUCTURE' as status,
  student_type,
  'Base Tuition' as component,
  645000 as amount,
  UNION ALL
SELECT 
  'EXPECTED SS3 FEE STRUCTURE' as status,
  student_type,
  'Hostel Fee' as component,
  750000 as amount,
  UNION ALL
SELECT 
  'EXPECTED SS3 FEE STRUCTURE' as status,
  student_type,
  'NECO Fee' as component,
  40000 as amount,
  UNION ALL
SELECT 
  'EXPECTED SS3 FEE STRUCTURE' as status,
  student_type,
  'Total (with NECO)' as component,
  CASE 
    WHEN student_type = 'boarding' THEN 645000 + 750000 + 40000
    ELSE 645000 + 40000
  END as amount
FROM students 
WHERE class LIKE 'SS3%'
GROUP BY student_type
ORDER BY student_type, component;

-- Sample students showing current vs expected
SELECT 
  'SAMPLE VERIFICATION' as status,
  full_name,
  class,
  student_type,
  total_fees as current_total,
  neco_fee,
  hostel_fee,
  (total_fees - COALESCE(neco_fee, 0) - hostel_fee) as current_base_tuition,
  CASE 
    WHEN student_type = 'boarding' THEN 645000 + 750000 + COALESCE(neco_fee, 0)
    ELSE 645000 + COALESCE(neco_fee, 0)
  END as expected_total,
  CASE 
    WHEN (total_fees - COALESCE(neco_fee, 0) - hostel_fee) = 645000 THEN 'CORRECT'
    ELSE 'TUITION FIX NEEDED'
  END as base_tuition_status
FROM students 
WHERE class LIKE 'SS3%'
ORDER BY student_type, full_name
LIMIT 10;
