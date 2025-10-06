'use client';

import { Target, CheckCircle, TrendingUp, Flame } from 'lucide-react';

interface StatsOverviewProps {
    totalQuestionsAttempted: number;
    averageAccuracy: number;
    totalTopicsStudied: number;
    currentStreak: number;
}

export default function StatsOverview({
    totalQuestionsAttempted,
    averageAccuracy,
    totalTopicsStudied,
    currentStreak,
}: StatsOverviewProps) {
    const stats = [
        {
            icon: Target,
            label: 'Questions Practiced',
            value: totalQuestionsAttempted,
            color: 'bg-blue-50 text-blue-600',
            iconBg: 'bg-blue-100',
        },
        {
            icon: CheckCircle,
            label: 'Average Accuracy',
            value: `${averageAccuracy}%`,
            color: 'bg-green-50 text-green-600',
            iconBg: 'bg-green-100',
        },
        {
            icon: TrendingUp,
            label: 'Topics Studied',
            value: totalTopicsStudied,
            color: 'bg-purple-50 text-purple-600',
            iconBg: 'bg-purple-100',
        },
        {
            icon: Flame,
            label: 'Day Streak',
            value: currentStreak,
            color: 'bg-orange-50 text-orange-600',
            iconBg: 'bg-orange-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.iconBg} p-3 rounded-lg`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
