import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin role
        await requireRole('admin');

        const body = await request.json();
        const { name, subject_id, description, difficulty_level, order_index, is_active } = body;

        if (!name || !subject_id) {
            return NextResponse.json(
                { error: 'Name and subject are required' },
                { status: 400 }
            );
        }

        if (difficulty_level < 1 || difficulty_level > 5) {
            return NextResponse.json(
                { error: 'Difficulty level must be between 1 and 5' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Update topic
        const { data, error } = await supabase
            .from('topics')
            .update({
                name,
                subject_id,
                description,
                difficulty_level,
                order_index,
                is_active,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating topic:', error);
            return NextResponse.json(
                { error: 'Failed to update topic', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Topic updated successfully'
        });

    } catch (error: any) {
        console.error('Error in update topic route:', error);

        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin role
        await requireRole('admin');

        const supabase = await createClient();

        // Check if topic has related content
        const [notesCheck, quizzesCheck, questionsCheck, papersCheck] = await Promise.all([
            supabase.from('notes').select('*', { count: 'exact', head: true }).eq('topic_id', params.id),
            supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('topic_id', params.id),
            supabase.from('questions').select('*', { count: 'exact', head: true }).eq('topic_id', params.id),
            supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('topic_id', params.id),
        ]);

        const totalContent = (notesCheck.count || 0) + (quizzesCheck.count || 0) +
            (questionsCheck.count || 0) + (papersCheck.count || 0);

        if (totalContent > 0) {
            return NextResponse.json(
                { error: `Cannot delete topic with ${totalContent} linked content items. Delete content first.` },
                { status: 400 }
            );
        }

        // Delete topic
        const { error } = await supabase
            .from('topics')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('Error deleting topic:', error);
            return NextResponse.json(
                { error: 'Failed to delete topic', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Topic deleted successfully'
        });

    } catch (error: any) {
        console.error('Error in delete topic route:', error);

        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
