"use client";

interface StatusBadgeProps {
  status: string;
  type?: "status" | "role" | "difficulty";
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  type = "status",
  size = "sm",
}: StatusBadgeProps) {
  const getColorClass = () => {
    const colorMaps = {
      status: {
        active: "bg-green-100 text-green-800 border-green-200",
        inactive: "bg-red-100 text-red-800 border-red-200",
        draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
        published: "bg-green-100 text-green-800 border-green-200",
        archived: "bg-gray-100 text-gray-800 border-gray-200",
      },
      role: {
        admin: "bg-red-100 text-red-800 border-red-200",
        teacher: "bg-blue-100 text-blue-800 border-blue-200",
        moderator: "bg-purple-100 text-purple-800 border-purple-200",
        user: "bg-amber-200 text-amber-900 border-amber-200",
      },
      difficulty: {
        Beginner: "bg-green-100 text-green-800 border-green-200",
        Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Advanced: "bg-red-100 text-red-800 border-red-200",
      },
    };

    return (
      colorMaps[type][status as keyof (typeof colorMaps)[typeof type]] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const sizeClass = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <span
      className={`inline-flex items-center ${sizeClass} font-medium rounded-full border 
                 ${getColorClass()}`}
    >
      {status}
    </span>
  );
}
