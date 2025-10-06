import { NextRequest, NextResponse } from 'next/server';
import { getTopicsBySubject } from '@/lib/supabase/queries';

/**
 * GET /api/topics?subject_id={id}
 * Fetches all active topics for a specific subject
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const subjectId = searchParams.get('subject_id');

        if (!subjectId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing subject_id parameter'
                },
                { status: 400 }
            );
        }

        const topics = await getTopicsBySubject(subjectId);

        return NextResponse.json({
            success: true,
            data: topics,
            count: topics.length,
            subject_id: subjectId
        });
    } catch (error) {
        console.error('Error fetching topics:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch topics',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
