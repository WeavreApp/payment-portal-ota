-- Fix admin_profiles table for staff creation
-- Run this in your Supabase SQL Editor

-- Add email column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE admin_profiles ADD COLUMN email text;
  END IF;
END $$;

-- Add student_type and hostel_fee columns to students table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'student_type'
  ) THEN
    ALTER TABLE students ADD COLUMN student_type text DEFAULT 'day';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'hostel_fee'
  ) THEN
    ALTER TABLE students ADD COLUMN hostel_fee numeric(12,2) DEFAULT 0;
  END IF;
END $$;

-- Update existing admin to superadmin role
UPDATE admin_profiles SET role = 'superadmin' WHERE role = 'admin';

-- Create helper functions if they don't exist
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS if not already enabled
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for admin_profiles
DROP POLICY IF EXISTS "Admins can view own profile" ON admin_profiles;
CREATE POLICY "Admins can view own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Superadmins can manage staff" ON admin_profiles;
CREATE POLICY "Superadmins can manage staff"
  ON admin_profiles FOR ALL
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

-- Basic RLS policies for students
DROP POLICY IF EXISTS "Admins can view all students" ON students;
CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage students" ON students;
CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Basic RLS policies for payments
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
