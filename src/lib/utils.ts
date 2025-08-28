import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from 'jsonwebtoken';
import type { UserRefreshTokenJwtPayload } from "@/types/auth-interfaces";
import { normalizeDate } from "./date-utils";

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
  const total = Number(totalActivities);
  const attended = Number(attendedActivities);

  if(!Number.isFinite(total) || total <= 0) return "0%";
  const percentage = (attended / total) * 100;
  return `${percentage.toFixed(2)}%`
}

export function isRefreshTokenExpired(token: string | null) {
  if (!token) return false;
  const user_info = jwt.decode(token) as UserRefreshTokenJwtPayload | null;
  let expiresAt: Date | null = null;

  if (user_info?.exp instanceof Date) {
    expiresAt = user_info.exp;
  } else if (typeof user_info?.exp === "string") {
    if (/^\d+$/.test(user_info.exp)) {
      expiresAt = new Date(parseInt(user_info.exp, 10) * 1000);
    } else {
      const d = new Date(user_info.exp);
      expiresAt = isNaN(d.getTime()) ? null : d;
    }
  }
  expiresAt = normalizeDate(expiresAt);

  if (!expiresAt || expiresAt.getTime() <= new Date().getTime()) return true;
}
