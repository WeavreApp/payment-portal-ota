-- Add Mindcraft Week and Term configuration settings
INSERT INTO fee_settings (setting_key, setting_value, description) VALUES
('enable_mindcraft_fee', 'true', 'Enable/disable Mindcraft Week fee'),
('mindcraft_fee_amount', '5000.00', 'Amount for Mindcraft Week fee'),
('mindcraft_fee_name', 'Mindcraft Week', 'Display name for Mindcraft Week fee'),
('total_terms_per_year', '3', 'Total number of terms per academic year'),
('current_term', '1', 'Current academic term (1, 2, or 3)'),
('term_start_dates', '2026-01-01,2026-05-01,2026-09-01', 'Start dates for each term (comma-separated)'),
('term_end_dates', '2026-03-01,2026-07-01,2026-11-01', 'End dates for each term (comma-separated)');
