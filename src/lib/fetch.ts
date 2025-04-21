import { FetchError } from "@/types/utility-classes";
import { FetchResponse } from "@/types/utilityI";

export async function fetchWrapper<T = unknown>(input: string, init?: RequestInit): Promise<FetchResponse<T>> {

  const baseUrl = process.env.API_BASE_URL?.replace("//+$/", "");
  const path = input.replace(/^\/+/, "");
  const url = `${baseUrl}/${path}`;

  try {
    const res = await fetch(url, init);
    // console.log(res.headers.get("X-New-Refresh-Token"))
    if (!res.ok) {
      const errorText = await res.text();
      throw new FetchError(`Erro ${res.status}: ${errorText}`, res.status, res.headers);
    }

    const data = (await res.json()) as T;
    return { data: data, headers: res.headers, status: res.status };
  } catch (err) {
    console.error("Erro desconhecido ao realizar a consulta: ", err);
    throw err;
  }
}
