import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const subjectId = searchParams.get('subject_id');
        const examBoardId = searchParams.get('exam_board_id');
        const year = searchParams.get('year');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('past_papers')
            .select(`
                *,
                subjects (
                    id,
                    name,
                    code
                ),
                exam_boards (
                    id,
                    name,
                    code,
                    country
                ),
                users!past_papers_uploaded_by_fkey (
                    id,
                    full_name
                )
            `, { count: 'exact' })
            .eq('status', 'approved')
            .order('year', { ascending: false })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }

        if (examBoardId) {
            query = query.eq('exam_board_id', examBoardId);
        }

        if (year) {
            query = query.eq('year', parseInt(year));
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching past papers:', error);
            return NextResponse.json(
                { error: 'Failed to fetch past papers' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            pastPapers: data,
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

export async function POST(request: NextRequest) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            subject_id,
            exam_board_id,
            title,
            year,
            paper_number,
            season,
            file_url,
            file_size_kb
        } = body;

        if (!subject_id || !exam_board_id || !title || !year || !file_url) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('past_papers')
            .insert({
                subject_id,
                exam_board_id,
                title,
                year: parseInt(year),
                paper_number,
                season,
                file_url,
                file_size_kb,
                uploaded_by: user.id,
                status: 'approved' // Auto-approve for now, can add review workflow later
            })
            .select()
            .single();

        if (error) {
            console.error('Error uploading past paper:', error);
            return NextResponse.json(
                { error: 'Failed to upload past paper' },
                { status: 500 }
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
