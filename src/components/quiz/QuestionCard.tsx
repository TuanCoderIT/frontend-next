interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number;
  onAnswerSelect: (answerIndex: number) => void;
  questionNumber: number;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            Question {questionNumber}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedAnswer === index
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedAnswer === index
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedAnswer === index && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm font-semibold mr-3 ${
                    selectedAnswer === index ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {String.fromCharCode(65 + index)}.
                </span>
                <span
                  className={`text-lg ${
                    selectedAnswer === index ? "text-blue-900" : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Select the best answer from the options
          above. You can change your answer anytime before submitting.
        </p>
      </div>
    </div>
  );
}
