-- Migration: 030_add_taxonomy_links_to_sessions.sql
-- Description: Add taxonomy references to sessions for curriculum-aligned reporting/filtering

ALTER TABLE sessions
ADD COLUMN cluster_id UUID REFERENCES curriculum_clusters(id) ON DELETE RESTRICT,
ADD COLUMN skill_id UUID REFERENCES curriculum_skills(id) ON DELETE RESTRICT;

-- Indexes for report and filter queries
CREATE INDEX idx_sessions_cluster_id ON sessions(cluster_id);
CREATE INDEX idx_sessions_skill_id ON sessions(skill_id);
CREATE INDEX idx_sessions_session_date_cluster_id ON sessions(session_date, cluster_id);
CREATE INDEX idx_sessions_session_date_skill_id ON sessions(session_date, skill_id);

-- Notes:
-- 1) session_topics remains available for free-form tags.
-- 2) curriculum cluster/skill is the canonical taxonomy link for curriculum-driven reporting.
