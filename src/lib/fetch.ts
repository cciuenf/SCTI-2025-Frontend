"use server";

import { FetchError } from "@/types/utility-classes";
import { ErrorResponseI, FetchResponse, SuccessResponse } from "@/types/utility-interfaces";
import { setAuthTokens } from "./cookies";

export async function fetchWrapper<T = unknown>(input: string, 
  init?: RequestInit): Promise<FetchResponse<T>> 
{
  const baseUrl = process.env.API_BASE_URL?.replace("//+$/", "");

  const path = input.replace(/^\/+/, "");
  const url = `${baseUrl}/${path}`;

  try {
    const res = await fetch(url, init);
    const access_token = res.headers.get("X-New-Access-Token");
    const refresh_token = res.headers.get("X-New-Refresh-Token");

    setAuthTokens(access_token, refresh_token);
    
    const result = (await res.json()) as SuccessResponse<T> | ErrorResponseI
    if(!res.ok || !result.success) {
      const errorMessage = result.success === false 
        ? result.errors.join(', ') 
        : "Ocorreu um erro na requisição, verifique seus dados!";
      throw new FetchError(errorMessage, res.status, !result.success ? result : null);
    }
    return {result: result, status: res.status};
  } catch (err) {
    // console.error("Erro desconhecido ao realizar a requisição: ", err);
    throw err;
  }
}