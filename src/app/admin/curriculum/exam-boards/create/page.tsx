import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/middleware/requireRole';
import ExamBoardCreateForm from './ExamBoardCreateForm';

export default async function CreateExamBoardPage() {
    await requireRole('admin');

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Exam Board</h1>
                <p className="text-gray-600 mt-2">
                    Add a new exam board to the system
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <ExamBoardCreateForm />
            </div>
        </div>
    );
}
