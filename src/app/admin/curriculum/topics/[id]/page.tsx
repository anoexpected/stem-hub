import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/middleware/requireRole';
import { notFound } from 'next/navigation';
import TopicForm from './TopicForm';

export default async function EditTopicPage({ params }: { params: { id: string } }) {
    await requireRole('admin');

    const supabase = await createClient();

    // Fetch topic details
    const { data: topic, error } = await supabase
        .from('topics')
        .select(`
      *,
      subjects (
        id,
        name,
        code,
        exam_board_id
      )
    `)
        .eq('id', params.id)
        .single();

    if (error || !topic) {
        console.error('Error fetching topic:', error);
        notFound();
    }

    // Fetch all exam boards
    const { data: examBoards } = await supabase
        .from('exam_boards')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name');

    // Fetch subjects for the current exam board
    const { data: subjects } = await supabase
        .from('subjects')
        .select('id, name, code, exam_board_id')
        .eq('exam_board_id', topic.subjects.exam_board_id)
        .eq('is_active', true)
        .order('name');

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Topic</h1>
                <p className="text-gray-600 mt-2">
                    Update topic information and settings
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <TopicForm
                    topic={topic}
                    examBoards={examBoards || []}
                    initialSubjects={subjects || []}
                />
            </div>
        </div>
    );
}
