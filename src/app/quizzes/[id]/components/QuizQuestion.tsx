'use client';

interface QuizQuestionProps {
  question: any;
  questionNumber: number;
  answer: any;
  onAnswer: (answer: any) => void;
}

export default function QuizQuestion({
  question,
  questionNumber,
  answer,
  onAnswer,
}: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-3 py-1 bg-[#1B2A4C] text-white text-sm font-bold rounded">
              Q{questionNumber}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
              {question.points} {question.points === 1 ? 'point' : 'points'}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded capitalize">
              {question.question_type.replace('_', ' ')}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
            {question.question_text}
          </h2>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {/* Multiple Choice */}
        {question.question_type === 'multiple_choice' && question.quiz_options && (
          <>
            {question.quiz_options.map((option: any) => (
              <label
                key={option.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                  answer === option.id
                    ? 'border-[#2ECC71] bg-green-50'
                    : 'border-gray-200 hover:border-[#2ECC71] hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answer === option.id}
                  onChange={() => onAnswer(option.id)}
                  className="w-5 h-5 text-[#2ECC71] focus:ring-[#2ECC71]"
                />
                <span className="flex-1 text-gray-900">{option.option_text}</span>
              </label>
            ))}
          </>
        )}

        {/* True/False */}
        {question.question_type === 'true_false' && (
          <div className="space-y-3">
            <label
              className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                answer === 'true'
                  ? 'border-[#2ECC71] bg-green-50'
                  : 'border-gray-200 hover:border-[#2ECC71] hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={answer === 'true'}
                onChange={() => onAnswer('true')}
                className="w-5 h-5 text-[#2ECC71] focus:ring-[#2ECC71]"
              />
              <span className="flex-1 text-gray-900 font-medium">True</span>
            </label>

            <label
              className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                answer === 'false'
                  ? 'border-[#2ECC71] bg-green-50'
                  : 'border-gray-200 hover:border-[#2ECC71] hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={answer === 'false'}
                onChange={() => onAnswer('false')}
                className="w-5 h-5 text-[#2ECC71] focus:ring-[#2ECC71]"
              />
              <span className="flex-1 text-gray-900 font-medium">False</span>
            </label>
          </div>
        )}

        {/* Short Answer */}
        {question.question_type === 'short_answer' && (
          <div>
            <input
              type="text"
              value={answer || ''}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">
              Answer is case-insensitive
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
