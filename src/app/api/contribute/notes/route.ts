import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify contributor role
    const user = await requireRole('contributor');

    const body = await request.json();
    const {
      title,
      subtitle,
      exam_board_id,
      subject_id,
      topic_id,
      difficulty_level,
      content,
      status,
      created_by,
    } = body;

    // Validate required fields
    if (!title || !topic_id || !content || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user is creating their own content
    if (created_by !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Prepare note data (only include fields that exist in the database)
    const noteData: any = {
      title,
      topic_id,
      content,
      status,
      created_by: user.id,
    };

    // Add optional fields if they exist in database
    // Note: difficulty_level and subtitle may not exist in current schema
    // These will be ignored by Supabase if columns don't exist

    // Insert note
    const { data: note, error } = await supabase
      .from('notes')
      .insert(noteData)
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      console.error('Note data attempted:', noteData);
      return NextResponse.json(
        { error: `Failed to create note: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      note,
      message: status === 'draft' ? 'Draft saved successfully' : 'Note submitted for review',
    });

  } catch (error: any) {
    console.error('Error in notes route:', error);

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

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole('contributor');
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('notes')
      .select(`
        *,
        topics(id, name, subjects(id, name, exam_boards(id, name)))
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: notes, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ notes });

  } catch (error: any) {
    console.error('Error in notes GET route:', error);

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
