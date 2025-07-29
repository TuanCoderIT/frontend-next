"use client";

import { createQuiz } from "@/api/quiz";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import PageHeader from "@/components/admin/common/PageHeader";
import QuizForm from "@/components/admin/quizzes/QuizForm";
import { ArrowLeft, BookCheck } from "lucide-react";
import error from "next/error";

export default function AddQuizPage() {
  return (
    <div className="space-y-6 mx-4">
      <AdminBreadcrumb
        currentPage="Add New Quiz"
        parent={{ href: "/admin/quizzes", label: "Quizzes" }}
      />
      <PageHeader
        title="Add New Quiz"
        icon={<BookCheck />}
        actionLabel="Back to Quizzes"
        actionHref="/admin/quizzes"
        actionIcon={<ArrowLeft />}
        bgGradient="from-green-50 to-emerald-50"
        buttonGradient="from-green-500 to-emerald-600"
      />
      <QuizForm
        mode="add"
        errors={error}
        onSubmit={async (data) => {
          await createQuiz(data);
        }}
      />
    </div>
  );
}
