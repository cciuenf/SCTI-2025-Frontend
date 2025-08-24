import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAuthTokens, getUserInfo, isEventCreator } from "@/lib/cookies";
import { Calendar, Home, LayoutDashboard, User, FolderDot } from "lucide-react";

import Link from "next/link";
import LogoutButton from "./Sidebar/LogoutButton";

const items = {
  events: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      only_admin: false,
    },
    {
      title: "Gerenciamento",
      url: "/events",
      icon: FolderDot,
      only_admin: true,
    },
    {
      title: "Evento",
      url: "/events/scti",
      icon: Calendar,
      only_admin: false,
    },
  ],
};

export async function SiteSidebar() {
  const { accessToken, refreshToken } = await getAuthTokens();
  const is_creator = await isEventCreator();
  const user = await getUserInfo();

  return (
    <Sidebar>
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
                  {items.events.map((item) => ((item.only_admin && is_creator) || !item.only_admin) && (
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
                      <span className="truncate">{user?.name} {user?.last_name}</span>
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
