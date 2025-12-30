-- Migration: 019_create_weekly_goals_table.sql
-- Description: Create weekly_goals table

CREATE TABLE weekly_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year > 2000 AND year < 2100),
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 52),
    goal_description TEXT NOT NULL,
    target_value NUMERIC,
    current_value NUMERIC,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'missed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, year, week_number) -- One goal per student per week
);

-- Indexes
CREATE INDEX idx_weekly_goals_student_id ON weekly_goals(student_id);
CREATE INDEX idx_weekly_goals_year_week ON weekly_goals(year, week_number);
CREATE INDEX idx_weekly_goals_status ON weekly_goals(status);
CREATE INDEX idx_weekly_goals_student_year ON weekly_goals(student_id, year, week_number);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_weekly_goals_updated_at BEFORE UPDATE ON weekly_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

