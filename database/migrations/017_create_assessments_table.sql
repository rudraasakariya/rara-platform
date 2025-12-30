-- Migration: 017_create_assessments_table.sql
-- Description: Create assessments table (session-specific and overall)

CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL, -- NULL = overall, NOT NULL = session-specific
    assessment_type VARCHAR(50) NOT NULL CHECK (assessment_type IN ('session_metric', 'overall_performance')),
    assessment_date DATE NOT NULL,
    scores JSONB, -- Flexible structure for different assessment criteria
    areas JSONB, -- Performance across different areas/subjects
    notes TEXT,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (session_id IS NULL AND assessment_type = 'overall_performance') OR
        (session_id IS NOT NULL AND assessment_type = 'session_metric')
    )
);

-- Indexes
CREATE INDEX idx_assessments_student_id ON assessments(student_id);
CREATE INDEX idx_assessments_session_id ON assessments(session_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_date ON assessments(assessment_date);
CREATE INDEX idx_assessments_scores ON assessments USING gin(scores); -- GIN index for JSONB queries

-- Trigger to auto-update updated_at
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

