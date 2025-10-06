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
        const { name, code, country, description, is_active } = body;

        if (!name || !code) {
            return NextResponse.json(
                { error: 'Name and code are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Update exam board
        const { data, error } = await supabase
            .from('exam_boards')
            .update({
                name,
                code,
                country,
                description,
                is_active,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating exam board:', error);
            return NextResponse.json(
                { error: 'Failed to update exam board', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Exam board updated successfully'
        });

    } catch (error: any) {
        console.error('Error in update exam board route:', error);

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

        // Check if exam board has subjects
        const { count } = await supabase
            .from('subjects')
            .select('*', { count: 'exact', head: true })
            .eq('exam_board_id', params.id);

        if (count && count > 0) {
            return NextResponse.json(
                { error: `Cannot delete exam board with ${count} linked subjects. Delete subjects first.` },
                { status: 400 }
            );
        }

        // Delete exam board
        const { error } = await supabase
            .from('exam_boards')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('Error deleting exam board:', error);
            return NextResponse.json(
                { error: 'Failed to delete exam board', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Exam board deleted successfully'
        });

    } catch (error: any) {
        console.error('Error in delete exam board route:', error);

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
