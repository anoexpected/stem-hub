import { NextRequest, NextResponse } from 'next/server';
import { getSubjectsByExamBoard } from '@/lib/supabase/queries';

/**
 * GET /api/subjects?exam_board_id={id}
 * Fetches all active subjects for a specific exam board
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const examBoardId = searchParams.get('exam_board_id');

        if (!examBoardId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing exam_board_id parameter'
                },
                { status: 400 }
            );
        }

        const subjects = await getSubjectsByExamBoard(examBoardId);

        return NextResponse.json({
            success: true,
            data: subjects,
            count: subjects.length,
            exam_board_id: examBoardId
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch subjects',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
