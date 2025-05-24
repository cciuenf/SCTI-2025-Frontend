"use server";

import { getAuthTokens } from "@/lib/cookies";
import { fetchWrapper } from "@/lib/fetch";
import { ProductCredentialsI, ProductResponseI } from "@/types/product-interfaces";
import { FetchError } from "@/types/utility-classes";


export async function handleCreateProduct(data: ProductCredentialsI, slug: string) {
    const { accessToken, refreshToken } = await getAuthTokens();
    try {
      const res = await fetchWrapper<ProductResponseI>(`/events/${slug}/product`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Refresh: `Bearer ${refreshToken}`,
        },
      });
  
    } catch (error) {
      if (error instanceof FetchError) {
        console.error("Erro na criação do evento", error.message);
        return { status: error.status, success: false };
      } else {
        console.error("Erro na criação do evento", error);
        return { message: "Erro desconhecido", success: false };
      }
    }
  }
  