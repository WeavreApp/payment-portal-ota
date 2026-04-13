-- Fix students with discrepancies
-- 1. SOWUNMI EMMANUEL: Change from JSS3B to J.S.3D
UPDATE students 
SET class = 'J.S.3D' 
WHERE full_name = 'SOWUNMI EMMANUEL' AND class = 'JSS3B';

-- 2. ADEMO GOLD: Change name to Ademola Gold (already correct class and status)
UPDATE students 
SET full_name = 'Ademola Gold' 
WHERE full_name = 'ADEMO GOLD' AND class = 'JSS3B';

-- 3. AMUSA ABDULSALAM: Change name to Amusa Abdulsamad
UPDATE students 
SET full_name = 'Amusa Abdulsamad' 
WHERE full_name = 'AMUSA ABDULSALAM' AND class = 'JSS3B';

-- Remove students NOT in the list (22 students)
DELETE FROM students WHERE full_name = 'FAWOLA AYOMIDE' AND class = 'JSS3B';

DELETE FROM students WHERE full_name = 'Akintomide Abdulmalik' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinlabi Taofeek' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Adeyanju Habeeb' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinlabi Zainab' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akanni Abdulmalik' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akintomide Muhammed' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Abdullahi Rofiah' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Abubakar Hafeezat' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinyemi Muinat' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akintola Khadijah' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Ajibola Habeeb' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akintunde Abdulmalik' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinlabi Khadijah' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinlabi Faruq' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akintola Abdulgafar' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinyemi Aishat' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinyemi Taofeek' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinlabi Maryam' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akindele Oluwadarasimi' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinlabi Muhammed' AND class = 'JSS2B';
DELETE FROM students WHERE full_name = 'Akinyemi Lukman' AND class = 'JSS2B';
