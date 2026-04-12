-- Remaining S.S.1BC Students Insertion Script
-- Run this in Supabase SQL Editor to add remaining S.S.1 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert S.S.1BC students (Day: 185,000, Boarding: 435,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('ADEGBENJO FIKUNAYOMI', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('AJIBADE MAHFUS', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('AJIBOYE MARVELLOUS', 'SS1B/C', 'boarding', 435000, 250000, 'outstanding', 0),
('ARIBISALA ESTHER', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('BABALOLA ATIOLOLA', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('DADA FAREEDAH', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('DADA RODIAH', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('DEHINDE ABEEBAH', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('DUROZWOJU HALIYAH', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('FAGBOHUN MAYOMIPOS', 'SS1B/C', 'boarding', 435000, 250000, 'outstanding', 0),
('IDIOGBE PELUMI', 'SS1B/C', 'boarding', 435000, 250000, 'outstanding', 0),
('KASALI TOLAWOLE', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('ODUFEJO EUNICE', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('OLADIMEJI LOYEEBAH', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('OLAOGUN MUHAMMED', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('OLATUNDUN ESTHER', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('OYALAWO HAMEEDAH', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('SALAWUDEEN ABDURRAHMAN', 'SS1B/C', 'boarding', 435000, 250000, 'outstanding', 0),
('TAIWO NAOMI', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('UGWUEZE SAMUEL', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0),
('ULUOCHA PRECIOUS', 'SS1B/C', 'day', 185000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
