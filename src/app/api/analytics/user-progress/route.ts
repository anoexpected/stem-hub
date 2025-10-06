import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user's learning streak
        const { data: streak } = await supabase
            .from('user_learning_streaks')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // Get user's topic mastery
        const { data: topicMastery } = await supabase
            .from('topic_mastery')
            .select(`
                *,
                topics (
                    id,
                    name,
                    subjects (
                        id,
                        name
                    )
                )
            `)
            .eq('user_id', user.id)
            .order('mastery_score', { ascending: false });

        // Get recent quiz attempts
        const { data: recentQuizzes } = await supabase
            .from('quiz_attempts')
            .select(`
                *,
                quizzes (
                    id,
                    title,
                    topics (
                        id,
                        name
                    )
                )
            `)
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(10);

        // Get user's achievements
        const { data: achievements } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', user.id)
            .order('earned_at', { ascending: false });

        // Get overall statistics
        const { data: practiceStats } = await supabase
            .from('practice_sessions')
            .select('score, total_questions')
            .eq('user_id', user.id);

        const totalQuestions = practiceStats?.reduce((sum, s) => sum + (s.total_questions || 0), 0) || 0;
        const totalScore = practiceStats?.reduce((sum, s) => sum + (s.score || 0), 0) || 0;
        const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

        return NextResponse.json({
            streak: streak || {
                current_streak: 0,
                longest_streak: 0,
                total_practice_days: 0
            },
            topicMastery: topicMastery || [],
            recentQuizzes: recentQuizzes || [],
            achievements: achievements || [],
            overallStats: {
                totalQuestions,
                totalScore,
                averageScore: parseFloat(averageScore.toFixed(2)),
                totalPracticeSessions: practiceStats?.length || 0
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
