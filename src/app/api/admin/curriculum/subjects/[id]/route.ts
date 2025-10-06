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
        const { name, code, exam_board_id, description, icon, color, is_active } = body;

        if (!name || !code || !exam_board_id) {
            return NextResponse.json(
                { error: 'Name, code, and exam board are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Update subject
        const { data, error } = await supabase
            .from('subjects')
            .update({
                name,
                code,
                exam_board_id,
                description,
                icon,
                color,
                is_active,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating subject:', error);
            return NextResponse.json(
                { error: 'Failed to update subject', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Subject updated successfully'
        });

    } catch (error: any) {
        console.error('Error in update subject route:', error);

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

        // Check if subject has topics
        const { count } = await supabase
            .from('topics')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', params.id);

        if (count && count > 0) {
            return NextResponse.json(
                { error: `Cannot delete subject with ${count} linked topics. Delete topics first.` },
                { status: 400 }
            );
        }

        // Delete subject
        const { error } = await supabase
            .from('subjects')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('Error deleting subject:', error);
            return NextResponse.json(
                { error: 'Failed to delete subject', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Subject deleted successfully'
        });

    } catch (error: any) {
        console.error('Error in delete subject route:', error);

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
