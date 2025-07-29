import { Category } from "@/types/public/category";
import Link from "next/link";

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: Category;
  difficulty: string;
  questions: number;
  duration: number;
  progress: number;
  color: string;
}

interface QuizCardProps {
  quiz: Quiz;
}

const colorClasses = {
  blue: "from-blue-400 to-blue-600",
  green: "from-green-400 to-green-600",
  purple: "from-purple-400 to-purple-600",
  orange: "from-orange-400 to-orange-600",
  red: "from-red-400 to-red-600",
  pink: "from-pink-400 to-pink-600",
};

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export default function QuizCard({ quiz }: QuizCardProps) {
  const isHexColor = quiz.color;
  const colorClass = colorClasses[quiz.color as keyof typeof colorClasses];
  const difficultyClass =
    difficultyColors[quiz.difficulty as keyof typeof difficultyColors];

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header with gradient */}
      <div
        className={`h-32 ${
          !isHexColor ? `bg-gradient-to-r ${colorClass}` : ""
        } relative`}
        style={
          isHexColor
            ? {
                background: `linear-gradient(90deg, ${quiz.color}, ${quiz.color}90)`,
              }
            : undefined
        }
      >
        {/* <div className={`h-32 bg-gradient-to-r ${colorClass} relative`}> */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyClass}`}
          >
            {quiz.difficulty}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-1">{quiz.title}</h3>
          <span className="text-sm opacity-90">{quiz.category.name}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {quiz.description}
        </p>

        {/* Quiz Info */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center">
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
            {quiz.questions} questions
          </div>
          <div className="flex items-center">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {quiz.duration} min
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{quiz.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${colorClass}`}
              style={{ width: `${quiz.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/quiz/${quiz.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            {quiz.progress > 0 ? "Continue" : "View Details"}
          </Link>
          <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
