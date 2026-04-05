/*
  # School Payment Management System - Core Schema

  1. New Tables
    - `admin_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text) - Admin display name
      - `role` (text) - Either 'admin' or 'accountant'
      - `created_at` (timestamptz)
    - `students`
      - `id` (uuid, primary key)
      - `full_name` (text) - Student full name
      - `class` (text) - Student class/grade
      - `total_fees` (numeric) - Total school fees owed
      - `total_paid` (numeric) - Running total of verified payments
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `payments`
      - `id` (uuid, primary key)
      - `txn_id` (text, unique) - Auto-generated transaction ID (TXN-XXXXX)
      - `student_id` (uuid, FK to students)
      - `amount` (numeric) - Payment amount
      - `method` (text) - Cash/Transfer/POS/Bank Transfer
      - `payment_date` (date) - Date of payment
      - `notes` (text) - Optional notes
      - `proof_url` (text) - URL to uploaded proof in storage
      - `proof_hash` (text) - SHA-256 hash of proof file for fraud detection
      - `reference_number` (text) - Bank reference number
      - `parent_name` (text) - Name of parent who submitted (parent portal)
      - `parent_phone` (text) - Parent phone number
      - `source` (text) - 'admin' or 'parent' submission source
      - `status` (text) - pending/verified/flagged/rejected
      - `flag_reason` (text) - Reason for flagging (fraud detection)
      - `created_at` (timestamptz)
      - `reviewed_at` (timestamptz)
      - `reviewed_by` (uuid) - Admin who reviewed

  2. Functions
    - `generate_txn_id()` - Generates unique TXN-XXXXX IDs
    - `update_student_total_paid()` - Trigger to auto-sync student balance
    - `is_admin()` - Checks if current user is an admin (SECURITY DEFINER)
    - `create_admin_profile()` - Allows new auth users to register as admin
    - `lookup_student()` - Public student lookup for parent portal (SECURITY DEFINER)
    - `submit_parent_payment()` - Parent payment submission with fraud detection (SECURITY DEFINER)

  3. Security
    - RLS enabled on all tables
    - Admin-only access to students and payments via is_admin() check
    - Parent portal accesses data only through SECURITY DEFINER functions
    - No anonymous direct table access

  4. Indexes
    - payments: student_id, status, txn_id, reference_number, proof_hash
    - students: class, full_name
*/

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
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  class text NOT NULL,
  total_fees numeric(12,2) NOT NULL DEFAULT 0,
  total_paid numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_txn_id ON payments(txn_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference_number ON payments(reference_number);
CREATE INDEX IF NOT EXISTS idx_payments_proof_hash ON payments(proof_hash);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name);

-- Trigger function: auto-update student total_paid when payments change
CREATE OR REPLACE FUNCTION update_student_total_paid()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'verified' THEN
      UPDATE students SET total_paid = total_paid + NEW.amount, updated_at = now() WHERE id = NEW.student_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'verified' AND NEW.status = 'verified' THEN
      UPDATE students SET total_paid = total_paid + NEW.amount, updated_at = now() WHERE id = NEW.student_id;
    ELSIF OLD.status = 'verified' AND NEW.status != 'verified' THEN
      UPDATE students SET total_paid = total_paid - OLD.amount, updated_at = now() WHERE id = OLD.student_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'verified' THEN
      UPDATE students SET total_paid = total_paid - OLD.amount, updated_at = now() WHERE id = OLD.student_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_student_total_paid
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION update_student_total_paid();

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

-- Parent portal: lookup student by name and class
CREATE OR REPLACE FUNCTION lookup_student(p_name text, p_class text)
RETURNS TABLE(id uuid, full_name text, class text, total_fees numeric, total_paid numeric) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.full_name, s.class, s.total_fees, s.total_paid
  FROM students s
  WHERE LOWER(TRIM(s.full_name)) = LOWER(TRIM(p_name))
  AND s.class = p_class;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Parent portal: submit payment with built-in fraud detection
CREATE OR REPLACE FUNCTION submit_parent_payment(
  p_student_id uuid,
  p_amount numeric,
  p_reference_number text,
  p_proof_url text,
  p_proof_hash text,
  p_parent_name text,
  p_parent_phone text
) RETURNS text AS $$
DECLARE
  v_txn_id text;
  v_dup_ref boolean := false;
  v_dup_hash boolean := false;
  v_suspicious_amount boolean := false;
  v_student_fees numeric;
  v_flag_reasons text[] := ARRAY[]::text[];
  v_status text := 'pending';
BEGIN
  SELECT total_fees INTO v_student_fees FROM students WHERE id = p_student_id;

  IF v_student_fees IS NULL THEN
    RAISE EXCEPTION 'Student not found';
  END IF;

  IF p_reference_number IS NOT NULL AND p_reference_number != '' THEN
    SELECT EXISTS(
      SELECT 1 FROM payments
      WHERE reference_number = p_reference_number
      AND status NOT IN ('rejected')
    ) INTO v_dup_ref;
  END IF;

  IF p_proof_hash IS NOT NULL AND p_proof_hash != '' THEN
    SELECT EXISTS(
      SELECT 1 FROM payments
      WHERE proof_hash = p_proof_hash
      AND status NOT IN ('rejected')
    ) INTO v_dup_hash;
  END IF;

  IF p_amount > v_student_fees THEN
    v_suspicious_amount := true;
  END IF;

  IF v_dup_ref THEN
    v_flag_reasons := array_append(v_flag_reasons, 'Duplicate reference number detected');
  END IF;
  IF v_dup_hash THEN
    v_flag_reasons := array_append(v_flag_reasons, 'Duplicate proof file detected');
  END IF;
  IF v_suspicious_amount THEN
    v_flag_reasons := array_append(v_flag_reasons, 'Amount exceeds total school fees');
  END IF;

  IF array_length(v_flag_reasons, 1) > 0 THEN
    v_status := 'flagged';
  END IF;

  INSERT INTO payments (
    student_id, amount, method, payment_date, proof_url, proof_hash,
    reference_number, parent_name, parent_phone, source, status, flag_reason
  ) VALUES (
    p_student_id, p_amount, 'Bank Transfer', CURRENT_DATE, p_proof_url, p_proof_hash,
    p_reference_number, p_parent_name, p_parent_phone, 'parent', v_status,
    CASE WHEN array_length(v_flag_reasons, 1) > 0 THEN array_to_string(v_flag_reasons, '; ') ELSE NULL END
  ) RETURNING txn_id INTO v_txn_id;

  RETURN v_txn_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS: admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update own profile"
  ON admin_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS: students (admin only)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update students"
  ON students FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (is_admin());

-- RLS: payments (admin only, parent access via RPC)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (is_admin());
