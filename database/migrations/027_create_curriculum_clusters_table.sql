-- Migration: 027_create_curriculum_clusters_table.sql
-- Description: Create curriculum_clusters table (cluster per domain, e.g. A, B)

CREATE TABLE curriculum_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID NOT NULL REFERENCES curriculum_domains(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(domain_id, code)
);

-- Indexes
CREATE INDEX idx_curriculum_clusters_domain_id ON curriculum_clusters(domain_id);
CREATE INDEX idx_curriculum_clusters_code ON curriculum_clusters(code);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_curriculum_clusters_updated_at BEFORE UPDATE ON curriculum_clusters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
