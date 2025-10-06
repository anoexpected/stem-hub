import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Clock, Plus } from 'lucide-react';
import ContentCard from '../components/ContentCard';

export default async function PendingPage() {
    try {
        const user = await requireRole('contributor');
        const supabase = await createClient();

        // Fetch pending content
        const { data: notes, error } = await supabase
            .from('notes')
            .select(`
        *,
        topics(id, name, subjects(id, name, exam_boards(id, name)))
      `)
            .eq('created_by', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching pending content:', error);
        }

        return (
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            Pending Review
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Content waiting for admin approval
                        </p>
                    </div>
                    <Link
                        href="/contribute/create"
                        className="flex items-center space-x-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create New</span>
                    </Link>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                {notes?.length || 0}
                            </p>
                            <p className="text-sm text-gray-600">Awaiting Review</p>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Your content is being reviewed by our admin team.
                        You'll be notified once it's approved or if changes are requested.
                        Average review time is 24-48 hours.
                    </p>
                </div>

                {/* Content Grid */}
                {notes && notes.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {notes.map((note) => (
                            <ContentCard key={note.id} note={note} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Poppins']">
                            No pending content
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Submit your content for review to see it here
                        </p>
                        <Link
                            href="/contribute/create"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Content</span>
                        </Link>
                    </div>
                )}
            </div>
        );
    } catch {
        redirect('/auth/login?redirect=/contribute/my-content/pending');
    }
}
