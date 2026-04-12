-- S.S.1 Students Insertion Script
-- Run this in Supabase SQL Editor to add S.S.1 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert S.S.1 students (Day: 185,000, Boarding: 435,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Adeoye Olumide', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Adeshina Basit', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Adewuyi Praise', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('Ajibola Temitope', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Akanni Fatiah', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('Ariabede Ifeoluwa', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Awhangonu Emmanuel', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Babalola Samuel', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Badejo Grace', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Bello Tobiloba', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Bodunrinde Damilare', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Dada Fikumi', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Ekundayo Mubarak', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Famuyiwa Serah', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('Kosolu Deborah', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Odedina Hamdan', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Odubonajo Deborah', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Ogunsua Michelle', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('Okwudiri Blessing', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('Olabode Tomisin', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('Oladele El-olam', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Oladunjoye Victoria', 'SS1A1', 'boarding', 435000, 250000, 'outstanding', 0),
('Olaniyan Abdulmalik', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Olarewaju Jamal', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Olaogan Fisayo', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Opebi Priscilla', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Oseni A. Hancefa', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Owolabi Fuad', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Salami Marzoug', 'SS1A1', 'day', 185000, 0, 'outstanding', 0),
('Sosanya Anjola', 'SS1A1', 'day', 185000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
