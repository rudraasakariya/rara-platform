-- Migration: 016_create_availability_table.sql
-- Description: Create availability table for tutor schedules

CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES tutors(user_id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT true,
    specific_date DATE, -- For one-time availability
    effective_from DATE,
    effective_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (is_recurring = true AND day_of_week IS NOT NULL AND specific_date IS NULL) OR
        (is_recurring = false AND specific_date IS NOT NULL AND day_of_week IS NULL)
    )
);

-- Indexes
CREATE INDEX idx_availability_tutor_id ON availability(tutor_id);
CREATE INDEX idx_availability_day ON availability(day_of_week);
CREATE INDEX idx_availability_date ON availability(specific_date);
CREATE INDEX idx_availability_recurring ON availability(tutor_id, day_of_week) WHERE is_recurring = true;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

