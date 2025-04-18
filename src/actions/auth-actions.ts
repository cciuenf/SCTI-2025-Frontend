"use server";

import { AuthCredentialsI } from "@/types/authI";
import { fetchWrapper } from "@/lib/fetch";
import { cookies } from "next/headers";
import { FetchError } from "@/types/utility-classes";
import { redirect } from "next/navigation";

export async function handleLoginSubmit(
  _previousState: string,
  formData: FormData
) {
  await new Promise((res) => setTimeout(res, 2000));
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
      console.error("Error ao realizar o login: ", err);
      return "Erro desconhecido ao realizar o login"; // Trocar depois por um toast ou algo similar.
    }
  }
  redirect("/dashboard");
}
