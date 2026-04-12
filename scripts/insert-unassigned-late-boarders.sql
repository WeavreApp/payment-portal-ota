-- Unassigned / Late Registration Boarders Insertion Script
-- Run this in Supabase SQL Editor to add remaining unassigned/late boarders

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert Unassigned / Late Registration Boarders (various classes)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
-- J.S.1 Unassigned/Late Boarders
('EZENWANNE DAVID', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('SUBAIR BARAKAT', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('ABDULDAYAN AISHA', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),

-- J.S.2 Unassigned/Late Boarders
('OYEKOLA FARIDAH', 'SS2A1', 'boarding', 2050000, 250000, 'outstanding', 0),
('WILLIAMS SEMILOR', 'SS2A1', 'boarding', 2050000, 250000, 'outstanding', 0),

-- J.S.3 Unassigned/Late Boarders
('AGUNBIADE MUAZ MOROPA', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('ABDULDAYAN HARUNA ABDULDAYAN', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('LAWAL RAMADAN', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('OGUNDEYI ROFIAT', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('AKINLEYE SHASHAENIYAN', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
