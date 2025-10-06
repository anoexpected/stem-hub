-- STEM Hub Phase 2 - Database Schema Extensions
-- Run this SQL in your Supabase SQL Editor AFTER the main schema.sql

-- ============================================
-- TABLE: notes (Content Library)
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'markdown', -- markdown, html, rich-text
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending, approved, rejected
  version INT DEFAULT 1,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  rating_avg DECIMAL(3,2),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABLE: past_papers
-- ============================================
CREATE TABLE IF NOT EXISTS past_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  exam_board_id UUID REFERENCES exam_boards(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  year INT NOT NULL,
  paper_number VARCHAR(50), -- Paper 1, Paper 2, etc.
  season VARCHAR(50), -- May/June, Oct/Nov, etc.
  file_url TEXT NOT NULL,
  file_size_kb INT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  download_count INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_board_id, subject_id, year, paper_number, season)
);

-- ============================================
-- TABLE: reviews (Content Review System)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type VARCHAR(50) NOT NULL, -- note, past_paper, question
  content_id UUID NOT NULL,
  reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL, -- approved, rejected, changes_requested
  feedback TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: quizzes
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  time_limit_minutes INT,
  passing_score INT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: quiz_questions
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50), -- multiple_choice, true_false, short_answer
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  marks INT DEFAULT 1,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: quiz_attempts
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INT,
  total_marks INT,
  percentage DECIMAL(5,2),
  time_taken_seconds INT,
  answers_data JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: most_asked_questions (MAQ)
-- ============================================
CREATE TABLE IF NOT EXISTS most_asked_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  frequency_count INT DEFAULT 1,
  years_appeared JSONB, -- Array of years this question appeared
  difficulty VARCHAR(50),
  solution_note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: study_groups
-- ============================================
CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  exam_board_id UUID REFERENCES exam_boards(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  whatsapp_link TEXT,
  max_members INT DEFAULT 50,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: study_group_members
-- ============================================
CREATE TABLE IF NOT EXISTS study_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- admin, moderator, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ============================================
-- TABLE: user_achievements
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(100) NOT NULL, -- streak_7_days, topic_master, quiz_ace
  achievement_data JSONB,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: flashcards
-- ============================================
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  difficulty VARCHAR(50),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: user_flashcard_progress
-- ============================================
CREATE TABLE IF NOT EXISTS user_flashcard_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  interval_days INT DEFAULT 0,
  repetitions INT DEFAULT 0,
  next_review_date DATE,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

-- ============================================
-- TABLE: forum_discussions
-- ============================================
CREATE TABLE IF NOT EXISTS forum_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: forum_replies
-- ============================================
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID REFERENCES forum_discussions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_solution BOOLEAN DEFAULT false,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: note_likes
-- ============================================
CREATE TABLE IF NOT EXISTS note_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id, user_id)
);

-- ============================================
-- TABLE: note_ratings
-- ============================================
CREATE TABLE IF NOT EXISTS note_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(note_id, user_id)
);

-- ============================================
-- TABLE: user_learning_streaks
-- ============================================
CREATE TABLE IF NOT EXISTS user_learning_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  total_practice_days INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- TABLE: topic_mastery
-- ============================================
CREATE TABLE IF NOT EXISTS topic_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  mastery_level VARCHAR(50) DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
  mastery_score DECIMAL(5,2) DEFAULT 0.00, -- 0-100
  time_spent_minutes INT DEFAULT 0,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_notes_topic ON notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(created_by);
CREATE INDEX IF NOT EXISTS idx_notes_published_at ON notes(published_at);

CREATE INDEX IF NOT EXISTS idx_past_papers_subject ON past_papers(subject_id);
CREATE INDEX IF NOT EXISTS idx_past_papers_exam_board ON past_papers(exam_board_id);
CREATE INDEX IF NOT EXISTS idx_past_papers_year ON past_papers(year);

CREATE INDEX IF NOT EXISTS idx_reviews_content ON reviews(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_quizzes_topic ON quizzes(topic_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

CREATE INDEX IF NOT EXISTS idx_maq_topic ON most_asked_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_maq_subject ON most_asked_questions(subject_id);

CREATE INDEX IF NOT EXISTS idx_study_groups_subject ON study_groups(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_exam_board ON study_groups(exam_board_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user ON study_group_members(user_id);

CREATE INDEX IF NOT EXISTS idx_flashcards_topic ON flashcards(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_user ON user_flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_flashcard_progress_next_review ON user_flashcard_progress(next_review_date);

CREATE INDEX IF NOT EXISTS idx_forum_discussions_topic ON forum_discussions(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_discussions_subject ON forum_discussions(subject_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_discussion ON forum_replies(discussion_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON notes USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_forum_discussions_search ON forum_discussions USING gin(to_tsvector('english', title || ' ' || content));

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maq_updated_at BEFORE UPDATE ON most_asked_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON study_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_discussions_updated_at BEFORE UPDATE ON forum_discussions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_ratings_updated_at BEFORE UPDATE ON note_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_learning_streaks_updated_at BEFORE UPDATE ON user_learning_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS: Auto-update counters
-- ============================================

-- Function to update note likes count
CREATE OR REPLACE FUNCTION update_note_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE notes SET likes_count = likes_count + 1 WHERE id = NEW.note_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE notes SET likes_count = likes_count - 1 WHERE id = OLD.note_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_note_likes_count
  AFTER INSERT OR DELETE ON note_likes
  FOR EACH ROW EXECUTE FUNCTION update_note_likes_count();

-- Function to update note rating average
CREATE OR REPLACE FUNCTION update_note_rating_avg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE notes
  SET rating_avg = (SELECT AVG(rating)::DECIMAL(3,2) FROM note_ratings WHERE note_id = NEW.note_id)
  WHERE id = NEW.note_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_note_rating_avg
  AFTER INSERT OR UPDATE ON note_ratings
  FOR EACH ROW EXECUTE FUNCTION update_note_rating_avg();

-- Function to update forum reply count
CREATE OR REPLACE FUNCTION update_forum_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_discussions SET replies_count = replies_count + 1 WHERE id = NEW.discussion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_discussions SET replies_count = replies_count - 1 WHERE id = OLD.discussion_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_forum_replies_count
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_forum_replies_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE most_asked_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;

-- Notes Policies
CREATE POLICY "Approved notes are viewable by everyone"
  ON notes FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view their own draft notes"
  ON notes FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = created_by);

-- Past Papers Policies
CREATE POLICY "Past papers are viewable by everyone"
  ON past_papers FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Authenticated users can upload past papers"
  ON past_papers FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Quizzes Policies
CREATE POLICY "Active quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions FOR SELECT
  USING (true);

-- Quiz Attempts Policies
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Most Asked Questions Policies
CREATE POLICY "MAQ are viewable by everyone"
  ON most_asked_questions FOR SELECT
  USING (true);

-- Study Groups Policies
CREATE POLICY "Public study groups are viewable by everyone"
  ON study_groups FOR SELECT
  USING (is_public = true AND is_active = true);

CREATE POLICY "Users can create study groups"
  ON study_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups"
  ON study_groups FOR UPDATE
  USING (auth.uid() = created_by);

-- Study Group Members Policies
CREATE POLICY "Group members are viewable by everyone"
  ON study_group_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join study groups"
  ON study_group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave study groups"
  ON study_group_members FOR DELETE
  USING (auth.uid() = user_id);

-- Flashcards Policies
CREATE POLICY "Active flashcards are viewable by everyone"
  ON flashcards FOR SELECT
  USING (is_active = true);

-- User Flashcard Progress Policies
CREATE POLICY "Users can view their own flashcard progress"
  ON user_flashcard_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flashcard progress"
  ON user_flashcard_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcard progress"
  ON user_flashcard_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Forum Policies
CREATE POLICY "Forum discussions are viewable by everyone"
  ON forum_discussions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON forum_discussions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own discussions"
  ON forum_discussions FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Forum replies are viewable by everyone"
  ON forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own replies"
  ON forum_replies FOR UPDATE
  USING (auth.uid() = created_by);

-- Note Likes Policies
CREATE POLICY "Note likes are viewable by everyone"
  ON note_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like notes"
  ON note_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike notes"
  ON note_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Note Ratings Policies
CREATE POLICY "Note ratings are viewable by everyone"
  ON note_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate notes"
  ON note_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON note_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- User Achievements Policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create user achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (true);

-- Learning Streaks Policies
CREATE POLICY "Users can view their own learning streaks"
  ON user_learning_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning streaks"
  ON user_learning_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own learning streaks"
  ON user_learning_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Topic Mastery Policies
CREATE POLICY "Users can view their own topic mastery"
  ON topic_mastery FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own topic mastery"
  ON topic_mastery FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic mastery"
  ON topic_mastery FOR UPDATE
  USING (auth.uid() = user_id);

-- Reviews Policies (Admin/Moderators only)
CREATE POLICY "Reviewers can view all reviews"
  ON reviews FOR SELECT
  USING (true);

-- ============================================
-- SEED DATA FOR PHASE 2
-- ============================================

-- Add more exam boards
INSERT INTO exam_boards (name, code, country, description) VALUES
  ('IGCSE', 'IGCSE', 'International', 'International General Certificate of Secondary Education'),
  ('KCSE', 'KCSE', 'Kenya', 'Kenya Certificate of Secondary Education'),
  ('NECTA', 'NECTA', 'Tanzania', 'National Examinations Council of Tanzania')
ON CONFLICT (code) DO NOTHING;

-- Add subjects for ZIMSEC
INSERT INTO subjects (exam_board_id, name, code, level, description) VALUES
  ((SELECT id FROM exam_boards WHERE code = 'ZIMSEC'), 'Mathematics', 'MATH_O', 'O-Level', 'O-Level Mathematics'),
  ((SELECT id FROM exam_boards WHERE code = 'ZIMSEC'), 'Physics', 'PHYS_O', 'O-Level', 'O-Level Physics'),
  ((SELECT id FROM exam_boards WHERE code = 'ZIMSEC'), 'Chemistry', 'CHEM_O', 'O-Level', 'O-Level Chemistry'),
  ((SELECT id FROM exam_boards WHERE code = 'ZIMSEC'), 'Biology', 'BIO_O', 'O-Level', 'O-Level Biology'),
  ((SELECT id FROM exam_boards WHERE code = 'ZIMSEC'), 'Computer Science', 'CS_O', 'O-Level', 'O-Level Computer Science')
ON CONFLICT DO NOTHING;

-- Add subjects for WAEC
INSERT INTO subjects (exam_board_id, name, code, level, description) VALUES
  ((SELECT id FROM exam_boards WHERE code = 'WAEC'), 'Mathematics', 'MATH_WAEC', 'SSCE', 'WAEC Mathematics'),
  ((SELECT id FROM exam_boards WHERE code = 'WAEC'), 'Physics', 'PHYS_WAEC', 'SSCE', 'WAEC Physics'),
  ((SELECT id FROM exam_boards WHERE code = 'WAEC'), 'Chemistry', 'CHEM_WAEC', 'SSCE', 'WAEC Chemistry'),
  ((SELECT id FROM exam_boards WHERE code = 'WAEC'), 'Biology', 'BIO_WAEC', 'SSCE', 'WAEC Biology')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Phase 2 schema created successfully!';
  RAISE NOTICE 'New tables: notes, past_papers, quizzes, study_groups, forums, and more!';
END $$;
