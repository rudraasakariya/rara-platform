-- Migration: 031_add_case_status_to_students.sql
-- Description: Add case_status to students for support workflow tracking

ALTER TABLE students
ADD COLUMN case_status VARCHAR(50) NOT NULL DEFAULT 'active'
CHECK (case_status IN ('active', 'resolved', 'needsAD', 'support'));

CREATE INDEX idx_students_case_status ON students(case_status);
