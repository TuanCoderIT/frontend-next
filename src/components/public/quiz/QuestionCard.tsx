import { Question } from "@/types/public/question";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string; // đổi từ number → string
  onAnswerSelect: (answerKey: string) => void; // đổi kiểu param
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
            Câu hỏi {questionNumber}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
          {question.content}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.type === "multiple_choice" &&
          question.options &&
          Object.entries(question.options).map(([key, value], index) => (
            <button
              key={key}
              onClick={() => onAnswerSelect(key)} // pass key "A" | "B" | "C" | "D"
              className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedAnswer === key
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    selectedAnswer === key
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === key && (
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
                <span
                  className={`text-sm font-semibold mr-3 ${
                    selectedAnswer === key ? "text-blue-700" : "text-gray-500"
                  }`}
                >
                  {key}.
                </span>
                <span
                  className={`text-lg ${
                    selectedAnswer === key ? "text-blue-900" : "text-gray-700"
                  }`}
                >
                  {value}
                </span>
              </div>
            </button>
          ))}

        {question.type === "true_false" && (
          <div className="flex flex-col gap-3">
            {/* {"A": "True", "B": "False"} */}
            {["A", "B"].map((key) => (
              <button
                key={key}
                onClick={() => onAnswerSelect(key)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === key
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      selectedAnswer === key
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === key && (
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
                  <span
                    className={`text-lg ${
                      selectedAnswer === key ? "text-blue-900" : "text-gray-700"
                    }`}
                  >
                    {key === "A" ? "True" : "False"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {(question.type === "short_answer" || question.type === "essay") && (
          <textarea
            className="w-full p-4 border rounded-lg"
            rows={question.type === "essay" ? 6 : 2}
            placeholder={
              question.type === "essay"
                ? "Viết câu trả lời của bạn ở đây..."
                : "Nhập câu trả lời của bạn ở đây..."
            }
            value={selectedAnswer || ""}
            onChange={(e) => onAnswerSelect(e.target.value)}
          />
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Mẹo:</strong> Chọn câu trả lời tốt nhất từ các tùy chọn
          trên. Bạn có thể thay đổi câu trả lời bất cứ lúc nào trước khi nộp.
        </p>
      </div>
    </div>
  );
}
