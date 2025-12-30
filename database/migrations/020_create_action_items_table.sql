-- Migration: 020_create_action_items_table.sql
-- Description: Create action_items table

CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_action_items_student_id ON action_items(student_id);
CREATE INDEX idx_action_items_created_by ON action_items(created_by_user_id);
CREATE INDEX idx_action_items_assigned_to ON action_items(assigned_to_user_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);
CREATE INDEX idx_action_items_student_status ON action_items(student_id, status) WHERE status IN ('pending', 'in_progress');

-- Trigger to auto-update updated_at
CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON action_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

