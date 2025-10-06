import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ImprovedNoteEditorForm from './components/ImprovedNoteEditorForm';

export default async function CreateNotePage() {
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
      <ImprovedNoteEditorForm
        userId={user.id}
        examBoards={examBoards || []}
        subjects={subjects || []}
        topics={topics || []}
      />
    );
  } catch {
    redirect('/auth/login?redirect=/contribute/create/note');
  }
}
