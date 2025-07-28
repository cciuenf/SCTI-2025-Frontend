"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { MailCheckIcon, LogOut, PenIcon, Loader2 } from "lucide-react";
import VerifyForm from "../VerifyForm";
import ChangeNameModalForm from "./ChangeNameModalForm";

import { format } from "date-fns";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { clearAuthTokens, getAuthTokens } from "@/lib/cookies";
import { handleLogout } from "@/actions/auth-actions";
import jwt from "jsonwebtoken";
import {
  UserAccessTokenJwtPayload,
  UserRefreshTokenJwtPayload,
} from "@/types/auth-interfaces";

type Props = {};

const UserDataView = (props: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tokensDataTemplate = {
    access: {
      name: "",
      last_name: "",
      email: "",
      is_verified: false,
      is_event_creator: false,
      is_super: false,
      exp: "",
    },
    refresh: {
      id: "string",
      user_agent: "string",
      ip_address: "string",
      last_used: "",
      exp: "",
    },
  };

  const [tokensData, setTokensData] = useState<{
    access: UserAccessTokenJwtPayload;
    refresh: UserRefreshTokenJwtPayload;
  }>(tokensDataTemplate);

  const handleTokens = async () => {
    setIsLoading(true);
    const { accessToken, refreshToken } = await getAuthTokens();
    const accessData = jwt.decode(
      accessToken as string
    ) as UserAccessTokenJwtPayload | null;
    const refreshData = jwt.decode(
      refreshToken as string
    ) as UserRefreshTokenJwtPayload | null;

    if (accessData && refreshData) {
      const data = {
        access: accessData,
        refresh: refreshData,
      };

      setTokensData(data);
    }
    setTimeout(() => setIsLoading(false), 100);
  };

  useEffect(() => {
    console.log("entrei no effect");
    handleTokens();
  }, []);

  if (!tokensData) {
    router.push("/");
    toast.error("Usuário não logado!");
    return;
  }

  const handleLogoutSubmit = async () => {
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
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="color-accent animate-spin w-10 h-10 " />
        </div>
      ) : (
        <div className="w-full flex justify-between items-start">
          <div className="w-1/3 flex flex-col gap-3 items-start justify-between">
            <h2 className="text-2xl font-bold">
              <span className="font-normal">
                Nome:{" "}
                {`${tokensData.access?.name}  ${tokensData.access?.last_name}`}
              </span>
            </h2>
            <h2 className="text-2xl">
              <span className="font-normal">
                E-mail: {tokensData.access?.email}
              </span>
            </h2>
            {!tokensData.access?.is_verified && (
              <Dialog>
                <Button variant={"profile"} className="w-1/2" asChild>
                  <DialogTrigger>
                    <MailCheckIcon />
                    <p>Verificar conta</p>
                  </DialogTrigger>
                </Button>
                <DialogContent>
                  <DialogTitle></DialogTitle>
                  <VerifyForm setIsLoading={setIsLoading} origin="profile" />
                </DialogContent>
              </Dialog>
            )}
            <ChangeNameModalForm
              name={tokensData.access.name}
              last_name={tokensData.access.last_name}
            />
          </div>
          <div className="w-1/3 flex flex-col gap-3 items-end">
            <div className="flex flex-col gap-2 items-start justify-around">
              <h2 className="text-2xl">Informações de Login</h2>
              <h3 className="text-md">{tokensData.refresh?.user_agent}</h3>
              <h3 className="text-md">
                {tokensData.refresh?.last_used === ""
                  ? " "
                  : `${format(
                      tokensData.refresh?.last_used,
                      "dd/MM/yyyy HH:mm"
                    )} • IP: ${tokensData.refresh?.ip_address}`}
              </h3>
            </div>
            <Button
              variant={"profile"}
              className="w-1/2"
              type="submit"
              onClick={() => handleLogoutSubmit()}
            >
              <LogOut />
              <p>Encerrar sessão</p>
            </Button>
            <Button variant={"edit"} className="w-4/5">
              <PenIcon />
              <p>Alterar Senha</p>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDataView;
