interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  // answers: number[];
  answers: string[];
  onPrevious: () => void;
  onNext: () => void;
  onQuestionJump: (questionIndex: number) => void;
  onSubmit: () => void;
}

export default function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answers,
  onPrevious,
  onNext,
  onQuestionJump,
  onSubmit,
}: QuizNavigationProps) {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const answeredQuestions = answers.filter((answer) => answer !== "").length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Question Navigation Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Trình điều hướng câu hỏi
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <button
              key={index}
              onClick={() => onQuestionJump(index)}
              className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                index === currentQuestion
                  ? "bg-blue-600 text-white shadow-lg"
                  : // : answers[index] !== -1
                  answers[index] !== ""
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
            <span className="text-gray-600">Hiện tại</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
            <span className="text-gray-600">Đã trả lời</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
            <span className="text-gray-600">Chưa trả lời</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-3">
          <button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
              isFirstQuestion
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Trước
          </button>

          {!isLastQuestion ? (
            <button
              onClick={onNext}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Tiếp
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Nộp bài
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-semibold">{answeredQuestions}</span> of{" "}
          <span className="font-semibold">{totalQuestions}</span> câu hỏi
          đã trả lời
        </div>
      </div>
    </div>
  );
}
