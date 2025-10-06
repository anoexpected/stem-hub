'use client';

import { Question } from './QuizCreatorForm';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuizPreviewProps {
  questions: Question[];
}

export default function QuizPreview({ questions }: QuizPreviewProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No questions to preview. Add questions to see the preview.</p>
      </div>
    );
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      {/* Quiz Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-900">
            <strong>{questions.length}</strong> questions
          </span>
          <span className="text-blue-900">
            <strong>{totalPoints}</strong> total points
          </span>
        </div>
      </div>

      {/* Questions */}
      {questions.map((question, index) => (
        <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-[#1B2A4C] text-white text-xs font-bold rounded">
                  Q{index + 1}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  {question.points} {question.points === 1 ? 'point' : 'points'}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded capitalize">
                  {question.type.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-gray-900 font-medium">
                {question.question_text || <em className="text-gray-400">No question text</em>}
              </p>
            </div>
          </div>

          {/* Multiple Choice Options */}
          {question.type === 'multiple_choice' && (
            <div className="space-y-2 mb-4">
              {question.options?.map((option, optIndex) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                    option.is_correct
                      ? 'border-[#2ECC71] bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    option.is_correct
                      ? 'border-[#2ECC71] bg-[#2ECC71]'
                      : 'border-gray-300'
                  }`}>
                    {option.is_correct && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  
                  <span className={`flex-1 ${option.is_correct ? 'font-medium text-green-900' : 'text-gray-700'}`}>
                    {option.option_text || <em className="text-gray-400">Empty option</em>}
                  </span>
                  
                  {option.is_correct && (
                    <span className="text-xs font-medium text-[#2ECC71]">Correct</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* True/False */}
          {question.type === 'true_false' && (
            <div className="space-y-2 mb-4">
              <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                question.correct_answer === 'true'
                  ? 'border-[#2ECC71] bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  question.correct_answer === 'true'
                    ? 'border-[#2ECC71] bg-[#2ECC71]'
                    : 'border-gray-300'
                }`}>
                  {question.correct_answer === 'true' && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className={question.correct_answer === 'true' ? 'font-medium text-green-900' : 'text-gray-700'}>
                  True
                </span>
                {question.correct_answer === 'true' && (
                  <span className="text-xs font-medium text-[#2ECC71]">Correct</span>
                )}
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                question.correct_answer === 'false'
                  ? 'border-[#2ECC71] bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  question.correct_answer === 'false'
                    ? 'border-[#2ECC71] bg-[#2ECC71]'
                    : 'border-gray-300'
                }`}>
                  {question.correct_answer === 'false' && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className={question.correct_answer === 'false' ? 'font-medium text-green-900' : 'text-gray-700'}>
                  False
                </span>
                {question.correct_answer === 'false' && (
                  <span className="text-xs font-medium text-[#2ECC71]">Correct</span>
                )}
              </div>
            </div>
          )}

          {/* Short Answer */}
          {question.type === 'short_answer' && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 p-3 bg-green-50 border-2 border-[#2ECC71] rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#2ECC71]" />
                <span className="font-medium text-green-900">
                  Correct Answer: {question.correct_answer || <em className="text-gray-400">Not set</em>}
                </span>
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                  <p className="text-sm text-blue-800">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
