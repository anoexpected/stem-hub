-- Migration: Add review workflow columns to content tables
-- Date: 2025-10-06
-- Purpose: Support admin review approve/reject functionality

-- Add review columns to notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS review_feedback TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add review columns to quizzes table  
ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS review_feedback TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(created_by);
CREATE INDEX IF NOT EXISTS idx_notes_reviewed_by ON notes(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_quizzes_status ON quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_quizzes_reviewed_by ON quizzes(reviewed_by);

-- Update existing notes with view_count if it doesn't exist
UPDATE notes SET view_count = COALESCE(views_count, 0) WHERE view_count IS NULL;

-- Add constraint to ensure status is valid for notes
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'notes_status_check'
    ) THEN
        ALTER TABLE notes 
        ADD CONSTRAINT notes_status_check 
        CHECK (status IN ('draft', 'pending', 'published', 'rejected'));
    END IF;
END $$;

-- Add constraint to ensure status is valid for quizzes
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'quizzes_status_check'
    ) THEN
        ALTER TABLE quizzes 
        ADD CONSTRAINT quizzes_status_check 
        CHECK (status IN ('draft', 'pending', 'published', 'rejected'));
    END IF;
END $$;

-- Create a function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to notes table
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to quizzes table
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions for RLS
-- (These might need adjustment based on your RLS policies)

COMMENT ON COLUMN notes.reviewed_at IS 'Timestamp when admin reviewed the note';
COMMENT ON COLUMN notes.reviewed_by IS 'Admin user ID who reviewed the note';
COMMENT ON COLUMN notes.review_feedback IS 'Feedback provided by admin when rejecting';

COMMENT ON COLUMN quizzes.reviewed_at IS 'Timestamp when admin reviewed the quiz';
COMMENT ON COLUMN quizzes.reviewed_by IS 'Admin user ID who reviewed the quiz';
COMMENT ON COLUMN quizzes.review_feedback IS 'Feedback provided by admin when rejecting';
