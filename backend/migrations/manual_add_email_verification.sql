-- Manual migration to add email verification fields
-- Run this on the production database

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

-- Update existing users to be verified
UPDATE users SET is_verified = true WHERE is_verified IS NULL;