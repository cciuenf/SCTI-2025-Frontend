import type { UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import jwt from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAccessTokenExpired(token: string | null) {
  if (!token) return false;
  const user_info = jwt.decode(token) as UserAccessTokenJwtPayload | null;
  const expiresAt = new Date(user_info?.exp ?? "");
  if (isNaN(expiresAt.getTime()) || expiresAt.getTime() <= new Date().getTime())
    return true;
}

export function convertNumberToBRL(value: number) {
  return (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatFullDate(dateString: string) {
  const formatted = format(dateString, "d MMM',' yyyy 'às' HH:mm", {
    locale: ptBR,
  });
  return formatted;
}

export function formatEventDateRange(start_date: Date, end_date: Date) {
  const sameDay = isSameDay(start_date, end_date);
  const sameMonth = isSameMonth(start_date, end_date);
  const sameYear = isSameYear(start_date, end_date);

  if (sameDay)
    return format(start_date, "dd 'de' MMMM, HH:mm", { locale: ptBR });
  if (sameMonth && sameYear)
    return `${format(start_date, "dd", { locale: ptBR })}-${format(
      end_date,
      "dd 'de' MMMM, yyyy",
      { locale: ptBR }
    )}`;
  return `${format(start_date, "dd/MM/yyyy")} até ${format(
    end_date,
    "dd/MM/yyyy"
  )}`;
}

export function formatEventTimeRange(start_date: Date, end_date: Date) {
  if (isSameDay(start_date, end_date))
    return `${format(start_date, "HH:mm")} - ${format(end_date, "HH:mm")}`;
  return "Horários em dias diferentes";
}

export function getActivityRequirements(reqs: string) {
  const arr = reqs.trim().split(",").sort();
  return arr;
}
