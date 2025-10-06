import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify admin role
    const user = await requireRole('admin');

    const body = await request.json();
    const { contentType, contentId, feedback } = body;

    if (!contentType || !contentId || !feedback) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update content status to rejected
    const tableName = contentType === 'note' ? 'notes' :
      contentType === 'quiz' ? 'quizzes' : 'past_papers';

    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        review_feedback: feedback,
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error rejecting content:', updateError);
      return NextResponse.json(
        { error: 'Failed to reject content' },
        { status: 500 }
      );
    }

    // Log admin action
    await supabase.from('admin_actions').insert({
      admin_id: user.id,
      action_type: 'reject_content',
      target_type: contentType,
      target_id: contentId,
      details: { status: 'rejected', feedback },
    });

    // TODO: Send notification to contributor with feedback

    return NextResponse.json({
      success: true,
      message: 'Content rejected successfully'
    });

  } catch (error: any) {
    console.error('Error in reject route:', error);

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
