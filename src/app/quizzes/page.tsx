import Link from "next/link";
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Clock, Award, TrendingUp, ChevronRight } from 'lucide-react';

export default async function QuizzesPage() {
    const supabase = await createClient();

    // Fetch all published quizzes with topic and subject info
    const { data: quizzes } = await supabase
        .from('quizzes')
        .select(`
            id,
            title,
            description,
            difficulty,
            time_limit,
            created_at,
            topics(id, name, subjects(id, name, icon))
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    // Get unique subjects for filtering
    const subjects = Array.from(
        new Set(quizzes?.map((q: any) => q.topics?.subjects?.name).filter(Boolean))
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8E44AD] to-[#9B59B6] text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center space-x-2 mb-4 text-white/80">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Quizzes</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">
                        Interactive Quizzes
                    </h1>
                    <p className="text-xl text-purple-100 max-w-3xl">
                        Test your knowledge with our comprehensive quizzes. Track your progress and identify areas for improvement.
                    </p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-[#8E44AD]">{quizzes?.length || 0}</div>
                            <div className="text-sm text-gray-600">Total Quizzes</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#2ECC71]">{subjects.length}</div>
                            <div className="text-sm text-gray-600">Subjects</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#F1C40F]">Free</div>
                            <div className="text-sm text-gray-600">All Access</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#E74C3C]">Unlimited</div>
                            <div className="text-sm text-gray-600">Attempts</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quizzes List */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {quizzes && quizzes.length > 0 ? (
                    <div className="space-y-6">
                        {quizzes.map((quiz: any) => (
                            <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
                                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-2xl">{quiz.topics?.subjects?.icon || '📝'}</span>
                                                <span className="text-sm font-medium text-gray-600">
                                                    {quiz.topics?.subjects?.name} • {quiz.topics?.name}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#1B2A4C] mb-2 group-hover:text-[#8E44AD] transition-colors">
                                                {quiz.title}
                                            </h3>
                                            {quiz.description && (
                                                <p className="text-gray-600 mb-4">{quiz.description}</p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                {quiz.difficulty && (
                                                    <span className={`px-3 py-1 rounded-full font-medium ${quiz.difficulty === 'easy'
                                                        ? 'bg-green-100 text-green-700'
                                                        : quiz.difficulty === 'medium'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                                                    </span>
                                                )}
                                                {quiz.time_limit && (
                                                    <span className="flex items-center space-x-1 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{quiz.time_limit} min</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <button className="px-6 py-3 bg-[#8E44AD] hover:bg-[#7D3C98] text-white font-semibold rounded-lg transition-colors">
                                                Start Quiz
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No quizzes yet</h3>
                        <p className="text-gray-600">Check back soon for new quizzes!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
