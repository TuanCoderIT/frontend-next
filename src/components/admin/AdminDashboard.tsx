"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Users,
  UserPlus,
  FileQuestion,
  UsersRound,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { getDashboardData, type DashboardData } from "@/api/admin";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error || "No data available"}</div>
        </div>
      </div>
    );
  }

  const { cards, charts, tables } = dashboardData;
  const safeCards: DashboardData["cards"] = {
    totalUsers: cards?.totalUsers ?? 0,
    newUsers7Days: cards?.newUsers7Days ?? 0,
    totalExams: cards?.totalExams ?? 0,
    totalGroups: cards?.totalGroups ?? 0,
    totalPosts: cards?.totalPosts ?? 0,
    totalTransactions: cards?.totalTransactions ?? 0,
  };
  const userPerDay = charts?.userPerDay ?? [];
  const revenuePerDay = charts?.revenuePerDay ?? [];
  const quizPerMonth = charts?.quizPerMonth ?? [];
  const latestTransactions = tables?.latestTransactions ?? [];

  // Prepare chart data
  const userPerDayData = {
    labels: userPerDay.map((item) =>
      format(new Date(item.date), "MMM dd")
    ),
    datasets: [
      {
        label: "Users",
        data: userPerDay.map((item) => item.total),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const revenuePerDayData = {
    labels: revenuePerDay.map((item) =>
      format(new Date(item.date), "MMM dd")
    ),
    datasets: [
      {
        label: "Revenue",
        data: revenuePerDay.map((item) => item.total),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
    ],
  };

  const quizPerMonthData = {
    labels: quizPerMonth.map((item) =>
      format(new Date(item.month + "-01"), "MMM yyyy")
    ),
    datasets: [
      {
        label: "Quizzes",
        data: quizPerMonth.map((item) => item.total),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const statCards = [
    {
      title: "Total Users",
      value: safeCards.totalUsers.toLocaleString(),
      change: `+${safeCards.newUsers7Days} new (7 days)`,
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-green-600",
    },
    {
      title: "New Users (7 Days)",
      value: safeCards.newUsers7Days.toLocaleString(),
      icon: UserPlus,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      changeColor: "text-gray-600",
    },
    {
      title: "Total Quizzes",
      value: safeCards.totalExams.toLocaleString(),
      icon: FileQuestion,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      changeColor: "text-gray-600",
    },
    {
      title: "Total Groups",
      value: safeCards.totalGroups.toLocaleString(),
      icon: UsersRound,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      changeColor: "text-gray-600",
    },
    {
      title: "Total Posts",
      value: safeCards.totalPosts.toLocaleString(),
      icon: MessageSquare,
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      changeColor: "text-gray-600",
    },
    {
      title: "Total Transactions",
      value: safeCards.totalTransactions.toLocaleString(),
      icon: DollarSign,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      changeColor: "text-gray-600",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid - 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                  {card.change && (
                    <p className={`text-sm mt-2 ${card.changeColor}`}>
                      {card.change}
                    </p>
                  )}
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid - 3 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Per Day - Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Users Per Day
          </h2>
          <div className="h-64">
            <Line data={userPerDayData} options={chartOptions} />
          </div>
        </div>

        {/* Revenue Per Day - Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Per Day
          </h2>
          <div className="h-64">
            <Bar data={revenuePerDayData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Quiz Per Month - Line Chart (Full Width) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quizzes Per Month
        </h2>
        <div className="h-64">
          <Line data={quizPerMonthData} options={chartOptions} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Latest Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {latestTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                tables.latestTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {transaction.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
