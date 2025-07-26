import Link from "next/link";
import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  icon: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: ReactNode;
  bgGradient?: string;
  buttonGradient?: string;
};

export default function PageHeader({
  title,
  icon,
  actionLabel,
  actionHref,
  actionIcon,
  bgGradient = "from-blue-50 to-indigo-50",
  buttonGradient = "from-blue-500 to-indigo-600",
}: PageHeaderProps) {
  return (
    <div
      className={`bg-gradient-to-r ${bgGradient} p-5 rounded-xl shadow-sm mb-4`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`p-2 bg-gradient-to-r ${buttonGradient} rounded-lg shadow-sm`}
            >
              <div className="h-6 w-6 text-white">{icon}</div>
            </div>
            <h1 className="text-2xl ml-2 font-semibold text-gray-800">
              {title}
            </h1>
          </div>
        </div>

        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r ${buttonGradient} text-white font-medium rounded-lg shadow-md hover:brightness-110 transform transition hover:-translate-y-0.5 hover:shadow-lg`}
          >
            {actionIcon}
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
