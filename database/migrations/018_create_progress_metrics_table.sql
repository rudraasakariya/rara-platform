-- Migration: 018_create_progress_metrics_table.sql
-- Description: Create progress_metrics table

CREATE TABLE progress_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recorded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_progress_metrics_student_id ON progress_metrics(student_id);
CREATE INDEX idx_progress_metrics_name ON progress_metrics(metric_name);
CREATE INDEX idx_progress_metrics_recorded_at ON progress_metrics(recorded_at);
CREATE INDEX idx_progress_metrics_student_recorded ON progress_metrics(student_id, recorded_at);

