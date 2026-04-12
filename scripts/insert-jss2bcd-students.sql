-- J.S.2B, J.S.2C, J.S.2D Students Insertion Script
-- Run this in Supabase SQL Editor to add remaining J.S.2 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert J.S.2B students (Day: 165,000, Boarding: 415,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Abdullahi Rofiah', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Abdulmalik Aisha', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Abdulsalam Basit', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Abdulsalam Mutmainah', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Abdulwasiu Abdulrahman', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Abubakar Hafeezat', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Abubakar Hafsat', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Adeniyi Abdulmalik', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Adeyanju Habeeb', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Afolabi Mariam', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Afolayan Faruq', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Ahmad Abdulmalik', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Ajadi Aishat', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Ajibola Faruq', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Ajibola Habeeb', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akande Taofeeq', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akanni Abdulmalik', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinde Aishat', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akindele Oluwadarasimi', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinlabi Faruq', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinlabi Khadijah', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinlabi Maryam', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinlabi Muhammed', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinlabi Saheed', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinlabi Taofeek', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinlabi Zainab', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintade Rofiat', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintola Abdulgafar', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintola Abdulmalik', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintola Khadijah', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintunde Abdulmalik', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintunde Habeeb', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Abdulwahab', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Aishat', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Abdulazeez', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Lukman', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Muinat', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Taofeek', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Zainab', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintomide Abdulmalik', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),
('Akintomide Muhammed', 'JSS2B', 'day', 165000, 0, 'outstanding', 0),

-- J.S.2C students
('Adewale Taofeek', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Afolayan Muhammed', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Afolayan Abdulgafar', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akinfenwa Habeeb', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akinfenwa Taofeek', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akintunde Abdulgafar', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akintunde Taofeek', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Aishat', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Abdulwahab', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Muinat', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Taofeek', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Zainab', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akintomide Abdulmalik', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),
('Akintomide Muhammed', 'JSS2C', 'day', 165000, 0, 'outstanding', 0),

-- J.S.2D students
('Adewale Taofeek', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Afolayan Muhammed', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Afolayan Abdulgafar', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akinfenwa Habeeb', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akinfenwa Taofeek', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akintunde Abdulgafar', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akintunde Taofeek', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Aishat', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Abdulwahab', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Muinat', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Taofeek', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akinyemi Zainab', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akintomide Abdulmalik', 'JSS2D', 'day', 165000, 0, 'outstanding', 0),
('Akintomide Muhammed', 'JSS2D', 'day', 165000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
