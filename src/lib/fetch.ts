import { FetchError } from "@/types/utility-classes";

export async function fetchWrapper<T = unknown>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const baseUrl = process.env.API_BASE_URL?.replace("//+$/", "");
  const path = input.replace(/^\/+/, "");
  const url = `${baseUrl}/${path}`;

  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const errorText = await res.text();
      throw new FetchError(`Erro ${res.status}: ${errorText}`, res.status);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error("Erro desconhecido ao realizar a consulta: ", err);
    throw err;
  }
}
