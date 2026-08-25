import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const insaniburger = localFont({
  src: [
    {
      path: "../fonts/Insanibu.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Insanibc.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-insaniburger",
  display: "swap",
});

export const metadata: Metadata = {
  title: "windowslearning — Learn Any Skill with Personal Mentors",
  description: "Learn cooking, tailoring, maths, biology, spoken English, and computers 1-on-1 with friendly real-world mentors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={insaniburger.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
