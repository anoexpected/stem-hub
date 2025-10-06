import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/middleware/requireRole';
import { notFound } from 'next/navigation';
import SubjectForm from './SubjectForm';

export default async function EditSubjectPage({ params }: { params: { id: string } }) {
    await requireRole('admin');

    const supabase = await createClient();

    // Fetch subject details
    const { data: subject, error } = await supabase
        .from('subjects')
        .select(`
      *,
      exam_boards (
        id,
        name,
        code
      )
    `)
        .eq('id', params.id)
        .single();

    if (error || !subject) {
        console.error('Error fetching subject:', error);
        notFound();
    }

    // Fetch all exam boards for the dropdown
    const { data: examBoards } = await supabase
        .from('exam_boards')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name');

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Subject</h1>
                <p className="text-gray-600 mt-2">
                    Update subject information and settings
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <SubjectForm
                    subject={subject}
                    examBoards={examBoards || []}
                />
            </div>
        </div>
    );
}
