import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import QuizCreatorForm from './components/QuizCreatorForm';

export default async function CreateQuizPage() {
  try {
    const user = await requireRole('contributor');

    const supabase = await createClient();

    // Fetch exam boards, subjects, and topics for selection
    // Only show topics available for contribution
    const [
      { data: examBoards },
      { data: subjects },
      { data: topics },
    ] = await Promise.all([
      supabase.from('exam_boards').select('id, name').order('name'),
      supabase.from('subjects').select('id, name, exam_board_id').order('name'),
      supabase.from('topics').select('id, name, subject_id').eq('available_for_contribution', true).order('name'),
    ]);

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
            Create Quiz
          </h1>
          <p className="text-gray-600 mt-2">
            Build interactive quizzes to help students practice and learn
          </p>
        </div>

        {/* Quiz Creator Form */}
        <QuizCreatorForm
          userId={user.id}
          examBoards={examBoards || []}
          subjects={subjects || []}
          topics={topics || []}
        />
      </div>
    );
  } catch {
    redirect('/auth/login?redirect=/contribute/create/quiz');
  }
}
