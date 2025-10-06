import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import SubjectCard from '@/components/features/subjects/SubjectCard';

export const metadata = {
    title: 'My Subjects | STEM Hub',
    description: 'Manage your subjects',
};

export default async function MySubjectsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Get user profile
    const { data: profile } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (!profile) {
        redirect('/auth/onboarding/location');
    }

    // Get exam boards
    const { data: examBoards } = await supabase
        .from('exam_boards')
        .select('*')
        .in('code', profile.exam_boards || []);

    const examBoardIds = examBoards?.map(eb => eb.id) || [];

    // Get all available subjects for user's exam boards
    const { data: allSubjects } = await supabase
        .from('subjects')
        .select(`
            *,
            exam_boards(id, code, name, country),
            topics:topics(id)
        `)
        .in('exam_board_id', examBoardIds)
        .eq('is_active', true)
        .eq('is_stem', true)
        .order('name');

    // Get user's selected subjects
    const { data: userSubjects } = await supabase
        .from('user_subjects')
        .select(`
            id,
            subject_id,
            added_at,
            subjects(
                id,
                name,
                code,
                description,
                icon,
                color,
                exam_board_id,
                exam_boards(code, name)
            )
        `)
        .eq('user_id', user.id);

    const selectedSubjectIds = new Set(userSubjects?.map(us => us.subject_id) || []);
    const mySubjects = userSubjects?.map(us => us.subjects) || [];
    const availableSubjects = allSubjects?.filter(s => !selectedSubjectIds.has(s.id)) || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/learn/dashboard"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {profile.exam_boards?.join(', ')} • {profile.current_level}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* My Subjects Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Active Subjects ({mySubjects.length})
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Subjects you're currently studying
                            </p>
                        </div>
                    </div>

                    {mySubjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mySubjects.map((subject: any) => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject}
                                    userId={user.id}
                                    isSelected={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No subjects added yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Add subjects below to start your learning journey
                            </p>
                        </div>
                    )}
                </section>

                {/* Available Subjects Section */}
                {availableSubjects.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Available Subjects ({availableSubjects.length})
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Add more subjects to expand your learning
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableSubjects.map((subject: any) => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject}
                                    userId={user.id}
                                    isSelected={false}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {availableSubjects.length === 0 && mySubjects.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                        <p className="text-blue-900 font-medium">
                            🎉 You've added all available subjects for your exam boards!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
