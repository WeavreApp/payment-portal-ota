-- Setup Bank Accounts Management System
-- Run this in Supabase SQL Editor

-- This will create the bank accounts table and set up all necessary functions
-- Copy the contents of: supabase/migrations/20260411000000_add_bank_accounts.sql
-- and run it in Supabase SQL Editor

-- After running the migration, you can verify the setup:

-- Check if bank_accounts table exists
SELECT 
  'TABLE CHECK' as status,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'bank_accounts'
ORDER BY ordinal_position;

-- Check if default accounts were inserted
SELECT 
  'DEFAULT ACCOUNTS' as status,
  id,
  bank_name,
  account_name,
  account_number,
  student_level,
  display_order,
  is_active
FROM bank_accounts 
ORDER BY display_order;

-- Test the public function
SELECT 
  'PUBLIC FUNCTION TEST' as status,
  *
FROM get_bank_accounts('all');

-- Check RLS policies
SELECT 
  'RLS POLICIES' as status,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'bank_accounts';
