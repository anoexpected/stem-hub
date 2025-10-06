import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Download, Calendar, Filter, Search } from 'lucide-react';

export default async function PastPapersPage() {
  const supabase = await createClient();

  // Fetch all published past papers
  const { data: pastPapers, error } = await supabase
    .from('past_papers')
    .select(`
      *,
      exam_boards(id, name),
      subjects(id, name)
    `)
    .eq('status', 'published')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false });

  // Fetch exam boards for filter
  const { data: examBoards } = await supabase
    .from('exam_boards')
    .select('id, name')
    .order('name');

  // Fetch subjects for filter
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .order('name');

  // Get unique years
  const years = [...new Set(pastPapers?.map((p) => p.year) || [])].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4 font-['Poppins']">
            Past Papers Library
          </h1>
          <p className="text-gray-300 text-lg">
            Access past exam papers and marking schemes to prepare for your exams
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

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search papers..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                  />
                </div>
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

              {/* Subject Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                  <option value="">All Subjects</option>
                  {subjects?.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                  <option value="">All Sessions</option>
                  <option value="may_june">May/June</option>
                  <option value="october_november">October/November</option>
                  <option value="january">January</option>
                  <option value="march">March</option>
                </select>
              </div>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-900 font-medium">
                📚 {pastPapers?.length || 0} past papers available
              </p>
            </div>

            {pastPapers && pastPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 font-['Poppins']">
                            {paper.title}
                          </h3>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {paper.exam_boards && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {paper.exam_boards.name}
                          </span>
                        )}
                        {paper.subjects && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            {paper.subjects.name}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          {paper.year}
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          {paper.paper_number}
                        </span>
                      </div>

                      {/* Session Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="capitalize">
                            {paper.session.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Download Buttons */}
                      <div className="space-y-2">
                        {paper.question_paper_url && (
                          <a
                            href={paper.question_paper_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span className="font-medium">Question Paper</span>
                            </div>
                            <Download className="w-4 h-4" />
                          </a>
                        )}

                        {paper.marking_scheme_url && (
                          <a
                            href={paper.marking_scheme_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-4 py-2 bg-[#1B2A4C] text-white rounded-lg hover:bg-[#2C3E50] transition"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span className="font-medium">Marking Scheme</span>
                            </div>
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* View Details */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <Link
                        href={`/past-papers/${paper.id}`}
                        className="text-sm text-[#2ECC71] font-medium hover:text-[#27AE60]"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
                  No Past Papers Yet
                </h3>
                <p className="text-gray-600">
                  Check back soon for past exam papers!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
