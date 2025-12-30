-- Migration: 021_create_recommendations_table.sql
-- Description: Create recommendations table

CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    source_type VARCHAR(50) CHECK (source_type IN ('assessment', 'system', 'manual')),
    source_id UUID, -- If from assessment, link to assessment_id (flexible reference)
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recommendation_text TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'implemented', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_recommendations_student_id ON recommendations(student_id);
CREATE INDEX idx_recommendations_source_type ON recommendations(source_type);
CREATE INDEX idx_recommendations_status ON recommendations(status);
CREATE INDEX idx_recommendations_priority ON recommendations(priority);
CREATE INDEX idx_recommendations_student_status ON recommendations(student_id, status) WHERE status = 'active';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

