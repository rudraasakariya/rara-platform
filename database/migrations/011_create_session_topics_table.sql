-- Migration: 011_create_session_topics_table.sql
-- Description: Create session_topics junction table (many topics per session)

CREATE TABLE session_topics (
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    topic_tag_id UUID NOT NULL REFERENCES topic_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, topic_tag_id)
);

-- Indexes
CREATE INDEX idx_session_topics_session_id ON session_topics(session_id);
CREATE INDEX idx_session_topics_topic_id ON session_topics(topic_tag_id);

