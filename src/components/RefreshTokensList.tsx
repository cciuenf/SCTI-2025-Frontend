"use client"
import { useState } from "react";
import CustomButton from "./button";
import { RefreshTokenI } from "@/types/authI";


interface Props {
  tokens: RefreshTokenI[];
}

export default function RefreshTokenList({ tokens: initialTokens }: Props) {
  const [tokens, setTokens] = useState(initialTokens);

  const handleRemoveToken = (tokenToRemove: string) => {
    setTokens((prev) => prev.filter((t) => t.token_str !== tokenToRemove));
  };

  return (
    <>
      {tokens.map((item) => (
        <div key={item.token_str} className="flex flex-col items-center">
          <p className="max-w-lvw p-2 break-words">{item.token_str} em {item.CreatedAt}</p>
          <CustomButton token={item.token_str} onRemove={handleRemoveToken} />
        </div>
      ))}
    </>
  );
}
