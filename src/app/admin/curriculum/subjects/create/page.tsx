import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/middleware/requireRole';
import SubjectCreateForm from './SubjectCreateForm';

export default async function CreateSubjectPage() {
    await requireRole('admin');

    const supabase = await createClient();

    // Fetch all exam boards for the dropdown
    const { data: examBoards } = await supabase
        .from('exam_boards')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name');

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Subject</h1>
                <p className="text-gray-600 mt-2">
                    Add a new subject to the curriculum
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <SubjectCreateForm examBoards={examBoards || []} />
            </div>
        </div>
    );
}
