-- ============================================
-- MIGRATION: Dynamic Topic Contribution Management
-- Description: Allows admins to control which topics are available for contributor content creation
-- Date: 2025-10-04
-- ============================================

-- Add contribution management fields to topics table
ALTER TABLE topics 
  ADD COLUMN IF NOT EXISTS available_for_contribution BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS contribution_status VARCHAR(50) DEFAULT 'open' CHECK (contribution_status IN ('open', 'in_progress', 'complete', 'closed')),
  ADD COLUMN IF NOT EXISTS priority_level VARCHAR(50) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS required_notes_count INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS required_quizzes_count INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_notes_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_quizzes_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completion_percentage INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS opened_for_contribution_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_available_contribution ON topics(available_for_contribution) WHERE available_for_contribution = true;
CREATE INDEX IF NOT EXISTS idx_topics_contribution_status ON topics(contribution_status);
CREATE INDEX IF NOT EXISTS idx_topics_priority_level ON topics(priority_level);
CREATE INDEX IF NOT EXISTS idx_topics_subject_available ON topics(subject_id, available_for_contribution);

-- Create a function to automatically update topic counts
CREATE OR REPLACE FUNCTION update_topic_contribution_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update counts for the affected topic
  UPDATE topics SET
    current_notes_count = (
      SELECT COUNT(*) 
      FROM notes 
      WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id) 
        AND status IN ('approved', 'pending')
    ),
    current_quizzes_count = (
      SELECT COUNT(*) 
      FROM quizzes 
      WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id)
        AND is_active = true
    )
  WHERE id = COALESCE(NEW.topic_id, OLD.topic_id);
  
  -- Update completion percentage
  UPDATE topics SET
    completion_percentage = LEAST(100, (
      (CASE WHEN required_notes_count > 0 
        THEN (current_notes_count::FLOAT / required_notes_count * 50)
        ELSE 50 
      END) +
      (CASE WHEN required_quizzes_count > 0 
        THEN (current_quizzes_count::FLOAT / required_quizzes_count * 50)
        ELSE 50 
      END)
    )::INT),
    contribution_status = CASE
      WHEN completion_percentage >= 100 THEN 'complete'
      WHEN current_notes_count > 0 OR current_quizzes_count > 0 THEN 'in_progress'
      ELSE contribution_status
    END
  WHERE id = COALESCE(NEW.topic_id, OLD.topic_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update counts when notes are added/removed
DROP TRIGGER IF EXISTS trigger_update_topic_counts_on_note_insert ON notes;
CREATE TRIGGER trigger_update_topic_counts_on_note_insert
  AFTER INSERT OR UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_contribution_counts();

DROP TRIGGER IF EXISTS trigger_update_topic_counts_on_note_delete ON notes;
CREATE TRIGGER trigger_update_topic_counts_on_note_delete
  AFTER DELETE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_contribution_counts();

-- Create triggers for quizzes
DROP TRIGGER IF EXISTS trigger_update_topic_counts_on_quiz_insert ON quizzes;
CREATE TRIGGER trigger_update_topic_counts_on_quiz_insert
  AFTER INSERT OR UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_contribution_counts();

DROP TRIGGER IF EXISTS trigger_update_topic_counts_on_quiz_delete ON quizzes;
CREATE TRIGGER trigger_update_topic_counts_on_quiz_delete
  AFTER DELETE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_contribution_counts();

-- Create a view for admin topic management dashboard
CREATE OR REPLACE VIEW admin_topic_contribution_overview AS
SELECT 
  t.id,
  t.name as topic_name,
  t.code as topic_code,
  s.name as subject_name,
  s.id as subject_id,
  eb.name as exam_board_name,
  eb.id as exam_board_id,
  t.available_for_contribution,
  t.contribution_status,
  t.priority_level,
  t.required_notes_count,
  t.required_quizzes_count,
  t.current_notes_count,
  t.current_quizzes_count,
  t.completion_percentage,
  t.admin_notes,
  t.opened_for_contribution_at,
  t.completed_at,
  t.created_at,
  t.updated_at,
  -- Calculate what's still needed
  GREATEST(0, t.required_notes_count - t.current_notes_count) as notes_needed,
  GREATEST(0, t.required_quizzes_count - t.current_quizzes_count) as quizzes_needed,
  -- Get contributor statistics
  (SELECT COUNT(DISTINCT created_by) FROM notes WHERE topic_id = t.id) as unique_contributors,
  (SELECT COUNT(*) FROM notes WHERE topic_id = t.id AND status = 'pending') as pending_reviews
FROM topics t
JOIN subjects s ON t.subject_id = s.id
JOIN exam_boards eb ON s.exam_board_id = eb.id
ORDER BY 
  CASE t.priority_level
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  t.completion_percentage ASC,
  t.name;

-- Create a view for contributors (only shows available topics)
CREATE OR REPLACE VIEW contributor_available_topics AS
SELECT 
  t.id,
  t.name as topic_name,
  t.code as topic_code,
  t.description,
  t.difficulty_level,
  s.name as subject_name,
  s.id as subject_id,
  eb.name as exam_board_name,
  eb.id as exam_board_id,
  t.priority_level,
  t.required_notes_count,
  t.required_quizzes_count,
  t.current_notes_count,
  t.current_quizzes_count,
  t.completion_percentage,
  GREATEST(0, t.required_notes_count - t.current_notes_count) as notes_needed,
  GREATEST(0, t.required_quizzes_count - t.current_quizzes_count) as quizzes_needed,
  t.opened_for_contribution_at
FROM topics t
JOIN subjects s ON t.subject_id = s.id
JOIN exam_boards eb ON s.exam_board_id = eb.id
WHERE t.available_for_contribution = true
  AND t.contribution_status != 'complete'
  AND t.is_active = true
  AND s.is_active = true
  AND eb.is_active = true
ORDER BY 
  CASE t.priority_level
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  t.completion_percentage ASC,
  t.name;

-- Grant permissions
GRANT SELECT ON admin_topic_contribution_overview TO authenticated;
GRANT SELECT ON contributor_available_topics TO authenticated;

-- Add helpful comment
COMMENT ON COLUMN topics.available_for_contribution IS 'Controls whether contributors can see and create content for this topic';
COMMENT ON COLUMN topics.contribution_status IS 'Tracks the contribution progress: open, in_progress, complete, closed';
COMMENT ON COLUMN topics.priority_level IS 'Indicates urgency for content creation: low, medium, high, urgent';
COMMENT ON COLUMN topics.completion_percentage IS 'Auto-calculated based on current vs required content counts';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Topic Contribution Management Migration Complete!';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '   1. Run: SELECT * FROM admin_topic_contribution_overview;';
  RAISE NOTICE '   2. Mark topics as available: UPDATE topics SET available_for_contribution = true WHERE id = ''your-topic-id'';';
  RAISE NOTICE '   3. Set requirements: UPDATE topics SET required_notes_count = 3, required_quizzes_count = 2 WHERE id = ''your-topic-id'';';
END $$;
