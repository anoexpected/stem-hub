import { NextRequest, NextResponse } from 'next/server';
import { getQuestionsByTopic } from '@/lib/supabase/queries';

/**
 * GET /api/questions?topic_id={id}&limit={number}
 * Fetches questions for a specific topic
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const topicId = searchParams.get('topic_id');
        const limit = searchParams.get('limit');

        if (!topicId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing topic_id parameter'
                },
                { status: 400 }
            );
        }

        const limitNum = limit ? parseInt(limit) : undefined;
        const questions = await getQuestionsByTopic(topicId, limitNum);

        return NextResponse.json({
            success: true,
            data: questions,
            count: questions.length,
            topic_id: topicId
        });
    } catch (error) {
        console.error('Error fetching questions:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch questions',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
