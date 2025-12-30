-- Migration: 024_add_oauth_support.sql
-- Description: Add OAuth provider fields to users table for Google OAuth (and other providers)
-- This is optional - only run if you want to support OAuth authentication

-- Add OAuth fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50), -- 'google', 'github', 'microsoft', etc.
ADD COLUMN IF NOT EXISTS oauth_provider_id VARCHAR(255), -- Provider's user ID
ADD COLUMN IF NOT EXISTS oauth_email VARCHAR(255); -- Email from OAuth provider

-- Create unique constraint for OAuth provider + provider_id combination
-- This ensures one user per OAuth account
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_oauth_provider 
ON users(oauth_provider, oauth_provider_id) 
WHERE oauth_provider IS NOT NULL AND oauth_provider_id IS NOT NULL;

-- Index for OAuth email lookups
CREATE INDEX IF NOT EXISTS idx_users_oauth_email ON users(oauth_email) 
WHERE oauth_email IS NOT NULL;

-- Note: Users can have EITHER password_hash OR oauth_provider
-- Both can be NULL during account creation, but at least one should be set
-- This will be enforced at the application level

COMMENT ON COLUMN users.oauth_provider IS 'OAuth provider name (google, github, etc.)';
COMMENT ON COLUMN users.oauth_provider_id IS 'User ID from OAuth provider';
COMMENT ON COLUMN users.oauth_email IS 'Email address from OAuth provider';

