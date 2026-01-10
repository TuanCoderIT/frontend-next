import { TrendingUp, Target, Clock, BookOpen } from "lucide-react";

interface ProgressChartProps {
  totalQuizzes: number;
  averageAccuracy: number;
  totalLearningTime: number;
  currentLevel: string;
  targetQuizzes?: number;
  targetAccuracy?: number;
  targetTime?: number;
}

export default function ProgressChart({
  totalQuizzes,
  averageAccuracy,
  totalLearningTime,
  currentLevel,
  targetQuizzes = 100,
  targetAccuracy = 90,
  targetTime = 1000, // in minutes
}: ProgressChartProps) {
  const quizProgress = Math.min((totalQuizzes / targetQuizzes) * 100, 100);
  const accuracyProgress = Math.min((averageAccuracy / targetAccuracy) * 100, 100);
  const timeProgress = Math.min((totalLearningTime / targetTime) * 100, 100);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-green-600 bg-green-100";
      case "Intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "Advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
        Learning Progress
      </h3>

      <div className="space-y-6">
        {/* Current Level */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Current Level</h4>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getLevelColor(currentLevel)}`}>
            {currentLevel}
          </span>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {/* Quiz Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Quizzes Completed</span>
              </div>
              <span className="text-sm text-gray-600">
                {totalQuizzes} / {targetQuizzes}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${quizProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {quizProgress.toFixed(1)}% of target reached
            </div>
          </div>

          {/* Accuracy Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Average Accuracy</span>
              </div>
              <span className="text-sm text-gray-600">
                {averageAccuracy}% / {targetAccuracy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${accuracyProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {accuracyProgress.toFixed(1)}% of target reached
            </div>
          </div>

          {/* Time Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Learning Time</span>
              </div>
              <span className="text-sm text-gray-600">
                {formatTime(totalLearningTime)} / {formatTime(targetTime)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${timeProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {timeProgress.toFixed(1)}% of target reached
            </div>
          </div>
        </div>

        {/* Next Level Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Next Level Requirements</h4>
          <div className="space-y-2 text-sm">
            {currentLevel === "Beginner" && (
              <>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Complete 25 quizzes
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Achieve 70% average accuracy
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Spend 10 hours learning
                </div>
              </>
            )}
            {currentLevel === "Intermediate" && (
              <>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Complete 75 quizzes
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Achieve 85% average accuracy
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Spend 25 hours learning
                </div>
              </>
            )}
            {currentLevel === "Advanced" && (
              <div className="text-center text-gray-600">
                🎉 Congratulations! You've reached the highest level!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 