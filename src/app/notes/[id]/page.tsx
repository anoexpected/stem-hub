import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import NoteContent from './components/NoteContent';
import NoteHeader from './components/NoteHeader';
import NoteActions from './components/NoteActions';
import RelatedNotes from './components/RelatedNotes';

interface NotePageProps {
  params: {
    id: string;
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const supabase = await createClient();

  // Get current user to check if they're admin or the note creator
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user role if logged in
  let userRole = null;
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    userRole = userData?.role;
  }

  // Fetch note with all related data
  const { data: note, error } = await supabase
    .from('notes')
    .select(`
      *,
      users!notes_created_by_fkey(id, full_name, email),
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
    .eq('id', params.id)
    .single();

  if (error || !note) {
    notFound();
  }

  // Check if user has permission to view this note
  const isAdmin = userRole === 'admin';
  const isOwner = user?.id === note.created_by;
  const isPublished = note.status === 'approved';

  // Only allow access if: published, owner, or admin
  if (!isPublished && !isOwner && !isAdmin) {
    notFound();
  }

  // Increment view count only for published notes
  if (isPublished) {
    await supabase
      .from('notes')
      .update({ views_count: (note.views_count || 0) + 1 })
      .eq('id', params.id);
  }

  // Fetch related notes from same topic (only published)
  const { data: relatedNotes } = await supabase
    .from('notes')
    .select('id, title, views_count, created_at')
    .eq('topic_id', note.topic_id)
    .eq('status', 'approved')
    .neq('id', params.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NoteHeader note={note} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Note Content */}
          <div className="lg:col-span-2">
            <NoteContent note={note} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <NoteActions noteId={note.id} />
            {relatedNotes && relatedNotes.length > 0 && (
              <RelatedNotes notes={relatedNotes} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
