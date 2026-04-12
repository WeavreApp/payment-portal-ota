-- J.S.2 Students Insertion Script
-- Run this in Supabase SQL Editor to add J.S.2 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert J.S.2 students (Day: 165,000, Boarding: 415,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Abdurrauf Abdussalam', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Adebiyi Zainab', 'JSS2A', 'boarding', 415000, 250000, 'outstanding', 0),
('Adewole Tahirah', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Adewole Tiwatope', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Adeyemo Anuoluwatofunmi', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Ajbode Nasirudeen', 'JSS2A', 'boarding', 415000, 250000, 'outstanding', 0),
('Akintola Hassan', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Aremu Azeemah', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Aremu Azeezah D.', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Asimi Mubarak', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Atiba Treasure', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Atoyebi Ramlah', 'JSS2A', 'boarding', 415000, 250000, 'outstanding', 0),
('Awojide Oluwasomi', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Ayanfunso Oluwajuwonlo', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Azeez Abdulmalik', 'JSS2A', 'boarding', 415000, 250000, 'outstanding', 0),
('Babawale Ifeoluwa', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Bamidele Oluwagbernisob', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Haruna Fawaz', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Jones-Abayomi Fikayomi', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Kareem Aasiyah', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('King Khadeejah', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Lateef Abdul Malik', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Lawal Emmanuella', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Odunsanya AbdulAzeem', 'JSS2A', 'boarding', 415000, 250000, 'outstanding', 0),
('Bankole Faizah', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Olagunju Surprise', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Owoseni Ololade', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('oyebowale Jitilope', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Oyedeji Mariam', 'JSS2A', 'boarding', 415000, 250000, 'outstanding', 0),
('Oyelaja Ahmad', 'JSS2A', 'boarding', 415000, 250000, 'outstanding', 0),
('Roland Samantha', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Salawu Habeed', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Sanni Faizah', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Shobo David', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Shobogun Olasubomi', 'JSS2A', 'day', 165000, 0, 'outstanding', 0),
('Yusuf Roqeebah', 'JSS2A', 'day', 165000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
