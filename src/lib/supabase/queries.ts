import { supabase } from './client';
import type {
    ExamBoard,
    Subject,
    Topic,
    Question,
    UserProgress,
    PracticeSession,
} from '@/types/database';

/**
 * Fetch all active exam boards from the database
 */
export async function getExamBoards(): Promise<ExamBoard[]> {
    const { data, error } = await supabase
        .from('exam_boards')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data || [];
}

/**
 * Fetch subjects for a specific exam board
 */
export async function getSubjectsByExamBoard(examBoardId: string): Promise<Subject[]> {
    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('exam_board_id', examBoardId)
        .eq('is_active', true)
        .order('name');

    if (error) throw error;
    return data || [];
}

/**
 * Fetch topics for a specific subject
 */
export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Fetch a single topic by ID
 */
export async function getTopicById(topicId: string): Promise<Topic | null> {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Fetch questions for a specific topic
 */
export async function getQuestionsByTopic(
    topicId: string,
    limit?: number
): Promise<Question[]> {
    let query = supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId);

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
}

/**
 * Save a question to the database
 */
export async function saveQuestion(question: Omit<Question, 'id' | 'created_at'>): Promise<Question> {
    const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get user progress for a specific topic
 */
export async function getUserProgress(
    userId: string,
    topicId: string
): Promise<UserProgress | null> {
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
}

/**
 * Update or create user progress
 */
export async function upsertUserProgress(progress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>): Promise<UserProgress> {
    const { data, error } = await supabase
        .from('user_progress')
        .upsert(progress, {
            onConflict: 'user_id,topic_id',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get all user progress for a specific user
 */
export async function getAllUserProgress(userId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_practiced_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Save a practice session
 */
export async function savePracticeSession(
    session: Omit<PracticeSession, 'id' | 'created_at'>
): Promise<PracticeSession> {
    const { data, error } = await supabase
        .from('practice_sessions')
        .insert(session)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get practice sessions for a user
 */
export async function getUserPracticeSessions(
    userId: string,
    limit?: number
): Promise<PracticeSession[]> {
    let query = supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
}
