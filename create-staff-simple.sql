-- Simple staff account creation
-- Run this in Supabase SQL Editor

-- Step 1: Create the auth user (replace with actual staff details)
SELECT auth.signup(
  email => 'staff1@school.com',     -- Replace with staff email
  password => 'password123',        -- Replace with staff password  
  options => '{ "data": { "full_name": "Staff User 1" } }'
);

-- Step 2: Get the user ID from the result above, then create admin profile
-- After running the above, you'll see a user ID in the result. Use it here:
INSERT INTO admin_profiles (id, full_name, email, role)
VALUES (
  'PASTE_USER_ID_HERE',    -- Replace with actual user ID from step 1 result
  'Staff User 1',          -- Replace with staff full name
  'staff1@school.com',     -- Replace with staff email
  'viewer'                 -- Role is always 'viewer' for staff accounts
);

-- To see all users and get the correct user ID:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;
