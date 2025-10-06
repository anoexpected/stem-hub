import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const subjectId = searchParams.get('subject_id');
        const topicId = searchParams.get('topic_id');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('most_asked_questions')
            .select(`
                *,
                topics (
                    id,
                    name
                ),
                subjects (
                    id,
                    name
                ),
                notes!most_asked_questions_solution_note_id_fkey (
                    id,
                    title
                )
            `, { count: 'exact' })
            .order('frequency_count', { ascending: false })
            .range(offset, offset + limit - 1);

        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }

        if (topicId) {
            query = query.eq('topic_id', topicId);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching MAQ:', error);
            return NextResponse.json(
                { error: 'Failed to fetch most asked questions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            questions: data,
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
