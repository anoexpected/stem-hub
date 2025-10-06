import React, { useState, useEffect } from 'react';
import { Note, Topic } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface NotesBrowserProps {
    topicId?: string;
    showCreateButton?: boolean;
    onNoteClick?: (note: Note) => void;
}

export const NotesBrowser: React.FC<NotesBrowserProps> = ({
    topicId,
    showCreateButton = false,
    onNoteClick
}) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchNotes();
    }, [topicId, page]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                status: 'approved'
            });

            if (topicId) {
                params.append('topic_id', topicId);
            }

            const response = await fetch(`/api/notes?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch notes');
            }

            setNotes(data.notes);
            setTotalPages(data.pagination.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-6 text-center">
                <p className="text-red-600">Error: {error}</p>
                <Button onClick={fetchNotes} className="mt-4">
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Study Notes</h2>
                {showCreateButton && (
                    <Button variant="primary" onClick={() => window.location.href = '/notes/create'}>
                        Create Note
                    </Button>
                )}
            </div>

            {notes.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-gray-600">No notes available yet.</p>
                    {showCreateButton && (
                        <p className="text-sm text-gray-500 mt-2">
                            Be the first to create a study note for this topic!
                        </p>
                    )}
                </Card>
            ) : (
                <div className="grid gap-4">
                    {notes.map((note: any) => (
                        <Card
                            key={note.id}
                            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => onNoteClick ? onNoteClick(note) : window.location.href = `/notes/${note.id}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {note.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        {note.topics && (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {note.topics.name}
                                            </span>
                                        )}
                                        {note.users && (
                                            <span>By {note.users.full_name || 'Anonymous'}</span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 line-clamp-2">
                                        {note.content.substring(0, 200)}...
                                    </p>
                                </div>
                                <div className="ml-4 flex flex-col items-end gap-2">
                                    {note.rating_avg && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            <span className="font-semibold">{note.rating_avg.toFixed(1)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span>👁️ {note.views_count}</span>
                                        <span>❤️ {note.likes_count}</span>
                                    </div>
                                </div>
                            </div>
                            {note.tags && note.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {note.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <Button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};
