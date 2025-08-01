"use client";

import React, { use, useState } from "react";
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

export default function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout } = useAuth();

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
          {/* Notification button */}
          <div className="relative">
            <button
              className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-6 w-6" />
              <span className="absolute right-0 top-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-30">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <div className="flex">
                        <div className="shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BellRing className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {item % 2 === 0
                              ? "New register user successful"
                              : "New comment in quiz"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item} hours ago
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <a
                  href="#"
                  className="block text-center text-sm text-blue-600 font-medium p-4 hover:bg-gray-50"
                >
                  See all notifications
                </a>
              </div>
            )}
          </div>

          {/* Messages button */}
          <button className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100">
            <MessageSquareMore className="h-6 w-6" />
          </button>

          {/* User profile */}
          <div className="relative inline-block">
            <button className="flex items-center space-x-3">
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
                    <Link href={'/admin/profile'} className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </Link>
                    <p className="text-xs text-gray-500">Quản trị viên</p>
                  </div>
                </>
              ) : ("")}
            </button>
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
          </div>
        </div>
      )}
    </header>
  );
}
