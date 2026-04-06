-- Update class fee rates with correct class names matching CLASS_LIST
-- This migration updates the class_fee_rates table to use the actual class names from the system

-- Clear existing data
DELETE FROM class_fee_rates;

-- Insert class-specific fee rates with correct class names
INSERT INTO class_fee_rates (class_name, display_name, day_student_fee, boarder_student_fee, allows_boarding) VALUES
-- Early Years - No boarding allowed
('Toddler', 'Toddler', 58000.00, NULL, false),
('Pre-Schooler', 'Pre-Schooler', 63000.00, NULL, false),
('Nursery', 'Nursery', 68000.00, NULL, false),

-- Primary Classes - Pry 1A to Pry 3B no boarding, Pry 4A+ allows boarding
('Pry 1A', 'Pry 1A', 68000.00, NULL, false),
('Pry 1B', 'Pry 1B', 68000.00, NULL, false),
('Pry 2A', 'Pry 2A', 73000.00, NULL, false),
('Pry 2B', 'Pry 2B', 73000.00, NULL, false),
('Pry 3A', 'Pry 3A', 79000.00, NULL, false),
('Pry 3B', 'Pry 3B', 79000.00, NULL, false),
('Pry 4A', 'Pry 4A', 90000.00, 340000.00, true),
('Pry 4B', 'Pry 4B', 90000.00, 340000.00, true),
('Pry 5A', 'Pry 5A', 135000.00, 385000.00, true),
('Pry 5B', 'Pry 5B', 135000.00, 385000.00, true),

-- Junior Secondary - All allow boarding
('JSS1A', 'JSS1A', 165000.00, 415000.00, true),
('JSS1B', 'JSS1B', 165000.00, 415000.00, true),
('JSS1C', 'JSS1C', 165000.00, 415000.00, true),
('JSS1D', 'JSS1D', 165000.00, 415000.00, true),
('JSS2A', 'JSS2A', 165000.00, 415000.00, true),
('JSS2B', 'JSS2B', 165000.00, 415000.00, true),
('JSS2C', 'JSS2C', 165000.00, 415000.00, true),
('JSS2D', 'JSS2D', 165000.00, 415000.00, true),
('JSS3A', 'JSS3A', 165000.00, 415000.00, true),
('JSS3B', 'JSS3B', 165000.00, 415000.00, true),
('JSS3C', 'JSS3C', 165000.00, 415000.00, true),

-- Senior Secondary - All allow boarding
('SS1A1', 'SS1A1', 185000.00, 435000.00, true),
('SS1A2', 'SS1A2', 185000.00, 435000.00, true),
('SS1A3', 'SS1A3', 185000.00, 435000.00, true),
('SS1A4', 'SS1A4', 185000.00, 435000.00, true),
('SS1B/C', 'SS1B/C', 185000.00, 435000.00, true),
('SS2A1', 'SS2A1', 180000.00, 430000.00, true),
('SS2A2', 'SS2A2', 180000.00, 430000.00, true),
('SS2A3', 'SS2A3', 180000.00, 430000.00, true),
('SS2A4', 'SS2A4', 180000.00, 430000.00, true),
('SS2B/C', 'SS2B/C', 180000.00, 430000.00, true),
('SS3A1', 'SS3A1', 180000.00, 430000.00, true),
('SS3A2', 'SS3A2', 180000.00, 430000.00, true),
('SS3B/C', 'SS3B/C', 180000.00, 430000.00, true);
