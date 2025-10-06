'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizHeader from './QuizHeader';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import { Clock, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuizPlayerProps {
  quiz: any;
  userId: string;
}

export default function QuizPlayer({ quiz, userId }: QuizPlayerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = quiz.quiz_questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Timer
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter((q: any) => !answers[q.id]);
    if (unanswered.length > 0 && timeRemaining > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);

    // Calculate score
    let totalScore = 0;
    let earnedScore = 0;

    questions.forEach((question: any) => {
      totalScore += question.points;
      const userAnswer = answers[question.id];

      if (!userAnswer) return;

      // Check answer based on question type
      if (question.question_type === 'multiple_choice') {
        const correctOptions = question.quiz_options?.filter((opt: any) => opt.is_correct);
        const userSelectedIds = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const correctIds = correctOptions?.map((opt: any) => opt.id) || [];

        // Check if all correct options are selected and no incorrect ones
        const isCorrect =
          userSelectedIds.length === correctIds.length &&
          userSelectedIds.every((id: string) => correctIds.includes(id));

        if (isCorrect) {
          earnedScore += question.points;
        }
      } else if (question.question_type === 'true_false') {
        if (userAnswer === question.correct_answer) {
          earnedScore += question.points;
        }
      } else if (question.question_type === 'short_answer') {
        // Case-insensitive comparison
        if (
          userAnswer.toLowerCase().trim() ===
          question.correct_answer.toLowerCase().trim()
        ) {
          earnedScore += question.points;
        }
      }
    });

    const percentage = Math.round((earnedScore / totalScore) * 100);
    setScore(percentage);

    // Save attempt to database
    try {
      const response = await fetch('/api/quizzes/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quiz.id,
          user_id: userId,
          answers,
          score: percentage,
          time_taken: quiz.time_limit_minutes * 60 - timeRemaining,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save quiz attempt');
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(quiz.time_limit_minutes * 60);
    setIsSubmitted(false);
    setScore(0);
  };

  if (isSubmitted) {
    return (
      <QuizResults
        quiz={quiz}
        questions={questions}
        answers={answers}
        score={score}
        onRetry={handleRetry}
        onExit={() => router.push('/quizzes')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <QuizHeader
        quiz={quiz}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeRemaining={timeRemaining}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#2ECC71] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            answer={answers[currentQuestion.id]}
            onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q: any, index: number) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition ${
                  index === currentQuestionIndex
                    ? 'bg-[#2ECC71] text-white'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
