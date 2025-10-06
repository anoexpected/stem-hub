import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  FileText,
  HelpCircle,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
} from 'lucide-react';

export default async function ContributorDashboard() {
  try {
    const user = await requireRole('contributor');

    const supabase = await createClient();

    // Fetch contributor statistics
    const [
      { count: totalNotesCount },
      { count: publishedNotesCount },
      { count: pendingNotesCount },
      { count: totalQuizzesCount },
      { count: publishedQuizzesCount },
      { count: pendingQuizzesCount },
      { count: totalPastPapersCount },
      { count: publishedPastPapersCount },
      { count: pendingPastPapersCount },
      { data: recentNotes },
      { data: recentPastPapers },
    ] = await Promise.all([
      supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
      supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'published'),
      supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'pending'),
      supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
      supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'published'),
      supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'pending'),
      supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id),
      supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id).eq('status', 'published'),
      supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id).eq('status', 'pending'),
      supabase
        .from('notes')
        .select('id, title, status, created_at, views_count')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('past_papers')
        .select('id, title, status, created_at')
        .eq('uploaded_by', user.id)
        .order('created_at', { ascending: false })
        .limit(2),
    ]);

    const totalContent = (totalNotesCount || 0) + (totalQuizzesCount || 0) + (totalPastPapersCount || 0);
    const publishedContent = (publishedNotesCount || 0) + (publishedQuizzesCount || 0) + (publishedPastPapersCount || 0);
    const pendingContent = (pendingNotesCount || 0) + (pendingQuizzesCount || 0) + (pendingPastPapersCount || 0);

    // Debug logging
    console.log('Contributor Analytics:', {
      notes: { total: totalNotesCount, published: publishedNotesCount, pending: pendingNotesCount },
      quizzes: { total: totalQuizzesCount, published: publishedQuizzesCount, pending: pendingQuizzesCount },
      pastPapers: { total: totalPastPapersCount, published: publishedPastPapersCount, pending: pendingPastPapersCount },
      totals: { totalContent, publishedContent, pendingContent }
    });

    // Combine and sort recent content
    const recentContent = [
      ...(recentNotes || []).map(item => ({ ...item, type: 'note' })),
      ...(recentPastPapers || []).map(item => ({ ...item, type: 'past_paper' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    const totalViews = recentNotes?.reduce((sum, item) => sum + (item.views_count || 0), 0) || 0;

    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
            Welcome Back, Contributor! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Your contributions are helping students across Africa succeed.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Content</p>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
              {totalContent}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Published</p>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
              {publishedContent}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending Review</p>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
              {pendingContent}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Views</p>
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
              {totalViews}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/contribute/create/note"
              className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <FileText className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2 font-['Poppins']">
                Write a Note
              </h3>
              <p className="text-white/90 text-sm">
                Create study notes with LaTeX and images
              </p>
            </Link>

            <Link
              href="/contribute/create/quiz"
              className="bg-gradient-to-r from-[#8E44AD] to-[#9B59B6] text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <HelpCircle className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2 font-['Poppins']">
                Create a Quiz
              </h3>
              <p className="text-white/90 text-sm">
                Build interactive quizzes for students
              </p>
            </Link>

            <Link
              href="/contribute/create/past-paper"
              className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <FileCheck className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2 font-['Poppins']">
                Upload Past Paper
              </h3>
              <p className="text-white/90 text-sm">
                Share past papers with solutions
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Recent Content
          </h2>

          {recentContent && recentContent.length > 0 ? (
            <div className="space-y-3">
              {recentContent.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'past_paper' ? 'bg-[#1B2A4C]' : 'bg-[#2ECC71]'
                      }`}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()} • {item.type === 'past_paper' ? 'Past Paper' : 'Note'}
                        {item.views_count !== undefined && ` • ${item.views_count} views`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${item.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No content yet. Start creating!
            </p>
          )}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 font-['Poppins']">
            💡 Contributor Tips
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Align content with official exam board syllabi</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Use clear explanations and examples</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Include diagrams and visuals where helpful</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Review content before submitting</span>
            </li>
          </ul>
        </div>
      </div>
    );
  } catch {
    redirect('/auth/login?redirect=/contribute');
  }
}
