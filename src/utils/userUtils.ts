import { QuizHistoryItem } from "@/types/public/exams";
import { User, UserProfile } from "@/types/public/user";

export function calculateUserStats(user: User, results: QuizHistoryItem[]): UserProfile {
    const total_quizzes_completed = results.length;

    const total_accuracy = results.reduce((sum, item) => sum + item.percentage, 0);
    const average_accuracy =
        total_quizzes_completed > 0
            ? parseFloat((total_accuracy / total_quizzes_completed).toFixed(1))
            : 0;

    const total_learning_time = results.reduce((sum, item) => sum + item.time_spent, 0);

    return {
        ...user,
        total_quizzes_completed,
        average_accuracy,
        total_learning_time,
    };
}
