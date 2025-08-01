"use client";
import React from "react";
import { Button } from "../ui/button";
import { MailCheckIcon, LogOut, PenIcon, Monitor } from "lucide-react";

import ProductListSection from "../Products/ProductListSection";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import { handleGetRefreshTokens, handleLogout } from "@/actions/auth-actions";
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
import UserLogins from "./UserLogins";
import ChangePasswordModal from "./ChangePasswordModal";

type Props = {
  currentView: string;
  user_access_info: UserAccessTokenJwtPayload | null;
  user_refresh_info: UserRefreshTokenJwtPayload | null;
  deviceInfos:
    | { os: string | undefined; browser: string | undefined }
    | { os: undefined; browser: undefined };
};

const ProfileInfos = ({
  currentView,
  user_access_info,
  user_refresh_info,
  deviceInfos,
}: Props) => {
  const [mustShowVerify, setMustShowVerify] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessTokenData, setAccessTokenData] =
    useState<UserAccessTokenJwtPayload | null>();

  const router = useRouter();

  if (user_access_info && !accessTokenData) {
    setAccessTokenData(user_access_info);
    return;
  }

  if (!user_access_info || !accessTokenData) {
    router.push("/");
    toast.info("Área destinada somente para usuários logados!");
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
    <div className="w-full md:w-4/5 flex flex-col items-center justify-around gap-3 mx-auto">
      {(currentView == "infos" || currentView == undefined) && (
        <>
          <h2 className="text-2xl md:text-3xl">Informações do Usuário</h2>
          <p className="font-light text-sm md:text-base md:mb-4">
            Gerencie aqui as informações do seu perfil!
          </p>
          <div className="w-full flex flex-col justify-around items-center md:flex-row md:justify-between md:items-start">
            <div className="mt-3 w-full md:mt-0 md:w-1/3 flex flex-col gap-3 items-center md:items-start justify-between">
              <h2 className="text-base md:text-xl lg:text-2xl font-normal">
                {`${accessTokenData.name}  ${accessTokenData.last_name}`}
              </h2>
              <h2 className="text-base md:text-xl lg:text-2xl font-normal">
                {accessTokenData.email}
              </h2>
              {!accessTokenData.is_verified && (
                <Dialog>
                  <Button variant={"profile"} className="w-3/5 sm:w-4/5 lg:w-3/5" asChild>
                    <DialogTrigger>
                      <MailCheckIcon className="w-3 h-3 md:w-4 md:h-4"/>
                      <p className="text-sm md:text-base">Verificar conta</p>
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
            <div className="w-full my-3 md:my-0 md:w-2/5 lg:w-1/3 flex flex-col gap-3 items-center md:items-end">
              <div className="flex flex-col gap-2 items-center md:items-end justify-around">
                <h2 className="text-xl md:text-xl lg:text-2xl">
                  Informações de Login
                </h2>
                <h3>{`${deviceInfos.os}, ${deviceInfos.browser}`}</h3>
                <h3>
                  {format(user_refresh_info!.last_used, "dd/MM/yyyy HH:mm")}
                </h3>
                <h3> {`IP: ${user_refresh_info?.ip_address} `}</h3>
              </div>
              <Button
                variant={"profile"}
                className="w-3/5 sm:w-4/5 lg:w-3/5"
                type="submit"
                onClick={() => handleLogoutSubmit()}
              >
                <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                <p className="text-sm md:text-base">Encerrar sessão</p>
              </Button>
              <ChangePasswordModal />
            </div>
          </div>
        </>
        // <UserDataView/>
      )}
      {currentView == "products" && (
        <>
          <h2 className="text-2xl md:text-3xl lg:text-4xl">Meus Produtos</h2>
          <p className="text-sm md:text-base font-light">
            Visualize todos os seus produtos
          </p>
          <ProductListSection
            currentEvent={{
              id: "eb5af25f-2368-4503-a160-5a117a771b5a",
              slug: "SCTI",
            }}
            isEventCreator={accessTokenData.is_event_creator}
          />
        </>
      )}

      {currentView == "shopping" && (
        <>
          <h2 className="text-2xl md:text-3xl lg:text-4xl">
            Histórico de Compras
          </h2>
          <p className="text-sm md:text-base font-light">
            Visualize todas as suas transações
          </p>
          <UserPurchases />
        </>
      )}

      {currentView == "security" && (
        <>
          <h2 className="text-2xl md:text-3xl lg:text-4xl">
            Histórico de Login
          </h2>
          <p className="text-sm md:text-base font-light">
            Monitore os acessos à sua conta
          </p>
          <UserLogins />
        </>
      )}
    </div>
  );
};

export default ProfileInfos;
