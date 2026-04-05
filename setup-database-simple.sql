-- Simple database setup - run this first

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;

-- Transaction ID sequence
CREATE SEQUENCE IF NOT EXISTS txn_id_seq START 1;

-- Generate unique transaction IDs
CREATE OR REPLACE FUNCTION generate_txn_id()
RETURNS text AS $$
BEGIN
  RETURN 'TXN-' || LPAD(nextval('txn_id_seq')::text, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Admin profiles table
CREATE TABLE admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  class text NOT NULL,
  total_fees numeric(12,2) NOT NULL DEFAULT 0,
  total_paid numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_id text UNIQUE NOT NULL DEFAULT generate_txn_id(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  method text NOT NULL DEFAULT 'Cash',
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  proof_url text,
  proof_hash text,
  reference_number text,
  parent_name text,
  parent_phone text,
  source text NOT NULL DEFAULT 'admin',
  status text NOT NULL DEFAULT 'verified',
  flag_reason text,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

-- Helper: check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin self-registration (for initial setup)
CREATE OR REPLACE FUNCTION create_admin_profile(p_full_name text)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_profiles (id, full_name, role)
  VALUES (auth.uid(), p_full_name, 'admin')
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Admins can view own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
