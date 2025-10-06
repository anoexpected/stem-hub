// Database Types matching Supabase Schema

export interface ExamBoard {
    id: string;
    name: string;
    code: string;
    country: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Subject {
    id: string;
    exam_board_id: string;
    name: string;
    code: string;
    level: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Topic {
    id: string;
    subject_id: string;
    name: string;
    code: string | null;
    description: string | null;
    difficulty_level: string | null;
    parent_topic_id: string | null;
    order_index: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export type QuestionType = 'multiple_choice' | 'short_answer' | 'calculation' | 'essay';

export interface Question {
    id: string;
    topic_id: string;
    question_text: string;
    question_type: QuestionType;
    difficulty: string | null;
    correct_answer: string;
    answer_options: Record<string, any> | null;
    explanation: string | null;
    marks: number | null;
    created_by: string | null;
    is_ai_generated: boolean;
    created_at: string;
}

export interface UserProgress {
    id: string;
    user_id: string;
    topic_id: string;
    questions_attempted: number;
    questions_correct: number;
    total_marks: number;
    marks_achieved: number;
    last_practiced_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PracticeSession {
    id: string;
    user_id: string;
    topic_id: string;
    questions_data: Record<string, any>;
    score: number | null;
    total_questions: number | null;
    duration_seconds: number | null;
    completed_at: string | null;
    created_at: string;
}

// Phase 2 Types

export interface Note {
    id: string;
    topic_id: string;
    title: string;
    content: string;
    content_type: 'markdown' | 'html' | 'rich-text';
    created_by: string | null;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    version: number;
    views_count: number;
    likes_count: number;
    rating_avg: number | null;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
    published_at: string | null;
}

export interface PastPaper {
    id: string;
    subject_id: string;
    exam_board_id: string;
    title: string;
    year: number;
    paper_number: string | null;
    season: string | null;
    file_url: string;
    file_size_kb: number | null;
    uploaded_by: string | null;
    download_count: number;
    status: string;
    created_at: string;
}

export interface Review {
    id: string;
    content_type: 'note' | 'past_paper' | 'question';
    content_id: string;
    reviewer_id: string | null;
    status: 'approved' | 'rejected' | 'changes_requested';
    feedback: string | null;
    reviewed_at: string;
}

export interface Quiz {
    id: string;
    topic_id: string;
    title: string;
    description: string | null;
    difficulty: string | null;
    time_limit_minutes: number | null;
    passing_score: number | null;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface QuizQuestion {
    id: string;
    quiz_id: string;
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer';
    options: Record<string, any> | null;
    correct_answer: string;
    explanation: string | null;
    marks: number;
    order_index: number | null;
    created_at: string;
}

export interface QuizAttempt {
    id: string;
    quiz_id: string;
    user_id: string;
    score: number | null;
    total_marks: number | null;
    percentage: number | null;
    time_taken_seconds: number | null;
    answers_data: Record<string, any> | null;
    completed_at: string;
}

export interface MostAskedQuestion {
    id: string;
    topic_id: string;
    subject_id: string;
    question_text: string;
    frequency_count: number;
    years_appeared: any;
    difficulty: string | null;
    solution_note_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface StudyGroup {
    id: string;
    name: string;
    description: string | null;
    subject_id: string | null;
    exam_board_id: string | null;
    created_by: string | null;
    whatsapp_link: string | null;
    max_members: number;
    is_public: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface StudyGroupMember {
    id: string;
    group_id: string;
    user_id: string;
    role: 'admin' | 'moderator' | 'member';
    joined_at: string;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_type: string;
    achievement_data: Record<string, any> | null;
    earned_at: string;
}

export interface Flashcard {
    id: string;
    topic_id: string;
    front_text: string;
    back_text: string;
    difficulty: string | null;
    created_by: string | null;
    is_active: boolean;
    created_at: string;
}

export interface UserFlashcardProgress {
    id: string;
    user_id: string;
    flashcard_id: string;
    ease_factor: number;
    interval_days: number;
    repetitions: number;
    next_review_date: string | null;
    last_reviewed_at: string | null;
    created_at: string;
}

export interface ForumDiscussion {
    id: string;
    topic_id: string;
    subject_id: string;
    title: string;
    content: string;
    created_by: string | null;
    is_pinned: boolean;
    is_locked: boolean;
    views_count: number;
    replies_count: number;
    created_at: string;
    updated_at: string;
}

export interface ForumReply {
    id: string;
    discussion_id: string;
    content: string;
    created_by: string | null;
    is_solution: boolean;
    likes_count: number;
    created_at: string;
    updated_at: string;
}

export interface NoteLike {
    id: string;
    note_id: string;
    user_id: string;
    created_at: string;
}

export interface NoteRating {
    id: string;
    note_id: string;
    user_id: string;
    rating: number;
    review_text: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserLearningStreak {
    id: string;
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    total_practice_days: number;
    created_at: string;
    updated_at: string;
}

export interface TopicMastery {
    id: string;
    user_id: string;
    topic_id: string;
    mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    mastery_score: number;
    time_spent_minutes: number;
    last_updated_at: string;
    created_at: string;
}

// Frontend UI Types
export interface SelectionState {
    examBoard: ExamBoard | null;
    subject: Subject | null;
    topic: Topic | null;
}

export interface QuestionWithAnswer extends Question {
    userAnswer?: string;
    isCorrect?: boolean;
}

export interface PracticeSessionData {
    questions: QuestionWithAnswer[];
    startTime: Date;
    endTime?: Date;
    currentQuestionIndex: number;
}
