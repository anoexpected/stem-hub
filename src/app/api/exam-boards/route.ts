import { NextResponse } from 'next/server';
import { getExamBoards } from '@/lib/supabase/queries';

/**
 * GET /api/exam-boards
 * Fetches all active exam boards from the database
 */
export async function GET() {
    try {
        const examBoards = await getExamBoards();

        return NextResponse.json({
            success: true,
            data: examBoards,
            count: examBoards.length
        });
    } catch (error) {
        console.error('Error fetching exam boards:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch exam boards',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
