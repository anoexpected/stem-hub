'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Subject } from '@/types/database';
import { useSelectionStore } from '@/store/selectionStore';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

export function SubjectSelector() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { selectedExamBoard, selectedSubject, setSubject } = useSelectionStore();

    useEffect(() => {
        if (selectedExamBoard) {
            fetchSubjects();
        } else {
            setSubjects([]);
            setSubject(null);
        }
    }, [selectedExamBoard]);

    const fetchSubjects = async () => {
        if (!selectedExamBoard) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/subjects?exam_board_id=${selectedExamBoard.id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch subjects');
            }

            setSubjects(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching subjects:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedExamBoard) {
        return (
            <Card className="opacity-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-charcoal/40" />
                        Step 2: Select Your Subject
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-charcoal/60 text-center py-8">
                        Please select an exam board first
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        Step 2: Select Your Subject
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-12">
                    <LoadingSpinner size="lg" color="primary" />
                    <p className="text-center mt-4 text-charcoal/60">Loading subjects...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card variant="warning">
                <CardHeader>
                    <CardTitle>Step 2: Select Your Subject</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-warning">⚠️ {error}</p>
                    <button
                        onClick={fetchSubjects}
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
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Step 2: Select Your Subject
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => setSubject(subject)}
                            className={`
                relative p-6 rounded-lg border-2 transition-all duration-200
                hover:shadow-md hover:scale-105 text-left
                ${selectedSubject?.id === subject.id
                                    ? 'border-secondary bg-secondary/5'
                                    : 'border-gray-200 hover:border-secondary/50'
                                }
              `}
                        >
                            {selectedSubject?.id === subject.id && (
                                <CheckCircle2 className="absolute top-3 right-3 h-6 w-6 text-secondary" />
                            )}

                            <div className="font-semibold text-lg text-charcoal mb-2">
                                {subject.name}
                            </div>

                            {subject.level && (
                                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                                    {subject.level}
                                </div>
                            )}

                            {subject.description && (
                                <div className="text-sm text-charcoal/70 line-clamp-2 mt-2">
                                    {subject.description}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {subjects.length === 0 && (
                    <div className="text-center py-8 text-charcoal/60">
                        No subjects available for this exam board.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
