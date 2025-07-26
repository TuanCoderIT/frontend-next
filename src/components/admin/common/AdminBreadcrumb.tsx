"use client";

import Link from "next/link";

interface AdminBreadcrumbProps {
  currentPage: string;
  parent?: {
    href: string;
    label: string;
  };
}

export default function AdminBreadcrumb({
  currentPage,
  parent,
}: AdminBreadcrumbProps) {
  return (
    <div className="p-2 mb-1 flex items-center text-sm">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/admin" className="text-gray-500 hover:text-blue-600">
              Dashboard
            </Link>
          </li>

          {parent && (
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href={parent.href}
                  className="text-gray-500 hover:text-blue-600"
                >
                  {parent.label}
                </Link>
              </div>
            </li>
          )}

          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-fuchsia-700">{currentPage}</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
}
