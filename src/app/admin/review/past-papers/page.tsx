import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReviewPaperCard from './components/ReviewPaperCard';
import { FileCheck } from 'lucide-react';

export default async function ReviewPastPapersPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/review/past-papers');
    }

    const supabase = await createClient();

    // Fetch pending past papers with related data
    // Use users!past_papers_uploaded_by_fkey to specify we want the uploader's info
    const { data: pendingPapers, error } = await supabase
        .from('past_papers')
        .select(`
      *,
      users!past_papers_uploaded_by_fkey(id, full_name, email),
      subjects(id, name, exam_boards(id, name))
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pending past papers:', error);
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        Review Past Papers
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {pendingPapers?.length || 0} past papers pending review
                    </p>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                    <FileCheck className="w-5 h-5" />
                    <span className="font-medium">Past Papers</span>
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
                        <option>All Years</option>
                    </select>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                        <option>Sort by: Newest</option>
                        <option>Sort by: Oldest</option>
                        <option>Sort by: Year</option>
                    </select>
                </div>
            </div>

            {/* Past Papers List */}
            {pendingPapers && pendingPapers.length > 0 ? (
                <div className="space-y-6">
                    {pendingPapers.map((paper: any) => (
                        <ReviewPaperCard key={paper.id} paper={paper} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
                        No Past Papers to Review
                    </h3>
                    <p className="text-gray-600">
                        All past papers have been reviewed! Check back later for new submissions.
                    </p>
                </div>
            )}
        </div>
    );
}
