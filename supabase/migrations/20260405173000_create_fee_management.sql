-- Create fee management tables
-- 1. Class-specific tuition rates table
CREATE TABLE IF NOT EXISTS class_fee_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  day_student_fee numeric(12,2) NOT NULL,
  boarder_student_fee numeric(12,2),
  allows_boarding boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Global fee settings table
CREATE TABLE IF NOT EXISTS fee_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Update students table to include day/boarder status
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS student_status text DEFAULT 'day' CHECK (student_status IN ('day', 'boarder'));

-- 4. Add fee calculation tracking
CREATE TABLE IF NOT EXISTS fee_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  base_tuition numeric(12,2) NOT NULL,
  mindcraft_fee numeric(12,2) DEFAULT 0,
  hostel_fee numeric(12,2) DEFAULT 0,
  total_fees numeric(12,2) NOT NULL,
  calculation_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Insert class-specific fee rates
INSERT INTO class_fee_rates (class_name, display_name, day_student_fee, boarder_student_fee, allows_boarding) VALUES
('Toddler', 'Toddler', 58000.00, NULL, false),
('Pre-Sch', 'Pre-Sch', 63000.00, NULL, false),
('Nursery', 'Nursery', 68000.00, NULL, false),
('Pry 1', 'Pry 1', 68000.00, NULL, false),
('Pry 2', 'Pry 2', 73000.00, NULL, false),
('Pry 3', 'Pry 3', 79000.00, NULL, false),
('Pry 4', 'Pry 4', 90000.00, 340000.00, true),
('Pry 5', 'Pry 5', 135000.00, 385000.00, true),
('JS 1', 'JS 1', 165000.00, 415000.00, true),
('JS 2', 'JS 2', 165000.00, 415000.00, true),
('JS 3', 'JS 3', 165000.00, 415000.00, true),
('SS One', 'SS One', 185000.00, 435000.00, true),
('SS Two', 'SS Two', 180000.00, 430000.00, true);

-- Insert global fee settings
INSERT INTO fee_settings (setting_key, setting_value, description) VALUES
('global_hostel_fee', '250000.00', 'Global hostel fee for all boarding students'),
('mindcraft_week_fee', '5000.00', 'Mindcraft week fee for all students'),
('enable_auto_hostel_fee', 'true', 'Automatically add hostel fee to eligible boarders'),
('fee_currency', 'NGN', 'Currency used for fee calculations');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_fee_rates_class_name ON class_fee_rates(class_name);
CREATE INDEX IF NOT EXISTS idx_fee_settings_key ON fee_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_fee_calculations_student_id ON fee_calculations(student_id);
