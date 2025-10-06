import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReviewQuizCard from './components/ReviewQuizCard';
import { HelpCircle } from 'lucide-react';

export default async function ReviewQuizzesPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/review/quizzes');
    }

    const supabase = await createClient();

    // Fetch pending quizzes with related data
    // Use users!quizzes_created_by_fkey to specify we want the creator's info
    const { data: pendingQuizzes, error } = await supabase
        .from('quizzes')
        .select(`
      *,
      users!quizzes_created_by_fkey(id, full_name, email),
      topics(id, name, subjects(id, name, exam_boards(id, name)))
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pending quizzes:', error);
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        Review Quizzes
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {pendingQuizzes?.length || 0} quizzes pending review
                    </p>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium">Quizzes</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                        <option>All Exam Boards</option>
                    </select>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                        <option>All Subjects</option>
                    </select>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                        <option>Sort by: Newest</option>
                        <option>Sort by: Oldest</option>
                        <option>Sort by: Title</option>
                    </select>
                </div>
            </div>

            {/* Quizzes List */}
            {pendingQuizzes && pendingQuizzes.length > 0 ? (
                <div className="space-y-6">
                    {pendingQuizzes.map((quiz: any) => (
                        <ReviewQuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
                        No Quizzes to Review
                    </h3>
                    <p className="text-gray-600">
                        All quizzes have been reviewed! Check back later for new submissions.
                    </p>
                </div>
            )}
        </div>
    );
}
