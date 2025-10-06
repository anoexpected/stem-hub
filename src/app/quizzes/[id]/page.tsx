import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import QuizPlayer from './components/QuizPlayer';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const supabase = await createClient();

  // Fetch quiz with questions and options
  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      topics(
        id, 
        name,
        subjects(
          id, 
          name,
          exam_boards(id, name)
        )
      ),
      quiz_questions(
        *,
        quiz_options(*)
      )
    `)
    .eq('id', params.id)
    .eq('status', 'published')
    .single();

  if (error || !quiz) {
    notFound();
  }

  // Sort questions by order
  if (quiz.quiz_questions) {
    quiz.quiz_questions.sort((a: any, b: any) => a.order_number - b.order_number);

    // Sort options for each question
    quiz.quiz_questions.forEach((question: any) => {
      if (question.quiz_options) {
        question.quiz_options.sort((a: any, b: any) => a.order_number - b.order_number);
      }
    });
  }

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/quizzes/' + params.id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizPlayer quiz={quiz} userId={user.id} />
    </div>
  );
}
