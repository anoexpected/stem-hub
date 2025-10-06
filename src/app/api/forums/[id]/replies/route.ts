import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('forum_replies')
            .select(`
                *,
                users!forum_replies_created_by_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `, { count: 'exact' })
            .eq('discussion_id', params.id)
            .order('is_solution', { ascending: false })
            .order('created_at', { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching forum replies:', error);
            return NextResponse.json(
                { error: 'Failed to fetch replies' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            replies: data,
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

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Reply content is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('forum_replies')
            .insert({
                discussion_id: params.id,
                content,
                created_by: user.id
            })
            .select(`
                *,
                users!forum_replies_created_by_fkey (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .single();

        if (error) {
            console.error('Error creating forum reply:', error);
            return NextResponse.json(
                { error: 'Failed to create reply' },
                { status: 500 }
            );
        }

        // Increment views count on discussion
        await supabase
            .from('forum_discussions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', params.id);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
