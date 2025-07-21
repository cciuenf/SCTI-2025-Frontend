import { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import jwt from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isSameMonth, isSameYear } from "date-fns";
import { ptBR } from "date-fns/locale";

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

export function formatEventDateRange(start_date: Date, end_date: Date) {
  const sameMonth = isSameMonth(start_date, end_date);
  const sameYear = isSameYear(start_date, end_date);
  if (sameMonth && sameYear)
    return `${format(start_date, "dd", { locale: ptBR })}-${format(end_date, "dd 'de' MMMM, yyyy", { locale: ptBR })}`;
  else 
    return `${format(start_date, "dd/MM/yyyy")} até ${format(end_date, "dd/MM/yyyy")}`;
}