"use client";
import { useState, useEffect } from "react";
import type { UserRefreshTokenJwtPayload } from "@/types/auth-interfaces";
import { Monitor, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import {
  handleGetRefreshTokens,
  handleRevokeToken,
} from "@/actions/auth-actions";
import jwt from "jsonwebtoken";
import UserLoginsSkeleton from "./UserLoginsSkeleton";
import { runWithToast } from "@/lib/client/run-with-toast";
import { UAParser } from "ua-parser-js";
import { cn, isRefreshTokenExpired } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { clearAuthTokens } from "@/lib/cookies";
import { Badge } from "../ui/badge";

interface Props {
  refresh_token: string;
}

interface UserLoginI { 
  token: string; 
  payload: UserRefreshTokenJwtPayload | null 
}

const UserLogins = ({ refresh_token }: Props) => {
  const [userLogins, setUserLogins] = useState<
    UserLoginI[] | undefined
  >();
  const [lastDeleted, setLastDeleted] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRevokeClick = async (login: UserLoginI) => {
    const res = await runWithToast(
      handleRevokeToken(login.token), {
        loading: "Revogando acesso...",
        success: () => "Acesso revogado!",
        error: () => "Erro ao revogar acesso!",
      }
    );
    if(res.success && refresh_token === login.token) {
      await clearAuthTokens();
      router.push("/");
    } else setLastDeleted(login.token);
  };

  useEffect(() => {
    setIsLoading(true);
    const getLogins = async () => {
      const res = await handleGetRefreshTokens();

      const transformedData = (res.data || [])
        .map((i) => {
          const payload = jwt.decode(i.token_str) as UserRefreshTokenJwtPayload | null;
          return { token: i.token_str, payload };
        })
        .filter((r) => r.payload)
        .sort((a, b) => {
          const da = new Date(a.payload!.last_used).getTime();
          const db = new Date(b.payload!.last_used).getTime();
          return db - da;
        });

      transformedData.sort((a, b) =>
        a.token === refresh_token ? -1 : b.token === refresh_token ? 1 : 0
      );
      

      setUserLogins(transformedData);
    };

    getLogins();
    setIsLoading(false);
  }, [lastDeleted, refresh_token]);

  if (isLoading) return <UserLoginsSkeleton />;

  return (
    <div className="w-full flex flex-col justify-around items-center gap-2">
      {userLogins &&
        userLogins.map((r) => {
          const is_current = r.token === refresh_token;
          return (
            <div
              className={cn(
                "w-9/10 sm:w-4/5 min-h-[100px] py-2 px-5 flex",
                "justify-between items-center border-2 border-primary rounded-md gap-5 sm:gap-10",
                is_current && "border-secondary"
              )}
              key={r?.token}
            >
              <div className="flex justify-between items-center gap-2 sm:gap-10">
                <DeviceIcon userAgent={r.payload!.user_agent} />
                <div className="flex flex-col justify-around items-start">
                  <h2 className="text-base sm:text-xl lg:text-2xl">
                    {formatUserAgent(r)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(r.payload!.last_used).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} • IP: {r.payload!.ip_address}
                  </p>
                </div>
                {is_current && <Badge className="text-green-800">Atual</Badge>}
                {!is_current && isRefreshTokenExpired(r.token) && <Badge className="text-slate-600">Expirado</Badge>}
              </div>
              <Button
                variant={"destructive"}
                className="border-1 border-zinc-900 rounded-sm text-xs sm:text-base px-2 py-1 sm:px-4 sm:py-2"
                onClick={() => handleRevokeClick(r)}
              >
                Revogar
              </Button>
            </div>
          )
        })}
    </div>
  );
};

function DeviceIcon({ userAgent }: { userAgent: string }) {
  const parser = new UAParser(userAgent);
  const type = parser.getDevice().type;

  return (
    <div className="flex flex-col items-center justify-center rounded-full border-2 border-secondary p-3 shadow-2xs">
      {type === "mobile" || type === "tablet" ? (
        <Smartphone className="w-4 h-4 sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
      ) : (
        <Monitor className="w-4 h-4 sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
      )}
    </div>
  );
}

function formatUserAgent(r: { payload: UserRefreshTokenJwtPayload | null }) {
  if (!r.payload) return "";

  const parser = new UAParser(r.payload.user_agent);
  const browser = parser.getBrowser().name ?? "Desconhecido";
  const os = parser.getOS().name ?? "Desconhecido";

  return `${browser} - ${os}`;
}

export default UserLogins;
