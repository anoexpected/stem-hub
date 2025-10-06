'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap, Loader2, Info, CheckCircle2 } from 'lucide-react';

interface ExamBoard {
    id: string;
    name: string;
    code: string;
    country: string;
    description: string;
    is_active: boolean;
}

export default function ExamBoardPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userCountry, setUserCountry] = useState<string>('');
    const [selectedExamBoard, setSelectedExamBoard] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
    const [availableLevels, setAvailableLevels] = useState<string[]>([]);
    const [error, setError] = useState('');


    useEffect(() => {
        const init = async () => {
            try {
                // Check authentication
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    console.error('[Exam Board Page] Auth error:', authError);
                    router.push('/auth/signup/student');
                    return;
                }

                console.log('[Exam Board Page] User authenticated:', user.id);
                setUserId(user.id);

                // Fetch exam boards from database
                const { data: boards, error: boardsError } = await supabase
                    .from('exam_boards')
                    .select('*')
                    .eq('is_active', true)
                    .order('name');

                if (boardsError) {
                    console.error('[Exam Board Page] Error fetching boards:', boardsError);
                    setError('Failed to load exam boards');
                } else {
                    console.log('[Exam Board Page] Loaded exam boards:', boards?.length);
                    setExamBoards(boards || []);
                }

                // Fetch available levels from subjects
                const { data: levels, error: levelsError } = await supabase
                    .from('subjects')
                    .select('level')
                    .eq('is_active', true)
                    .not('level', 'is', null);

                if (!levelsError && levels) {
                    const uniqueLevels = Array.from(new Set(levels.map(l => l.level)));
                    setAvailableLevels(uniqueLevels.filter(Boolean));
                }

                // Get user's country and existing exam board preference
                const { data: profile } = await supabase
                    .from('student_profiles')
                    .select('country, exam_boards')
                    .eq('user_id', user.id)
                    .single();

                if (profile?.country) {
                    setUserCountry(profile.country);
                    console.log('[Exam Board Page] User country:', profile.country);
                }

                // Pre-select if already chosen
                if (profile?.exam_boards && profile.exam_boards.length > 0) {
                    setSelectedExamBoard(profile.exam_boards[0]);
                }

            } catch (err) {
                console.error('[Exam Board Page] Initialization error:', err);
                setError('Failed to load page data');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router, supabase]);

    const handleContinue = async () => {
        if (!selectedExamBoard) {
            setError('Please select an exam board');
            return;
        }

        if (!selectedLevel) {
            setError('Please select your level');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (!userId) {
                throw new Error('User not authenticated');
            }

            // Update student profile with exam board
            const { error: profileError } = await supabase
                .from('student_profiles')
                .upsert({
                    user_id: userId,
                    exam_boards: [selectedExamBoard],
                    current_level: selectedLevel,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (profileError) throw profileError;

            // Update onboarding step
            await supabase
                .from('users')
                .update({ onboarding_step: 5 })
                .eq('id', userId);

            // Track analytics
            await supabase.from('onboarding_analytics').insert({
                user_id: userId,
                step: 5,
                step_name: 'exam_board',
                completed_at: new Date().toISOString()
            });

            console.log('[Exam Board Page] Selection saved, redirecting to subjects');
            router.push('/auth/onboarding/subjects');
        } catch (err: any) {
            console.error('[Exam Board Page] Error saving:', err);
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

        router.push('/auth/onboarding/subjects');
    };

    // Filter boards by user's country
    const recommendedBoards = examBoards.filter(board =>
        board.country === userCountry ||
        board.country === 'International' ||
        (userCountry === 'Zimbabwe' && board.code === 'ZIMSEC') ||
        (userCountry === 'Kenya' && board.code === 'KCSE') ||
        (userCountry === 'Tanzania' && board.code === 'NECTA') ||
        (userCountry === 'Uganda' && board.code === 'UNEB') ||
        (board.country === 'West Africa' && ['Nigeria', 'Ghana', 'Sierra Leone', 'Gambia', 'Liberia'].includes(userCountry))
    );

    const otherBoards = examBoards.filter(board => !recommendedBoards.includes(board));

    if (loading && examBoards.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#1B2A4C] mx-auto mb-4" />
                    <p className="text-[#1B2A4C] font-medium">Loading exam boards...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] flex items-center justify-center p-4">
            {/* Background decoration - following branding */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-[#2ECC71] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-[#1B2A4C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-4xl relative">
                {/* Progress indicator */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-[#2C3E50] font-medium font-['Inter']">Step 4 of 6</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#2ECC71] to-[#1B2A4C] rounded-full transition-all duration-500" style={{ width: '66.67%' }}></div>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2ECC71] to-[#1B2A4C] rounded-2xl mb-4">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#1B2A4C] font-['Poppins']">
                            Choose Your Exam Board
                        </h1>
                        <p className="mt-2 text-[#2C3E50] font-['Inter']">
                            We&apos;ll tailor content to match your curriculum
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Recommended for your country */}
                    {recommendedBoards.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-[#1B2A4C] mb-4 flex items-center gap-2 font-['Poppins']">
                                <span className="text-2xl">🎯</span>
                                {userCountry ? `Recommended for ${userCountry}` : 'Popular Exam Boards'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recommendedBoards.map((board) => (
                                    <button
                                        key={board.id}
                                        onClick={() => setSelectedExamBoard(board.code)}
                                        className={`p-5 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${selectedExamBoard === board.code
                                            ? 'border-[#2ECC71] bg-green-50 shadow-lg'
                                            : 'border-gray-200 hover:border-[#2ECC71]'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-lg font-bold text-[#1B2A4C] font-['Poppins']">{board.name}</h4>
                                                <p className="text-sm text-[#2C3E50] mt-1 font-['Inter']">{board.description}</p>
                                                <p className="text-xs text-gray-500 mt-1 font-['Inter']">{board.country}</p>
                                            </div>
                                            {selectedExamBoard === board.code && (
                                                <CheckCircle2 className="w-6 h-6 text-[#2ECC71] flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other exam boards */}
                    {otherBoards.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-[#1B2A4C] mb-4 font-['Poppins']">
                                Other Exam Boards
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {otherBoards.map((board) => (
                                    <button
                                        key={board.id}
                                        onClick={() => setSelectedExamBoard(board.code)}
                                        className={`p-5 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${selectedExamBoard === board.code
                                            ? 'border-[#2ECC71] bg-green-50 shadow-lg'
                                            : 'border-gray-200 hover:border-[#1B2A4C]'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-lg font-bold text-[#1B2A4C] font-['Poppins']">{board.name}</h4>
                                                <p className="text-sm text-[#2C3E50] mt-1 font-['Inter']">{board.description}</p>
                                                <p className="text-xs text-gray-500 mt-1 font-['Inter']">{board.country}</p>
                                            </div>
                                            {selectedExamBoard === board.code && (
                                                <CheckCircle2 className="w-6 h-6 text-[#2ECC71] flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Level selection */}
                    {selectedExamBoard && availableLevels.length > 0 && (
                        <div className="mb-8 p-5 bg-[#F5F7FA] border border-gray-200 rounded-xl">
                            <label className="block text-sm font-semibold text-[#1B2A4C] mb-3 font-['Poppins']">
                                Select Your Current Level
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableLevels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 font-['Inter'] ${selectedLevel === level
                                            ? 'bg-[#2ECC71] text-white shadow-lg scale-105'
                                            : 'bg-white text-[#2C3E50] border border-gray-300 hover:border-[#2ECC71]'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Info box */}
                    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 font-['Inter']">
                            <p className="font-semibold mb-1">Why we ask this</p>
                            <p>We use your exam board to show you the most relevant study materials, past papers, and resources aligned with your curriculum.</p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleSkip}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-[#2C3E50] rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-['Inter']"
                        >
                            Skip for Now
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={loading || !selectedExamBoard || !selectedLevel}
                            className="flex-1 bg-gradient-to-r from-[#2ECC71] to-[#1B2A4C] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#27AE60] hover:to-[#16202E] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Poppins']"
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
                </div>

                {/* Back link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-[#2C3E50] hover:text-[#1B2A4C] font-['Inter']"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
        </div>
    );
}
