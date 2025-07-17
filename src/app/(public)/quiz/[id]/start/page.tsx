"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizData, RawQuestion } from "@/lib/types/question";
import QuizTimer from "@/components/quiz/QuizTimer";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizNavigation from "@/components/quiz/QuizNavigation";
import { getQuizById } from "@/lib/api";

export default function QuizStartPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        const raw = await getQuizById(Number(id));

        // Normalize backend -> frontend shape
        const normalized: QuizData = {
          id: raw.id,
          title: raw.title,
          duration: raw.duration,
          questions: (raw.questions as RawQuestion[]).map((q) => ({
            id: q.id,
            question: q.content,
            options: Object.values(q.options),
            correctAnswer: Object.keys(q.options).indexOf(q.answer),
            explanation: q.explanation || "",
          })),
        };

        setQuizData(normalized);
        setTimeLeft(normalized.duration * 60);
        setAnswers(new Array(normalized.questions.length).fill(-1));
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const handleSubmitQuiz = useCallback(() => {
    if (!quizData) return;

    const results = {
      examId: quizData.id,
      answers: answers.map((answer, idx) => ({
        questionId: quizData.questions[idx].id,
        selectedAnswer: answer,
      })),
      timeSpent: quizData.duration * 60 - timeLeft,
      completedAt: new Date().toISOString(),
    };

    console.log("Submitting:", results);

    // TODO: POST to backend if needed

    console.log("Answers:", answers);
    console.log(
      "Correct answers:",
      quizData.questions.map((q) => q.correctAnswer)
    );

    sessionStorage.setItem(
      "quizResults",
      JSON.stringify({
        quiz: quizData,
        results: {
          answers,
          score: answers.reduce(
            (total, ans, idx) =>
              total + (ans === quizData.questions[idx].correctAnswer ? 1 : 0),
            0
          ),
          total: quizData.questions.length,
          timeSpent: quizData.duration * 60 - timeLeft,
        },
      })
    );

    router.push(`/quiz/${quizData.id}/results`);
  }, [quizData, answers, timeLeft, router]);

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

  const handleAnswerSelect = (answerIndex: number) => {
    const updated = [...answers];
    updated[currentQuestion] = answerIndex;
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

  const answered = answers.filter((a) => a !== -1).length;
  const progress = (answered / (quizData?.questions.length || 1)) * 100;

  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading quiz...</div>
      </div>
    );
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
                Question {currentQuestion + 1} of {quizData.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <QuizTimer timeLeft={timeLeft} />
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Submit Quiz
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
              <h3 className="text-xl font-bold mb-4">Submit Quiz?</h3>
              <p className="mb-6">
                Answered {answered} of {quizData.questions.length}. Are you
                sure?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Continue
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!quizStarted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-lg mx-4">
              <h3 className="text-2xl font-bold mb-4">Quiz Instructions</h3>
              <div className="space-y-3 mb-6 text-gray-600">
                <p>• You have {quizData.duration} minutes</p>
                <p>• {quizData.questions.length} questions total</p>
                <p>• Navigate freely, autosave answers</p>
                <p>• Click Submit when done</p>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
                Start Quiz Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
