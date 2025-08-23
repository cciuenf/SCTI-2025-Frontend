"use client";

import { handleLogout } from "@/actions/auth-actions";
import { LogOut } from "lucide-react";
import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { getAuthTokens } from "@/lib/cookies";
import {useRouter} from "next/navigation";
import { runWithToast } from "@/lib/client/run-with-toast";

const LogoutButton = () => {
  const router = useRouter()
  const handleLogoutAction = async () => {
    const { accessToken, refreshToken } = await getAuthTokens();
    await runWithToast(
      handleLogout(),
      {
        loading: "Deslogando...",
        success: (res) => {
          if(res.success && !accessToken && !refreshToken) router.push("/");
          return "Usuário deslogado com sucesso!";
        },
        error: () => "Erro ao deslogar usuário!"
      }
    )
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
