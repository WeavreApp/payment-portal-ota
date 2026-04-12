-- S.S.2 Students Insertion Script
-- Run this in Supabase SQL Editor to add S.S.2 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert S.S.2 students (Day: 1,800,000, Boarding: 2,050,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Abiodun Fareed', 'SS2A1', 'boarding', 2050000, 250000, 'outstanding', 0),
('Adekoya Hafeezah', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Adeniyi Oluwamuyiwa Ann', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Airjola Fawway', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Ajayi David', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Akinde Amenah', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Akinyoade Olyatofunmi', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Alabi Oreofe', 'SS2A1', 'boarding', 2050000, 250000, 'outstanding', 0),
('Badmus Faozan', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Banjoko Eniola', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Barewy Oluwalage', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Bolaji Amotus-Salam', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Efundowo Living-Source', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Esin Nafeesah', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Fakorede Mercy', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Femi Joseph', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Jimoh Abdullah', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('King Khalidah', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Kudeti Miftaudeen', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Lawal Fatia', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Obadimu Teslim', 'SS2A1', 'boarding', 2050000, 250000, 'outstanding', 0),
('Obianwu Chinelo', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Ogunminde Mateenah', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Okoli Miracle', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Onike- Azeez Abdul-Azeez', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Oseni Taiwo', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Salau Aisha', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Salaudeen Nafeesah', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Sanni Fuad', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0),
('Shasanmi Marvellous Olaseni', 'SS2A1', 'day', 1800000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
