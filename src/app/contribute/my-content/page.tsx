import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import ContentCard from './components/ContentCard';

export default async function MyContentPage() {
  try {
    const user = await requireRole('contributor');
    const supabase = await createClient();

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*, topics(id, name, subjects(id, name, exam_boards(id, name)))')
      .eq('created_by', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    }

    const drafts = notes?.filter((n) => n.status === 'draft') || [];
    const pending = notes?.filter((n) => n.status === 'pending') || [];
    const published = notes?.filter((n) => n.status === 'published') || [];
    const rejected = notes?.filter((n) => n.status === 'rejected') || [];

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Content</h1>
            <p className="text-gray-600 mt-2">Manage all your contributions</p>
          </div>
          <Link href="/contribute/create" className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-5 h-5" />
            <span>Create New</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <p className="text-sm text-gray-600 mb-1">Drafts</p>
            <p className="text-3xl font-bold">{drafts.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pending.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-sm text-gray-600 mb-1">Published</p>
            <p className="text-3xl font-bold text-green-600">{published.length}</p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{rejected.length}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link href="/contribute/my-content" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">All ({notes?.length || 0})</Link>
          <Link href="/contribute/my-content/drafts" className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Drafts ({drafts.length})</Link>
          <Link href="/contribute/my-content/pending" className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Pending ({pending.length})</Link>
          <Link href="/contribute/my-content/published" className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Published ({published.length})</Link>
        </div>

        {notes && notes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notes.map((note) => (
              <ContentCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Content Yet</h3>
            <p className="text-gray-600 mb-6">Start creating content to share with students!</p>
            <Link href="/contribute/create" className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="w-5 h-5" />
              <span>Create Content</span>
            </Link>
          </div>
        )}
      </div>
    );
  } catch {
    redirect('/auth/login?redirect=/contribute/my-content');
  }
}
