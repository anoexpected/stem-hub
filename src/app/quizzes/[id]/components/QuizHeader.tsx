import { Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface QuizHeaderProps {
  quiz: any;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
}

export default function QuizHeader({
  quiz,
  currentQuestion,
  totalQuestions,
  timeRemaining,
}: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining < 60;

  return (
    <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Quiz Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#2ECC71] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-['Poppins']">
                {quiz.title}
              </h1>
              <p className="text-sm text-gray-300">
                {quiz.topics?.subjects?.exam_boards?.name} • {quiz.topics?.subjects?.name}
              </p>
            </div>
          </div>

          {/* Timer & Progress */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-300">Progress</p>
              <p className="text-lg font-bold">
                {currentQuestion}/{totalQuestions}
              </p>
            </div>

            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isLowTime ? 'bg-red-500' : 'bg-white/10'
            }`}>
              <Clock className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
              <span className="text-lg font-bold font-mono">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
