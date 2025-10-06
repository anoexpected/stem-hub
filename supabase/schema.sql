-- STEM Hub Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: exam_boards
-- ============================================
CREATE TABLE IF NOT EXISTS exam_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  country VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: subjects
-- ============================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_board_id UUID REFERENCES exam_boards(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  level VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_board_id, code)
);

-- ============================================
-- TABLE: topics
-- ============================================
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(100),
  description TEXT,
  difficulty_level VARCHAR(50),
  parent_topic_id UUID REFERENCES topics(id),
  order_index INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: users (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(200),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: questions
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50),
  difficulty VARCHAR(50),
  correct_answer TEXT,
  answer_options JSONB,
  explanation TEXT,
  marks INT,
  created_by UUID REFERENCES users(id),
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: user_progress
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  total_marks INT DEFAULT 0,
  marks_achieved INT DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- ============================================
-- TABLE: practice_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  questions_data JSONB,
  score INT,
  total_questions INT,
  duration_seconds INT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_subjects_exam_board ON subjects(exam_board_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic ON user_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user ON practice_sessions(user_id);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_exam_boards_updated_at BEFORE UPDATE ON exam_boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE exam_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access for exam boards, subjects, topics
CREATE POLICY "Exam boards are viewable by everyone"
  ON exam_boards FOR SELECT
  USING (is_active = true);

CREATE POLICY "Subjects are viewable by everyone"
  ON subjects FOR SELECT
  USING (is_active = true);

CREATE POLICY "Topics are viewable by everyone"
  ON topics FOR SELECT
  USING (is_active = true);

CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (true);

-- Users can read their own data
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Practice sessions policies
CREATE POLICY "Users can view their own sessions"
  ON practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert sample exam boards
INSERT INTO exam_boards (name, code, country, description) VALUES
  ('AQA', 'AQA', 'England', 'Assessment and Qualifications Alliance'),
  ('Edexcel', 'EDEXCEL', 'England', 'Pearson Edexcel'),
  ('OCR', 'OCR', 'England', 'Oxford, Cambridge and RSA Examinations'),
  ('WJEC', 'WJEC', 'Wales', 'Welsh Joint Education Committee'),
  ('ZIMSEC', 'ZIMSEC', 'Zimbabwe', 'Zimbabwe School Examinations Council'),
  ('UNEB', 'UNEB', 'Uganda', 'Uganda National Examinations Board'),
  ('WAEC', 'WAEC', 'West Africa', 'West African Examinations Council'),
  ('Cambridge', 'CAMBRIDGE', 'International', 'Cambridge International Examinations')
ON CONFLICT (code) DO NOTHING;

-- Insert sample subjects for AQA
INSERT INTO subjects (exam_board_id, name, code, level, description) VALUES
  ((SELECT id FROM exam_boards WHERE code = 'AQA'), 'Mathematics', 'MATH_GCSE', 'GCSE', 'GCSE Mathematics'),
  ((SELECT id FROM exam_boards WHERE code = 'AQA'), 'Physics', 'PHYS_GCSE', 'GCSE', 'GCSE Physics'),
  ((SELECT id FROM exam_boards WHERE code = 'AQA'), 'Chemistry', 'CHEM_GCSE', 'GCSE', 'GCSE Chemistry'),
  ((SELECT id FROM exam_boards WHERE code = 'AQA'), 'Biology', 'BIO_GCSE', 'GCSE', 'GCSE Biology')
ON CONFLICT DO NOTHING;

-- Insert sample topics for Mathematics
INSERT INTO topics (subject_id, name, difficulty_level, order_index, description) VALUES
  ((SELECT id FROM subjects WHERE code = 'MATH_GCSE' LIMIT 1), 'Algebra', 'Foundation', 1, 'Algebraic expressions and equations'),
  ((SELECT id FROM subjects WHERE code = 'MATH_GCSE' LIMIT 1), 'Geometry', 'Foundation', 2, 'Shapes, angles, and measurements'),
  ((SELECT id FROM subjects WHERE code = 'MATH_GCSE' LIMIT 1), 'Trigonometry', 'Higher', 3, 'Trigonometric ratios and identities'),
  ((SELECT id FROM subjects WHERE code = 'MATH_GCSE' LIMIT 1), 'Calculus', 'Higher', 4, 'Differentiation and integration basics'),
  ((SELECT id FROM subjects WHERE code = 'MATH_GCSE' LIMIT 1), 'Probability', 'Foundation', 5, 'Probability theory and calculations'),
  ((SELECT id FROM subjects WHERE code = 'MATH_GCSE' LIMIT 1), 'Statistics', 'Foundation', 6, 'Data handling and statistical analysis')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Sample data inserted for exam boards, subjects, and topics.';
END $$;
