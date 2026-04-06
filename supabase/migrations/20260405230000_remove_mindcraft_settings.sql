-- Remove Mindcraft Week settings from fee_settings table
DELETE FROM fee_settings WHERE setting_key IN (
  'enable_mindcraft_fee',
  'mindcraft_fee_amount', 
  'mindcraft_fee_name',
  'total_terms_per_year',
  'current_term',
  'term_start_dates',
  'term_end_dates'
);

-- Remove mindcraft_fee column from fee_calculations table
ALTER TABLE fee_calculations DROP COLUMN IF EXISTS mindcraft_fee;
