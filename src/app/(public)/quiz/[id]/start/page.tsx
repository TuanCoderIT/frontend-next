"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizData, RawQuestion } from "@/types/public/question";
import QuizTimer from "@/components/public/quiz/QuizTimer";
import QuizProgress from "@/components/public/quiz/QuizProgress";
import QuestionCard from "@/components/public/quiz/QuestionCard";
import QuizNavigation from "@/components/public/quiz/QuizNavigation";
import { getQuizById, submitQuizResult } from "@/api/quiz";
import { DataLoading } from "@/components/common/LoadingScreen";

export default function QuizStartPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id ? parseInt(params.id, 10) : NaN; 
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  // const [answers, setAnswers] = useState<number[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data: QuizData = await getQuizById(id);
        setQuizData(data);
        setTimeLeft(data.duration * 60);
        setAnswers(new Array(data.questions.length).fill(""));
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu quiz:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const handleSubmitQuiz = useCallback(async () => {
    try {
      if (!quizData) return;
      const score = answers.reduce((total, userAnswer, index) => {
        const correctAnswer = quizData.questions[index].answer;
        return total + (userAnswer === correctAnswer ? 1 : 0);
      }, 0);

      const total = quizData.questions.length;
      const percentage = Math.round((score / total) * 100);
      const timeSpent = quizData.duration * 60 - timeLeft;
      const completedAt = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const token = localStorage.getItem("token"); // lấy từ localStorage sau login
      if (!token) {
        router.push("/auth/login"); // hoặc hiện thông báo
        return;
      }

      await submitQuizResult(
        {
          exam_id: quizData.id,
          score,
          total,
          percentage,
          time_spent: timeSpent,
          completed_at: completedAt,
        },
        token
      );

      // 💾 Lưu kết quả để hiển thị ở trang /results
      sessionStorage.setItem(
        "quizResults",
        JSON.stringify({
          quiz: quizData,
          results: {
            answers,
            score,
            total,
            timeSpent,
          },
        })
      );

      router.push(`/quiz/${params.id}/results`);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      // TODO: show toast hoặc thông báo lỗi
    }
  }, [answers, timeLeft, router, params.id, quizData]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted) return;
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, handleSubmitQuiz]);

  const handleAnswerSelect = (key: string) => {
    const updated = [...answers];
    updated[currentQuestion] = key; // lưu "A", "B", "C", hoặc "D"
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleJump = (idx: number) => {
    setCurrentQuestion(idx);
  };

  const answered = answers.filter((a) => a !== "" && a !== -1).length;
  const progress = (answered / (quizData?.questions.length || 1)) * 100;

  if (isLoading || !quizData) {
    return <DataLoading text="Đang tải dữ liệu bài kiểm tra..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {quizData.title}
              </h1>
              <p className="text-gray-600">
                Câu hỏi {currentQuestion + 1} / {quizData.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <QuizTimer timeLeft={timeLeft} />
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Nộp bài
              </button>
            </div>
          </div>
          <div className="mt-4">
            <QuizProgress
              current={answered}
              total={quizData.questions.length}
              percentage={progress}
            />
          </div>
        </div>

        {/* Question */}
        <QuestionCard
          question={quizData.questions[currentQuestion]}
          selectedAnswer={answers[currentQuestion]}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestion + 1}
        />

        {/* Nav */}
        <QuizNavigation
          currentQuestion={currentQuestion}
          totalQuestions={quizData.questions.length}
          answers={answers}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onQuestionJump={handleJump}
          onSubmit={() => setShowConfirmSubmit(true)}
        />

        {/* Confirm */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Nộp bài?</h3>
              <p className="mb-6">
                Đã trả lời {answered} / {quizData.questions.length}. Bạn có chắc chắn?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Tiếp tục
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Nộp bài ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!quizStarted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-lg mx-4">
              <h3 className="text-2xl font-bold mb-4">Hướng dẫn bài kiểm tra</h3>
              <div className="space-y-3 mb-6 text-gray-600">
                <p>• Bạn có {quizData.duration} phút</p>
                <p>• {quizData.questions.length} câu hỏi tổng cộng</p>
                <p>• Di chuyển tự do, tự động lưu câu trả lời</p>
                <p>• Nhấp nộp bài khi hoàn thành</p>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
                Bắt đầu bài kiểm tra ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
