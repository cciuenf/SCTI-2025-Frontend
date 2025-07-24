"use client";
import React from "react";
import { Button } from "../ui/button";
import { MailCheckIcon, LogOut, PenIcon } from "lucide-react";

import ProductListSection from "../Products/ProductListSection";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import { handleLogout } from "@/actions/auth-actions";
import {
  UserAccessTokenJwtPayload,
  UserRefreshTokenJwtPayload,
} from "@/types/auth-interfaces";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { clearAuthTokens, getAuthTokens } from "@/lib/cookies";
import UserPurchases from "../UserPurchases";
import VerifyForm from "../VerifyForm";
import ChangeNameModalForm from "./ChangeNameModalForm";
import UserDataView from "./UserDataView";

type Props = {
  currentView: string;
  user_access_info: UserAccessTokenJwtPayload | null;
  user_refresh_info: UserRefreshTokenJwtPayload | null;
  deviceInfos:
     { os: string | undefined; browser: string | undefined }
    | { os:  undefined; browser: undefined }
};

const ProfileInfos = ({
  currentView,
  user_access_info,
  user_refresh_info,
  deviceInfos
}: Props) => {
  const [mustShowVerify, setMustShowVerify] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessTokenData, setAccessTokenData] = useState<UserAccessTokenJwtPayload | null>()

  const router = useRouter();


  if (user_access_info && !accessTokenData) {
    setAccessTokenData(user_access_info)
    return;
  }

  if (!user_access_info || !accessTokenData) {
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
    <div className="w-4/5 flex flex-col items-center justify-around gap-3 mx-auto">
      {(currentView == "infos" || currentView == undefined) && (
        <>
          <h2 className="text-4xl">Informações do Usuário</h2>
          <p className="font-normal">
            Gerencie aqui as informações do seu perfil!
          </p>
          <div className="w-full flex justify-between items-start">
            <div className="w-1/3 flex flex-col gap-3 items-start justify-between">
              <h2 className="text-2xl font-bold">
                <span className="font-normal">
                  Nome:{" "}
                  {`${accessTokenData.name}  ${accessTokenData.last_name}`}
                </span>
              </h2>
              <h2 className="text-2xl">
                <span className="font-normal">
                  E-mail: {accessTokenData.email}
                </span>
              </h2>
              {!accessTokenData.is_verified && (
                <Dialog>
                  <Button variant={"profile"} className="w-1/2" asChild>
                    <DialogTrigger>
                      <MailCheckIcon />
                      <p>Verificar conta</p>
                    </DialogTrigger>
                  </Button>
                  <DialogContent>
                    <DialogTitle></DialogTitle>
                    <VerifyForm
                      setMustShowVerify={setMustShowVerify}
                      setIsLoading={setIsLoading}
                      origin="profile"
                    />
                  </DialogContent>
                </Dialog>
              )}
              <ChangeNameModalForm
                accessData={accessTokenData}
                setAccessData={setAccessTokenData}
              />
            </div>
            <div className="w-1/3 flex flex-col gap-3 items-end">
              <div className="flex flex-col gap-2 items-end justify-around">
                <h2 className="text-2xl">Informações de Login</h2>
                <h3 className="text-md">{`${deviceInfos.os},${deviceInfos.browser}`}</h3>
                <h3 className="text-md">{`${format(
                  user_refresh_info!.last_used,
                  "dd/MM/yyyy HH:mm"
                )} • IP: ${user_refresh_info?.ip_address}`}</h3>
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
        </>
        // <UserDataView/>
      )}
      {currentView == "products" && (
        <>
          <h2 className="text-4xl">Meus Produtos</h2>
          <p className="text-md font-light">Visualize todos os seus produtos</p>
          <ProductListSection
            isSuperUser={accessTokenData.is_super}
            currentEvent={{ id: "123", slug: "juanevento123" }}
          />
        </>
      )}

      {currentView == "shopping" && (
        <>
          <h2 className="text-4xl">Histórico de Compras</h2>
          <p className="text-md font-light">
            Visualize todas as suas transações
          </p>
          <UserPurchases />
        </>
      )}

      {currentView == "security" && (
        <>
          <h2 className="text-4xl">Histórico de Login</h2>
          <p className="text-md font-light">Monitore os acessos à sua conta</p>
        </>
      )}
    </div>
  );
};

export default ProfileInfos;
