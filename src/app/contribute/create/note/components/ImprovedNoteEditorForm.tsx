'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import FullFeaturedEditor from './FullFeaturedEditor';
import NotePreview from './NotePreview';
import EditorOnboarding from './EditorOnboarding';
import {
    Save,
    Send,
    Eye,
    X,
    Check,
    AlertCircle,
    ChevronDown,
    Settings,
} from 'lucide-react';

const noteSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    subtitle: z.string().optional(),
    exam_board_id: z.string().min(1, 'Please select an exam board'),
    subject_id: z.string().min(1, 'Please select a subject'),
    topic_id: z.string().min(1, 'Please select a topic'),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
    content: z.string().min(50, 'Content must be at least 50 characters'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface ImprovedNoteEditorFormProps {
    userId: string;
    examBoards: any[];
    subjects: any[];
    topics: any[];
}

export default function ImprovedNoteEditorForm({
    userId,
    examBoards,
    subjects,
    topics,
}: ImprovedNoteEditorFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<NoteFormData>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            difficulty_level: 'intermediate',
        },
    });

    const selectedExamBoard = watch('exam_board_id');
    const selectedSubject = watch('subject_id');

    // Filter subjects by exam board
    const filteredSubjects = useMemo(() => {
        if (!selectedExamBoard) return [];
        return subjects.filter((s) => s.exam_board_id === selectedExamBoard);
    }, [selectedExamBoard, subjects]);

    // Filter topics by subject
    const filteredTopics = useMemo(() => {
        if (!selectedSubject) return [];
        return topics.filter((t) => t.subject_id === selectedSubject);
    }, [selectedSubject, topics]);

    // Auto-save handler
    const handleAutoSave = async () => {
        if (!autoSaveEnabled || !title || !content) return;

        try {
            // Save to localStorage as draft
            const draft = {
                title,
                subtitle,
                content,
                exam_board_id: watch('exam_board_id'),
                subject_id: watch('subject_id'),
                topic_id: watch('topic_id'),
                difficulty_level: watch('difficulty_level'),
                timestamp: new Date().toISOString(),
            };

            localStorage.setItem('note_draft', JSON.stringify(draft));
            setLastSaved(new Date());
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    };

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('note_draft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setTitle(draft.title || '');
                setSubtitle(draft.subtitle || '');
                setContent(draft.content || '');
                setValue('exam_board_id', draft.exam_board_id || '');
                setValue('subject_id', draft.subject_id || '');
                setValue('topic_id', draft.topic_id || '');
                setValue('difficulty_level', draft.difficulty_level || 'intermediate');
                toast.success('Draft restored');
            } catch (error) {
                console.error('Failed to restore draft:', error);
            }
        }
    }, [setValue]);

    const onSaveDraft = async (data: NoteFormData) => {
        // Validate content isn't empty
        const strippedContent = content.replace(/<[^>]*>/g, '').trim();
        if (strippedContent.length < 10) {
            toast.error('Please write some content before saving');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ...data,
                title,
                subtitle,
                content,
                status: 'draft',
                created_by: userId,
            };

            console.log('Saving draft with payload:', payload);

            const response = await fetch('/api/contribute/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log('Save draft response:', result);

            if (response.ok) {
                localStorage.removeItem('note_draft');
                toast.success(result.message || 'Draft saved successfully!');
                router.push('/contribute/my-content');
            } else {
                console.error('Save draft error:', result);
                toast.error(result.error || 'Failed to save draft');
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            toast.error('An error occurred while saving draft');
        } finally {
            setIsSaving(false);
        }
    };

    const onSubmitForReview = async (data: NoteFormData) => {
        // Validate content isn't empty
        const strippedContent = content.replace(/<[^>]*>/g, '').trim();
        if (strippedContent.length < 10) {
            toast.error('Please write some content before submitting');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                title,
                subtitle,
                content,
                status: 'pending',
                created_by: userId,
            };

            console.log('Submitting for review with payload:', payload);

            const response = await fetch('/api/contribute/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log('Submit for review response:', result);

            if (response.ok) {
                localStorage.removeItem('note_draft');
                toast.success(result.message || 'Note submitted for review!');
                router.push('/contribute/my-content');
            } else {
                console.error('Submit for review error:', result);
                toast.error(result.error || 'Failed to submit note');
            }
        } catch (error) {
            console.error('Error submitting note:', error);
            toast.error('An error occurred while submitting note');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Onboarding Modal */}
            <EditorOnboarding />

            {/* Top Bar */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="text-gray-600 hover:text-gray-900 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="text-sm text-gray-500">
                                {lastSaved ? (
                                    <>
                                        <Check className="w-4 h-4 inline mr-1 text-green-600" />
                                        Saved {lastSaved.toLocaleTimeString()}
                                    </>
                                ) : (
                                    autoSaveEnabled && 'Auto-save enabled'
                                )}
                            </div>
                        </div>

                        {/* Center - Status */}
                        <div className="flex items-center gap-2">
                            {Object.keys(errors).length > 0 && (
                                <div className="flex items-center gap-1 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Please fix errors</span>
                                </div>
                            )}
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPreview(!isPreview)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {isPreview ? 'Edit' : 'Preview'}
                                </span>
                            </button>

                            <button
                                onClick={handleSubmit(onSaveDraft)}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:inline">Save Draft</span>
                            </button>

                            <button
                                onClick={handleSubmit(onSubmitForReview)}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>Publish</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isPreview ? (
                    /* Preview Mode */
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <NotePreview
                            title={title}
                            content={content}
                            examBoards={examBoards}
                            subjects={subjects}
                            topics={topics}
                            selectedExamBoardId={watch('exam_board_id')}
                            selectedSubjectId={watch('subject_id')}
                            selectedTopicId={watch('topic_id')}
                        />
                    </div>
                ) : (
                    /* Edit Mode */
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - Metadata */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <button
                                    onClick={() => setShowMetadata(!showMetadata)}
                                    className="flex items-center justify-between w-full lg:hidden mb-4 p-4 bg-white rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-gray-900">Settings</span>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform ${showMetadata ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`bg-white rounded-lg border border-gray-200 p-6 space-y-6 ${showMetadata ? 'block' : 'hidden lg:block'
                                        }`}
                                >
                                    <h3 className="text-lg font-bold text-gray-900 font-['Poppins']">
                                        Note Settings
                                    </h3>

                                    {/* Exam Board */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Exam Board *
                                        </label>
                                        <select
                                            {...register('exam_board_id')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent text-sm"
                                        >
                                            <option value="">Select...</option>
                                            {examBoards.map((board) => (
                                                <option key={board.id} value={board.id}>
                                                    {board.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.exam_board_id && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.exam_board_id.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            {...register('subject_id')}
                                            disabled={!selectedExamBoard}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent text-sm disabled:bg-gray-100"
                                        >
                                            <option value="">Select...</option>
                                            {filteredSubjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.subject_id && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.subject_id.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Topic */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Topic *
                                        </label>
                                        <select
                                            {...register('topic_id')}
                                            disabled={!selectedSubject}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent text-sm disabled:bg-gray-100"
                                        >
                                            <option value="">Select...</option>
                                            {filteredTopics.map((topic) => (
                                                <option key={topic.id} value={topic.id}>
                                                    {topic.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.topic_id && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {errors.topic_id.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Difficulty Level */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Difficulty Level *
                                        </label>
                                        <select
                                            {...register('difficulty_level')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent text-sm"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    {/* Auto-save Toggle */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={autoSaveEnabled}
                                                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                                                className="w-4 h-4 text-[#2ECC71] rounded focus:ring-[#2ECC71]"
                                            />
                                            <span className="text-sm text-gray-700">Enable auto-save</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Editor */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
                                <FullFeaturedEditor
                                    title={title}
                                    subtitle={subtitle}
                                    content={content}
                                    onTitleChange={(val) => {
                                        setTitle(val);
                                        setValue('title', val);
                                    }}
                                    onSubtitleChange={(val) => {
                                        setSubtitle(val);
                                        setValue('subtitle', val);
                                    }}
                                    onContentChange={(val) => {
                                        setContent(val);
                                        setValue('content', val);
                                    }}
                                    userId={userId}
                                    autoSave={autoSaveEnabled}
                                    onAutoSave={handleAutoSave}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
