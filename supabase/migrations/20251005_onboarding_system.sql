-- STEM Hub Onboarding System Migration
-- Created: October 5, 2025
-- Purpose: Support multi-role onboarding with African-first features

-- =====================================================
-- 1. Update users table with onboarding fields
-- =====================================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster onboarding queries
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed, onboarding_step);

-- =====================================================
-- 2. Create student_profiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Location
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Africa/Harare',
    
    -- School
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    grade_level VARCHAR(50),
    
    -- Academic
    exam_boards TEXT[] DEFAULT '{}',
    current_level VARCHAR(50),
    target_year INTEGER,
    exam_date DATE,
    
    -- Personalization
    learning_style TEXT[] DEFAULT '{}',
    daily_study_minutes INTEGER DEFAULT 60,
    
    -- Notifications
    notifications JSONB DEFAULT '{
        "study_reminders": true,
        "content_alerts": true,
        "community_updates": false,
        "achievements": true
    }'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_school ON student_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_country ON student_profiles(country);

-- =====================================================
-- 3. Create teacher_profiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS teacher_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- School & Verification
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_document_url TEXT,
    
    -- Professional Info
    subjects_taught UUID[] DEFAULT '{}',
    bio TEXT,
    years_experience INTEGER,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_user ON teacher_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_school ON teacher_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_verification ON teacher_profiles(verification_status);

-- =====================================================
-- 4. Create contributor_profiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS contributor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Application
    application_status VARCHAR(20) DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    application_text TEXT,
    portfolio_url TEXT,
    
    -- Expertise
    subjects_expertise UUID[] DEFAULT '{}',
    
    -- Performance
    contribution_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    verified_badge BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contributor_profiles_user ON contributor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_contributor_profiles_status ON contributor_profiles(application_status);

-- =====================================================
-- 5. Create parent_profiles table
-- =====================================================
CREATE TABLE IF NOT EXISTS parent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Linked Students
    linked_students UUID[] DEFAULT '{}',
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{
        "weekly_summary": true,
        "achievement_alerts": true,
        "concern_alerts": true
    }'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_parent_profiles_user ON parent_profiles(user_id);

-- =====================================================
-- 6. Update schools table (if not exists, create)
-- =====================================================
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    
    -- Location
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    coordinates GEOGRAPHY(POINT),
    
    -- Classification
    type VARCHAR(50) CHECK (type IN ('public', 'private', 'international', 'other')),
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    
    -- Stats
    student_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schools_country ON schools(country);
CREATE INDEX IF NOT EXISTS idx_schools_verified ON schools(verified);
CREATE INDEX IF NOT EXISTS idx_schools_name ON schools USING gin(to_tsvector('english', name));

-- =====================================================
-- 7. Create achievements table
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    points INTEGER DEFAULT 0,
    category VARCHAR(50),
    
    -- Requirements
    requirement_type VARCHAR(50),
    requirement_value INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default onboarding achievements
INSERT INTO achievements (name, description, icon, points, category, requirement_type, requirement_value)
VALUES 
    ('Welcome Aboard!', 'Created your STEM Hub account', '🎉', 5, 'onboarding', 'signup', 1),
    ('School Pioneer!', 'Added your school to STEM Hub', '🏫', 10, 'onboarding', 'add_school', 1),
    ('Onboarding Champion!', 'Completed the full onboarding process', '🏆', 25, 'onboarding', 'complete_onboarding', 1),
    ('First Quiz!', 'Completed your first quiz', '📝', 10, 'learning', 'complete_quiz', 1),
    ('Study Streak 7', 'Studied for 7 days in a row', '🔥', 20, 'streak', 'study_streak', 7),
    ('Subject Explorer', 'Added 5 subjects to your profile', '📚', 15, 'subjects', 'add_subjects', 5)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 8. Create user_achievements table
-- =====================================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(unlocked_at);

-- =====================================================
-- 9. Create onboarding_analytics table
-- =====================================================
CREATE TABLE IF NOT EXISTS onboarding_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Step info
    step INTEGER NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER,
    
    -- Device info
    device_type VARCHAR(50),
    browser VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_user ON onboarding_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_analytics_step ON onboarding_analytics(step);

-- =====================================================
-- 10. Create user_subjects table (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    
    -- Preferences
    is_primary BOOLEAN DEFAULT TRUE,
    target_grade VARCHAR(10),
    
    -- Metadata
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, subject_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_subjects_user ON user_subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subjects_subject ON user_subjects(subject_id);

-- =====================================================
-- 11. Create RLS Policies
-- =====================================================

-- student_profiles policies
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own student profile"
    ON student_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student profile"
    ON student_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile"
    ON student_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- teacher_profiles policies
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own teacher profile"
    ON teacher_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teacher profile"
    ON teacher_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teacher profile"
    ON teacher_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- contributor_profiles policies
ALTER TABLE contributor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contributor profile"
    ON contributor_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contributor profile"
    ON contributor_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contributor profile"
    ON contributor_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- parent_profiles policies
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own parent profile"
    ON parent_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parent profile"
    ON parent_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parent profile"
    ON parent_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- schools policies
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified schools"
    ON schools FOR SELECT
    USING (verified = TRUE OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create schools"
    ON schools FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- achievements policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
    ON achievements FOR SELECT
    USING (TRUE);

-- user_achievements policies
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (TRUE);

-- user_subjects policies
ALTER TABLE user_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subjects"
    ON user_subjects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subjects"
    ON user_subjects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects"
    ON user_subjects FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 12. Create Functions
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON teacher_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributor_profiles_updated_at BEFORE UPDATE ON contributor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_profiles_updated_at BEFORE UPDATE ON parent_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to award achievement
CREATE OR REPLACE FUNCTION award_achievement(
    p_user_id UUID,
    p_achievement_name VARCHAR
)
RETURNS VOID AS $$
DECLARE
    v_achievement_id UUID;
BEGIN
    -- Get achievement ID
    SELECT id INTO v_achievement_id
    FROM achievements
    WHERE name = p_achievement_name;
    
    -- Insert if not already awarded
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, v_achievement_id)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to increment school student count
CREATE OR REPLACE FUNCTION increment_school_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.school_id IS NOT NULL THEN
        UPDATE schools
        SET student_count = student_count + 1
        WHERE id = NEW.school_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_school_count AFTER INSERT ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION increment_school_student_count();

-- =====================================================
-- 13. Insert Sample African Schools
-- =====================================================
INSERT INTO schools (name, country, region, city, type, verified, student_count)
VALUES 
    -- Zimbabwe
    ('Peterhouse Boys'' School', 'Zimbabwe', 'Mashonaland East', 'Marondera', 'private', true, 0),
    ('Dominican Convent High School', 'Zimbabwe', 'Harare', 'Harare', 'private', true, 0),
    ('Hellenic Academy', 'Zimbabwe', 'Harare', 'Harare', 'private', true, 0),
    ('Prince Edward School', 'Zimbabwe', 'Harare', 'Harare', 'public', true, 0),
    ('Arundel School', 'Zimbabwe', 'Harare', 'Harare', 'public', true, 0),
    
    -- Kenya
    ('Alliance High School', 'Kenya', 'Kiambu', 'Kikuyu', 'public', true, 0),
    ('Moi High School Kabarak', 'Kenya', 'Nakuru', 'Nakuru', 'public', true, 0),
    ('Brookhouse School', 'Kenya', 'Nairobi', 'Nairobi', 'international', true, 0),
    
    -- Nigeria
    ('King''s College Lagos', 'Nigeria', 'Lagos', 'Lagos', 'public', true, 0),
    ('Federal Government College Warri', 'Nigeria', 'Delta', 'Warri', 'public', true, 0),
    ('Corona School', 'Nigeria', 'Lagos', 'Lagos', 'private', true, 0),
    
    -- South Africa
    ('Bishops Diocesan College', 'South Africa', 'Western Cape', 'Cape Town', 'private', true, 0),
    ('St Stithians College', 'South Africa', 'Gauteng', 'Johannesburg', 'private', true, 0),
    
    -- Ghana
    ('Achimota School', 'Ghana', 'Greater Accra', 'Accra', 'public', true, 0),
    ('Prempeh College', 'Ghana', 'Ashanti', 'Kumasi', 'public', true, 0),
    
    -- Tanzania
    ('St Francis College', 'Tanzania', 'Dar es Salaam', 'Dar es Salaam', 'private', true, 0),
    ('Ilboru Secondary School', 'Tanzania', 'Arusha', 'Arusha', 'public', true, 0)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE! Onboarding System Ready
-- =====================================================
