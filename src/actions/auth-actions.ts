"use server";

import type {
  AuthCredentialsI,
  RefreshTokenI,
  UserAccessTokenJwtPayload,
} from "@/types/auth-interfaces";
import { fetchWrapper } from "@/lib/fetch";
import { FetchError } from "@/types/utility-classes";
import { getAuthTokens, setAuthTokens } from "@/lib/cookies";
import { headers } from "next/headers";
import {UAParser} from "ua-parser-js";
import jwt from "jsonwebtoken";
import { actionRequest } from "./_utils";
import type { LoginFormDataI, SignUpFormDataToSendI } from "@/schemas/auth-schema";

export async function handleLoginSubmit({ email, password }: LoginFormDataI) {
  const res = await actionRequest<LoginFormDataI, AuthCredentialsI>("/login", { 
    withAuth: false,
    method: "POST",
    body: { email, password },
  });
  if (res.success && res.data) await setAuthTokens(res.data.access_token, res.data.refresh_token);
  return res;
}

export async function handleSignUp({ name, last_name, email, password, is_uenf, uenf_semester }: SignUpFormDataToSendI) {
  const res = await actionRequest<SignUpFormDataToSendI, AuthCredentialsI>("/register", { 
    withAuth: false,
    method: "POST",
    body: { name, last_name, email, password, is_uenf, uenf_semester: parseInt(uenf_semester as string) },
  });
  if (res.success && res.data) await setAuthTokens(res.data.access_token, res.data.refresh_token);
  const is_verified = await handleIsVerified();
  return {success: res.success && typeof is_verified !== "string", data: null, message: res.message}
}

export async function handleLogout() {
  return await actionRequest<null, RefreshTokenI[]>("/logout", { method: "POST" });
}

export async function handleGetRefreshTokens() {
  return await actionRequest<null, RefreshTokenI[]>("/refresh-tokens");
}

export async function handleRevokeToken(token: string) {
  return await actionRequest<{ refresh_token: string }, null>("/revoke-refresh-token", { 
    method: "POST", 
    body: { refresh_token: token }
  });
}

export async function handleVerifyTokens() {
  return actionRequest<null, null>("secure-verify-tokens", { method: "POST", verify: false });
}

export async function handleIsVerified(): Promise<boolean | string> {
  const { accessToken } = await getAuthTokens();
  if (!accessToken) {
    console.error("Erro ao verificar autenticação");
    return "Error in authentication";
  }
  const userInfo = jwt.decode(
    accessToken as string
  ) as UserAccessTokenJwtPayload | null;
  if (!userInfo) {
    console.error("Erro na extração de dados do usuário");
    return "Error in retrive user info";
  }
  return userInfo.is_verified;
}

export async function handleVerifyToken(token: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  if (!accessToken || !refreshToken) {
    console.error("Erro na checagem de tokens");
    return { status: 401, msg: "Erro na checagem de tokens" };
  }

  try {
    await fetchWrapper("verify-account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ token: token }),
    });

    return { status: 200, msg: "Usuário verificado" };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      console.error("Erro ao verificar autenticação: ", error.message);
      return { status: error.status, message: error.message };
    } else {
      console.error("Erro ao verificar autenticação: ", error);
      return {
        status: 500,
        message: "Erro desconhecido ao verificar autenticação",
      };
    }
  }
}

export async function handleResendVerifyToken() {
  const { accessToken, refreshToken } = await getAuthTokens()

  if (!accessToken || !refreshToken) {
    console.error("Erro na checagem de tokens");
    return { status: 401, msg: "Erro na checagem de tokens" };
  }

  try {
    await fetchWrapper("resend-verification-code", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      }
    });

    return { status: 200, msg: "Código de verificação enviado novamente" };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      console.error("Erro ao enviar código de verificação: ", error.message);
      return { status: error.status, message: error.message };
    } else {
      console.error("Erro ao enviar código de verificação: ", error);
      return {
        status: 500,
        message: "Erro desconhecido ao re-enviar código ",
      };
    }
  }
}

export async function handleChangeName(name: string, last_name: string) {
  return await actionRequest<{name: string, last_name: string}, null>(
    "/change-name", 
    { 
      method: "POST",
      body: { name, last_name }
    }
  );
}

export async function handleForceReAuth() {
  return await actionRequest<{name: string, last_name: string}, null>("/force-reauth", 
    { 
      method: "POST",
      headers: {
        "X-Force-ReAuth": process.env.FORCE_REAUTH || ""
      }
    },
  );
}

export async function handleForgotPassword(email: string) {
  return await actionRequest<{email: string}, null>("/forgot-password", { 
    withAuth: false,
    method: "POST",
    body: { email }
  });
}


export async function handleChangePassword(password: string, token: string) {
  try {
    await fetchWrapper(`change-password?token=${token}`, {
      method: "POST",
      body: JSON.stringify({ new_password: password }),
    });

    return { status: 200, msg: "Senha alterada" };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      console.error("Erro ao alterar senha: ", error.message);
      return { status: error.status, message: error.message };
    } else {
      console.error("Erro ao alterar senha: ", error);
      return {
        status: 500,
        message: "Erro desconhecido ao alterar senha",
      };
    }
  }
}

export async function handleGetUserDeviceInfos() {
  const userAgent = (await headers()).get("user-agent");
  if (userAgent) {
    const parser = new UAParser(userAgent);
    const os = parser.getOS()
    const browser = parser.getBrowser()
    return { os: os.name || "Unknown", browser: browser.name || "Unknown" }
  }
  return { os: "Unknown", browser: "Unknown"}
}
