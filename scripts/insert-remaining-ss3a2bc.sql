-- Remaining S.S.3A2, S.S.3BC Students Insertion Script
-- Run this in Supabase SQL Editor to add remaining S.S.3 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert S.S.3A2 students (Day: 180,000, Boarding: 430,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('ABDULWALIY AMANATULLAH', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('ADEBARI- ENIOLA', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('ADEKOYA FAREEDAH', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('ADEYINKA RODHYA', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('AFOLABI FATIMAH', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('AGORO HUSSEIN', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('AKINSOLA MUKTHAR', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('ALABI IREMIDE', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('ALEGBELEYE JEREMIAH', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('AYEGBOKA AYOMIDE', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('BALOGUN FIRDAOUS', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('BEKE AYOMIDE', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('ENIOLA ANAT', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('FASINA SOBUR', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('HAMZAT FATHIA', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('ILEOGBEN STEPHANIE', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('JUNAID MUHAMMAD', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('KASSIM FAWAZ', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('KOLADE VICTORIA', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('MOSHOOD ABDULQUADRI', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('MUSTAPHA ABULLABEEF', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('ODENIYI KOLAWOLE', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('OGUNIONBI EVERGREAT', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('OGUNJOBI MASTURAH', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('OLUWAFEMI VICTORIA', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('ONWUBIKO CLARA', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('OPEBIYI SUCCESS', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('SALAKO SOLIHAT', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('SANGOBIYI TOLANI', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('SERIKI GANIYAT', 'SS3A2', 'day', 180000, 0, 'outstanding', 0),
('SOLIU WASILAT', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),
('WILLIAMS OLAMILEKAN', 'SS3A2', 'boarding', 430000, 250000, 'outstanding', 0),

-- S.S.3BC students
('ABANIKANDA FAREED', 'SS3B/C', 'boarding', 430000, 250000, 'outstanding', 0),
('ADEDOKUN FISAYO', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('AINA SULAIMAN', 'SS3B/C', 'boarding', 430000, 250000, 'outstanding', 0),
('AKINDELE ITUNU', 'SS3B/C', 'boarding', 430000, 250000, 'outstanding', 0),
('ANIMASHAUN AMEERAT', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('AKINYOKUN BOLATITO', 'SS3B/C', 'boarding', 430000, 250000, 'outstanding', 0),
('AYANBOADE WIDAAD', 'SS3B/C', 'boarding', 430000, 250000, 'outstanding', 0),
('BALOGUN YESEERAH', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('EGUNFEMI DEBORAH', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('FAWOLE AISHA', 'SS3B/C', 'boarding', 430000, 250000, 'outstanding', 0),
('HASSAN ABIOLA', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('LATEEF IKIMOT', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('MORONKOLA AYOMIPOSI', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('MUSHAFAU MUSTAPHA', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('ODUNSI EMMANUEL', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('OLADAPO COKER', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('ORIJA BUSOLAMI', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('OYEBOWALE DAVID', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('RABIU OLUUMANIFEMI', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('SHOJI FEYITAYOMI', 'SS3B/C', 'day', 180000, 0, 'outstanding', 0),
('SHORUNKE SUMMAYAH', 'SS3B/C', 'boarding', 430000, 250000, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
