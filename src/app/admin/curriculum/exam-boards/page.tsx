import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function ExamBoardsPage() {
  try {
    await requireRole('admin');
  } catch {
    redirect('/auth/login?redirect=/admin/curriculum/exam-boards');
  }

  const supabase = await createClient();

  // Fetch exam boards with subject counts
  const { data: examBoards, error } = await supabase
    .from('exam_boards')
    .select(`
      *,
      subjects(count)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching exam boards:', error);
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
            Exam Boards
          </h1>
          <p className="text-gray-600 mt-2">
            Manage exam boards and their configurations
          </p>
        </div>

        <Link
          href="/admin/curriculum/exam-boards/create"
          className="flex items-center space-x-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Exam Board</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Exam Boards</p>
              <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                {examBoards?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Exam Boards List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Board
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {examBoards && examBoards.length > 0 ? (
                examBoards.map((board: any) => (
                  <tr key={board.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center text-white font-bold mr-3">
                          {board.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{board.name}</p>
                          <p className="text-sm text-gray-500">{board.full_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{board.country}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {board.subjects?.[0]?.count || 0} subjects
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/curriculum/exam-boards/${board.id}`}
                          className="p-2 text-gray-600 hover:text-[#2ECC71] hover:bg-gray-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No exam boards found
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
