-- Direct staff creation SQL
-- Run this in Supabase SQL Editor to create a staff account manually
-- Replace the placeholder values with actual staff details

-- Step 1: Create the auth user (replace with actual details)
SELECT auth.signup(
  email => 'staff@example.com',  -- Replace with staff email
  password => 'password123',     -- Replace with staff password  
  options => '{ "data": { "full_name": "Staff Name" } }'
);

-- Step 2: Get the user ID and create admin profile
-- After running the above, you'll get a user ID. Use it in the INSERT below:
INSERT INTO admin_profiles (id, full_name, email, role)
VALUES (
  'USER_ID_FROM_STEP1',  -- Replace with actual user ID from step 1
  'Staff Name',          -- Replace with staff full name
  'staff@example.com',   -- Replace with staff email
  'viewer'               -- Role is always 'viewer' for staff accounts
);

-- To see all users and their IDs:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;
