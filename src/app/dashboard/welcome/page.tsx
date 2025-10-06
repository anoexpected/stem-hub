'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Sparkles, Trophy, BookOpen, Play, FileText, Users, TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Achievement {
    name: string;
    description: string;
    icon: string;
    points: number;
    earned_at: string;
}

export default function WelcomeDashboard() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        // Trigger confetti celebration
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#2ECC71', '#F1C40F', '#8E44AD'],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#2ECC71', '#F1C40F', '#8E44AD'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            // Get user profile
            const { data: profile } = await supabase
                .from('student_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            setUserName(profile?.full_name || user.email?.split('@')[0] || 'Student');

            // Get user achievements
            const { data: userAchievements } = await supabase
                .from('user_achievements_v2')
                .select(`
          earned_at,
          achievement:achievements(name, description, icon, points)
        `)
                .eq('user_id', user.id)
                .order('earned_at', { ascending: false });

            if (userAchievements) {
                const achievementsList = userAchievements.map((ua: any) => ({
                    name: ua.achievement.name,
                    description: ua.achievement.description,
                    icon: ua.achievement.icon,
                    points: ua.achievement.points,
                    earned_at: ua.earned_at,
                }));
                setAchievements(achievementsList);

                // Calculate total points
                const total = achievementsList.reduce((sum, ach) => sum + ach.points, 0);
                setTotalPoints(total);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetStarted = () => {
        router.push('/learn/dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 py-12">
                {/* Welcome header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full mb-6 shadow-2xl">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4 font-['Poppins']">
                        Welcome to STEM Hub, {userName}! 🎉
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        You&apos;re all set! Your personalized learning journey starts now.
                    </p>
                </div>

                {/* Achievements showcase */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            Your Achievements
                        </h2>
                        <div className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg">
                            {totalPoints} Points
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="p-5 bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-green-200 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-4xl">{achievement.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                                        <p className="text-sm text-gray-600">{achievement.description}</p>
                                    </div>
                                </div>
                                <div className="mt-3 text-right">
                                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">
                                        +{achievement.points} pts
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {achievements.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Trophy className="w-16 h-16 mx-auto mb-3 opacity-30" />
                            <p>No achievements yet. Start learning to unlock achievements!</p>
                        </div>
                    )}
                </div>

                {/* Quick action cards */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Play className="w-8 h-8 text-green-600" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={() => router.push('/notes')}
                            className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-200 text-left group"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Browse Notes</h3>
                            <p className="text-sm text-gray-600">Access study notes for your subjects</p>
                        </button>

                        <button
                            onClick={() => router.push('/quizzes')}
                            className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-200 text-left group"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Take a Quiz</h3>
                            <p className="text-sm text-gray-600">Test your knowledge with quizzes</p>
                        </button>

                        <button
                            onClick={() => router.push('/past-papers')}
                            className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 text-left group"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Past Papers</h3>
                            <p className="text-sm text-gray-600">Practice with exam papers</p>
                        </button>

                        <button
                            onClick={() => router.push('/forums')}
                            className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-xl transition-all duration-200 text-left group"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Join Community</h3>
                            <p className="text-sm text-gray-600">Connect with fellow students</p>
                        </button>
                    </div>
                </div>

                {/* Personalized recommendations */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8" />
                        Personalized Just for You
                    </h2>
                    <p className="text-indigo-100 mb-6">
                        Based on your selected subjects and learning preferences, we&apos;ve curated the best resources to help you succeed.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <div className="px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                            📚 15 Notes available
                        </div>
                        <div className="px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                            🎯 23 Quizzes ready
                        </div>
                        <div className="px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                            📄 8 Past papers
                        </div>
                        <div className="px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                            👥 12 Students from your school
                        </div>
                    </div>
                </div>

                {/* CTA button */}
                <div className="text-center">
                    <button
                        onClick={handleGetStarted}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105"
                    >
                        Start Learning Now
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <p className="mt-4 text-sm text-gray-600">
                        You can always update your preferences in settings
                    </p>
                </div>
            </div>
        </div>
    );
}
