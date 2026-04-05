-- CORRECT staff creation method for Supabase
-- Run this in Supabase SQL Editor

-- Step 1: Create the auth user using admin API
-- This requires service role access, so run this first:
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) 
SELECT 
  gen_random_uuid(),
  'staff1@school.com',                    -- Replace with staff email
  crypt('password123', gen_salt('bf')),    -- Replace with staff password
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Staff User 1"}'::jsonb   -- Replace with staff name
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'staff1@school.com'
);

-- Step 2: Get the user ID and create admin profile
-- First, find the user ID you just created:
SELECT id, email FROM auth.users WHERE email = 'staff1@school.com';

-- Step 3: Create the admin profile using the user ID from step 2
INSERT INTO admin_profiles (id, full_name, email, role)
VALUES (
  'PASTE_USER_ID_HERE',    -- Replace with actual user ID from step 2
  'Staff User 1',          -- Replace with staff full name
  'staff1@school.com',     -- Replace with staff email
  'viewer'                 -- Role is always 'viewer' for staff accounts
);

-- Alternative: If you prefer, use the auth admin API directly:
-- Go to Authentication → Users → "Add user" in the dashboard instead
