'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ExamBoard } from '@/types/database';
import { useSelectionStore } from '@/store/selectionStore';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export function ExamBoardSelector() {
    const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { selectedExamBoard, setExamBoard } = useSelectionStore();

    useEffect(() => {
        fetchExamBoards();
    }, []);

    const fetchExamBoards = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/exam-boards');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch exam boards');
            }

            setExamBoards(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching exam boards:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-12">
                    <LoadingSpinner size="lg" color="primary" />
                    <p className="text-center mt-4 text-charcoal/60">Loading exam boards...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card variant="warning">
                <CardContent>
                    <p className="text-warning">⚠️ {error}</p>
                    <button
                        onClick={fetchExamBoards}
                        className="mt-4 text-primary hover:underline"
                    >
                        Try again
                    </button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Step 1: Select Your Exam Board
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {examBoards.map((board) => (
                        <button
                            key={board.id}
                            onClick={() => setExamBoard(board)}
                            className={`
                relative p-6 rounded-lg border-2 transition-all duration-200
                hover:shadow-md hover:scale-105 text-left
                ${selectedExamBoard?.id === board.id
                                    ? 'border-secondary bg-secondary/5'
                                    : 'border-gray-200 hover:border-secondary/50'
                                }
              `}
                        >
                            {selectedExamBoard?.id === board.id && (
                                <CheckCircle2 className="absolute top-3 right-3 h-6 w-6 text-secondary" />
                            )}

                            <div className="font-semibold text-lg text-charcoal mb-2">
                                {board.name}
                            </div>

                            {board.country && (
                                <div className="text-sm text-charcoal/60 mb-2">
                                    {board.country}
                                </div>
                            )}

                            {board.description && (
                                <div className="text-sm text-charcoal/70 line-clamp-2">
                                    {board.description}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {examBoards.length === 0 && (
                    <div className="text-center py-8 text-charcoal/60">
                        No exam boards available. Please contact support.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
