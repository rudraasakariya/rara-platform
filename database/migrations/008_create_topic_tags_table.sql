-- Migration: 008_create_topic_tags_table.sql
-- Description: Create topic_tags table for session topics

CREATE TABLE topic_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_topic_tags_name ON topic_tags(name);

