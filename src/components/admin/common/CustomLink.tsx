import Link from "next/link";
import { SquarePen, Eye, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

type CustomLinkProps = {
  href: string;
  type?: "view" | "edit" | "delete";
  title?: string;
  className?: string;
};

export default function CustomLink({
  href,
  type = "view",
  title,
  className,
}: CustomLinkProps) {
  const icon = {
    view: <Eye className="h-5 w-5" />,
    edit: <SquarePen className="h-5 w-5" />,
    delete: <Trash2 className="h-5 w-5" />,
  };

  const baseClass = {
    view: "text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100",
    edit: "text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100",
    delete: "text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100",
  };

  return (
    <Link
      href={href}
      title={title || type}
      className={cn(
        "p-1.5 rounded-md transition-colors",
        baseClass[type],
        className
      )}
    >
      {icon[type]}
    </Link>
  );
}
