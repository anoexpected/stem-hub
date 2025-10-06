import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Users, Plus, MessageCircle, Clock } from 'lucide-react';

export const metadata = {
    title: 'Study Groups | STEM Hub',
    description: 'Learn together with peers',
};

export default async function StudyGroupsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Mock study groups - implement real ones later
    const studyGroups = [
        {
            id: '1',
            name: 'Mathematics Mastery',
            subject: 'Mathematics',
            members: 24,
            lastActive: '2 hours ago',
            description: 'Preparing for IGCSE Mathematics exams',
        },
        {
            id: '2',
            name: 'Physics Champions',
            subject: 'Physics',
            members: 18,
            lastActive: '1 day ago',
            description: 'Weekly physics problem solving sessions',
        },
        {
            id: '3',
            name: 'Chemistry Lab',
            subject: 'Chemistry',
            members: 15,
            lastActive: '3 hours ago',
            description: 'Understanding organic chemistry together',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/learn/dashboard"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                        <Users className="w-8 h-8" />
                        <h1 className="text-3xl font-bold">Study Groups</h1>
                    </div>
                    <p className="text-white/90">Connect and learn with fellow students</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Create Group CTA */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">
                            Create Your Own Study Group
                        </h2>
                        <p className="text-sm text-gray-600">
                            Invite friends and study together
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center space-x-2">
                        <Plus className="w-5 h-5" />
                        <span>Create Group</span>
                    </button>
                </div>

                {/* Available Groups */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Study Groups</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {studyGroups.map((group) => (
                            <div
                                key={group.id}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                                            {group.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{group.subject}</p>
                                    </div>
                                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>{group.members}</span>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4">{group.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>Active {group.lastActive}</span>
                                    </div>
                                    <Link
                                        href={`/study-groups/${group.id}`}
                                        className="px-4 py-2 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white font-medium rounded-lg hover:opacity-90 transition-all text-sm"
                                    >
                                        Join Group
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coming Soon Features */}
                <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">More Features Coming Soon!</h2>
                    <p className="text-white/90 max-w-2xl mx-auto">
                        Video calls, screen sharing, collaborative whiteboards, and more to enhance your group study experience.
                    </p>
                </div>
            </main>
        </div>
    );
}
