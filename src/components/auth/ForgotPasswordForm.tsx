// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { API } from "@/api/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/forgot-password", { email });
      setMessage(res.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email của bạn"
        required
      />
      <button
        className="bg-amber-300 cursor-pointer rounded-2xl p-2"
        type="submit"
      >
        Gửi liên kết đặt lại mật khẩu
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
