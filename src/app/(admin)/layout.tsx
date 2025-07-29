"use client";

import "@/app/globals.css";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { ProgressBar } from "@lexz451/next-nprogress";
import ForbiddenPage from "@/app/(admin)/403";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <ForbiddenPage />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="px-4 py-2 overflow-auto bg-gray-50">
          <ProgressBar
            color="#155dfc"
            height="2px"
            options={{
              showSpinner: false,
            }}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
