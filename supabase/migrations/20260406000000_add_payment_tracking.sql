-- Add payment tracking columns to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'outstanding' CHECK (payment_status IN ('outstanding', 'partial', 'paid')),
ADD COLUMN IF NOT EXISTS balance_paid NUMERIC(12,2) DEFAULT 0;
