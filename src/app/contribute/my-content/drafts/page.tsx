import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import ContentCard from '../components/ContentCard';

export default async function DraftsPage() {
    try {
        const user = await requireRole('contributor');
        const supabase = await createClient();

        // Fetch draft content
        const { data: notes, error } = await supabase
            .from('notes')
            .select(`
        *,
        topics(id, name, subjects(id, name, exam_boards(id, name)))
      `)
            .eq('created_by', user.id)
            .eq('status', 'draft')
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching drafts:', error);
        }

        return (
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            My Drafts
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Continue working on your unfinished content
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
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                {notes?.length || 0}
                            </p>
                            <p className="text-sm text-gray-600">Total Drafts</p>
                        </div>
                    </div>
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
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Poppins']">
                            No drafts yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start creating content to see your drafts here
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
        redirect('/auth/login?redirect=/contribute/my-content/drafts');
    }
}
