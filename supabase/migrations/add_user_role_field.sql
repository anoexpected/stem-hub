-- Add role column to users table if not exists
-- This migration ensures the role field exists for all users

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'contributor', 'admin', 'teacher', 'parent'));

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update existing users without a role to have 'student' as default
UPDATE users 
SET role = 'student' 
WHERE role IS NULL;

-- Make role NOT NULL after setting defaults
ALTER TABLE users 
ALTER COLUMN role SET NOT NULL;

-- Add a comment to document the role field
COMMENT ON COLUMN users.role IS 'User role: student, contributor, admin, teacher, or parent';
