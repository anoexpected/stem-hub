import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReviewNoteCard from './components/ReviewNoteCard';
import { FileText } from 'lucide-react';

export default async function ReviewNotesPage() {
  try {
    await requireRole('admin');
  } catch {
    redirect('/auth/login?redirect=/admin/review/notes');
  }

  const supabase = await createClient();

  // Fetch pending notes with related data
  // Use users!notes_created_by_fkey to specify we want the creator's info
  const { data: pendingNotes, error } = await supabase
    .from('notes')
    .select(`
      *,
      users!notes_created_by_fkey(id, full_name, email),
      topics(id, name, subjects(id, name, exam_boards(id, name)))
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending notes:', error);
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
            Review Notes
          </h1>
          <p className="text-gray-600 mt-2">
            {pendingNotes?.length || 0} notes pending review
          </p>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <FileText className="w-5 h-5" />
          <span className="font-medium">Notes</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
            <option>All Exam Boards</option>
            <option>ZIMSEC</option>
            <option>WAEC</option>
            <option>IGCSE</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Title</option>
          </select>
        </div>
      </div>

      {/* Notes List */}
      {pendingNotes && pendingNotes.length > 0 ? (
        <div className="space-y-6">
          {pendingNotes.map((note: any) => (
            <ReviewNoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
            No Notes to Review
          </h3>
          <p className="text-gray-600">
            All notes have been reviewed! Check back later for new submissions.
          </p>
        </div>
      )}
    </div>
  );
}
