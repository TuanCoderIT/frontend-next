"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface CrumbMap {
  [key: string]: string; // path segment -> custom label
}

interface BreadcrumbsProps {
  lastItemLabel?: string; // dùng cho trang động, ví dụ quiz title
  className?: string;
  map?: CrumbMap; // ví dụ { quiz: "Quizzes" }
}

export default function Breadcrumbs({
  lastItemLabel,
  className,
  map = {
    quiz: "Quizzes",
    admin: "Admin",
    users: "Users",
  },
}: BreadcrumbsProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    return {
      label:
        isLast && lastItemLabel
          ? lastItemLabel
          : map[segment] || capitalize(segment),
      href: isLast ? undefined : href,
    };
  });

  return (
    <nav
      className={cn(
        "mb-8 flex items-center space-x-2 text-sm text-muted-foreground",
        className
      )}
      aria-label="breadcrumb"
    >
      <Link href="/" className="hover:text-blue-600 font-medium text-primary">
        Home
      </Link>
      {crumbs.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:underline text-primary font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
