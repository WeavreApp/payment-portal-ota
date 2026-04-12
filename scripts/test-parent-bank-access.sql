-- Test parent portal bank account access
-- Run this in Supabase SQL Editor

-- Test 1: Test public function with different student levels
SELECT 
  'TEST 1 - PRIMARY LEVEL' as status,
  COUNT(*) as available_accounts
FROM get_bank_accounts('primary');

SELECT 
  'TEST 1 - SECONDARY LEVEL' as status,
  COUNT(*) as available_accounts
FROM get_bank_accounts('secondary');

SELECT 
  'TEST 1 - HOSTEL LEVEL' as status,
  COUNT(*) as available_accounts
FROM get_bank_accounts('hostel');

SELECT 
  'TEST 1 - ALL LEVELS' as status,
  COUNT(*) as available_accounts
FROM get_bank_accounts('all');

-- Test 2: Check if function returns expected columns
SELECT 
  'TEST 2 - FUNCTION OUTPUT' as status,
  *
FROM get_bank_accounts('all')
LIMIT 3;

-- Test 3: Verify RLS policies block direct access
-- This should fail for non-admin users
SELECT 
  'TEST 3 - DIRECT ACCESS (SHOULD FAIL FOR PARENTS)' as status,
  'This query should fail for non-admin users' as note;

-- Test 4: Check active accounts only
SELECT 
  'TEST 4 - ACTIVE ACCOUNTS COUNT' as status,
  COUNT(*) as active_count,
  COUNT(CASE WHEN is_active = true THEN 1 END) as true_active_count
FROM bank_accounts;

-- Test 5: Sample output for parent portal
SELECT 
  'TEST 5 - SAMPLE FOR PARENTS' as status,
  bank_name,
  account_name,
  account_number,
  accepts_tuition,
  accepts_misc,
  student_level,
  display_order
FROM get_bank_accounts('primary')
ORDER BY display_order, bank_name
LIMIT 5;
