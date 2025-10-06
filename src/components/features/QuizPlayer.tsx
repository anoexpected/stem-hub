import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface QuizPlayerProps {
    quizId: string;
    onComplete?: (results: any) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId, onComplete }) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`/api/quizzes/${quizId}/attempt`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch quiz');
            }

            setQuiz(data);
            setQuestions(data.quiz_questions || []);
        } catch (err: any) {
            console.error('Error fetching quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);

            const response = await fetch(`/api/quizzes/${quizId}/attempt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    time_taken_seconds: timeTaken
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit quiz');
            }

            if (onComplete) {
                onComplete(data);
            }
        } catch (err: any) {
            console.error('Error submitting quiz:', err);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!quiz || questions.length === 0) {
        return (
            <Card className="p-6 text-center">
                <p className="text-red-600">Quiz not found or has no questions.</p>
            </Card>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Quiz Header */}
            <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
                {quiz.description && (
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-600">
                    {quiz.time_limit_minutes && (
                        <span>⏱️ {quiz.time_limit_minutes} minutes</span>
                    )}
                    <span>📝 {questions.length} questions</span>
                    {quiz.passing_score && (
                        <span>🎯 Pass: {quiz.passing_score}%</span>
                    )}
                </div>
            </Card>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Card */}
            <Card className="p-6">
                <div className="mb-4">
                    <span className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    {currentQuestion.marks && (
                        <span className="ml-2 text-sm text-blue-600">
                            ({currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''})
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentQuestion.question_text}
                </h3>

                {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
                    <div className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                            <label
                                key={key}
                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${answers[currentQuestion.id] === value
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={currentQuestion.id}
                                    value={value as string}
                                    checked={answers[currentQuestion.id] === value}
                                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                    className="mr-3"
                                />
                                <span className="text-gray-900">{value as string}</span>
                            </label>
                        ))}
                    </div>
                )}

                {currentQuestion.question_type === 'short_answer' && (
                    <input
                        type="text"
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                )}

                {currentQuestion.question_type === 'true_false' && (
                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer text-center transition-colors ${answers[currentQuestion.id] === 'true'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}>
                            <input
                                type="radio"
                                name={currentQuestion.id}
                                value="true"
                                checked={answers[currentQuestion.id] === 'true'}
                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                className="sr-only"
                            />
                            <span className="font-semibold">True</span>
                        </label>
                        <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer text-center transition-colors ${answers[currentQuestion.id] === 'false'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}>
                            <input
                                type="radio"
                                name={currentQuestion.id}
                                value="false"
                                checked={answers[currentQuestion.id] === 'false'}
                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                className="sr-only"
                            />
                            <span className="font-semibold">False</span>
                        </label>
                    </div>
                )}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                >
                    Previous
                </Button>

                <span className="text-sm text-gray-600">
                    {answeredCount} of {questions.length} answered
                </span>

                {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                        onClick={() => setCurrentQuestionIndex(i => i + 1)}
                        variant="primary"
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || answeredCount < questions.length}
                        variant="primary"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                )}
            </div>

            {answeredCount < questions.length && currentQuestionIndex === questions.length - 1 && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <p className="text-sm text-yellow-800">
                        Please answer all questions before submitting.
                    </p>
                </Card>
            )}
        </div>
    );
};
