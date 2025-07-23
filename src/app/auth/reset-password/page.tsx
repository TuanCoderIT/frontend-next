import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
