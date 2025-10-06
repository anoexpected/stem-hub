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
      description,
      topic_id,
      difficulty_level,
      time_limit_minutes,
      passing_score,
      questions,
      status,
      created_by,
    } = body;

    // Validate required fields
    if (!title || !description || !topic_id || !questions || !status) {
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

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Quiz must have at least one question' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title,
        description,
        topic_id,
        difficulty_level,
        time_limit_minutes,
        passing_score,
        status,
        created_by: user.id,
      })
      .select()
      .single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      return NextResponse.json(
        { error: 'Failed to create quiz' },
        { status: 500 }
      );
    }

    // Insert questions
    const questionsToInsert = questions.map((q: any, index: number) => ({
      quiz_id: quiz.id,
      question_type: q.type,
      question_text: q.question_text,
      points: q.points,
      explanation: q.explanation,
      correct_answer: q.correct_answer,
      order_number: index + 1,
    }));

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)
      .select();

    if (questionsError) {
      console.error('Error creating questions:', questionsError);
      // Rollback: delete the quiz
      await supabase.from('quizzes').delete().eq('id', quiz.id);
      return NextResponse.json(
        { error: 'Failed to create questions' },
        { status: 500 }
      );
    }

    // Insert options for multiple choice questions
    const optionsToInsert: any[] = [];
    questions.forEach((q: any, qIndex: number) => {
      if (q.type === 'multiple_choice' && q.options) {
        q.options.forEach((opt: any, optIndex: number) => {
          optionsToInsert.push({
            question_id: insertedQuestions[qIndex].id,
            option_text: opt.option_text,
            is_correct: opt.is_correct,
            order_number: optIndex + 1,
          });
        });
      }
    });

    if (optionsToInsert.length > 0) {
      const { error: optionsError } = await supabase
        .from('quiz_options')
        .insert(optionsToInsert);

      if (optionsError) {
        console.error('Error creating options:', optionsError);
        // Rollback: delete quiz and questions
        await supabase.from('quizzes').delete().eq('id', quiz.id);
        return NextResponse.json(
          { error: 'Failed to create quiz options' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      quiz,
      message: status === 'draft' ? 'Draft saved successfully' : 'Quiz submitted for review',
    });

  } catch (error: any) {
    console.error('Error in quizzes route:', error);

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
      .from('quizzes')
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

    const { data: quizzes, error } = await query;

    if (error) {
      console.error('Error fetching quizzes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quizzes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ quizzes });

  } catch (error: any) {
    console.error('Error in quizzes GET route:', error);

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
