import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function SubjectsPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/curriculum/subjects');
    }

    const supabase = await createClient();

    // Fetch subjects with exam board info and topic counts
    const { data: subjects, error } = await supabase
        .from('subjects')
        .select(`
      *,
      exam_boards(id, name),
      topics(count)
    `)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching subjects:', error);
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        Subjects
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage subjects across all exam boards
                    </p>
                </div>

                <Link
                    href="/admin/curriculum/subjects/create"
                    className="flex items-center space-x-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Subject</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Subjects</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {subjects?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Exam Board
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Topics
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {subjects && subjects.length > 0 ? (
                                subjects.map((subject: any) => (
                                    <tr key={subject.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center text-white font-bold mr-3">
                                                    {subject.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{subject.name}</div>
                                                    {subject.code && (
                                                        <div className="text-sm text-gray-500">{subject.code}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {subject.exam_boards?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                {subject.level || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {subject.topics?.[0]?.count || 0} topics
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/admin/curriculum/subjects/${subject.id}`}
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
                                        No subjects found. Add your first subject to get started.
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
