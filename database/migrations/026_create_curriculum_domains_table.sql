-- Migration: 026_create_curriculum_domains_table.sql
-- Description: Create curriculum_domains table (domain per grade, e.g. OA, NBT)

CREATE TABLE curriculum_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_id UUID NOT NULL REFERENCES curriculum_grades(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grade_id, code)
);

-- Indexes
CREATE INDEX idx_curriculum_domains_grade_id ON curriculum_domains(grade_id);
CREATE INDEX idx_curriculum_domains_code ON curriculum_domains(code);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_curriculum_domains_updated_at BEFORE UPDATE ON curriculum_domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
