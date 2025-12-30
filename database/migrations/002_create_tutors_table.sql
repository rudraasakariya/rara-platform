-- Migration: 002_create_tutors_table.sql
-- Description: Create tutors table (linked to users)

CREATE TABLE tutors (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    max_load INTEGER DEFAULT 10 CHECK (max_load > 0),
    hire_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_tutors_updated_at BEFORE UPDATE ON tutors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_tutors_status ON tutors(status);

