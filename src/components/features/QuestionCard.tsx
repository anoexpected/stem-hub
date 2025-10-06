'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface Question {
    id: string;
    question_text: string;
    question_type: string;
    answer_options?: any;
    correct_answer: string;
    explanation?: string;
    marks?: number;
}

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (answer: string, isCorrect: boolean) => void;
    onNext: () => void;
    onRequestHint: () => void;
}

export function QuestionCard({
    question,
    questionNumber,
    totalQuestions,
    onAnswer,
    onNext,
    onRequestHint,
}: QuestionCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showHint, setShowHint] = useState(false);

    const handleSubmit = () => {
        if (!selectedAnswer && !userAnswer) return;

        const answer = selectedAnswer || userAnswer;
        const correct = checkAnswer(answer);

        setIsCorrect(correct);
        setIsSubmitted(true);
        onAnswer(answer, correct);
    };

    const checkAnswer = (answer: string): boolean => {
        // Normalize answers for comparison
        const normalizedUserAnswer = answer.trim().toLowerCase();
        const normalizedCorrectAnswer = question.correct_answer.trim().toLowerCase();

        return normalizedUserAnswer === normalizedCorrectAnswer;
    };

    const handleNext = () => {
        setSelectedAnswer('');
        setUserAnswer('');
        setIsSubmitted(false);
        setIsCorrect(null);
        setShowHint(false);
        onNext();
    };

    const handleHintRequest = () => {
        setShowHint(true);
        onRequestHint();
    };

    const renderAnswerOptions = () => {
        if (question.question_type !== 'multiple_choice' || !question.answer_options) {
            return null;
        }

        const options = Array.isArray(question.answer_options)
            ? question.answer_options
            : question.answer_options.options || [];

        return (
            <div className="space-y-3">
                {options.map((option: string, index: number) => {
                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = isSubmitted && option === question.correct_answer;
                    const isWrongSelection = isSubmitted && isSelected && !isCorrect;

                    return (
                        <button
                            key={index}
                            onClick={() => !isSubmitted && setSelectedAnswer(option)}
                            disabled={isSubmitted}
                            className={`
                w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                ${!isSubmitted && 'hover:border-secondary/50 hover:bg-secondary/5'}
                ${isSelected && !isSubmitted && 'border-secondary bg-secondary/10'}
                ${isCorrectOption && 'border-success bg-success/10'}
                ${isWrongSelection && 'border-error bg-error/10'}
                ${!isSelected && !isCorrectOption && isSubmitted && 'opacity-50'}
                ${isSubmitted && 'cursor-not-allowed'}
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold
                  ${isSelected && !isSubmitted && 'bg-secondary text-white'}
                  ${!isSelected && !isSubmitted && 'bg-gray-200 text-charcoal'}
                  ${isCorrectOption && 'bg-success text-white'}
                  ${isWrongSelection && 'bg-error text-white'}
                `}>
                                    {isCorrectOption ? <CheckCircle2 className="h-5 w-5" /> :
                                        isWrongSelection ? <XCircle className="h-5 w-5" /> :
                                            optionLetter}
                                </div>
                                <div className="flex-1 text-charcoal">{option}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderTextInput = () => {
        if (question.question_type === 'multiple_choice') {
            return null;
        }

        return (
            <div className="space-y-3">
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Type your answer here..."
                    className={`
            w-full p-4 border-2 rounded-lg resize-none transition-all
            focus:outline-none focus:ring-4 focus:ring-secondary/20
            ${isSubmitted && isCorrect && 'border-success bg-success/5'}
            ${isSubmitted && !isCorrect && 'border-error bg-error/5'}
            ${!isSubmitted && 'border-gray-300 focus:border-secondary'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                    rows={question.question_type === 'calculation' ? 3 : 5}
                />

                {isSubmitted && (
                    <div className={`
            p-4 rounded-lg border-2
            ${isCorrect ? 'border-success bg-success/5' : 'border-error bg-error/5'}
          `}>
                        <div className="font-semibold text-charcoal mb-2">Correct Answer:</div>
                        <div className="text-charcoal/80">{question.correct_answer}</div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Question {questionNumber} of {totalQuestions}
                    </CardTitle>
                    {question.marks && (
                        <div className="text-sm font-medium text-charcoal/60">
                            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Question Text */}
                <div className="text-lg text-charcoal leading-relaxed">
                    {question.question_text}
                </div>

                {/* Answer Options or Text Input */}
                {renderAnswerOptions()}
                {renderTextInput()}

                {/* Feedback */}
                {isSubmitted && (
                    <div className={`
            p-4 rounded-lg border-2 animate-in fade-in duration-300
            ${isCorrect ? 'border-success bg-success/5' : 'border-error bg-error/5'}
          `}>
                        <div className="flex items-start gap-3">
                            {isCorrect ? (
                                <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                            ) : (
                                <XCircle className="h-6 w-6 text-error flex-shrink-0 mt-1" />
                            )}
                            <div className="flex-1">
                                <div className="font-semibold text-lg mb-2 text-charcoal">
                                    {isCorrect ? '✨ Correct!' : '❌ Not quite right'}
                                </div>
                                {question.explanation && (
                                    <div className="text-charcoal/80 leading-relaxed">
                                        <span className="font-medium">Explanation:</span> {question.explanation}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Hint Section */}
                {!isSubmitted && (
                    <div>
                        {!showHint ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleHintRequest}
                                className="w-full sm:w-auto"
                            >
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Need a hint?
                            </Button>
                        ) : (
                            <div className="p-4 bg-accent/10 border-2 border-accent rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-charcoal mb-1">💡 Hint:</div>
                                        <div className="text-charcoal/80 text-sm">
                                            Consider the key concepts related to this topic. Break down the problem step by step.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    {!isSubmitted ? (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!selectedAnswer && !userAnswer}
                            className="flex-1"
                        >
                            Submit Answer
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleNext}
                            className="flex-1"
                        >
                            {questionNumber === totalQuestions ? 'View Results' : 'Next Question'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
