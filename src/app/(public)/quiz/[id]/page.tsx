"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import QuizTimer from "@/components/quiz/QuizTimer";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizNavigation from "@/components/quiz/QuizNavigation";

// Mock quiz data
const mockQuizData = {
  id: 1,
  title: "JavaScript Fundamentals",
  duration: 30, // minutes
  questions: [
    {
      id: 1,
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        "var myVariable = 'value';",
        "variable myVariable = 'value';",
        "v myVariable = 'value';",
        "declare myVariable = 'value';",
      ],
      correctAnswer: 0,
      explanation:
        "The 'var' keyword is one of the correct ways to declare variables in JavaScript, along with 'let' and 'const'.",
    },
    {
      id: 2,
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Integer", "Undefined"],
      correctAnswer: 2,
      explanation:
        "JavaScript doesn't have a specific 'Integer' data type. Numbers in JavaScript are all floating-point.",
    },
    {
      id: 3,
      question: "What does the '===' operator do in JavaScript?",
      options: [
        "Assigns a value",
        "Compares values only",
        "Compares values and types",
        "Performs addition",
      ],
      correctAnswer: 2,
      explanation:
        "The '===' operator performs strict equality comparison, checking both value and type.",
    },
    {
      id: 4,
      question: "How do you create a function in JavaScript?",
      options: [
        "function myFunction() {}",
        "create myFunction() {}",
        "def myFunction() {}",
        "func myFunction() {}",
      ],
      correctAnswer: 0,
      explanation:
        "Functions in JavaScript are declared using the 'function' keyword.",
    },
    {
      id: 5,
      question: "What is the result of '3' + 2 in JavaScript?",
      options: ["5", "'32'", "Error", "NaN"],
      correctAnswer: 1,
      explanation:
        "JavaScript performs string concatenation when one operand is a string, resulting in '32'.",
    },
  ],
};

export default function QuizTakingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(mockQuizData.questions.length).fill(-1)
  );
  const [timeLeft, setTimeLeft] = useState(mockQuizData.duration * 60); // Convert to seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const handleSubmitQuiz = useCallback(() => {
    // Calculate results
    const results = {
      answers,
      score: answers.reduce((score, answer, index) => {
        return (
          score +
          (answer === mockQuizData.questions[index].correctAnswer ? 1 : 0)
        );
      }, 0),
      total: mockQuizData.questions.length,
      timeSpent: mockQuizData.duration * 60 - timeLeft,
    };

    // Store results in sessionStorage for the results page
    sessionStorage.setItem(
      "quizResults",
      JSON.stringify({
        quiz: mockQuizData,
        results,
      })
    );

    router.push(`/quiz/${params.id}/results`);
  }, [answers, timeLeft, router, params.id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmitQuiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionJump = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  const answeredQuestions = answers.filter((answer) => answer !== -1).length;
  const progressPercentage =
    (answeredQuestions / mockQuizData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {mockQuizData.title}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of{" "}
                {mockQuizData.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <QuizTimer timeLeft={timeLeft} />
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Submit Quiz
              </button>
            </div>
          </div>
          <div className="mt-4">
            <QuizProgress
              current={answeredQuestions}
              total={mockQuizData.questions.length}
              percentage={progressPercentage}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <QuestionCard
            question={mockQuizData.questions[currentQuestion]}
            selectedAnswer={answers[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentQuestion + 1}
          />
        </div>

        {/* Navigation */}
        <QuizNavigation
          currentQuestion={currentQuestion}
          totalQuestions={mockQuizData.questions.length}
          answers={answers}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onQuestionJump={handleQuestionJump}
          onSubmit={() => setShowConfirmSubmit(true)}
        />

        {/* Submit Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Submit Quiz?
              </h3>
              <p className="text-gray-600 mb-6">
                You have answered {answeredQuestions} out of{" "}
                {mockQuizData.questions.length} questions. Are you sure you want
                to submit your quiz?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Quiz
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
