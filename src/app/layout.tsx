import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { fontClass } from "@/lib/fonts";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SiteSidebar } from "@/components/SiteSidebar";

export const metadata: Metadata = {
  title: "SCTI - 2025",
  description: "Front-end da plataforma a ser usado na SCTI-2025",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SidebarProvider defaultOpen={false} className="bg-transparent">
          <SiteSidebar />
          <main
            className={`${fontClass} antialiased min-h-screen bg-background w-full flex overflow-x-hidden`}
          >
            <SidebarTrigger/>
            <Toaster
              position="top-right"
              richColors
              theme="light"
              closeButton
              duration={5000}
            />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
