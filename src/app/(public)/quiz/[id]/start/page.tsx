"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import QuizTimer from "@/components/quiz/QuizTimer";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizNavigation from "@/components/quiz/QuizNavigation";

// Mock quiz full data with questions
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

export default function QuizStartPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quizData] = useState(mockQuizData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(mockQuizData.questions.length).fill(-1)
  );
  const [timeLeft, setTimeLeft] = useState(mockQuizData.duration * 60); // Convert to seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  // Fetch quiz full data with questions
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        // TODO: Fetch quiz full info from API
        // const response = await fetch(`/api/exams/${params.id}?with=questions`);
        // const data = await response.json();
        // setQuizData(data);

        console.log(`Fetching quiz full data for ID: ${params.id}`);
        // Simulate API call
        setTimeout(() => {
          setIsLoading(false);
          setQuizStarted(true);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [params.id]);

  const handleSubmitQuiz = useCallback(async () => {
    try {
      // Calculate results
      const results = {
        examId: params.id,
        answers: answers.map((answer, index) => ({
          questionId: quizData.questions[index].id,
          selectedAnswer: answer,
        })),
        timeSpent: quizData.duration * 60 - timeLeft,
        completedAt: new Date().toISOString(),
      };

      // TODO: Submit results to API
      // const response = await fetch(`/api/exams/${params.id}/submit`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(results)
      // });
      // const submissionResult = await response.json();

      console.log("Submitting quiz results:", results);

      // Calculate score for results page
      const score = answers.reduce((total, answer, index) => {
        return (
          total + (answer === quizData.questions[index].correctAnswer ? 1 : 0)
        );
      }, 0);

      // Store results in sessionStorage for the results page
      sessionStorage.setItem(
        "quizResults",
        JSON.stringify({
          quiz: quizData,
          results: {
            answers,
            score,
            total: quizData.questions.length,
            timeSpent: quizData.duration * 60 - timeLeft,
          },
        })
      );

      router.push(`/quiz/${params.id}/results`);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      // Handle error - show toast or error message
    }
  }, [answers, timeLeft, router, params.id, quizData]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted) return;

    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmitQuiz, quizStarted]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
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
    (answeredQuestions / quizData.questions.length) * 100;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
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
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Submit Quiz
              </button>
            </div>
          </div>
          <div className="mt-4">
            <QuizProgress
              current={answeredQuestions}
              total={quizData.questions.length}
              percentage={progressPercentage}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <QuestionCard
            question={quizData.questions[currentQuestion]}
            selectedAnswer={answers[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentQuestion + 1}
          />
        </div>

        {/* Navigation */}
        <QuizNavigation
          currentQuestion={currentQuestion}
          totalQuestions={quizData.questions.length}
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
                {quizData.questions.length} questions. Are you sure you want to
                submit your quiz?
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

        {/* Quiz Instructions (shown on first load) */}
        {!quizStarted && !isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-lg mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quiz Instructions
              </h3>
              <div className="space-y-3 text-gray-600 mb-6">
                <p>
                  • You have {quizData.duration} minutes to complete this quiz
                </p>
                <p>
                  • There are {quizData.questions.length} questions in total
                </p>
                <p>• You can navigate between questions freely</p>
                <p>• Your answers are saved automatically</p>
                <p>
                  • Click &quot;Submit Quiz&quot; when you&apos;re ready to
                  finish
                </p>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
