import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Eye, Calendar, Filter } from 'lucide-react';

export default async function NotesPage() {
  const supabase = await createClient();

  // Fetch all published notes
  const { data: notes, error } = await supabase
    .from('notes')
    .select(`
      *,
      users(id, name),
      topics(
        id, 
        name,
        subjects(
          id, 
          name,
          exam_boards(id, name)
        )
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch exam boards for filter
  const { data: examBoards } = await supabase
    .from('exam_boards')
    .select('id, name')
    .order('name');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4 font-['Poppins']">
            Study Notes
          </h1>
          <p className="text-gray-300 text-lg">
            Browse comprehensive study notes created by contributors
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900 font-['Poppins']">
                  Filters
                </h2>
              </div>

              {/* Exam Board Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Board
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                  <option value="">All Exam Boards</option>
                  {examBoards?.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <div className="space-y-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label key={level} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#2ECC71] rounded focus:ring-[#2ECC71]"
                      />
                      <span className="text-sm text-gray-700 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="lg:col-span-3">
            {notes && notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 font-['Poppins']">
                            {note.title}
                          </h3>
                        </div>

                        {note.difficulty_level && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${note.difficulty_level === 'beginner'
                              ? 'bg-green-100 text-green-700'
                              : note.difficulty_level === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            {note.difficulty_level}
                          </span>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {note.topics?.subjects?.exam_boards && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {note.topics.subjects.exam_boards.name}
                          </span>
                        )}
                        {note.topics?.subjects && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            {note.topics.subjects.name}
                          </span>
                        )}
                        {note.topics && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            {note.topics.name}
                          </span>
                        )}
                      </div>

                      {/* Content Preview */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {note.content?.substring(0, 150).replace(/[#*`]/g, '')}...
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{note.view_count || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(note.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <span className="text-sm text-[#2ECC71] font-medium hover:text-[#27AE60]">
                        Read more →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
                  No Notes Yet
                </h3>
                <p className="text-gray-600">
                  Check back soon for new study notes!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
