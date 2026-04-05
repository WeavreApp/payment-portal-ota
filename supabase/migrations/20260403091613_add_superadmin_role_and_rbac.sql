/*
  # Add Superadmin Role and RBAC

  ## Summary
  Upgrades the role system to distinguish between superadmin (full access) and
  viewer (read-only) staff accounts. Maximum 3 accounts are enforced.

  ## Changes
  1. Adds `email` column to `admin_profiles` for display in Staff Management UI
  2. Updates existing admin to `superadmin` role
  3. Adds `is_superadmin()` helper function
  4. Updates RLS: reads require any admin role, writes require superadmin
  5. Adds account-count limit function used by the staff creation edge function

  ## Roles
  - `superadmin`: Full access - create/edit/delete students, verify payments, manage staff
  - `viewer`: Read-only access - can view dashboard, students, payments, review queue

  ## Security
  - RLS policies updated: SELECT policies use `is_admin()`, INSERT/UPDATE/DELETE use `is_superadmin()`
  - Maximum 3 total admin accounts enforced via `can_create_staff()` function
*/

-- Add email column to admin_profiles (for staff management display)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE admin_profiles ADD COLUMN email text;
  END IF;
END $$;

-- Update existing admin to superadmin role
UPDATE admin_profiles SET role = 'superadmin' WHERE role = 'admin';

-- Update the create_admin_profile RPC to create superadmin (disabled in UI but kept for DB use)
CREATE OR REPLACE FUNCTION create_admin_profile(p_full_name text)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_profiles (id, full_name, role)
  VALUES (auth.uid(), p_full_name, 'superadmin')
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: check if current user has any admin profile (superadmin or viewer)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: check if current user is superadmin
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: check if a new staff account can be created (max 3 total, max 2 viewers)
CREATE OR REPLACE FUNCTION can_create_staff()
RETURNS boolean AS $$
DECLARE
  v_total int;
  v_viewers int;
BEGIN
  SELECT COUNT(*) INTO v_total FROM admin_profiles;
  SELECT COUNT(*) INTO v_viewers FROM admin_profiles WHERE role = 'viewer';
  RETURN v_total < 3 AND v_viewers < 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate write policies to require superadmin role

-- Students: reads for any admin, writes for superadmin only
DROP POLICY IF EXISTS "Admins can insert students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students;
DROP POLICY IF EXISTS "Admins can delete students" ON students;

CREATE POLICY "Superadmin can insert students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can update students"
  ON students FOR UPDATE
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- Payments: reads for any admin, writes for superadmin only
DROP POLICY IF EXISTS "Admins can insert payments" ON payments;
DROP POLICY IF EXISTS "Admins can update payments" ON payments;
DROP POLICY IF EXISTS "Admins can delete payments" ON payments;

CREATE POLICY "Superadmin can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- Admin profiles: superadmin can view all profiles (for staff management page)
DROP POLICY IF EXISTS "Admins can view own profile" ON admin_profiles;

CREATE POLICY "Admins can view own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_superadmin());

-- Allow superadmin to insert new staff profiles (used by edge function via service role)
CREATE POLICY "Service role can manage all profiles"
  ON admin_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
