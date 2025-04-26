"use server";

import { AuthCredentialsI, RefreshTokenI } from "@/types/authI";
import { fetchWrapper } from "@/lib/fetch";
import { cookies } from "next/headers";
import { FetchError } from "@/types/utility-classes";
import { redirect } from "next/navigation";

export async function handleLoginSubmit(
  _previousState: string,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetchWrapper<AuthCredentialsI>("login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    //  await saveTokens(res.data.access_token, res.data.refresh_token);
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao realizar o login: ", err.message);
      return err.message; // Tratar esse e os outros similares depois em um toast ou algo similar.
    } else {
      console.error("Erro ao realizar o login: ", err);
      return "Erro desconhecido ao realizar o login";
    }
  }
  redirect("/dashboard");
}

export async function handleLoginSubmitNew({
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

    await saveTokens(res.data.data.access_token, res.data.data.refresh_token);
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao realizar o login: ", err.message);
      return err.message; // Tratar esse e os outros similares depois em um toast ou algo similar.
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

      await saveTokens(res.data.data.access_token, res.data.data.refresh_token);
    } catch (err: unknown) {
      if (err instanceof FetchError) {
        console.error("Erro ao realizar o login: ", err.message);
        return err.message; // Tratar esse e os outros similares depois em um toast ou algo similar.
      } else {
        console.error("Erro ao realizar o login: ", err);
        return "Erro desconhecido ao realizar o login";
      }
    }
    redirect("/dashboard");
}

export async function handleGetRefreshTokens(): Promise<{
  items: null | RefreshTokenI[];
  msg: string;
  headers: Headers | null;
}> {
  const cookieStore = cookies();
  try {
    const accessToken = (await cookieStore).get("access_token")?.value;
    const refreshToken = (await cookieStore).get("refresh_token")?.value;
    const res = await fetchWrapper<RefreshTokenI[]>("refresh-tokens", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return {
      items: res.data,
      msg: "Tokens resgatados com Sucesso!",
      headers: res.headers,
    };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return { items: null, msg: err.message, headers: err.headers };
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return {
        items: null,
        msg: "Erro desconhecido ao resgatar os tokens",
        headers: null,
      };
    }
  }
}

export async function handleRevokeToken(
  token: string
): Promise<{ items: null | RefreshTokenI[]; msg: string }> {
  const cookieStore = cookies();
  try {
    const accessToken = (await cookieStore).get("access_token")?.value;
    const refreshToken = (await cookieStore).get("refresh_token")?.value;
    const res = await fetchWrapper<RefreshTokenI[]>("revoke-refresh-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refresh_token: token }),
    });
    return { items: res.data, msg: "Tokens resgatados com Sucesso!" };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return { items: null, msg: err.message };
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return { items: null, msg: "Erro desconhecido ao resgatar os tokens" };
    }
  }
}

export async function handleVerifyTokens(): Promise<{
  status: number;
  msg: string;
}> {
  const cookieStore = cookies();
  try {
    const accessToken = (await cookieStore).get("access_token")?.value;
    const refreshToken = (await cookieStore).get("refresh_token")?.value;
    const res = await fetchWrapper("verify-tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { status: res.status, msg: "Você está autenticado!" };
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao verificar autenticação: ", err.message);
      return { status: err.status, msg: err.message };
    } else {
      console.error("Erro ao verificar autenticação: ", err);
      return {
        status: 500,
        msg: "Erro desconhecido ao verificar autenticação",
      };
    }
  }
}

export async function saveTokens(
  access_token: string | null,
  refresh_token: string | null
) {
  const cookieStore = cookies();
  if (access_token) {
    (await cookieStore).set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 5 * 0.98, // 5 Minutos com uma margem de erro
    });
  }
  if (refresh_token) {
    (await cookieStore).set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1.98, // 2 Dias com uma margem de erro
    });
  }
}
