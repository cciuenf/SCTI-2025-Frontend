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
      <>
      <Loader2 className="animate-spin w-10 h-10"/>
      </>
    )
  }

  return (
    <>
      {userLogins &&
        userLogins.map((r) => (
          <div
            className="w-3/4 h-[100px] py-2 px-5 flex justify-between items-center border-2 border-secondary rounded-md gap-10"
            key={r?.token}
          >
            <div className="flex justify-between items-center gap-10">
              <div className="flex flex-col items-center justify-center rounded-full border-2 border-secondary p-3 shadow-2xs">
                <Monitor className="w-12 h-12" />
              </div>
              <div className="flex flex-col justify-around items-start">
                <h2 className="text-2xl">{r.payload?.user_agent}</h2>
                <p>{`${format(r.payload!.last_used, "dd/MM/yyyy HH:mm")} • IP: ${
                  r.payload?.ip_address
                }`}</p>
              </div>
            </div>
            <Button
              variant={"destructive"}
              className="border-2 border-zinc-900 rounded-sm text-xl"
              onClick={() => handleRevokeClick(r?.token)}
            >
              Revogar
            </Button>
          </div>
        ))}
    </>
  );
};

export default UserLogins;
