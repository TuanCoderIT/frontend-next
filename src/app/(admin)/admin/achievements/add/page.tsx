import AchievementForm from "@/components/admin/achievements/AchievementForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Achievement | Admin",
  description: "Create a new achievement or badge",
};

export default function AddAchievementPage() {
  return <AchievementForm />;
}
