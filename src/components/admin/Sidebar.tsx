"use client";

import { Award, BookOpenCheck, CopyCheck, House, Menu, File, Users, GraduationCap, SquareMenu, Bolt, ChartLine, Settings } from "lucide-react";
// import Link from "next/link";
import { Link } from "@lexz451/next-nprogress";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: (
        <House />
      ),
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: (
        <Users />
      ),
    },
    {
      title: "Quizzes",
      href: "/admin/quizzes",
      icon: (
        <BookOpenCheck />
      ),
    },
    {
      title: "Flashcards",
      href: "/admin/flashcards",
      icon: (
        <CopyCheck />
      ),
    },
    {
      title: "Documents",
      href: "/admin/documents",
      icon: (
        <File />
      ),
    },
    {
      title: "Courses",
      href: "/admin/courses",
      icon: (
        <GraduationCap />
      ),
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: (
        <SquareMenu />
      ),
    },
    {
      title: "Achievements",
      href: "/admin/achievements",
      icon: (
        <Award />
      ),
    },
    {
      title: "Study Groups",
      href: "/admin/groups",
      icon: (
        <Bolt />
      ),
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: (
        <ChartLine />
      ),
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: (
        <Settings />
      ),
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`${isCollapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-fuchsia-700">
                Admin Panel
              </h1>
              <p className="text-sm text-cyan-600">Quiz Platform</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${isActiveLink(item.href)
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              title={isCollapsed ? item.title : undefined}
            >
              <span
                className={`${isActiveLink(item.href) ? "text-blue-700" : "text-gray-400"
                  }`}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"
            }`}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
