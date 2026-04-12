-- Fix abnormal fees based on analysis results
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Fix Pry 1A - average is 130,417 but should be 120,000 (day) or 370,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 120000
  WHEN student_type = 'boarding' THEN 370000
  ELSE total_fees
END
WHERE class = 'Pry 1A' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 120000
  WHEN student_type = 'boarding' THEN 370000
  ELSE total_fees
END;

-- Fix Pry 1B - average is 137,857 but should be 120,000 (day) or 370,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 120000
  WHEN student_type = 'boarding' THEN 370000
  ELSE total_fees
END
WHERE class = 'Pry 1B' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 120000
  WHEN student_type = 'boarding' THEN 370000
  ELSE total_fees
END;

-- Fix Pry 3B - average is 130,000 but should be 120,000 (day) or 370,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 120000
  WHEN student_type = 'boarding' THEN 370000
  ELSE total_fees
END
WHERE class = 'Pry 3B' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 120000
  WHEN student_type = 'boarding' THEN 370000
  ELSE total_fees
END;

-- Fix Pry 4A - average is 139,615 but should be 130,000 (day) or 380,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END
WHERE class = 'Pry 4A' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END;

-- Fix Pry 4B - average is 150,000 but should be 130,000 (day) or 380,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END
WHERE class = 'Pry 4B' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END;

-- Fix Pry 5A - average is 130,000 but should be 130,000 (day) or 380,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END
WHERE class = 'Pry 5A' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END;

-- Fix Pry 5B - average is 130,000 but should be 130,000 (day) or 380,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END
WHERE class = 'Pry 5B' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 130000
  WHEN student_type = 'boarding' THEN 380000
  ELSE total_fees
END;

-- Fix SS1A2 - average is 282,561 but should be 185,000 (day) or 435,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END
WHERE class = 'SS1A2' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END;

-- Fix SS1A3 - average is 194,615 but should be 185,000 (day) or 435,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END
WHERE class = 'SS1A3' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END;

-- Fix SS1A4 - average is 237,632 but should be 185,000 (day) or 435,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END
WHERE class = 'SS1A4' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END;

-- Fix SS1B/C - average is 239,348 but should be 185,000 (day) or 435,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END
WHERE class = 'SS1B/C' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 185000
  WHEN student_type = 'boarding' THEN 435000
  ELSE total_fees
END;

-- Fix SS2A1 - average is 205,000 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS2A1' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Fix SS2A2 - average is 269,744 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS2A2' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Fix SS2A3 - average is 260,000 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS2A3' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Fix SS2A4 - average is 231,471 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS2A4' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Fix SS2B/C - average is 268,235 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS2B/C' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Fix SS3A1 - average is 317,931 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS3A1' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Fix SS3A2 - average is 290,294 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS3A2' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Fix SS3B/C - average is 263,333 but should be 180,000 (day) or 430,000 (boarding)
UPDATE students 
SET total_fees = CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END
WHERE class = 'SS3B/C' AND total_fees != CASE 
  WHEN student_type = 'day' THEN 180000
  WHEN student_type = 'boarding' THEN 430000
  ELSE total_fees
END;

-- Verify fixes
SELECT 
  'FEE FIXES VERIFICATION' as status,
  class,
  student_type,
  COUNT(*) as student_count,
  MIN(total_fees) as min_fee,
  MAX(total_fees) as max_fee,
  ROUND(AVG(total_fees)) as avg_fee
FROM students 
WHERE class IN (
  'Pry 1A', 'Pry 1B', 'Pry 3B', 'Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B',
  'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C',
  'SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C',
  'SS3A1', 'SS3A2', 'SS3B/C'
)
GROUP BY class, student_type
ORDER BY class, student_type;

RESET session_replication_role;
