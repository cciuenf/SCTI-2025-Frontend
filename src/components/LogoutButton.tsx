"use client";

import { handleLogout } from "@/actions/auth-actions";
import { LogOut } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { SidebarMenuButton } from "./ui/sidebar";
import { clearAuthTokens, getAuthTokens } from "@/lib/cookies";
import {useRouter} from "next/navigation";

type Props = {};

const LogoutButton = (props: Props) => {
  const router = useRouter()
  const handleLogoutAction = async () => {
    const res = await handleLogout();
    await clearAuthTokens();
    const { accessToken, refreshToken } = await getAuthTokens();

    if (res.success && !accessToken && !refreshToken) {
      router.push("/");
      toast.success("Usuario deslogado com sucesso!");
      return;
    }
    toast.error("Erro ao deslogar usuário!");
    return;
  };

  return (
    <SidebarMenuButton
      className="text-accent border-accent cursor-pointer hover:text-secondary"
      asChild
    >
      <div onClick={handleLogoutAction}>
        <LogOut />
        <span>Logout</span>
      </div>
    </SidebarMenuButton>
  );
};

export default LogoutButton;
