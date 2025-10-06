'use client';

import Link from 'next/link';
import { FileText, Clock, CheckCircle, XCircle, Edit, Trash2, Eye, MessageSquare } from 'lucide-react';
import { getContentPreview } from '@/lib/textUtils';

interface ContentCardProps {
    note: {
        id: string;
        title: string;
        content: string;
        status: 'draft' | 'pending' | 'published' | 'rejected';
        created_at: string;
        updated_at: string;
        views_count?: number;
        topics?: {
            id: string;
            name: string;
            subjects?: {
                id: string;
                name: string;
                exam_boards?: {
                    id: string;
                    name: string;
                };
            };
        };
        reviews?: Array<{
            id: string;
            feedback?: string;
            status: string;
            created_at: string;
        }>;
    };
}

const getStatusConfig = (status: string) => {
    const configs = {
        draft: {
            color: 'bg-gray-100 text-gray-800',
            icon: FileText,
            label: 'Draft',
        },
        pending: {
            color: 'bg-yellow-100 text-yellow-800',
            icon: Clock,
            label: 'Pending Review',
        },
        published: {
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
            label: 'Published',
        },
        rejected: {
            color: 'bg-red-100 text-red-800',
            icon: XCircle,
            label: 'Rejected',
        },
    };
    return configs[status as keyof typeof configs] || configs.draft;
};

export default function ContentCard({ note }: ContentCardProps) {
    const statusConfig = getStatusConfig(note.status);
    const StatusIcon = statusConfig.icon;

    const latestReview = note.reviews && note.reviews.length > 0
        ? note.reviews[0]
        : null;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Poppins'] line-clamp-2">
                        {note.title}
                    </h3>

                    {/* Topic Breadcrumb */}
                    {note.topics && (
                        <p className="text-xs text-gray-500 mb-2">
                            {note.topics.subjects?.exam_boards?.name} • {note.topics.subjects?.name} • {note.topics.name}
                        </p>
                    )}

                    {/* Content Preview */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {getContentPreview(note.content, 150)}
                    </p>
                </div>

                {/* Status Badge */}
                <span className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full ${statusConfig.color} ml-4`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusConfig.label}</span>
                </span>
            </div>

            {/* Feedback Section */}
            {note.status === 'rejected' && latestReview?.feedback && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-red-900 mb-1">Admin Feedback:</p>
                            <p className="text-xs text-red-800">{latestReview.feedback}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                    <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
                    {note.views_count !== undefined && (
                        <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {note.views_count} views
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
                {(note.status === 'draft' || note.status === 'rejected') && (
                    <Link
                        href={`/contribute/create/note?edit=${note.id}`}
                        className="flex items-center space-x-1 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition text-sm font-medium"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                    </Link>
                )}

                {note.status === 'published' && (
                    <Link
                        href={`/notes/${note.id}`}
                        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                    </Link>
                )}

                {note.status === 'pending' && (
                    <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                        Under Review
                    </span>
                )}

                {note.status === 'draft' && (
                    <button
                        className="flex items-center space-x-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                )}
            </div>
        </div>
    );
}
