-- Comprehensive cleanup: remove gender markers, Day/Boarder suffixes, duplicates, and fix class names
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- Step 1: Clean names - remove (F), (M), - Day, - Boarder, etc.
UPDATE students 
SET full_name = CASE 
  WHEN full_name LIKE '% (F)' THEN REPLACE(full_name, ' (F)', '')
  WHEN full_name LIKE '% (M)' THEN REPLACE(full_name, ' (M)', '')
  WHEN full_name LIKE '% - Day' THEN REPLACE(full_name, ' - Day', '')
  WHEN full_name LIKE '% - Boarder' THEN REPLACE(full_name, ' - Boarder', '')
  WHEN full_name LIKE '% - Boarding' THEN REPLACE(full_name, ' - Boarding', '')
  ELSE full_name
END
WHERE full_name LIKE '% (F)' OR full_name LIKE '% (M)' 
   OR full_name LIKE '% - Day' OR full_name LIKE '% - Boarder' OR full_name LIKE '% - Boarding';

-- Step 2: Fix any remaining Pre-School class names
UPDATE students 
SET class = 'Pre-Schooler' 
WHERE class = 'Pre-School';

-- Step 3: Identify and show all duplicates before removal
WITH clean_students AS (
  SELECT 
    id,
    full_name,
    class,
    student_type,
    total_fees,
    ROW_NUMBER() OVER (PARTITION BY full_name, class ORDER BY id ASC) as row_num,
    COUNT(*) OVER (PARTITION BY full_name, class) as duplicate_count
  FROM students
),
duplicates AS (
  SELECT id, full_name, class, duplicate_count
  FROM clean_students 
  WHERE duplicate_count > 1 AND row_num = 1
)
SELECT 
  'DUPLICATES TO REMOVE' as status,
  s.full_name,
  s.class,
  d.duplicate_count as total_duplicates,
  (d.duplicate_count - 1) as will_be_deleted
FROM duplicates d
JOIN clean_students s ON d.id = s.id AND d.full_name = s.full_name AND d.class = s.class
ORDER BY d.duplicate_count DESC;

-- Step 4: Remove duplicates (keep first one based on ID)
DELETE FROM students 
WHERE id NOT IN (
  SELECT DISTINCT ON (full_name, class) id 
  FROM students 
  ORDER BY full_name, class, id ASC
);

-- Step 5: Verify all class names match constants
SELECT 
  'CLASS VERIFICATION' as status,
  class,
  COUNT(*) as student_count
FROM students 
WHERE class LIKE 'PRY%' OR class LIKE 'Pre-School%' OR class = 'Toddler' OR class = 'Nursery'
GROUP BY class
ORDER BY class;

-- Step 6: Show sample of cleaned names
SELECT 
  'CLEANED NAMES SAMPLE' as status,
  full_name,
  class,
  student_type,
  total_fees
FROM students 
WHERE class LIKE 'PRY 4%'
ORDER BY full_name
LIMIT 20;

-- Step 7: Show total counts by category
SELECT 
  'TOTAL COUNTS' as status,
  CASE 
    WHEN class = 'Toddler' THEN 'Toddler'
    WHEN class = 'Pre-Schooler' THEN 'Pre-Schooler'
    WHEN class = 'Nursery' THEN 'Nursery'
    WHEN class LIKE 'PRY%' THEN 'Primary'
    WHEN class LIKE 'JSS%' THEN 'Junior Secondary'
    WHEN class LIKE 'SS%' THEN 'Senior Secondary'
    ELSE 'Other'
  END as category,
  COUNT(*) as count
FROM students
GROUP BY category
ORDER BY category;

RESET session_replication_role;
