import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAuthTokens } from "@/lib/cookies";
import { Calendar, Home, LayoutDashboard, User } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./Sidebar/LogoutButton";

const items = {
  events: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Atividades",
      url: "/events/scti",
      icon: Calendar,
    },
  ],
};

export async function SiteSidebar() {
  const { accessToken, refreshToken } = await getAuthTokens();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="hover:opacity-90 duration-200">
          <Image src="/SCT.svg" width={200} height={150} alt="SCT logo" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Geral</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Home />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {accessToken && refreshToken && (
            <SidebarGroup>
              <SidebarGroupLabel>Minha SCTI</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.events.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </div>

        {accessToken && refreshToken ? (
          <SidebarGroup>
            <SidebarGroupLabel>Configuração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/profile?view=infos">
                      <User />
                      <span>Perfil</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="border-accent">
                  <LogoutButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Login</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/login">
                      <User />
                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
