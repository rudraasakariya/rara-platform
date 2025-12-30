-- Migration: 010_create_session_students_table.sql
-- Description: Create session_students junction table (many students per session)

CREATE TABLE session_students (
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    attendance_status VARCHAR(50) DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'excused', 'late')),
    minutes_attended INTEGER CHECK (minutes_attended >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, student_id)
);

-- Indexes
CREATE INDEX idx_session_students_student_id ON session_students(student_id);
CREATE INDEX idx_session_students_session_id ON session_students(session_id);
CREATE INDEX idx_session_students_attendance ON session_students(attendance_status);

-- Note: Constraint for "one active session per student at a time" will be enforced at application level
-- This is because we need to check session status and date, which is complex for a database constraint

