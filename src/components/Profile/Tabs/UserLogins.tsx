"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserRefreshTokenJwtPayload } from "@/types/auth-interfaces";
import { Monitor, Smartphone, Power, Shield } from "lucide-react";
import {
  handleGetRefreshTokens,
  handleRevokeToken,
} from "@/actions/auth-actions";
import jwt from "jsonwebtoken";
import { runWithToast } from "@/lib/client/run-with-toast";
import { UAParser } from "ua-parser-js";
import { cn, isRefreshTokenExpired } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { clearAuthTokens } from "@/lib/cookies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

interface Props {
  refresh_token: string;
}
interface UserLoginI {
  token: string;
  payload: UserRefreshTokenJwtPayload | null;
}

const UserLogins = ({ refresh_token }: Props) => {
  const [userLogins, setUserLogins] = useState<UserLoginI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRevokeClick = async (login: UserLoginI) => {
    const res = await runWithToast(handleRevokeToken(login.token), {
      loading: "Revogando acesso...",
      success: () => "Acesso revogado!",
      error: () => "Erro ao revogar acesso!",
    });
    if (res.success && refresh_token === login.token) {
      await clearAuthTokens();
      router.push("/");
    } else if (res.success) getLogins(false);
  };

  const getLogins = useCallback(async (enableLoading: boolean = true) => {
    if(enableLoading) setIsLoading(true);
    try {
      const res = await handleGetRefreshTokens();
      const transformed: UserLoginI[] = (res.data || [])
        .map((i) => ({
          token: i.token_str,
          payload: jwt.decode(i.token_str) as UserRefreshTokenJwtPayload | null,
        }))
        .filter((r) => r.payload)
        .sort((a, b) => {
          const da = new Date(a.payload!.last_used).getTime();
          const db = new Date(b.payload!.last_used).getTime();
          return db - da;
        });

      transformed.sort((a, b) =>
        a.token === refresh_token ? -1 : b.token === refresh_token ? 1 : 0
      );
      setUserLogins(transformed);
    } finally {
      if(enableLoading) setIsLoading(false);
    }
  },[refresh_token]);

  useEffect(() => {
    getLogins();
  }, [refresh_token, getLogins]);

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center py-8">
        <LoadingSpinner
          size="xl"
          text="Carregando Logins..."
          spinnerClassName="border-secondary/50 border-t-transparent"
        />
      </div>
    );

  return (
    <section className="w-full h-screen max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 mt-6 overflow-y-auto scrollbar-unvisible pb-24">
       <header className="flex items-center justify-center gap-3 mb-6">
        <Shield className="h-15 w-15 p-2 bg-zinc-100 rounded-2xl text-zinc-700" />
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Histórico de Login</h2>
          <p className="text-sm text-zinc-600">Monitore os acessos à sua conta</p>
        </div>
      </header>

      <div className="flex flex-col gap-2 lg:gap-3">
        {userLogins?.map((r) => {
          const isCurrent = r.token === refresh_token;
          const expired = isRefreshTokenExpired(r.token);
          const when = new Date(r.payload!.last_used);

          return (
            <div
              key={r.token}
              className={cn(
                "w-full rounded-lg border bg-card shadow-sm",
                "p-2.5 sm:p-3.5 lg:p-5",
                "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                isCurrent ? "border-secondary" : "border-border"
              )}
            >
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                <DeviceIcon userAgent={r.payload!.user_agent} />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-medium truncate max-w-[180px] sm:max-w-[320px] lg:max-w-[520px] text-[13px] sm:text-sm lg:text-base">
                      {formatUserAgent(r)}
                    </h3>

                    {isCurrent && (
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 py-0 text-[10px] sm:text-[11px] lg:text-xs text-emerald-700"
                      >
                        Atual
                      </Badge>
                    )}
                    {!isCurrent && expired && (
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 py-0 text-[10px] sm:text-[11px] lg:text-xs"
                      >
                        Expirado
                      </Badge>
                    )}
                  </div>

                  <p className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground truncate">
                    {Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(when)}
                    {" • "}
                    IP: <span className="tabular-nums">{r.payload!.ip_address}</span>
                  </p>
                </div>
              </div>

              <div className="flex sm:block">
                <Button
                  aria-label="Revogar acesso deste dispositivo"
                  variant="destructive"
                  size="sm"
                  className={cn(
                    "w-full sm:w-auto gap-1.5 h-8 text-[12px]",
                    "lg:h-10 lg:text-sm lg:px-5"
                  )}
                  onClick={() => handleRevokeClick(r)}
                >
                  <Power className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  Revogar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

function DeviceIcon({ userAgent }: { userAgent: string }) {
  const parser = new UAParser(userAgent);
  const type = parser.getDevice().type;
  const Icon = type === "mobile" || type === "tablet" ? Smartphone : Monitor;

  return (
    <div
      className={cn(
        "grid place-items-center rounded-md border bg-background shrink-0",
        "p-1.5 sm:p-2 lg:p-2.5"
      )}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
    </div>
  );
}

function formatUserAgent(r: { payload: UserRefreshTokenJwtPayload | null }) {
  if (!r.payload) return "";
  const parser = new UAParser(r.payload.user_agent);
  const browser = parser.getBrowser().name ?? "Desconhecido";
  const os = parser.getOS().name ?? "Desconhecido";
  return `${browser} • ${os}`;
}

export default UserLogins;
