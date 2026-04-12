-- Fix bank_accounts table structure
-- Run this in Supabase SQL Editor

-- First, check if table exists and its current structure
SELECT 
  'CURRENT TABLE STRUCTURE' as status,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'bank_accounts'
ORDER BY ordinal_position;

-- Drop the table if it exists and recreate it properly
DROP TABLE IF EXISTS bank_accounts CASCADE;

-- Recreate the table with all required columns
CREATE TABLE bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  accepts_tuition boolean NOT NULL DEFAULT true,
  accepts_misc boolean NOT NULL DEFAULT true,
  student_level text NOT NULL DEFAULT 'all', -- 'primary', 'secondary', 'hostel', 'all'
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_bank_accounts_student_level ON bank_accounts(student_level);
CREATE INDEX idx_bank_accounts_is_active ON bank_accounts(is_active);
CREATE INDEX idx_bank_accounts_display_order ON bank_accounts(display_order);

-- Insert default bank accounts
INSERT INTO bank_accounts (bank_name, account_name, account_number, accepts_tuition, accepts_misc, student_level, display_order) VALUES
('Access Bank', 'Ota Total Academy', '0091234567', true, true, 'all', 1),
('Zenith Bank', 'Ota Total Academy', '1012345678', true, true, 'all', 2),
('UBA', 'Ota Total Academy', '2012345678', true, true, 'all', 3);

-- Enable RLS
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Super admins can view all bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Super admins can insert bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Super admins can update bank accounts" ON bank_accounts;
DROP POLICY IF EXISTS "Super admins can delete bank accounts" ON bank_accounts;

-- Create RLS policies
CREATE POLICY "Super admins can view all bank accounts"
  ON bank_accounts FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin'));

CREATE POLICY "Super admins can insert bank accounts"
  ON bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin'));

CREATE POLICY "Super admins can update bank accounts"
  ON bank_accounts FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin'))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin'));

CREATE POLICY "Super admins can delete bank accounts"
  ON bank_accounts FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Drop and recreate functions
DROP FUNCTION IF EXISTS get_bank_accounts(p_student_level text);
DROP FUNCTION IF EXISTS update_bank_account(p_id uuid, p_bank_name text, p_account_name text, p_account_number text, p_accepts_tuition boolean, p_accepts_misc boolean, p_student_level text, p_display_order integer, p_is_active boolean);
DROP FUNCTION IF EXISTS create_bank_account(p_bank_name text, p_account_name text, p_account_number text, p_accepts_tuition boolean, p_accepts_misc boolean, p_student_level text, p_display_order integer);
DROP FUNCTION IF EXISTS delete_bank_account(p_id uuid);

-- Function to get bank accounts for public display (parent portal)
CREATE OR REPLACE FUNCTION get_bank_accounts(p_student_level text DEFAULT 'all')
RETURNS TABLE (
  id uuid,
  bank_name text,
  account_name text,
  account_number text,
  accepts_tuition boolean,
  accepts_misc boolean,
  student_level text,
  display_order integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ba.id,
    ba.bank_name,
    ba.account_name,
    ba.account_number,
    ba.accepts_tuition,
    ba.accepts_misc,
    ba.student_level,
    ba.display_order
  FROM bank_accounts ba
  WHERE ba.is_active = true
  AND (
    ba.student_level = 'all' 
    OR ba.student_level = p_student_level
    OR (ba.student_level = 'secondary' AND p_student_level IN ('junior_secondary', 'senior_secondary'))
  )
  ORDER BY ba.display_order, ba.bank_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update bank account
CREATE OR REPLACE FUNCTION update_bank_account(
  p_id uuid,
  p_bank_name text,
  p_account_name text,
  p_account_number text,
  p_accepts_tuition boolean,
  p_accepts_misc boolean,
  p_student_level text,
  p_display_order integer,
  p_is_active boolean
) RETURNS boolean AS $$
BEGIN
  UPDATE bank_accounts 
  SET 
    bank_name = p_bank_name,
    account_name = p_account_name,
    account_number = p_account_number,
    accepts_tuition = p_accepts_tuition,
    accepts_misc = p_accepts_misc,
    student_level = p_student_level,
    display_order = p_display_order,
    is_active = p_is_active,
    updated_at = now()
  WHERE id = p_id
  AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin');
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create bank account
CREATE OR REPLACE FUNCTION create_bank_account(
  p_bank_name text,
  p_account_name text,
  p_account_number text,
  p_accepts_tuition boolean,
  p_accepts_misc boolean,
  p_student_level text,
  p_display_order integer
) RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO bank_accounts (
    bank_name, account_name, account_number, accepts_tuition, accepts_misc, 
    student_level, display_order
  ) VALUES (
    p_bank_name, p_account_name, p_account_number, p_accepts_tuition, p_accepts_misc,
    p_student_level, p_display_order
  ) RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete bank account
CREATE OR REPLACE FUNCTION delete_bank_account(p_id uuid) RETURNS boolean AS $$
BEGIN
  DELETE FROM bank_accounts 
  WHERE id = p_id
  AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'superadmin');
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the setup
SELECT 
  'VERIFICATION - BANK ACCOUNTS' as status,
  id,
  bank_name,
  account_name,
  account_number,
  accepts_tuition,
  accepts_misc,
  student_level,
  display_order,
  is_active
FROM bank_accounts 
ORDER BY display_order;

-- Test the public function
SELECT 
  'VERIFICATION - PUBLIC FUNCTION' as status,
  *
FROM get_bank_accounts('all');
