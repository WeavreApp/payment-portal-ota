-- Update class names to match CLASS_LIST format (remove dots and fix casing)
SET session_replication_role = 'origin';

-- Junior Secondary: J.S.1A -> JSS1A, etc.
UPDATE students SET class = 'JSS1A' WHERE class = 'J.S.1A';
UPDATE students SET class = 'JSS1B' WHERE class = 'J.S.1B';
UPDATE students SET class = 'JSS1C' WHERE class = 'J.S.1C';
UPDATE students SET class = 'JSS1D' WHERE class = 'J.S.1D';
UPDATE students SET class = 'JSS2A' WHERE class = 'J.S.2A';
UPDATE students SET class = 'JSS2B' WHERE class = 'J.S.2B';
UPDATE students SET class = 'JSS2C' WHERE class = 'J.S.2C';
UPDATE students SET class = 'JSS2D' WHERE class = 'J.S.2D';
UPDATE students SET class = 'JSS3A' WHERE class = 'J.S.3A';
UPDATE students SET class = 'JSS3B' WHERE class = 'J.S.3B';
UPDATE students SET class = 'JSS3C' WHERE class = 'J.S.3C';
UPDATE students SET class = 'JSS3D' WHERE class = 'J.S.3D';

-- Senior Secondary: S.S.1A1 -> SS1A1, etc.
UPDATE students SET class = 'SS1A1' WHERE class = 'S.S.1A1';
UPDATE students SET class = 'SS1A2' WHERE class = 'S.S.1A2';
UPDATE students SET class = 'SS1A3' WHERE class = 'S.S.1A3';
UPDATE students SET class = 'SS1A4' WHERE class = 'S.S.1A4';
UPDATE students SET class = 'SS1B/C' WHERE class = 'S.S.1BC';
UPDATE students SET class = 'SS2A1' WHERE class = 'S.S.2A1';
UPDATE students SET class = 'SS2A2' WHERE class = 'S.S.2A2';
UPDATE students SET class = 'SS2A3' WHERE class = 'S.S.2A3';
UPDATE students SET class = 'SS2A4' WHERE class = 'S.S.2A4';
UPDATE students SET class = 'SS2B/C' WHERE class = 'S.S.2BC';
UPDATE students SET class = 'SS3A1' WHERE class = 'S.S.3A';
UPDATE students SET class = 'SS3A2' WHERE class = 'S.S.3A2';
UPDATE students SET class = 'SS3B/C' WHERE class = 'S.S.3BC';

-- Primary: PRY 1A -> Pry 1A, etc.
UPDATE students SET class = 'Pry 1A' WHERE class = 'PRY 1A';
UPDATE students SET class = 'Pry 1B' WHERE class = 'PRY 1B';
UPDATE students SET class = 'Pry 2A' WHERE class = 'PRY 2A';
UPDATE students SET class = 'Pry 2B' WHERE class = 'PRY 2B';
UPDATE students SET class = 'Pry 3A' WHERE class = 'PRY 3A';
UPDATE students SET class = 'Pry 3B' WHERE class = 'PRY 3B';
UPDATE students SET class = 'Pry 4A' WHERE class = 'PRY 4A';
UPDATE students SET class = 'Pry 5A' WHERE class = 'PRY 5A';
UPDATE students SET class = 'Pry 5B' WHERE class = 'PRY 5B';

-- Pre-School: Pre-School -> Pre-Schooler
UPDATE students SET class = 'Pre-Schooler' WHERE class = 'Pre-School';

RESET session_replication_role;
