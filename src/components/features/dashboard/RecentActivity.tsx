'use client';

import { Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface RecentActivityProps {
    recentQuizzes: any[];
    recentSessions: any[];
}

export default function RecentActivity({ recentQuizzes, recentSessions }: RecentActivityProps) {
    // Combine and sort activities
    const activities = [
        ...((recentQuizzes || []).map((quiz) => ({
            type: 'quiz',
            id: quiz.id,
            title: quiz.quiz?.title || 'Quiz',
            subject: quiz.quiz?.topic?.subject?.name || 'Unknown',
            topic: quiz.quiz?.topic?.name || 'Unknown',
            score: quiz.score,
            totalScore: quiz.total_score,
            percentage: quiz.percentage,
            timestamp: new Date(quiz.completed_at),
        }))),
        ...((recentSessions || []).map((session) => ({
            type: 'practice',
            id: session.id,
            title: session.topic?.name || 'Practice Session',
            subject: session.topic?.subject?.name || 'Unknown',
            topic: session.topic?.name,
            score: session.score,
            totalQuestions: session.total_questions,
            percentage: session.total_questions
                ? Math.round((session.score / session.total_questions) * 100)
                : 0,
            timestamp: new Date(session.created_at),
        }))),
    ]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5);

    if (activities.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">No activity yet</p>
                    <p className="text-xs text-gray-500 mt-1">Start practicing to see your progress here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <Link
                    href="/activity"
                    className="text-sm text-[#2ECC71] hover:text-[#27AE60] font-medium"
                >
                    View All
                </Link>
            </div>

            <div className="space-y-3">
                {activities.map((activity) => {
                    const passed = activity.percentage >= 50;

                    return (
                        <div
                            key={`${activity.type}-${activity.id}`}
                            className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${activity.type === 'quiz'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {activity.type === 'quiz' ? 'Quiz' : 'Practice'}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-gray-900 text-sm truncate">
                                        {activity.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        {activity.subject}
                                        {activity.topic && ` • ${activity.topic}`}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2 ml-3">
                                    {passed ? (
                                        <CheckCircle className="w-5 h-5 text-[#2ECC71]" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <p className="text-xs text-gray-600">Score</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {activity.type === 'quiz'
                                                ? `${activity.score}/${'totalScore' in activity ? activity.totalScore : 0}`
                                                : `${activity.score}/${'totalQuestions' in activity ? activity.totalQuestions : 0}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Accuracy</p>
                                        <p
                                            className={`text-sm font-bold ${passed ? 'text-[#2ECC71]' : 'text-gray-900'
                                                }`}
                                        >
                                            {activity.percentage}%
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        {formatRelativeTime(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
