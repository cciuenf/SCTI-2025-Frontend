import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SiteSidebar } from "@/components/SiteSidebar";
import { fontClass } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "SCTI - 2025",
  description: "Semana da Ciência e Tecnologia da Informação da UENF — palestras, minicursos, hackathon e inovação em Campos dos Goytacazes.",
  openGraph: {
    title: "SCTI - 2025",
    description: "Semana da Ciência e Tecnologia da Informação da UENF — palestras, minicursos, hackathon e inovação em Campos dos Goytacazes.",
    siteName: "SCTI",
    locale: "pt_BR"
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${fontClass} antialiased min-h-screen bg-background`}>
        <SidebarProvider defaultOpen={false}>
          <SiteSidebar />
          <SidebarTrigger className="fixed top-4 left-4 z-[60] shadow-md bg-white rounded-full" />
          <Toaster
            position="bottom-right"
            richColors
            theme="light"
            closeButton
            duration={5000}
          />
          <main className="overflow-x-hidden w-full">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
