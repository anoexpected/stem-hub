import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
    TrendingUp,
    FileText,
    Eye,
    ThumbsUp,
    CheckCircle,
    Clock,
    Award,
    Target,
    BarChart3,
} from 'lucide-react';

export default async function StatsPage() {
    try {
        const user = await requireRole('contributor');
        const supabase = await createClient();

        // Fetch comprehensive statistics
        const [
            { data: allNotes },
            { count: totalNotesCount },
            { count: publishedNotesCount },
            { count: pendingNotesCount },
            { count: draftNotesCount },
            { count: totalQuizzesCount },
            { count: publishedQuizzesCount },
            { count: totalPastPapersCount },
        ] = await Promise.all([
            supabase
                .from('notes')
                .select('views_count, likes_count, created_at, status')
                .eq('created_by', user.id),
            supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
            supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'published'),
            supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'pending'),
            supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'draft'),
            supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
            supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('created_by', user.id).eq('status', 'published'),
            supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id),
        ]);

        // Calculate metrics
        const totalViews = allNotes?.reduce((sum, note) => sum + (note.views_count || 0), 0) || 0;
        const totalLikes = allNotes?.reduce((sum, note) => sum + (note.likes_count || 0), 0) || 0;
        const totalContent = (totalNotesCount || 0) + (totalQuizzesCount || 0) + (totalPastPapersCount || 0);
        const publishedContent = (publishedNotesCount || 0) + (publishedQuizzesCount || 0);
        const publishRate = totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0;

        // Calculate engagement rate
        const engagementRate = publishedContent > 0 ? Math.round((totalLikes / publishedContent)) : 0;

        // Get recent performance (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentContent = allNotes?.filter(note =>
            new Date(note.created_at) >= thirtyDaysAgo && note.status === 'published'
        ).length || 0;

        return (
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        Your Statistics 📊
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track your impact and contribution to STEM Hub
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] text-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white/90 text-sm">Total Content</p>
                            <FileText className="w-6 h-6 text-white/80" />
                        </div>
                        <p className="text-4xl font-bold font-['Poppins']">
                            {totalContent}
                        </p>
                        <p className="text-white/80 text-xs mt-2">
                            {totalNotesCount} notes • {totalQuizzesCount} quizzes • {totalPastPapersCount} papers
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white/90 text-sm">Total Views</p>
                            <Eye className="w-6 h-6 text-white/80" />
                        </div>
                        <p className="text-4xl font-bold font-['Poppins']">
                            {totalViews.toLocaleString()}
                        </p>
                        <p className="text-white/80 text-xs mt-2">
                            Across all published content
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white/90 text-sm">Total Likes</p>
                            <ThumbsUp className="w-6 h-6 text-white/80" />
                        </div>
                        <p className="text-4xl font-bold font-['Poppins']">
                            {totalLikes}
                        </p>
                        <p className="text-white/80 text-xs mt-2">
                            {engagementRate} avg per content
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white/90 text-sm">Publish Rate</p>
                            <Target className="w-6 h-6 text-white/80" />
                        </div>
                        <p className="text-4xl font-bold font-['Poppins']">
                            {publishRate}%
                        </p>
                        <p className="text-white/80 text-xs mt-2">
                            {publishedContent} of {totalContent} approved
                        </p>
                    </div>
                </div>

                {/* Content Status Breakdown */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Poppins']">
                        Content Status Breakdown
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-green-900 font-['Poppins']">
                                {publishedNotesCount || 0}
                            </p>
                            <p className="text-sm text-green-700">Published</p>
                        </div>

                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-yellow-900 font-['Poppins']">
                                {pendingNotesCount || 0}
                            </p>
                            <p className="text-sm text-yellow-700">Pending Review</p>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {draftNotesCount || 0}
                            </p>
                            <p className="text-sm text-gray-700">Drafts</p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-purple-900 font-['Poppins']">
                                {recentContent}
                            </p>
                            <p className="text-sm text-purple-700">Last 30 Days</p>
                        </div>
                    </div>
                </div>

                {/* Content Type Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 font-['Poppins']">
                                Notes
                            </h3>
                            <FileText className="w-6 h-6 text-[#2ECC71]" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold">{totalNotesCount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Published:</span>
                                <span className="font-semibold text-green-600">{publishedNotesCount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Views:</span>
                                <span className="font-semibold text-blue-600">{totalViews.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 font-['Poppins']">
                                Quizzes
                            </h3>
                            <BarChart3 className="w-6 h-6 text-[#8E44AD]" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold">{totalQuizzesCount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Published:</span>
                                <span className="font-semibold text-green-600">{publishedQuizzesCount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Attempts:</span>
                                <span className="font-semibold text-purple-600">-</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 font-['Poppins']">
                                Past Papers
                            </h3>
                            <Award className="w-6 h-6 text-[#1B2A4C]" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold">{totalPastPapersCount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Downloads:</span>
                                <span className="font-semibold text-blue-600">-</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Impact:</span>
                                <span className="font-semibold text-green-600">High</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 font-['Poppins'] flex items-center">
                        <Award className="w-6 h-6 text-yellow-600 mr-2" />
                        Achievements & Milestones
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {publishedContent >= 1 && (
                            <div className="bg-white rounded-lg p-4 text-center border border-yellow-200">
                                <div className="text-2xl mb-1">🎉</div>
                                <p className="text-xs font-semibold text-gray-900">First Published</p>
                            </div>
                        )}
                        {publishedContent >= 5 && (
                            <div className="bg-white rounded-lg p-4 text-center border border-yellow-200">
                                <div className="text-2xl mb-1">🌟</div>
                                <p className="text-xs font-semibold text-gray-900">Rising Star</p>
                            </div>
                        )}
                        {publishedContent >= 10 && (
                            <div className="bg-white rounded-lg p-4 text-center border border-yellow-200">
                                <div className="text-2xl mb-1">🚀</div>
                                <p className="text-xs font-semibold text-gray-900">Super Contributor</p>
                            </div>
                        )}
                        {totalViews >= 100 && (
                            <div className="bg-white rounded-lg p-4 text-center border border-yellow-200">
                                <div className="text-2xl mb-1">👁️</div>
                                <p className="text-xs font-semibold text-gray-900">100+ Views</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Keep Going Message */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
                        Keep Up The Great Work! 🎯
                    </h3>
                    <p className="text-gray-700">
                        Your contributions are making a real difference in students' lives.
                        Every piece of content you create helps build Africa's future innovators.
                    </p>
                </div>
            </div>
        );
    } catch {
        redirect('/auth/login?redirect=/contribute/stats');
    }
}
