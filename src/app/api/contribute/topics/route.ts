import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/contribute/topics
 * Fetches topics available for contribution (contributor view only)
 */
export async function GET(request: NextRequest) {
    try {
        // Require contributor role
        await requireRole('contributor');
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const examBoardId = searchParams.get('exam_board_id');
        const subjectId = searchParams.get('subject_id');
        const priorityLevel = searchParams.get('priority_level');

        // Use the contributor view that only shows available topics
        let query = supabase
            .from('contributor_available_topics')
            .select('*');

        // Apply filters
        if (examBoardId) {
            query = query.eq('exam_board_id', examBoardId);
        }
        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }
        if (priorityLevel) {
            query = query.eq('priority_level', priorityLevel);
        }

        const { data: topics, error } = await query;

        if (error) {
            console.error('Error fetching contributor topics:', error);
            return NextResponse.json(
                { error: 'Failed to fetch topics' },
                { status: 500 }
            );
        }

        // Group topics by urgency for better UX
        const groupedTopics = {
            urgent: topics?.filter(t => t.priority_level === 'urgent') || [],
            high: topics?.filter(t => t.priority_level === 'high') || [],
            medium: topics?.filter(t => t.priority_level === 'medium') || [],
            low: topics?.filter(t => t.priority_level === 'low') || [],
        };

        return NextResponse.json({
            topics: topics || [],
            grouped: groupedTopics,
            total: topics?.length || 0,
            message: topics?.length === 0 ? 'No topics available for contribution at this time' : undefined,
        });

    } catch (error: any) {
        console.error('Error in contributor topics:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
