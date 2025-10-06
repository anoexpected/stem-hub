import { NextRequest, NextResponse } from 'next/server';
import {
    savePracticeSession,
    getUserPracticeSessions
} from '@/lib/supabase/queries';
import { getCurrentUser } from '@/lib/supabase/auth';

/**
 * GET /api/sessions?limit={number}
 * Fetches user's practice sessions
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
        const limit = searchParams.get('limit');
        const limitNum = limit ? parseInt(limit) : undefined;

        const sessions = await getUserPracticeSessions(user.id, limitNum);

        return NextResponse.json({
            success: true,
            data: sessions,
            count: sessions.length
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch sessions',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/sessions
 * Saves a completed practice session
 * 
 * Body: {
 *   topic_id: string;
 *   questions_data: object;
 *   score: number;
 *   total_questions: number;
 *   duration_seconds: number;
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
            questions_data,
            score,
            total_questions,
            duration_seconds
        } = body;

        if (!topic_id || !questions_data) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: topic_id, questions_data'
                },
                { status: 400 }
            );
        }

        const session = await savePracticeSession({
            user_id: user.id,
            topic_id,
            questions_data,
            score,
            total_questions,
            duration_seconds,
            completed_at: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            data: session
        });

    } catch (error) {
        console.error('Error saving session:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save session',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
