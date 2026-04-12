-- Fix ALL class case issues to match constants exactly
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Update all class names to match constants exactly
UPDATE students 
SET class = CASE
  -- Fix PRY -> Pry (case issue)
  WHEN class = 'PRY 1A' THEN 'Pry 1A'
  WHEN class = 'PRY 1B' THEN 'Pry 1B'
  WHEN class = 'PRY 2A' THEN 'Pry 2A'
  WHEN class = 'PRY 2B' THEN 'Pry 2B'
  WHEN class = 'PRY 3A' THEN 'Pry 3A'
  WHEN class = 'PRY 3B' THEN 'Pry 3B'
  WHEN class = 'PRY 4A' THEN 'Pry 4A'
  WHEN class = 'PRY 4B' THEN 'Pry 4B'
  WHEN class = 'PRY 5A' THEN 'Pry 5A'
  WHEN class = 'PRY 5B' THEN 'Pry 5B'
  
  -- Fix any other case variations
  WHEN class = 'PRY1A' THEN 'Pry 1A'
  WHEN class = 'PRY1B' THEN 'Pry 1B'
  WHEN class = 'PRY2A' THEN 'Pry 2A'
  WHEN class = 'PRY2B' THEN 'Pry 2B'
  WHEN class = 'PRY3A' THEN 'Pry 3A'
  WHEN class = 'PRY3B' THEN 'Pry 3B'
  WHEN class = 'PRY4A' THEN 'Pry 4A'
  WHEN class = 'PRY4B' THEN 'Pry 4B'
  WHEN class = 'PRY5A' THEN 'Pry 5A'
  WHEN class = 'PRY5B' THEN 'Pry 5B'
  
  -- Fix JSS case variations
  WHEN class = 'jss1a' THEN 'JSS1A'
  WHEN class = 'jss1b' THEN 'JSS1B'
  WHEN class = 'jss1c' THEN 'JSS1C'
  WHEN class = 'jss1d' THEN 'JSS1D'
  WHEN class = 'jss2a' THEN 'JSS2A'
  WHEN class = 'jss2b' THEN 'JSS2B'
  WHEN class = 'jss2c' THEN 'JSS2C'
  WHEN class = 'jss2d' THEN 'JSS2D'
  WHEN class = 'jss3a' THEN 'JSS3A'
  WHEN class = 'jss3b' THEN 'JSS3B'
  WHEN class = 'jss3c' THEN 'JSS3C'
  
  -- Fix SS case variations
  WHEN class = 'ss1a1' THEN 'SS1A1'
  WHEN class = 'ss1a2' THEN 'SS1A2'
  WHEN class = 'ss1a3' THEN 'SS1A3'
  WHEN class = 'ss1a4' THEN 'SS1A4'
  WHEN class = 'ss1b/c' THEN 'SS1B/C'
  WHEN class = 'ss2a1' THEN 'SS2A1'
  WHEN class = 'ss2a2' THEN 'SS2A2'
  WHEN class = 'ss2a3' THEN 'SS2A3'
  WHEN class = 'ss2a4' THEN 'SS2A4'
  WHEN class = 'ss2b/c' THEN 'SS2B/C'
  WHEN class = 'ss3a1' THEN 'SS3A1'
  WHEN class = 'ss3a2' THEN 'SS3A2'
  WHEN class = 'ss3b/c' THEN 'SS3B/C'
  
  ELSE class
END;

-- Verify all classes are now valid
SELECT 
  'ALL CLASSES VERIFICATION' as status,
  class,
  COUNT(*) as student_count,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery', 
                 'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 
                 'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 
                 'Pry 5A', 'Pry 5B',
                 'JSS1A', 'JSS1B', 'JSS1C', 'JSS1D',
                 'JSS2A', 'JSS2B', 'JSS2C', 'JSS2D',
                 'JSS3A', 'JSS3B', 'JSS3C',
                 'SS1A1', 'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C',
                 'SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C',
                 'SS3A1', 'SS3A2', 'SS3B/C') THEN 'VALID'
    ELSE 'INVALID - NOT IN CONSTANTS'
  END as validation
FROM students 
GROUP BY class
ORDER BY validation DESC, class;

-- Show summary counts
SELECT 
  'FINAL COUNTS BY CATEGORY' as status,
  CASE 
    WHEN class IN ('Toddler', 'Pre-Schooler', 'Nursery') THEN 'Early Years'
    WHEN class LIKE 'Pry%' THEN 'Primary'
    WHEN class LIKE 'JSS%' THEN 'Junior Secondary'
    WHEN class LIKE 'SS%' THEN 'Senior Secondary'
    ELSE 'Other'
  END as category,
  COUNT(*) as student_count
FROM students 
GROUP BY category
ORDER BY category;

RESET session_replication_role;
