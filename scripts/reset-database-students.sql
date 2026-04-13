-- Delete all students and re-insert only the 956 from the provided list
SET session_replication_role = 'origin';

-- Delete all students
DELETE FROM students;

-- Reset the sequence
ALTER SEQUENCE students_id_seq RESTART WITH 1;

RESET session_replication_role;
