"use client";
import { useState, useEffect } from "react";
import { UserRefreshTokenJwtPayload } from "@/types/auth-interfaces";
import { Loader2, Monitor } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import {
  handleGetRefreshTokens,
  handleRevokeToken,
} from "@/actions/auth-actions";
import jwt from "jsonwebtoken";
import { toast } from "sonner";

type Props = {};

const UserLogins = (props: Props) => {
  const [userLogins, setUserLogins] = useState<
    { token: string, payload: (UserRefreshTokenJwtPayload | null)}[] | undefined>();
  const [lastDeleted, setLastDeleted] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleRevokeClick = async (token: string) => {
    const res = await handleRevokeToken(token);
    if (res.success) {
      setLastDeleted(token)
      toast.info("Acesso revogado!")
      return
    }

    toast.error("Erro ao revogar acesso!")
  };

  useEffect(() => {
    setIsLoading(true)
    const getLogins = async () => {
      const refreshData = await handleGetRefreshTokens();
      const transformedData = refreshData.data.reverse().map((i) => {
        const payload = jwt.decode(i.token_str) as UserRefreshTokenJwtPayload | null;
        return ({token: i.token_str, payload})
      });

      setUserLogins(transformedData);
    };

    getLogins();
    setIsLoading(false)

  }, [lastDeleted]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10"/>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col justify-around items-center gap-2">
      {userLogins &&
        userLogins.map((r) => (
          <div
            className="w-9/10 sm:w-4/5 min-h-[100px] py-2 px-5 flex justify-between items-center border-2 border-secondary rounded-md gap-5 sm:gap-10"
            key={r?.token}
          >
            <div className="flex justify-between items-center gap-2 sm:gap-10">
              <div className="flex flex-col items-center justify-center rounded-full border-2 border-secondary p-3 shadow-2xs">
                <Monitor className="w-4 h-4 sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
              </div>
              <div className="flex flex-col justify-around items-start">
                <h2 className="text-base sm:text-xl lg:text-2xl">{r.payload?.user_agent}</h2>
                <p className="text-xs sm:text-base">{`${format(r.payload!.last_used, "dd/MM/yyyy HH:mm")} • IP: ${
                  r.payload?.ip_address
                }`}</p>
              </div>
            </div>
            <Button
              variant={"destructive"}
              className="border-2 border-zinc-900 rounded-sm text-xs sm:text-base px-2 py-1 sm:px-4 sm:py-2"
              onClick={() => handleRevokeClick(r?.token)}
            >
              Revogar
            </Button>
          </div>
        ))}
    </div>
  );
};

export default UserLogins;
