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
      exam_board_id,
      subject_id,
      year,
      paper_number,
      session,
      paper_type,
      question_paper_url,
      marking_scheme_url,
      topic_ids,
      status,
      created_by,
    } = body;

    // Validate required fields
    if (!title || !exam_board_id || !subject_id || !year || !paper_number || !session || !status) {
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

    // Validate file URLs
    if (paper_type === 'question_paper' && !question_paper_url) {
      return NextResponse.json(
        { error: 'Question paper file is required' },
        { status: 400 }
      );
    }
    if (paper_type === 'marking_scheme' && !marking_scheme_url) {
      return NextResponse.json(
        { error: 'Marking scheme file is required' },
        { status: 400 }
      );
    }
    if (paper_type === 'both' && (!question_paper_url || !marking_scheme_url)) {
      return NextResponse.json(
        { error: 'Both files are required' },
        { status: 400 }
      );
    }

    // Topics are optional for past papers (they cover multiple topics)
    // No validation needed - just store if provided

    const supabase = await createClient();

    // Determine which file URL to use as primary
    // If both files provided, use question paper as primary
    const file_url = question_paper_url || marking_scheme_url;

    if (!file_url) {
      return NextResponse.json(
        { error: 'At least one file must be uploaded' },
        { status: 400 }
      );
    }

    // Insert past paper
    const { data: pastPaper, error: paperError } = await supabase
      .from('past_papers')
      .insert({
        title,
        exam_board_id,
        subject_id,
        year,
        paper_number,
        season: session,  // Map 'session' param to 'season' column
        file_url,  // Use the primary file URL
        status,
        uploaded_by: user.id,  // Database uses 'uploaded_by' not 'created_by'
      })
      .select()
      .single();

    if (paperError) {
      console.error('Error creating past paper:', paperError);
      return NextResponse.json(
        { error: `Failed to create past paper: ${paperError.message}` },
        { status: 500 }
      );
    }

    // Topics are optional - only associate if provided and table exists
    if (topic_ids && Array.isArray(topic_ids) && topic_ids.length > 0) {
      const topicAssociations = topic_ids.map((topic_id: string) => ({
        past_paper_id: pastPaper.id,
        topic_id,
      }));

      // Try to insert topics, but don't fail if table doesn't exist
      const { error: topicsError } = await supabase
        .from('past_paper_topics')
        .insert(topicAssociations);

      if (topicsError) {
        console.warn('Could not associate topics (table may not exist):', topicsError);
        // Don't rollback - past paper is still valid without topics
      }
    }

    return NextResponse.json({
      success: true,
      pastPaper,
      message: status === 'draft' ? 'Draft saved successfully' : 'Past paper submitted for review',
    });

  } catch (error: any) {
    console.error('Error in past-papers route:', error);

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
      .from('past_papers')
      .select(`
        *,
        exam_boards(id, name),
        subjects(id, name)
      `)
      .eq('uploaded_by', user.id)  // Database uses 'uploaded_by' not 'created_by'
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: pastPapers, error } = await query;

    if (error) {
      console.error('Error fetching past papers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch past papers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ pastPapers });

  } catch (error: any) {
    console.error('Error in past-papers GET route:', error);

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
