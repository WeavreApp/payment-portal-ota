-- J.S.1B, J.S.1C, J.S.1D Students Insertion Script
-- Run this in Supabase SQL Editor to add remaining J.S.1 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert J.S.1B students (Day: 165,000, Boarding: 415,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Adeniyi Joel', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Alabi Openipo', 'JSS1B', 'boarding', 415000, 250000, 'outstanding', 0),
('Amolegbe Salam', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Amuziem Chiclubem', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Asombe Faruq', 'JSS1B', 'boarding', 415000, 250000, 'outstanding', 0),
('Bakare Hamidat', 'JSS1B', 'boarding', 415000, 250000, 'outstanding', 0),
('Bakinson Rihanat', 'JSS1B', 'boarding', 415000, 250000, 'outstanding', 0),
('Banjoko Ifejesu', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Bamisile Dicleola', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Emeka Kamsi', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Femi John', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Ilori Esther', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Jayeoba Jeffery', 'JSS1B', 'boarding', 415000, 250000, 'outstanding', 0),
('Kasali Kofoworola', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Muhammed Mordiyah', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Ogbezode Mataniah', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Ogundairo Fareedlah', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Okhue Ibhade', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Okunowo Christianah', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Olushola AL-ameen', 'JSS1B', 'boarding', 415000, 250000, 'outstanding', 0),
('Rasheed Ameerah', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Rufai Azeem', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Shasanmi Gideon', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),
('Shogbola Damilola', 'JSS1B', 'day', 165000, 0, 'outstanding', 0),

-- J.S.1C students
('Adeniran Oluwafikayomi', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Aderibigbe Darasimi', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Adisa Aishat', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Ajibola Al-ameen', 'JSS1C', 'boarding', 415000, 250000, 'outstanding', 0),
('Arigbede Sharon', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Atitebi', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Badmus Faheem', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Edoro Davina', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Hamzat Rihannat', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Kelani Lateef', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Kolawole Daniel', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Majoyeogbe Awwal', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Misbaudeen Maryam', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Mushafau Basheer', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Ogundare Moyinoluwa', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Okunsaga Olamilekan', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Olarenwajn Nasif', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Olanrewaju Oreoluwa', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Oretuga Modupe', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Rufai Anjorin', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Salami Rahma', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),
('Sheriffden Azimah', 'JSS1C', 'day', 165000, 0, 'outstanding', 0),

-- J.S.1D students
('Abdulsalam Al-ameen', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Adewusi Muiz', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Ajayi Femi', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Amusan Olamide', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Ayorinde Abdulmalik', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Hassan Ilyad', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Jimoh Jamal', 'JSS1D', 'boarding', 415000, 250000, 'outstanding', 0),
('Lawal Daniel', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Lawal Samuel', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Oluwatayo May', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Oseni Ibrahim', 'JSS1D', 'boarding', 415000, 250000, 'outstanding', 0),
('Peter Chisom', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Rita Chisom', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Sulaiman Abdullah', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Tijani Zeenah', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Moshood Ibrahim', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Oladele Elnas', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Oyebade Oluwademilade', 'JSS1D', 'boarding', 415000, 250000, 'outstanding', 0),
('Tijani Aamir', 'JSS1D', 'day', 165000, 0, 'outstanding', 0),
('Ezenwanne Chibife', 'JSS1D', 'boarding', 415000, 250000, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
