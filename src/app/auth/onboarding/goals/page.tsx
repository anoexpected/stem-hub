'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Target, Loader2, Calendar, Clock, Bell, BookOpen, Video, FileText, Users, Trophy } from 'lucide-react';

const LEARNING_STYLES = [
    { id: 'reading', name: 'Reading Notes', icon: '📖', description: 'Learn through detailed notes' },
    { id: 'videos', name: 'Video Tutorials', icon: '🎥', description: 'Watch explanatory videos' },
    { id: 'practice', name: 'Practice Questions', icon: '✏️', description: 'Learn by doing exercises' },
    { id: 'quizzes', name: 'Interactive Quizzes', icon: '🎮', description: 'Test knowledge with quizzes' },
    { id: 'groups', name: 'Study Groups', icon: '🤝', description: 'Collaborate with peers' },
];

const STUDY_TIME_OPTIONS = [
    { value: '30min', label: '30 minutes/day', icon: '⚡' },
    { value: '1hr', label: '1 hour/day', icon: '💪' },
    { value: '2hrs', label: '2 hours/day', icon: '🔥' },
    { value: '3hrs', label: '3 hours/day', icon: '🚀' },
    { value: '4hrs+', label: '4+ hours/day', icon: '🏆' },
];

export default function GoalsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [examDate, setExamDate] = useState<string>('');
    const [learningStyles, setLearningStyles] = useState<string[]>([]);
    const [studyTime, setStudyTime] = useState<string>('');
    const [notifications, setNotifications] = useState({
        studyReminders: true,
        contentAlerts: true,
        communityUpdates: false,
        achievements: true,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/signup/student');
                return;
            }
            setUserId(user.id);
        };

        getUser();
    }, [router, supabase]);

    const toggleLearningStyle = (styleId: string) => {
        if (learningStyles.includes(styleId)) {
            setLearningStyles(learningStyles.filter(s => s !== styleId));
        } else {
            setLearningStyles([...learningStyles, styleId]);
        }
    };

    const handleComplete = async () => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Update student profile with all preferences (match schema)
            const { error: profileError } = await supabase
                .from('student_profiles')
                .upsert({
                    user_id: userId,
                    exam_date: examDate || null,
                    learning_style: learningStyles,
                    daily_study_minutes: studyTime ? Number(String(studyTime).replace(/\D/g, '')) : 60,
                    notifications: {
                        study_reminders: notifications.studyReminders,
                        content_alerts: notifications.contentAlerts,
                        community_updates: notifications.communityUpdates,
                        achievements: notifications.achievements,
                    },
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (profileError) throw profileError;

            // Award "Onboarding Champion!" achievement (25 points)
            try {
                await supabase.rpc('award_achievement', {
                    p_user_id: userId,
                    p_achievement_name: 'Onboarding Champion!'
                });
            } catch (err) {
                console.error('Error awarding achievement:', err);
            }

            // Mark onboarding as complete
            await supabase
                .from('users')
                .update({
                    onboarding_completed: true,
                    onboarding_step: 6
                })
                .eq('id', userId);

            // Track analytics
            await supabase.from('onboarding_analytics').insert({
                user_id: userId,
                step: 6,
                step_name: 'goals',
                completed_at: new Date().toISOString()
            });

            // Redirect to student dashboard
            router.push('/learn/dashboard');
        } catch (err: any) {
            console.error('Goals completion error:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Calculate minimum exam date (today)
    const today = new Date().toISOString().split('T')[0];
    // Calculate maximum exam date (2 years from now)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-4xl relative">
                {/* Progress indicator */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600 font-medium">Step 6 of 6 - Final Step! 🎉</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-4">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            Set Your Goals
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Let&apos;s personalize your learning experience
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Exam Date */}
                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                            <label className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                When are your exams? (Optional)
                            </label>
                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                min={today}
                                max={maxDateStr}
                                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            />
                            <p className="mt-2 text-sm text-blue-700">
                                We&apos;ll help you stay on track with a personalized study plan
                            </p>
                        </div>

                        {/* Learning Styles */}
                        <div>
                            <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                                <BookOpen className="w-6 h-6 text-green-600" />
                                How do you prefer to learn?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {LEARNING_STYLES.map((style) => {
                                    const isSelected = learningStyles.includes(style.id);
                                    return (
                                        <button
                                            key={style.id}
                                            onClick={() => toggleLearningStyle(style.id)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${isSelected
                                                ? 'border-green-500 bg-green-50 shadow-lg'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{style.icon}</span>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{style.name}</div>
                                                    <div className="text-sm text-gray-600">{style.description}</div>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-sm">✓</span>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Daily Study Time */}
                        <div>
                            <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                                <Clock className="w-6 h-6 text-purple-600" />
                                How much time can you study daily?
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {STUDY_TIME_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setStudyTime(option.value)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${studyTime === option.value
                                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                                            : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl mb-2">{option.icon}</div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {option.label}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl">
                            <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                                <Bell className="w-6 h-6 text-indigo-600" />
                                Notification Preferences
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">Study Reminders</div>
                                            <div className="text-sm text-gray-600">Daily nudges to keep you on track</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.studyReminders}
                                        onChange={(e) => setNotifications({ ...notifications, studyReminders: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">Content Alerts</div>
                                            <div className="text-sm text-gray-600">New notes and past papers for your subjects</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.contentAlerts}
                                        onChange={(e) => setNotifications({ ...notifications, contentAlerts: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">Community Updates</div>
                                            <div className="text-sm text-gray-600">Forum posts and study group invites</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.communityUpdates}
                                        onChange={(e) => setNotifications({ ...notifications, communityUpdates: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">Achievements</div>
                                            <div className="text-sm text-gray-600">Get notified when you unlock achievements</div>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications.achievements}
                                        onChange={(e) => setNotifications({ ...notifications, achievements: e.target.checked })}
                                        className="w-5 h-5 text-indigo-600 rounded"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Achievement preview */}
                        <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="text-5xl">🏆</div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900">Complete Onboarding!</h4>
                                    <p className="text-sm text-gray-700">
                                        Finish setup to unlock <strong>&quot;Onboarding Champion!&quot;</strong> achievement (25 points)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-8">
                        <button
                            onClick={handleComplete}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Completing Setup...
                                </>
                            ) : (
                                <>
                                    🎉 Complete Setup & Start Learning!
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Back link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
        </div>
    );
}
