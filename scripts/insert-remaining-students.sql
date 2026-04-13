-- Insert remaining 12 missing students
SET session_replication_role = 'origin';

INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Shomoye AbdulSalam', 'Toddler', 'day', 1800000, 0, 'outstanding', 0),
('Bello Abdulraheem', 'Toddler', 'day', 1800000, 0, 'outstanding', 0),
('Ajibola Al-ameen', 'J.S.1C', 'boarding', 2050000, 250000, 'outstanding', 0),
('Arigbede Sharon', 'J.S.1C', 'day', 1800000, 0, 'outstanding', 0),
('Atitebi', 'J.S.1C', 'day', 1800000, 0, 'outstanding', 0),
('Hamzat Rihannat', 'J.S.1C', 'day', 1800000, 0, 'outstanding', 0),
('Kelani Lateef', 'J.S.1C', 'day', 1800000, 0, 'outstanding', 0),
('Ogundare Moyinoluwa', 'J.S.1C', 'day', 1800000, 0, 'outstanding', 0),
('Salami Rahma', 'J.S.1C', 'day', 1800000, 0, 'outstanding', 0),
('Adewusi Muiz', 'J.S.1D', 'day', 1800000, 0, 'outstanding', 0),
('Ajayi Femi', 'J.S.1D', 'day', 1800000, 0, 'outstanding', 0),
('Bankole (Balkis)', 'S.S.2A4', 'day', 1800000, 0, 'outstanding', 0);

RESET session_replication_role;
