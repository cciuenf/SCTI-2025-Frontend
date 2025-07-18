import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { fontClass } from "@/lib/fonts";
import "./globals.css";
import Header from "@/components/Header";

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
        <Header/>
        <Toaster position="top-right" richColors theme="light" closeButton duration={5000}/>
        {children}
      </body>
    </html>
  );
}
