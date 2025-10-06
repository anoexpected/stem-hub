import Link from 'next/link';
import { FileText, Eye, TrendingUp } from 'lucide-react';

interface RelatedNotesProps {
  notes: any[];
}

export default function RelatedNotes({ notes }: RelatedNotesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Poppins']">
        Related Notes
      </h3>

      <div className="space-y-3">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                  {note.title}
                </h4>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{note.view_count || 0}</span>
                  </div>
                  
                  {note.difficulty_level && (
                    <span className={`px-2 py-0.5 rounded-full ${
                      note.difficulty_level === 'beginner' 
                        ? 'bg-green-100 text-green-700'
                        : note.difficulty_level === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {note.difficulty_level}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/notes"
        className="block mt-4 text-center text-sm text-[#2ECC71] hover:text-[#27AE60] font-medium"
      >
        View all notes →
      </Link>
    </div>
  );
}
