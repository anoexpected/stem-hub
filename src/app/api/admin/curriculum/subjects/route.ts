import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

        // Check if code already exists for this exam board
        const { data: existing } = await supabase
            .from('subjects')
            .select('id')
            .eq('code', code)
            .eq('exam_board_id', exam_board_id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'A subject with this code already exists for this exam board' },
                { status: 400 }
            );
        }

        // Create subject
        const { data, error } = await supabase
            .from('subjects')
            .insert({
                name,
                code,
                exam_board_id,
                description,
                icon,
                color,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating subject:', error);
            return NextResponse.json(
                { error: 'Failed to create subject', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Subject created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error in create subject route:', error);

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
