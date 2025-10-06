import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Calendar, BookOpen } from 'lucide-react';

interface PastPaperPageProps {
  params: {
    id: string;
  };
}

export default async function PastPaperPage({ params }: PastPaperPageProps) {
  const supabase = await createClient();

  // Check if user is authenticated (for preview access)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch past paper with related data
  // Allow admins/contributors to preview pending papers
  const query = supabase
    .from('past_papers')
    .select(`
      *,
      exam_boards(id, name),
      subjects(id, name)
    `)
    .eq('id', params.id);

  // Only show published papers to non-authenticated users
  if (!user) {
    query.eq('status', 'published');
  }

  const { data: paper, error } = await query.single();

  if (error || !paper) {
    console.error('Error fetching past paper:', error);
    notFound();
  }

  // Fetch related papers from same subject and year
  const { data: relatedPapers } = await supabase
    .from('past_papers')
    .select('id, title, paper_number, year')
    .eq('subject_id', paper.subject_id)
    .eq('year', paper.year)
    .eq('status', 'published')
    .neq('id', params.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-300 mb-6">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/past-papers" className="hover:text-white transition">
              Past Papers
            </Link>
            <span>/</span>
            <span className="text-white">{paper.year}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 font-['Poppins']">
            {paper.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {paper.exam_boards && (
              <span className="px-3 py-1 bg-white/20 rounded-full">
                {paper.exam_boards.name}
              </span>
            )}
            {paper.subjects && (
              <span className="px-3 py-1 bg-white/20 rounded-full">
                {paper.subjects.name}
              </span>
            )}
            <span className="px-3 py-1 bg-white/20 rounded-full">
              {paper.year}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full capitalize">
              {paper.season.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full">
              {paper.paper_number}
            </span>
          </div>

          {/* Back Button */}
          <Link
            href="/past-papers"
            className="inline-flex items-center space-x-2 mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Past Papers</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Download Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
                Download Files
              </h2>

              {paper.status === 'pending' && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This past paper is pending review. Preview only.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* Past Paper File */}
                {paper.file_url && (
                  <a
                    href={paper.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-lg hover:shadow-lg transition group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Past Paper</p>
                        <p className="text-sm text-white/90">PDF Document</p>
                      </div>
                    </div>
                    <Download className="w-6 h-6 group-hover:scale-110 transition" />
                  </a>
                )}

                {!paper.file_url && (
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <p className="text-gray-600">No file uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3 font-['Poppins']">
                📝 Study Tips
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Time yourself when practicing - simulate exam conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Review the marking scheme to understand how marks are allocated</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Identify common question patterns and practice similar problems</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Make notes of topics you find challenging for focused revision</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Paper Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Poppins']">
                Paper Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium text-gray-900">{paper.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Season</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {paper.season.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Paper Number</span>
                  <span className="font-medium text-gray-900">{paper.paper_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Added</span>
                  <span className="font-medium text-gray-900">
                    {new Date(paper.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Papers */}
            {relatedPapers && relatedPapers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Poppins']">
                  Related Papers
                </h3>

                <div className="space-y-3">
                  {relatedPapers.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/past-papers/${rp.id}`}
                      className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                    >
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">
                        {rp.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {rp.year} • {rp.paper_number}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
