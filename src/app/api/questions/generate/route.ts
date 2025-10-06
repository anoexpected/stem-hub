import { NextRequest, NextResponse } from 'next/server';
import { getTopicById, saveQuestion } from '@/lib/supabase/queries';
import { generateQuestions } from '@/lib/ai/openai';
import { getCurrentUser } from '@/lib/supabase/auth';

/**
 * POST /api/questions/generate
 * Generates AI-powered practice questions for a topic
 * 
 * Body: {
 *   topic_id: string;
 *   count?: number;
 *   difficulty?: string;
 * }
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                    message: 'Please log in to generate questions'
                },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { topic_id, count = 5, difficulty } = body;

        if (!topic_id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing topic_id in request body'
                },
                { status: 400 }
            );
        }

        // Validate count
        if (count < 1 || count > 20) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Count must be between 1 and 20'
                },
                { status: 400 }
            );
        }

        // Get topic details
        const topic = await getTopicById(topic_id);
        if (!topic) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Topic not found'
                },
                { status: 404 }
            );
        }

        console.log(`Generating ${count} questions for topic: ${topic.name}`);

        // Generate questions using AI
        const generatedQuestions = await generateQuestions(
            topic,
            count,
            difficulty || topic.difficulty_level || undefined
        );

        // Save questions to database
        const savedQuestions = await Promise.all(
            generatedQuestions.map(async (q) => {
                return await saveQuestion({
                    topic_id: topic.id,
                    question_text: q.question_text,
                    question_type: q.question_type,
                    difficulty: q.difficulty,
                    correct_answer: q.correct_answer,
                    answer_options: q.answer_options || null,
                    explanation: q.explanation,
                    marks: q.marks,
                    created_by: user.id,
                    is_ai_generated: true
                });
            })
        );

        return NextResponse.json({
            success: true,
            data: savedQuestions,
            count: savedQuestions.length,
            topic: {
                id: topic.id,
                name: topic.name,
                difficulty: topic.difficulty_level
            }
        });

    } catch (error) {
        console.error('Error generating questions:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate questions',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
