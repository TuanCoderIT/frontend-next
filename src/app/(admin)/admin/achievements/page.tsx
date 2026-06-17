import AchievementList from "@/components/admin/achievements/AchievementList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements | Admin",
  description: "Manage achievements and badges",
};

export default function AchievementsPage() {
  return <AchievementList />;
}
