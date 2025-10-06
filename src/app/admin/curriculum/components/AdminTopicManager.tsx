'use client';

import { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    AlertTriangle,
    TrendingUp,
    BookOpen,
    FileText,
    Users,
    Clock,
    Plus,
    Filter,
    Search,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Topic {
    id: string;
    topic_name: string;
    topic_code: string;
    subject_name: string;
    subject_id: string;
    exam_board_name: string;
    exam_board_id: string;
    available_for_contribution: boolean;
    contribution_status: 'open' | 'in_progress' | 'complete' | 'closed';
    priority_level: 'low' | 'medium' | 'high' | 'urgent';
    required_notes_count: number;
    required_quizzes_count: number;
    current_notes_count: number;
    current_quizzes_count: number;
    completion_percentage: number;
    notes_needed: number;
    quizzes_needed: number;
    unique_contributors: number;
    pending_reviews: number;
    admin_notes: string;
}

export default function AdminTopicManager() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [availableFilter, setAvailableFilter] = useState<string>('all');
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        filterTopics();
    }, [topics, searchQuery, statusFilter, availableFilter]);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/topics/manage');
            const data = await response.json();

            if (response.ok) {
                setTopics(data.topics || []);
            } else {
                toast.error(data.error || 'Failed to fetch topics');
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            toast.error('Failed to load topics');
        } finally {
            setLoading(false);
        }
    };

    const filterTopics = () => {
        let filtered = [...topics];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.topic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.exam_board_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(t => t.contribution_status === statusFilter);
        }

        // Available filter
        if (availableFilter !== 'all') {
            filtered = filtered.filter(t =>
                t.available_for_contribution === (availableFilter === 'true')
            );
        }

        setFilteredTopics(filtered);
    };

    const toggleAvailability = async (topicId: string, currentStatus: boolean) => {
        console.log('Toggle availability:', { topicId, currentStatus, newStatus: !currentStatus });

        try {
            const payload = {
                topic_id: topicId,
                available_for_contribution: !currentStatus,
            };

            console.log('Sending PATCH request:', payload);

            const response = await fetch('/api/admin/topics/manage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.ok) {
                toast.success(data.message);
                fetchTopics();
            } else {
                console.error('Error response:', data);
                toast.error(data.error || 'Failed to update topic');
            }
        } catch (error) {
            console.error('Error toggling topic:', error);
            toast.error('Failed to update topic');
        }
    };

    const updateStatus = async (topicId: string, status: string) => {
        try {
            const response = await fetch('/api/admin/topics/manage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic_id: topicId,
                    contribution_status: status,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchTopics();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            urgent: 'bg-red-100 text-red-800 border-red-300',
            high: 'bg-orange-100 text-orange-800 border-orange-300',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            low: 'bg-green-100 text-green-800 border-green-300',
        };
        return styles[priority as keyof typeof styles] || styles.medium;
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            open: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            complete: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
        };
        return styles[status as keyof typeof styles] || styles.open;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading topics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                    Topic Contribution Management
                </h1>
                <p className="text-gray-600 mt-2">
                    Control which topics are available for contributors to create content
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Topics</p>
                            <p className="text-2xl font-bold text-gray-900">{topics.length}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Available</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {topics.filter(t => t.available_for_contribution).length}
                            </p>
                        </div>
                        <Play className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">In Progress</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {topics.filter(t => t.contribution_status === 'in_progress').length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Pending Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {topics.reduce((sum, t) => sum + t.pending_reviews, 0)}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="complete">Complete</option>
                        <option value="closed">Closed</option>
                    </select>

                    {/* Available Filter */}
                    <select
                        value={availableFilter}
                        onChange={(e) => setAvailableFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                    >
                        <option value="all">All Topics</option>
                        <option value="true">Available Only</option>
                        <option value="false">Unavailable Only</option>
                    </select>
                </div>
            </div>

            {/* Topics Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Topic
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progress
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Content
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contributors
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Available
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTopics.map((topic) => (
                                <tr key={topic.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{topic.topic_name}</div>
                                            <div className="text-sm text-gray-500">
                                                {topic.exam_board_name} • {topic.subject_name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(topic.priority_level)}`}>
                                            {topic.priority_level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(topic.contribution_status)}`}>
                                            {topic.contribution_status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-[#2ECC71] h-2 rounded-full transition-all"
                                                    style={{ width: `${topic.completion_percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {topic.completion_percentage}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <FileText className="w-4 h-4" />
                                                {topic.current_notes_count}/{topic.required_notes_count} notes
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <BookOpen className="w-4 h-4" />
                                                {topic.current_quizzes_count}/{topic.required_quizzes_count} quizzes
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-gray-700">
                                            <Users className="w-4 h-4" />
                                            {topic.unique_contributors}
                                        </div>
                                        {topic.pending_reviews > 0 && (
                                            <div className="flex items-center gap-1 text-orange-600 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {topic.pending_reviews} pending
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleAvailability(topic.id, topic.available_for_contribution)}
                                            className={`p-2 rounded-lg transition ${topic.available_for_contribution
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            title={topic.available_for_contribution ? 'Available' : 'Unavailable'}
                                        >
                                            {topic.available_for_contribution ? (
                                                <Play className="w-5 h-5" />
                                            ) : (
                                                <Pause className="w-5 h-5" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {topic.completion_percentage >= 100 && topic.contribution_status !== 'complete' && (
                                                <button
                                                    onClick={() => updateStatus(topic.id, 'complete')}
                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                                    title="Mark as Complete"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedTopic(topic);
                                                    setShowEditModal(true);
                                                }}
                                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                                title="Edit"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTopics.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No topics found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Topic Modal */}
            {showEditModal && selectedTopic && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                Edit Topic
                            </h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedTopic(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Topic Info */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{selectedTopic.topic_name}</h3>
                                <p className="text-sm text-gray-600">
                                    {selectedTopic.exam_board_name} • {selectedTopic.subject_name}
                                </p>
                            </div>

                            {/* Availability Toggle */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTopic.available_for_contribution}
                                        onChange={(e) => {
                                            const newValue = e.target.checked;
                                            setSelectedTopic({ ...selectedTopic, available_for_contribution: newValue });
                                        }}
                                        className="w-5 h-5 text-[#2ECC71] rounded focus:ring-[#2ECC71]"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Available for Contribution</span>
                                        <p className="text-sm text-gray-500">Contributors can create content for this topic</p>
                                    </div>
                                </label>
                            </div>

                            {/* Priority Level */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Priority Level
                                </label>
                                <select
                                    value={selectedTopic.priority_level}
                                    onChange={(e) => setSelectedTopic({ ...selectedTopic, priority_level: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                >
                                    <option value="low">🟢 Low</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="high">🟠 High</option>
                                    <option value="urgent">🔴 Urgent</option>
                                </select>
                            </div>

                            {/* Contribution Status */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={selectedTopic.contribution_status}
                                    onChange={(e) => setSelectedTopic({ ...selectedTopic, contribution_status: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="complete">Complete</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            {/* Requirements */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Required Notes
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={selectedTopic.required_notes_count}
                                        onChange={(e) => setSelectedTopic({ ...selectedTopic, required_notes_count: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Required Quizzes
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={selectedTopic.required_quizzes_count}
                                        onChange={(e) => setSelectedTopic({ ...selectedTopic, required_quizzes_count: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Current Progress */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-3">Current Progress</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Notes:</span>
                                        <span className="font-semibold text-gray-900 ml-2">
                                            {selectedTopic.current_notes_count} / {selectedTopic.required_notes_count}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Quizzes:</span>
                                        <span className="font-semibold text-gray-900 ml-2">
                                            {selectedTopic.current_quizzes_count} / {selectedTopic.required_quizzes_count}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Contributors:</span>
                                        <span className="font-semibold text-gray-900 ml-2">
                                            {selectedTopic.unique_contributors}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Completion:</span>
                                        <span className="font-semibold text-gray-900 ml-2">
                                            {selectedTopic.completion_percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Admin Notes (Internal)
                                </label>
                                <textarea
                                    value={selectedTopic.admin_notes || ''}
                                    onChange={(e) => setSelectedTopic({ ...selectedTopic, admin_notes: e.target.value })}
                                    rows={4}
                                    placeholder="Add internal notes about this topic..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedTopic(null);
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/admin/topics/manage', {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                topic_id: selectedTopic.id,
                                                available_for_contribution: selectedTopic.available_for_contribution,
                                                contribution_status: selectedTopic.contribution_status,
                                                priority_level: selectedTopic.priority_level,
                                                required_notes_count: selectedTopic.required_notes_count,
                                                required_quizzes_count: selectedTopic.required_quizzes_count,
                                                admin_notes: selectedTopic.admin_notes,
                                            }),
                                        });

                                        const data = await response.json();

                                        if (response.ok) {
                                            toast.success('Topic updated successfully!');
                                            setShowEditModal(false);
                                            setSelectedTopic(null);
                                            fetchTopics();
                                        } else {
                                            toast.error(data.error || 'Failed to update topic');
                                        }
                                    } catch (error) {
                                        console.error('Error updating topic:', error);
                                        toast.error('An error occurred');
                                    }
                                }}
                                className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
