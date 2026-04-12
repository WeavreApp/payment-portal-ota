-- Remaining S.S.2BC Students Insertion Script
-- Run this in Supabase SQL Editor to add remaining S.S.2 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert S.S.2BC students (Day: 1,800,000, Boarding: 2,050,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('AASA PRISCILLA', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('ADEYEMO FIRDOUS', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('AINA AL-MUBARAK', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('AJIBADE MAHFUS', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('ALAGBO FARIDAH', 'SS2B/C', 'boarding', 2050000, 250000, 'outstanding', 0),
('ASANI ABDULRAZAQ', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('BABASANYA ISLAMIYA', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('DAUDU BASIT', 'SS2B/C', 'boarding', 2050000, 250000, 'outstanding', 0),
('ENIKE CHIDIEBERE', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('KOLADE COMFORT', 'SS2B/C', 'boarding', 2050000, 250000, 'outstanding', 0),
('MUSTAPHA LOTEFHO', 'SS2B/C', 'boarding', 2050000, 250000, 'outstanding', 0),
('OLOYEDE DARASIMI', 'SS2B/C', 'boarding', 2050000, 250000, 'outstanding', 0),
('OPEBI MESHACH', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('OPERE OLIVIA', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('RAJI FAHEEMAT', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0),
('SHERIF SOBIHA', 'SS2B/C', 'day', 1800000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
