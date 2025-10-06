import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const topicId = searchParams.get('topic_id');
        const subjectId = searchParams.get('subject_id');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('forum_discussions')
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
                users!forum_discussions_created_by_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `, { count: 'exact' })
            .order('is_pinned', { ascending: false })
            .order('updated_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (topicId) {
            query = query.eq('topic_id', topicId);
        }

        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching forum discussions:', error);
            return NextResponse.json(
                { error: 'Failed to fetch forum discussions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            discussions: data,
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
        const { topic_id, subject_id, title, content } = body;

        if (!title || !content || (!topic_id && !subject_id)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('forum_discussions')
            .insert({
                topic_id,
                subject_id,
                title,
                content,
                created_by: user.id
            })
            .select(`
                *,
                users!forum_discussions_created_by_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .single();

        if (error) {
            console.error('Error creating forum discussion:', error);
            return NextResponse.json(
                { error: 'Failed to create discussion' },
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
