"use client";

import { cn } from "@/lib/utils";
import type { UserAccessTokenJwtPayload, UserRefreshTokenJwtPayload } from "@/types/auth-interfaces";
import { Clock4, LogOut, Mail, MailCheck, MapPin, Shield, User } from "lucide-react";
import ChangeNameModalForm from "../ChangeNameModalForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VerifyForm from "@/components/VerifyForm";
import { format } from "date-fns-tz";
import ChangePasswordModal from "../ChangePasswordModal";
import { runWithToast } from "@/lib/client/run-with-toast";
import { handleLogout } from "@/actions/auth-actions";
import { clearAuthTokens } from "@/lib/cookies";

import { QRCodeCanvas } from "qrcode.react"

interface Props {
  user_access_info: UserAccessTokenJwtPayload | null
  user_refresh_info: UserRefreshTokenJwtPayload | null
  device_info: { os: string, browser: string }
}

export default function ProfileInfo({
  user_access_info,
  device_info,
  user_refresh_info
}: Props) {
  const router = useRouter();

  if (!user_access_info) {
    router.push("/");
    toast.info("Área destinada somente para usuários logados!");
    return;
  }

  const initials = `${user_access_info?.name?.[0] ?? ""}${user_access_info?.last_name?.[0] ?? ""}`.toUpperCase();

  const handleLogoutSubmit = async () => {
    const res = await runWithToast(
      handleLogout(),
      {
        loading: "Encerrando sessão...",
        success: () => "Sessão encerrada com sucesso!",
        error: () => "Erro ao encerrar sessão!",
      }
    );
    if(res.success) {
      await clearAuthTokens();
      router.push("/");
    }
  };

  return (
    <section className={cn(
      "flex flex-wrap justify-center max-h-full max-w-7xl",
      "overflow-y-auto scrollbar-unvisible",
      "px-2 sm:px-8 pt-4 pb-14 gap-8"
    )}>
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm min-w-[310px] flex-1 mx-1 sm:mx-2">
        <div className="flex items-center gap-4 bg-secondary rounded-t-2xl p-4">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center text-secondary font-semibold shadow-md">
            <span className="select-none">{initials || <User className="w-6 h-6"/>}</span>
          </div>

          <div className="text-white flex-1 min-w-0">
            <h4 className="font-medium text-md truncate">{user_access_info?.name} {user_access_info?.last_name}</h4>
            <span className="text-sm text-white/70 truncate block">{user_access_info?.email}</span>
          </div>
          <ChangeNameModalForm accessData={user_access_info}/>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            {!user_access_info.is_verified ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      "inline-flex items-center gap-2 text-sm rounded-full px-3 py-1 shadow-sm cursor-pointer",
                      "bg-accent/10 text-accent border border-accent/20",
                      "hover:scale-105 transform transition-transform duration-150",
                      "animate-pulse focus:outline-none focus:ring-2 focus:ring-accent/30"
                    )}
                    aria-label="Verificar conta"
                  >
                    <Mail className="w-4 h-4"/>
                    <strong className="text-xs">Verificar Conta</strong>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle title="Vericar e-mail"/>
                  <VerifyForm origin="profile" />
                </DialogContent>
              </Dialog>
            ) : (
              <span className="inline-flex items-center gap-2 bg-slate-50 text-sm rounded-full px-3 py-1 shadow-sm">
                <MailCheck className="w-4 h-4 text-green-500"/>
                <strong className="text-xs">Conta Verificada</strong>
              </span>
            )}

            <span className="inline-flex items-center gap-2 bg-slate-50 text-sm rounded-full px-3 py-1 shadow-sm">
              <Shield className="w-4 h-4"/> <strong className="text-xs">Autenticação</strong>
            </span>

            <span className="inline-flex items-center gap-2 bg-slate-50 text-sm rounded-full px-3 py-1 shadow-sm">
              <Clock4 className="w-4 h-4"/> <strong className="text-xs">Último: {user_refresh_info?.last_used ? format(user_refresh_info.last_used, "dd/MM/yyyy") : "—"}</strong>
            </span>
          </div>

          <div>
            <h5 className="text-sm font-medium mb-2">Sobre</h5>
            <p className="text-sm text-slate-600 min-h-[44px]">
              Este espaço destina-se a uma breve descrição do usuário, onde informações gerais sobre o perfil podem ser apresentadas de forma clara e objetiva.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500">Ações</div>
              <div className="font-medium">—</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500">Dispositivos</div>
              <div className="font-medium">{device_info?.os ?? "—"}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500">Navegador</div>
              <div className="font-medium">{device_info?.browser ?? "—"}</div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <h5 className="text-sm font-medium mb-2">QR-Code do Evento</h5>
            <QRCodeCanvas 
              value={user_access_info.id} 
              size={150}
              className="p-2 border border-accent rounded-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-[310px] bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 mx-1 mb-4">
        <div className="flex items-center gap-2 text-secondary font-medium">
          <Shield className="bg-indigo-100 p-2.5 w-10 h-10 rounded-full shadow-md"/>
          <span>Informações de Login</span>
        </div>

        <div className="flex justify-between bg-white shadow-sm p-4 rounded-lg mt-5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4"/> <span className="text-sm">Dispositivo</span>
          </div>
          <span className="text-secondary font-medium text-sm">
            {`${device_info.os}, ${device_info.browser}`}
          </span>
        </div>

        <div className="flex justify-between bg-white shadow-sm p-4 rounded-lg mt-5">
          <div className="flex items-center gap-2">
            <Clock4 className="w-4 h-4"/> <span className="text-sm">Último Acesso</span>
          </div>
          <span className="text-secondary font-medium text-sm">
            {user_refresh_info?.last_used ? format(user_refresh_info.last_used, "dd/MM/yyyy HH:mm") : "—"}
          </span>
        </div>

        <div className="flex justify-between bg-white shadow-sm p-4 rounded-lg mt-5 mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4"/> <span className="text-sm">Endereço IP</span>
          </div>
          <span className="text-secondary font-medium text-sm">{user_refresh_info?.ip_address ?? "—"}</span>
        </div>

        <ChangePasswordModal />

        <Button
          variant="profile"
          className="w-full h-10 rounded-md mt-4"
          type="submit"
          onClick={() => handleLogoutSubmit()}
        >
          <LogOut />
          <p className="text-sm">Encerrar sessão</p>
        </Button>
      </div>
    </section>
  )
}
