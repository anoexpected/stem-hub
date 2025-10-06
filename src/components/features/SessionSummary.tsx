'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, TrendingUp, Target, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SessionResult {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
}

interface SessionSummaryProps {
    results: SessionResult[];
    topicName: string;
    topicId: string;
    duration: number; // in seconds
    onRestart: () => void;
}

export function SessionSummary({ results, topicName, topicId, duration, onRestart }: SessionSummaryProps) {
    const router = useRouter();

    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const score = `${correctAnswers}/${totalQuestions}`;

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getPerformanceMessage = () => {
        if (accuracy >= 90) return { emoji: '🌟', message: 'Outstanding!', color: 'text-success' };
        if (accuracy >= 75) return { emoji: '🎉', message: 'Great job!', color: 'text-secondary' };
        if (accuracy >= 60) return { emoji: '👍', message: 'Good effort!', color: 'text-info' };
        if (accuracy >= 50) return { emoji: '💪', message: 'Keep practicing!', color: 'text-warning' };
        return { emoji: '📚', message: 'Review and try again!', color: 'text-error' };
    };

    const performance = getPerformanceMessage();

    return (
        <div className="min-h-screen bg-light-gray py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Celebration Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{performance.emoji}</div>
                    <h1 className={`text-4xl font-bold mb-2 ${performance.color}`}>
                        {performance.message}
                    </h1>
                    <p className="text-xl text-charcoal/70">
                        You completed <span className="font-semibold">{topicName}</span>
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="text-center py-6">
                            <Trophy className="h-8 w-8 text-accent mx-auto mb-3" />
                            <div className="text-3xl font-bold text-charcoal mb-1">{score}</div>
                            <div className="text-sm text-charcoal/60">Score</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="text-center py-6">
                            <Target className="h-8 w-8 text-secondary mx-auto mb-3" />
                            <div className="text-3xl font-bold text-charcoal mb-1">{accuracy}%</div>
                            <div className="text-sm text-charcoal/60">Accuracy</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="text-center py-6">
                            <Clock className="h-8 w-8 text-info mx-auto mb-3" />
                            <div className="text-3xl font-bold text-charcoal mb-1">{formatDuration(duration)}</div>
                            <div className="text-sm text-charcoal/60">Time Taken</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="text-center py-6">
                            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                            <div className="text-3xl font-bold text-charcoal mb-1">
                                {totalQuestions > 0 ? Math.round((duration / totalQuestions)) : 0}s
                            </div>
                            <div className="text-sm text-charcoal/60">Per Question</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Breakdown */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Performance Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-charcoal/70 mb-2">
                                <span>Correct: {correctAnswers}</span>
                                <span>Incorrect: {totalQuestions - correctAnswers}</span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-secondary to-success transition-all duration-1000"
                                    style={{ width: `${accuracy}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Question Results */}
                        <div className="space-y-2">
                            {results.map((result, index) => (
                                <div
                                    key={result.questionId}
                                    className={`
                    flex items-center gap-3 p-3 rounded-lg
                    ${result.isCorrect ? 'bg-success/5' : 'bg-error/5'}
                  `}
                                >
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                    ${result.isCorrect ? 'bg-success text-white' : 'bg-error text-white'}
                  `}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 text-charcoal/80">
                                        Question {index + 1}
                                    </div>
                                    <div className={`font-medium ${result.isCorrect ? 'text-success' : 'text-error'}`}>
                                        {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Motivational Message */}
                <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
                    <CardContent className="py-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-charcoal mb-2">
                                {accuracy >= 75 ? '🎓 Keep up the excellent work!' : '💡 Every practice makes you stronger!'}
                            </h3>
                            <p className="text-charcoal/70">
                                {accuracy >= 75
                                    ? 'Your hard work is paying off. Continue practicing to master this topic!'
                                    : 'Practice makes perfect! Review the explanations and try again to improve your score.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={onRestart}
                        className="w-full"
                    >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Practice Again
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push('/select')}
                        className="w-full"
                    >
                        Choose New Topic
                    </Button>

                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => router.push('/dashboard')}
                        className="w-full"
                    >
                        Dashboard
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>

                {/* Share Results (Future Feature) */}
                <div className="text-center mt-8">
                    <p className="text-sm text-charcoal/50">
                        Your progress has been saved to your account
                    </p>
                </div>
            </div>
        </div>
    );
}
