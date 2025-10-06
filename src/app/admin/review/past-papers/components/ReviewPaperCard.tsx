'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User, FileText, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReviewPaperCardProps {
    paper: any;
}

export default function ReviewPaperCard({ paper }: ReviewPaperCardProps) {
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
                body: JSON.stringify({
                    contentType: 'past_paper',
                    contentId: paper.id,
                }),
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to approve past paper');
            }
        } catch (error) {
            console.error('Error approving past paper:', error);
            alert('An error occurred');
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
                body: JSON.stringify({
                    contentType: 'past_paper',
                    contentId: paper.id,
                    feedback,
                }),
            });

            if (response.ok) {
                setShowRejectModal(false);
                router.refresh();
            } else {
                alert('Failed to reject past paper');
            }
        } catch (error) {
            console.error('Error rejecting past paper:', error);
            alert('An error occurred');
        } finally {
            setIsRejecting(false);
        }
    };

    const handleDownload = (url: string, filename: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
                            {paper.subjects?.name} - {paper.year} {paper.season}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{paper.users?.full_name || paper.users?.email || 'Unknown'}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                            </div>

                            {paper.subjects?.exam_boards && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    {paper.subjects.exam_boards.name}
                                </span>
                            )}

                            {paper.subjects && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    {paper.subjects.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Paper Number:</span>
                        <span className="font-medium text-gray-900">{paper.paper_number}</span>
                    </div>

                    {paper.total_marks && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Marks:</span>
                            <span className="font-medium text-gray-900">{paper.total_marks}</span>
                        </div>
                    )}

                    {paper.time_allowed_minutes && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Time Allowed:</span>
                            <span className="font-medium text-gray-900">{paper.time_allowed_minutes} minutes</span>
                        </div>
                    )}
                </div>

                {/* Files */}
                <div className="mb-4 pb-4 border-b border-gray-200 space-y-2">
                    {paper.file_url ? (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Past Paper PDF</span>
                            </div>
                            <button
                                onClick={() => window.open(paper.file_url, '_blank')}
                                className="text-blue-600 hover:text-blue-700 transition"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="p-3 bg-gray-100 rounded-lg text-center">
                            <span className="text-sm text-gray-600">No file uploaded</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => window.open(`/past-papers/${paper.id}`, '_blank')}
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
                            Reject Past Paper
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Please provide feedback to help the contributor improve:
                        </p>

                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Explain why this past paper is being rejected..."
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
                                {isRejecting ? 'Rejecting...' : 'Reject Paper'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
