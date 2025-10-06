'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import NotePreview from './NotePreview';
import { Save, Send, Eye, EyeOff } from 'lucide-react';

const noteSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  exam_board_id: z.string().min(1, 'Please select an exam board'),
  subject_id: z.string().min(1, 'Please select a subject'),
  topic_id: z.string().min(1, 'Please select a topic'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  content: z.string().min(50, 'Content must be at least 50 characters'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteEditorFormProps {
  userId: string;
  examBoards: any[];
  subjects: any[];
  topics: any[];
}

export default function NoteEditorForm({
  userId,
  examBoards,
  subjects,
  topics,
}: NoteEditorFormProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSaveDraft = async (data: NoteFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/contribute/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          content,
          status: 'draft',
          created_by: userId,
        }),
      });

      if (response.ok) {
        toast.success('Draft saved successfully!');
        router.push('/contribute/my-content/drafts');
      } else {
        toast.error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitForReview = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contribute/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          content,
          status: 'pending',
          created_by: userId,
        }),
      });

      if (response.ok) {
        toast.success('Note submitted for review!');
        router.push('/contribute/my-content/pending');
      } else {
        toast.error('Failed to submit note');
      }
    } catch (error) {
      console.error('Error submitting note:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
          Basic Information
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Title *
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., Quadratic Equations - Complete Guide"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Exam Board, Subject, Topic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Board *
            </label>
            <select
              {...register('exam_board_id')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            >
              <option value="">Select exam board</option>
              {examBoards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
            {errors.exam_board_id && (
              <p className="text-red-600 text-sm mt-1">
                {errors.exam_board_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              {...register('subject_id')}
              disabled={!selectedExamBoard}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select subject</option>
              {filteredSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subject_id && (
              <p className="text-red-600 text-sm mt-1">
                {errors.subject_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic *
            </label>
            <select
              {...register('topic_id')}
              disabled={!selectedSubject}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select topic</option>
              {filteredTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {errors.topic_id && (
              <p className="text-red-600 text-sm mt-1">
                {errors.topic_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level *
          </label>
          <div className="flex space-x-4">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <label key={level} className="flex items-center space-x-2 cursor-pointer">
                <input
                  {...register('difficulty_level')}
                  type="radio"
                  value={level}
                  className="w-4 h-4 text-[#2ECC71] focus:ring-[#2ECC71]"
                />
                <span className="text-gray-700 capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
            Note Content
          </h2>
          
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {isPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>

        {isPreview ? (
          <NotePreview content={content} />
        ) : (
          <RichTextEditor
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
              setValue('content', newContent);
            }}
            userId={userId}
          />
        )}

        {errors.content && (
          <p className="text-red-600 text-sm mt-2">{errors.content.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSubmit(onSaveDraft)}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit(onSubmitForReview)}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
