'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import QuestionBuilder from './QuestionBuilder';
import QuizPreview from './QuizPreview';
import { Save, Send, Plus, Eye, EyeOff } from 'lucide-react';

const quizSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  exam_board_id: z.string().min(1, 'Please select an exam board'),
  subject_id: z.string().min(1, 'Please select a subject'),
  topic_id: z.string().min(1, 'Please select a topic'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  time_limit_minutes: z.number().min(5).max(180),
  passing_score: z.number().min(0).max(100),
});

type QuizFormData = z.infer<typeof quizSchema>;

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question_text: string;
  points: number;
  explanation?: string;
  options?: {
    id: string;
    option_text: string;
    is_correct: boolean;
  }[];
  correct_answer?: string;
}

interface QuizCreatorFormProps {
  userId: string;
  examBoards: any[];
  subjects: any[];
  topics: any[];
}

export default function QuizCreatorForm({
  userId,
  examBoards,
  subjects,
  topics,
}: QuizCreatorFormProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      difficulty_level: 'intermediate',
      time_limit_minutes: 30,
      passing_score: 70,
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

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'multiple_choice',
      question_text: '',
      points: 1,
      options: [
        { id: `opt-${Date.now()}-1`, option_text: '', is_correct: false },
        { id: `opt-${Date.now()}-2`, option_text: '', is_correct: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updatedQuestion: Question) => {
    setQuestions(questions.map((q) => (q.id === id ? updatedQuestion : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const onSaveDraft = async (data: QuizFormData) => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/contribute/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          questions,
          status: 'draft',
          created_by: userId,
        }),
      });

      if (response.ok) {
        toast.success('Draft saved successfully!');
        router.push('/contribute/my-content');
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

  const onSubmitForReview = async (data: QuizFormData) => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Validate all questions have correct answers
    const invalidQuestions = questions.filter((q) => {
      if (q.type === 'multiple_choice') {
        return !q.options?.some((opt) => opt.is_correct);
      }
      if (q.type === 'true_false' || q.type === 'short_answer') {
        return !q.correct_answer;
      }
      return false;
    });

    if (invalidQuestions.length > 0) {
      toast.error('All questions must have a correct answer');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contribute/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          questions,
          status: 'pending',
          created_by: userId,
        }),
      });

      if (response.ok) {
        toast.success('Quiz submitted for review!');
        router.push('/contribute/my-content');
      } else {
        toast.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
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
          Quiz Information
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title *
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., Quadratic Equations Practice Quiz"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Brief description of what this quiz covers..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent resize-none"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
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

        {/* Quiz Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level *
            </label>
            <select
              {...register('difficulty_level')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Limit (minutes) *
            </label>
            <input
              {...register('time_limit_minutes', { valueAsNumber: true })}
              type="number"
              min="5"
              max="180"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
            {errors.time_limit_minutes && (
              <p className="text-red-600 text-sm mt-1">
                {errors.time_limit_minutes.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passing Score (%) *
            </label>
            <input
              {...register('passing_score', { valueAsNumber: true })}
              type="number"
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
            {errors.passing_score && (
              <p className="text-red-600 text-sm mt-1">
                {errors.passing_score.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
            Questions ({questions.length})
          </h2>

          <div className="flex items-center space-x-2">
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

            {!isPreview && (
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            )}
          </div>
        </div>

        {isPreview ? (
          <QuizPreview questions={questions} />
        ) : (
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No questions yet. Click "Add Question" to start building your quiz.</p>
              </div>
            ) : (
              questions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  onUpdate={(updated) => updateQuestion(question.id, updated)}
                  onDelete={() => deleteQuestion(question.id)}
                />
              ))
            )}
          </div>
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
