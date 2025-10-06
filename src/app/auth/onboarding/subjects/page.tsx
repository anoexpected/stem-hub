'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Loader2, CheckCircle2, Search, Sparkles } from 'lucide-react';

// Only STEM categories are shown
const CATEGORIES = {
    core: { name: 'Core STEM', color: 'green' },
    technology: { name: 'Technology', color: 'blue' },
} as const;

function getEmojiForSubject(name: string) {
    const map: Record<string, string> = {
        Mathematics: '📐',
        Physics: '⚡',
        Chemistry: '🧪',
        Biology: '🧬',
        'Computer Science': '💻',
        'Information Technology': '🖥️',
    };
    return map[name] ?? '📘';
}

export default function SubjectSelectionPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [showAchievement, setShowAchievement] = useState(false);
    const [subjects, setSubjects] = useState<Array<{ id: string; name: string; category: 'core' | 'technology'; examBoard?: string }>>([]);
    const [examBoards, setExamBoards] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/auth/signup/student');
                return;
            }
            setUserId(user.id);

            // Fetch user's exam boards from their profile
            const { data: profileData } = await supabase
                .from('student_profiles')
                .select('exam_boards')
                .eq('user_id', user.id)
                .single();

            const userExamBoards = profileData?.exam_boards || [];
            setExamBoards(userExamBoards);

            // Fetch subjects filtered by user's exam boards
            if (userExamBoards.length > 0) {
                // First get exam board IDs for the user's selected exam board codes
                const { data: examBoardData } = await supabase
                    .from('exam_boards')
                    .select('id, code')
                    .in('code', userExamBoards);

                if (examBoardData && examBoardData.length > 0) {
                    const examBoardIds = examBoardData.map(eb => eb.id);

                    // Now fetch subjects for those exam boards
                    const { data: subjectsData, error: subjectsError } = await supabase
                        .from('subjects')
                        .select('id, name, exam_board_id')
                        .eq('is_stem', true)
                        .eq('is_active', true)
                        .in('exam_board_id', examBoardIds)
                        .order('name');

                    if (!subjectsError && subjectsData) {
                        // Map exam board IDs back to codes for display
                        const examBoardMap = Object.fromEntries(
                            examBoardData.map(eb => [eb.id, eb.code])
                        );

                        const normalized = subjectsData.map((s: any) => ({
                            id: s.id,
                            name: s.name,
                            examBoard: examBoardMap[s.exam_board_id],
                            category: ['Computer Science', 'Information Technology'].includes(s.name)
                                ? 'technology' as const
                                : 'core' as const,
                        }));
                        setSubjects(normalized);
                    }
                }
            } else {
                // No exam boards selected, show error or redirect
                setError('Please select an exam board first');
                setTimeout(() => {
                    router.push('/auth/onboarding/exam-board');
                }, 2000);
            }
        };

        load();
    }, [router, supabase]);

    // Filter subjects by search
    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group subjects by category
    const subjectsByCategory = filteredSubjects.reduce((acc, subject) => {
        if (!acc[subject.category]) {
            acc[subject.category] = [];
        }
        acc[subject.category].push(subject);
        return acc;
    }, {} as Record<string, typeof subjects>);

    const toggleSubject = (subjectName: string) => {
        if (selectedSubjects.includes(subjectName)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
        } else {
            setSelectedSubjects([...selectedSubjects, subjectName]);

            // Show achievement hint when selecting 5th subject
            if (selectedSubjects.length + 1 === 5) {
                setShowAchievement(true);
                setTimeout(() => setShowAchievement(false), 3000);
            }
        }
    };

    const handleContinue = async () => {
        if (selectedSubjects.length < 3) {
            setError('Please select at least 3 subjects');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Map selected subject names to IDs
            const selectedIds = subjects
                .filter(s => selectedSubjects.includes(s.name))
                .map(s => s.id);

            // Insert into user_subjects
            const insertPromises = selectedIds.map(subjectId =>
                supabase
                    .from('user_subjects')
                    .insert({ user_id: userId, subject_id: subjectId })
                    .select()
                    .single()
            );

            // Execute all inserts, ignoring duplicates
            await Promise.allSettled(insertPromises);

            // Award "Subject Explorer" achievement if 5+ subjects (15 points)
            if (selectedSubjects.length >= 5) {
                try {
                    await supabase.rpc('award_achievement', {
                        p_user_id: userId,
                        p_achievement_name: 'Subject Explorer'
                    });
                } catch (err) {
                    console.error('Error awarding achievement:', err);
                }
            }

            // Update onboarding step
            await supabase
                .from('users')
                .update({ onboarding_step: 5 })
                .eq('id', userId);

            // Track analytics
            await supabase.from('onboarding_analytics').insert({
                user_id: userId,
                step: 5,
                step_name: 'subjects',
                completed_at: new Date().toISOString()
            });

            // Redirect to goals page
            router.push('/auth/onboarding/goals');
        } catch (err: any) {
            console.error('Subject selection error:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        if (!userId) return;

        await supabase
            .from('users')
            .update({ onboarding_step: 5 })
            .eq('id', userId);

        router.push('/auth/onboarding/goals');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-5xl relative">
                {/* Progress indicator */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600 font-medium">Step 5 of 6</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: '83.33%' }}></div>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            Select Your Subjects
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Choose at least 3 subjects you&apos;re studying (Recommended: 5+)
                        </p>
                        {examBoards.length > 0 && (
                            <p className="mt-1 text-sm text-gray-500">
                                Showing subjects for: <span className="font-semibold text-blue-600">{examBoards.join(', ')}</span>
                            </p>
                        )}

                        {/* Selection counter */}
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-semibold text-green-900">
                                {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                                {selectedSubjects.length >= 3 && (
                                    <span className="text-green-600"> ✓</span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Achievement notification */}
                    {showAchievement && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3 animate-bounce">
                            <Sparkles className="w-6 h-6 text-yellow-600" />
                            <div>
                                <p className="font-semibold text-yellow-900">🏆 Achievement Unlocked!</p>
                                <p className="text-sm text-yellow-700">
                                    Select 5+ subjects to earn &quot;Subject Explorer&quot; (15 points)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Search bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Subjects by category */}
                    <div className="max-h-[500px] overflow-y-auto space-y-6 mb-8">
                        {Object.entries(subjectsByCategory).map(([category, subjects]) => {
                            const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];
                            return (
                                <div key={category}>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full bg-${categoryInfo.color}-500`}></span>
                                        {categoryInfo.name}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {subjects.map((subject) => {
                                            const isSelected = selectedSubjects.includes(subject.name);
                                            return (
                                                <button
                                                    key={subject.name}
                                                    onClick={() => toggleSubject(subject.name)}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${isSelected
                                                        ? 'border-green-500 bg-green-50 shadow-lg'
                                                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="text-center">
                                                        <div className="text-3xl mb-2">{getEmojiForSubject(subject.name)}</div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {subject.name}
                                                        </div>
                                                        {isSelected && (
                                                            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mt-2" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Info box */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                        <p className="font-semibold mb-1">💡 Pro Tip</p>
                        <p>Select all the subjects you&apos;re currently studying. We&apos;ll curate notes, past papers, and practice questions specifically for your subjects!</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleSkip}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                        >
                            Skip for Now
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={loading || selectedSubjects.length < 3}
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <span className="text-xl">→</span>
                                </>
                            )}
                        </button>
                    </div>

                    {selectedSubjects.length > 0 && (
                        <div className="mt-4 text-center text-sm text-gray-600">
                            Selected: {selectedSubjects.join(', ')}
                        </div>
                    )}
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
