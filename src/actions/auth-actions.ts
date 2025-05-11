"use server";

import { AuthCredentialsI, RefreshTokenI,UserAccessTokenJwtPayload } from "@/types/auth-interfaces";
import { fetchWrapper } from "@/lib/fetch";
import { FetchError } from "@/types/utility-classes";
import { redirect } from "next/navigation";
import { getAuthTokens, setAuthTokens } from "@/lib/cookies";
import jwt from "jsonwebtoken"

export async function handleLoginSubmit({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetchWrapper<AuthCredentialsI>("login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });

    await setAuthTokens(res.result.data.access_token, res.result.data.refresh_token);

  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao realizar o login: ", err.message);
      return err.message;
    } else {
      console.error("Erro ao realizar o login: ", err);
      return "Erro desconhecido ao realizar o login";
    }
  }
  redirect("/dashboard");
}

export async function handleSignUp({
  name,
  last_name,
  email,
  password,
}: {
  name: string;
  last_name: string;
  email: string;
  password: string;
  }) {
    try {
      const res = await fetchWrapper<AuthCredentialsI>("register", {
        method: "POST",
        body: JSON.stringify({ name: name, last_name: last_name, email: email, password: password }),
      });

      await setAuthTokens(res.result.data.access_token, res.result.data.refresh_token);
    } catch (err: unknown) {
      if (err instanceof FetchError) {
        console.error("Erro ao realizar o login: ", err.message);
        return err.message;
      } else {
        console.error("Erro ao realizar o login: ", err);
        return "Erro desconhecido ao realizar o login";
      }
    }

  return await handleIsVerified()
}

export async function handleGetRefreshTokens() {
  try {
    const { accessToken, refreshToken }  = await getAuthTokens();
    const res = await fetchWrapper<RefreshTokenI[]>("refresh-tokens", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return { success: false, data: [], message: err.message };
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return { success: false, data: [], message: "Erro desconhecido ao resgatar os tokens" };
    }
  }
}

export async function handleRevokeToken(token: string) {
  try {
    const { accessToken, refreshToken }  = await getAuthTokens();
    const res = await fetchWrapper("revoke-refresh-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refresh_token: token }),
    });
    return res.result;
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return { success: false, message: "Não foi possível remover o token" };
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return { success: false, message: "Erro desconhecido ao resgatar os tokens" };
    }
  }
}

export async function handleVerifyTokens(): Promise<{ status: number, message: string }> {
  try {
    const { accessToken, refreshToken }  = await getAuthTokens();
    const res = await fetchWrapper("verify-tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { status: res.status, message: "Você está autenticado!" };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao verificar autenticação: ", err.message);
      return { status: err.status, message: err.message };
    } else {
      console.error("Erro ao verificar autenticação: ", err);
      return { status: 500, message: "Erro desconhecido ao verificar autenticação" };
    }
  }
}

export async function handleIsVerified(): Promise<boolean | string> {
  const {accessToken} = await getAuthTokens()
  if (!accessToken) {
    console.error("Erro ao verificar autenticação");
    return "Error in authentication";
  }
  const userInfo = jwt.decode(accessToken as string) as UserAccessTokenJwtPayload | null
  if (!userInfo) {
    console.error("Erro na extração de dados do usuário");
    return "Error in retrive user info";
  }
  return userInfo.is_verified;
}

export async function handleVerifyToken(token: string) {
  const {accessToken, refreshToken} = await getAuthTokens()

  if (!accessToken || !refreshToken) {
    console.error("Erro na checagem de tokens")
    return "Erro na checagem de tokens";
  }
  console.log(token)

  try {
    const res = await fetchWrapper("verify-account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ token: token }),
    });

    redirect("/dashboard");


  } catch (error: unknown) {
    if (error instanceof FetchError) {
      console.error("Erro ao verificar autenticação: ", error.message);
      return { status: error.status, message: error.message };
    } else {
      console.error("Erro ao verificar autenticação: ", error);
      return { status: 500, message: "Erro desconhecido ao verificar autenticação" };
    }
  }
}
