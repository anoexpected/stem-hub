import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabase
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
            `)
            .eq('id', params.id)
            .single();

        if (error) {
            console.error('Error fetching note:', error);
            return NextResponse.json(
                { error: 'Note not found' },
                { status: 404 }
            );
        }

        // Increment view count
        await supabase
            .from('notes')
            .update({ views_count: (data.views_count || 0) + 1 })
            .eq('id', params.id);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function PUT(
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
        const { title, content, content_type, tags, status } = body;

        // Verify ownership
        const { data: existingNote, error: fetchError } = await supabase
            .from('notes')
            .select('created_by')
            .eq('id', params.id)
            .single();

        if (fetchError || !existingNote) {
            return NextResponse.json(
                { error: 'Note not found' },
                { status: 404 }
            );
        }

        if (existingNote.created_by !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden: You can only edit your own notes' },
                { status: 403 }
            );
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (content_type) updateData.content_type = content_type;
        if (tags) updateData.tags = tags;
        if (status) updateData.status = status;

        const { data, error } = await supabase
            .from('notes')
            .update(updateData)
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating note:', error);
            return NextResponse.json(
                { error: 'Failed to update note' },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        // Verify ownership
        const { data: existingNote, error: fetchError } = await supabase
            .from('notes')
            .select('created_by')
            .eq('id', params.id)
            .single();

        if (fetchError || !existingNote) {
            return NextResponse.json(
                { error: 'Note not found' },
                { status: 404 }
            );
        }

        if (existingNote.created_by !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden: You can only delete your own notes' },
                { status: 403 }
            );
        }

        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('Error deleting note:', error);
            return NextResponse.json(
                { error: 'Failed to delete note' },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
