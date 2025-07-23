import ForgotPasswordPage from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default async function LoginPage() {
  return <ForgotPasswordPage />;
}
