/*
  # Fix lookup_student and payment trigger

  ## Changes
  1. `lookup_student` now returns student_type and hostel_fee so the parent portal
     knows if the student is boarding or day, and can show the correct bank accounts.

  2. `update_student_total_paid` trigger now ONLY adds to total_paid for 'tuition'
     payments. Miscellaneous/supplementary item payments are tracked separately
     and should not reduce the outstanding tuition balance.
*/

DROP FUNCTION IF EXISTS lookup_student(text, text);

CREATE OR REPLACE FUNCTION lookup_student(p_name text, p_class text)
RETURNS TABLE(
  id uuid,
  full_name text,
  class text,
  student_type text,
  total_fees numeric,
  hostel_fee numeric,
  total_paid numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.full_name, s.class, s.student_type, s.total_fees, s.hostel_fee, s.total_paid
  FROM students s
  WHERE LOWER(TRIM(s.full_name)) = LOWER(TRIM(p_name))
  AND s.class = p_class;
END;
$$;

-- Fix trigger: only count tuition payments towards total_paid
CREATE OR REPLACE FUNCTION update_student_total_paid()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'verified' AND COALESCE(NEW.payment_type, 'tuition') = 'tuition' THEN
      UPDATE students SET total_paid = total_paid + NEW.amount, updated_at = now() WHERE id = NEW.student_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'verified' AND NEW.status = 'verified' AND COALESCE(NEW.payment_type, 'tuition') = 'tuition' THEN
      UPDATE students SET total_paid = total_paid + NEW.amount, updated_at = now() WHERE id = NEW.student_id;
    ELSIF OLD.status = 'verified' AND NEW.status != 'verified' AND COALESCE(OLD.payment_type, 'tuition') = 'tuition' THEN
      UPDATE students SET total_paid = total_paid - OLD.amount, updated_at = now() WHERE id = OLD.student_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'verified' AND COALESCE(OLD.payment_type, 'tuition') = 'tuition' THEN
      UPDATE students SET total_paid = total_paid - OLD.amount, updated_at = now() WHERE id = OLD.student_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Recalculate total_paid for all students using only tuition payments
UPDATE students s
SET total_paid = (
  SELECT COALESCE(SUM(p.amount), 0)
  FROM payments p
  WHERE p.student_id = s.id
  AND p.status = 'verified'
  AND COALESCE(p.payment_type, 'tuition') = 'tuition'
);
