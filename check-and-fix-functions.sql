-- Check if helper functions exist and create them if needed
-- Run this in Supabase SQL Editor

-- Check if functions exist
SELECT 
  proname,
  prosrc
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_superadmin');

-- Create is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create is_superadmin function if it doesn't exist
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_profiles 
    WHERE id = auth.uid() AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the functions with your current user
SELECT is_admin() as can_access, is_superadmin() as is_super_admin;

-- Check if admin_profiles table has the right structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'admin_profiles' 
ORDER BY ordinal_position;

-- Check if there are any admin profiles
SELECT 
  id, 
  email, 
  role, 
  created_at
FROM admin_profiles
ORDER BY created_at;
