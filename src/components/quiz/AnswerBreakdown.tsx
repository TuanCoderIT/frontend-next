interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AnswerBreakdownProps {
  questions: Question[];
  userAnswers: number[];
}

export default function AnswerBreakdown({
  questions,
  userAnswers,
}: AnswerBreakdownProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900">
          Detailed Answer Breakdown
        </h3>
        <p className="text-gray-600 mt-2">
          Review each question and learn from the explanations
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          const wasAnswered = userAnswer !== -1;

          return (
            <div key={question.id} className="p-8">
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isCorrect
                      ? "bg-green-100 text-green-800"
                      : wasAnswered
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {question.question}
                  </h4>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : wasAnswered
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
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
                        Correct
                      </>
                    ) : wasAnswered ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Incorrect
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Not Answered
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid gap-3 mb-6">
                {question.options.map((option, optionIndex) => {
                  const isUserAnswer = userAnswer === optionIndex;
                  const isCorrectAnswer =
                    question.correctAnswer === optionIndex;

                  return (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrectAnswer
                          ? "border-green-500 bg-green-50"
                          : isUserAnswer
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-semibold mr-3 ${
                            isCorrectAnswer
                              ? "text-green-700"
                              : isUserAnswer
                              ? "text-red-700"
                              : "text-gray-500"
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <span
                          className={`flex-1 ${
                            isCorrectAnswer
                              ? "text-green-800 font-medium"
                              : isUserAnswer
                              ? "text-red-800"
                              : "text-gray-700"
                          }`}
                        >
                          {option}
                        </span>
                        <div className="flex items-center gap-2">
                          {isCorrectAnswer && (
                            <span className="flex items-center text-green-700 text-sm font-medium">
                              <svg
                                className="w-4 h-4 mr-1"
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
                              Correct
                            </span>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <span className="flex items-center text-red-700 text-sm font-medium">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">
                      Explanation
                    </h5>
                    <p className="text-blue-800 leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
