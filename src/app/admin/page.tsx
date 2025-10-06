import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StatsCard from './components/StatsCard';
import {
  FileCheck,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default async function AdminDashboard() {
  try {
    await requireRole('admin');
  } catch {
    redirect('/auth/login?redirect=/admin');
  }

  const supabase = await createClient();

  // Calculate date ranges for trend analysis
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Fetch dashboard statistics
  const [
    { count: pendingNotesCount },
    { count: totalQuizzesCount },
    { count: totalUsersCount },
    { count: contributorsCount },
    { count: publishedNotesCount },
    { count: studentsCount },
    { count: currentMonthUsersCount },
    { count: lastMonthUsersCount },
    { count: currentMonthPublishedCount },
    { count: lastMonthPublishedCount },
  ] = await Promise.all([
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('quizzes').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'contributor'),
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    // Trend data for users
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', currentMonthStart.toISOString()),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStart.toISOString()).lte('created_at', lastMonthEnd.toISOString()),
    // Trend data for published notes
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'published').gte('published_at', currentMonthStart.toISOString()),
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'published').gte('published_at', lastMonthStart.toISOString()).lte('published_at', lastMonthEnd.toISOString()),
  ]);

  const pendingReviews = (pendingNotesCount || 0);
  const publishedContent = (publishedNotesCount || 0);

  // Calculate trends (percentage change from last month)
  const calculateTrend = (current: number | null, previous: number | null) => {
    if (!previous || previous === 0) return null; // No trend if no previous data
    const currentVal = current || 0;
    const percentChange = ((currentVal - previous) / previous) * 100;
    return {
      value: Math.round(Math.abs(percentChange)),
      isPositive: percentChange >= 0,
    };
  };

  const usersTrend = calculateTrend(currentMonthUsersCount, lastMonthUsersCount);
  const contentTrend = calculateTrend(currentMonthPublishedCount, lastMonthPublishedCount);

  // Fetch recent activity
  const { data: recentNotes } = await supabase
    .from('notes')
    .select('id, title, status, created_at, users(full_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with STEM Hub today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Pending Reviews"
          value={pendingReviews}
          icon={FileCheck}
          color="gold"
        />

        <StatsCard
          title="Total Users"
          value={totalUsersCount || 0}
          icon={Users}
          color="blue"
          trend={usersTrend || undefined}
        />

        <StatsCard
          title="Published Content"
          value={publishedContent}
          icon={BookOpen}
          color="green"
          trend={contentTrend || undefined}
        />

        <StatsCard
          title="Contributors"
          value={contributorsCount || 0}
          icon={TrendingUp}
          color="purple"
        />

        <StatsCard
          title="Notes Pending"
          value={pendingNotesCount || 0}
          icon={Clock}
          color="gold"
        />

        <StatsCard
          title="Total Quizzes"
          value={totalQuizzesCount || 0}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 font-['Poppins']">
          Recent Activity
        </h2>

        {recentNotes && recentNotes.length > 0 ? (
          <div className="space-y-3">
            {recentNotes.map((note: any) => (
              <div
                key={note.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{note.title}</p>
                    <p className="text-sm text-gray-600">
                      by {note.users?.full_name || note.users?.email || 'Unknown'} •{' '}
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${note.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : note.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {note.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/admin/review"
          className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 font-['Poppins']">
                Review Content
              </h3>
              <p className="text-white/90">
                {pendingReviews} items waiting for review
              </p>
            </div>
            <FileCheck className="w-12 h-12 opacity-80" />
          </div>
        </a>

        <a
          href="/admin/curriculum/exam-boards"
          className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 font-['Poppins']">
                Manage Curriculum
              </h3>
              <p className="text-white/90">
                Exam boards, subjects, and topics
              </p>
            </div>
            <BookOpen className="w-12 h-12 opacity-80" />
          </div>
        </a>
      </div>
    </div>
  );
}
