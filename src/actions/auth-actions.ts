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

    (await cookies()).set("access_token", res.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1, // 1 Hora
    });
    (await cookies()).set("refresh_token", res.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1, // 1 Hora
    });
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao realizar o login: ", err.message);
      return err.message; // Trocar depois por um toast ou algo similar.
    } else {
      console.error("Erro ao realizar o login: ", err);
      return "Erro desconhecido ao realizar o login"; // Trocar depois por um toast ou algo similar.
    }
  }
  redirect("/dashboard");
}

export async function handleGetRefreshTokens(): Promise<
  [items: null | RefreshTokenI[], msg: string]
> {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;
    const refreshToken = (await cookies()).get("refresh_token")?.value;
    const res = await fetchWrapper<RefreshTokenI[]>("refresh-tokens", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return [res, "Tokens resgatados com Sucesso!"];
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return [null, err.message];
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return [null, "Erro desconhecido ao resgatar os tokens"];
    }
  }
}

export async function handleRevokeToken(token: string): Promise<[items: null | RefreshTokenI[], msg: string]> {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;
    const refreshToken = (await cookies()).get("refresh_token")?.value;
    const res = await fetchWrapper<RefreshTokenI[]>("revoke-refresh-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refresh_token: token }),
    });
    return [res, "Tokens resgatados com Sucesso!"];
  } catch (err: unknown) {
    if (err instanceof FetchError) {
      console.error("Erro ao resgatar os tokens: ", err.message);
      return [null, err.message];
    } else {
      console.error("Erro ao resgatar os tokens: ", err);
      return [null, "Erro desconhecido ao resgatar os tokens"];
    }
  }
}
