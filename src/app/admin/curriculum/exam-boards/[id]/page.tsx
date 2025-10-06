import { requireRole } from '@/middleware/requireRole';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ExamBoardForm from './ExamBoardForm';

export default async function EditExamBoardPage({ params }: { params: { id: string } }) {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/curriculum/exam-boards');
    }

    const supabase = await createClient();

    // Fetch exam board details
    const { data: examBoard, error } = await supabase
        .from('exam_boards')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !examBoard) {
        notFound();
    }

    // Fetch subject count
    const { count: subjectCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true })
        .eq('exam_board_id', examBoard.id);

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <Link
                href="/admin/curriculum/exam-boards"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Exam Boards</span>
            </Link>

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                    Edit Exam Board
                </h1>
                <p className="text-gray-600 mt-2">
                    Update exam board information and configuration
                </p>
            </div>

            {/* Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-blue-900 font-medium">Linked Subjects</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{subjectCount || 0}</p>
                    </div>
                    <div className="text-blue-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <ExamBoardForm examBoard={examBoard} />

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-6">
                <h2 className="text-xl font-bold text-red-900 mb-2 font-['Poppins']">
                    Danger Zone
                </h2>
                <p className="text-gray-600 mb-4">
                    Deleting this exam board will also delete all associated subjects and topics. This action cannot be undone.
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete Exam Board
                </button>
            </div>
        </div>
    );
}
