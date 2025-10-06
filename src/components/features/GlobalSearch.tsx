'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface SearchResult {
    id: string;
    title: string;
    type: 'note' | 'quiz' | 'topic';
    subject?: string;
    excerpt?: string;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search function with debounce
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                // Search notes
                const { data: notes } = await supabase
                    .from('notes')
                    .select(`
            id,
            title,
            content,
            topics(
              name,
              subjects(name)
            )
          `)
                    .eq('status', 'published')
                    .ilike('title', `%${query}%`)
                    .limit(5);

                // Search quizzes
                const { data: quizzes } = await supabase
                    .from('quizzes')
                    .select(`
            id,
            title,
            description,
            topics(
              name,
              subjects(name)
            )
          `)
                    .eq('status', 'published')
                    .ilike('title', `%${query}%`)
                    .limit(5);

                // Search topics
                const { data: topics } = await supabase
                    .from('topics')
                    .select(`
            id,
            name,
            description,
            subjects(name)
          `)
                    .ilike('name', `%${query}%`)
                    .limit(5);

                // Combine results
                const combinedResults: SearchResult[] = [
                    ...(notes || []).map(note => ({
                        id: note.id,
                        title: note.title,
                        type: 'note' as const,
                        subject: (note.topics as any)?.subjects?.name,
                        excerpt: note.content?.substring(0, 100),
                    })),
                    ...(quizzes || []).map(quiz => ({
                        id: quiz.id,
                        title: quiz.title,
                        type: 'quiz' as const,
                        subject: (quiz.topics as any)?.subjects?.name,
                        excerpt: quiz.description,
                    })),
                    ...(topics || []).map(topic => ({
                        id: topic.id,
                        title: topic.name,
                        type: 'topic' as const,
                        subject: (topic.subjects as any)?.name,
                        excerpt: topic.description,
                    })),
                ];

                setResults(combinedResults);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleResultClick = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        setResults([]);

        switch (result.type) {
            case 'note':
                router.push(`/notes/${result.id}`);
                break;
            case 'quiz':
                router.push(`/quizzes/${result.id}`);
                break;
            case 'topic':
                router.push(`/topics/${result.id}`);
                break;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'note':
                return '📝';
            case 'quiz':
                return '❓';
            case 'topic':
                return '📚';
            default:
                return '📄';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'note':
                return 'Note';
            case 'quiz':
                return 'Quiz';
            case 'topic':
                return 'Topic';
            default:
                return 'Content';
        }
    };

    return (
        <>
            {/* Search Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white border border-white/20"
            >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden md:inline text-xs px-2 py-0.5 bg-white/20 rounded">⌘K</kbd>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                            {/* Search Input */}
                            <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for notes, quizzes, topics..."
                                    className="flex-1 outline-none text-lg"
                                />
                                {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {query.trim() === '' ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>Start typing to search...</p>
                                        <p className="text-sm mt-2">Try "calculus", "physics", or "algebra"</p>
                                    </div>
                                ) : results.length === 0 && !isLoading ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>No results found for "{query}"</p>
                                        <p className="text-sm mt-2">Try different keywords</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {results.map((result) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                onClick={() => handleResultClick(result)}
                                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <span className="text-2xl">{getTypeIcon(result.type)}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h4 className="font-medium text-[#1B2A4C] group-hover:text-[#2ECC71] transition-colors truncate">
                                                                {result.title}
                                                            </h4>
                                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                                                                {getTypeLabel(result.type)}
                                                            </span>
                                                        </div>
                                                        {result.subject && (
                                                            <p className="text-xs text-gray-500 mb-1">{result.subject}</p>
                                                        )}
                                                        {result.excerpt && (
                                                            <p className="text-sm text-gray-600 line-clamp-1">{result.excerpt}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span>↑↓ Navigate</span>
                                    <span>↵ Select</span>
                                    <span>ESC Close</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push(`/search?q=${encodeURIComponent(query)}`);
                                    }}
                                    className="text-[#2ECC71] hover:underline"
                                >
                                    View all results →
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
