// import type { Metadata } from "next";
// import { Be_Vietnam_Pro } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from "@/context/AuthContext";
// import { Toaster } from "react-hot-toast";

// const beVietnamPro = Be_Vietnam_Pro({
//   variable: "--font-be-vietnam-pro",
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });

// export const metadata: Metadata = {
//   title: "IntelliQuiz",
//   description: "An intelligent quiz platform",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       {/* <body className={`${beVietnamPro.variable} antialiased`}> */}
//       <body className={`${beVietnamPro.className} antialiased`}>
//         <AuthProvider>
//           {children}
//           <Toaster />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
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
