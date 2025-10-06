import { Trophy, RefreshCw, Home, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuizResultsProps {
  quiz: any;
  questions: any[];
  answers: Record<string, any>;
  score: number;
  onRetry: () => void;
  onExit: () => void;
}

export default function QuizResults({
  quiz,
  questions,
  answers,
  score,
  onRetry,
  onExit,
}: QuizResultsProps) {
  const passed = score >= quiz.passing_score;

  const getQuestionResult = (question: any) => {
    const userAnswer = answers[question.id];
    if (!userAnswer) return { isCorrect: false, correctAnswer: null };

    let isCorrect = false;
    let correctAnswer = null;

    if (question.question_type === 'multiple_choice') {
      const correctOptions = question.quiz_options?.filter((opt: any) => opt.is_correct);
      const correctIds = correctOptions?.map((opt: any) => opt.id) || [];
      isCorrect = correctIds.includes(userAnswer);
      correctAnswer = correctOptions?.[0]?.option_text;
    } else if (question.question_type === 'true_false') {
      isCorrect = userAnswer === question.correct_answer;
      correctAnswer = question.correct_answer;
    } else if (question.question_type === 'short_answer') {
      isCorrect =
        userAnswer.toLowerCase().trim() ===
        question.correct_answer.toLowerCase().trim();
      correctAnswer = question.correct_answer;
    }

    return { isCorrect, correctAnswer };
  };

  const correctCount = questions.filter((q) => getQuestionResult(q).isCorrect).length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Score Card */}
        <div className={`rounded-lg shadow-lg p-8 mb-8 ${
          passed
            ? 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60]'
            : 'bg-gradient-to-r from-[#E74C3C] to-[#C0392B]'
        } text-white`}>
          <div className="text-center">
            <Trophy className="w-20 h-20 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-2 font-['Poppins']">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-xl mb-6 opacity-90">
              {passed
                ? 'You passed the quiz!'
                : `You need ${quiz.passing_score}% to pass`}
            </p>

            <div className="flex items-center justify-center space-x-8 mb-6">
              <div>
                <p className="text-6xl font-bold font-['Poppins']">{score}%</p>
                <p className="text-sm opacity-90">Your Score</p>
              </div>
              <div className="w-px h-16 bg-white/30" />
              <div>
                <p className="text-4xl font-bold">
                  {correctCount}/{questions.length}
                </p>
                <p className="text-sm opacity-90">Correct Answers</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={onRetry}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={onExit}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Back to Quizzes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Poppins']">
            Review Answers
          </h2>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const result = getQuestionResult(question);
              const userAnswer = answers[question.id];

              return (
                <div
                  key={question.id}
                  className={`p-6 rounded-lg border-2 ${
                    result.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded">
                          Q{index + 1}
                        </span>
                        {result.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          result.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {question.question_text}
                      </p>
                    </div>
                  </div>

                  {/* Answer Details */}
                  <div className="space-y-2 mb-4">
                    {userAnswer && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                        <p className={`text-sm ${
                          result.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {question.question_type === 'multiple_choice'
                            ? question.quiz_options?.find((opt: any) => opt.id === userAnswer)
                                ?.option_text
                            : userAnswer}
                        </p>
                      </div>
                    )}

                    {!result.isCorrect && result.correctAnswer && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Correct Answer:</p>
                        <p className="text-sm text-green-700">{result.correctAnswer}</p>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex items-start space-x-2">
                        <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Explanation:
                          </p>
                          <p className="text-sm text-blue-800">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
