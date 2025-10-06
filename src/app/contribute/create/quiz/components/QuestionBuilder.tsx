'use client';

import { useState } from 'react';
import { Question } from './QuizCreatorForm';
import { Trash2, Plus, X } from 'lucide-react';

interface QuestionBuilderProps {
  question: Question;
  questionNumber: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
}

export default function QuestionBuilder({
  question,
  questionNumber,
  onUpdate,
  onDelete,
}: QuestionBuilderProps) {
  const updateQuestionText = (text: string) => {
    onUpdate({ ...question, question_text: text });
  };

  const updateQuestionType = (type: Question['type']) => {
    const baseQuestion = {
      ...question,
      type,
      question_text: question.question_text,
      points: question.points,
      explanation: question.explanation,
    };

    if (type === 'multiple_choice') {
      onUpdate({
        ...baseQuestion,
        options: question.options || [
          { id: `opt-${Date.now()}-1`, option_text: '', is_correct: false },
          { id: `opt-${Date.now()}-2`, option_text: '', is_correct: false },
        ],
      });
    } else if (type === 'true_false') {
      onUpdate({
        ...baseQuestion,
        correct_answer: question.correct_answer || 'true',
      });
    } else {
      onUpdate({
        ...baseQuestion,
        correct_answer: question.correct_answer || '',
      });
    }
  };

  const updatePoints = (points: number) => {
    onUpdate({ ...question, points });
  };

  const updateExplanation = (explanation: string) => {
    onUpdate({ ...question, explanation });
  };

  const addOption = () => {
    if (question.type === 'multiple_choice') {
      const newOption = {
        id: `opt-${Date.now()}`,
        option_text: '',
        is_correct: false,
      };
      onUpdate({
        ...question,
        options: [...(question.options || []), newOption],
      });
    }
  };

  const updateOption = (optionId: string, text: string) => {
    if (question.type === 'multiple_choice') {
      onUpdate({
        ...question,
        options: question.options?.map((opt) =>
          opt.id === optionId ? { ...opt, option_text: text } : opt
        ),
      });
    }
  };

  const toggleCorrectOption = (optionId: string) => {
    if (question.type === 'multiple_choice') {
      onUpdate({
        ...question,
        options: question.options?.map((opt) =>
          opt.id === optionId
            ? { ...opt, is_correct: !opt.is_correct }
            : opt
        ),
      });
    }
  };

  const deleteOption = (optionId: string) => {
    if (question.type === 'multiple_choice') {
      onUpdate({
        ...question,
        options: question.options?.filter((opt) => opt.id !== optionId),
      });
    }
  };

  const updateCorrectAnswer = (answer: string) => {
    onUpdate({ ...question, correct_answer: answer });
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 font-['Poppins']">
          Question {questionNumber}
        </h3>
        
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete question"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Question Type & Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Type
          </label>
          <select
            value={question.type}
            onChange={(e) => updateQuestionType(e.target.value as Question['type'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="short_answer">Short Answer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={question.points}
            onChange={(e) => updatePoints(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <textarea
          value={question.question_text}
          onChange={(e) => updateQuestionText(e.target.value)}
          rows={3}
          placeholder="Enter your question here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent resize-none"
        />
      </div>

      {/* Multiple Choice Options */}
      {question.type === 'multiple_choice' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Answer Options *
            </label>
            <button
              type="button"
              onClick={addOption}
              className="flex items-center space-x-1 text-sm text-[#2ECC71] hover:text-[#27AE60]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Option</span>
            </button>
          </div>

          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={option.is_correct}
                  onChange={() => toggleCorrectOption(option.id)}
                  className="w-5 h-5 text-[#2ECC71] rounded focus:ring-[#2ECC71]"
                  title="Mark as correct answer"
                />
                
                <input
                  type="text"
                  value={option.option_text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                />

                {question.options && question.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => deleteOption(option.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Check the box next to the correct answer(s)
          </p>
        </div>
      )}

      {/* True/False Options */}
      {question.type === 'true_false' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={`correct-${question.id}`}
                value="true"
                checked={question.correct_answer === 'true'}
                onChange={(e) => updateCorrectAnswer(e.target.value)}
                className="w-4 h-4 text-[#2ECC71] focus:ring-[#2ECC71]"
              />
              <span className="text-gray-700">True</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={`correct-${question.id}`}
                value="false"
                checked={question.correct_answer === 'false'}
                onChange={(e) => updateCorrectAnswer(e.target.value)}
                className="w-4 h-4 text-[#2ECC71] focus:ring-[#2ECC71]"
              />
              <span className="text-gray-700">False</span>
            </label>
          </div>
        </div>
      )}

      {/* Short Answer */}
      {question.type === 'short_answer' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer *
          </label>
          <input
            type="text"
            value={question.correct_answer || ''}
            onChange={(e) => updateCorrectAnswer(e.target.value)}
            placeholder="Enter the correct answer..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Student answers will be checked against this (case-insensitive)
          </p>
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={question.explanation || ''}
          onChange={(e) => updateExplanation(e.target.value)}
          rows={2}
          placeholder="Explain why this is the correct answer..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
