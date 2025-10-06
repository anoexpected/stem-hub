'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/features/QuestionCard';
import { SessionSummary } from '@/components/features/SessionSummary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface Question {
    id: string;
    question_text: string;
    question_type: string;
    answer_options?: any;
    correct_answer: string;
    explanation?: string;
    marks?: number;
}

interface SessionResult {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
}

export default function PracticePage() {
    const params = useParams();
    const router = useRouter();
    const topicId = params.topicId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [topicName, setTopicName] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
    const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    useEffect(() => {
        checkAuthAndFetchTopic();
    }, [topicId]);

    const checkAuthAndFetchTopic = async () => {
        try {
            // Check authentication
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth/login');
                return;
            }

            // Fetch topic details
            const response = await fetch(`/api/topics?id=${topicId}`);
            const data = await response.json();

            if (!response.ok || !data.data || data.data.length === 0) {
                throw new Error('Topic not found');
            }

            setTopicName(data.data[0].name);

            // Generate questions
            await generateQuestions();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const generateQuestions = async () => {
        try {
            setIsGenerating(true);
            setError(null);

            const response = await fetch('/api/questions/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic_id: topicId,
                    count: 5, // Generate 5 questions
                    difficulty: 'mixed',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate questions');
            }

            setQuestions(data.data || []);
            setSessionStartTime(Date.now());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate questions');
            console.error('Error generating questions:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnswer = (answer: string, isCorrect: boolean) => {
        const result: SessionResult = {
            questionId: questions[currentQuestionIndex].id,
            userAnswer: answer,
            isCorrect,
        };

        setSessionResults([...sessionResults, result]);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            completeSession();
        }
    };

    const handleRequestHint = async () => {
        // In a future enhancement, this could call the AI hint generation API
        console.log('Hint requested for question:', questions[currentQuestionIndex].id);
    };

    const completeSession = async () => {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        const correctCount = sessionResults.filter(r => r.isCorrect).length +
            (sessionResults[sessionResults.length - 1]?.isCorrect ? 0 : 1);

        try {
            // Save session to database
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                await fetch('/api/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: session.user.id,
                        topic_id: topicId,
                        questions_data: {
                            questions: questions.map(q => q.id),
                            results: sessionResults,
                        },
                        score: correctCount,
                        total_questions: questions.length,
                        duration_seconds: duration,
                    }),
                });

                // Update user progress
                await fetch('/api/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: session.user.id,
                        topic_id: topicId,
                        questions_attempted: questions.length,
                        questions_correct: correctCount,
                    }),
                });
            }
        } catch (err) {
            console.error('Error saving session:', err);
        }

        setIsSessionComplete(true);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSessionResults([]);
        setSessionStartTime(Date.now());
        setIsSessionComplete(false);
        generateQuestions();
    };

    if (isLoading || isGenerating) {
        return (
            <div className="min-h-screen bg-light-gray flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" color="primary" />
                    <p className="mt-4 text-xl text-charcoal">
                        {isGenerating ? '🤖 Generating practice questions...' : 'Loading...'}
                    </p>
                    <p className="mt-2 text-charcoal/60">
                        {isGenerating ? 'Our AI is creating personalized questions for you' : 'Please wait'}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-light-gray flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-charcoal mb-4">Oops! Something went wrong</h2>
                    <p className="text-charcoal/70 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="secondary" onClick={() => router.push('/learn/dashboard')}>
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Dashboard
                        </Button>
                        <Button variant="primary" onClick={generateQuestions}>
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-light-gray flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-charcoal mb-4">No questions available</h2>
                    <p className="text-charcoal/70 mb-6">
                        We couldn't generate questions for this topic. Please try again or choose a different topic.
                    </p>
                    <Button variant="primary" onClick={() => router.push('/learn/dashboard')}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    if (isSessionComplete) {
        return (
            <SessionSummary
                results={sessionResults}
                topicName={topicName}
                topicId={topicId}
                duration={Math.floor((Date.now() - sessionStartTime) / 1000)}
                onRestart={handleRestart}
            />
        );
    }

    return (
        <div className="min-h-screen bg-light-gray">
            {/* Header */}
            <header className="bg-primary text-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold font-display">{topicName}</h1>
                            <p className="text-white/80 text-sm">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                                    router.push('/learn/dashboard');
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            Exit Practice
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-secondary to-success transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <QuestionCard
                    question={questions[currentQuestionIndex]}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    onAnswer={handleAnswer}
                    onNext={handleNext}
                    onRequestHint={handleRequestHint}
                />
            </main>
        </div>
    );
}
