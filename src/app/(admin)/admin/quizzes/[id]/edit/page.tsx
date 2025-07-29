"use client";

import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import PageHeader from "@/components/admin/common/PageHeader";
import { ArrowLeft, BookCheck } from "lucide-react";
import QuizForm from "@/components/admin/quizzes/QuizForm";
import { getQuizById, updateQuiz } from "@/api/quiz";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading, { PageLoading } from "@/components/common/LoadingScreen";

export default function EditQuizPage() {
  const { id } = useParams(); // Next.js trả về chuỗi
  const [existingQuizData, setExistingQuizData] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(Number(id)); // convert id sang number
        setExistingQuizData(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  if (!existingQuizData)
    return <PageLoading text="Loading Quiz Information..." />;

  return (
    <div className="space-y-6 mx-4">
      <AdminBreadcrumb
        currentPage="Edit Quiz"
        parent={{ href: "/admin/quizzes", label: "Quizzes" }}
      />
      <PageHeader
        title="Edit Quiz"
        icon={<BookCheck />}
        actionLabel="Back to Quizzes"
        actionHref="/admin/quizzes"
        actionIcon={<ArrowLeft />}
        bgGradient="from-green-50 to-emerald-50"
        buttonGradient="from-green-500 to-emerald-600"
      />
      <QuizForm
        mode="edit"
        initialData={existingQuizData}
        errors={error}
        onSubmit={async (data) => {
          try {
            await updateQuiz(Number(id), data);
          } catch (err: any) {
            setError(err?.response?.data?.errors || {});
          }
        }}
      />
    </div>
  );
}
