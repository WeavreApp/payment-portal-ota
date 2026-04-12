-- J.S.3B, J.S.3C, J.S.3D Students Insertion Script
-- Run this in Supabase SQL Editor to add remaining J.S.3 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert J.S.3B students (Day: 165,000, Boarding: 415,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Adedeji Emmanuel', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Adeniji Fathia', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Adeniyi Akbar', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Adewunmi Mark', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Ajanaku Akorede', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Ajao Hameema', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Akniboyede Bolutife', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Aribisala Ayomide', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Awe Morenikeji', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Bello Mariam', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Fadare Muthmaeen', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Kelani Fareedah', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Kolawole Oyinkansola', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Lasisi Aishat', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Lawal Haleemah', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Mohadded Animat', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Obianwu Nkiruka', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Okedenyi Grace', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Oladeinde Fareedah', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Olajuwon Genius', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Peters Nkechiamaka', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Peters Uzchi', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),
('Sowunmi Emmanel', 'JSS3B', 'day', 165000, 0, 'outstanding', 0),

-- J.S.3C students
('Adedeji Emmanuel', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Adeniji Fathia', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Adeniyi Akbar', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Adewunmi Mark', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Ajanaku Akorede', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Ajao Hameema', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Akniboyede Bolutife', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Aribisala Ayomide', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Awe Morenikeji', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Bello Mariam', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Fadare Muthmaeen', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Kelani Fareedah', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Kolawole Oyinkansola', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Lasisi Aishat', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Lawal Haleemah', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Mohadded Animat', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Obianwu Nkiruka', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Okedenyi Grace', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Oladeinde Fareedah', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Olajuwon Genius', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Peters Nkechiamaka', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Peters Uzchi', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),
('Sowunmi Emmanel', 'JSS3C', 'day', 165000, 0, 'outstanding', 0),

-- J.S.3D students
('Adedeji Emmanuel', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Adeniji Fathia', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Adeniyi Akbar', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Adewunmi Mark', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Ajanaku Akorede', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Ajao Hameema', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Akniboyede Bolutife', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Aribisala Ayomide', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Awe Morenikeji', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Bello Mariam', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Fadare Muthmaeen', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Kelani Fareedah', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Kolawole Oyinkansola', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Lasisi Aishat', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Lawal Haleemah', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Mohadded Animat', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Obianwu Nkiruka', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Okedenyi Grace', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Oladeinde Fareedah', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Olajuwon Genius', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Peters Nkechiamaka', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Peters Uzchi', 'JSS3D', 'day', 165000, 0, 'outstanding', 0),
('Sowunmi Emmanel', 'JSS3D', 'day', 165000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
