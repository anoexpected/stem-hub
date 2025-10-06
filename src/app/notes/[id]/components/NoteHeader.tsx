import { ArrowLeft, Calendar, Eye, User, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface NoteHeaderProps {
  note: any;
}

export default function NoteHeader({ note }: NoteHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-300 mb-6">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <span>/</span>
          {note.topics?.subjects?.exam_boards && (
            <>
              <Link
                href={`/exam-boards/${note.topics.subjects.exam_boards.id}`}
                className="hover:text-white transition"
              >
                {note.topics.subjects.exam_boards.name}
              </Link>
              <span>/</span>
            </>
          )}
          {note.topics?.subjects && (
            <>
              <Link
                href={`/subjects/${note.topics.subjects.id}`}
                className="hover:text-white transition"
              >
                {note.topics.subjects.name}
              </Link>
              <span>/</span>
            </>
          )}
          {note.topics && (
            <span className="text-white">{note.topics.name}</span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold font-['Poppins']">
            {note.title}
          </h1>
          {note.status === 'pending' && (
            <span className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold">
              Pending Review
            </span>
          )}
          {note.status === 'draft' && (
            <span className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold">
              Draft
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>By {note.users?.full_name || note.users?.email || 'Anonymous'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(note.created_at).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{note.views_count || 0} views</span>
          </div>
        </div>

        {/* Back Button */}
        <Link
          href={`/topics/${note.topic_id}`}
          className="inline-flex items-center space-x-2 mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {note.topics?.name}</span>
        </Link>
      </div>
    </div>
  );
}
