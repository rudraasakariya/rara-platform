-- Migration: 013_create_student_tutor_assignments_table.sql
-- Description: Create student_tutor_assignments table (direct tutor assignments)

CREATE TABLE student_tutor_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutors(user_id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    is_primary BOOLEAN DEFAULT false,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_student_tutor_assignments_student_id ON student_tutor_assignments(student_id);
CREATE INDEX idx_student_tutor_assignments_tutor_id ON student_tutor_assignments(tutor_id);
CREATE INDEX idx_student_tutor_assignments_status ON student_tutor_assignments(status);
CREATE INDEX idx_student_tutor_assignments_active ON student_tutor_assignments(student_id, status) WHERE status = 'active';

-- Unique constraint: Only one primary tutor per active student
CREATE UNIQUE INDEX idx_one_primary_tutor 
ON student_tutor_assignments(student_id) 
WHERE status = 'active' AND is_primary = true;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_student_tutor_assignments_updated_at BEFORE UPDATE ON student_tutor_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

