import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify admin role
    const user = await requireRole('admin');

    const body = await request.json();
    const { contentType, contentId } = body;

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update content status to published
    const tableName = contentType === 'note' ? 'notes' :
      contentType === 'quiz' ? 'quizzes' : 'past_papers';

    const updateData: any = {
      status: 'published',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    };

    // Add published_at for notes
    if (contentType === 'note') {
      updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', contentId);

    if (updateError) {
      console.error('Error approving content:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve content' },
        { status: 500 }
      );
    }

    // Log admin action
    await supabase.from('admin_actions').insert({
      admin_id: user.id,
      action_type: 'approve_content',
      target_type: contentType,
      target_id: contentId,
      details: { status: 'published' },
    });

    // TODO: Send notification to contributor

    return NextResponse.json({
      success: true,
      message: 'Content approved successfully'
    });

  } catch (error: any) {
    console.error('Error in approve route:', error);

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
