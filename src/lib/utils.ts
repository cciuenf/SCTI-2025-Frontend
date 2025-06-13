import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import jwt from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAccessTokenExpired(token: string | null) {
  if(!token) return false;
  const user_info = jwt.decode(token) as UserAccessTokenJwtPayload | null
  const expiresAt = new Date(user_info?.exp ?? "");
  if(isNaN(expiresAt.getTime()) || expiresAt.getTime() <= new Date().getTime()) return true;
}

export function convertNumberToBRL(value: number) {
  return (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}