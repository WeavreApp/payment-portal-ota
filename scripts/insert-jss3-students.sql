-- J.S.3 Students Insertion Script
-- Run this in Supabase SQL Editor to add J.S.3 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert J.S.3 students (Day: 165,000, Boarding: 415,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Abimbola Oluwadarasimi', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Abiodun Mishael', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Abu Al-Islam', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Adeniji Fatimah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Adeyemo Faruq', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Aina Morzuqah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Ajibade Aishat', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Ajijola Faaiz', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Akindele Feyikemi', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Akinjobi fareedah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Akintunde Hibatullah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Akinyokun adebola', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Ayanda Deborah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Azeez Abdulbasit', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Baiyewu Oyinkansola', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Egunfemi Dorcas', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Esin Ahamd', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Fagbuyiro Zion', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Fatai Abdulsamal', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Jinadu Precious', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Lafeef Smith', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Lawal Kazeem', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Lawal keefayah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Misbaudeen Summayyah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Ogunfunwa Eniola', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Ojelade gbemisola', 'JSS3A', 'boarding', 415000, 250000, 'outstanding', 0),
('Oladapo Abdulkhatiq', 'JSS3A', 'boarding', 415000, 250000, 'outstanding', 0),
('Olaniyi David', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Oluwatayo Matilda', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Omogo Chidinma', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Onwubiko Frances', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Oyinlola Rahmatallah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Sulaimon abdulrahmon', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Yedenu Deborah', 'JSS3A', 'day', 165000, 0, 'outstanding', 0),
('Yusuf Fawaz', 'JSS3A', 'day', 165000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
