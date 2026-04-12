-- Simple test insert to verify database connectivity
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily for insert
SET session_replication_role = 'origin';

-- Insert one test student
INSERT INTO students (full_name, class, student_type, total_fees, hostel_fee, payment_status, balance_paid) VALUES
('Test Student', 'TEST', 'day', 1000, 0, 'outstanding', 0);

-- Reset session role
RESET session_replication_role;

-- Check if student was inserted
SELECT COUNT(*) as total_students FROM students;
