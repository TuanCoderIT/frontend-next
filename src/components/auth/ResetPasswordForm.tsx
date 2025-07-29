"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { axiosAPI } from "@/api/axios";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = params.get("token");
  const email = params.get("email");

  useEffect(() => {
    if (!token || !email) {
      setError("Liên kết không hợp lệ hoặc thiếu thông tin.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      const res = await axiosAPI.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirm,
      });
      setMessage(res.data.message);
      setError("");
    } catch (error: any) {
      setMessage("");
      setError(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <h2>Đặt lại mật khẩu</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
      <div className="mt-4">
        <p>
          Quay lại trang đăng nhập? <a href="/auth/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}
