-- Create new class structure with main classes and subclasses
-- Drop old tables if they exist (be careful with production data)
-- DROP TABLE IF EXISTS students CASCADE;
-- DROP TABLE IF EXISTS classes CASCADE;

-- Create classes table with main class and subclass structure
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  main_class TEXT NOT NULL CHECK (main_class IN ('SS1', 'SS2', 'SS3', 'Early Years')),
  subclass TEXT NOT NULL,
  display_name TEXT NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add check constraints based on main class
  CONSTRAINT check_ss1_subclass CHECK (main_class != 'SS1' OR subclass IN ('A', 'B', 'C', 'D')),
  CONSTRAINT check_ss2_ss3_subclass CHECK (main_class NOT IN ('SS2', 'SS3') OR subclass IN ('A', 'B', 'C')),
  CONSTRAINT check_early_years_subclass CHECK (main_class != 'Early Years' OR subclass IN ('Nursery', 'Toddler', 'Pre-Schooler', 'Pry 1A', 'Pry 1B', 'Pry 2A', 'Pry 2B', 'Pry 3A', 'Pry 3B', 'Pry 4A', 'Pry 4B', 'Pry 5A', 'Pry 5B'))
);

-- Create unique constraint for main_class + subclass combination
ALTER TABLE classes ADD CONSTRAINT unique_class_subclass UNIQUE (main_class, subclass);

-- Update students table to reference new class structure
ALTER TABLE students ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_main_class ON classes(main_class);
CREATE INDEX IF NOT EXISTS idx_classes_subclass ON classes(subclass);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view classes
CREATE POLICY "Authenticated users can view classes" ON classes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only superadmins can insert/update/delete classes
CREATE POLICY "Superadmins can manage classes" ON classes
  FOR ALL USING (is_superadmin());

-- Insert default classes based on your requirements
INSERT INTO classes (main_class, subclass, display_name, fee_amount) VALUES
-- SS1 Classes (with subsections A, B, C, D)
('SS1', 'A', 'JSS 1A', 0.00),
('SS1', 'B', 'JSS 1B', 0.00),
('SS1', 'C', 'JSS 1C', 0.00),
('SS1', 'D', 'JSS 1D', 0.00),

-- SS2 Classes (with subsections A, B, C)
('SS2', 'A', 'JSS 2A', 0.00),
('SS2', 'B', 'JSS 2B', 0.00),
('SS2', 'C', 'JSS 2C', 0.00),

-- SS3 Classes (with subsections A, B, C)
('SS3', 'A', 'JSS 3A', 0.00),
('SS3', 'B', 'JSS 3B', 0.00),
('SS3', 'C', 'JSS 3C', 0.00),

-- Early Years Classes
('Early Years', 'Nursery', 'Nursery', 0.00),
('Early Years', 'Toddler', 'Toddler', 0.00),
('Early Years', 'Pre-Schooler', 'Pre-Schooler', 0.00),
('Early Years', 'Pry 1A', 'Pry 1A', 0.00),
('Early Years', 'Pry 1B', 'Pry 1B', 0.00),
('Early Years', 'Pry 2A', 'Pry 2A', 0.00),
('Early Years', 'Pry 2B', 'Pry 2B', 0.00),
('Early Years', 'Pry 3A', 'Pry 3A', 0.00),
('Early Years', 'Pry 3B', 'Pry 3B', 0.00),
('Early Years', 'Pry 4A', 'Pry 4A', 0.00),
('Early Years', 'Pry 4B', 'Pry 4B', 0.00),
('Early Years', 'Pry 5A', 'Pry 5A', 0.00),
('Early Years', 'Pry 5B', 'Pry 5B', 0.00)

ON CONFLICT (main_class, subclass) DO NOTHING;
