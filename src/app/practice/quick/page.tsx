import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Zap, Target, Clock, Brain } from 'lucide-react';

export const metadata = {
    title: 'Quick Practice | STEM Hub',
    description: 'Start practicing now',
};

export default async function QuickPracticePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Get user's subjects
    const { data: userSubjects } = await supabase
        .from('user_subjects')
        .select(`
            subjects(
                id,
                name,
                code,
                icon,
                color
            )
        `)
        .eq('user_id', user.id);

    const subjects = userSubjects?.map(us => us.subjects) || [];

    const practiceOptions = [
        {
            icon: Zap,
            title: 'Quick Practice',
            description: '10 random questions',
            duration: '5-10 min',
            color: 'from-yellow-500 to-orange-500',
            questions: 10,
        },
        {
            icon: Target,
            title: 'Focused Practice',
            description: '20 questions on weak topics',
            duration: '15-20 min',
            color: 'from-blue-500 to-indigo-500',
            questions: 20,
        },
        {
            icon: Clock,
            title: 'Timed Challenge',
            description: '30 questions, 30 minutes',
            duration: '30 min',
            color: 'from-red-500 to-pink-500',
            questions: 30,
        },
        {
            icon: Brain,
            title: 'Daily Challenge',
            description: 'Today\'s special challenge',
            duration: '10-15 min',
            color: 'from-purple-500 to-indigo-500',
            questions: 15,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/learn/dashboard"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Quick Practice</h1>
                    <p className="text-white/90">Choose a practice mode to get started</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Practice Modes */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Modes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {practiceOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <div
                                    key={option.title}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className={`p-6 bg-gradient-to-br ${option.color}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-white/90 text-sm font-medium">
                                                {option.duration}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {option.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">{option.description}</p>
                                        <button className="w-full py-3 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-semibold rounded-lg hover:opacity-90 transition-all">
                                            Start Practice
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Select Subject */}
                {subjects.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Or Practice by Subject</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subjects.map((subject: any) => (
                                <Link
                                    key={subject.id}
                                    href={`/learn/subjects/${subject.code}/practice`}
                                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all text-center group"
                                >
                                    <div className="text-4xl mb-2">{subject.icon || '📚'}</div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                        {subject.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {subjects.length === 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                        <p className="text-blue-900">
                            Add subjects to your profile to start practicing!
                        </p>
                        <Link
                            href="/learn/subjects"
                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Subjects
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
