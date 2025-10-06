import { NextRequest, NextResponse } from 'next/server';
import {
    getUserProgress,
    getAllUserProgress,
    upsertUserProgress
} from '@/lib/supabase/queries';
import { getCurrentUser } from '@/lib/supabase/auth';

/**
 * GET /api/progress?topic_id={id}
 * Fetches user progress for a specific topic or all topics
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized'
                },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const topicId = searchParams.get('topic_id');

        if (topicId) {
            // Get progress for specific topic
            const progress = await getUserProgress(user.id, topicId);
            return NextResponse.json({
                success: true,
                data: progress
            });
        } else {
            // Get all progress for user
            const allProgress = await getAllUserProgress(user.id);
            return NextResponse.json({
                success: true,
                data: allProgress,
                count: allProgress.length
            });
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch progress',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/progress
 * Updates or creates user progress
 * 
 * Body: {
 *   topic_id: string;
 *   questions_attempted: number;
 *   questions_correct: number;
 *   total_marks: number;
 *   marks_achieved: number;
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized'
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            topic_id,
            questions_attempted,
            questions_correct,
            total_marks,
            marks_achieved
        } = body;

        if (!topic_id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing topic_id'
                },
                { status: 400 }
            );
        }

        // Get existing progress
        const existingProgress = await getUserProgress(user.id, topic_id);

        // Calculate cumulative values
        const updatedProgress = await upsertUserProgress({
            user_id: user.id,
            topic_id,
            questions_attempted: (existingProgress?.questions_attempted || 0) + questions_attempted,
            questions_correct: (existingProgress?.questions_correct || 0) + questions_correct,
            total_marks: (existingProgress?.total_marks || 0) + total_marks,
            marks_achieved: (existingProgress?.marks_achieved || 0) + marks_achieved,
            last_practiced_at: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            data: updatedProgress
        });

    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update progress',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
