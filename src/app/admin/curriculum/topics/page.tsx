import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import Link from 'next/link';

export default async function TopicsPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/curriculum/topics');
    }

    const supabase = await createClient();

    // Fetch topics with subject and exam board info
    const { data: topics, error } = await supabase
        .from('topics')
        .select(`
      *,
      subjects(
        id, 
        name, 
        exam_boards(id, name)
      )
    `)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching topics:', error);
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        Topics
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage topics and their hierarchy
                    </p>
                </div>

                <Link
                    href="/admin/curriculum/topics/create"
                    className="flex items-center space-x-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Topic</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Topics</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {topics?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <FolderTree className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Topics List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Topic
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Exam Board
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Difficulty
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {topics && topics.length > 0 ? (
                                topics.map((topic: any) => (
                                    <tr key={topic.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-[#8E44AD] rounded-lg flex items-center justify-center text-white font-bold mr-3">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{topic.name}</div>
                                                    {topic.description && (
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {topic.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {topic.subjects?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {topic.subjects?.exam_boards?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${topic.difficulty_level === 'easy'
                                                ? 'bg-green-100 text-green-800'
                                                : topic.difficulty_level === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {topic.difficulty_level || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/admin/curriculum/topics/${topic.id}`}
                                                    className="text-[#2ECC71] hover:text-[#27AE60] transition"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button className="text-red-600 hover:text-red-700 transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No topics found. Add your first topic to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
