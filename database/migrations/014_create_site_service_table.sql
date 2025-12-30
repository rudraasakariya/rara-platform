-- Migration: 014_create_site_service_table.sql
-- Description: Create site_service junction table (many services per site)

CREATE TABLE site_service (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    capacity INTEGER CHECK (capacity > 0),
    current_enrollment INTEGER DEFAULT 0 CHECK (current_enrollment >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(site_id, service_id)
);

-- Indexes
CREATE INDEX idx_site_service_site_id ON site_service(site_id);
CREATE INDEX idx_site_service_service_id ON site_service(service_id);
CREATE INDEX idx_site_service_active ON site_service(is_active);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_site_service_updated_at BEFORE UPDATE ON site_service
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

