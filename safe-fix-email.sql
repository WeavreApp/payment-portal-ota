-- Safe fix for admin_profiles table - NON-DESTRUCTIVE
-- This only adds missing columns, doesn't drop anything

-- Add email column if it doesn't exist (safe operation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE admin_profiles ADD COLUMN email text;
    RAISE NOTICE 'Added email column to admin_profiles';
  ELSE
    RAISE NOTICE 'Email column already exists in admin_profiles';
  END IF;
END $$;

-- Add student_type column if it doesn't exist (safe operation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'student_type'
  ) THEN
    ALTER TABLE students ADD COLUMN student_type text DEFAULT 'day';
    RAISE NOTICE 'Added student_type column to students';
  ELSE
    RAISE NOTICE 'Student_type column already exists in students';
  END IF;
END $$;

-- Add hostel_fee column if it doesn't exist (safe operation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'hostel_fee'
  ) THEN
    ALTER TABLE students ADD COLUMN hostel_fee numeric(12,2) DEFAULT 0;
    RAISE NOTICE 'Added hostel_fee column to students';
  ELSE
    RAISE NOTICE 'Hostel_fee column already exists in students';
  END IF;
END $$;

-- Check current state
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('admin_profiles', 'students') 
ORDER BY table_name, ordinal_position;
