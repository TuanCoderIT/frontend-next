"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  Menu,
  MessageSquareMore,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/common/NotificationBell";

export default function AdminHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout } = useAuth();
  
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm z-20">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {/* Left: Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Messages button */}
          <button className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100">
            <MessageSquareMore className="h-6 w-6" />
          </button>

          {/* User profile */}
          <div className="relative inline-block" ref={userDropdownRef}>
            <button 
              className="flex items-center space-x-3"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              {user ? (
                <>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </div>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </>
              ) : ("")}
            </button>

            {/* User dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-30">
                <div className="py-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await logout();
                      window.location.href = '/auth/login';
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200 py-2">
          <div className="px-4 space-y-1">
            <a
              href="/admin"
              className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/admin/users"
              className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Người dùng
            </a>
            <a
              href="/admin/courses"
              className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Khóa học
            </a>
            <a
              href="/admin/posts"
              className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Bài viết
            </a>
            <a
              href="/admin/settings"
              className="block py-2 px-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Cài đặt
            </a>
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={async () => {
                setShowMobileMenu(false);
                await logout();
                window.location.href = '/auth/login';
              }}
              className="flex items-center w-full py-2 px-3 text-base font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
