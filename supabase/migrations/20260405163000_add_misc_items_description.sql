-- Add description column to misc_items table
ALTER TABLE misc_items 
ADD COLUMN description text;

-- Drop the existing constraint first
ALTER TABLE misc_items 
DROP CONSTRAINT IF EXISTS misc_items_student_level_check;

-- Update existing secondary records to junior_secondary (for backwards compatibility)
UPDATE misc_items 
SET student_level = 'junior_secondary' 
WHERE student_level = 'secondary';

-- Add the new constraint with all allowed levels
ALTER TABLE misc_items 
ADD CONSTRAINT misc_items_student_level_check 
CHECK (student_level IN ('primary', 'junior_secondary', 'senior_secondary', 'all_secondary', 'all_classes', 'hostel', 'all'));
