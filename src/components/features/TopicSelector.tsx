'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Topic } from '@/types/database';
import { useSelectionStore } from '@/store/selectionStore';
import { Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TopicSelector() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { selectedSubject, selectedTopic, setTopic } = useSelectionStore();
    const router = useRouter();

    useEffect(() => {
        if (selectedSubject) {
            fetchTopics();
        } else {
            setTopics([]);
            setTopic(null);
        }
    }, [selectedSubject]);

    const fetchTopics = async () => {
        if (!selectedSubject) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/topics?subject_id=${selectedSubject.id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch topics');
            }

            setTopics(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching topics:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartPractice = () => {
        if (selectedTopic) {
            router.push(`/practice/${selectedTopic.id}`);
        }
    };

    if (!selectedSubject) {
        return (
            <Card className="opacity-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-charcoal/40" />
                        Step 3: Select Your Topic
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-charcoal/60 text-center py-8">
                        Please select a subject first
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
                        <Lightbulb className="h-6 w-6 text-primary" />
                        Step 3: Select Your Topic
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-12">
                    <LoadingSpinner size="lg" color="primary" />
                    <p className="text-center mt-4 text-charcoal/60">Loading topics...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card variant="warning">
                <CardHeader>
                    <CardTitle>Step 3: Select Your Topic</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-warning">⚠️ {error}</p>
                    <button
                        onClick={fetchTopics}
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
                    <Lightbulb className="h-6 w-6 text-primary" />
                    Step 3: Select Your Topic
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {topics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => setTopic(topic)}
                            className={`
                relative p-5 rounded-lg border-2 transition-all duration-200
                hover:shadow-md hover:scale-105 text-left
                ${selectedTopic?.id === topic.id
                                    ? 'border-secondary bg-secondary/5'
                                    : 'border-gray-200 hover:border-secondary/50'
                                }
              `}
                        >
                            {selectedTopic?.id === topic.id && (
                                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-secondary" />
                            )}

                            <div className="font-semibold text-base text-charcoal mb-2">
                                {topic.name}
                            </div>

                            {topic.difficulty_level && (
                                <div className={`
                  inline-block px-2 py-1 rounded text-xs font-medium mb-2
                  ${topic.difficulty_level.toLowerCase().includes('foundation') ? 'bg-info/10 text-info' : ''}
                  ${topic.difficulty_level.toLowerCase().includes('higher') ? 'bg-warning/10 text-warning' : ''}
                  ${topic.difficulty_level.toLowerCase().includes('as') ? 'bg-success/10 text-success' : ''}
                  ${topic.difficulty_level.toLowerCase().includes('a2') ? 'bg-error/10 text-error' : ''}
                `}>
                                    {topic.difficulty_level}
                                </div>
                            )}

                            {topic.description && (
                                <div className="text-sm text-charcoal/70 line-clamp-2 mt-2">
                                    {topic.description}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {topics.length === 0 && (
                    <div className="text-center py-8 text-charcoal/60">
                        No topics available for this subject.
                    </div>
                )}

                {selectedTopic && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-lg text-charcoal mb-4">
                                Ready to practice <span className="font-semibold text-secondary">{selectedTopic.name}</span>?
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleStartPractice}
                                className="group"
                            >
                                Start Practice
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
