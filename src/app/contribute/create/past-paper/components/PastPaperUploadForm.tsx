'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Save, Send, CheckCircle } from 'lucide-react';
import { uploadPDF, STORAGE_BUCKETS } from '@/lib/storage';

const pastPaperSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  exam_board_id: z.string().min(1, 'Please select an exam board'),
  subject_id: z.string().min(1, 'Please select a subject'),
  year: z.number().min(1990).max(2030),
  paper_number: z.string().min(1, 'Please enter paper number'),
  session: z.enum(['may_june', 'october_november', 'january', 'march']),
  paper_type: z.enum(['question_paper', 'marking_scheme', 'both']),
});

type PastPaperFormData = z.infer<typeof pastPaperSchema>;

interface PastPaperUploadFormProps {
  userId: string;
  examBoards: any[];
  subjects: any[];
  topics: any[];
}

export default function PastPaperUploadForm({
  userId,
  examBoards,
  subjects,
  topics,
}: PastPaperUploadFormProps) {
  const router = useRouter();
  const [questionPaperFile, setQuestionPaperFile] = useState<File | null>(null);
  const [markingSchemeFile, setMarkingSchemeFile] = useState<File | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PastPaperFormData>({
    resolver: zodResolver(pastPaperSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      session: 'may_june',
      paper_type: 'question_paper',
    },
  });

  const selectedExamBoard = watch('exam_board_id');
  const selectedSubject = watch('subject_id');
  const paperType = watch('paper_type');

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

  const onDropQuestionPaper = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        setQuestionPaperFile(file);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const onDropMarkingScheme = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        setMarkingSchemeFile(file);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const {
    getRootProps: getQuestionPaperRootProps,
    getInputProps: getQuestionPaperInputProps,
    isDragActive: isQuestionPaperDragActive,
  } = useDropzone({
    onDrop: onDropQuestionPaper,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const {
    getRootProps: getMarkingSchemeRootProps,
    getInputProps: getMarkingSchemeInputProps,
    isDragActive: isMarkingSchemeDragActive,
  } = useDropzone({
    onDrop: onDropMarkingScheme,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const onSubmit = async (data: PastPaperFormData, status: 'draft' | 'pending') => {
    // Validate files
    if (paperType === 'question_paper' && !questionPaperFile) {
      toast.error('Please upload a question paper');
      return;
    }
    if (paperType === 'marking_scheme' && !markingSchemeFile) {
      toast.error('Please upload a marking scheme');
      return;
    }
    if (paperType === 'both' && (!questionPaperFile || !markingSchemeFile)) {
      toast.error('Please upload both question paper and marking scheme');
      return;
    }

    // Topics are optional for past papers (they cover multiple topics)
    // No validation needed

    setIsUploading(true);
    setIsSubmitting(status === 'pending');

    try {
      let questionPaperUrl = '';
      let markingSchemeUrl = '';

      // Upload question paper
      if (questionPaperFile) {
        questionPaperUrl = await uploadPDF(
          questionPaperFile,
          STORAGE_BUCKETS.PAST_PAPERS,
          userId
        );
      }

      // Upload marking scheme
      if (markingSchemeFile) {
        markingSchemeUrl = await uploadPDF(
          markingSchemeFile,
          STORAGE_BUCKETS.PAST_PAPERS,
          userId
        );
      }

      // Submit to API
      const response = await fetch('/api/contribute/past-papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          question_paper_url: questionPaperUrl,
          marking_scheme_url: markingSchemeUrl,
          topic_ids: selectedTopics,
          status,
          created_by: userId,
        }),
      });

      if (response.ok) {
        toast.success(
          status === 'draft'
            ? 'Draft saved successfully!'
            : 'Past paper submitted for review!'
        );
        router.push('/contribute/my-content');
      } else {
        toast.error('Failed to upload past paper');
      }
    } catch (error: any) {
      console.error('Error uploading past paper:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
          Paper Information
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., ZIMSEC O-Level Mathematics Paper 1 - November 2023"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Exam Board & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Year, Paper Number, Session */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              {...register('year', { valueAsNumber: true })}
              type="number"
              min="1990"
              max="2030"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
            {errors.year && (
              <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paper Number *
            </label>
            <input
              {...register('paper_number')}
              type="text"
              placeholder="e.g., Paper 1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            />
            {errors.paper_number && (
              <p className="text-red-600 text-sm mt-1">
                {errors.paper_number.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session *
            </label>
            <select
              {...register('session')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
            >
              <option value="may_june">May/June</option>
              <option value="october_november">October/November</option>
              <option value="january">January</option>
              <option value="march">March</option>
            </select>
          </div>
        </div>

        {/* Paper Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you uploading? *
          </label>
          <div className="flex space-x-4">
            {[
              { value: 'question_paper', label: 'Question Paper Only' },
              { value: 'marking_scheme', label: 'Marking Scheme Only' },
              { value: 'both', label: 'Both' },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  {...register('paper_type')}
                  type="radio"
                  value={option.value}
                  className="w-4 h-4 text-[#2ECC71] focus:ring-[#2ECC71]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
          Upload Files
        </h2>

        {/* Question Paper Upload */}
        {(paperType === 'question_paper' || paperType === 'both') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Paper (PDF) *
            </label>

            {!questionPaperFile ? (
              <div
                {...getQuestionPaperRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isQuestionPaperDragActive
                  ? 'border-[#2ECC71] bg-green-50'
                  : 'border-gray-300 hover:border-[#2ECC71]'
                  }`}
              >
                <input {...getQuestionPaperInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-1">
                  Drop question paper PDF here, or click to browse
                </p>
                <p className="text-sm text-gray-500">Maximum file size: 20MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-[#2ECC71] rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-[#2ECC71]" />
                  <div>
                    <p className="font-medium text-gray-900">{questionPaperFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(questionPaperFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuestionPaperFile(null)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Marking Scheme Upload */}
        {(paperType === 'marking_scheme' || paperType === 'both') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marking Scheme (PDF) {paperType === 'both' ? '*' : '(Optional)'}
            </label>

            {!markingSchemeFile ? (
              <div
                {...getMarkingSchemeRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isMarkingSchemeDragActive
                  ? 'border-[#2ECC71] bg-green-50'
                  : 'border-gray-300 hover:border-[#2ECC71]'
                  }`}
              >
                <input {...getMarkingSchemeInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-1">
                  Drop marking scheme PDF here, or click to browse
                </p>
                <p className="text-sm text-gray-500">Maximum file size: 20MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-[#2ECC71] rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-[#2ECC71]" />
                  <div>
                    <p className="font-medium text-gray-900">{markingSchemeFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(markingSchemeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMarkingSchemeFile(null)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Topic Tagging */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
          Topic Tags <span className="text-gray-400 text-sm font-normal">(Optional)</span>
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Optionally tag topics covered in this past paper for better organization
        </p>

        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition ${selectedTopics.includes(topic.id)
                  ? 'border-[#2ECC71] bg-green-50 text-green-900'
                  : 'border-gray-200 hover:border-[#2ECC71]'
                  }`}
              >
                <span className="text-sm font-medium">{topic.name}</span>
                {selectedTopics.includes(topic.id) && (
                  <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Select a subject to see available topics
          </p>
        )}

        {selectedTopics.length > 0 && (
          <p className="text-sm text-gray-600 mt-3">
            {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
          </p>
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
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
            disabled={isUploading}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isUploading && !isSubmitting ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, 'pending'))}
            disabled={isUploading}
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
