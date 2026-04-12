-- Add SS3-specific hostel fee setting
-- Run this in Supabase SQL Editor

-- Insert SS3 hostel fee setting if it doesn't exist
INSERT INTO fee_settings (setting_key, setting_value, description)
VALUES 
  ('ss3_hostel_fee', '750000', 'Hostel fee specifically for SS3 students')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = '750000',
  description = 'Hostel fee specifically for SS3 students';

-- Verify the setting was created
SELECT 
  'SS3 HOSTEL FEE SETTING' as status,
  setting_key,
  setting_value,
  description
FROM fee_settings 
WHERE setting_key = 'ss3_hostel_fee';
