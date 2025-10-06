import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get quiz with questions
        const { data: quiz, error: quizError } = await supabase
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
                ),
                quiz_questions (
                    id,
                    question_text,
                    question_type,
                    options,
                    explanation,
                    marks,
                    order_index
                )
            `)
            .eq('id', params.id)
            .eq('is_active', true)
            .single();

        if (quizError || !quiz) {
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        // Don't send correct answers to the client
        const sanitizedQuestions = quiz.quiz_questions.map((q: any) => ({
            id: q.id,
            question_text: q.question_text,
            question_type: q.question_type,
            options: q.options,
            marks: q.marks,
            order_index: q.order_index
        }));

        return NextResponse.json({
            ...quiz,
            quiz_questions: sanitizedQuestions
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { answers, time_taken_seconds } = body;

        if (!answers) {
            return NextResponse.json(
                { error: 'Missing answers' },
                { status: 400 }
            );
        }

        // Get quiz questions with correct answers
        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', params.id);

        if (questionsError || !questions) {
            return NextResponse.json(
                { error: 'Failed to fetch quiz questions' },
                { status: 500 }
            );
        }

        // Calculate score
        let score = 0;
        let totalMarks = 0;
        const results = questions.map((q: any) => {
            totalMarks += q.marks;
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer?.toLowerCase().trim() === q.correct_answer?.toLowerCase().trim();

            if (isCorrect) {
                score += q.marks;
            }

            return {
                questionId: q.id,
                userAnswer,
                correctAnswer: q.correct_answer,
                isCorrect,
                marks: isCorrect ? q.marks : 0,
                explanation: q.explanation
            };
        });

        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

        // Save quiz attempt
        const { data: attempt, error: attemptError } = await supabase
            .from('quiz_attempts')
            .insert({
                quiz_id: params.id,
                user_id: user.id,
                score,
                total_marks: totalMarks,
                percentage: parseFloat(percentage.toFixed(2)),
                time_taken_seconds,
                answers_data: { answers, results }
            })
            .select()
            .single();

        if (attemptError) {
            console.error('Error saving quiz attempt:', attemptError);
            return NextResponse.json(
                { error: 'Failed to save quiz attempt' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            attempt,
            results,
            score,
            totalMarks,
            percentage
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
