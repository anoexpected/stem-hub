import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BarChart3, TrendingUp, Users, FileText, Activity } from 'lucide-react';

export default async function AnalyticsPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/analytics');
    }

    const supabase = await createClient();

    // Calculate date ranges for trend analysis
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Fetch analytics data
    const [
        { count: totalUsers },
        { count: totalNotes },
        { count: totalQuizzes },
        { count: totalPapers },
        { count: publishedNotes },
        { count: publishedQuizzes },
        { count: currentMonthUsers },
        { count: lastMonthUsers },
        { count: currentMonthPapers },
        { count: lastMonthPapers },
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('notes').select('*', { count: 'exact', head: true }),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }),
        supabase.from('past_papers').select('*', { count: 'exact', head: true }),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        // Trend data
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', currentMonthStart.toISOString()),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStart.toISOString()).lte('created_at', lastMonthEnd.toISOString()),
        supabase.from('past_papers').select('*', { count: 'exact', head: true }).gte('created_at', currentMonthStart.toISOString()),
        supabase.from('past_papers').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStart.toISOString()).lte('created_at', lastMonthEnd.toISOString()),
    ]);

    // Calculate trends
    const calculateTrend = (current: number | null, previous: number | null): string => {
        if (!previous || previous === 0) return 'No previous data';
        const currentVal = current || 0;
        const percentChange = ((currentVal - previous) / previous) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        return `${sign}${Math.round(percentChange)}% this month`;
    };

    const usersTrend = calculateTrend(currentMonthUsers, lastMonthUsers);
    const papersTrend = calculateTrend(currentMonthPapers, lastMonthPapers);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Platform insights and performance metrics
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        {totalUsers || 0}
                    </p>
                    <p className="text-sm text-green-600 mt-2">{usersTrend}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Notes</p>
                    <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        {totalNotes || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{publishedNotes || 0} published</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Quizzes</p>
                    <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        {totalQuizzes || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{publishedQuizzes || 0} published</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Past Papers</p>
                    <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        {totalPapers || 0}
                    </p>
                    <p className="text-sm text-green-600 mt-2">{papersTrend}</p>
                </div>
            </div>

            {/* Content Performance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Poppins']">
                    Content Performance
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Notes</p>
                                <p className="text-sm text-gray-600">Average approval rate</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                {totalNotes ? Math.round((publishedNotes! / totalNotes) * 100) : 0}%
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Quizzes</p>
                                <p className="text-sm text-gray-600">Average approval rate</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                {totalQuizzes ? Math.round((publishedQuizzes! / totalQuizzes) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] rounded-lg p-8 text-center text-white">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2 font-['Poppins']">
                    More Analytics Coming Soon
                </h3>
                <p className="text-white/80">
                    Advanced charts, user engagement metrics, and detailed reports will be available in the next update.
                </p>
            </div>
        </div>
    );
}
