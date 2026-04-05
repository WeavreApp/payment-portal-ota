-- SAFE RLS policies fix for viewer accounts
-- This only adds policies, doesn't drop anything

-- Add policies for admin_profiles (if they don't exist)
INSERT INTO pg_policies (
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
) 
SELECT 
  'admin_profiles'::text,
  'Admins can view own profile'::text,
  true,
  '{"authenticated"}'::text[],
  'SELECT'::text,
  'auth.uid() = id'::text,
  NULL::text
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'admin_profiles' 
  AND policyname = 'Admins can view own profile'
);

INSERT INTO pg_policies (
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
) 
SELECT 
  'admin_profiles'::text,
  'Admins can view all admin profiles'::text,
  true,
  '{"authenticated"}'::text[],
  'SELECT'::text,
  'is_admin()'::text,
  NULL::text
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'admin_profiles' 
  AND policyname = 'Admins can view all admin profiles'
);

INSERT INTO pg_policies (
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
) 
SELECT 
  'admin_profiles'::text,
  'Superadmins can manage admin profiles'::text,
  true,
  '{"authenticated"}'::text[],
  'ALL'::text,
  'is_superadmin()'::text,
  'is_superadmin()'::text
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'admin_profiles' 
  AND policyname = 'Superadmins can manage admin profiles'
);

-- Add policies for students (if they don't exist)
INSERT INTO pg_policies (
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
) 
SELECT 
  'students'::text,
  'Admins can view all students'::text,
  true,
  '{"authenticated"}'::text[],
  'SELECT'::text,
  'is_admin()'::text,
  NULL::text
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'students' 
  AND policyname = 'Admins can view all students'
);

INSERT INTO pg_policies (
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
) 
SELECT 
  'students'::text,
  'Admins can manage students'::text,
  true,
  '{"authenticated"}'::text[],
  'ALL'::text,
  'is_superadmin()'::text,
  'is_superadmin()'::text
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'students' 
  AND policyname = 'Admins can manage students'
);

-- Add policies for payments (if they don't exist)
INSERT INTO pg_policies (
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
) 
SELECT 
  'payments'::text,
  'Admins can view all payments'::text,
  true,
  '{"authenticated"}'::text[],
  'SELECT'::text,
  'is_admin()'::text,
  NULL::text
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'payments' 
  AND policyname = 'Admins can view all payments'
);

INSERT INTO pg_policies (
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
) 
SELECT 
  'payments'::text,
  'Admins can manage payments'::text,
  true,
  '{"authenticated"}'::text[],
  'ALL'::text,
  'is_superadmin()'::text,
  'is_superadmin()'::text
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'payments' 
  AND policyname = 'Admins can manage payments'
);

-- Test the functions (safe, just reads)
SELECT is_admin() as can_access, is_superadmin() as is_super_admin;

-- Check current policies (safe, just reads)
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('admin_profiles', 'students', 'payments')
ORDER BY tablename, policyname;
