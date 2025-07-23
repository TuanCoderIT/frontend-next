import RegisterForm from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Learning Library",
};

export default async function RegisterPage() {
  return <RegisterForm />;
}
