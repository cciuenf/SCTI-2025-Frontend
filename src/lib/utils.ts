import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from 'jsonwebtoken';
import type { UserRefreshTokenJwtPayload } from "@/types/auth-interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertNumberToBRL(value: number) {
  return (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function getActivityRequirements(reqs: string) {
  const arr = reqs.trim().split(",").sort();
  return arr;
}

export function getUserParticipationPercentage(
  totalActivities: string,
  attendedActivities: string
) {
  const result = parseFloat(attendedActivities) / parseFloat(totalActivities);
  const rounded = (result * 100).toFixed(2)
  return `${rounded}%`;
}
export function isRefreshTokenExpired(token: string | null) {
  if (!token) return false;
  const user_info = jwt.decode(token) as UserRefreshTokenJwtPayload | null;
  const expiresAt = new Date(user_info?.exp ?? "");
  if (isNaN(expiresAt.getTime()) || expiresAt.getTime() <= new Date().getTime())
    return true;
}
