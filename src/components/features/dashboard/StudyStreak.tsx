'use client';

import { Flame, Trophy, Calendar } from 'lucide-react';

interface StudyStreakProps {
    streak: any;
}

export default function StudyStreak({ streak }: StudyStreakProps) {
    const currentStreak = streak?.current_streak || 0;
    const longestStreak = streak?.longest_streak || 0;
    const totalDays = streak?.total_practice_days || 0;

    // Get last 7 days for visualization
    const last7Days = getLast7Days();
    const lastActivityDate = streak?.last_activity_date
        ? new Date(streak.last_activity_date)
        : null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Study Streak</h3>
                <div className="flex items-center space-x-2 text-[#F1C40F]">
                    <Flame className="w-5 h-5" />
                    <span className="text-2xl font-bold">{currentStreak}</span>
                </div>
            </div>

            {/* Week View */}
            <div className="flex items-center justify-between mb-6">
                {last7Days.map((day, index) => {
                    const isActive = lastActivityDate && day <= lastActivityDate;
                    const isToday = day.toDateString() === new Date().toDateString();

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all ${isActive
                                        ? 'bg-[#2ECC71] text-white'
                                        : 'bg-gray-100 text-gray-400'
                                    } ${isToday ? 'ring-2 ring-[#F1C40F] ring-offset-2' : ''}`}
                            >
                                {isActive ? '✓' : ''}
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                                {day.toLocaleDateString('en-US', { weekday: 'narrow' })}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-medium">Best Streak</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{longestStreak}</p>
                </div>
                <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Total Days</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
                </div>
            </div>

            {/* Motivation Message */}
            <div className="mt-4 p-3 bg-gradient-to-r from-[#2ECC71]/10 to-[#16A085]/10 rounded-lg">
                <p className="text-sm text-gray-700">
                    {currentStreak === 0 ? (
                        <>🚀 Start your streak today! Practice now to begin.</>
                    ) : currentStreak < 3 ? (
                        <>🔥 Great start! Keep going to build your streak.</>
                    ) : currentStreak < 7 ? (
                        <>💪 You're on fire! {7 - currentStreak} more days to a week.</>
                    ) : (
                        <>🌟 Amazing! You're crushing it with consistency!</>
                    )}
                </p>
            </div>
        </div>
    );
}

function getLast7Days(): Date[] {
    const days: Date[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        day.setHours(0, 0, 0, 0);
        days.push(day);
    }

    return days;
}
