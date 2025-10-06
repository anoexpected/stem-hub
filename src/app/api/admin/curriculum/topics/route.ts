import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

        // Create topic
        const { data, error } = await supabase
            .from('topics')
            .insert({
                name,
                subject_id,
                description,
                difficulty_level,
                order_index: order_index ?? 0,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating topic:', error);
            return NextResponse.json(
                { error: 'Failed to create topic', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Topic created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error in create topic route:', error);

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
