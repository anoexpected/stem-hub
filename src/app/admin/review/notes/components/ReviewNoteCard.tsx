'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getContentPreview } from '@/lib/textUtils';

interface ReviewNoteCardProps {
  note: any;
}

export default function ReviewNoteCard({ note }: ReviewNoteCardProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch('/api/admin/review/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          contentType: 'note',
          contentId: note.id,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Failed to approve note: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving note:', error);
      alert('An error occurred while approving the note');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }

    setIsRejecting(true);
    try {
      const response = await fetch('/api/admin/review/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          contentType: 'note',
          contentId: note.id,
          feedback,
        }),
      });

      if (response.ok) {
        setShowRejectModal(false);
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Failed to reject note: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting note:', error);
      alert('An error occurred while rejecting the note');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
              {note.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{note.users?.full_name || note.users?.email || 'Unknown'}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
              </div>

              {note.topics?.subjects?.exam_boards && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {note.topics.subjects.exam_boards.name}
                </span>
              )}

              {note.topics?.subjects && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  {note.topics.subjects.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 line-clamp-3">
            {getContentPreview(note.content, 200)}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Topic: {note.topics?.name || 'N/A'}</span>
            <span>•</span>
            <span>Difficulty: {note.difficulty_level || 'N/A'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.open(`/notes/${note.id}`, '_blank')}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isApproving ? 'Approving...' : 'Approve'}</span>
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isRejecting}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Poppins']">
              Reject Note
            </h3>

            <p className="text-gray-600 mb-4">
              Please provide feedback to help the contributor improve:
            </p>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explain why this note is being rejected..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent resize-none"
              rows={4}
            />

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={isRejecting || !feedback.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {isRejecting ? 'Rejecting...' : 'Reject Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
