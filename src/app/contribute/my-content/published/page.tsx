import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CheckCircle, Plus, Eye, ThumbsUp } from 'lucide-react';
import ContentCard from '../components/ContentCard';

export default async function PublishedPage() {
    try {
        const user = await requireRole('contributor');
        const supabase = await createClient();

        // Fetch published content
        const { data: notes, error } = await supabase
            .from('notes')
            .select(`
        *,
        topics(id, name, subjects(id, name, exam_boards(id, name)))
      `)
            .eq('created_by', user.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching published content:', error);
        }

        // Calculate stats
        const totalViews = notes?.reduce((sum, note) => sum + (note.views_count || 0), 0) || 0;
        const totalLikes = notes?.reduce((sum, note) => sum + (note.likes_count || 0), 0) || 0;

        return (
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            Published Content
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Your approved content helping students succeed
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

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                    {notes?.length || 0}
                                </p>
                                <p className="text-sm text-gray-600">Published</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Eye className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                    {totalViews}
                                </p>
                                <p className="text-sm text-gray-600">Total Views</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <ThumbsUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                    {totalLikes}
                                </p>
                                <p className="text-sm text-gray-600">Total Likes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Banner */}
                {notes && notes.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                            <strong>🎉 Great work!</strong> Your published content is making a difference.
                            Keep creating to help more students across Africa succeed.
                        </p>
                    </div>
                )}

                {/* Content Grid */}
                {notes && notes.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {notes.map((note) => (
                            <ContentCard key={note.id} note={note} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Poppins']">
                            No published content yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create and submit content for approval to see it here
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
        redirect('/auth/login?redirect=/contribute/my-content/published');
    }
}
