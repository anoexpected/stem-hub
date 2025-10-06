import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const topicId = searchParams.get('topic_id');
        const status = searchParams.get('status') || 'approved';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('notes')
            .select(`
                *,
                topics (
                    id,
                    name,
                    subjects (
                        id,
                        name,
                        exam_boards (
                            id,
                            name,
                            code
                        )
                    )
                ),
                users!notes_created_by_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `, { count: 'exact' })
            .eq('status', status)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (topicId) {
            query = query.eq('topic_id', topicId);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching notes:', error);
            return NextResponse.json(
                { error: 'Failed to fetch notes' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            notes: data,
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
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { topic_id, title, content, content_type = 'markdown', tags } = body;

        if (!topic_id || !title || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: topic_id, title, content' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('notes')
            .insert({
                topic_id,
                title,
                content,
                content_type,
                tags,
                created_by: user.id,
                status: 'draft',
                version: 1
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating note:', error);
            return NextResponse.json(
                { error: 'Failed to create note' },
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
