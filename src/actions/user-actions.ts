"use server";

import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import type { UserBasicInfo } from "@/types/auth-interfaces";
import { FetchError } from "@/types/utility-classes";

export async function handleGetUsersInfo(data: {id_array: string[]}) {
  const { accessToken, refreshToken } = await getAuthTokens();
  try {
    const res = await fetchWrapper<UserBasicInfo[]>(`/users/batch`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Refresh: `Bearer ${refreshToken}`,
      },
    });
    return { success: true, data: res.result.data, message: res.result.message };
  } catch (error) {
    if (error instanceof FetchError) {
      console.error("Erro ao coletar as informações dos usuários", error.message);
      return { success: false, data: null, message: `Erro ao coletar as informações dos usuários: ${error.message}`, };
    } else {
      console.error("Erro desconhecido ao coletar as informações dos usuários", error);
      return { success: false, data: null, message: "Erro desconhecido ao coletar as informações dos usuários" };
    }
  }
}