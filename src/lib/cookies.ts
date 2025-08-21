"use server";

import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import type { UserAccessTokenJwtPayload } from '@/types/auth-interfaces';

export async function setAuthTokens(access_token: string | null, refresh_token: string | null) {
  const cookieStore = cookies();
  if(access_token) {
    (await cookieStore).set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1.98, // 2 Dias com uma margem de erro
    });
  }
  if(refresh_token) {
    (await cookieStore).set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1.98, // 2 Dias com uma margem de erro
    });
  }
}

export async function getAuthTokens() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("access_token")?.value ?? null;
  const refreshToken = (await cookieStore).get("refresh_token")?.value ?? null;
  return { accessToken, refreshToken };
}

export async function clearAuthTokens() {
  const cookieStore = cookies();
  (await cookieStore).delete('access_token');
  (await cookieStore).delete('refresh_token');
}

export async function getUserInfo() {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value;
  const user_info = jwt.decode(
    access_token as string
  ) as UserAccessTokenJwtPayload | null;
  return user_info;
}

export async function isEventCreator() {
  const user_info = await getUserInfo();
  return user_info?.is_super || user_info?.is_event_creator || false;
}