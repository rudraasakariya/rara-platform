-- Migration: 015_create_partnerships_table.sql
-- Description: Create partnerships junction table (many partners per site)

CREATE TABLE partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    partnership_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(partner_id, site_id)
);

-- Indexes
CREATE INDEX idx_partnerships_partner_id ON partnerships(partner_id);
CREATE INDEX idx_partnerships_site_id ON partnerships(site_id);
CREATE INDEX idx_partnerships_status ON partnerships(status);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON partnerships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

