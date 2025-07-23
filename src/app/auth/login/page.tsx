import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Learning Library",
};

export default async function LoginPage() {
  return <LoginForm />;
}
