import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Brain, FileText, Clock, Award, TrendingUp } from 'lucide-react';
import { Beaker, Calculator, Microscope, Cpu, Atom } from 'lucide-react';

const subjectIcons: Record<string, any> = {
    Mathematics: Calculator,
    Physics: Atom,
    Chemistry: Beaker,
    Biology: Microscope,
    'Computer Science': Cpu,
};

const subjectColors: Record<string, { gradient: string; light: string; icon: string }> = {
    Mathematics: { gradient: 'from-blue-500 to-blue-600', light: 'bg-blue-50', icon: 'text-blue-600' },
    Physics: { gradient: 'from-purple-500 to-purple-600', light: 'bg-purple-50', icon: 'text-purple-600' },
    Chemistry: { gradient: 'from-green-500 to-green-600', light: 'bg-green-50', icon: 'text-green-600' },
    Biology: { gradient: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50', icon: 'text-emerald-600' },
    'Computer Science': { gradient: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50', icon: 'text-indigo-600' },
};

export default async function SubjectPage({ params }: { params: { code: string } }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Get subject with topics
    const { data: subject } = await supabase
        .from('subjects')
        .select(`
            *,
            exam_boards(id, code, name),
            topics(
                id,
                name,
                code,
                description,
                difficulty_level,
                order_index,
                is_active
            )
        `)
        .eq('code', params.code)
        .eq('is_active', true)
        .single();

    if (!subject) {
        redirect('/learn/subjects');
    }

    // Get notes for this subject
    const { data: notes } = await supabase
        .from('notes')
        .select(`
            id,
            title,
            content,
            view_count,
            created_at,
            topics(id, name)
        `)
        .in('topic_id', subject.topics.map((t: any) => t.id))
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

    // Get quizzes for this subject
    const { data: quizzes } = await supabase
        .from('quizzes')
        .select(`
            id,
            title,
            description,
            difficulty,
            time_limit_minutes,
            topics(id, name)
        `)
        .in('topic_id', subject.topics.map((t: any) => t.id))
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

    // Get past papers for this subject
    const { data: pastPapers } = await supabase
        .from('past_papers')
        .select('*')
        .eq('subject_id', subject.id)
        .eq('status', 'approved')
        .order('year', { ascending: false })
        .limit(6);

    // Get user progress for this subject
    const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('topic_id', subject.topics.map((t: any) => t.id));

    const Icon = subjectIcons[subject.name] || BookOpen;
    const colors = subjectColors[subject.name] || subjectColors.Mathematics;

    // Calculate stats
    const totalTopics = subject.topics.filter((t: any) => t.is_active).length;
    const topicsStudied = progressData?.length || 0;
    const progressPercent = totalTopics > 0 ? Math.round((topicsStudied / totalTopics) * 100) : 0;

    const totalQuestions = progressData?.reduce((sum, p) => sum + (p.questions_attempted || 0), 0) || 0;
    const correctQuestions = progressData?.reduce((sum, p) => sum + (p.questions_correct || 0), 0) || 0;
    const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className={`bg-gradient-to-br ${colors.gradient} text-white`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-start justify-between mb-6">
                        <Link
                            href="/learn/subjects"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="flex items-start space-x-6">
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <Icon className="w-12 h-12 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
                            <p className="text-white/90 text-lg mb-4">
                                {subject.exam_boards.code} • {subject.exam_boards.name}
                            </p>
                            <p className="text-white/80 max-w-2xl">
                                {subject.description || `Master ${subject.name} with comprehensive study materials, practice questions, and past papers.`}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-white/80 text-sm mb-1">Progress</p>
                            <p className="text-2xl font-bold">{progressPercent}%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-white/80 text-sm mb-1">Topics</p>
                            <p className="text-2xl font-bold">{topicsStudied}/{totalTopics}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-white/80 text-sm mb-1">Questions</p>
                            <p className="text-2xl font-bold">{totalQuestions}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-white/80 text-sm mb-1">Accuracy</p>
                            <p className="text-2xl font-bold">{accuracy}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        href={`/learn/subjects/${params.code}/topics`}
                        className={`bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-${colors.icon.replace('text-', '')} hover:shadow-lg transition-all group`}
                    >
                        <div className={`w-12 h-12 ${colors.light} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <FileText className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Topics</h3>
                        <p className="text-sm text-gray-600">Browse all {totalTopics} topics</p>
                    </Link>

                    <Link
                        href={`/learn/subjects/${params.code}/practice`}
                        className={`bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-${colors.icon.replace('text-', '')} hover:shadow-lg transition-all group`}
                    >
                        <div className={`w-12 h-12 ${colors.light} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Brain className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Practice</h3>
                        <p className="text-sm text-gray-600">Start practicing now</p>
                    </Link>

                    <Link
                        href={`/learn/subjects/${params.code}/past-papers`}
                        className={`bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-${colors.icon.replace('text-', '')} hover:shadow-lg transition-all group`}
                    >
                        <div className={`w-12 h-12 ${colors.light} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Award className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Past Papers</h3>
                        <p className="text-sm text-gray-600">{pastPapers?.length || 0} papers available</p>
                    </Link>
                </div>

                {/* Topics Overview */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Topics</h2>
                        <Link
                            href={`/learn/subjects/${params.code}/topics`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            View all →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subject.topics
                            .filter((t: any) => t.is_active)
                            .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
                            .slice(0, 6)
                            .map((topic: any) => {
                                const topicProgress = progressData?.find(p => p.topic_id === topic.id);
                                const hasProgress = !!topicProgress;

                                return (
                                    <Link
                                        key={topic.id}
                                        href={`/learn/topics/${topic.id}`}
                                        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                                    {topic.name}
                                                </h3>
                                                {topic.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-1">{topic.description}</p>
                                                )}
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${topic.difficulty_level === 'easy' ? 'bg-green-100 text-green-700' :
                                                            topic.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {topic.difficulty_level || 'Medium'}
                                                    </span>
                                                    {hasProgress && (
                                                        <span className="text-xs text-gray-600">
                                                            {topicProgress.questions_attempted} questions
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {hasProgress && (
                                                <TrendingUp className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </section>

                {/* Recent Notes */}
                {notes && notes.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Notes</h2>
                            <Link
                                href={`/learn/subjects/${params.code}/notes`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View all →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.map((note: any) => (
                                <Link
                                    key={note.id}
                                    href={`/notes/${note.id}`}
                                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
                                >
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {note.content.substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{note.topics?.name}</span>
                                        <span>{note.view_count} views</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Quizzes */}
                {quizzes && quizzes.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Available Quizzes</h2>
                            <Link
                                href={`/learn/subjects/${params.code}/quizzes`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View all →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quizzes.map((quiz: any) => (
                                <Link
                                    key={quiz.id}
                                    href={`/quizzes/${quiz.id}`}
                                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 line-clamp-2">{quiz.title}</h3>
                                        {quiz.time_limit_minutes && (
                                            <div className="flex items-center text-xs text-gray-500 ml-2">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {quiz.time_limit_minutes}m
                                            </div>
                                        )}
                                    </div>
                                    {quiz.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quiz.description}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2 py-1 rounded-full ${quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {quiz.difficulty || 'Medium'}
                                        </span>
                                        <span className="text-xs text-gray-500">{quiz.topics?.name}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
