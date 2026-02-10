-- Migration: 028_create_curriculum_skills_table.sql
-- Description: Create curriculum_skills table (skill per cluster; full code = grade.domain.cluster.skill e.g. 1.OA.A.1)

CREATE TABLE curriculum_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES curriculum_clusters(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL,
    label VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cluster_id, code)
);

-- Indexes
CREATE INDEX idx_curriculum_skills_cluster_id ON curriculum_skills(cluster_id);
CREATE INDEX idx_curriculum_skills_code ON curriculum_skills(code);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_curriculum_skills_updated_at BEFORE UPDATE ON curriculum_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
