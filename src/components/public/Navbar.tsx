"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">IntelliQuiz</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/quiz"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Quizzes
            </Link>
            <Link
              href="/groups"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Study Groups
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Hiển thị khi đã đăng nhập
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/quiz"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Quizzes
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Hiển thị khi chưa đăng nhập
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
