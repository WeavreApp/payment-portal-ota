-- Test bank accounts functionality
-- Run this in Supabase SQL Editor

-- Test 1: Check if bank accounts table exists and has data
SELECT 
  'TEST 1 - BANK ACCOUNTS TABLE' as status,
  COUNT(*) as total_accounts,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_accounts
FROM bank_accounts;

-- Test 2: Test the public function
SELECT 
  'TEST 2 - PUBLIC FUNCTION' as status,
  COUNT(*) as available_accounts
FROM get_bank_accounts('all');

-- Test 3: Show sample bank accounts
SELECT 
  'TEST 3 - SAMPLE ACCOUNTS' as status,
  bank_name,
  account_name,
  account_number,
  student_level,
  display_order,
  is_active
FROM bank_accounts 
WHERE is_active = true
ORDER BY display_order
LIMIT 5;

-- Test 4: Check if admin has proper access
SELECT 
  'TEST 4 - ADMIN ACCESS' as status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE id = auth.uid() AND role = 'superadmin'
    ) THEN 'SUPER ADMIN ACCESS OK'
    ELSE 'NO SUPER ADMIN ACCESS'
  END as access_status;

-- Test 5: Test filtering by student level
SELECT 
  'TEST 5 - STUDENT LEVEL FILTERING' as status,
  'primary' as test_level,
  COUNT(*) as primary_accounts
FROM get_bank_accounts('primary')
UNION ALL
SELECT 
  'TEST 5 - STUDENT LEVEL FILTERING' as status,
  'secondary' as test_level,
  COUNT(*) as secondary_accounts
FROM get_bank_accounts('secondary')
UNION ALL
SELECT 
  'TEST 5 - STUDENT LEVEL FILTERING' as status,
  'hostel' as test_level,
  COUNT(*) as hostel_accounts
FROM get_bank_accounts('hostel');
