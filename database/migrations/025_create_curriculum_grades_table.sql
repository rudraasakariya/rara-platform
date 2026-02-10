-- Migration: 025_create_curriculum_grades_table.sql
-- Description: Create curriculum_grades table (grade level per subject, e.g. K, 1, 2, ... 8, HS)

CREATE TABLE curriculum_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id, code)
);

-- Indexes
CREATE INDEX idx_curriculum_grades_service_id ON curriculum_grades(service_id);
CREATE INDEX idx_curriculum_grades_code ON curriculum_grades(code);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_curriculum_grades_updated_at BEFORE UPDATE ON curriculum_grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
