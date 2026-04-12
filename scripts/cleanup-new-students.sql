-- Clean up new students: remove duplicates and gender markers
-- Run this in Supabase SQL Editor

SET session_replication_role = 'origin';

-- First, let's identify duplicates by checking names with gender markers
WITH students_with_gender AS (
  SELECT 
    id,
    full_name,
    class,
    student_type,
    total_fees,
    CASE 
      WHEN full_name LIKE '% (F)' THEN REPLACE(full_name, ' (F)', '')
      WHEN full_name LIKE '% (M)' THEN REPLACE(full_name, ' (M)', '')
      ELSE full_name
    END as clean_name
  FROM students
  WHERE full_name LIKE '% (F)' OR full_name LIKE '% (M)'
),

duplicates AS (
  SELECT 
    clean_name,
    class,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ',') as duplicate_ids
  FROM students_with_gender
  GROUP BY clean_name, class
  HAVING COUNT(*) > 1
)

-- Show duplicates before cleanup
SELECT 
  'DUPLICATES FOUND' as status,
  clean_name,
  class,
  duplicate_count,
  duplicate_ids
FROM duplicates;

-- Update names to remove gender markers
UPDATE students 
SET full_name = CASE 
  WHEN full_name LIKE '% (F)' THEN REPLACE(full_name, ' (F)', '')
  WHEN full_name LIKE '% (M)' THEN REPLACE(full_name, ' (M)', '')
  ELSE full_name
END
WHERE full_name LIKE '% (F)' OR full_name LIKE '% (M)';

-- Remove duplicates (keep the first one based on ID)
WITH duplicates_to_remove AS (
  SELECT 
    s.id,
    ROW_NUMBER() OVER (PARTITION BY 
      CASE 
        WHEN s.full_name LIKE '% (F)' THEN REPLACE(s.full_name, ' (F)', '')
        WHEN s.full_name LIKE '% (M)' THEN REPLACE(s.full_name, ' (M)', '')
        ELSE s.full_name
      END, s.class
    ORDER BY s.id ASC
  ) as row_num,
    CASE 
      WHEN s.full_name LIKE '% (F)' THEN REPLACE(s.full_name, ' (F)', '')
      WHEN s.full_name LIKE '% (M)' THEN REPLACE(s.full_name, ' (M)', '')
      ELSE s.full_name
    END as clean_name
  FROM students s
  WHERE s.full_name LIKE '% (F)' OR s.full_name LIKE '% (M)'
)

DELETE FROM students 
WHERE id IN (
  SELECT id FROM duplicates_to_remove WHERE row_num > 1
);

-- Show results after cleanup
SELECT 
  'CLEANUP RESULTS' as status,
  COUNT(*) as total_students_updated
FROM students 
WHERE full_name LIKE '% (F)' OR full_name LIKE '% (M)';

-- Show sample of cleaned names
SELECT 
  'CLEANED NAMES SAMPLE' as status,
  full_name,
  class,
  student_type,
  total_fees
FROM students 
WHERE full_name NOT LIKE '% (F)' AND full_name NOT LIKE '% (M)'
  AND (full_name LIKE 'Taiwo%' OR full_name LIKE 'Olatunde%' OR full_name LIKE 'Nimetallahi%')
LIMIT 10;

RESET session_replication_role;
