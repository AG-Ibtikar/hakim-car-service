-- SQL script to create admin user
-- Note: This script assumes you have bcrypt extension installed in PostgreSQL
-- If not, you'll need to install it or use the TypeScript script instead

-- First, ensure the bcrypt extension is available (run this as superuser if needed)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert admin user with hashed password
-- The password 'Admin123' is hashed using bcrypt with salt rounds 10
INSERT INTO "User" (
  id,
  email,
  password,
  "firstName",
  "lastName",
  "phoneNumber",
  role,
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin2@hakim.com',
  '$2b$10$YourHashedPasswordHere', -- This needs to be replaced with actual bcrypt hash
  'Admin',
  'User',
  '1234567890',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "updatedAt" = NOW();

-- Note: The password hash above is a placeholder
-- To get the actual hash, run the TypeScript script or use a bcrypt generator 