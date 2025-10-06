import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

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
        const { status, feedback } = body;

        if (!status || !['approved', 'rejected', 'changes_requested'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be: approved, rejected, or changes_requested' },
                { status: 400 }
            );
        }

        // Create review record
        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .insert({
                content_type: 'note',
                content_id: params.id,
                reviewer_id: user.id,
                status,
                feedback
            })
            .select()
            .single();

        if (reviewError) {
            console.error('Error creating review:', reviewError);
            return NextResponse.json(
                { error: 'Failed to create review' },
                { status: 500 }
            );
        }

        // Update note status
        const noteStatus = status === 'approved' ? 'approved' :
            status === 'rejected' ? 'rejected' : 'pending';

        const { error: updateError } = await supabase
            .from('notes')
            .update({
                status: noteStatus,
                published_at: status === 'approved' ? new Date().toISOString() : null
            })
            .eq('id', params.id);

        if (updateError) {
            console.error('Error updating note status:', updateError);
            return NextResponse.json(
                { error: 'Failed to update note status' },
                { status: 500 }
            );
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
