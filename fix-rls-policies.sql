-- Fix RLS policies for viewer accounts
-- Run this in Supabase SQL Editor

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Admins can view own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Admins can view all students" ON students;
DROP POLICY IF EXISTS "Admins can manage students" ON students;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON payments;

-- Recreate policies that work for both superadmin and viewer
CREATE POLICY "Admins can view own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all admin profiles"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Superadmins can manage admin profiles"
  ON admin_profiles FOR ALL
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

-- Test the functions
SELECT is_admin() as can_access, is_superadmin() as is_super_admin;
