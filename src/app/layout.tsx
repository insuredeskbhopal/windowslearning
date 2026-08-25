import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "windowslearning",
  description: "Learn. Connect. Grow. Next-generation Windows learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={insaniburger.variable}>
      <body>{children}</body>
    </html>
  );
}
