"use client";

import { handleRevokeToken } from "@/actions/auth-actions";
import { Button } from "./ui/button";

interface CustomButtonProps {
  token: string;
  onRemove: (token: string) => void;
}

export default function CustomButton( { token, onRemove }: CustomButtonProps) {
  const handleClick = async () => {
    const res = await handleRevokeToken(token);
    if(res.success) onRemove(token);
  }
  return (
    <Button onClick={handleClick}>Invalidar Token</Button>
  );
}
