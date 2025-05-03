"use client";

import { handleRevokeToken } from "@/actions/auth-actions";

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
    <button
      className="cursor-pointer bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold"
      onClick={handleClick}
    >
      Invalidar Token
    </button>
  );
}
