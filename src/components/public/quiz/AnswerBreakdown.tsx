// import { Question } from "@/types/public/question";

// interface AnswerBreakdownProps {
//   questions: Question[];
//   userAnswers: (string | string[])[];
// }

// export default function AnswerBreakdown({
//   questions,
//   userAnswers,
// }: AnswerBreakdownProps) {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
//         <h3 className="text-2xl font-bold text-gray-900">
//           Detailed Answer Breakdown
//         </h3>
//         <p className="text-gray-600 mt-2">
//           Review each question and learn from the explanations
//         </p>
//       </div>

//       <div className="divide-y divide-gray-200">
//         {questions.map((question, index) => {
//           const userAnswer = userAnswers[index];
//           const wasAnswered =
//             userAnswer !== undefined &&
//             userAnswer !== null &&
//             userAnswer !== "" &&
//             (!Array.isArray(userAnswer) || userAnswer.length > 0);

//           // Xác định đúng / sai (chỉ meaningful với multiple choice / true_false)
//           // const isCorrect =
//           //   question.type === "multiple_choice" ||
//           //   question.type === "true_false"
//           //     ? userAnswer === question.answer
//           //     : false;
//           const isCorrect = userAnswer === question.answer;

//           return (
//             <div key={question.id} className="p-8">
//               {/* Question Header */}
//               <div className="flex items-start gap-4 mb-6">
//                 <div
//                   className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
//                     isCorrect
//                       ? "bg-green-100 text-green-800"
//                       : wasAnswered
//                       ? "bg-red-100 text-red-800"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {index + 1}
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-2">
//                     {question.content}
//                   </h4>
//                   <div
//                     className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                       isCorrect
//                         ? "bg-green-100 text-green-800"
//                         : wasAnswered
//                         ? "bg-red-100 text-red-800"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {isCorrect
//                       ? "✅ Correct"
//                       : wasAnswered
//                       ? "❌ Incorrect"
//                       : "❓ Not Answered"}
//                   </div>
//                 </div>
//               </div>

//               {/* Answer Section */}
//               {question.type === "multiple_choice" && question.options && (
//                 <div className="grid gap-3 mb-6">
//                   {Object.entries(question.options).map(([key, value]) => {
//                     const isUserAnswer = userAnswer === key;
//                     const isanswer = question.answer === key;

//                     return (
//                       <div
//                         key={key}
//                         className={`p-4 rounded-lg border-2 ${
//                           isanswer
//                             ? "border-green-500 bg-green-50"
//                             : isUserAnswer
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-200 bg-gray-50"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <span
//                             className={`text-sm font-semibold mr-3 ${
//                               isanswer
//                                 ? "text-green-700"
//                                 : isUserAnswer
//                                 ? "text-red-700"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             {key}.
//                           </span>
//                           <span>{value}</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {question.type === "true_false" && (
//                 <div className="mb-6">
//                   <p>
//                     ✅ Correct Answer:{" "}
//                     <span className="font-semibold text-green-700">
//                       {question.answer.toString()}
//                     </span>
//                   </p>
//                   {wasAnswered && (
//                     <p>
//                       🧑‍🎓 Your Answer:{" "}
//                       <span
//                         className={`font-semibold ${
//                           isCorrect ? "text-green-700" : "text-red-700"
//                         }`}
//                       >
//                         {userAnswer?.toString()}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               )}

//               {(question.type === "short_answer" ||
//                 question.type === "essay") && (
//                 <div className="mb-6">
//                   <p>
//                     ✅ Expected Answer:{" "}
//                     <span className="font-semibold text-green-700">
//                       {Array.isArray(question.answer)
//                         ? question.answer.join(", ")
//                         : question.answer}
//                     </span>
//                   </p>
//                   {wasAnswered && (
//                     <p>
//                       🧑‍🎓 Your Answer:{" "}
//                       <span className="font-semibold text-blue-700">
//                         {Array.isArray(userAnswer)
//                           ? userAnswer.join(", ")
//                           : userAnswer}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Explanation */}
//               {question.explanation && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//                   <h5 className="font-semibold text-blue-900 mb-2">
//                     Explanation
//                   </h5>
//                   <p className="text-blue-800 leading-relaxed">
//                     {question.explanation}
//                   </p>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// import { Question } from "@/types/public/question";

// interface AnswerBreakdownProps {
//   questions: Question[];
//   userAnswers: (string | string[])[];
// }

// export default function AnswerBreakdown({
//   questions,
//   userAnswers,
// }: AnswerBreakdownProps) {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
//         <h3 className="text-2xl font-bold text-gray-900">
//           Detailed Answer Breakdown
//         </h3>
//         <p className="text-gray-600 mt-2">
//           Review each question and learn from the explanations
//         </p>
//       </div>

//       <div className="divide-y divide-gray-200">
//         {questions.map((question, index) => {
//           const userAnswer = userAnswers[index];
//           const correctAnswer = question.answer;
//           const type = question.type;

//           // So sánh đúng sai
//           const isCorrect =
//             type === "multiple_choice" || type === "true_false"
//               ? userAnswer === correctAnswer
//               : false; // essay/short_answer cần chấm tay

//           return (
//             <div key={question.id} className="p-8">
//               {/* Question Header */}
//               <div className="flex items-start gap-4 mb-6">
//                 <div
//                   className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
//                     isCorrect
//                       ? "bg-green-100 text-green-800"
//                       : userAnswer
//                       ? "bg-red-100 text-red-800"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {index + 1}
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-2">
//                     {question.content}
//                   </h4>
//                   <div
//                     className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                       isCorrect
//                         ? "bg-green-100 text-green-800"
//                         : userAnswer
//                         ? "bg-red-100 text-red-800"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {isCorrect
//                       ? "✔ Correct"
//                       : userAnswer
//                       ? "✘ Incorrect"
//                       : "❓ Not Answered"}
//                   </div>
//                 </div>
//               </div>

//               {/* Answer Options / User Input */}
//               <div className="grid gap-3 mb-6">
//                 {type === "multiple_choice" &&
//                   Object.entries(question.options ?? {}).map(([key, value]) => {
//                     const isUserAnswer = userAnswer === key;
//                     const isCorrectAnswer = correctAnswer === key;

//                     return (
//                       <div
//                         key={key}
//                         className={`p-4 rounded-lg border-2 ${
//                           isCorrectAnswer
//                             ? "border-green-500 bg-green-50"
//                             : isUserAnswer
//                             ? "border-red-500 bg-red-50"
//                             : "border-gray-200 bg-gray-50"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <span className="text-sm font-semibold mr-3">
//                             {key}.
//                           </span>
//                           <span>{value}</span>
//                           {isCorrectAnswer && (
//                             <span className="ml-3 text-green-700 font-medium">
//                               Correct
//                             </span>
//                           )}
//                           {isUserAnswer && !isCorrectAnswer && (
//                             <span className="ml-3 text-red-700 font-medium">
//                               Your Answer
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}

//                 {type === "true_false" && (
//                   <div className="p-4 rounded-lg border bg-gray-50">
//                     <p>
//                       <strong>Your Answer:</strong>{" "}
//                       {String(userAnswer) || "Not answered"}
//                     </p>
//                     <p>
//                       <strong>Correct Answer:</strong> {String(correctAnswer)}
//                     </p>
//                   </div>
//                 )}

//                 {(type === "short_answer" || type === "essay") && (
//                   <div className="p-4 rounded-lg border bg-yellow-50">
//                     <p>
//                       <strong>Your Answer:</strong>{" "}
//                       {userAnswer || "Not answered"}
//                     </p>
//                     <p>
//                       <strong>Expected Answer:</strong>{" "}
//                       {correctAnswer || "Essay grading required"}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Explanation */}
//               {question.explanation && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//                   <h5 className="font-semibold text-blue-900 mb-2">
//                     Explanation
//                   </h5>
//                   <p className="text-blue-800 leading-relaxed">
//                     {question.explanation}
//                   </p>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import { Question } from "@/types/public/question";

interface AnswerBreakdownProps {
  questions: Question[];
  userAnswers: (string | string[])[];
}

export default function AnswerBreakdown({
  questions,
  userAnswers,
}: AnswerBreakdownProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900">
          Chi tiết đáp án
        </h3>
        <p className="text-gray-600 mt-2">
          Đánh giá từng câu và học từ các giải thích
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const correctAnswer = question.answer;
          const type = question.type;

          // So sánh đúng sai
          const isCorrect =
            type === "multiple_choice" || type === "true_false"
              ? userAnswer === correctAnswer
              : false; // essay/short_answer cần chấm tay

          return (
            <div key={question.id} className="p-8">
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isCorrect
                      ? "bg-green-100 text-green-800"
                      : userAnswer
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {question.content}
                  </h4>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : userAnswer
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isCorrect
                      ? "✔ Đúng"
                      : userAnswer
                      ? "✘ Sai"
                      : "❓ Chưa trả lời"}
                  </div>
                </div>
              </div>

              {/* Answer Options / User Input */}
              <div className="grid gap-3 mb-6">
                {type === "multiple_choice" &&
                  Object.entries(question.options ?? {}).map(([key, value]) => {
                    const isUserAnswer = userAnswer === key;
                    const isCorrectAnswer = correctAnswer === key;

                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50"
                            : isUserAnswer
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-semibold mr-3">
                            {key}.
                          </span>
                          <span>{value}</span>
                          {isCorrectAnswer && (
                            <span className="ml-3 text-green-700 font-medium">
                              Đúng
                            </span>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <span className="ml-3 text-red-700 font-medium">
                              Đáp án của bạn
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {type === "true_false" && (
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p>
                      <strong>Đáp án của bạn:</strong>{" "}
                      {String(userAnswer) || "Chưa trả lời"}
                    </p>
                    <p>
                      <strong>Đáp án đúng:</strong> {String(correctAnswer)}
                    </p>
                  </div>
                )}

                {(type === "short_answer" || type === "essay") && (
                  <div className="p-4 rounded-lg border bg-yellow-50">
                    <p>
                      <strong>Đáp án của bạn:</strong>{" "}
                      {userAnswer || "Chưa trả lời"}
                    </p>
                    <p>
                      <strong>Đáp án đúng:</strong>{" "}
                      {correctAnswer || "Cần chấm tay"}
                    </p>
                  </div>
                )}
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h5 className="font-semibold text-blue-900 mb-2">
                    Giải thích
                  </h5>
                  <p className="text-blue-800 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
