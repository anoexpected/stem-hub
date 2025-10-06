'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';

interface ExamBoard {
    id: string;
    name: string;
    code: string;
}

interface Subject {
    id: string;
    name: string;
    code: string;
    exam_board_id: string;
}

interface Topic {
    id: string;
    name: string;
    subject_id: string;
    description: string | null;
    difficulty_level: number;
    order_index: number;
    is_active: boolean;
    subjects: {
        exam_board_id: string;
    };
}

interface TopicFormProps {
    topic: Topic;
    examBoards: ExamBoard[];
    initialSubjects: Subject[];
}

export default function TopicForm({ topic, examBoards, initialSubjects }: TopicFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    const [selectedExamBoard, setSelectedExamBoard] = useState(topic.subjects.exam_board_id);
    const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

    const [formData, setFormData] = useState({
        name: topic.name,
        subject_id: topic.subject_id,
        description: topic.description || '',
        difficulty_level: topic.difficulty_level,
        order_index: topic.order_index,
        is_active: topic.is_active,
    });

    // Fetch subjects when exam board changes
    useEffect(() => {
        if (selectedExamBoard) {
            fetchSubjects(selectedExamBoard);
        }
    }, [selectedExamBoard]);

    const fetchSubjects = async (examBoardId: string) => {
        setLoadingSubjects(true);
        try {
            const response = await fetch(`/api/subjects?exam_board_id=${examBoardId}`);
            const data = await response.json();
            setSubjects(data.subjects || []);
        } catch (err) {
            console.error('Error fetching subjects:', err);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/admin/curriculum/topics/${topic.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update topic');
            }

            router.push('/admin/curriculum/topics');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic Name *
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Quadratic Equations"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Board *
                </label>
                <select
                    required
                    value={selectedExamBoard}
                    onChange={(e) => {
                        setSelectedExamBoard(e.target.value);
                        setFormData({ ...formData, subject_id: '' });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="">Select exam board...</option>
                    {examBoards.map((board) => (
                        <option key={board.id} value={board.id}>
                            {board.name} ({board.code})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                </label>
                <select
                    required
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                    disabled={loadingSubjects || !selectedExamBoard}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                >
                    <option value="">
                        {loadingSubjects ? 'Loading subjects...' : 'Select subject...'}
                    </option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of the topic..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level (1-5) *
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        max="5"
                        value={formData.difficulty_level}
                        onChange={(e) => setFormData({ ...formData, difficulty_level: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">1 = Easiest, 5 = Hardest</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Index *
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={formData.order_index}
                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Display order (lower = first)</p>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active (visible to users)
                </label>
            </div>

            <div className="flex gap-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
