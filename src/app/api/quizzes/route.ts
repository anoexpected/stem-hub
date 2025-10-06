import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const topicId = searchParams.get('topic_id');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('quizzes')
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
            `, { count: 'exact' })
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (topicId) {
            query = query.eq('topic_id', topicId);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching quizzes:', error);
            return NextResponse.json(
                { error: 'Failed to fetch quizzes' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            quizzes: data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
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

export async function POST(request: NextRequest) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            topic_id,
            title,
            description,
            difficulty,
            time_limit_minutes,
            passing_score,
            questions
        } = body;

        if (!topic_id || !title || !questions || questions.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create quiz
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                topic_id,
                title,
                description,
                difficulty,
                time_limit_minutes,
                passing_score,
                created_by: user.id
            })
            .select()
            .single();

        if (quizError) {
            console.error('Error creating quiz:', quizError);
            return NextResponse.json(
                { error: 'Failed to create quiz' },
                { status: 500 }
            );
        }

        // Create quiz questions
        const questionsToInsert = questions.map((q: any, index: number) => ({
            quiz_id: quiz.id,
            question_text: q.question_text,
            question_type: q.question_type || 'multiple_choice',
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            marks: q.marks || 1,
            order_index: index + 1
        }));

        const { error: questionsError } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert);

        if (questionsError) {
            console.error('Error creating quiz questions:', questionsError);
            // Rollback quiz creation
            await supabase.from('quizzes').delete().eq('id', quiz.id);
            return NextResponse.json(
                { error: 'Failed to create quiz questions' },
                { status: 500 }
            );
        }

        return NextResponse.json(quiz, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
