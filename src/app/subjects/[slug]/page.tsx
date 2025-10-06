import Link from "next/link";
import { createClient } from '@/lib/supabase/server';
import { ChevronRight, BookOpen, FileText, Brain, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SubjectDetailPage({ params }: PageProps) {
    const supabase = await createClient();

    // Convert slug back to subject name (e.g., "pure-mathematics" -> "Pure Mathematics")
    const subjectName = params.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Fetch subject details
    const { data: subject } = await supabase
        .from('subjects')
        .select('*')
        .ilike('name', subjectName)
        .single();

    if (!subject) {
        return notFound();
    }

    // Fetch topics for this subject
    const { data: topics } = await supabase
        .from('topics')
        .select(`
            id,
            name,
            description,
            order_index
        `)
        .eq('subject_id', subject.id)
        .order('order_index', { ascending: true });

    // Get counts for this subject
    const { count: notesCount } = await supabase
        .from('notes')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .in('topic_id', topics?.map(t => t.id) || []);

    const { count: quizzesCount } = await supabase
        .from('quizzes')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .in('topic_id', topics?.map(t => t.id) || []);

    // Fetch recent notes for this subject
    const { data: recentNotes } = await supabase
        .from('notes')
        .select(`
            id,
            title,
            content,
            created_at,
            topics(id, name)
        `)
        .eq('status', 'published')
        .in('topic_id', topics?.map(t => t.id) || [])
        .order('created_at', { ascending: false })
        .limit(3);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div
                className="bg-gradient-to-br from-[#1B2A4C] to-[#2C3E50] text-white"
                style={subject.color ? { background: `linear-gradient(to bottom right, ${subject.color}, #1B2A4C)` } : undefined}
            >
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center space-x-2 mb-4 text-white/80">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/subjects" className="hover:text-white">Subjects</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>{subject.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="text-6xl">{subject.icon || '📚'}</div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-['Poppins']">
                                {subject.name}
                            </h1>
                            {subject.description && (
                                <p className="text-xl text-white/90 mt-2">{subject.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-[#1B2A4C]">{topics?.length || 0}</div>
                            <div className="text-sm text-gray-600">Topics</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#2ECC71]">{notesCount || 0}</div>
                            <div className="text-sm text-gray-600">Study Notes</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#8E44AD]">{quizzesCount || 0}</div>
                            <div className="text-sm text-gray-600">Quizzes</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#F1C40F]">Free</div>
                            <div className="text-sm text-gray-600">All Resources</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Topics List */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold font-['Poppins'] text-[#1B2A4C] mb-6">
                                📖 Topics
                            </h2>

                            {topics && topics.length > 0 ? (
                                <div className="space-y-4">
                                    {topics.map((topic: any, index: number) => (
                                        <Link key={topic.id} href={`/notes?topic=${topic.id}`}>
                                            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 group cursor-pointer">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <span className="text-sm font-bold text-[#2ECC71] bg-[#2ECC71]/10 px-3 py-1 rounded-full">
                                                                Topic {index + 1}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-[#1B2A4C] mb-2 group-hover:text-[#2ECC71] transition-colors">
                                                            {topic.name}
                                                        </h3>
                                                        {topic.description && (
                                                            <p className="text-gray-600 text-sm">{topic.description}</p>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#2ECC71] transition-colors ml-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                                    <div className="text-5xl mb-4">📚</div>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">No topics yet</h3>
                                    <p className="text-gray-600">Topics for this subject are being prepared.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <Link href={`/notes?subject=${subject.id}`}>
                                    <button className="w-full px-4 py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2">
                                        <BookOpen className="w-5 h-5" />
                                        <span>Browse Notes</span>
                                    </button>
                                </Link>
                                <Link href={`/quizzes?subject=${subject.id}`}>
                                    <button className="w-full px-4 py-3 bg-[#8E44AD] hover:bg-[#7D3C98] text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2">
                                        <Brain className="w-5 h-5" />
                                        <span>Take Quiz</span>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Notes */}
                        {recentNotes && recentNotes.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold font-['Poppins'] text-[#1B2A4C] mb-4 flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-[#2ECC71]" />
                                    <span>Recent Notes</span>
                                </h3>
                                <div className="space-y-3">
                                    {recentNotes.slice(0, 3).map((note: any) => (
                                        <Link key={note.id} href={`/notes/${note.id}`}>
                                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                                <h4 className="font-semibold text-[#1B2A4C] text-sm mb-1 line-clamp-2">
                                                    {note.title}
                                                </h4>
                                                <p className="text-xs text-gray-600">{note.topics?.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Study Tips */}
                        <div className="bg-gradient-to-br from-[#F1C40F]/10 to-[#F39C12]/10 rounded-xl p-6 border border-[#F1C40F]/20">
                            <h3 className="text-lg font-bold font-['Poppins'] text-[#1B2A4C] mb-3">
                                💡 Study Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <span>✓</span>
                                    <span>Review notes regularly</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span>✓</span>
                                    <span>Practice with quizzes</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span>✓</span>
                                    <span>Form study groups</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span>✓</span>
                                    <span>Track your progress</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
