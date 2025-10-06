import { createClient } from '@/lib/supabase/server';
import { SubjectCard, Breadcrumb } from '@/components/features/StudentComponents';
import { BookOpen, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function SubjectsPage() {
    const supabase = await createClient();

    // Fetch all subjects
    const { data: subjects } = await supabase
        .from('subjects')
        .select(`
      id,
      name,
      description,
      icon,
      color,
      exam_boards(id, name, code)
    `)
        .order('name');

    // Fetch exam boards for filter
    const { data: examBoards } = await supabase
        .from('exam_boards')
        .select('id, name, code')
        .order('name');

    // Get counts for each subject
    const subjectsWithCounts = await Promise.all(
        (subjects || []).map(async (subject) => {
            // Get topic IDs for this subject
            const { data: topicIds } = await supabase
                .from('topics')
                .select('id')
                .eq('subject_id', subject.id);

            const topicIdArray = topicIds?.map(t => t.id) || [];

            const { count: notesCount } = await supabase
                .from('notes')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'published')
                .in('topic_id', topicIdArray.length > 0 ? topicIdArray : ['none']);

            const { count: quizzesCount } = await supabase
                .from('quizzes')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'published')
                .in('topic_id', topicIdArray.length > 0 ? topicIdArray : ['none']);

            const { count: topicsCount } = await supabase
                .from('topics')
                .select('id', { count: 'exact', head: true })
                .eq('subject_id', subject.id);

            return {
                ...subject,
                notesCount: notesCount || 0,
                quizzesCount: quizzesCount || 0,
                topicsCount: topicsCount || 0,
            };
        })
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <Breadcrumb items={[
                        { label: 'Home', href: '/' },
                        { label: 'Subjects' }
                    ]} />
                    <div className="flex items-center space-x-4 mb-4 mt-6">
                        <BookOpen className="w-12 h-12 text-[#2ECC71]" />
                        <h1 className="text-4xl md:text-5xl font-bold font-['Poppins']">
                            Browse Subjects
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg">
                        Choose your subject to explore notes, quizzes, and past papers
                    </p>
                    <div className="mt-6 flex items-center space-x-4 text-sm">
                        <span className="px-3 py-1 bg-white/10 rounded-full">
                            {subjectsWithCounts.length} Subjects
                        </span>
                        <span className="px-3 py-1 bg-white/10 rounded-full">
                            {subjectsWithCounts.reduce((acc, s) => acc + s.notesCount, 0)} Notes
                        </span>
                        <span className="px-3 py-1 bg-white/10 rounded-full">
                            {subjectsWithCounts.reduce((acc, s) => acc + s.quizzesCount, 0)} Quizzes
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Filter by Exam Board */}
                {examBoards && examBoards.length > 0 && (
                    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-3">
                                <Filter className="w-5 h-5 text-gray-700" />
                                <h2 className="text-lg font-bold text-gray-900 font-['Poppins']">
                                    Filter by Exam Board
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/subjects">
                                    <button className="px-4 py-2 bg-[#2ECC71] text-white rounded-lg font-medium hover:bg-[#27AE60] transition-colors">
                                        All Boards
                                    </button>
                                </Link>
                                {examBoards.map((board) => (
                                    <Link key={board.id} href={`/subjects?exam_board=${board.id}`}>
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                            {board.code || board.name}
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Subjects Grid */}
                {subjectsWithCounts.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Subjects Yet</h3>
                        <p className="text-gray-500">Subjects will appear here once they're added by administrators.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjectsWithCounts.map((subject: any) => (
                                <SubjectCard
                                    key={subject.id}
                                    slug={subject.name.toLowerCase().replace(/\s+/g, '-')}
                                    name={subject.name}
                                    icon={subject.icon || '📖'}
                                    description={subject.description || `Explore ${subject.topicsCount} topics in ${subject.name}`}
                                    notesCount={subject.notesCount}
                                    quizzesCount={subject.quizzesCount}
                                    color={subject.color || '#2ECC71'}
                                />
                            ))}
                        </div>

                        {/* Stats Section */}
                        <div className="mt-16 bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] rounded-lg p-8 text-white">
                            <h3 className="text-2xl font-bold font-['Poppins'] mb-6 text-center">
                                📊 Platform Statistics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#2ECC71] mb-2">
                                        {subjectsWithCounts.length}
                                    </div>
                                    <div className="text-gray-300">Subjects</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#2ECC71] mb-2">
                                        {subjectsWithCounts.reduce((acc, s) => acc + s.topicsCount, 0)}
                                    </div>
                                    <div className="text-gray-300">Topics</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#F1C40F] mb-2">
                                        {subjectsWithCounts.reduce((acc, s) => acc + s.notesCount, 0)}
                                    </div>
                                    <div className="text-gray-300">Study Notes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#F1C40F] mb-2">
                                        {subjectsWithCounts.reduce((acc, s) => acc + s.quizzesCount, 0)}
                                    </div>
                                    <div className="text-gray-300">Practice Quizzes</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
