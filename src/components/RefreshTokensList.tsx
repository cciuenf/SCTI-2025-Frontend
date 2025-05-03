"use client"
import { useEffect, useState } from "react";
import CustomButton from "./button";
import { handleGetRefreshTokens } from "@/actions/auth-actions";
import { RefreshTokenI } from "@/types/auth-interfaces";

export default function RefreshTokenList() {
  const [tokens, setTokens] = useState<RefreshTokenI[]>([]);

  useEffect(() => {
    async function fetchTokens() {
      const refreshTokens = await handleGetRefreshTokens();
      setTokens(refreshTokens.data ?? []);
    }

    fetchTokens();
  }, []);

  const handleRemoveToken = (tokenToRemove: string) => {
    setTokens((prev) => prev.filter((t) => t.token_str !== tokenToRemove));
  };

  return (
    <>
      {tokens && tokens.map((item) => (
        <div key={item.token_str} className="flex flex-col items-center">
          <p className="max-w-lvw p-2 break-words">{item.token_str} em {item.CreatedAt}</p>
          <CustomButton token={item.token_str} onRemove={handleRemoveToken} />
        </div>
      ))}
    </>
  );
}
