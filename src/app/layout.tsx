import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RealtimeProvider } from "@/context/RealtimeContext";
import { GlobalAIChatProvider } from "@/context/GlobalAIChatContext";
import GlobalAIChatWrapper from "@/components/chat/GlobalAIChatWrapper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "IntelliQuiz",
  description: "An intelligent quiz platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <RealtimeProvider>
            <GlobalAIChatProvider>
              {children}
              <GlobalAIChatWrapper />
              <Toaster />
            </GlobalAIChatProvider>
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
