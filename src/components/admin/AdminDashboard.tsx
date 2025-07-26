"use client";

import { useState, useEffect } from "react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalQuizzes: number;
  activeQuizzes: number;
  totalStudyGroups: number;
  quizAttempts: number;
  avgScore: number;
  newUsersThisMonth: number;
}

interface RecentActivity {
  id: string;
  type: "user_joined" | "quiz_created" | "quiz_completed" | "group_created";
  message: string;
  timestamp: Date;
  user: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalQuizzes: 156,
    activeQuizzes: 134,
    totalStudyGroups: 43,
    quizAttempts: 3821,
    avgScore: 78.5,
    newUsersThisMonth: 89,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "user_joined",
      message: "New user Sarah Johnson joined the platform",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      user: "Sarah Johnson",
    },
    {
      id: "2",
      type: "quiz_created",
      message: 'Quiz "Advanced Mathematics" was created',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      user: "Dr. Smith",
    },
    {
      id: "3",
      type: "quiz_completed",
      message: 'Quiz "JavaScript Fundamentals" completed with 95% score',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      user: "Mike Chen",
    },
    {
      id: "4",
      type: "group_created",
      message: 'Study group "Physics Masters" was created',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      user: "Emma Wilson",
    },
  ]);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.newUsersThisMonth}`,
      changeType: "increase" as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-green-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%`,
      changeType: "percentage" as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      changeColor: "text-blue-600",
    },
    {
      title: "Total Quizzes",
      value: stats.totalQuizzes.toLocaleString(),
      change: `${stats.activeQuizzes} active`,
      changeType: "info" as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      changeColor: "text-gray-600",
    },
    {
      title: "Quiz Attempts",
      value: stats.quizAttempts.toLocaleString(),
      change: `${stats.avgScore}% avg`,
      changeType: "info" as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      changeColor: "text-gray-600",
    },
  ];

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_joined":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        );
      case "quiz_created":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        );
      case "quiz_completed":
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "group_created":
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {card.value}
                </p>
                <p className={`text-sm mt-2 ${card.changeColor}`}>
                  {card.change} {card.changeType === "increase" && "this month"}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <div className={card.iconColor}>{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        by {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <a
                  href="/admin/users"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Add New User
                </a>
                <a
                  href="/admin/quizzes"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Quiz
                </a>
                <a
                  href="/admin/groups"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Manage Groups
                </a>
                <a
                  href="/admin/analytics"
                  className="flex items-center p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Analytics
                </a>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                System Status
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-yellow-600">75% Used</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CDN</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
