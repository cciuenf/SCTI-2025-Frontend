"use server";

import {
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

    await setAuthTokens(
      res.result.data.access_token,
      res.result.data.refresh_token
    );
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      return err.message, err.status;
    } else {
      console.error("Erro ao realizar o login: ", err);
      return "Erro desconhecido ao realizar o login";
    }
  }
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
      body: JSON.stringify({
        name: name,
        last_name: last_name,
        email: email,
        password: password,
      }),
    });

    await setAuthTokens(
      res.result.data.access_token,
      res.result.data.refresh_token
    );
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao realizar o login: ", err.message);
      return err.message;
    } else {
      console.error("Erro ao realizar o login: ", err);
      return "Erro desconhecido ao realizar o login";
    }
  }

  return await handleIsVerified();
}

export async function handleLogout() {
  try {
    const { accessToken, refreshToken } = await getAuthTokens();
    const res = await fetchWrapper<RefreshTokenI[]>("logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return {
      success: true,
      data: res.result.data,
      message: res.result.message,
    };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return { success: false, data: [], message: err.message };
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return {
        success: false,
        data: [],
        message: "Erro desconhecido ao resgatar os tokens",
      };
    }
  }
}

export async function handleGetRefreshTokens() {
  try {
    const { accessToken, refreshToken } = await getAuthTokens();
    const res = await fetchWrapper<RefreshTokenI[]>("refresh-tokens", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return {
      success: true,
      data: res.result.data,
      message: res.result.message,
    };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return { success: false, data: [], message: err.message };
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return {
        success: false,
        data: [],
        message: "Erro desconhecido ao resgatar os tokens",
      };
    }
  }
}

export async function handleRevokeToken(token: string) {
  try {
    const { accessToken, refreshToken } = await getAuthTokens();
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
      return {
        success: false,
        message: "Erro desconhecido ao resgatar os tokens",
      };
    }
  }
}

export async function handleVerifyTokens(): Promise<{
  status: number;
  message: string;
}> {
  try {
    const { accessToken, refreshToken } = await getAuthTokens();
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
      return {
        status: 500,
        message: "Erro desconhecido ao verificar autenticação",
      };
    }
  }
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
    const res = await fetchWrapper("verify-account", {
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
export async function handleChangeName(name: string, last_name: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  if (!accessToken || !refreshToken) {
    console.error("Erro na checagem de tokens");
    return { status: 401, msg: "Erro na checagem de tokens" };
  }

  try {
    const res = await fetchWrapper("change-name", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ name: name, last_name: last_name }),
    });
    return { status: 200, msg: "Nome alterado" };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      console.error("Erro ao alterar nome: ", error.message);
      return { status: error.status, message: error.message };
    } else {
      console.error("Erro ao alterar nome: ", error);
      return {
        status: 500,
        message: "Erro desconhecido ao alterar nome",
      };
    }
  }
}
export async function handleChangePassword(password: string) {
  const { accessToken, refreshToken } = await getAuthTokens();

  if (!accessToken || !refreshToken) {
    console.error("Erro na checagem de tokens");
    return { status: 401, msg: "Erro na checagem de tokens" };
  }

  try {
    const res = await fetchWrapper("change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ password: password }),
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
    return { status: 200, data: { os: os.name, browser: browser.name } }
  }

  return {status: 404, data: {}}
}
