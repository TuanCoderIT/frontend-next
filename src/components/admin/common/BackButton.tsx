"use client";

import { useRouter } from "next/navigation";
import { SquareChevronLeft } from "lucide-react";

type BackButtonProps = {
  label?: string;
};

export default function BackButton({ label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-sm cursor-pointer mb-2 border-s-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-3 py-1.5 rounded-md transition"
    >
      <SquareChevronLeft className="h-5 w-5 mr-2" />
      {label}
    </button>
  );
}
