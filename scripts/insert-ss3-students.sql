-- S.S.3 Students Insertion Script
-- Run this in Supabase SQL Editor to add S.S.3 students

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert S.S.3 students (Day: 180,000, Boarding: 430,000)
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Abdul salam Aneesah', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Abdulazeez Abdulraheem', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Abdullateef Faridah', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Adeniran Mayowa', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Adewole Firdans', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Adeyeye Peace', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Ajibade Mujeedat', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Ajibike Fatimah', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Akinleye Success', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Akinpelu Feyisolaolen', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Atojebi Aisha', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Babalola Mumtaz', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Balogun Abdulrahman', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Bello Oluwatomilole', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Biriowo Raodat', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Fasosin Aderolakem', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Fasugba Rayhan', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Hassan Rabin', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Lawal AbdulFatai', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Muse Abdulmalik', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Mustapha-Olumowe Iman', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Odedele Oluwadarasimi', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Ogunfowora Aishat', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Oguntowora Ahmad', 'SS3A1', 'boarding', 430000, 250000, 'outstanding', 0),
('Olaiya Oluwademilade', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Olaogun Muiz', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Osom Daniel', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Shobogun Fadihullah', 'SS3A1', 'day', 180000, 0, 'outstanding', 0),
('Temidayo Ayomide', 'SS3A1', 'day', 180000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;
