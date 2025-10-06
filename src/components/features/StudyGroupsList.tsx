import React, { useState, useEffect } from 'react';
import { StudyGroup } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface StudyGroupsListProps {
    subjectId?: string;
    examBoardId?: string;
}

export const StudyGroupsList: React.FC<StudyGroupsListProps> = ({ subjectId, examBoardId }) => {
    const [groups, setGroups] = useState<StudyGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

    useEffect(() => {
        fetchGroups();
    }, [subjectId, examBoardId]);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (subjectId) params.append('subject_id', subjectId);
            if (examBoardId) params.append('exam_board_id', examBoardId);

            const response = await fetch(`/api/study-groups?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch study groups');
            }

            setGroups(data.studyGroups);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async (groupId: string) => {
        try {
            setJoiningGroupId(groupId);
            const response = await fetch(`/api/study-groups/${groupId}/join`, {
                method: 'POST'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to join group');
            }

            alert('Successfully joined the study group!');
            fetchGroups();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setJoiningGroupId(null);
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
                <Button onClick={fetchGroups} className="mt-4">
                    Try Again
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Study Groups</h2>
                <Button
                    variant="primary"
                    onClick={() => window.location.href = '/study-groups/create'}
                >
                    Create Group
                </Button>
            </div>

            {groups.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-gray-600">No study groups available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Be the first to create a study group!
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {groups.map((group: any) => (
                        <Card key={group.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {group.name}
                                    </h3>
                                    {group.description && (
                                        <p className="text-gray-600 text-sm mb-3">
                                            {group.description}
                                        </p>
                                    )}
                                </div>
                                {group.is_public && (
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                        Public
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 mb-4 text-sm text-gray-600">
                                {group.subjects && (
                                    <div className="flex items-center gap-2">
                                        <span>📚</span>
                                        <span>{group.subjects.name}</span>
                                    </div>
                                )}
                                {group.exam_boards && (
                                    <div className="flex items-center gap-2">
                                        <span>🎓</span>
                                        <span>{group.exam_boards.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span>👥</span>
                                    <span>
                                        {group.study_group_members?.[0]?.count || 0} / {group.max_members} members
                                    </span>
                                </div>
                                {group.users && (
                                    <div className="flex items-center gap-2">
                                        <span>👤</span>
                                        <span>Created by {group.users.full_name || 'Anonymous'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleJoinGroup(group.id)}
                                    disabled={joiningGroupId === group.id}
                                    variant="primary"
                                    className="flex-1"
                                >
                                    {joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                                </Button>
                                {group.whatsapp_link && (
                                    <Button
                                        onClick={() => window.open(group.whatsapp_link, '_blank')}
                                        variant="outline"
                                        className="flex-shrink-0"
                                    >
                                        💬 WhatsApp
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
