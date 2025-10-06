import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

        // Check if code already exists
        const { data: existing } = await supabase
            .from('exam_boards')
            .select('id')
            .eq('code', code)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'An exam board with this code already exists' },
                { status: 400 }
            );
        }

        // Create exam board
        const { data, error } = await supabase
            .from('exam_boards')
            .insert({
                name,
                code,
                country,
                description,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating exam board:', error);
            return NextResponse.json(
                { error: 'Failed to create exam board', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Exam board created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error in create exam board route:', error);

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
