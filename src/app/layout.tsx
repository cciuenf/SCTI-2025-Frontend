import type { Metadata } from "next";
import { fontClass } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCTI - 2025",
  description: "Front-end da plataforma a ser usado na SCTI-2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontClass} antialiased min-h-screen bg-background`}>
        {children}
      </body>
    </html>
  );
}
