import { Achievement } from "@/types/public/user";
import { Trophy, Star, Award, Target, Clock, BookOpen } from "lucide-react";

interface AchievementsCardProps {
  achievements: Achievement[];
}

const getAchievementIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "quiz":
      return <BookOpen className="h-6 w-6" />;
    case "streak":
      return <Clock className="h-6 w-6" />;
    case "accuracy":
      return <Target className="h-6 w-6" />;
    case "milestone":
      return <Award className="h-6 w-6" />;
    default:
      return <Trophy className="h-6 w-6" />;
  }
};

const getAchievementColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "quiz":
      return "bg-blue-100 text-blue-600";
    case "streak":
      return "bg-green-100 text-green-600";
    case "accuracy":
      return "bg-purple-100 text-purple-600";
    case "milestone":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function AchievementsCard({ achievements }: AchievementsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (achievements.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-blue-600" />
          Achievements
        </h3>
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No achievements yet</p>
          <p className="text-sm text-gray-500">Complete quizzes and reach milestones to earn achievements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Trophy className="h-6 w-6 mr-2 text-blue-600" />
        Achievements ({achievements.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${getAchievementColor(achievement.category)}`}>
                {getAchievementIcon(achievement.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {achievement.name}
                </h4>
                <p className="text-gray-600 text-xs mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="h-3 w-3 mr-1" />
                  Earned on {formatDate(achievement.earned_at)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 