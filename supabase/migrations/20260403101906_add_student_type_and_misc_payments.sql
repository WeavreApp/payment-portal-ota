/*
  # Add Student Type, Hostel Fee, and Miscellaneous Items

  ## Summary
  Extends the payment system to support:
  1. Day vs Boarding student distinction with separate hostel fees
  2. Multiple bank accounts with routing rules
  3. Miscellaneous/supplementary item catalog (uniforms, textbooks, etc.)
  4. Payment type tracking (tuition vs miscellaneous)

  ## Changes

  ### Modified Tables
  - `students`: Added `student_type` (day/boarding), `hostel_fee` columns

  ### New Tables
  - `misc_items`: Catalog of purchasable items (uniforms, books, etc.) with level (secondary/primary)
  - `bank_accounts`: All school bank accounts with routing metadata
  - `payment_misc_items`: Join table linking payments to misc items purchased

  ### New Columns on `payments`
  - `payment_type`: 'tuition' or 'miscellaneous'
  - `bank_account_id`: which account the payment went into

  ## Security
  - RLS enabled on all new tables
  - misc_items and bank_accounts are readable by anyone (public reference data)
*/

-- Add student_type and hostel_fee to students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'student_type'
  ) THEN
    ALTER TABLE students ADD COLUMN student_type text NOT NULL DEFAULT 'day' CHECK (student_type IN ('day', 'boarding'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'hostel_fee'
  ) THEN
    ALTER TABLE students ADD COLUMN hostel_fee numeric(12,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  accepts_tuition boolean NOT NULL DEFAULT false,
  accepts_misc boolean NOT NULL DEFAULT false,
  student_level text NOT NULL CHECK (student_level IN ('secondary', 'primary', 'hostel')),
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bank accounts readable by all"
  ON bank_accounts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed the 5 bank accounts
INSERT INTO bank_accounts (bank_name, account_name, account_number, accepts_tuition, accepts_misc, student_level, display_order) VALUES
  ('Zenith Bank', 'OTA TOTAL ACADEMY HOSTEL ACCT', '1015754234', true, false, 'hostel', 1),
  ('Wema Bank PLC', 'OTA TOTAL ACADEMY', '0120576045', true, false, 'secondary', 2),
  ('Zenith Bank', 'OTA TOTAL ACADEMY JUNIOR SCHL', '1227261287', true, false, 'secondary', 3),
  ('Zenith Bank', 'OTA TOTAL ACADEMY JUNIOR SCH', '1010893075', true, true, 'secondary', 4),
  ('Zenith Bank', 'OTA TOTAL ACADEMY PRIMARY SCH', '1015754241', true, true, 'primary', 5)
ON CONFLICT DO NOTHING;

-- Create misc_items table
CREATE TABLE IF NOT EXISTS misc_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(12,2) NOT NULL,
  student_level text NOT NULL CHECK (student_level IN ('secondary', 'primary')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE misc_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Misc items readable by all"
  ON misc_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Superadmin can manage misc items"
  ON misc_items FOR INSERT
  TO authenticated
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can update misc items"
  ON misc_items FOR UPDATE
  TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

CREATE POLICY "Superadmin can delete misc items"
  ON misc_items FOR DELETE
  TO authenticated
  USING (is_superadmin());

-- Seed secondary misc items
INSERT INTO misc_items (name, price, student_level) VALUES
  ('School Uniform (Junior)', 15000, 'secondary'),
  ('School Uniform (Senior)', 17000, 'secondary'),
  ('School Bag', 16000, 'secondary'),
  ('N.O.S.E.C (Senior)', 5000, 'secondary'),
  ('N.O.S.E.C (Junior)', 4500, 'secondary'),
  ('MAN Maths (Senior)', 5000, 'secondary'),
  ('MAN Maths (Junior)', 4500, 'secondary'),
  ('Prep 50s', 2000, 'secondary'),
  ('Chemistry Textbook', 6500, 'secondary'),
  ('Physics Textbook', 6500, 'secondary'),
  ('Civics Textbook', 6000, 'secondary'),
  ('60 Leaves Notebook', 500, 'secondary'),
  ('40 Leaves Notebook', 400, 'secondary'),
  ('Graph Booklet', 500, 'secondary'),
  ('Higher Education', 1000, 'secondary'),
  ('Rain Coat', 5000, 'secondary');

-- Seed primary misc items
INSERT INTO misc_items (name, price, student_level) VALUES
  ('2 Pairs School Uniform', 14000, 'primary'),
  ('1 Pair Sports Wear', 12000, 'primary'),
  ('Rain Coat', 5000, 'primary'),
  ('Cardigan', 8000, 'primary'),
  ('School Bag (Small)', 9000, 'primary'),
  ('School Bag (Big)', 10000, 'primary');

-- Add payment_type and bank_account_id to payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'payment_type'
  ) THEN
    ALTER TABLE payments ADD COLUMN payment_type text NOT NULL DEFAULT 'tuition' CHECK (payment_type IN ('tuition', 'miscellaneous'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'bank_account_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN bank_account_id uuid REFERENCES bank_accounts(id);
  END IF;
END $$;

-- Create payment_misc_items join table
CREATE TABLE IF NOT EXISTS payment_misc_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  misc_item_id uuid NOT NULL REFERENCES misc_items(id),
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_misc_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment misc items"
  ON payment_misc_items FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Anyone can insert payment misc items"
  ON payment_misc_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Update submit_parent_payment RPC to accept bank_account_id, payment_type, and misc items
CREATE OR REPLACE FUNCTION submit_parent_payment(
  p_student_id uuid,
  p_amount numeric,
  p_reference_number text,
  p_proof_url text,
  p_proof_hash text,
  p_parent_name text,
  p_parent_phone text,
  p_payment_type text DEFAULT 'tuition',
  p_bank_account_id uuid DEFAULT NULL,
  p_misc_item_ids uuid[] DEFAULT NULL,
  p_misc_quantities int[] DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_txn_id text;
  v_status text;
  v_flag_reason text := '';
  v_duplicate_ref boolean := false;
  v_duplicate_hash boolean := false;
  v_payment_id uuid;
  i int;
BEGIN
  SELECT generate_txn_id() INTO v_txn_id;
  v_status := 'pending';

  SELECT EXISTS(
    SELECT 1 FROM payments WHERE reference_number = p_reference_number
  ) INTO v_duplicate_ref;

  SELECT EXISTS(
    SELECT 1 FROM payments WHERE proof_hash = p_proof_hash
  ) INTO v_duplicate_hash;

  IF v_duplicate_ref THEN
    v_flag_reason := v_flag_reason || 'Duplicate reference number detected. ';
    v_status := 'flagged';
  END IF;

  IF v_duplicate_hash THEN
    v_flag_reason := v_flag_reason || 'Duplicate proof of payment detected. ';
    v_status := 'flagged';
  END IF;

  INSERT INTO payments (
    txn_id,
    student_id,
    amount,
    method,
    payment_date,
    proof_url,
    proof_hash,
    reference_number,
    parent_name,
    parent_phone,
    source,
    status,
    flag_reason,
    payment_type,
    bank_account_id
  ) VALUES (
    v_txn_id,
    p_student_id,
    p_amount,
    'Transfer',
    CURRENT_DATE,
    p_proof_url,
    p_proof_hash,
    p_reference_number,
    p_parent_name,
    p_parent_phone,
    'parent',
    v_status,
    NULLIF(TRIM(v_flag_reason), ''),
    p_payment_type,
    p_bank_account_id
  ) RETURNING id INTO v_payment_id;

  IF p_misc_item_ids IS NOT NULL AND array_length(p_misc_item_ids, 1) > 0 AND p_payment_type = 'miscellaneous' THEN
    FOR i IN 1..array_length(p_misc_item_ids, 1) LOOP
      INSERT INTO payment_misc_items (payment_id, misc_item_id, quantity, unit_price)
      SELECT
        v_payment_id,
        p_misc_item_ids[i],
        COALESCE(p_misc_quantities[i], 1),
        price
      FROM misc_items
      WHERE id = p_misc_item_ids[i];
    END LOOP;
  END IF;

  RETURN v_txn_id;
END;
$$;
