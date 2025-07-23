// app/dashboard/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  if (!user) return <div>Đang tải...</div>;

  return (
    <div>
      <h1>Xin chào, {user.name}</h1>
      <p>Vai trò: {user.role}</p>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
